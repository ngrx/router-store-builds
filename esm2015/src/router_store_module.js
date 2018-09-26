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
/**
 * @record
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
        this.trigger = RouterTrigger.NONE;
        this.stateKey = /** @type {?} */ (this.config.stateKey);
        this.setUpStoreStateListener();
        this.setUpRouterEventsListener();
    }
    /**
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyX3N0b3JlX21vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvcm91dGVyLXN0b3JlL3NyYy9yb3V0ZXJfc3RvcmVfbW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQ0wsTUFBTSxFQUNOLGNBQWMsRUFFZCxRQUFRLEVBQ1IsWUFBWSxHQUNiLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFDTCxnQkFBZ0IsRUFDaEIsZUFBZSxFQUNmLGFBQWEsRUFDYixNQUFNLEVBQ04sZ0JBQWdCLEVBQ2hCLGVBQWUsR0FDaEIsTUFBTSxpQkFBaUIsQ0FBQztBQUN6QixPQUFPLEVBQUUsTUFBTSxFQUFZLEtBQUssRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUN0RCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFaEQsT0FBTyxFQUNMLGFBQWEsRUFDYixZQUFZLEVBQ1osZ0JBQWdCLEVBQ2hCLGlCQUFpQixFQUNqQixjQUFjLEdBQ2YsTUFBTSxXQUFXLENBQUM7QUFFbkIsT0FBTyxFQUNMLDRCQUE0QixFQUM1QixxQkFBcUIsR0FFdEIsTUFBTSxjQUFjLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBa0JwQixnQkFBaUI7SUFDakIsaUJBQWtCOzs7OENBRGxCLGFBQWE7OENBQ2IsY0FBYzs7QUFHaEIsYUFBYSxjQUFjLEdBQUcsSUFBSSxjQUFjLENBQzlDLDJDQUEyQyxDQUM1QyxDQUFDOztBQUNGLGFBQWEsYUFBYSxHQUFHLElBQUksY0FBYyxDQUM3QyxrQ0FBa0MsQ0FDbkMsQ0FBQzs7QUFDRixhQUFhLDBCQUEwQixHQUFHLFFBQVEsQ0FBQzs7Ozs7QUFFbkQsTUFBTSw4QkFDSixNQUF5QjtJQUV6Qix1QkFDRSxRQUFRLEVBQUUsMEJBQTBCLEVBQ3BDLFVBQVUsRUFBRSw0QkFBNEIsRUFDeEMsc0JBQXNCLEVBQUUsc0JBQXNCLENB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QUUsQ0FBQyxDQUFDOzs7Ozs7O0lBR2pELG9CQUFvQixDQUFDLElBQVksRUFBRSxPQUFZO1FBQ3JELElBQUksQ0FBQyxPQUFPLEdBQUcsYUFBYSxDQUFDLE1BQU0sQ0FBQztRQUNwQyxJQUFJO1lBQ0YsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztTQUN4QztnQkFBUztZQUNSLElBQUksQ0FBQyxPQUFPLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQztTQUNuQzs7Ozs7SUFHSyxLQUFLO1FBQ1gsSUFBSSxDQUFDLE9BQU8sR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFDO1FBQ2xDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDOzs7O1lBbEwzQixRQUFRLFNBQUM7Z0JBQ1IsU0FBUyxFQUFFO29CQUNUO3dCQUNFLE9BQU8sRUFBRSxjQUFjO3dCQUN2QixRQUFRLElBQUk7cUJBQ2I7b0JBQ0Q7d0JBQ0UsT0FBTyxFQUFFLGFBQWE7d0JBQ3RCLFVBQVUsRUFBRSxtQkFBbUI7d0JBQy9CLElBQUksRUFBRSxDQUFDLGNBQWMsQ0FBQztxQkFDdkI7b0JBQ0Q7d0JBQ0UsT0FBTyxFQUFFLHFCQUFxQjt3QkFDOUIsUUFBUSxFQUFFLDRCQUE0QjtxQkFDdkM7aUJBQ0Y7YUFDRjs7OztZQXhIMEIsS0FBSztZQUo5QixNQUFNO1lBaUJOLHFCQUFxQjtZQXZCckIsWUFBWTs0Q0E4SlQsTUFBTSxTQUFDLGFBQWEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBJbmplY3QsXG4gIEluamVjdGlvblRva2VuLFxuICBNb2R1bGVXaXRoUHJvdmlkZXJzLFxuICBOZ01vZHVsZSxcbiAgRXJyb3JIYW5kbGVyLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIE5hdmlnYXRpb25DYW5jZWwsXG4gIE5hdmlnYXRpb25FcnJvcixcbiAgTmF2aWdhdGlvbkVuZCxcbiAgUm91dGVyLFxuICBSb3V0ZXNSZWNvZ25pemVkLFxuICBOYXZpZ2F0aW9uU3RhcnQsXG59IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBzZWxlY3QsIFNlbGVjdG9yLCBTdG9yZSB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcbmltcG9ydCB7IHdpdGhMYXRlc3RGcm9tIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQge1xuICBST1VURVJfQ0FOQ0VMLFxuICBST1VURVJfRVJST1IsXG4gIFJPVVRFUl9OQVZJR0FURUQsXG4gIFJPVVRFUl9OQVZJR0FUSU9OLFxuICBST1VURVJfUkVRVUVTVCxcbn0gZnJvbSAnLi9hY3Rpb25zJztcbmltcG9ydCB7IFJvdXRlclJlZHVjZXJTdGF0ZSB9IGZyb20gJy4vcmVkdWNlcic7XG5pbXBvcnQge1xuICBEZWZhdWx0Um91dGVyU3RhdGVTZXJpYWxpemVyLFxuICBSb3V0ZXJTdGF0ZVNlcmlhbGl6ZXIsXG4gIFNlcmlhbGl6ZWRSb3V0ZXJTdGF0ZVNuYXBzaG90LFxufSBmcm9tICcuL3NlcmlhbGl6ZXInO1xuXG5leHBvcnQgdHlwZSBTdGF0ZUtleU9yU2VsZWN0b3IgPSBzdHJpbmcgfCBTZWxlY3RvcjxhbnksIFJvdXRlclJlZHVjZXJTdGF0ZT47XG5cbmV4cG9ydCBpbnRlcmZhY2UgU3RvcmVSb3V0ZXJDb25maWcge1xuICBzdGF0ZUtleT86IFN0YXRlS2V5T3JTZWxlY3RvcjtcbiAgc2VyaWFsaXplcj86IG5ldyAoLi4uYXJnczogYW55W10pID0+IFJvdXRlclN0YXRlU2VyaWFsaXplcjtcbiAgLyoqXG4gICAqIEJ5IGRlZmF1bHQsIFJPVVRFUl9OQVZJR0FUSU9OIGlzIGRpc3BhdGNoZWQgYmVmb3JlIGd1YXJkcyBhbmQgcmVzb2x2ZXJzIHJ1bi5cbiAgICogVGhlcmVmb3JlLCB0aGUgYWN0aW9uIGNvdWxkIHJ1biB0b28gc29vbiwgZm9yIGV4YW1wbGVcbiAgICogdGhlcmUgbWF5IGJlIGEgbmF2aWdhdGlvbiBjYW5jZWwgZHVlIHRvIGEgZ3VhcmQgc2F5aW5nIHRoZSBuYXZpZ2F0aW9uIGlzIG5vdCBhbGxvd2VkLlxuICAgKiBUbyBydW4gUk9VVEVSX05BVklHQVRJT04gYWZ0ZXIgZ3VhcmRzIGFuZCByZXNvbHZlcnMsXG4gICAqIHNldCB0aGlzIHByb3BlcnR5IHRvIE5hdmlnYXRpb25BY3Rpb25UaW1pbmcuUG9zdEFjdGl2YXRpb24uXG4gICAqL1xuICBuYXZpZ2F0aW9uQWN0aW9uVGltaW5nPzogTmF2aWdhdGlvbkFjdGlvblRpbWluZztcbn1cblxuZXhwb3J0IGVudW0gTmF2aWdhdGlvbkFjdGlvblRpbWluZyB7XG4gIFByZUFjdGl2YXRpb24gPSAxLFxuICBQb3N0QWN0aXZhdGlvbiA9IDIsXG59XG5cbmV4cG9ydCBjb25zdCBfUk9VVEVSX0NPTkZJRyA9IG5ldyBJbmplY3Rpb25Ub2tlbihcbiAgJ0BuZ3J4L3JvdXRlci1zdG9yZSBJbnRlcm5hbCBDb25maWd1cmF0aW9uJ1xuKTtcbmV4cG9ydCBjb25zdCBST1VURVJfQ09ORklHID0gbmV3IEluamVjdGlvblRva2VuKFxuICAnQG5ncngvcm91dGVyLXN0b3JlIENvbmZpZ3VyYXRpb24nXG4pO1xuZXhwb3J0IGNvbnN0IERFRkFVTFRfUk9VVEVSX0ZFQVRVUkVOQU1FID0gJ3JvdXRlcic7XG5cbmV4cG9ydCBmdW5jdGlvbiBfY3JlYXRlUm91dGVyQ29uZmlnKFxuICBjb25maWc6IFN0b3JlUm91dGVyQ29uZmlnXG4pOiBTdG9yZVJvdXRlckNvbmZpZyB7XG4gIHJldHVybiB7XG4gICAgc3RhdGVLZXk6IERFRkFVTFRfUk9VVEVSX0ZFQVRVUkVOQU1FLFxuICAgIHNlcmlhbGl6ZXI6IERlZmF1bHRSb3V0ZXJTdGF0ZVNlcmlhbGl6ZXIsXG4gICAgbmF2aWdhdGlvbkFjdGlvblRpbWluZzogTmF2aWdhdGlvbkFjdGlvblRpbWluZy5QcmVBY3RpdmF0aW9uLFxuICAgIC4uLmNvbmZpZyxcbiAgfTtcbn1cblxuZW51bSBSb3V0ZXJUcmlnZ2VyIHtcbiAgTk9ORSA9IDEsXG4gIFJPVVRFUiA9IDIsXG4gIFNUT1JFID0gMyxcbn1cblxuLyoqXG4gKiBDb25uZWN0cyBSb3V0ZXJNb2R1bGUgd2l0aCBTdG9yZU1vZHVsZS5cbiAqXG4gKiBEdXJpbmcgdGhlIG5hdmlnYXRpb24sIGJlZm9yZSBhbnkgZ3VhcmRzIG9yIHJlc29sdmVycyBydW4sIHRoZSByb3V0ZXIgd2lsbCBkaXNwYXRjaFxuICogYSBST1VURVJfTkFWSUdBVElPTiBhY3Rpb24sIHdoaWNoIGhhcyB0aGUgZm9sbG93aW5nIHNpZ25hdHVyZTpcbiAqXG4gKiBgYGBcbiAqIGV4cG9ydCB0eXBlIFJvdXRlck5hdmlnYXRpb25QYXlsb2FkID0ge1xuICogICByb3V0ZXJTdGF0ZTogU2VyaWFsaXplZFJvdXRlclN0YXRlU25hcHNob3QsXG4gKiAgIGV2ZW50OiBSb3V0ZXNSZWNvZ25pemVkXG4gKiB9XG4gKiBgYGBcbiAqXG4gKiBFaXRoZXIgYSByZWR1Y2VyIG9yIGFuIGVmZmVjdCBjYW4gYmUgaW52b2tlZCBpbiByZXNwb25zZSB0byB0aGlzIGFjdGlvbi5cbiAqIElmIHRoZSBpbnZva2VkIHJlZHVjZXIgdGhyb3dzLCB0aGUgbmF2aWdhdGlvbiB3aWxsIGJlIGNhbmNlbGVkLlxuICpcbiAqIElmIG5hdmlnYXRpb24gZ2V0cyBjYW5jZWxlZCBiZWNhdXNlIG9mIGEgZ3VhcmQsIGEgUk9VVEVSX0NBTkNFTCBhY3Rpb24gd2lsbCBiZVxuICogZGlzcGF0Y2hlZC4gSWYgbmF2aWdhdGlvbiByZXN1bHRzIGluIGFuIGVycm9yLCBhIFJPVVRFUl9FUlJPUiBhY3Rpb24gd2lsbCBiZSBkaXNwYXRjaGVkLlxuICpcbiAqIEJvdGggUk9VVEVSX0NBTkNFTCBhbmQgUk9VVEVSX0VSUk9SIGNvbnRhaW4gdGhlIHN0b3JlIHN0YXRlIGJlZm9yZSB0aGUgbmF2aWdhdGlvblxuICogd2hpY2ggY2FuIGJlIHVzZWQgdG8gcmVzdG9yZSB0aGUgY29uc2lzdGVuY3kgb2YgdGhlIHN0b3JlLlxuICpcbiAqIFVzYWdlOlxuICpcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIEBOZ01vZHVsZSh7XG4gKiAgIGRlY2xhcmF0aW9uczogW0FwcENtcCwgU2ltcGxlQ21wXSxcbiAqICAgaW1wb3J0czogW1xuICogICAgIEJyb3dzZXJNb2R1bGUsXG4gKiAgICAgU3RvcmVNb2R1bGUuZm9yUm9vdChtYXBPZlJlZHVjZXJzKSxcbiAqICAgICBSb3V0ZXJNb2R1bGUuZm9yUm9vdChbXG4gKiAgICAgICB7IHBhdGg6ICcnLCBjb21wb25lbnQ6IFNpbXBsZUNtcCB9LFxuICogICAgICAgeyBwYXRoOiAnbmV4dCcsIGNvbXBvbmVudDogU2ltcGxlQ21wIH1cbiAqICAgICBdKSxcbiAqICAgICBTdG9yZVJvdXRlckNvbm5lY3RpbmdNb2R1bGVcbiAqICAgXSxcbiAqICAgYm9vdHN0cmFwOiBbQXBwQ21wXVxuICogfSlcbiAqIGV4cG9ydCBjbGFzcyBBcHBNb2R1bGUge1xuICogfVxuICogYGBgXG4gKi9cbkBOZ01vZHVsZSh7XG4gIHByb3ZpZGVyczogW1xuICAgIHtcbiAgICAgIHByb3ZpZGU6IF9ST1VURVJfQ09ORklHLFxuICAgICAgdXNlVmFsdWU6IHt9LFxuICAgIH0sXG4gICAge1xuICAgICAgcHJvdmlkZTogUk9VVEVSX0NPTkZJRyxcbiAgICAgIHVzZUZhY3Rvcnk6IF9jcmVhdGVSb3V0ZXJDb25maWcsXG4gICAgICBkZXBzOiBbX1JPVVRFUl9DT05GSUddLFxuICAgIH0sXG4gICAge1xuICAgICAgcHJvdmlkZTogUm91dGVyU3RhdGVTZXJpYWxpemVyLFxuICAgICAgdXNlQ2xhc3M6IERlZmF1bHRSb3V0ZXJTdGF0ZVNlcmlhbGl6ZXIsXG4gICAgfSxcbiAgXSxcbn0pXG5leHBvcnQgY2xhc3MgU3RvcmVSb3V0ZXJDb25uZWN0aW5nTW9kdWxlIHtcbiAgc3RhdGljIGZvclJvb3QoY29uZmlnOiBTdG9yZVJvdXRlckNvbmZpZyA9IHt9KTogTW9kdWxlV2l0aFByb3ZpZGVycyB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5nTW9kdWxlOiBTdG9yZVJvdXRlckNvbm5lY3RpbmdNb2R1bGUsXG4gICAgICBwcm92aWRlcnM6IFtcbiAgICAgICAgeyBwcm92aWRlOiBfUk9VVEVSX0NPTkZJRywgdXNlVmFsdWU6IGNvbmZpZyB9LFxuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogUm91dGVyU3RhdGVTZXJpYWxpemVyLFxuICAgICAgICAgIHVzZUNsYXNzOiBjb25maWcuc2VyaWFsaXplclxuICAgICAgICAgICAgPyBjb25maWcuc2VyaWFsaXplclxuICAgICAgICAgICAgOiBEZWZhdWx0Um91dGVyU3RhdGVTZXJpYWxpemVyLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSByb3V0ZXJTdGF0ZTogU2VyaWFsaXplZFJvdXRlclN0YXRlU25hcHNob3QgfCBudWxsO1xuICBwcml2YXRlIHN0b3JlU3RhdGU6IGFueTtcbiAgcHJpdmF0ZSB0cmlnZ2VyID0gUm91dGVyVHJpZ2dlci5OT05FO1xuXG4gIHByaXZhdGUgc3RhdGVLZXk6IFN0YXRlS2V5T3JTZWxlY3RvcjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHN0b3JlOiBTdG9yZTxhbnk+LFxuICAgIHByaXZhdGUgcm91dGVyOiBSb3V0ZXIsXG4gICAgcHJpdmF0ZSBzZXJpYWxpemVyOiBSb3V0ZXJTdGF0ZVNlcmlhbGl6ZXI8U2VyaWFsaXplZFJvdXRlclN0YXRlU25hcHNob3Q+LFxuICAgIHByaXZhdGUgZXJyb3JIYW5kbGVyOiBFcnJvckhhbmRsZXIsXG4gICAgQEluamVjdChST1VURVJfQ09ORklHKSBwcml2YXRlIGNvbmZpZzogU3RvcmVSb3V0ZXJDb25maWdcbiAgKSB7XG4gICAgdGhpcy5zdGF0ZUtleSA9IHRoaXMuY29uZmlnLnN0YXRlS2V5IGFzIFN0YXRlS2V5T3JTZWxlY3RvcjtcblxuICAgIHRoaXMuc2V0VXBTdG9yZVN0YXRlTGlzdGVuZXIoKTtcbiAgICB0aGlzLnNldFVwUm91dGVyRXZlbnRzTGlzdGVuZXIoKTtcbiAgfVxuXG4gIHByaXZhdGUgc2V0VXBTdG9yZVN0YXRlTGlzdGVuZXIoKTogdm9pZCB7XG4gICAgdGhpcy5zdG9yZVxuICAgICAgLnBpcGUoXG4gICAgICAgIHNlbGVjdCh0aGlzLnN0YXRlS2V5KSxcbiAgICAgICAgd2l0aExhdGVzdEZyb20odGhpcy5zdG9yZSlcbiAgICAgIClcbiAgICAgIC5zdWJzY3JpYmUoKFtyb3V0ZXJTdG9yZVN0YXRlLCBzdG9yZVN0YXRlXSkgPT4ge1xuICAgICAgICB0aGlzLm5hdmlnYXRlSWZOZWVkZWQocm91dGVyU3RvcmVTdGF0ZSwgc3RvcmVTdGF0ZSk7XG4gICAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgbmF2aWdhdGVJZk5lZWRlZChcbiAgICByb3V0ZXJTdG9yZVN0YXRlOiBSb3V0ZXJSZWR1Y2VyU3RhdGUsXG4gICAgc3RvcmVTdGF0ZTogYW55XG4gICk6IHZvaWQge1xuICAgIGlmICghcm91dGVyU3RvcmVTdGF0ZSB8fCAhcm91dGVyU3RvcmVTdGF0ZS5zdGF0ZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodGhpcy50cmlnZ2VyID09PSBSb3V0ZXJUcmlnZ2VyLlJPVVRFUikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHVybCA9IHJvdXRlclN0b3JlU3RhdGUuc3RhdGUudXJsO1xuICAgIGlmICh0aGlzLnJvdXRlci51cmwgIT09IHVybCkge1xuICAgICAgdGhpcy5zdG9yZVN0YXRlID0gc3RvcmVTdGF0ZTtcbiAgICAgIHRoaXMudHJpZ2dlciA9IFJvdXRlclRyaWdnZXIuU1RPUkU7XG4gICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZUJ5VXJsKHVybCkuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICB0aGlzLmVycm9ySGFuZGxlci5oYW5kbGVFcnJvcihlcnJvcik7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHNldFVwUm91dGVyRXZlbnRzTGlzdGVuZXIoKTogdm9pZCB7XG4gICAgY29uc3QgZGlzcGF0Y2hOYXZMYXRlID1cbiAgICAgIHRoaXMuY29uZmlnLm5hdmlnYXRpb25BY3Rpb25UaW1pbmcgPT09XG4gICAgICBOYXZpZ2F0aW9uQWN0aW9uVGltaW5nLlBvc3RBY3RpdmF0aW9uO1xuICAgIGxldCByb3V0ZXNSZWNvZ25pemVkOiBSb3V0ZXNSZWNvZ25pemVkO1xuXG4gICAgdGhpcy5yb3V0ZXIuZXZlbnRzXG4gICAgICAucGlwZSh3aXRoTGF0ZXN0RnJvbSh0aGlzLnN0b3JlKSlcbiAgICAgIC5zdWJzY3JpYmUoKFtldmVudCwgc3RvcmVTdGF0ZV0pID0+IHtcbiAgICAgICAgaWYgKGV2ZW50IGluc3RhbmNlb2YgTmF2aWdhdGlvblN0YXJ0KSB7XG4gICAgICAgICAgdGhpcy5yb3V0ZXJTdGF0ZSA9IHRoaXMuc2VyaWFsaXplci5zZXJpYWxpemUoXG4gICAgICAgICAgICB0aGlzLnJvdXRlci5yb3V0ZXJTdGF0ZS5zbmFwc2hvdFxuICAgICAgICAgICk7XG4gICAgICAgICAgaWYgKHRoaXMudHJpZ2dlciAhPT0gUm91dGVyVHJpZ2dlci5TVE9SRSkge1xuICAgICAgICAgICAgdGhpcy5zdG9yZVN0YXRlID0gc3RvcmVTdGF0ZTtcbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hSb3V0ZXJSZXF1ZXN0KGV2ZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnQgaW5zdGFuY2VvZiBSb3V0ZXNSZWNvZ25pemVkKSB7XG4gICAgICAgICAgcm91dGVzUmVjb2duaXplZCA9IGV2ZW50O1xuXG4gICAgICAgICAgaWYgKCFkaXNwYXRjaE5hdkxhdGUgJiYgdGhpcy50cmlnZ2VyICE9PSBSb3V0ZXJUcmlnZ2VyLlNUT1JFKSB7XG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoUm91dGVyTmF2aWdhdGlvbihldmVudCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50IGluc3RhbmNlb2YgTmF2aWdhdGlvbkNhbmNlbCkge1xuICAgICAgICAgIHRoaXMuZGlzcGF0Y2hSb3V0ZXJDYW5jZWwoZXZlbnQpO1xuICAgICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICAgICAgfSBlbHNlIGlmIChldmVudCBpbnN0YW5jZW9mIE5hdmlnYXRpb25FcnJvcikge1xuICAgICAgICAgIHRoaXMuZGlzcGF0Y2hSb3V0ZXJFcnJvcihldmVudCk7XG4gICAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50IGluc3RhbmNlb2YgTmF2aWdhdGlvbkVuZCkge1xuICAgICAgICAgIGlmICh0aGlzLnRyaWdnZXIgIT09IFJvdXRlclRyaWdnZXIuU1RPUkUpIHtcbiAgICAgICAgICAgIGlmIChkaXNwYXRjaE5hdkxhdGUpIHtcbiAgICAgICAgICAgICAgdGhpcy5kaXNwYXRjaFJvdXRlck5hdmlnYXRpb24ocm91dGVzUmVjb2duaXplZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoUm91dGVyTmF2aWdhdGVkKGV2ZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgZGlzcGF0Y2hSb3V0ZXJSZXF1ZXN0KGV2ZW50OiBOYXZpZ2F0aW9uU3RhcnQpOiB2b2lkIHtcbiAgICB0aGlzLmRpc3BhdGNoUm91dGVyQWN0aW9uKFJPVVRFUl9SRVFVRVNULCB7IGV2ZW50IH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBkaXNwYXRjaFJvdXRlck5hdmlnYXRpb24oXG4gICAgbGFzdFJvdXRlc1JlY29nbml6ZWQ6IFJvdXRlc1JlY29nbml6ZWRcbiAgKTogdm9pZCB7XG4gICAgY29uc3QgbmV4dFJvdXRlclN0YXRlID0gdGhpcy5zZXJpYWxpemVyLnNlcmlhbGl6ZShcbiAgICAgIGxhc3RSb3V0ZXNSZWNvZ25pemVkLnN0YXRlXG4gICAgKTtcbiAgICB0aGlzLmRpc3BhdGNoUm91dGVyQWN0aW9uKFJPVVRFUl9OQVZJR0FUSU9OLCB7XG4gICAgICByb3V0ZXJTdGF0ZTogbmV4dFJvdXRlclN0YXRlLFxuICAgICAgZXZlbnQ6IG5ldyBSb3V0ZXNSZWNvZ25pemVkKFxuICAgICAgICBsYXN0Um91dGVzUmVjb2duaXplZC5pZCxcbiAgICAgICAgbGFzdFJvdXRlc1JlY29nbml6ZWQudXJsLFxuICAgICAgICBsYXN0Um91dGVzUmVjb2duaXplZC51cmxBZnRlclJlZGlyZWN0cyxcbiAgICAgICAgbmV4dFJvdXRlclN0YXRlXG4gICAgICApLFxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBkaXNwYXRjaFJvdXRlckNhbmNlbChldmVudDogTmF2aWdhdGlvbkNhbmNlbCk6IHZvaWQge1xuICAgIHRoaXMuZGlzcGF0Y2hSb3V0ZXJBY3Rpb24oUk9VVEVSX0NBTkNFTCwge1xuICAgICAgcm91dGVyU3RhdGU6IHRoaXMucm91dGVyU3RhdGUhLFxuICAgICAgc3RvcmVTdGF0ZTogdGhpcy5zdG9yZVN0YXRlLFxuICAgICAgZXZlbnQsXG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGRpc3BhdGNoUm91dGVyRXJyb3IoZXZlbnQ6IE5hdmlnYXRpb25FcnJvcik6IHZvaWQge1xuICAgIHRoaXMuZGlzcGF0Y2hSb3V0ZXJBY3Rpb24oUk9VVEVSX0VSUk9SLCB7XG4gICAgICByb3V0ZXJTdGF0ZTogdGhpcy5yb3V0ZXJTdGF0ZSEsXG4gICAgICBzdG9yZVN0YXRlOiB0aGlzLnN0b3JlU3RhdGUsXG4gICAgICBldmVudDogbmV3IE5hdmlnYXRpb25FcnJvcihldmVudC5pZCwgZXZlbnQudXJsLCBgJHtldmVudH1gKSxcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgZGlzcGF0Y2hSb3V0ZXJOYXZpZ2F0ZWQoZXZlbnQ6IE5hdmlnYXRpb25FbmQpOiB2b2lkIHtcbiAgICB0aGlzLmRpc3BhdGNoUm91dGVyQWN0aW9uKFJPVVRFUl9OQVZJR0FURUQsIHsgZXZlbnQgfSk7XG4gIH1cblxuICBwcml2YXRlIGRpc3BhdGNoUm91dGVyQWN0aW9uKHR5cGU6IHN0cmluZywgcGF5bG9hZDogYW55KTogdm9pZCB7XG4gICAgdGhpcy50cmlnZ2VyID0gUm91dGVyVHJpZ2dlci5ST1VURVI7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuc3RvcmUuZGlzcGF0Y2goeyB0eXBlLCBwYXlsb2FkIH0pO1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0aGlzLnRyaWdnZXIgPSBSb3V0ZXJUcmlnZ2VyLk5PTkU7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSByZXNldCgpIHtcbiAgICB0aGlzLnRyaWdnZXIgPSBSb3V0ZXJUcmlnZ2VyLk5PTkU7XG4gICAgdGhpcy5zdG9yZVN0YXRlID0gbnVsbDtcbiAgICB0aGlzLnJvdXRlclN0YXRlID0gbnVsbDtcbiAgfVxufVxuIl19