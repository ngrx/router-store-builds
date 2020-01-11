import { __assign, __decorate, __metadata, __param, __read } from "tslib";
import { Inject, InjectionToken, NgModule, ErrorHandler, } from '@angular/core';
import { NavigationCancel, NavigationError, NavigationEnd, Router, RoutesRecognized, NavigationStart, } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { withLatestFrom } from 'rxjs/operators';
import { ROUTER_CANCEL, ROUTER_ERROR, ROUTER_NAVIGATED, ROUTER_NAVIGATION, ROUTER_REQUEST, } from './actions';
import { RouterStateSerializer, } from './serializers/base';
import { DefaultRouterStateSerializer, } from './serializers/default_serializer';
import { MinimalRouterStateSerializer } from './serializers/minimal_serializer';
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
        this.stateKey = this.config.stateKey;
        this.setUpStoreStateListener();
        this.setUpRouterEventsListener();
    }
    StoreRouterConnectingModule_1 = StoreRouterConnectingModule;
    StoreRouterConnectingModule.forRoot = function (config) {
        if (config === void 0) { config = {}; }
        return {
            ngModule: StoreRouterConnectingModule_1,
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
                        : config.routerState === 1 /* Minimal */
                            ? MinimalRouterStateSerializer
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
        if (this.lastEvent instanceof NavigationStart) {
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
            storeState: this.storeState,
            event: event,
        });
    };
    StoreRouterConnectingModule.prototype.dispatchRouterError = function (event) {
        this.dispatchRouterAction(ROUTER_ERROR, {
            storeState: this.storeState,
            event: new NavigationError(event.id, event.url, "" + event),
        });
    };
    StoreRouterConnectingModule.prototype.dispatchRouterNavigated = function (event) {
        var routerState = this.serializer.serialize(this.router.routerState.snapshot);
        this.dispatchRouterAction(ROUTER_NAVIGATED, { event: event, routerState: routerState });
    };
    StoreRouterConnectingModule.prototype.dispatchRouterAction = function (type, payload) {
        this.trigger = RouterTrigger.ROUTER;
        try {
            this.store.dispatch({
                type: type,
                payload: __assign(__assign({ routerState: this.routerState }, payload), { event: this.config.routerState === 1 /* Minimal */
                        ? { id: payload.event.id, url: payload.event.url }
                        : payload.event }),
            });
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
    var StoreRouterConnectingModule_1;
    StoreRouterConnectingModule = StoreRouterConnectingModule_1 = __decorate([
        NgModule({}),
        __param(4, Inject(ROUTER_CONFIG)),
        __metadata("design:paramtypes", [Store,
            Router,
            RouterStateSerializer,
            ErrorHandler, Object])
    ], StoreRouterConnectingModule);
    return StoreRouterConnectingModule;
}());
export { StoreRouterConnectingModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyX3N0b3JlX21vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvcm91dGVyLXN0b3JlL3NyYy9yb3V0ZXJfc3RvcmVfbW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQ0wsTUFBTSxFQUNOLGNBQWMsRUFFZCxRQUFRLEVBQ1IsWUFBWSxHQUNiLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFDTCxnQkFBZ0IsRUFDaEIsZUFBZSxFQUNmLGFBQWEsRUFDYixNQUFNLEVBQ04sZ0JBQWdCLEVBQ2hCLGVBQWUsR0FHaEIsTUFBTSxpQkFBaUIsQ0FBQztBQUN6QixPQUFPLEVBQUUsTUFBTSxFQUFZLEtBQUssRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUN0RCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFaEQsT0FBTyxFQUNMLGFBQWEsRUFDYixZQUFZLEVBQ1osZ0JBQWdCLEVBQ2hCLGlCQUFpQixFQUNqQixjQUFjLEdBQ2YsTUFBTSxXQUFXLENBQUM7QUFFbkIsT0FBTyxFQUNMLHFCQUFxQixHQUV0QixNQUFNLG9CQUFvQixDQUFDO0FBQzVCLE9BQU8sRUFDTCw0QkFBNEIsR0FFN0IsTUFBTSxrQ0FBa0MsQ0FBQztBQUMxQyxPQUFPLEVBQUUsNEJBQTRCLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQTBDaEYsTUFBTSxDQUFOLElBQVksc0JBR1g7QUFIRCxXQUFZLHNCQUFzQjtJQUNoQyxxRkFBaUIsQ0FBQTtJQUNqQix1RkFBa0IsQ0FBQTtBQUNwQixDQUFDLEVBSFcsc0JBQXNCLEtBQXRCLHNCQUFzQixRQUdqQztBQUVELE1BQU0sQ0FBQyxJQUFNLGNBQWMsR0FBRyxJQUFJLGNBQWMsQ0FDOUMsMkNBQTJDLENBQzVDLENBQUM7QUFDRixNQUFNLENBQUMsSUFBTSxhQUFhLEdBQUcsSUFBSSxjQUFjLENBQzdDLGtDQUFr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QUk7WUFDRixJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQztnQkFDbEIsSUFBSSxNQUFBO2dCQUNKLE9BQU8sc0JBQ0wsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXLElBQzFCLE9BQU8sS0FDVixLQUFLLEVBQ0gsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLG9CQUF3Qjt3QkFDN0MsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLEdBQUcsRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRTt3QkFDbEQsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEdBQ3BCO2FBQ0YsQ0FBQyxDQUFDO1NBQ0o7Z0JBQVM7WUFDUixJQUFJLENBQUMsT0FBTyxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUM7U0FDbkM7SUFDSCxDQUFDO0lBRU8sMkNBQUssR0FBYjtRQUNFLElBQUksQ0FBQyxPQUFPLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQztRQUNsQyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztRQUN2QixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztJQUMxQixDQUFDOztJQWpNVSwyQkFBMkI7UUFEdkMsUUFBUSxDQUFDLEVBQUUsQ0FBQztRQXdDUixXQUFBLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQTt5Q0FKUCxLQUFLO1lBQ0osTUFBTTtZQUNGLHFCQUFxQjtZQUNuQixZQUFZO09BdEN6QiwyQkFBMkIsQ0FrTXZDO0lBQUQsa0NBQUM7Q0FBQSxBQWxNRCxJQWtNQztTQWxNWSwyQkFBMkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBJbmplY3QsXG4gIEluamVjdGlvblRva2VuLFxuICBNb2R1bGVXaXRoUHJvdmlkZXJzLFxuICBOZ01vZHVsZSxcbiAgRXJyb3JIYW5kbGVyLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIE5hdmlnYXRpb25DYW5jZWwsXG4gIE5hdmlnYXRpb25FcnJvcixcbiAgTmF2aWdhdGlvbkVuZCxcbiAgUm91dGVyLFxuICBSb3V0ZXNSZWNvZ25pemVkLFxuICBOYXZpZ2F0aW9uU3RhcnQsXG4gIEV2ZW50LFxuICBSb3V0ZXJFdmVudCxcbn0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IHNlbGVjdCwgU2VsZWN0b3IsIFN0b3JlIH0gZnJvbSAnQG5ncngvc3RvcmUnO1xuaW1wb3J0IHsgd2l0aExhdGVzdEZyb20gfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7XG4gIFJPVVRFUl9DQU5DRUwsXG4gIFJPVVRFUl9FUlJPUixcbiAgUk9VVEVSX05BVklHQVRFRCxcbiAgUk9VVEVSX05BVklHQVRJT04sXG4gIFJPVVRFUl9SRVFVRVNULFxufSBmcm9tICcuL2FjdGlvbnMnO1xuaW1wb3J0IHsgUm91dGVyUmVkdWNlclN0YXRlIH0gZnJvbSAnLi9yZWR1Y2VyJztcbmltcG9ydCB7XG4gIFJvdXRlclN0YXRlU2VyaWFsaXplcixcbiAgQmFzZVJvdXRlclN0b3JlU3RhdGUsXG59IGZyb20gJy4vc2VyaWFsaXplcnMvYmFzZSc7XG5pbXBvcnQge1xuICBEZWZhdWx0Um91dGVyU3RhdGVTZXJpYWxpemVyLFxuICBTZXJpYWxpemVkUm91dGVyU3RhdGVTbmFwc2hvdCxcbn0gZnJvbSAnLi9zZXJpYWxpemVycy9kZWZhdWx0X3NlcmlhbGl6ZXInO1xuaW1wb3J0IHsgTWluaW1hbFJvdXRlclN0YXRlU2VyaWFsaXplciB9IGZyb20gJy4vc2VyaWFsaXplcnMvbWluaW1hbF9zZXJpYWxpemVyJztcblxuZXhwb3J0IHR5cGUgU3RhdGVLZXlPclNlbGVjdG9yPFxuICBUIGV4dGVuZHMgQmFzZVJvdXRlclN0b3JlU3RhdGUgPSBTZXJpYWxpemVkUm91dGVyU3RhdGVTbmFwc2hvdFxuPiA9IHN0cmluZyB8IFNlbGVjdG9yPGFueSwgUm91dGVyUmVkdWNlclN0YXRlPFQ+PjtcblxuLyoqXG4gKiBGdWxsID0gU2VyaWFsaXplcyB0aGUgcm91dGVyIGV2ZW50IHdpdGggRGVmYXVsdFJvdXRlclN0YXRlU2VyaWFsaXplclxuICogTWluaW1hbCA9IFNlcmlhbGl6ZXMgdGhlIHJvdXRlciBldmVudCB3aXRoIE1pbmltYWxSb3V0ZXJTdGF0ZVNlcmlhbGl6ZXJcbiAqL1xuZXhwb3J0IGNvbnN0IGVudW0gUm91dGVyU3RhdGUge1xuICBGdWxsLFxuICBNaW5pbWFsLFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFN0b3JlUm91dGVyQ29uZmlnPFxuICBUIGV4dGVuZHMgQmFzZVJvdXRlclN0b3JlU3RhdGUgPSBTZXJpYWxpemVkUm91dGVyU3RhdGVTbmFwc2hvdFxuPiB7XG4gIHN0YXRlS2V5PzogU3RhdGVLZXlPclNlbGVjdG9yPFQ+O1xuICBzZXJpYWxpemVyPzogbmV3ICguLi5hcmdzOiBhbnlbXSkgPT4gUm91dGVyU3RhdGVTZXJpYWxpemVyO1xuICAvKipcbiAgICogQnkgZGVmYXVsdCwgUk9VVEVSX05BVklHQVRJT04gaXMgZGlzcGF0Y2hlZCBiZWZvcmUgZ3VhcmRzIGFuZCByZXNvbHZlcnMgcnVuLlxuICAgKiBUaGVyZWZvcmUsIHRoZSBhY3Rpb24gY291bGQgcnVuIHRvbyBzb29uLCBmb3IgZXhhbXBsZVxuICAgKiB0aGVyZSBtYXkgYmUgYSBuYXZpZ2F0aW9uIGNhbmNlbCBkdWUgdG8gYSBndWFyZCBzYXlpbmcgdGhlIG5hdmlnYXRpb24gaXMgbm90IGFsbG93ZWQuXG4gICAqIFRvIHJ1biBST1VURVJfTkFWSUdBVElPTiBhZnRlciBndWFyZHMgYW5kIHJlc29sdmVycyxcbiAgICogc2V0IHRoaXMgcHJvcGVydHkgdG8gTmF2aWdhdGlvbkFjdGlvblRpbWluZy5Qb3N0QWN0aXZhdGlvbi5cbiAgICovXG4gIG5hdmlnYXRpb25BY3Rpb25UaW1pbmc/OiBOYXZpZ2F0aW9uQWN0aW9uVGltaW5nO1xuICAvKipcbiAgICogRGVjaWRlcyB3aGljaCByb3V0ZXIgc2VyaWFsaXplciBzaG91bGQgYmUgdXNlZCwgaWYgdGhlcmUgaXMgbm9uZSBwcm92aWRlZCwgYW5kIHRoZSBtZXRhZGF0YSBvbiB0aGUgZGlzcGF0Y2hlZCBAbmdyeC9yb3V0ZXItc3RvcmUgYWN0aW9uIHBheWxvYWQuXG4gICAqIFNldCB0byBgRnVsbGAgdG8gdXNlIHRoZSBgRGVmYXVsdFJvdXRlclN0YXRlU2VyaWFsaXplcmAgYW5kIHRvIHNldCB0aGUgYW5ndWxhciByb3V0ZXIgZXZlbnRzIGFzIHBheWxvYWQuXG4gICAqIFNldCB0byBgTWluaW1hbGAgdG8gdXNlIHRoZSBgTWluaW1hbFJvdXRlclN0YXRlU2VyaWFsaXplcmAgYW5kIHRvIHNldCBhIG1pbmltYWwgcm91dGVyIGV2ZW50IHdpdGggdGhlIG5hdmlnYXRpb24gaWQgYW5kIHVybCBhcyBwYXlsb2FkLlxuICAgKi9cbiAgcm91dGVyU3RhdGU/OiBSb3V0ZXJTdGF0ZTtcbn1cblxuaW50ZXJmYWNlIFN0b3JlUm91dGVyQWN0aW9uUGF5bG9hZCB7XG4gIGV2ZW50OiBSb3V0ZXJFdmVudDtcbiAgcm91dGVyU3RhdGU/OiBTZXJpYWxpemVkUm91dGVyU3RhdGVTbmFwc2hvdDtcbiAgc3RvcmVTdGF0ZT86IGFueTtcbn1cblxuZXhwb3J0IGVudW0gTmF2aWdhdGlvbkFjdGlvblRpbWluZyB7XG4gIFByZUFjdGl2YXRpb24gPSAxLFxuICBQb3N0QWN0aXZhdGlvbiA9IDIsXG59XG5cbmV4cG9ydCBjb25zdCBfUk9VVEVSX0NPTkZJRyA9IG5ldyBJbmplY3Rpb25Ub2tlbihcbiAgJ0BuZ3J4L3JvdXRlci1zdG9yZSBJbnRlcm5hbCBDb25maWd1cmF0aW9uJ1xuKTtcbmV4cG9ydCBjb25zdCBST1VURVJfQ09ORklHID0gbmV3IEluamVjdGlvblRva2VuKFxuICAnQG5ncngvcm91dGVyLXN0b3JlIENvbmZpZ3VyYXRpb24nXG4pO1xuZXhwb3J0IGNvbnN0IERFRkFVTFRfUk9VVEVSX0ZFQVRVUkVOQU1FID0gJ3JvdXRlcic7XG5cbmV4cG9ydCBmdW5jdGlvbiBfY3JlYXRlUm91dGVyQ29uZmlnKFxuICBjb25maWc6IFN0b3JlUm91dGVyQ29uZmlnXG4pOiBTdG9yZVJvdXRlckNvbmZpZyB7XG4gIHJldHVybiB7XG4gICAgc3RhdGVLZXk6IERFRkFVTFRfUk9VVEVSX0ZFQVRVUkVOQU1FLFxuICAgIHNlcmlhbGl6ZXI6IERlZmF1bHRSb3V0ZXJTdGF0ZVNlcmlhbGl6ZXIsXG4gICAgbmF2aWdhdGlvbkFjdGlvblRpbWluZzogTmF2aWdhdGlvbkFjdGlvblRpbWluZy5QcmVBY3RpdmF0aW9uLFxuICAgIC4uLmNvbmZpZyxcbiAgfTtcbn1cblxuZW51bSBSb3V0ZXJUcmlnZ2VyIHtcbiAgTk9ORSA9IDEsXG4gIFJPVVRFUiA9IDIsXG4gIFNUT1JFID0gMyxcbn1cblxuLyoqXG4gKiBDb25uZWN0cyBSb3V0ZXJNb2R1bGUgd2l0aCBTdG9yZU1vZHVsZS5cbiAqXG4gKiBEdXJpbmcgdGhlIG5hdmlnYXRpb24sIGJlZm9yZSBhbnkgZ3VhcmRzIG9yIHJlc29sdmVycyBydW4sIHRoZSByb3V0ZXIgd2lsbCBkaXNwYXRjaFxuICogYSBST1VURVJfTkFWSUdBVElPTiBhY3Rpb24sIHdoaWNoIGhhcyB0aGUgZm9sbG93aW5nIHNpZ25hdHVyZTpcbiAqXG4gKiBgYGBcbiAqIGV4cG9ydCB0eXBlIFJvdXRlck5hdmlnYXRpb25QYXlsb2FkID0ge1xuICogICByb3V0ZXJTdGF0ZTogU2VyaWFsaXplZFJvdXRlclN0YXRlU25hcHNob3QsXG4gKiAgIGV2ZW50OiBSb3V0ZXNSZWNvZ25pemVkXG4gKiB9XG4gKiBgYGBcbiAqXG4gKiBFaXRoZXIgYSByZWR1Y2VyIG9yIGFuIGVmZmVjdCBjYW4gYmUgaW52b2tlZCBpbiByZXNwb25zZSB0byB0aGlzIGFjdGlvbi5cbiAqIElmIHRoZSBpbnZva2VkIHJlZHVjZXIgdGhyb3dzLCB0aGUgbmF2aWdhdGlvbiB3aWxsIGJlIGNhbmNlbGVkLlxuICpcbiAqIElmIG5hdmlnYXRpb24gZ2V0cyBjYW5jZWxlZCBiZWNhdXNlIG9mIGEgZ3VhcmQsIGEgUk9VVEVSX0NBTkNFTCBhY3Rpb24gd2lsbCBiZVxuICogZGlzcGF0Y2hlZC4gSWYgbmF2aWdhdGlvbiByZXN1bHRzIGluIGFuIGVycm9yLCBhIFJPVVRFUl9FUlJPUiBhY3Rpb24gd2lsbCBiZSBkaXNwYXRjaGVkLlxuICpcbiAqIEJvdGggUk9VVEVSX0NBTkNFTCBhbmQgUk9VVEVSX0VSUk9SIGNvbnRhaW4gdGhlIHN0b3JlIHN0YXRlIGJlZm9yZSB0aGUgbmF2aWdhdGlvblxuICogd2hpY2ggY2FuIGJlIHVzZWQgdG8gcmVzdG9yZSB0aGUgY29uc2lzdGVuY3kgb2YgdGhlIHN0b3JlLlxuICpcbiAqIFVzYWdlOlxuICpcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIEBOZ01vZHVsZSh7XG4gKiAgIGRlY2xhcmF0aW9uczogW0FwcENtcCwgU2ltcGxlQ21wXSxcbiAqICAgaW1wb3J0czogW1xuICogICAgIEJyb3dzZXJNb2R1bGUsXG4gKiAgICAgU3RvcmVNb2R1bGUuZm9yUm9vdChtYXBPZlJlZHVjZXJzKSxcbiAqICAgICBSb3V0ZXJNb2R1bGUuZm9yUm9vdChbXG4gKiAgICAgICB7IHBhdGg6ICcnLCBjb21wb25lbnQ6IFNpbXBsZUNtcCB9LFxuICogICAgICAgeyBwYXRoOiAnbmV4dCcsIGNvbXBvbmVudDogU2ltcGxlQ21wIH1cbiAqICAgICBdKSxcbiAqICAgICBTdG9yZVJvdXRlckNvbm5lY3RpbmdNb2R1bGUuZm9yUm9vdCgpXG4gKiAgIF0sXG4gKiAgIGJvb3RzdHJhcDogW0FwcENtcF1cbiAqIH0pXG4gKiBleHBvcnQgY2xhc3MgQXBwTW9kdWxlIHtcbiAqIH1cbiAqIGBgYFxuICovXG5ATmdNb2R1bGUoe30pXG5leHBvcnQgY2xhc3MgU3RvcmVSb3V0ZXJDb25uZWN0aW5nTW9kdWxlIHtcbiAgc3RhdGljIGZvclJvb3Q8XG4gICAgVCBleHRlbmRzIEJhc2VSb3V0ZXJTdG9yZVN0YXRlID0gU2VyaWFsaXplZFJvdXRlclN0YXRlU25hcHNob3RcbiAgPihcbiAgICBjb25maWc6IFN0b3JlUm91dGVyQ29uZmlnPFQ+ID0ge31cbiAgKTogTW9kdWxlV2l0aFByb3ZpZGVyczxTdG9yZVJvdXRlckNvbm5lY3RpbmdNb2R1bGU+IHtcbiAgICByZXR1cm4ge1xuICAgICAgbmdNb2R1bGU6IFN0b3JlUm91dGVyQ29ubmVjdGluZ01vZHVsZSxcbiAgICAgIHByb3ZpZGVyczogW1xuICAgICAgICB7IHByb3ZpZGU6IF9ST1VURVJfQ09ORklHLCB1c2VWYWx1ZTogY29uZmlnIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBwcm92aWRlOiBST1VURVJfQ09ORklHLFxuICAgICAgICAgIHVzZUZhY3Rvcnk6IF9jcmVhdGVSb3V0ZXJDb25maWcsXG4gICAgICAgICAgZGVwczogW19ST1VURVJfQ09ORklHXSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHByb3ZpZGU6IFJvdXRlclN0YXRlU2VyaWFsaXplcixcbiAgICAgICAgICB1c2VDbGFzczogY29uZmlnLnNlcmlhbGl6ZXJcbiAgICAgICAgICAgID8gY29uZmlnLnNlcmlhbGl6ZXJcbiAgICAgICAgICAgIDogY29uZmlnLnJvdXRlclN0YXRlID09PSBSb3V0ZXJTdGF0ZS5NaW5pbWFsXG4gICAgICAgICAgICAgID8gTWluaW1hbFJvdXRlclN0YXRlU2VyaWFsaXplclxuICAgICAgICAgICAgICA6IERlZmF1bHRSb3V0ZXJTdGF0ZVNlcmlhbGl6ZXIsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIGxhc3RFdmVudDogRXZlbnQgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSByb3V0ZXJTdGF0ZTogU2VyaWFsaXplZFJvdXRlclN0YXRlU25hcHNob3QgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBzdG9yZVN0YXRlOiBhbnk7XG4gIHByaXZhdGUgdHJpZ2dlciA9IFJvdXRlclRyaWdnZXIuTk9ORTtcblxuICBwcml2YXRlIHN0YXRlS2V5OiBTdGF0ZUtleU9yU2VsZWN0b3I7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBzdG9yZTogU3RvcmU8YW55PixcbiAgICBwcml2YXRlIHJvdXRlcjogUm91dGVyLFxuICAgIHByaXZhdGUgc2VyaWFsaXplcjogUm91dGVyU3RhdGVTZXJpYWxpemVyPFNlcmlhbGl6ZWRSb3V0ZXJTdGF0ZVNuYXBzaG90PixcbiAgICBwcml2YXRlIGVycm9ySGFuZGxlcjogRXJyb3JIYW5kbGVyLFxuICAgIEBJbmplY3QoUk9VVEVSX0NPTkZJRykgcHJpdmF0ZSBjb25maWc6IFN0b3JlUm91dGVyQ29uZmlnXG4gICkge1xuICAgIHRoaXMuc3RhdGVLZXkgPSB0aGlzLmNvbmZpZy5zdGF0ZUtleSBhcyBTdGF0ZUtleU9yU2VsZWN0b3I7XG5cbiAgICB0aGlzLnNldFVwU3RvcmVTdGF0ZUxpc3RlbmVyKCk7XG4gICAgdGhpcy5zZXRVcFJvdXRlckV2ZW50c0xpc3RlbmVyKCk7XG4gIH1cblxuICBwcml2YXRlIHNldFVwU3RvcmVTdGF0ZUxpc3RlbmVyKCk6IHZvaWQge1xuICAgIHRoaXMuc3RvcmVcbiAgICAgIC5waXBlKFxuICAgICAgICBzZWxlY3QodGhpcy5zdGF0ZUtleSBhcyBhbnkpLFxuICAgICAgICB3aXRoTGF0ZXN0RnJvbSh0aGlzLnN0b3JlKVxuICAgICAgKVxuICAgICAgLnN1YnNjcmliZSgoW3JvdXRlclN0b3JlU3RhdGUsIHN0b3JlU3RhdGVdKSA9PiB7XG4gICAgICAgIHRoaXMubmF2aWdhdGVJZk5lZWRlZChyb3V0ZXJTdG9yZVN0YXRlLCBzdG9yZVN0YXRlKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBuYXZpZ2F0ZUlmTmVlZGVkKFxuICAgIHJvdXRlclN0b3JlU3RhdGU6IFJvdXRlclJlZHVjZXJTdGF0ZSxcbiAgICBzdG9yZVN0YXRlOiBhbnlcbiAgKTogdm9pZCB7XG4gICAgaWYgKCFyb3V0ZXJTdG9yZVN0YXRlIHx8ICFyb3V0ZXJTdG9yZVN0YXRlLnN0YXRlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0aGlzLnRyaWdnZXIgPT09IFJvdXRlclRyaWdnZXIuUk9VVEVSKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0aGlzLmxhc3RFdmVudCBpbnN0YW5jZW9mIE5hdmlnYXRpb25TdGFydCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHVybCA9IHJvdXRlclN0b3JlU3RhdGUuc3RhdGUudXJsO1xuICAgIGlmICh0aGlzLnJvdXRlci51cmwgIT09IHVybCkge1xuICAgICAgdGhpcy5zdG9yZVN0YXRlID0gc3RvcmVTdGF0ZTtcbiAgICAgIHRoaXMudHJpZ2dlciA9IFJvdXRlclRyaWdnZXIuU1RPUkU7XG4gICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZUJ5VXJsKHVybCkuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICB0aGlzLmVycm9ySGFuZGxlci5oYW5kbGVFcnJvcihlcnJvcik7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHNldFVwUm91dGVyRXZlbnRzTGlzdGVuZXIoKTogdm9pZCB7XG4gICAgY29uc3QgZGlzcGF0Y2hOYXZMYXRlID1cbiAgICAgIHRoaXMuY29uZmlnLm5hdmlnYXRpb25BY3Rpb25UaW1pbmcgPT09XG4gICAgICBOYXZpZ2F0aW9uQWN0aW9uVGltaW5nLlBvc3RBY3RpdmF0aW9uO1xuICAgIGxldCByb3V0ZXNSZWNvZ25pemVkOiBSb3V0ZXNSZWNvZ25pemVkO1xuXG4gICAgdGhpcy5yb3V0ZXIuZXZlbnRzXG4gICAgICAucGlwZSh3aXRoTGF0ZXN0RnJvbSh0aGlzLnN0b3JlKSlcbiAgICAgIC5zdWJzY3JpYmUoKFtldmVudCwgc3RvcmVTdGF0ZV0pID0+IHtcbiAgICAgICAgdGhpcy5sYXN0RXZlbnQgPSBldmVudDtcblxuICAgICAgICBpZiAoZXZlbnQgaW5zdGFuY2VvZiBOYXZpZ2F0aW9uU3RhcnQpIHtcbiAgICAgICAgICB0aGlzLnJvdXRlclN0YXRlID0gdGhpcy5zZXJpYWxpemVyLnNlcmlhbGl6ZShcbiAgICAgICAgICAgIHRoaXMucm91dGVyLnJvdXRlclN0YXRlLnNuYXBzaG90XG4gICAgICAgICAgKTtcbiAgICAgICAgICBpZiAodGhpcy50cmlnZ2VyICE9PSBSb3V0ZXJUcmlnZ2VyLlNUT1JFKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3JlU3RhdGUgPSBzdG9yZVN0YXRlO1xuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaFJvdXRlclJlcXVlc3QoZXZlbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChldmVudCBpbnN0YW5jZW9mIFJvdXRlc1JlY29nbml6ZWQpIHtcbiAgICAgICAgICByb3V0ZXNSZWNvZ25pemVkID0gZXZlbnQ7XG5cbiAgICAgICAgICBpZiAoIWRpc3BhdGNoTmF2TGF0ZSAmJiB0aGlzLnRyaWdnZXIgIT09IFJvdXRlclRyaWdnZXIuU1RPUkUpIHtcbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hSb3V0ZXJOYXZpZ2F0aW9uKGV2ZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnQgaW5zdGFuY2VvZiBOYXZpZ2F0aW9uQ2FuY2VsKSB7XG4gICAgICAgICAgdGhpcy5kaXNwYXRjaFJvdXRlckNhbmNlbChldmVudCk7XG4gICAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50IGluc3RhbmNlb2YgTmF2aWdhdGlvbkVycm9yKSB7XG4gICAgICAgICAgdGhpcy5kaXNwYXRjaFJvdXRlckVycm9yKGV2ZW50KTtcbiAgICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnQgaW5zdGFuY2VvZiBOYXZpZ2F0aW9uRW5kKSB7XG4gICAgICAgICAgaWYgKHRoaXMudHJpZ2dlciAhPT0gUm91dGVyVHJpZ2dlci5TVE9SRSkge1xuICAgICAgICAgICAgaWYgKGRpc3BhdGNoTmF2TGF0ZSkge1xuICAgICAgICAgICAgICB0aGlzLmRpc3BhdGNoUm91dGVyTmF2aWdhdGlvbihyb3V0ZXNSZWNvZ25pemVkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hSb3V0ZXJOYXZpZ2F0ZWQoZXZlbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBkaXNwYXRjaFJvdXRlclJlcXVlc3QoZXZlbnQ6IE5hdmlnYXRpb25TdGFydCk6IHZvaWQge1xuICAgIHRoaXMuZGlzcGF0Y2hSb3V0ZXJBY3Rpb24oUk9VVEVSX1JFUVVFU1QsIHsgZXZlbnQgfSk7XG4gIH1cblxuICBwcml2YXRlIGRpc3BhdGNoUm91dGVyTmF2aWdhdGlvbihcbiAgICBsYXN0Um91dGVzUmVjb2duaXplZDogUm91dGVzUmVjb2duaXplZFxuICApOiB2b2lkIHtcbiAgICBjb25zdCBuZXh0Um91dGVyU3RhdGUgPSB0aGlzLnNlcmlhbGl6ZXIuc2VyaWFsaXplKFxuICAgICAgbGFzdFJvdXRlc1JlY29nbml6ZWQuc3RhdGVcbiAgICApO1xuICAgIHRoaXMuZGlzcGF0Y2hSb3V0ZXJBY3Rpb24oUk9VVEVSX05BVklHQVRJT04sIHtcbiAgICAgIHJvdXRlclN0YXRlOiBuZXh0Um91dGVyU3RhdGUsXG4gICAgICBldmVudDogbmV3IFJvdXRlc1JlY29nbml6ZWQoXG4gICAgICAgIGxhc3RSb3V0ZXNSZWNvZ25pemVkLmlkLFxuICAgICAgICBsYXN0Um91dGVzUmVjb2duaXplZC51cmwsXG4gICAgICAgIGxhc3RSb3V0ZXNSZWNvZ25pemVkLnVybEFmdGVyUmVkaXJlY3RzLFxuICAgICAgICBuZXh0Um91dGVyU3RhdGVcbiAgICAgICksXG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGRpc3BhdGNoUm91dGVyQ2FuY2VsKGV2ZW50OiBOYXZpZ2F0aW9uQ2FuY2VsKTogdm9pZCB7XG4gICAgdGhpcy5kaXNwYXRjaFJvdXRlckFjdGlvbihST1VURVJfQ0FOQ0VMLCB7XG4gICAgICBzdG9yZVN0YXRlOiB0aGlzLnN0b3JlU3RhdGUsXG4gICAgICBldmVudCxcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgZGlzcGF0Y2hSb3V0ZXJFcnJvcihldmVudDogTmF2aWdhdGlvbkVycm9yKTogdm9pZCB7XG4gICAgdGhpcy5kaXNwYXRjaFJvdXRlckFjdGlvbihST1VURVJfRVJST1IsIHtcbiAgICAgIHN0b3JlU3RhdGU6IHRoaXMuc3RvcmVTdGF0ZSxcbiAgICAgIGV2ZW50OiBuZXcgTmF2aWdhdGlvbkVycm9yKGV2ZW50LmlkLCBldmVudC51cmwsIGAke2V2ZW50fWApLFxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBkaXNwYXRjaFJvdXRlck5hdmlnYXRlZChldmVudDogTmF2aWdhdGlvbkVuZCk6IHZvaWQge1xuICAgIGNvbnN0IHJvdXRlclN0YXRlID0gdGhpcy5zZXJpYWxpemVyLnNlcmlhbGl6ZShcbiAgICAgIHRoaXMucm91dGVyLnJvdXRlclN0YXRlLnNuYXBzaG90XG4gICAgKTtcbiAgICB0aGlzLmRpc3BhdGNoUm91dGVyQWN0aW9uKFJPVVRFUl9OQVZJR0FURUQsIHsgZXZlbnQsIHJvdXRlclN0YXRlIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBkaXNwYXRjaFJvdXRlckFjdGlvbihcbiAgICB0eXBlOiBzdHJpbmcsXG4gICAgcGF5bG9hZDogU3RvcmVSb3V0ZXJBY3Rpb25QYXlsb2FkXG4gICk6IHZvaWQge1xuICAgIHRoaXMudHJpZ2dlciA9IFJvdXRlclRyaWdnZXIuUk9VVEVSO1xuICAgIHRyeSB7XG4gICAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKHtcbiAgICAgICAgdHlwZSxcbiAgICAgICAgcGF5bG9hZDoge1xuICAgICAgICAgIHJvdXRlclN0YXRlOiB0aGlzLnJvdXRlclN0YXRlLFxuICAgICAgICAgIC4uLnBheWxvYWQsXG4gICAgICAgICAgZXZlbnQ6XG4gICAgICAgICAgICB0aGlzLmNvbmZpZy5yb3V0ZXJTdGF0ZSA9PT0gUm91dGVyU3RhdGUuTWluaW1hbFxuICAgICAgICAgICAgICA/IHsgaWQ6IHBheWxvYWQuZXZlbnQuaWQsIHVybDogcGF5bG9hZC5ldmVudC51cmwgfVxuICAgICAgICAgICAgICA6IHBheWxvYWQuZXZlbnQsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdGhpcy50cmlnZ2VyID0gUm91dGVyVHJpZ2dlci5OT05FO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgcmVzZXQoKSB7XG4gICAgdGhpcy50cmlnZ2VyID0gUm91dGVyVHJpZ2dlci5OT05FO1xuICAgIHRoaXMuc3RvcmVTdGF0ZSA9IG51bGw7XG4gICAgdGhpcy5yb3V0ZXJTdGF0ZSA9IG51bGw7XG4gIH1cbn1cbiJdfQ==