import { createFeatureSelector, createSelector, } from '@ngrx/store';
import { DEFAULT_ROUTER_FEATURENAME } from './router_store_module';
export function createRouterSelector() {
    return createFeatureSelector(DEFAULT_ROUTER_FEATURENAME);
}
export function getSelectors(selectState = createRouterSelector()) {
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
    const selectUrl = createSelector(selectRouterState, (routerState) => routerState && routerState.url);
    return {
        selectCurrentRoute,
        selectFragment,
        selectQueryParams,
        selectQueryParam,
        selectRouteParams,
        selectRouteParam,
        selectRouteData,
        selectUrl,
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyX3NlbGVjdG9ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL21vZHVsZXMvcm91dGVyLXN0b3JlL3NyYy9yb3V0ZXJfc2VsZWN0b3JzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCxxQkFBcUIsRUFDckIsY0FBYyxHQUVmLE1BQU0sYUFBYSxDQUFDO0FBR3JCLE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBRW5FLE1BQU0sVUFBVSxvQkFBb0I7SUFJbEMsT0FBTyxxQkFBcUIsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO0FBQzNELENBQUM7QUFFRCxNQUFNLFVBQVUsWUFBWSxDQUMxQixjQUFxRCxvQkFBb0IsRUFBSztJQUU5RSxNQUFNLGlCQUFpQixHQUFHLGNBQWMsQ0FDdEMsV0FBVyxFQUNYLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLEtBQUssQ0FDbkMsQ0FBQztJQUNGLE1BQU0sZUFBZSxHQUFHLGNBQWMsQ0FDcEMsaUJBQWlCLEVBQ2pCLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxXQUFXLElBQUksV0FBVyxDQUFDLElBQUksQ0FDakQsQ0FBQztJQUNGLE1BQU0sa0JBQWtCLEdBQUcsY0FBYyxDQUFDLGVBQWUsRUFBRSxDQUFDLFNBQVMsRUFBRSxFQUFFO1FBQ3ZFLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDZCxPQUFPLFNBQVMsQ0FBQztTQUNsQjtRQUNELElBQUksS0FBSyxHQUFHLFNBQVMsQ0FBQztRQUN0QixPQUFPLEtBQUssQ0FBQyxVQUFVLEVBQUU7WUFDdkIsS0FBSyxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUM7U0FDMUI7UUFDRCxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUMsQ0FBQyxDQUFDO0lBQ0gsTUFBTSxjQUFjLEdBQUcsY0FBYyxDQUNuQyxlQUFlLEVBQ2YsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsUUFBUSxDQUNuQyxDQUFDO0lBQ0YsTUFBTSxpQkFBaUIsR0FBRyxjQUFjLENBQ3RDLGVBQWUsRUFDZixDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQyxXQUFXLENBQ3RDLENBQUM7SUFDRixNQUFNLGdCQUFnQixHQUFHLENBQUMsS0FBYSxFQUFFLEVBQUUsQ0FDekMsY0FBYyxDQUFDLGlCQUFpQixFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDekUsTUFBTSxpQkFBaUIsR0FBRyxjQUFjLENBQ3RDLGtCQUFrQixFQUNsQixDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQ2pDLENBQUM7SUFDRixNQUFNLGdCQUFnQixHQUFHLENBQUMsS0FBYSxFQUFFLEVBQUUsQ0FDekMsY0FBYyxDQUFDLGlCQUFpQixFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDekUsTUFBTSxlQUFlLEdBQUcsY0FBYyxDQUNwQyxrQkFBa0IsRUFDbEIsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsSUFBSSxDQUMvQixDQUFDO0lBQ0YsTUFBTSxTQUFTLEdBQUcsY0FBYyxDQUM5QixpQkFBaUIsRUFDakIsQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLFdBQVcsSUFBSSxXQUFXLENBQUMsR0FBRyxDQUNoRCxDQUFDO0lBRUYsT0FBTztRQUNMLGtCQUFrQjtRQUNsQixjQUFjO1FBQ2QsaUJBQWlCO1FBQ2pCLGdCQUFnQjtRQUNoQixpQkFBaUI7UUFDakIsZ0JBQWdCO1FBQ2hCLGVBQWU7UUFDZixTQUFTO0tBQ1YsQ0FBQztBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBjcmVhdGVGZWF0dXJlU2VsZWN0b3IsXG4gIGNyZWF0ZVNlbGVjdG9yLFxuICBNZW1vaXplZFNlbGVjdG9yLFxufSBmcm9tICdAbmdyeC9zdG9yZSc7XG5pbXBvcnQgeyBSb3V0ZXJTdGF0ZVNlbGVjdG9ycyB9IGZyb20gJy4vbW9kZWxzJztcbmltcG9ydCB7IFJvdXRlclJlZHVjZXJTdGF0ZSB9IGZyb20gJy4vcmVkdWNlcic7XG5pbXBvcnQgeyBERUZBVUxUX1JPVVRFUl9GRUFUVVJFTkFNRSB9IGZyb20gJy4vcm91dGVyX3N0b3JlX21vZHVsZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVSb3V0ZXJTZWxlY3RvcjxTdGF0ZSBleHRlbmRzIFJlY29yZDxzdHJpbmcsIGFueT4+KCk6IE1lbW9pemVkU2VsZWN0b3I8XG4gIFN0YXRlLFxuICBSb3V0ZXJSZWR1Y2VyU3RhdGVcbj4ge1xuICByZXR1cm4gY3JlYXRlRmVhdHVyZVNlbGVjdG9yKERFRkFVTFRfUk9VVEVSX0ZFQVRVUkVOQU1FKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFNlbGVjdG9yczxWPihcbiAgc2VsZWN0U3RhdGU6IChzdGF0ZTogVikgPT4gUm91dGVyUmVkdWNlclN0YXRlPGFueT4gPSBjcmVhdGVSb3V0ZXJTZWxlY3RvcjxWPigpXG4pOiBSb3V0ZXJTdGF0ZVNlbGVjdG9yczxWPiB7XG4gIGNvbnN0IHNlbGVjdFJvdXRlclN0YXRlID0gY3JlYXRlU2VsZWN0b3IoXG4gICAgc2VsZWN0U3RhdGUsXG4gICAgKHJvdXRlcikgPT4gcm91dGVyICYmIHJvdXRlci5zdGF0ZVxuICApO1xuICBjb25zdCBzZWxlY3RSb290Um91dGUgPSBjcmVhdGVTZWxlY3RvcihcbiAgICBzZWxlY3RSb3V0ZXJTdGF0ZSxcbiAgICAocm91dGVyU3RhdGUpID0+IHJvdXRlclN0YXRlICYmIHJvdXRlclN0YXRlLnJvb3RcbiAgKTtcbiAgY29uc3Qgc2VsZWN0Q3VycmVudFJvdXRlID0gY3JlYXRlU2VsZWN0b3Ioc2VsZWN0Um9vdFJvdXRlLCAocm9vdFJvdXRlKSA9PiB7XG4gICAgaWYgKCFyb290Um91dGUpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIGxldCByb3V0ZSA9IHJvb3RSb3V0ZTtcbiAgICB3aGlsZSAocm91dGUuZmlyc3RDaGlsZCkge1xuICAgICAgcm91dGUgPSByb3V0ZS5maXJzdENoaWxkO1xuICAgIH1cbiAgICByZXR1cm4gcm91dGU7XG4gIH0pO1xuICBjb25zdCBzZWxlY3RGcmFnbWVudCA9IGNyZWF0ZVNlbGVjdG9yKFxuICAgIHNlbGVjdFJvb3RSb3V0ZSxcbiAgICAocm91dGUpID0+IHJvdXRlICYmIHJvdXRlLmZyYWdtZW50XG4gICk7XG4gIGNvbnN0IHNlbGVjdFF1ZXJ5UGFyYW1zID0gY3JlYXRlU2VsZWN0b3IoXG4gICAgc2VsZWN0Um9vdFJvdXRlLFxuICAgIChyb3V0ZSkgPT4gcm91dGUgJiYgcm91dGUucXVlcnlQYXJhbXNcbiAgKTtcbiAgY29uc3Qgc2VsZWN0UXVlcnlQYXJhbSA9IChwYXJhbTogc3RyaW5nKSA9PlxuICAgIGNyZWF0ZVNlbGVjdG9yKHNlbGVjdFF1ZXJ5UGFyYW1zLCAocGFyYW1zKSA9PiBwYXJhbXMgJiYgcGFyYW1zW3BhcmFtXSk7XG4gIGNvbnN0IHNlbGVjdFJvdXRlUGFyYW1zID0gY3JlYXRlU2VsZWN0b3IoXG4gICAgc2VsZWN0Q3VycmVudFJvdXRlLFxuICAgIChyb3V0ZSkgPT4gcm91dGUgJiYgcm91dGUucGFyYW1zXG4gICk7XG4gIGNvbnN0IHNlbGVjdFJvdXRlUGFyYW0gPSAocGFyYW06IHN0cmluZykgPT5cbiAgICBjcmVhdGVTZWxlY3RvcihzZWxlY3RSb3V0ZVBhcmFtcywgKHBhcmFtcykgPT4gcGFyYW1zICYmIHBhcmFtc1twYXJhbV0pO1xuICBjb25zdCBzZWxlY3RSb3V0ZURhdGEgPSBjcmVhdGVTZWxlY3RvcihcbiAgICBzZWxlY3RDdXJyZW50Um91dGUsXG4gICAgKHJvdXRlKSA9PiByb3V0ZSAmJiByb3V0ZS5kYXRhXG4gICk7XG4gIGNvbnN0IHNlbGVjdFVybCA9IGNyZWF0ZVNlbGVjdG9yKFxuICAgIHNlbGVjdFJvdXRlclN0YXRlLFxuICAgIChyb3V0ZXJTdGF0ZSkgPT4gcm91dGVyU3RhdGUgJiYgcm91dGVyU3RhdGUudXJsXG4gICk7XG5cbiAgcmV0dXJuIHtcbiAgICBzZWxlY3RDdXJyZW50Um91dGUsXG4gICAgc2VsZWN0RnJhZ21lbnQsXG4gICAgc2VsZWN0UXVlcnlQYXJhbXMsXG4gICAgc2VsZWN0UXVlcnlQYXJhbSxcbiAgICBzZWxlY3RSb3V0ZVBhcmFtcyxcbiAgICBzZWxlY3RSb3V0ZVBhcmFtLFxuICAgIHNlbGVjdFJvdXRlRGF0YSxcbiAgICBzZWxlY3RVcmwsXG4gIH07XG59XG4iXX0=