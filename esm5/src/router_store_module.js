var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
/**
 * @fileoverview added by tsickle
 * Generated from: src/router_store_module.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Inject, InjectionToken, NgModule, ErrorHandler, } from '@angular/core';
import { NavigationCancel, NavigationError, NavigationEnd, Router, RoutesRecognized, NavigationStart, } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { withLatestFrom } from 'rxjs/operators';
import { ROUTER_CANCEL, ROUTER_ERROR, ROUTER_NAVIGATED, ROUTER_NAVIGATION, ROUTER_REQUEST, } from './actions';
import { RouterStateSerializer, } from './serializers/base';
import { DefaultRouterStateSerializer, } from './serializers/default_serializer';
import { MinimalRouterStateSerializer } from './serializers/minimal_serializer';
/** @enum {number} */
var RouterState = {
    Full: 0,
    Minimal: 1,
};
export { RouterState };
/**
 * @record
 * @template T
 */
export function StoreRouterConfig() { }
if (false) {
    /** @type {?|undefined} */
    StoreRouterConfig.prototype.stateKey;
    /** @type {?|undefined} */
    StoreRouterConfig.prototype.serializer;
    /**
     * By default, ROUTER_NAVIGATION is dispatched before guards and resolvers run.
     * Therefore, the action could run too soon, for example
     * there may be a navigation cancel due to a guard saying the navigation is not allowed.
     * To run ROUTER_NAVIGATION after guards and resolvers,
     * set this property to NavigationActionTiming.PostActivation.
     * @type {?|undefined}
     */
    StoreRouterConfig.prototype.navigationActionTiming;
    /**
     * Decides which router serializer should be used, if there is none provided, and the metadata on the dispatched \@ngrx/router-store action payload.
     * Set to `Full` to use the `DefaultRouterStateSerializer` and to set the angular router events as payload.
     * Set to `Minimal` to use the `MinimalRouterStateSerializer` and to set a minimal router event with the navigation id and url as payload.
     * @type {?|undefined}
     */
    StoreRouterConfig.prototype.routerState;
}
/**
 * @record
 */
function StoreRouterActionPayload() { }
if (false) {
    /** @type {?} */
    StoreRouterActionPayload.prototype.event;
    /** @type {?|undefined} */
    StoreRouterActionPayload.prototype.routerState;
    /** @type {?|undefined} */
    StoreRouterActionPayload.prototype.storeState;
}
/** @enum {number} */
var NavigationActionTiming = {
    PreActivation: 1,
    PostActivation: 2,
};
export { NavigationActionTiming };
NavigationActionTiming[NavigationActionTiming.PreActivation] = 'PreActivation';
NavigationActionTiming[NavigationActionTiming.PostActivation] = 'PostActivation';
/** @type {?} */
export var _ROUTER_CONFIG = new InjectionToken('@ngrx/router-store Internal Configuration');
/** @type {?} */
export var ROUTER_CONFIG = new InjectionToken('@ngrx/router-store Configuration');
/** @type {?} */
export var DEFAULT_ROUTER_FEATURENAME = 'router';
/**
 * @param {?} config
 * @return {?}
 */
