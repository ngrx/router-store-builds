import { ROUTER_NAVIGATION } from '@ngrx/router-store';
import { isObservable, of } from 'rxjs';
import { catchError, concatMap, filter, groupBy, map, mergeMap, switchMap, } from 'rxjs/operators';
/**
 * @description
 * Handles pessimistic updates (updating the server first).
 *
 * Updating the server, when implemented naively, suffers from race conditions and poor error handling.
 *
 * `pessimisticUpdate` addresses these problems. It runs all fetches in order, which removes race conditions
 * and forces the developer to handle errors.
 *
 * @usageNotes
 *
 * ```typescript
 * @Injectable()
 * class TodoEffects {
 *   updateTodo$ = createEffect(() =>
 *     this.actions$.pipe(
 *       ofType('UPDATE_TODO'),
 *       pessimisticUpdate({
 *         // provides an action
 *         run: (action: UpdateTodo) => {
 *           // update the backend first, and then dispatch an action that will
 *           // update the client side
 *           return this.backend.updateTodo(action.todo.id, action.todo).pipe(
 *             map((updated) => ({
 *               type: 'UPDATE_TODO_SUCCESS',
 *               todo: updated,
 *             }))
 *           );
 *         },
 *         onError: (action: UpdateTodo, error: any) => {
 *           // we don't need to undo the changes on the client side.
 *           // we can dispatch an error, or simply log the error here and return `null`
 *           return null;
 *         },
 *       })
 *     )
 *   );
 *
 *   constructor(private actions$: Actions, private backend: Backend) {}
 * }
 * ```
 *
 * Note that if you don't return a new action from the run callback, you must set the dispatch property
 * of the effect to false, like this:
 *
 * ```typescript
 * class TodoEffects {
 *   updateTodo$ = createEffect(() =>
 *     this.actions$.pipe(
 *       //...
 *     ), { dispatch: false }
 *   );
 * }
 * ```
 *
 * @param opts
 */
export function pessimisticUpdate(opts) {
    return (source) => {
        return source.pipe(mapActionAndState(), concatMap(runWithErrorHandling(opts.run, opts.onError)));
    };
}
/**
 *
 * @description
 *
 * Handles optimistic updates (updating the client first).
 *
 * It runs all fetches in order, which removes race conditions and forces the developer to handle errors.
 *
 * When using `optimisticUpdate`, in case of a failure, the developer has already updated the state locally,
 * so the developer must provide an undo action.
 *
 * The error handling must be done in the callback, or by means of the undo action.
 *
 * @usageNotes
 *
 * ```typescript
 * @Injectable()
 * class TodoEffects {
 *   updateTodo$ = createEffect(() =>
 *     this.actions$.pipe(
 *       ofType('UPDATE_TODO'),
 *       optimisticUpdate({
 *         // provides an action
 *         run: (action: UpdateTodo) => {
 *           return this.backend.updateTodo(action.todo.id, action.todo).pipe(
 *             mapTo({
 *               type: 'UPDATE_TODO_SUCCESS',
 *             })
 *           );
 *         },
 *         undoAction: (action: UpdateTodo, error: any) => {
 *           // dispatch an undo action to undo the changes in the client state
 *           return {
 *             type: 'UNDO_TODO_UPDATE',
 *             todo: action.todo,
 *           };
 *         },
 *       })
 *     )
 *   );
 *
 *   constructor(private actions$: Actions, private backend: Backend) {}
 * }
 * ```
 *
 * Note that if you don't return a new action from the run callback, you must set the dispatch property
 * of the effect to false, like this:
 *
 * ```typescript
 * class TodoEffects {
 *   updateTodo$ = createEffect(() =>
 *     this.actions$.pipe(
 *       //...
 *     ), { dispatch: false }
 *   );
 * }
 * ```
 *
 * @param opts
 */
export function optimisticUpdate(opts) {
    return (source) => {
        return source.pipe(mapActionAndState(), concatMap(runWithErrorHandling(opts.run, opts.undoAction)));
    };
}
/**
 *
 * @description
 *
 * Handles data fetching.
 *
 * Data fetching implemented naively suffers from race conditions and poor error handling.
 *
 * `fetch` addresses these problems. It runs all fetches in order, which removes race conditions
 * and forces the developer to handle errors.
 *
 * @usageNotes
 *
 * ```typescript
 * @Injectable()
 * class TodoEffects {
 *   loadTodos$ = createEffect(() =>
 *     this.actions$.pipe(
 *       ofType('GET_TODOS'),
 *       fetch({
 *         // provides an action
 *         run: (a: GetTodos) => {
 *           return this.backend.getAll().pipe(
 *             map((response) => ({
 *               type: 'TODOS',
 *               todos: response.todos,
 *             }))
 *           );
 *         },
 *         onError: (action: GetTodos, error: any) => {
 *           // dispatch an undo action to undo the changes in the client state
 *           return null;
 *         },
 *       })
 *     )
 *   );
 *
 *   constructor(private actions$: Actions, private backend: Backend) {}
 * }
 * ```
 *
 * This is correct, but because it set the concurrency to 1, it may not be performant.
 *
 * To fix that, you can provide the `id` function, like this:
 *
 * ```typescript
 * @Injectable()
 * class TodoEffects {
 *   loadTodo$ = createEffect(() =>
 *     this.actions$.pipe(
 *       ofType('GET_TODO'),
 *       fetch({
 *         id: (todo: GetTodo) => {
 *           return todo.id;
 *         },
 *         // provides an action
 *         run: (todo: GetTodo) => {
 *           return this.backend.getTodo(todo.id).map((response) => ({
 *             type: 'LOAD_TODO_SUCCESS',
 *             todo: response.todo,
 *           }));
 *         },
 *         onError: (action: GetTodo, error: any) => {
 *           // dispatch an undo action to undo the changes in the client state
 *           return null;
 *         },
 *       })
 *     )
 *   );
 *
 *   constructor(private actions$: Actions, private backend: Backend) {}
 * }
 * ```
 *
 * With this setup, the requests for Todo 1 will run concurrently with the requests for Todo 2.
 *
 * In addition, if there are multiple requests for Todo 1 scheduled, it will only run the last one.
 *
 * @param opts
 */
