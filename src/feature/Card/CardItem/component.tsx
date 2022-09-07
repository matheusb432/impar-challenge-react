import { CardModel } from '../types';
import styles from './style.module.scss';

interface CardItemProps {
  card: CardModel;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const CardItem = ({ card, onEdit, onDelete }: CardItemProps) => {
  return <></>;
};

export default CardItem;
