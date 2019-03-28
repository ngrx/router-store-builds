var RouterStateSerializer = /** @class */ (function () {
    function RouterStateSerializer() {
    }
    return RouterStateSerializer;
}());
export { RouterStateSerializer };
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
export { DefaultRouterStateSerializer };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VyaWFsaXplci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvcm91dGVyLXN0b3JlL3NyYy9zZXJpYWxpemVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVdBO0lBQUE7SUFJQSxDQUFDO0lBQUQsNEJBQUM7QUFBRCxDQUFDLEFBSkQsSUFJQzs7QUFPRDtJQUFBO0lBeUNBLENBQUM7SUF2Q0MsZ0RBQVMsR0FBVCxVQUFVLFdBQWdDO1FBQ3hDLE9BQU87WUFDTCxJQUFJLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDO1lBQzNDLEdBQUcsRUFBRSxXQUFXLENBQUMsR0FBRztTQUNyQixDQUFDO0lBQ0osQ0FBQztJQUVPLHFEQUFjLEdBQXRCLFVBQ0UsS0FBNkI7UUFEL0IsaUJBK0JDO1FBNUJDLElBQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsS0FBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsRUFBdEIsQ0FBc0IsQ0FBQyxDQUFDO1FBQ2pFLE9BQU87WUFDTCxNQUFNLEVBQUUsS0FBSyxDQUFDLE1BQU07WUFDcEIsUUFBUSxFQUFFLEtBQUssQ0FBQyxRQUFRO1lBQ3hCLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSTtZQUNoQixHQUFHLEVBQUUsS0FBSyxDQUFDLEdBQUc7WUFDZCxNQUFNLEVBQUUsS0FBSyxDQUFDLE1BQU07WUFDcEIsV0FBVyxFQUFFLEtBQUssQ0FBQyxXQUFXO2dCQUM1QixDQUFDLENBQUM7b0JBQ0UsU0FBUyxFQUFFLEtBQUssQ0FBQyxXQUFXLENBQUMsU0FBUztvQkFDdEMsSUFBSSxFQUFFLEtBQUssQ0FBQyxXQUFXLENBQUMsSUFBSTtvQkFDNUIsU0FBUyxFQUFFLEtBQUssQ0FBQyxXQUFXLENBQUMsU0FBUztvQkFDdEMsVUFBVSxFQUFFLEtBQUssQ0FBQyxXQUFXLENBQUMsVUFBVTtvQkFDeEMsTUFBTSxFQUFFLEtBQUssQ0FBQyxXQUFXLENBQUMsTUFBTTtpQkFDakM7Z0JBQ0gsQ0FBQyxDQUFDLElBQUk7WUFDUixXQUFXLEVBQUUsS0FBSyxDQUFDLFdBQVc7WUFDOUIsYUFBYSxFQUFFLEtBQUssQ0FBQyxhQUFhO1lBQ2xDLFFBQVEsRUFBRSxLQUFLLENBQUMsUUFBUTtZQUN4QixTQUFTLEVBQUUsQ0FBQyxLQUFLLENBQUMsV0FBVztnQkFDM0IsQ0FBQyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsU0FBUztnQkFDN0IsQ0FBQyxDQUFDLFNBQVMsQ0FBUTtZQUNyQixJQUFJLEVBQUUsU0FBZ0I7WUFDdEIsTUFBTSxFQUFFLFNBQWdCO1lBQ3hCLFVBQVUsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ3ZCLFlBQVksRUFBRSxTQUFnQjtZQUM5QixRQUFRLFVBQUE7U0FDVCxDQUFDO0lBQ0osQ0FBQztJQUNILG1DQUFDO0FBQUQsQ0FBQyxBQXpDRCxJQXlDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFjdGl2YXRlZFJvdXRlU25hcHNob3QsIFJvdXRlclN0YXRlU25hcHNob3QgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuXG4vKipcbiAqIFNpbXBsZSByb3V0ZXIgc3RhdGUuXG4gKiBBbGwgY3VzdG9tIHJvdXRlciBzdGF0ZXMgLyBzdGF0ZSBzZXJpYWxpemVycyBzaG91bGQgaGF2ZSBhdCBsZWFzdFxuICogdGhlIHByb3BlcnRpZXMgb2YgdGhpcyBpbnRlcmZhY2UuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQmFzZVJvdXRlclN0b3JlU3RhdGUge1xuICB1cmw6IHN0cmluZztcbn1cblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFJvdXRlclN0YXRlU2VyaWFsaXplcjxcbiAgVCBleHRlbmRzIEJhc2VSb3V0ZXJTdG9yZVN0YXRlID0gQmFzZVJvdXRlclN0b3JlU3RhdGVcbj4ge1xuICBhYnN0cmFjdCBzZXJpYWxpemUocm91dGVyU3RhdGU6IFJvdXRlclN0YXRlU25hcHNob3QpOiBUO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFNlcmlhbGl6ZWRSb3V0ZXJTdGF0ZVNuYXBzaG90IGV4dGVuZHMgQmFzZVJvdXRlclN0b3JlU3RhdGUge1xuICByb290OiBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90O1xuICB1cmw6IHN0cmluZztcbn1cblxuZXhwb3J0IGNsYXNzIERlZmF1bHRSb3V0ZXJTdGF0ZVNlcmlhbGl6ZXJcbiAgaW1wbGVtZW50cyBSb3V0ZXJTdGF0ZVNlcmlhbGl6ZXI8U2VyaWFsaXplZFJvdXRlclN0YXRlU25hcHNob3Q+IHtcbiAgc2VyaWFsaXplKHJvdXRlclN0YXRlOiBSb3V0ZXJTdGF0ZVNuYXBzaG90KTogU2VyaWFsaXplZFJvdXRlclN0YXRlU25hcHNob3Qge1xuICAgIHJldHVybiB7XG4gICAgICByb290OiB0aGlzLnNlcmlhbGl6ZVJvdXRlKHJvdXRlclN0YXRlLnJvb3QpLFxuICAgICAgdXJsOiByb3V0ZXJTdGF0ZS51cmwsXG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgc2VyaWFsaXplUm91dGUoXG4gICAgcm91dGU6IEFjdGl2YXRlZFJvdXRlU25hcHNob3RcbiAgKTogQWN0aXZhdGVkUm91dGVTbmFwc2hvdCB7XG4gICAgY29uc3QgY2hpbGRyZW4gPSByb3V0ZS5jaGlsZHJlbi5tYXAoYyA9PiB0aGlzLnNlcmlhbGl6ZVJvdXRlKGMpKTtcbiAgICByZXR1cm4ge1xuICAgICAgcGFyYW1zOiByb3V0ZS5wYXJhbXMsXG4gICAgICBwYXJhbU1hcDogcm91dGUucGFyYW1NYXAsXG4gICAgICBkYXRhOiByb3V0ZS5kYXRhLFxuICAgICAgdXJsOiByb3V0ZS51cmwsXG4gICAgICBvdXRsZXQ6IHJvdXRlLm91dGxldCxcbiAgICAgIHJvdXRlQ29uZmlnOiByb3V0ZS5yb3V0ZUNvbmZpZ1xuICAgICAgICA/IHtcbiAgICAgICAgICAgIGNvbXBvbmVudDogcm91dGUucm91dGVDb25maWcuY29tcG9uZW50LFxuICAgICAgICAgICAgcGF0aDogcm91dGUucm91dGVDb25maWcucGF0aCxcbiAgICAgICAgICAgIHBhdGhNYXRjaDogcm91dGUucm91dGVDb25maWcucGF0aE1hdGNoLFxuICAgICAgICAgICAgcmVkaXJlY3RUbzogcm91dGUucm91dGVDb25maWcucmVkaXJlY3RUbyxcbiAgICAgICAgICAgIG91dGxldDogcm91dGUucm91dGVDb25maWcub3V0bGV0LFxuICAgICAgICAgIH1cbiAgICAgICAgOiBudWxsLFxuICAgICAgcXVlcnlQYXJhbXM6IHJvdXRlLnF1ZXJ5UGFyYW1zLFxuICAgICAgcXVlcnlQYXJhbU1hcDogcm91dGUucXVlcnlQYXJhbU1hcCxcbiAgICAgIGZyYWdtZW50OiByb3V0ZS5mcmFnbWVudCxcbiAgICAgIGNvbXBvbmVudDogKHJvdXRlLnJvdXRlQ29uZmlnXG4gICAgICAgID8gcm91dGUucm91dGVDb25maWcuY29tcG9uZW50XG4gICAgICAgIDogdW5kZWZpbmVkKSBhcyBhbnksXG4gICAgICByb290OiB1bmRlZmluZWQgYXMgYW55LFxuICAgICAgcGFyZW50OiB1bmRlZmluZWQgYXMgYW55LFxuICAgICAgZmlyc3RDaGlsZDogY2hpbGRyZW5bMF0sXG4gICAgICBwYXRoRnJvbVJvb3Q6IHVuZGVmaW5lZCBhcyBhbnksXG4gICAgICBjaGlsZHJlbixcbiAgICB9O1xuICB9XG59XG4iXX0=