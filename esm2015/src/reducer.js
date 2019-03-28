/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVkdWNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvcm91dGVyLXN0b3JlL3NyYy9yZWR1Y2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFDQSxPQUFPLEVBQ0wsYUFBYSxFQUNiLFlBQVksRUFDWixpQkFBaUIsR0FFbEIsTUFBTSxXQUFXLENBQUM7Ozs7Ozs7QUFhbkIsTUFBTSxVQUFVLGFBQWEsQ0FHM0IsS0FBd0MsRUFDeEMsTUFBYzs7O1VBR1IsWUFBWSxHQUFHLG1CQUFBLE1BQU0sRUFBd0I7SUFDbkQsUUFBUSxZQUFZLENBQUMsSUFBSSxFQUFFO1FBQ3pCLEtBQUssaUJBQWlCLENBQUM7UUFDdkIsS0FBSyxZQUFZLENBQUM7UUFDbEIsS0FBSyxhQUFhO1lBQ2hCLE9BQU87Z0JBQ0wsS0FBSyxFQUFFLFlBQVksQ0FBQyxPQUFPLENBQUMsV0FBVztnQkFDdkMsWUFBWSxFQUFFLFlBQVksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7YUFDNUMsQ0FBQztRQUNKO1lBQ0UsT0FBTyxtQkFBQSxLQUFLLEVBQXlCLENBQUM7S0FDekM7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWN0aW9uIH0gZnJvbSAnQG5ncngvc3RvcmUnO1xuaW1wb3J0IHtcbiAgUk9VVEVSX0NBTkNFTCxcbiAgUk9VVEVSX0VSUk9SLFxuICBST1VURVJfTkFWSUdBVElPTixcbiAgUm91dGVyQWN0aW9uLFxufSBmcm9tICcuL2FjdGlvbnMnO1xuaW1wb3J0IHtcbiAgQmFzZVJvdXRlclN0b3JlU3RhdGUsXG4gIFNlcmlhbGl6ZWRSb3V0ZXJTdGF0ZVNuYXBzaG90LFxufSBmcm9tICcuL3NlcmlhbGl6ZXInO1xuXG5leHBvcnQgdHlwZSBSb3V0ZXJSZWR1Y2VyU3RhdGU8XG4gIFQgZXh0ZW5kcyBCYXNlUm91dGVyU3RvcmVTdGF0ZSA9IFNlcmlhbGl6ZWRSb3V0ZXJTdGF0ZVNuYXBzaG90XG4+ID0ge1xuICBzdGF0ZTogVDtcbiAgbmF2aWdhdGlvbklkOiBudW1iZXI7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gcm91dGVyUmVkdWNlcjxcbiAgVCBleHRlbmRzIEJhc2VSb3V0ZXJTdG9yZVN0YXRlID0gU2VyaWFsaXplZFJvdXRlclN0YXRlU25hcHNob3Rcbj4oXG4gIHN0YXRlOiBSb3V0ZXJSZWR1Y2VyU3RhdGU8VD4gfCB1bmRlZmluZWQsXG4gIGFjdGlvbjogQWN0aW9uXG4pOiBSb3V0ZXJSZWR1Y2VyU3RhdGU8VD4ge1xuICAvLyBBbGxvdyBjb21waWxhdGlvbiB3aXRoIHN0cmljdEZ1bmN0aW9uVHlwZXMgLSByZWY6ICMxMzQ0XG4gIGNvbnN0IHJvdXRlckFjdGlvbiA9IGFjdGlvbiBhcyBSb3V0ZXJBY3Rpb248YW55LCBUPjtcbiAgc3dpdGNoIChyb3V0ZXJBY3Rpb24udHlwZSkge1xuICAgIGNhc2UgUk9VVEVSX05BVklHQVRJT046XG4gICAgY2FzZSBST1VURVJfRVJST1I6XG4gICAgY2FzZSBST1VURVJfQ0FOQ0VMOlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgc3RhdGU6IHJvdXRlckFjdGlvbi5wYXlsb2FkLnJvdXRlclN0YXRlLFxuICAgICAgICBuYXZpZ2F0aW9uSWQ6IHJvdXRlckFjdGlvbi5wYXlsb2FkLmV2ZW50LmlkLFxuICAgICAgfTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHN0YXRlIGFzIFJvdXRlclJlZHVjZXJTdGF0ZTxUPjtcbiAgfVxufVxuIl19