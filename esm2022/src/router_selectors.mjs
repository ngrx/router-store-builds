import { createFeatureSelector, createSelector, } from '@ngrx/store';
import { DEFAULT_ROUTER_FEATURENAME } from './router_store_config';
export function createRouterSelector() {
    return createFeatureSelector(DEFAULT_ROUTER_FEATURENAME);
}
export function getRouterSelectors(selectState = createRouterSelector()) {
    const selectRouterState = createSelector(selectState, (router) => router && router.state);
    const selectRootRoute = createSelector(selectRouterState, (routerState) => routerState && routerState.root);
    const selectCurrentRoute = createSelector(selectRootRoute, (rootRoute) => {
        if (!rootRoute) {
            return undefined;
        }
        let route = rootRoute;
        while (route.firstChild) {
            route = route.firstChild;
        }
        return route;
    });
    const selectFragment = createSelector(selectRootRoute, (route) => route && route.fragment);
    const selectQueryParams = createSelector(selectRootRoute, (route) => route && route.queryParams);
    const selectQueryParam = (param) => createSelector(selectQueryParams, (params) => params && params[param]);
    const selectRouteParams = createSelector(selectCurrentRoute, (route) => route && route.params);
    const selectRouteParam = (param) => createSelector(selectRouteParams, (params) => params && params[param]);
    const selectRouteData = createSelector(selectCurrentRoute, (route) => route && route.data);
    const selectRouteDataParam = (param) => createSelector(selectRouteData, (data) => data && data[param]);
    const selectUrl = createSelector(selectRouterState, (routerState) => routerState && routerState.url);
    const selectTitle = createSelector(selectCurrentRoute, (route) => {
        if (!route?.routeConfig) {
            return undefined;
        }
        return typeof route.routeConfig.title === 'string'
            ? route.routeConfig.title // static title
            : route.title; // resolved title
    });
    return {
        selectCurrentRoute,
        selectFragment,
        selectQueryParams,
        selectQueryParam,
        selectRouteParams,
        selectRouteParam,
        selectRouteData,
        selectRouteDataParam,
        selectUrl,
        selectTitle,
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyX3NlbGVjdG9ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL21vZHVsZXMvcm91dGVyLXN0b3JlL3NyYy9yb3V0ZXJfc2VsZWN0b3JzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCxxQkFBcUIsRUFDckIsY0FBYyxHQUVmLE1BQU0sYUFBYSxDQUFDO0FBR3JCLE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBRW5FLE1BQU0sVUFBVSxvQkFBb0I7SUFHbEMsT0FBTyxxQkFBcUIsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO0FBQzNELENBQUM7QUFFRCxNQUFNLFVBQVUsa0JBQWtCLENBQ2hDLGNBQXFELG9CQUFvQixFQUFLO0lBRTlFLE1BQU0saUJBQWlCLEdBQUcsY0FBYyxDQUN0QyxXQUFXLEVBQ1gsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsS0FBSyxDQUNuQyxDQUFDO0lBQ0YsTUFBTSxlQUFlLEdBQUcsY0FBYyxDQUNwQyxpQkFBaUIsRUFDakIsQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLFdBQVcsSUFBSSxXQUFXLENBQUMsSUFBSSxDQUNqRCxDQUFDO0lBQ0YsTUFBTSxrQkFBa0IsR0FBRyxjQUFjLENBQUMsZUFBZSxFQUFFLENBQUMsU0FBUyxFQUFFLEVBQUU7UUFDdkUsSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNkLE9BQU8sU0FBUyxDQUFDO1NBQ2xCO1FBQ0QsSUFBSSxLQUFLLEdBQUcsU0FBUyxDQUFDO1FBQ3RCLE9BQU8sS0FBSyxDQUFDLFVBQVUsRUFBRTtZQUN2QixLQUFLLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQztTQUMxQjtRQUNELE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQyxDQUFDLENBQUM7SUFDSCxNQUFNLGNBQWMsR0FBRyxjQUFjLENBQ25DLGVBQWUsRUFDZixDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQ25DLENBQUM7SUFDRixNQUFNLGlCQUFpQixHQUFHLGNBQWMsQ0FDdEMsZUFBZSxFQUNmLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDLFdBQVcsQ0FDdEMsQ0FBQztJQUNGLE1BQU0sZ0JBQWdCLEdBQUcsQ0FBQyxLQUFhLEVBQUUsRUFBRSxDQUN6QyxjQUFjLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUN6RSxNQUFNLGlCQUFpQixHQUFHLGNBQWMsQ0FDdEMsa0JBQWtCLEVBQ2xCLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FDakMsQ0FBQztJQUNGLE1BQU0sZ0JBQWdCLEdBQUcsQ0FBQyxLQUFhLEVBQUUsRUFBRSxDQUN6QyxjQUFjLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUN6RSxNQUFNLGVBQWUsR0FBRyxjQUFjLENBQ3BDLGtCQUFrQixFQUNsQixDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQy9CLENBQUM7SUFDRixNQUFNLG9CQUFvQixHQUFHLENBQUMsS0FBYSxFQUFFLEVBQUUsQ0FDN0MsY0FBYyxDQUFDLGVBQWUsRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ2pFLE1BQU0sU0FBUyxHQUFHLGNBQWMsQ0FDOUIsaUJBQWlCLEVBQ2pCLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxXQUFXLElBQUksV0FBVyxDQUFDLEdBQUcsQ0FDaEQsQ0FBQztJQUNGLE1BQU0sV0FBVyxHQUFHLGNBQWMsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFO1FBQy9ELElBQUksQ0FBQyxLQUFLLEVBQUUsV0FBVyxFQUFFO1lBQ3ZCLE9BQU8sU0FBUyxDQUFDO1NBQ2xCO1FBQ0QsT0FBTyxPQUFPLEtBQUssQ0FBQyxXQUFXLENBQUMsS0FBSyxLQUFLLFFBQVE7WUFDaEQsQ0FBQyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLGVBQWU7WUFDekMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxpQkFBaUI7SUFDcEMsQ0FBQyxDQUFDLENBQUM7SUFFSCxPQUFPO1FBQ0wsa0JBQWtCO1FBQ2xCLGNBQWM7UUFDZCxpQkFBaUI7UUFDakIsZ0JBQWdCO1FBQ2hCLGlCQUFpQjtRQUNqQixnQkFBZ0I7UUFDaEIsZUFBZTtRQUNmLG9CQUFvQjtRQUNwQixTQUFTO1FBQ1QsV0FBVztLQUNaLENBQUM7QUFDSixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgY3JlYXRlRmVhdHVyZVNlbGVjdG9yLFxuICBjcmVhdGVTZWxlY3RvcixcbiAgTWVtb2l6ZWRTZWxlY3Rvcixcbn0gZnJvbSAnQG5ncngvc3RvcmUnO1xuaW1wb3J0IHsgUm91dGVyU3RhdGVTZWxlY3RvcnMgfSBmcm9tICcuL21vZGVscyc7XG5pbXBvcnQgeyBSb3V0ZXJSZWR1Y2VyU3RhdGUgfSBmcm9tICcuL3JlZHVjZXInO1xuaW1wb3J0IHsgREVGQVVMVF9ST1VURVJfRkVBVFVSRU5BTUUgfSBmcm9tICcuL3JvdXRlcl9zdG9yZV9jb25maWcnO1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlUm91dGVyU2VsZWN0b3I8XG4gIFN0YXRlIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgYW55PlxuPigpOiBNZW1vaXplZFNlbGVjdG9yPFN0YXRlLCBSb3V0ZXJSZWR1Y2VyU3RhdGU+IHtcbiAgcmV0dXJuIGNyZWF0ZUZlYXR1cmVTZWxlY3RvcihERUZBVUxUX1JPVVRFUl9GRUFUVVJFTkFNRSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRSb3V0ZXJTZWxlY3RvcnM8ViBleHRlbmRzIFJlY29yZDxzdHJpbmcsIGFueT4+KFxuICBzZWxlY3RTdGF0ZTogKHN0YXRlOiBWKSA9PiBSb3V0ZXJSZWR1Y2VyU3RhdGU8YW55PiA9IGNyZWF0ZVJvdXRlclNlbGVjdG9yPFY+KClcbik6IFJvdXRlclN0YXRlU2VsZWN0b3JzPFY+IHtcbiAgY29uc3Qgc2VsZWN0Um91dGVyU3RhdGUgPSBjcmVhdGVTZWxlY3RvcihcbiAgICBzZWxlY3RTdGF0ZSxcbiAgICAocm91dGVyKSA9PiByb3V0ZXIgJiYgcm91dGVyLnN0YXRlXG4gICk7XG4gIGNvbnN0IHNlbGVjdFJvb3RSb3V0ZSA9IGNyZWF0ZVNlbGVjdG9yKFxuICAgIHNlbGVjdFJvdXRlclN0YXRlLFxuICAgIChyb3V0ZXJTdGF0ZSkgPT4gcm91dGVyU3RhdGUgJiYgcm91dGVyU3RhdGUucm9vdFxuICApO1xuICBjb25zdCBzZWxlY3RDdXJyZW50Um91dGUgPSBjcmVhdGVTZWxlY3RvcihzZWxlY3RSb290Um91dGUsIChyb290Um91dGUpID0+IHtcbiAgICBpZiAoIXJvb3RSb3V0ZSkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgbGV0IHJvdXRlID0gcm9vdFJvdXRlO1xuICAgIHdoaWxlIChyb3V0ZS5maXJzdENoaWxkKSB7XG4gICAgICByb3V0ZSA9IHJvdXRlLmZpcnN0Q2hpbGQ7XG4gICAgfVxuICAgIHJldHVybiByb3V0ZTtcbiAgfSk7XG4gIGNvbnN0IHNlbGVjdEZyYWdtZW50ID0gY3JlYXRlU2VsZWN0b3IoXG4gICAgc2VsZWN0Um9vdFJvdXRlLFxuICAgIChyb3V0ZSkgPT4gcm91dGUgJiYgcm91dGUuZnJhZ21lbnRcbiAgKTtcbiAgY29uc3Qgc2VsZWN0UXVlcnlQYXJhbXMgPSBjcmVhdGVTZWxlY3RvcihcbiAgICBzZWxlY3RSb290Um91dGUsXG4gICAgKHJvdXRlKSA9PiByb3V0ZSAmJiByb3V0ZS5xdWVyeVBhcmFtc1xuICApO1xuICBjb25zdCBzZWxlY3RRdWVyeVBhcmFtID0gKHBhcmFtOiBzdHJpbmcpID0+XG4gICAgY3JlYXRlU2VsZWN0b3Ioc2VsZWN0UXVlcnlQYXJhbXMsIChwYXJhbXMpID0+IHBhcmFtcyAmJiBwYXJhbXNbcGFyYW1dKTtcbiAgY29uc3Qgc2VsZWN0Um91dGVQYXJhbXMgPSBjcmVhdGVTZWxlY3RvcihcbiAgICBzZWxlY3RDdXJyZW50Um91dGUsXG4gICAgKHJvdXRlKSA9PiByb3V0ZSAmJiByb3V0ZS5wYXJhbXNcbiAgKTtcbiAgY29uc3Qgc2VsZWN0Um91dGVQYXJhbSA9IChwYXJhbTogc3RyaW5nKSA9PlxuICAgIGNyZWF0ZVNlbGVjdG9yKHNlbGVjdFJvdXRlUGFyYW1zLCAocGFyYW1zKSA9PiBwYXJhbXMgJiYgcGFyYW1zW3BhcmFtXSk7XG4gIGNvbnN0IHNlbGVjdFJvdXRlRGF0YSA9IGNyZWF0ZVNlbGVjdG9yKFxuICAgIHNlbGVjdEN1cnJlbnRSb3V0ZSxcbiAgICAocm91dGUpID0+IHJvdXRlICYmIHJvdXRlLmRhdGFcbiAgKTtcbiAgY29uc3Qgc2VsZWN0Um91dGVEYXRhUGFyYW0gPSAocGFyYW06IHN0cmluZykgPT5cbiAgICBjcmVhdGVTZWxlY3RvcihzZWxlY3RSb3V0ZURhdGEsIChkYXRhKSA9PiBkYXRhICYmIGRhdGFbcGFyYW1dKTtcbiAgY29uc3Qgc2VsZWN0VXJsID0gY3JlYXRlU2VsZWN0b3IoXG4gICAgc2VsZWN0Um91dGVyU3RhdGUsXG4gICAgKHJvdXRlclN0YXRlKSA9PiByb3V0ZXJTdGF0ZSAmJiByb3V0ZXJTdGF0ZS51cmxcbiAgKTtcbiAgY29uc3Qgc2VsZWN0VGl0bGUgPSBjcmVhdGVTZWxlY3RvcihzZWxlY3RDdXJyZW50Um91dGUsIChyb3V0ZSkgPT4ge1xuICAgIGlmICghcm91dGU/LnJvdXRlQ29uZmlnKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICByZXR1cm4gdHlwZW9mIHJvdXRlLnJvdXRlQ29uZmlnLnRpdGxlID09PSAnc3RyaW5nJ1xuICAgICAgPyByb3V0ZS5yb3V0ZUNvbmZpZy50aXRsZSAvLyBzdGF0aWMgdGl0bGVcbiAgICAgIDogcm91dGUudGl0bGU7IC8vIHJlc29sdmVkIHRpdGxlXG4gIH0pO1xuXG4gIHJldHVybiB7XG4gICAgc2VsZWN0Q3VycmVudFJvdXRlLFxuICAgIHNlbGVjdEZyYWdtZW50LFxuICAgIHNlbGVjdFF1ZXJ5UGFyYW1zLFxuICAgIHNlbGVjdFF1ZXJ5UGFyYW0sXG4gICAgc2VsZWN0Um91dGVQYXJhbXMsXG4gICAgc2VsZWN0Um91dGVQYXJhbSxcbiAgICBzZWxlY3RSb3V0ZURhdGEsXG4gICAgc2VsZWN0Um91dGVEYXRhUGFyYW0sXG4gICAgc2VsZWN0VXJsLFxuICAgIHNlbGVjdFRpdGxlLFxuICB9O1xufVxuIl19