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
        var routerAction = ( /** @type {?} */(action));
        switch (routerAction.type) {
            case ROUTER_NAVIGATION:
            case ROUTER_ERROR:
            case ROUTER_CANCEL:
                return {
                    state: routerAction.payload.routerState,
                    navigationId: routerAction.payload.event.id,
                };
            default:
                return ( /** @type {?} */(state));
        }
    }

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b)
                if (b.hasOwnProperty(p))
                    d[p] = b[p]; };
        return extendStatics(d, b);
    };
    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var __assign = function () {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s)
                    if (Object.prototype.hasOwnProperty.call(s, p))
                        t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    function __rest(s, e) {
        var t = {};
        for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
                t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }
    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if (d = decorators[i])
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }
    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); };
    }
    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
            return Reflect.metadata(metadataKey, metadataValue);
    }
    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try {
                step(generator.next(value));
            }
            catch (e) {
                reject(e);
            } }
            function rejected(value) { try {
                step(generator["throw"](value));
            }
            catch (e) {
                reject(e);
            } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }
    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function () { if (t[0] & 1)
                throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f)
                throw new TypeError("Generator is already executing.");
            while (_)
                try {
                    if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                        return t;
                    if (y = 0, t)
                        op = [op[0] & 2, t.value];
                    switch (op[0]) {
                        case 0:
                        case 1:
                            t = op;
                            break;
                        case 4:
                            _.label++;
                            return { value: op[1], done: false };
                        case 5:
                            _.label++;
                            y = op[1];
                            op = [0];
                            continue;
                        case 7:
                            op = _.ops.pop();
                            _.trys.pop();
                            continue;
                        default:
                            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                                _ = 0;
                                continue;
                            }
                            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                                _.label = op[1];
                                break;
                            }
                            if (op[0] === 6 && _.label < t[1]) {
                                _.label = t[1];
                                t = op;
                                break;
                            }
                            if (t && _.label < t[2]) {
                                _.label = t[2];
                                _.ops.push(op);
                                break;
                            }
                            if (t[2])
                                _.ops.pop();
                            _.trys.pop();
                            continue;
                    }
                    op = body.call(thisArg, _);
                }
                catch (e) {
                    op = [6, e];
                    y = 0;
                }
                finally {
                    f = t = 0;
                }
            if (op[0] & 5)
                throw op[1];
            return { value: op[0] ? op[1] : void 0, done: true };
        }
    }
    var __createBinding = Object.create ? (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function () { return m[k]; } });
    }) : (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        o[k2] = m[k];
    });
    function __exportStar(m, exports) {
        for (var p in m)
            if (p !== "default" && !exports.hasOwnProperty(p))
                __createBinding(exports, m, p);
    }
    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m)
            return m.call(o);
        if (o && typeof o.length === "number")
            return {
                next: function () {
                    if (o && i >= o.length)
                        o = void 0;
                    return { value: o && o[i++], done: !o };
                }
            };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }
    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m)
            return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                ar.push(r.value);
        }
        catch (error) {
            e = { error: error };
        }
        finally {
            try {
                if (r && !r.done && (m = i["return"]))
                    m.call(i);
            }
            finally {
                if (e)
                    throw e.error;
            }
        }
        return ar;
    }
    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }
    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++)
            s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    }
    ;
    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }
    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n])
            i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try {
            step(g[n](v));
        }
        catch (e) {
            settle(q[0][3], e);
        } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length)
            resume(q[0][0], q[0][1]); }
    }
    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }
    function __asyncValues(o) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function (v) { resolve({ value: v, done: d }); }, reject); }
    }
    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        }
        else {
            cooked.raw = raw;
        }
        return cooked;
    }
    ;
    var __setModuleDefault = Object.create ? (function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function (o, v) {
        o["default"] = v;
    };
    function __importStar(mod) {
        if (mod && mod.__esModule)
            return mod;
        var result = {};
        if (mod != null)
            for (var k in mod)
                if (Object.hasOwnProperty.call(mod, k))
                    __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    }
    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }
    function __classPrivateFieldGet(receiver, privateMap) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to get private field on non-instance");
        }
        return privateMap.get(receiver);
    }
    function __classPrivateFieldSet(receiver, privateMap, value) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to set private field on non-instance");
        }
        privateMap.set(receiver, value);
        return value;
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
    var RouterStateSerializer = /** @class */ (function () {
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
        DefaultRouterStateSerializer.prototype.serialize = function (routerState) {
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
        DefaultRouterStateSerializer.prototype.serializeRoute = function (route) {
            var _this = this;
            /** @type {?} */
            var children = route.children.map(( /**
             * @param {?} c
             * @return {?}
             */function (c) { return _this.serializeRoute(c); }));
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
                component: ( /** @type {?} */((route.routeConfig
                    ? route.routeConfig.component
                    : undefined))),
                root: ( /** @type {?} */(undefined)),
                parent: ( /** @type {?} */(undefined)),
                firstChild: children[0],
                pathFromRoot: ( /** @type {?} */(undefined)),
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
        MinimalRouterStateSerializer.prototype.serialize = function (routerState) {
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
        MinimalRouterStateSerializer.prototype.serializeRoute = function (route) {
            var _this = this;
            /** @type {?} */
            var children = route.children.map(( /**
             * @param {?} c
             * @return {?}
             */function (c) { return _this.serializeRoute(c); }));
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
        return Object.assign({ stateKey: DEFAULT_ROUTER_FEATURENAME, serializer: MinimalRouterStateSerializer, navigationActionTiming: NavigationActionTiming.PreActivation }, config);
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
        /**
         * @param {?} store
         * @param {?} router
         * @param {?} serializer
         * @param {?} errorHandler
         * @param {?} config
         */
        function StoreRouterConnectingModule(store, router, serializer, errorHandler, config) {
            this.store = store;
            this.router = router;
            this.serializer = serializer;
            this.errorHandler = errorHandler;
            this.config = config;
            this.lastEvent = null;
            this.routerState = null;
            this.trigger = RouterTrigger.NONE;
            this.stateKey = ( /** @type {?} */(this.config.stateKey));
            this.setUpStoreStateListener();
            this.setUpRouterEventsListener();
        }
        /**
         * @template T
         * @param {?=} config
         * @return {?}
         */
        StoreRouterConnectingModule.forRoot = function (config) {
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
        StoreRouterConnectingModule.prototype.setUpStoreStateListener = function () {
            var _this = this;
            this.store
                .pipe(store.select(( /** @type {?} */(this.stateKey))), operators.withLatestFrom(this.store))
                .subscribe(( /**
         * @param {?} __0
         * @return {?}
         */function (_a) {
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
        StoreRouterConnectingModule.prototype.navigateIfNeeded = function (routerStoreState, storeState) {
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
                this.router.navigateByUrl(url).catch(( /**
                 * @param {?} error
                 * @return {?}
                 */function (error) {
                    _this.errorHandler.handleError(error);
                }));
            }
        };
        /**
         * @private
         * @return {?}
         */
        StoreRouterConnectingModule.prototype.setUpRouterEventsListener = function () {
            var _this = this;
            /** @type {?} */
            var dispatchNavLate = this.config.navigationActionTiming ===
                NavigationActionTiming.PostActivation;
            /** @type {?} */
            var routesRecognized;
            this.router.events
                .pipe(operators.withLatestFrom(this.store))
                .subscribe(( /**
         * @param {?} __0
         * @return {?}
         */function (_a) {
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
        StoreRouterConnectingModule.prototype.dispatchRouterRequest = function (event) {
            this.dispatchRouterAction(ROUTER_REQUEST, { event: event });
        };
        /**
         * @private
         * @param {?} lastRoutesRecognized
         * @return {?}
         */
        StoreRouterConnectingModule.prototype.dispatchRouterNavigation = function (lastRoutesRecognized) {
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
        StoreRouterConnectingModule.prototype.dispatchRouterCancel = function (event) {
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
        StoreRouterConnectingModule.prototype.dispatchRouterError = function (event) {
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
        StoreRouterConnectingModule.prototype.dispatchRouterNavigated = function (event) {
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
        StoreRouterConnectingModule.prototype.dispatchRouterAction = function (type, payload) {
            this.trigger = RouterTrigger.ROUTER;
            try {
                this.store.dispatch({
                    type: type,
                    payload: Object.assign(Object.assign({ routerState: this.routerState }, payload), { event: this.config.routerState === 0 /* Full */
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
        StoreRouterConnectingModule.prototype.reset = function () {
            this.trigger = RouterTrigger.NONE;
            this.storeState = null;
            this.routerState = null;
        };
        return StoreRouterConnectingModule;
    }());
    StoreRouterConnectingModule.decorators = [
        { type: core.NgModule, args: [{},] }
    ];
    /** @nocollapse */
    StoreRouterConnectingModule.ctorParameters = function () { return [
        { type: store.Store },
        { type: router.Router },
        { type: RouterStateSerializer },
        { type: core.ErrorHandler },
        { type: undefined, decorators: [{ type: core.Inject, args: [ROUTER_CONFIG,] }] }
    ]; };
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
        var selectRouterState = store.createSelector(selectState, ( /**
         * @param {?} router
         * @return {?}
         */function (router) { return router && router.state; }));
        /** @type {?} */
        var selectCurrentRoute = store.createSelector(selectRouterState, ( /**
         * @param {?} routerState
         * @return {?}
         */function (routerState) {
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
        var selectFragment = store.createSelector(selectCurrentRoute, ( /**
         * @param {?} route
         * @return {?}
         */function (route) { return route && route.fragment; }));
        /** @type {?} */
        var selectQueryParams = store.createSelector(selectCurrentRoute, ( /**
         * @param {?} route
         * @return {?}
         */function (route) { return route && route.queryParams; }));
        /** @type {?} */
        var selectQueryParam = ( /**
         * @param {?} param
         * @return {?}
         */function (param) { return store.createSelector(selectQueryParams, ( /**
         * @param {?} params
         * @return {?}
         */function (params) { return params && params[param]; })); });
        /** @type {?} */
        var selectRouteParams = store.createSelector(selectCurrentRoute, ( /**
         * @param {?} route
         * @return {?}
         */function (route) { return route && route.params; }));
        /** @type {?} */
        var selectRouteParam = ( /**
         * @param {?} param
         * @return {?}
         */function (param) { return store.createSelector(selectRouteParams, ( /**
         * @param {?} params
         * @return {?}
         */function (params) { return params && params[param]; })); });
        /** @type {?} */
        var selectRouteData = store.createSelector(selectCurrentRoute, ( /**
         * @param {?} route
         * @return {?}
         */function (route) { return route && route.data; }));
        /** @type {?} */
        var selectUrl = store.createSelector(selectRouterState, ( /**
         * @param {?} routerState
         * @return {?}
         */function (routerState) { return routerState && routerState.url; }));
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

    /**
     * @fileoverview added by tsickle
     * Generated from: src/index.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */

    /**
     * @fileoverview added by tsickle
     * Generated from: public_api.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */

    /**
     * @fileoverview added by tsickle
     * Generated from: index.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */

    /**
     * @fileoverview added by tsickle
     * Generated from: ngrx-router-store.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */

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
