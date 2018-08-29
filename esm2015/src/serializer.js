/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Simple router state.
 * All custom router states / state serializers should have at least
 * the properties of this interface.
 * @record
 */
export function BaseRouterStoreState() { }
/** @type {?} */
BaseRouterStoreState.prototype.url;
// unsupported: template constraints.
/**
 * @abstract
 * @template T
 */
export class RouterStateSerializer {
}
if (false) {
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
/** @type {?} */
SerializedRouterStateSnapshot.prototype.root;
/** @type {?} */
SerializedRouterStateSnapshot.prototype.url;
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
        /** @type {?} */
        const children = route.children.map(c => this.serializeRoute(c));
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VyaWFsaXplci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvcm91dGVyLXN0b3JlL3NyYy9zZXJpYWxpemVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQVdBLE1BQU07Q0FJTDs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFPRCxNQUFNOzs7OztJQUVKLFNBQVMsQ0FBQyxXQUFnQztRQUN4QyxPQUFPO1lBQ0wsSUFBSSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQztZQUMzQyxHQUFHLEVBQUUsV0FBVyxDQUFDLEdBQUc7U0FDckIsQ0FBQztLQUNIOzs7OztJQUVPLGNBQWMsQ0FDcEIsS0FBNkI7O1FBRTdCLE1BQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2pFLE9BQU87WUFDTCxNQUFNLEVBQUUsS0FBSyxDQUFDLE1BQU07WUFDcEIsUUFBUSxFQUFFLEtBQUssQ0FBQyxRQUFRO1lBQ3hCLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSTtZQUNoQixHQUFHLEVBQUUsS0FBSyxDQUFDLEdBQUc7WUFDZCxNQUFNLEVBQUUsS0FBSyxDQUFDLE1BQU07WUFDcEIsV0FBVyxFQUFFO2dCQUNYLFNBQVMsRUFBRSxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsU0FBUzthQUN2RTtZQUNELFdBQVcsRUFBRSxLQUFLLENBQUMsV0FBVztZQUM5QixhQUFhLEVBQUUsS0FBSyxDQUFDLGFBQWE7WUFDbEMsUUFBUSxFQUFFLEtBQUssQ0FBQyxRQUFRO1lBQ3hCLFNBQVMsb0JBQUUsQ0FBQyxLQUFLLENBQUMsV0FBVztnQkFDM0IsQ0FBQyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsU0FBUztnQkFDN0IsQ0FBQyxDQUFDLFNBQVMsQ0FBUSxDQUFBO1lBQ3JCLElBQUksb0JBQUUsU0FBZ0IsQ0FBQTtZQUN0QixNQUFNLG9CQUFFLFNBQWdCLENBQUE7WUFDeEIsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDdkIsWUFBWSxvQkFBRSxTQUFnQixDQUFBO1lBQzlCLFFBQVE7U0FDVCxDQUFDOztDQUVMIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWN0aXZhdGVkUm91dGVTbmFwc2hvdCwgUm91dGVyU3RhdGVTbmFwc2hvdCB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5cbi8qKlxuICogU2ltcGxlIHJvdXRlciBzdGF0ZS5cbiAqIEFsbCBjdXN0b20gcm91dGVyIHN0YXRlcyAvIHN0YXRlIHNlcmlhbGl6ZXJzIHNob3VsZCBoYXZlIGF0IGxlYXN0XG4gKiB0aGUgcHJvcGVydGllcyBvZiB0aGlzIGludGVyZmFjZS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBCYXNlUm91dGVyU3RvcmVTdGF0ZSB7XG4gIHVybDogc3RyaW5nO1xufVxuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgUm91dGVyU3RhdGVTZXJpYWxpemVyPFxuICBUIGV4dGVuZHMgQmFzZVJvdXRlclN0b3JlU3RhdGUgPSBCYXNlUm91dGVyU3RvcmVTdGF0ZVxuPiB7XG4gIGFic3RyYWN0IHNlcmlhbGl6ZShyb3V0ZXJTdGF0ZTogUm91dGVyU3RhdGVTbmFwc2hvdCk6IFQ7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgU2VyaWFsaXplZFJvdXRlclN0YXRlU25hcHNob3QgZXh0ZW5kcyBCYXNlUm91dGVyU3RvcmVTdGF0ZSB7XG4gIHJvb3Q6IEFjdGl2YXRlZFJvdXRlU25hcHNob3Q7XG4gIHVybDogc3RyaW5nO1xufVxuXG5leHBvcnQgY2xhc3MgRGVmYXVsdFJvdXRlclN0YXRlU2VyaWFsaXplclxuICBpbXBsZW1lbnRzIFJvdXRlclN0YXRlU2VyaWFsaXplcjxTZXJpYWxpemVkUm91dGVyU3RhdGVTbmFwc2hvdD4ge1xuICBzZXJpYWxpemUocm91dGVyU3RhdGU6IFJvdXRlclN0YXRlU25hcHNob3QpOiBTZXJpYWxpemVkUm91dGVyU3RhdGVTbmFwc2hvdCB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJvb3Q6IHRoaXMuc2VyaWFsaXplUm91dGUocm91dGVyU3RhdGUucm9vdCksXG4gICAgICB1cmw6IHJvdXRlclN0YXRlLnVybCxcbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSBzZXJpYWxpemVSb3V0ZShcbiAgICByb3V0ZTogQWN0aXZhdGVkUm91dGVTbmFwc2hvdFxuICApOiBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90IHtcbiAgICBjb25zdCBjaGlsZHJlbiA9IHJvdXRlLmNoaWxkcmVuLm1hcChjID0+IHRoaXMuc2VyaWFsaXplUm91dGUoYykpO1xuICAgIHJldHVybiB7XG4gICAgICBwYXJhbXM6IHJvdXRlLnBhcmFtcyxcbiAgICAgIHBhcmFtTWFwOiByb3V0ZS5wYXJhbU1hcCxcbiAgICAgIGRhdGE6IHJvdXRlLmRhdGEsXG4gICAgICB1cmw6IHJvdXRlLnVybCxcbiAgICAgIG91dGxldDogcm91dGUub3V0bGV0LFxuICAgICAgcm91dGVDb25maWc6IHtcbiAgICAgICAgY29tcG9uZW50OiByb3V0ZS5yb3V0ZUNvbmZpZyA/IHJvdXRlLnJvdXRlQ29uZmlnLmNvbXBvbmVudCA6IHVuZGVmaW5lZCxcbiAgICAgIH0sXG4gICAgICBxdWVyeVBhcmFtczogcm91dGUucXVlcnlQYXJhbXMsXG4gICAgICBxdWVyeVBhcmFtTWFwOiByb3V0ZS5xdWVyeVBhcmFtTWFwLFxuICAgICAgZnJhZ21lbnQ6IHJvdXRlLmZyYWdtZW50LFxuICAgICAgY29tcG9uZW50OiAocm91dGUucm91dGVDb25maWdcbiAgICAgICAgPyByb3V0ZS5yb3V0ZUNvbmZpZy5jb21wb25lbnRcbiAgICAgICAgOiB1bmRlZmluZWQpIGFzIGFueSxcbiAgICAgIHJvb3Q6IHVuZGVmaW5lZCBhcyBhbnksXG4gICAgICBwYXJlbnQ6IHVuZGVmaW5lZCBhcyBhbnksXG4gICAgICBmaXJzdENoaWxkOiBjaGlsZHJlblswXSxcbiAgICAgIHBhdGhGcm9tUm9vdDogdW5kZWZpbmVkIGFzIGFueSxcbiAgICAgIGNoaWxkcmVuLFxuICAgIH07XG4gIH1cbn1cbiJdfQ==