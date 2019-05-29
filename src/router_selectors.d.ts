import { RouterReducerState } from '@ngrx/router-store';
import { RouterStateSelectors } from './models';
export declare function getSelectors<V>(selectState: (state: V) => RouterReducerState<any>): RouterStateSelectors<V>;
