import { Button } from '../../../components';
import styles from './style.module.scss';

const CardHeader = () => {
  const openNewCard = () => {
    // TODO implement
  };

  return (
    <header className={styles['card-header']}>
      <h2>Resultado de busca</h2>
      <Button type="button" onClick={openNewCard}>
        Novo Card
      </Button>
    </header>
  );
};

export default CardHeader;
