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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3BlcmF0b3JzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9yb3V0ZXItc3RvcmUvZGF0YS1wZXJzaXN0ZW5jZS9zcmMvb3BlcmF0b3JzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU1BLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBR3ZELE9BQU8sRUFBRSxZQUFZLEVBQUUsRUFBRSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ3hDLE9BQU8sRUFDTCxVQUFVLEVBQ1YsU0FBUyxFQUNULE1BQU0sRUFDTixPQUFPLEVBQ1AsR0FBRyxFQUNILFFBQVEsRUFDUixTQUFTLEdBQ1YsTUFBTSxnQkFBZ0IsQ0FBQztBQXFDeEI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBd0RHO0FBQ0gsTUFBTSxVQUFVLGlCQUFpQixDQUMvQixJQUFpQztJQUVqQyxPQUFPLENBQUMsTUFBZ0MsRUFBc0IsRUFBRTtRQUM5RCxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQ2hCLGlCQUFpQixFQUFFLEVBQ25CLFNBQVMsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUN4RCxDQUFDO0lBQ0osQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTJERztBQUNILE1BQU0sVUFBVSxnQkFBZ0IsQ0FDOUIsSUFBZ0M7SUFFaEMsT0FBTyxDQUFDLE1BQWdDLEVBQXNCLEVBQUU7UUFDOUQsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUNoQixpQkFBaUIsRUFBRSxFQUNuQixTQUFTLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FD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S0FBSyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDM0IsTUFBTSxFQUFFLEdBQUcsWUFBWSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN0QyxJQUFJLEVBQUUsRUFBRSxDQUFDO1lBQ1AsT0FBTyxFQUFFLENBQUM7UUFDWixDQUFDO0lBQ0gsQ0FBQztJQUNELE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQUVELFNBQVMsa0JBQWtCLENBQUksR0FBNkI7SUFDMUQsSUFBSSxZQUFZLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztRQUN0QixPQUFPLEdBQUcsQ0FBQztJQUNiLENBQUM7U0FBTSxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDaEIsT0FBTyxFQUFFLEVBQUUsQ0FBQztJQUNkLENBQUM7U0FBTSxDQUFDO1FBQ04sT0FBTyxFQUFFLENBQUMsR0FBUSxDQUFDLENBQUM7SUFDdEIsQ0FBQztBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IFR5cGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB0eXBlIHtcbiAgQWN0aXZhdGVkUm91dGVTbmFwc2hvdCxcbiAgUm91dGVyU3RhdGVTbmFwc2hvdCxcbn0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB0eXBlIHsgUm91dGVyTmF2aWdhdGlvbkFjdGlvbiB9IGZyb20gJ0BuZ3J4L3JvdXRlci1zdG9yZSc7XG5pbXBvcnQgeyBST1VURVJfTkFWSUdBVElPTiB9IGZyb20gJ0BuZ3J4L3JvdXRlci1zdG9yZSc7XG5pbXBvcnQgdHlwZSB7IEFjdGlvbiB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcbmltcG9ydCB0eXBlIHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgaXNPYnNlcnZhYmxlLCBvZiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtcbiAgY2F0Y2hFcnJvcixcbiAgY29uY2F0TWFwLFxuICBmaWx0ZXIsXG4gIGdyb3VwQnksXG4gIG1hcCxcbiAgbWVyZ2VNYXAsXG4gIHN3aXRjaE1hcCxcbn0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFBlc3NpbWlzdGljVXBkYXRlT3B0czxUIGV4dGVuZHMgQXJyYXk8dW5rbm93bj4sIEE+IHtcbiAgcnVuKGE6IEEsIC4uLnNsaWNlczogWy4uLlRdKTogT2JzZXJ2YWJsZTxBY3Rpb24+IHwgQWN0aW9uIHwgdm9pZDtcbiAgb25FcnJvcihhOiBBLCBlOiBhbnkpOiBPYnNlcnZhYmxlPGFueT4gfCBhbnk7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgT3B0aW1pc3RpY1VwZGF0ZU9wdHM8VCBleHRlbmRzIEFycmF5PHVua25vd24+LCBBPiB7XG4gIHJ1bihhOiBBLCAuLi5zbGljZXM6IFsuLi5UXSk6IE9ic2VydmFibGU8QWN0aW9uPiB8IEFjdGlvbiB8IHZvaWQ7XG4gIHVuZG9BY3Rpb24oYTogQSwgZTogYW55KTogT2JzZXJ2YWJsZTxBY3Rpb24+IHwgQWN0aW9uO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEZldGNoT3B0czxUIGV4dGVuZHMgQXJyYXk8dW5rbm93bj4sIEE+IHtcbiAgaWQ/KGE6IEEsIC4uLnNsaWNlczogWy4uLlRdKTogYW55O1xuICBydW4oYTogQSwgLi4uc2xpY2VzOiBbLi4uVF0pOiBPYnNlcnZhYmxlPEFjdGlvbj4gfCBBY3Rpb24gfCB2b2lkO1xuICBvbkVycm9yPyhhOiBBLCBlOiBhbnkpOiBPYnNlcnZhYmxlPGFueT4gfCBhbnk7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSGFuZGxlTmF2aWdhdGlvbk9wdHM8VCBleHRlbmRzIEFycmF5PHVua25vd24+PiB7XG4gIHJ1bihcbiAgICBhOiBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90LFxuICAgIC4uLnNsaWNlczogWy4uLlRdXG4gICk6IE9ic2VydmFibGU8QWN0aW9uPiB8IEFjdGlvbiB8IHZvaWQ7XG4gIG9uRXJyb3I/KGE6IEFjdGl2YXRlZFJvdXRlU25hcHNob3QsIGU6IGFueSk6IE9ic2VydmFibGU8YW55PiB8IGFueTtcbn1cblxuZXhwb3J0IHR5cGUgQWN0aW9uT3JBY3Rpb25XaXRoU3RhdGVzPFQgZXh0ZW5kcyBBcnJheTx1bmtub3duPiwgQT4gPVxuICB8IEFcbiAgfCBbQSwgLi4uVF07XG5leHBvcnQgdHlwZSBBY3Rpb25PckFjdGlvbldpdGhTdGF0ZTxULCBBPiA9IEFjdGlvbk9yQWN0aW9uV2l0aFN0YXRlczxbVF0sIEE+O1xuZXhwb3J0IHR5cGUgQWN0aW9uU3RhdGVzU3RyZWFtPFQgZXh0ZW5kcyBBcnJheTx1bmtub3duPiwgQT4gPSBPYnNlcnZhYmxlPFxuICBBY3Rpb25PckFjdGlvbldpdGhTdGF0ZXM8VCwgQT5cbj47XG5leHBvcnQgdHlwZSBBY3Rpb25TdGF0ZVN0cmVhbTxULCBBPiA9IE9ic2VydmFibGU8XG4gIEFjdGlvbk9yQWN0aW9uV2l0aFN0YXRlczxbVF0sIEE+XG4+O1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICogSGFuZGxlcyBwZXNzaW1pc3RpYyB1cGRhdGVzICh1cGRhdGluZyB0aGUgc2VydmVyIGZpcnN0KS5cbiAqXG4gKiBVcGRhdGluZyB0aGUgc2VydmVyLCB3aGVuIGltcGxlbWVudGVkIG5haXZlbHksIHN1ZmZlcnMgZnJvbSByYWNlIGNvbmRpdGlvbnMgYW5kIHBvb3IgZXJyb3IgaGFuZGxpbmcuXG4gKlxuICogYHBlc3NpbWlzdGljVXBkYXRlYCBhZGRyZXNzZXMgdGhlc2UgcHJvYmxlbXMuIEl0IHJ1bnMgYWxsIGZldGNoZXMgaW4gb3JkZXIsIHdoaWNoIHJlbW92ZXMgcmFjZSBjb25kaXRpb25zXG4gKiBhbmQgZm9yY2VzIHRoZSBkZXZlbG9wZXIgdG8gaGFuZGxlIGVycm9ycy5cbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICpcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIEBJbmplY3RhYmxlKClcbiAqIGNsYXNzIFRvZG9FZmZlY3RzIHtcbiAqICAgdXBkYXRlVG9kbyQgPSBjcmVhdGVFZmZlY3QoKCkgPT5cbiAqICAgICB0aGlzLmFjdGlvbnMkLnBpcGUoXG4gKiAgICAgICBvZlR5cGUoJ1VQREFURV9UT0RPJyksXG4gKiAgICAgICBwZXNzaW1pc3RpY1VwZGF0ZSh7XG4gKiAgICAgICAgIC8vIHByb3ZpZGVzIGFuIGFjdGlvblxuICogICAgICAgICBydW46IChhY3Rpb246IFVwZGF0ZVRvZG8pID0+IHtcbiAqICAgICAgICAgICAvLyB1cGRhdGUgdGhlIGJhY2tlbmQgZmlyc3QsIGFuZCB0aGVuIGRpc3BhdGNoIGFuIGFjdGlvbiB0aGF0IHdpbGxcbiAqICAgICAgICAgICAvLyB1cGRhdGUgdGhlIGNsaWVudCBzaWRlXG4gKiAgICAgICAgICAgcmV0dXJuIHRoaXMuYmFja2VuZC51cGRhdGVUb2RvKGFjdGlvbi50b2RvLmlkLCBhY3Rpb24udG9kbykucGlwZShcbiAqICAgICAgICAgICAgIG1hcCgodXBkYXRlZCkgPT4gKHtcbiAqICAgICAgICAgICAgICAgdHlwZTogJ1VQREFURV9UT0RPX1NVQ0NFU1MnLFxuICogICAgICAgICAgICAgICB0b2RvOiB1cGRhdGVkLFxuICogICAgICAgICAgICAgfSkpXG4gKiAgICAgICAgICAgKTtcbiAqICAgICAgICAgfSxcbiAqICAgICAgICAgb25FcnJvcjogKGFjdGlvbjogVXBkYXRlVG9kbywgZXJyb3I6IGFueSkgPT4ge1xuICogICAgICAgICAgIC8vIHdlIGRvbid0IG5lZWQgdG8gdW5kbyB0aGUgY2hhbmdlcyBvbiB0aGUgY2xpZW50IHNpZGUuXG4gKiAgICAgICAgICAgLy8gd2UgY2FuIGRpc3BhdGNoIGFuIGVycm9yLCBvciBzaW1wbHkgbG9nIHRoZSBlcnJvciBoZXJlIGFuZCByZXR1cm4gYG51bGxgXG4gKiAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gKiAgICAgICAgIH0sXG4gKiAgICAgICB9KVxuICogICAgIClcbiAqICAgKTtcbiAqXG4gKiAgIGNvbnN0cnVjdG9yKHByaXZhdGUgYWN0aW9ucyQ6IEFjdGlvbnMsIHByaXZhdGUgYmFja2VuZDogQmFja2VuZCkge31cbiAqIH1cbiAqIGBgYFxuICpcbiAqIE5vdGUgdGhhdCBpZiB5b3UgZG9uJ3QgcmV0dXJuIGEgbmV3IGFjdGlvbiBmcm9tIHRoZSBydW4gY2FsbGJhY2ssIHlvdSBtdXN0IHNldCB0aGUgZGlzcGF0Y2ggcHJvcGVydHlcbiAqIG9mIHRoZSBlZmZlY3QgdG8gZmFsc2UsIGxpa2UgdGhpczpcbiAqXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiBjbGFzcyBUb2RvRWZmZWN0cyB7XG4gKiAgIHVwZGF0ZVRvZG8kID0gY3JlYXRlRWZmZWN0KCgpID0+XG4gKiAgICAgdGhpcy5hY3Rpb25zJC5waXBlKFxuICogICAgICAgLy8uLi5cbiAqICAgICApLCB7IGRpc3BhdGNoOiBmYWxzZSB9XG4gKiAgICk7XG4gKiB9XG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0gb3B0c1xuICovXG5leHBvcnQgZnVuY3Rpb24gcGVzc2ltaXN0aWNVcGRhdGU8VCBleHRlbmRzIEFycmF5PHVua25vd24+LCBBIGV4dGVuZHMgQWN0aW9uPihcbiAgb3B0czogUGVzc2ltaXN0aWNVcGRhdGVPcHRzPFQsIEE+XG4pIHtcbiAgcmV0dXJuIChzb3VyY2U6IEFjdGlvblN0YXRlc1N0cmVhbTxULCBBPik6IE9ic2VydmFibGU8QWN0aW9uPiA9PiB7XG4gICAgcmV0dXJuIHNvdXJjZS5waXBlKFxuICAgICAgbWFwQWN0aW9uQW5kU3RhdGUoKSxcbiAgICAgIGNvbmNhdE1hcChydW5XaXRoRXJyb3JIYW5kbGluZyhvcHRzLnJ1biwgb3B0cy5vbkVycm9yKSlcbiAgICApO1xuICB9O1xufVxuXG4vKipcbiAqXG4gKiBAZGVzY3JpcHRpb25cbiAqXG4gKiBIYW5kbGVzIG9wdGltaXN0aWMgdXBkYXRlcyAodXBkYXRpbmcgdGhlIGNsaWVudCBmaXJzdCkuXG4gKlxuICogSXQgcnVucyBhbGwgZmV0Y2hlcyBpbiBvcmRlciwgd2hpY2ggcmVtb3ZlcyByYWNlIGNvbmRpdGlvbnMgYW5kIGZvcmNlcyB0aGUgZGV2ZWxvcGVyIHRvIGhhbmRsZSBlcnJvcnMuXG4gKlxuICogV2hlbiB1c2luZyBgb3B0aW1pc3RpY1VwZGF0ZWAsIGluIGNhc2Ugb2YgYSBmYWlsdXJlLCB0aGUgZGV2ZWxvcGVyIGhhcyBhbHJlYWR5IHVwZGF0ZWQgdGhlIHN0YXRlIGxvY2FsbHksXG4gKiBzbyB0aGUgZGV2ZWxvcGVyIG11c3QgcHJvdmlkZSBhbiB1bmRvIGFjdGlvbi5cbiAqXG4gKiBUaGUgZXJyb3IgaGFuZGxpbmcgbXVzdCBiZSBkb25lIGluIHRoZSBjYWxsYmFjaywgb3IgYnkgbWVhbnMgb2YgdGhlIHVuZG8gYWN0aW9uLlxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKlxuICogYGBgdHlwZXNjcmlwdFxuICogQEluamVjdGFibGUoKVxuICogY2xhc3MgVG9kb0VmZmVjdHMge1xuICogICB1cGRhdGVUb2RvJCA9IGNyZWF0ZUVmZmVjdCgoKSA9PlxuICogICAgIHRoaXMuYWN0aW9ucyQucGlwZShcbiAqICAgICAgIG9mVHlwZSgnVVBEQVRFX1RPRE8nKSxcbiAqICAgICAgIG9wdGltaXN0aWNVcGRhdGUoe1xuICogICAgICAgICAvLyBwcm92aWRlcyBhbiBhY3Rpb25cbiAqICAgICAgICAgcnVuOiAoYWN0aW9uOiBVcGRhdGVUb2RvKSA9PiB7XG4gKiAgICAgICAgICAgcmV0dXJuIHRoaXMuYmFja2VuZC51cGRhdGVUb2RvKGFjdGlvbi50b2RvLmlkLCBhY3Rpb24udG9kbykucGlwZShcbiAqICAgICAgICAgICAgIG1hcFRvKHtcbiAqICAgICAgICAgICAgICAgdHlwZTogJ1VQREFURV9UT0RPX1NVQ0NFU1MnLFxuICogICAgICAgICAgICAgfSlcbiAqICAgICAgICAgICApO1xuICogICAgICAgICB9LFxuICogICAgICAgICB1bmRvQWN0aW9uOiAoYWN0aW9uOiBVcGRhdGVUb2RvLCBlcnJvcjogYW55KSA9PiB7XG4gKiAgICAgICAgICAgLy8gZGlzcGF0Y2ggYW4gdW5kbyBhY3Rpb24gdG8gdW5kbyB0aGUgY2hhbmdlcyBpbiB0aGUgY2xpZW50IHN0YXRlXG4gKiAgICAgICAgICAgcmV0dXJuIHtcbiAqICAgICAgICAgICAgIHR5cGU6ICdVTkRPX1RPRE9fVVBEQVRFJyxcbiAqICAgICAgICAgICAgIHRvZG86IGFjdGlvbi50b2RvLFxuICogICAgICAgICAgIH07XG4gKiAgICAgICAgIH0sXG4gKiAgICAgICB9KVxuICogICAgIClcbiAqICAgKTtcbiAqXG4gKiAgIGNvbnN0cnVjdG9yKHByaXZhdGUgYWN0aW9ucyQ6IEFjdGlvbnMsIHByaXZhdGUgYmFja2VuZDogQmFja2VuZCkge31cbiAqIH1cbiAqIGBgYFxuICpcbiAqIE5vdGUgdGhhdCBpZiB5b3UgZG9uJ3QgcmV0dXJuIGEgbmV3IGFjdGlvbiBmcm9tIHRoZSBydW4gY2FsbGJhY2ssIHlvdSBtdXN0IHNldCB0aGUgZGlzcGF0Y2ggcHJvcGVydHlcbiAqIG9mIHRoZSBlZmZlY3QgdG8gZmFsc2UsIGxpa2UgdGhpczpcbiAqXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiBjbGFzcyBUb2RvRWZmZWN0cyB7XG4gKiAgIHVwZGF0ZVRvZG8kID0gY3JlYXRlRWZmZWN0KCgpID0+XG4gKiAgICAgdGhpcy5hY3Rpb25zJC5waXBlKFxuICogICAgICAgLy8uLi5cbiAqICAgICApLCB7IGRpc3BhdGNoOiBmYWxzZSB9XG4gKiAgICk7XG4gKiB9XG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0gb3B0c1xuICovXG5leHBvcnQgZnVuY3Rpb24gb3B0aW1pc3RpY1VwZGF0ZTxUIGV4dGVuZHMgQXJyYXk8dW5rbm93bj4sIEEgZXh0ZW5kcyBBY3Rpb24+KFxuICBvcHRzOiBPcHRpbWlzdGljVXBkYXRlT3B0czxULCBBPlxuKSB7XG4gIHJldHVybiAoc291cmNlOiBBY3Rpb25TdGF0ZXNTdHJlYW08VCwgQT4pOiBPYnNlcnZhYmxlPEFjdGlvbj4gPT4ge1xuICAgIHJldHVybiBzb3VyY2UucGlwZShcbiAgICAgIG1hcEFjdGlvbkFuZFN0YXRlKCksXG4gICAgICBjb25jYXRNYXAocnVuV2l0aEVycm9ySGFuZGxpbmcob3B0cy5ydW4sIG9wdHMudW5kb0FjdGlvbikpXG4gICAgKTtcbiAgfTtcbn1cblxuLyoqXG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKlxuICogSGFuZGxlcyBkYXRhIGZldGNoaW5nLlxuICpcbiAqIERhdGEgZmV0Y2hpbmcgaW1wbGVtZW50ZWQgbmFpdmVseSBzdWZmZXJzIGZyb20gcmFjZSBjb25kaXRpb25zIGFuZCBwb29yIGVycm9yIGhhbmRsaW5nLlxuICpcbiAqIGBmZXRjaGAgYWRkcmVzc2VzIHRoZXNlIHByb2JsZW1zLiBJdCBydW5zIGFsbCBmZXRjaGVzIGluIG9yZGVyLCB3aGljaCByZW1vdmVzIHJhY2UgY29uZGl0aW9uc1xuICogYW5kIGZvcmNlcyB0aGUgZGV2ZWxvcGVyIHRvIGhhbmRsZSBlcnJvcnMuXG4gKlxuICogQHVzYWdlTm90ZXNcbiAqXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiBASW5qZWN0YWJsZSgpXG4gKiBjbGFzcyBUb2RvRWZmZWN0cyB7XG4gKiAgIGxvYWRUb2RvcyQgPSBjcmVhdGVFZmZlY3QoKCkgPT5cbiAqICAgICB0aGlzLmFjdGlvbnMkLnBpcGUoXG4gKiAgICAgICBvZlR5cGUoJ0dFVF9UT0RPUycpLFxuICogICAgICAgZmV0Y2goe1xuICogICAgICAgICAvLyBwcm92aWRlcyBhbiBhY3Rpb25cbiAqICAgICAgICAgcnVuOiAoYTogR2V0VG9kb3MpID0+IHtcbiAqICAgICAgICAgICByZXR1cm4gdGhpcy5iYWNrZW5kLmdldEFsbCgpLnBpcGUoXG4gKiAgICAgICAgICAgICBtYXAoKHJlc3BvbnNlKSA9PiAoe1xuICogICAgICAgICAgICAgICB0eXBlOiAnVE9ET1MnLFxuICogICAgICAgICAgICAgICB0b2RvczogcmVzcG9uc2UudG9kb3MsXG4gKiAgICAgICAgICAgICB9KSlcbiAqICAgICAgICAgICApO1xuICogICAgICAgICB9LFxuICogICAgICAgICBvbkVycm9yOiAoYWN0aW9uOiBHZXRUb2RvcywgZXJyb3I6IGFueSkgPT4ge1xuICogICAgICAgICAgIC8vIGRpc3BhdGNoIGFuIHVuZG8gYWN0aW9uIHRvIHVuZG8gdGhlIGNoYW5nZXMgaW4gdGhlIGNsaWVudCBzdGF0ZVxuICogICAgICAgICAgIHJldHVybiBudWxsO1xuICogICAgICAgICB9LFxuICogICAgICAgfSlcbiAqICAgICApXG4gKiAgICk7XG4gKlxuICogICBjb25zdHJ1Y3Rvcihwcml2YXRlIGFjdGlvbnMkOiBBY3Rpb25zLCBwcml2YXRlIGJhY2tlbmQ6IEJhY2tlbmQpIHt9XG4gKiB9XG4gKiBgYGBcbiAqXG4gKiBUaGlzIGlzIGNvcnJlY3QsIGJ1dCBiZWNhdXNlIGl0IHNldCB0aGUgY29uY3VycmVuY3kgdG8gMSwgaXQgbWF5IG5vdCBiZSBwZXJmb3JtYW50LlxuICpcbiAqIFRvIGZpeCB0aGF0LCB5b3UgY2FuIHByb3ZpZGUgdGhlIGBpZGAgZnVuY3Rpb24sIGxpa2UgdGhpczpcbiAqXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiBASW5qZWN0YWJsZSgpXG4gKiBjbGFzcyBUb2RvRWZmZWN0cyB7XG4gKiAgIGxvYWRUb2RvJCA9IGNyZWF0ZUVmZmVjdCgoKSA9PlxuICogICAgIHRoaXMuYWN0aW9ucyQucGlwZShcbiAqICAgICAgIG9mVHlwZSgnR0VUX1RPRE8nKSxcbiAqICAgICAgIGZldGNoKHtcbiAqICAgICAgICAgaWQ6ICh0b2RvOiBHZXRUb2RvKSA9PiB7XG4gKiAgICAgICAgICAgcmV0dXJuIHRvZG8uaWQ7XG4gKiAgICAgICAgIH0sXG4gKiAgICAgICAgIC8vIHByb3ZpZGVzIGFuIGFjdGlvblxuICogICAgICAgICBydW46ICh0b2RvOiBHZXRUb2RvKSA9PiB7XG4gKiAgICAgICAgICAgcmV0dXJuIHRoaXMuYmFja2VuZC5nZXRUb2RvKHRvZG8uaWQpLm1hcCgocmVzcG9uc2UpID0+ICh7XG4gKiAgICAgICAgICAgICB0eXBlOiAnTE9BRF9UT0RPX1NVQ0NFU1MnLFxuICogICAgICAgICAgICAgdG9kbzogcmVzcG9uc2UudG9kbyxcbiAqICAgICAgICAgICB9KSk7XG4gKiAgICAgICAgIH0sXG4gKiAgICAgICAgIG9uRXJyb3I6IChhY3Rpb246IEdldFRvZG8sIGVycm9yOiBhbnkpID0+IHtcbiAqICAgICAgICAgICAvLyBkaXNwYXRjaCBhbiB1bmRvIGFjdGlvbiB0byB1bmRvIHRoZSBjaGFuZ2VzIGluIHRoZSBjbGllbnQgc3RhdGVcbiAqICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAqICAgICAgICAgfSxcbiAqICAgICAgIH0pXG4gKiAgICAgKVxuICogICApO1xuICpcbiAqICAgY29uc3RydWN0b3IocHJpdmF0ZSBhY3Rpb25zJDogQWN0aW9ucywgcHJpdmF0ZSBiYWNrZW5kOiBCYWNrZW5kKSB7fVxuICogfVxuICogYGBgXG4gKlxuICogV2l0aCB0aGlzIHNldHVwLCB0aGUgcmVxdWVzdHMgZm9yIFRvZG8gMSB3aWxsIHJ1biBjb25jdXJyZW50bHkgd2l0aCB0aGUgcmVxdWVzdHMgZm9yIFRvZG8gMi5cbiAqXG4gKiBJbiBhZGRpdGlvbiwgaWYgdGhlcmUgYXJlIG11bHRpcGxlIHJlcXVlc3RzIGZvciBUb2RvIDEgc2NoZWR1bGVkLCBpdCB3aWxsIG9ubHkgcnVuIHRoZSBsYXN0IG9uZS5cbiAqXG4gKiBAcGFyYW0gb3B0c1xuICovXG5leHBvcnQgZnVuY3Rpb24gZmV0Y2g8VCBleHRlbmRzIEFycmF5PHVua25vd24+LCBBIGV4dGVuZHMgQWN0aW9uPihcbiAgb3B0czogRmV0Y2hPcHRzPFQsIEE+XG4pIHtcbiAgcmV0dXJuIChzb3VyY2U6IEFjdGlvblN0YXRlc1N0cmVhbTxULCBBPik6IE9ic2VydmFibGU8QWN0aW9uPiA9PiB7XG4gICAgaWYgKG9wdHMuaWQpIHtcbiAgICAgIGNvbnN0IGdyb3VwZWRGZXRjaGVzID0gc291cmNlLnBpcGUoXG4gICAgICAgIG1hcEFjdGlvbkFuZFN0YXRlKCksXG4gICAgICAgIGdyb3VwQnkoKFthY3Rpb24sIC4uLnN0b3JlXSkgPT4ge1xuICAgICAgICAgIHJldHVybiBvcHRzLmlkKGFjdGlvbiwgLi4uc3RvcmUpO1xuICAgICAgICB9KVxuICAgICAgKTtcblxuICAgICAgcmV0dXJuIGdyb3VwZWRGZXRjaGVzLnBpcGUoXG4gICAgICAgIG1lcmdlTWFwKChwYWlycykgPT5cbiAgICAgICAgICBwYWlycy5waXBlKHN3aXRjaE1hcChydW5XaXRoRXJyb3JIYW5kbGluZyhvcHRzLnJ1biwgb3B0cy5vbkVycm9yKSkpXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHNvdXJjZS5waXBlKFxuICAgICAgbWFwQWN0aW9uQW5kU3RhdGUoKSxcbiAgICAgIGNvbmNhdE1hcChydW5XaXRoRXJyb3JIYW5kbGluZyhvcHRzLnJ1biwgb3B0cy5vbkVycm9yKSlcbiAgICApO1xuICB9O1xufVxuXG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICpcbiAqIEhhbmRsZXMgZGF0YSBmZXRjaGluZyBhcyBwYXJ0IG9mIHJvdXRlciBuYXZpZ2F0aW9uLlxuICpcbiAqIERhdGEgZmV0Y2hpbmcgaW1wbGVtZW50ZWQgbmFpdmVseSBzdWZmZXJzIGZyb20gcmFjZSBjb25kaXRpb25zIGFuZCBwb29yIGVycm9yIGhhbmRsaW5nLlxuICpcbiAqIGBuYXZpZ2F0aW9uYCBhZGRyZXNzZXMgdGhlc2UgcHJvYmxlbXMuXG4gKlxuICogSXQgY2hlY2tzIGlmIGFuIGFjdGl2YXRlZCByb3V0ZXIgc3RhdGUgY29udGFpbnMgdGhlIHBhc3NlZCBpbiBjb21wb25lbnQgdHlwZSwgYW5kLCBpZiBpdCBkb2VzLCBydW5zIHRoZSBgcnVuYFxuICogY2FsbGJhY2suIEl0IHByb3ZpZGVzIHRoZSBhY3RpdmF0ZWQgc25hcHNob3QgYXNzb2NpYXRlZCB3aXRoIHRoZSBjb21wb25lbnQgYW5kIHRoZSBjdXJyZW50IHN0YXRlLiBBbmQgaXQgb25seSBydW5zXG4gKiB0aGUgbGFzdCByZXF1ZXN0LlxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKlxuICogYGBgdHlwZXNjcmlwdFxuICogQEluamVjdGFibGUoKVxuICogY2xhc3MgVG9kb0VmZmVjdHMge1xuICogICBsb2FkVG9kbyQgPSBjcmVhdGVFZmZlY3QoKCkgPT5cbiAqICAgICB0aGlzLmFjdGlvbnMkLnBpcGUoXG4gKiAgICAgICAvLyBsaXN0ZW5zIGZvciB0aGUgcm91dGVyTmF2aWdhdGlvbiBhY3Rpb24gZnJvbSBAbmdyeC9yb3V0ZXItc3RvcmVcbiAqICAgICAgIG5hdmlnYXRpb24oVG9kb0NvbXBvbmVudCwge1xuICogICAgICAgICBydW46IChhY3RpdmF0ZWRSb3V0ZVNuYXBzaG90OiBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90KSA9PiB7XG4gKiAgICAgICAgICAgcmV0dXJuIHRoaXMuYmFja2VuZFxuICogICAgICAgICAgICAgLmZldGNoVG9kbyhhY3RpdmF0ZWRSb3V0ZVNuYXBzaG90LnBhcmFtc1snaWQnXSlcbiAqICAgICAgICAgICAgIC5waXBlKFxuICogICAgICAgICAgICAgICBtYXAoKHRvZG8pID0+ICh7XG4gKiAgICAgICAgICAgICAgICAgdHlwZTogJ0xPQURfVE9ET19TVUNDRVNTJyxcbiAqICAgICAgICAgICAgICAgICB0b2RvOiB0b2RvLFxuICogICAgICAgICAgICAgICB9KSlcbiAqICAgICAgICAgICAgICk7XG4gKiAgICAgICAgIH0sXG4gKiAgICAgICAgIG9uRXJyb3I6IChcbiAqICAgICAgICAgICBhY3RpdmF0ZWRSb3V0ZVNuYXBzaG90OiBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90LFxuICogICAgICAgICAgIGVycm9yOiBhbnlcbiAqICAgICAgICAgKSA9PiB7XG4gKiAgICAgICAgICAgLy8gd2UgY2FuIGxvZyBhbmQgZXJyb3IgaGVyZSBhbmQgcmV0dXJuIG51bGxcbiAqICAgICAgICAgICAvLyB3ZSBjYW4gYWxzbyBuYXZpZ2F0ZSBiYWNrXG4gKiAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gKiAgICAgICAgIH0sXG4gKiAgICAgICB9KVxuICogICAgIClcbiAqICAgKTtcbiAqXG4gKiAgIGNvbnN0cnVjdG9yKHByaXZhdGUgYWN0aW9ucyQ6IEFjdGlvbnMsIHByaXZhdGUgYmFja2VuZDogQmFja2VuZCkge31cbiAqIH1cbiAqIGBgYFxuICpcbiAqIEBwYXJhbSBjb21wb25lbnRcbiAqIEBwYXJhbSBvcHRzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBuYXZpZ2F0aW9uPFQgZXh0ZW5kcyBBcnJheTx1bmtub3duPiwgQSBleHRlbmRzIEFjdGlvbj4oXG4gIGNvbXBvbmVudDogVHlwZTxhbnk+LFxuICBvcHRzOiBIYW5kbGVOYXZpZ2F0aW9uT3B0czxUPlxuKSB7XG4gIHJldHVybiAoc291cmNlOiBBY3Rpb25TdGF0ZXNTdHJlYW08VCwgQT4pID0+IHtcbiAgICBjb25zdCBuYXYgPSBzb3VyY2UucGlwZShcbiAgICAgIG1hcEFjdGlvbkFuZFN0YXRlKCksXG4gICAgICBmaWx0ZXIoKFthY3Rpb25dKSA9PiBpc1N0YXRlU25hcHNob3QoYWN0aW9uKSksXG4gICAgICBtYXAoKFthY3Rpb24sIC4uLnNsaWNlc10pID0+IHtcbiAgICAgICAgaWYgKCFpc1N0YXRlU25hcHNob3QoYWN0aW9uKSkge1xuICAgICAgICAgIC8vIEJlY2F1c2Ugb2YgdGhlIGFib3ZlIGZpbHRlciB3ZSdsbCBuZXZlciBnZXQgaGVyZSxcbiAgICAgICAgICAvLyBidXQgdGhpcyBwcm9wZXJseSB0eXBlIG5hcnJvd3MgYGFjdGlvbmBcbiAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICBmaW5kU25hcHNob3QoY29tcG9uZW50LCBhY3Rpb24ucGF5bG9hZC5yb3V0ZXJTdGF0ZS5yb290KSxcbiAgICAgICAgICAuLi5zbGljZXMsXG4gICAgICAgIF0gYXMgW0FjdGl2YXRlZFJvdXRlU25hcHNob3QsIC4uLlRdO1xuICAgICAgfSksXG4gICAgICBmaWx0ZXIoKFtzbmFwc2hvdF0pID0+ICEhc25hcHNob3QpXG4gICAgKTtcblxuICAgIHJldHVybiBuYXYucGlwZShzd2l0Y2hNYXAocnVuV2l0aEVycm9ySGFuZGxpbmcob3B0cy5ydW4sIG9wdHMub25FcnJvcikpKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gaXNTdGF0ZVNuYXBzaG90KFxuICBhY3Rpb246IGFueVxuKTogYWN0aW9uIGlzIFJvdXRlck5hdmlnYXRpb25BY3Rpb248Um91dGVyU3RhdGVTbmFwc2hvdD4ge1xuICByZXR1cm4gYWN0aW9uLnR5cGUgPT09IFJPVVRFUl9OQVZJR0FUSU9OO1xufVxuXG5mdW5jdGlvbiBydW5XaXRoRXJyb3JIYW5kbGluZzxUIGV4dGVuZHMgQXJyYXk8dW5rbm93bj4sIEEsIFI+KFxuICBydW46IChhOiBBLCAuLi5zbGljZXM6IFsuLi5UXSkgPT4gT2JzZXJ2YWJsZTxSPiB8IFIgfCB2b2lkLFxuICBvbkVycm9yOiBhbnlcbikge1xuICByZXR1cm4gKFthY3Rpb24sIC4uLnNsaWNlc106IFtBLCAuLi5UXSk6IE9ic2VydmFibGU8Uj4gPT4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCByID0gd3JhcEludG9PYnNlcnZhYmxlKHJ1bihhY3Rpb24sIC4uLnNsaWNlcykpO1xuICAgICAgcmV0dXJuIHIucGlwZShjYXRjaEVycm9yKChlKSA9PiB3cmFwSW50b09ic2VydmFibGUob25FcnJvcihhY3Rpb24sIGUpKSkpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiB3cmFwSW50b09ic2VydmFibGUob25FcnJvcihhY3Rpb24sIGUpKTtcbiAgICB9XG4gIH07XG59XG5cbi8qKlxuICogQHdoYXRJdERvZXMgbWFwcyBPYnNlcnZhYmxlPEFjdGlvbiB8IFtBY3Rpb24sIFN0YXRlXT4gdG9cbiAqIE9ic2VydmFibGU8W0FjdGlvbiwgU3RhdGVdPlxuICovXG5mdW5jdGlvbiBtYXBBY3Rpb25BbmRTdGF0ZTxUIGV4dGVuZHMgQXJyYXk8dW5rbm93bj4sIEE+KCkge1xuICByZXR1cm4gKHNvdXJjZTogT2JzZXJ2YWJsZTxBY3Rpb25PckFjdGlvbldpdGhTdGF0ZXM8VCwgQT4+KSA9PiB7XG4gICAgcmV0dXJuIHNvdXJjZS5waXBlKFxuICAgICAgbWFwKCh2YWx1ZSkgPT4gbm9ybWFsaXplQWN0aW9uQW5kU3RhdGUodmFsdWUpIGFzIFtBLCAuLi5UXSlcbiAgICApO1xuICB9O1xufVxuXG4vKipcbiAqIEB3aGF0SXREb2VzIE5vcm1hbGl6ZXMgZWl0aGVyIGEgYmFyZSBhY3Rpb24gb3IgYW4gYXJyYXkgb2YgYWN0aW9uIGFuZCBzbGljZXNcbiAqIGludG8gYW4gYXJyYXkgb2YgYWN0aW9uIGFuZCBzbGljZXMgKG9yIHVuZGVmaW5lZClcbiAqL1xuZnVuY3Rpb24gbm9ybWFsaXplQWN0aW9uQW5kU3RhdGU8VCBleHRlbmRzIEFycmF5PHVua25vd24+LCBBPihcbiAgYXJnczogQWN0aW9uT3JBY3Rpb25XaXRoU3RhdGVzPFQsIEE+XG4pOiBbQSwgLi4uVF0ge1xuICBsZXQgYWN0aW9uOiBBLCBzbGljZXM6IFQ7XG5cbiAgaWYgKGFyZ3MgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgIFthY3Rpb24sIC4uLnNsaWNlc10gPSBhcmdzO1xuICB9IGVsc2Uge1xuICAgIHNsaWNlcyA9IFtdIGFzIFQ7XG4gICAgYWN0aW9uID0gYXJncztcbiAgfVxuXG4gIHJldHVybiBbYWN0aW9uLCAuLi5zbGljZXNdO1xufVxuXG5mdW5jdGlvbiBmaW5kU25hcHNob3QoXG4gIGNvbXBvbmVudDogVHlwZTxhbnk+LFxuICBzOiBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90XG4pOiBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90IHtcbiAgaWYgKHMucm91dGVDb25maWcgJiYgcy5yb3V0ZUNvbmZpZy5jb21wb25lbnQgPT09IGNvbXBvbmVudCkge1xuICAgIHJldHVybiBzO1xuICB9XG4gIGZvciAoY29uc3QgYyBvZiBzLmNoaWxkcmVuKSB7XG4gICAgY29uc3Qgc3MgPSBmaW5kU25hcHNob3QoY29tcG9uZW50LCBjKTtcbiAgICBpZiAoc3MpIHtcbiAgICAgIHJldHVybiBzcztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbmZ1bmN0aW9uIHdyYXBJbnRvT2JzZXJ2YWJsZTxPPihvYmo6IE9ic2VydmFibGU8Tz4gfCBPIHwgdm9pZCk6IE9ic2VydmFibGU8Tz4ge1xuICBpZiAoaXNPYnNlcnZhYmxlKG9iaikpIHtcbiAgICByZXR1cm4gb2JqO1xuICB9IGVsc2UgaWYgKCFvYmopIHtcbiAgICByZXR1cm4gb2YoKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gb2Yob2JqIGFzIE8pO1xuICB9XG59XG4iXX0=