import { Inject, InjectionToken, NgModule, isDevMode, } from '@angular/core';
import { NavigationCancel, NavigationError, NavigationEnd, RoutesRecognized, NavigationStart, } from '@angular/router';
import { isNgrxMockEnvironment, select, ACTIVE_RUNTIME_CHECKS, } from '@ngrx/store';
import { withLatestFrom } from 'rxjs/operators';
import { ROUTER_CANCEL, ROUTER_ERROR, ROUTER_NAVIGATED, ROUTER_NAVIGATION, ROUTER_REQUEST, } from './actions';
import { RouterStateSerializer, } from './serializers/base';
import { DefaultRouterStateSerializer, } from './serializers/default_serializer';
import { MinimalRouterStateSerializer } from './serializers/minimal_serializer';
import * as i0 from "@angular/core";
import * as i1 from "@ngrx/store";
import * as i2 from "@angular/router";
import * as i3 from "./serializers/base";
export var NavigationActionTiming;
(function (NavigationActionTiming) {
    NavigationActionTiming[NavigationActionTiming["PreActivation"] = 1] = "PreActivation";
    NavigationActionTiming[NavigationActionTiming["PostActivation"] = 2] = "PostActivation";
})(NavigationActionTiming || (NavigationActionTiming = {}));
export const _ROUTER_CONFIG = new InjectionToken('@ngrx/router-store Internal Configuration');
export const ROUTER_CONFIG = new InjectionToken('@ngrx/router-store Configuration');
export const DEFAULT_ROUTER_FEATURENAME = 'router';
export function _createRouterConfig(config) {
    return Object.assign({ stateKey: DEFAULT_ROUTER_FEATURENAME, serializer: MinimalRouterStateSerializer, navigationActionTiming: NavigationActionTiming.PreActivation }, config);
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
export class StoreRouterConnectingModule {
    constructor(store, router, serializer, errorHandler, config, activeRuntimeChecks) {
        this.store = store;
        this.router = router;
        this.serializer = serializer;
        this.errorHandler = errorHandler;
        this.config = config;
        this.activeRuntimeChecks = activeRuntimeChecks;
        this.lastEvent = null;
        this.routerState = null;
        this.trigger = RouterTrigger.NONE;
        this.stateKey = this.config.stateKey;
        if (!isNgrxMockEnvironment() &&
            isDevMode() &&
            ((activeRuntimeChecks === null || activeRuntimeChecks === void 0 ? void 0 : activeRuntimeChecks.strictActionSerializability) ||
                (activeRuntimeChecks === null || activeRuntimeChecks === void 0 ? void 0 : activeRuntimeChecks.strictStateSerializability)) &&
            this.serializer instanceof DefaultRouterStateSerializer) {
            console.warn('@ngrx/router-store: The serializability runtime checks cannot be enabled ' +
                'with the DefaultRouterStateSerializer. The default serializer ' +
                'has an unserializable router state and actions that are not serializable. ' +
                'To use the serializability runtime checks either use ' +
                'the MinimalRouterStateSerializer or implement a custom router state serializer. ' +
                'This also applies to Ivy with immutability runtime checks.');
        }
        this.setUpStoreStateListener();
        this.setUpRouterEventsListener();
    }
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
                        : config.routerState === 0 /* Full */
                            ? DefaultRouterStateSerializer
                            : MinimalRouterStateSerializer,
                },
            ],
        };
    }
    setUpStoreStateListener() {
        this.store
            .pipe(select(this.stateKey), withLatestFrom(this.store))
            .subscribe(([routerStoreState, storeState]) => {
            this.navigateIfNeeded(routerStoreState, storeState);
        });
    }
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
        const url = routerStoreState.state.url;
        if (!isSameUrl(this.router.url, url)) {
            this.storeState = storeState;
            this.trigger = RouterTrigger.STORE;
            this.router.navigateByUrl(url).catch((error) => {
                this.errorHandler.handleError(error);
            });
        }
    }
    setUpRouterEventsListener() {
        const dispatchNavLate = this.config.navigationActionTiming ===
            NavigationActionTiming.PostActivation;
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
    dispatchRouterRequest(event) {
        this.dispatchRouterAction(ROUTER_REQUEST, { event });
    }
    dispatchRouterNavigation(lastRoutesRecognized) {
        const nextRouterState = this.serializer.serialize(lastRoutesRecognized.state);
        this.dispatchRouterAction(ROUTER_NAVIGATION, {
            routerState: nextRouterState,
            event: new RoutesRecognized(lastRoutesRecognized.id, lastRoutesRecognized.url, lastRoutesRecognized.urlAfterRedirects, nextRouterState),
        });
    }
    dispatchRouterCancel(event) {
        this.dispatchRouterAction(ROUTER_CANCEL, {
            storeState: this.storeState,
            event,
        });
    }
    dispatchRouterError(event) {
        this.dispatchRouterAction(ROUTER_ERROR, {
            storeState: this.storeState,
            event: new NavigationError(event.id, event.url, `${event}`),
        });
    }
    dispatchRouterNavigated(event) {
        const routerState = this.serializer.serialize(this.router.routerState.snapshot);
        this.dispatchRouterAction(ROUTER_NAVIGATED, { event, routerState });
    }
    dispatchRouterAction(type, payload) {
        this.trigger = RouterTrigger.ROUTER;
        try {
            this.store.dispatch({
                type,
                payload: Object.assign(Object.assign({ routerState: this.routerState }, payload), { event: this.config.routerState === 0 /* Full */
                        ? payload.event
                        : {
                            id: payload.event.id,
                            url: payload.event.url,
                            // safe, as it will just be `undefined` for non-NavigationEnd router events
                            urlAfterRedirects: payload.event
                                .urlAfterRedirects,
                        } }),
            });
        }
        finally {
            this.trigger = RouterTrigger.NONE;
        }
    }
    reset() {
        this.trigger = RouterTrigger.NONE;
        this.storeState = null;
        this.routerState = null;
    }
}
/** @nocollapse */ StoreRouterConnectingModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.6", ngImport: i0, type: StoreRouterConnectingModule, deps: [{ token: i1.Store }, { token: i2.Router }, { token: i3.RouterStateSerializer }, { token: i0.ErrorHandler }, { token: ROUTER_CONFIG }, { token: ACTIVE_RUNTIME_CHECKS }], target: i0.ɵɵFactoryTarget.NgModule });
/** @nocollapse */ StoreRouterConnectingModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "12.2.6", ngImport: i0, type: StoreRouterConnectingModule });
/** @nocollapse */ StoreRouterConnectingModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "12.2.6", ngImport: i0, type: StoreRouterConnectingModule });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.6", ngImport: i0, type: StoreRouterConnectingModule, decorators: [{
            type: NgModule,
            args: [{}]
        }], ctorParameters: function () { return [{ type: i1.Store }, { type: i2.Router }, { type: i3.RouterStateSerializer }, { type: i0.ErrorHandler }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [ROUTER_CONFIG]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [ACTIVE_RUNTIME_CHECKS]
                }] }]; } });
