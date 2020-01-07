/**
 * @fileoverview added by tsickle
 * Generated from: modules/router-store/src/router_selectors.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { createSelector } from '@ngrx/store';
/**
 * @template V
 * @param {?} selectState
 * @return {?}
 */
export function getSelectors(selectState) {
    /** @type {?} */
    const selectRouterState = createSelector(selectState, (/**
     * @param {?} router
     * @return {?}
     */
    router => router && router.state));
    /** @type {?} */
    const selectCurrentRoute = createSelector(selectRouterState, (/**
     * @param {?} routerState
     * @return {?}
     */
    routerState => {
        if (!routerState) {
            return undefined;
        }
        /** @type {?} */
        let route = routerState.root;
        while (route.firstChild) {
            route = route.firstChild;
        }
        return route;
    }));
    /** @type {?} */
    const selectQueryParams = createSelector(selectCurrentRoute, (/**
     * @param {?} route
     * @return {?}
     */
    route => route && route.queryParams));
    /** @type {?} */
    const selectQueryParam = (/**
     * @param {?} param
     * @return {?}
     */
    (param) => createSelector(selectQueryParams, (/**
     * @param {?} params
     * @return {?}
     */
    params => params && params[param])));
    /** @type {?} */
    const selectRouteParams = createSelector(selectCurrentRoute, (/**
     * @param {?} route
     * @return {?}
     */
    route => route && route.params));
    /** @type {?} */
    const selectRouteParam = (/**
     * @param {?} param
     * @return {?}
     */
    (param) => createSelector(selectRouteParams, (/**
     * @param {?} params
     * @return {?}
     */
    params => params && params[param])));
    /** @type {?} */
    const selectRouteData = createSelector(selectCurrentRoute, (/**
     * @param {?} route
     * @return {?}
     */
    route => route && route.data));
    /** @type {?} */
    const selectUrl = createSelector(selectRouterState, (/**
     * @param {?} routerState
     * @return {?}
     */
    routerState => routerState && routerState.url));
    return {
        selectCurrentRoute,
        selectQueryParams,
        selectQueryParam,
        selectRouteParams,
        selectRouteParam,
        selectRouteData,
        selectUrl,
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyX3NlbGVjdG9ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvcm91dGVyLXN0b3JlL3NyYy9yb3V0ZXJfc2VsZWN0b3JzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLGFBQWEsQ0FBQzs7Ozs7O0FBTzdDLE1BQU0sVUFBVSxZQUFZLENBQzFCLFdBQWtEOztVQUU1QyxpQkFBaUIsR0FBRyxjQUFjLENBQ3RDLFdBQVc7Ozs7SUFDWCxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsS0FBSyxFQUNqQzs7VUFDSyxrQkFBa0IsR0FBRyxjQUFjLENBQUMsaUJBQWlCOzs7O0lBQUUsV0FBVyxDQUFDLEVBQUU7UUFDekUsSUFBSSxDQUFDLFdBQVcsRUFBRTtZQUNoQixPQUFPLFNBQVMsQ0FBQztTQUNsQjs7WUFDRyxLQUFLLEdBQUcsV0FBVyxDQUFDLElBQUk7UUFDNUIsT0FBTyxLQUFLLENBQUMsVUFBVSxFQUFFO1lBQ3ZCLEtBQUssR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDO1NBQzFCO1FBQ0QsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDLEVBQUM7O1VBQ0ksaUJBQWlCLEdBQUcsY0FBYyxDQUN0QyxrQkFBa0I7Ozs7SUFDbEIsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDLFdBQVcsRUFDcEM7O1VBQ0ssZ0JBQWdCOzs7O0lBQUcsQ0FBQyxLQUFhLEVBQUUsRUFBRSxDQUN6QyxjQUFjLENBQUMsaUJBQWlCOzs7O0lBQUUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFDLENBQUE7O1VBQ2hFLGlCQUFpQixHQUFHLGNBQWMsQ0FDdEMsa0JBQWtCOzs7O0lBQ2xCLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQy9COztVQUNLLGdCQUFnQjs7OztJQUFHLENBQUMsS0FBYSxFQUFFLEVBQUUsQ0FDekMsY0FBYyxDQUFDLGlCQUFpQjs7OztJQUFFLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBQyxDQUFBOztVQUNoRSxlQUFlLEdBQUcsY0FBYyxDQUNwQyxrQkFBa0I7Ozs7SUFDbEIsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDLElBQUksRUFDN0I7O1VBQ0ssU0FBUyxHQUFHLGNBQWMsQ0FDOUIsaUJBQWlCOzs7O0lBQ2pCLFdBQVcsQ0FBQyxFQUFFLENBQUMsV0FBVyxJQUFJLFdBQVcsQ0FBQyxHQUFHLEVBQzlDO0lBRUQsT0FBTztRQUNMLGtCQUFrQjtRQUNsQixpQkFBaUI7UUFDakIsZ0JBQWdCO1FBQ2hCLGlCQUFpQjtRQUNqQixnQkFBZ0I7UUFDaEIsZUFBZTtRQUNmLFNBQVM7S0FDVixDQUFDO0FBQ0osQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNyZWF0ZVNlbGVjdG9yIH0gZnJvbSAnQG5ncngvc3RvcmUnO1xuaW1wb3J0IHsgUm91dGVyU3RhdGVTZWxlY3RvcnMgfSBmcm9tICcuL21vZGVscyc7XG5pbXBvcnQgeyBSb3V0ZXJSZWR1Y2VyU3RhdGUgfSBmcm9tICcuL3JlZHVjZXInO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2VsZWN0b3JzPFY+KFxuICBzZWxlY3RTdGF0ZTogKHN0YXRlOiBWKSA9PiBSb3V0ZXJSZWR1Y2VyU3RhdGU8YW55PlxuKTogUm91dGVyU3RhdGVTZWxlY3RvcnM8Vj47XG5leHBvcnQgZnVuY3Rpb24gZ2V0U2VsZWN0b3JzPFY+KFxuICBzZWxlY3RTdGF0ZTogKHN0YXRlOiBWKSA9PiBSb3V0ZXJSZWR1Y2VyU3RhdGU8YW55PlxuKTogUm91dGVyU3RhdGVTZWxlY3RvcnM8Vj4ge1xuICBjb25zdCBzZWxlY3RSb3V0ZXJTdGF0ZSA9IGNyZWF0ZVNlbGVjdG9yKFxuICAgIHNlbGVjdFN0YXRlLFxuICAgIHJvdXRlciA9PiByb3V0ZXIgJiYgcm91dGVyLnN0YXRlXG4gICk7XG4gIGNvbnN0IHNlbGVjdEN1cnJlbnRSb3V0ZSA9IGNyZWF0ZVNlbGVjdG9yKHNlbGVjdFJvdXRlclN0YXRlLCByb3V0ZXJTdGF0ZSA9PiB7XG4gICAgaWYgKCFyb3V0ZXJTdGF0ZSkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgbGV0IHJvdXRlID0gcm91dGVyU3RhdGUucm9vdDtcbiAgICB3aGlsZSAocm91dGUuZmlyc3RDaGlsZCkge1xuICAgICAgcm91dGUgPSByb3V0ZS5maXJzdENoaWxkO1xuICAgIH1cbiAgICByZXR1cm4gcm91dGU7XG4gIH0pO1xuICBjb25zdCBzZWxlY3RRdWVyeVBhcmFtcyA9IGNyZWF0ZVNlbGVjdG9yKFxuICAgIHNlbGVjdEN1cnJlbnRSb3V0ZSxcbiAgICByb3V0ZSA9PiByb3V0ZSAmJiByb3V0ZS5xdWVyeVBhcmFtc1xuICApO1xuICBjb25zdCBzZWxlY3RRdWVyeVBhcmFtID0gKHBhcmFtOiBzdHJpbmcpID0+XG4gICAgY3JlYXRlU2VsZWN0b3Ioc2VsZWN0UXVlcnlQYXJhbXMsIHBhcmFtcyA9PiBwYXJhbXMgJiYgcGFyYW1zW3BhcmFtXSk7XG4gIGNvbnN0IHNlbGVjdFJvdXRlUGFyYW1zID0gY3JlYXRlU2VsZWN0b3IoXG4gICAgc2VsZWN0Q3VycmVudFJvdXRlLFxuICAgIHJvdXRlID0+IHJvdXRlICYmIHJvdXRlLnBhcmFtc1xuICApO1xuICBjb25zdCBzZWxlY3RSb3V0ZVBhcmFtID0gKHBhcmFtOiBzdHJpbmcpID0+XG4gICAgY3JlYXRlU2VsZWN0b3Ioc2VsZWN0Um91dGVQYXJhbXMsIHBhcmFtcyA9PiBwYXJhbXMgJiYgcGFyYW1zW3BhcmFtXSk7XG4gIGNvbnN0IHNlbGVjdFJvdXRlRGF0YSA9IGNyZWF0ZVNlbGVjdG9yKFxuICAgIHNlbGVjdEN1cnJlbnRSb3V0ZSxcbiAgICByb3V0ZSA9PiByb3V0ZSAmJiByb3V0ZS5kYXRhXG4gICk7XG4gIGNvbnN0IHNlbGVjdFVybCA9IGNyZWF0ZVNlbGVjdG9yKFxuICAgIHNlbGVjdFJvdXRlclN0YXRlLFxuICAgIHJvdXRlclN0YXRlID0+IHJvdXRlclN0YXRlICYmIHJvdXRlclN0YXRlLnVybFxuICApO1xuXG4gIHJldHVybiB7XG4gICAgc2VsZWN0Q3VycmVudFJvdXRlLFxuICAgIHNlbGVjdFF1ZXJ5UGFyYW1zLFxuICAgIHNlbGVjdFF1ZXJ5UGFyYW0sXG4gICAgc2VsZWN0Um91dGVQYXJhbXMsXG4gICAgc2VsZWN0Um91dGVQYXJhbSxcbiAgICBzZWxlY3RSb3V0ZURhdGEsXG4gICAgc2VsZWN0VXJsLFxuICB9O1xufVxuIl19