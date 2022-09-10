import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrashIcon } from '../../../assets/icons';
import { Modal, ModalData } from '../../../components';
import { useAxios } from '../../../hooks';
import { paginationQuery, QueryStatuses, RouteUrls } from '../../../types';
import { sortArrayByProp } from '../../../utils';
import { CardItem } from '../CardItem';
import { useCardContext } from '../hooks';
import { useCardApi } from '../hooks/use-card-api';
import { CardActions } from '../store';
import { CardModel } from '../types';
import { SharedProps } from '../types/shared-props.enum';
import styles from './style.module.scss';

const CardList = () => {
  const navigate = useNavigate();
  const api = useCardApi();

  const [cardToDelete, setCardToDelete] = useState<CardModel | null>(null);

  const { status: deleteStatus, mutate: deleteRequest } = api.useDelete(
    cardToDelete?.id
  );

  const [showModal, setShowModal] = useState(false);
  const [renderedCards, setRenderedCards] = useState<JSX.Element[]>([]);

  const { cardState, dispatchCard } = useCardContext();

  const { cards } = cardState;

  useEffect(() => {
    // if (deleteStatus) return;
    // TODO add error toast here if it is error
    if (deleteStatus !== QueryStatuses.Success) return;

    dispatchCard({
      type: CardActions.RemoveCard,
      payload: cardToDelete!,
    });
  }, [deleteStatus, cardToDelete, dispatchCard, navigate]);

  const modalData: ModalData = {
    title: 'Excluir',
    confirmText: 'Excluir',
    iconFn: TrashIcon,
    iconProps: { className: 'ui__remove-icon' },
    colorTheme: '#db2525',
  };

  const handleEdit = useCallback(
    (card: CardModel) => {
      const id = card?.id;

      navigate(`${RouteUrls.CardsEdit}/${id}`);
    },
    [navigate]
  );

  const handleDelete = useCallback((card: CardModel) => {
    setCardToDelete(card);

    setShowModal(true);
  }, []);

  const renderCards = useCallback(() => {
    sortArrayByProp(cards, SharedProps.Id);

    return cards.map((c) => (
      <CardItem
        key={c.id ?? Math.random()}
        card={c}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    ));
  }, [cards, handleEdit, handleDelete]);

  useEffect(() => {
    setRenderedCards(renderCards());
  }, [renderCards]);

  const deleteCard = () => {
    // TODO add error toast here
    if (cardToDelete == null) return;

    deleteRequest();
  };

  const handleClose = () => {
    setShowModal(false);
    setCardToDelete(null);
  };

  const handleConfirm = () => {
    setShowModal(false);
    deleteCard();
  };

  return (
    <>
      <ul className={styles['card-list']}>{renderedCards}</ul>
      <Modal
        modalData={modalData}
        show={showModal}
        onClose={handleClose}
        onConfirm={handleConfirm}
      >
        Certeza que deseja excluir?
      </Modal>
    </>
  );
};

export default CardList;
