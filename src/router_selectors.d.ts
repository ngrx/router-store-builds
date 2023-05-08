import { MemoizedSelector } from '@ngrx/store';
import { RouterStateSelectors } from './models';
import { RouterReducerState } from './reducer';
export declare function createRouterSelector<State extends Record<string, any>>(): MemoizedSelector<State, RouterReducerState>;
export declare function getRouterSelectors<V extends Record<string, any>>(selectState?: (state: V) => RouterReducerState<any>): RouterStateSelectors<V>;
