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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyX3NlbGVjdG9ycy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZ3J4L3JvdXRlci1zdG9yZS8iLCJzb3VyY2VzIjpbInNyYy9yb3V0ZXJfc2VsZWN0b3JzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLGFBQWEsQ0FBQzs7Ozs7O0FBTzdDLE1BQU0sVUFBVSxZQUFZLENBQzFCLFdBQWtEOztRQUU1QyxpQkFBaUIsR0FBRyxjQUFjLENBQ3RDLFdBQVc7Ozs7SUFDWCxVQUFDLE1BQU0sSUFBSyxPQUFBLE1BQU0sSUFBSSxNQUFNLENBQUMsS0FBSyxFQUF0QixDQUFzQixFQUNuQzs7UUFDSyxrQkFBa0IsR0FBRyxjQUFjLENBQ3ZDLGlCQUFpQjs7OztJQUNqQixVQUFDLFdBQVc7UUFDVixJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ2hCLE9BQU8sU0FBUyxDQUFDO1NBQ2xCOztZQUNHLEtBQUssR0FBRyxXQUFXLENBQUMsSUFBSTtRQUM1QixPQUFPLEtBQUssQ0FBQyxVQUFVLEVBQUU7WUFDdkIsS0FBSyxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUM7U0FDMUI7UUFDRCxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUMsRUFDRjs7UUFDSyxjQUFjLEdBQUcsY0FBYyxDQUNuQyxrQkFBa0I7Ozs7SUFDbEIsVUFBQyxLQUFLLElBQUssT0FBQSxLQUFLLElBQUksS0FBSyxDQUFDLFFBQVEsRUFBdkIsQ0FBdUIsRUFDbkM7O1FBQ0ssaUJBQWlCLEdBQUcsY0FBYyxDQUN0QyxrQkFBa0I7Ozs7SUFDbEIsVUFBQyxLQUFLLElBQUssT0FBQSxLQUFLLElBQUksS0FBSyxDQUFDLFdBQVcsRUFBMUIsQ0FBMEIsRUFDdEM7O1FBQ0ssZ0JBQWdCOzs7O0lBQUcsVUFBQyxLQUFhO1FBQ3JDLE9BQUEsY0FBYyxDQUFDLGlCQUFpQjs7OztRQUFFLFVBQUMsTUFBTSxJQUFLLE9BQUEsTUFBTSxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBdkIsQ0FBdUIsRUFBQztJQUF0RSxDQUFzRSxDQUFBOztRQUNsRSxpQkFBaUIsR0FBRyxjQUFjLENBQ3RDLGtCQUFrQjs7OztJQUNsQixVQUFDLEtBQUssSUFBSyxPQUFBLEtBQUssSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFyQixDQUFxQixFQUNqQzs7UUFDSyxnQkFBZ0I7Ozs7SUFBRyxVQUFDLEtBQWE7UUFDckMsT0FBQSxjQUFjLENBQUMsaUJBQWlCOzs7O1FBQUUsVUFBQyxNQUFNLElBQUssT0FBQSxNQUFNLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUF2QixDQUF1QixFQUFDO0lBQXRFLENBQXNFLENBQUE7O1FBQ2xFLGVBQWUsR0FBRyxjQUFjLENBQ3BDLGtCQUFrQjs7OztJQUNsQixVQUFDLEtBQUssSUFBSyxPQUFBLEtBQUssSUFBSSxLQUFLLENBQUMsSUFBSSxFQUFuQixDQUFtQixFQUMvQjs7UUFDSyxTQUFTLEdBQUcsY0FBYyxDQUM5QixpQkFBaUI7Ozs7SUFDakIsVUFBQyxXQUFXLElBQUssT0FBQSxXQUFXLElBQUksV0FBVyxDQUFDLEdBQUcsRUFBOUIsQ0FBOEIsRUFDaEQ7SUFFRCxPQUFPO1FBQ0wsa0JBQWtCLG9CQUFBO1FBQ2xCLGNBQWMsZ0JBQUE7UUFDZCxpQkFBaUIsbUJBQUE7UUFDakIsZ0JBQWdCLGtCQUFBO1FBQ2hCLGlCQUFpQixtQkFBQTtRQUNqQixnQkFBZ0Isa0JBQUE7UUFDaEIsZUFBZSxpQkFBQTtRQUNmLFNBQVMsV0FBQTtLQUNWLENBQUM7QUFDSixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY3JlYXRlU2VsZWN0b3IgfSBmcm9tICdAbmdyeC9zdG9yZSc7XG5pbXBvcnQgeyBSb3V0ZXJTdGF0ZVNlbGVjdG9ycyB9IGZyb20gJy4vbW9kZWxzJztcbmltcG9ydCB7IFJvdXRlclJlZHVjZXJTdGF0ZSB9IGZyb20gJy4vcmVkdWNlcic7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRTZWxlY3RvcnM8Vj4oXG4gIHNlbGVjdFN0YXRlOiAoc3RhdGU6IFYpID0+IFJvdXRlclJlZHVjZXJTdGF0ZTxhbnk+XG4pOiBSb3V0ZXJTdGF0ZVNlbGVjdG9yczxWPjtcbmV4cG9ydCBmdW5jdGlvbiBnZXRTZWxlY3RvcnM8Vj4oXG4gIHNlbGVjdFN0YXRlOiAoc3RhdGU6IFYpID0+IFJvdXRlclJlZHVjZXJTdGF0ZTxhbnk+XG4pOiBSb3V0ZXJTdGF0ZVNlbGVjdG9yczxWPiB7XG4gIGNvbnN0IHNlbGVjdFJvdXRlclN0YXRlID0gY3JlYXRlU2VsZWN0b3IoXG4gICAgc2VsZWN0U3RhdGUsXG4gICAgKHJvdXRlcikgPT4gcm91dGVyICYmIHJvdXRlci5zdGF0ZVxuICApO1xuICBjb25zdCBzZWxlY3RDdXJyZW50Um91dGUgPSBjcmVhdGVTZWxlY3RvcihcbiAgICBzZWxlY3RSb3V0ZXJTdGF0ZSxcbiAgICAocm91dGVyU3RhdGUpID0+IHtcbiAgICAgIGlmICghcm91dGVyU3RhdGUpIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICAgIGxldCByb3V0ZSA9IHJvdXRlclN0YXRlLnJvb3Q7XG4gICAgICB3aGlsZSAocm91dGUuZmlyc3RDaGlsZCkge1xuICAgICAgICByb3V0ZSA9IHJvdXRlLmZpcnN0Q2hpbGQ7XG4gICAgICB9XG4gICAgICByZXR1cm4gcm91dGU7XG4gICAgfVxuICApO1xuICBjb25zdCBzZWxlY3RGcmFnbWVudCA9IGNyZWF0ZVNlbGVjdG9yKFxuICAgIHNlbGVjdEN1cnJlbnRSb3V0ZSxcbiAgICAocm91dGUpID0+IHJvdXRlICYmIHJvdXRlLmZyYWdtZW50XG4gICk7XG4gIGNvbnN0IHNlbGVjdFF1ZXJ5UGFyYW1zID0gY3JlYXRlU2VsZWN0b3IoXG4gICAgc2VsZWN0Q3VycmVudFJvdXRlLFxuICAgIChyb3V0ZSkgPT4gcm91dGUgJiYgcm91dGUucXVlcnlQYXJhbXNcbiAgKTtcbiAgY29uc3Qgc2VsZWN0UXVlcnlQYXJhbSA9IChwYXJhbTogc3RyaW5nKSA9PlxuICAgIGNyZWF0ZVNlbGVjdG9yKHNlbGVjdFF1ZXJ5UGFyYW1zLCAocGFyYW1zKSA9PiBwYXJhbXMgJiYgcGFyYW1zW3BhcmFtXSk7XG4gIGNvbnN0IHNlbGVjdFJvdXRlUGFyYW1zID0gY3JlYXRlU2VsZWN0b3IoXG4gICAgc2VsZWN0Q3VycmVudFJvdXRlLFxuICAgIChyb3V0ZSkgPT4gcm91dGUgJiYgcm91dGUucGFyYW1zXG4gICk7XG4gIGNvbnN0IHNlbGVjdFJvdXRlUGFyYW0gPSAocGFyYW06IHN0cmluZykgPT5cbiAgICBjcmVhdGVTZWxlY3RvcihzZWxlY3RSb3V0ZVBhcmFtcywgKHBhcmFtcykgPT4gcGFyYW1zICYmIHBhcmFtc1twYXJhbV0pO1xuICBjb25zdCBzZWxlY3RSb3V0ZURhdGEgPSBjcmVhdGVTZWxlY3RvcihcbiAgICBzZWxlY3RDdXJyZW50Um91dGUsXG4gICAgKHJvdXRlKSA9PiByb3V0ZSAmJiByb3V0ZS5kYXRhXG4gICk7XG4gIGNvbnN0IHNlbGVjdFVybCA9IGNyZWF0ZVNlbGVjdG9yKFxuICAgIHNlbGVjdFJvdXRlclN0YXRlLFxuICAgIChyb3V0ZXJTdGF0ZSkgPT4gcm91dGVyU3RhdGUgJiYgcm91dGVyU3RhdGUudXJsXG4gICk7XG5cbiAgcmV0dXJuIHtcbiAgICBzZWxlY3RDdXJyZW50Um91dGUsXG4gICAgc2VsZWN0RnJhZ21lbnQsXG4gICAgc2VsZWN0UXVlcnlQYXJhbXMsXG4gICAgc2VsZWN0UXVlcnlQYXJhbSxcbiAgICBzZWxlY3RSb3V0ZVBhcmFtcyxcbiAgICBzZWxlY3RSb3V0ZVBhcmFtLFxuICAgIHNlbGVjdFJvdXRlRGF0YSxcbiAgICBzZWxlY3RVcmwsXG4gIH07XG59XG4iXX0=