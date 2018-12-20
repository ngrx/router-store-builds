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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
        this.lastEvent = null;
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
    var StoreRouterConnectingModule_1;
    StoreRouterConnectingModule = StoreRouterConnectingModule_1 = __decorate([
        NgModule({
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
        }),
        __param(4, Inject(ROUTER_CONFIG)),
        __metadata("design:paramtypes", [Store,
            Router,
            RouterStateSerializer,
            ErrorHandler, Object])
    ], StoreRouterConnectingModule);
    return StoreRouterConnectingModule;
}());
export { StoreRouterConnectingModule };
export { ɵ0 };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyX3N0b3JlX21vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvcm91dGVyLXN0b3JlL3NyYy9yb3V0ZXJfc3RvcmVfbW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLE9BQU8sRUFDTCxNQUFNLEVBQ04sY0FBYyxFQUVkLFFBQVEsRUFDUixZQUFZLEdBQ2IsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUNMLGdCQUFnQixFQUNoQixlQUFlLEVBQ2YsYUFBYSxFQUNiLE1BQU0sRUFDTixnQkFBZ0IsRUFDaEIsZUFBZSxHQUVoQixNQUFNLGlCQUFpQixDQUFDO0FBQ3pCLE9BQU8sRUFBRSxNQUFNLEVBQVksS0FBSyxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQ3RELE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUVoRCxPQUFPLEVBQ0wsYUFBYSxFQUNiLFlBQVksRUFDWixnQkFBZ0IsRUFDaEIsaUJBQWlCLEVBQ2pCLGNBQWMsR0FDZixNQUFNLFdBQVcsQ0FBQztBQUVuQixPQUFPLEVBQ0wsNEJBQTRCLEVBQzVCLHFCQUFxQixHQUd0QixNQUFNLGNBQWMsQ0FBQztBQXFCdEIsTUFBTSxDQUFOLElBQVksc0JBR1g7QUFIRCxXQUFZLHNCQUFzQjtJQUNoQyxxRkFBaUIsQ0FBQTtJQUNqQix1RkFBa0IsQ0FBQTtBQUNwQixDQUFDLEVBSFcsc0JBQXNCLEtBQXRCLHNCQUFzQixRQUdqQztBQUVELE1BQU0sQ0FBQyxJQUFNLGNBQWMsR0FBRyxJQUFJLGNBQWMsQ0FDOUMsMkNBQTJDLENBQzVDLENBQUM7QUFDRixNQUFNLENBQUMsSUFBTSxhQUFhLEdBQUcsSUFBSSxjQUFjLENBQzdDLGtDQUFrQyxDQUNuQyxDQUFDO0FBQ0YsTUFBTSxDQUFDLElBQU0sMEJBQTBCLEdB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SUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7SUFDMUIsQ0FBQzs7SUE1S1UsMkJBQTJCO1FBakJ2QyxRQUFRLENBQUM7WUFDUixTQUFTLEVBQUU7Z0JBQ1Q7b0JBQ0UsT0FBTyxFQUFFLGNBQWM7b0JBQ3ZCLFFBQVEsSUFBSTtpQkFDYjtnQkFDRDtvQkFDRSxPQUFPLEVBQUUsYUFBYTtvQkFDdEIsVUFBVSxFQUFFLG1CQUFtQjtvQkFDL0IsSUFBSSxFQUFFLENBQUMsY0FBYyxDQUFDO2lCQUN2QjtnQkFDRDtvQkFDRSxPQUFPLEVBQUUscUJBQXFCO29CQUM5QixRQUFRLEVBQUUsNEJBQTRCO2lCQUN2QzthQUNGO1NBQ0YsQ0FBQztRQWlDRyxXQUFBLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQTt5Q0FKUCxLQUFLO1lBQ0osTUFBTTtZQUNGLHFCQUFxQjtZQUNuQixZQUFZO09BL0J6QiwyQkFBMkIsQ0E2S3ZDO0lBQUQsa0NBQUM7Q0FBQSxBQTdLRCxJQTZLQztTQTdLWSwyQkFBMkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBJbmplY3QsXG4gIEluamVjdGlvblRva2VuLFxuICBNb2R1bGVXaXRoUHJvdmlkZXJzLFxuICBOZ01vZHVsZSxcbiAgRXJyb3JIYW5kbGVyLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIE5hdmlnYXRpb25DYW5jZWwsXG4gIE5hdmlnYXRpb25FcnJvcixcbiAgTmF2aWdhdGlvbkVuZCxcbiAgUm91dGVyLFxuICBSb3V0ZXNSZWNvZ25pemVkLFxuICBOYXZpZ2F0aW9uU3RhcnQsXG4gIEV2ZW50LFxufSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgc2VsZWN0LCBTZWxlY3RvciwgU3RvcmUgfSBmcm9tICdAbmdyeC9zdG9yZSc7XG5pbXBvcnQgeyB3aXRoTGF0ZXN0RnJvbSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHtcbiAgUk9VVEVSX0NBTkNFTCxcbiAgUk9VVEVSX0VSUk9SLFxuICBST1VURVJfTkFWSUdBVEVELFxuICBST1VURVJfTkFWSUdBVElPTixcbiAgUk9VVEVSX1JFUVVFU1QsXG59IGZyb20gJy4vYWN0aW9ucyc7XG5pbXBvcnQgeyBSb3V0ZXJSZWR1Y2VyU3RhdGUgfSBmcm9tICcuL3JlZHVjZXInO1xuaW1wb3J0IHtcbiAgRGVmYXVsdFJvdXRlclN0YXRlU2VyaWFsaXplcixcbiAgUm91dGVyU3RhdGVTZXJpYWxpemVyLFxuICBTZXJpYWxpemVkUm91dGVyU3RhdGVTbmFwc2hvdCxcbiAgQmFzZVJvdXRlclN0b3JlU3RhdGUsXG59IGZyb20gJy4vc2VyaWFsaXplcic7XG5cbmV4cG9ydCB0eXBlIFN0YXRlS2V5T3JTZWxlY3RvcjxcbiAgVCBleHRlbmRzIEJhc2VSb3V0ZXJTdG9yZVN0YXRlID0gU2VyaWFsaXplZFJvdXRlclN0YXRlU25hcHNob3Rcbj4gPSBzdHJpbmcgfCBTZWxlY3RvcjxhbnksIFJvdXRlclJlZHVjZXJTdGF0ZTxUPj47XG5cbmV4cG9ydCBpbnRlcmZhY2UgU3RvcmVSb3V0ZXJDb25maWc8XG4gIFQgZXh0ZW5kcyBCYXNlUm91dGVyU3RvcmVTdGF0ZSA9IFNlcmlhbGl6ZWRSb3V0ZXJTdGF0ZVNuYXBzaG90XG4+IHtcbiAgc3RhdGVLZXk/OiBTdGF0ZUtleU9yU2VsZWN0b3I8VD47XG4gIHNlcmlhbGl6ZXI/OiBuZXcgKC4uLmFyZ3M6IGFueVtdKSA9PiBSb3V0ZXJTdGF0ZVNlcmlhbGl6ZXI7XG4gIC8qKlxuICAgKiBCeSBkZWZhdWx0LCBST1VURVJfTkFWSUdBVElPTiBpcyBkaXNwYXRjaGVkIGJlZm9yZSBndWFyZHMgYW5kIHJlc29sdmVycyBydW4uXG4gICAqIFRoZXJlZm9yZSwgdGhlIGFjdGlvbiBjb3VsZCBydW4gdG9vIHNvb24sIGZvciBleGFtcGxlXG4gICAqIHRoZXJlIG1heSBiZSBhIG5hdmlnYXRpb24gY2FuY2VsIGR1ZSB0byBhIGd1YXJkIHNheWluZyB0aGUgbmF2aWdhdGlvbiBpcyBub3QgYWxsb3dlZC5cbiAgICogVG8gcnVuIFJPVVRFUl9OQVZJR0FUSU9OIGFmdGVyIGd1YXJkcyBhbmQgcmVzb2x2ZXJzLFxuICAgKiBzZXQgdGhpcyBwcm9wZXJ0eSB0byBOYXZpZ2F0aW9uQWN0aW9uVGltaW5nLlBvc3RBY3RpdmF0aW9uLlxuICAgKi9cbiAgbmF2aWdhdGlvbkFjdGlvblRpbWluZz86IE5hdmlnYXRpb25BY3Rpb25UaW1pbmc7XG59XG5cbmV4cG9ydCBlbnVtIE5hdmlnYXRpb25BY3Rpb25UaW1pbmcge1xuICBQcmVBY3RpdmF0aW9uID0gMSxcbiAgUG9zdEFjdGl2YXRpb24gPSAyLFxufVxuXG5leHBvcnQgY29uc3QgX1JPVVRFUl9DT05GSUcgPSBuZXcgSW5qZWN0aW9uVG9rZW4oXG4gICdAbmdyeC9yb3V0ZXItc3RvcmUgSW50ZXJuYWwgQ29uZmlndXJhdGlvbidcbik7XG5leHBvcnQgY29uc3QgUk9VVEVSX0NPTkZJRyA9IG5ldyBJbmplY3Rpb25Ub2tlbihcbiAgJ0BuZ3J4L3JvdXRlci1zdG9yZSBDb25maWd1cmF0aW9uJ1xuKTtcbmV4cG9ydCBjb25zdCBERUZBVUxUX1JPVVRFUl9GRUFUVVJFTkFNRSA9ICdyb3V0ZXInO1xuXG5leHBvcnQgZnVuY3Rpb24gX2NyZWF0ZVJvdXRlckNvbmZpZyhcbiAgY29uZmlnOiBTdG9yZVJvdXRlckNvbmZpZ1xuKTogU3RvcmVSb3V0ZXJDb25maWcge1xuICByZXR1cm4ge1xuICAgIHN0YXRlS2V5OiBERUZBVUxUX1JPVVRFUl9GRUFUVVJFTkFNRSxcbiAgICBzZXJpYWxpemVyOiBEZWZhdWx0Um91dGVyU3RhdGVTZXJpYWxpemVyLFxuICAgIG5hdmlnYXRpb25BY3Rpb25UaW1pbmc6IE5hdmlnYXRpb25BY3Rpb25UaW1pbmcuUHJlQWN0aXZhdGlvbixcbiAgICAuLi5jb25maWcsXG4gIH07XG59XG5cbmVudW0gUm91dGVyVHJpZ2dlciB7XG4gIE5PTkUgPSAxLFxuICBST1VURVIgPSAyLFxuICBTVE9SRSA9IDMsXG59XG5cbi8qKlxuICogQ29ubmVjdHMgUm91dGVyTW9kdWxlIHdpdGggU3RvcmVNb2R1bGUuXG4gKlxuICogRHVyaW5nIHRoZSBuYXZpZ2F0aW9uLCBiZWZvcmUgYW55IGd1YXJkcyBvciByZXNvbHZlcnMgcnVuLCB0aGUgcm91dGVyIHdpbGwgZGlzcGF0Y2hcbiAqIGEgUk9VVEVSX05BVklHQVRJT04gYWN0aW9uLCB3aGljaCBoYXMgdGhlIGZvbGxvd2luZyBzaWduYXR1cmU6XG4gKlxuICogYGBgXG4gKiBleHBvcnQgdHlwZSBSb3V0ZXJOYXZpZ2F0aW9uUGF5bG9hZCA9IHtcbiAqICAgcm91dGVyU3RhdGU6IFNlcmlhbGl6ZWRSb3V0ZXJTdGF0ZVNuYXBzaG90LFxuICogICBldmVudDogUm91dGVzUmVjb2duaXplZFxuICogfVxuICogYGBgXG4gKlxuICogRWl0aGVyIGEgcmVkdWNlciBvciBhbiBlZmZlY3QgY2FuIGJlIGludm9rZWQgaW4gcmVzcG9uc2UgdG8gdGhpcyBhY3Rpb24uXG4gKiBJZiB0aGUgaW52b2tlZCByZWR1Y2VyIHRocm93cywgdGhlIG5hdmlnYXRpb24gd2lsbCBiZSBjYW5jZWxlZC5cbiAqXG4gKiBJZiBuYXZpZ2F0aW9uIGdldHMgY2FuY2VsZWQgYmVjYXVzZSBvZiBhIGd1YXJkLCBhIFJPVVRFUl9DQU5DRUwgYWN0aW9uIHdpbGwgYmVcbiAqIGRpc3BhdGNoZWQuIElmIG5hdmlnYXRpb24gcmVzdWx0cyBpbiBhbiBlcnJvciwgYSBST1VURVJfRVJST1IgYWN0aW9uIHdpbGwgYmUgZGlzcGF0Y2hlZC5cbiAqXG4gKiBCb3RoIFJPVVRFUl9DQU5DRUwgYW5kIFJPVVRFUl9FUlJPUiBjb250YWluIHRoZSBzdG9yZSBzdGF0ZSBiZWZvcmUgdGhlIG5hdmlnYXRpb25cbiAqIHdoaWNoIGNhbiBiZSB1c2VkIHRvIHJlc3RvcmUgdGhlIGNvbnNpc3RlbmN5IG9mIHRoZSBzdG9yZS5cbiAqXG4gKiBVc2FnZTpcbiAqXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiBATmdNb2R1bGUoe1xuICogICBkZWNsYXJhdGlvbnM6IFtBcHBDbXAsIFNpbXBsZUNtcF0sXG4gKiAgIGltcG9ydHM6IFtcbiAqICAgICBCcm93c2VyTW9kdWxlLFxuICogICAgIFN0b3JlTW9kdWxlLmZvclJvb3QobWFwT2ZSZWR1Y2VycyksXG4gKiAgICAgUm91dGVyTW9kdWxlLmZvclJvb3QoW1xuICogICAgICAgeyBwYXRoOiAnJywgY29tcG9uZW50OiBTaW1wbGVDbXAgfSxcbiAqICAgICAgIHsgcGF0aDogJ25leHQnLCBjb21wb25lbnQ6IFNpbXBsZUNtcCB9XG4gKiAgICAgXSksXG4gKiAgICAgU3RvcmVSb3V0ZXJDb25uZWN0aW5nTW9kdWxlXG4gKiAgIF0sXG4gKiAgIGJvb3RzdHJhcDogW0FwcENtcF1cbiAqIH0pXG4gKiBleHBvcnQgY2xhc3MgQXBwTW9kdWxlIHtcbiAqIH1cbiAqIGBgYFxuICovXG5ATmdNb2R1bGUoe1xuICBwcm92aWRlcnM6IFtcbiAgICB7XG4gICAgICBwcm92aWRlOiBfUk9VVEVSX0NPTkZJRyxcbiAgICAgIHVzZVZhbHVlOiB7fSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHByb3ZpZGU6IFJPVVRFUl9DT05GSUcsXG4gICAgICB1c2VGYWN0b3J5OiBfY3JlYXRlUm91dGVyQ29uZmlnLFxuICAgICAgZGVwczogW19ST1VURVJfQ09ORklHXSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHByb3ZpZGU6IFJvdXRlclN0YXRlU2VyaWFsaXplcixcbiAgICAgIHVzZUNsYXNzOiBEZWZhdWx0Um91dGVyU3RhdGVTZXJpYWxpemVyLFxuICAgIH0sXG4gIF0sXG59KVxuZXhwb3J0IGNsYXNzIFN0b3JlUm91dGVyQ29ubmVjdGluZ01vZHVsZSB7XG4gIHN0YXRpYyBmb3JSb290PFxuICAgIFQgZXh0ZW5kcyBCYXNlUm91dGVyU3RvcmVTdGF0ZSA9IFNlcmlhbGl6ZWRSb3V0ZXJTdGF0ZVNuYXBzaG90XG4gID4oXG4gICAgY29uZmlnOiBTdG9yZVJvdXRlckNvbmZpZzxUPiA9IHt9XG4gICk6IE1vZHVsZVdpdGhQcm92aWRlcnM8U3RvcmVSb3V0ZXJDb25uZWN0aW5nTW9kdWxlPiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5nTW9kdWxlOiBTdG9yZVJvdXRlckNvbm5lY3RpbmdNb2R1bGUsXG4gICAgICBwcm92aWRlcnM6IFtcbiAgICAgICAgeyBwcm92aWRlOiBfUk9VVEVSX0NPTkZJRywgdXNlVmFsdWU6IGNvbmZpZyB9LFxuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogUm91dGVyU3RhdGVTZXJpYWxpemVyLFxuICAgICAgICAgIHVzZUNsYXNzOiBjb25maWcuc2VyaWFsaXplclxuICAgICAgICAgICAgPyBjb25maWcuc2VyaWFsaXplclxuICAgICAgICAgICAgOiBEZWZhdWx0Um91dGVyU3RhdGVTZXJpYWxpemVyLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSBsYXN0RXZlbnQ6IEV2ZW50IHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgcm91dGVyU3RhdGU6IFNlcmlhbGl6ZWRSb3V0ZXJTdGF0ZVNuYXBzaG90IHwgbnVsbDtcbiAgcHJpdmF0ZSBzdG9yZVN0YXRlOiBhbnk7XG4gIHByaXZhdGUgdHJpZ2dlciA9IFJvdXRlclRyaWdnZXIuTk9ORTtcblxuICBwcml2YXRlIHN0YXRlS2V5OiBTdGF0ZUtleU9yU2VsZWN0b3I7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBzdG9yZTogU3RvcmU8YW55PixcbiAgICBwcml2YXRlIHJvdXRlcjogUm91dGVyLFxuICAgIHByaXZhdGUgc2VyaWFsaXplcjogUm91dGVyU3RhdGVTZXJpYWxpemVyPFNlcmlhbGl6ZWRSb3V0ZXJTdGF0ZVNuYXBzaG90PixcbiAgICBwcml2YXRlIGVycm9ySGFuZGxlcjogRXJyb3JIYW5kbGVyLFxuICAgIEBJbmplY3QoUk9VVEVSX0NPTkZJRykgcHJpdmF0ZSBjb25maWc6IFN0b3JlUm91dGVyQ29uZmlnXG4gICkge1xuICAgIHRoaXMuc3RhdGVLZXkgPSB0aGlzLmNvbmZpZy5zdGF0ZUtleSBhcyBTdGF0ZUtleU9yU2VsZWN0b3I7XG5cbiAgICB0aGlzLnNldFVwU3RvcmVTdGF0ZUxpc3RlbmVyKCk7XG4gICAgdGhpcy5zZXRVcFJvdXRlckV2ZW50c0xpc3RlbmVyKCk7XG4gIH1cblxuICBwcml2YXRlIHNldFVwU3RvcmVTdGF0ZUxpc3RlbmVyKCk6IHZvaWQge1xuICAgIHRoaXMuc3RvcmVcbiAgICAgIC5waXBlKFxuICAgICAgICBzZWxlY3QodGhpcy5zdGF0ZUtleSksXG4gICAgICAgIHdpdGhMYXRlc3RGcm9tKHRoaXMuc3RvcmUpXG4gICAgICApXG4gICAgICAuc3Vic2NyaWJlKChbcm91dGVyU3RvcmVTdGF0ZSwgc3RvcmVTdGF0ZV0pID0+IHtcbiAgICAgICAgdGhpcy5uYXZpZ2F0ZUlmTmVlZGVkKHJvdXRlclN0b3JlU3RhdGUsIHN0b3JlU3RhdGUpO1xuICAgICAgfSk7XG4gIH1cblxuICBwcml2YXRlIG5hdmlnYXRlSWZOZWVkZWQoXG4gICAgcm91dGVyU3RvcmVTdGF0ZTogUm91dGVyUmVkdWNlclN0YXRlLFxuICAgIHN0b3JlU3RhdGU6IGFueVxuICApOiB2b2lkIHtcbiAgICBpZiAoIXJvdXRlclN0b3JlU3RhdGUgfHwgIXJvdXRlclN0b3JlU3RhdGUuc3RhdGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHRoaXMudHJpZ2dlciA9PT0gUm91dGVyVHJpZ2dlci5ST1VURVIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHRoaXMubGFzdEV2ZW50IGluc3RhbmNlb2YgTmF2aWdhdGlvblN0YXJ0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgdXJsID0gcm91dGVyU3RvcmVTdGF0ZS5zdGF0ZS51cmw7XG4gICAgaWYgKHRoaXMucm91dGVyLnVybCAhPT0gdXJsKSB7XG4gICAgICB0aGlzLnN0b3JlU3RhdGUgPSBzdG9yZVN0YXRlO1xuICAgICAgdGhpcy50cmlnZ2VyID0gUm91dGVyVHJpZ2dlci5TVE9SRTtcbiAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlQnlVcmwodXJsKS5jYXRjaChlcnJvciA9PiB7XG4gICAgICAgIHRoaXMuZXJyb3JIYW5kbGVyLmhhbmRsZUVycm9yKGVycm9yKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgc2V0VXBSb3V0ZXJFdmVudHNMaXN0ZW5lcigpOiB2b2lkIHtcbiAgICBjb25zdCBkaXNwYXRjaE5hdkxhdGUgPVxuICAgICAgdGhpcy5jb25maWcubmF2aWdhdGlvbkFjdGlvblRpbWluZyA9PT1cbiAgICAgIE5hdmlnYXRpb25BY3Rpb25UaW1pbmcuUG9zdEFjdGl2YXRpb247XG4gICAgbGV0IHJvdXRlc1JlY29nbml6ZWQ6IFJvdXRlc1JlY29nbml6ZWQ7XG5cbiAgICB0aGlzLnJvdXRlci5ldmVudHNcbiAgICAgIC5waXBlKHdpdGhMYXRlc3RGcm9tKHRoaXMuc3RvcmUpKVxuICAgICAgLnN1YnNjcmliZSgoW2V2ZW50LCBzdG9yZVN0YXRlXSkgPT4ge1xuICAgICAgICB0aGlzLmxhc3RFdmVudCA9IGV2ZW50O1xuXG4gICAgICAgIGlmIChldmVudCBpbnN0YW5jZW9mIE5hdmlnYXRpb25TdGFydCkge1xuICAgICAgICAgIHRoaXMucm91dGVyU3RhdGUgPSB0aGlzLnNlcmlhbGl6ZXIuc2VyaWFsaXplKFxuICAgICAgICAgICAgdGhpcy5yb3V0ZXIucm91dGVyU3RhdGUuc25hcHNob3RcbiAgICAgICAgICApO1xuICAgICAgICAgIGlmICh0aGlzLnRyaWdnZXIgIT09IFJvdXRlclRyaWdnZXIuU1RPUkUpIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcmVTdGF0ZSA9IHN0b3JlU3RhdGU7XG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoUm91dGVyUmVxdWVzdChldmVudCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50IGluc3RhbmNlb2YgUm91dGVzUmVjb2duaXplZCkge1xuICAgICAgICAgIHJvdXRlc1JlY29nbml6ZWQgPSBldmVudDtcblxuICAgICAgICAgIGlmICghZGlzcGF0Y2hOYXZMYXRlICYmIHRoaXMudHJpZ2dlciAhPT0gUm91dGVyVHJpZ2dlci5TVE9SRSkge1xuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaFJvdXRlck5hdmlnYXRpb24oZXZlbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChldmVudCBpbnN0YW5jZW9mIE5hdmlnYXRpb25DYW5jZWwpIHtcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoUm91dGVyQ2FuY2VsKGV2ZW50KTtcbiAgICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnQgaW5zdGFuY2VvZiBOYXZpZ2F0aW9uRXJyb3IpIHtcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoUm91dGVyRXJyb3IoZXZlbnQpO1xuICAgICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICAgICAgfSBlbHNlIGlmIChldmVudCBpbnN0YW5jZW9mIE5hdmlnYXRpb25FbmQpIHtcbiAgICAgICAgICBpZiAodGhpcy50cmlnZ2VyICE9PSBSb3V0ZXJUcmlnZ2VyLlNUT1JFKSB7XG4gICAgICAgICAgICBpZiAoZGlzcGF0Y2hOYXZMYXRlKSB7XG4gICAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hSb3V0ZXJOYXZpZ2F0aW9uKHJvdXRlc1JlY29nbml6ZWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaFJvdXRlck5hdmlnYXRlZChldmVudCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGRpc3BhdGNoUm91dGVyUmVxdWVzdChldmVudDogTmF2aWdhdGlvblN0YXJ0KTogdm9pZCB7XG4gICAgdGhpcy5kaXNwYXRjaFJvdXRlckFjdGlvbihST1VURVJfUkVRVUVTVCwgeyBldmVudCB9KTtcbiAgfVxuXG4gIHByaXZhdGUgZGlzcGF0Y2hSb3V0ZXJOYXZpZ2F0aW9uKFxuICAgIGxhc3RSb3V0ZXNSZWNvZ25pemVkOiBSb3V0ZXNSZWNvZ25pemVkXG4gICk6IHZvaWQge1xuICAgIGNvbnN0IG5leHRSb3V0ZXJTdGF0ZSA9IHRoaXMuc2VyaWFsaXplci5zZXJpYWxpemUoXG4gICAgICBsYXN0Um91dGVzUmVjb2duaXplZC5zdGF0ZVxuICAgICk7XG4gICAgdGhpcy5kaXNwYXRjaFJvdXRlckFjdGlvbihST1VURVJfTkFWSUdBVElPTiwge1xuICAgICAgcm91dGVyU3RhdGU6IG5leHRSb3V0ZXJTdGF0ZSxcbiAgICAgIGV2ZW50OiBuZXcgUm91dGVzUmVjb2duaXplZChcbiAgICAgICAgbGFzdFJvdXRlc1JlY29nbml6ZWQuaWQsXG4gICAgICAgIGxhc3RSb3V0ZXNSZWNvZ25pemVkLnVybCxcbiAgICAgICAgbGFzdFJvdXRlc1JlY29nbml6ZWQudXJsQWZ0ZXJSZWRpcmVjdHMsXG4gICAgICAgIG5leHRSb3V0ZXJTdGF0ZVxuICAgICAgKSxcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgZGlzcGF0Y2hSb3V0ZXJDYW5jZWwoZXZlbnQ6IE5hdmlnYXRpb25DYW5jZWwpOiB2b2lkIHtcbiAgICB0aGlzLmRpc3BhdGNoUm91dGVyQWN0aW9uKFJPVVRFUl9DQU5DRUwsIHtcbiAgICAgIHJvdXRlclN0YXRlOiB0aGlzLnJvdXRlclN0YXRlISxcbiAgICAgIHN0b3JlU3RhdGU6IHRoaXMuc3RvcmVTdGF0ZSxcbiAgICAgIGV2ZW50LFxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBkaXNwYXRjaFJvdXRlckVycm9yKGV2ZW50OiBOYXZpZ2F0aW9uRXJyb3IpOiB2b2lkIHtcbiAgICB0aGlzLmRpc3BhdGNoUm91dGVyQWN0aW9uKFJPVVRFUl9FUlJPUiwge1xuICAgICAgcm91dGVyU3RhdGU6IHRoaXMucm91dGVyU3RhdGUhLFxuICAgICAgc3RvcmVTdGF0ZTogdGhpcy5zdG9yZVN0YXRlLFxuICAgICAgZXZlbnQ6IG5ldyBOYXZpZ2F0aW9uRXJyb3IoZXZlbnQuaWQsIGV2ZW50LnVybCwgYCR7ZXZlbnR9YCksXG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGRpc3BhdGNoUm91dGVyTmF2aWdhdGVkKGV2ZW50OiBOYXZpZ2F0aW9uRW5kKTogdm9pZCB7XG4gICAgdGhpcy5kaXNwYXRjaFJvdXRlckFjdGlvbihST1VURVJfTkFWSUdBVEVELCB7IGV2ZW50IH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBkaXNwYXRjaFJvdXRlckFjdGlvbih0eXBlOiBzdHJpbmcsIHBheWxvYWQ6IGFueSk6IHZvaWQge1xuICAgIHRoaXMudHJpZ2dlciA9IFJvdXRlclRyaWdnZXIuUk9VVEVSO1xuICAgIHRyeSB7XG4gICAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKHsgdHlwZSwgcGF5bG9hZCB9KTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdGhpcy50cmlnZ2VyID0gUm91dGVyVHJpZ2dlci5OT05FO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgcmVzZXQoKSB7XG4gICAgdGhpcy50cmlnZ2VyID0gUm91dGVyVHJpZ2dlci5OT05FO1xuICAgIHRoaXMuc3RvcmVTdGF0ZSA9IG51bGw7XG4gICAgdGhpcy5yb3V0ZXJTdGF0ZSA9IG51bGw7XG4gIH1cbn1cbiJdfQ==