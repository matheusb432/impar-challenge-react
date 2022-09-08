import React from 'react';

import './assets/styles/styles.scss';
import { Layout, SearchInput } from './components';
import { BackgroundImage } from './components/BackgroundImage';
import { Container } from './components/Container';
import { CardList, CardHeader } from './feature/Card';

import styles from './style.module.scss';

const App = () => {
  return (
    <Layout>
      <BackgroundImage>
        <SearchInput
          className={styles['card-search-input']}
          id="searchCards"
          placeholder="Digite aqui sua busca..."
          filter={() => {}}
        />
      </BackgroundImage>
      {/* TODO routing will go inside here */}
      <Container>
        <CardHeader />
        <CardList />
      </Container>
    </Layout>
  );
};

export default App;
