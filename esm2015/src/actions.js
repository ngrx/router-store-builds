/**
 * @fileoverview added by tsickle
 * Generated from: src/actions.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { createAction, props } from '@ngrx/store';
/**
 * An action dispatched when a router navigation request is fired.
 * @type {?}
 */
export const ROUTER_REQUEST = '@ngrx/router-store/request';
/** @type {?} */
export const routerRequestAction = createAction(ROUTER_REQUEST, props());
/**
 * An action dispatched when the router navigates.
 * @type {?}
 */
export const ROUTER_NAVIGATION = '@ngrx/router-store/navigation';
/** @type {?} */
export const routerNavigationAction = createAction(ROUTER_NAVIGATION, props());
/**
 * An action dispatched when the router cancels navigation.
 * @type {?}
 */
export const ROUTER_CANCEL = '@ngrx/router-store/cancel';
/** @type {?} */
export const routerCancelAction = createAction(ROUTER_CANCEL, props());
/**
 * An action dispatched when the router errors.
 * @type {?}
 */
export const ROUTER_ERROR = '@ngrx/router-store/error';
/** @type {?} */
export const routerErrorAction = createAction(ROUTER_ERROR, props());
/**
 * An action dispatched after navigation has ended and new route is active.
 * @type {?}
 */
export const ROUTER_NAVIGATED = '@ngrx/router-store/navigated';
/** @type {?} */
export const routerNavigatedAction = createAction(ROUTER_NAVIGATED, props());
//# sourceMappingURL=actions.js.map