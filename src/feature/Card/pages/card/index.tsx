import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import {
  BackgroundImage,
  Container,
  Layout,
  SearchInput,
} from '../../../../components';
import { useAxios } from '../../../../hooks';
import { CardHeader } from '../../CardHeader';
import { CardList } from '../../CardList';

const Card = () => {
  const handleFilter = (withDebouce = false) => {
    console.log('filter!', withDebouce);
  };

  return (
    <Layout>
      <BackgroundImage>
        <SearchInput
          id="searchCards"
          placeholder="Digite aqui sua busca..."
          onIconClick={handleFilter}
          onEnter={handleFilter}
          onChange={() => handleFilter(true)}
        />
      </BackgroundImage>
      <Container>
        <CardHeader />
        <CardList />
      </Container>
      <Outlet />
    </Layout>
  );
};

export default Card;
