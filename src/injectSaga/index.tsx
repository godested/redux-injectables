import { useContext, useEffect } from 'react';
import { SagaInjectableStore, MODES } from 'injectableSaga';
import { ReactReduxContext } from 'react-redux';
import { Saga } from 'redux-saga';
import getInjectors from './getInjectors';

export function useInjectableSaga<S extends Saga>(
  key: string,
  saga: S,
  mode: keyof typeof MODES,
  ...params: Parameters<S>
): void {
  const { store } = useContext(ReactReduxContext);

  const { injectSaga, ejectSaga } = getInjectors(store as SagaInjectableStore);

  injectSaga(key, saga, mode, ...params);

  useEffect(() => () => ejectSaga(key));
}

// TODO: HOC
