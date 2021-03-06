import { ROUTER_CANCEL, ROUTER_ERROR, ROUTER_NAVIGATION, } from './actions';
export function routerReducer(state, action) {
    // Allow compilation with strictFunctionTypes - ref: #1344
    const routerAction = action;
    switch (routerAction.type) {
        case ROUTER_NAVIGATION:
        case ROUTER_ERROR:
        case ROUTER_CANCEL:
            return {
                state: routerAction.payload.routerState,
                navigationId: routerAction.payload.event.id,
            };
        default:
            return state;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVkdWNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL21vZHVsZXMvcm91dGVyLXN0b3JlL3NyYy9yZWR1Y2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFDTCxhQUFhLEVBQ2IsWUFBWSxFQUNaLGlCQUFpQixHQUVsQixNQUFNLFdBQVcsQ0FBQztBQVduQixNQUFNLFVBQVUsYUFBYSxDQUczQixLQUF5QixFQUFFLE1BQWM7SUFDekMsMERBQTBEO0lBQzFELE1BQU0sWUFBWSxHQUFHLE1BQXdDLENBQUM7SUFDOUQsUUFBUSxZQUFZLENBQUMsSUFBSSxFQUFFO1FBQ3pCLEtBQUssaUJBQWlCLENBQUM7UUFDdkIsS0FBSyxZQUFZLENBQUM7UUFDbEIsS0FBSyxhQUFhO1lBQ2hCLE9BQVE7Z0JBQ04sS0FBSyxFQUFFLFlBQVksQ0FBQyxPQUFPLENBQUMsV0FBVztnQkFDdkMsWUFBWSxFQUFFLFlBQVksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7YUFDdEIsQ0FBQztRQUMxQjtZQUNFLE9BQU8sS0FBZSxDQUFDO0tBQzFCO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFjdGlvbiB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcbmltcG9ydCB7XG4gIFJPVVRFUl9DQU5DRUwsXG4gIFJPVVRFUl9FUlJPUixcbiAgUk9VVEVSX05BVklHQVRJT04sXG4gIFJvdXRlckFjdGlvbixcbn0gZnJvbSAnLi9hY3Rpb25zJztcbmltcG9ydCB7IEJhc2VSb3V0ZXJTdG9yZVN0YXRlIH0gZnJvbSAnLi9zZXJpYWxpemVycy9iYXNlJztcbmltcG9ydCB7IFNlcmlhbGl6ZWRSb3V0ZXJTdGF0ZVNuYXBzaG90IH0gZnJvbSAnLi9zZXJpYWxpemVycy9kZWZhdWx0X3NlcmlhbGl6ZXInO1xuXG5leHBvcnQgdHlwZSBSb3V0ZXJSZWR1Y2VyU3RhdGU8XG4gIFQgZXh0ZW5kcyBCYXNlUm91dGVyU3RvcmVTdGF0ZSA9IFNlcmlhbGl6ZWRSb3V0ZXJTdGF0ZVNuYXBzaG90XG4+ID0ge1xuICBzdGF0ZTogVDtcbiAgbmF2aWdhdGlvbklkOiBudW1iZXI7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gcm91dGVyUmVkdWNlcjxcbiAgUm91dGVyU3RhdGUgZXh0ZW5kcyBCYXNlUm91dGVyU3RvcmVTdGF0ZSA9IFNlcmlhbGl6ZWRSb3V0ZXJTdGF0ZVNuYXBzaG90LFxuICBSZXN1bHQgPSBSb3V0ZXJSZWR1Y2VyU3RhdGU8Um91dGVyU3RhdGU+XG4+KHN0YXRlOiBSZXN1bHQgfCB1bmRlZmluZWQsIGFjdGlvbjogQWN0aW9uKTogUmVzdWx0IHtcbiAgLy8gQWxsb3cgY29tcGlsYXRpb24gd2l0aCBzdHJpY3RGdW5jdGlvblR5cGVzIC0gcmVmOiAjMTM0NFxuICBjb25zdCByb3V0ZXJBY3Rpb24gPSBhY3Rpb24gYXMgUm91dGVyQWN0aW9uPGFueSwgUm91dGVyU3RhdGU+O1xuICBzd2l0Y2ggKHJvdXRlckFjdGlvbi50eXBlKSB7XG4gICAgY2FzZSBST1VURVJfTkFWSUdBVElPTjpcbiAgICBjYXNlIFJPVVRFUl9FUlJPUjpcbiAgICBjYXNlIFJPVVRFUl9DQU5DRUw6XG4gICAgICByZXR1cm4gKHtcbiAgICAgICAgc3RhdGU6IHJvdXRlckFjdGlvbi5wYXlsb2FkLnJvdXRlclN0YXRlLFxuICAgICAgICBuYXZpZ2F0aW9uSWQ6IHJvdXRlckFjdGlvbi5wYXlsb2FkLmV2ZW50LmlkLFxuICAgICAgfSBhcyB1bmtub3duKSBhcyBSZXN1bHQ7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBzdGF0ZSBhcyBSZXN1bHQ7XG4gIH1cbn1cbiJdfQ==