import { ReactNode, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrashIcon } from '../../../assets/icons';
import { Modal, ModalData } from '../../../components';
import { ToastData } from '../../../components/Toast/toast-data';
import { useAppContext } from '../../../hooks';
import { QueryStatuses, RouteUrls } from '../../../types';
import { errorMessages, sortArrayByProp } from '../../../utils';
import { CardItem } from '../CardItem';
import { useCardContext } from '../hooks';
import { useCardApi } from '../hooks/use-card-api';
import { CardModel } from '../types';
import { SharedProps } from '../types/shared-props.enum';
import styles from './style.module.scss';

function CardList() {
  const navigate = useNavigate();
  const api = useCardApi();
  const { showToast } = useAppContext();

  const [cardToDelete, setCardToDelete] = useState<CardModel | null>(null);

  const {
    isLoading: isLoadingDelete,
    status: deleteStatus,
    mutate: deleteRequest,
  } = api.useRemove(cardToDelete?.id ?? 0);

  const [showModal, setShowModal] = useState(false);
  const [renderedCards, setRenderedCards] = useState<ReactNode[]>([]);

  const { cardState, dispatchCard, resetCardsPage } = useCardContext();

  const { cards } = cardState;

  useEffect(() => {
    if (isLoadingDelete) return;

    resetCardsPage();
  }, [isLoadingDelete, resetCardsPage]);

  useEffect(() => {
    if (deleteStatus !== QueryStatuses.Success) return;

    showToast(ToastData.success('Card excluído com sucesso!'));
    setShowModal(false);
  }, [deleteStatus, dispatchCard, showToast]);

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
    [navigate],
  );

  const handleDelete = useCallback((card: CardModel) => {
    setCardToDelete(card);

    setShowModal(true);
  }, []);

  const renderCards = useCallback(() => {
    sortArrayByProp(cards, SharedProps.Id);

    return cards.map((c) => (
      <CardItem key={c.id ?? Math.random()} card={c} onEdit={handleEdit} onDelete={handleDelete} />
    ));
  }, [cards, handleEdit, handleDelete]);

  useEffect(() => {
    setRenderedCards(renderCards());
  }, [renderCards]);

  const deleteCard = () => {
    if (cardToDelete == null) {
      showToast(ToastData.error(errorMessages.deleteCard));

      return;
    }

    deleteRequest();
  };

  const handleClose = () => {
    setShowModal(false);
    setCardToDelete(null);
  };

  const handleConfirm = () => {
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
        isLoadingConfirm={isLoadingDelete}
      >
        Certeza que deseja excluir?
      </Modal>
    </>
  );
}

export default CardList;
