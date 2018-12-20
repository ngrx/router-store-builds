/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Inject, InjectionToken, NgModule, ErrorHandler, } from '@angular/core';
import { NavigationCancel, NavigationError, NavigationEnd, Router, RoutesRecognized, NavigationStart, } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { withLatestFrom } from 'rxjs/operators';
import { ROUTER_CANCEL, ROUTER_ERROR, ROUTER_NAVIGATED, ROUTER_NAVIGATION, ROUTER_REQUEST, } from './actions';
import { DefaultRouterStateSerializer, RouterStateSerializer, } from './serializer';
/** @typedef {?} */
var StateKeyOrSelector;
export { StateKeyOrSelector };
// unsupported: template constraints.
/**
 * @record
 * @template T
 */
export function StoreRouterConfig() { }
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
/** @enum {number} */
var NavigationActionTiming = {
    PreActivation: 1,
    PostActivation: 2,
};
export { NavigationActionTiming };
NavigationActionTiming[NavigationActionTiming.PreActivation] = 'PreActivation';
NavigationActionTiming[NavigationActionTiming.PostActivation] = 'PostActivation';
/** @type {?} */
export const _ROUTER_CONFIG = new InjectionToken('@ngrx/router-store Internal Configuration');
/** @type {?} */
export const ROUTER_CONFIG = new InjectionToken('@ngrx/router-store Configuration');
/** @type {?} */
export const DEFAULT_ROUTER_FEATURENAME = 'router';
/**
 * @param {?} config
 * @return {?}
 */
