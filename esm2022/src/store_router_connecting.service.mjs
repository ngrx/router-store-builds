import { Inject, Injectable, isDevMode } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, RoutesRecognized, } from '@angular/router';
import { ACTIVE_RUNTIME_CHECKS, isNgrxMockEnvironment, select, } from '@ngrx/store';
import { withLatestFrom } from 'rxjs/operators';
import { ROUTER_CANCEL, ROUTER_ERROR, ROUTER_NAVIGATED, ROUTER_NAVIGATION, ROUTER_REQUEST, } from './actions';
import { NavigationActionTiming, ROUTER_CONFIG, RouterState, } from './router_store_config';
import { FullRouterStateSerializer, } from './serializers/full_serializer';
import * as i0 from "@angular/core";
import * as i1 from "@ngrx/store";
import * as i2 from "@angular/router";
import * as i3 from "./serializers/base";
var RouterTrigger;
(function (RouterTrigger) {
    RouterTrigger[RouterTrigger["NONE"] = 1] = "NONE";
    RouterTrigger[RouterTrigger["ROUTER"] = 2] = "ROUTER";
    RouterTrigger[RouterTrigger["STORE"] = 3] = "STORE";
})(RouterTrigger || (RouterTrigger = {}));
/**
 * Shared router initialization logic used alongside both the StoreRouterConnectingModule and the provideRouterStore
 * function
 */
export class StoreRouterConnectingService {
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
            (activeRuntimeChecks?.strictActionSerializability ||
                activeRuntimeChecks?.strictStateSerializability) &&
            this.serializer instanceof FullRouterStateSerializer) {
            console.warn('@ngrx/router-store: The serializability runtime checks cannot be enabled ' +
                'with the FullRouterStateSerializer. The FullRouterStateSerializer ' +
                'has an unserializable router state and actions that are not serializable. ' +
                'To use the serializability runtime checks either use ' +
                'the MinimalRouterStateSerializer or implement a custom router state serializer.');
        }
        this.setUpStoreStateListener();
        this.setUpRouterEventsListener();
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
                payload: {
                    routerState: this.routerState,
                    ...payload,
                    event: this.config.routerState === RouterState.Full
                        ? payload.event
                        : {
                            id: payload.event.id,
                            url: payload.event.url,
                            // safe, as it will just be `undefined` for non-NavigationEnd router events
                            urlAfterRedirects: payload.event
                                .urlAfterRedirects,
                        },
                },
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
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.5", ngImport: i0, type: StoreRouterConnectingService, deps: [{ token: i1.Store }, { token: i2.Router }, { token: i3.RouterStateSerializer }, { token: i0.ErrorHandler }, { token: ROUTER_CONFIG }, { token: ACTIVE_RUNTIME_CHECKS }], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.2.5", ngImport: i0, type: StoreRouterConnectingService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.5", ngImport: i0, type: StoreRouterConnectingService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.Store }, { type: i2.Router }, { type: i3.RouterStateSerializer }, { type: i0.ErrorHandler }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [ROUTER_CONFIG]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [ACTIVE_RUNTIME_CHECKS]
                }] }] });
/**
 * Check if the URLs are matching. Accounts for the possibility of trailing "/" in url.
 */
