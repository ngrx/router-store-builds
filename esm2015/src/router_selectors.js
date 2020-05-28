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
    const selectFragment = createSelector(selectCurrentRoute, (/**
     * @param {?} route
     * @return {?}
     */
    route => route && route.fragment));
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
        selectFragment,
        selectQueryParams,
        selectQueryParam,
        selectRouteParams,
        selectRouteParam,
        selectRouteData,
        selectUrl,
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyX3NlbGVjdG9ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvcm91dGVyLXN0b3JlL3NyYy9yb3V0ZXJfc2VsZWN0b3JzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLGFBQWEsQ0FBQzs7Ozs7O0FBTzdDLE1BQU0sVUFBVSxZQUFZLENBQzFCLFdBQWtEOztVQUU1QyxpQkFBaUIsR0FBRyxjQUFjLENBQ3RDLFdBQVc7Ozs7SUFDWCxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsS0FBSyxFQUNqQzs7VUFDSyxrQkFBa0IsR0FBRyxjQUFjLENBQUMsaUJBQWlCOzs7O0lBQUUsV0FBVyxDQUFDLEVBQUU7UUFDekUsSUFBSSxDQUFDLFdBQVcsRUFBRTtZQUNoQixPQUFPLFNBQVMsQ0FBQztTQUNsQjs7WUFDRyxLQUFLLEdBQUcsV0FBVyxDQUFDLElBQUk7UUFDNUIsT0FBTyxLQUFLLENBQUMsVUFBVSxFQUFFO1lBQ3ZCLEtBQUssR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDO1NBQzFCO1FBQ0QsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDLEVBQUM7O1VBQ0ksY0FBYyxHQUFHLGNBQWMsQ0FDbkMsa0JBQWtCOzs7O0lBQ2xCLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQyxRQUFRLEVBQ2pDOztVQUNLLGlCQUFpQixHQUFHLGNBQWMsQ0FDdEMsa0JBQWtCOzs7O0lBQ2xCLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQyxXQUFXLEVBQ3BDOztVQUNLLGdCQUFnQjs7OztJQUFHLENBQUMsS0FBYSxFQUFFLEVBQUUsQ0FDekMsY0FBYyxDQUFDLGlCQUFpQjs7OztJQUFFLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBQyxDQUFBOztVQUNoRSxpQkFBaUIsR0FBRyxjQUFjLENBQ3RDLGtCQUFrQjs7OztJQUNsQixLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsTUFBTSxFQUMvQjs7VUFDSyxnQkFBZ0I7Ozs7SUFBRyxDQUFDLEtBQWEsRUFBRSxFQUFFLENBQ3pDLGNBQWMsQ0FBQyxpQkFBaUI7Ozs7SUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUMsQ0FBQTs7VUFDaEUsZUFBZSxHQUFHLGNBQWMsQ0FDcEMsa0JBQWtCOzs7O0lBQ2xCLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQyxJQUFJLEVBQzdCOztVQUNLLFNBQVMsR0FBRyxjQUFjLENBQzlCLGlCQUFpQjs7OztJQUNqQixXQUFXLENBQUMsRUFBRSxDQUFDLFdBQVcsSUFBSSxXQUFXLENBQUMsR0FBRyxFQUM5QztJQUVELE9BQU87UUFDTCxrQkFBa0I7UUFDbEIsY0FBYztRQUNkLGlCQUFpQjtRQUNqQixnQkFBZ0I7UUFDaEIsaUJBQWlCO1FBQ2pCLGdCQUFnQjtRQUNoQixlQUFlO1FBQ2YsU0FBUztLQUNWLENBQUM7QUFDSixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY3JlYXRlU2VsZWN0b3IgfSBmcm9tICdAbmdyeC9zdG9yZSc7XG5pbXBvcnQgeyBSb3V0ZXJTdGF0ZVNlbGVjdG9ycyB9IGZyb20gJy4vbW9kZWxzJztcbmltcG9ydCB7IFJvdXRlclJlZHVjZXJTdGF0ZSB9IGZyb20gJy4vcmVkdWNlcic7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRTZWxlY3RvcnM8Vj4oXG4gIHNlbGVjdFN0YXRlOiAoc3RhdGU6IFYpID0+IFJvdXRlclJlZHVjZXJTdGF0ZTxhbnk+XG4pOiBSb3V0ZXJTdGF0ZVNlbGVjdG9yczxWPjtcbmV4cG9ydCBmdW5jdGlvbiBnZXRTZWxlY3RvcnM8Vj4oXG4gIHNlbGVjdFN0YXRlOiAoc3RhdGU6IFYpID0+IFJvdXRlclJlZHVjZXJTdGF0ZTxhbnk+XG4pOiBSb3V0ZXJTdGF0ZVNlbGVjdG9yczxWPiB7XG4gIGNvbnN0IHNlbGVjdFJvdXRlclN0YXRlID0gY3JlYXRlU2VsZWN0b3IoXG4gICAgc2VsZWN0U3RhdGUsXG4gICAgcm91dGVyID0+IHJvdXRlciAmJiByb3V0ZXIuc3RhdGVcbiAgKTtcbiAgY29uc3Qgc2VsZWN0Q3VycmVudFJvdXRlID0gY3JlYXRlU2VsZWN0b3Ioc2VsZWN0Um91dGVyU3RhdGUsIHJvdXRlclN0YXRlID0+IHtcbiAgICBpZiAoIXJvdXRlclN0YXRlKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBsZXQgcm91dGUgPSByb3V0ZXJTdGF0ZS5yb290O1xuICAgIHdoaWxlIChyb3V0ZS5maXJzdENoaWxkKSB7XG4gICAgICByb3V0ZSA9IHJvdXRlLmZpcnN0Q2hpbGQ7XG4gICAgfVxuICAgIHJldHVybiByb3V0ZTtcbiAgfSk7XG4gIGNvbnN0IHNlbGVjdEZyYWdtZW50ID0gY3JlYXRlU2VsZWN0b3IoXG4gICAgc2VsZWN0Q3VycmVudFJvdXRlLFxuICAgIHJvdXRlID0+IHJvdXRlICYmIHJvdXRlLmZyYWdtZW50XG4gICk7XG4gIGNvbnN0IHNlbGVjdFF1ZXJ5UGFyYW1zID0gY3JlYXRlU2VsZWN0b3IoXG4gICAgc2VsZWN0Q3VycmVudFJvdXRlLFxuICAgIHJvdXRlID0+IHJvdXRlICYmIHJvdXRlLnF1ZXJ5UGFyYW1zXG4gICk7XG4gIGNvbnN0IHNlbGVjdFF1ZXJ5UGFyYW0gPSAocGFyYW06IHN0cmluZykgPT5cbiAgICBjcmVhdGVTZWxlY3RvcihzZWxlY3RRdWVyeVBhcmFtcywgcGFyYW1zID0+IHBhcmFtcyAmJiBwYXJhbXNbcGFyYW1dKTtcbiAgY29uc3Qgc2VsZWN0Um91dGVQYXJhbXMgPSBjcmVhdGVTZWxlY3RvcihcbiAgICBzZWxlY3RDdXJyZW50Um91dGUsXG4gICAgcm91dGUgPT4gcm91dGUgJiYgcm91dGUucGFyYW1zXG4gICk7XG4gIGNvbnN0IHNlbGVjdFJvdXRlUGFyYW0gPSAocGFyYW06IHN0cmluZykgPT5cbiAgICBjcmVhdGVTZWxlY3RvcihzZWxlY3RSb3V0ZVBhcmFtcywgcGFyYW1zID0+IHBhcmFtcyAmJiBwYXJhbXNbcGFyYW1dKTtcbiAgY29uc3Qgc2VsZWN0Um91dGVEYXRhID0gY3JlYXRlU2VsZWN0b3IoXG4gICAgc2VsZWN0Q3VycmVudFJvdXRlLFxuICAgIHJvdXRlID0+IHJvdXRlICYmIHJvdXRlLmRhdGFcbiAgKTtcbiAgY29uc3Qgc2VsZWN0VXJsID0gY3JlYXRlU2VsZWN0b3IoXG4gICAgc2VsZWN0Um91dGVyU3RhdGUsXG4gICAgcm91dGVyU3RhdGUgPT4gcm91dGVyU3RhdGUgJiYgcm91dGVyU3RhdGUudXJsXG4gICk7XG5cbiAgcmV0dXJuIHtcbiAgICBzZWxlY3RDdXJyZW50Um91dGUsXG4gICAgc2VsZWN0RnJhZ21lbnQsXG4gICAgc2VsZWN0UXVlcnlQYXJhbXMsXG4gICAgc2VsZWN0UXVlcnlQYXJhbSxcbiAgICBzZWxlY3RSb3V0ZVBhcmFtcyxcbiAgICBzZWxlY3RSb3V0ZVBhcmFtLFxuICAgIHNlbGVjdFJvdXRlRGF0YSxcbiAgICBzZWxlY3RVcmwsXG4gIH07XG59XG4iXX0=