import { Saga } from 'redux-saga';
import { SagaInjectableStore, MODES } from 'injectableSaga';

export function injectSagaFactory(store: SagaInjectableStore) {
  return function injectSaga<S extends Saga>(
    key: string,
    saga: S,
    mode: keyof typeof MODES,
    ...params: Parameters<S>
  ) {
    let hasSaga = Reflect.has(store.injectedSagas, key);

    if (process.env.NODE_ENV !== 'production') {
      const oldDescriptor = store.injectedSagas[key];
      if (hasSaga && oldDescriptor.saga !== saga) {
        oldDescriptor.task.cancel();
        hasSaga = false;
      }
    }

    if (
      !hasSaga ||
      (hasSaga && mode !== MODES.DAEMON && mode !== MODES.ONCE_TILL_UNMOUNT)
    ) {
      store.runSaga(key, saga, mode, ...params);
    }
  };
}

export function ejectSagaFactory(store: SagaInjectableStore) {
  return function ejectSaga(key: string) {
    if (!Reflect.has(store.injectedSagas, key)) {
      return;
    }

    const descriptor = store.injectedSagas[key];

    if (descriptor.mode && descriptor.mode !== MODES.DAEMON) {
      descriptor.task.cancel();
      if (process.env.NODE_ENV !== 'production') {
        store.injectedSagas[key].done = true;
      }
    }
  };
}

export default function getInjectors(store: SagaInjectableStore) {
  return {
    injectSaga: injectSagaFactory(store),
    ejectSaga: ejectSagaFactory(store),
  };
}
