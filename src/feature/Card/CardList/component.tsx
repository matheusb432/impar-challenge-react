import { Button } from '../../../components';
import { CardItem } from '../CardItem';
import { CardModel } from '../types';
import styles from './style.module.scss';

const CardList = () => {
  // TODO header tag to component?
  const cards: CardModel[] = [
    {
      id: 1,
      name: 'card 1',
      status: 'status 1',
    },
    {
      id: 2,
      name: 'card 2',
      status: 'status 2',
    },
    {
      id: 3,
      name: 'card 3',
      status: 'status 3',
    },
    {
      id: 4,
      name: 'card 4',
      status: 'status 4',
    },
    {
      id: 5,
      name: 'card 5',
      status: 'status 5',
    },
  ];

  return (
    <ul className={styles['card-list']}>
      {cards.map((c) => (
        <CardItem key={c.id} card={c} />
      ))}
    </ul>
  );
};

export default CardList;
