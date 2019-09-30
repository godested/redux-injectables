import { Store } from 'redux';
import { SagaMiddleware, Task, Saga } from 'redux-saga';

export type InjectedSagas = Record<string, Task>;

export interface SagaInjectableStore extends Store {
  runSaga<S extends Saga>(key: string, saga: S): Task;
}

export function makeSagaInjectableStore(
  store: Store & SagaInjectableStore,
  sagaMiddleware: SagaMiddleware
): SagaInjectableStore {
  const injectedSagas: InjectedSagas = {};

  store.runSaga = <S extends Saga>(
    key: string,
    saga: S,
    ...params: Parameters<S>
  ) => {
    const task = sagaMiddleware.run(saga, ...params);

    injectedSagas[key] = task;

    return task;
  };

  return store;
}
