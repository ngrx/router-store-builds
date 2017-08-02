import { NgModule } from '@angular/core';
import { NavigationCancel, NavigationError, Router, RoutesRecognized, } from '@angular/router';
import { Store } from '@ngrx/store';
import { of } from 'rxjs/observable/of';
/**
 * An action dispatched when the router navigates.
 */
export const ROUTER_NAVIGATION = 'ROUTER_NAVIGATION';
/**
 * An action dispatched when the router cancels navigation.
 */
export const ROUTER_CANCEL = 'ROUTER_CANCEL';
/**
 * An action dispatched when the router errors.
 */
export const ROUTER_ERROR = 'ROUTE_ERROR';
/**
 * @param {?} state
 * @param {?} action
 * @return {?}
 */
export function routerReducer(state, action) {
    switch (action.type) {
        case ROUTER_NAVIGATION:
        case ROUTER_ERROR:
        case ROUTER_CANCEL:
            return {
                state: action.payload.routerState,
                navigationId: action.payload.event.id,
            };
        default:
            return state;
    }
}
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
 * \@NgModule({
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
export class StoreRouterConnectingModule {
    /**
     * @param {?} store
     * @param {?} router
     */
    constructor(store, router) {
        this.store = store;
        this.router = router;
        this.routerState = null;
        this.dispatchTriggeredByRouter = false;
        this.navigationTriggeredByDispatch = false;
        this.setUpBeforePreactivationHook();
        this.setUpStoreStateListener();
        this.setUpStateRollbackEvents();
    }
    /**
     * @return {?}
     */
    setUpBeforePreactivationHook() {
        ((this.router)).hooks.beforePreactivation = (routerState) => {
            this.routerState = routerState;
            if (this.shouldDispatchRouterNavigation())
                this.dispatchRouterNavigation();
            return of(true);
        };
    }
    /**
     * @return {?}
     */
    setUpStoreStateListener() {
        this.store.subscribe(s => {
            this.storeState = s;
            this.navigateIfNeeded();
        });
    }
    /**
     * @return {?}
     */
    shouldDispatchRouterNavigation() {
        if (!this.storeState['routerReducer'])
            return true;
        return !this.navigationTriggeredByDispatch;
    }
    /**
     * @return {?}
     */
    navigateIfNeeded() {
        if (!this.storeState['routerReducer'] ||
            !this.storeState['routerReducer'].state) {
            return;
        }
        if (this.dispatchTriggeredByRouter)
            return;
        if (this.router.url !== this.storeState['routerReducer'].state.url) {
            this.navigationTriggeredByDispatch = true;
            this.router.navigateByUrl(this.storeState['routerReducer'].state.url);
        }
    }
    /**
     * @return {?}
     */
    setUpStateRollbackEvents() {
        this.router.events.subscribe(e => {
            if (e instanceof RoutesRecognized) {
                this.lastRoutesRecognized = e;
            }
            else if (e instanceof NavigationCancel) {
                this.dispatchRouterCancel(e);
            }
            else if (e instanceof NavigationError) {
                this.dispatchRouterError(e);
            }
        });
    }
    /**
     * @return {?}
     */
    dispatchRouterNavigation() {
        this.dispatchRouterAction(ROUTER_NAVIGATION, {
            routerState: this.routerState,
            event: this.lastRoutesRecognized,
        });
    }
    /**
     * @param {?} event
     * @return {?}
     */
    dispatchRouterCancel(event) {
        this.dispatchRouterAction(ROUTER_CANCEL, {
            routerState: this.routerState,
            storeState: this.storeState,
            event,
        });
    }
    /**
     * @param {?} event
     * @return {?}
     */
    dispatchRouterError(event) {
        this.dispatchRouterAction(ROUTER_ERROR, {
            routerState: this.routerState,
            storeState: this.storeState,
            event,
        });
    }
    /**
     * @param {?} type
     * @param {?} payload
     * @return {?}
     */
    dispatchRouterAction(type, payload) {
        this.dispatchTriggeredByRouter = true;
        try {
            this.store.dispatch({ type, payload });
        }
        finally {
            this.dispatchTriggeredByRouter = false;
            this.navigationTriggeredByDispatch = false;
        }
    }
}
StoreRouterConnectingModule.decorators = [
    { type: NgModule, args: [{},] },
];
/**
 * @nocollapse
 */
StoreRouterConnectingModule.ctorParameters = () => [
    { type: Store, },
    { type: Router, },
];
function StoreRouterConnectingModule_tsickle_Closure_declarations() {
    /** @type {?} */
    StoreRouterConnectingModule.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    StoreRouterConnectingModule.ctorParameters;
    /** @type {?} */
    StoreRouterConnectingModule.prototype.routerState;
    /** @type {?} */
    StoreRouterConnectingModule.prototype.storeState;
    /** @type {?} */
    StoreRouterConnectingModule.prototype.lastRoutesRecognized;
    /** @type {?} */
    StoreRouterConnectingModule.prototype.dispatchTriggeredByRouter;
    /** @type {?} */
    StoreRouterConnectingModule.prototype.navigationTriggeredByDispatch;
    /** @type {?} */
    StoreRouterConnectingModule.prototype.store;
    /** @type {?} */
    StoreRouterConnectingModule.prototype.router;
}
//# sourceMappingURL=router_store_module.js.map