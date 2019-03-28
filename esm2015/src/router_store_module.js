/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Inject, InjectionToken, NgModule, ErrorHandler, } from '@angular/core';
import { NavigationCancel, NavigationError, NavigationEnd, Router, RoutesRecognized, NavigationStart, } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { withLatestFrom } from 'rxjs/operators';
import { ROUTER_CANCEL, ROUTER_ERROR, ROUTER_NAVIGATED, ROUTER_NAVIGATION, ROUTER_REQUEST, } from './actions';
import { DefaultRouterStateSerializer, RouterStateSerializer, } from './serializer';
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
const NavigationActionTiming = {
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
const RouterTrigger = {
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
        this.stateKey = (/** @type {?} */ (this.config.stateKey));
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
     * @private
     * @return {?}
     */
    setUpStoreStateListener() {
        this.store
            .pipe(select(this.stateKey), withLatestFrom(this.store))
            .subscribe((/**
         * @param {?} __0
         * @return {?}
         */
        ([routerStoreState, storeState]) => {
            this.navigateIfNeeded(routerStoreState, storeState);
        }));
    }
    /**
     * @private
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
            this.router.navigateByUrl(url).catch((/**
             * @param {?} error
             * @return {?}
             */
            error => {
                this.errorHandler.handleError(error);
            }));
        }
    }
    /**
     * @private
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
            .subscribe((/**
         * @param {?} __0
         * @return {?}
         */
        ([event, storeState]) => {
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
        }));
    }
    /**
     * @private
     * @param {?} event
     * @return {?}
     */
    dispatchRouterRequest(event) {
        this.dispatchRouterAction(ROUTER_REQUEST, { event });
    }
    /**
     * @private
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
     * @private
     * @param {?} event
     * @return {?}
     */
    dispatchRouterCancel(event) {
        this.dispatchRouterAction(ROUTER_CANCEL, {
            storeState: this.storeState,
            event,
        });
    }
    /**
     * @private
     * @param {?} event
     * @return {?}
     */
    dispatchRouterError(event) {
        this.dispatchRouterAction(ROUTER_ERROR, {
            storeState: this.storeState,
            event: new NavigationError(event.id, event.url, `${event}`),
        });
    }
    /**
     * @private
     * @param {?} event
     * @return {?}
     */
    dispatchRouterNavigated(event) {
        /** @type {?} */
        const routerState = this.serializer.serialize(this.router.routerState.snapshot);
        this.dispatchRouterAction(ROUTER_NAVIGATED, { event, routerState });
    }
    /**
     * @private
     * @param {?} type
     * @param {?} payload
     * @return {?}
     */
    dispatchRouterAction(type, payload) {
        this.trigger = RouterTrigger.ROUTER;
        try {
            this.store.dispatch({
                type,
                payload: Object.assign({ routerState: this.routerState }, payload),
            });
        }
        finally {
            this.trigger = RouterTrigger.NONE;
        }
    }
    /**
     * @private
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
export { ɵ0 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyX3N0b3JlX21vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvcm91dGVyLXN0b3JlL3NyYy9yb3V0ZXJfc3RvcmVfbW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQ0wsTUFBTSxFQUNOLGNBQWMsRUFFZCxRQUFRLEVBQ1IsWUFBWSxHQUNiLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFDTCxnQkFBZ0IsRUFDaEIsZUFBZSxFQUNmLGFBQWEsRUFDYixNQUFNLEVBQ04sZ0JBQWdCLEVBQ2hCLGVBQWUsR0FHaEIsTUFBTSxpQkFBaUIsQ0FBQztBQUN6QixPQUFPLEVBQUUsTUFBTSxFQUFZLEtBQUssRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUN0RCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFaEQsT0FBTyxFQUNMLGFBQWEsRUFDYixZQUFZLEVBQ1osZ0JBQWdCLEVBQ2hCLGlCQUFpQixFQUNqQixjQUFjLEdBQ2YsTUFBTSxXQUFXLENBQUM7QUFFbkIsT0FBTyxFQUNMLDRCQUE0QixFQUM1QixxQkFBcUIsR0FHdEIsTUFBTSxjQUFjLENBQUM7Ozs7O0FBTXRCLHVDQWFDOzs7SUFWQyxxQ0FBaUM7O0lBQ2pDLHVDQUEyRDs7Ozs7Ozs7O0lBUTNELG1EQUFnRDs7Ozs7QUFHbEQsdUNBSUM7OztJQUhDLHlDQUFtQjs7SUFDbkIsK0NBQTRDOztJQUM1Qyw4Q0FBaUI7Ozs7SUFJakIsZ0JBQWlCO0lBQ2pCLGlCQUFrQjs7Ozs7O0FBR3BCLE1BQU0sT0FBTyxjQUFjLEdBQUcsSUFBSSxjQUFjLENBQzlDLDJDQUEyQyxDQUM1Qzs7QUFDRCxNQUFNLE9BQU8sYUFBYSxHQUFHLElBQUksY0FBYyxDQUM3QyxrQ0FBa0MsQ0FDbkM7O0FBQ0QsTUFBTSxPQUFPLDBCQUEwQixHQUFHLFFBQVE7Ozs7O0FBRWxELE1BQU0sVUFBVSxtQkFB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O3dCQUNFLE9BQU8sRUFBRSxhQUFhO3dCQUN0QixVQUFVLEVBQUUsbUJBQW1CO3dCQUMvQixJQUFJLEVBQUUsQ0FBQyxjQUFjLENBQUM7cUJBQ3ZCO29CQUNEO3dCQUNFLE9BQU8sRUFBRSxxQkFBcUI7d0JBQzlCLFFBQVEsRUFBRSw0QkFBNEI7cUJBQ3ZDO2lCQUNGO2FBQ0Y7Ozs7WUFuSTBCLEtBQUs7WUFOOUIsTUFBTTtZQW1CTixxQkFBcUI7WUF6QnJCLFlBQVk7NENBZ0xULE1BQU0sU0FBQyxhQUFhOzs7Ozs7O0lBWnZCLGdEQUF1Qzs7Ozs7SUFDdkMsa0RBQTBEOzs7OztJQUMxRCxpREFBd0I7Ozs7O0lBQ3hCLDhDQUFxQzs7Ozs7SUFFckMsK0NBQXFDOzs7OztJQUduQyw0Q0FBeUI7Ozs7O0lBQ3pCLDZDQUFzQjs7Ozs7SUFDdEIsaURBQXdFOzs7OztJQUN4RSxtREFBa0M7Ozs7O0lBQ2xDLDZDQUF3RCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIEluamVjdCxcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIE1vZHVsZVdpdGhQcm92aWRlcnMsXG4gIE5nTW9kdWxlLFxuICBFcnJvckhhbmRsZXIsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgTmF2aWdhdGlvbkNhbmNlbCxcbiAgTmF2aWdhdGlvbkVycm9yLFxuICBOYXZpZ2F0aW9uRW5kLFxuICBSb3V0ZXIsXG4gIFJvdXRlc1JlY29nbml6ZWQsXG4gIE5hdmlnYXRpb25TdGFydCxcbiAgRXZlbnQsXG4gIFJvdXRlckV2ZW50LFxufSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgc2VsZWN0LCBTZWxlY3RvciwgU3RvcmUgfSBmcm9tICdAbmdyeC9zdG9yZSc7XG5pbXBvcnQgeyB3aXRoTGF0ZXN0RnJvbSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHtcbiAgUk9VVEVSX0NBTkNFTCxcbiAgUk9VVEVSX0VSUk9SLFxuICBST1VURVJfTkFWSUdBVEVELFxuICBST1VURVJfTkFWSUdBVElPTixcbiAgUk9VVEVSX1JFUVVFU1QsXG59IGZyb20gJy4vYWN0aW9ucyc7XG5pbXBvcnQgeyBSb3V0ZXJSZWR1Y2VyU3RhdGUgfSBmcm9tICcuL3JlZHVjZXInO1xuaW1wb3J0IHtcbiAgRGVmYXVsdFJvdXRlclN0YXRlU2VyaWFsaXplcixcbiAgUm91dGVyU3RhdGVTZXJpYWxpemVyLFxuICBTZXJpYWxpemVkUm91dGVyU3RhdGVTbmFwc2hvdCxcbiAgQmFzZVJvdXRlclN0b3JlU3RhdGUsXG59IGZyb20gJy4vc2VyaWFsaXplcic7XG5cbmV4cG9ydCB0eXBlIFN0YXRlS2V5T3JTZWxlY3RvcjxcbiAgVCBleHRlbmRzIEJhc2VSb3V0ZXJTdG9yZVN0YXRlID0gU2VyaWFsaXplZFJvdXRlclN0YXRlU25hcHNob3Rcbj4gPSBzdHJpbmcgfCBTZWxlY3RvcjxhbnksIFJvdXRlclJlZHVjZXJTdGF0ZTxUPj47XG5cbmV4cG9ydCBpbnRlcmZhY2UgU3RvcmVSb3V0ZXJDb25maWc8XG4gIFQgZXh0ZW5kcyBCYXNlUm91dGVyU3RvcmVTdGF0ZSA9IFNlcmlhbGl6ZWRSb3V0ZXJTdGF0ZVNuYXBzaG90XG4+IHtcbiAgc3RhdGVLZXk/OiBTdGF0ZUtleU9yU2VsZWN0b3I8VD47XG4gIHNlcmlhbGl6ZXI/OiBuZXcgKC4uLmFyZ3M6IGFueVtdKSA9PiBSb3V0ZXJTdGF0ZVNlcmlhbGl6ZXI7XG4gIC8qKlxuICAgKiBCeSBkZWZhdWx0LCBST1VURVJfTkFWSUdBVElPTiBpcyBkaXNwYXRjaGVkIGJlZm9yZSBndWFyZHMgYW5kIHJlc29sdmVycyBydW4uXG4gICAqIFRoZXJlZm9yZSwgdGhlIGFjdGlvbiBjb3VsZCBydW4gdG9vIHNvb24sIGZvciBleGFtcGxlXG4gICAqIHRoZXJlIG1heSBiZSBhIG5hdmlnYXRpb24gY2FuY2VsIGR1ZSB0byBhIGd1YXJkIHNheWluZyB0aGUgbmF2aWdhdGlvbiBpcyBub3QgYWxsb3dlZC5cbiAgICogVG8gcnVuIFJPVVRFUl9OQVZJR0FUSU9OIGFmdGVyIGd1YXJkcyBhbmQgcmVzb2x2ZXJzLFxuICAgKiBzZXQgdGhpcyBwcm9wZXJ0eSB0byBOYXZpZ2F0aW9uQWN0aW9uVGltaW5nLlBvc3RBY3RpdmF0aW9uLlxuICAgKi9cbiAgbmF2aWdhdGlvbkFjdGlvblRpbWluZz86IE5hdmlnYXRpb25BY3Rpb25UaW1pbmc7XG59XG5cbmludGVyZmFjZSBTdG9yZVJvdXRlckFjdGlvblBheWxvYWQge1xuICBldmVudDogUm91dGVyRXZlbnQ7XG4gIHJvdXRlclN0YXRlPzogU2VyaWFsaXplZFJvdXRlclN0YXRlU25hcHNob3Q7XG4gIHN0b3JlU3RhdGU/OiBhbnk7XG59XG5cbmV4cG9ydCBlbnVtIE5hdmlnYXRpb25BY3Rpb25UaW1pbmcge1xuICBQcmVBY3RpdmF0aW9uID0gMSxcbiAgUG9zdEFjdGl2YXRpb24gPSAyLFxufVxuXG5leHBvcnQgY29uc3QgX1JPVVRFUl9DT05GSUcgPSBuZXcgSW5qZWN0aW9uVG9rZW4oXG4gICdAbmdyeC9yb3V0ZXItc3RvcmUgSW50ZXJuYWwgQ29uZmlndXJhdGlvbidcbik7XG5leHBvcnQgY29uc3QgUk9VVEVSX0NPTkZJRyA9IG5ldyBJbmplY3Rpb25Ub2tlbihcbiAgJ0BuZ3J4L3JvdXRlci1zdG9yZSBDb25maWd1cmF0aW9uJ1xuKTtcbmV4cG9ydCBjb25zdCBERUZBVUxUX1JPVVRFUl9GRUFUVVJFTkFNRSA9ICdyb3V0ZXInO1xuXG5leHBvcnQgZnVuY3Rpb24gX2NyZWF0ZVJvdXRlckNvbmZpZyhcbiAgY29uZmlnOiBTdG9yZVJvdXRlckNvbmZpZ1xuKTogU3RvcmVSb3V0ZXJDb25maWcge1xuICByZXR1cm4ge1xuICAgIHN0YXRlS2V5OiBERUZBVUxUX1JPVVRFUl9GRUFUVVJFTkFNRSxcbiAgICBzZXJpYWxpemVyOiBEZWZhdWx0Um91dGVyU3RhdGVTZXJpYWxpemVyLFxuICAgIG5hdmlnYXRpb25BY3Rpb25UaW1pbmc6IE5hdmlnYXRpb25BY3Rpb25UaW1pbmcuUHJlQWN0aXZhdGlvbixcbiAgICAuLi5jb25maWcsXG4gIH07XG59XG5cbmVudW0gUm91dGVyVHJpZ2dlciB7XG4gIE5PTkUgPSAxLFxuICBST1VURVIgPSAyLFxuICBTVE9SRSA9IDMsXG59XG5cbi8qKlxuICogQ29ubmVjdHMgUm91dGVyTW9kdWxlIHdpdGggU3RvcmVNb2R1bGUuXG4gKlxuICogRHVyaW5nIHRoZSBuYXZpZ2F0aW9uLCBiZWZvcmUgYW55IGd1YXJkcyBvciByZXNvbHZlcnMgcnVuLCB0aGUgcm91dGVyIHdpbGwgZGlzcGF0Y2hcbiAqIGEgUk9VVEVSX05BVklHQVRJT04gYWN0aW9uLCB3aGljaCBoYXMgdGhlIGZvbGxvd2luZyBzaWduYXR1cmU6XG4gKlxuICogYGBgXG4gKiBleHBvcnQgdHlwZSBSb3V0ZXJOYXZpZ2F0aW9uUGF5bG9hZCA9IHtcbiAqICAgcm91dGVyU3RhdGU6IFNlcmlhbGl6ZWRSb3V0ZXJTdGF0ZVNuYXBzaG90LFxuICogICBldmVudDogUm91dGVzUmVjb2duaXplZFxuICogfVxuICogYGBgXG4gKlxuICogRWl0aGVyIGEgcmVkdWNlciBvciBhbiBlZmZlY3QgY2FuIGJlIGludm9rZWQgaW4gcmVzcG9uc2UgdG8gdGhpcyBhY3Rpb24uXG4gKiBJZiB0aGUgaW52b2tlZCByZWR1Y2VyIHRocm93cywgdGhlIG5hdmlnYXRpb24gd2lsbCBiZSBjYW5jZWxlZC5cbiAqXG4gKiBJZiBuYXZpZ2F0aW9uIGdldHMgY2FuY2VsZWQgYmVjYXVzZSBvZiBhIGd1YXJkLCBhIFJPVVRFUl9DQU5DRUwgYWN0aW9uIHdpbGwgYmVcbiAqIGRpc3BhdGNoZWQuIElmIG5hdmlnYXRpb24gcmVzdWx0cyBpbiBhbiBlcnJvciwgYSBST1VURVJfRVJST1IgYWN0aW9uIHdpbGwgYmUgZGlzcGF0Y2hlZC5cbiAqXG4gKiBCb3RoIFJPVVRFUl9DQU5DRUwgYW5kIFJPVVRFUl9FUlJPUiBjb250YWluIHRoZSBzdG9yZSBzdGF0ZSBiZWZvcmUgdGhlIG5hdmlnYXRpb25cbiAqIHdoaWNoIGNhbiBiZSB1c2VkIHRvIHJlc3RvcmUgdGhlIGNvbnNpc3RlbmN5IG9mIHRoZSBzdG9yZS5cbiAqXG4gKiBVc2FnZTpcbiAqXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiBATmdNb2R1bGUoe1xuICogICBkZWNsYXJhdGlvbnM6IFtBcHBDbXAsIFNpbXBsZUNtcF0sXG4gKiAgIGltcG9ydHM6IFtcbiAqICAgICBCcm93c2VyTW9kdWxlLFxuICogICAgIFN0b3JlTW9kdWxlLmZvclJvb3QobWFwT2ZSZWR1Y2VycyksXG4gKiAgICAgUm91dGVyTW9kdWxlLmZvclJvb3QoW1xuICogICAgICAgeyBwYXRoOiAnJywgY29tcG9uZW50OiBTaW1wbGVDbXAgfSxcbiAqICAgICAgIHsgcGF0aDogJ25leHQnLCBjb21wb25lbnQ6IFNpbXBsZUNtcCB9XG4gKiAgICAgXSksXG4gKiAgICAgU3RvcmVSb3V0ZXJDb25uZWN0aW5nTW9kdWxlXG4gKiAgIF0sXG4gKiAgIGJvb3RzdHJhcDogW0FwcENtcF1cbiAqIH0pXG4gKiBleHBvcnQgY2xhc3MgQXBwTW9kdWxlIHtcbiAqIH1cbiAqIGBgYFxuICovXG5ATmdNb2R1bGUoe1xuICBwcm92aWRlcnM6IFtcbiAgICB7XG4gICAgICBwcm92aWRlOiBfUk9VVEVSX0NPTkZJRyxcbiAgICAgIHVzZVZhbHVlOiB7fSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHByb3ZpZGU6IFJPVVRFUl9DT05GSUcsXG4gICAgICB1c2VGYWN0b3J5OiBfY3JlYXRlUm91dGVyQ29uZmlnLFxuICAgICAgZGVwczogW19ST1VURVJfQ09ORklHXSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHByb3ZpZGU6IFJvdXRlclN0YXRlU2VyaWFsaXplcixcbiAgICAgIHVzZUNsYXNzOiBEZWZhdWx0Um91dGVyU3RhdGVTZXJpYWxpemVyLFxuICAgIH0sXG4gIF0sXG59KVxuZXhwb3J0IGNsYXNzIFN0b3JlUm91dGVyQ29ubmVjdGluZ01vZHVsZSB7XG4gIHN0YXRpYyBmb3JSb290PFxuICAgIFQgZXh0ZW5kcyBCYXNlUm91dGVyU3RvcmVTdGF0ZSA9IFNlcmlhbGl6ZWRSb3V0ZXJTdGF0ZVNuYXBzaG90XG4gID4oXG4gICAgY29uZmlnOiBTdG9yZVJvdXRlckNvbmZpZzxUPiA9IHt9XG4gICk6IE1vZHVsZVdpdGhQcm92aWRlcnM8U3RvcmVSb3V0ZXJDb25uZWN0aW5nTW9kdWxlPiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5nTW9kdWxlOiBTdG9yZVJvdXRlckNvbm5lY3RpbmdNb2R1bGUsXG4gICAgICBwcm92aWRlcnM6IFtcbiAgICAgICAgeyBwcm92aWRlOiBfUk9VVEVSX0NPTkZJRywgdXNlVmFsdWU6IGNvbmZpZyB9LFxuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogUm91dGVyU3RhdGVTZXJpYWxpemVyLFxuICAgICAgICAgIHVzZUNsYXNzOiBjb25maWcuc2VyaWFsaXplclxuICAgICAgICAgICAgPyBjb25maWcuc2VyaWFsaXplclxuICAgICAgICAgICAgOiBEZWZhdWx0Um91dGVyU3RhdGVTZXJpYWxpemVyLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSBsYXN0RXZlbnQ6IEV2ZW50IHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgcm91dGVyU3RhdGU6IFNlcmlhbGl6ZWRSb3V0ZXJTdGF0ZVNuYXBzaG90IHwgbnVsbDtcbiAgcHJpdmF0ZSBzdG9yZVN0YXRlOiBhbnk7XG4gIHByaXZhdGUgdHJpZ2dlciA9IFJvdXRlclRyaWdnZXIuTk9ORTtcblxuICBwcml2YXRlIHN0YXRlS2V5OiBTdGF0ZUtleU9yU2VsZWN0b3I7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBzdG9yZTogU3RvcmU8YW55PixcbiAgICBwcml2YXRlIHJvdXRlcjogUm91dGVyLFxuICAgIHByaXZhdGUgc2VyaWFsaXplcjogUm91dGVyU3RhdGVTZXJpYWxpemVyPFNlcmlhbGl6ZWRSb3V0ZXJTdGF0ZVNuYXBzaG90PixcbiAgICBwcml2YXRlIGVycm9ySGFuZGxlcjogRXJyb3JIYW5kbGVyLFxuICAgIEBJbmplY3QoUk9VVEVSX0NPTkZJRykgcHJpdmF0ZSBjb25maWc6IFN0b3JlUm91dGVyQ29uZmlnXG4gICkge1xuICAgIHRoaXMuc3RhdGVLZXkgPSB0aGlzLmNvbmZpZy5zdGF0ZUtleSBhcyBTdGF0ZUtleU9yU2VsZWN0b3I7XG5cbiAgICB0aGlzLnNldFVwU3RvcmVTdGF0ZUxpc3RlbmVyKCk7XG4gICAgdGhpcy5zZXRVcFJvdXRlckV2ZW50c0xpc3RlbmVyKCk7XG4gIH1cblxuICBwcml2YXRlIHNldFVwU3RvcmVTdGF0ZUxpc3RlbmVyKCk6IHZvaWQge1xuICAgIHRoaXMuc3RvcmVcbiAgICAgIC5waXBlKFxuICAgICAgICBzZWxlY3QodGhpcy5zdGF0ZUtleSksXG4gICAgICAgIHdpdGhMYXRlc3RGcm9tKHRoaXMuc3RvcmUpXG4gICAgICApXG4gICAgICAuc3Vic2NyaWJlKChbcm91dGVyU3RvcmVTdGF0ZSwgc3RvcmVTdGF0ZV0pID0+IHtcbiAgICAgICAgdGhpcy5uYXZpZ2F0ZUlmTmVlZGVkKHJvdXRlclN0b3JlU3RhdGUsIHN0b3JlU3RhdGUpO1xuICAgICAgfSk7XG4gIH1cblxuICBwcml2YXRlIG5hdmlnYXRlSWZOZWVkZWQoXG4gICAgcm91dGVyU3RvcmVTdGF0ZTogUm91dGVyUmVkdWNlclN0YXRlLFxuICAgIHN0b3JlU3RhdGU6IGFueVxuICApOiB2b2lkIHtcbiAgICBpZiAoIXJvdXRlclN0b3JlU3RhdGUgfHwgIXJvdXRlclN0b3JlU3RhdGUuc3RhdGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHRoaXMudHJpZ2dlciA9PT0gUm91dGVyVHJpZ2dlci5ST1VURVIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHRoaXMubGFzdEV2ZW50IGluc3RhbmNlb2YgTmF2aWdhdGlvblN0YXJ0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgdXJsID0gcm91dGVyU3RvcmVTdGF0ZS5zdGF0ZS51cmw7XG4gICAgaWYgKHRoaXMucm91dGVyLnVybCAhPT0gdXJsKSB7XG4gICAgICB0aGlzLnN0b3JlU3RhdGUgPSBzdG9yZVN0YXRlO1xuICAgICAgdGhpcy50cmlnZ2VyID0gUm91dGVyVHJpZ2dlci5TVE9SRTtcbiAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlQnlVcmwodXJsKS5jYXRjaChlcnJvciA9PiB7XG4gICAgICAgIHRoaXMuZXJyb3JIYW5kbGVyLmhhbmRsZUVycm9yKGVycm9yKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgc2V0VXBSb3V0ZXJFdmVudHNMaXN0ZW5lcigpOiB2b2lkIHtcbiAgICBjb25zdCBkaXNwYXRjaE5hdkxhdGUgPVxuICAgICAgdGhpcy5jb25maWcubmF2aWdhdGlvbkFjdGlvblRpbWluZyA9PT1cbiAgICAgIE5hdmlnYXRpb25BY3Rpb25UaW1pbmcuUG9zdEFjdGl2YXRpb247XG4gICAgbGV0IHJvdXRlc1JlY29nbml6ZWQ6IFJvdXRlc1JlY29nbml6ZWQ7XG5cbiAgICB0aGlzLnJvdXRlci5ldmVudHNcbiAgICAgIC5waXBlKHdpdGhMYXRlc3RGcm9tKHRoaXMuc3RvcmUpKVxuICAgICAgLnN1YnNjcmliZSgoW2V2ZW50LCBzdG9yZVN0YXRlXSkgPT4ge1xuICAgICAgICB0aGlzLmxhc3RFdmVudCA9IGV2ZW50O1xuXG4gICAgICAgIGlmIChldmVudCBpbnN0YW5jZW9mIE5hdmlnYXRpb25TdGFydCkge1xuICAgICAgICAgIHRoaXMucm91dGVyU3RhdGUgPSB0aGlzLnNlcmlhbGl6ZXIuc2VyaWFsaXplKFxuICAgICAgICAgICAgdGhpcy5yb3V0ZXIucm91dGVyU3RhdGUuc25hcHNob3RcbiAgICAgICAgICApO1xuICAgICAgICAgIGlmICh0aGlzLnRyaWdnZXIgIT09IFJvdXRlclRyaWdnZXIuU1RPUkUpIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcmVTdGF0ZSA9IHN0b3JlU3RhdGU7XG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoUm91dGVyUmVxdWVzdChldmVudCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50IGluc3RhbmNlb2YgUm91dGVzUmVjb2duaXplZCkge1xuICAgICAgICAgIHJvdXRlc1JlY29nbml6ZWQgPSBldmVudDtcblxuICAgICAgICAgIGlmICghZGlzcGF0Y2hOYXZMYXRlICYmIHRoaXMudHJpZ2dlciAhPT0gUm91dGVyVHJpZ2dlci5TVE9SRSkge1xuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaFJvdXRlck5hdmlnYXRpb24oZXZlbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChldmVudCBpbnN0YW5jZW9mIE5hdmlnYXRpb25DYW5jZWwpIHtcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoUm91dGVyQ2FuY2VsKGV2ZW50KTtcbiAgICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnQgaW5zdGFuY2VvZiBOYXZpZ2F0aW9uRXJyb3IpIHtcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoUm91dGVyRXJyb3IoZXZlbnQpO1xuICAgICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICAgICAgfSBlbHNlIGlmIChldmVudCBpbnN0YW5jZW9mIE5hdmlnYXRpb25FbmQpIHtcbiAgICAgICAgICBpZiAodGhpcy50cmlnZ2VyICE9PSBSb3V0ZXJUcmlnZ2VyLlNUT1JFKSB7XG4gICAgICAgICAgICBpZiAoZGlzcGF0Y2hOYXZMYXRlKSB7XG4gICAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hSb3V0ZXJOYXZpZ2F0aW9uKHJvdXRlc1JlY29nbml6ZWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaFJvdXRlck5hdmlnYXRlZChldmVudCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGRpc3BhdGNoUm91dGVyUmVxdWVzdChldmVudDogTmF2aWdhdGlvblN0YXJ0KTogdm9pZCB7XG4gICAgdGhpcy5kaXNwYXRjaFJvdXRlckFjdGlvbihST1VURVJfUkVRVUVTVCwgeyBldmVudCB9KTtcbiAgfVxuXG4gIHByaXZhdGUgZGlzcGF0Y2hSb3V0ZXJOYXZpZ2F0aW9uKFxuICAgIGxhc3RSb3V0ZXNSZWNvZ25pemVkOiBSb3V0ZXNSZWNvZ25pemVkXG4gICk6IHZvaWQge1xuICAgIGNvbnN0IG5leHRSb3V0ZXJTdGF0ZSA9IHRoaXMuc2VyaWFsaXplci5zZXJpYWxpemUoXG4gICAgICBsYXN0Um91dGVzUmVjb2duaXplZC5zdGF0ZVxuICAgICk7XG4gICAgdGhpcy5kaXNwYXRjaFJvdXRlckFjdGlvbihST1VURVJfTkFWSUdBVElPTiwge1xuICAgICAgcm91dGVyU3RhdGU6IG5leHRSb3V0ZXJTdGF0ZSxcbiAgICAgIGV2ZW50OiBuZXcgUm91dGVzUmVjb2duaXplZChcbiAgICAgICAgbGFzdFJvdXRlc1JlY29nbml6ZWQuaWQsXG4gICAgICAgIGxhc3RSb3V0ZXNSZWNvZ25pemVkLnVybCxcbiAgICAgICAgbGFzdFJvdXRlc1JlY29nbml6ZWQudXJsQWZ0ZXJSZWRpcmVjdHMsXG4gICAgICAgIG5leHRSb3V0ZXJTdGF0ZVxuICAgICAgKSxcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgZGlzcGF0Y2hSb3V0ZXJDYW5jZWwoZXZlbnQ6IE5hdmlnYXRpb25DYW5jZWwpOiB2b2lkIHtcbiAgICB0aGlzLmRpc3BhdGNoUm91dGVyQWN0aW9uKFJPVVRFUl9DQU5DRUwsIHtcbiAgICAgIHN0b3JlU3RhdGU6IHRoaXMuc3RvcmVTdGF0ZSxcbiAgICAgIGV2ZW50LFxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBkaXNwYXRjaFJvdXRlckVycm9yKGV2ZW50OiBOYXZpZ2F0aW9uRXJyb3IpOiB2b2lkIHtcbiAgICB0aGlzLmRpc3BhdGNoUm91dGVyQWN0aW9uKFJPVVRFUl9FUlJPUiwge1xuICAgICAgc3RvcmVTdGF0ZTogdGhpcy5zdG9yZVN0YXRlLFxuICAgICAgZXZlbnQ6IG5ldyBOYXZpZ2F0aW9uRXJyb3IoZXZlbnQuaWQsIGV2ZW50LnVybCwgYCR7ZXZlbnR9YCksXG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGRpc3BhdGNoUm91dGVyTmF2aWdhdGVkKGV2ZW50OiBOYXZpZ2F0aW9uRW5kKTogdm9pZCB7XG4gICAgY29uc3Qgcm91dGVyU3RhdGUgPSB0aGlzLnNlcmlhbGl6ZXIuc2VyaWFsaXplKFxuICAgICAgdGhpcy5yb3V0ZXIucm91dGVyU3RhdGUuc25hcHNob3RcbiAgICApO1xuICAgIHRoaXMuZGlzcGF0Y2hSb3V0ZXJBY3Rpb24oUk9VVEVSX05BVklHQVRFRCwgeyBldmVudCwgcm91dGVyU3RhdGUgfSk7XG4gIH1cblxuICBwcml2YXRlIGRpc3BhdGNoUm91dGVyQWN0aW9uKFxuICAgIHR5cGU6IHN0cmluZyxcbiAgICBwYXlsb2FkOiBTdG9yZVJvdXRlckFjdGlvblBheWxvYWRcbiAgKTogdm9pZCB7XG4gICAgdGhpcy50cmlnZ2VyID0gUm91dGVyVHJpZ2dlci5ST1VURVI7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuc3RvcmUuZGlzcGF0Y2goe1xuICAgICAgICB0eXBlLFxuICAgICAgICBwYXlsb2FkOiB7XG4gICAgICAgICAgcm91dGVyU3RhdGU6IHRoaXMucm91dGVyU3RhdGUsXG4gICAgICAgICAgLi4ucGF5bG9hZCxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0aGlzLnRyaWdnZXIgPSBSb3V0ZXJUcmlnZ2VyLk5PTkU7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSByZXNldCgpIHtcbiAgICB0aGlzLnRyaWdnZXIgPSBSb3V0ZXJUcmlnZ2VyLk5PTkU7XG4gICAgdGhpcy5zdG9yZVN0YXRlID0gbnVsbDtcbiAgICB0aGlzLnJvdXRlclN0YXRlID0gbnVsbDtcbiAgfVxufVxuIl19