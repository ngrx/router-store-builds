var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
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
import { Inject, InjectionToken, NgModule, ErrorHandler, } from '@angular/core';
import { NavigationCancel, NavigationError, NavigationEnd, Router, RoutesRecognized, NavigationStart, } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { withLatestFrom } from 'rxjs/operators';
import { ROUTER_CANCEL, ROUTER_ERROR, ROUTER_NAVIGATED, ROUTER_NAVIGATION, ROUTER_REQUEST, } from './actions';
import { DefaultRouterStateSerializer, RouterStateSerializer, } from './serializer';
export var NavigationActionTiming;
(function (NavigationActionTiming) {
    NavigationActionTiming[NavigationActionTiming["PreActivation"] = 1] = "PreActivation";
    NavigationActionTiming[NavigationActionTiming["PostActivation"] = 2] = "PostActivation";
})(NavigationActionTiming || (NavigationActionTiming = {}));
export var _ROUTER_CONFIG = new InjectionToken('@ngrx/router-store Internal Configuration');
export var ROUTER_CONFIG = new InjectionToken('@ngrx/router-store Configuration');
export var DEFAULT_ROUTER_FEATURENAME = 'router';
export function _createRouterConfig(config) {
    return __assign({ stateKey: DEFAULT_ROUTER_FEATURENAME, serializer: DefaultRouterStateSerializer, navigationActionTiming: NavigationActionTiming.PreActivation }, config);
}
var RouterTrigger;
(function (RouterTrigger) {
    RouterTrigger[RouterTrigger["NONE"] = 1] = "NONE";
    RouterTrigger[RouterTrigger["ROUTER"] = 2] = "ROUTER";
    RouterTrigger[RouterTrigger["STORE"] = 3] = "STORE";
})(RouterTrigger || (RouterTrigger = {}));
var ɵ0 = {};
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
 * @NgModule({
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
var StoreRouterConnectingModule = /** @class */ (function () {
    function StoreRouterConnectingModule(store, router, serializer, errorHandler, config) {
        this.store = store;
        this.router = router;
        this.serializer = serializer;
        this.errorHandler = errorHandler;
        this.config = config;
        this.trigger = RouterTrigger.NONE;
        this.stateKey = this.config.stateKey;
        this.setUpStoreStateListener();
        this.setUpRouterEventsListener();
    }
    StoreRouterConnectingModule.forRoot = function (config) {
        if (config === void 0) { config = {}; }
        return {
            ngModule: StoreRouterConnectingModule,
            providers: [
                { provide: _ROUTER_CONFIG, useValue: config },
                {
                    provide: RouterStateSerializer,
                    useClass: config.serializer
                        ? config.serializer
                        : DefaultRouterStateSerializer,
                },
            ],
        };
    };
    StoreRouterConnectingModule.prototype.setUpStoreStateListener = function () {
        var _this = this;
        this.store
            .pipe(select(this.stateKey), withLatestFrom(this.store))
            .subscribe(function (_a) {
            var _b = __read(_a, 2), routerStoreState = _b[0], storeState = _b[1];
            _this.navigateIfNeeded(routerStoreState, storeState);
        });
    };
    StoreRouterConnectingModule.prototype.navigateIfNeeded = function (routerStoreState, storeState) {
        var _this = this;
        if (!routerStoreState || !routerStoreState.state) {
            return;
        }
        if (this.trigger === RouterTrigger.ROUTER) {
            return;
        }
        var url = routerStoreState.state.url;
        if (this.router.url !== url) {
            this.storeState = storeState;
            this.trigger = RouterTrigger.STORE;
            this.router.navigateByUrl(url).catch(function (error) {
                _this.errorHandler.handleError(error);
            });
        }
    };
    StoreRouterConnectingModule.prototype.setUpRouterEventsListener = function () {
        var _this = this;
        var dispatchNavLate = this.config.navigationActionTiming ===
            NavigationActionTiming.PostActivation;
        var routesRecognized;
        this.router.events
            .pipe(withLatestFrom(this.store))
            .subscribe(function (_a) {
            var _b = __read(_a, 2), event = _b[0], storeState = _b[1];
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
        });
    };
    StoreRouterConnectingModule.prototype.dispatchRouterRequest = function (event) {
        this.dispatchRouterAction(ROUTER_REQUEST, { event: event });
    };
    StoreRouterConnectingModule.prototype.dispatchRouterNavigation = function (lastRoutesRecognized) {
        var nextRouterState = this.serializer.serialize(lastRoutesRecognized.state);
        this.dispatchRouterAction(ROUTER_NAVIGATION, {
            routerState: nextRouterState,
            event: new RoutesRecognized(lastRoutesRecognized.id, lastRoutesRecognized.url, lastRoutesRecognized.urlAfterRedirects, nextRouterState),
        });
    };
    StoreRouterConnectingModule.prototype.dispatchRouterCancel = function (event) {
        this.dispatchRouterAction(ROUTER_CANCEL, {
            routerState: this.routerState,
            storeState: this.storeState,
            event: event,
        });
    };
    StoreRouterConnectingModule.prototype.dispatchRouterError = function (event) {
        this.dispatchRouterAction(ROUTER_ERROR, {
            routerState: this.routerState,
            storeState: this.storeState,
            event: new NavigationError(event.id, event.url, "" + event),
        });
    };
    StoreRouterConnectingModule.prototype.dispatchRouterNavigated = function (event) {
        this.dispatchRouterAction(ROUTER_NAVIGATED, { event: event });
    };
    StoreRouterConnectingModule.prototype.dispatchRouterAction = function (type, payload) {
        this.trigger = RouterTrigger.ROUTER;
        try {
            this.store.dispatch({ type: type, payload: payload });
        }
        finally {
            this.trigger = RouterTrigger.NONE;
        }
    };
    StoreRouterConnectingModule.prototype.reset = function () {
        this.trigger = RouterTrigger.NONE;
        this.storeState = null;
        this.routerState = null;
    };
    StoreRouterConnectingModule.decorators = [
        { type: NgModule, args: [{
                    providers: [
                        {
                            provide: _ROUTER_CONFIG,
                            useValue: ɵ0,
                        },
                        {
                            provide: ROUTER_CONFIG,
                            useFactory: _createRouterConfig,
                            deps: [_ROUTER_CONFIG],
                        },
                        {
                            provide: RouterStateSerializer,
                            useClass: DefaultRouterStateSerializer,
                        },
                    ],
                },] }
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
export { ɵ0 };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyX3N0b3JlX21vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvcm91dGVyLXN0b3JlL3NyYy9yb3V0ZXJfc3RvcmVfbW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLE9BQU8sRUFDTCxNQUFNLEVBQ04sY0FBYyxFQUVkLFFBQVEsRUFDUixZQUFZLEdBQ2IsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUNMLGdCQUFnQixFQUNoQixlQUFlLEVBQ2YsYUFBYSxFQUNiLE1BQU0sRUFDTixnQkFBZ0IsRUFDaEIsZUFBZSxHQUNoQixNQUFNLGlCQUFpQixDQUFDO0FBQ3pCLE9BQU8sRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQzVDLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUVoRCxPQUFPLEVBQ0wsYUFBYSxFQUNiLFlBQVksRUFDWixnQkFBZ0IsRUFDaEIsaUJBQWlCLEVBQ2pCLGNBQWMsR0FDZixNQUFNLFdBQVcsQ0FBQztBQUVuQixPQUFPLEVBQ0wsNEJBQTRCLEVBQzVCLHFCQUFxQixHQUV0QixNQUFNLGNBQWMsQ0FBQztBQWV0QixNQUFNLENBQU4sSUFBWSxzQkFHWDtBQUhELFdBQVksc0JBQXNCO0lBQ2hDLHFGQUFpQixDQUFBO0lBQ2pCLHVGQUFrQixDQUFBO0FBQ3BCLENBQUMsRUFIVyxzQkFBc0IsS0FBdEIsc0JBQXNCLFFBR2pDO0FBRUQsTUFBTSxDQUFDLElBQU0sY0FBYyxHQUFHLElBQUksY0FBYyxDQUM5QywyQ0FBMkMsQ0FDNUMsQ0FBQztBQUNGLE1BQU0sQ0FBQyxJQUFNLGFBQWEsR0FBRyxJQUFJLGNBQWMsQ0FDN0Msa0NBQWtDLENBQ25DLENBQUM7QUFDRixNQUFNLENBQUMsSUFBTSwwQkFBMEIsR0FBRyxRQUFRLENBQUM7QUFF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LEVBQUUsbUJBQW1COzRCQUMvQixJQUFJLEVBQUUsQ0FBQyxjQUFjLENBQUM7eUJBQ3ZCO3dCQUNEOzRCQUNFLE9BQU8sRUFBRSxxQkFBcUI7NEJBQzlCLFFBQVEsRUFBRSw0QkFBNEI7eUJBQ3ZDO3FCQUNGO2lCQUNGOzs7O2dCQXRIZ0IsS0FBSztnQkFKcEIsTUFBTTtnQkFpQk4scUJBQXFCO2dCQXZCckIsWUFBWTtnREE0SlQsTUFBTSxTQUFDLGFBQWE7O0lBd0l6QixrQ0FBQztDQUFBLEFBcExELElBb0xDO1NBbktZLDJCQUEyQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIEluamVjdCxcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIE1vZHVsZVdpdGhQcm92aWRlcnMsXG4gIE5nTW9kdWxlLFxuICBFcnJvckhhbmRsZXIsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgTmF2aWdhdGlvbkNhbmNlbCxcbiAgTmF2aWdhdGlvbkVycm9yLFxuICBOYXZpZ2F0aW9uRW5kLFxuICBSb3V0ZXIsXG4gIFJvdXRlc1JlY29nbml6ZWQsXG4gIE5hdmlnYXRpb25TdGFydCxcbn0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IHNlbGVjdCwgU3RvcmUgfSBmcm9tICdAbmdyeC9zdG9yZSc7XG5pbXBvcnQgeyB3aXRoTGF0ZXN0RnJvbSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHtcbiAgUk9VVEVSX0NBTkNFTCxcbiAgUk9VVEVSX0VSUk9SLFxuICBST1VURVJfTkFWSUdBVEVELFxuICBST1VURVJfTkFWSUdBVElPTixcbiAgUk9VVEVSX1JFUVVFU1QsXG59IGZyb20gJy4vYWN0aW9ucyc7XG5pbXBvcnQgeyBSb3V0ZXJSZWR1Y2VyU3RhdGUgfSBmcm9tICcuL3JlZHVjZXInO1xuaW1wb3J0IHtcbiAgRGVmYXVsdFJvdXRlclN0YXRlU2VyaWFsaXplcixcbiAgUm91dGVyU3RhdGVTZXJpYWxpemVyLFxuICBTZXJpYWxpemVkUm91dGVyU3RhdGVTbmFwc2hvdCxcbn0gZnJvbSAnLi9zZXJpYWxpemVyJztcblxuZXhwb3J0IGludGVyZmFjZSBTdG9yZVJvdXRlckNvbmZpZyB7XG4gIHN0YXRlS2V5Pzogc3RyaW5nO1xuICBzZXJpYWxpemVyPzogbmV3ICguLi5hcmdzOiBhbnlbXSkgPT4gUm91dGVyU3RhdGVTZXJpYWxpemVyO1xuICAvKipcbiAgICogQnkgZGVmYXVsdCwgUk9VVEVSX05BVklHQVRJT04gaXMgZGlzcGF0Y2hlZCBiZWZvcmUgZ3VhcmRzIGFuZCByZXNvbHZlcnMgcnVuLlxuICAgKiBUaGVyZWZvcmUsIHRoZSBhY3Rpb24gY291bGQgcnVuIHRvbyBzb29uLCBmb3IgZXhhbXBsZVxuICAgKiB0aGVyZSBtYXkgYmUgYSBuYXZpZ2F0aW9uIGNhbmNlbCBkdWUgdG8gYSBndWFyZCBzYXlpbmcgdGhlIG5hdmlnYXRpb24gaXMgbm90IGFsbG93ZWQuXG4gICAqIFRvIHJ1biBST1VURVJfTkFWSUdBVElPTiBhZnRlciBndWFyZHMgYW5kIHJlc29sdmVycyxcbiAgICogc2V0IHRoaXMgcHJvcGVydHkgdG8gTmF2aWdhdGlvbkFjdGlvblRpbWluZy5Qb3N0QWN0aXZhdGlvbi5cbiAgICovXG4gIG5hdmlnYXRpb25BY3Rpb25UaW1pbmc/OiBOYXZpZ2F0aW9uQWN0aW9uVGltaW5nO1xufVxuXG5leHBvcnQgZW51bSBOYXZpZ2F0aW9uQWN0aW9uVGltaW5nIHtcbiAgUHJlQWN0aXZhdGlvbiA9IDEsXG4gIFBvc3RBY3RpdmF0aW9uID0gMixcbn1cblxuZXhwb3J0IGNvbnN0IF9ST1VURVJfQ09ORklHID0gbmV3IEluamVjdGlvblRva2VuKFxuICAnQG5ncngvcm91dGVyLXN0b3JlIEludGVybmFsIENvbmZpZ3VyYXRpb24nXG4pO1xuZXhwb3J0IGNvbnN0IFJPVVRFUl9DT05GSUcgPSBuZXcgSW5qZWN0aW9uVG9rZW4oXG4gICdAbmdyeC9yb3V0ZXItc3RvcmUgQ29uZmlndXJhdGlvbidcbik7XG5leHBvcnQgY29uc3QgREVGQVVMVF9ST1VURVJfRkVBVFVSRU5BTUUgPSAncm91dGVyJztcblxuZXhwb3J0IGZ1bmN0aW9uIF9jcmVhdGVSb3V0ZXJDb25maWcoXG4gIGNvbmZpZzogU3RvcmVSb3V0ZXJDb25maWdcbik6IFN0b3JlUm91dGVyQ29uZmlnIHtcbiAgcmV0dXJuIHtcbiAgICBzdGF0ZUtleTogREVGQVVMVF9ST1VURVJfRkVBVFVSRU5BTUUsXG4gICAgc2VyaWFsaXplcjogRGVmYXVsdFJvdXRlclN0YXRlU2VyaWFsaXplcixcbiAgICBuYXZpZ2F0aW9uQWN0aW9uVGltaW5nOiBOYXZpZ2F0aW9uQWN0aW9uVGltaW5nLlByZUFjdGl2YXRpb24sXG4gICAgLi4uY29uZmlnLFxuICB9O1xufVxuXG5lbnVtIFJvdXRlclRyaWdnZXIge1xuICBOT05FID0gMSxcbiAgUk9VVEVSID0gMixcbiAgU1RPUkUgPSAzLFxufVxuXG4vKipcbiAqIENvbm5lY3RzIFJvdXRlck1vZHVsZSB3aXRoIFN0b3JlTW9kdWxlLlxuICpcbiAqIER1cmluZyB0aGUgbmF2aWdhdGlvbiwgYmVmb3JlIGFueSBndWFyZHMgb3IgcmVzb2x2ZXJzIHJ1biwgdGhlIHJvdXRlciB3aWxsIGRpc3BhdGNoXG4gKiBhIFJPVVRFUl9OQVZJR0FUSU9OIGFjdGlvbiwgd2hpY2ggaGFzIHRoZSBmb2xsb3dpbmcgc2lnbmF0dXJlOlxuICpcbiAqIGBgYFxuICogZXhwb3J0IHR5cGUgUm91dGVyTmF2aWdhdGlvblBheWxvYWQgPSB7XG4gKiAgIHJvdXRlclN0YXRlOiBTZXJpYWxpemVkUm91dGVyU3RhdGVTbmFwc2hvdCxcbiAqICAgZXZlbnQ6IFJvdXRlc1JlY29nbml6ZWRcbiAqIH1cbiAqIGBgYFxuICpcbiAqIEVpdGhlciBhIHJlZHVjZXIgb3IgYW4gZWZmZWN0IGNhbiBiZSBpbnZva2VkIGluIHJlc3BvbnNlIHRvIHRoaXMgYWN0aW9uLlxuICogSWYgdGhlIGludm9rZWQgcmVkdWNlciB0aHJvd3MsIHRoZSBuYXZpZ2F0aW9uIHdpbGwgYmUgY2FuY2VsZWQuXG4gKlxuICogSWYgbmF2aWdhdGlvbiBnZXRzIGNhbmNlbGVkIGJlY2F1c2Ugb2YgYSBndWFyZCwgYSBST1VURVJfQ0FOQ0VMIGFjdGlvbiB3aWxsIGJlXG4gKiBkaXNwYXRjaGVkLiBJZiBuYXZpZ2F0aW9uIHJlc3VsdHMgaW4gYW4gZXJyb3IsIGEgUk9VVEVSX0VSUk9SIGFjdGlvbiB3aWxsIGJlIGRpc3BhdGNoZWQuXG4gKlxuICogQm90aCBST1VURVJfQ0FOQ0VMIGFuZCBST1VURVJfRVJST1IgY29udGFpbiB0aGUgc3RvcmUgc3RhdGUgYmVmb3JlIHRoZSBuYXZpZ2F0aW9uXG4gKiB3aGljaCBjYW4gYmUgdXNlZCB0byByZXN0b3JlIHRoZSBjb25zaXN0ZW5jeSBvZiB0aGUgc3RvcmUuXG4gKlxuICogVXNhZ2U6XG4gKlxuICogYGBgdHlwZXNjcmlwdFxuICogQE5nTW9kdWxlKHtcbiAqICAgZGVjbGFyYXRpb25zOiBbQXBwQ21wLCBTaW1wbGVDbXBdLFxuICogICBpbXBvcnRzOiBbXG4gKiAgICAgQnJvd3Nlck1vZHVsZSxcbiAqICAgICBTdG9yZU1vZHVsZS5mb3JSb290KG1hcE9mUmVkdWNlcnMpLFxuICogICAgIFJvdXRlck1vZHVsZS5mb3JSb290KFtcbiAqICAgICAgIHsgcGF0aDogJycsIGNvbXBvbmVudDogU2ltcGxlQ21wIH0sXG4gKiAgICAgICB7IHBhdGg6ICduZXh0JywgY29tcG9uZW50OiBTaW1wbGVDbXAgfVxuICogICAgIF0pLFxuICogICAgIFN0b3JlUm91dGVyQ29ubmVjdGluZ01vZHVsZVxuICogICBdLFxuICogICBib290c3RyYXA6IFtBcHBDbXBdXG4gKiB9KVxuICogZXhwb3J0IGNsYXNzIEFwcE1vZHVsZSB7XG4gKiB9XG4gKiBgYGBcbiAqL1xuQE5nTW9kdWxlKHtcbiAgcHJvdmlkZXJzOiBbXG4gICAge1xuICAgICAgcHJvdmlkZTogX1JPVVRFUl9DT05GSUcsXG4gICAgICB1c2VWYWx1ZToge30sXG4gICAgfSxcbiAgICB7XG4gICAgICBwcm92aWRlOiBST1VURVJfQ09ORklHLFxuICAgICAgdXNlRmFjdG9yeTogX2NyZWF0ZVJvdXRlckNvbmZpZyxcbiAgICAgIGRlcHM6IFtfUk9VVEVSX0NPTkZJR10sXG4gICAgfSxcbiAgICB7XG4gICAgICBwcm92aWRlOiBSb3V0ZXJTdGF0ZVNlcmlhbGl6ZXIsXG4gICAgICB1c2VDbGFzczogRGVmYXVsdFJvdXRlclN0YXRlU2VyaWFsaXplcixcbiAgICB9LFxuICBdLFxufSlcbmV4cG9ydCBjbGFzcyBTdG9yZVJvdXRlckNvbm5lY3RpbmdNb2R1bGUge1xuICBzdGF0aWMgZm9yUm9vdChjb25maWc6IFN0b3JlUm91dGVyQ29uZmlnID0ge30pOiBNb2R1bGVXaXRoUHJvdmlkZXJzIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmdNb2R1bGU6IFN0b3JlUm91dGVyQ29ubmVjdGluZ01vZHVsZSxcbiAgICAgIHByb3ZpZGVyczogW1xuICAgICAgICB7IHByb3ZpZGU6IF9ST1VURVJfQ09ORklHLCB1c2VWYWx1ZTogY29uZmlnIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBwcm92aWRlOiBSb3V0ZXJTdGF0ZVNlcmlhbGl6ZXIsXG4gICAgICAgICAgdXNlQ2xhc3M6IGNvbmZpZy5zZXJpYWxpemVyXG4gICAgICAgICAgICA/IGNvbmZpZy5zZXJpYWxpemVyXG4gICAgICAgICAgICA6IERlZmF1bHRSb3V0ZXJTdGF0ZVNlcmlhbGl6ZXIsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIHJvdXRlclN0YXRlOiBTZXJpYWxpemVkUm91dGVyU3RhdGVTbmFwc2hvdCB8IG51bGw7XG4gIHByaXZhdGUgc3RvcmVTdGF0ZTogYW55O1xuICBwcml2YXRlIHRyaWdnZXIgPSBSb3V0ZXJUcmlnZ2VyLk5PTkU7XG5cbiAgcHJpdmF0ZSBzdGF0ZUtleTogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgc3RvcmU6IFN0b3JlPGFueT4sXG4gICAgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlcixcbiAgICBwcml2YXRlIHNlcmlhbGl6ZXI6IFJvdXRlclN0YXRlU2VyaWFsaXplcjxTZXJpYWxpemVkUm91dGVyU3RhdGVTbmFwc2hvdD4sXG4gICAgcHJpdmF0ZSBlcnJvckhhbmRsZXI6IEVycm9ySGFuZGxlcixcbiAgICBASW5qZWN0KFJPVVRFUl9DT05GSUcpIHByaXZhdGUgY29uZmlnOiBTdG9yZVJvdXRlckNvbmZpZ1xuICApIHtcbiAgICB0aGlzLnN0YXRlS2V5ID0gdGhpcy5jb25maWcuc3RhdGVLZXkgYXMgc3RyaW5nO1xuXG4gICAgdGhpcy5zZXRVcFN0b3JlU3RhdGVMaXN0ZW5lcigpO1xuICAgIHRoaXMuc2V0VXBSb3V0ZXJFdmVudHNMaXN0ZW5lcigpO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXRVcFN0b3JlU3RhdGVMaXN0ZW5lcigpOiB2b2lkIHtcbiAgICB0aGlzLnN0b3JlXG4gICAgICAucGlwZShcbiAgICAgICAgc2VsZWN0KHRoaXMuc3RhdGVLZXkpLFxuICAgICAgICB3aXRoTGF0ZXN0RnJvbSh0aGlzLnN0b3JlKVxuICAgICAgKVxuICAgICAgLnN1YnNjcmliZSgoW3JvdXRlclN0b3JlU3RhdGUsIHN0b3JlU3RhdGVdKSA9PiB7XG4gICAgICAgIHRoaXMubmF2aWdhdGVJZk5lZWRlZChyb3V0ZXJTdG9yZVN0YXRlLCBzdG9yZVN0YXRlKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBuYXZpZ2F0ZUlmTmVlZGVkKFxuICAgIHJvdXRlclN0b3JlU3RhdGU6IFJvdXRlclJlZHVjZXJTdGF0ZSxcbiAgICBzdG9yZVN0YXRlOiBhbnlcbiAgKTogdm9pZCB7XG4gICAgaWYgKCFyb3V0ZXJTdG9yZVN0YXRlIHx8ICFyb3V0ZXJTdG9yZVN0YXRlLnN0YXRlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0aGlzLnRyaWdnZXIgPT09IFJvdXRlclRyaWdnZXIuUk9VVEVSKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgdXJsID0gcm91dGVyU3RvcmVTdGF0ZS5zdGF0ZS51cmw7XG4gICAgaWYgKHRoaXMucm91dGVyLnVybCAhPT0gdXJsKSB7XG4gICAgICB0aGlzLnN0b3JlU3RhdGUgPSBzdG9yZVN0YXRlO1xuICAgICAgdGhpcy50cmlnZ2VyID0gUm91dGVyVHJpZ2dlci5TVE9SRTtcbiAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlQnlVcmwodXJsKS5jYXRjaChlcnJvciA9PiB7XG4gICAgICAgIHRoaXMuZXJyb3JIYW5kbGVyLmhhbmRsZUVycm9yKGVycm9yKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgc2V0VXBSb3V0ZXJFdmVudHNMaXN0ZW5lcigpOiB2b2lkIHtcbiAgICBjb25zdCBkaXNwYXRjaE5hdkxhdGUgPVxuICAgICAgdGhpcy5jb25maWcubmF2aWdhdGlvbkFjdGlvblRpbWluZyA9PT1cbiAgICAgIE5hdmlnYXRpb25BY3Rpb25UaW1pbmcuUG9zdEFjdGl2YXRpb247XG4gICAgbGV0IHJvdXRlc1JlY29nbml6ZWQ6IFJvdXRlc1JlY29nbml6ZWQ7XG5cbiAgICB0aGlzLnJvdXRlci5ldmVudHNcbiAgICAgIC5waXBlKHdpdGhMYXRlc3RGcm9tKHRoaXMuc3RvcmUpKVxuICAgICAgLnN1YnNjcmliZSgoW2V2ZW50LCBzdG9yZVN0YXRlXSkgPT4ge1xuICAgICAgICBpZiAoZXZlbnQgaW5zdGFuY2VvZiBOYXZpZ2F0aW9uU3RhcnQpIHtcbiAgICAgICAgICB0aGlzLnJvdXRlclN0YXRlID0gdGhpcy5zZXJpYWxpemVyLnNlcmlhbGl6ZShcbiAgICAgICAgICAgIHRoaXMucm91dGVyLnJvdXRlclN0YXRlLnNuYXBzaG90XG4gICAgICAgICAgKTtcbiAgICAgICAgICBpZiAodGhpcy50cmlnZ2VyICE9PSBSb3V0ZXJUcmlnZ2VyLlNUT1JFKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3JlU3RhdGUgPSBzdG9yZVN0YXRlO1xuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaFJvdXRlclJlcXVlc3QoZXZlbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChldmVudCBpbnN0YW5jZW9mIFJvdXRlc1JlY29nbml6ZWQpIHtcbiAgICAgICAgICByb3V0ZXNSZWNvZ25pemVkID0gZXZlbnQ7XG5cbiAgICAgICAgICBpZiAoIWRpc3BhdGNoTmF2TGF0ZSAmJiB0aGlzLnRyaWdnZXIgIT09IFJvdXRlclRyaWdnZXIuU1RPUkUpIHtcbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hSb3V0ZXJOYXZpZ2F0aW9uKGV2ZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnQgaW5zdGFuY2VvZiBOYXZpZ2F0aW9uQ2FuY2VsKSB7XG4gICAgICAgICAgdGhpcy5kaXNwYXRjaFJvdXRlckNhbmNlbChldmVudCk7XG4gICAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50IGluc3RhbmNlb2YgTmF2aWdhdGlvbkVycm9yKSB7XG4gICAgICAgICAgdGhpcy5kaXNwYXRjaFJvdXRlckVycm9yKGV2ZW50KTtcbiAgICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnQgaW5zdGFuY2VvZiBOYXZpZ2F0aW9uRW5kKSB7XG4gICAgICAgICAgaWYgKHRoaXMudHJpZ2dlciAhPT0gUm91dGVyVHJpZ2dlci5TVE9SRSkge1xuICAgICAgICAgICAgaWYgKGRpc3BhdGNoTmF2TGF0ZSkge1xuICAgICAgICAgICAgICB0aGlzLmRpc3BhdGNoUm91dGVyTmF2aWdhdGlvbihyb3V0ZXNSZWNvZ25pemVkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hSb3V0ZXJOYXZpZ2F0ZWQoZXZlbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBkaXNwYXRjaFJvdXRlclJlcXVlc3QoZXZlbnQ6IE5hdmlnYXRpb25TdGFydCk6IHZvaWQge1xuICAgIHRoaXMuZGlzcGF0Y2hSb3V0ZXJBY3Rpb24oUk9VVEVSX1JFUVVFU1QsIHsgZXZlbnQgfSk7XG4gIH1cblxuICBwcml2YXRlIGRpc3BhdGNoUm91dGVyTmF2aWdhdGlvbihcbiAgICBsYXN0Um91dGVzUmVjb2duaXplZDogUm91dGVzUmVjb2duaXplZFxuICApOiB2b2lkIHtcbiAgICBjb25zdCBuZXh0Um91dGVyU3RhdGUgPSB0aGlzLnNlcmlhbGl6ZXIuc2VyaWFsaXplKFxuICAgICAgbGFzdFJvdXRlc1JlY29nbml6ZWQuc3RhdGVcbiAgICApO1xuICAgIHRoaXMuZGlzcGF0Y2hSb3V0ZXJBY3Rpb24oUk9VVEVSX05BVklHQVRJT04sIHtcbiAgICAgIHJvdXRlclN0YXRlOiBuZXh0Um91dGVyU3RhdGUsXG4gICAgICBldmVudDogbmV3IFJvdXRlc1JlY29nbml6ZWQoXG4gICAgICAgIGxhc3RSb3V0ZXNSZWNvZ25pemVkLmlkLFxuICAgICAgICBsYXN0Um91dGVzUmVjb2duaXplZC51cmwsXG4gICAgICAgIGxhc3RSb3V0ZXNSZWNvZ25pemVkLnVybEFmdGVyUmVkaXJlY3RzLFxuICAgICAgICBuZXh0Um91dGVyU3RhdGVcbiAgICAgICksXG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGRpc3BhdGNoUm91dGVyQ2FuY2VsKGV2ZW50OiBOYXZpZ2F0aW9uQ2FuY2VsKTogdm9pZCB7XG4gICAgdGhpcy5kaXNwYXRjaFJvdXRlckFjdGlvbihST1VURVJfQ0FOQ0VMLCB7XG4gICAgICByb3V0ZXJTdGF0ZTogdGhpcy5yb3V0ZXJTdGF0ZSEsXG4gICAgICBzdG9yZVN0YXRlOiB0aGlzLnN0b3JlU3RhdGUsXG4gICAgICBldmVudCxcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgZGlzcGF0Y2hSb3V0ZXJFcnJvcihldmVudDogTmF2aWdhdGlvbkVycm9yKTogdm9pZCB7XG4gICAgdGhpcy5kaXNwYXRjaFJvdXRlckFjdGlvbihST1VURVJfRVJST1IsIHtcbiAgICAgIHJvdXRlclN0YXRlOiB0aGlzLnJvdXRlclN0YXRlISxcbiAgICAgIHN0b3JlU3RhdGU6IHRoaXMuc3RvcmVTdGF0ZSxcbiAgICAgIGV2ZW50OiBuZXcgTmF2aWdhdGlvbkVycm9yKGV2ZW50LmlkLCBldmVudC51cmwsIGAke2V2ZW50fWApLFxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBkaXNwYXRjaFJvdXRlck5hdmlnYXRlZChldmVudDogTmF2aWdhdGlvbkVuZCk6IHZvaWQge1xuICAgIHRoaXMuZGlzcGF0Y2hSb3V0ZXJBY3Rpb24oUk9VVEVSX05BVklHQVRFRCwgeyBldmVudCB9KTtcbiAgfVxuXG4gIHByaXZhdGUgZGlzcGF0Y2hSb3V0ZXJBY3Rpb24odHlwZTogc3RyaW5nLCBwYXlsb2FkOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLnRyaWdnZXIgPSBSb3V0ZXJUcmlnZ2VyLlJPVVRFUjtcbiAgICB0cnkge1xuICAgICAgdGhpcy5zdG9yZS5kaXNwYXRjaCh7IHR5cGUsIHBheWxvYWQgfSk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRoaXMudHJpZ2dlciA9IFJvdXRlclRyaWdnZXIuTk9ORTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHJlc2V0KCkge1xuICAgIHRoaXMudHJpZ2dlciA9IFJvdXRlclRyaWdnZXIuTk9ORTtcbiAgICB0aGlzLnN0b3JlU3RhdGUgPSBudWxsO1xuICAgIHRoaXMucm91dGVyU3RhdGUgPSBudWxsO1xuICB9XG59XG4iXX0=