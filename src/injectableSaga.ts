import { Store } from 'redux';
import { SagaMiddleware, Task, Saga } from 'redux-saga';

type Mode = 
  | '@@saga-injector/restart-on-remount'
  | '@@saga-injector/daemon'
  | '@@saga-injector/once-till-unmount';

export const MODES = {
  RESTART_ON_REMOUNT: '@@saga-injector/restart-on-remount',
  DAEMON: '@@saga-injector/daemon',
  ONCE_TILL_UNMOUNT: '@@saga-injector/once-till-unmount',
};

export interface Descriptor {
  mode: Mode;
  saga: Saga;
  task: Task;
  done: boolean;
}

export type InjectedSagas = Record<string, Descriptor>;

export interface SagaInjectableStore extends Store {
  runSaga<S extends Saga>(
    key: string,
    saga: S,
    mode: Mode,
    ...params: Parameters<S>
  ): Task;
  injectedSagas: InjectedSagas;
}

export function makeSagaInjectableStore(
  store: Store & SagaInjectableStore,
  sagaMiddleware: SagaMiddleware
): SagaInjectableStore {
  store.injectedSagas = {};

  store.runSaga = <S extends Saga>(
    key: string,
    saga: S,
    mode: Mode,
    ...params: Parameters<S>
  ) => {
    const task = sagaMiddleware.run(saga, ...params);

    store.injectedSagas[key] = {
      saga,
      mode,
      task,
      done: false,
    };

    return task;
  };

  return store;
}
