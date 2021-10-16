(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@ngrx/store'), require('@angular/core'), require('@angular/router'), require('rxjs/operators')) :
    typeof define === 'function' && define.amd ? define('@ngrx/router-store', ['exports', '@ngrx/store', '@angular/core', '@angular/router', 'rxjs/operators'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global.ngrx = global.ngrx || {}, global.ngrx['router-store'] = {}), global.ngrx.store, global.ng.core, global.ng.router, global.rxjs.operators));
}(this, (function (exports, store, core, router, operators) { 'use strict';

    /**
     * An action dispatched when a router navigation request is fired.
     */
    var ROUTER_REQUEST = '@ngrx/router-store/request';
    var routerRequestAction = store.createAction(ROUTER_REQUEST, store.props());
    /**
     * An action dispatched when the router navigates.
     */
    var ROUTER_NAVIGATION = '@ngrx/router-store/navigation';
    var routerNavigationAction = store.createAction(ROUTER_NAVIGATION, store.props());
    /**
     * An action dispatched when the router cancels navigation.
     */
    var ROUTER_CANCEL = '@ngrx/router-store/cancel';
    var routerCancelAction = store.createAction(ROUTER_CANCEL, store.props());
    /**
     * An action dispatched when the router errors.
     */
    var ROUTER_ERROR = '@ngrx/router-store/error';
    var routerErrorAction = store.createAction(ROUTER_ERROR, store.props());
    /**
     * An action dispatched after navigation has ended and new route is active.
     */
    var ROUTER_NAVIGATED = '@ngrx/router-store/navigated';
    var routerNavigatedAction = store.createAction(ROUTER_NAVIGATED, store.props());

    function routerReducer(state, action) {
        // Allow compilation with strictFunctionTypes - ref: #1344
        var routerAction = action;
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
                if (Object.prototype.hasOwnProperty.call(b, p))
                    d[p] = b[p]; };
        return extendStatics(d, b);
    };
    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
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
    function __exportStar(m, o) {
        for (var p in m)
            if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p))
                __createBinding(o, m, p);
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
    /** @deprecated */
    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }
    /** @deprecated */
    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++)
            s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    }
    function __spreadArray(to, from) {
        for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
            to[j] = from[i];
        return to;
    }
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
                if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
                    __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    }
    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }
    function __classPrivateFieldGet(receiver, state, kind, f) {
        if (kind === "a" && !f)
            throw new TypeError("Private accessor was defined without a getter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
            throw new TypeError("Cannot read private member from an object whose class did not declare it");
        return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    }
    function __classPrivateFieldSet(receiver, state, value, kind, f) {
        if (kind === "m")
            throw new TypeError("Private method is not writable");
        if (kind === "a" && !f)
            throw new TypeError("Private accessor was defined without a setter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
            throw new TypeError("Cannot write private member to an object whose class did not declare it");
        return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
    }

    var RouterStateSerializer = /** @class */ (function () {
        function RouterStateSerializer() {
        }
        return RouterStateSerializer;
    }());

    var DefaultRouterStateSerializer = /** @class */ (function () {
        function DefaultRouterStateSerializer() {
        }
        DefaultRouterStateSerializer.prototype.serialize = function (routerState) {
            return {
                root: this.serializeRoute(routerState.root),
                url: routerState.url,
            };
        };
        DefaultRouterStateSerializer.prototype.serializeRoute = function (route) {
            var _this = this;
            var children = route.children.map(function (c) { return _this.serializeRoute(c); });
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
                children: children,
            };
        };
        return DefaultRouterStateSerializer;
    }());

    var MinimalRouterStateSerializer = /** @class */ (function () {
        function MinimalRouterStateSerializer() {
        }
        MinimalRouterStateSerializer.prototype.serialize = function (routerState) {
            return {
                root: this.serializeRoute(routerState.root),
                url: routerState.url,
            };
        };
        MinimalRouterStateSerializer.prototype.serializeRoute = function (route) {
            var _this = this;
            var children = route.children.map(function (c) { return _this.serializeRoute(c); });
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

    exports.NavigationActionTiming = void 0;
    (function (NavigationActionTiming) {
        NavigationActionTiming[NavigationActionTiming["PreActivation"] = 1] = "PreActivation";
        NavigationActionTiming[NavigationActionTiming["PostActivation"] = 2] = "PostActivation";
    })(exports.NavigationActionTiming || (exports.NavigationActionTiming = {}));
    var _ROUTER_CONFIG = new core.InjectionToken('@ngrx/router-store Internal Configuration');
    var ROUTER_CONFIG = new core.InjectionToken('@ngrx/router-store Configuration');
    var DEFAULT_ROUTER_FEATURENAME = 'router';
    function _createRouterConfig(config) {
        return Object.assign({ stateKey: DEFAULT_ROUTER_FEATURENAME, serializer: MinimalRouterStateSerializer, navigationActionTiming: exports.NavigationActionTiming.PreActivation }, config);
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
    var StoreRouterConnectingModule = /** @class */ (function () {
        function StoreRouterConnectingModule(store$1, router, serializer, errorHandler, config, activeRuntimeChecks) {
            this.store = store$1;
            this.router = router;
            this.serializer = serializer;
            this.errorHandler = errorHandler;
            this.config = config;
            this.activeRuntimeChecks = activeRuntimeChecks;
            this.lastEvent = null;
            this.routerState = null;
            this.trigger = RouterTrigger.NONE;
            this.stateKey = this.config.stateKey;
            if (!store.isNgrxMockEnvironment() &&
                core.isDevMode() &&
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
        StoreRouterConnectingModule.prototype.setUpStoreStateListener = function () {
            var _this = this;
            this.store
                .pipe(store.select(this.stateKey), operators.withLatestFrom(this.store))
                .subscribe(function (_a) {
                var _b = __read(_a, 2), routerStoreState = _b[0], storeState = _b[1];
                _this.navigateIfNeeded(routerStoreState, storeState);
            });
        };
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
            var url = routerStoreState.state.url;
            if (!isSameUrl(this.router.url, url)) {
                this.storeState = storeState;
                this.trigger = RouterTrigger.STORE;
                this.router.navigateByUrl(url).catch(function (error) {
                    _this.errorHandler.handleError(error);
                });
            }
        };
        StoreRouterConnectingModule.prototype.setUpRouterEventsListener = function () {
            var _this = this;
            var dispatchNavLate = this.config.navigationActionTiming ===
                exports.NavigationActionTiming.PostActivation;
            var routesRecognized;
            this.router.events
                .pipe(operators.withLatestFrom(this.store))
                .subscribe(function (_a) {
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
            });
        };
        StoreRouterConnectingModule.prototype.dispatchRouterRequest = function (event) {
            this.dispatchRouterAction(ROUTER_REQUEST, { event: event });
        };
        StoreRouterConnectingModule.prototype.dispatchRouterNavigation = function (lastRoutesRecognized) {
            var nextRouterState = this.serializer.serialize(lastRoutesRecognized.state);
            this.dispatchRouterAction(ROUTER_NAVIGATION, {
                routerState: nextRouterState,
                event: new router.RoutesRecognized(lastRoutesRecognized.id, lastRoutesRecognized.url, lastRoutesRecognized.urlAfterRedirects, nextRouterState),
            });
        };
        StoreRouterConnectingModule.prototype.dispatchRouterCancel = function (event) {
            this.dispatchRouterAction(ROUTER_CANCEL, {
                storeState: this.storeState,
                event: event,
            });
        };
        StoreRouterConnectingModule.prototype.dispatchRouterError = function (event) {
            this.dispatchRouterAction(ROUTER_ERROR, {
                storeState: this.storeState,
                event: new router.NavigationError(event.id, event.url, "" + event),
            });
        };
        StoreRouterConnectingModule.prototype.dispatchRouterNavigated = function (event) {
            var routerState = this.serializer.serialize(this.router.routerState.snapshot);
            this.dispatchRouterAction(ROUTER_NAVIGATED, { event: event, routerState: routerState });
        };
        StoreRouterConnectingModule.prototype.dispatchRouterAction = function (type, payload) {
            this.trigger = RouterTrigger.ROUTER;
            try {
                this.store.dispatch({
                    type: type,
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
        };
        StoreRouterConnectingModule.prototype.reset = function () {
            this.trigger = RouterTrigger.NONE;
            this.storeState = null;
            this.routerState = null;
        };
        return StoreRouterConnectingModule;
    }());
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    StoreRouterConnectingModule.decorators = [
        { type: core.NgModule, args: [{},] }
    ];
    /**
     * @type {function(): !Array<(null|{
     *   type: ?,
     *   decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>),
     * })>}
     * @nocollapse
     */
    StoreRouterConnectingModule.ctorParameters = function () { return [
        { type: store.Store },
        { type: router.Router },
        { type: RouterStateSerializer },
        { type: core.ErrorHandler },
        { type: undefined, decorators: [{ type: core.Inject, args: [ROUTER_CONFIG,] }] },
        { type: undefined, decorators: [{ type: core.Inject, args: [store.ACTIVE_RUNTIME_CHECKS,] }] }
    ]; };
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
        return store.createFeatureSelector(DEFAULT_ROUTER_FEATURENAME);
    }
    function getSelectors(selectState) {
        if (selectState === void 0) { selectState = createRouterSelector(); }
        var selectRouterState = store.createSelector(selectState, function (router) { return router && router.state; });
        var selectRootRoute = store.createSelector(selectRouterState, function (routerState) { return routerState && routerState.root; });
        var selectCurrentRoute = store.createSelector(selectRootRoute, function (rootRoute) {
            if (!rootRoute) {
                return undefined;
            }
            var route = rootRoute;
            while (route.firstChild) {
                route = route.firstChild;
            }
            return route;
        });
        var selectFragment = store.createSelector(selectRootRoute, function (route) { return route && route.fragment; });
        var selectQueryParams = store.createSelector(selectRootRoute, function (route) { return route && route.queryParams; });
        var selectQueryParam = function (param) { return store.createSelector(selectQueryParams, function (params) { return params && params[param]; }); };
        var selectRouteParams = store.createSelector(selectCurrentRoute, function (route) { return route && route.params; });
        var selectRouteParam = function (param) { return store.createSelector(selectRouteParams, function (params) { return params && params[param]; }); };
        var selectRouteData = store.createSelector(selectCurrentRoute, function (route) { return route && route.data; });
        var selectUrl = store.createSelector(selectRouterState, function (routerState) { return routerState && routerState.url; });
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
     * DO NOT EDIT
     *
     * This file is automatically generated at build
     */

    /**
     * Generated bundle index. Do not edit.
     */

    exports.DEFAULT_ROUTER_FEATURENAME = DEFAULT_ROUTER_FEATURENAME;
    exports.DefaultRouterStateSerializer = DefaultRouterStateSerializer;
    exports.MinimalRouterStateSerializer = MinimalRouterStateSerializer;
    exports.ROUTER_CANCEL = ROUTER_CANCEL;
    exports.ROUTER_CONFIG = ROUTER_CONFIG;
    exports.ROUTER_ERROR = ROUTER_ERROR;
    exports.ROUTER_NAVIGATED = ROUTER_NAVIGATED;
    exports.ROUTER_NAVIGATION = ROUTER_NAVIGATION;
    exports.ROUTER_REQUEST = ROUTER_REQUEST;
    exports.RouterStateSerializer = RouterStateSerializer;
    exports.StoreRouterConnectingModule = StoreRouterConnectingModule;
    exports.createRouterSelector = createRouterSelector;
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
