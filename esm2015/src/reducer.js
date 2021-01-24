/**
 * @fileoverview added by tsickle
 * Generated from: src/reducer.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { ROUTER_CANCEL, ROUTER_ERROR, ROUTER_NAVIGATION, } from './actions';
/**
 * @template RouterState, Result
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
            return (/** @type {?} */ (((/** @type {?} */ ({
                state: routerAction.payload.routerState,
                navigationId: routerAction.payload.event.id,
            })))));
        default:
            return (/** @type {?} */ (state));
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVkdWNlci5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi8uLi9tb2R1bGVzL3JvdXRlci1zdG9yZS8iLCJzb3VyY2VzIjpbInNyYy9yZWR1Y2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0EsT0FBTyxFQUNMLGFBQWEsRUFDYixZQUFZLEVBQ1osaUJBQWlCLEdBRWxCLE1BQU0sV0FBVyxDQUFDOzs7Ozs7O0FBV25CLE1BQU0sVUFBVSxhQUFhLENBRzNCLEtBQXlCLEVBQUUsTUFBYzs7O1VBRW5DLFlBQVksR0FBRyxtQkFBQSxNQUFNLEVBQWtDO0lBQzdELFFBQVEsWUFBWSxDQUFDLElBQUksRUFBRTtRQUN6QixLQUFLLGlCQUFpQixDQUFDO1FBQ3ZCLEtBQUssWUFBWSxDQUFDO1FBQ2xCLEtBQUssYUFBYTtZQUNoQixPQUFPLG1CQUFBLENBQUMsbUJBQUE7Z0JBQ04sS0FBSyxFQUFFLFlBQVksQ0FBQyxPQUFPLENBQUMsV0FBVztnQkFDdkMsWUFBWSxFQUFFLFlBQVksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7YUFDNUMsRUFBVyxDQUFDLEVBQVUsQ0FBQztRQUMxQjtZQUNFLE9BQU8sbUJBQUEsS0FBSyxFQUFVLENBQUM7S0FDMUI7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWN0aW9uIH0gZnJvbSAnQG5ncngvc3RvcmUnO1xuaW1wb3J0IHtcbiAgUk9VVEVSX0NBTkNFTCxcbiAgUk9VVEVSX0VSUk9SLFxuICBST1VURVJfTkFWSUdBVElPTixcbiAgUm91dGVyQWN0aW9uLFxufSBmcm9tICcuL2FjdGlvbnMnO1xuaW1wb3J0IHsgQmFzZVJvdXRlclN0b3JlU3RhdGUgfSBmcm9tICcuL3NlcmlhbGl6ZXJzL2Jhc2UnO1xuaW1wb3J0IHsgU2VyaWFsaXplZFJvdXRlclN0YXRlU25hcHNob3QgfSBmcm9tICcuL3NlcmlhbGl6ZXJzL2RlZmF1bHRfc2VyaWFsaXplcic7XG5cbmV4cG9ydCB0eXBlIFJvdXRlclJlZHVjZXJTdGF0ZTxcbiAgVCBleHRlbmRzIEJhc2VSb3V0ZXJTdG9yZVN0YXRlID0gU2VyaWFsaXplZFJvdXRlclN0YXRlU25hcHNob3Rcbj4gPSB7XG4gIHN0YXRlOiBUO1xuICBuYXZpZ2F0aW9uSWQ6IG51bWJlcjtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiByb3V0ZXJSZWR1Y2VyPFxuICBSb3V0ZXJTdGF0ZSBleHRlbmRzIEJhc2VSb3V0ZXJTdG9yZVN0YXRlID0gU2VyaWFsaXplZFJvdXRlclN0YXRlU25hcHNob3QsXG4gIFJlc3VsdCA9IFJvdXRlclJlZHVjZXJTdGF0ZTxSb3V0ZXJTdGF0ZT5cbj4oc3RhdGU6IFJlc3VsdCB8IHVuZGVmaW5lZCwgYWN0aW9uOiBBY3Rpb24pOiBSZXN1bHQge1xuICAvLyBBbGxvdyBjb21waWxhdGlvbiB3aXRoIHN0cmljdEZ1bmN0aW9uVHlwZXMgLSByZWY6ICMxMzQ0XG4gIGNvbnN0IHJvdXRlckFjdGlvbiA9IGFjdGlvbiBhcyBSb3V0ZXJBY3Rpb248YW55LCBSb3V0ZXJTdGF0ZT47XG4gIHN3aXRjaCAocm91dGVyQWN0aW9uLnR5cGUpIHtcbiAgICBjYXNlIFJPVVRFUl9OQVZJR0FUSU9OOlxuICAgIGNhc2UgUk9VVEVSX0VSUk9SOlxuICAgIGNhc2UgUk9VVEVSX0NBTkNFTDpcbiAgICAgIHJldHVybiAoe1xuICAgICAgICBzdGF0ZTogcm91dGVyQWN0aW9uLnBheWxvYWQucm91dGVyU3RhdGUsXG4gICAgICAgIG5hdmlnYXRpb25JZDogcm91dGVyQWN0aW9uLnBheWxvYWQuZXZlbnQuaWQsXG4gICAgICB9IGFzIHVua25vd24pIGFzIFJlc3VsdDtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHN0YXRlIGFzIFJlc3VsdDtcbiAgfVxufVxuIl19