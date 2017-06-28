import { NavigationCancel, NavigationError, Router, RouterStateSnapshot, RoutesRecognized } from '@angular/router';
import { Store } from '@ngrx/store';
/**
 * An action dispatched when the router navigates.
 */
export declare const ROUTER_NAVIGATION = "ROUTER_NAVIGATION";
/**
 * Payload of ROUTER_NAVIGATION.
 */
export declare type RouterNavigationPayload = {
    routerState: RouterStateSnapshot;
    event: RoutesRecognized;
};
/**
 * An action dispatched when the router navigates.
 */
export declare type RouterNavigationAction = {
    type: typeof ROUTER_NAVIGATION;
    payload: RouterNavigationPayload;
};
/**
 * An action dispatched when the router cancels navigation.
 */
export declare const ROUTER_CANCEL = "ROUTER_CANCEL";
/**
 * Payload of ROUTER_CANCEL.
 */
export declare type RouterCancelPayload<T> = {
    routerState: RouterStateSnapshot;
    storeState: T;
    event: NavigationCancel;
};
/**
 * An action dispatched when the router cancel navigation.
 */
export declare type RouterCancelAction<T> = {
    type: typeof ROUTER_CANCEL;
    payload: RouterCancelPayload<T>;
};
/**
 * An action dispatched when the router errors.
 */
export declare const ROUTER_ERROR = "ROUTE_ERROR";
/**
 * Payload of ROUTER_ERROR.
 */
export declare type RouterErrorPayload<T> = {
    routerState: RouterStateSnapshot;
    storeState: T;
    event: NavigationError;
};
/**
 * An action dispatched when the router errors.
 */
export declare type RouterErrorAction<T> = {
    type: typeof ROUTER_ERROR;
    payload: RouterErrorPayload<T>;
};
/**
 * An union type of router actions.
 */
export declare type RouterAction<T> = RouterNavigationAction | RouterCancelAction<T> | RouterErrorAction<T>;
export declare type RouterReducerState = {
    state: RouterStateSnapshot;
    navigationId: number;
};
export declare function routerReducer(state: RouterReducerState, action: RouterAction<any>): RouterReducerState;
/**
 * Connects RouterModule with StoreModule.
 *
 * During the navigation, before any guards or resolvers run, the router will dispatch
 * a ROUTER_NAVIGATION action, which has the following signature:
 *
 * ```
 * export type RouterNavigationPayload = {
 *   routerState: RouterStateSnapshot,
 *   event: RoutesRecognized
 * }
 * ```
 *
 * Either a reducer or an effect can be invoked in response to this action.
 * If the invoked reducer throws, the navigation will be canceled.
 *
 * If navigation gets canceled because of a guard, a ROUTER_CANCEL action will be
 * dispatched. If navigation results in an error, a ROUTER_ERROR action will be dispatched.
 *
 * Both ROUTER_CANCEL and ROUTER_ERROR contain the store state before the navigation
 * which can be used to restore the consistency of the store.
 *
 * Usage:
 *
 * ```typescript
 * @NgModule({
 *   declarations: [AppCmp, SimpleCmp],
 *   imports: [
 *     BrowserModule,
 *     StoreModule.provideStore(mapOfReducers),
 *     RouterModule.forRoot([
 *       { path: '', component: SimpleCmp },
 *       { path: 'next', component: SimpleCmp }
 *     ]),
 *     StoreRouterConnectingModule
 *   ],
 *   bootstrap: [AppCmp]
 * })
 * export class AppModule {
 * }
 * ```
 */
export declare class StoreRouterConnectingModule {
    private store;
    private router;
    private routerState;
    private storeState;
    private lastRoutesRecognized;
    private dispatchTriggeredByRouter;
    private navigationTriggeredByDispatch;
    constructor(store: Store<any>, router: Router);
    private setUpBeforePreactivationHook();
    private setUpStoreStateListener();
    private dispatchEvent();
    private shouldDispatch();
    private navigateIfNeeded();
    private setUpStateRollbackEvents();
    private dispatchRouterCancel(event);
    private dispatchRouterError(event);
}