export function _createRouterConfig(config) {
    return Object.assign({ stateKey: DEFAULT_ROUTER_FEATURENAME, serializer: DefaultRouterStateSerializer, navigationActionTiming: NavigationActionTiming.PreActivation }, config);
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
const ɵ0 = {};
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
     * @param {?} errorHandler
     * @param {?} config
     */
    constructor(store, router, serializer, errorHandler, config) {
        this.store = store;
        this.router = router;
        this.serializer = serializer;
        this.errorHandler = errorHandler;
        this.config = config;
        this.lastEvent = null;
        this.trigger = RouterTrigger.NONE;
        this.stateKey = /** @type {?} */ (this.config.stateKey);
        this.setUpStoreStateListener();
        this.setUpRouterEventsListener();
    }
    /**
     * @template T
     * @param {?=} config
     * @return {?}
     */
    static forRoot(config = {}) {
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
    }
    /**
     * @return {?}
     */
    setUpStoreStateListener() {
        this.store
            .pipe(select(this.stateKey), withLatestFrom(this.store))
            .subscribe(([routerStoreState, storeState]) => {
            this.navigateIfNeeded(routerStoreState, storeState);
        });
    }
    /**
     * @param {?} routerStoreState
     * @param {?} storeState
     * @return {?}
     */
    navigateIfNeeded(routerStoreState, storeState) {
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
        const url = routerStoreState.state.url;
        if (this.router.url !== url) {
            this.storeState = storeState;
            this.trigger = RouterTrigger.STORE;
            this.router.navigateByUrl(url).catch(error => {
                this.errorHandler.handleError(error);
            });
        }
    }
    /**
     * @return {?}
     */
    setUpRouterEventsListener() {
        /** @type {?} */
        const dispatchNavLate = this.config.navigationActionTiming ===
            NavigationActionTiming.PostActivation;
        /** @type {?} */
        let routesRecognized;
        this.router.events
            .pipe(withLatestFrom(this.store))
            .subscribe(([event, storeState]) => {
            this.lastEvent = event;
            if (event instanceof NavigationStart) {
                this.routerState = this.serializer.serialize(this.router.routerState.snapshot);
                if (this.trigger !== RouterTrigger.STORE) {
                    this.storeState = storeState;
                    this.dispatchRouterRequest(event);
                }
            }
            else if (event instanceof RoutesRecognized) {
                routesRecognized = event;
                if (!dispatchNavLate && this.trigger !== RouterTrigger.STORE) {
                    this.dispatchRouterNavigation(event);
                }
            }
            else if (event instanceof NavigationCancel) {
                this.dispatchRouterCancel(event);
                this.reset();
            }
            else if (event instanceof NavigationError) {
                this.dispatchRouterError(event);
                this.reset();
            }
            else if (event instanceof NavigationEnd) {
                if (this.trigger !== RouterTrigger.STORE) {
                    if (dispatchNavLate) {
                        this.dispatchRouterNavigation(routesRecognized);
                    }
                    this.dispatchRouterNavigated(event);
                }
                this.reset();
            }
        });
    }
    /**
     * @param {?} event
     * @return {?}
     */
    dispatchRouterRequest(event) {
        this.dispatchRouterAction(ROUTER_REQUEST, { event });
    }
    /**
     * @param {?} lastRoutesRecognized
     * @return {?}
     */
    dispatchRouterNavigation(lastRoutesRecognized) {
        /** @type {?} */
        const nextRouterState = this.serializer.serialize(lastRoutesRecognized.state);
        this.dispatchRouterAction(ROUTER_NAVIGATION, {
            routerState: nextRouterState,
            event: new RoutesRecognized(lastRoutesRecognized.id, lastRoutesRecognized.url, lastRoutesRecognized.urlAfterRedirects, nextRouterState),
        });
    }
    /**
     * @param {?} event
     * @return {?}
     */
    dispatchRouterCancel(event) {
        this.dispatchRouterAction(ROUTER_CANCEL, {
            routerState: /** @type {?} */ ((this.routerState)),
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
            routerState: /** @type {?} */ ((this.routerState)),
            storeState: this.storeState,
            event: new NavigationError(event.id, event.url, `${event}`),
        });
    }
    /**
     * @param {?} event
     * @return {?}
     */
    dispatchRouterNavigated(event) {
        this.dispatchRouterAction(ROUTER_NAVIGATED, { event });
    }
    /**
     * @param {?} type
     * @param {?} payload
     * @return {?}
     */
    dispatchRouterAction(type, payload) {
        this.trigger = RouterTrigger.ROUTER;
        try {
            this.store.dispatch({ type, payload });
        }
        finally {
            this.trigger = RouterTrigger.NONE;
        }
    }
    /**
     * @return {?}
     */
    reset() {
        this.trigger = RouterTrigger.NONE;
        this.storeState = null;
        this.routerState = null;
    }
}
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
StoreRouterConnectingModule.ctorParameters = () => [
    { type: Store },
    { type: Router },
    { type: RouterStateSerializer },
    { type: ErrorHandler },
    { type: undefined, decorators: [{ type: Inject, args: [ROUTER_CONFIG,] }] }
];
if (false) {
    /** @type {?} */
    StoreRouterConnectingModule.prototype.lastEvent;
    /** @type {?} */
    StoreRouterConnectingModule.prototype.routerState;
    /** @type {?} */
    StoreRouterConnectingModule.prototype.storeState;
    /** @type {?} */
    StoreRouterConnectingModule.prototype.trigger;
    /** @type {?} */
    StoreRouterConnectingModule.prototype.stateKey;
    /** @type {?} */
    StoreRouterConnectingModule.prototype.store;
    /** @type {?} */
    StoreRouterConnectingModule.prototype.router;
    /** @type {?} */
    StoreRouterConnectingModule.prototype.serializer;
    /** @type {?} */
    StoreRouterConnectingModule.prototype.errorHandler;
    /** @type {?} */
    StoreRouterConnectingModule.prototype.config;
}
export { ɵ0 };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyX3N0b3JlX21vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvcm91dGVyLXN0b3JlL3NyYy9yb3V0ZXJfc3RvcmVfbW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQ0wsTUFBTSxFQUNOLGNBQWMsRUFFZCxRQUFRLEVBQ1IsWUFBWSxHQUNiLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFDTCxnQkFBZ0IsRUFDaEIsZUFBZSxFQUNmLGFBQWEsRUFDYixNQUFNLEVBQ04sZ0JBQWdCLEVBQ2hCLGVBQWUsR0FFaEIsTUFBTSxpQkFBaUIsQ0FBQztBQUN6QixPQUFPLEVBQUUsTUFBTSxFQUFZLEtBQUssRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUN0RCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFaEQsT0FBTyxFQUNMLGFBQWEsRUFDYixZQUFZLEVBQ1osZ0JBQWdCLEVBQ2hCLGlCQUFpQixFQUNqQixjQUFjLEdBQ2YsTUFBTSxXQUFXLENBQUM7QUFFbkIsT0FBTyxFQUNMLDRCQUE0QixFQUM1QixxQkFBcUIsR0FHdEIsTUFBTSxjQUFjLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFzQnBCLGdCQUFpQjtJQUNqQixpQkFBa0I7Ozs4Q0FEbEIsYUFBYTs4Q0FDYixjQUFjOztBQUdoQixhQUFhLGNBQWMsR0FBRyxJQUFJLGNBQWMsQ0FDOUMsMkNBQTJDLENBQzVDLENBQUM7O0FBQ0YsYUFBYSxhQUFhLEdBQUcsSUFBSSxjQUFjLENBQzdDLGtDQUFrQyxDQUNuQyxDQUFDOztBQUNGLGFBQWEsMEJBQTBCLEdBQUcsUUFBUSxDQUFDOzs7OztBQUVuRCxNQUFNLFVBQVUsbUJBQW1CLENBQ2pDLE1BQXlCO0lBRXpCLHVCQUNFLFFBQVEsRUFBRSwwQkFBMEIsRUFDcEMsVUFBVSxFQUFFLDRCQUE0QixFQUN4QyxzQkFBc0Is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LENBQUMsR0FBRyxFQUFFLEdBQUcsS0FBSyxFQUFFLENBQUM7U0FDNUQsQ0FBQyxDQUFDOzs7Ozs7SUFHRyx1QkFBdUIsQ0FBQyxLQUFvQjtRQUNsRCxJQUFJLENBQUMsb0JBQW9CLENBQUMsZ0JBQWdCLEVBQUUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDOzs7Ozs7O0lBR2pELG9CQUFvQixDQUFDLElBQVksRUFBRSxPQUFZO1FBQ3JELElBQUksQ0FBQyxPQUFPLEdBQUcsYUFBYSxDQUFDLE1BQU0sQ0FBQztRQUNwQyxJQUFJO1lBQ0YsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztTQUN4QztnQkFBUztZQUNSLElBQUksQ0FBQyxPQUFPLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQztTQUNuQzs7Ozs7SUFHSyxLQUFLO1FBQ1gsSUFBSSxDQUFDLE9BQU8sR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFDO1FBQ2xDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDOzs7O1lBNUwzQixRQUFRLFNBQUM7Z0JBQ1IsU0FBUyxFQUFFO29CQUNUO3dCQUNFLE9BQU8sRUFBRSxjQUFjO3dCQUN2QixRQUFRLElBQUk7cUJBQ2I7b0JBQ0Q7d0JBQ0UsT0FBTyxFQUFFLGFBQWE7d0JBQ3RCLFVBQVUsRUFBRSxtQkFBbUI7d0JBQy9CLElBQUksRUFBRSxDQUFDLGNBQWMsQ0FBQztxQkFDdkI7b0JBQ0Q7d0JBQ0UsT0FBTyxFQUFFLHFCQUFxQjt3QkFDOUIsUUFBUSxFQUFFLDRCQUE0QjtxQkFDdkM7aUJBQ0Y7YUFDRjs7OztZQTdIMEIsS0FBSztZQUw5QixNQUFNO1lBa0JOLHFCQUFxQjtZQXhCckIsWUFBWTs0Q0F5S1QsTUFBTSxTQUFDLGFBQWEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBJbmplY3QsXG4gIEluamVjdGlvblRva2VuLFxuICBNb2R1bGVXaXRoUHJvdmlkZXJzLFxuICBOZ01vZHVsZSxcbiAgRXJyb3JIYW5kbGVyLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIE5hdmlnYXRpb25DYW5jZWwsXG4gIE5hdmlnYXRpb25FcnJvcixcbiAgTmF2aWdhdGlvbkVuZCxcbiAgUm91dGVyLFxuICBSb3V0ZXNSZWNvZ25pemVkLFxuICBOYXZpZ2F0aW9uU3RhcnQsXG4gIEV2ZW50LFxufSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgc2VsZWN0LCBTZWxlY3RvciwgU3RvcmUgfSBmcm9tICdAbmdyeC9zdG9yZSc7XG5pbXBvcnQgeyB3aXRoTGF0ZXN0RnJvbSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHtcbiAgUk9VVEVSX0NBTkNFTCxcbiAgUk9VVEVSX0VSUk9SLFxuICBST1VURVJfTkFWSUdBVEVELFxuICBST1VURVJfTkFWSUdBVElPTixcbiAgUk9VVEVSX1JFUVVFU1QsXG59IGZyb20gJy4vYWN0aW9ucyc7XG5pbXBvcnQgeyBSb3V0ZXJSZWR1Y2VyU3RhdGUgfSBmcm9tICcuL3JlZHVjZXInO1xuaW1wb3J0IHtcbiAgRGVmYXVsdFJvdXRlclN0YXRlU2VyaWFsaXplcixcbiAgUm91dGVyU3RhdGVTZXJpYWxpemVyLFxuICBTZXJpYWxpemVkUm91dGVyU3RhdGVTbmFwc2hvdCxcbiAgQmFzZVJvdXRlclN0b3JlU3RhdGUsXG59IGZyb20gJy4vc2VyaWFsaXplcic7XG5cbmV4cG9ydCB0eXBlIFN0YXRlS2V5T3JTZWxlY3RvcjxcbiAgVCBleHRlbmRzIEJhc2VSb3V0ZXJTdG9yZVN0YXRlID0gU2VyaWFsaXplZFJvdXRlclN0YXRlU25hcHNob3Rcbj4gPSBzdHJpbmcgfCBTZWxlY3RvcjxhbnksIFJvdXRlclJlZHVjZXJTdGF0ZTxUPj47XG5cbmV4cG9ydCBpbnRlcmZhY2UgU3RvcmVSb3V0ZXJDb25maWc8XG4gIFQgZXh0ZW5kcyBCYXNlUm91dGVyU3RvcmVTdGF0ZSA9IFNlcmlhbGl6ZWRSb3V0ZXJTdGF0ZVNuYXBzaG90XG4+IHtcbiAgc3RhdGVLZXk/OiBTdGF0ZUtleU9yU2VsZWN0b3I8VD47XG4gIHNlcmlhbGl6ZXI/OiBuZXcgKC4uLmFyZ3M6IGFueVtdKSA9PiBSb3V0ZXJTdGF0ZVNlcmlhbGl6ZXI7XG4gIC8qKlxuICAgKiBCeSBkZWZhdWx0LCBST1VURVJfTkFWSUdBVElPTiBpcyBkaXNwYXRjaGVkIGJlZm9yZSBndWFyZHMgYW5kIHJlc29sdmVycyBydW4uXG4gICAqIFRoZXJlZm9yZSwgdGhlIGFjdGlvbiBjb3VsZCBydW4gdG9vIHNvb24sIGZvciBleGFtcGxlXG4gICAqIHRoZXJlIG1heSBiZSBhIG5hdmlnYXRpb24gY2FuY2VsIGR1ZSB0byBhIGd1YXJkIHNheWluZyB0aGUgbmF2aWdhdGlvbiBpcyBub3QgYWxsb3dlZC5cbiAgICogVG8gcnVuIFJPVVRFUl9OQVZJR0FUSU9OIGFmdGVyIGd1YXJkcyBhbmQgcmVzb2x2ZXJzLFxuICAgKiBzZXQgdGhpcyBwcm9wZXJ0eSB0byBOYXZpZ2F0aW9uQWN0aW9uVGltaW5nLlBvc3RBY3RpdmF0aW9uLlxuICAgKi9cbiAgbmF2aWdhdGlvbkFjdGlvblRpbWluZz86IE5hdmlnYXRpb25BY3Rpb25UaW1pbmc7XG59XG5cbmV4cG9ydCBlbnVtIE5hdmlnYXRpb25BY3Rpb25UaW1pbmcge1xuICBQcmVBY3RpdmF0aW9uID0gMSxcbiAgUG9zdEFjdGl2YXRpb24gPSAyLFxufVxuXG5leHBvcnQgY29uc3QgX1JPVVRFUl9DT05GSUcgPSBuZXcgSW5qZWN0aW9uVG9rZW4oXG4gICdAbmdyeC9yb3V0ZXItc3RvcmUgSW50ZXJuYWwgQ29uZmlndXJhdGlvbidcbik7XG5leHBvcnQgY29uc3QgUk9VVEVSX0NPTkZJRyA9IG5ldyBJbmplY3Rpb25Ub2tlbihcbiAgJ0BuZ3J4L3JvdXRlci1zdG9yZSBDb25maWd1cmF0aW9uJ1xuKTtcbmV4cG9ydCBjb25zdCBERUZBVUxUX1JPVVRFUl9GRUFUVVJFTkFNRSA9ICdyb3V0ZXInO1xuXG5leHBvcnQgZnVuY3Rpb24gX2NyZWF0ZVJvdXRlckNvbmZpZyhcbiAgY29uZmlnOiBTdG9yZVJvdXRlckNvbmZpZ1xuKTogU3RvcmVSb3V0ZXJDb25maWcge1xuICByZXR1cm4ge1xuICAgIHN0YXRlS2V5OiBERUZBVUxUX1JPVVRFUl9GRUFUVVJFTkFNRSxcbiAgICBzZXJpYWxpemVyOiBEZWZhdWx0Um91dGVyU3RhdGVTZXJpYWxpemVyLFxuICAgIG5hdmlnYXRpb25BY3Rpb25UaW1pbmc6IE5hdmlnYXRpb25BY3Rpb25UaW1pbmcuUHJlQWN0aXZhdGlvbixcbiAgICAuLi5jb25maWcsXG4gIH07XG59XG5cbmVudW0gUm91dGVyVHJpZ2dlciB7XG4gIE5PTkUgPSAxLFxuICBST1VURVIgPSAyLFxuICBTVE9SRSA9IDMsXG59XG5cbi8qKlxuICogQ29ubmVjdHMgUm91dGVyTW9kdWxlIHdpdGggU3RvcmVNb2R1bGUuXG4gKlxuICogRHVyaW5nIHRoZSBuYXZpZ2F0aW9uLCBiZWZvcmUgYW55IGd1YXJkcyBvciByZXNvbHZlcnMgcnVuLCB0aGUgcm91dGVyIHdpbGwgZGlzcGF0Y2hcbiAqIGEgUk9VVEVSX05BVklHQVRJT04gYWN0aW9uLCB3aGljaCBoYXMgdGhlIGZvbGxvd2luZyBzaWduYXR1cmU6XG4gKlxuICogYGBgXG4gKiBleHBvcnQgdHlwZSBSb3V0ZXJOYXZpZ2F0aW9uUGF5bG9hZCA9IHtcbiAqICAgcm91dGVyU3RhdGU6IFNlcmlhbGl6ZWRSb3V0ZXJTdGF0ZVNuYXBzaG90LFxuICogICBldmVudDogUm91dGVzUmVjb2duaXplZFxuICogfVxuICogYGBgXG4gKlxuICogRWl0aGVyIGEgcmVkdWNlciBvciBhbiBlZmZlY3QgY2FuIGJlIGludm9rZWQgaW4gcmVzcG9uc2UgdG8gdGhpcyBhY3Rpb24uXG4gKiBJZiB0aGUgaW52b2tlZCByZWR1Y2VyIHRocm93cywgdGhlIG5hdmlnYXRpb24gd2lsbCBiZSBjYW5jZWxlZC5cbiAqXG4gKiBJZiBuYXZpZ2F0aW9uIGdldHMgY2FuY2VsZWQgYmVjYXVzZSBvZiBhIGd1YXJkLCBhIFJPVVRFUl9DQU5DRUwgYWN0aW9uIHdpbGwgYmVcbiAqIGRpc3BhdGNoZWQuIElmIG5hdmlnYXRpb24gcmVzdWx0cyBpbiBhbiBlcnJvciwgYSBST1VURVJfRVJST1IgYWN0aW9uIHdpbGwgYmUgZGlzcGF0Y2hlZC5cbiAqXG4gKiBCb3RoIFJPVVRFUl9DQU5DRUwgYW5kIFJPVVRFUl9FUlJPUiBjb250YWluIHRoZSBzdG9yZSBzdGF0ZSBiZWZvcmUgdGhlIG5hdmlnYXRpb25cbiAqIHdoaWNoIGNhbiBiZSB1c2VkIHRvIHJlc3RvcmUgdGhlIGNvbnNpc3RlbmN5IG9mIHRoZSBzdG9yZS5cbiAqXG4gKiBVc2FnZTpcbiAqXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiBATmdNb2R1bGUoe1xuICogICBkZWNsYXJhdGlvbnM6IFtBcHBDbXAsIFNpbXBsZUNtcF0sXG4gKiAgIGltcG9ydHM6IFtcbiAqICAgICBCcm93c2VyTW9kdWxlLFxuICogICAgIFN0b3JlTW9kdWxlLmZvclJvb3QobWFwT2ZSZWR1Y2VycyksXG4gKiAgICAgUm91dGVyTW9kdWxlLmZvclJvb3QoW1xuICogICAgICAgeyBwYXRoOiAnJywgY29tcG9uZW50OiBTaW1wbGVDbXAgfSxcbiAqICAgICAgIHsgcGF0aDogJ25leHQnLCBjb21wb25lbnQ6IFNpbXBsZUNtcCB9XG4gKiAgICAgXSksXG4gKiAgICAgU3RvcmVSb3V0ZXJDb25uZWN0aW5nTW9kdWxlXG4gKiAgIF0sXG4gKiAgIGJvb3RzdHJhcDogW0FwcENtcF1cbiAqIH0pXG4gKiBleHBvcnQgY2xhc3MgQXBwTW9kdWxlIHtcbiAqIH1cbiAqIGBgYFxuICovXG5ATmdNb2R1bGUoe1xuICBwcm92aWRlcnM6IFtcbiAgICB7XG4gICAgICBwcm92aWRlOiBfUk9VVEVSX0NPTkZJRyxcbiAgICAgIHVzZVZhbHVlOiB7fSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHByb3ZpZGU6IFJPVVRFUl9DT05GSUcsXG4gICAgICB1c2VGYWN0b3J5OiBfY3JlYXRlUm91dGVyQ29uZmlnLFxuICAgICAgZGVwczogW19ST1VURVJfQ09ORklHXSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHByb3ZpZGU6IFJvdXRlclN0YXRlU2VyaWFsaXplcixcbiAgICAgIHVzZUNsYXNzOiBEZWZhdWx0Um91dGVyU3RhdGVTZXJpYWxpemVyLFxuICAgIH0sXG4gIF0sXG59KVxuZXhwb3J0IGNsYXNzIFN0b3JlUm91dGVyQ29ubmVjdGluZ01vZHVsZSB7XG4gIHN0YXRpYyBmb3JSb290PFxuICAgIFQgZXh0ZW5kcyBCYXNlUm91dGVyU3RvcmVTdGF0ZSA9IFNlcmlhbGl6ZWRSb3V0ZXJTdGF0ZVNuYXBzaG90XG4gID4oXG4gICAgY29uZmlnOiBTdG9yZVJvdXRlckNvbmZpZzxUPiA9IHt9XG4gICk6IE1vZHVsZVdpdGhQcm92aWRlcnM8U3RvcmVSb3V0ZXJDb25uZWN0aW5nTW9kdWxlPiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5nTW9kdWxlOiBTdG9yZVJvdXRlckNvbm5lY3RpbmdNb2R1bGUsXG4gICAgICBwcm92aWRlcnM6IFtcbiAgICAgICAgeyBwcm92aWRlOiBfUk9VVEVSX0NPTkZJRywgdXNlVmFsdWU6IGNvbmZpZyB9LFxuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogUm91dGVyU3RhdGVTZXJpYWxpemVyLFxuICAgICAgICAgIHVzZUNsYXNzOiBjb25maWcuc2VyaWFsaXplclxuICAgICAgICAgICAgPyBjb25maWcuc2VyaWFsaXplclxuICAgICAgICAgICAgOiBEZWZhdWx0Um91dGVyU3RhdGVTZXJpYWxpemVyLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSBsYXN0RXZlbnQ6IEV2ZW50IHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgcm91dGVyU3RhdGU6IFNlcmlhbGl6ZWRSb3V0ZXJTdGF0ZVNuYXBzaG90IHwgbnVsbDtcbiAgcHJpdmF0ZSBzdG9yZVN0YXRlOiBhbnk7XG4gIHByaXZhdGUgdHJpZ2dlciA9IFJvdXRlclRyaWdnZXIuTk9ORTtcblxuICBwcml2YXRlIHN0YXRlS2V5OiBTdGF0ZUtleU9yU2VsZWN0b3I7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBzdG9yZTogU3RvcmU8YW55PixcbiAgICBwcml2YXRlIHJvdXRlcjogUm91dGVyLFxuICAgIHByaXZhdGUgc2VyaWFsaXplcjogUm91dGVyU3RhdGVTZXJpYWxpemVyPFNlcmlhbGl6ZWRSb3V0ZXJTdGF0ZVNuYXBzaG90PixcbiAgICBwcml2YXRlIGVycm9ySGFuZGxlcjogRXJyb3JIYW5kbGVyLFxuICAgIEBJbmplY3QoUk9VVEVSX0NPTkZJRykgcHJpdmF0ZSBjb25maWc6IFN0b3JlUm91dGVyQ29uZmlnXG4gICkge1xuICAgIHRoaXMuc3RhdGVLZXkgPSB0aGlzLmNvbmZpZy5zdGF0ZUtleSBhcyBTdGF0ZUtleU9yU2VsZWN0b3I7XG5cbiAgICB0aGlzLnNldFVwU3RvcmVTdGF0ZUxpc3RlbmVyKCk7XG4gICAgdGhpcy5zZXRVcFJvdXRlckV2ZW50c0xpc3RlbmVyKCk7XG4gIH1cblxuICBwcml2YXRlIHNldFVwU3RvcmVTdGF0ZUxpc3RlbmVyKCk6IHZvaWQge1xuICAgIHRoaXMuc3RvcmVcbiAgICAgIC5waXBlKFxuICAgICAgICBzZWxlY3QodGhpcy5zdGF0ZUtleSksXG4gICAgICAgIHdpdGhMYXRlc3RGcm9tKHRoaXMuc3RvcmUpXG4gICAgICApXG4gICAgICAuc3Vic2NyaWJlKChbcm91dGVyU3RvcmVTdGF0ZSwgc3RvcmVTdGF0ZV0pID0+IHtcbiAgICAgICAgdGhpcy5uYXZpZ2F0ZUlmTmVlZGVkKHJvdXRlclN0b3JlU3RhdGUsIHN0b3JlU3RhdGUpO1xuICAgICAgfSk7XG4gIH1cblxuICBwcml2YXRlIG5hdmlnYXRlSWZOZWVkZWQoXG4gICAgcm91dGVyU3RvcmVTdGF0ZTogUm91dGVyUmVkdWNlclN0YXRlLFxuICAgIHN0b3JlU3RhdGU6IGFueVxuICApOiB2b2lkIHtcbiAgICBpZiAoIXJvdXRlclN0b3JlU3RhdGUgfHwgIXJvdXRlclN0b3JlU3RhdGUuc3RhdGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHRoaXMudHJpZ2dlciA9PT0gUm91dGVyVHJpZ2dlci5ST1VURVIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHRoaXMubGFzdEV2ZW50IGluc3RhbmNlb2YgTmF2aWdhdGlvblN0YXJ0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgdXJsID0gcm91dGVyU3RvcmVTdGF0ZS5zdGF0ZS51cmw7XG4gICAgaWYgKHRoaXMucm91dGVyLnVybCAhPT0gdXJsKSB7XG4gICAgICB0aGlzLnN0b3JlU3RhdGUgPSBzdG9yZVN0YXRlO1xuICAgICAgdGhpcy50cmlnZ2VyID0gUm91dGVyVHJpZ2dlci5TVE9SRTtcbiAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlQnlVcmwodXJsKS5jYXRjaChlcnJvciA9PiB7XG4gICAgICAgIHRoaXMuZXJyb3JIYW5kbGVyLmhhbmRsZUVycm9yKGVycm9yKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgc2V0VXBSb3V0ZXJFdmVudHNMaXN0ZW5lcigpOiB2b2lkIHtcbiAgICBjb25zdCBkaXNwYXRjaE5hdkxhdGUgPVxuICAgICAgdGhpcy5jb25maWcubmF2aWdhdGlvbkFjdGlvblRpbWluZyA9PT1cbiAgICAgIE5hdmlnYXRpb25BY3Rpb25UaW1pbmcuUG9zdEFjdGl2YXRpb247XG4gICAgbGV0IHJvdXRlc1JlY29nbml6ZWQ6IFJvdXRlc1JlY29nbml6ZWQ7XG5cbiAgICB0aGlzLnJvdXRlci5ldmVudHNcbiAgICAgIC5waXBlKHdpdGhMYXRlc3RGcm9tKHRoaXMuc3RvcmUpKVxuICAgICAgLnN1YnNjcmliZSgoW2V2ZW50LCBzdG9yZVN0YXRlXSkgPT4ge1xuICAgICAgICB0aGlzLmxhc3RFdmVudCA9IGV2ZW50O1xuXG4gICAgICAgIGlmIChldmVudCBpbnN0YW5jZW9mIE5hdmlnYXRpb25TdGFydCkge1xuICAgICAgICAgIHRoaXMucm91dGVyU3RhdGUgPSB0aGlzLnNlcmlhbGl6ZXIuc2VyaWFsaXplKFxuICAgICAgICAgICAgdGhpcy5yb3V0ZXIucm91dGVyU3RhdGUuc25hcHNob3RcbiAgICAgICAgICApO1xuICAgICAgICAgIGlmICh0aGlzLnRyaWdnZXIgIT09IFJvdXRlclRyaWdnZXIuU1RPUkUpIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcmVTdGF0ZSA9IHN0b3JlU3RhdGU7XG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoUm91dGVyUmVxdWVzdChldmVudCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50IGluc3RhbmNlb2YgUm91dGVzUmVjb2duaXplZCkge1xuICAgICAgICAgIHJvdXRlc1JlY29nbml6ZWQgPSBldmVudDtcblxuICAgICAgICAgIGlmICghZGlzcGF0Y2hOYXZMYXRlICYmIHRoaXMudHJpZ2dlciAhPT0gUm91dGVyVHJpZ2dlci5TVE9SRSkge1xuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaFJvdXRlck5hdmlnYXRpb24oZXZlbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChldmVudCBpbnN0YW5jZW9mIE5hdmlnYXRpb25DYW5jZWwpIHtcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoUm91dGVyQ2FuY2VsKGV2ZW50KTtcbiAgICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnQgaW5zdGFuY2VvZiBOYXZpZ2F0aW9uRXJyb3IpIHtcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoUm91dGVyRXJyb3IoZXZlbnQpO1xuICAgICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICAgICAgfSBlbHNlIGlmIChldmVudCBpbnN0YW5jZW9mIE5hdmlnYXRpb25FbmQpIHtcbiAgICAgICAgICBpZiAodGhpcy50cmlnZ2VyICE9PSBSb3V0ZXJUcmlnZ2VyLlNUT1JFKSB7XG4gICAgICAgICAgICBpZiAoZGlzcGF0Y2hOYXZMYXRlKSB7XG4gICAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hSb3V0ZXJOYXZpZ2F0aW9uKHJvdXRlc1JlY29nbml6ZWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaFJvdXRlck5hdmlnYXRlZChldmVudCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGRpc3BhdGNoUm91dGVyUmVxdWVzdChldmVudDogTmF2aWdhdGlvblN0YXJ0KTogdm9pZCB7XG4gICAgdGhpcy5kaXNwYXRjaFJvdXRlckFjdGlvbihST1VURVJfUkVRVUVTVCwgeyBldmVudCB9KTtcbiAgfVxuXG4gIHByaXZhdGUgZGlzcGF0Y2hSb3V0ZXJOYXZpZ2F0aW9uKFxuICAgIGxhc3RSb3V0ZXNSZWNvZ25pemVkOiBSb3V0ZXNSZWNvZ25pemVkXG4gICk6IHZvaWQge1xuICAgIGNvbnN0IG5leHRSb3V0ZXJTdGF0ZSA9IHRoaXMuc2VyaWFsaXplci5zZXJpYWxpemUoXG4gICAgICBsYXN0Um91dGVzUmVjb2duaXplZC5zdGF0ZVxuICAgICk7XG4gICAgdGhpcy5kaXNwYXRjaFJvdXRlckFjdGlvbihST1VURVJfTkFWSUdBVElPTiwge1xuICAgICAgcm91dGVyU3RhdGU6IG5leHRSb3V0ZXJTdGF0ZSxcbiAgICAgIGV2ZW50OiBuZXcgUm91dGVzUmVjb2duaXplZChcbiAgICAgICAgbGFzdFJvdXRlc1JlY29nbml6ZWQuaWQsXG4gICAgICAgIGxhc3RSb3V0ZXNSZWNvZ25pemVkLnVybCxcbiAgICAgICAgbGFzdFJvdXRlc1JlY29nbml6ZWQudXJsQWZ0ZXJSZWRpcmVjdHMsXG4gICAgICAgIG5leHRSb3V0ZXJTdGF0ZVxuICAgICAgKSxcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgZGlzcGF0Y2hSb3V0ZXJDYW5jZWwoZXZlbnQ6IE5hdmlnYXRpb25DYW5jZWwpOiB2b2lkIHtcbiAgICB0aGlzLmRpc3BhdGNoUm91dGVyQWN0aW9uKFJPVVRFUl9DQU5DRUwsIHtcbiAgICAgIHJvdXRlclN0YXRlOiB0aGlzLnJvdXRlclN0YXRlISxcbiAgICAgIHN0b3JlU3RhdGU6IHRoaXMuc3RvcmVTdGF0ZSxcbiAgICAgIGV2ZW50LFxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBkaXNwYXRjaFJvdXRlckVycm9yKGV2ZW50OiBOYXZpZ2F0aW9uRXJyb3IpOiB2b2lkIHtcbiAgICB0aGlzLmRpc3BhdGNoUm91dGVyQWN0aW9uKFJPVVRFUl9FUlJPUiwge1xuICAgICAgcm91dGVyU3RhdGU6IHRoaXMucm91dGVyU3RhdGUhLFxuICAgICAgc3RvcmVTdGF0ZTogdGhpcy5zdG9yZVN0YXRlLFxuICAgICAgZXZlbnQ6IG5ldyBOYXZpZ2F0aW9uRXJyb3IoZXZlbnQuaWQsIGV2ZW50LnVybCwgYCR7ZXZlbnR9YCksXG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGRpc3BhdGNoUm91dGVyTmF2aWdhdGVkKGV2ZW50OiBOYXZpZ2F0aW9uRW5kKTogdm9pZCB7XG4gICAgdGhpcy5kaXNwYXRjaFJvdXRlckFjdGlvbihST1VURVJfTkFWSUdBVEVELCB7IGV2ZW50IH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBkaXNwYXRjaFJvdXRlckFjdGlvbih0eXBlOiBzdHJpbmcsIHBheWxvYWQ6IGFueSk6IHZvaWQge1xuICAgIHRoaXMudHJpZ2dlciA9IFJvdXRlclRyaWdnZXIuUk9VVEVSO1xuICAgIHRyeSB7XG4gICAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKHsgdHlwZSwgcGF5bG9hZCB9KTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdGhpcy50cmlnZ2VyID0gUm91dGVyVHJpZ2dlci5OT05FO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgcmVzZXQoKSB7XG4gICAgdGhpcy50cmlnZ2VyID0gUm91dGVyVHJpZ2dlci5OT05FO1xuICAgIHRoaXMuc3RvcmVTdGF0ZSA9IG51bGw7XG4gICAgdGhpcy5yb3V0ZXJTdGF0ZSA9IG51bGw7XG4gIH1cbn1cbiJdfQ==