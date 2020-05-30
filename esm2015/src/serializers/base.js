/**
 * @fileoverview added by tsickle
 * Generated from: src/serializers/base.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * Simple router state.
 * All custom router states / state serializers should have at least
 * the properties of this interface.
 * @record
 */
export function BaseRouterStoreState() { }
if (false) {
    /** @type {?} */
    BaseRouterStoreState.prototype.url;
}
/**
 * @abstract
 * @template T
 */
export class RouterStateSerializer {
}
if (false) {
    /**
     * @abstract
     * @param {?} routerState
     * @return {?}
     */
    RouterStateSerializer.prototype.serialize = function (routerState) { };
}
//# sourceMappingURL=base.js.map