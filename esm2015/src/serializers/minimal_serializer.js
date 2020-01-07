/**
 * @fileoverview added by tsickle
 * Generated from: modules/router-store/src/serializers/minimal_serializer.ts
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWluaW1hbF9zZXJpYWxpemVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9yb3V0ZXItc3RvcmUvc3JjL3NlcmlhbGl6ZXJzL21pbmltYWxfc2VyaWFsaXplci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUdBLG1EQVVDOzs7SUFUQyxvREFBbUQ7O0lBQ25ELDRDQUFtQzs7SUFDbkMsK0NBQXlDOztJQUN6QyxvREFBbUQ7O0lBQ25ELGlEQUE2Qzs7SUFDN0MsNkNBQXFDOztJQUNyQywrQ0FBeUM7O0lBQ3pDLG1EQUEyQzs7SUFDM0MsaURBQTBDOzs7OztBQUc1QyxnREFHQzs7O0lBRkMsMENBQW9DOztJQUNwQyx5Q0FBWTs7QUFHZCxNQUFNLE9BQU8sNEJBQTRCOzs7OztJQUV2QyxTQUFTLENBQUMsV0FBZ0M7UUFDeEMsT0FBTztZQUNMLElBQUksRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUM7WUFDM0MsR0FBRyxFQUFFLFdBQVcsQ0FBQyxHQUFHO1NBQ3JCLENBQUM7SUFDSixDQUFDOzs7Ozs7SUFFTyxjQUFjLENBQ3BCLEtBQTZCOztjQUV2QixRQUFRLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHOzs7O1FBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxFQUFDO1FBQ2hFLE9BQU87WUFDTCxNQUFNLEVBQUUsS0FBSyxDQUFDLE1BQU07WUFDcEIsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJO1lBQ2hCLEdBQUcsRUFBRSxLQUFLLENBQUMsR0FBRztZQUNkLE1BQU0sRUFBRSxLQUFLLENBQUMsTUFBTTtZQUNwQixXQUFXLEVBQUUsS0FBSyxDQUFDLFdBQVc7Z0JBQzVCLENBQUMsQ0FBQztvQkFDRSxJQUFJLEVBQUUsS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJO29CQUM1QixTQUFTLEVBQUUsS0FBSyxDQUFDLFdBQVcsQ0FBQyxTQUFTO29CQUN0QyxVQUFVLEVBQUUsS0FBSyxDQUFDLFdBQVcsQ0FBQyxVQUFVO29CQUN4QyxNQUFNLEVBQUUsS0FBSyxDQUFDLFdBQVcsQ0FBQyxNQUFNO2lCQUNqQztnQkFDSCxDQUFDLENBQUMsSUFBSTtZQUNSLFdBQVcsRUFBRSxLQUFLLENBQUMsV0FBVztZQUM5QixRQUFRLEVBQUUsS0FBSyxDQUFDLFFBQVE7WUFDeEIsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDdkIsUUFBUTtTQUNULENBQUM7SUFDSixDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBSb3V0ZXJTdGF0ZVNuYXBzaG90LCBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90IH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IEJhc2VSb3V0ZXJTdG9yZVN0YXRlLCBSb3V0ZXJTdGF0ZVNlcmlhbGl6ZXIgfSBmcm9tICcuL2Jhc2UnO1xuXG5leHBvcnQgaW50ZXJmYWNlIE1pbmltYWxBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90IHtcbiAgcm91dGVDb25maWc6IEFjdGl2YXRlZFJvdXRlU25hcHNob3RbJ3JvdXRlQ29uZmlnJ107XG4gIHVybDogQWN0aXZhdGVkUm91dGVTbmFwc2hvdFsndXJsJ107XG4gIHBhcmFtczogQWN0aXZhdGVkUm91dGVTbmFwc2hvdFsncGFyYW1zJ107XG4gIHF1ZXJ5UGFyYW1zOiBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90WydxdWVyeVBhcmFtcyddO1xuICBmcmFnbWVudDogQWN0aXZhdGVkUm91dGVTbmFwc2hvdFsnZnJhZ21lbnQnXTtcbiAgZGF0YTogQWN0aXZhdGVkUm91dGVTbmFwc2hvdFsnZGF0YSddO1xuICBvdXRsZXQ6IEFjdGl2YXRlZFJvdXRlU25hcHNob3RbJ291dGxldCddO1xuICBmaXJzdENoaWxkPzogTWluaW1hbEFjdGl2YXRlZFJvdXRlU25hcHNob3Q7XG4gIGNoaWxkcmVuOiBNaW5pbWFsQWN0aXZhdGVkUm91dGVTbmFwc2hvdFtdO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE1pbmltYWxSb3V0ZXJTdGF0ZVNuYXBzaG90IGV4dGVuZHMgQmFzZVJvdXRlclN0b3JlU3RhdGUge1xuICByb290OiBNaW5pbWFsQWN0aXZhdGVkUm91dGVTbmFwc2hvdDtcbiAgdXJsOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBjbGFzcyBNaW5pbWFsUm91dGVyU3RhdGVTZXJpYWxpemVyXG4gIGltcGxlbWVudHMgUm91dGVyU3RhdGVTZXJpYWxpemVyPE1pbmltYWxSb3V0ZXJTdGF0ZVNuYXBzaG90PiB7XG4gIHNlcmlhbGl6ZShyb3V0ZXJTdGF0ZTogUm91dGVyU3RhdGVTbmFwc2hvdCk6IE1pbmltYWxSb3V0ZXJTdGF0ZVNuYXBzaG90IHtcbiAgICByZXR1cm4ge1xuICAgICAgcm9vdDogdGhpcy5zZXJpYWxpemVSb3V0ZShyb3V0ZXJTdGF0ZS5yb290KSxcbiAgICAgIHVybDogcm91dGVyU3RhdGUudXJsLFxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIHNlcmlhbGl6ZVJvdXRlKFxuICAgIHJvdXRlOiBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90XG4gICk6IE1pbmltYWxBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90IHtcbiAgICBjb25zdCBjaGlsZHJlbiA9IHJvdXRlLmNoaWxkcmVuLm1hcChjID0+IHRoaXMuc2VyaWFsaXplUm91dGUoYykpO1xuICAgIHJldHVybiB7XG4gICAgICBwYXJhbXM6IHJvdXRlLnBhcmFtcyxcbiAgICAgIGRhdGE6IHJvdXRlLmRhdGEsXG4gICAgICB1cmw6IHJvdXRlLnVybCxcbiAgICAgIG91dGxldDogcm91dGUub3V0bGV0LFxuICAgICAgcm91dGVDb25maWc6IHJvdXRlLnJvdXRlQ29uZmlnXG4gICAgICAgID8ge1xuICAgICAgICAgICAgcGF0aDogcm91dGUucm91dGVDb25maWcucGF0aCxcbiAgICAgICAgICAgIHBhdGhNYXRjaDogcm91dGUucm91dGVDb25maWcucGF0aE1hdGNoLFxuICAgICAgICAgICAgcmVkaXJlY3RUbzogcm91dGUucm91dGVDb25maWcucmVkaXJlY3RUbyxcbiAgICAgICAgICAgIG91dGxldDogcm91dGUucm91dGVDb25maWcub3V0bGV0LFxuICAgICAgICAgIH1cbiAgICAgICAgOiBudWxsLFxuICAgICAgcXVlcnlQYXJhbXM6IHJvdXRlLnF1ZXJ5UGFyYW1zLFxuICAgICAgZnJhZ21lbnQ6IHJvdXRlLmZyYWdtZW50LFxuICAgICAgZmlyc3RDaGlsZDogY2hpbGRyZW5bMF0sXG4gICAgICBjaGlsZHJlbixcbiAgICB9O1xuICB9XG59XG4iXX0=