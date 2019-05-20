/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
            children,
        };
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdF9zZXJpYWxpemVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9yb3V0ZXItc3RvcmUvc3JjL3NlcmlhbGl6ZXJzL2RlZmF1bHRfc2VyaWFsaXplci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBR0EsbURBR0M7OztJQUZDLDZDQUE2Qjs7SUFDN0IsNENBQVk7O0FBR2QsTUFBTSxPQUFPLDRCQUE0Qjs7Ozs7SUFFdkMsU0FBUyxDQUFDLFdBQWdDO1FBQ3hDLE9BQU87WUFDTCxJQUFJLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDO1lBQzNDLEdBQUcsRUFBRSxXQUFXLENBQUMsR0FBRztTQUNyQixDQUFDO0lBQ0osQ0FBQzs7Ozs7O0lBRU8sY0FBYyxDQUNwQixLQUE2Qjs7Y0FFdkIsUUFBUSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRzs7OztRQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsRUFBQztRQUNoRSxPQUFPO1lBQ0wsTUFBTSxFQUFFLEtBQUssQ0FBQyxNQUFNO1lBQ3BCLFFBQVEsRUFBRSxLQUFLLENBQUMsUUFBUTtZQUN4QixJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUk7WUFDaEIsR0FBRyxFQUFFLEtBQUssQ0FBQyxHQUFHO1lBQ2QsTUFBTSxFQUFFLEtBQUssQ0FBQyxNQUFNO1lBQ3BCLFdBQVcsRUFBRSxLQUFLLENBQUMsV0FBVztnQkFDNUIsQ0FBQyxDQUFDO29CQUNFLFNBQVMsRUFBRSxLQUFLLENBQUMsV0FBVyxDQUFDLFNBQVM7b0JBQ3RDLElBQUksRUFBRSxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUk7b0JBQzVCLFNBQVMsRUFBRSxLQUFLLENBQUMsV0FBVyxDQUFDLFNBQVM7b0JBQ3RDLFVBQVUsRUFBRSxLQUFLLENBQUMsV0FBVyxDQUFDLFVBQVU7b0JBQ3hDLE1BQU0sRUFBRSxLQUFLLENBQUMsV0FBVyxDQUFDLE1BQU07aUJBQ2pDO2dCQUNILENBQUMsQ0FBQyxJQUFJO1lBQ1IsV0FBVyxFQUFFLEtBQUssQ0FBQyxXQUFXO1lBQzlCLGFBQWEsRUFBRSxLQUFLLENBQUMsYUFBYTtZQUNsQyxRQUFRLEVBQUUsS0FBSyxDQUFDLFFBQVE7WUFDeEIsU0FBUyxFQUFFLG1CQUFBLENBQUMsS0FBSyxDQUFDLFdBQVc7Z0JBQzNCLENBQUMsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLFNBQVM7Z0JBQzdCLENBQUMsQ0FBQyxTQUFTLENBQUMsRUFBTztZQUNyQixJQUFJLEVBQUUsbUJBQUEsU0FBUyxFQUFPO1lBQ3RCLE1BQU0sRUFBRSxtQkFBQSxTQUFTLEVBQU87WUFDeEIsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDdkIsWUFBWSxFQUFFLG1CQUFBLFNBQVMsRUFBTztZQUM5QixRQUFRO1NBQ1QsQ0FBQztJQUNKLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFjdGl2YXRlZFJvdXRlU25hcHNob3QsIFJvdXRlclN0YXRlU25hcHNob3QgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgQmFzZVJvdXRlclN0b3JlU3RhdGUsIFJvdXRlclN0YXRlU2VyaWFsaXplciB9IGZyb20gJy4vc2hhcmVkJztcblxuZXhwb3J0IGludGVyZmFjZSBTZXJpYWxpemVkUm91dGVyU3RhdGVTbmFwc2hvdCBleHRlbmRzIEJhc2VSb3V0ZXJTdG9yZVN0YXRlIHtcbiAgcm9vdDogQWN0aXZhdGVkUm91dGVTbmFwc2hvdDtcbiAgdXJsOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBjbGFzcyBEZWZhdWx0Um91dGVyU3RhdGVTZXJpYWxpemVyXG4gIGltcGxlbWVudHMgUm91dGVyU3RhdGVTZXJpYWxpemVyPFNlcmlhbGl6ZWRSb3V0ZXJTdGF0ZVNuYXBzaG90PiB7XG4gIHNlcmlhbGl6ZShyb3V0ZXJTdGF0ZTogUm91dGVyU3RhdGVTbmFwc2hvdCk6IFNlcmlhbGl6ZWRSb3V0ZXJTdGF0ZVNuYXBzaG90IHtcbiAgICByZXR1cm4ge1xuICAgICAgcm9vdDogdGhpcy5zZXJpYWxpemVSb3V0ZShyb3V0ZXJTdGF0ZS5yb290KSxcbiAgICAgIHVybDogcm91dGVyU3RhdGUudXJsLFxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIHNlcmlhbGl6ZVJvdXRlKFxuICAgIHJvdXRlOiBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90XG4gICk6IEFjdGl2YXRlZFJvdXRlU25hcHNob3Qge1xuICAgIGNvbnN0IGNoaWxkcmVuID0gcm91dGUuY2hpbGRyZW4ubWFwKGMgPT4gdGhpcy5zZXJpYWxpemVSb3V0ZShjKSk7XG4gICAgcmV0dXJuIHtcbiAgICAgIHBhcmFtczogcm91dGUucGFyYW1zLFxuICAgICAgcGFyYW1NYXA6IHJvdXRlLnBhcmFtTWFwLFxuICAgICAgZGF0YTogcm91dGUuZGF0YSxcbiAgICAgIHVybDogcm91dGUudXJsLFxuICAgICAgb3V0bGV0OiByb3V0ZS5vdXRsZXQsXG4gICAgICByb3V0ZUNvbmZpZzogcm91dGUucm91dGVDb25maWdcbiAgICAgICAgPyB7XG4gICAgICAgICAgICBjb21wb25lbnQ6IHJvdXRlLnJvdXRlQ29uZmlnLmNvbXBvbmVudCxcbiAgICAgICAgICAgIHBhdGg6IHJvdXRlLnJvdXRlQ29uZmlnLnBhdGgsXG4gICAgICAgICAgICBwYXRoTWF0Y2g6IHJvdXRlLnJvdXRlQ29uZmlnLnBhdGhNYXRjaCxcbiAgICAgICAgICAgIHJlZGlyZWN0VG86IHJvdXRlLnJvdXRlQ29uZmlnLnJlZGlyZWN0VG8sXG4gICAgICAgICAgICBvdXRsZXQ6IHJvdXRlLnJvdXRlQ29uZmlnLm91dGxldCxcbiAgICAgICAgICB9XG4gICAgICAgIDogbnVsbCxcbiAgICAgIHF1ZXJ5UGFyYW1zOiByb3V0ZS5xdWVyeVBhcmFtcyxcbiAgICAgIHF1ZXJ5UGFyYW1NYXA6IHJvdXRlLnF1ZXJ5UGFyYW1NYXAsXG4gICAgICBmcmFnbWVudDogcm91dGUuZnJhZ21lbnQsXG4gICAgICBjb21wb25lbnQ6IChyb3V0ZS5yb3V0ZUNvbmZpZ1xuICAgICAgICA/IHJvdXRlLnJvdXRlQ29uZmlnLmNvbXBvbmVudFxuICAgICAgICA6IHVuZGVmaW5lZCkgYXMgYW55LFxuICAgICAgcm9vdDogdW5kZWZpbmVkIGFzIGFueSxcbiAgICAgIHBhcmVudDogdW5kZWZpbmVkIGFzIGFueSxcbiAgICAgIGZpcnN0Q2hpbGQ6IGNoaWxkcmVuWzBdLFxuICAgICAgcGF0aEZyb21Sb290OiB1bmRlZmluZWQgYXMgYW55LFxuICAgICAgY2hpbGRyZW4sXG4gICAgfTtcbiAgfVxufVxuIl19