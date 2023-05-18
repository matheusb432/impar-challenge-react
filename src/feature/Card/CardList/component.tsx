import { ReactNode, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DeleteModal } from '../../../components/Modals';
import { ToastData } from '../../../components/Toast/toast-data';
import { useAppContext } from '../../../hooks';
import { RouteUrls } from '../../../types';
import { errorMessages, sortArrayByProp } from '../../../utils';
import { CardItem } from '../CardItem';
import { useCardContext } from '../hooks';
import { useCardApi } from '../hooks/use-card-api';
import { CardModel } from '../types';
import { SharedProps } from '../types/shared-props.enum';
import styles from './style.module.scss';
import { CardActions } from '../store';

function CardList() {
  const navigate = useNavigate();
  const api = useCardApi();
  const { showToast } = useAppContext();
  const { dispatchCard } = useCardContext();

  const [modalState, setModalState] = useState<{ id: number | null; show: boolean }>({
    id: null,
    show: false,
  });
  const { id, show } = modalState;

  const { isLoading: isLoadingDelete, mutate: deleteRequest } = api.useRemove({
    onSuccess: () => {
      showToast(ToastData.success('Card excluído com sucesso!'));
      const cardId = id;
      if (cardId == null) {
        api.invalidateFeatureQueries();
      } else {
        dispatchCard({
          type: CardActions.RemoveById,
          payload: cardId,
        });
      }
      changeModalStateById(null);
    },
  });

  const [renderedCards, setRenderedCards] = useState<ReactNode[]>([]);

  const { cardState } = useCardContext();

  const { cards } = cardState;

  const changeModalStateById = useCallback((newId: number | null) => {
    setModalState((prevState) => ({
      ...prevState,
      id: newId,
      show: newId != null,
    }));
  }, []);

  const handleEdit = useCallback(
    (card: CardModel) => {
      navigate(`${RouteUrls.CardsEdit}/${card?.id}`);
    },
    [navigate],
  );

  const handleDelete = useCallback((card: CardModel) => {
    const { id: newId } = card;
    if (newId == null) {
      showToast(ToastData.error(errorMessages.invalidCardModalId));

      return;
    }

    changeModalStateById(newId);
  }, []);

  const renderCards = useCallback(() => {
    sortArrayByProp(cards, SharedProps.Id);

    return cards.map((c, i) => (
      <CardItem
        key={c.id ?? Math.random()}
        card={c}
        name={`card-item${i}`}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    ));
  }, [cards, handleEdit, handleDelete]);

  useEffect(() => {
    setRenderedCards(renderCards());
  }, [renderCards]);

  const deleteCard = () => {
    if (id == null) return showToast(ToastData.error(errorMessages.deleteCard));

    return deleteRequest(id);
  };

  const handleClose = () => changeModalStateById(null);
  const handleConfirm = () => deleteCard();

  return (
    <>
      <ul className={styles['card-list']}>{renderedCards}</ul>
      <DeleteModal
        show={show}
        onClose={handleClose}
        onConfirm={handleConfirm}
        isLoadingConfirm={isLoadingDelete}
      />
    </>
  );
}

export default CardList;
