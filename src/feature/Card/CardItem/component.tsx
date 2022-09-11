import { PencilIcon, TrashIcon } from '../../../assets/icons';
import { CardWrapper, IconButton } from '../../../components';
import { CardModel } from '../types';
import styles from './style.module.scss';

interface CardItemProps {
  card: CardModel;
  onEdit: (card: CardModel) => void;
  onDelete: (card: CardModel) => void;
}

const CardItem = ({ card, onEdit, onDelete }: CardItemProps) => {
  return (
    <li>
      <CardWrapper
        actions={
          <>
            <IconButton
              icon={<TrashIcon className={'ui__remove-icon'} />}
              onClick={() => onDelete(card)}
              label="Excluir"
              theme="#db2525"
            />
            <div className={styles.dash}></div>
            <IconButton
              icon={<PencilIcon className={'ui__edit-icon'} />}
              onClick={() => onEdit(card)}
              label="Editar"
              theme="#e76316"
            />
          </>
        }
        base64={card.base64}
      >
        {card.name}
      </CardWrapper>
    </li>
  );
};

export default CardItem;
