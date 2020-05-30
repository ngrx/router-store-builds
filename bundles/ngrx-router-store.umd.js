(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@ngrx/store'), require('@angular/core'), require('@angular/router'), require('rxjs/operators')) :
    typeof define === 'function' && define.amd ? define('@ngrx/router-store', ['exports', '@ngrx/store', '@angular/core', '@angular/router', 'rxjs/operators'], factory) :
    (global = global || self, factory((global.ngrx = global.ngrx || {}, global.ngrx['router-store'] = {}), global.store, global.ng.core, global.ng.router, global.rxjs.operators));
}(this, (function (exports, store, core, router, operators) { 'use strict';

    /**
     * @fileoverview added by tsickle
     * Generated from: src/actions.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * An action dispatched when a router navigation request is fired.
     * @type {?}
     */
    var ROUTER_REQUEST = '@ngrx/router-store/request';
    /** @type {?} */
    var routerRequestAction = store.createAction(ROUTER_REQUEST, store.props());
    /**
     * An action dispatched when the router navigates.
     * @type {?}
     */
    var ROUTER_NAVIGATION = '@ngrx/router-store/navigation';
    /** @type {?} */
    var routerNavigationAction = store.createAction(ROUTER_NAVIGATION, store.props());
    /**
     * An action dispatched when the router cancels navigation.
     * @type {?}
     */
    var ROUTER_CANCEL = '@ngrx/router-store/cancel';
    /** @type {?} */
    var routerCancelAction = store.createAction(ROUTER_CANCEL, store.props());
    /**
     * An action dispatched when the router errors.
     * @type {?}
     */
    var ROUTER_ERROR = '@ngrx/router-store/error';
    /** @type {?} */
    var routerErrorAction = store.createAction(ROUTER_ERROR, store.props());
    /**
     * An action dispatched after navigation has ended and new route is active.
     * @type {?}
     */
    var ROUTER_NAVIGATED = '@ngrx/router-store/navigated';
    /** @type {?} */
    var routerNavigatedAction = store.createAction(ROUTER_NAVIGATED, store.props());

    /**
     * @fileoverview added by tsickle
     * Generated from: src/reducer.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * @template T
     * @param {?} state
     * @param {?} action
     * @return {?}
     */
    function routerReducer(state, action) {
        // Allow compilation with strictFunctionTypes - ref: #1344
        /** @type {?} */
        var routerAction = (/** @type {?} */ (action));
        switch (routerAction.type) {
            case ROUTER_NAVIGATION:
            case ROUTER_ERROR:
            case ROUTER_CANCEL:
                return {
                    state: routerAction.payload.routerState,
                    navigationId: routerAction.payload.event.id,
                };
            default:
                return (/** @type {?} */ (state));
        }
    }

    /**
     * @fileoverview added by tsickle
     * Generated from: src/serializers/base.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * Simple router state.
     * All custom router states / state serializers should have at least
     * the properties of this interface.
     * @record
     */
    function BaseRouterStoreState() { }
    if (false) {
        /** @type {?} */
        BaseRouterStoreState.prototype.url;
    }
    /**
     * @abstract
     * @template T
     */
    var   /**
     * @abstract
     * @template T
     */
    RouterStateSerializer = /** @class */ (function () {
        function RouterStateSerializer() {
        }
        return RouterStateSerializer;
    }());
    if (false) {
        /**
         * @abstract
         * @param {?} routerState
         * @return {?}
         */
        RouterStateSerializer.prototype.serialize = function (routerState) { };
    }

    /**
     * @fileoverview added by tsickle
     * Generated from: src/serializers/default_serializer.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * @record
     */
    function SerializedRouterStateSnapshot() { }
    if (false) {
        /** @type {?} */
        SerializedRouterStateSnapshot.prototype.root;
        /** @type {?} */
        SerializedRouterStateSnapshot.prototype.url;
    }
    var DefaultRouterStateSerializer = /** @class */ (function () {
        function DefaultRouterStateSerializer() {
        }
        /**
         * @param {?} routerState
         * @return {?}
         */
        DefaultRouterStateSerializer.prototype.serialize = /**
         * @param {?} routerState
         * @return {?}
         */
        function (routerState) {
            return {
                root: this.serializeRoute(routerState.root),
                url: routerState.url,
            };
        };
        /**
         * @private
         * @param {?} route
         * @return {?}
         */
        DefaultRouterStateSerializer.prototype.serializeRoute = /**
         * @private
         * @param {?} route
         * @return {?}
         */
        function (route) {
            var _this = this;
            /** @type {?} */
            var children = route.children.map((/**
             * @param {?} c
             * @return {?}
             */
            function (c) { return _this.serializeRoute(c); }));
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
                component: (/** @type {?} */ ((route.routeConfig
                    ? route.routeConfig.component
                    : undefined))),
                root: (/** @type {?} */ (undefined)),
                parent: (/** @type {?} */ (undefined)),
                firstChild: children[0],
                pathFromRoot: (/** @type {?} */ (undefined)),
                children: children,
            };
        };
        return DefaultRouterStateSerializer;
    }());

    /**
     * @fileoverview added by tsickle
     * Generated from: src/serializers/minimal_serializer.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * @record
     */
    function MinimalActivatedRouteSnapshot() { }
    if (false) {
        /** @type {?} */
        MinimalActivatedRouteSnapshot.prototype.routeConfig;
        /** @type {?} */
        MinimalActivatedRouteSnapshot.prototype.url;
        /** @type {?} */
        MinimalActivatedRouteSnapshot.prototype.params;
        /** @type {?} */
        MinimalActivatedRouteSnapshot.prototype.queryParams;
        /** @type {?} */
        MinimalActivatedRouteSnapshot.prototype.fragment;
        /** @type {?} */
        MinimalActivatedRouteSnapshot.prototype.data;
        /** @type {?} */
        MinimalActivatedRouteSnapshot.prototype.outlet;
        /** @type {?|undefined} */
        MinimalActivatedRouteSnapshot.prototype.firstChild;
        /** @type {?} */
        MinimalActivatedRouteSnapshot.prototype.children;
    }
    /**
     * @record
     */
    function MinimalRouterStateSnapshot() { }
    if (false) {
        /** @type {?} */
        MinimalRouterStateSnapshot.prototype.root;
        /** @type {?} */
        MinimalRouterStateSnapshot.prototype.url;
    }
    var MinimalRouterStateSerializer = /** @class */ (function () {
        function MinimalRouterStateSerializer() {
        }
        /**
         * @param {?} routerState
         * @return {?}
         */
        MinimalRouterStateSerializer.prototype.serialize = /**
         * @param {?} routerState
         * @return {?}
         */
        function (routerState) {
            return {
                root: this.serializeRoute(routerState.root),
                url: routerState.url,
            };
        };
        /**
         * @private
         * @param {?} route
         * @return {?}
         */
        MinimalRouterStateSerializer.prototype.serializeRoute = /**
         * @private
         * @param {?} route
         * @return {?}
         */
        function (route) {
            var _this = this;
            /** @type {?} */
            var children = route.children.map((/**
             * @param {?} c
             * @return {?}
             */
            function (c) { return _this.serializeRoute(c); }));
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
                children: children,
            };
        };
        return MinimalRouterStateSerializer;
    }());

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
    /** @enum {number} */
    var RouterState = {
        Full: 0,
        Minimal: 1,
    };
    /**
     * @record
     * @template T
     */
    function StoreRouterConfig() { }
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
    var NavigationActionTiming = {
        PreActivation: 1,
        PostActivation: 2,
    };
    NavigationActionTiming[NavigationActionTiming.PreActivation] = 'PreActivation';
    NavigationActionTiming[NavigationActionTiming.PostActivation] = 'PostActivation';
    /** @type {?} */
    var _ROUTER_CONFIG = new core.InjectionToken('@ngrx/router-store Internal Configuration');
    /** @type {?} */
    var ROUTER_CONFIG = new core.InjectionToken('@ngrx/router-store Configuration');
    /** @type {?} */
    var DEFAULT_ROUTER_FEATURENAME = 'router';
    /**
     * @param {?} config
     * @return {?}
     */
    function _createRouterConfig(config) {
        return __assign({ stateKey: DEFAULT_ROUTER_FEATURENAME, serializer: MinimalRouterStateSerializer, navigationActionTiming: NavigationActionTiming.PreActivation }, config);
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
    var StoreRouterConnectingModule = /** @class */ (function () {
        function StoreRouterConnectingModule(store, router, serializer, errorHandler, config) {
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
        StoreRouterConnectingModule.forRoot = /**
         * @template T
         * @param {?=} config
         * @return {?}
         */
        function (config) {
            if (config === void 0) { config = {}; }
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
        };
        /**
         * @private
         * @return {?}
         */
        StoreRouterConnectingModule.prototype.setUpStoreStateListener = /**
         * @private
         * @return {?}
         */
        function () {
            var _this = this;
            this.store
                .pipe(store.select((/** @type {?} */ (this.stateKey))), operators.withLatestFrom(this.store))
                .subscribe((/**
             * @param {?} __0
             * @return {?}
             */
            function (_a) {
                var _b = __read(_a, 2), routerStoreState = _b[0], storeState = _b[1];
                _this.navigateIfNeeded(routerStoreState, storeState);
            }));
        };
        /**
         * @private
         * @param {?} routerStoreState
         * @param {?} storeState
         * @return {?}
         */
        StoreRouterConnectingModule.prototype.navigateIfNeeded = /**
         * @private
         * @param {?} routerStoreState
         * @param {?} storeState
         * @return {?}
         */
        function (routerStoreState, storeState) {
            var _this = this;
            if (!routerStoreState || !routerStoreState.state) {
                return;
            }
            if (this.trigger === RouterTrigger.ROUTER) {
                return;
            }
            if (this.lastEvent instanceof router.NavigationStart) {
                return;
            }
            /** @type {?} */
            var url = routerStoreState.state.url;
            if (this.router.url !== url) {
                this.storeState = storeState;
                this.trigger = RouterTrigger.STORE;
                this.router.navigateByUrl(url).catch((/**
                 * @param {?} error
                 * @return {?}
                 */
                function (error) {
                    _this.errorHandler.handleError(error);
                }));
            }
        };
        /**
         * @private
         * @return {?}
         */
        StoreRouterConnectingModule.prototype.setUpRouterEventsListener = /**
         * @private
         * @return {?}
         */
        function () {
            var _this = this;
            /** @type {?} */
            var dispatchNavLate = this.config.navigationActionTiming ===
                NavigationActionTiming.PostActivation;
            /** @type {?} */
            var routesRecognized;
            this.router.events
                .pipe(operators.withLatestFrom(this.store))
                .subscribe((/**
             * @param {?} __0
             * @return {?}
             */
            function (_a) {
                var _b = __read(_a, 2), event = _b[0], storeState = _b[1];
                _this.lastEvent = event;
                if (event instanceof router.NavigationStart) {
                    _this.routerState = _this.serializer.serialize(_this.router.routerState.snapshot);
                    if (_this.trigger !== RouterTrigger.STORE) {
                        _this.storeState = storeState;
                        _this.dispatchRouterRequest(event);
                    }
                }
                else if (event instanceof router.RoutesRecognized) {
                    routesRecognized = event;
                    if (!dispatchNavLate && _this.trigger !== RouterTrigger.STORE) {
                        _this.dispatchRouterNavigation(event);
                    }
                }
                else if (event instanceof router.NavigationCancel) {
                    _this.dispatchRouterCancel(event);
                    _this.reset();
                }
                else if (event instanceof router.NavigationError) {
                    _this.dispatchRouterError(event);
                    _this.reset();
                }
                else if (event instanceof router.NavigationEnd) {
                    if (_this.trigger !== RouterTrigger.STORE) {
                        if (dispatchNavLate) {
                            _this.dispatchRouterNavigation(routesRecognized);
                        }
                        _this.dispatchRouterNavigated(event);
                    }
                    _this.reset();
                }
            }));
        };
        /**
         * @private
         * @param {?} event
         * @return {?}
         */
        StoreRouterConnectingModule.prototype.dispatchRouterRequest = /**
         * @private
         * @param {?} event
         * @return {?}
         */
        function (event) {
            this.dispatchRouterAction(ROUTER_REQUEST, { event: event });
        };
        /**
         * @private
         * @param {?} lastRoutesRecognized
         * @return {?}
         */
        StoreRouterConnectingModule.prototype.dispatchRouterNavigation = /**
         * @private
         * @param {?} lastRoutesRecognized
         * @return {?}
         */
        function (lastRoutesRecognized) {
            /** @type {?} */
            var nextRouterState = this.serializer.serialize(lastRoutesRecognized.state);
            this.dispatchRouterAction(ROUTER_NAVIGATION, {
                routerState: nextRouterState,
                event: new router.RoutesRecognized(lastRoutesRecognized.id, lastRoutesRecognized.url, lastRoutesRecognized.urlAfterRedirects, nextRouterState),
            });
        };
        /**
         * @private
         * @param {?} event
         * @return {?}
         */
        StoreRouterConnectingModule.prototype.dispatchRouterCancel = /**
         * @private
         * @param {?} event
         * @return {?}
         */
        function (event) {
            this.dispatchRouterAction(ROUTER_CANCEL, {
                storeState: this.storeState,
                event: event,
            });
        };
        /**
         * @private
         * @param {?} event
         * @return {?}
         */
        StoreRouterConnectingModule.prototype.dispatchRouterError = /**
         * @private
         * @param {?} event
         * @return {?}
         */
        function (event) {
            this.dispatchRouterAction(ROUTER_ERROR, {
                storeState: this.storeState,
                event: new router.NavigationError(event.id, event.url, "" + event),
            });
        };
        /**
         * @private
         * @param {?} event
         * @return {?}
         */
        StoreRouterConnectingModule.prototype.dispatchRouterNavigated = /**
         * @private
         * @param {?} event
         * @return {?}
         */
        function (event) {
            /** @type {?} */
            var routerState = this.serializer.serialize(this.router.routerState.snapshot);
            this.dispatchRouterAction(ROUTER_NAVIGATED, { event: event, routerState: routerState });
        };
        /**
         * @private
         * @param {?} type
         * @param {?} payload
         * @return {?}
         */
        StoreRouterConnectingModule.prototype.dispatchRouterAction = /**
         * @private
         * @param {?} type
         * @param {?} payload
         * @return {?}
         */
        function (type, payload) {
            this.trigger = RouterTrigger.ROUTER;
            try {
                this.store.dispatch({
                    type: type,
                    payload: __assign(__assign({ routerState: this.routerState }, payload), { event: this.config.routerState === 0 /* Full */
                            ? payload.event
                            : { id: payload.event.id, url: payload.event.url } }),
                });
            }
            finally {
                this.trigger = RouterTrigger.NONE;
            }
        };
        /**
         * @private
         * @return {?}
         */
        StoreRouterConnectingModule.prototype.reset = /**
         * @private
         * @return {?}
         */
        function () {
            this.trigger = RouterTrigger.NONE;
            this.storeState = null;
            this.routerState = null;
        };
        StoreRouterConnectingModule.decorators = [
            { type: core.NgModule, args: [{},] },
        ];
        /** @nocollapse */
        StoreRouterConnectingModule.ctorParameters = function () { return [
            { type: store.Store },
            { type: router.Router },
            { type: RouterStateSerializer },
            { type: core.ErrorHandler },
            { type: undefined, decorators: [{ type: core.Inject, args: [ROUTER_CONFIG,] }] }
        ]; };
        return StoreRouterConnectingModule;
    }());
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

    /**
     * @fileoverview added by tsickle
     * Generated from: src/router_selectors.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * @template V
     * @param {?} selectState
     * @return {?}
     */
    function getSelectors(selectState) {
        /** @type {?} */
        var selectRouterState = store.createSelector(selectState, (/**
         * @param {?} router
         * @return {?}
         */
        function (router) { return router && router.state; }));
        /** @type {?} */
        var selectCurrentRoute = store.createSelector(selectRouterState, (/**
         * @param {?} routerState
         * @return {?}
         */
        function (routerState) {
            if (!routerState) {
                return undefined;
            }
            /** @type {?} */
            var route = routerState.root;
            while (route.firstChild) {
                route = route.firstChild;
            }
            return route;
        }));
        /** @type {?} */
        var selectFragment = store.createSelector(selectCurrentRoute, (/**
         * @param {?} route
         * @return {?}
         */
        function (route) { return route && route.fragment; }));
        /** @type {?} */
        var selectQueryParams = store.createSelector(selectCurrentRoute, (/**
         * @param {?} route
         * @return {?}
         */
        function (route) { return route && route.queryParams; }));
        /** @type {?} */
        var selectQueryParam = (/**
         * @param {?} param
         * @return {?}
         */
        function (param) {
            return store.createSelector(selectQueryParams, (/**
             * @param {?} params
             * @return {?}
             */
            function (params) { return params && params[param]; }));
        });
        /** @type {?} */
        var selectRouteParams = store.createSelector(selectCurrentRoute, (/**
         * @param {?} route
         * @return {?}
         */
        function (route) { return route && route.params; }));
        /** @type {?} */
        var selectRouteParam = (/**
         * @param {?} param
         * @return {?}
         */
        function (param) {
            return store.createSelector(selectRouteParams, (/**
             * @param {?} params
             * @return {?}
             */
            function (params) { return params && params[param]; }));
        });
        /** @type {?} */
        var selectRouteData = store.createSelector(selectCurrentRoute, (/**
         * @param {?} route
         * @return {?}
         */
        function (route) { return route && route.data; }));
        /** @type {?} */
        var selectUrl = store.createSelector(selectRouterState, (/**
         * @param {?} routerState
         * @return {?}
         */
        function (routerState) { return routerState && routerState.url; }));
        return {
            selectCurrentRoute: selectCurrentRoute,
            selectFragment: selectFragment,
            selectQueryParams: selectQueryParams,
            selectQueryParam: selectQueryParam,
            selectRouteParams: selectRouteParams,
            selectRouteParam: selectRouteParam,
            selectRouteData: selectRouteData,
            selectUrl: selectUrl,
        };
    }

    exports.DEFAULT_ROUTER_FEATURENAME = DEFAULT_ROUTER_FEATURENAME;
    exports.DefaultRouterStateSerializer = DefaultRouterStateSerializer;
    exports.MinimalRouterStateSerializer = MinimalRouterStateSerializer;
    exports.NavigationActionTiming = NavigationActionTiming;
    exports.ROUTER_CANCEL = ROUTER_CANCEL;
    exports.ROUTER_CONFIG = ROUTER_CONFIG;
    exports.ROUTER_ERROR = ROUTER_ERROR;
    exports.ROUTER_NAVIGATED = ROUTER_NAVIGATED;
    exports.ROUTER_NAVIGATION = ROUTER_NAVIGATION;
    exports.ROUTER_REQUEST = ROUTER_REQUEST;
    exports.RouterStateSerializer = RouterStateSerializer;
    exports.StoreRouterConnectingModule = StoreRouterConnectingModule;
    exports.getSelectors = getSelectors;
    exports.routerCancelAction = routerCancelAction;
    exports.routerErrorAction = routerErrorAction;
    exports.routerNavigatedAction = routerNavigatedAction;
    exports.routerNavigationAction = routerNavigationAction;
    exports.routerReducer = routerReducer;
    exports.routerRequestAction = routerRequestAction;
    exports.ɵa = _ROUTER_CONFIG;
    exports.ɵb = _createRouterConfig;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ngrx-router-store.umd.js.map
