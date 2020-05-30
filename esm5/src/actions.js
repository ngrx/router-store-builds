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
export var ROUTER_REQUEST = '@ngrx/router-store/request';
/** @type {?} */
export var routerRequestAction = createAction(ROUTER_REQUEST, props());
/**
 * An action dispatched when the router navigates.
 * @type {?}
 */
export var ROUTER_NAVIGATION = '@ngrx/router-store/navigation';
/** @type {?} */
export var routerNavigationAction = createAction(ROUTER_NAVIGATION, props());
/**
 * An action dispatched when the router cancels navigation.
 * @type {?}
 */
export var ROUTER_CANCEL = '@ngrx/router-store/cancel';
/** @type {?} */
export var routerCancelAction = createAction(ROUTER_CANCEL, props());
/**
 * An action dispatched when the router errors.
 * @type {?}
 */
export var ROUTER_ERROR = '@ngrx/router-store/error';
/** @type {?} */
export var routerErrorAction = createAction(ROUTER_ERROR, props());
/**
 * An action dispatched after navigation has ended and new route is active.
 * @type {?}
 */
export var ROUTER_NAVIGATED = '@ngrx/router-store/navigated';
/** @type {?} */
export var routerNavigatedAction = createAction(ROUTER_NAVIGATED, props());
//# sourceMappingURL=actions.js.map