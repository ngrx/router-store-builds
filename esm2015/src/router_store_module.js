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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyX3N0b3JlX21vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvcm91dGVyLXN0b3JlL3NyYy9yb3V0ZXJfc3RvcmVfbW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUNMLE1BQU0sRUFDTixjQUFjLEVBRWQsUUFBUSxFQUNSLFlBQVksR0FDYixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQ0wsZ0JBQWdCLEVBQ2hCLGVBQWUsRUFDZixhQUFhLEVBQ2IsTUFBTSxFQUNOLGdCQUFnQixFQUNoQixlQUFlLEdBR2hCLE1BQU0saUJBQWlCLENBQUM7QUFDekIsT0FBTyxFQUFFLE1BQU0sRUFBWSxLQUFLLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDdEQsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRWhELE9BQU8sRUFDTCxhQUFhLEVBQ2IsWUFBWSxFQUNaLGdCQUFnQixFQUNoQixpQkFBaUIsRUFDakIsY0FBYyxHQUNmLE1BQU0sV0FBVyxDQUFDO0FBRW5CLE9BQU8sRUFDTCxxQkFBcUIsR0FFdEIsTUFBTSxvQkFBb0IsQ0FBQztBQUM1QixPQUFPLEVBQ0wsNEJBQTRCLEdBRTdCLE1BQU0sa0NBQWtDLENBQUM7QUFDMUMsT0FBTyxFQUFFLDRCQUE0QixFQUFFLE1BQU0sa0NBQWtDLENBQUM7O0FBVWhGLE1BQWtCLFdBQVc7SUFDM0IsSUFBSSxHQUFBO0lBQ0osT0FBTyxHQUFBO0VBQ1I7Ozs7OztBQUVELHVDQW1CQzs7O0lBaEJDLHFDQUFpQzs7SUFDakMsdUNBQTJEOzs7Ozs7Ozs7SUFRM0QsbURBQWdEOzs7Ozs7O0lBTWhELHdDQUEwQjs7Ozs7QUFHNUIsdUNBSUM7OztJQUhDLHlDQUFtQjs7SUFDbkIsK0NBQTRDOztJQUM1Qyw4Q0FBaUI7OztBQUduQixNQUFZLHNCQUFzQjtJQUNoQyxhQUFhLEdBQUk7SUFDakIsY0FB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UUFBUSxDQUFDO2dCQUNsQixJQUFJO2dCQUNKLE9BQU8sZ0NBQ0wsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXLElBQzFCLE9BQU8sS0FDVixLQUFLLEVBQ0gsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLG9CQUF3Qjt3QkFDN0MsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLEdBQUcsRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRTt3QkFDbEQsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEdBQ3BCO2FBQ0YsQ0FBQyxDQUFDO1NBQ0o7Z0JBQVM7WUFDUixJQUFJLENBQUMsT0FBTyxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUM7U0FDbkM7SUFDSCxDQUFDOzs7OztJQUVPLEtBQUs7UUFDWCxJQUFJLENBQUMsT0FBTyxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUM7UUFDbEMsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7UUFDdkIsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7SUFDMUIsQ0FBQzs7O1lBbE1GLFFBQVEsU0FBQyxFQUFFOzs7O1lBckllLEtBQUs7WUFOOUIsTUFBTTtZQWtCTixxQkFBcUI7WUF4QnJCLFlBQVk7NENBeUxULE1BQU0sU0FBQyxhQUFhOzs7Ozs7O0lBWnZCLGdEQUF1Qzs7Ozs7SUFDdkMsa0RBQWlFOzs7OztJQUNqRSxpREFBd0I7Ozs7O0lBQ3hCLDhDQUFxQzs7Ozs7SUFFckMsK0NBQXFDOzs7OztJQUduQyw0Q0FBeUI7Ozs7O0lBQ3pCLDZDQUFzQjs7Ozs7SUFDdEIsaURBQXdFOzs7OztJQUN4RSxtREFBa0M7Ozs7O0lBQ2xDLDZDQUF3RCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIEluamVjdCxcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIE1vZHVsZVdpdGhQcm92aWRlcnMsXG4gIE5nTW9kdWxlLFxuICBFcnJvckhhbmRsZXIsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgTmF2aWdhdGlvbkNhbmNlbCxcbiAgTmF2aWdhdGlvbkVycm9yLFxuICBOYXZpZ2F0aW9uRW5kLFxuICBSb3V0ZXIsXG4gIFJvdXRlc1JlY29nbml6ZWQsXG4gIE5hdmlnYXRpb25TdGFydCxcbiAgRXZlbnQsXG4gIFJvdXRlckV2ZW50LFxufSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgc2VsZWN0LCBTZWxlY3RvciwgU3RvcmUgfSBmcm9tICdAbmdyeC9zdG9yZSc7XG5pbXBvcnQgeyB3aXRoTGF0ZXN0RnJvbSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHtcbiAgUk9VVEVSX0NBTkNFTCxcbiAgUk9VVEVSX0VSUk9SLFxuICBST1VURVJfTkFWSUdBVEVELFxuICBST1VURVJfTkFWSUdBVElPTixcbiAgUk9VVEVSX1JFUVVFU1QsXG59IGZyb20gJy4vYWN0aW9ucyc7XG5pbXBvcnQgeyBSb3V0ZXJSZWR1Y2VyU3RhdGUgfSBmcm9tICcuL3JlZHVjZXInO1xuaW1wb3J0IHtcbiAgUm91dGVyU3RhdGVTZXJpYWxpemVyLFxuICBCYXNlUm91dGVyU3RvcmVTdGF0ZSxcbn0gZnJvbSAnLi9zZXJpYWxpemVycy9iYXNlJztcbmltcG9ydCB7XG4gIERlZmF1bHRSb3V0ZXJTdGF0ZVNlcmlhbGl6ZXIsXG4gIFNlcmlhbGl6ZWRSb3V0ZXJTdGF0ZVNuYXBzaG90LFxufSBmcm9tICcuL3NlcmlhbGl6ZXJzL2RlZmF1bHRfc2VyaWFsaXplcic7XG5pbXBvcnQgeyBNaW5pbWFsUm91dGVyU3RhdGVTZXJpYWxpemVyIH0gZnJvbSAnLi9zZXJpYWxpemVycy9taW5pbWFsX3NlcmlhbGl6ZXInO1xuXG5leHBvcnQgdHlwZSBTdGF0ZUtleU9yU2VsZWN0b3I8XG4gIFQgZXh0ZW5kcyBCYXNlUm91dGVyU3RvcmVTdGF0ZSA9IFNlcmlhbGl6ZWRSb3V0ZXJTdGF0ZVNuYXBzaG90XG4+ID0gc3RyaW5nIHwgU2VsZWN0b3I8YW55LCBSb3V0ZXJSZWR1Y2VyU3RhdGU8VD4+O1xuXG4vKipcbiAqIEZ1bGwgPSBTZXJpYWxpemVzIHRoZSByb3V0ZXIgZXZlbnQgd2l0aCBEZWZhdWx0Um91dGVyU3RhdGVTZXJpYWxpemVyXG4gKiBNaW5pbWFsID0gU2VyaWFsaXplcyB0aGUgcm91dGVyIGV2ZW50IHdpdGggTWluaW1hbFJvdXRlclN0YXRlU2VyaWFsaXplclxuICovXG5leHBvcnQgY29uc3QgZW51bSBSb3V0ZXJTdGF0ZSB7XG4gIEZ1bGwsXG4gIE1pbmltYWwsXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgU3RvcmVSb3V0ZXJDb25maWc8XG4gIFQgZXh0ZW5kcyBCYXNlUm91dGVyU3RvcmVTdGF0ZSA9IFNlcmlhbGl6ZWRSb3V0ZXJTdGF0ZVNuYXBzaG90XG4+IHtcbiAgc3RhdGVLZXk/OiBTdGF0ZUtleU9yU2VsZWN0b3I8VD47XG4gIHNlcmlhbGl6ZXI/OiBuZXcgKC4uLmFyZ3M6IGFueVtdKSA9PiBSb3V0ZXJTdGF0ZVNlcmlhbGl6ZXI7XG4gIC8qKlxuICAgKiBCeSBkZWZhdWx0LCBST1VURVJfTkFWSUdBVElPTiBpcyBkaXNwYXRjaGVkIGJlZm9yZSBndWFyZHMgYW5kIHJlc29sdmVycyBydW4uXG4gICAqIFRoZXJlZm9yZSwgdGhlIGFjdGlvbiBjb3VsZCBydW4gdG9vIHNvb24sIGZvciBleGFtcGxlXG4gICAqIHRoZXJlIG1heSBiZSBhIG5hdmlnYXRpb24gY2FuY2VsIGR1ZSB0byBhIGd1YXJkIHNheWluZyB0aGUgbmF2aWdhdGlvbiBpcyBub3QgYWxsb3dlZC5cbiAgICogVG8gcnVuIFJPVVRFUl9OQVZJR0FUSU9OIGFmdGVyIGd1YXJkcyBhbmQgcmVzb2x2ZXJzLFxuICAgKiBzZXQgdGhpcyBwcm9wZXJ0eSB0byBOYXZpZ2F0aW9uQWN0aW9uVGltaW5nLlBvc3RBY3RpdmF0aW9uLlxuICAgKi9cbiAgbmF2aWdhdGlvbkFjdGlvblRpbWluZz86IE5hdmlnYXRpb25BY3Rpb25UaW1pbmc7XG4gIC8qKlxuICAgKiBEZWNpZGVzIHdoaWNoIHJvdXRlciBzZXJpYWxpemVyIHNob3VsZCBiZSB1c2VkLCBpZiB0aGVyZSBpcyBub25lIHByb3ZpZGVkLCBhbmQgdGhlIG1ldGFkYXRhIG9uIHRoZSBkaXNwYXRjaGVkIEBuZ3J4L3JvdXRlci1zdG9yZSBhY3Rpb24gcGF5bG9hZC5cbiAgICogU2V0IHRvIGBGdWxsYCB0byB1c2UgdGhlIGBEZWZhdWx0Um91dGVyU3RhdGVTZXJpYWxpemVyYCBhbmQgdG8gc2V0IHRoZSBhbmd1bGFyIHJvdXRlciBldmVudHMgYXMgcGF5bG9hZC5cbiAgICogU2V0IHRvIGBNaW5pbWFsYCB0byB1c2UgdGhlIGBNaW5pbWFsUm91dGVyU3RhdGVTZXJpYWxpemVyYCBhbmQgdG8gc2V0IGEgbWluaW1hbCByb3V0ZXIgZXZlbnQgd2l0aCB0aGUgbmF2aWdhdGlvbiBpZCBhbmQgdXJsIGFzIHBheWxvYWQuXG4gICAqL1xuICByb3V0ZXJTdGF0ZT86IFJvdXRlclN0YXRlO1xufVxuXG5pbnRlcmZhY2UgU3RvcmVSb3V0ZXJBY3Rpb25QYXlsb2FkIHtcbiAgZXZlbnQ6IFJvdXRlckV2ZW50O1xuICByb3V0ZXJTdGF0ZT86IFNlcmlhbGl6ZWRSb3V0ZXJTdGF0ZVNuYXBzaG90O1xuICBzdG9yZVN0YXRlPzogYW55O1xufVxuXG5leHBvcnQgZW51bSBOYXZpZ2F0aW9uQWN0aW9uVGltaW5nIHtcbiAgUHJlQWN0aXZhdGlvbiA9IDEsXG4gIFBvc3RBY3RpdmF0aW9uID0gMixcbn1cblxuZXhwb3J0IGNvbnN0IF9ST1VURVJfQ09ORklHID0gbmV3IEluamVjdGlvblRva2VuKFxuICAnQG5ncngvcm91dGVyLXN0b3JlIEludGVybmFsIENvbmZpZ3VyYXRpb24nXG4pO1xuZXhwb3J0IGNvbnN0IFJPVVRFUl9DT05GSUcgPSBuZXcgSW5qZWN0aW9uVG9rZW4oXG4gICdAbmdyeC9yb3V0ZXItc3RvcmUgQ29uZmlndXJhdGlvbidcbik7XG5leHBvcnQgY29uc3QgREVGQVVMVF9ST1VURVJfRkVBVFVSRU5BTUUgPSAncm91dGVyJztcblxuZXhwb3J0IGZ1bmN0aW9uIF9jcmVhdGVSb3V0ZXJDb25maWcoXG4gIGNvbmZpZzogU3RvcmVSb3V0ZXJDb25maWdcbik6IFN0b3JlUm91dGVyQ29uZmlnIHtcbiAgcmV0dXJuIHtcbiAgICBzdGF0ZUtleTogREVGQVVMVF9ST1VURVJfRkVBVFVSRU5BTUUsXG4gICAgc2VyaWFsaXplcjogRGVmYXVsdFJvdXRlclN0YXRlU2VyaWFsaXplcixcbiAgICBuYXZpZ2F0aW9uQWN0aW9uVGltaW5nOiBOYXZpZ2F0aW9uQWN0aW9uVGltaW5nLlByZUFjdGl2YXRpb24sXG4gICAgLi4uY29uZmlnLFxuICB9O1xufVxuXG5lbnVtIFJvdXRlclRyaWdnZXIge1xuICBOT05FID0gMSxcbiAgUk9VVEVSID0gMixcbiAgU1RPUkUgPSAzLFxufVxuXG4vKipcbiAqIENvbm5lY3RzIFJvdXRlck1vZHVsZSB3aXRoIFN0b3JlTW9kdWxlLlxuICpcbiAqIER1cmluZyB0aGUgbmF2aWdhdGlvbiwgYmVmb3JlIGFueSBndWFyZHMgb3IgcmVzb2x2ZXJzIHJ1biwgdGhlIHJvdXRlciB3aWxsIGRpc3BhdGNoXG4gKiBhIFJPVVRFUl9OQVZJR0FUSU9OIGFjdGlvbiwgd2hpY2ggaGFzIHRoZSBmb2xsb3dpbmcgc2lnbmF0dXJlOlxuICpcbiAqIGBgYFxuICogZXhwb3J0IHR5cGUgUm91dGVyTmF2aWdhdGlvblBheWxvYWQgPSB7XG4gKiAgIHJvdXRlclN0YXRlOiBTZXJpYWxpemVkUm91dGVyU3RhdGVTbmFwc2hvdCxcbiAqICAgZXZlbnQ6IFJvdXRlc1JlY29nbml6ZWRcbiAqIH1cbiAqIGBgYFxuICpcbiAqIEVpdGhlciBhIHJlZHVjZXIgb3IgYW4gZWZmZWN0IGNhbiBiZSBpbnZva2VkIGluIHJlc3BvbnNlIHRvIHRoaXMgYWN0aW9uLlxuICogSWYgdGhlIGludm9rZWQgcmVkdWNlciB0aHJvd3MsIHRoZSBuYXZpZ2F0aW9uIHdpbGwgYmUgY2FuY2VsZWQuXG4gKlxuICogSWYgbmF2aWdhdGlvbiBnZXRzIGNhbmNlbGVkIGJlY2F1c2Ugb2YgYSBndWFyZCwgYSBST1VURVJfQ0FOQ0VMIGFjdGlvbiB3aWxsIGJlXG4gKiBkaXNwYXRjaGVkLiBJZiBuYXZpZ2F0aW9uIHJlc3VsdHMgaW4gYW4gZXJyb3IsIGEgUk9VVEVSX0VSUk9SIGFjdGlvbiB3aWxsIGJlIGRpc3BhdGNoZWQuXG4gKlxuICogQm90aCBST1VURVJfQ0FOQ0VMIGFuZCBST1VURVJfRVJST1IgY29udGFpbiB0aGUgc3RvcmUgc3RhdGUgYmVmb3JlIHRoZSBuYXZpZ2F0aW9uXG4gKiB3aGljaCBjYW4gYmUgdXNlZCB0byByZXN0b3JlIHRoZSBjb25zaXN0ZW5jeSBvZiB0aGUgc3RvcmUuXG4gKlxuICogVXNhZ2U6XG4gKlxuICogYGBgdHlwZXNjcmlwdFxuICogQE5nTW9kdWxlKHtcbiAqICAgZGVjbGFyYXRpb25zOiBbQXBwQ21wLCBTaW1wbGVDbXBdLFxuICogICBpbXBvcnRzOiBbXG4gKiAgICAgQnJvd3Nlck1vZHVsZSxcbiAqICAgICBTdG9yZU1vZHVsZS5mb3JSb290KG1hcE9mUmVkdWNlcnMpLFxuICogICAgIFJvdXRlck1vZHVsZS5mb3JSb290KFtcbiAqICAgICAgIHsgcGF0aDogJycsIGNvbXBvbmVudDogU2ltcGxlQ21wIH0sXG4gKiAgICAgICB7IHBhdGg6ICduZXh0JywgY29tcG9uZW50OiBTaW1wbGVDbXAgfVxuICogICAgIF0pLFxuICogICAgIFN0b3JlUm91dGVyQ29ubmVjdGluZ01vZHVsZS5mb3JSb290KClcbiAqICAgXSxcbiAqICAgYm9vdHN0cmFwOiBbQXBwQ21wXVxuICogfSlcbiAqIGV4cG9ydCBjbGFzcyBBcHBNb2R1bGUge1xuICogfVxuICogYGBgXG4gKi9cbkBOZ01vZHVsZSh7fSlcbmV4cG9ydCBjbGFzcyBTdG9yZVJvdXRlckNvbm5lY3RpbmdNb2R1bGUge1xuICBzdGF0aWMgZm9yUm9vdDxcbiAgICBUIGV4dGVuZHMgQmFzZVJvdXRlclN0b3JlU3RhdGUgPSBTZXJpYWxpemVkUm91dGVyU3RhdGVTbmFwc2hvdFxuICA+KFxuICAgIGNvbmZpZzogU3RvcmVSb3V0ZXJDb25maWc8VD4gPSB7fVxuICApOiBNb2R1bGVXaXRoUHJvdmlkZXJzPFN0b3JlUm91dGVyQ29ubmVjdGluZ01vZHVsZT4ge1xuICAgIHJldHVybiB7XG4gICAgICBuZ01vZHVsZTogU3RvcmVSb3V0ZXJDb25uZWN0aW5nTW9kdWxlLFxuICAgICAgcHJvdmlkZXJzOiBbXG4gICAgICAgIHsgcHJvdmlkZTogX1JPVVRFUl9DT05GSUcsIHVzZVZhbHVlOiBjb25maWcgfSxcbiAgICAgICAge1xuICAgICAgICAgIHByb3ZpZGU6IFJPVVRFUl9DT05GSUcsXG4gICAgICAgICAgdXNlRmFjdG9yeTogX2NyZWF0ZVJvdXRlckNvbmZpZyxcbiAgICAgICAgICBkZXBzOiBbX1JPVVRFUl9DT05GSUddLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogUm91dGVyU3RhdGVTZXJpYWxpemVyLFxuICAgICAgICAgIHVzZUNsYXNzOiBjb25maWcuc2VyaWFsaXplclxuICAgICAgICAgICAgPyBjb25maWcuc2VyaWFsaXplclxuICAgICAgICAgICAgOiBjb25maWcucm91dGVyU3RhdGUgPT09IFJvdXRlclN0YXRlLk1pbmltYWxcbiAgICAgICAgICAgICAgPyBNaW5pbWFsUm91dGVyU3RhdGVTZXJpYWxpemVyXG4gICAgICAgICAgICAgIDogRGVmYXVsdFJvdXRlclN0YXRlU2VyaWFsaXplcixcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgbGFzdEV2ZW50OiBFdmVudCB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIHJvdXRlclN0YXRlOiBTZXJpYWxpemVkUm91dGVyU3RhdGVTbmFwc2hvdCB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIHN0b3JlU3RhdGU6IGFueTtcbiAgcHJpdmF0ZSB0cmlnZ2VyID0gUm91dGVyVHJpZ2dlci5OT05FO1xuXG4gIHByaXZhdGUgc3RhdGVLZXk6IFN0YXRlS2V5T3JTZWxlY3RvcjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHN0b3JlOiBTdG9yZTxhbnk+LFxuICAgIHByaXZhdGUgcm91dGVyOiBSb3V0ZXIsXG4gICAgcHJpdmF0ZSBzZXJpYWxpemVyOiBSb3V0ZXJTdGF0ZVNlcmlhbGl6ZXI8U2VyaWFsaXplZFJvdXRlclN0YXRlU25hcHNob3Q+LFxuICAgIHByaXZhdGUgZXJyb3JIYW5kbGVyOiBFcnJvckhhbmRsZXIsXG4gICAgQEluamVjdChST1VURVJfQ09ORklHKSBwcml2YXRlIGNvbmZpZzogU3RvcmVSb3V0ZXJDb25maWdcbiAgKSB7XG4gICAgdGhpcy5zdGF0ZUtleSA9IHRoaXMuY29uZmlnLnN0YXRlS2V5IGFzIFN0YXRlS2V5T3JTZWxlY3RvcjtcblxuICAgIHRoaXMuc2V0VXBTdG9yZVN0YXRlTGlzdGVuZXIoKTtcbiAgICB0aGlzLnNldFVwUm91dGVyRXZlbnRzTGlzdGVuZXIoKTtcbiAgfVxuXG4gIHByaXZhdGUgc2V0VXBTdG9yZVN0YXRlTGlzdGVuZXIoKTogdm9pZCB7XG4gICAgdGhpcy5zdG9yZVxuICAgICAgLnBpcGUoXG4gICAgICAgIHNlbGVjdCh0aGlzLnN0YXRlS2V5IGFzIGFueSksXG4gICAgICAgIHdpdGhMYXRlc3RGcm9tKHRoaXMuc3RvcmUpXG4gICAgICApXG4gICAgICAuc3Vic2NyaWJlKChbcm91dGVyU3RvcmVTdGF0ZSwgc3RvcmVTdGF0ZV0pID0+IHtcbiAgICAgICAgdGhpcy5uYXZpZ2F0ZUlmTmVlZGVkKHJvdXRlclN0b3JlU3RhdGUsIHN0b3JlU3RhdGUpO1xuICAgICAgfSk7XG4gIH1cblxuICBwcml2YXRlIG5hdmlnYXRlSWZOZWVkZWQoXG4gICAgcm91dGVyU3RvcmVTdGF0ZTogUm91dGVyUmVkdWNlclN0YXRlLFxuICAgIHN0b3JlU3RhdGU6IGFueVxuICApOiB2b2lkIHtcbiAgICBpZiAoIXJvdXRlclN0b3JlU3RhdGUgfHwgIXJvdXRlclN0b3JlU3RhdGUuc3RhdGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHRoaXMudHJpZ2dlciA9PT0gUm91dGVyVHJpZ2dlci5ST1VURVIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHRoaXMubGFzdEV2ZW50IGluc3RhbmNlb2YgTmF2aWdhdGlvblN0YXJ0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgdXJsID0gcm91dGVyU3RvcmVTdGF0ZS5zdGF0ZS51cmw7XG4gICAgaWYgKHRoaXMucm91dGVyLnVybCAhPT0gdXJsKSB7XG4gICAgICB0aGlzLnN0b3JlU3RhdGUgPSBzdG9yZVN0YXRlO1xuICAgICAgdGhpcy50cmlnZ2VyID0gUm91dGVyVHJpZ2dlci5TVE9SRTtcbiAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlQnlVcmwodXJsKS5jYXRjaChlcnJvciA9PiB7XG4gICAgICAgIHRoaXMuZXJyb3JIYW5kbGVyLmhhbmRsZUVycm9yKGVycm9yKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgc2V0VXBSb3V0ZXJFdmVudHNMaXN0ZW5lcigpOiB2b2lkIHtcbiAgICBjb25zdCBkaXNwYXRjaE5hdkxhdGUgPVxuICAgICAgdGhpcy5jb25maWcubmF2aWdhdGlvbkFjdGlvblRpbWluZyA9PT1cbiAgICAgIE5hdmlnYXRpb25BY3Rpb25UaW1pbmcuUG9zdEFjdGl2YXRpb247XG4gICAgbGV0IHJvdXRlc1JlY29nbml6ZWQ6IFJvdXRlc1JlY29nbml6ZWQ7XG5cbiAgICB0aGlzLnJvdXRlci5ldmVudHNcbiAgICAgIC5waXBlKHdpdGhMYXRlc3RGcm9tKHRoaXMuc3RvcmUpKVxuICAgICAgLnN1YnNjcmliZSgoW2V2ZW50LCBzdG9yZVN0YXRlXSkgPT4ge1xuICAgICAgICB0aGlzLmxhc3RFdmVudCA9IGV2ZW50O1xuXG4gICAgICAgIGlmIChldmVudCBpbnN0YW5jZW9mIE5hdmlnYXRpb25TdGFydCkge1xuICAgICAgICAgIHRoaXMucm91dGVyU3RhdGUgPSB0aGlzLnNlcmlhbGl6ZXIuc2VyaWFsaXplKFxuICAgICAgICAgICAgdGhpcy5yb3V0ZXIucm91dGVyU3RhdGUuc25hcHNob3RcbiAgICAgICAgICApO1xuICAgICAgICAgIGlmICh0aGlzLnRyaWdnZXIgIT09IFJvdXRlclRyaWdnZXIuU1RPUkUpIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcmVTdGF0ZSA9IHN0b3JlU3RhdGU7XG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoUm91dGVyUmVxdWVzdChldmVudCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50IGluc3RhbmNlb2YgUm91dGVzUmVjb2duaXplZCkge1xuICAgICAgICAgIHJvdXRlc1JlY29nbml6ZWQgPSBldmVudDtcblxuICAgICAgICAgIGlmICghZGlzcGF0Y2hOYXZMYXRlICYmIHRoaXMudHJpZ2dlciAhPT0gUm91dGVyVHJpZ2dlci5TVE9SRSkge1xuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaFJvdXRlck5hdmlnYXRpb24oZXZlbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChldmVudCBpbnN0YW5jZW9mIE5hdmlnYXRpb25DYW5jZWwpIHtcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoUm91dGVyQ2FuY2VsKGV2ZW50KTtcbiAgICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnQgaW5zdGFuY2VvZiBOYXZpZ2F0aW9uRXJyb3IpIHtcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoUm91dGVyRXJyb3IoZXZlbnQpO1xuICAgICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICAgICAgfSBlbHNlIGlmIChldmVudCBpbnN0YW5jZW9mIE5hdmlnYXRpb25FbmQpIHtcbiAgICAgICAgICBpZiAodGhpcy50cmlnZ2VyICE9PSBSb3V0ZXJUcmlnZ2VyLlNUT1JFKSB7XG4gICAgICAgICAgICBpZiAoZGlzcGF0Y2hOYXZMYXRlKSB7XG4gICAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hSb3V0ZXJOYXZpZ2F0aW9uKHJvdXRlc1JlY29nbml6ZWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaFJvdXRlck5hdmlnYXRlZChldmVudCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGRpc3BhdGNoUm91dGVyUmVxdWVzdChldmVudDogTmF2aWdhdGlvblN0YXJ0KTogdm9pZCB7XG4gICAgdGhpcy5kaXNwYXRjaFJvdXRlckFjdGlvbihST1VURVJfUkVRVUVTVCwgeyBldmVudCB9KTtcbiAgfVxuXG4gIHByaXZhdGUgZGlzcGF0Y2hSb3V0ZXJOYXZpZ2F0aW9uKFxuICAgIGxhc3RSb3V0ZXNSZWNvZ25pemVkOiBSb3V0ZXNSZWNvZ25pemVkXG4gICk6IHZvaWQge1xuICAgIGNvbnN0IG5leHRSb3V0ZXJTdGF0ZSA9IHRoaXMuc2VyaWFsaXplci5zZXJpYWxpemUoXG4gICAgICBsYXN0Um91dGVzUmVjb2duaXplZC5zdGF0ZVxuICAgICk7XG4gICAgdGhpcy5kaXNwYXRjaFJvdXRlckFjdGlvbihST1VURVJfTkFWSUdBVElPTiwge1xuICAgICAgcm91dGVyU3RhdGU6IG5leHRSb3V0ZXJTdGF0ZSxcbiAgICAgIGV2ZW50OiBuZXcgUm91dGVzUmVjb2duaXplZChcbiAgICAgICAgbGFzdFJvdXRlc1JlY29nbml6ZWQuaWQsXG4gICAgICAgIGxhc3RSb3V0ZXNSZWNvZ25pemVkLnVybCxcbiAgICAgICAgbGFzdFJvdXRlc1JlY29nbml6ZWQudXJsQWZ0ZXJSZWRpcmVjdHMsXG4gICAgICAgIG5leHRSb3V0ZXJTdGF0ZVxuICAgICAgKSxcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgZGlzcGF0Y2hSb3V0ZXJDYW5jZWwoZXZlbnQ6IE5hdmlnYXRpb25DYW5jZWwpOiB2b2lkIHtcbiAgICB0aGlzLmRpc3BhdGNoUm91dGVyQWN0aW9uKFJPVVRFUl9DQU5DRUwsIHtcbiAgICAgIHN0b3JlU3RhdGU6IHRoaXMuc3RvcmVTdGF0ZSxcbiAgICAgIGV2ZW50LFxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBkaXNwYXRjaFJvdXRlckVycm9yKGV2ZW50OiBOYXZpZ2F0aW9uRXJyb3IpOiB2b2lkIHtcbiAgICB0aGlzLmRpc3BhdGNoUm91dGVyQWN0aW9uKFJPVVRFUl9FUlJPUiwge1xuICAgICAgc3RvcmVTdGF0ZTogdGhpcy5zdG9yZVN0YXRlLFxuICAgICAgZXZlbnQ6IG5ldyBOYXZpZ2F0aW9uRXJyb3IoZXZlbnQuaWQsIGV2ZW50LnVybCwgYCR7ZXZlbnR9YCksXG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGRpc3BhdGNoUm91dGVyTmF2aWdhdGVkKGV2ZW50OiBOYXZpZ2F0aW9uRW5kKTogdm9pZCB7XG4gICAgY29uc3Qgcm91dGVyU3RhdGUgPSB0aGlzLnNlcmlhbGl6ZXIuc2VyaWFsaXplKFxuICAgICAgdGhpcy5yb3V0ZXIucm91dGVyU3RhdGUuc25hcHNob3RcbiAgICApO1xuICAgIHRoaXMuZGlzcGF0Y2hSb3V0ZXJBY3Rpb24oUk9VVEVSX05BVklHQVRFRCwgeyBldmVudCwgcm91dGVyU3RhdGUgfSk7XG4gIH1cblxuICBwcml2YXRlIGRpc3BhdGNoUm91dGVyQWN0aW9uKFxuICAgIHR5cGU6IHN0cmluZyxcbiAgICBwYXlsb2FkOiBTdG9yZVJvdXRlckFjdGlvblBheWxvYWRcbiAgKTogdm9pZCB7XG4gICAgdGhpcy50cmlnZ2VyID0gUm91dGVyVHJpZ2dlci5ST1VURVI7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuc3RvcmUuZGlzcGF0Y2goe1xuICAgICAgICB0eXBlLFxuICAgICAgICBwYXlsb2FkOiB7XG4gICAgICAgICAgcm91dGVyU3RhdGU6IHRoaXMucm91dGVyU3RhdGUsXG4gICAgICAgICAgLi4ucGF5bG9hZCxcbiAgICAgICAgICBldmVudDpcbiAgICAgICAgICAgIHRoaXMuY29uZmlnLnJvdXRlclN0YXRlID09PSBSb3V0ZXJTdGF0ZS5NaW5pbWFsXG4gICAgICAgICAgICAgID8geyBpZDogcGF5bG9hZC5ldmVudC5pZCwgdXJsOiBwYXlsb2FkLmV2ZW50LnVybCB9XG4gICAgICAgICAgICAgIDogcGF5bG9hZC5ldmVudCxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0aGlzLnRyaWdnZXIgPSBSb3V0ZXJUcmlnZ2VyLk5PTkU7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSByZXNldCgpIHtcbiAgICB0aGlzLnRyaWdnZXIgPSBSb3V0ZXJUcmlnZ2VyLk5PTkU7XG4gICAgdGhpcy5zdG9yZVN0YXRlID0gbnVsbDtcbiAgICB0aGlzLnJvdXRlclN0YXRlID0gbnVsbDtcbiAgfVxufVxuIl19