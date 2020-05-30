/**
 * @fileoverview added by tsickle
 * Generated from: src/serializers/default_serializer.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @record
 */
export function SerializedRouterStateSnapshot() { }
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
export { DefaultRouterStateSerializer };
//# sourceMappingURL=default_serializer.js.map