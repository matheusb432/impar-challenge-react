import React from 'react';

import './assets/styles/styles.scss';
import { Layout, SearchInput } from './components';
import { BackgroundImage } from './components/BackgroundImage';

const App = () => {
  return (
    <Layout>
      <BackgroundImage>
        <SearchInput id="searchCards" placeholder="Digite aqui sua busca..." />
      </BackgroundImage>
      Hello World!
    </Layout>
  );
};

export default App;
