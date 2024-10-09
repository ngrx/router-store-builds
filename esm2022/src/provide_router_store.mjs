import { ENVIRONMENT_INITIALIZER, inject, makeEnvironmentProviders, } from '@angular/core';
import { _createRouterConfig, _ROUTER_CONFIG, ROUTER_CONFIG, RouterState, } from './router_store_config';
import { FullRouterStateSerializer, } from './serializers/full_serializer';
import { MinimalRouterStateSerializer } from './serializers/minimal_serializer';
import { RouterStateSerializer, } from './serializers/base';
import { StoreRouterConnectingService } from './store_router_connecting.service';
/**
 * Connects the Angular Router to the Store.
 *
 * @usageNotes
 *
 * ```ts
 * bootstrapApplication(AppComponent, {
 *   providers: [
 *     provideStore({ router: routerReducer }),
 *     provideRouterStore(),
 *   ],
 * });
 * ```
 */
export function provideRouterStore(config = {}) {
    return makeEnvironmentProviders([
        { provide: _ROUTER_CONFIG, useValue: config },
        {
            provide: ROUTER_CONFIG,
            useFactory: _createRouterConfig,
            deps: [_ROUTER_CONFIG],
        },
        {
            provide: RouterStateSerializer,
            useClass: config.serializer
                ? config.serializer
                : config.routerState === RouterState.Full
                    ? FullRouterStateSerializer
                    : MinimalRouterStateSerializer,
        },
        {
            provide: ENVIRONMENT_INITIALIZER,
            multi: true,
            useFactory() {
                return () => inject(StoreRouterConnectingService);
            },
        },
        StoreRouterConnectingService,
    ]);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvdmlkZV9yb3V0ZXJfc3RvcmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9tb2R1bGVzL3JvdXRlci1zdG9yZS9zcmMvcHJvdmlkZV9yb3V0ZXJfc3RvcmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLHVCQUF1QixFQUV2QixNQUFNLEVBQ04sd0JBQXdCLEdBQ3pCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFDTCxtQkFBbUIsRUFDbkIsY0FBYyxFQUNkLGFBQWEsRUFDYixXQUFXLEdBRVosTUFBTSx1QkFBdUIsQ0FBQztBQUMvQixPQUFPLEVBQ0wseUJBQXlCLEdBRTFCLE1BQU0sK0JBQStCLENBQUM7QUFDdkMsT0FBTyxFQUFFLDRCQUE0QixFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDaEYsT0FBTyxFQUVMLHFCQUFxQixHQUN0QixNQUFNLG9CQUFvQixDQUFDO0FBQzVCLE9BQU8sRUFBRSw0QkFBNEIsRUFBRSxNQUFNLG1DQUFtQyxDQUFDO0FBRWpGOzs7Ozs7Ozs7Ozs7O0dBYUc7QUFDSCxNQUFNLFVBQVUsa0JBQWtCLENBRWhDLFNBQStCLEVBQUU7SUFDakMsT0FBTyx3QkFBd0IsQ0FBQztRQUM5QixFQUFFLE9BQU8sRUFBRSxjQUFjLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRTtRQUM3QztZQUNFLE9BQU8sRUFBRSxhQUFhO1lBQ3RCLFVBQVUsRUFBRSxtQkFBbUI7WUFDL0IsSUFBSSxFQUFFLENBQUMsY0FBYyxDQUFDO1NBQ3ZCO1FBQ0Q7WUFDRSxPQUFPLEVBQUUscUJBQXFCO1lBQzlCLFFBQVEsRUFBRSxNQUFNLENBQUMsVUFBVTtnQkFDekIsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFVO2dCQUNuQixDQUFDLENBQUMsTUFBTSxDQUFDLFdBQVcsS0FBSyxXQUFXLENBQUMsSUFBSTtvQkFDekMsQ0FBQyxDQUFDLHlCQUF5QjtvQkFDM0IsQ0FBQyxDQUFDLDRCQUE0QjtTQUNqQztRQUNEO1lBQ0UsT0FBTyxFQUFFLHVCQUF1QjtZQUNoQyxLQUFLLEVBQUUsSUFBSTtZQUNYLFVBQVU7Z0JBQ1IsT0FBTyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsNEJBQTRCLENBQUMsQ0FBQztZQUNwRCxDQUFDO1NBQ0Y7UUFDRCw0QkFBNEI7S0FDN0IsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIEVOVklST05NRU5UX0lOSVRJQUxJWkVSLFxuICBFbnZpcm9ubWVudFByb3ZpZGVycyxcbiAgaW5qZWN0LFxuICBtYWtlRW52aXJvbm1lbnRQcm92aWRlcnMsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgX2NyZWF0ZVJvdXRlckNvbmZpZyxcbiAgX1JPVVRFUl9DT05GSUcsXG4gIFJPVVRFUl9DT05GSUcsXG4gIFJvdXRlclN0YXRlLFxuICBTdG9yZVJvdXRlckNvbmZpZyxcbn0gZnJvbSAnLi9yb3V0ZXJfc3RvcmVfY29uZmlnJztcbmltcG9ydCB7XG4gIEZ1bGxSb3V0ZXJTdGF0ZVNlcmlhbGl6ZXIsXG4gIFNlcmlhbGl6ZWRSb3V0ZXJTdGF0ZVNuYXBzaG90LFxufSBmcm9tICcuL3NlcmlhbGl6ZXJzL2Z1bGxfc2VyaWFsaXplcic7XG5pbXBvcnQgeyBNaW5pbWFsUm91dGVyU3RhdGVTZXJpYWxpemVyIH0gZnJvbSAnLi9zZXJpYWxpemVycy9taW5pbWFsX3NlcmlhbGl6ZXInO1xuaW1wb3J0IHtcbiAgQmFzZVJvdXRlclN0b3JlU3RhdGUsXG4gIFJvdXRlclN0YXRlU2VyaWFsaXplcixcbn0gZnJvbSAnLi9zZXJpYWxpemVycy9iYXNlJztcbmltcG9ydCB7IFN0b3JlUm91dGVyQ29ubmVjdGluZ1NlcnZpY2UgfSBmcm9tICcuL3N0b3JlX3JvdXRlcl9jb25uZWN0aW5nLnNlcnZpY2UnO1xuXG4vKipcbiAqIENvbm5lY3RzIHRoZSBBbmd1bGFyIFJvdXRlciB0byB0aGUgU3RvcmUuXG4gKlxuICogQHVzYWdlTm90ZXNcbiAqXG4gKiBgYGB0c1xuICogYm9vdHN0cmFwQXBwbGljYXRpb24oQXBwQ29tcG9uZW50LCB7XG4gKiAgIHByb3ZpZGVyczogW1xuICogICAgIHByb3ZpZGVTdG9yZSh7IHJvdXRlcjogcm91dGVyUmVkdWNlciB9KSxcbiAqICAgICBwcm92aWRlUm91dGVyU3RvcmUoKSxcbiAqICAgXSxcbiAqIH0pO1xuICogYGBgXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwcm92aWRlUm91dGVyU3RvcmU8XG4gIFQgZXh0ZW5kcyBCYXNlUm91dGVyU3RvcmVTdGF0ZSA9IFNlcmlhbGl6ZWRSb3V0ZXJTdGF0ZVNuYXBzaG90XG4+KGNvbmZpZzogU3RvcmVSb3V0ZXJDb25maWc8VD4gPSB7fSk6IEVudmlyb25tZW50UHJvdmlkZXJzIHtcbiAgcmV0dXJuIG1ha2VFbnZpcm9ubWVudFByb3ZpZGVycyhbXG4gICAgeyBwcm92aWRlOiBfUk9VVEVSX0NPTkZJRywgdXNlVmFsdWU6IGNvbmZpZyB9LFxuICAgIHtcbiAgICAgIHByb3ZpZGU6IFJPVVRFUl9DT05GSUcsXG4gICAgICB1c2VGYWN0b3J5OiBfY3JlYXRlUm91dGVyQ29uZmlnLFxuICAgICAgZGVwczogW19ST1VURVJfQ09ORklHXSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHByb3ZpZGU6IFJvdXRlclN0YXRlU2VyaWFsaXplcixcbiAgICAgIHVzZUNsYXNzOiBjb25maWcuc2VyaWFsaXplclxuICAgICAgICA/IGNvbmZpZy5zZXJpYWxpemVyXG4gICAgICAgIDogY29uZmlnLnJvdXRlclN0YXRlID09PSBSb3V0ZXJTdGF0ZS5GdWxsXG4gICAgICAgID8gRnVsbFJvdXRlclN0YXRlU2VyaWFsaXplclxuICAgICAgICA6IE1pbmltYWxSb3V0ZXJTdGF0ZVNlcmlhbGl6ZXIsXG4gICAgfSxcbiAgICB7XG4gICAgICBwcm92aWRlOiBFTlZJUk9OTUVOVF9JTklUSUFMSVpFUixcbiAgICAgIG11bHRpOiB0cnVlLFxuICAgICAgdXNlRmFjdG9yeSgpIHtcbiAgICAgICAgcmV0dXJuICgpID0+IGluamVjdChTdG9yZVJvdXRlckNvbm5lY3RpbmdTZXJ2aWNlKTtcbiAgICAgIH0sXG4gICAgfSxcbiAgICBTdG9yZVJvdXRlckNvbm5lY3RpbmdTZXJ2aWNlLFxuICBdKTtcbn1cbiJdfQ==