import { Reducer } from 'redux';
import { ReducerInjectableStore } from 'injectableReducer';

export function injectReducerFactory(store: ReducerInjectableStore) {
  return function injectReducer(key: string, reducer: Reducer) {
    /**
     * Check `store.injectedReducers[key] === reducer`
     * for hot reloading when a key is the same but a reducer is different
     */
    if (
      Reflect.has(store.injectedReducers, key) &&
      store.injectedReducers[key] === reducer
    ) {
      return;
    }

    store.injectReducer(key, reducer);
  };
}

export default function getInjectors(store: ReducerInjectableStore) {
  return {
    injectReducer: injectReducerFactory(store),
  };
}
