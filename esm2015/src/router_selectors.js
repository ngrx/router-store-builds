/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
    const selectRouteParams = createSelector(selectCurrentRoute, (/**
     * @param {?} route
     * @return {?}
     */
    route => route && route.params));
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
        selectRouteParams,
        selectRouteData,
        selectUrl,
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyX3NlbGVjdG9ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvcm91dGVyLXN0b3JlL3NyYy9yb3V0ZXJfc2VsZWN0b3JzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sYUFBYSxDQUFDOzs7Ozs7QUFPN0MsTUFBTSxVQUFVLFlBQVksQ0FDMUIsV0FBa0Q7O1VBRTVDLGlCQUFpQixHQUFHLGNBQWMsQ0FDdEMsV0FBVzs7OztJQUNYLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxLQUFLLEVBQ2pDOztVQUNLLGtCQUFrQixHQUFHLGNBQWMsQ0FBQyxpQkFBaUI7Ozs7SUFBRSxXQUFXLENBQUMsRUFBRTtRQUN6RSxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ2hCLE9BQU8sU0FBUyxDQUFDO1NBQ2xCOztZQUNHLEtBQUssR0FBRyxXQUFXLENBQUMsSUFBSTtRQUM1QixPQUFPLEtBQUssQ0FBQyxVQUFVLEVBQUU7WUFDdkIsS0FBSyxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUM7U0FDMUI7UUFDRCxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUMsRUFBQzs7VUFDSSxpQkFBaUIsR0FBRyxjQUFjLENBQ3RDLGtCQUFrQjs7OztJQUNsQixLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsV0FBVyxFQUNwQzs7VUFDSyxpQkFBaUIsR0FBRyxjQUFjLENBQ3RDLGtCQUFrQjs7OztJQUNsQixLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsTUFBTSxFQUMvQjs7VUFDSyxlQUFlLEdBQUcsY0FBYyxDQUNwQyxrQkFBa0I7Ozs7SUFDbEIsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDLElBQUksRUFDN0I7O1VBQ0ssU0FBUyxHQUFHLGNBQWMsQ0FDOUIsaUJBQWlCOzs7O0lBQ2pCLFdBQVcsQ0FBQyxFQUFFLENBQUMsV0FBVyxJQUFJLFdBQVcsQ0FBQyxHQUFHLEVBQzlDO0lBRUQsT0FBTztRQUNMLGtCQUFrQjtRQUNsQixpQkFBaUI7UUFDakIsaUJBQWlCO1FBQ2pCLGVBQWU7UUFDZixTQUFTO0tBQ1YsQ0FBQztBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjcmVhdGVTZWxlY3RvciB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcbmltcG9ydCB7IFJvdXRlclN0YXRlU2VsZWN0b3JzIH0gZnJvbSAnLi9tb2RlbHMnO1xuaW1wb3J0IHsgUm91dGVyUmVkdWNlclN0YXRlIH0gZnJvbSAnLi9yZWR1Y2VyJztcblxuZXhwb3J0IGZ1bmN0aW9uIGdldFNlbGVjdG9yczxWPihcbiAgc2VsZWN0U3RhdGU6IChzdGF0ZTogVikgPT4gUm91dGVyUmVkdWNlclN0YXRlPGFueT5cbik6IFJvdXRlclN0YXRlU2VsZWN0b3JzPFY+O1xuZXhwb3J0IGZ1bmN0aW9uIGdldFNlbGVjdG9yczxWPihcbiAgc2VsZWN0U3RhdGU6IChzdGF0ZTogVikgPT4gUm91dGVyUmVkdWNlclN0YXRlPGFueT5cbik6IFJvdXRlclN0YXRlU2VsZWN0b3JzPFY+IHtcbiAgY29uc3Qgc2VsZWN0Um91dGVyU3RhdGUgPSBjcmVhdGVTZWxlY3RvcihcbiAgICBzZWxlY3RTdGF0ZSxcbiAgICByb3V0ZXIgPT4gcm91dGVyICYmIHJvdXRlci5zdGF0ZVxuICApO1xuICBjb25zdCBzZWxlY3RDdXJyZW50Um91dGUgPSBjcmVhdGVTZWxlY3RvcihzZWxlY3RSb3V0ZXJTdGF0ZSwgcm91dGVyU3RhdGUgPT4ge1xuICAgIGlmICghcm91dGVyU3RhdGUpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIGxldCByb3V0ZSA9IHJvdXRlclN0YXRlLnJvb3Q7XG4gICAgd2hpbGUgKHJvdXRlLmZpcnN0Q2hpbGQpIHtcbiAgICAgIHJvdXRlID0gcm91dGUuZmlyc3RDaGlsZDtcbiAgICB9XG4gICAgcmV0dXJuIHJvdXRlO1xuICB9KTtcbiAgY29uc3Qgc2VsZWN0UXVlcnlQYXJhbXMgPSBjcmVhdGVTZWxlY3RvcihcbiAgICBzZWxlY3RDdXJyZW50Um91dGUsXG4gICAgcm91dGUgPT4gcm91dGUgJiYgcm91dGUucXVlcnlQYXJhbXNcbiAgKTtcbiAgY29uc3Qgc2VsZWN0Um91dGVQYXJhbXMgPSBjcmVhdGVTZWxlY3RvcihcbiAgICBzZWxlY3RDdXJyZW50Um91dGUsXG4gICAgcm91dGUgPT4gcm91dGUgJiYgcm91dGUucGFyYW1zXG4gICk7XG4gIGNvbnN0IHNlbGVjdFJvdXRlRGF0YSA9IGNyZWF0ZVNlbGVjdG9yKFxuICAgIHNlbGVjdEN1cnJlbnRSb3V0ZSxcbiAgICByb3V0ZSA9PiByb3V0ZSAmJiByb3V0ZS5kYXRhXG4gICk7XG4gIGNvbnN0IHNlbGVjdFVybCA9IGNyZWF0ZVNlbGVjdG9yKFxuICAgIHNlbGVjdFJvdXRlclN0YXRlLFxuICAgIHJvdXRlclN0YXRlID0+IHJvdXRlclN0YXRlICYmIHJvdXRlclN0YXRlLnVybFxuICApO1xuXG4gIHJldHVybiB7XG4gICAgc2VsZWN0Q3VycmVudFJvdXRlLFxuICAgIHNlbGVjdFF1ZXJ5UGFyYW1zLFxuICAgIHNlbGVjdFJvdXRlUGFyYW1zLFxuICAgIHNlbGVjdFJvdXRlRGF0YSxcbiAgICBzZWxlY3RVcmwsXG4gIH07XG59XG4iXX0=