import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
/**
 * Simple router state.
 * All custom router states / state serializers should have at least
 * the properties of this interface.
 */
export interface BaseRouterStoreState {
    url: string;
}
export declare abstract class RouterStateSerializer<T extends BaseRouterStoreState = BaseRouterStoreState> {
    abstract serialize(routerState: RouterStateSnapshot): T;
}
export interface SerializedRouterStateSnapshot extends BaseRouterStoreState {
    root: ActivatedRouteSnapshot;
    url: string;
}
export declare class DefaultRouterStateSerializer implements RouterStateSerializer<SerializedRouterStateSnapshot> {
    serialize(routerState: RouterStateSnapshot): SerializedRouterStateSnapshot;
    private serializeRoute;
}
