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
//# sourceMappingURL=router_selectors.js.map