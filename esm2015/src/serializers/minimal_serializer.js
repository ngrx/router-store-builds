export class MinimalRouterStateSerializer {
    serialize(routerState) {
        return {
            root: this.serializeRoute(routerState.root),
            url: routerState.url,
        };
    }
    serializeRoute(route) {
        const children = route.children.map((c) => this.serializeRoute(c));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWluaW1hbF9zZXJpYWxpemVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9yb3V0ZXItc3RvcmUvc3JjL3NlcmlhbGl6ZXJzL21pbmltYWxfc2VyaWFsaXplci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFvQkEsTUFBTSxPQUFPLDRCQUE0QjtJQUV2QyxTQUFTLENBQUMsV0FBZ0M7UUFDeEMsT0FBTztZQUNMLElBQUksRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUM7WUFDM0MsR0FBRyxFQUFFLFdBQVcsQ0FBQyxHQUFHO1NBQ3JCLENBQUM7SUFDSixDQUFDO0lBRU8sY0FBYyxDQUNwQixLQUE2QjtRQUU3QixNQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ25FLE9BQU87WUFDTCxNQUFNLEVBQUUsS0FBSyxDQUFDLE1BQU07WUFDcEIsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJO1lBQ2hCLEdBQUcsRUFBRSxLQUFLLENBQUMsR0FBRztZQUNkLE1BQU0sRUFBRSxLQUFLLENBQUMsTUFBTTtZQUNwQixXQUFXLEVBQUUsS0FBSyxDQUFDLFdBQVc7Z0JBQzVCLENBQUMsQ0FBQztvQkFDRSxJQUFJLEVBQUUsS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJO29CQUM1QixTQUFTLEVBQUUsS0FBSyxDQUFDLFdBQVcsQ0FBQyxTQUFTO29CQUN0QyxVQUFVLEVBQUUsS0FBSyxDQUFDLFdBQVcsQ0FBQyxVQUFVO29CQUN4QyxNQUFNLEVBQUUsS0FBSyxDQUFDLFdBQVcsQ0FBQyxNQUFNO2lCQUNqQztnQkFDSCxDQUFDLENBQUMsSUFBSTtZQUNSLFdBQVcsRUFBRSxLQUFLLENBQUMsV0FBVztZQUM5QixRQUFRLEVBQUUsS0FBSyxDQUFDLFFBQVE7WUFDeEIsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDdkIsUUFBUTtTQUNULENBQUM7SUFDSixDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBSb3V0ZXJTdGF0ZVNuYXBzaG90LCBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90IH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IEJhc2VSb3V0ZXJTdG9yZVN0YXRlLCBSb3V0ZXJTdGF0ZVNlcmlhbGl6ZXIgfSBmcm9tICcuL2Jhc2UnO1xuXG5leHBvcnQgaW50ZXJmYWNlIE1pbmltYWxBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90IHtcbiAgcm91dGVDb25maWc6IEFjdGl2YXRlZFJvdXRlU25hcHNob3RbJ3JvdXRlQ29uZmlnJ107XG4gIHVybDogQWN0aXZhdGVkUm91dGVTbmFwc2hvdFsndXJsJ107XG4gIHBhcmFtczogQWN0aXZhdGVkUm91dGVTbmFwc2hvdFsncGFyYW1zJ107XG4gIHF1ZXJ5UGFyYW1zOiBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90WydxdWVyeVBhcmFtcyddO1xuICBmcmFnbWVudDogQWN0aXZhdGVkUm91dGVTbmFwc2hvdFsnZnJhZ21lbnQnXTtcbiAgZGF0YTogQWN0aXZhdGVkUm91dGVTbmFwc2hvdFsnZGF0YSddO1xuICBvdXRsZXQ6IEFjdGl2YXRlZFJvdXRlU25hcHNob3RbJ291dGxldCddO1xuICBmaXJzdENoaWxkPzogTWluaW1hbEFjdGl2YXRlZFJvdXRlU25hcHNob3Q7XG4gIGNoaWxkcmVuOiBNaW5pbWFsQWN0aXZhdGVkUm91dGVTbmFwc2hvdFtdO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE1pbmltYWxSb3V0ZXJTdGF0ZVNuYXBzaG90IGV4dGVuZHMgQmFzZVJvdXRlclN0b3JlU3RhdGUge1xuICByb290OiBNaW5pbWFsQWN0aXZhdGVkUm91dGVTbmFwc2hvdDtcbiAgdXJsOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBjbGFzcyBNaW5pbWFsUm91dGVyU3RhdGVTZXJpYWxpemVyXG4gIGltcGxlbWVudHMgUm91dGVyU3RhdGVTZXJpYWxpemVyPE1pbmltYWxSb3V0ZXJTdGF0ZVNuYXBzaG90PiB7XG4gIHNlcmlhbGl6ZShyb3V0ZXJTdGF0ZTogUm91dGVyU3RhdGVTbmFwc2hvdCk6IE1pbmltYWxSb3V0ZXJTdGF0ZVNuYXBzaG90IHtcbiAgICByZXR1cm4ge1xuICAgICAgcm9vdDogdGhpcy5zZXJpYWxpemVSb3V0ZShyb3V0ZXJTdGF0ZS5yb290KSxcbiAgICAgIHVybDogcm91dGVyU3RhdGUudXJsLFxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIHNlcmlhbGl6ZVJvdXRlKFxuICAgIHJvdXRlOiBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90XG4gICk6IE1pbmltYWxBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90IHtcbiAgICBjb25zdCBjaGlsZHJlbiA9IHJvdXRlLmNoaWxkcmVuLm1hcCgoYykgPT4gdGhpcy5zZXJpYWxpemVSb3V0ZShjKSk7XG4gICAgcmV0dXJuIHtcbiAgICAgIHBhcmFtczogcm91dGUucGFyYW1zLFxuICAgICAgZGF0YTogcm91dGUuZGF0YSxcbiAgICAgIHVybDogcm91dGUudXJsLFxuICAgICAgb3V0bGV0OiByb3V0ZS5vdXRsZXQsXG4gICAgICByb3V0ZUNvbmZpZzogcm91dGUucm91dGVDb25maWdcbiAgICAgICAgPyB7XG4gICAgICAgICAgICBwYXRoOiByb3V0ZS5yb3V0ZUNvbmZpZy5wYXRoLFxuICAgICAgICAgICAgcGF0aE1hdGNoOiByb3V0ZS5yb3V0ZUNvbmZpZy5wYXRoTWF0Y2gsXG4gICAgICAgICAgICByZWRpcmVjdFRvOiByb3V0ZS5yb3V0ZUNvbmZpZy5yZWRpcmVjdFRvLFxuICAgICAgICAgICAgb3V0bGV0OiByb3V0ZS5yb3V0ZUNvbmZpZy5vdXRsZXQsXG4gICAgICAgICAgfVxuICAgICAgICA6IG51bGwsXG4gICAgICBxdWVyeVBhcmFtczogcm91dGUucXVlcnlQYXJhbXMsXG4gICAgICBmcmFnbWVudDogcm91dGUuZnJhZ21lbnQsXG4gICAgICBmaXJzdENoaWxkOiBjaGlsZHJlblswXSxcbiAgICAgIGNoaWxkcmVuLFxuICAgIH07XG4gIH1cbn1cbiJdfQ==