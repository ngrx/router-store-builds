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
    var selectRouterState = createSelector(selectState, (/**
     * @param {?} router
     * @return {?}
     */
    function (router) { return router && router.state; }));
    /** @type {?} */
    var selectCurrentRoute = createSelector(selectRouterState, (/**
     * @param {?} routerState
     * @return {?}
     */
    function (routerState) {
        if (!routerState) {
            return undefined;
        }
        /** @type {?} */
        var route = routerState.root;
        while (route.firstChild) {
            route = route.firstChild;
        }
        return route;
    }));
    /** @type {?} */
    var selectFragment = createSelector(selectCurrentRoute, (/**
     * @param {?} route
     * @return {?}
     */
    function (route) { return route && route.fragment; }));
    /** @type {?} */
    var selectQueryParams = createSelector(selectCurrentRoute, (/**
     * @param {?} route
     * @return {?}
     */
    function (route) { return route && route.queryParams; }));
    /** @type {?} */
    var selectQueryParam = (/**
     * @param {?} param
     * @return {?}
     */
    function (param) {
        return createSelector(selectQueryParams, (/**
         * @param {?} params
         * @return {?}
         */
        function (params) { return params && params[param]; }));
    });
    /** @type {?} */
    var selectRouteParams = createSelector(selectCurrentRoute, (/**
     * @param {?} route
     * @return {?}
     */
    function (route) { return route && route.params; }));
    /** @type {?} */
    var selectRouteParam = (/**
     * @param {?} param
     * @return {?}
     */
    function (param) {
        return createSelector(selectRouteParams, (/**
         * @param {?} params
         * @return {?}
         */
        function (params) { return params && params[param]; }));
    });
    /** @type {?} */
    var selectRouteData = createSelector(selectCurrentRoute, (/**
     * @param {?} route
     * @return {?}
     */
    function (route) { return route && route.data; }));
    /** @type {?} */
    var selectUrl = createSelector(selectRouterState, (/**
     * @param {?} routerState
     * @return {?}
     */
    function (routerState) { return routerState && routerState.url; }));
    return {
        selectCurrentRoute: selectCurrentRoute,
        selectFragment: selectFragment,
        selectQueryParams: selectQueryParams,
        selectQueryParam: selectQueryParam,
        selectRouteParams: selectRouteParams,
        selectRouteParam: selectRouteParam,
        selectRouteData: selectRouteData,
        selectUrl: selectUrl,
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyX3NlbGVjdG9ycy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZ3J4L3JvdXRlci1zdG9yZS8iLCJzb3VyY2VzIjpbInNyYy9yb3V0ZXJfc2VsZWN0b3JzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLGFBQWEsQ0FBQzs7Ozs7O0FBTzdDLE1BQU0sVUFBVSxZQUFZLENBQzFCLFdBQWtEOztRQUU1QyxpQkFBaUIsR0FBRyxjQUFjLENBQ3RDLFdBQVc7Ozs7SUFDWCxVQUFBLE1BQU0sSUFBSSxPQUFBLE1BQU0sSUFBSSxNQUFNLENBQUMsS0FBSyxFQUF0QixDQUFzQixFQUNqQzs7UUFDSyxrQkFBa0IsR0FBRyxjQUFjLENBQUMsaUJBQWlCOzs7O0lBQUUsVUFBQSxXQUFXO1FBQ3RFLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDaEIsT0FBTyxTQUFTLENBQUM7U0FDbEI7O1lBQ0csS0FBSyxHQUFHLFdBQVcsQ0FBQyxJQUFJO1FBQzVCLE9BQU8sS0FBSyxDQUFDLFVBQVUsRUFBRTtZQUN2QixLQUFLLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQztTQUMxQjtRQUNELE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQyxFQUFDOztRQUNJLGNBQWMsR0FBRyxjQUFjLENBQ25DLGtCQUFrQjs7OztJQUNsQixVQUFBLEtBQUssSUFBSSxPQUFBLEtBQUssSUFBSSxLQUFLLENBQUMsUUFBUSxFQUF2QixDQUF1QixFQUNqQzs7UUFDSyxpQkFBaUIsR0FBRyxjQUFjLENBQ3RDLGtCQUFrQjs7OztJQUNsQixVQUFBLEtBQUssSUFBSSxPQUFBLEtBQUssSUFBSSxLQUFLLENBQUMsV0FBVyxFQUExQixDQUEwQixFQUNwQzs7UUFDSyxnQkFBZ0I7Ozs7SUFBRyxVQUFDLEtBQWE7UUFDckMsT0FBQSxjQUFjLENBQUMsaUJBQWlCOzs7O1FBQUUsVUFBQSxNQUFNLElBQUksT0FBQSxNQUFNLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUF2QixDQUF1QixFQUFDO0lBQXBFLENBQW9FLENBQUE7O1FBQ2hFLGlCQUFpQixHQUFHLGNBQWMsQ0FDdEMsa0JBQWtCOzs7O0lBQ2xCLFVBQUEsS0FBSyxJQUFJLE9BQUEsS0FBSyxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQXJCLENBQXFCLEVBQy9COztRQUNLLGdCQUFnQjs7OztJQUFHLFVBQUMsS0FBYTtRQUNyQyxPQUFBLGNBQWMsQ0FBQyxpQkFBaUI7Ozs7UUFBRSxVQUFBLE1BQU0sSUFBSSxPQUFBLE1BQU0sSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQXZCLENBQXVCLEVBQUM7SUFBcEUsQ0FBb0UsQ0FBQTs7UUFDaEUsZUFBZSxHQUFHLGNBQWMsQ0FDcEMsa0JBQWtCOzs7O0lBQ2xCLFVBQUEsS0FBSyxJQUFJLE9BQUEsS0FBSyxJQUFJLEtBQUssQ0FBQyxJQUFJLEVBQW5CLENBQW1CLEVBQzdCOztRQUNLLFNBQVMsR0FBRyxjQUFjLENBQzlCLGlCQUFpQjs7OztJQUNqQixVQUFBLFdBQVcsSUFBSSxPQUFBLFdBQVcsSUFBSSxXQUFXLENBQUMsR0FBRyxFQUE5QixDQUE4QixFQUM5QztJQUVELE9BQU87UUFDTCxrQkFBa0Isb0JBQUE7UUFDbEIsY0FBYyxnQkFBQTtRQUNkLGlCQUFpQixtQkFBQTtRQUNqQixnQkFBZ0Isa0JBQUE7UUFDaEIsaUJBQWlCLG1CQUFBO1FBQ2pCLGdCQUFnQixrQkFBQTtRQUNoQixlQUFlLGlCQUFBO1FBQ2YsU0FBUyxXQUFBO0tBQ1YsQ0FBQztBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjcmVhdGVTZWxlY3RvciB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcbmltcG9ydCB7IFJvdXRlclN0YXRlU2VsZWN0b3JzIH0gZnJvbSAnLi9tb2RlbHMnO1xuaW1wb3J0IHsgUm91dGVyUmVkdWNlclN0YXRlIH0gZnJvbSAnLi9yZWR1Y2VyJztcblxuZXhwb3J0IGZ1bmN0aW9uIGdldFNlbGVjdG9yczxWPihcbiAgc2VsZWN0U3RhdGU6IChzdGF0ZTogVikgPT4gUm91dGVyUmVkdWNlclN0YXRlPGFueT5cbik6IFJvdXRlclN0YXRlU2VsZWN0b3JzPFY+O1xuZXhwb3J0IGZ1bmN0aW9uIGdldFNlbGVjdG9yczxWPihcbiAgc2VsZWN0U3RhdGU6IChzdGF0ZTogVikgPT4gUm91dGVyUmVkdWNlclN0YXRlPGFueT5cbik6IFJvdXRlclN0YXRlU2VsZWN0b3JzPFY+IHtcbiAgY29uc3Qgc2VsZWN0Um91dGVyU3RhdGUgPSBjcmVhdGVTZWxlY3RvcihcbiAgICBzZWxlY3RTdGF0ZSxcbiAgICByb3V0ZXIgPT4gcm91dGVyICYmIHJvdXRlci5zdGF0ZVxuICApO1xuICBjb25zdCBzZWxlY3RDdXJyZW50Um91dGUgPSBjcmVhdGVTZWxlY3RvcihzZWxlY3RSb3V0ZXJTdGF0ZSwgcm91dGVyU3RhdGUgPT4ge1xuICAgIGlmICghcm91dGVyU3RhdGUpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIGxldCByb3V0ZSA9IHJvdXRlclN0YXRlLnJvb3Q7XG4gICAgd2hpbGUgKHJvdXRlLmZpcnN0Q2hpbGQpIHtcbiAgICAgIHJvdXRlID0gcm91dGUuZmlyc3RDaGlsZDtcbiAgICB9XG4gICAgcmV0dXJuIHJvdXRlO1xuICB9KTtcbiAgY29uc3Qgc2VsZWN0RnJhZ21lbnQgPSBjcmVhdGVTZWxlY3RvcihcbiAgICBzZWxlY3RDdXJyZW50Um91dGUsXG4gICAgcm91dGUgPT4gcm91dGUgJiYgcm91dGUuZnJhZ21lbnRcbiAgKTtcbiAgY29uc3Qgc2VsZWN0UXVlcnlQYXJhbXMgPSBjcmVhdGVTZWxlY3RvcihcbiAgICBzZWxlY3RDdXJyZW50Um91dGUsXG4gICAgcm91dGUgPT4gcm91dGUgJiYgcm91dGUucXVlcnlQYXJhbXNcbiAgKTtcbiAgY29uc3Qgc2VsZWN0UXVlcnlQYXJhbSA9IChwYXJhbTogc3RyaW5nKSA9PlxuICAgIGNyZWF0ZVNlbGVjdG9yKHNlbGVjdFF1ZXJ5UGFyYW1zLCBwYXJhbXMgPT4gcGFyYW1zICYmIHBhcmFtc1twYXJhbV0pO1xuICBjb25zdCBzZWxlY3RSb3V0ZVBhcmFtcyA9IGNyZWF0ZVNlbGVjdG9yKFxuICAgIHNlbGVjdEN1cnJlbnRSb3V0ZSxcbiAgICByb3V0ZSA9PiByb3V0ZSAmJiByb3V0ZS5wYXJhbXNcbiAgKTtcbiAgY29uc3Qgc2VsZWN0Um91dGVQYXJhbSA9IChwYXJhbTogc3RyaW5nKSA9PlxuICAgIGNyZWF0ZVNlbGVjdG9yKHNlbGVjdFJvdXRlUGFyYW1zLCBwYXJhbXMgPT4gcGFyYW1zICYmIHBhcmFtc1twYXJhbV0pO1xuICBjb25zdCBzZWxlY3RSb3V0ZURhdGEgPSBjcmVhdGVTZWxlY3RvcihcbiAgICBzZWxlY3RDdXJyZW50Um91dGUsXG4gICAgcm91dGUgPT4gcm91dGUgJiYgcm91dGUuZGF0YVxuICApO1xuICBjb25zdCBzZWxlY3RVcmwgPSBjcmVhdGVTZWxlY3RvcihcbiAgICBzZWxlY3RSb3V0ZXJTdGF0ZSxcbiAgICByb3V0ZXJTdGF0ZSA9PiByb3V0ZXJTdGF0ZSAmJiByb3V0ZXJTdGF0ZS51cmxcbiAgKTtcblxuICByZXR1cm4ge1xuICAgIHNlbGVjdEN1cnJlbnRSb3V0ZSxcbiAgICBzZWxlY3RGcmFnbWVudCxcbiAgICBzZWxlY3RRdWVyeVBhcmFtcyxcbiAgICBzZWxlY3RRdWVyeVBhcmFtLFxuICAgIHNlbGVjdFJvdXRlUGFyYW1zLFxuICAgIHNlbGVjdFJvdXRlUGFyYW0sXG4gICAgc2VsZWN0Um91dGVEYXRhLFxuICAgIHNlbGVjdFVybCxcbiAgfTtcbn1cbiJdfQ==