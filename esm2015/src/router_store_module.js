/**
 * @fileoverview added by tsickle
 * Generated from: modules/router-store/src/router_store_module.ts
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
const RouterState = {
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
    }
    /**
     * @private
     * @return {?}
     */
    setUpStoreStateListener() {
        this.store
            .pipe(select((/** @type {?} */ (this.stateKey))), withLatestFrom(this.store))
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
                payload: Object.assign(Object.assign({ routerState: this.routerState }, payload), { event: this.config.routerState === 1 /* Minimal */
                        ? { id: payload.event.id, url: payload.event.url }
                        : payload.event }),
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
    { type: NgModule, args: [{},] }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyX3N0b3JlX21vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvcm91dGVyLXN0b3JlL3NyYy9yb3V0ZXJfc3RvcmVfbW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUNMLE1BQU0sRUFDTixjQUFjLEVBRWQsUUFBUSxFQUNSLFlBQVksR0FDYixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQ0wsZ0JBQWdCLEVBQ2hCLGVBQWUsRUFDZixhQUFhLEVBQ2IsTUFBTSxFQUNOLGdCQUFnQixFQUNoQixlQUFlLEdBR2hCLE1BQU0saUJBQWlCLENBQUM7QUFDekIsT0FBTyxFQUFFLE1BQU0sRUFBWSxLQUFLLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDdEQsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRWhELE9BQU8sRUFDTCxhQUFhLEVBQ2IsWUFBWSxFQUNaLGdCQUFnQixFQUNoQixpQkFBaUIsRUFDakIsY0FBYyxHQUNmLE1BQU0sV0FBVyxDQUFDO0FBRW5CLE9BQU8sRUFDTCxxQkFBcUIsR0FFdEIsTUFBTSxvQkFBb0IsQ0FBQztBQUM1QixPQUFPLEVBQ0wsNEJBQTRCLEdBRTdCLE1BQU0sa0NBQWtDLENBQUM7QUFDMUMsT0FBTyxFQUFFLDRCQUE0QixFQUFFLE1BQU0sa0NBQWtDLENBQUM7O0FBVWhGLE1BQWtCLFdBQVc7SUFDM0IsSUFBSSxHQUFBO0lBQ0osT0FBTyxHQUFBO0VBQ1I7Ozs7OztBQUVELHVDQW1CQzs7O0lBaEJDLHFDQUFpQzs7SUFDakMsdUNBQTJEOzs7Ozs7Ozs7SUFRM0QsbURBQWdEOzs7Ozs7O0lBTWhELHdDQUEwQjs7Ozs7QUFHNUIsdUNBSUM7OztJQUhDLHlDQUFtQjs7SUFDbkIsK0NBQTRDOztJQUM1Qyw4Q0FBaUI7OztBQUduQixNQUFZLHNCQUFzQjtJQUNoQyxhQUFhLEdBQUk7SUFDakIsY0FBYyxHQUFJO0VBQ25COzs7OztBQUVELE1BQU0sT0FBTyxjQUFjLEdBQUcsSUFBSSxjQUFjLENBQzlDLDJDQUEyQyxDQUM1Qzs7QUFDRCxNQUFNLE9BQU8sYUFBYSxHQUFHLElBQUksY0FBYyxDQUM3QyxrQ0FBa0MsQ0FDbkM7O0FBQ0QsTUFBTSxPQUFPLDBCQUEwQixHQUFHLFFBQVE7Ozs7O0FBRWxELE1BQU0sVUFBVSxtQkFBbUIsQ0FDakMsTUFBeUI7SUFFekIsdUJBQ0UsUUFBUSxFQUFFLDBCQUEwQixFQUNwQyxVQUFVLEVBQUUsNEJBQTRCLEVBQ3hDLHNCQUFzQixFQUFFLHNCQUFzQixDQUFDLGFBQWEsSUFDekQsTUFBTSxFQUNUO0FBQ0osQ0FBQzs7QUFFRCxNQUFLLGFBQWE7SUFDaEIsSUFBSSxHQUFJO0lBQ1IsTUFBTSxHQUFJO0lBQ1YsS0FBSyxHQUFJO0VBQ1Y7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUE2Q0QsTUFBTSxPQUFPLDJCQUEyQjs7Ozs7Ozs7SUFrQ3RDLFlBQ1UsS0FBaUIsRUFDakIsTUFBYyxFQUNkLFVBQWdFLEVBQ2hFLFlBQTBCLEVBQ0gsTUFBeUI7UUFKaEQsVUFBSyxHQUFMLEtBQUssQ0FBWTtRQUNqQixXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ2QsZUFBVSxHQUFWLFVBQVUsQ0FBc0Q7UUFDaEUsaUJBQVksR0FBWixZQUFZLENBQWM7UUFDSCxXQUFNLEdBQU4sTUFBTSxDQUFtQjtRQVpsRCxjQUFTLEdBQWlCLElBQUksQ0FBQztRQUcvQixZQUFPLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQztRQVduQyxJQUFJLENBQUMsUUFBUSxHQUFHLG1CQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFzQixDQUFDO1FBRTNELElBQUksQ0FBQyx1QkFBdUIsRUFBRSxDQUFDO1FBQy9CLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxDQUFDO0lBQ25DLENBQUM7Ozs7OztJQTVDRCxNQUFNLENBQUMsT0FBTyxDQUdaLFNBQStCLEVBQUU7UUFFakMsT0FBTztZQUNMLFFBQVEsRUFBRSwyQkFBMkI7WUFDckMsU0FBUyxFQUFFO2dCQUNULEVBQUUsT0FBTyxFQUFFLGNBQWMsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFO2dCQUM3QztvQkFDRSxPQUFPLEVBQUUsYUFBYTtvQkFDdEIsVUFBVSxFQUFFLG1CQUFtQjtvQkFDL0IsSUFBSSxFQUFFLENBQUMsY0FBYyxDQUFDO2lCQUN2QjtnQkFDRDtvQkFDRSxPQUFPLEVBQUUscUJBQXFCO29CQUM5QixRQUFRLEVBQUUsTUFBTSxDQUFDLFVBQVU7d0JBQ3pCLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBVTt3QkFDbkIsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxXQUFXLG9CQUF3Qjs0QkFDMUMsQ0FBQyxDQUFDLDRCQUE0Qjs0QkFDOUIsQ0FBQyxDQUFDLDRCQUE0QjtpQkFDbkM7YUFDRjtTQUNGLENBQUM7SUFDSixDQUFDOzs7OztJQXNCTyx1QkFBdUI7UUFDN0IsSUFBSSxDQUFDLEtBQUs7YUFDUCxJQUFJLENBQ0gsTUFBTSxDQUFDLG1CQUFBLElBQUksQ0FBQyxRQUFRLEVBQU8sQ0FBQyxFQUM1QixjQUFjLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUMzQjthQUNBLFNBQVM7Ozs7UUFBQyxDQUFDLENBQUMsZ0JBQWdCLEVBQUUsVUFBVSxDQUFDLEVBQUUsRUFBRTtZQUM1QyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsZ0JBQWdCLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDdEQsQ0FBQyxFQUFDLENBQUM7SUFDUCxDQUFDOzs7Ozs7O0lBRU8sZ0JBQWdCLENBQ3RCLGdCQUFvQyxFQUNwQyxVQUFlO1FBRWYsSUFBSSxDQUFDLGdCQUFnQixJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFO1lBQ2hELE9BQU87U0FDUjtRQUNELElBQUksSUFBSSxDQUFDLE9BQU8sS0FBSyxhQUFhLENBQUMsTUFBTSxFQUFFO1lBQ3pDLE9BQU87U0FDUjtRQUNELElBQUksSUFBSSxDQUFDLFNBQVMsWUFBWSxlQUFlLEVBQUU7WUFDN0MsT0FBTztTQUNSOztjQUVLLEdBQUcsR0FBRyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsR0FBRztRQUN0QyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxLQUFLLEdBQUcsRUFBRTtZQUMzQixJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztZQUM3QixJQUFJLENBQUMsT0FBTyxHQUFHLGFBQWEsQ0FBQyxLQUFLLENBQUM7WUFDbkMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSzs7OztZQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUMzQyxJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN2QyxDQUFDLEVBQUMsQ0FBQztTQUNKO0lBQ0gsQ0FBQzs7Ozs7SUFFTyx5QkFBeUI7O2NBQ3pCLGVBQWUsR0FDbkIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxzQkFBc0I7WUFDbEMsc0JBQXNCLENBQUMsY0FBYzs7WUFDbkMsZ0JBQWtDO1FBRXRDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTTthQUNmLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQ2hDLFNBQVM7Ozs7UUFBQyxDQUFDLENBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxFQUFFLEVBQUU7WUFDakMsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7WUFFdkIsSUFBSSxLQUFLLFlBQVksZUFBZSxFQUFFO2dCQUNwQyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUMxQyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQ2pDLENBQUM7Z0JBQ0YsSUFBSSxJQUFJLENBQUMsT0FBTyxLQUFLLGFBQWEsQ0FBQyxLQUFLLEVBQUU7b0JBQ3hDLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO29CQUM3QixJQUFJLENBQUMscUJBQXFCLENBQUMsS0FBSyxDQUFDLENBQUM7aUJBQ25DO2FBQ0Y7aUJBQU0sSUFBSSxLQUFLLFlBQVksZ0JBQWdCLEVBQUU7Z0JBQzVDLGdCQUFnQixHQUFHLEtBQUssQ0FBQztnQkFFekIsSUFBSSxDQUFDLGVBQWUsSUFBSSxJQUFJLENBQUMsT0FBTyxLQUFLLGFBQWEsQ0FBQyxLQUFLLEVBQUU7b0JBQzVELElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztpQkFDdEM7YUFDRjtpQkFBTSxJQUFJLEtBQUssWUFBWSxnQkFBZ0IsRUFBRTtnQkFDNUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNqQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7YUFDZDtpQkFBTSxJQUFJLEtBQUssWUFBWSxlQUFlLEVBQUU7Z0JBQzNDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDaEMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO2FBQ2Q7aUJBQU0sSUFBSSxLQUFLLFlBQVksYUFBYSxFQUFFO2dCQUN6QyxJQUFJLElBQUksQ0FBQyxPQUFPLEtBQUssYUFBYSxDQUFDLEtBQUssRUFBRTtvQkFDeEMsSUFBSSxlQUFlLEVBQUU7d0JBQ25CLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO3FCQUNqRDtvQkFDRCxJQUFJLENBQUMsdUJBQXVCLENBQUMsS0FBSyxDQUFDLENBQUM7aUJBQ3JDO2dCQUNELElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQzthQUNkO1FBQ0gsQ0FBQyxFQUFDLENBQUM7SUFDUCxDQUFDOzs7Ozs7SUFFTyxxQkFBcUIsQ0FBQyxLQUFzQjtRQUNsRCxJQUFJLENBQUMsb0JBQW9CLENBQUMsY0FBYyxFQUFFLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztJQUN2RCxDQUFDOzs7Ozs7SUFFTyx3QkFBd0IsQ0FDOUIsb0JBQXNDOztjQUVoQyxlQUFlLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQy9DLG9CQUFvQixDQUFDLEtBQUssQ0FDM0I7UUFDRCxJQUFJLENBQUMsb0JBQW9CLENBQUMsaUJBQWlCLEVBQUU7WUFDM0MsV0FBVyxFQUFFLGVBQWU7WUFDNUIsS0FBSyxFQUFFLElBQUksZ0JBQWdCLENBQ3pCLG9CQUFvQixDQUFDLEVBQUUsRUFDdkIsb0JBQW9CLENBQUMsR0FBRyxFQUN4QixvQkFBb0IsQ0FBQyxpQkFBaUIsRUFDdEMsZUFBZSxDQUNoQjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUM7Ozs7OztJQUVPLG9CQUFvQixDQUFDLEtBQXVCO1FBQ2xELElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxhQUFhLEVBQUU7WUFDdkMsVUFBVSxFQUFFLElBQUksQ0FBQyxVQUFVO1lBQzNCLEtBQUs7U0FDTixDQUFDLENBQUM7SUFDTCxDQUFDOzs7Ozs7SUFFTyxtQkFBbUIsQ0FBQyxLQUFzQjtRQUNoRCxJQUFJLENBQUMsb0JBQW9CLENBQUMsWUFBWSxFQUFFO1lBQ3RDLFVBQVUsRUFBRSxJQUFJLENBQUMsVUFBVTtZQUMzQixLQUFLLEVBQUUsSUFBSSxlQUFlLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcsS0FBSyxFQUFFLENBQUM7U0FDNUQsQ0FBQyxDQUFDO0lBQ0wsQ0FBQzs7Ozs7O0lBRU8sdUJBQXVCLENBQUMsS0FBb0I7O2NBQzVDLFdBQVcsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FDM0MsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUNqQztRQUNELElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxnQkFBZ0IsRUFBRSxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUUsQ0FBQyxDQUFDO0lBQ3RFLENBQUM7Ozs7Ozs7SUFFTyxvQkFBb0IsQ0FDMUIsSUFBWSxFQUNaLE9BQWlDO1FBRWpDLElBQUksQ0FBQyxPQUFPLEdBQUcsYUFBYSxDQUFDLE1BQU0sQ0FBQztRQUNwQyxJQUFJO1lBQ0YsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUM7Z0JBQ2xCLElBQUk7Z0JBQ0osT0FBTyxnQ0FDTCxXQUFXLEVBQUUsSUFBSSxDQUFDLFdBQVcsSUFDMUIsT0FBTyxLQUNWLEtBQUssRUFDSCxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsb0JBQXdCO3dCQUM3QyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFO3dCQUNsRCxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssR0FDcEI7YUFDRixDQUFDLENBQUM7U0FDSjtnQkFBUztZQUNSLElBQUksQ0FBQyxPQUFPLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQztTQUNuQztJQUNILENBQUM7Ozs7O0lBRU8sS0FBSztRQUNYLElBQUksQ0FBQyxPQUFPLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQztRQUNsQyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztRQUN2QixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztJQUMxQixDQUFDOzs7WUFsTUYsUUFBUSxTQUFDLEVBQUU7Ozs7WUFySWUsS0FBSztZQU45QixNQUFNO1lBa0JOLHFCQUFxQjtZQXhCckIsWUFBWTs0Q0F5TFQsTUFBTSxTQUFDLGFBQWE7Ozs7Ozs7SUFadkIsZ0RBQXVDOzs7OztJQUN2QyxrREFBMEQ7Ozs7O0lBQzFELGlEQUF3Qjs7Ozs7SUFDeEIsOENBQXFDOzs7OztJQUVyQywrQ0FBcUM7Ozs7O0lBR25DLDRDQUF5Qjs7Ozs7SUFDekIsNkNBQXNCOzs7OztJQUN0QixpREFBd0U7Ozs7O0lBQ3hFLG1EQUFrQzs7Ozs7SUFDbEMsNkNBQXdEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgSW5qZWN0LFxuICBJbmplY3Rpb25Ub2tlbixcbiAgTW9kdWxlV2l0aFByb3ZpZGVycyxcbiAgTmdNb2R1bGUsXG4gIEVycm9ySGFuZGxlcixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBOYXZpZ2F0aW9uQ2FuY2VsLFxuICBOYXZpZ2F0aW9uRXJyb3IsXG4gIE5hdmlnYXRpb25FbmQsXG4gIFJvdXRlcixcbiAgUm91dGVzUmVjb2duaXplZCxcbiAgTmF2aWdhdGlvblN0YXJ0LFxuICBFdmVudCxcbiAgUm91dGVyRXZlbnQsXG59IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBzZWxlY3QsIFNlbGVjdG9yLCBTdG9yZSB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcbmltcG9ydCB7IHdpdGhMYXRlc3RGcm9tIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQge1xuICBST1VURVJfQ0FOQ0VMLFxuICBST1VURVJfRVJST1IsXG4gIFJPVVRFUl9OQVZJR0FURUQsXG4gIFJPVVRFUl9OQVZJR0FUSU9OLFxuICBST1VURVJfUkVRVUVTVCxcbn0gZnJvbSAnLi9hY3Rpb25zJztcbmltcG9ydCB7IFJvdXRlclJlZHVjZXJTdGF0ZSB9IGZyb20gJy4vcmVkdWNlcic7XG5pbXBvcnQge1xuICBSb3V0ZXJTdGF0ZVNlcmlhbGl6ZXIsXG4gIEJhc2VSb3V0ZXJTdG9yZVN0YXRlLFxufSBmcm9tICcuL3NlcmlhbGl6ZXJzL2Jhc2UnO1xuaW1wb3J0IHtcbiAgRGVmYXVsdFJvdXRlclN0YXRlU2VyaWFsaXplcixcbiAgU2VyaWFsaXplZFJvdXRlclN0YXRlU25hcHNob3QsXG59IGZyb20gJy4vc2VyaWFsaXplcnMvZGVmYXVsdF9zZXJpYWxpemVyJztcbmltcG9ydCB7IE1pbmltYWxSb3V0ZXJTdGF0ZVNlcmlhbGl6ZXIgfSBmcm9tICcuL3NlcmlhbGl6ZXJzL21pbmltYWxfc2VyaWFsaXplcic7XG5cbmV4cG9ydCB0eXBlIFN0YXRlS2V5T3JTZWxlY3RvcjxcbiAgVCBleHRlbmRzIEJhc2VSb3V0ZXJTdG9yZVN0YXRlID0gU2VyaWFsaXplZFJvdXRlclN0YXRlU25hcHNob3Rcbj4gPSBzdHJpbmcgfCBTZWxlY3RvcjxhbnksIFJvdXRlclJlZHVjZXJTdGF0ZTxUPj47XG5cbi8qKlxuICogRnVsbCA9IFNlcmlhbGl6ZXMgdGhlIHJvdXRlciBldmVudCB3aXRoIERlZmF1bHRSb3V0ZXJTdGF0ZVNlcmlhbGl6ZXJcbiAqIE1pbmltYWwgPSBTZXJpYWxpemVzIHRoZSByb3V0ZXIgZXZlbnQgd2l0aCBNaW5pbWFsUm91dGVyU3RhdGVTZXJpYWxpemVyXG4gKi9cbmV4cG9ydCBjb25zdCBlbnVtIFJvdXRlclN0YXRlIHtcbiAgRnVsbCxcbiAgTWluaW1hbCxcbn1cblxuZXhwb3J0IGludGVyZmFjZSBTdG9yZVJvdXRlckNvbmZpZzxcbiAgVCBleHRlbmRzIEJhc2VSb3V0ZXJTdG9yZVN0YXRlID0gU2VyaWFsaXplZFJvdXRlclN0YXRlU25hcHNob3Rcbj4ge1xuICBzdGF0ZUtleT86IFN0YXRlS2V5T3JTZWxlY3RvcjxUPjtcbiAgc2VyaWFsaXplcj86IG5ldyAoLi4uYXJnczogYW55W10pID0+IFJvdXRlclN0YXRlU2VyaWFsaXplcjtcbiAgLyoqXG4gICAqIEJ5IGRlZmF1bHQsIFJPVVRFUl9OQVZJR0FUSU9OIGlzIGRpc3BhdGNoZWQgYmVmb3JlIGd1YXJkcyBhbmQgcmVzb2x2ZXJzIHJ1bi5cbiAgICogVGhlcmVmb3JlLCB0aGUgYWN0aW9uIGNvdWxkIHJ1biB0b28gc29vbiwgZm9yIGV4YW1wbGVcbiAgICogdGhlcmUgbWF5IGJlIGEgbmF2aWdhdGlvbiBjYW5jZWwgZHVlIHRvIGEgZ3VhcmQgc2F5aW5nIHRoZSBuYXZpZ2F0aW9uIGlzIG5vdCBhbGxvd2VkLlxuICAgKiBUbyBydW4gUk9VVEVSX05BVklHQVRJT04gYWZ0ZXIgZ3VhcmRzIGFuZCByZXNvbHZlcnMsXG4gICAqIHNldCB0aGlzIHByb3BlcnR5IHRvIE5hdmlnYXRpb25BY3Rpb25UaW1pbmcuUG9zdEFjdGl2YXRpb24uXG4gICAqL1xuICBuYXZpZ2F0aW9uQWN0aW9uVGltaW5nPzogTmF2aWdhdGlvbkFjdGlvblRpbWluZztcbiAgLyoqXG4gICAqIERlY2lkZXMgd2hpY2ggcm91dGVyIHNlcmlhbGl6ZXIgc2hvdWxkIGJlIHVzZWQsIGlmIHRoZXJlIGlzIG5vbmUgcHJvdmlkZWQsIGFuZCB0aGUgbWV0YWRhdGEgb24gdGhlIGRpc3BhdGNoZWQgQG5ncngvcm91dGVyLXN0b3JlIGFjdGlvbiBwYXlsb2FkLlxuICAgKiBTZXQgdG8gYEZ1bGxgIHRvIHVzZSB0aGUgYERlZmF1bHRSb3V0ZXJTdGF0ZVNlcmlhbGl6ZXJgIGFuZCB0byBzZXQgdGhlIGFuZ3VsYXIgcm91dGVyIGV2ZW50cyBhcyBwYXlsb2FkLlxuICAgKiBTZXQgdG8gYE1pbmltYWxgIHRvIHVzZSB0aGUgYE1pbmltYWxSb3V0ZXJTdGF0ZVNlcmlhbGl6ZXJgIGFuZCB0byBzZXQgYSBtaW5pbWFsIHJvdXRlciBldmVudCB3aXRoIHRoZSBuYXZpZ2F0aW9uIGlkIGFuZCB1cmwgYXMgcGF5bG9hZC5cbiAgICovXG4gIHJvdXRlclN0YXRlPzogUm91dGVyU3RhdGU7XG59XG5cbmludGVyZmFjZSBTdG9yZVJvdXRlckFjdGlvblBheWxvYWQge1xuICBldmVudDogUm91dGVyRXZlbnQ7XG4gIHJvdXRlclN0YXRlPzogU2VyaWFsaXplZFJvdXRlclN0YXRlU25hcHNob3Q7XG4gIHN0b3JlU3RhdGU/OiBhbnk7XG59XG5cbmV4cG9ydCBlbnVtIE5hdmlnYXRpb25BY3Rpb25UaW1pbmcge1xuICBQcmVBY3RpdmF0aW9uID0gMSxcbiAgUG9zdEFjdGl2YXRpb24gPSAyLFxufVxuXG5leHBvcnQgY29uc3QgX1JPVVRFUl9DT05GSUcgPSBuZXcgSW5qZWN0aW9uVG9rZW4oXG4gICdAbmdyeC9yb3V0ZXItc3RvcmUgSW50ZXJuYWwgQ29uZmlndXJhdGlvbidcbik7XG5leHBvcnQgY29uc3QgUk9VVEVSX0NPTkZJRyA9IG5ldyBJbmplY3Rpb25Ub2tlbihcbiAgJ0BuZ3J4L3JvdXRlci1zdG9yZSBDb25maWd1cmF0aW9uJ1xuKTtcbmV4cG9ydCBjb25zdCBERUZBVUxUX1JPVVRFUl9GRUFUVVJFTkFNRSA9ICdyb3V0ZXInO1xuXG5leHBvcnQgZnVuY3Rpb24gX2NyZWF0ZVJvdXRlckNvbmZpZyhcbiAgY29uZmlnOiBTdG9yZVJvdXRlckNvbmZpZ1xuKTogU3RvcmVSb3V0ZXJDb25maWcge1xuICByZXR1cm4ge1xuICAgIHN0YXRlS2V5OiBERUZBVUxUX1JPVVRFUl9GRUFUVVJFTkFNRSxcbiAgICBzZXJpYWxpemVyOiBEZWZhdWx0Um91dGVyU3RhdGVTZXJpYWxpemVyLFxuICAgIG5hdmlnYXRpb25BY3Rpb25UaW1pbmc6IE5hdmlnYXRpb25BY3Rpb25UaW1pbmcuUHJlQWN0aXZhdGlvbixcbiAgICAuLi5jb25maWcsXG4gIH07XG59XG5cbmVudW0gUm91dGVyVHJpZ2dlciB7XG4gIE5PTkUgPSAxLFxuICBST1VURVIgPSAyLFxuICBTVE9SRSA9IDMsXG59XG5cbi8qKlxuICogQ29ubmVjdHMgUm91dGVyTW9kdWxlIHdpdGggU3RvcmVNb2R1bGUuXG4gKlxuICogRHVyaW5nIHRoZSBuYXZpZ2F0aW9uLCBiZWZvcmUgYW55IGd1YXJkcyBvciByZXNvbHZlcnMgcnVuLCB0aGUgcm91dGVyIHdpbGwgZGlzcGF0Y2hcbiAqIGEgUk9VVEVSX05BVklHQVRJT04gYWN0aW9uLCB3aGljaCBoYXMgdGhlIGZvbGxvd2luZyBzaWduYXR1cmU6XG4gKlxuICogYGBgXG4gKiBleHBvcnQgdHlwZSBSb3V0ZXJOYXZpZ2F0aW9uUGF5bG9hZCA9IHtcbiAqICAgcm91dGVyU3RhdGU6IFNlcmlhbGl6ZWRSb3V0ZXJTdGF0ZVNuYXBzaG90LFxuICogICBldmVudDogUm91dGVzUmVjb2duaXplZFxuICogfVxuICogYGBgXG4gKlxuICogRWl0aGVyIGEgcmVkdWNlciBvciBhbiBlZmZlY3QgY2FuIGJlIGludm9rZWQgaW4gcmVzcG9uc2UgdG8gdGhpcyBhY3Rpb24uXG4gKiBJZiB0aGUgaW52b2tlZCByZWR1Y2VyIHRocm93cywgdGhlIG5hdmlnYXRpb24gd2lsbCBiZSBjYW5jZWxlZC5cbiAqXG4gKiBJZiBuYXZpZ2F0aW9uIGdldHMgY2FuY2VsZWQgYmVjYXVzZSBvZiBhIGd1YXJkLCBhIFJPVVRFUl9DQU5DRUwgYWN0aW9uIHdpbGwgYmVcbiAqIGRpc3BhdGNoZWQuIElmIG5hdmlnYXRpb24gcmVzdWx0cyBpbiBhbiBlcnJvciwgYSBST1VURVJfRVJST1IgYWN0aW9uIHdpbGwgYmUgZGlzcGF0Y2hlZC5cbiAqXG4gKiBCb3RoIFJPVVRFUl9DQU5DRUwgYW5kIFJPVVRFUl9FUlJPUiBjb250YWluIHRoZSBzdG9yZSBzdGF0ZSBiZWZvcmUgdGhlIG5hdmlnYXRpb25cbiAqIHdoaWNoIGNhbiBiZSB1c2VkIHRvIHJlc3RvcmUgdGhlIGNvbnNpc3RlbmN5IG9mIHRoZSBzdG9yZS5cbiAqXG4gKiBVc2FnZTpcbiAqXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiBATmdNb2R1bGUoe1xuICogICBkZWNsYXJhdGlvbnM6IFtBcHBDbXAsIFNpbXBsZUNtcF0sXG4gKiAgIGltcG9ydHM6IFtcbiAqICAgICBCcm93c2VyTW9kdWxlLFxuICogICAgIFN0b3JlTW9kdWxlLmZvclJvb3QobWFwT2ZSZWR1Y2VycyksXG4gKiAgICAgUm91dGVyTW9kdWxlLmZvclJvb3QoW1xuICogICAgICAgeyBwYXRoOiAnJywgY29tcG9uZW50OiBTaW1wbGVDbXAgfSxcbiAqICAgICAgIHsgcGF0aDogJ25leHQnLCBjb21wb25lbnQ6IFNpbXBsZUNtcCB9XG4gKiAgICAgXSksXG4gKiAgICAgU3RvcmVSb3V0ZXJDb25uZWN0aW5nTW9kdWxlLmZvclJvb3QoKVxuICogICBdLFxuICogICBib290c3RyYXA6IFtBcHBDbXBdXG4gKiB9KVxuICogZXhwb3J0IGNsYXNzIEFwcE1vZHVsZSB7XG4gKiB9XG4gKiBgYGBcbiAqL1xuQE5nTW9kdWxlKHt9KVxuZXhwb3J0IGNsYXNzIFN0b3JlUm91dGVyQ29ubmVjdGluZ01vZHVsZSB7XG4gIHN0YXRpYyBmb3JSb290PFxuICAgIFQgZXh0ZW5kcyBCYXNlUm91dGVyU3RvcmVTdGF0ZSA9IFNlcmlhbGl6ZWRSb3V0ZXJTdGF0ZVNuYXBzaG90XG4gID4oXG4gICAgY29uZmlnOiBTdG9yZVJvdXRlckNvbmZpZzxUPiA9IHt9XG4gICk6IE1vZHVsZVdpdGhQcm92aWRlcnM8U3RvcmVSb3V0ZXJDb25uZWN0aW5nTW9kdWxlPiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5nTW9kdWxlOiBTdG9yZVJvdXRlckNvbm5lY3RpbmdNb2R1bGUsXG4gICAgICBwcm92aWRlcnM6IFtcbiAgICAgICAgeyBwcm92aWRlOiBfUk9VVEVSX0NPTkZJRywgdXNlVmFsdWU6IGNvbmZpZyB9LFxuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogUk9VVEVSX0NPTkZJRyxcbiAgICAgICAgICB1c2VGYWN0b3J5OiBfY3JlYXRlUm91dGVyQ29uZmlnLFxuICAgICAgICAgIGRlcHM6IFtfUk9VVEVSX0NPTkZJR10sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBwcm92aWRlOiBSb3V0ZXJTdGF0ZVNlcmlhbGl6ZXIsXG4gICAgICAgICAgdXNlQ2xhc3M6IGNvbmZpZy5zZXJpYWxpemVyXG4gICAgICAgICAgICA/IGNvbmZpZy5zZXJpYWxpemVyXG4gICAgICAgICAgICA6IGNvbmZpZy5yb3V0ZXJTdGF0ZSA9PT0gUm91dGVyU3RhdGUuTWluaW1hbFxuICAgICAgICAgICAgICA/IE1pbmltYWxSb3V0ZXJTdGF0ZVNlcmlhbGl6ZXJcbiAgICAgICAgICAgICAgOiBEZWZhdWx0Um91dGVyU3RhdGVTZXJpYWxpemVyLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSBsYXN0RXZlbnQ6IEV2ZW50IHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgcm91dGVyU3RhdGU6IFNlcmlhbGl6ZWRSb3V0ZXJTdGF0ZVNuYXBzaG90IHwgbnVsbDtcbiAgcHJpdmF0ZSBzdG9yZVN0YXRlOiBhbnk7XG4gIHByaXZhdGUgdHJpZ2dlciA9IFJvdXRlclRyaWdnZXIuTk9ORTtcblxuICBwcml2YXRlIHN0YXRlS2V5OiBTdGF0ZUtleU9yU2VsZWN0b3I7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBzdG9yZTogU3RvcmU8YW55PixcbiAgICBwcml2YXRlIHJvdXRlcjogUm91dGVyLFxuICAgIHByaXZhdGUgc2VyaWFsaXplcjogUm91dGVyU3RhdGVTZXJpYWxpemVyPFNlcmlhbGl6ZWRSb3V0ZXJTdGF0ZVNuYXBzaG90PixcbiAgICBwcml2YXRlIGVycm9ySGFuZGxlcjogRXJyb3JIYW5kbGVyLFxuICAgIEBJbmplY3QoUk9VVEVSX0NPTkZJRykgcHJpdmF0ZSBjb25maWc6IFN0b3JlUm91dGVyQ29uZmlnXG4gICkge1xuICAgIHRoaXMuc3RhdGVLZXkgPSB0aGlzLmNvbmZpZy5zdGF0ZUtleSBhcyBTdGF0ZUtleU9yU2VsZWN0b3I7XG5cbiAgICB0aGlzLnNldFVwU3RvcmVTdGF0ZUxpc3RlbmVyKCk7XG4gICAgdGhpcy5zZXRVcFJvdXRlckV2ZW50c0xpc3RlbmVyKCk7XG4gIH1cblxuICBwcml2YXRlIHNldFVwU3RvcmVTdGF0ZUxpc3RlbmVyKCk6IHZvaWQge1xuICAgIHRoaXMuc3RvcmVcbiAgICAgIC5waXBlKFxuICAgICAgICBzZWxlY3QodGhpcy5zdGF0ZUtleSBhcyBhbnkpLFxuICAgICAgICB3aXRoTGF0ZXN0RnJvbSh0aGlzLnN0b3JlKVxuICAgICAgKVxuICAgICAgLnN1YnNjcmliZSgoW3JvdXRlclN0b3JlU3RhdGUsIHN0b3JlU3RhdGVdKSA9PiB7XG4gICAgICAgIHRoaXMubmF2aWdhdGVJZk5lZWRlZChyb3V0ZXJTdG9yZVN0YXRlLCBzdG9yZVN0YXRlKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBuYXZpZ2F0ZUlmTmVlZGVkKFxuICAgIHJvdXRlclN0b3JlU3RhdGU6IFJvdXRlclJlZHVjZXJTdGF0ZSxcbiAgICBzdG9yZVN0YXRlOiBhbnlcbiAgKTogdm9pZCB7XG4gICAgaWYgKCFyb3V0ZXJTdG9yZVN0YXRlIHx8ICFyb3V0ZXJTdG9yZVN0YXRlLnN0YXRlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0aGlzLnRyaWdnZXIgPT09IFJvdXRlclRyaWdnZXIuUk9VVEVSKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0aGlzLmxhc3RFdmVudCBpbnN0YW5jZW9mIE5hdmlnYXRpb25TdGFydCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHVybCA9IHJvdXRlclN0b3JlU3RhdGUuc3RhdGUudXJsO1xuICAgIGlmICh0aGlzLnJvdXRlci51cmwgIT09IHVybCkge1xuICAgICAgdGhpcy5zdG9yZVN0YXRlID0gc3RvcmVTdGF0ZTtcbiAgICAgIHRoaXMudHJpZ2dlciA9IFJvdXRlclRyaWdnZXIuU1RPUkU7XG4gICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZUJ5VXJsKHVybCkuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICB0aGlzLmVycm9ySGFuZGxlci5oYW5kbGVFcnJvcihlcnJvcik7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHNldFVwUm91dGVyRXZlbnRzTGlzdGVuZXIoKTogdm9pZCB7XG4gICAgY29uc3QgZGlzcGF0Y2hOYXZMYXRlID1cbiAgICAgIHRoaXMuY29uZmlnLm5hdmlnYXRpb25BY3Rpb25UaW1pbmcgPT09XG4gICAgICBOYXZpZ2F0aW9uQWN0aW9uVGltaW5nLlBvc3RBY3RpdmF0aW9uO1xuICAgIGxldCByb3V0ZXNSZWNvZ25pemVkOiBSb3V0ZXNSZWNvZ25pemVkO1xuXG4gICAgdGhpcy5yb3V0ZXIuZXZlbnRzXG4gICAgICAucGlwZSh3aXRoTGF0ZXN0RnJvbSh0aGlzLnN0b3JlKSlcbiAgICAgIC5zdWJzY3JpYmUoKFtldmVudCwgc3RvcmVTdGF0ZV0pID0+IHtcbiAgICAgICAgdGhpcy5sYXN0RXZlbnQgPSBldmVudDtcblxuICAgICAgICBpZiAoZXZlbnQgaW5zdGFuY2VvZiBOYXZpZ2F0aW9uU3RhcnQpIHtcbiAgICAgICAgICB0aGlzLnJvdXRlclN0YXRlID0gdGhpcy5zZXJpYWxpemVyLnNlcmlhbGl6ZShcbiAgICAgICAgICAgIHRoaXMucm91dGVyLnJvdXRlclN0YXRlLnNuYXBzaG90XG4gICAgICAgICAgKTtcbiAgICAgICAgICBpZiAodGhpcy50cmlnZ2VyICE9PSBSb3V0ZXJUcmlnZ2VyLlNUT1JFKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3JlU3RhdGUgPSBzdG9yZVN0YXRlO1xuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaFJvdXRlclJlcXVlc3QoZXZlbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChldmVudCBpbnN0YW5jZW9mIFJvdXRlc1JlY29nbml6ZWQpIHtcbiAgICAgICAgICByb3V0ZXNSZWNvZ25pemVkID0gZXZlbnQ7XG5cbiAgICAgICAgICBpZiAoIWRpc3BhdGNoTmF2TGF0ZSAmJiB0aGlzLnRyaWdnZXIgIT09IFJvdXRlclRyaWdnZXIuU1RPUkUpIHtcbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hSb3V0ZXJOYXZpZ2F0aW9uKGV2ZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnQgaW5zdGFuY2VvZiBOYXZpZ2F0aW9uQ2FuY2VsKSB7XG4gICAgICAgICAgdGhpcy5kaXNwYXRjaFJvdXRlckNhbmNlbChldmVudCk7XG4gICAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50IGluc3RhbmNlb2YgTmF2aWdhdGlvbkVycm9yKSB7XG4gICAgICAgICAgdGhpcy5kaXNwYXRjaFJvdXRlckVycm9yKGV2ZW50KTtcbiAgICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnQgaW5zdGFuY2VvZiBOYXZpZ2F0aW9uRW5kKSB7XG4gICAgICAgICAgaWYgKHRoaXMudHJpZ2dlciAhPT0gUm91dGVyVHJpZ2dlci5TVE9SRSkge1xuICAgICAgICAgICAgaWYgKGRpc3BhdGNoTmF2TGF0ZSkge1xuICAgICAgICAgICAgICB0aGlzLmRpc3BhdGNoUm91dGVyTmF2aWdhdGlvbihyb3V0ZXNSZWNvZ25pemVkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hSb3V0ZXJOYXZpZ2F0ZWQoZXZlbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBkaXNwYXRjaFJvdXRlclJlcXVlc3QoZXZlbnQ6IE5hdmlnYXRpb25TdGFydCk6IHZvaWQge1xuICAgIHRoaXMuZGlzcGF0Y2hSb3V0ZXJBY3Rpb24oUk9VVEVSX1JFUVVFU1QsIHsgZXZlbnQgfSk7XG4gIH1cblxuICBwcml2YXRlIGRpc3BhdGNoUm91dGVyTmF2aWdhdGlvbihcbiAgICBsYXN0Um91dGVzUmVjb2duaXplZDogUm91dGVzUmVjb2duaXplZFxuICApOiB2b2lkIHtcbiAgICBjb25zdCBuZXh0Um91dGVyU3RhdGUgPSB0aGlzLnNlcmlhbGl6ZXIuc2VyaWFsaXplKFxuICAgICAgbGFzdFJvdXRlc1JlY29nbml6ZWQuc3RhdGVcbiAgICApO1xuICAgIHRoaXMuZGlzcGF0Y2hSb3V0ZXJBY3Rpb24oUk9VVEVSX05BVklHQVRJT04sIHtcbiAgICAgIHJvdXRlclN0YXRlOiBuZXh0Um91dGVyU3RhdGUsXG4gICAgICBldmVudDogbmV3IFJvdXRlc1JlY29nbml6ZWQoXG4gICAgICAgIGxhc3RSb3V0ZXNSZWNvZ25pemVkLmlkLFxuICAgICAgICBsYXN0Um91dGVzUmVjb2duaXplZC51cmwsXG4gICAgICAgIGxhc3RSb3V0ZXNSZWNvZ25pemVkLnVybEFmdGVyUmVkaXJlY3RzLFxuICAgICAgICBuZXh0Um91dGVyU3RhdGVcbiAgICAgICksXG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGRpc3BhdGNoUm91dGVyQ2FuY2VsKGV2ZW50OiBOYXZpZ2F0aW9uQ2FuY2VsKTogdm9pZCB7XG4gICAgdGhpcy5kaXNwYXRjaFJvdXRlckFjdGlvbihST1VURVJfQ0FOQ0VMLCB7XG4gICAgICBzdG9yZVN0YXRlOiB0aGlzLnN0b3JlU3RhdGUsXG4gICAgICBldmVudCxcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgZGlzcGF0Y2hSb3V0ZXJFcnJvcihldmVudDogTmF2aWdhdGlvbkVycm9yKTogdm9pZCB7XG4gICAgdGhpcy5kaXNwYXRjaFJvdXRlckFjdGlvbihST1VURVJfRVJST1IsIHtcbiAgICAgIHN0b3JlU3RhdGU6IHRoaXMuc3RvcmVTdGF0ZSxcbiAgICAgIGV2ZW50OiBuZXcgTmF2aWdhdGlvbkVycm9yKGV2ZW50LmlkLCBldmVudC51cmwsIGAke2V2ZW50fWApLFxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBkaXNwYXRjaFJvdXRlck5hdmlnYXRlZChldmVudDogTmF2aWdhdGlvbkVuZCk6IHZvaWQge1xuICAgIGNvbnN0IHJvdXRlclN0YXRlID0gdGhpcy5zZXJpYWxpemVyLnNlcmlhbGl6ZShcbiAgICAgIHRoaXMucm91dGVyLnJvdXRlclN0YXRlLnNuYXBzaG90XG4gICAgKTtcbiAgICB0aGlzLmRpc3BhdGNoUm91dGVyQWN0aW9uKFJPVVRFUl9OQVZJR0FURUQsIHsgZXZlbnQsIHJvdXRlclN0YXRlIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBkaXNwYXRjaFJvdXRlckFjdGlvbihcbiAgICB0eXBlOiBzdHJpbmcsXG4gICAgcGF5bG9hZDogU3RvcmVSb3V0ZXJBY3Rpb25QYXlsb2FkXG4gICk6IHZvaWQge1xuICAgIHRoaXMudHJpZ2dlciA9IFJvdXRlclRyaWdnZXIuUk9VVEVSO1xuICAgIHRyeSB7XG4gICAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKHtcbiAgICAgICAgdHlwZSxcbiAgICAgICAgcGF5bG9hZDoge1xuICAgICAgICAgIHJvdXRlclN0YXRlOiB0aGlzLnJvdXRlclN0YXRlLFxuICAgICAgICAgIC4uLnBheWxvYWQsXG4gICAgICAgICAgZXZlbnQ6XG4gICAgICAgICAgICB0aGlzLmNvbmZpZy5yb3V0ZXJTdGF0ZSA9PT0gUm91dGVyU3RhdGUuTWluaW1hbFxuICAgICAgICAgICAgICA/IHsgaWQ6IHBheWxvYWQuZXZlbnQuaWQsIHVybDogcGF5bG9hZC5ldmVudC51cmwgfVxuICAgICAgICAgICAgICA6IHBheWxvYWQuZXZlbnQsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdGhpcy50cmlnZ2VyID0gUm91dGVyVHJpZ2dlci5OT05FO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgcmVzZXQoKSB7XG4gICAgdGhpcy50cmlnZ2VyID0gUm91dGVyVHJpZ2dlci5OT05FO1xuICAgIHRoaXMuc3RvcmVTdGF0ZSA9IG51bGw7XG4gICAgdGhpcy5yb3V0ZXJTdGF0ZSA9IG51bGw7XG4gIH1cbn1cbiJdfQ==