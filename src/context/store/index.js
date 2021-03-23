import React, {useReducer} from 'react';
import {Loader} from '../reducers';

export const Store = React.createContext();

const dispatch = {};

export function StoreProvider(props) {
  // * All REDUCERS

  const [mapLoaderState, dispatchLoaderAction] = useReducer(Loader, dispatch);

  // * VALUES of All REDUCERS
  const loaderValue = {mapLoaderState, dispatchLoaderAction};
  // * COMBINE ALL VALUES
  const value = {
    ...loaderValue,
  };

  // *Store

  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
