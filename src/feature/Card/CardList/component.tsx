import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrashIcon } from '../../../assets/icons';
import { Modal, ModalData } from '../../../components';
import { RouteUrls } from '../../../types';
import { sortArrayByProp } from '../../../utils';
import { CardItem } from '../CardItem';
import { useCardContext } from '../hooks';
import { CardActions } from '../store';
import { CardModel } from '../types';
import { SharedProps } from '../types/shared-props.enum';
import styles from './style.module.scss';

const CardList = () => {
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<CardModel | null>(null);
  const [renderedCards, setRenderedCards] = useState<JSX.Element[]>([]);

  const { cardState, dispatchCard } = useCardContext();

  const { cards } = cardState;

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
    const mappedCards = cards.map((c) => c);

    sortArrayByProp(mappedCards, SharedProps.Id);

    return mappedCards.map((c) => (
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

    // try {
    // TODO add delete api call here
    // } catch (ex) {
    // TODO handle error here or on service?
    //   throw ex;
    // }

    dispatchCard({
      type: CardActions.RemoveCard,
      payload: cardToDelete,
    });

    // TODO add success toast here
    navigate(RouteUrls.Cards);
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
