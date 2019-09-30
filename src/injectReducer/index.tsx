import React, { useContext, ComponentType } from 'react';
import { Reducer } from 'redux';
import { useSelector, ReactReduxContext } from 'react-redux';
import { ReducerInjectableStore } from 'injectableReducer';
import hoistNonReactStatics from 'hoist-non-react-statics';
import getInjectors from './getInjectors';

export function useInjectableReducer<R extends Reducer, S>(
  key: string,
  reducer: R
): S {
  const { store } = useContext(ReactReduxContext);

  const injectors = getInjectors(store as ReducerInjectableStore);
  injectors.injectReducer(key, reducer);

  return useSelector((state: { [key: string]: S }) => state[key]);
}

export default function injectReducer<R extends Reducer>(
  key: string,
  reducer: R
) {
  return (Component: ComponentType): ComponentType => {
    function ReducerInjector(props: object) {
      useInjectableReducer(key, reducer);

      return <Component {...props} />;
    }

    ReducerInjector.displayName = `withReducer(${Component.displayName ||
      Component.name ||
      'Component'})`;

    return hoistNonReactStatics(ReducerInjector, Component);
  };
}
