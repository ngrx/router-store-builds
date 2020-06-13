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
    const selectCurrentRoute = createSelector(selectRouterState, (/**
     * @param {?} routerState
     * @return {?}
     */
    (routerState) => {
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
    const selectFragment = createSelector(selectCurrentRoute, (/**
     * @param {?} route
     * @return {?}
     */
    (route) => route && route.fragment));
    /** @type {?} */
    const selectQueryParams = createSelector(selectCurrentRoute, (/**
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyX3NlbGVjdG9ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL21vZHVsZXMvcm91dGVyLXN0b3JlL3NyYy9yb3V0ZXJfc2VsZWN0b3JzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLGFBQWEsQ0FBQzs7Ozs7O0FBTzdDLE1BQU0sVUFBVSxZQUFZLENBQzFCLFdBQWtEOztVQUU1QyxpQkFBaUIsR0FBRyxjQUFjLENBQ3RDLFdBQVc7Ozs7SUFDWCxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxLQUFLLEVBQ25DOztVQUNLLGtCQUFrQixHQUFHLGNBQWMsQ0FDdkMsaUJBQWlCOzs7O0lBQ2pCLENBQUMsV0FBVyxFQUFFLEVBQUU7UUFDZCxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ2hCLE9BQU8sU0FBUyxDQUFDO1NBQ2xCOztZQUNHLEtBQUssR0FBRyxXQUFXLENBQUMsSUFBSTtRQUM1QixPQUFPLEtBQUssQ0FBQyxVQUFVLEVBQUU7WUFDdkIsS0FBSyxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUM7U0FDMUI7UUFDRCxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUMsRUFDRjs7VUFDSyxjQUFjLEdBQUcsY0FBYyxDQUNuQyxrQkFBa0I7Ozs7SUFDbEIsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsUUFBUSxFQUNuQzs7VUFDSyxpQkFBaUIsR0FBRyxjQUFjLENBQ3RDLGtCQUFrQjs7OztJQUNsQixDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQyxXQUFXLEVBQ3RDOztVQUNLLGdCQUFnQjs7OztJQUFHLENBQUMsS0FBYSxFQUFFLEVBQUUsQ0FDekMsY0FBYyxDQUFDLGlCQUFpQjs7OztJQUFFLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFDLENBQUE7O1VBQ2xFLGlCQUFpQixHQUFHLGNBQWMsQ0FDdEMsa0JBQWtCOzs7O0lBQ2xCLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDLE1BQU0sRUFDakM7O1VBQ0ssZ0JBQWdCOzs7O0lBQUcsQ0FBQyxLQUFhLEVBQUUsRUFBRSxDQUN6QyxjQUFjLENBQUMsaUJBQWlCOzs7O0lBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUMsQ0FBQTs7VUFDbEUsZUFBZSxHQUFHLGNBQWMsQ0FDcEMsa0JBQWtCOzs7O0lBQ2xCLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDLElBQUksRUFDL0I7O1VBQ0ssU0FBUyxHQUFHLGNBQWMsQ0FDOUIsaUJBQWlCOzs7O0lBQ2pCLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxXQUFXLElBQUksV0FBVyxDQUFDLEdBQUcsRUFDaEQ7SUFFRCxPQUFPO1FBQ0wsa0JBQWtCO1FBQ2xCLGNBQWM7UUFDZCxpQkFBaUI7UUFDakIsZ0JBQWdCO1FBQ2hCLGlCQUFpQjtRQUNqQixnQkFBZ0I7UUFDaEIsZUFBZTtRQUNmLFNBQVM7S0FDVixDQUFDO0FBQ0osQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNyZWF0ZVNlbGVjdG9yIH0gZnJvbSAnQG5ncngvc3RvcmUnO1xuaW1wb3J0IHsgUm91dGVyU3RhdGVTZWxlY3RvcnMgfSBmcm9tICcuL21vZGVscyc7XG5pbXBvcnQgeyBSb3V0ZXJSZWR1Y2VyU3RhdGUgfSBmcm9tICcuL3JlZHVjZXInO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2VsZWN0b3JzPFY+KFxuICBzZWxlY3RTdGF0ZTogKHN0YXRlOiBWKSA9PiBSb3V0ZXJSZWR1Y2VyU3RhdGU8YW55PlxuKTogUm91dGVyU3RhdGVTZWxlY3RvcnM8Vj47XG5leHBvcnQgZnVuY3Rpb24gZ2V0U2VsZWN0b3JzPFY+KFxuICBzZWxlY3RTdGF0ZTogKHN0YXRlOiBWKSA9PiBSb3V0ZXJSZWR1Y2VyU3RhdGU8YW55PlxuKTogUm91dGVyU3RhdGVTZWxlY3RvcnM8Vj4ge1xuICBjb25zdCBzZWxlY3RSb3V0ZXJTdGF0ZSA9IGNyZWF0ZVNlbGVjdG9yKFxuICAgIHNlbGVjdFN0YXRlLFxuICAgIChyb3V0ZXIpID0+IHJvdXRlciAmJiByb3V0ZXIuc3RhdGVcbiAgKTtcbiAgY29uc3Qgc2VsZWN0Q3VycmVudFJvdXRlID0gY3JlYXRlU2VsZWN0b3IoXG4gICAgc2VsZWN0Um91dGVyU3RhdGUsXG4gICAgKHJvdXRlclN0YXRlKSA9PiB7XG4gICAgICBpZiAoIXJvdXRlclN0YXRlKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgICBsZXQgcm91dGUgPSByb3V0ZXJTdGF0ZS5yb290O1xuICAgICAgd2hpbGUgKHJvdXRlLmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgcm91dGUgPSByb3V0ZS5maXJzdENoaWxkO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJvdXRlO1xuICAgIH1cbiAgKTtcbiAgY29uc3Qgc2VsZWN0RnJhZ21lbnQgPSBjcmVhdGVTZWxlY3RvcihcbiAgICBzZWxlY3RDdXJyZW50Um91dGUsXG4gICAgKHJvdXRlKSA9PiByb3V0ZSAmJiByb3V0ZS5mcmFnbWVudFxuICApO1xuICBjb25zdCBzZWxlY3RRdWVyeVBhcmFtcyA9IGNyZWF0ZVNlbGVjdG9yKFxuICAgIHNlbGVjdEN1cnJlbnRSb3V0ZSxcbiAgICAocm91dGUpID0+IHJvdXRlICYmIHJvdXRlLnF1ZXJ5UGFyYW1zXG4gICk7XG4gIGNvbnN0IHNlbGVjdFF1ZXJ5UGFyYW0gPSAocGFyYW06IHN0cmluZykgPT5cbiAgICBjcmVhdGVTZWxlY3RvcihzZWxlY3RRdWVyeVBhcmFtcywgKHBhcmFtcykgPT4gcGFyYW1zICYmIHBhcmFtc1twYXJhbV0pO1xuICBjb25zdCBzZWxlY3RSb3V0ZVBhcmFtcyA9IGNyZWF0ZVNlbGVjdG9yKFxuICAgIHNlbGVjdEN1cnJlbnRSb3V0ZSxcbiAgICAocm91dGUpID0+IHJvdXRlICYmIHJvdXRlLnBhcmFtc1xuICApO1xuICBjb25zdCBzZWxlY3RSb3V0ZVBhcmFtID0gKHBhcmFtOiBzdHJpbmcpID0+XG4gICAgY3JlYXRlU2VsZWN0b3Ioc2VsZWN0Um91dGVQYXJhbXMsIChwYXJhbXMpID0+IHBhcmFtcyAmJiBwYXJhbXNbcGFyYW1dKTtcbiAgY29uc3Qgc2VsZWN0Um91dGVEYXRhID0gY3JlYXRlU2VsZWN0b3IoXG4gICAgc2VsZWN0Q3VycmVudFJvdXRlLFxuICAgIChyb3V0ZSkgPT4gcm91dGUgJiYgcm91dGUuZGF0YVxuICApO1xuICBjb25zdCBzZWxlY3RVcmwgPSBjcmVhdGVTZWxlY3RvcihcbiAgICBzZWxlY3RSb3V0ZXJTdGF0ZSxcbiAgICAocm91dGVyU3RhdGUpID0+IHJvdXRlclN0YXRlICYmIHJvdXRlclN0YXRlLnVybFxuICApO1xuXG4gIHJldHVybiB7XG4gICAgc2VsZWN0Q3VycmVudFJvdXRlLFxuICAgIHNlbGVjdEZyYWdtZW50LFxuICAgIHNlbGVjdFF1ZXJ5UGFyYW1zLFxuICAgIHNlbGVjdFF1ZXJ5UGFyYW0sXG4gICAgc2VsZWN0Um91dGVQYXJhbXMsXG4gICAgc2VsZWN0Um91dGVQYXJhbSxcbiAgICBzZWxlY3RSb3V0ZURhdGEsXG4gICAgc2VsZWN0VXJsLFxuICB9O1xufVxuIl19