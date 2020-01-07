/**
 * @fileoverview added by tsickle
 * Generated from: modules/router-store/src/actions.ts
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvcm91dGVyLXN0b3JlL3NyYy9hY3Rpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBVUEsT0FBTyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsTUFBTSxhQUFhLENBQUM7Ozs7O0FBS2xELE1BQU0sT0FBTyxjQUFjLEdBQUcsNEJBQTRCOztBQXNCMUQsTUFBTSxPQUFPLG1CQUFtQixHQUFHLFlBQVksQ0FDN0MsY0FBYyxFQUNkLEtBQUssRUFBb0UsQ0FDMUU7Ozs7O0FBSUQsTUFBTSxPQUFPLGlCQUFpQixHQUFHLCtCQUErQjs7QUFzQmhFLE1BQU0sT0FBTyxzQkFBc0IsR0FBRyxZQUFZLENBQ2hELGlCQUFpQixFQUNqQixLQUFLLEVBQXVFLENBQzdFOzs7OztBQUtELE1BQU0sT0FBTyxhQUFhLEdBQUcsMkJBQTJCOztBQXlCeEQsTUFBTSxPQUFPLGtCQUFrQixHQUFHLFlBQVksQ0FDNUMsYUFBYSxFQUNiLEtBQUssRUFBbUUsQ0FDekU7Ozs7O0FBS0QsTUFBTSxPQUFPLFlBQVksR0FBRywwQkFBMEI7O0FBeUJ0RCxNQUFNLE9BQU8saUJBQWlCLEdBQUcsWUFBWSxDQUMzQyxZQUFZLEVBQ1osS0FBSyxFQUFrRSxDQUN4RTs7Ozs7QUFLRCxNQUFNLE9BQU8sZ0JBQWdCLEdBQUcsOEJBQThCOztBQXNCOUQsTUFBTSxPQUFPLHFCQUFxQixHQUFHLFlBQVksQ0FDL0MsZ0JBQWdCLEVBQ2hCLEtBQUssRUFBc0UsQ0FDNUUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBOYXZpZ2F0aW9uQ2FuY2VsLFxuICBOYXZpZ2F0aW9uRW5kLFxuICBOYXZpZ2F0aW9uRXJyb3IsXG4gIE5hdmlnYXRpb25TdGFydCxcbiAgUm91dGVzUmVjb2duaXplZCxcbn0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcblxuaW1wb3J0IHsgQmFzZVJvdXRlclN0b3JlU3RhdGUgfSBmcm9tICcuL3NlcmlhbGl6ZXJzL2Jhc2UnO1xuaW1wb3J0IHsgU2VyaWFsaXplZFJvdXRlclN0YXRlU25hcHNob3QgfSBmcm9tICcuL3NlcmlhbGl6ZXJzL2RlZmF1bHRfc2VyaWFsaXplcic7XG5pbXBvcnQgeyBjcmVhdGVBY3Rpb24sIHByb3BzIH0gZnJvbSAnQG5ncngvc3RvcmUnO1xuXG4vKipcbiAqIEFuIGFjdGlvbiBkaXNwYXRjaGVkIHdoZW4gYSByb3V0ZXIgbmF2aWdhdGlvbiByZXF1ZXN0IGlzIGZpcmVkLlxuICovXG5leHBvcnQgY29uc3QgUk9VVEVSX1JFUVVFU1QgPSAnQG5ncngvcm91dGVyLXN0b3JlL3JlcXVlc3QnO1xuXG4vKipcbiAqIFBheWxvYWQgb2YgUk9VVEVSX1JFUVVFU1RcbiAqL1xuZXhwb3J0IHR5cGUgUm91dGVyUmVxdWVzdFBheWxvYWQ8XG4gIFQgZXh0ZW5kcyBCYXNlUm91dGVyU3RvcmVTdGF0ZSA9IFNlcmlhbGl6ZWRSb3V0ZXJTdGF0ZVNuYXBzaG90XG4+ID0ge1xuICByb3V0ZXJTdGF0ZTogVDtcbiAgZXZlbnQ6IE5hdmlnYXRpb25TdGFydDtcbn07XG5cbi8qKlxuICogQW4gYWN0aW9uIGRpc3BhdGNoZWQgd2hlbiBhIHJvdXRlciBuYXZpZ2F0aW9uIHJlcXVlc3QgaXMgZmlyZWQuXG4gKi9cbmV4cG9ydCB0eXBlIFJvdXRlclJlcXVlc3RBY3Rpb248XG4gIFQgZXh0ZW5kcyBCYXNlUm91dGVyU3RvcmVTdGF0ZSA9IFNlcmlhbGl6ZWRSb3V0ZXJTdGF0ZVNuYXBzaG90XG4+ID0ge1xuICB0eXBlOiB0eXBlb2YgUk9VVEVSX1JFUVVFU1Q7XG4gIHBheWxvYWQ6IFJvdXRlclJlcXVlc3RQYXlsb2FkPFQ+O1xufTtcblxuZXhwb3J0IGNvbnN0IHJvdXRlclJlcXVlc3RBY3Rpb24gPSBjcmVhdGVBY3Rpb24oXG4gIFJPVVRFUl9SRVFVRVNULFxuICBwcm9wczx7IHBheWxvYWQ6IFJvdXRlclJlcXVlc3RQYXlsb2FkPFNlcmlhbGl6ZWRSb3V0ZXJTdGF0ZVNuYXBzaG90PiB9PigpXG4pO1xuLyoqXG4gKiBBbiBhY3Rpb24gZGlzcGF0Y2hlZCB3aGVuIHRoZSByb3V0ZXIgbmF2aWdhdGVzLlxuICovXG5leHBvcnQgY29uc3QgUk9VVEVSX05BVklHQVRJT04gPSAnQG5ncngvcm91dGVyLXN0b3JlL25hdmlnYXRpb24nO1xuXG4vKipcbiAqIFBheWxvYWQgb2YgUk9VVEVSX05BVklHQVRJT04uXG4gKi9cbmV4cG9ydCB0eXBlIFJvdXRlck5hdmlnYXRpb25QYXlsb2FkPFxuICBUIGV4dGVuZHMgQmFzZVJvdXRlclN0b3JlU3RhdGUgPSBTZXJpYWxpemVkUm91dGVyU3RhdGVTbmFwc2hvdFxuPiA9IHtcbiAgcm91dGVyU3RhdGU6IFQ7XG4gIGV2ZW50OiBSb3V0ZXNSZWNvZ25pemVkO1xufTtcblxuLyoqXG4gKiBBbiBhY3Rpb24gZGlzcGF0Y2hlZCB3aGVuIHRoZSByb3V0ZXIgbmF2aWdhdGVzLlxuICovXG5leHBvcnQgdHlwZSBSb3V0ZXJOYXZpZ2F0aW9uQWN0aW9uPFxuICBUIGV4dGVuZHMgQmFzZVJvdXRlclN0b3JlU3RhdGUgPSBTZXJpYWxpemVkUm91dGVyU3RhdGVTbmFwc2hvdFxuPiA9IHtcbiAgdHlwZTogdHlwZW9mIFJPVVRFUl9OQVZJR0FUSU9OO1xuICBwYXlsb2FkOiBSb3V0ZXJOYXZpZ2F0aW9uUGF5bG9hZDxUPjtcbn07XG5cbmV4cG9ydCBjb25zdCByb3V0ZXJOYXZpZ2F0aW9uQWN0aW9uID0gY3JlYXRlQWN0aW9uKFxuICBST1VURVJfTkFWSUdBVElPTixcbiAgcHJvcHM8eyBwYXlsb2FkOiBSb3V0ZXJOYXZpZ2F0aW9uUGF5bG9hZDxTZXJpYWxpemVkUm91dGVyU3RhdGVTbmFwc2hvdD4gfT4oKVxuKTtcblxuLyoqXG4gKiBBbiBhY3Rpb24gZGlzcGF0Y2hlZCB3aGVuIHRoZSByb3V0ZXIgY2FuY2VscyBuYXZpZ2F0aW9uLlxuICovXG5leHBvcnQgY29uc3QgUk9VVEVSX0NBTkNFTCA9ICdAbmdyeC9yb3V0ZXItc3RvcmUvY2FuY2VsJztcblxuLyoqXG4gKiBQYXlsb2FkIG9mIFJPVVRFUl9DQU5DRUwuXG4gKi9cbmV4cG9ydCB0eXBlIFJvdXRlckNhbmNlbFBheWxvYWQ8XG4gIFQsXG4gIFYgZXh0ZW5kcyBCYXNlUm91dGVyU3RvcmVTdGF0ZSA9IFNlcmlhbGl6ZWRSb3V0ZXJTdGF0ZVNuYXBzaG90XG4+ID0ge1xuICByb3V0ZXJTdGF0ZTogVjtcbiAgc3RvcmVTdGF0ZTogVDtcbiAgZXZlbnQ6IE5hdmlnYXRpb25DYW5jZWw7XG59O1xuXG4vKipcbiAqIEFuIGFjdGlvbiBkaXNwYXRjaGVkIHdoZW4gdGhlIHJvdXRlciBjYW5jZWxzIG5hdmlnYXRpb24uXG4gKi9cbmV4cG9ydCB0eXBlIFJvdXRlckNhbmNlbEFjdGlvbjxcbiAgVCxcbiAgViBleHRlbmRzIEJhc2VSb3V0ZXJTdG9yZVN0YXRlID0gU2VyaWFsaXplZFJvdXRlclN0YXRlU25hcHNob3Rcbj4gPSB7XG4gIHR5cGU6IHR5cGVvZiBST1VURVJfQ0FOQ0VMO1xuICBwYXlsb2FkOiBSb3V0ZXJDYW5jZWxQYXlsb2FkPFQsIFY+O1xufTtcblxuZXhwb3J0IGNvbnN0IHJvdXRlckNhbmNlbEFjdGlvbiA9IGNyZWF0ZUFjdGlvbihcbiAgUk9VVEVSX0NBTkNFTCxcbiAgcHJvcHM8eyBwYXlsb2FkOiBSb3V0ZXJDYW5jZWxQYXlsb2FkPFNlcmlhbGl6ZWRSb3V0ZXJTdGF0ZVNuYXBzaG90PiB9PigpXG4pO1xuXG4vKipcbiAqIEFuIGFjdGlvbiBkaXNwYXRjaGVkIHdoZW4gdGhlIHJvdXRlciBlcnJvcnMuXG4gKi9cbmV4cG9ydCBjb25zdCBST1VURVJfRVJST1IgPSAnQG5ncngvcm91dGVyLXN0b3JlL2Vycm9yJztcblxuLyoqXG4gKiBQYXlsb2FkIG9mIFJPVVRFUl9FUlJPUi5cbiAqL1xuZXhwb3J0IHR5cGUgUm91dGVyRXJyb3JQYXlsb2FkPFxuICBULFxuICBWIGV4dGVuZHMgQmFzZVJvdXRlclN0b3JlU3RhdGUgPSBTZXJpYWxpemVkUm91dGVyU3RhdGVTbmFwc2hvdFxuPiA9IHtcbiAgcm91dGVyU3RhdGU6IFY7XG4gIHN0b3JlU3RhdGU6IFQ7XG4gIGV2ZW50OiBOYXZpZ2F0aW9uRXJyb3I7XG59O1xuXG4vKipcbiAqIEFuIGFjdGlvbiBkaXNwYXRjaGVkIHdoZW4gdGhlIHJvdXRlciBlcnJvcnMuXG4gKi9cbmV4cG9ydCB0eXBlIFJvdXRlckVycm9yQWN0aW9uPFxuICBULFxuICBWIGV4dGVuZHMgQmFzZVJvdXRlclN0b3JlU3RhdGUgPSBTZXJpYWxpemVkUm91dGVyU3RhdGVTbmFwc2hvdFxuPiA9IHtcbiAgdHlwZTogdHlwZW9mIFJPVVRFUl9FUlJPUjtcbiAgcGF5bG9hZDogUm91dGVyRXJyb3JQYXlsb2FkPFQsIFY+O1xufTtcblxuZXhwb3J0IGNvbnN0IHJvdXRlckVycm9yQWN0aW9uID0gY3JlYXRlQWN0aW9uKFxuICBST1VURVJfRVJST1IsXG4gIHByb3BzPHsgcGF5bG9hZDogUm91dGVyRXJyb3JQYXlsb2FkPFNlcmlhbGl6ZWRSb3V0ZXJTdGF0ZVNuYXBzaG90PiB9PigpXG4pO1xuXG4vKipcbiAqIEFuIGFjdGlvbiBkaXNwYXRjaGVkIGFmdGVyIG5hdmlnYXRpb24gaGFzIGVuZGVkIGFuZCBuZXcgcm91dGUgaXMgYWN0aXZlLlxuICovXG5leHBvcnQgY29uc3QgUk9VVEVSX05BVklHQVRFRCA9ICdAbmdyeC9yb3V0ZXItc3RvcmUvbmF2aWdhdGVkJztcblxuLyoqXG4gKiBQYXlsb2FkIG9mIFJPVVRFUl9OQVZJR0FURUQuXG4gKi9cbmV4cG9ydCB0eXBlIFJvdXRlck5hdmlnYXRlZFBheWxvYWQ8XG4gIFQgZXh0ZW5kcyBCYXNlUm91dGVyU3RvcmVTdGF0ZSA9IFNlcmlhbGl6ZWRSb3V0ZXJTdGF0ZVNuYXBzaG90XG4+ID0ge1xuICByb3V0ZXJTdGF0ZTogVDtcbiAgZXZlbnQ6IE5hdmlnYXRpb25FbmQ7XG59O1xuXG4vKipcbiAqIEFuIGFjdGlvbiBkaXNwYXRjaGVkIGFmdGVyIG5hdmlnYXRpb24gaGFzIGVuZGVkIGFuZCBuZXcgcm91dGUgaXMgYWN0aXZlLlxuICovXG5leHBvcnQgdHlwZSBSb3V0ZXJOYXZpZ2F0ZWRBY3Rpb248XG4gIFQgZXh0ZW5kcyBCYXNlUm91dGVyU3RvcmVTdGF0ZSA9IFNlcmlhbGl6ZWRSb3V0ZXJTdGF0ZVNuYXBzaG90XG4+ID0ge1xuICB0eXBlOiB0eXBlb2YgUk9VVEVSX05BVklHQVRFRDtcbiAgcGF5bG9hZDogUm91dGVyTmF2aWdhdGVkUGF5bG9hZDxUPjtcbn07XG5cbmV4cG9ydCBjb25zdCByb3V0ZXJOYXZpZ2F0ZWRBY3Rpb24gPSBjcmVhdGVBY3Rpb24oXG4gIFJPVVRFUl9OQVZJR0FURUQsXG4gIHByb3BzPHsgcGF5bG9hZDogUm91dGVyTmF2aWdhdGVkUGF5bG9hZDxTZXJpYWxpemVkUm91dGVyU3RhdGVTbmFwc2hvdD4gfT4oKVxuKTtcblxuLyoqXG4gKiBBIHVuaW9uIHR5cGUgb2Ygcm91dGVyIGFjdGlvbnMuXG4gKi9cbmV4cG9ydCB0eXBlIFJvdXRlckFjdGlvbjxcbiAgVCxcbiAgViBleHRlbmRzIEJhc2VSb3V0ZXJTdG9yZVN0YXRlID0gU2VyaWFsaXplZFJvdXRlclN0YXRlU25hcHNob3Rcbj4gPVxuICB8IFJvdXRlclJlcXVlc3RBY3Rpb248Vj5cbiAgfCBSb3V0ZXJOYXZpZ2F0aW9uQWN0aW9uPFY+XG4gIHwgUm91dGVyQ2FuY2VsQWN0aW9uPFQsIFY+XG4gIHwgUm91dGVyRXJyb3JBY3Rpb248VCwgVj5cbiAgfCBSb3V0ZXJOYXZpZ2F0ZWRBY3Rpb248Vj47XG4iXX0=