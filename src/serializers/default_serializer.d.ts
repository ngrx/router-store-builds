import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { BaseRouterStoreState, RouterStateSerializer } from './shared';
export interface SerializedRouterStateSnapshot extends BaseRouterStoreState {
    root: ActivatedRouteSnapshot;
    url: string;
}
export declare class DefaultRouterStateSerializer implements RouterStateSerializer<SerializedRouterStateSnapshot> {
    serialize(routerState: RouterStateSnapshot): SerializedRouterStateSnapshot;
    private serializeRoute;
}