export function fetch(opts) {
    return (source) => {
        if (opts.id) {
            const groupedFetches = source.pipe(mapActionAndState(), groupBy(([action, ...store]) => {
                return opts.id(action, ...store);
            }));
            return groupedFetches.pipe(mergeMap((pairs) => pairs.pipe(switchMap(runWithErrorHandling(opts.run, opts.onError)))));
        }
        return source.pipe(mapActionAndState(), concatMap(runWithErrorHandling(opts.run, opts.onError)));
    };
}
/**
 * @description
 *
 * Handles data fetching as part of router navigation.
 *
 * Data fetching implemented naively suffers from race conditions and poor error handling.
 *
 * `navigation` addresses these problems.
 *
 * It checks if an activated router state contains the passed in component type, and, if it does, runs the `run`
 * callback. It provides the activated snapshot associated with the component and the current state. And it only runs
 * the last request.
 *
 * @usageNotes
 *
 * ```typescript
 * @Injectable()
 * class TodoEffects {
 *   loadTodo$ = createEffect(() =>
 *     this.actions$.pipe(
 *       // listens for the routerNavigation action from @ngrx/router-store
 *       navigation(TodoComponent, {
 *         run: (activatedRouteSnapshot: ActivatedRouteSnapshot) => {
 *           return this.backend
 *             .fetchTodo(activatedRouteSnapshot.params['id'])
 *             .pipe(
 *               map((todo) => ({
 *                 type: 'LOAD_TODO_SUCCESS',
 *                 todo: todo,
 *               }))
 *             );
 *         },
 *         onError: (
 *           activatedRouteSnapshot: ActivatedRouteSnapshot,
 *           error: any
 *         ) => {
 *           // we can log and error here and return null
 *           // we can also navigate back
 *           return null;
 *         },
 *       })
 *     )
 *   );
 *
 *   constructor(private actions$: Actions, private backend: Backend) {}
 * }
 * ```
 *
 * @param component
 * @param opts
 */
export function navigation(component, opts) {
    return (source) => {
        const nav = source.pipe(mapActionAndState(), filter(([action]) => isStateSnapshot(action)), map(([action, ...slices]) => {
            if (!isStateSnapshot(action)) {
                // Because of the above filter we'll never get here,
                // but this properly type narrows `action`
                // @ts-ignore
                return;
            }
            return [
                findSnapshot(component, action.payload.routerState.root),
                ...slices,
            ];
        }), filter(([snapshot]) => !!snapshot));
        return nav.pipe(switchMap(runWithErrorHandling(opts.run, opts.onError)));
    };
}
function isStateSnapshot(action) {
    return action.type === ROUTER_NAVIGATION;
}
function runWithErrorHandling(run, onError) {
    return ([action, ...slices]) => {
        try {
            const r = wrapIntoObservable(run(action, ...slices));
            return r.pipe(catchError((e) => wrapIntoObservable(onError(action, e))));
        }
        catch (e) {
            return wrapIntoObservable(onError(action, e));
        }
    };
}
/**
 * @whatItDoes maps Observable<Action | [Action, State]> to
 * Observable<[Action, State]>
 */
function mapActionAndState() {
    return (source) => {
        return source.pipe(map((value) => normalizeActionAndState(value)));
    };
}
/**
 * @whatItDoes Normalizes either a bare action or an array of action and slices
 * into an array of action and slices (or undefined)
 */
