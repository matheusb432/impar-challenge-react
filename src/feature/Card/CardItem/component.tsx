import { CardWrapper } from '../../../components';
import { CardModel } from '../types';
import styles from './style.module.scss';

interface CardItemProps {
  card: CardModel;
}

const CardItem = ({ card }: CardItemProps) => {
  const onEdit = () => {};

  const onDelete = () => {};
  return <CardWrapper>Lorem ipsum dolor sit amet consectetur</CardWrapper>;
};

export default CardItem;
