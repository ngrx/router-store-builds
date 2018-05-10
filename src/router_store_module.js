/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { Inject, InjectionToken, NgModule, } from '@angular/core';
import { NavigationCancel, NavigationError, NavigationEnd, Router, RoutesRecognized, } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { DefaultRouterStateSerializer, RouterStateSerializer, } from './serializer';
/**
 * An action dispatched when the router navigates.
 */
export const /** @type {?} */ ROUTER_NAVIGATION = 'ROUTER_NAVIGATION';
/**
 * An action dispatched when the router cancels navigation.
 */
export const /** @type {?} */ ROUTER_CANCEL = 'ROUTER_CANCEL';
/**
 * An action dispatched when the router errors.
 */
export const /** @type {?} */ ROUTER_ERROR = 'ROUTE_ERROR';
/**
 * @template T
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
            return /** @type {?} */ (state);
    }
}
/**
 * @record
 */
export function StoreRouterConfig() { }
function StoreRouterConfig_tsickle_Closure_declarations() {
    /** @type {?|undefined} */
    StoreRouterConfig.prototype.stateKey;
}
export const /** @type {?} */ _ROUTER_CONFIG = new InjectionToken('@ngrx/router-store Internal Configuration');
export const /** @type {?} */ ROUTER_CONFIG = new InjectionToken('@ngrx/router-store Configuration');
export const /** @type {?} */ DEFAULT_ROUTER_FEATURENAME = 'routerReducer';
/**
 * @param {?} config
 * @return {?}
 */
export function _createDefaultRouterConfig(config) {
    let /** @type {?} */ _config;
    if (typeof config === 'function') {
        _config = config();
    }
    else {
        _config = config || {};
    }
    return Object.assign({ stateKey: DEFAULT_ROUTER_FEATURENAME }, _config);
}
const ɵ0 = { stateKey: DEFAULT_ROUTER_FEATURENAME };
/**
 * Connects RouterModule with StoreModule.
 *
 * During the navigation, before any guards or resolvers run, the router will dispatch
 * a ROUTER_NAVIGATION action, which has the following signature:
 *
 * ```
 * export type RouterNavigationPayload = {
 *   routerState: SerializedRouterStateSnapshot,
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
 *     StoreModule.forRoot(mapOfReducers),
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
     * @param {?} serializer
     * @param {?} config
     */
    constructor(store, router, serializer, config) {
        this.store = store;
        this.router = router;
        this.serializer = serializer;
        this.config = config;
        this.dispatchTriggeredByRouter = false;
        this.navigationTriggeredByDispatch = false;
        this.stateKey = /** @type {?} */ (this.config.stateKey);
        this.setUpBeforePreactivationHook();
        this.setUpStoreStateListener();
        this.setUpStateRollbackEvents();
    }
    /**
     * @param {?=} config
     * @return {?}
     */
    static forRoot(config = {}) {
        return {
            ngModule: StoreRouterConnectingModule,
            providers: [
                { provide: _ROUTER_CONFIG, useValue: config },
                {
                    provide: ROUTER_CONFIG,
                    useFactory: _createDefaultRouterConfig,
                    deps: [_ROUTER_CONFIG],
                },
            ],
        };
    }
    /**
     * @return {?}
     */
    setUpBeforePreactivationHook() {
        (/** @type {?} */ (this.router)).hooks.beforePreactivation = (routerState) => {
            this.routerState = this.serializer.serialize(routerState);
            if (this.shouldDispatchRouterNavigation()) {
                this.dispatchRouterNavigation();
            }
            return of(true);
        };
    }
    /**
     * @return {?}
     */
    setUpStoreStateListener() {
        this.store.subscribe(s => {
            this.storeState = s;
        });
        this.store.pipe(select(this.stateKey)).subscribe(() => {
            this.navigateIfNeeded();
        });
    }
    /**
     * @return {?}
     */
    shouldDispatchRouterNavigation() {
        if (!this.storeState[this.stateKey])
            return true;
        return !this.navigationTriggeredByDispatch;
    }
    /**
     * @return {?}
     */
    navigateIfNeeded() {
        if (!this.storeState[this.stateKey] ||
            !this.storeState[this.stateKey].state) {
            return;
        }
        if (this.dispatchTriggeredByRouter)
            return;
        if (this.router.url !== this.storeState[this.stateKey].state.url) {
            this.navigationTriggeredByDispatch = true;
            this.router.navigateByUrl(this.storeState[this.stateKey].state.url);
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
            else if (e instanceof NavigationEnd) {
                this.dispatchTriggeredByRouter = false;
                this.navigationTriggeredByDispatch = false;
            }
        });
    }
    /**
     * @return {?}
     */
    dispatchRouterNavigation() {
        this.dispatchRouterAction(ROUTER_NAVIGATION, {
            routerState: this.routerState,
            event: new RoutesRecognized(this.lastRoutesRecognized.id, this.lastRoutesRecognized.url, this.lastRoutesRecognized.urlAfterRedirects, this.routerState),
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
            event: new NavigationError(event.id, event.url, `${event}`),
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
    { type: NgModule, args: [{
                providers: [
                    { provide: RouterStateSerializer, useClass: DefaultRouterStateSerializer },
                    {
                        provide: _ROUTER_CONFIG,
                        useValue: ɵ0,
                    },
                    {
                        provide: ROUTER_CONFIG,
                        useFactory: _createDefaultRouterConfig,
                        deps: [_ROUTER_CONFIG],
                    },
                ],
            },] },
];
/** @nocollapse */
StoreRouterConnectingModule.ctorParameters = () => [
    { type: Store, },
    { type: Router, },
    { type: RouterStateSerializer, },
    { type: undefined, decorators: [{ type: Inject, args: [ROUTER_CONFIG,] },] },
];
function StoreRouterConnectingModule_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    StoreRouterConnectingModule.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
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
    StoreRouterConnectingModule.prototype.stateKey;
    /** @type {?} */
    StoreRouterConnectingModule.prototype.store;
    /** @type {?} */
    StoreRouterConnectingModule.prototype.router;
    /** @type {?} */
    StoreRouterConnectingModule.prototype.serializer;
    /** @type {?} */
    StoreRouterConnectingModule.prototype.config;
}
export { ɵ0 };
//# sourceMappingURL=router_store_module.js.map