/**
 * Check if the URLs are matching. Accounts for the possibility of trailing "/" in url.
 */
function isSameUrl(first, second) {
    return stripTrailingSlash(first) === stripTrailingSlash(second);
}
function stripTrailingSlash(text) {
    if ((text === null || text === void 0 ? void 0 : text.length) > 0 && text[text.length - 1] === '/') {
        return text.substring(0, text.length - 1);
    }
    return text;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyX3N0b3JlX21vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL21vZHVsZXMvcm91dGVyLXN0b3JlL3NyYy9yb3V0ZXJfc3RvcmVfbW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCxNQUFNLEVBQ04sY0FBYyxFQUVkLFFBQVEsRUFFUixTQUFTLEdBQ1YsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUNMLGdCQUFnQixFQUNoQixlQUFlLEVBQ2YsYUFBYSxFQUViLGdCQUFnQixFQUNoQixlQUFlLEdBR2hCLE1BQU0saUJBQWlCLENBQUM7QUFDekIsT0FBTyxFQUNMLHFCQUFxQixFQUVyQixNQUFNLEVBR04scUJBQXFCLEdBQ3RCLE1BQU0sYUFBYSxDQUFDO0FBQ3JCLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUVoRCxPQUFPLEVBQ0wsYUFBYSxFQUNiLFlBQVksRUFDWixnQkFBZ0IsRUFDaEIsaUJBQWlCLEVBQ2pCLGNBQWMsR0FDZixNQUFNLFdBQVcsQ0FBQztBQUVuQixPQUFPLEVBQ0wscUJBQXFCLEdBRXRCLE1BQU0sb0JBQW9CLENBQUM7QUFDNUIsT0FBTyxFQUNMLDRCQUE0QixHQUU3QixNQUFNLGtDQUFrQyxDQUFDO0FBQzFDLE9BQU8sRUFBRSw0QkFBNEIsRUFBRSxNQUFNLGtDQUFrQyxDQUFDOzs7OztBQTBDaEYsTUFBTSxDQUFOLElBQVksc0JBR1g7QUFIRCxXQUFZLHNCQUFzQjtJQUNoQyxxRkFBaUIsQ0FBQTtJQUNqQix1RkFBa0IsQ0FBQTtBQUNwQixDQUFDLEVBSFcsc0JBQXNCLEtBQXRCLHNCQUFzQixRQUdqQztBQUVELE1BQU0sQ0FBQyxNQUFNLGNBQWMsR0FBRyxJQUFJLGNBQWMsQ0FDOUMsMkNBQTJDLENBQzVDLENBQUM7QUFDRixNQUFNLENBQUMsTUFBTSxhQUFhLEdBQUcsSUFBSSxjQUFjLENBQzdDLGtDQUFrQyxD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OzRJQUEzQiwyQkFBMkI7MkZBQTNCLDJCQUEyQjtrQkFEdkMsUUFBUTttQkFBQyxFQUFFOzswQkF1Q1AsTUFBTTsyQkFBQyxhQUFhOzswQkFDcEIsTUFBTTsyQkFBQyxxQkFBcUI7O0FBa0xqQzs7R0FFRztBQUNILFNBQVMsU0FBUyxDQUFDLEtBQWEsRUFBRSxNQUFjO0lBQzlDLE9BQU8sa0JBQWtCLENBQUMsS0FBSyxDQUFDLEtBQUssa0JBQWtCLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDbEUsQ0FBQztBQUVELFNBQVMsa0JBQWtCLENBQUMsSUFBWTtJQUN0QyxJQUFJLENBQUEsSUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLE1BQU0sSUFBRyxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxFQUFFO1FBQ3JELE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztLQUMzQztJQUNELE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIEluamVjdCxcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIE1vZHVsZVdpdGhQcm92aWRlcnMsXG4gIE5nTW9kdWxlLFxuICBFcnJvckhhbmRsZXIsXG4gIGlzRGV2TW9kZSxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBOYXZpZ2F0aW9uQ2FuY2VsLFxuICBOYXZpZ2F0aW9uRXJyb3IsXG4gIE5hdmlnYXRpb25FbmQsXG4gIFJvdXRlcixcbiAgUm91dGVzUmVjb2duaXplZCxcbiAgTmF2aWdhdGlvblN0YXJ0LFxuICBFdmVudCxcbiAgUm91dGVyRXZlbnQsXG59IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQge1xuICBpc05ncnhNb2NrRW52aXJvbm1lbnQsXG4gIFJ1bnRpbWVDaGVja3MsXG4gIHNlbGVjdCxcbiAgU2VsZWN0b3IsXG4gIFN0b3JlLFxuICBBQ1RJVkVfUlVOVElNRV9DSEVDS1MsXG59IGZyb20gJ0BuZ3J4L3N0b3JlJztcbmltcG9ydCB7IHdpdGhMYXRlc3RGcm9tIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQge1xuICBST1VURVJfQ0FOQ0VMLFxuICBST1VURVJfRVJST1IsXG4gIFJPVVRFUl9OQVZJR0FURUQsXG4gIFJPVVRFUl9OQVZJR0FUSU9OLFxuICBST1VURVJfUkVRVUVTVCxcbn0gZnJvbSAnLi9hY3Rpb25zJztcbmltcG9ydCB7IFJvdXRlclJlZHVjZXJTdGF0ZSB9IGZyb20gJy4vcmVkdWNlcic7XG5pbXBvcnQge1xuICBSb3V0ZXJTdGF0ZVNlcmlhbGl6ZXIsXG4gIEJhc2VSb3V0ZXJTdG9yZVN0YXRlLFxufSBmcm9tICcuL3NlcmlhbGl6ZXJzL2Jhc2UnO1xuaW1wb3J0IHtcbiAgRGVmYXVsdFJvdXRlclN0YXRlU2VyaWFsaXplcixcbiAgU2VyaWFsaXplZFJvdXRlclN0YXRlU25hcHNob3QsXG59IGZyb20gJy4vc2VyaWFsaXplcnMvZGVmYXVsdF9zZXJpYWxpemVyJztcbmltcG9ydCB7IE1pbmltYWxSb3V0ZXJTdGF0ZVNlcmlhbGl6ZXIgfSBmcm9tICcuL3NlcmlhbGl6ZXJzL21pbmltYWxfc2VyaWFsaXplcic7XG5cbmV4cG9ydCB0eXBlIFN0YXRlS2V5T3JTZWxlY3RvcjxcbiAgVCBleHRlbmRzIEJhc2VSb3V0ZXJTdG9yZVN0YXRlID0gU2VyaWFsaXplZFJvdXRlclN0YXRlU25hcHNob3Rcbj4gPSBzdHJpbmcgfCBTZWxlY3RvcjxhbnksIFJvdXRlclJlZHVjZXJTdGF0ZTxUPj47XG5cbi8qKlxuICogRnVsbCA9IFNlcmlhbGl6ZXMgdGhlIHJvdXRlciBldmVudCB3aXRoIERlZmF1bHRSb3V0ZXJTdGF0ZVNlcmlhbGl6ZXJcbiAqIE1pbmltYWwgPSBTZXJpYWxpemVzIHRoZSByb3V0ZXIgZXZlbnQgd2l0aCBNaW5pbWFsUm91dGVyU3RhdGVTZXJpYWxpemVyXG4gKi9cbmV4cG9ydCBjb25zdCBlbnVtIFJvdXRlclN0YXRlIHtcbiAgRnVsbCxcbiAgTWluaW1hbCxcbn1cblxuZXhwb3J0IGludGVyZmFjZSBTdG9yZVJvdXRlckNvbmZpZzxcbiAgVCBleHRlbmRzIEJhc2VSb3V0ZXJTdG9yZVN0YXRlID0gU2VyaWFsaXplZFJvdXRlclN0YXRlU25hcHNob3Rcbj4ge1xuICBzdGF0ZUtleT86IFN0YXRlS2V5T3JTZWxlY3RvcjxUPjtcbiAgc2VyaWFsaXplcj86IG5ldyAoLi4uYXJnczogYW55W10pID0+IFJvdXRlclN0YXRlU2VyaWFsaXplcjtcbiAgLyoqXG4gICAqIEJ5IGRlZmF1bHQsIFJPVVRFUl9OQVZJR0FUSU9OIGlzIGRpc3BhdGNoZWQgYmVmb3JlIGd1YXJkcyBhbmQgcmVzb2x2ZXJzIHJ1bi5cbiAgICogVGhlcmVmb3JlLCB0aGUgYWN0aW9uIGNvdWxkIHJ1biB0b28gc29vbiwgZm9yIGV4YW1wbGVcbiAgICogdGhlcmUgbWF5IGJlIGEgbmF2aWdhdGlvbiBjYW5jZWwgZHVlIHRvIGEgZ3VhcmQgc2F5aW5nIHRoZSBuYXZpZ2F0aW9uIGlzIG5vdCBhbGxvd2VkLlxuICAgKiBUbyBydW4gUk9VVEVSX05BVklHQVRJT04gYWZ0ZXIgZ3VhcmRzIGFuZCByZXNvbHZlcnMsXG4gICAqIHNldCB0aGlzIHByb3BlcnR5IHRvIE5hdmlnYXRpb25BY3Rpb25UaW1pbmcuUG9zdEFjdGl2YXRpb24uXG4gICAqL1xuICBuYXZpZ2F0aW9uQWN0aW9uVGltaW5nPzogTmF2aWdhdGlvbkFjdGlvblRpbWluZztcbiAgLyoqXG4gICAqIERlY2lkZXMgd2hpY2ggcm91dGVyIHNlcmlhbGl6ZXIgc2hvdWxkIGJlIHVzZWQsIGlmIHRoZXJlIGlzIG5vbmUgcHJvdmlkZWQsIGFuZCB0aGUgbWV0YWRhdGEgb24gdGhlIGRpc3BhdGNoZWQgQG5ncngvcm91dGVyLXN0b3JlIGFjdGlvbiBwYXlsb2FkLlxuICAgKiBTZXQgdG8gYEZ1bGxgIHRvIHVzZSB0aGUgYERlZmF1bHRSb3V0ZXJTdGF0ZVNlcmlhbGl6ZXJgIGFuZCB0byBzZXQgdGhlIGFuZ3VsYXIgcm91dGVyIGV2ZW50cyBhcyBwYXlsb2FkLlxuICAgKiBTZXQgdG8gYE1pbmltYWxgIHRvIHVzZSB0aGUgYE1pbmltYWxSb3V0ZXJTdGF0ZVNlcmlhbGl6ZXJgIGFuZCB0byBzZXQgYSBtaW5pbWFsIHJvdXRlciBldmVudCB3aXRoIHRoZSBuYXZpZ2F0aW9uIGlkIGFuZCB1cmwgYXMgcGF5bG9hZC5cbiAgICovXG4gIHJvdXRlclN0YXRlPzogUm91dGVyU3RhdGU7XG59XG5cbmludGVyZmFjZSBTdG9yZVJvdXRlckFjdGlvblBheWxvYWQge1xuICBldmVudDogUm91dGVyRXZlbnQ7XG4gIHJvdXRlclN0YXRlPzogU2VyaWFsaXplZFJvdXRlclN0YXRlU25hcHNob3Q7XG4gIHN0b3JlU3RhdGU/OiBhbnk7XG59XG5cbmV4cG9ydCBlbnVtIE5hdmlnYXRpb25BY3Rpb25UaW1pbmcge1xuICBQcmVBY3RpdmF0aW9uID0gMSxcbiAgUG9zdEFjdGl2YXRpb24gPSAyLFxufVxuXG5leHBvcnQgY29uc3QgX1JPVVRFUl9DT05GSUcgPSBuZXcgSW5qZWN0aW9uVG9rZW4oXG4gICdAbmdyeC9yb3V0ZXItc3RvcmUgSW50ZXJuYWwgQ29uZmlndXJhdGlvbidcbik7XG5leHBvcnQgY29uc3QgUk9VVEVSX0NPTkZJRyA9IG5ldyBJbmplY3Rpb25Ub2tlbihcbiAgJ0BuZ3J4L3JvdXRlci1zdG9yZSBDb25maWd1cmF0aW9uJ1xuKTtcbmV4cG9ydCBjb25zdCBERUZBVUxUX1JPVVRFUl9GRUFUVVJFTkFNRSA9ICdyb3V0ZXInO1xuXG5leHBvcnQgZnVuY3Rpb24gX2NyZWF0ZVJvdXRlckNvbmZpZyhcbiAgY29uZmlnOiBTdG9yZVJvdXRlckNvbmZpZ1xuKTogU3RvcmVSb3V0ZXJDb25maWcge1xuICByZXR1cm4ge1xuICAgIHN0YXRlS2V5OiBERUZBVUxUX1JPVVRFUl9GRUFUVVJFTkFNRSxcbiAgICBzZXJpYWxpemVyOiBNaW5pbWFsUm91dGVyU3RhdGVTZXJpYWxpemVyLFxuICAgIG5hdmlnYXRpb25BY3Rpb25UaW1pbmc6IE5hdmlnYXRpb25BY3Rpb25UaW1pbmcuUHJlQWN0aXZhdGlvbixcbiAgICAuLi5jb25maWcsXG4gIH07XG59XG5cbmVudW0gUm91dGVyVHJpZ2dlciB7XG4gIE5PTkUgPSAxLFxuICBST1VURVIgPSAyLFxuICBTVE9SRSA9IDMsXG59XG5cbi8qKlxuICogQ29ubmVjdHMgUm91dGVyTW9kdWxlIHdpdGggU3RvcmVNb2R1bGUuXG4gKlxuICogRHVyaW5nIHRoZSBuYXZpZ2F0aW9uLCBiZWZvcmUgYW55IGd1YXJkcyBvciByZXNvbHZlcnMgcnVuLCB0aGUgcm91dGVyIHdpbGwgZGlzcGF0Y2hcbiAqIGEgUk9VVEVSX05BVklHQVRJT04gYWN0aW9uLCB3aGljaCBoYXMgdGhlIGZvbGxvd2luZyBzaWduYXR1cmU6XG4gKlxuICogYGBgXG4gKiBleHBvcnQgdHlwZSBSb3V0ZXJOYXZpZ2F0aW9uUGF5bG9hZCA9IHtcbiAqICAgcm91dGVyU3RhdGU6IFNlcmlhbGl6ZWRSb3V0ZXJTdGF0ZVNuYXBzaG90LFxuICogICBldmVudDogUm91dGVzUmVjb2duaXplZFxuICogfVxuICogYGBgXG4gKlxuICogRWl0aGVyIGEgcmVkdWNlciBvciBhbiBlZmZlY3QgY2FuIGJlIGludm9rZWQgaW4gcmVzcG9uc2UgdG8gdGhpcyBhY3Rpb24uXG4gKiBJZiB0aGUgaW52b2tlZCByZWR1Y2VyIHRocm93cywgdGhlIG5hdmlnYXRpb24gd2lsbCBiZSBjYW5jZWxlZC5cbiAqXG4gKiBJZiBuYXZpZ2F0aW9uIGdldHMgY2FuY2VsZWQgYmVjYXVzZSBvZiBhIGd1YXJkLCBhIFJPVVRFUl9DQU5DRUwgYWN0aW9uIHdpbGwgYmVcbiAqIGRpc3BhdGNoZWQuIElmIG5hdmlnYXRpb24gcmVzdWx0cyBpbiBhbiBlcnJvciwgYSBST1VURVJfRVJST1IgYWN0aW9uIHdpbGwgYmUgZGlzcGF0Y2hlZC5cbiAqXG4gKiBCb3RoIFJPVVRFUl9DQU5DRUwgYW5kIFJPVVRFUl9FUlJPUiBjb250YWluIHRoZSBzdG9yZSBzdGF0ZSBiZWZvcmUgdGhlIG5hdmlnYXRpb25cbiAqIHdoaWNoIGNhbiBiZSB1c2VkIHRvIHJlc3RvcmUgdGhlIGNvbnNpc3RlbmN5IG9mIHRoZSBzdG9yZS5cbiAqXG4gKiBVc2FnZTpcbiAqXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiBATmdNb2R1bGUoe1xuICogICBkZWNsYXJhdGlvbnM6IFtBcHBDbXAsIFNpbXBsZUNtcF0sXG4gKiAgIGltcG9ydHM6IFtcbiAqICAgICBCcm93c2VyTW9kdWxlLFxuICogICAgIFN0b3JlTW9kdWxlLmZvclJvb3QobWFwT2ZSZWR1Y2VycyksXG4gKiAgICAgUm91dGVyTW9kdWxlLmZvclJvb3QoW1xuICogICAgICAgeyBwYXRoOiAnJywgY29tcG9uZW50OiBTaW1wbGVDbXAgfSxcbiAqICAgICAgIHsgcGF0aDogJ25leHQnLCBjb21wb25lbnQ6IFNpbXBsZUNtcCB9XG4gKiAgICAgXSksXG4gKiAgICAgU3RvcmVSb3V0ZXJDb25uZWN0aW5nTW9kdWxlLmZvclJvb3QoKVxuICogICBdLFxuICogICBib290c3RyYXA6IFtBcHBDbXBdXG4gKiB9KVxuICogZXhwb3J0IGNsYXNzIEFwcE1vZHVsZSB7XG4gKiB9XG4gKiBgYGBcbiAqL1xuQE5nTW9kdWxlKHt9KVxuZXhwb3J0IGNsYXNzIFN0b3JlUm91dGVyQ29ubmVjdGluZ01vZHVsZSB7XG4gIHByaXZhdGUgbGFzdEV2ZW50OiBFdmVudCB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIHJvdXRlclN0YXRlOiBTZXJpYWxpemVkUm91dGVyU3RhdGVTbmFwc2hvdCB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIHN0b3JlU3RhdGU6IGFueTtcbiAgcHJpdmF0ZSB0cmlnZ2VyID0gUm91dGVyVHJpZ2dlci5OT05FO1xuICBwcml2YXRlIHJlYWRvbmx5IHN0YXRlS2V5OiBTdGF0ZUtleU9yU2VsZWN0b3I7XG5cbiAgc3RhdGljIGZvclJvb3Q8XG4gICAgVCBleHRlbmRzIEJhc2VSb3V0ZXJTdG9yZVN0YXRlID0gU2VyaWFsaXplZFJvdXRlclN0YXRlU25hcHNob3RcbiAgPihcbiAgICBjb25maWc6IFN0b3JlUm91dGVyQ29uZmlnPFQ+ID0ge31cbiAgKTogTW9kdWxlV2l0aFByb3ZpZGVyczxTdG9yZVJvdXRlckNvbm5lY3RpbmdNb2R1bGU+IHtcbiAgICByZXR1cm4ge1xuICAgICAgbmdNb2R1bGU6IFN0b3JlUm91dGVyQ29ubmVjdGluZ01vZHVsZSxcbiAgICAgIHByb3ZpZGVyczogW1xuICAgICAgICB7IHByb3ZpZGU6IF9ST1VURVJfQ09ORklHLCB1c2VWYWx1ZTogY29uZmlnIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBwcm92aWRlOiBST1VURVJfQ09ORklHLFxuICAgICAgICAgIHVzZUZhY3Rvcnk6IF9jcmVhdGVSb3V0ZXJDb25maWcsXG4gICAgICAgICAgZGVwczogW19ST1VURVJfQ09ORklHXSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHByb3ZpZGU6IFJvdXRlclN0YXRlU2VyaWFsaXplcixcbiAgICAgICAgICB1c2VDbGFzczogY29uZmlnLnNlcmlhbGl6ZXJcbiAgICAgICAgICAgID8gY29uZmlnLnNlcmlhbGl6ZXJcbiAgICAgICAgICAgIDogY29uZmlnLnJvdXRlclN0YXRlID09PSBSb3V0ZXJTdGF0ZS5GdWxsXG4gICAgICAgICAgICA/IERlZmF1bHRSb3V0ZXJTdGF0ZVNlcmlhbGl6ZXJcbiAgICAgICAgICAgIDogTWluaW1hbFJvdXRlclN0YXRlU2VyaWFsaXplcixcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgc3RvcmU6IFN0b3JlPGFueT4sXG4gICAgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlcixcbiAgICBwcml2YXRlIHNlcmlhbGl6ZXI6IFJvdXRlclN0YXRlU2VyaWFsaXplcjxTZXJpYWxpemVkUm91dGVyU3RhdGVTbmFwc2hvdD4sXG4gICAgcHJpdmF0ZSBlcnJvckhhbmRsZXI6IEVycm9ySGFuZGxlcixcbiAgICBASW5qZWN0KFJPVVRFUl9DT05GSUcpIHByaXZhdGUgcmVhZG9ubHkgY29uZmlnOiBTdG9yZVJvdXRlckNvbmZpZyxcbiAgICBASW5qZWN0KEFDVElWRV9SVU5USU1FX0NIRUNLUylcbiAgICBwcml2YXRlIHJlYWRvbmx5IGFjdGl2ZVJ1bnRpbWVDaGVja3M6IFJ1bnRpbWVDaGVja3NcbiAgKSB7XG4gICAgdGhpcy5zdGF0ZUtleSA9IHRoaXMuY29uZmlnLnN0YXRlS2V5IGFzIFN0YXRlS2V5T3JTZWxlY3RvcjtcblxuICAgIGlmIChcbiAgICAgICFpc05ncnhNb2NrRW52aXJvbm1lbnQoKSAmJlxuICAgICAgaXNEZXZNb2RlKCkgJiZcbiAgICAgIChhY3RpdmVSdW50aW1lQ2hlY2tzPy5zdHJpY3RBY3Rpb25TZXJpYWxpemFiaWxpdHkgfHxcbiAgICAgICAgYWN0aXZlUnVudGltZUNoZWNrcz8uc3RyaWN0U3RhdGVTZXJpYWxpemFiaWxpdHkpICYmXG4gICAgICB0aGlzLnNlcmlhbGl6ZXIgaW5zdGFuY2VvZiBEZWZhdWx0Um91dGVyU3RhdGVTZXJpYWxpemVyXG4gICAgKSB7XG4gICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICdAbmdyeC9yb3V0ZXItc3RvcmU6IFRoZSBzZXJpYWxpemFiaWxpdHkgcnVudGltZSBjaGVja3MgY2Fubm90IGJlIGVuYWJsZWQgJyArXG4gICAgICAgICAgJ3dpdGggdGhlIERlZmF1bHRSb3V0ZXJTdGF0ZVNlcmlhbGl6ZXIuIFRoZSBkZWZhdWx0IHNlcmlhbGl6ZXIgJyArXG4gICAgICAgICAgJ2hhcyBhbiB1bnNlcmlhbGl6YWJsZSByb3V0ZXIgc3RhdGUgYW5kIGFjdGlvbnMgdGhhdCBhcmUgbm90IHNlcmlhbGl6YWJsZS4gJyArXG4gICAgICAgICAgJ1RvIHVzZSB0aGUgc2VyaWFsaXphYmlsaXR5IHJ1bnRpbWUgY2hlY2tzIGVpdGhlciB1c2UgJyArXG4gICAgICAgICAgJ3RoZSBNaW5pbWFsUm91dGVyU3RhdGVTZXJpYWxpemVyIG9yIGltcGxlbWVudCBhIGN1c3RvbSByb3V0ZXIgc3RhdGUgc2VyaWFsaXplci4gJyArXG4gICAgICAgICAgJ1RoaXMgYWxzbyBhcHBsaWVzIHRvIEl2eSB3aXRoIGltbXV0YWJpbGl0eSBydW50aW1lIGNoZWNrcy4nXG4gICAgICApO1xuICAgIH1cblxuICAgIHRoaXMuc2V0VXBTdG9yZVN0YXRlTGlzdGVuZXIoKTtcbiAgICB0aGlzLnNldFVwUm91dGVyRXZlbnRzTGlzdGVuZXIoKTtcbiAgfVxuXG4gIHByaXZhdGUgc2V0VXBTdG9yZVN0YXRlTGlzdGVuZXIoKTogdm9pZCB7XG4gICAgdGhpcy5zdG9yZVxuICAgICAgLnBpcGUoc2VsZWN0KHRoaXMuc3RhdGVLZXkgYXMgYW55KSwgd2l0aExhdGVzdEZyb20odGhpcy5zdG9yZSkpXG4gICAgICAuc3Vic2NyaWJlKChbcm91dGVyU3RvcmVTdGF0ZSwgc3RvcmVTdGF0ZV0pID0+IHtcbiAgICAgICAgdGhpcy5uYXZpZ2F0ZUlmTmVlZGVkKHJvdXRlclN0b3JlU3RhdGUsIHN0b3JlU3RhdGUpO1xuICAgICAgfSk7XG4gIH1cblxuICBwcml2YXRlIG5hdmlnYXRlSWZOZWVkZWQoXG4gICAgcm91dGVyU3RvcmVTdGF0ZTogUm91dGVyUmVkdWNlclN0YXRlLFxuICAgIHN0b3JlU3RhdGU6IGFueVxuICApOiB2b2lkIHtcbiAgICBpZiAoIXJvdXRlclN0b3JlU3RhdGUgfHwgIXJvdXRlclN0b3JlU3RhdGUuc3RhdGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHRoaXMudHJpZ2dlciA9PT0gUm91dGVyVHJpZ2dlci5ST1VURVIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHRoaXMubGFzdEV2ZW50IGluc3RhbmNlb2YgTmF2aWdhdGlvblN0YXJ0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgdXJsID0gcm91dGVyU3RvcmVTdGF0ZS5zdGF0ZS51cmw7XG4gICAgaWYgKCFpc1NhbWVVcmwodGhpcy5yb3V0ZXIudXJsLCB1cmwpKSB7XG4gICAgICB0aGlzLnN0b3JlU3RhdGUgPSBzdG9yZVN0YXRlO1xuICAgICAgdGhpcy50cmlnZ2VyID0gUm91dGVyVHJpZ2dlci5TVE9SRTtcbiAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlQnlVcmwodXJsKS5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgdGhpcy5lcnJvckhhbmRsZXIuaGFuZGxlRXJyb3IoZXJyb3IpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzZXRVcFJvdXRlckV2ZW50c0xpc3RlbmVyKCk6IHZvaWQge1xuICAgIGNvbnN0IGRpc3BhdGNoTmF2TGF0ZSA9XG4gICAgICB0aGlzLmNvbmZpZy5uYXZpZ2F0aW9uQWN0aW9uVGltaW5nID09PVxuICAgICAgTmF2aWdhdGlvbkFjdGlvblRpbWluZy5Qb3N0QWN0aXZhdGlvbjtcbiAgICBsZXQgcm91dGVzUmVjb2duaXplZDogUm91dGVzUmVjb2duaXplZDtcblxuICAgIHRoaXMucm91dGVyLmV2ZW50c1xuICAgICAgLnBpcGUod2l0aExhdGVzdEZyb20odGhpcy5zdG9yZSkpXG4gICAgICAuc3Vic2NyaWJlKChbZXZlbnQsIHN0b3JlU3RhdGVdKSA9PiB7XG4gICAgICAgIHRoaXMubGFzdEV2ZW50ID0gZXZlbnQ7XG5cbiAgICAgICAgaWYgKGV2ZW50IGluc3RhbmNlb2YgTmF2aWdhdGlvblN0YXJ0KSB7XG4gICAgICAgICAgdGhpcy5yb3V0ZXJTdGF0ZSA9IHRoaXMuc2VyaWFsaXplci5zZXJpYWxpemUoXG4gICAgICAgICAgICB0aGlzLnJvdXRlci5yb3V0ZXJTdGF0ZS5zbmFwc2hvdFxuICAgICAgICAgICk7XG4gICAgICAgICAgaWYgKHRoaXMudHJpZ2dlciAhPT0gUm91dGVyVHJpZ2dlci5TVE9SRSkge1xuICAgICAgICAgICAgdGhpcy5zdG9yZVN0YXRlID0gc3RvcmVTdGF0ZTtcbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hSb3V0ZXJSZXF1ZXN0KGV2ZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnQgaW5zdGFuY2VvZiBSb3V0ZXNSZWNvZ25pemVkKSB7XG4gICAgICAgICAgcm91dGVzUmVjb2duaXplZCA9IGV2ZW50O1xuXG4gICAgICAgICAgaWYgKCFkaXNwYXRjaE5hdkxhdGUgJiYgdGhpcy50cmlnZ2VyICE9PSBSb3V0ZXJUcmlnZ2VyLlNUT1JFKSB7XG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoUm91dGVyTmF2aWdhdGlvbihldmVudCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50IGluc3RhbmNlb2YgTmF2aWdhdGlvbkNhbmNlbCkge1xuICAgICAgICAgIHRoaXMuZGlzcGF0Y2hSb3V0ZXJDYW5jZWwoZXZlbnQpO1xuICAgICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICAgICAgfSBlbHNlIGlmIChldmVudCBpbnN0YW5jZW9mIE5hdmlnYXRpb25FcnJvcikge1xuICAgICAgICAgIHRoaXMuZGlzcGF0Y2hSb3V0ZXJFcnJvcihldmVudCk7XG4gICAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50IGluc3RhbmNlb2YgTmF2aWdhdGlvbkVuZCkge1xuICAgICAgICAgIGlmICh0aGlzLnRyaWdnZXIgIT09IFJvdXRlclRyaWdnZXIuU1RPUkUpIHtcbiAgICAgICAgICAgIGlmIChkaXNwYXRjaE5hdkxhdGUpIHtcbiAgICAgICAgICAgICAgdGhpcy5kaXNwYXRjaFJvdXRlck5hdmlnYXRpb24ocm91dGVzUmVjb2duaXplZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoUm91dGVyTmF2aWdhdGVkKGV2ZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgZGlzcGF0Y2hSb3V0ZXJSZXF1ZXN0KGV2ZW50OiBOYXZpZ2F0aW9uU3RhcnQpOiB2b2lkIHtcbiAgICB0aGlzLmRpc3BhdGNoUm91dGVyQWN0aW9uKFJPVVRFUl9SRVFVRVNULCB7IGV2ZW50IH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBkaXNwYXRjaFJvdXRlck5hdmlnYXRpb24oXG4gICAgbGFzdFJvdXRlc1JlY29nbml6ZWQ6IFJvdXRlc1JlY29nbml6ZWRcbiAgKTogdm9pZCB7XG4gICAgY29uc3QgbmV4dFJvdXRlclN0YXRlID0gdGhpcy5zZXJpYWxpemVyLnNlcmlhbGl6ZShcbiAgICAgIGxhc3RSb3V0ZXNSZWNvZ25pemVkLnN0YXRlXG4gICAgKTtcbiAgICB0aGlzLmRpc3BhdGNoUm91dGVyQWN0aW9uKFJPVVRFUl9OQVZJR0FUSU9OLCB7XG4gICAgICByb3V0ZXJTdGF0ZTogbmV4dFJvdXRlclN0YXRlLFxuICAgICAgZXZlbnQ6IG5ldyBSb3V0ZXNSZWNvZ25pemVkKFxuICAgICAgICBsYXN0Um91dGVzUmVjb2duaXplZC5pZCxcbiAgICAgICAgbGFzdFJvdXRlc1JlY29nbml6ZWQudXJsLFxuICAgICAgICBsYXN0Um91dGVzUmVjb2duaXplZC51cmxBZnRlclJlZGlyZWN0cyxcbiAgICAgICAgbmV4dFJvdXRlclN0YXRlXG4gICAgICApLFxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBkaXNwYXRjaFJvdXRlckNhbmNlbChldmVudDogTmF2aWdhdGlvbkNhbmNlbCk6IHZvaWQge1xuICAgIHRoaXMuZGlzcGF0Y2hSb3V0ZXJBY3Rpb24oUk9VVEVSX0NBTkNFTCwge1xuICAgICAgc3RvcmVTdGF0ZTogdGhpcy5zdG9yZVN0YXRlLFxuICAgICAgZXZlbnQsXG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGRpc3BhdGNoUm91dGVyRXJyb3IoZXZlbnQ6IE5hdmlnYXRpb25FcnJvcik6IHZvaWQge1xuICAgIHRoaXMuZGlzcGF0Y2hSb3V0ZXJBY3Rpb24oUk9VVEVSX0VSUk9SLCB7XG4gICAgICBzdG9yZVN0YXRlOiB0aGlzLnN0b3JlU3RhdGUsXG4gICAgICBldmVudDogbmV3IE5hdmlnYXRpb25FcnJvcihldmVudC5pZCwgZXZlbnQudXJsLCBgJHtldmVudH1gKSxcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgZGlzcGF0Y2hSb3V0ZXJOYXZpZ2F0ZWQoZXZlbnQ6IE5hdmlnYXRpb25FbmQpOiB2b2lkIHtcbiAgICBjb25zdCByb3V0ZXJTdGF0ZSA9IHRoaXMuc2VyaWFsaXplci5zZXJpYWxpemUoXG4gICAgICB0aGlzLnJvdXRlci5yb3V0ZXJTdGF0ZS5zbmFwc2hvdFxuICAgICk7XG4gICAgdGhpcy5kaXNwYXRjaFJvdXRlckFjdGlvbihST1VURVJfTkFWSUdBVEVELCB7IGV2ZW50LCByb3V0ZXJTdGF0ZSB9KTtcbiAgfVxuXG4gIHByaXZhdGUgZGlzcGF0Y2hSb3V0ZXJBY3Rpb24oXG4gICAgdHlwZTogc3RyaW5nLFxuICAgIHBheWxvYWQ6IFN0b3JlUm91dGVyQWN0aW9uUGF5bG9hZFxuICApOiB2b2lkIHtcbiAgICB0aGlzLnRyaWdnZXIgPSBSb3V0ZXJUcmlnZ2VyLlJPVVRFUjtcbiAgICB0cnkge1xuICAgICAgdGhpcy5zdG9yZS5kaXNwYXRjaCh7XG4gICAgICAgIHR5cGUsXG4gICAgICAgIHBheWxvYWQ6IHtcbiAgICAgICAgICByb3V0ZXJTdGF0ZTogdGhpcy5yb3V0ZXJTdGF0ZSxcbiAgICAgICAgICAuLi5wYXlsb2FkLFxuICAgICAgICAgIGV2ZW50OlxuICAgICAgICAgICAgdGhpcy5jb25maWcucm91dGVyU3RhdGUgPT09IFJvdXRlclN0YXRlLkZ1bGxcbiAgICAgICAgICAgICAgPyBwYXlsb2FkLmV2ZW50XG4gICAgICAgICAgICAgIDoge1xuICAgICAgICAgICAgICAgICAgaWQ6IHBheWxvYWQuZXZlbnQuaWQsXG4gICAgICAgICAgICAgICAgICB1cmw6IHBheWxvYWQuZXZlbnQudXJsLFxuICAgICAgICAgICAgICAgICAgLy8gc2FmZSwgYXMgaXQgd2lsbCBqdXN0IGJlIGB1bmRlZmluZWRgIGZvciBub24tTmF2aWdhdGlvbkVuZCByb3V0ZXIgZXZlbnRzXG4gICAgICAgICAgICAgICAgICB1cmxBZnRlclJlZGlyZWN0czogKHBheWxvYWQuZXZlbnQgYXMgTmF2aWdhdGlvbkVuZClcbiAgICAgICAgICAgICAgICAgICAgLnVybEFmdGVyUmVkaXJlY3RzLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdGhpcy50cmlnZ2VyID0gUm91dGVyVHJpZ2dlci5OT05FO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgcmVzZXQoKSB7XG4gICAgdGhpcy50cmlnZ2VyID0gUm91dGVyVHJpZ2dlci5OT05FO1xuICAgIHRoaXMuc3RvcmVTdGF0ZSA9IG51bGw7XG4gICAgdGhpcy5yb3V0ZXJTdGF0ZSA9IG51bGw7XG4gIH1cbn1cblxuLyoqXG4gKiBDaGVjayBpZiB0aGUgVVJMcyBhcmUgbWF0Y2hpbmcuIEFjY291bnRzIGZvciB0aGUgcG9zc2liaWxpdHkgb2YgdHJhaWxpbmcgXCIvXCIgaW4gdXJsLlxuICovXG5mdW5jdGlvbiBpc1NhbWVVcmwoZmlyc3Q6IHN0cmluZywgc2Vjb25kOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIHN0cmlwVHJhaWxpbmdTbGFzaChmaXJzdCkgPT09IHN0cmlwVHJhaWxpbmdTbGFzaChzZWNvbmQpO1xufVxuXG5mdW5jdGlvbiBzdHJpcFRyYWlsaW5nU2xhc2godGV4dDogc3RyaW5nKTogc3RyaW5nIHtcbiAgaWYgKHRleHQ/Lmxlbmd0aCA+IDAgJiYgdGV4dFt0ZXh0Lmxlbmd0aCAtIDFdID09PSAnLycpIHtcbiAgICByZXR1cm4gdGV4dC5zdWJzdHJpbmcoMCwgdGV4dC5sZW5ndGggLSAxKTtcbiAgfVxuICByZXR1cm4gdGV4dDtcbn1cbiJdfQ==