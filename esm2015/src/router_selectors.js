/**
 * @fileoverview added by tsickle
 * Generated from: src/router_selectors.ts
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
    (router) => router && router.state));
    /** @type {?} */
    const selectRootRoute = createSelector(selectRouterState, (/**
     * @param {?} routerState
     * @return {?}
     */
    (routerState) => routerState && routerState.root));
    /** @type {?} */
    const selectCurrentRoute = createSelector(selectRootRoute, (/**
     * @param {?} rootRoute
     * @return {?}
     */
    (rootRoute) => {
        if (!rootRoute) {
            return undefined;
        }
        /** @type {?} */
        let route = rootRoute;
        while (route.firstChild) {
            route = route.firstChild;
        }
        return route;
    }));
    /** @type {?} */
    const selectFragment = createSelector(selectRootRoute, (/**
     * @param {?} route
     * @return {?}
     */
    (route) => route && route.fragment));
    /** @type {?} */
    const selectQueryParams = createSelector(selectRootRoute, (/**
     * @param {?} route
     * @return {?}
     */
    (route) => route && route.queryParams));
    /** @type {?} */
    const selectQueryParam = (/**
     * @param {?} param
     * @return {?}
     */
    (param) => createSelector(selectQueryParams, (/**
     * @param {?} params
     * @return {?}
     */
    (params) => params && params[param])));
    /** @type {?} */
    const selectRouteParams = createSelector(selectCurrentRoute, (/**
     * @param {?} route
     * @return {?}
     */
    (route) => route && route.params));
    /** @type {?} */
    const selectRouteParam = (/**
     * @param {?} param
     * @return {?}
     */
    (param) => createSelector(selectRouteParams, (/**
     * @param {?} params
     * @return {?}
     */
    (params) => params && params[param])));
    /** @type {?} */
    const selectRouteData = createSelector(selectCurrentRoute, (/**
     * @param {?} route
     * @return {?}
     */
    (route) => route && route.data));
    /** @type {?} */
    const selectUrl = createSelector(selectRouterState, (/**
     * @param {?} routerState
     * @return {?}
     */
    (routerState) => routerState && routerState.url));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyX3NlbGVjdG9ycy5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi8uLi9tb2R1bGVzL3JvdXRlci1zdG9yZS8iLCJzb3VyY2VzIjpbInNyYy9yb3V0ZXJfc2VsZWN0b3JzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLGFBQWEsQ0FBQzs7Ozs7O0FBSTdDLE1BQU0sVUFBVSxZQUFZLENBQzFCLFdBQWtEOztVQUU1QyxpQkFBaUIsR0FBRyxjQUFjLENBQ3RDLFdBQVc7Ozs7SUFDWCxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxLQUFLLEVBQ25DOztVQUNLLGVBQWUsR0FBRyxjQUFjLENBQ3BDLGlCQUFpQjs7OztJQUNqQixDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUMsV0FBVyxJQUFJLFdBQVcsQ0FBQyxJQUFJLEVBQ2pEOztVQUNLLGtCQUFrQixHQUFHLGNBQWMsQ0FBQyxlQUFlOzs7O0lBQUUsQ0FBQyxTQUFTLEVBQUUsRUFBRTtRQUN2RSxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ2QsT0FBTyxTQUFTLENBQUM7U0FDbEI7O1lBQ0csS0FBSyxHQUFHLFNBQVM7UUFDckIsT0FBTyxLQUFLLENBQUMsVUFBVSxFQUFFO1lBQ3ZCLEtBQUssR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDO1NBQzFCO1FBQ0QsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDLEVBQUM7O1VBQ0ksY0FBYyxHQUFHLGNBQWMsQ0FDbkMsZUFBZTs7OztJQUNmLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDLFFBQVEsRUFDbkM7O1VBQ0ssaUJBQWlCLEdBQUcsY0FBYyxDQUN0QyxlQUFlOzs7O0lBQ2YsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsV0FBVyxFQUN0Qzs7VUFDSyxnQkFBZ0I7Ozs7SUFBRyxDQUFDLEtBQWEsRUFBRSxFQUFFLENBQ3pDLGNBQWMsQ0FBQyxpQkFBaUI7Ozs7SUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBQyxDQUFBOztVQUNsRSxpQkFBaUIsR0FBRyxjQUFjLENBQ3RDLGtCQUFrQjs7OztJQUNsQixDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQ2pDOztVQUNLLGdCQUFnQjs7OztJQUFHLENBQUMsS0FBYSxFQUFFLEVBQUUsQ0FDekMsY0FBYyxDQUFDLGlCQUFpQjs7OztJQUFFLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFDLENBQUE7O1VBQ2xFLGVBQWUsR0FBRyxjQUFjLENBQ3BDLGtCQUFrQjs7OztJQUNsQixDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQyxJQUFJLEVBQy9COztVQUNLLFNBQVMsR0FBRyxjQUFjLENBQzlCLGlCQUFpQjs7OztJQUNqQixDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUMsV0FBVyxJQUFJLFdBQVcsQ0FBQyxHQUFHLEVBQ2hEO0lBRUQsT0FBTztRQUNMLGtCQUFrQjtRQUNsQixjQUFjO1FBQ2QsaUJBQWlCO1FBQ2pCLGdCQUFnQjtRQUNoQixpQkFBaUI7UUFDakIsZ0JBQWdCO1FBQ2hCLGVBQWU7UUFDZixTQUFTO0tBQ1YsQ0FBQztBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjcmVhdGVTZWxlY3RvciB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcbmltcG9ydCB7IFJvdXRlclN0YXRlU2VsZWN0b3JzIH0gZnJvbSAnLi9tb2RlbHMnO1xuaW1wb3J0IHsgUm91dGVyUmVkdWNlclN0YXRlIH0gZnJvbSAnLi9yZWR1Y2VyJztcblxuZXhwb3J0IGZ1bmN0aW9uIGdldFNlbGVjdG9yczxWPihcbiAgc2VsZWN0U3RhdGU6IChzdGF0ZTogVikgPT4gUm91dGVyUmVkdWNlclN0YXRlPGFueT5cbik6IFJvdXRlclN0YXRlU2VsZWN0b3JzPFY+IHtcbiAgY29uc3Qgc2VsZWN0Um91dGVyU3RhdGUgPSBjcmVhdGVTZWxlY3RvcihcbiAgICBzZWxlY3RTdGF0ZSxcbiAgICAocm91dGVyKSA9PiByb3V0ZXIgJiYgcm91dGVyLnN0YXRlXG4gICk7XG4gIGNvbnN0IHNlbGVjdFJvb3RSb3V0ZSA9IGNyZWF0ZVNlbGVjdG9yKFxuICAgIHNlbGVjdFJvdXRlclN0YXRlLFxuICAgIChyb3V0ZXJTdGF0ZSkgPT4gcm91dGVyU3RhdGUgJiYgcm91dGVyU3RhdGUucm9vdFxuICApO1xuICBjb25zdCBzZWxlY3RDdXJyZW50Um91dGUgPSBjcmVhdGVTZWxlY3RvcihzZWxlY3RSb290Um91dGUsIChyb290Um91dGUpID0+IHtcbiAgICBpZiAoIXJvb3RSb3V0ZSkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgbGV0IHJvdXRlID0gcm9vdFJvdXRlO1xuICAgIHdoaWxlIChyb3V0ZS5maXJzdENoaWxkKSB7XG4gICAgICByb3V0ZSA9IHJvdXRlLmZpcnN0Q2hpbGQ7XG4gICAgfVxuICAgIHJldHVybiByb3V0ZTtcbiAgfSk7XG4gIGNvbnN0IHNlbGVjdEZyYWdtZW50ID0gY3JlYXRlU2VsZWN0b3IoXG4gICAgc2VsZWN0Um9vdFJvdXRlLFxuICAgIChyb3V0ZSkgPT4gcm91dGUgJiYgcm91dGUuZnJhZ21lbnRcbiAgKTtcbiAgY29uc3Qgc2VsZWN0UXVlcnlQYXJhbXMgPSBjcmVhdGVTZWxlY3RvcihcbiAgICBzZWxlY3RSb290Um91dGUsXG4gICAgKHJvdXRlKSA9PiByb3V0ZSAmJiByb3V0ZS5xdWVyeVBhcmFtc1xuICApO1xuICBjb25zdCBzZWxlY3RRdWVyeVBhcmFtID0gKHBhcmFtOiBzdHJpbmcpID0+XG4gICAgY3JlYXRlU2VsZWN0b3Ioc2VsZWN0UXVlcnlQYXJhbXMsIChwYXJhbXMpID0+IHBhcmFtcyAmJiBwYXJhbXNbcGFyYW1dKTtcbiAgY29uc3Qgc2VsZWN0Um91dGVQYXJhbXMgPSBjcmVhdGVTZWxlY3RvcihcbiAgICBzZWxlY3RDdXJyZW50Um91dGUsXG4gICAgKHJvdXRlKSA9PiByb3V0ZSAmJiByb3V0ZS5wYXJhbXNcbiAgKTtcbiAgY29uc3Qgc2VsZWN0Um91dGVQYXJhbSA9IChwYXJhbTogc3RyaW5nKSA9PlxuICAgIGNyZWF0ZVNlbGVjdG9yKHNlbGVjdFJvdXRlUGFyYW1zLCAocGFyYW1zKSA9PiBwYXJhbXMgJiYgcGFyYW1zW3BhcmFtXSk7XG4gIGNvbnN0IHNlbGVjdFJvdXRlRGF0YSA9IGNyZWF0ZVNlbGVjdG9yKFxuICAgIHNlbGVjdEN1cnJlbnRSb3V0ZSxcbiAgICAocm91dGUpID0+IHJvdXRlICYmIHJvdXRlLmRhdGFcbiAgKTtcbiAgY29uc3Qgc2VsZWN0VXJsID0gY3JlYXRlU2VsZWN0b3IoXG4gICAgc2VsZWN0Um91dGVyU3RhdGUsXG4gICAgKHJvdXRlclN0YXRlKSA9PiByb3V0ZXJTdGF0ZSAmJiByb3V0ZXJTdGF0ZS51cmxcbiAgKTtcblxuICByZXR1cm4ge1xuICAgIHNlbGVjdEN1cnJlbnRSb3V0ZSxcbiAgICBzZWxlY3RGcmFnbWVudCxcbiAgICBzZWxlY3RRdWVyeVBhcmFtcyxcbiAgICBzZWxlY3RRdWVyeVBhcmFtLFxuICAgIHNlbGVjdFJvdXRlUGFyYW1zLFxuICAgIHNlbGVjdFJvdXRlUGFyYW0sXG4gICAgc2VsZWN0Um91dGVEYXRhLFxuICAgIHNlbGVjdFVybCxcbiAgfTtcbn1cbiJdfQ==