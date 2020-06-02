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
var /**
 * @abstract
 * @template T
 */
RouterStateSerializer = /** @class */ (function () {
    function RouterStateSerializer() {
    }
    return RouterStateSerializer;
}());
/**
 * @abstract
 * @template T
 */
export { RouterStateSerializer };
if (false) {
    /**
     * @abstract
     * @param {?} routerState
     * @return {?}
     */
    RouterStateSerializer.prototype.serialize = function (routerState) { };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZ3J4L3JvdXRlci1zdG9yZS8iLCJzb3VyY2VzIjpbInNyYy9zZXJpYWxpemVycy9iYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBT0EsMENBRUM7OztJQURDLG1DQUFZOzs7Ozs7QUFHZDs7Ozs7SUFBQTtJQUlBLENBQUM7SUFBRCw0QkFBQztBQUFELENBQUMsQUFKRCxJQUlDOzs7Ozs7Ozs7Ozs7SUFEQyx1RUFBd0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBSb3V0ZXJTdGF0ZVNuYXBzaG90IH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcblxuLyoqXG4gKiBTaW1wbGUgcm91dGVyIHN0YXRlLlxuICogQWxsIGN1c3RvbSByb3V0ZXIgc3RhdGVzIC8gc3RhdGUgc2VyaWFsaXplcnMgc2hvdWxkIGhhdmUgYXQgbGVhc3RcbiAqIHRoZSBwcm9wZXJ0aWVzIG9mIHRoaXMgaW50ZXJmYWNlLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEJhc2VSb3V0ZXJTdG9yZVN0YXRlIHtcbiAgdXJsOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBSb3V0ZXJTdGF0ZVNlcmlhbGl6ZXI8XG4gIFQgZXh0ZW5kcyBCYXNlUm91dGVyU3RvcmVTdGF0ZSA9IEJhc2VSb3V0ZXJTdG9yZVN0YXRlXG4+IHtcbiAgYWJzdHJhY3Qgc2VyaWFsaXplKHJvdXRlclN0YXRlOiBSb3V0ZXJTdGF0ZVNuYXBzaG90KTogVDtcbn1cbiJdfQ==