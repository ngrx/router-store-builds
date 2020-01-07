/**
 * @fileoverview added by tsickle
 * Generated from: modules/router-store/src/serializers/default_serializer.ts
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdF9zZXJpYWxpemVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9yb3V0ZXItc3RvcmUvc3JjL3NlcmlhbGl6ZXJzL2RlZmF1bHRfc2VyaWFsaXplci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUdBLG1EQUdDOzs7SUFGQyw2Q0FBNkI7O0lBQzdCLDRDQUFZOztBQUdkLE1BQU0sT0FBTyw0QkFBNEI7Ozs7O0lBRXZDLFNBQVMsQ0FBQyxXQUFnQztRQUN4QyxPQUFPO1lBQ0wsSUFBSSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQztZQUMzQyxHQUFHLEVBQUUsV0FBVyxDQUFDLEdBQUc7U0FDckIsQ0FBQztJQUNKLENBQUM7Ozs7OztJQUVPLGNBQWMsQ0FDcEIsS0FBNkI7O2NBRXZCLFFBQVEsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUc7Ozs7UUFBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLEVBQUM7UUFDaEUsT0FBTztZQUNMLE1BQU0sRUFBRSxLQUFLLENBQUMsTUFBTTtZQUNwQixRQUFRLEVBQUUsS0FBSyxDQUFDLFFBQVE7WUFDeEIsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJO1lBQ2hCLEdBQUcsRUFBRSxLQUFLLENBQUMsR0FBRztZQUNkLE1BQU0sRUFBRSxLQUFLLENBQUMsTUFBTTtZQUNwQixXQUFXLEVBQUUsS0FBSyxDQUFDLFdBQVc7Z0JBQzVCLENBQUMsQ0FBQztvQkFDRSxTQUFTLEVBQUUsS0FBSyxDQUFDLFdBQVcsQ0FBQyxTQUFTO29CQUN0QyxJQUFJLEVBQUUsS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJO29CQUM1QixTQUFTLEVBQUUsS0FBSyxDQUFDLFdBQVcsQ0FBQyxTQUFTO29CQUN0QyxVQUFVLEVBQUUsS0FBSyxDQUFDLFdBQVcsQ0FBQyxVQUFVO29CQUN4QyxNQUFNLEVBQUUsS0FBSyxDQUFDLFdBQVcsQ0FBQyxNQUFNO2lCQUNqQztnQkFDSCxDQUFDLENBQUMsSUFBSTtZQUNSLFdBQVcsRUFBRSxLQUFLLENBQUMsV0FBVztZQUM5QixhQUFhLEVBQUUsS0FBSyxDQUFDLGFBQWE7WUFDbEMsUUFBUSxFQUFFLEtBQUssQ0FBQyxRQUFRO1lBQ3hCLFNBQVMsRUFBRSxtQkFBQSxDQUFDLEtBQUssQ0FBQyxXQUFXO2dCQUMzQixDQUFDLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxTQUFTO2dCQUM3QixDQUFDLENBQUMsU0FBUyxDQUFDLEVBQU87WUFDckIsSUFBSSxFQUFFLG1CQUFBLFNBQVMsRUFBTztZQUN0QixNQUFNLEVBQUUsbUJBQUEsU0FBUyxFQUFPO1lBQ3hCLFVBQVUsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ3ZCLFlBQVksRUFBRSxtQkFBQSxTQUFTLEVBQU87WUFDOUIsUUFBUTtTQUNULENBQUM7SUFDSixDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90LCBSb3V0ZXJTdGF0ZVNuYXBzaG90IH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IEJhc2VSb3V0ZXJTdG9yZVN0YXRlLCBSb3V0ZXJTdGF0ZVNlcmlhbGl6ZXIgfSBmcm9tICcuL2Jhc2UnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFNlcmlhbGl6ZWRSb3V0ZXJTdGF0ZVNuYXBzaG90IGV4dGVuZHMgQmFzZVJvdXRlclN0b3JlU3RhdGUge1xuICByb290OiBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90O1xuICB1cmw6IHN0cmluZztcbn1cblxuZXhwb3J0IGNsYXNzIERlZmF1bHRSb3V0ZXJTdGF0ZVNlcmlhbGl6ZXJcbiAgaW1wbGVtZW50cyBSb3V0ZXJTdGF0ZVNlcmlhbGl6ZXI8U2VyaWFsaXplZFJvdXRlclN0YXRlU25hcHNob3Q+IHtcbiAgc2VyaWFsaXplKHJvdXRlclN0YXRlOiBSb3V0ZXJTdGF0ZVNuYXBzaG90KTogU2VyaWFsaXplZFJvdXRlclN0YXRlU25hcHNob3Qge1xuICAgIHJldHVybiB7XG4gICAgICByb290OiB0aGlzLnNlcmlhbGl6ZVJvdXRlKHJvdXRlclN0YXRlLnJvb3QpLFxuICAgICAgdXJsOiByb3V0ZXJTdGF0ZS51cmwsXG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgc2VyaWFsaXplUm91dGUoXG4gICAgcm91dGU6IEFjdGl2YXRlZFJvdXRlU25hcHNob3RcbiAgKTogQWN0aXZhdGVkUm91dGVTbmFwc2hvdCB7XG4gICAgY29uc3QgY2hpbGRyZW4gPSByb3V0ZS5jaGlsZHJlbi5tYXAoYyA9PiB0aGlzLnNlcmlhbGl6ZVJvdXRlKGMpKTtcbiAgICByZXR1cm4ge1xuICAgICAgcGFyYW1zOiByb3V0ZS5wYXJhbXMsXG4gICAgICBwYXJhbU1hcDogcm91dGUucGFyYW1NYXAsXG4gICAgICBkYXRhOiByb3V0ZS5kYXRhLFxuICAgICAgdXJsOiByb3V0ZS51cmwsXG4gICAgICBvdXRsZXQ6IHJvdXRlLm91dGxldCxcbiAgICAgIHJvdXRlQ29uZmlnOiByb3V0ZS5yb3V0ZUNvbmZpZ1xuICAgICAgICA/IHtcbiAgICAgICAgICAgIGNvbXBvbmVudDogcm91dGUucm91dGVDb25maWcuY29tcG9uZW50LFxuICAgICAgICAgICAgcGF0aDogcm91dGUucm91dGVDb25maWcucGF0aCxcbiAgICAgICAgICAgIHBhdGhNYXRjaDogcm91dGUucm91dGVDb25maWcucGF0aE1hdGNoLFxuICAgICAgICAgICAgcmVkaXJlY3RUbzogcm91dGUucm91dGVDb25maWcucmVkaXJlY3RUbyxcbiAgICAgICAgICAgIG91dGxldDogcm91dGUucm91dGVDb25maWcub3V0bGV0LFxuICAgICAgICAgIH1cbiAgICAgICAgOiBudWxsLFxuICAgICAgcXVlcnlQYXJhbXM6IHJvdXRlLnF1ZXJ5UGFyYW1zLFxuICAgICAgcXVlcnlQYXJhbU1hcDogcm91dGUucXVlcnlQYXJhbU1hcCxcbiAgICAgIGZyYWdtZW50OiByb3V0ZS5mcmFnbWVudCxcbiAgICAgIGNvbXBvbmVudDogKHJvdXRlLnJvdXRlQ29uZmlnXG4gICAgICAgID8gcm91dGUucm91dGVDb25maWcuY29tcG9uZW50XG4gICAgICAgIDogdW5kZWZpbmVkKSBhcyBhbnksXG4gICAgICByb290OiB1bmRlZmluZWQgYXMgYW55LFxuICAgICAgcGFyZW50OiB1bmRlZmluZWQgYXMgYW55LFxuICAgICAgZmlyc3RDaGlsZDogY2hpbGRyZW5bMF0sXG4gICAgICBwYXRoRnJvbVJvb3Q6IHVuZGVmaW5lZCBhcyBhbnksXG4gICAgICBjaGlsZHJlbixcbiAgICB9O1xuICB9XG59XG4iXX0=