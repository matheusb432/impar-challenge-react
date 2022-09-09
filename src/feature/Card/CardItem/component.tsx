import { PencilIcon, TrashIcon } from '../../../assets/icons';
import { CardWrapper, IconButton } from '../../../components';
import { CardModel } from '../types';
import styles from './style.module.scss';

interface CardItemProps {
  card: CardModel;
}

const CardItem = ({ card }: CardItemProps) => {
  const onEdit = () => {
    // TODO open edit form with selected card
  };

  const onDelete = () => {};
  return (
    <li>
      <CardWrapper
        actions={
          <>
            <IconButton
              icon={<TrashIcon className={'ui__remove-icon'} />}
              onClick={onDelete}
              label="Excluir"
            />
            <div className={styles.dash}></div>
            <IconButton
              icon={<PencilIcon className={'ui__edit-icon'} />}
              onClick={onEdit}
              label="Editar"
            />
          </>
        }
      >
        {card.name}
      </CardWrapper>
    </li>
  );
};

export default CardItem;
