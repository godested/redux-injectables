import { Store, Reducer } from 'redux';

export type DynamicReducers = Record<string, Reducer>;
export type ReducerCreator = (asyncReducers: DynamicReducers) => Reducer;

export interface ReducerInjectableStore extends Store {
  injectedReducers: DynamicReducers;
  injectReducer(key: string, reducer: Reducer): void;
}

export function makeReducerInjectableStore(
  store: Store & ReducerInjectableStore,
  reducerCreator: ReducerCreator
): ReducerInjectableStore {
  store.injectedReducers = {};

  store.injectReducer = (key, asyncReducer) => {
    store.injectedReducers[key] = asyncReducer;
    store.replaceReducer(reducerCreator(store.injectedReducers));
  };

  return store;
}