function normalizeActionAndState(args) {
    let action, slices;
    if (args instanceof Array) {
        [action, ...slices] = args;
    }
    else {
        slices = [];
        action = args;
    }
    return [action, ...slices];
}
function findSnapshot(component, s) {
    if (s.routeConfig && s.routeConfig.component === component) {
        return s;
    }
    for (const c of s.children) {
        const ss = findSnapshot(component, c);
        if (ss) {
            return ss;
        }
    }
    return null;
}
function wrapIntoObservable(obj) {
    if (isObservable(obj)) {
        return obj;
    }
    else if (!obj) {
        return of();
    }
    else {
        return of(obj);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3BlcmF0b3JzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9yb3V0ZXItc3RvcmUvZGF0YS1wZXJzaXN0ZW5jZS9zcmMvb3BlcmF0b3JzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU1BLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBR3ZELE9BQU8sRUFBRSxZQUFZLEVBQUUsRUFBRSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ3hDLE9BQU8sRUFDTCxVQUFVLEVBQ1YsU0FBUyxFQUNULE1BQU0sRUFDTixPQUFPLEVBQ1AsR0FBRyxFQUNILFFBQVEsRUFDUixTQUFTLEdBQ1YsTUFBTSxnQkFBZ0IsQ0FBQztBQXFDeEI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBd0RHO0FBQ0gsTUFBTSxVQUFVLGlCQUFpQixDQUMvQixJQUFpQztJQUVqQyxPQUFPLENBQUMsTUFBZ0MsRUFBc0IsRUFBRTtRQUM5RCxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQ2hCLGlCQUFpQixFQUFFLEVBQ25CLFNBQVMsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUN4RCxDQUFDO0lBQ0osQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTJERztBQUNILE1BQU0sVUFBVSxnQkFBZ0IsQ0FDOUIsSUFBZ0M7SUFFaEMsT0FBTyxDQUFDLE1BQWdDLEVBQXNCLEVBQUU7UUFDOUQsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUNoQixpQkFBaUIsRUFBRSxFQUNuQixTQUFTLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FD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U0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3RDLElBQUksRUFBRSxFQUFFO1lBQ04sT0FBTyxFQUFFLENBQUM7U0FDWDtLQUNGO0lBQ0QsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDO0FBRUQsU0FBUyxrQkFBa0IsQ0FBSSxHQUE2QjtJQUMxRCxJQUFJLFlBQVksQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUNyQixPQUFPLEdBQUcsQ0FBQztLQUNaO1NBQU0sSUFBSSxDQUFDLEdBQUcsRUFBRTtRQUNmLE9BQU8sRUFBRSxFQUFFLENBQUM7S0FDYjtTQUFNO1FBQ0wsT0FBTyxFQUFFLENBQUMsR0FBUSxDQUFDLENBQUM7S0FDckI7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBUeXBlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgdHlwZSB7XG4gIEFjdGl2YXRlZFJvdXRlU25hcHNob3QsXG4gIFJvdXRlclN0YXRlU25hcHNob3QsXG59IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgdHlwZSB7IFJvdXRlck5hdmlnYXRpb25BY3Rpb24gfSBmcm9tICdAbmdyeC9yb3V0ZXItc3RvcmUnO1xuaW1wb3J0IHsgUk9VVEVSX05BVklHQVRJT04gfSBmcm9tICdAbmdyeC9yb3V0ZXItc3RvcmUnO1xuaW1wb3J0IHR5cGUgeyBBY3Rpb24gfSBmcm9tICdAbmdyeC9zdG9yZSc7XG5pbXBvcnQgdHlwZSB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGlzT2JzZXJ2YWJsZSwgb2YgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7XG4gIGNhdGNoRXJyb3IsXG4gIGNvbmNhdE1hcCxcbiAgZmlsdGVyLFxuICBncm91cEJ5LFxuICBtYXAsXG4gIG1lcmdlTWFwLFxuICBzd2l0Y2hNYXAsXG59IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuZXhwb3J0IGludGVyZmFjZSBQZXNzaW1pc3RpY1VwZGF0ZU9wdHM8VCBleHRlbmRzIEFycmF5PHVua25vd24+LCBBPiB7XG4gIHJ1bihhOiBBLCAuLi5zbGljZXM6IFsuLi5UXSk6IE9ic2VydmFibGU8QWN0aW9uPiB8IEFjdGlvbiB8IHZvaWQ7XG4gIG9uRXJyb3IoYTogQSwgZTogYW55KTogT2JzZXJ2YWJsZTxhbnk+IHwgYW55O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE9wdGltaXN0aWNVcGRhdGVPcHRzPFQgZXh0ZW5kcyBBcnJheTx1bmtub3duPiwgQT4ge1xuICBydW4oYTogQSwgLi4uc2xpY2VzOiBbLi4uVF0pOiBPYnNlcnZhYmxlPEFjdGlvbj4gfCBBY3Rpb24gfCB2b2lkO1xuICB1bmRvQWN0aW9uKGE6IEEsIGU6IGFueSk6IE9ic2VydmFibGU8QWN0aW9uPiB8IEFjdGlvbjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBGZXRjaE9wdHM8VCBleHRlbmRzIEFycmF5PHVua25vd24+LCBBPiB7XG4gIGlkPyhhOiBBLCAuLi5zbGljZXM6IFsuLi5UXSk6IGFueTtcbiAgcnVuKGE6IEEsIC4uLnNsaWNlczogWy4uLlRdKTogT2JzZXJ2YWJsZTxBY3Rpb24+IHwgQWN0aW9uIHwgdm9pZDtcbiAgb25FcnJvcj8oYTogQSwgZTogYW55KTogT2JzZXJ2YWJsZTxhbnk+IHwgYW55O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEhhbmRsZU5hdmlnYXRpb25PcHRzPFQgZXh0ZW5kcyBBcnJheTx1bmtub3duPj4ge1xuICBydW4oXG4gICAgYTogQWN0aXZhdGVkUm91dGVTbmFwc2hvdCxcbiAgICAuLi5zbGljZXM6IFsuLi5UXVxuICApOiBPYnNlcnZhYmxlPEFjdGlvbj4gfCBBY3Rpb24gfCB2b2lkO1xuICBvbkVycm9yPyhhOiBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90LCBlOiBhbnkpOiBPYnNlcnZhYmxlPGFueT4gfCBhbnk7XG59XG5cbmV4cG9ydCB0eXBlIEFjdGlvbk9yQWN0aW9uV2l0aFN0YXRlczxUIGV4dGVuZHMgQXJyYXk8dW5rbm93bj4sIEE+ID1cbiAgfCBBXG4gIHwgW0EsIC4uLlRdO1xuZXhwb3J0IHR5cGUgQWN0aW9uT3JBY3Rpb25XaXRoU3RhdGU8VCwgQT4gPSBBY3Rpb25PckFjdGlvbldpdGhTdGF0ZXM8W1RdLCBBPjtcbmV4cG9ydCB0eXBlIEFjdGlvblN0YXRlc1N0cmVhbTxUIGV4dGVuZHMgQXJyYXk8dW5rbm93bj4sIEE+ID0gT2JzZXJ2YWJsZTxcbiAgQWN0aW9uT3JBY3Rpb25XaXRoU3RhdGVzPFQsIEE+XG4+O1xuZXhwb3J0IHR5cGUgQWN0aW9uU3RhdGVTdHJlYW08VCwgQT4gPSBPYnNlcnZhYmxlPFxuICBBY3Rpb25PckFjdGlvbldpdGhTdGF0ZXM8W1RdLCBBPlxuPjtcblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIEhhbmRsZXMgcGVzc2ltaXN0aWMgdXBkYXRlcyAodXBkYXRpbmcgdGhlIHNlcnZlciBmaXJzdCkuXG4gKlxuICogVXBkYXRpbmcgdGhlIHNlcnZlciwgd2hlbiBpbXBsZW1lbnRlZCBuYWl2ZWx5LCBzdWZmZXJzIGZyb20gcmFjZSBjb25kaXRpb25zIGFuZCBwb29yIGVycm9yIGhhbmRsaW5nLlxuICpcbiAqIGBwZXNzaW1pc3RpY1VwZGF0ZWAgYWRkcmVzc2VzIHRoZXNlIHByb2JsZW1zLiBJdCBydW5zIGFsbCBmZXRjaGVzIGluIG9yZGVyLCB3aGljaCByZW1vdmVzIHJhY2UgY29uZGl0aW9uc1xuICogYW5kIGZvcmNlcyB0aGUgZGV2ZWxvcGVyIHRvIGhhbmRsZSBlcnJvcnMuXG4gKlxuICogQHVzYWdlTm90ZXNcbiAqXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiBASW5qZWN0YWJsZSgpXG4gKiBjbGFzcyBUb2RvRWZmZWN0cyB7XG4gKiAgIHVwZGF0ZVRvZG8kID0gY3JlYXRlRWZmZWN0KCgpID0+XG4gKiAgICAgdGhpcy5hY3Rpb25zJC5waXBlKFxuICogICAgICAgb2ZUeXBlKCdVUERBVEVfVE9ETycpLFxuICogICAgICAgcGVzc2ltaXN0aWNVcGRhdGUoe1xuICogICAgICAgICAvLyBwcm92aWRlcyBhbiBhY3Rpb25cbiAqICAgICAgICAgcnVuOiAoYWN0aW9uOiBVcGRhdGVUb2RvKSA9PiB7XG4gKiAgICAgICAgICAgLy8gdXBkYXRlIHRoZSBiYWNrZW5kIGZpcnN0LCBhbmQgdGhlbiBkaXNwYXRjaCBhbiBhY3Rpb24gdGhhdCB3aWxsXG4gKiAgICAgICAgICAgLy8gdXBkYXRlIHRoZSBjbGllbnQgc2lkZVxuICogICAgICAgICAgIHJldHVybiB0aGlzLmJhY2tlbmQudXBkYXRlVG9kbyhhY3Rpb24udG9kby5pZCwgYWN0aW9uLnRvZG8pLnBpcGUoXG4gKiAgICAgICAgICAgICBtYXAoKHVwZGF0ZWQpID0+ICh7XG4gKiAgICAgICAgICAgICAgIHR5cGU6ICdVUERBVEVfVE9ET19TVUNDRVNTJyxcbiAqICAgICAgICAgICAgICAgdG9kbzogdXBkYXRlZCxcbiAqICAgICAgICAgICAgIH0pKVxuICogICAgICAgICAgICk7XG4gKiAgICAgICAgIH0sXG4gKiAgICAgICAgIG9uRXJyb3I6IChhY3Rpb246IFVwZGF0ZVRvZG8sIGVycm9yOiBhbnkpID0+IHtcbiAqICAgICAgICAgICAvLyB3ZSBkb24ndCBuZWVkIHRvIHVuZG8gdGhlIGNoYW5nZXMgb24gdGhlIGNsaWVudCBzaWRlLlxuICogICAgICAgICAgIC8vIHdlIGNhbiBkaXNwYXRjaCBhbiBlcnJvciwgb3Igc2ltcGx5IGxvZyB0aGUgZXJyb3IgaGVyZSBhbmQgcmV0dXJuIGBudWxsYFxuICogICAgICAgICAgIHJldHVybiBudWxsO1xuICogICAgICAgICB9LFxuICogICAgICAgfSlcbiAqICAgICApXG4gKiAgICk7XG4gKlxuICogICBjb25zdHJ1Y3Rvcihwcml2YXRlIGFjdGlvbnMkOiBBY3Rpb25zLCBwcml2YXRlIGJhY2tlbmQ6IEJhY2tlbmQpIHt9XG4gKiB9XG4gKiBgYGBcbiAqXG4gKiBOb3RlIHRoYXQgaWYgeW91IGRvbid0IHJldHVybiBhIG5ldyBhY3Rpb24gZnJvbSB0aGUgcnVuIGNhbGxiYWNrLCB5b3UgbXVzdCBzZXQgdGhlIGRpc3BhdGNoIHByb3BlcnR5XG4gKiBvZiB0aGUgZWZmZWN0IHRvIGZhbHNlLCBsaWtlIHRoaXM6XG4gKlxuICogYGBgdHlwZXNjcmlwdFxuICogY2xhc3MgVG9kb0VmZmVjdHMge1xuICogICB1cGRhdGVUb2RvJCA9IGNyZWF0ZUVmZmVjdCgoKSA9PlxuICogICAgIHRoaXMuYWN0aW9ucyQucGlwZShcbiAqICAgICAgIC8vLi4uXG4gKiAgICAgKSwgeyBkaXNwYXRjaDogZmFsc2UgfVxuICogICApO1xuICogfVxuICogYGBgXG4gKlxuICogQHBhcmFtIG9wdHNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBlc3NpbWlzdGljVXBkYXRlPFQgZXh0ZW5kcyBBcnJheTx1bmtub3duPiwgQSBleHRlbmRzIEFjdGlvbj4oXG4gIG9wdHM6IFBlc3NpbWlzdGljVXBkYXRlT3B0czxULCBBPlxuKSB7XG4gIHJldHVybiAoc291cmNlOiBBY3Rpb25TdGF0ZXNTdHJlYW08VCwgQT4pOiBPYnNlcnZhYmxlPEFjdGlvbj4gPT4ge1xuICAgIHJldHVybiBzb3VyY2UucGlwZShcbiAgICAgIG1hcEFjdGlvbkFuZFN0YXRlKCksXG4gICAgICBjb25jYXRNYXAocnVuV2l0aEVycm9ySGFuZGxpbmcob3B0cy5ydW4sIG9wdHMub25FcnJvcikpXG4gICAgKTtcbiAgfTtcbn1cblxuLyoqXG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKlxuICogSGFuZGxlcyBvcHRpbWlzdGljIHVwZGF0ZXMgKHVwZGF0aW5nIHRoZSBjbGllbnQgZmlyc3QpLlxuICpcbiAqIEl0IHJ1bnMgYWxsIGZldGNoZXMgaW4gb3JkZXIsIHdoaWNoIHJlbW92ZXMgcmFjZSBjb25kaXRpb25zIGFuZCBmb3JjZXMgdGhlIGRldmVsb3BlciB0byBoYW5kbGUgZXJyb3JzLlxuICpcbiAqIFdoZW4gdXNpbmcgYG9wdGltaXN0aWNVcGRhdGVgLCBpbiBjYXNlIG9mIGEgZmFpbHVyZSwgdGhlIGRldmVsb3BlciBoYXMgYWxyZWFkeSB1cGRhdGVkIHRoZSBzdGF0ZSBsb2NhbGx5LFxuICogc28gdGhlIGRldmVsb3BlciBtdXN0IHByb3ZpZGUgYW4gdW5kbyBhY3Rpb24uXG4gKlxuICogVGhlIGVycm9yIGhhbmRsaW5nIG11c3QgYmUgZG9uZSBpbiB0aGUgY2FsbGJhY2ssIG9yIGJ5IG1lYW5zIG9mIHRoZSB1bmRvIGFjdGlvbi5cbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICpcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIEBJbmplY3RhYmxlKClcbiAqIGNsYXNzIFRvZG9FZmZlY3RzIHtcbiAqICAgdXBkYXRlVG9kbyQgPSBjcmVhdGVFZmZlY3QoKCkgPT5cbiAqICAgICB0aGlzLmFjdGlvbnMkLnBpcGUoXG4gKiAgICAgICBvZlR5cGUoJ1VQREFURV9UT0RPJyksXG4gKiAgICAgICBvcHRpbWlzdGljVXBkYXRlKHtcbiAqICAgICAgICAgLy8gcHJvdmlkZXMgYW4gYWN0aW9uXG4gKiAgICAgICAgIHJ1bjogKGFjdGlvbjogVXBkYXRlVG9kbykgPT4ge1xuICogICAgICAgICAgIHJldHVybiB0aGlzLmJhY2tlbmQudXBkYXRlVG9kbyhhY3Rpb24udG9kby5pZCwgYWN0aW9uLnRvZG8pLnBpcGUoXG4gKiAgICAgICAgICAgICBtYXBUbyh7XG4gKiAgICAgICAgICAgICAgIHR5cGU6ICdVUERBVEVfVE9ET19TVUNDRVNTJyxcbiAqICAgICAgICAgICAgIH0pXG4gKiAgICAgICAgICAgKTtcbiAqICAgICAgICAgfSxcbiAqICAgICAgICAgdW5kb0FjdGlvbjogKGFjdGlvbjogVXBkYXRlVG9kbywgZXJyb3I6IGFueSkgPT4ge1xuICogICAgICAgICAgIC8vIGRpc3BhdGNoIGFuIHVuZG8gYWN0aW9uIHRvIHVuZG8gdGhlIGNoYW5nZXMgaW4gdGhlIGNsaWVudCBzdGF0ZVxuICogICAgICAgICAgIHJldHVybiB7XG4gKiAgICAgICAgICAgICB0eXBlOiAnVU5ET19UT0RPX1VQREFURScsXG4gKiAgICAgICAgICAgICB0b2RvOiBhY3Rpb24udG9kbyxcbiAqICAgICAgICAgICB9O1xuICogICAgICAgICB9LFxuICogICAgICAgfSlcbiAqICAgICApXG4gKiAgICk7XG4gKlxuICogICBjb25zdHJ1Y3Rvcihwcml2YXRlIGFjdGlvbnMkOiBBY3Rpb25zLCBwcml2YXRlIGJhY2tlbmQ6IEJhY2tlbmQpIHt9XG4gKiB9XG4gKiBgYGBcbiAqXG4gKiBOb3RlIHRoYXQgaWYgeW91IGRvbid0IHJldHVybiBhIG5ldyBhY3Rpb24gZnJvbSB0aGUgcnVuIGNhbGxiYWNrLCB5b3UgbXVzdCBzZXQgdGhlIGRpc3BhdGNoIHByb3BlcnR5XG4gKiBvZiB0aGUgZWZmZWN0IHRvIGZhbHNlLCBsaWtlIHRoaXM6XG4gKlxuICogYGBgdHlwZXNjcmlwdFxuICogY2xhc3MgVG9kb0VmZmVjdHMge1xuICogICB1cGRhdGVUb2RvJCA9IGNyZWF0ZUVmZmVjdCgoKSA9PlxuICogICAgIHRoaXMuYWN0aW9ucyQucGlwZShcbiAqICAgICAgIC8vLi4uXG4gKiAgICAgKSwgeyBkaXNwYXRjaDogZmFsc2UgfVxuICogICApO1xuICogfVxuICogYGBgXG4gKlxuICogQHBhcmFtIG9wdHNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG9wdGltaXN0aWNVcGRhdGU8VCBleHRlbmRzIEFycmF5PHVua25vd24+LCBBIGV4dGVuZHMgQWN0aW9uPihcbiAgb3B0czogT3B0aW1pc3RpY1VwZGF0ZU9wdHM8VCwgQT5cbikge1xuICByZXR1cm4gKHNvdXJjZTogQWN0aW9uU3RhdGVzU3RyZWFtPFQsIEE+KTogT2JzZXJ2YWJsZTxBY3Rpb24+ID0+IHtcbiAgICByZXR1cm4gc291cmNlLnBpcGUoXG4gICAgICBtYXBBY3Rpb25BbmRTdGF0ZSgpLFxuICAgICAgY29uY2F0TWFwKHJ1bldpdGhFcnJvckhhbmRsaW5nKG9wdHMucnVuLCBvcHRzLnVuZG9BY3Rpb24pKVxuICAgICk7XG4gIH07XG59XG5cbi8qKlxuICpcbiAqIEBkZXNjcmlwdGlvblxuICpcbiAqIEhhbmRsZXMgZGF0YSBmZXRjaGluZy5cbiAqXG4gKiBEYXRhIGZldGNoaW5nIGltcGxlbWVudGVkIG5haXZlbHkgc3VmZmVycyBmcm9tIHJhY2UgY29uZGl0aW9ucyBhbmQgcG9vciBlcnJvciBoYW5kbGluZy5cbiAqXG4gKiBgZmV0Y2hgIGFkZHJlc3NlcyB0aGVzZSBwcm9ibGVtcy4gSXQgcnVucyBhbGwgZmV0Y2hlcyBpbiBvcmRlciwgd2hpY2ggcmVtb3ZlcyByYWNlIGNvbmRpdGlvbnNcbiAqIGFuZCBmb3JjZXMgdGhlIGRldmVsb3BlciB0byBoYW5kbGUgZXJyb3JzLlxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKlxuICogYGBgdHlwZXNjcmlwdFxuICogQEluamVjdGFibGUoKVxuICogY2xhc3MgVG9kb0VmZmVjdHMge1xuICogICBsb2FkVG9kb3MkID0gY3JlYXRlRWZmZWN0KCgpID0+XG4gKiAgICAgdGhpcy5hY3Rpb25zJC5waXBlKFxuICogICAgICAgb2ZUeXBlKCdHRVRfVE9ET1MnKSxcbiAqICAgICAgIGZldGNoKHtcbiAqICAgICAgICAgLy8gcHJvdmlkZXMgYW4gYWN0aW9uXG4gKiAgICAgICAgIHJ1bjogKGE6IEdldFRvZG9zKSA9PiB7XG4gKiAgICAgICAgICAgcmV0dXJuIHRoaXMuYmFja2VuZC5nZXRBbGwoKS5waXBlKFxuICogICAgICAgICAgICAgbWFwKChyZXNwb25zZSkgPT4gKHtcbiAqICAgICAgICAgICAgICAgdHlwZTogJ1RPRE9TJyxcbiAqICAgICAgICAgICAgICAgdG9kb3M6IHJlc3BvbnNlLnRvZG9zLFxuICogICAgICAgICAgICAgfSkpXG4gKiAgICAgICAgICAgKTtcbiAqICAgICAgICAgfSxcbiAqICAgICAgICAgb25FcnJvcjogKGFjdGlvbjogR2V0VG9kb3MsIGVycm9yOiBhbnkpID0+IHtcbiAqICAgICAgICAgICAvLyBkaXNwYXRjaCBhbiB1bmRvIGFjdGlvbiB0byB1bmRvIHRoZSBjaGFuZ2VzIGluIHRoZSBjbGllbnQgc3RhdGVcbiAqICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAqICAgICAgICAgfSxcbiAqICAgICAgIH0pXG4gKiAgICAgKVxuICogICApO1xuICpcbiAqICAgY29uc3RydWN0b3IocHJpdmF0ZSBhY3Rpb25zJDogQWN0aW9ucywgcHJpdmF0ZSBiYWNrZW5kOiBCYWNrZW5kKSB7fVxuICogfVxuICogYGBgXG4gKlxuICogVGhpcyBpcyBjb3JyZWN0LCBidXQgYmVjYXVzZSBpdCBzZXQgdGhlIGNvbmN1cnJlbmN5IHRvIDEsIGl0IG1heSBub3QgYmUgcGVyZm9ybWFudC5cbiAqXG4gKiBUbyBmaXggdGhhdCwgeW91IGNhbiBwcm92aWRlIHRoZSBgaWRgIGZ1bmN0aW9uLCBsaWtlIHRoaXM6XG4gKlxuICogYGBgdHlwZXNjcmlwdFxuICogQEluamVjdGFibGUoKVxuICogY2xhc3MgVG9kb0VmZmVjdHMge1xuICogICBsb2FkVG9kbyQgPSBjcmVhdGVFZmZlY3QoKCkgPT5cbiAqICAgICB0aGlzLmFjdGlvbnMkLnBpcGUoXG4gKiAgICAgICBvZlR5cGUoJ0dFVF9UT0RPJyksXG4gKiAgICAgICBmZXRjaCh7XG4gKiAgICAgICAgIGlkOiAodG9kbzogR2V0VG9kbykgPT4ge1xuICogICAgICAgICAgIHJldHVybiB0b2RvLmlkO1xuICogICAgICAgICB9LFxuICogICAgICAgICAvLyBwcm92aWRlcyBhbiBhY3Rpb25cbiAqICAgICAgICAgcnVuOiAodG9kbzogR2V0VG9kbykgPT4ge1xuICogICAgICAgICAgIHJldHVybiB0aGlzLmJhY2tlbmQuZ2V0VG9kbyh0b2RvLmlkKS5tYXAoKHJlc3BvbnNlKSA9PiAoe1xuICogICAgICAgICAgICAgdHlwZTogJ0xPQURfVE9ET19TVUNDRVNTJyxcbiAqICAgICAgICAgICAgIHRvZG86IHJlc3BvbnNlLnRvZG8sXG4gKiAgICAgICAgICAgfSkpO1xuICogICAgICAgICB9LFxuICogICAgICAgICBvbkVycm9yOiAoYWN0aW9uOiBHZXRUb2RvLCBlcnJvcjogYW55KSA9PiB7XG4gKiAgICAgICAgICAgLy8gZGlzcGF0Y2ggYW4gdW5kbyBhY3Rpb24gdG8gdW5kbyB0aGUgY2hhbmdlcyBpbiB0aGUgY2xpZW50IHN0YXRlXG4gKiAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gKiAgICAgICAgIH0sXG4gKiAgICAgICB9KVxuICogICAgIClcbiAqICAgKTtcbiAqXG4gKiAgIGNvbnN0cnVjdG9yKHByaXZhdGUgYWN0aW9ucyQ6IEFjdGlvbnMsIHByaXZhdGUgYmFja2VuZDogQmFja2VuZCkge31cbiAqIH1cbiAqIGBgYFxuICpcbiAqIFdpdGggdGhpcyBzZXR1cCwgdGhlIHJlcXVlc3RzIGZvciBUb2RvIDEgd2lsbCBydW4gY29uY3VycmVudGx5IHdpdGggdGhlIHJlcXVlc3RzIGZvciBUb2RvIDIuXG4gKlxuICogSW4gYWRkaXRpb24sIGlmIHRoZXJlIGFyZSBtdWx0aXBsZSByZXF1ZXN0cyBmb3IgVG9kbyAxIHNjaGVkdWxlZCwgaXQgd2lsbCBvbmx5IHJ1biB0aGUgbGFzdCBvbmUuXG4gKlxuICogQHBhcmFtIG9wdHNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZldGNoPFQgZXh0ZW5kcyBBcnJheTx1bmtub3duPiwgQSBleHRlbmRzIEFjdGlvbj4oXG4gIG9wdHM6IEZldGNoT3B0czxULCBBPlxuKSB7XG4gIHJldHVybiAoc291cmNlOiBBY3Rpb25TdGF0ZXNTdHJlYW08VCwgQT4pOiBPYnNlcnZhYmxlPEFjdGlvbj4gPT4ge1xuICAgIGlmIChvcHRzLmlkKSB7XG4gICAgICBjb25zdCBncm91cGVkRmV0Y2hlcyA9IHNvdXJjZS5waXBlKFxuICAgICAgICBtYXBBY3Rpb25BbmRTdGF0ZSgpLFxuICAgICAgICBncm91cEJ5KChbYWN0aW9uLCAuLi5zdG9yZV0pID0+IHtcbiAgICAgICAgICByZXR1cm4gb3B0cy5pZChhY3Rpb24sIC4uLnN0b3JlKTtcbiAgICAgICAgfSlcbiAgICAgICk7XG5cbiAgICAgIHJldHVybiBncm91cGVkRmV0Y2hlcy5waXBlKFxuICAgICAgICBtZXJnZU1hcCgocGFpcnMpID0+XG4gICAgICAgICAgcGFpcnMucGlwZShzd2l0Y2hNYXAocnVuV2l0aEVycm9ySGFuZGxpbmcob3B0cy5ydW4sIG9wdHMub25FcnJvcikpKVxuICAgICAgICApXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiBzb3VyY2UucGlwZShcbiAgICAgIG1hcEFjdGlvbkFuZFN0YXRlKCksXG4gICAgICBjb25jYXRNYXAocnVuV2l0aEVycm9ySGFuZGxpbmcob3B0cy5ydW4sIG9wdHMub25FcnJvcikpXG4gICAgKTtcbiAgfTtcbn1cblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqXG4gKiBIYW5kbGVzIGRhdGEgZmV0Y2hpbmcgYXMgcGFydCBvZiByb3V0ZXIgbmF2aWdhdGlvbi5cbiAqXG4gKiBEYXRhIGZldGNoaW5nIGltcGxlbWVudGVkIG5haXZlbHkgc3VmZmVycyBmcm9tIHJhY2UgY29uZGl0aW9ucyBhbmQgcG9vciBlcnJvciBoYW5kbGluZy5cbiAqXG4gKiBgbmF2aWdhdGlvbmAgYWRkcmVzc2VzIHRoZXNlIHByb2JsZW1zLlxuICpcbiAqIEl0IGNoZWNrcyBpZiBhbiBhY3RpdmF0ZWQgcm91dGVyIHN0YXRlIGNvbnRhaW5zIHRoZSBwYXNzZWQgaW4gY29tcG9uZW50IHR5cGUsIGFuZCwgaWYgaXQgZG9lcywgcnVucyB0aGUgYHJ1bmBcbiAqIGNhbGxiYWNrLiBJdCBwcm92aWRlcyB0aGUgYWN0aXZhdGVkIHNuYXBzaG90IGFzc29jaWF0ZWQgd2l0aCB0aGUgY29tcG9uZW50IGFuZCB0aGUgY3VycmVudCBzdGF0ZS4gQW5kIGl0IG9ubHkgcnVuc1xuICogdGhlIGxhc3QgcmVxdWVzdC5cbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICpcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIEBJbmplY3RhYmxlKClcbiAqIGNsYXNzIFRvZG9FZmZlY3RzIHtcbiAqICAgbG9hZFRvZG8kID0gY3JlYXRlRWZmZWN0KCgpID0+XG4gKiAgICAgdGhpcy5hY3Rpb25zJC5waXBlKFxuICogICAgICAgLy8gbGlzdGVucyBmb3IgdGhlIHJvdXRlck5hdmlnYXRpb24gYWN0aW9uIGZyb20gQG5ncngvcm91dGVyLXN0b3JlXG4gKiAgICAgICBuYXZpZ2F0aW9uKFRvZG9Db21wb25lbnQsIHtcbiAqICAgICAgICAgcnVuOiAoYWN0aXZhdGVkUm91dGVTbmFwc2hvdDogQWN0aXZhdGVkUm91dGVTbmFwc2hvdCkgPT4ge1xuICogICAgICAgICAgIHJldHVybiB0aGlzLmJhY2tlbmRcbiAqICAgICAgICAgICAgIC5mZXRjaFRvZG8oYWN0aXZhdGVkUm91dGVTbmFwc2hvdC5wYXJhbXNbJ2lkJ10pXG4gKiAgICAgICAgICAgICAucGlwZShcbiAqICAgICAgICAgICAgICAgbWFwKCh0b2RvKSA9PiAoe1xuICogICAgICAgICAgICAgICAgIHR5cGU6ICdMT0FEX1RPRE9fU1VDQ0VTUycsXG4gKiAgICAgICAgICAgICAgICAgdG9kbzogdG9kbyxcbiAqICAgICAgICAgICAgICAgfSkpXG4gKiAgICAgICAgICAgICApO1xuICogICAgICAgICB9LFxuICogICAgICAgICBvbkVycm9yOiAoXG4gKiAgICAgICAgICAgYWN0aXZhdGVkUm91dGVTbmFwc2hvdDogQWN0aXZhdGVkUm91dGVTbmFwc2hvdCxcbiAqICAgICAgICAgICBlcnJvcjogYW55XG4gKiAgICAgICAgICkgPT4ge1xuICogICAgICAgICAgIC8vIHdlIGNhbiBsb2cgYW5kIGVycm9yIGhlcmUgYW5kIHJldHVybiBudWxsXG4gKiAgICAgICAgICAgLy8gd2UgY2FuIGFsc28gbmF2aWdhdGUgYmFja1xuICogICAgICAgICAgIHJldHVybiBudWxsO1xuICogICAgICAgICB9LFxuICogICAgICAgfSlcbiAqICAgICApXG4gKiAgICk7XG4gKlxuICogICBjb25zdHJ1Y3Rvcihwcml2YXRlIGFjdGlvbnMkOiBBY3Rpb25zLCBwcml2YXRlIGJhY2tlbmQ6IEJhY2tlbmQpIHt9XG4gKiB9XG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0gY29tcG9uZW50XG4gKiBAcGFyYW0gb3B0c1xuICovXG5leHBvcnQgZnVuY3Rpb24gbmF2aWdhdGlvbjxUIGV4dGVuZHMgQXJyYXk8dW5rbm93bj4sIEEgZXh0ZW5kcyBBY3Rpb24+KFxuICBjb21wb25lbnQ6IFR5cGU8YW55PixcbiAgb3B0czogSGFuZGxlTmF2aWdhdGlvbk9wdHM8VD5cbikge1xuICByZXR1cm4gKHNvdXJjZTogQWN0aW9uU3RhdGVzU3RyZWFtPFQsIEE+KSA9PiB7XG4gICAgY29uc3QgbmF2ID0gc291cmNlLnBpcGUoXG4gICAgICBtYXBBY3Rpb25BbmRTdGF0ZSgpLFxuICAgICAgZmlsdGVyKChbYWN0aW9uXSkgPT4gaXNTdGF0ZVNuYXBzaG90KGFjdGlvbikpLFxuICAgICAgbWFwKChbYWN0aW9uLCAuLi5zbGljZXNdKSA9PiB7XG4gICAgICAgIGlmICghaXNTdGF0ZVNuYXBzaG90KGFjdGlvbikpIHtcbiAgICAgICAgICAvLyBCZWNhdXNlIG9mIHRoZSBhYm92ZSBmaWx0ZXIgd2UnbGwgbmV2ZXIgZ2V0IGhlcmUsXG4gICAgICAgICAgLy8gYnV0IHRoaXMgcHJvcGVybHkgdHlwZSBuYXJyb3dzIGBhY3Rpb25gXG4gICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgZmluZFNuYXBzaG90KGNvbXBvbmVudCwgYWN0aW9uLnBheWxvYWQucm91dGVyU3RhdGUucm9vdCksXG4gICAgICAgICAgLi4uc2xpY2VzLFxuICAgICAgICBdIGFzIFtBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90LCAuLi5UXTtcbiAgICAgIH0pLFxuICAgICAgZmlsdGVyKChbc25hcHNob3RdKSA9PiAhIXNuYXBzaG90KVxuICAgICk7XG5cbiAgICByZXR1cm4gbmF2LnBpcGUoc3dpdGNoTWFwKHJ1bldpdGhFcnJvckhhbmRsaW5nKG9wdHMucnVuLCBvcHRzLm9uRXJyb3IpKSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGlzU3RhdGVTbmFwc2hvdChcbiAgYWN0aW9uOiBhbnlcbik6IGFjdGlvbiBpcyBSb3V0ZXJOYXZpZ2F0aW9uQWN0aW9uPFJvdXRlclN0YXRlU25hcHNob3Q+IHtcbiAgcmV0dXJuIGFjdGlvbi50eXBlID09PSBST1VURVJfTkFWSUdBVElPTjtcbn1cblxuZnVuY3Rpb24gcnVuV2l0aEVycm9ySGFuZGxpbmc8VCBleHRlbmRzIEFycmF5PHVua25vd24+LCBBLCBSPihcbiAgcnVuOiAoYTogQSwgLi4uc2xpY2VzOiBbLi4uVF0pID0+IE9ic2VydmFibGU8Uj4gfCBSIHwgdm9pZCxcbiAgb25FcnJvcjogYW55XG4pIHtcbiAgcmV0dXJuIChbYWN0aW9uLCAuLi5zbGljZXNdOiBbQSwgLi4uVF0pOiBPYnNlcnZhYmxlPFI+ID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgciA9IHdyYXBJbnRvT2JzZXJ2YWJsZShydW4oYWN0aW9uLCAuLi5zbGljZXMpKTtcbiAgICAgIHJldHVybiByLnBpcGUoY2F0Y2hFcnJvcigoZSkgPT4gd3JhcEludG9PYnNlcnZhYmxlKG9uRXJyb3IoYWN0aW9uLCBlKSkpKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gd3JhcEludG9PYnNlcnZhYmxlKG9uRXJyb3IoYWN0aW9uLCBlKSk7XG4gICAgfVxuICB9O1xufVxuXG4vKipcbiAqIEB3aGF0SXREb2VzIG1hcHMgT2JzZXJ2YWJsZTxBY3Rpb24gfCBbQWN0aW9uLCBTdGF0ZV0+IHRvXG4gKiBPYnNlcnZhYmxlPFtBY3Rpb24sIFN0YXRlXT5cbiAqL1xuZnVuY3Rpb24gbWFwQWN0aW9uQW5kU3RhdGU8VCBleHRlbmRzIEFycmF5PHVua25vd24+LCBBPigpIHtcbiAgcmV0dXJuIChzb3VyY2U6IE9ic2VydmFibGU8QWN0aW9uT3JBY3Rpb25XaXRoU3RhdGVzPFQsIEE+PikgPT4ge1xuICAgIHJldHVybiBzb3VyY2UucGlwZShcbiAgICAgIG1hcCgodmFsdWUpID0+IG5vcm1hbGl6ZUFjdGlvbkFuZFN0YXRlKHZhbHVlKSBhcyBbQSwgLi4uVF0pXG4gICAgKTtcbiAgfTtcbn1cblxuLyoqXG4gKiBAd2hhdEl0RG9lcyBOb3JtYWxpemVzIGVpdGhlciBhIGJhcmUgYWN0aW9uIG9yIGFuIGFycmF5IG9mIGFjdGlvbiBhbmQgc2xpY2VzXG4gKiBpbnRvIGFuIGFycmF5IG9mIGFjdGlvbiBhbmQgc2xpY2VzIChvciB1bmRlZmluZWQpXG4gKi9cbmZ1bmN0aW9uIG5vcm1hbGl6ZUFjdGlvbkFuZFN0YXRlPFQgZXh0ZW5kcyBBcnJheTx1bmtub3duPiwgQT4oXG4gIGFyZ3M6IEFjdGlvbk9yQWN0aW9uV2l0aFN0YXRlczxULCBBPlxuKTogW0EsIC4uLlRdIHtcbiAgbGV0IGFjdGlvbjogQSwgc2xpY2VzOiBUO1xuXG4gIGlmIChhcmdzIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICBbYWN0aW9uLCAuLi5zbGljZXNdID0gYXJncztcbiAgfSBlbHNlIHtcbiAgICBzbGljZXMgPSBbXSBhcyBUO1xuICAgIGFjdGlvbiA9IGFyZ3M7XG4gIH1cblxuICByZXR1cm4gW2FjdGlvbiwgLi4uc2xpY2VzXTtcbn1cblxuZnVuY3Rpb24gZmluZFNuYXBzaG90KFxuICBjb21wb25lbnQ6IFR5cGU8YW55PixcbiAgczogQWN0aXZhdGVkUm91dGVTbmFwc2hvdFxuKTogQWN0aXZhdGVkUm91dGVTbmFwc2hvdCB7XG4gIGlmIChzLnJvdXRlQ29uZmlnICYmIHMucm91dGVDb25maWcuY29tcG9uZW50ID09PSBjb21wb25lbnQpIHtcbiAgICByZXR1cm4gcztcbiAgfVxuICBmb3IgKGNvbnN0IGMgb2Ygcy5jaGlsZHJlbikge1xuICAgIGNvbnN0IHNzID0gZmluZFNuYXBzaG90KGNvbXBvbmVudCwgYyk7XG4gICAgaWYgKHNzKSB7XG4gICAgICByZXR1cm4gc3M7XG4gICAgfVxuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG5mdW5jdGlvbiB3cmFwSW50b09ic2VydmFibGU8Tz4ob2JqOiBPYnNlcnZhYmxlPE8+IHwgTyB8IHZvaWQpOiBPYnNlcnZhYmxlPE8+IHtcbiAgaWYgKGlzT2JzZXJ2YWJsZShvYmopKSB7XG4gICAgcmV0dXJuIG9iajtcbiAgfSBlbHNlIGlmICghb2JqKSB7XG4gICAgcmV0dXJuIG9mKCk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG9mKG9iaiBhcyBPKTtcbiAgfVxufVxuIl19