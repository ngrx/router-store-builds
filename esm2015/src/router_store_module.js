/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
                payload: Object.assign({ routerState: this.routerState }, payload, { event: this.config.routerState === 1 /* Minimal */
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyX3N0b3JlX21vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvcm91dGVyLXN0b3JlL3NyYy9yb3V0ZXJfc3RvcmVfbW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQ0wsTUFBTSxFQUNOLGNBQWMsRUFFZCxRQUFRLEVBQ1IsWUFBWSxHQUNiLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFDTCxnQkFBZ0IsRUFDaEIsZUFBZSxFQUNmLGFBQWEsRUFDYixNQUFNLEVBQ04sZ0JBQWdCLEVBQ2hCLGVBQWUsR0FHaEIsTUFBTSxpQkFBaUIsQ0FBQztBQUN6QixPQUFPLEVBQUUsTUFBTSxFQUFZLEtBQUssRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUN0RCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFaEQsT0FBTyxFQUNMLGFBQWEsRUFDYixZQUFZLEVBQ1osZ0JBQWdCLEVBQ2hCLGlCQUFpQixFQUNqQixjQUFjLEdBQ2YsTUFBTSxXQUFXLENBQUM7QUFFbkIsT0FBTyxFQUNMLHFCQUFxQixHQUV0QixNQUFNLG9CQUFvQixDQUFDO0FBQzVCLE9BQU8sRUFDTCw0QkFBNEIsR0FFN0IsTUFBTSxrQ0FBa0MsQ0FBQztBQUMxQyxPQUFPLEVBQUUsNEJBQTRCLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQzs7O0lBVzlFLE9BQUk7SUFDSixVQUFPOzs7Ozs7O0FBR1QsdUNBbUJDOzs7SUFoQkMscUNBQWlDOztJQUNqQyx1Q0FBMkQ7Ozs7Ozs7OztJQVEzRCxtREFBZ0Q7Ozs7Ozs7SUFNaEQsd0NBQTBCOzs7OztBQUc1Qix1Q0FJQzs7O0lBSEMseUNBQW1COztJQUNuQiwrQ0FBNEM7O0lBQzVDLDhDQUFpQjs7OztJQUlqQixnQkFBaUI7SUFDakIsaUJBQWtCOzs7Ozs7QUFHcEIsTUFBTSxPQUFPLGNBQWMsR0FBRyxJQUFJLGNBQWMsQ0FDOUMsMkNBQTJDLENBQzVDOztBQUNELE1BQU0sT0FBTyxhQUFhLEdBQUcsSUFBSSxjQUFjLENBQzdDLGtDQUFrQyxDQUNuQzs7QUFDRCxNQUFNLE9BQU8sMEJBQTBCLEdBQUcsUUFBUTs7Ozs7QUFFbEQsTUFBTSxVQUFVLG1CQUFtQixDQUNqQyxNQUF5QjtJQUV6Qix1QkFDRSxRQUFRLEVBQUUsMEJBQTBCLEVBQ3BDLFVBQVUsRUFBRSw0QkFBNEIsRUFDeEMsc0JBQXNCLEVBQUUsc0JBQXNCLENBQUMsYUFBYSxJQUN6RCxNQUFNLEVBQ1Q7QUFDSixDQUFDOzs7SUFHQyxPQUFRO0lBQ1IsU0FBVTtJQUNWLFFBQVM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBOENYLE1BQU0sT0FBTywyQkFBMkI7Ozs7Ozs7O0lBa0N0QyxZQUNVLEtBQWlCLEVBQ2pCLE1BQWMsRUFDZCxVQUFnRSxFQUNoRSxZQUEwQixFQUNILE1BQXlCO1FBSmhELFVBQUssR0FBTCxLQUFLLENBQVk7UUFDakIsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUNkLGVBQVUsR0FBVixVQUFVLENBQXNEO1FBQ2hFLGlCQUFZLEdBQVosWUFBWSxDQUFjO1FBQ0gsV0FBTSxHQUFOLE1BQU0sQ0FBbUI7UUFabEQsY0FBUyxHQUFpQixJQUFJLENBQUM7UUFHL0IsWUFBTyxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUM7UUFXbkMsSUFBSSxDQUFDLFFBQVEsR0FBRyxtQkFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBc0IsQ0FBQztRQUUzRCxJQUFJLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztRQUMvQixJQUFJLENBQUMseUJBQXlCLEVBQUUsQ0FBQztJQUNuQyxDQUFDOzs7Ozs7SUE1Q0QsTUFBTSxDQUFDLE9BQU8sQ0FHWixTQUErQixFQUFFO1FBRWpDLE9BQU87WUFDTCxRQUFRLEVBQUUsMkJBQTJCO1lBQ3JDLFNBQVMsRUFBRTtnQkFDVCxFQUFFLE9BQU8sRUFBRSxjQUFjLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRTtnQkFDN0M7b0JBQ0UsT0FBTyxFQUFFLGFBQWE7b0JBQ3RCLFVBQVUsRUFBRSxtQkFBbUI7b0JBQy9CLElBQUksRUFBRSxDQUFDLGNBQWMsQ0FBQztpQkFDdkI7Z0JBQ0Q7b0JBQ0UsT0FBTyxFQUFFLHFCQUFxQjtvQkFDOUIsUUFBUSxFQUFFLE1BQU0sQ0FBQyxVQUFVO3dCQUN6QixDQUFDLENBQUMsTUFBTSxDQUFDLFVBQVU7d0JBQ25CLENBQUMsQ0FBQyxNQUFNLENBQUMsV0FBVyxvQkFBd0I7NEJBQzFDLENBQUMsQ0FBQyw0QkFBNEI7NEJBQzlCLENBQUMsQ0FBQyw0QkFBNEI7aUJBQ25DO2FBQ0Y7U0FDRixDQUFDO0lBQ0osQ0FBQzs7Ozs7SUFzQk8sdUJBQXVCO1FBQzdCLElBQUksQ0FBQyxLQUFLO2FBQ1AsSUFBSSxDQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQ3JCLGNBQWMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQzNCO2FBQ0EsU0FBUzs7OztRQUFDLENBQUMsQ0FBQyxnQkFBZ0IsRUFBRSxVQUFVLENBQUMsRUFBRSxFQUFFO1lBQzVDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxnQkFBZ0IsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUN0RCxDQUFDLEVBQUMsQ0FBQztJQUNQLENBQUM7Ozs7Ozs7SUFFTyxnQkFBZ0IsQ0FDdEIsZ0JBQW9DLEVBQ3BDLFVBQWU7UUFFZixJQUFJLENBQUMsZ0JBQWdCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUU7WUFDaEQsT0FBTztTQUNSO1FBQ0QsSUFBSSxJQUFJLENBQUMsT0FBTyxLQUFLLGFBQWEsQ0FBQyxNQUFNLEVBQUU7WUFDekMsT0FBTztTQUNSO1FBQ0QsSUFBSSxJQUFJLENBQUMsU0FBUyxZQUFZLGVBQWUsRUFBRTtZQUM3QyxPQUFPO1NBQ1I7O2NBRUssR0FBRyxHQUFHLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxHQUFHO1FBQ3RDLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEtBQUssR0FBRyxFQUFFO1lBQzNCLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO1lBQzdCLElBQUksQ0FBQyxPQUFPLEdBQUcsYUFBYSxDQUFDLEtBQUssQ0FBQztZQUNuQyxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLOzs7O1lBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQzNDLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3ZDLENBQUMsRUFBQyxDQUFDO1NBQ0o7SUFDSCxDQUFDOzs7OztJQUVPLHlCQUF5Qjs7Y0FDekIsZUFBZSxHQUNuQixJQUFJLENBQUMsTUFBTSxDQUFDLHNCQUFzQjtZQUNsQyxzQkFBc0IsQ0FBQyxjQUFjOztZQUNuQyxnQkFBa0M7UUFFdEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNO2FBQ2YsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDaEMsU0FBUzs7OztRQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLEVBQUUsRUFBRTtZQUNqQyxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztZQUV2QixJQUFJLEtBQUssWUFBWSxlQUFlLEVBQUU7Z0JBQ3BDLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQzFDLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FDakMsQ0FBQztnQkFDRixJQUFJLElBQUksQ0FBQyxPQUFPLEtBQUssYUFBYSxDQUFDLEtBQUssRUFBRTtvQkFDeEMsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7b0JBQzdCLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztpQkFDbkM7YUFDRjtpQkFBTSxJQUFJLEtBQUssWUFBWSxnQkFBZ0IsRUFBRTtnQkFDNUMsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDO2dCQUV6QixJQUFJLENBQUMsZUFBZSxJQUFJLElBQUksQ0FBQyxPQUFPLEtBQUssYUFBYSxDQUFDLEtBQUssRUFBRTtvQkFDNUQsSUFBSSxDQUFDLHdCQUF3QixDQUFDLEtBQUssQ0FBQyxDQUFDO2lCQUN0QzthQUNGO2lCQUFNLElBQUksS0FBSyxZQUFZLGdCQUFnQixFQUFFO2dCQUM1QyxJQUFJLENBQUMsb0JBQW9CLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ2pDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQzthQUNkO2lCQUFNLElBQUksS0FBSyxZQUFZLGVBQWUsRUFBRTtnQkFDM0MsSUFBSSxDQUFDLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNoQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7YUFDZDtpQkFBTSxJQUFJLEtBQUssWUFBWSxhQUFhLEVBQUU7Z0JBQ3pDLElBQUksSUFBSSxDQUFDLE9BQU8sS0FBSyxhQUFhLENBQUMsS0FBSyxFQUFFO29CQUN4QyxJQUFJLGVBQWUsRUFBRTt3QkFDbkIsSUFBSSxDQUFDLHdCQUF3QixDQUFDLGdCQUFnQixDQUFDLENBQUM7cUJBQ2pEO29CQUNELElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztpQkFDckM7Z0JBQ0QsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO2FBQ2Q7UUFDSCxDQUFDLEVBQUMsQ0FBQztJQUNQLENBQUM7Ozs7OztJQUVPLHFCQUFxQixDQUFDLEtBQXNCO1FBQ2xELElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxjQUFjLEVBQUUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBQ3ZELENBQUM7Ozs7OztJQUVPLHdCQUF3QixDQUM5QixvQkFBc0M7O2NBRWhDLGVBQWUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FDL0Msb0JBQW9CLENBQUMsS0FBSyxDQUMzQjtRQUNELElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxpQkFBaUIsRUFBRTtZQUMzQyxXQUFXLEVBQUUsZUFBZTtZQUM1QixLQUFLLEVBQUUsSUFBSSxnQkFBZ0IsQ0FDekIsb0JBQW9CLENBQUMsRUFBRSxFQUN2QixvQkFBb0IsQ0FBQyxHQUFHLEVBQ3hCLG9CQUFvQixDQUFDLGlCQUFpQixFQUN0QyxlQUFlLENBQ2hCO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQzs7Ozs7O0lBRU8sb0JBQW9CLENBQUMsS0FBdUI7UUFDbEQsSUFBSSxDQUFDLG9CQUFvQixDQUFDLGFBQWEsRUFBRTtZQUN2QyxVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVU7WUFDM0IsS0FBSztTQUNOLENBQUMsQ0FBQztJQUNMLENBQUM7Ozs7OztJQUVPLG1CQUFtQixDQUFDLEtBQXNCO1FBQ2hELElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxZQUFZLEVBQUU7WUFDdEMsVUFBVSxFQUFFLElBQUksQ0FBQyxVQUFVO1lBQzNCLEtBQUssRUFBRSxJQUFJLGVBQWUsQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxLQUFLLEVBQUUsQ0FBQztTQUM1RCxDQUFDLENBQUM7SUFDTCxDQUFDOzs7Ozs7SUFFTyx1QkFBdUIsQ0FBQyxLQUFvQjs7Y0FDNUMsV0FBVyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUMzQyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQ2pDO1FBQ0QsSUFBSSxDQUFDLG9CQUFvQixDQUFDLGdCQUFnQixFQUFFLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBRSxDQUFDLENBQUM7SUFDdEUsQ0FBQzs7Ozs7OztJQUVPLG9CQUFvQixDQUMxQixJQUFZLEVBQ1osT0FBaUM7UUFFakMsSUFBSSxDQUFDLE9BQU8sR0FBRyxhQUFhLENBQUMsTUFBTSxDQUFDO1FBQ3BDLElBQUk7WUFDRixJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQztnQkFDbEIsSUFBSTtnQkFDSixPQUFPLGtCQUNMLFdBQVcsRUFBRSxJQUFJLENBQUMsV0FBVyxJQUMxQixPQUFPLElBQ1YsS0FBSyxFQUNILElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxvQkFBd0I7d0JBQzdDLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUU7d0JBQ2xELENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxHQUNwQjthQUNGLENBQUMsQ0FBQztTQUNKO2dCQUFTO1lBQ1IsSUFBSSxDQUFDLE9BQU8sR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFDO1NBQ25DO0lBQ0gsQ0FBQzs7Ozs7SUFFTyxLQUFLO1FBQ1gsSUFBSSxDQUFDLE9BQU8sR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFDO1FBQ2xDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO0lBQzFCLENBQUM7OztZQWxNRixRQUFRLFNBQUMsRUFBRTs7OztZQXJJZSxLQUFLO1lBTjlCLE1BQU07WUFrQk4scUJBQXFCO1lBeEJyQixZQUFZOzRDQXlMVCxNQUFNLFNBQUMsYUFBYTs7Ozs7OztJQVp2QixnREFBdUM7Ozs7O0lBQ3ZDLGtEQUEwRDs7Ozs7SUFDMUQsaURBQXdCOzs7OztJQUN4Qiw4Q0FBcUM7Ozs7O0lBRXJDLCtDQUFxQzs7Ozs7SUFHbkMsNENBQXlCOzs7OztJQUN6Qiw2Q0FBc0I7Ozs7O0lBQ3RCLGlEQUF3RTs7Ozs7SUFDeEUsbURBQWtDOzs7OztJQUNsQyw2Q0FBd0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBJbmplY3QsXG4gIEluamVjdGlvblRva2VuLFxuICBNb2R1bGVXaXRoUHJvdmlkZXJzLFxuICBOZ01vZHVsZSxcbiAgRXJyb3JIYW5kbGVyLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIE5hdmlnYXRpb25DYW5jZWwsXG4gIE5hdmlnYXRpb25FcnJvcixcbiAgTmF2aWdhdGlvbkVuZCxcbiAgUm91dGVyLFxuICBSb3V0ZXNSZWNvZ25pemVkLFxuICBOYXZpZ2F0aW9uU3RhcnQsXG4gIEV2ZW50LFxuICBSb3V0ZXJFdmVudCxcbn0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IHNlbGVjdCwgU2VsZWN0b3IsIFN0b3JlIH0gZnJvbSAnQG5ncngvc3RvcmUnO1xuaW1wb3J0IHsgd2l0aExhdGVzdEZyb20gfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7XG4gIFJPVVRFUl9DQU5DRUwsXG4gIFJPVVRFUl9FUlJPUixcbiAgUk9VVEVSX05BVklHQVRFRCxcbiAgUk9VVEVSX05BVklHQVRJT04sXG4gIFJPVVRFUl9SRVFVRVNULFxufSBmcm9tICcuL2FjdGlvbnMnO1xuaW1wb3J0IHsgUm91dGVyUmVkdWNlclN0YXRlIH0gZnJvbSAnLi9yZWR1Y2VyJztcbmltcG9ydCB7XG4gIFJvdXRlclN0YXRlU2VyaWFsaXplcixcbiAgQmFzZVJvdXRlclN0b3JlU3RhdGUsXG59IGZyb20gJy4vc2VyaWFsaXplcnMvYmFzZSc7XG5pbXBvcnQge1xuICBEZWZhdWx0Um91dGVyU3RhdGVTZXJpYWxpemVyLFxuICBTZXJpYWxpemVkUm91dGVyU3RhdGVTbmFwc2hvdCxcbn0gZnJvbSAnLi9zZXJpYWxpemVycy9kZWZhdWx0X3NlcmlhbGl6ZXInO1xuaW1wb3J0IHsgTWluaW1hbFJvdXRlclN0YXRlU2VyaWFsaXplciB9IGZyb20gJy4vc2VyaWFsaXplcnMvbWluaW1hbF9zZXJpYWxpemVyJztcblxuZXhwb3J0IHR5cGUgU3RhdGVLZXlPclNlbGVjdG9yPFxuICBUIGV4dGVuZHMgQmFzZVJvdXRlclN0b3JlU3RhdGUgPSBTZXJpYWxpemVkUm91dGVyU3RhdGVTbmFwc2hvdFxuPiA9IHN0cmluZyB8IFNlbGVjdG9yPGFueSwgUm91dGVyUmVkdWNlclN0YXRlPFQ+PjtcblxuLyoqXG4gKiBGdWxsID0gU2VyaWFsaXplcyB0aGUgcm91dGVyIGV2ZW50IHdpdGggRGVmYXVsdFJvdXRlclN0YXRlU2VyaWFsaXplclxuICogTWluaW1hbCA9IFNlcmlhbGl6ZXMgdGhlIHJvdXRlciBldmVudCB3aXRoIE1pbmltYWxSb3V0ZXJTdGF0ZVNlcmlhbGl6ZXJcbiAqL1xuZXhwb3J0IGNvbnN0IGVudW0gUm91dGVyU3RhdGUge1xuICBGdWxsLFxuICBNaW5pbWFsLFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFN0b3JlUm91dGVyQ29uZmlnPFxuICBUIGV4dGVuZHMgQmFzZVJvdXRlclN0b3JlU3RhdGUgPSBTZXJpYWxpemVkUm91dGVyU3RhdGVTbmFwc2hvdFxuPiB7XG4gIHN0YXRlS2V5PzogU3RhdGVLZXlPclNlbGVjdG9yPFQ+O1xuICBzZXJpYWxpemVyPzogbmV3ICguLi5hcmdzOiBhbnlbXSkgPT4gUm91dGVyU3RhdGVTZXJpYWxpemVyO1xuICAvKipcbiAgICogQnkgZGVmYXVsdCwgUk9VVEVSX05BVklHQVRJT04gaXMgZGlzcGF0Y2hlZCBiZWZvcmUgZ3VhcmRzIGFuZCByZXNvbHZlcnMgcnVuLlxuICAgKiBUaGVyZWZvcmUsIHRoZSBhY3Rpb24gY291bGQgcnVuIHRvbyBzb29uLCBmb3IgZXhhbXBsZVxuICAgKiB0aGVyZSBtYXkgYmUgYSBuYXZpZ2F0aW9uIGNhbmNlbCBkdWUgdG8gYSBndWFyZCBzYXlpbmcgdGhlIG5hdmlnYXRpb24gaXMgbm90IGFsbG93ZWQuXG4gICAqIFRvIHJ1biBST1VURVJfTkFWSUdBVElPTiBhZnRlciBndWFyZHMgYW5kIHJlc29sdmVycyxcbiAgICogc2V0IHRoaXMgcHJvcGVydHkgdG8gTmF2aWdhdGlvbkFjdGlvblRpbWluZy5Qb3N0QWN0aXZhdGlvbi5cbiAgICovXG4gIG5hdmlnYXRpb25BY3Rpb25UaW1pbmc/OiBOYXZpZ2F0aW9uQWN0aW9uVGltaW5nO1xuICAvKipcbiAgICogRGVjaWRlcyB3aGljaCByb3V0ZXIgc2VyaWFsaXplciBzaG91bGQgYmUgdXNlZCwgaWYgdGhlcmUgaXMgbm9uZSBwcm92aWRlZCwgYW5kIHRoZSBtZXRhZGF0YSBvbiB0aGUgZGlzcGF0Y2hlZCBAbmdyeC9yb3V0ZXItc3RvcmUgYWN0aW9uIHBheWxvYWQuXG4gICAqIFNldCB0byBgRnVsbGAgdG8gdXNlIHRoZSBgRGVmYXVsdFJvdXRlclN0YXRlU2VyaWFsaXplcmAgYW5kIHRvIHNldCB0aGUgYW5ndWxhciByb3V0ZXIgZXZlbnRzIGFzIHBheWxvYWQuXG4gICAqIFNldCB0byBgTWluaW1hbGAgdG8gdXNlIHRoZSBgTWluaW1hbFJvdXRlclN0YXRlU2VyaWFsaXplcmAgYW5kIHRvIHNldCBhIG1pbmltYWwgcm91dGVyIGV2ZW50IHdpdGggdGhlIG5hdmlnYXRpb24gaWQgYW5kIHVybCBhcyBwYXlsb2FkLlxuICAgKi9cbiAgcm91dGVyU3RhdGU/OiBSb3V0ZXJTdGF0ZTtcbn1cblxuaW50ZXJmYWNlIFN0b3JlUm91dGVyQWN0aW9uUGF5bG9hZCB7XG4gIGV2ZW50OiBSb3V0ZXJFdmVudDtcbiAgcm91dGVyU3RhdGU/OiBTZXJpYWxpemVkUm91dGVyU3RhdGVTbmFwc2hvdDtcbiAgc3RvcmVTdGF0ZT86IGFueTtcbn1cblxuZXhwb3J0IGVudW0gTmF2aWdhdGlvbkFjdGlvblRpbWluZyB7XG4gIFByZUFjdGl2YXRpb24gPSAxLFxuICBQb3N0QWN0aXZhdGlvbiA9IDIsXG59XG5cbmV4cG9ydCBjb25zdCBfUk9VVEVSX0NPTkZJRyA9IG5ldyBJbmplY3Rpb25Ub2tlbihcbiAgJ0BuZ3J4L3JvdXRlci1zdG9yZSBJbnRlcm5hbCBDb25maWd1cmF0aW9uJ1xuKTtcbmV4cG9ydCBjb25zdCBST1VURVJfQ09ORklHID0gbmV3IEluamVjdGlvblRva2VuKFxuICAnQG5ncngvcm91dGVyLXN0b3JlIENvbmZpZ3VyYXRpb24nXG4pO1xuZXhwb3J0IGNvbnN0IERFRkFVTFRfUk9VVEVSX0ZFQVRVUkVOQU1FID0gJ3JvdXRlcic7XG5cbmV4cG9ydCBmdW5jdGlvbiBfY3JlYXRlUm91dGVyQ29uZmlnKFxuICBjb25maWc6IFN0b3JlUm91dGVyQ29uZmlnXG4pOiBTdG9yZVJvdXRlckNvbmZpZyB7XG4gIHJldHVybiB7XG4gICAgc3RhdGVLZXk6IERFRkFVTFRfUk9VVEVSX0ZFQVRVUkVOQU1FLFxuICAgIHNlcmlhbGl6ZXI6IERlZmF1bHRSb3V0ZXJTdGF0ZVNlcmlhbGl6ZXIsXG4gICAgbmF2aWdhdGlvbkFjdGlvblRpbWluZzogTmF2aWdhdGlvbkFjdGlvblRpbWluZy5QcmVBY3RpdmF0aW9uLFxuICAgIC4uLmNvbmZpZyxcbiAgfTtcbn1cblxuZW51bSBSb3V0ZXJUcmlnZ2VyIHtcbiAgTk9ORSA9IDEsXG4gIFJPVVRFUiA9IDIsXG4gIFNUT1JFID0gMyxcbn1cblxuLyoqXG4gKiBDb25uZWN0cyBSb3V0ZXJNb2R1bGUgd2l0aCBTdG9yZU1vZHVsZS5cbiAqXG4gKiBEdXJpbmcgdGhlIG5hdmlnYXRpb24sIGJlZm9yZSBhbnkgZ3VhcmRzIG9yIHJlc29sdmVycyBydW4sIHRoZSByb3V0ZXIgd2lsbCBkaXNwYXRjaFxuICogYSBST1VURVJfTkFWSUdBVElPTiBhY3Rpb24sIHdoaWNoIGhhcyB0aGUgZm9sbG93aW5nIHNpZ25hdHVyZTpcbiAqXG4gKiBgYGBcbiAqIGV4cG9ydCB0eXBlIFJvdXRlck5hdmlnYXRpb25QYXlsb2FkID0ge1xuICogICByb3V0ZXJTdGF0ZTogU2VyaWFsaXplZFJvdXRlclN0YXRlU25hcHNob3QsXG4gKiAgIGV2ZW50OiBSb3V0ZXNSZWNvZ25pemVkXG4gKiB9XG4gKiBgYGBcbiAqXG4gKiBFaXRoZXIgYSByZWR1Y2VyIG9yIGFuIGVmZmVjdCBjYW4gYmUgaW52b2tlZCBpbiByZXNwb25zZSB0byB0aGlzIGFjdGlvbi5cbiAqIElmIHRoZSBpbnZva2VkIHJlZHVjZXIgdGhyb3dzLCB0aGUgbmF2aWdhdGlvbiB3aWxsIGJlIGNhbmNlbGVkLlxuICpcbiAqIElmIG5hdmlnYXRpb24gZ2V0cyBjYW5jZWxlZCBiZWNhdXNlIG9mIGEgZ3VhcmQsIGEgUk9VVEVSX0NBTkNFTCBhY3Rpb24gd2lsbCBiZVxuICogZGlzcGF0Y2hlZC4gSWYgbmF2aWdhdGlvbiByZXN1bHRzIGluIGFuIGVycm9yLCBhIFJPVVRFUl9FUlJPUiBhY3Rpb24gd2lsbCBiZSBkaXNwYXRjaGVkLlxuICpcbiAqIEJvdGggUk9VVEVSX0NBTkNFTCBhbmQgUk9VVEVSX0VSUk9SIGNvbnRhaW4gdGhlIHN0b3JlIHN0YXRlIGJlZm9yZSB0aGUgbmF2aWdhdGlvblxuICogd2hpY2ggY2FuIGJlIHVzZWQgdG8gcmVzdG9yZSB0aGUgY29uc2lzdGVuY3kgb2YgdGhlIHN0b3JlLlxuICpcbiAqIFVzYWdlOlxuICpcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIEBOZ01vZHVsZSh7XG4gKiAgIGRlY2xhcmF0aW9uczogW0FwcENtcCwgU2ltcGxlQ21wXSxcbiAqICAgaW1wb3J0czogW1xuICogICAgIEJyb3dzZXJNb2R1bGUsXG4gKiAgICAgU3RvcmVNb2R1bGUuZm9yUm9vdChtYXBPZlJlZHVjZXJzKSxcbiAqICAgICBSb3V0ZXJNb2R1bGUuZm9yUm9vdChbXG4gKiAgICAgICB7IHBhdGg6ICcnLCBjb21wb25lbnQ6IFNpbXBsZUNtcCB9LFxuICogICAgICAgeyBwYXRoOiAnbmV4dCcsIGNvbXBvbmVudDogU2ltcGxlQ21wIH1cbiAqICAgICBdKSxcbiAqICAgICBTdG9yZVJvdXRlckNvbm5lY3RpbmdNb2R1bGUuZm9yUm9vdCgpXG4gKiAgIF0sXG4gKiAgIGJvb3RzdHJhcDogW0FwcENtcF1cbiAqIH0pXG4gKiBleHBvcnQgY2xhc3MgQXBwTW9kdWxlIHtcbiAqIH1cbiAqIGBgYFxuICovXG5ATmdNb2R1bGUoe30pXG5leHBvcnQgY2xhc3MgU3RvcmVSb3V0ZXJDb25uZWN0aW5nTW9kdWxlIHtcbiAgc3RhdGljIGZvclJvb3Q8XG4gICAgVCBleHRlbmRzIEJhc2VSb3V0ZXJTdG9yZVN0YXRlID0gU2VyaWFsaXplZFJvdXRlclN0YXRlU25hcHNob3RcbiAgPihcbiAgICBjb25maWc6IFN0b3JlUm91dGVyQ29uZmlnPFQ+ID0ge31cbiAgKTogTW9kdWxlV2l0aFByb3ZpZGVyczxTdG9yZVJvdXRlckNvbm5lY3RpbmdNb2R1bGU+IHtcbiAgICByZXR1cm4ge1xuICAgICAgbmdNb2R1bGU6IFN0b3JlUm91dGVyQ29ubmVjdGluZ01vZHVsZSxcbiAgICAgIHByb3ZpZGVyczogW1xuICAgICAgICB7IHByb3ZpZGU6IF9ST1VURVJfQ09ORklHLCB1c2VWYWx1ZTogY29uZmlnIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBwcm92aWRlOiBST1VURVJfQ09ORklHLFxuICAgICAgICAgIHVzZUZhY3Rvcnk6IF9jcmVhdGVSb3V0ZXJDb25maWcsXG4gICAgICAgICAgZGVwczogW19ST1VURVJfQ09ORklHXSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHByb3ZpZGU6IFJvdXRlclN0YXRlU2VyaWFsaXplcixcbiAgICAgICAgICB1c2VDbGFzczogY29uZmlnLnNlcmlhbGl6ZXJcbiAgICAgICAgICAgID8gY29uZmlnLnNlcmlhbGl6ZXJcbiAgICAgICAgICAgIDogY29uZmlnLnJvdXRlclN0YXRlID09PSBSb3V0ZXJTdGF0ZS5NaW5pbWFsXG4gICAgICAgICAgICAgID8gTWluaW1hbFJvdXRlclN0YXRlU2VyaWFsaXplclxuICAgICAgICAgICAgICA6IERlZmF1bHRSb3V0ZXJTdGF0ZVNlcmlhbGl6ZXIsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIGxhc3RFdmVudDogRXZlbnQgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSByb3V0ZXJTdGF0ZTogU2VyaWFsaXplZFJvdXRlclN0YXRlU25hcHNob3QgfCBudWxsO1xuICBwcml2YXRlIHN0b3JlU3RhdGU6IGFueTtcbiAgcHJpdmF0ZSB0cmlnZ2VyID0gUm91dGVyVHJpZ2dlci5OT05FO1xuXG4gIHByaXZhdGUgc3RhdGVLZXk6IFN0YXRlS2V5T3JTZWxlY3RvcjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHN0b3JlOiBTdG9yZTxhbnk+LFxuICAgIHByaXZhdGUgcm91dGVyOiBSb3V0ZXIsXG4gICAgcHJpdmF0ZSBzZXJpYWxpemVyOiBSb3V0ZXJTdGF0ZVNlcmlhbGl6ZXI8U2VyaWFsaXplZFJvdXRlclN0YXRlU25hcHNob3Q+LFxuICAgIHByaXZhdGUgZXJyb3JIYW5kbGVyOiBFcnJvckhhbmRsZXIsXG4gICAgQEluamVjdChST1VURVJfQ09ORklHKSBwcml2YXRlIGNvbmZpZzogU3RvcmVSb3V0ZXJDb25maWdcbiAgKSB7XG4gICAgdGhpcy5zdGF0ZUtleSA9IHRoaXMuY29uZmlnLnN0YXRlS2V5IGFzIFN0YXRlS2V5T3JTZWxlY3RvcjtcblxuICAgIHRoaXMuc2V0VXBTdG9yZVN0YXRlTGlzdGVuZXIoKTtcbiAgICB0aGlzLnNldFVwUm91dGVyRXZlbnRzTGlzdGVuZXIoKTtcbiAgfVxuXG4gIHByaXZhdGUgc2V0VXBTdG9yZVN0YXRlTGlzdGVuZXIoKTogdm9pZCB7XG4gICAgdGhpcy5zdG9yZVxuICAgICAgLnBpcGUoXG4gICAgICAgIHNlbGVjdCh0aGlzLnN0YXRlS2V5KSxcbiAgICAgICAgd2l0aExhdGVzdEZyb20odGhpcy5zdG9yZSlcbiAgICAgIClcbiAgICAgIC5zdWJzY3JpYmUoKFtyb3V0ZXJTdG9yZVN0YXRlLCBzdG9yZVN0YXRlXSkgPT4ge1xuICAgICAgICB0aGlzLm5hdmlnYXRlSWZOZWVkZWQocm91dGVyU3RvcmVTdGF0ZSwgc3RvcmVTdGF0ZSk7XG4gICAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgbmF2aWdhdGVJZk5lZWRlZChcbiAgICByb3V0ZXJTdG9yZVN0YXRlOiBSb3V0ZXJSZWR1Y2VyU3RhdGUsXG4gICAgc3RvcmVTdGF0ZTogYW55XG4gICk6IHZvaWQge1xuICAgIGlmICghcm91dGVyU3RvcmVTdGF0ZSB8fCAhcm91dGVyU3RvcmVTdGF0ZS5zdGF0ZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodGhpcy50cmlnZ2VyID09PSBSb3V0ZXJUcmlnZ2VyLlJPVVRFUikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodGhpcy5sYXN0RXZlbnQgaW5zdGFuY2VvZiBOYXZpZ2F0aW9uU3RhcnQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB1cmwgPSByb3V0ZXJTdG9yZVN0YXRlLnN0YXRlLnVybDtcbiAgICBpZiAodGhpcy5yb3V0ZXIudXJsICE9PSB1cmwpIHtcbiAgICAgIHRoaXMuc3RvcmVTdGF0ZSA9IHN0b3JlU3RhdGU7XG4gICAgICB0aGlzLnRyaWdnZXIgPSBSb3V0ZXJUcmlnZ2VyLlNUT1JFO1xuICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGVCeVVybCh1cmwpLmNhdGNoKGVycm9yID0+IHtcbiAgICAgICAgdGhpcy5lcnJvckhhbmRsZXIuaGFuZGxlRXJyb3IoZXJyb3IpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzZXRVcFJvdXRlckV2ZW50c0xpc3RlbmVyKCk6IHZvaWQge1xuICAgIGNvbnN0IGRpc3BhdGNoTmF2TGF0ZSA9XG4gICAgICB0aGlzLmNvbmZpZy5uYXZpZ2F0aW9uQWN0aW9uVGltaW5nID09PVxuICAgICAgTmF2aWdhdGlvbkFjdGlvblRpbWluZy5Qb3N0QWN0aXZhdGlvbjtcbiAgICBsZXQgcm91dGVzUmVjb2duaXplZDogUm91dGVzUmVjb2duaXplZDtcblxuICAgIHRoaXMucm91dGVyLmV2ZW50c1xuICAgICAgLnBpcGUod2l0aExhdGVzdEZyb20odGhpcy5zdG9yZSkpXG4gICAgICAuc3Vic2NyaWJlKChbZXZlbnQsIHN0b3JlU3RhdGVdKSA9PiB7XG4gICAgICAgIHRoaXMubGFzdEV2ZW50ID0gZXZlbnQ7XG5cbiAgICAgICAgaWYgKGV2ZW50IGluc3RhbmNlb2YgTmF2aWdhdGlvblN0YXJ0KSB7XG4gICAgICAgICAgdGhpcy5yb3V0ZXJTdGF0ZSA9IHRoaXMuc2VyaWFsaXplci5zZXJpYWxpemUoXG4gICAgICAgICAgICB0aGlzLnJvdXRlci5yb3V0ZXJTdGF0ZS5zbmFwc2hvdFxuICAgICAgICAgICk7XG4gICAgICAgICAgaWYgKHRoaXMudHJpZ2dlciAhPT0gUm91dGVyVHJpZ2dlci5TVE9SRSkge1xuICAgICAgICAgICAgdGhpcy5zdG9yZVN0YXRlID0gc3RvcmVTdGF0ZTtcbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hSb3V0ZXJSZXF1ZXN0KGV2ZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnQgaW5zdGFuY2VvZiBSb3V0ZXNSZWNvZ25pemVkKSB7XG4gICAgICAgICAgcm91dGVzUmVjb2duaXplZCA9IGV2ZW50O1xuXG4gICAgICAgICAgaWYgKCFkaXNwYXRjaE5hdkxhdGUgJiYgdGhpcy50cmlnZ2VyICE9PSBSb3V0ZXJUcmlnZ2VyLlNUT1JFKSB7XG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoUm91dGVyTmF2aWdhdGlvbihldmVudCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50IGluc3RhbmNlb2YgTmF2aWdhdGlvbkNhbmNlbCkge1xuICAgICAgICAgIHRoaXMuZGlzcGF0Y2hSb3V0ZXJDYW5jZWwoZXZlbnQpO1xuICAgICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICAgICAgfSBlbHNlIGlmIChldmVudCBpbnN0YW5jZW9mIE5hdmlnYXRpb25FcnJvcikge1xuICAgICAgICAgIHRoaXMuZGlzcGF0Y2hSb3V0ZXJFcnJvcihldmVudCk7XG4gICAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50IGluc3RhbmNlb2YgTmF2aWdhdGlvbkVuZCkge1xuICAgICAgICAgIGlmICh0aGlzLnRyaWdnZXIgIT09IFJvdXRlclRyaWdnZXIuU1RPUkUpIHtcbiAgICAgICAgICAgIGlmIChkaXNwYXRjaE5hdkxhdGUpIHtcbiAgICAgICAgICAgICAgdGhpcy5kaXNwYXRjaFJvdXRlck5hdmlnYXRpb24ocm91dGVzUmVjb2duaXplZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoUm91dGVyTmF2aWdhdGVkKGV2ZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgZGlzcGF0Y2hSb3V0ZXJSZXF1ZXN0KGV2ZW50OiBOYXZpZ2F0aW9uU3RhcnQpOiB2b2lkIHtcbiAgICB0aGlzLmRpc3BhdGNoUm91dGVyQWN0aW9uKFJPVVRFUl9SRVFVRVNULCB7IGV2ZW50IH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBkaXNwYXRjaFJvdXRlck5hdmlnYXRpb24oXG4gICAgbGFzdFJvdXRlc1JlY29nbml6ZWQ6IFJvdXRlc1JlY29nbml6ZWRcbiAgKTogdm9pZCB7XG4gICAgY29uc3QgbmV4dFJvdXRlclN0YXRlID0gdGhpcy5zZXJpYWxpemVyLnNlcmlhbGl6ZShcbiAgICAgIGxhc3RSb3V0ZXNSZWNvZ25pemVkLnN0YXRlXG4gICAgKTtcbiAgICB0aGlzLmRpc3BhdGNoUm91dGVyQWN0aW9uKFJPVVRFUl9OQVZJR0FUSU9OLCB7XG4gICAgICByb3V0ZXJTdGF0ZTogbmV4dFJvdXRlclN0YXRlLFxuICAgICAgZXZlbnQ6IG5ldyBSb3V0ZXNSZWNvZ25pemVkKFxuICAgICAgICBsYXN0Um91dGVzUmVjb2duaXplZC5pZCxcbiAgICAgICAgbGFzdFJvdXRlc1JlY29nbml6ZWQudXJsLFxuICAgICAgICBsYXN0Um91dGVzUmVjb2duaXplZC51cmxBZnRlclJlZGlyZWN0cyxcbiAgICAgICAgbmV4dFJvdXRlclN0YXRlXG4gICAgICApLFxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBkaXNwYXRjaFJvdXRlckNhbmNlbChldmVudDogTmF2aWdhdGlvbkNhbmNlbCk6IHZvaWQge1xuICAgIHRoaXMuZGlzcGF0Y2hSb3V0ZXJBY3Rpb24oUk9VVEVSX0NBTkNFTCwge1xuICAgICAgc3RvcmVTdGF0ZTogdGhpcy5zdG9yZVN0YXRlLFxuICAgICAgZXZlbnQsXG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGRpc3BhdGNoUm91dGVyRXJyb3IoZXZlbnQ6IE5hdmlnYXRpb25FcnJvcik6IHZvaWQge1xuICAgIHRoaXMuZGlzcGF0Y2hSb3V0ZXJBY3Rpb24oUk9VVEVSX0VSUk9SLCB7XG4gICAgICBzdG9yZVN0YXRlOiB0aGlzLnN0b3JlU3RhdGUsXG4gICAgICBldmVudDogbmV3IE5hdmlnYXRpb25FcnJvcihldmVudC5pZCwgZXZlbnQudXJsLCBgJHtldmVudH1gKSxcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgZGlzcGF0Y2hSb3V0ZXJOYXZpZ2F0ZWQoZXZlbnQ6IE5hdmlnYXRpb25FbmQpOiB2b2lkIHtcbiAgICBjb25zdCByb3V0ZXJTdGF0ZSA9IHRoaXMuc2VyaWFsaXplci5zZXJpYWxpemUoXG4gICAgICB0aGlzLnJvdXRlci5yb3V0ZXJTdGF0ZS5zbmFwc2hvdFxuICAgICk7XG4gICAgdGhpcy5kaXNwYXRjaFJvdXRlckFjdGlvbihST1VURVJfTkFWSUdBVEVELCB7IGV2ZW50LCByb3V0ZXJTdGF0ZSB9KTtcbiAgfVxuXG4gIHByaXZhdGUgZGlzcGF0Y2hSb3V0ZXJBY3Rpb24oXG4gICAgdHlwZTogc3RyaW5nLFxuICAgIHBheWxvYWQ6IFN0b3JlUm91dGVyQWN0aW9uUGF5bG9hZFxuICApOiB2b2lkIHtcbiAgICB0aGlzLnRyaWdnZXIgPSBSb3V0ZXJUcmlnZ2VyLlJPVVRFUjtcbiAgICB0cnkge1xuICAgICAgdGhpcy5zdG9yZS5kaXNwYXRjaCh7XG4gICAgICAgIHR5cGUsXG4gICAgICAgIHBheWxvYWQ6IHtcbiAgICAgICAgICByb3V0ZXJTdGF0ZTogdGhpcy5yb3V0ZXJTdGF0ZSxcbiAgICAgICAgICAuLi5wYXlsb2FkLFxuICAgICAgICAgIGV2ZW50OlxuICAgICAgICAgICAgdGhpcy5jb25maWcucm91dGVyU3RhdGUgPT09IFJvdXRlclN0YXRlLk1pbmltYWxcbiAgICAgICAgICAgICAgPyB7IGlkOiBwYXlsb2FkLmV2ZW50LmlkLCB1cmw6IHBheWxvYWQuZXZlbnQudXJsIH1cbiAgICAgICAgICAgICAgOiBwYXlsb2FkLmV2ZW50LFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRoaXMudHJpZ2dlciA9IFJvdXRlclRyaWdnZXIuTk9ORTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHJlc2V0KCkge1xuICAgIHRoaXMudHJpZ2dlciA9IFJvdXRlclRyaWdnZXIuTk9ORTtcbiAgICB0aGlzLnN0b3JlU3RhdGUgPSBudWxsO1xuICAgIHRoaXMucm91dGVyU3RhdGUgPSBudWxsO1xuICB9XG59XG4iXX0=