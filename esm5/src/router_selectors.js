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
//# sourceMappingURL=router_selectors.js.map