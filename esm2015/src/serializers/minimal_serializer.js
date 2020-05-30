/**
 * @fileoverview added by tsickle
 * Generated from: src/serializers/minimal_serializer.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @record
 */
export function MinimalActivatedRouteSnapshot() { }
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
export function MinimalRouterStateSnapshot() { }
if (false) {
    /** @type {?} */
    MinimalRouterStateSnapshot.prototype.root;
    /** @type {?} */
    MinimalRouterStateSnapshot.prototype.url;
}
export class MinimalRouterStateSerializer {
    /**
     * @param {?} routerState
     * @return {?}
     */
    serialize(routerState) {
        return {
            root: this.serializeRoute(routerState.root),
            url: routerState.url,
        };
    }
    /**
     * @private
     * @param {?} route
     * @return {?}
     */
    serializeRoute(route) {
        /** @type {?} */
        const children = route.children.map((/**
         * @param {?} c
         * @return {?}
         */
        c => this.serializeRoute(c)));
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
//# sourceMappingURL=minimal_serializer.js.map