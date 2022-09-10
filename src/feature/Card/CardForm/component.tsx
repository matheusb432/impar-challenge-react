import { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { FileInput, Input, InputForwardRef } from '../../../components';
import { FormLayout } from '../../../components/FormLayout';
import { useAppContext, useInputRef } from '../../../hooks';
import { ChangeInputEvent, QueryStatuses, RouteUrls } from '../../../types';
import { errorMessages, validateId } from '../../../utils';
import { useCardContext } from '../hooks';
import { useCardApi } from '../hooks/use-card-api';
import { CardActions } from '../store';
import { CardModel } from '../types';
import { PhotoUpload } from '../types/photo-upload';

interface CardFormProps {
  isEditing: boolean;
}

const CardForm = ({ isEditing }: CardFormProps) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const api = useCardApi();

  const [label, setLabel] = useState<string>('');

  const nameRef = useInputRef<InputForwardRef>();
  const statusRef = useInputRef<InputForwardRef>();

  const { changeError } = useAppContext();
  const { cardState, dispatchCard } = useCardContext();
  const { cards, formCard, photoUpload } = cardState;

  const {
    data: uploadPhotoData,
    status: uploadPhotoStatus,
    mutate: uploadPhoto,
  } = api.usePostPhoto(photoUpload?.file);
  const {
    data: createdCardData,
    status: createCardStatus,
    mutate: createCard,
  } = api.usePost(
    CardModel.forPost(
      nameRef.current?.getValue(),
      statusRef.current?.getValue(),
      uploadPhotoData?.data?.id
    )
  );
  // TODO implement PUT request
  // const {
  //   data: updatedCardData,
  //   status: updateCardStatus,
  //   mutate: updateCard,
  // } = api.usePut(
  //   formCard?.id,
  //   nameRef.current?.getValue(),
  //   statusRef.current?.getValue(),
  //   uploadPhotoData?.data?.id
  // );

  useEffect(() => {
    if (createCardStatus !== QueryStatuses.Success) return;
    console.log(createdCardData.data.id);
    //  TODO add create card success toast
    const name = nameRef.current!.getValue();
    const status = statusRef.current!.getValue();

    dispatchCard({
      type: CardActions.AddCard,
      payload: CardModel.fromInputs(name, status, ''),
    });

    navigate(RouteUrls.Cards);
  }, [createCardStatus]);

  // TODO move to callback
  useEffect(() => {
    if (uploadPhotoStatus !== QueryStatuses.Success) return;
    console.log(uploadPhotoData.data.id);

    // TODO add upload success toast

    createCard();
  }, [uploadPhotoStatus]);

  const returnToList = useCallback(() => {
    changeError(errorMessages.invalidCardId);

    navigate(RouteUrls.Cards);
  }, [navigate, changeError]);

  const clearForm = useCallback(() => {
    dispatchCard({
      type: CardActions.SetFormCard,
      payload: CardModel.empty(),
    });
  }, [dispatchCard]);

  useEffect(() => {
    if (!isEditing) clearForm();
  }, [clearForm, isEditing]);

  useEffect(() => {
    if (!isEditing) return;

    if (!validateId(id)) {
      returnToList();

      return;
    }

    const cardId = +id!;

    // TODO replace with api get to card by id
    const cardToEdit = cards.find((c) => c.id === cardId);

    if (cardToEdit == null) {
      returnToList();

      return;
    }

    dispatchCard({
      type: CardActions.SetFormCard,
      payload: cardToEdit,
    });
  }, [id, isEditing, dispatchCard, navigate, cards, returnToList]);

  useEffect(() => {
    setLabel(isEditing ? 'Editar card' : 'Criar card');
  }, [isEditing]);

  useEffect(() => {
    setInputs(formCard);
  }, [formCard]);

  const setInputs = (card: CardModel) => {
    // TODO error toast
    if (card == null) return;

    nameRef.current!.setValue(card.name);
    statusRef.current!.setValue(card.status);
  };

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();

    handleFormSubmit();
  };

  const handleFormSubmit = () => {
    if (!isEditing) {
      uploadPhoto();
    } else {
      // TODO update photo if necessary on PUT
    }
  };

  const handlePhotoChange = (event: ChangeInputEvent) => {
    dispatchCard({
      type: CardActions.SetPhotoUpload,
      payload: PhotoUpload.fromFile(event.target.files![0]),
    });
  };

  return (
    <FormLayout onSubmit={handleFormSubmit} title={label} submitLabel={label}>
      <form onSubmit={handleSubmit}>
        <Input
          id="cardName"
          label="Digite um nome para o card"
          placeholder="Digite o título"
          ref={nameRef}
        />
        <Input
          id="cardStatus"
          label="Defina o status do card"
          placeholder="Digite o status"
          ref={statusRef}
        />
        <FileInput
          id="cardPhoto"
          label="Inclua uma imagem para aparecer no card"
          placeholder="Nenhum arquivo selecionado"
          onChange={handlePhotoChange}
        />
      </form>
    </FormLayout>
  );
};

export default CardForm;
