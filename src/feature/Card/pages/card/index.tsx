import { Outlet } from 'react-router-dom';
import {
  BackgroundImage,
  Container,
  Layout,
  SearchInput,
} from '../../../../components';
import { CardHeader } from '../../CardHeader';
import { CardList } from '../../CardList';

const Card = () => {
  return (
    <Layout>
      <BackgroundImage>
        <SearchInput
          id="searchCards"
          placeholder="Digite aqui sua busca..."
          filter={() => {}}
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