export function _createRouterConfig(config) {
    return __assign({ stateKey: DEFAULT_ROUTER_FEATURENAME, serializer: MinimalRouterStateSerializer, navigationActionTiming: NavigationActionTiming.PreActivation }, config);
}
/** @enum {number} */
var RouterTrigger = {
    NONE: 1,
    ROUTER: 2,
    STORE: 3,
};
RouterTrigger[RouterTrigger.NONE] = 'NONE';
RouterTrigger[RouterTrigger.ROUTER] = 'ROUTER';
RouterTrigger[RouterTrigger.STORE] = 'STORE';
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
 *     StoreRouterConnectingModule.forRoot()
 *   ],
 *   bootstrap: [AppCmp]
 * })
 * export class AppModule {
 * }
 * ```
 */
var StoreRouterConnectingModule = /** @class */ (function () {
    function StoreRouterConnectingModule(store, router, serializer, errorHandler, config) {
        this.store = store;
        this.router = router;
        this.serializer = serializer;
        this.errorHandler = errorHandler;
        this.config = config;
        this.lastEvent = null;
        this.routerState = null;
        this.trigger = RouterTrigger.NONE;
        this.stateKey = (/** @type {?} */ (this.config.stateKey));
        this.setUpStoreStateListener();
        this.setUpRouterEventsListener();
    }
    /**
     * @template T
     * @param {?=} config
     * @return {?}
     */
    StoreRouterConnectingModule.forRoot = /**
     * @template T
     * @param {?=} config
     * @return {?}
     */
    function (config) {
        if (config === void 0) { config = {}; }
        return {
            ngModule: StoreRouterConnectingModule,
            providers: [
                { provide: _ROUTER_CONFIG, useValue: config },
                {
                    provide: ROUTER_CONFIG,
                    useFactory: _createRouterConfig,
                    deps: [_ROUTER_CONFIG],
                },
                {
                    provide: RouterStateSerializer,
                    useClass: config.serializer
                        ? config.serializer
                        : config.routerState === 0 /* Full */
                            ? DefaultRouterStateSerializer
                            : MinimalRouterStateSerializer,
                },
            ],
        };
    };
    /**
     * @private
     * @return {?}
     */
    StoreRouterConnectingModule.prototype.setUpStoreStateListener = /**
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
        this.store
            .pipe(select((/** @type {?} */ (this.stateKey))), withLatestFrom(this.store))
            .subscribe((/**
         * @param {?} __0
         * @return {?}
         */
        function (_a) {
            var _b = __read(_a, 2), routerStoreState = _b[0], storeState = _b[1];
            _this.navigateIfNeeded(routerStoreState, storeState);
        }));
    };
    /**
     * @private
     * @param {?} routerStoreState
     * @param {?} storeState
     * @return {?}
     */
    StoreRouterConnectingModule.prototype.navigateIfNeeded = /**
     * @private
     * @param {?} routerStoreState
     * @param {?} storeState
     * @return {?}
     */
    function (routerStoreState, storeState) {
        var _this = this;
        if (!routerStoreState || !routerStoreState.state) {
            return;
        }
        if (this.trigger === RouterTrigger.ROUTER) {
            return;
        }
        if (this.lastEvent instanceof NavigationStart) {
            return;
        }
        /** @type {?} */
        var url = routerStoreState.state.url;
        if (this.router.url !== url) {
            this.storeState = storeState;
            this.trigger = RouterTrigger.STORE;
            this.router.navigateByUrl(url).catch((/**
             * @param {?} error
             * @return {?}
             */
            function (error) {
                _this.errorHandler.handleError(error);
            }));
        }
    };
    /**
     * @private
     * @return {?}
     */
    StoreRouterConnectingModule.prototype.setUpRouterEventsListener = /**
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
        /** @type {?} */
        var dispatchNavLate = this.config.navigationActionTiming ===
            NavigationActionTiming.PostActivation;
        /** @type {?} */
        var routesRecognized;
        this.router.events
            .pipe(withLatestFrom(this.store))
            .subscribe((/**
         * @param {?} __0
         * @return {?}
         */
        function (_a) {
            var _b = __read(_a, 2), event = _b[0], storeState = _b[1];
            _this.lastEvent = event;
            if (event instanceof NavigationStart) {
                _this.routerState = _this.serializer.serialize(_this.router.routerState.snapshot);
                if (_this.trigger !== RouterTrigger.STORE) {
                    _this.storeState = storeState;
                    _this.dispatchRouterRequest(event);
                }
            }
            else if (event instanceof RoutesRecognized) {
                routesRecognized = event;
                if (!dispatchNavLate && _this.trigger !== RouterTrigger.STORE) {
                    _this.dispatchRouterNavigation(event);
                }
            }
            else if (event instanceof NavigationCancel) {
                _this.dispatchRouterCancel(event);
                _this.reset();
            }
            else if (event instanceof NavigationError) {
                _this.dispatchRouterError(event);
                _this.reset();
            }
            else if (event instanceof NavigationEnd) {
                if (_this.trigger !== RouterTrigger.STORE) {
                    if (dispatchNavLate) {
                        _this.dispatchRouterNavigation(routesRecognized);
                    }
                    _this.dispatchRouterNavigated(event);
                }
                _this.reset();
            }
        }));
    };
    /**
     * @private
     * @param {?} event
     * @return {?}
     */
    StoreRouterConnectingModule.prototype.dispatchRouterRequest = /**
     * @private
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this.dispatchRouterAction(ROUTER_REQUEST, { event: event });
    };
    /**
     * @private
     * @param {?} lastRoutesRecognized
     * @return {?}
     */
    StoreRouterConnectingModule.prototype.dispatchRouterNavigation = /**
     * @private
     * @param {?} lastRoutesRecognized
     * @return {?}
     */
    function (lastRoutesRecognized) {
        /** @type {?} */
        var nextRouterState = this.serializer.serialize(lastRoutesRecognized.state);
        this.dispatchRouterAction(ROUTER_NAVIGATION, {
            routerState: nextRouterState,
            event: new RoutesRecognized(lastRoutesRecognized.id, lastRoutesRecognized.url, lastRoutesRecognized.urlAfterRedirects, nextRouterState),
        });
    };
    /**
     * @private
     * @param {?} event
     * @return {?}
     */
    StoreRouterConnectingModule.prototype.dispatchRouterCancel = /**
     * @private
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this.dispatchRouterAction(ROUTER_CANCEL, {
            storeState: this.storeState,
            event: event,
        });
    };
    /**
     * @private
     * @param {?} event
     * @return {?}
     */
    StoreRouterConnectingModule.prototype.dispatchRouterError = /**
     * @private
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this.dispatchRouterAction(ROUTER_ERROR, {
            storeState: this.storeState,
            event: new NavigationError(event.id, event.url, "" + event),
        });
    };
    /**
     * @private
     * @param {?} event
     * @return {?}
     */
    StoreRouterConnectingModule.prototype.dispatchRouterNavigated = /**
     * @private
     * @param {?} event
     * @return {?}
     */
    function (event) {
        /** @type {?} */
        var routerState = this.serializer.serialize(this.router.routerState.snapshot);
        this.dispatchRouterAction(ROUTER_NAVIGATED, { event: event, routerState: routerState });
    };
    /**
     * @private
     * @param {?} type
     * @param {?} payload
     * @return {?}
     */
    StoreRouterConnectingModule.prototype.dispatchRouterAction = /**
     * @private
     * @param {?} type
     * @param {?} payload
     * @return {?}
     */
    function (type, payload) {
        this.trigger = RouterTrigger.ROUTER;
        try {
            this.store.dispatch({
                type: type,
                payload: __assign(__assign({ routerState: this.routerState }, payload), { event: this.config.routerState === 0 /* Full */
                        ? payload.event
                        : { id: payload.event.id, url: payload.event.url } }),
            });
        }
        finally {
            this.trigger = RouterTrigger.NONE;
        }
    };
    /**
     * @private
     * @return {?}
     */
    StoreRouterConnectingModule.prototype.reset = /**
     * @private
     * @return {?}
     */
    function () {
        this.trigger = RouterTrigger.NONE;
        this.storeState = null;
        this.routerState = null;
    };
    StoreRouterConnectingModule.decorators = [
        { type: NgModule, args: [{},] }
    ];
    /** @nocollapse */
    StoreRouterConnectingModule.ctorParameters = function () { return [
        { type: Store },
        { type: Router },
        { type: RouterStateSerializer },
        { type: ErrorHandler },
        { type: undefined, decorators: [{ type: Inject, args: [ROUTER_CONFIG,] }] }
    ]; };
    return StoreRouterConnectingModule;
}());
export { StoreRouterConnectingModule };
if (false) {
    /**
     * @type {?}
     * @private
     */
    StoreRouterConnectingModule.prototype.lastEvent;
    /**
     * @type {?}
     * @private
     */
    StoreRouterConnectingModule.prototype.routerState;
    /**
     * @type {?}
     * @private
     */
    StoreRouterConnectingModule.prototype.storeState;
    /**
     * @type {?}
     * @private
     */
    StoreRouterConnectingModule.prototype.trigger;
    /**
     * @type {?}
     * @private
     */
    StoreRouterConnectingModule.prototype.stateKey;
    /**
     * @type {?}
     * @private
     */
    StoreRouterConnectingModule.prototype.store;
    /**
     * @type {?}
     * @private
     */
    StoreRouterConnectingModule.prototype.router;
    /**
     * @type {?}
     * @private
     */
    StoreRouterConnectingModule.prototype.serializer;
    /**
     * @type {?}
     * @private
     */
    StoreRouterConnectingModule.prototype.errorHandler;
    /**
     * @type {?}
     * @private
     */
    StoreRouterConnectingModule.prototype.config;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyX3N0b3JlX21vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZ3J4L3JvdXRlci1zdG9yZS8iLCJzb3VyY2VzIjpbInNyYy9yb3V0ZXJfc3RvcmVfbW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsT0FBTyxFQUNMLE1BQU0sRUFDTixjQUFjLEVBRWQsUUFBUSxFQUNSLFlBQVksR0FDYixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQ0wsZ0JBQWdCLEVBQ2hCLGVBQWUsRUFDZixhQUFhLEVBQ2IsTUFBTSxFQUNOLGdCQUFnQixFQUNoQixlQUFlLEdBR2hCLE1BQU0saUJBQWlCLENBQUM7QUFDekIsT0FBTyxFQUFFLE1BQU0sRUFBWSxLQUFLLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDdEQsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRWhELE9BQU8sRUFDTCxhQUFhLEVBQ2IsWUFBWSxFQUNaLGdCQUFnQixFQUNoQixpQkFBaUIsRUFDakIsY0FBYyxHQUNmLE1BQU0sV0FBVyxDQUFDO0FBRW5CLE9BQU8sRUFDTCxxQkFBcUIsR0FFdEIsTUFBTSxvQkFBb0IsQ0FBQztBQUM1QixPQUFPLEVBQ0wsNEJBQTRCLEdBRTdCLE1BQU0sa0NBQWtDLENBQUM7QUFDMUMsT0FBTyxFQUFFLDRCQUE0QixFQUFFLE1BQU0sa0NBQWtDLENBQUM7O0FBVWhGLElBQWtCLFdBQVc7SUFDM0IsSUFBSSxHQUFBO0lBQ0osT0FBTyxHQUFBO0VBQ1I7Ozs7OztBQUVELHVDQW1CQzs7O0lBaEJDLHFDQUFpQzs7SUFDakMsdUNBQTJEOzs7Ozs7Ozs7SUFRM0QsbURBQWdEOzs7Ozs7O0lBTWhELHdDQUEwQjs7Ozs7QUFHNUIsdUNBSUM7OztJQUhDLHlDQUFtQjs7SUFDbkIsK0NBQTRDOztJQUM1Qyw4Q0FBaUI7OztBQUduQixJQUFZLHNCQUFzQjtJQUNoQyxhQUFhLEdB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LDRDQUF5Qjs7Ozs7SUFDekIsNkNBQXNCOzs7OztJQUN0QixpREFBd0U7Ozs7O0lBQ3hFLG1EQUFrQzs7Ozs7SUFDbEMsNkNBQXdEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgSW5qZWN0LFxuICBJbmplY3Rpb25Ub2tlbixcbiAgTW9kdWxlV2l0aFByb3ZpZGVycyxcbiAgTmdNb2R1bGUsXG4gIEVycm9ySGFuZGxlcixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBOYXZpZ2F0aW9uQ2FuY2VsLFxuICBOYXZpZ2F0aW9uRXJyb3IsXG4gIE5hdmlnYXRpb25FbmQsXG4gIFJvdXRlcixcbiAgUm91dGVzUmVjb2duaXplZCxcbiAgTmF2aWdhdGlvblN0YXJ0LFxuICBFdmVudCxcbiAgUm91dGVyRXZlbnQsXG59IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBzZWxlY3QsIFNlbGVjdG9yLCBTdG9yZSB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcbmltcG9ydCB7IHdpdGhMYXRlc3RGcm9tIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQge1xuICBST1VURVJfQ0FOQ0VMLFxuICBST1VURVJfRVJST1IsXG4gIFJPVVRFUl9OQVZJR0FURUQsXG4gIFJPVVRFUl9OQVZJR0FUSU9OLFxuICBST1VURVJfUkVRVUVTVCxcbn0gZnJvbSAnLi9hY3Rpb25zJztcbmltcG9ydCB7IFJvdXRlclJlZHVjZXJTdGF0ZSB9IGZyb20gJy4vcmVkdWNlcic7XG5pbXBvcnQge1xuICBSb3V0ZXJTdGF0ZVNlcmlhbGl6ZXIsXG4gIEJhc2VSb3V0ZXJTdG9yZVN0YXRlLFxufSBmcm9tICcuL3NlcmlhbGl6ZXJzL2Jhc2UnO1xuaW1wb3J0IHtcbiAgRGVmYXVsdFJvdXRlclN0YXRlU2VyaWFsaXplcixcbiAgU2VyaWFsaXplZFJvdXRlclN0YXRlU25hcHNob3QsXG59IGZyb20gJy4vc2VyaWFsaXplcnMvZGVmYXVsdF9zZXJpYWxpemVyJztcbmltcG9ydCB7IE1pbmltYWxSb3V0ZXJTdGF0ZVNlcmlhbGl6ZXIgfSBmcm9tICcuL3NlcmlhbGl6ZXJzL21pbmltYWxfc2VyaWFsaXplcic7XG5cbmV4cG9ydCB0eXBlIFN0YXRlS2V5T3JTZWxlY3RvcjxcbiAgVCBleHRlbmRzIEJhc2VSb3V0ZXJTdG9yZVN0YXRlID0gU2VyaWFsaXplZFJvdXRlclN0YXRlU25hcHNob3Rcbj4gPSBzdHJpbmcgfCBTZWxlY3RvcjxhbnksIFJvdXRlclJlZHVjZXJTdGF0ZTxUPj47XG5cbi8qKlxuICogRnVsbCA9IFNlcmlhbGl6ZXMgdGhlIHJvdXRlciBldmVudCB3aXRoIERlZmF1bHRSb3V0ZXJTdGF0ZVNlcmlhbGl6ZXJcbiAqIE1pbmltYWwgPSBTZXJpYWxpemVzIHRoZSByb3V0ZXIgZXZlbnQgd2l0aCBNaW5pbWFsUm91dGVyU3RhdGVTZXJpYWxpemVyXG4gKi9cbmV4cG9ydCBjb25zdCBlbnVtIFJvdXRlclN0YXRlIHtcbiAgRnVsbCxcbiAgTWluaW1hbCxcbn1cblxuZXhwb3J0IGludGVyZmFjZSBTdG9yZVJvdXRlckNvbmZpZzxcbiAgVCBleHRlbmRzIEJhc2VSb3V0ZXJTdG9yZVN0YXRlID0gU2VyaWFsaXplZFJvdXRlclN0YXRlU25hcHNob3Rcbj4ge1xuICBzdGF0ZUtleT86IFN0YXRlS2V5T3JTZWxlY3RvcjxUPjtcbiAgc2VyaWFsaXplcj86IG5ldyAoLi4uYXJnczogYW55W10pID0+IFJvdXRlclN0YXRlU2VyaWFsaXplcjtcbiAgLyoqXG4gICAqIEJ5IGRlZmF1bHQsIFJPVVRFUl9OQVZJR0FUSU9OIGlzIGRpc3BhdGNoZWQgYmVmb3JlIGd1YXJkcyBhbmQgcmVzb2x2ZXJzIHJ1bi5cbiAgICogVGhlcmVmb3JlLCB0aGUgYWN0aW9uIGNvdWxkIHJ1biB0b28gc29vbiwgZm9yIGV4YW1wbGVcbiAgICogdGhlcmUgbWF5IGJlIGEgbmF2aWdhdGlvbiBjYW5jZWwgZHVlIHRvIGEgZ3VhcmQgc2F5aW5nIHRoZSBuYXZpZ2F0aW9uIGlzIG5vdCBhbGxvd2VkLlxuICAgKiBUbyBydW4gUk9VVEVSX05BVklHQVRJT04gYWZ0ZXIgZ3VhcmRzIGFuZCByZXNvbHZlcnMsXG4gICAqIHNldCB0aGlzIHByb3BlcnR5IHRvIE5hdmlnYXRpb25BY3Rpb25UaW1pbmcuUG9zdEFjdGl2YXRpb24uXG4gICAqL1xuICBuYXZpZ2F0aW9uQWN0aW9uVGltaW5nPzogTmF2aWdhdGlvbkFjdGlvblRpbWluZztcbiAgLyoqXG4gICAqIERlY2lkZXMgd2hpY2ggcm91dGVyIHNlcmlhbGl6ZXIgc2hvdWxkIGJlIHVzZWQsIGlmIHRoZXJlIGlzIG5vbmUgcHJvdmlkZWQsIGFuZCB0aGUgbWV0YWRhdGEgb24gdGhlIGRpc3BhdGNoZWQgQG5ncngvcm91dGVyLXN0b3JlIGFjdGlvbiBwYXlsb2FkLlxuICAgKiBTZXQgdG8gYEZ1bGxgIHRvIHVzZSB0aGUgYERlZmF1bHRSb3V0ZXJTdGF0ZVNlcmlhbGl6ZXJgIGFuZCB0byBzZXQgdGhlIGFuZ3VsYXIgcm91dGVyIGV2ZW50cyBhcyBwYXlsb2FkLlxuICAgKiBTZXQgdG8gYE1pbmltYWxgIHRvIHVzZSB0aGUgYE1pbmltYWxSb3V0ZXJTdGF0ZVNlcmlhbGl6ZXJgIGFuZCB0byBzZXQgYSBtaW5pbWFsIHJvdXRlciBldmVudCB3aXRoIHRoZSBuYXZpZ2F0aW9uIGlkIGFuZCB1cmwgYXMgcGF5bG9hZC5cbiAgICovXG4gIHJvdXRlclN0YXRlPzogUm91dGVyU3RhdGU7XG59XG5cbmludGVyZmFjZSBTdG9yZVJvdXRlckFjdGlvblBheWxvYWQge1xuICBldmVudDogUm91dGVyRXZlbnQ7XG4gIHJvdXRlclN0YXRlPzogU2VyaWFsaXplZFJvdXRlclN0YXRlU25hcHNob3Q7XG4gIHN0b3JlU3RhdGU/OiBhbnk7XG59XG5cbmV4cG9ydCBlbnVtIE5hdmlnYXRpb25BY3Rpb25UaW1pbmcge1xuICBQcmVBY3RpdmF0aW9uID0gMSxcbiAgUG9zdEFjdGl2YXRpb24gPSAyLFxufVxuXG5leHBvcnQgY29uc3QgX1JPVVRFUl9DT05GSUcgPSBuZXcgSW5qZWN0aW9uVG9rZW4oXG4gICdAbmdyeC9yb3V0ZXItc3RvcmUgSW50ZXJuYWwgQ29uZmlndXJhdGlvbidcbik7XG5leHBvcnQgY29uc3QgUk9VVEVSX0NPTkZJRyA9IG5ldyBJbmplY3Rpb25Ub2tlbihcbiAgJ0BuZ3J4L3JvdXRlci1zdG9yZSBDb25maWd1cmF0aW9uJ1xuKTtcbmV4cG9ydCBjb25zdCBERUZBVUxUX1JPVVRFUl9GRUFUVVJFTkFNRSA9ICdyb3V0ZXInO1xuXG5leHBvcnQgZnVuY3Rpb24gX2NyZWF0ZVJvdXRlckNvbmZpZyhcbiAgY29uZmlnOiBTdG9yZVJvdXRlckNvbmZpZ1xuKTogU3RvcmVSb3V0ZXJDb25maWcge1xuICByZXR1cm4ge1xuICAgIHN0YXRlS2V5OiBERUZBVUxUX1JPVVRFUl9GRUFUVVJFTkFNRSxcbiAgICBzZXJpYWxpemVyOiBNaW5pbWFsUm91dGVyU3RhdGVTZXJpYWxpemVyLFxuICAgIG5hdmlnYXRpb25BY3Rpb25UaW1pbmc6IE5hdmlnYXRpb25BY3Rpb25UaW1pbmcuUHJlQWN0aXZhdGlvbixcbiAgICAuLi5jb25maWcsXG4gIH07XG59XG5cbmVudW0gUm91dGVyVHJpZ2dlciB7XG4gIE5PTkUgPSAxLFxuICBST1VURVIgPSAyLFxuICBTVE9SRSA9IDMsXG59XG5cbi8qKlxuICogQ29ubmVjdHMgUm91dGVyTW9kdWxlIHdpdGggU3RvcmVNb2R1bGUuXG4gKlxuICogRHVyaW5nIHRoZSBuYXZpZ2F0aW9uLCBiZWZvcmUgYW55IGd1YXJkcyBvciByZXNvbHZlcnMgcnVuLCB0aGUgcm91dGVyIHdpbGwgZGlzcGF0Y2hcbiAqIGEgUk9VVEVSX05BVklHQVRJT04gYWN0aW9uLCB3aGljaCBoYXMgdGhlIGZvbGxvd2luZyBzaWduYXR1cmU6XG4gKlxuICogYGBgXG4gKiBleHBvcnQgdHlwZSBSb3V0ZXJOYXZpZ2F0aW9uUGF5bG9hZCA9IHtcbiAqICAgcm91dGVyU3RhdGU6IFNlcmlhbGl6ZWRSb3V0ZXJTdGF0ZVNuYXBzaG90LFxuICogICBldmVudDogUm91dGVzUmVjb2duaXplZFxuICogfVxuICogYGBgXG4gKlxuICogRWl0aGVyIGEgcmVkdWNlciBvciBhbiBlZmZlY3QgY2FuIGJlIGludm9rZWQgaW4gcmVzcG9uc2UgdG8gdGhpcyBhY3Rpb24uXG4gKiBJZiB0aGUgaW52b2tlZCByZWR1Y2VyIHRocm93cywgdGhlIG5hdmlnYXRpb24gd2lsbCBiZSBjYW5jZWxlZC5cbiAqXG4gKiBJZiBuYXZpZ2F0aW9uIGdldHMgY2FuY2VsZWQgYmVjYXVzZSBvZiBhIGd1YXJkLCBhIFJPVVRFUl9DQU5DRUwgYWN0aW9uIHdpbGwgYmVcbiAqIGRpc3BhdGNoZWQuIElmIG5hdmlnYXRpb24gcmVzdWx0cyBpbiBhbiBlcnJvciwgYSBST1VURVJfRVJST1IgYWN0aW9uIHdpbGwgYmUgZGlzcGF0Y2hlZC5cbiAqXG4gKiBCb3RoIFJPVVRFUl9DQU5DRUwgYW5kIFJPVVRFUl9FUlJPUiBjb250YWluIHRoZSBzdG9yZSBzdGF0ZSBiZWZvcmUgdGhlIG5hdmlnYXRpb25cbiAqIHdoaWNoIGNhbiBiZSB1c2VkIHRvIHJlc3RvcmUgdGhlIGNvbnNpc3RlbmN5IG9mIHRoZSBzdG9yZS5cbiAqXG4gKiBVc2FnZTpcbiAqXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiBATmdNb2R1bGUoe1xuICogICBkZWNsYXJhdGlvbnM6IFtBcHBDbXAsIFNpbXBsZUNtcF0sXG4gKiAgIGltcG9ydHM6IFtcbiAqICAgICBCcm93c2VyTW9kdWxlLFxuICogICAgIFN0b3JlTW9kdWxlLmZvclJvb3QobWFwT2ZSZWR1Y2VycyksXG4gKiAgICAgUm91dGVyTW9kdWxlLmZvclJvb3QoW1xuICogICAgICAgeyBwYXRoOiAnJywgY29tcG9uZW50OiBTaW1wbGVDbXAgfSxcbiAqICAgICAgIHsgcGF0aDogJ25leHQnLCBjb21wb25lbnQ6IFNpbXBsZUNtcCB9XG4gKiAgICAgXSksXG4gKiAgICAgU3RvcmVSb3V0ZXJDb25uZWN0aW5nTW9kdWxlLmZvclJvb3QoKVxuICogICBdLFxuICogICBib290c3RyYXA6IFtBcHBDbXBdXG4gKiB9KVxuICogZXhwb3J0IGNsYXNzIEFwcE1vZHVsZSB7XG4gKiB9XG4gKiBgYGBcbiAqL1xuQE5nTW9kdWxlKHt9KVxuZXhwb3J0IGNsYXNzIFN0b3JlUm91dGVyQ29ubmVjdGluZ01vZHVsZSB7XG4gIHN0YXRpYyBmb3JSb290PFxuICAgIFQgZXh0ZW5kcyBCYXNlUm91dGVyU3RvcmVTdGF0ZSA9IFNlcmlhbGl6ZWRSb3V0ZXJTdGF0ZVNuYXBzaG90XG4gID4oXG4gICAgY29uZmlnOiBTdG9yZVJvdXRlckNvbmZpZzxUPiA9IHt9XG4gICk6IE1vZHVsZVdpdGhQcm92aWRlcnM8U3RvcmVSb3V0ZXJDb25uZWN0aW5nTW9kdWxlPiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5nTW9kdWxlOiBTdG9yZVJvdXRlckNvbm5lY3RpbmdNb2R1bGUsXG4gICAgICBwcm92aWRlcnM6IFtcbiAgICAgICAgeyBwcm92aWRlOiBfUk9VVEVSX0NPTkZJRywgdXNlVmFsdWU6IGNvbmZpZyB9LFxuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogUk9VVEVSX0NPTkZJRyxcbiAgICAgICAgICB1c2VGYWN0b3J5OiBfY3JlYXRlUm91dGVyQ29uZmlnLFxuICAgICAgICAgIGRlcHM6IFtfUk9VVEVSX0NPTkZJR10sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBwcm92aWRlOiBSb3V0ZXJTdGF0ZVNlcmlhbGl6ZXIsXG4gICAgICAgICAgdXNlQ2xhc3M6IGNvbmZpZy5zZXJpYWxpemVyXG4gICAgICAgICAgICA/IGNvbmZpZy5zZXJpYWxpemVyXG4gICAgICAgICAgICA6IGNvbmZpZy5yb3V0ZXJTdGF0ZSA9PT0gUm91dGVyU3RhdGUuRnVsbFxuICAgICAgICAgICAgICA/IERlZmF1bHRSb3V0ZXJTdGF0ZVNlcmlhbGl6ZXJcbiAgICAgICAgICAgICAgOiBNaW5pbWFsUm91dGVyU3RhdGVTZXJpYWxpemVyLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSBsYXN0RXZlbnQ6IEV2ZW50IHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgcm91dGVyU3RhdGU6IFNlcmlhbGl6ZWRSb3V0ZXJTdGF0ZVNuYXBzaG90IHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgc3RvcmVTdGF0ZTogYW55O1xuICBwcml2YXRlIHRyaWdnZXIgPSBSb3V0ZXJUcmlnZ2VyLk5PTkU7XG5cbiAgcHJpdmF0ZSBzdGF0ZUtleTogU3RhdGVLZXlPclNlbGVjdG9yO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgc3RvcmU6IFN0b3JlPGFueT4sXG4gICAgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlcixcbiAgICBwcml2YXRlIHNlcmlhbGl6ZXI6IFJvdXRlclN0YXRlU2VyaWFsaXplcjxTZXJpYWxpemVkUm91dGVyU3RhdGVTbmFwc2hvdD4sXG4gICAgcHJpdmF0ZSBlcnJvckhhbmRsZXI6IEVycm9ySGFuZGxlcixcbiAgICBASW5qZWN0KFJPVVRFUl9DT05GSUcpIHByaXZhdGUgY29uZmlnOiBTdG9yZVJvdXRlckNvbmZpZ1xuICApIHtcbiAgICB0aGlzLnN0YXRlS2V5ID0gdGhpcy5jb25maWcuc3RhdGVLZXkgYXMgU3RhdGVLZXlPclNlbGVjdG9yO1xuXG4gICAgdGhpcy5zZXRVcFN0b3JlU3RhdGVMaXN0ZW5lcigpO1xuICAgIHRoaXMuc2V0VXBSb3V0ZXJFdmVudHNMaXN0ZW5lcigpO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXRVcFN0b3JlU3RhdGVMaXN0ZW5lcigpOiB2b2lkIHtcbiAgICB0aGlzLnN0b3JlXG4gICAgICAucGlwZShcbiAgICAgICAgc2VsZWN0KHRoaXMuc3RhdGVLZXkgYXMgYW55KSxcbiAgICAgICAgd2l0aExhdGVzdEZyb20odGhpcy5zdG9yZSlcbiAgICAgIClcbiAgICAgIC5zdWJzY3JpYmUoKFtyb3V0ZXJTdG9yZVN0YXRlLCBzdG9yZVN0YXRlXSkgPT4ge1xuICAgICAgICB0aGlzLm5hdmlnYXRlSWZOZWVkZWQocm91dGVyU3RvcmVTdGF0ZSwgc3RvcmVTdGF0ZSk7XG4gICAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgbmF2aWdhdGVJZk5lZWRlZChcbiAgICByb3V0ZXJTdG9yZVN0YXRlOiBSb3V0ZXJSZWR1Y2VyU3RhdGUsXG4gICAgc3RvcmVTdGF0ZTogYW55XG4gICk6IHZvaWQge1xuICAgIGlmICghcm91dGVyU3RvcmVTdGF0ZSB8fCAhcm91dGVyU3RvcmVTdGF0ZS5zdGF0ZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodGhpcy50cmlnZ2VyID09PSBSb3V0ZXJUcmlnZ2VyLlJPVVRFUikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodGhpcy5sYXN0RXZlbnQgaW5zdGFuY2VvZiBOYXZpZ2F0aW9uU3RhcnQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB1cmwgPSByb3V0ZXJTdG9yZVN0YXRlLnN0YXRlLnVybDtcbiAgICBpZiAodGhpcy5yb3V0ZXIudXJsICE9PSB1cmwpIHtcbiAgICAgIHRoaXMuc3RvcmVTdGF0ZSA9IHN0b3JlU3RhdGU7XG4gICAgICB0aGlzLnRyaWdnZXIgPSBSb3V0ZXJUcmlnZ2VyLlNUT1JFO1xuICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGVCeVVybCh1cmwpLmNhdGNoKGVycm9yID0+IHtcbiAgICAgICAgdGhpcy5lcnJvckhhbmRsZXIuaGFuZGxlRXJyb3IoZXJyb3IpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzZXRVcFJvdXRlckV2ZW50c0xpc3RlbmVyKCk6IHZvaWQge1xuICAgIGNvbnN0IGRpc3BhdGNoTmF2TGF0ZSA9XG4gICAgICB0aGlzLmNvbmZpZy5uYXZpZ2F0aW9uQWN0aW9uVGltaW5nID09PVxuICAgICAgTmF2aWdhdGlvbkFjdGlvblRpbWluZy5Qb3N0QWN0aXZhdGlvbjtcbiAgICBsZXQgcm91dGVzUmVjb2duaXplZDogUm91dGVzUmVjb2duaXplZDtcblxuICAgIHRoaXMucm91dGVyLmV2ZW50c1xuICAgICAgLnBpcGUod2l0aExhdGVzdEZyb20odGhpcy5zdG9yZSkpXG4gICAgICAuc3Vic2NyaWJlKChbZXZlbnQsIHN0b3JlU3RhdGVdKSA9PiB7XG4gICAgICAgIHRoaXMubGFzdEV2ZW50ID0gZXZlbnQ7XG5cbiAgICAgICAgaWYgKGV2ZW50IGluc3RhbmNlb2YgTmF2aWdhdGlvblN0YXJ0KSB7XG4gICAgICAgICAgdGhpcy5yb3V0ZXJTdGF0ZSA9IHRoaXMuc2VyaWFsaXplci5zZXJpYWxpemUoXG4gICAgICAgICAgICB0aGlzLnJvdXRlci5yb3V0ZXJTdGF0ZS5zbmFwc2hvdFxuICAgICAgICAgICk7XG4gICAgICAgICAgaWYgKHRoaXMudHJpZ2dlciAhPT0gUm91dGVyVHJpZ2dlci5TVE9SRSkge1xuICAgICAgICAgICAgdGhpcy5zdG9yZVN0YXRlID0gc3RvcmVTdGF0ZTtcbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hSb3V0ZXJSZXF1ZXN0KGV2ZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnQgaW5zdGFuY2VvZiBSb3V0ZXNSZWNvZ25pemVkKSB7XG4gICAgICAgICAgcm91dGVzUmVjb2duaXplZCA9IGV2ZW50O1xuXG4gICAgICAgICAgaWYgKCFkaXNwYXRjaE5hdkxhdGUgJiYgdGhpcy50cmlnZ2VyICE9PSBSb3V0ZXJUcmlnZ2VyLlNUT1JFKSB7XG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoUm91dGVyTmF2aWdhdGlvbihldmVudCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50IGluc3RhbmNlb2YgTmF2aWdhdGlvbkNhbmNlbCkge1xuICAgICAgICAgIHRoaXMuZGlzcGF0Y2hSb3V0ZXJDYW5jZWwoZXZlbnQpO1xuICAgICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICAgICAgfSBlbHNlIGlmIChldmVudCBpbnN0YW5jZW9mIE5hdmlnYXRpb25FcnJvcikge1xuICAgICAgICAgIHRoaXMuZGlzcGF0Y2hSb3V0ZXJFcnJvcihldmVudCk7XG4gICAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50IGluc3RhbmNlb2YgTmF2aWdhdGlvbkVuZCkge1xuICAgICAgICAgIGlmICh0aGlzLnRyaWdnZXIgIT09IFJvdXRlclRyaWdnZXIuU1RPUkUpIHtcbiAgICAgICAgICAgIGlmIChkaXNwYXRjaE5hdkxhdGUpIHtcbiAgICAgICAgICAgICAgdGhpcy5kaXNwYXRjaFJvdXRlck5hdmlnYXRpb24ocm91dGVzUmVjb2duaXplZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoUm91dGVyTmF2aWdhdGVkKGV2ZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgZGlzcGF0Y2hSb3V0ZXJSZXF1ZXN0KGV2ZW50OiBOYXZpZ2F0aW9uU3RhcnQpOiB2b2lkIHtcbiAgICB0aGlzLmRpc3BhdGNoUm91dGVyQWN0aW9uKFJPVVRFUl9SRVFVRVNULCB7IGV2ZW50IH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBkaXNwYXRjaFJvdXRlck5hdmlnYXRpb24oXG4gICAgbGFzdFJvdXRlc1JlY29nbml6ZWQ6IFJvdXRlc1JlY29nbml6ZWRcbiAgKTogdm9pZCB7XG4gICAgY29uc3QgbmV4dFJvdXRlclN0YXRlID0gdGhpcy5zZXJpYWxpemVyLnNlcmlhbGl6ZShcbiAgICAgIGxhc3RSb3V0ZXNSZWNvZ25pemVkLnN0YXRlXG4gICAgKTtcbiAgICB0aGlzLmRpc3BhdGNoUm91dGVyQWN0aW9uKFJPVVRFUl9OQVZJR0FUSU9OLCB7XG4gICAgICByb3V0ZXJTdGF0ZTogbmV4dFJvdXRlclN0YXRlLFxuICAgICAgZXZlbnQ6IG5ldyBSb3V0ZXNSZWNvZ25pemVkKFxuICAgICAgICBsYXN0Um91dGVzUmVjb2duaXplZC5pZCxcbiAgICAgICAgbGFzdFJvdXRlc1JlY29nbml6ZWQudXJsLFxuICAgICAgICBsYXN0Um91dGVzUmVjb2duaXplZC51cmxBZnRlclJlZGlyZWN0cyxcbiAgICAgICAgbmV4dFJvdXRlclN0YXRlXG4gICAgICApLFxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBkaXNwYXRjaFJvdXRlckNhbmNlbChldmVudDogTmF2aWdhdGlvbkNhbmNlbCk6IHZvaWQge1xuICAgIHRoaXMuZGlzcGF0Y2hSb3V0ZXJBY3Rpb24oUk9VVEVSX0NBTkNFTCwge1xuICAgICAgc3RvcmVTdGF0ZTogdGhpcy5zdG9yZVN0YXRlLFxuICAgICAgZXZlbnQsXG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGRpc3BhdGNoUm91dGVyRXJyb3IoZXZlbnQ6IE5hdmlnYXRpb25FcnJvcik6IHZvaWQge1xuICAgIHRoaXMuZGlzcGF0Y2hSb3V0ZXJBY3Rpb24oUk9VVEVSX0VSUk9SLCB7XG4gICAgICBzdG9yZVN0YXRlOiB0aGlzLnN0b3JlU3RhdGUsXG4gICAgICBldmVudDogbmV3IE5hdmlnYXRpb25FcnJvcihldmVudC5pZCwgZXZlbnQudXJsLCBgJHtldmVudH1gKSxcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgZGlzcGF0Y2hSb3V0ZXJOYXZpZ2F0ZWQoZXZlbnQ6IE5hdmlnYXRpb25FbmQpOiB2b2lkIHtcbiAgICBjb25zdCByb3V0ZXJTdGF0ZSA9IHRoaXMuc2VyaWFsaXplci5zZXJpYWxpemUoXG4gICAgICB0aGlzLnJvdXRlci5yb3V0ZXJTdGF0ZS5zbmFwc2hvdFxuICAgICk7XG4gICAgdGhpcy5kaXNwYXRjaFJvdXRlckFjdGlvbihST1VURVJfTkFWSUdBVEVELCB7IGV2ZW50LCByb3V0ZXJTdGF0ZSB9KTtcbiAgfVxuXG4gIHByaXZhdGUgZGlzcGF0Y2hSb3V0ZXJBY3Rpb24oXG4gICAgdHlwZTogc3RyaW5nLFxuICAgIHBheWxvYWQ6IFN0b3JlUm91dGVyQWN0aW9uUGF5bG9hZFxuICApOiB2b2lkIHtcbiAgICB0aGlzLnRyaWdnZXIgPSBSb3V0ZXJUcmlnZ2VyLlJPVVRFUjtcbiAgICB0cnkge1xuICAgICAgdGhpcy5zdG9yZS5kaXNwYXRjaCh7XG4gICAgICAgIHR5cGUsXG4gICAgICAgIHBheWxvYWQ6IHtcbiAgICAgICAgICByb3V0ZXJTdGF0ZTogdGhpcy5yb3V0ZXJTdGF0ZSxcbiAgICAgICAgICAuLi5wYXlsb2FkLFxuICAgICAgICAgIGV2ZW50OlxuICAgICAgICAgICAgdGhpcy5jb25maWcucm91dGVyU3RhdGUgPT09IFJvdXRlclN0YXRlLkZ1bGxcbiAgICAgICAgICAgICAgPyBwYXlsb2FkLmV2ZW50XG4gICAgICAgICAgICAgIDogeyBpZDogcGF5bG9hZC5ldmVudC5pZCwgdXJsOiBwYXlsb2FkLmV2ZW50LnVybCB9LFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRoaXMudHJpZ2dlciA9IFJvdXRlclRyaWdnZXIuTk9ORTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHJlc2V0KCkge1xuICAgIHRoaXMudHJpZ2dlciA9IFJvdXRlclRyaWdnZXIuTk9ORTtcbiAgICB0aGlzLnN0b3JlU3RhdGUgPSBudWxsO1xuICAgIHRoaXMucm91dGVyU3RhdGUgPSBudWxsO1xuICB9XG59XG4iXX0=