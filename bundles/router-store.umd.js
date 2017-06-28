(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/router'), require('@ngrx/store'), require('rxjs/observable/of')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/router', '@ngrx/store', 'rxjs/observable/of'], factory) :
	(factory((global.ngrx = global.ngrx || {}, global.ngrx.routerStore = global.ngrx.routerStore || {}),global.ng.core,global.ng.router,global.ngrx.store,global.Rx.Observable));
}(this, (function (exports,_angular_core,_angular_router,_ngrx_store,rxjs_observable_of) { 'use strict';

/**
 * An action dispatched when the router navigates.
 */
var ROUTER_NAVIGATION = 'ROUTER_NAVIGATION';
/**
 * An action dispatched when the router cancels navigation.
 */
var ROUTER_CANCEL = 'ROUTER_CANCEL';
/**
 * An action dispatched when the router errors.
 */
var ROUTER_ERROR = 'ROUTE_ERROR';
/**
 * @param {?} state
 * @param {?} action
 * @return {?}
 */
function routerReducer(state, action) {
    switch (action.type) {
        case ROUTER_NAVIGATION:
        case ROUTER_ERROR:
        case ROUTER_CANCEL:
            return ({ state: action.payload.routerState, navigationId: action.payload.event.id });
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
var StoreRouterConnectingModule = (function () {
    /**
     * @param {?} store
     * @param {?} router
     */
    function StoreRouterConnectingModule(store, router) {
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
    StoreRouterConnectingModule.prototype.setUpBeforePreactivationHook = function () {
        var _this = this;
        ((this.router)).hooks.beforePreactivation = function (routerState) {
            _this.routerState = routerState;
            if (_this.shouldDispatch())
                _this.dispatchEvent();
            return rxjs_observable_of.of(true);
        };
    };
    /**
     * @return {?}
     */
    StoreRouterConnectingModule.prototype.setUpStoreStateListener = function () {
        var _this = this;
        this.store.subscribe(function (s) {
            _this.storeState = s;
            _this.navigateIfNeeded();
        });
    };
    /**
     * @return {?}
     */
    StoreRouterConnectingModule.prototype.dispatchEvent = function () {
        this.dispatchTriggeredByRouter = true;
        try {
            var /** @type {?} */ payload = { routerState: this.routerState, event: this.lastRoutesRecognized };
            this.store.dispatch({ type: ROUTER_NAVIGATION, payload: payload });
        }
        finally {
            this.dispatchTriggeredByRouter = false;
            this.navigationTriggeredByDispatch = false;
        }
    };
    /**
     * @return {?}
     */
    StoreRouterConnectingModule.prototype.shouldDispatch = function () {
        if (!this.storeState['routerReducer'])
            return true;
        return !this.navigationTriggeredByDispatch;
    };
    /**
     * @return {?}
     */
    StoreRouterConnectingModule.prototype.navigateIfNeeded = function () {
        if (!this.storeState['routerReducer'])
            return;
        if (this.dispatchTriggeredByRouter)
            return;
        if (this.router.url !== this.storeState['routerReducer'].state.url) {
            this.navigationTriggeredByDispatch = true;
            this.router.navigateByUrl(this.storeState['routerReducer'].state.url);
        }
    };
    /**
     * @return {?}
     */
    StoreRouterConnectingModule.prototype.setUpStateRollbackEvents = function () {
        var _this = this;
        this.router.events.subscribe(function (e) {
            if (e instanceof _angular_router.RoutesRecognized) {
                _this.lastRoutesRecognized = e;
            }
            else if (e instanceof _angular_router.NavigationCancel) {
                _this.dispatchRouterCancel(e);
            }
            else if (e instanceof _angular_router.NavigationError) {
                _this.dispatchRouterError(e);
            }
        });
    };
    /**
     * @param {?} event
     * @return {?}
     */
    StoreRouterConnectingModule.prototype.dispatchRouterCancel = function (event) {
        var /** @type {?} */ payload = { routerState: this.routerState, storeState: this.storeState, event: event };
        this.store.dispatch({ type: ROUTER_CANCEL, payload: payload });
    };
    /**
     * @param {?} event
     * @return {?}
     */
    StoreRouterConnectingModule.prototype.dispatchRouterError = function (event) {
        var /** @type {?} */ payload = { routerState: this.routerState, storeState: this.storeState, event: event };
        this.store.dispatch({ type: ROUTER_ERROR, payload: payload });
    };
    return StoreRouterConnectingModule;
}());
StoreRouterConnectingModule.decorators = [
    { type: _angular_core.NgModule, args: [{},] },
];
/**
 * @nocollapse
 */
StoreRouterConnectingModule.ctorParameters = function () { return [
    { type: _ngrx_store.Store, },
    { type: _angular_router.Router, },
]; };

exports.ROUTER_ERROR = ROUTER_ERROR;
exports.ROUTER_CANCEL = ROUTER_CANCEL;
exports.ROUTER_NAVIGATION = ROUTER_NAVIGATION;
exports.routerReducer = routerReducer;
exports.StoreRouterConnectingModule = StoreRouterConnectingModule;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=router-store.umd.js.map
