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
            routeConfig: {
                component: route.routeConfig ? route.routeConfig.component : undefined,
            },
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VyaWFsaXplci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvcm91dGVyLXN0b3JlL3NyYy9zZXJpYWxpemVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVdBO0lBQUE7SUFJQSxDQUFDO0lBQUQsNEJBQUM7QUFBRCxDQUFDLEFBSkQsSUFJQzs7QUFPRDtJQUFBO0lBbUNBLENBQUM7SUFqQ0MsZ0RBQVMsR0FBVCxVQUFVLFdBQWdDO1FBQ3hDLE9BQU87WUFDTCxJQUFJLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDO1lBQzNDLEdBQUcsRUFBRSxXQUFXLENBQUMsR0FBRztTQUNyQixDQUFDO0lBQ0osQ0FBQztJQUVPLHFEQUFjLEdBQXRCLFVBQ0UsS0FBNkI7UUFEL0IsaUJBeUJDO1FBdEJDLElBQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsS0FBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsRUFBdEIsQ0FBc0IsQ0FBQyxDQUFDO1FBQ2pFLE9BQU87WUFDTCxNQUFNLEVBQUUsS0FBSyxDQUFDLE1BQU07WUFDcEIsUUFBUSxFQUFFLEtBQUssQ0FBQyxRQUFRO1lBQ3hCLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSTtZQUNoQixHQUFHLEVBQUUsS0FBSyxDQUFDLEdBQUc7WUFDZCxNQUFNLEVBQUUsS0FBSyxDQUFDLE1BQU07WUFDcEIsV0FBVyxFQUFFO2dCQUNYLFNBQVMsRUFBRSxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsU0FBUzthQUN2RTtZQUNELFdBQVcsRUFBRSxLQUFLLENBQUMsV0FBVztZQUM5QixhQUFhLEVBQUUsS0FBSyxDQUFDLGFBQWE7WUFDbEMsUUFBUSxFQUFFLEtBQUssQ0FBQyxRQUFRO1lBQ3hCLFNBQVMsRUFBRSxDQUFDLEtBQUssQ0FBQyxXQUFXO2dCQUMzQixDQUFDLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxTQUFTO2dCQUM3QixDQUFDLENBQUMsU0FBUyxDQUFRO1lBQ3JCLElBQUksRUFBRSxTQUFnQjtZQUN0QixNQUFNLEVBQUUsU0FBZ0I7WUFDeEIsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDdkIsWUFBWSxFQUFFLFNBQWdCO1lBQzlCLFFBQVEsVUFBQTtTQUNULENBQUM7SUFDSixDQUFDO0lBQ0gsbUNBQUM7QUFBRCxDQUFDLEFBbkNELElBbUNDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWN0aXZhdGVkUm91dGVTbmFwc2hvdCwgUm91dGVyU3RhdGVTbmFwc2hvdCB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5cbi8qKlxuICogU2ltcGxlIHJvdXRlciBzdGF0ZS5cbiAqIEFsbCBjdXN0b20gcm91dGVyIHN0YXRlcyAvIHN0YXRlIHNlcmlhbGl6ZXJzIHNob3VsZCBoYXZlIGF0IGxlYXN0XG4gKiB0aGUgcHJvcGVydGllcyBvZiB0aGlzIGludGVyZmFjZS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBCYXNlUm91dGVyU3RvcmVTdGF0ZSB7XG4gIHVybDogc3RyaW5nO1xufVxuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgUm91dGVyU3RhdGVTZXJpYWxpemVyPFxuICBUIGV4dGVuZHMgQmFzZVJvdXRlclN0b3JlU3RhdGUgPSBCYXNlUm91dGVyU3RvcmVTdGF0ZVxuPiB7XG4gIGFic3RyYWN0IHNlcmlhbGl6ZShyb3V0ZXJTdGF0ZTogUm91dGVyU3RhdGVTbmFwc2hvdCk6IFQ7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgU2VyaWFsaXplZFJvdXRlclN0YXRlU25hcHNob3QgZXh0ZW5kcyBCYXNlUm91dGVyU3RvcmVTdGF0ZSB7XG4gIHJvb3Q6IEFjdGl2YXRlZFJvdXRlU25hcHNob3Q7XG4gIHVybDogc3RyaW5nO1xufVxuXG5leHBvcnQgY2xhc3MgRGVmYXVsdFJvdXRlclN0YXRlU2VyaWFsaXplclxuICBpbXBsZW1lbnRzIFJvdXRlclN0YXRlU2VyaWFsaXplcjxTZXJpYWxpemVkUm91dGVyU3RhdGVTbmFwc2hvdD4ge1xuICBzZXJpYWxpemUocm91dGVyU3RhdGU6IFJvdXRlclN0YXRlU25hcHNob3QpOiBTZXJpYWxpemVkUm91dGVyU3RhdGVTbmFwc2hvdCB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJvb3Q6IHRoaXMuc2VyaWFsaXplUm91dGUocm91dGVyU3RhdGUucm9vdCksXG4gICAgICB1cmw6IHJvdXRlclN0YXRlLnVybCxcbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSBzZXJpYWxpemVSb3V0ZShcbiAgICByb3V0ZTogQWN0aXZhdGVkUm91dGVTbmFwc2hvdFxuICApOiBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90IHtcbiAgICBjb25zdCBjaGlsZHJlbiA9IHJvdXRlLmNoaWxkcmVuLm1hcChjID0+IHRoaXMuc2VyaWFsaXplUm91dGUoYykpO1xuICAgIHJldHVybiB7XG4gICAgICBwYXJhbXM6IHJvdXRlLnBhcmFtcyxcbiAgICAgIHBhcmFtTWFwOiByb3V0ZS5wYXJhbU1hcCxcbiAgICAgIGRhdGE6IHJvdXRlLmRhdGEsXG4gICAgICB1cmw6IHJvdXRlLnVybCxcbiAgICAgIG91dGxldDogcm91dGUub3V0bGV0LFxuICAgICAgcm91dGVDb25maWc6IHtcbiAgICAgICAgY29tcG9uZW50OiByb3V0ZS5yb3V0ZUNvbmZpZyA/IHJvdXRlLnJvdXRlQ29uZmlnLmNvbXBvbmVudCA6IHVuZGVmaW5lZCxcbiAgICAgIH0sXG4gICAgICBxdWVyeVBhcmFtczogcm91dGUucXVlcnlQYXJhbXMsXG4gICAgICBxdWVyeVBhcmFtTWFwOiByb3V0ZS5xdWVyeVBhcmFtTWFwLFxuICAgICAgZnJhZ21lbnQ6IHJvdXRlLmZyYWdtZW50LFxuICAgICAgY29tcG9uZW50OiAocm91dGUucm91dGVDb25maWdcbiAgICAgICAgPyByb3V0ZS5yb3V0ZUNvbmZpZy5jb21wb25lbnRcbiAgICAgICAgOiB1bmRlZmluZWQpIGFzIGFueSxcbiAgICAgIHJvb3Q6IHVuZGVmaW5lZCBhcyBhbnksXG4gICAgICBwYXJlbnQ6IHVuZGVmaW5lZCBhcyBhbnksXG4gICAgICBmaXJzdENoaWxkOiBjaGlsZHJlblswXSxcbiAgICAgIHBhdGhGcm9tUm9vdDogdW5kZWZpbmVkIGFzIGFueSxcbiAgICAgIGNoaWxkcmVuLFxuICAgIH07XG4gIH1cbn1cbiJdfQ==