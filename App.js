import React from 'react';
import {View, Text} from 'react-native';
import {Loader} from './src/component';
import {StoreProvider} from './src/context/store';
import Nav from './src/navigation';

const App = () => {
  return (
    <StoreProvider>
      <Nav />
      <Loader />
    </StoreProvider>
  );
};

export default App;
