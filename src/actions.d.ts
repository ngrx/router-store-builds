import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, RoutesRecognized } from '@angular/router';
import { BaseRouterStoreState, SerializedRouterStateSnapshot } from './serializer';
/**
 * An action dispatched when a router navigation request is fired.
 */
export declare const ROUTER_REQUEST = "@ngrx/router-store/request";
/**
 * Payload of ROUTER_REQUEST
 */
export declare type RouterRequestPayload = {
    event: NavigationStart;
};
/**
 * An action dispatched when a router navigation request is fired.
 */
export declare type RouterRequestAction = {
    type: typeof ROUTER_REQUEST;
    payload: RouterRequestPayload;
};
/**
 * An action dispatched when the router navigates.
 */
export declare const ROUTER_NAVIGATION = "@ngrx/router-store/navigation";
/**
 * Payload of ROUTER_NAVIGATION.
 */
export declare type RouterNavigationPayload<T extends BaseRouterStoreState> = {
    routerState: T;
    event: RoutesRecognized;
};
/**
 * An action dispatched when the router navigates.
 */
export declare type RouterNavigationAction<T extends BaseRouterStoreState = SerializedRouterStateSnapshot> = {
    type: typeof ROUTER_NAVIGATION;
    payload: RouterNavigationPayload<T>;
};
/**
 * An action dispatched when the router cancels navigation.
 */
export declare const ROUTER_CANCEL = "@ngrx/router-store/cancel";
/**
 * Payload of ROUTER_CANCEL.
 */
export declare type RouterCancelPayload<T, V extends BaseRouterStoreState> = {
    routerState: V;
    storeState: T;
    event: NavigationCancel;
};
/**
 * An action dispatched when the router cancel navigation.
 */
export declare type RouterCancelAction<T, V extends BaseRouterStoreState = SerializedRouterStateSnapshot> = {
    type: typeof ROUTER_CANCEL;
    payload: RouterCancelPayload<T, V>;
};
/**
 * An action dispatched when the router errors.
 */
export declare const ROUTER_ERROR = "@ngrx/router-store/error";
/**
 * Payload of ROUTER_ERROR.
 */
export declare type RouterErrorPayload<T, V extends BaseRouterStoreState> = {
    routerState: V;
    storeState: T;
    event: NavigationError;
};
/**
 * An action dispatched when the router errors.
 */
export declare type RouterErrorAction<T, V extends BaseRouterStoreState = SerializedRouterStateSnapshot> = {
    type: typeof ROUTER_ERROR;
    payload: RouterErrorPayload<T, V>;
};
/**
 * An action dispatched after navigation has ended and new route is active.
 */
export declare const ROUTER_NAVIGATED = "@ngrx/router-store/navigated";
/**
 * Payload of ROUTER_NAVIGATED.
 */
export declare type RouterNavigatedPayload = {
    event: NavigationEnd;
};
/**
 * An action dispatched after navigation has ended and new route is active.
 */
export declare type RouterNavigatedAction = {
    type: typeof ROUTER_NAVIGATED;
    payload: RouterNavigatedPayload;
};
/**
 * An union type of router actions.
 */
export declare type RouterAction<T, V extends BaseRouterStoreState = SerializedRouterStateSnapshot> = RouterRequestAction | RouterNavigationAction<V> | RouterCancelAction<T, V> | RouterErrorAction<T, V> | RouterNavigatedAction;
