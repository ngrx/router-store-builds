/**
 * @fileoverview added by tsickle
 * Generated from: src/reducer.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { ROUTER_CANCEL, ROUTER_ERROR, ROUTER_NAVIGATION, } from './actions';
/**
 * @template T
 * @param {?} state
 * @param {?} action
 * @return {?}
 */
export function routerReducer(state, action) {
    // Allow compilation with strictFunctionTypes - ref: #1344
    /** @type {?} */
    const routerAction = (/** @type {?} */ (action));
    switch (routerAction.type) {
        case ROUTER_NAVIGATION:
        case ROUTER_ERROR:
        case ROUTER_CANCEL:
            return {
                state: routerAction.payload.routerState,
                navigationId: routerAction.payload.event.id,
            };
        default:
            return (/** @type {?} */ (state));
    }
}
//# sourceMappingURL=reducer.js.map