import { createAction, props, isNgrxMockEnvironment, select, Store, ACTIVE_RUNTIME_CHECKS, createFeatureSelector, createSelector } from '@ngrx/store';
import { InjectionToken, isDevMode, NgModule, ErrorHandler, Inject } from '@angular/core';
import { NavigationStart, RoutesRecognized, NavigationCancel, NavigationError, NavigationEnd, Router } from '@angular/router';
import { withLatestFrom } from 'rxjs/operators';

/**
 * An action dispatched when a router navigation request is fired.
 */
const ROUTER_REQUEST = '@ngrx/router-store/request';
const routerRequestAction = createAction(ROUTER_REQUEST, props());
/**
 * An action dispatched when the router navigates.
 */
const ROUTER_NAVIGATION = '@ngrx/router-store/navigation';
const routerNavigationAction = createAction(ROUTER_NAVIGATION, props());
/**
 * An action dispatched when the router cancels navigation.
 */
const ROUTER_CANCEL = '@ngrx/router-store/cancel';
const routerCancelAction = createAction(ROUTER_CANCEL, props());
/**
 * An action dispatched when the router errors.
 */
const ROUTER_ERROR = '@ngrx/router-store/error';
const routerErrorAction = createAction(ROUTER_ERROR, props());
/**
 * An action dispatched after navigation has ended and new route is active.
 */
const ROUTER_NAVIGATED = '@ngrx/router-store/navigated';
const routerNavigatedAction = createAction(ROUTER_NAVIGATED, props());

function routerReducer(state, action) {
    // Allow compilation with strictFunctionTypes - ref: #1344
    const routerAction = action;
    switch (routerAction.type) {
        case ROUTER_NAVIGATION:
        case ROUTER_ERROR:
        case ROUTER_CANCEL:
            return {
                state: routerAction.payload.routerState,
                navigationId: routerAction.payload.event.id,
            };
        default:
            return state;
    }
}

class RouterStateSerializer {
}

class DefaultRouterStateSerializer {
    serialize(routerState) {
        return {
            root: this.serializeRoute(routerState.root),
            url: routerState.url,
        };
    }
    serializeRoute(route) {
        const children = route.children.map((c) => this.serializeRoute(c));
        return {
            params: route.params,
            paramMap: route.paramMap,
            data: route.data,
            url: route.url,
            outlet: route.outlet,
            routeConfig: route.routeConfig
                ? {
                    component: route.routeConfig.component,
                    path: route.routeConfig.path,
                    pathMatch: route.routeConfig.pathMatch,
                    redirectTo: route.routeConfig.redirectTo,
                    outlet: route.routeConfig.outlet,
                }
                : null,
            queryParams: route.queryParams,
            queryParamMap: route.queryParamMap,
            fragment: route.fragment,
            component: (route.routeConfig
                ? route.routeConfig.component
                : undefined),
            root: undefined,
            parent: undefined,
            firstChild: children[0],
            pathFromRoot: undefined,
            children,
        };
    }
}

class MinimalRouterStateSerializer {
    serialize(routerState) {
        return {
            root: this.serializeRoute(routerState.root),
            url: routerState.url,
        };
    }
    serializeRoute(route) {
        const children = route.children.map((c) => this.serializeRoute(c));
        return {
            params: route.params,
            data: route.data,
            url: route.url,
            outlet: route.outlet,
            routeConfig: route.routeConfig
                ? {
                    path: route.routeConfig.path,
                    pathMatch: route.routeConfig.pathMatch,
                    redirectTo: route.routeConfig.redirectTo,
                    outlet: route.routeConfig.outlet,
                }
                : null,
            queryParams: route.queryParams,
            fragment: route.fragment,
            firstChild: children[0],
            children,
        };
    }
}

var NavigationActionTiming;
(function (NavigationActionTiming) {
    NavigationActionTiming[NavigationActionTiming["PreActivation"] = 1] = "PreActivation";
    NavigationActionTiming[NavigationActionTiming["PostActivation"] = 2] = "PostActivation";
})(NavigationActionTiming || (NavigationActionTiming = {}));
const _ROUTER_CONFIG = new InjectionToken('@ngrx/router-store Internal Configuration');
const ROUTER_CONFIG = new InjectionToken('@ngrx/router-store Configuration');
const DEFAULT_ROUTER_FEATURENAME = 'router';
function _createRouterConfig(config) {
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
class StoreRouterConnectingModule {
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
/** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
StoreRouterConnectingModule.decorators = [
    { type: NgModule, args: [{},] }
];
/**
 * @type {function(): !Array<(null|{
 *   type: ?,
 *   decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>),
 * })>}
 * @nocollapse
 */
StoreRouterConnectingModule.ctorParameters = () => [
    { type: Store },
    { type: Router },
    { type: RouterStateSerializer },
    { type: ErrorHandler },
    { type: undefined, decorators: [{ type: Inject, args: [ROUTER_CONFIG,] }] },
    { type: undefined, decorators: [{ type: Inject, args: [ACTIVE_RUNTIME_CHECKS,] }] }
];
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

function createRouterSelector() {
    return createFeatureSelector(DEFAULT_ROUTER_FEATURENAME);
}
function getSelectors(selectState = createRouterSelector()) {
    const selectRouterState = createSelector(selectState, (router) => router && router.state);
    const selectRootRoute = createSelector(selectRouterState, (routerState) => routerState && routerState.root);
    const selectCurrentRoute = createSelector(selectRootRoute, (rootRoute) => {
        if (!rootRoute) {
            return undefined;
        }
        let route = rootRoute;
        while (route.firstChild) {
            route = route.firstChild;
        }
        return route;
    });
    const selectFragment = createSelector(selectRootRoute, (route) => route && route.fragment);
    const selectQueryParams = createSelector(selectRootRoute, (route) => route && route.queryParams);
    const selectQueryParam = (param) => createSelector(selectQueryParams, (params) => params && params[param]);
    const selectRouteParams = createSelector(selectCurrentRoute, (route) => route && route.params);
    const selectRouteParam = (param) => createSelector(selectRouteParams, (params) => params && params[param]);
    const selectRouteData = createSelector(selectCurrentRoute, (route) => route && route.data);
    const selectUrl = createSelector(selectRouterState, (routerState) => routerState && routerState.url);
    return {
        selectCurrentRoute,
        selectFragment,
        selectQueryParams,
        selectQueryParam,
        selectRouteParams,
        selectRouteParam,
        selectRouteData,
        selectUrl,
    };
}

/**
 * DO NOT EDIT
 *
 * This file is automatically generated at build
 */

/**
 * Generated bundle index. Do not edit.
 */

export { DEFAULT_ROUTER_FEATURENAME, DefaultRouterStateSerializer, MinimalRouterStateSerializer, NavigationActionTiming, ROUTER_CANCEL, ROUTER_CONFIG, ROUTER_ERROR, ROUTER_NAVIGATED, ROUTER_NAVIGATION, ROUTER_REQUEST, RouterStateSerializer, StoreRouterConnectingModule, createRouterSelector, getSelectors, routerCancelAction, routerErrorAction, routerNavigatedAction, routerNavigationAction, routerReducer, routerRequestAction, _ROUTER_CONFIG as ɵa, _createRouterConfig as ɵb };
//# sourceMappingURL=ngrx-router-store.js.map
