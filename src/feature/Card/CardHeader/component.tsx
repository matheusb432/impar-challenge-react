import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components';
import { Title } from '../../../components/Title';
import { RouteUrls } from '../../../types';
import styles from './style.module.scss';

const CardHeader = () => {
  const navigate = useNavigate();

  const handleNewCardClick = () => {
    navigate(RouteUrls.CardsCreate);
  };

  return (
    <header className={styles['card-header']}>
      <Title text="Resultado de busca" />
      <Button type="button" onClick={handleNewCardClick}>
        Novo Card
      </Button>
    </header>
  );
};

export default CardHeader;