function isSameUrl(first, second) {
    return stripTrailingSlash(first) === stripTrailingSlash(second);
}
function stripTrailingSlash(text) {
    if (text?.length > 0 && text[text.length - 1] === '/') {
        return text.substring(0, text.length - 1);
    }
    return text;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmVfcm91dGVyX2Nvbm5lY3Rpbmcuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL21vZHVsZXMvcm91dGVyLXN0b3JlL3NyYy9zdG9yZV9yb3V0ZXJfY29ubmVjdGluZy5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBZ0IsTUFBTSxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDNUUsT0FBTyxFQUVMLGdCQUFnQixFQUNoQixhQUFhLEVBQ2IsZUFBZSxFQUNmLGVBQWUsRUFHZixnQkFBZ0IsR0FDakIsTUFBTSxpQkFBaUIsQ0FBQztBQUN6QixPQUFPLEVBQ0wscUJBQXFCLEVBQ3JCLHFCQUFxQixFQUVyQixNQUFNLEdBRVAsTUFBTSxhQUFhLENBQUM7QUFDckIsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ2hELE9BQU8sRUFDTCxhQUFhLEVBQ2IsWUFBWSxFQUNaLGdCQUFnQixFQUNoQixpQkFBaUIsRUFDakIsY0FBYyxHQUNmLE1BQU0sV0FBVyxDQUFDO0FBQ25CLE9BQU8sRUFDTCxzQkFBc0IsRUFDdEIsYUFBYSxFQUNiLFdBQVcsR0FHWixNQUFNLHVCQUF1QixDQUFDO0FBQy9CLE9BQU8sRUFDTCx5QkFBeUIsR0FFMUIsTUFBTSwrQkFBK0IsQ0FBQzs7Ozs7QUFJdkMsSUFBSyxhQUlKO0FBSkQsV0FBSyxhQUFhO0lBQ2hCLGlEQUFRLENBQUE7SUFDUixxREFBVSxDQUFBO0lBQ1YsbURBQVMsQ0FBQTtBQUNYLENBQUMsRUFKSSxhQUFhLEtBQWIsYUFBYSxRQUlqQjtBQVFEOzs7R0FHRztBQUVILE1BQU0sT0FBTyw0QkFBNEI7SUFPdkMsWUFDVSxLQUFpQixFQUNqQixNQUFjLEVBQ2QsVUFBZ0UsRUFDaEUsWUFBMEIsRUFDTSxNQUF5QixFQUVoRCxtQkFBa0M7UUFOM0MsVUFBSyxHQUFMLEtBQUssQ0FBWTtR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QUFJLENBQUM7SUFDMUIsQ0FBQztpSUEzTFUsNEJBQTRCLDhIQVk3QixhQUFhLGFBQ2IscUJBQXFCO3FJQWJwQiw0QkFBNEI7OzJGQUE1Qiw0QkFBNEI7a0JBRHhDLFVBQVU7OzBCQWFOLE1BQU07MkJBQUMsYUFBYTs7MEJBQ3BCLE1BQU07MkJBQUMscUJBQXFCOztBQWlMakM7O0dBRUc7QUFDSCxTQUFTLFNBQVMsQ0FBQyxLQUFhLEVBQUUsTUFBYztJQUM5QyxPQUFPLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxLQUFLLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ2xFLENBQUM7QUFFRCxTQUFTLGtCQUFrQixDQUFDLElBQVk7SUFDdEMsSUFBSSxJQUFJLEVBQUUsTUFBTSxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztRQUN0RCxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUNELE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEVycm9ySGFuZGxlciwgSW5qZWN0LCBJbmplY3RhYmxlLCBpc0Rldk1vZGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIEV2ZW50LFxuICBOYXZpZ2F0aW9uQ2FuY2VsLFxuICBOYXZpZ2F0aW9uRW5kLFxuICBOYXZpZ2F0aW9uRXJyb3IsXG4gIE5hdmlnYXRpb25TdGFydCxcbiAgUm91dGVyLFxuICBSb3V0ZXJFdmVudCxcbiAgUm91dGVzUmVjb2duaXplZCxcbn0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7XG4gIEFDVElWRV9SVU5USU1FX0NIRUNLUyxcbiAgaXNOZ3J4TW9ja0Vudmlyb25tZW50LFxuICBSdW50aW1lQ2hlY2tzLFxuICBzZWxlY3QsXG4gIFN0b3JlLFxufSBmcm9tICdAbmdyeC9zdG9yZSc7XG5pbXBvcnQgeyB3aXRoTGF0ZXN0RnJvbSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7XG4gIFJPVVRFUl9DQU5DRUwsXG4gIFJPVVRFUl9FUlJPUixcbiAgUk9VVEVSX05BVklHQVRFRCxcbiAgUk9VVEVSX05BVklHQVRJT04sXG4gIFJPVVRFUl9SRVFVRVNULFxufSBmcm9tICcuL2FjdGlvbnMnO1xuaW1wb3J0IHtcbiAgTmF2aWdhdGlvbkFjdGlvblRpbWluZyxcbiAgUk9VVEVSX0NPTkZJRyxcbiAgUm91dGVyU3RhdGUsXG4gIFN0YXRlS2V5T3JTZWxlY3RvcixcbiAgU3RvcmVSb3V0ZXJDb25maWcsXG59IGZyb20gJy4vcm91dGVyX3N0b3JlX2NvbmZpZyc7XG5pbXBvcnQge1xuICBGdWxsUm91dGVyU3RhdGVTZXJpYWxpemVyLFxuICBTZXJpYWxpemVkUm91dGVyU3RhdGVTbmFwc2hvdCxcbn0gZnJvbSAnLi9zZXJpYWxpemVycy9mdWxsX3NlcmlhbGl6ZXInO1xuaW1wb3J0IHsgUm91dGVyUmVkdWNlclN0YXRlIH0gZnJvbSAnLi9yZWR1Y2VyJztcbmltcG9ydCB7IFJvdXRlclN0YXRlU2VyaWFsaXplciB9IGZyb20gJy4vc2VyaWFsaXplcnMvYmFzZSc7XG5cbmVudW0gUm91dGVyVHJpZ2dlciB7XG4gIE5PTkUgPSAxLFxuICBST1VURVIgPSAyLFxuICBTVE9SRSA9IDMsXG59XG5cbmludGVyZmFjZSBTdG9yZVJvdXRlckFjdGlvblBheWxvYWQge1xuICBldmVudDogUm91dGVyRXZlbnQ7XG4gIHJvdXRlclN0YXRlPzogU2VyaWFsaXplZFJvdXRlclN0YXRlU25hcHNob3Q7XG4gIHN0b3JlU3RhdGU/OiBhbnk7XG59XG5cbi8qKlxuICogU2hhcmVkIHJvdXRlciBpbml0aWFsaXphdGlvbiBsb2dpYyB1c2VkIGFsb25nc2lkZSBib3RoIHRoZSBTdG9yZVJvdXRlckNvbm5lY3RpbmdNb2R1bGUgYW5kIHRoZSBwcm92aWRlUm91dGVyU3RvcmVcbiAqIGZ1bmN0aW9uXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBTdG9yZVJvdXRlckNvbm5lY3RpbmdTZXJ2aWNlIHtcbiAgcHJpdmF0ZSBsYXN0RXZlbnQ6IEV2ZW50IHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgcm91dGVyU3RhdGU6IFNlcmlhbGl6ZWRSb3V0ZXJTdGF0ZVNuYXBzaG90IHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgc3RvcmVTdGF0ZTogYW55O1xuICBwcml2YXRlIHRyaWdnZXIgPSBSb3V0ZXJUcmlnZ2VyLk5PTkU7XG4gIHByaXZhdGUgcmVhZG9ubHkgc3RhdGVLZXk6IFN0YXRlS2V5T3JTZWxlY3RvcjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHN0b3JlOiBTdG9yZTxhbnk+LFxuICAgIHByaXZhdGUgcm91dGVyOiBSb3V0ZXIsXG4gICAgcHJpdmF0ZSBzZXJpYWxpemVyOiBSb3V0ZXJTdGF0ZVNlcmlhbGl6ZXI8U2VyaWFsaXplZFJvdXRlclN0YXRlU25hcHNob3Q+LFxuICAgIHByaXZhdGUgZXJyb3JIYW5kbGVyOiBFcnJvckhhbmRsZXIsXG4gICAgQEluamVjdChST1VURVJfQ09ORklHKSBwcml2YXRlIHJlYWRvbmx5IGNvbmZpZzogU3RvcmVSb3V0ZXJDb25maWcsXG4gICAgQEluamVjdChBQ1RJVkVfUlVOVElNRV9DSEVDS1MpXG4gICAgcHJpdmF0ZSByZWFkb25seSBhY3RpdmVSdW50aW1lQ2hlY2tzOiBSdW50aW1lQ2hlY2tzXG4gICkge1xuICAgIHRoaXMuc3RhdGVLZXkgPSB0aGlzLmNvbmZpZy5zdGF0ZUtleSBhcyBTdGF0ZUtleU9yU2VsZWN0b3I7XG5cbiAgICBpZiAoXG4gICAgICAhaXNOZ3J4TW9ja0Vudmlyb25tZW50KCkgJiZcbiAgICAgIGlzRGV2TW9kZSgpICYmXG4gICAgICAoYWN0aXZlUnVudGltZUNoZWNrcz8uc3RyaWN0QWN0aW9uU2VyaWFsaXphYmlsaXR5IHx8XG4gICAgICAgIGFjdGl2ZVJ1bnRpbWVDaGVja3M/LnN0cmljdFN0YXRlU2VyaWFsaXphYmlsaXR5KSAmJlxuICAgICAgdGhpcy5zZXJpYWxpemVyIGluc3RhbmNlb2YgRnVsbFJvdXRlclN0YXRlU2VyaWFsaXplclxuICAgICkge1xuICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAnQG5ncngvcm91dGVyLXN0b3JlOiBUaGUgc2VyaWFsaXphYmlsaXR5IHJ1bnRpbWUgY2hlY2tzIGNhbm5vdCBiZSBlbmFibGVkICcgK1xuICAgICAgICAgICd3aXRoIHRoZSBGdWxsUm91dGVyU3RhdGVTZXJpYWxpemVyLiBUaGUgRnVsbFJvdXRlclN0YXRlU2VyaWFsaXplciAnICtcbiAgICAgICAgICAnaGFzIGFuIHVuc2VyaWFsaXphYmxlIHJvdXRlciBzdGF0ZSBhbmQgYWN0aW9ucyB0aGF0IGFyZSBub3Qgc2VyaWFsaXphYmxlLiAnICtcbiAgICAgICAgICAnVG8gdXNlIHRoZSBzZXJpYWxpemFiaWxpdHkgcnVudGltZSBjaGVja3MgZWl0aGVyIHVzZSAnICtcbiAgICAgICAgICAndGhlIE1pbmltYWxSb3V0ZXJTdGF0ZVNlcmlhbGl6ZXIgb3IgaW1wbGVtZW50IGEgY3VzdG9tIHJvdXRlciBzdGF0ZSBzZXJpYWxpemVyLidcbiAgICAgICk7XG4gICAgfVxuXG4gICAgdGhpcy5zZXRVcFN0b3JlU3RhdGVMaXN0ZW5lcigpO1xuICAgIHRoaXMuc2V0VXBSb3V0ZXJFdmVudHNMaXN0ZW5lcigpO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXRVcFN0b3JlU3RhdGVMaXN0ZW5lcigpOiB2b2lkIHtcbiAgICB0aGlzLnN0b3JlXG4gICAgICAucGlwZShzZWxlY3QodGhpcy5zdGF0ZUtleSBhcyBhbnkpLCB3aXRoTGF0ZXN0RnJvbSh0aGlzLnN0b3JlKSlcbiAgICAgIC5zdWJzY3JpYmUoKFtyb3V0ZXJTdG9yZVN0YXRlLCBzdG9yZVN0YXRlXSkgPT4ge1xuICAgICAgICB0aGlzLm5hdmlnYXRlSWZOZWVkZWQocm91dGVyU3RvcmVTdGF0ZSwgc3RvcmVTdGF0ZSk7XG4gICAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgbmF2aWdhdGVJZk5lZWRlZChcbiAgICByb3V0ZXJTdG9yZVN0YXRlOiBSb3V0ZXJSZWR1Y2VyU3RhdGUsXG4gICAgc3RvcmVTdGF0ZTogYW55XG4gICk6IHZvaWQge1xuICAgIGlmICghcm91dGVyU3RvcmVTdGF0ZSB8fCAhcm91dGVyU3RvcmVTdGF0ZS5zdGF0ZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodGhpcy50cmlnZ2VyID09PSBSb3V0ZXJUcmlnZ2VyLlJPVVRFUikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodGhpcy5sYXN0RXZlbnQgaW5zdGFuY2VvZiBOYXZpZ2F0aW9uU3RhcnQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB1cmwgPSByb3V0ZXJTdG9yZVN0YXRlLnN0YXRlLnVybDtcbiAgICBpZiAoIWlzU2FtZVVybCh0aGlzLnJvdXRlci51cmwsIHVybCkpIHtcbiAgICAgIHRoaXMuc3RvcmVTdGF0ZSA9IHN0b3JlU3RhdGU7XG4gICAgICB0aGlzLnRyaWdnZXIgPSBSb3V0ZXJUcmlnZ2VyLlNUT1JFO1xuICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGVCeVVybCh1cmwpLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgICB0aGlzLmVycm9ySGFuZGxlci5oYW5kbGVFcnJvcihlcnJvcik7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHNldFVwUm91dGVyRXZlbnRzTGlzdGVuZXIoKTogdm9pZCB7XG4gICAgY29uc3QgZGlzcGF0Y2hOYXZMYXRlID1cbiAgICAgIHRoaXMuY29uZmlnLm5hdmlnYXRpb25BY3Rpb25UaW1pbmcgPT09XG4gICAgICBOYXZpZ2F0aW9uQWN0aW9uVGltaW5nLlBvc3RBY3RpdmF0aW9uO1xuICAgIGxldCByb3V0ZXNSZWNvZ25pemVkOiBSb3V0ZXNSZWNvZ25pemVkO1xuXG4gICAgdGhpcy5yb3V0ZXIuZXZlbnRzXG4gICAgICAucGlwZSh3aXRoTGF0ZXN0RnJvbSh0aGlzLnN0b3JlKSlcbiAgICAgIC5zdWJzY3JpYmUoKFtldmVudCwgc3RvcmVTdGF0ZV0pID0+IHtcbiAgICAgICAgdGhpcy5sYXN0RXZlbnQgPSBldmVudDtcblxuICAgICAgICBpZiAoZXZlbnQgaW5zdGFuY2VvZiBOYXZpZ2F0aW9uU3RhcnQpIHtcbiAgICAgICAgICB0aGlzLnJvdXRlclN0YXRlID0gdGhpcy5zZXJpYWxpemVyLnNlcmlhbGl6ZShcbiAgICAgICAgICAgIHRoaXMucm91dGVyLnJvdXRlclN0YXRlLnNuYXBzaG90XG4gICAgICAgICAgKTtcbiAgICAgICAgICBpZiAodGhpcy50cmlnZ2VyICE9PSBSb3V0ZXJUcmlnZ2VyLlNUT1JFKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3JlU3RhdGUgPSBzdG9yZVN0YXRlO1xuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaFJvdXRlclJlcXVlc3QoZXZlbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChldmVudCBpbnN0YW5jZW9mIFJvdXRlc1JlY29nbml6ZWQpIHtcbiAgICAgICAgICByb3V0ZXNSZWNvZ25pemVkID0gZXZlbnQ7XG5cbiAgICAgICAgICBpZiAoIWRpc3BhdGNoTmF2TGF0ZSAmJiB0aGlzLnRyaWdnZXIgIT09IFJvdXRlclRyaWdnZXIuU1RPUkUpIHtcbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hSb3V0ZXJOYXZpZ2F0aW9uKGV2ZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnQgaW5zdGFuY2VvZiBOYXZpZ2F0aW9uQ2FuY2VsKSB7XG4gICAgICAgICAgdGhpcy5kaXNwYXRjaFJvdXRlckNhbmNlbChldmVudCk7XG4gICAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50IGluc3RhbmNlb2YgTmF2aWdhdGlvbkVycm9yKSB7XG4gICAgICAgICAgdGhpcy5kaXNwYXRjaFJvdXRlckVycm9yKGV2ZW50KTtcbiAgICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnQgaW5zdGFuY2VvZiBOYXZpZ2F0aW9uRW5kKSB7XG4gICAgICAgICAgaWYgKHRoaXMudHJpZ2dlciAhPT0gUm91dGVyVHJpZ2dlci5TVE9SRSkge1xuICAgICAgICAgICAgaWYgKGRpc3BhdGNoTmF2TGF0ZSkge1xuICAgICAgICAgICAgICB0aGlzLmRpc3BhdGNoUm91dGVyTmF2aWdhdGlvbihyb3V0ZXNSZWNvZ25pemVkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hSb3V0ZXJOYXZpZ2F0ZWQoZXZlbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBkaXNwYXRjaFJvdXRlclJlcXVlc3QoZXZlbnQ6IE5hdmlnYXRpb25TdGFydCk6IHZvaWQge1xuICAgIHRoaXMuZGlzcGF0Y2hSb3V0ZXJBY3Rpb24oUk9VVEVSX1JFUVVFU1QsIHsgZXZlbnQgfSk7XG4gIH1cblxuICBwcml2YXRlIGRpc3BhdGNoUm91dGVyTmF2aWdhdGlvbihcbiAgICBsYXN0Um91dGVzUmVjb2duaXplZDogUm91dGVzUmVjb2duaXplZFxuICApOiB2b2lkIHtcbiAgICBjb25zdCBuZXh0Um91dGVyU3RhdGUgPSB0aGlzLnNlcmlhbGl6ZXIuc2VyaWFsaXplKFxuICAgICAgbGFzdFJvdXRlc1JlY29nbml6ZWQuc3RhdGVcbiAgICApO1xuICAgIHRoaXMuZGlzcGF0Y2hSb3V0ZXJBY3Rpb24oUk9VVEVSX05BVklHQVRJT04sIHtcbiAgICAgIHJvdXRlclN0YXRlOiBuZXh0Um91dGVyU3RhdGUsXG4gICAgICBldmVudDogbmV3IFJvdXRlc1JlY29nbml6ZWQoXG4gICAgICAgIGxhc3RSb3V0ZXNSZWNvZ25pemVkLmlkLFxuICAgICAgICBsYXN0Um91dGVzUmVjb2duaXplZC51cmwsXG4gICAgICAgIGxhc3RSb3V0ZXNSZWNvZ25pemVkLnVybEFmdGVyUmVkaXJlY3RzLFxuICAgICAgICBuZXh0Um91dGVyU3RhdGVcbiAgICAgICksXG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGRpc3BhdGNoUm91dGVyQ2FuY2VsKGV2ZW50OiBOYXZpZ2F0aW9uQ2FuY2VsKTogdm9pZCB7XG4gICAgdGhpcy5kaXNwYXRjaFJvdXRlckFjdGlvbihST1VURVJfQ0FOQ0VMLCB7XG4gICAgICBzdG9yZVN0YXRlOiB0aGlzLnN0b3JlU3RhdGUsXG4gICAgICBldmVudCxcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgZGlzcGF0Y2hSb3V0ZXJFcnJvcihldmVudDogTmF2aWdhdGlvbkVycm9yKTogdm9pZCB7XG4gICAgdGhpcy5kaXNwYXRjaFJvdXRlckFjdGlvbihST1VURVJfRVJST1IsIHtcbiAgICAgIHN0b3JlU3RhdGU6IHRoaXMuc3RvcmVTdGF0ZSxcbiAgICAgIGV2ZW50OiBuZXcgTmF2aWdhdGlvbkVycm9yKGV2ZW50LmlkLCBldmVudC51cmwsIGAke2V2ZW50fWApLFxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBkaXNwYXRjaFJvdXRlck5hdmlnYXRlZChldmVudDogTmF2aWdhdGlvbkVuZCk6IHZvaWQge1xuICAgIGNvbnN0IHJvdXRlclN0YXRlID0gdGhpcy5zZXJpYWxpemVyLnNlcmlhbGl6ZShcbiAgICAgIHRoaXMucm91dGVyLnJvdXRlclN0YXRlLnNuYXBzaG90XG4gICAgKTtcbiAgICB0aGlzLmRpc3BhdGNoUm91dGVyQWN0aW9uKFJPVVRFUl9OQVZJR0FURUQsIHsgZXZlbnQsIHJvdXRlclN0YXRlIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBkaXNwYXRjaFJvdXRlckFjdGlvbihcbiAgICB0eXBlOiBzdHJpbmcsXG4gICAgcGF5bG9hZDogU3RvcmVSb3V0ZXJBY3Rpb25QYXlsb2FkXG4gICk6IHZvaWQge1xuICAgIHRoaXMudHJpZ2dlciA9IFJvdXRlclRyaWdnZXIuUk9VVEVSO1xuICAgIHRyeSB7XG4gICAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKHtcbiAgICAgICAgdHlwZSxcbiAgICAgICAgcGF5bG9hZDoge1xuICAgICAgICAgIHJvdXRlclN0YXRlOiB0aGlzLnJvdXRlclN0YXRlLFxuICAgICAgICAgIC4uLnBheWxvYWQsXG4gICAgICAgICAgZXZlbnQ6XG4gICAgICAgICAgICB0aGlzLmNvbmZpZy5yb3V0ZXJTdGF0ZSA9PT0gUm91dGVyU3RhdGUuRnVsbFxuICAgICAgICAgICAgICA/IHBheWxvYWQuZXZlbnRcbiAgICAgICAgICAgICAgOiB7XG4gICAgICAgICAgICAgICAgICBpZDogcGF5bG9hZC5ldmVudC5pZCxcbiAgICAgICAgICAgICAgICAgIHVybDogcGF5bG9hZC5ldmVudC51cmwsXG4gICAgICAgICAgICAgICAgICAvLyBzYWZlLCBhcyBpdCB3aWxsIGp1c3QgYmUgYHVuZGVmaW5lZGAgZm9yIG5vbi1OYXZpZ2F0aW9uRW5kIHJvdXRlciBldmVudHNcbiAgICAgICAgICAgICAgICAgIHVybEFmdGVyUmVkaXJlY3RzOiAocGF5bG9hZC5ldmVudCBhcyBOYXZpZ2F0aW9uRW5kKVxuICAgICAgICAgICAgICAgICAgICAudXJsQWZ0ZXJSZWRpcmVjdHMsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0aGlzLnRyaWdnZXIgPSBSb3V0ZXJUcmlnZ2VyLk5PTkU7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSByZXNldCgpIHtcbiAgICB0aGlzLnRyaWdnZXIgPSBSb3V0ZXJUcmlnZ2VyLk5PTkU7XG4gICAgdGhpcy5zdG9yZVN0YXRlID0gbnVsbDtcbiAgICB0aGlzLnJvdXRlclN0YXRlID0gbnVsbDtcbiAgfVxufVxuXG4vKipcbiAqIENoZWNrIGlmIHRoZSBVUkxzIGFyZSBtYXRjaGluZy4gQWNjb3VudHMgZm9yIHRoZSBwb3NzaWJpbGl0eSBvZiB0cmFpbGluZyBcIi9cIiBpbiB1cmwuXG4gKi9cbmZ1bmN0aW9uIGlzU2FtZVVybChmaXJzdDogc3RyaW5nLCBzZWNvbmQ6IHN0cmluZyk6IGJvb2xlYW4ge1xuICByZXR1cm4gc3RyaXBUcmFpbGluZ1NsYXNoKGZpcnN0KSA9PT0gc3RyaXBUcmFpbGluZ1NsYXNoKHNlY29uZCk7XG59XG5cbmZ1bmN0aW9uIHN0cmlwVHJhaWxpbmdTbGFzaCh0ZXh0OiBzdHJpbmcpOiBzdHJpbmcge1xuICBpZiAodGV4dD8ubGVuZ3RoID4gMCAmJiB0ZXh0W3RleHQubGVuZ3RoIC0gMV0gPT09ICcvJykge1xuICAgIHJldHVybiB0ZXh0LnN1YnN0cmluZygwLCB0ZXh0Lmxlbmd0aCAtIDEpO1xuICB9XG4gIHJldHVybiB0ZXh0O1xufVxuIl19