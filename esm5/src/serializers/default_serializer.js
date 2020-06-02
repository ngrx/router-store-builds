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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdF9zZXJpYWxpemVyLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQG5ncngvcm91dGVyLXN0b3JlLyIsInNvdXJjZXMiOlsic3JjL3NlcmlhbGl6ZXJzL2RlZmF1bHRfc2VyaWFsaXplci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUdBLG1EQUdDOzs7SUFGQyw2Q0FBNkI7O0lBQzdCLDRDQUFZOztBQUdkO0lBQUE7SUF5Q0EsQ0FBQzs7Ozs7SUF2Q0MsZ0RBQVM7Ozs7SUFBVCxVQUFVLFdBQWdDO1FBQ3hDLE9BQU87WUFDTCxJQUFJLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDO1lBQzNDLEdBQUcsRUFBRSxXQUFXLENBQUMsR0FBRztTQUNyQixDQUFDO0lBQ0osQ0FBQzs7Ozs7O0lBRU8scURBQWM7Ozs7O0lBQXRCLFVBQ0UsS0FBNkI7UUFEL0IsaUJBK0JDOztZQTVCTyxRQUFRLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHOzs7O1FBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxLQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxFQUF0QixDQUFzQixFQUFDO1FBQ2hFLE9BQU87WUFDTCxNQUFNLEVBQUUsS0FBSyxDQUFDLE1BQU07WUFDcEIsUUFBUSxFQUFFLEtBQUssQ0FBQyxRQUFRO1lBQ3hCLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSTtZQUNoQixHQUFHLEVBQUUsS0FBSyxDQUFDLEdBQUc7WUFDZCxNQUFNLEVBQUUsS0FBSyxDQUFDLE1BQU07WUFDcEIsV0FBVyxFQUFFLEtBQUssQ0FBQyxXQUFXO2dCQUM1QixDQUFDLENBQUM7b0JBQ0UsU0FBUyxFQUFFLEtBQUssQ0FBQyxXQUFXLENBQUMsU0FBUztvQkFDdEMsSUFBSSxFQUFFLEtBQUssQ0FBQyxXQUFXLENBQUMsSUFBSTtvQkFDNUIsU0FBUyxFQUFFLEtBQUssQ0FBQyxXQUFXLENBQUMsU0FBUztvQkFDdEMsVUFBVSxFQUFFLEtBQUssQ0FBQyxXQUFXLENBQUMsVUFBVTtvQkFDeEMsTUFBTSxFQUFFLEtBQUssQ0FBQyxXQUFXLENBQUMsTUFBTTtpQkFDakM7Z0JBQ0gsQ0FBQyxDQUFDLElBQUk7WUFDUixXQUFXLEVBQUUsS0FBSyxDQUFDLFdBQVc7WUFDOUIsYUFBYSxFQUFFLEtBQUssQ0FBQyxhQUFhO1lBQ2xDLFFBQVEsRUFBRSxLQUFLLENBQUMsUUFBUTtZQUN4QixTQUFTLEVBQUUsbUJBQUEsQ0FBQyxLQUFLLENBQUMsV0FBVztnQkFDM0IsQ0FBQyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsU0FBUztnQkFDN0IsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxFQUFPO1lBQ3JCLElBQUksRUFBRSxtQkFBQSxTQUFTLEVBQU87WUFDdEIsTUFBTSxFQUFFLG1CQUFBLFNBQVMsRUFBTztZQUN4QixVQUFVLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUN2QixZQUFZLEVBQUUsbUJBQUEsU0FBUyxFQUFPO1lBQzlCLFFBQVEsVUFBQTtTQUNULENBQUM7SUFDSixDQUFDO0lBQ0gsbUNBQUM7QUFBRCxDQUFDLEFBekNELElBeUNDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWN0aXZhdGVkUm91dGVTbmFwc2hvdCwgUm91dGVyU3RhdGVTbmFwc2hvdCB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBCYXNlUm91dGVyU3RvcmVTdGF0ZSwgUm91dGVyU3RhdGVTZXJpYWxpemVyIH0gZnJvbSAnLi9iYXNlJztcblxuZXhwb3J0IGludGVyZmFjZSBTZXJpYWxpemVkUm91dGVyU3RhdGVTbmFwc2hvdCBleHRlbmRzIEJhc2VSb3V0ZXJTdG9yZVN0YXRlIHtcbiAgcm9vdDogQWN0aXZhdGVkUm91dGVTbmFwc2hvdDtcbiAgdXJsOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBjbGFzcyBEZWZhdWx0Um91dGVyU3RhdGVTZXJpYWxpemVyXG4gIGltcGxlbWVudHMgUm91dGVyU3RhdGVTZXJpYWxpemVyPFNlcmlhbGl6ZWRSb3V0ZXJTdGF0ZVNuYXBzaG90PiB7XG4gIHNlcmlhbGl6ZShyb3V0ZXJTdGF0ZTogUm91dGVyU3RhdGVTbmFwc2hvdCk6IFNlcmlhbGl6ZWRSb3V0ZXJTdGF0ZVNuYXBzaG90IHtcbiAgICByZXR1cm4ge1xuICAgICAgcm9vdDogdGhpcy5zZXJpYWxpemVSb3V0ZShyb3V0ZXJTdGF0ZS5yb290KSxcbiAgICAgIHVybDogcm91dGVyU3RhdGUudXJsLFxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIHNlcmlhbGl6ZVJvdXRlKFxuICAgIHJvdXRlOiBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90XG4gICk6IEFjdGl2YXRlZFJvdXRlU25hcHNob3Qge1xuICAgIGNvbnN0IGNoaWxkcmVuID0gcm91dGUuY2hpbGRyZW4ubWFwKGMgPT4gdGhpcy5zZXJpYWxpemVSb3V0ZShjKSk7XG4gICAgcmV0dXJuIHtcbiAgICAgIHBhcmFtczogcm91dGUucGFyYW1zLFxuICAgICAgcGFyYW1NYXA6IHJvdXRlLnBhcmFtTWFwLFxuICAgICAgZGF0YTogcm91dGUuZGF0YSxcbiAgICAgIHVybDogcm91dGUudXJsLFxuICAgICAgb3V0bGV0OiByb3V0ZS5vdXRsZXQsXG4gICAgICByb3V0ZUNvbmZpZzogcm91dGUucm91dGVDb25maWdcbiAgICAgICAgPyB7XG4gICAgICAgICAgICBjb21wb25lbnQ6IHJvdXRlLnJvdXRlQ29uZmlnLmNvbXBvbmVudCxcbiAgICAgICAgICAgIHBhdGg6IHJvdXRlLnJvdXRlQ29uZmlnLnBhdGgsXG4gICAgICAgICAgICBwYXRoTWF0Y2g6IHJvdXRlLnJvdXRlQ29uZmlnLnBhdGhNYXRjaCxcbiAgICAgICAgICAgIHJlZGlyZWN0VG86IHJvdXRlLnJvdXRlQ29uZmlnLnJlZGlyZWN0VG8sXG4gICAgICAgICAgICBvdXRsZXQ6IHJvdXRlLnJvdXRlQ29uZmlnLm91dGxldCxcbiAgICAgICAgICB9XG4gICAgICAgIDogbnVsbCxcbiAgICAgIHF1ZXJ5UGFyYW1zOiByb3V0ZS5xdWVyeVBhcmFtcyxcbiAgICAgIHF1ZXJ5UGFyYW1NYXA6IHJvdXRlLnF1ZXJ5UGFyYW1NYXAsXG4gICAgICBmcmFnbWVudDogcm91dGUuZnJhZ21lbnQsXG4gICAgICBjb21wb25lbnQ6IChyb3V0ZS5yb3V0ZUNvbmZpZ1xuICAgICAgICA/IHJvdXRlLnJvdXRlQ29uZmlnLmNvbXBvbmVudFxuICAgICAgICA6IHVuZGVmaW5lZCkgYXMgYW55LFxuICAgICAgcm9vdDogdW5kZWZpbmVkIGFzIGFueSxcbiAgICAgIHBhcmVudDogdW5kZWZpbmVkIGFzIGFueSxcbiAgICAgIGZpcnN0Q2hpbGQ6IGNoaWxkcmVuWzBdLFxuICAgICAgcGF0aEZyb21Sb290OiB1bmRlZmluZWQgYXMgYW55LFxuICAgICAgY2hpbGRyZW4sXG4gICAgfTtcbiAgfVxufVxuIl19