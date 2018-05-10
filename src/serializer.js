/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @abstract
 * @template T
 */
export class RouterStateSerializer {
}
function RouterStateSerializer_tsickle_Closure_declarations() {
    /**
     * @abstract
     * @param {?} routerState
     * @return {?}
     */
    RouterStateSerializer.prototype.serialize = function (routerState) { };
}
/**
 * @record
 */
export function SerializedRouterStateSnapshot() { }
function SerializedRouterStateSnapshot_tsickle_Closure_declarations() {
    /** @type {?} */
    SerializedRouterStateSnapshot.prototype.root;
    /** @type {?} */
    SerializedRouterStateSnapshot.prototype.url;
}
export class DefaultRouterStateSerializer {
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
     * @param {?} route
     * @return {?}
     */
    serializeRoute(route) {
        const /** @type {?} */ children = route.children.map(c => this.serializeRoute(c));
        return {
            params: route.params,
            paramMap: route.paramMap,
            data: route.data,
            url: route.url,
            outlet: route.outlet,
            routeConfig: {
                component: route.routeConfig ? route.routeConfig.component : undefined,
            },
            queryParams: route.queryParams,
            queryParamMap: route.queryParamMap,
            fragment: route.fragment,
            component: /** @type {?} */ ((route.routeConfig
                ? route.routeConfig.component
                : undefined)),
            root: /** @type {?} */ (undefined),
            parent: /** @type {?} */ (undefined),
            firstChild: children[0],
            pathFromRoot: /** @type {?} */ (undefined),
            children,
        };
    }
}
//# sourceMappingURL=serializer.js.map