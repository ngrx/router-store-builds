/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { ROUTER_CANCEL, ROUTER_ERROR, ROUTER_NAVIGATION, } from './actions';
/** @typedef {?} */
var RouterReducerState;
export { RouterReducerState };
/**
 * @template T
 * @param {?} state
 * @param {?} action
 * @return {?}
 */
export function routerReducer(state, action) {
    /** @type {?} */
    const routerAction = /** @type {?} */ (action);
    switch (routerAction.type) {
        case ROUTER_NAVIGATION:
        case ROUTER_ERROR:
        case ROUTER_CANCEL:
            return {
                state: routerAction.payload.routerState,
                navigationId: routerAction.payload.event.id,
            };
        default:
            return /** @type {?} */ (state);
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVkdWNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvcm91dGVyLXN0b3JlL3NyYy9yZWR1Y2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFDQSxPQUFPLEVBQ0wsYUFBYSxFQUNiLFlBQVksRUFDWixpQkFBaUIsR0FFbEIsTUFBTSxXQUFXLENBQUM7Ozs7Ozs7Ozs7QUFhbkIsTUFBTSx3QkFHSixLQUF3QyxFQUN4QyxNQUFjOztJQUdkLE1BQU0sWUFBWSxxQkFBRyxNQUE4QixFQUFDO0lBQ3BELFFBQVEsWUFBWSxDQUFDLElBQUksRUFBRTtRQUN6QixLQUFLLGlCQUFpQixDQUFDO1FBQ3ZCLEtBQUssWUFBWSxDQUFDO1FBQ2xCLEtBQUssYUFBYTtZQUNoQixPQUFPO2dCQUNMLEtBQUssRUFBRSxZQUFZLENBQUMsT0FBTyxDQUFDLFdBQVc7Z0JBQ3ZDLFlBQVksRUFBRSxZQUFZLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO2FBQzVDLENBQUM7UUFDSjtZQUNFLHlCQUFPLEtBQThCLEVBQUM7S0FDekM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFjdGlvbiB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcbmltcG9ydCB7XG4gIFJPVVRFUl9DQU5DRUwsXG4gIFJPVVRFUl9FUlJPUixcbiAgUk9VVEVSX05BVklHQVRJT04sXG4gIFJvdXRlckFjdGlvbixcbn0gZnJvbSAnLi9hY3Rpb25zJztcbmltcG9ydCB7XG4gIEJhc2VSb3V0ZXJTdG9yZVN0YXRlLFxuICBTZXJpYWxpemVkUm91dGVyU3RhdGVTbmFwc2hvdCxcbn0gZnJvbSAnLi9zZXJpYWxpemVyJztcblxuZXhwb3J0IHR5cGUgUm91dGVyUmVkdWNlclN0YXRlPFxuICBUIGV4dGVuZHMgQmFzZVJvdXRlclN0b3JlU3RhdGUgPSBTZXJpYWxpemVkUm91dGVyU3RhdGVTbmFwc2hvdFxuPiA9IHtcbiAgc3RhdGU6IFQ7XG4gIG5hdmlnYXRpb25JZDogbnVtYmVyO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIHJvdXRlclJlZHVjZXI8XG4gIFQgZXh0ZW5kcyBCYXNlUm91dGVyU3RvcmVTdGF0ZSA9IFNlcmlhbGl6ZWRSb3V0ZXJTdGF0ZVNuYXBzaG90XG4+KFxuICBzdGF0ZTogUm91dGVyUmVkdWNlclN0YXRlPFQ+IHwgdW5kZWZpbmVkLFxuICBhY3Rpb246IEFjdGlvblxuKTogUm91dGVyUmVkdWNlclN0YXRlPFQ+IHtcbiAgLy8gQWxsb3cgY29tcGlsYXRpb24gd2l0aCBzdHJpY3RGdW5jdGlvblR5cGVzIC0gcmVmOiAjMTM0NFxuICBjb25zdCByb3V0ZXJBY3Rpb24gPSBhY3Rpb24gYXMgUm91dGVyQWN0aW9uPGFueSwgVD47XG4gIHN3aXRjaCAocm91dGVyQWN0aW9uLnR5cGUpIHtcbiAgICBjYXNlIFJPVVRFUl9OQVZJR0FUSU9OOlxuICAgIGNhc2UgUk9VVEVSX0VSUk9SOlxuICAgIGNhc2UgUk9VVEVSX0NBTkNFTDpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHN0YXRlOiByb3V0ZXJBY3Rpb24ucGF5bG9hZC5yb3V0ZXJTdGF0ZSxcbiAgICAgICAgbmF2aWdhdGlvbklkOiByb3V0ZXJBY3Rpb24ucGF5bG9hZC5ldmVudC5pZCxcbiAgICAgIH07XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBzdGF0ZSBhcyBSb3V0ZXJSZWR1Y2VyU3RhdGU8VD47XG4gIH1cbn1cbiJdfQ==