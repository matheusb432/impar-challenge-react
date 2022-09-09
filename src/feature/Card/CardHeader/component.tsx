import { Button } from '../../../components';
import { Title } from '../../../components/Title';
import styles from './style.module.scss';

const CardHeader = () => {
  const openNewCard = () => {
    // TODO implement
  };

  return (
    <header className={styles['card-header']}>
      <Title text="Resultado de busca" />
      <Button type="button" onClick={openNewCard}>
        Novo Card
      </Button>
    </header>
  );
};

export default CardHeader;
