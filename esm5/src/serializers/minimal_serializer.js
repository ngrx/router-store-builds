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
export { MinimalRouterStateSerializer };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWluaW1hbF9zZXJpYWxpemVyLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQG5ncngvcm91dGVyLXN0b3JlLyIsInNvdXJjZXMiOlsic3JjL3NlcmlhbGl6ZXJzL21pbmltYWxfc2VyaWFsaXplci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUdBLG1EQVVDOzs7SUFUQyxvREFBbUQ7O0lBQ25ELDRDQUFtQzs7SUFDbkMsK0NBQXlDOztJQUN6QyxvREFBbUQ7O0lBQ25ELGlEQUE2Qzs7SUFDN0MsNkNBQXFDOztJQUNyQywrQ0FBeUM7O0lBQ3pDLG1EQUEyQzs7SUFDM0MsaURBQTBDOzs7OztBQUc1QyxnREFHQzs7O0lBRkMsMENBQW9DOztJQUNwQyx5Q0FBWTs7QUFHZDtJQUFBO0lBZ0NBLENBQUM7Ozs7O0lBOUJDLGdEQUFTOzs7O0lBQVQsVUFBVSxXQUFnQztRQUN4QyxPQUFPO1lBQ0wsSUFBSSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQztZQUMzQyxHQUFHLEVBQUUsV0FBVyxDQUFDLEdBQUc7U0FDckIsQ0FBQztJQUNKLENBQUM7Ozs7OztJQUVPLHFEQUFjOzs7OztJQUF0QixVQUNFLEtBQTZCO1FBRC9CLGlCQXNCQzs7WUFuQk8sUUFBUSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRzs7OztRQUFDLFVBQUMsQ0FBQyxJQUFLLE9BQUEsS0FBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsRUFBdEIsQ0FBc0IsRUFBQztRQUNsRSxPQUFPO1lBQ0wsTUFBTSxFQUFFLEtBQUssQ0FBQyxNQUFNO1lBQ3BCLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSTtZQUNoQixHQUFHLEVBQUUsS0FBSyxDQUFDLEdBQUc7WUFDZCxNQUFNLEVBQUUsS0FBSyxDQUFDLE1BQU07WUFDcEIsV0FBVyxFQUFFLEtBQUssQ0FBQyxXQUFXO2dCQUM1QixDQUFDLENBQUM7b0JBQ0UsSUFBSSxFQUFFLEtBQUssQ0FBQyxXQUFXLENBQUMsSUFBSTtvQkFDNUIsU0FBUyxFQUFFLEtBQUssQ0FBQyxXQUFXLENBQUMsU0FBUztvQkFDdEMsVUFBVSxFQUFFLEtBQUssQ0FBQyxXQUFXLENBQUMsVUFBVTtvQkFDeEMsTUFBTSxFQUFFLEtBQUssQ0FBQyxXQUFXLENBQUMsTUFBTTtpQkFDakM7Z0JBQ0gsQ0FBQyxDQUFDLElBQUk7WUFDUixXQUFXLEVBQUUsS0FBSyxDQUFDLFdBQVc7WUFDOUIsUUFBUSxFQUFFLEtBQUssQ0FBQyxRQUFRO1lBQ3hCLFVBQVUsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ3ZCLFFBQVEsVUFBQTtTQUNULENBQUM7SUFDSixDQUFDO0lBQ0gsbUNBQUM7QUFBRCxDQUFDLEFBaENELElBZ0NDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUm91dGVyU3RhdGVTbmFwc2hvdCwgQWN0aXZhdGVkUm91dGVTbmFwc2hvdCB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBCYXNlUm91dGVyU3RvcmVTdGF0ZSwgUm91dGVyU3RhdGVTZXJpYWxpemVyIH0gZnJvbSAnLi9iYXNlJztcblxuZXhwb3J0IGludGVyZmFjZSBNaW5pbWFsQWN0aXZhdGVkUm91dGVTbmFwc2hvdCB7XG4gIHJvdXRlQ29uZmlnOiBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90Wydyb3V0ZUNvbmZpZyddO1xuICB1cmw6IEFjdGl2YXRlZFJvdXRlU25hcHNob3RbJ3VybCddO1xuICBwYXJhbXM6IEFjdGl2YXRlZFJvdXRlU25hcHNob3RbJ3BhcmFtcyddO1xuICBxdWVyeVBhcmFtczogQWN0aXZhdGVkUm91dGVTbmFwc2hvdFsncXVlcnlQYXJhbXMnXTtcbiAgZnJhZ21lbnQ6IEFjdGl2YXRlZFJvdXRlU25hcHNob3RbJ2ZyYWdtZW50J107XG4gIGRhdGE6IEFjdGl2YXRlZFJvdXRlU25hcHNob3RbJ2RhdGEnXTtcbiAgb3V0bGV0OiBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90WydvdXRsZXQnXTtcbiAgZmlyc3RDaGlsZD86IE1pbmltYWxBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90O1xuICBjaGlsZHJlbjogTWluaW1hbEFjdGl2YXRlZFJvdXRlU25hcHNob3RbXTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBNaW5pbWFsUm91dGVyU3RhdGVTbmFwc2hvdCBleHRlbmRzIEJhc2VSb3V0ZXJTdG9yZVN0YXRlIHtcbiAgcm9vdDogTWluaW1hbEFjdGl2YXRlZFJvdXRlU25hcHNob3Q7XG4gIHVybDogc3RyaW5nO1xufVxuXG5leHBvcnQgY2xhc3MgTWluaW1hbFJvdXRlclN0YXRlU2VyaWFsaXplclxuICBpbXBsZW1lbnRzIFJvdXRlclN0YXRlU2VyaWFsaXplcjxNaW5pbWFsUm91dGVyU3RhdGVTbmFwc2hvdD4ge1xuICBzZXJpYWxpemUocm91dGVyU3RhdGU6IFJvdXRlclN0YXRlU25hcHNob3QpOiBNaW5pbWFsUm91dGVyU3RhdGVTbmFwc2hvdCB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJvb3Q6IHRoaXMuc2VyaWFsaXplUm91dGUocm91dGVyU3RhdGUucm9vdCksXG4gICAgICB1cmw6IHJvdXRlclN0YXRlLnVybCxcbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSBzZXJpYWxpemVSb3V0ZShcbiAgICByb3V0ZTogQWN0aXZhdGVkUm91dGVTbmFwc2hvdFxuICApOiBNaW5pbWFsQWN0aXZhdGVkUm91dGVTbmFwc2hvdCB7XG4gICAgY29uc3QgY2hpbGRyZW4gPSByb3V0ZS5jaGlsZHJlbi5tYXAoKGMpID0+IHRoaXMuc2VyaWFsaXplUm91dGUoYykpO1xuICAgIHJldHVybiB7XG4gICAgICBwYXJhbXM6IHJvdXRlLnBhcmFtcyxcbiAgICAgIGRhdGE6IHJvdXRlLmRhdGEsXG4gICAgICB1cmw6IHJvdXRlLnVybCxcbiAgICAgIG91dGxldDogcm91dGUub3V0bGV0LFxuICAgICAgcm91dGVDb25maWc6IHJvdXRlLnJvdXRlQ29uZmlnXG4gICAgICAgID8ge1xuICAgICAgICAgICAgcGF0aDogcm91dGUucm91dGVDb25maWcucGF0aCxcbiAgICAgICAgICAgIHBhdGhNYXRjaDogcm91dGUucm91dGVDb25maWcucGF0aE1hdGNoLFxuICAgICAgICAgICAgcmVkaXJlY3RUbzogcm91dGUucm91dGVDb25maWcucmVkaXJlY3RUbyxcbiAgICAgICAgICAgIG91dGxldDogcm91dGUucm91dGVDb25maWcub3V0bGV0LFxuICAgICAgICAgIH1cbiAgICAgICAgOiBudWxsLFxuICAgICAgcXVlcnlQYXJhbXM6IHJvdXRlLnF1ZXJ5UGFyYW1zLFxuICAgICAgZnJhZ21lbnQ6IHJvdXRlLmZyYWdtZW50LFxuICAgICAgZmlyc3RDaGlsZDogY2hpbGRyZW5bMF0sXG4gICAgICBjaGlsZHJlbixcbiAgICB9O1xuICB9XG59XG4iXX0=