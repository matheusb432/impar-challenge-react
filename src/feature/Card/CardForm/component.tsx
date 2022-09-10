import { Mapper } from 'mapper-ts/lib-esm';
import { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { FileInput, Input, InputForwardRef } from '../../../components';
import { FormLayout } from '../../../components/FormLayout';
import { useAppContext, useInputRef } from '../../../hooks';
import { ChangeInputEvent, QueryStatuses, RouteUrls } from '../../../types';
import { buildEqId, errorMessages, validateId } from '../../../utils';
import { useCardContext } from '../hooks';
import { useCardApi } from '../hooks/use-card-api';
import { CardActions } from '../store';
import { CardModel, PhotoModel } from '../types';
import { PhotoUpload } from '../types/photo-upload';

interface CardFormProps {
  isEditing: boolean;
}

const CardForm = ({ isEditing }: CardFormProps) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const api = useCardApi();

  const [label, setLabel] = useState<string>('');
  const [imageChanged, setImageChanged] = useState(false);

  const nameRef = useInputRef<InputForwardRef>();
  const statusRef = useInputRef<InputForwardRef>();
  const photoRef = useInputRef<InputForwardRef>();

  const { changeError } = useAppContext();
  const { cardState, dispatchCard } = useCardContext();
  const { cards, formCard, photoUpload } = cardState;

  const {
    data: getData,
    status: getStatus,
    mutate: getCard,
  } = api.useODataMutation<CardModel[]>({ $filter: buildEqId(id) });

  const {
    data: uploadPhotoData,
    status: uploadPhotoStatus,
    mutate: uploadPhoto,
  } = api.usePostPhoto(photoUpload?.file);

  const { status: updatePhotoStatus, mutate: updatePhoto } = api.usePutPhoto(
    formCard?.photoId,
    photoUpload?.file
  );

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

  const { status: updateCardStatus, mutate: updateCard } = api.usePut(
    formCard?.id,
    CardModel.forPut(
      formCard?.id,
      nameRef.current?.getValue(),
      statusRef.current?.getValue(),
      uploadPhotoData?.data?.id ?? formCard?.photoId
    )
  );

  const setInputs = useCallback(
    (card: CardModel) => {
      // TODO error toast
      if (card == null) return;

      nameRef.current!.setValue(card.name);
      statusRef.current!.setValue(card.status);
    },
    [nameRef, statusRef]
  );

  useEffect(() => {
    if (updateCardStatus !== QueryStatuses.Success) return;

    //  TODO add create card success toast
    const name = nameRef.current!.getValue();
    const status = statusRef.current!.getValue();

    // TODO add base 64 on dispatch
    dispatchCard({
      type: CardActions.EditCard,
      payload: CardModel.fromApiUpdate(formCard?.id!, name, status, ''),
    });

    navigate(RouteUrls.Cards);
  }, [
    nameRef,
    statusRef,
    formCard?.id,
    navigate,
    dispatchCard,
    updateCardStatus,
  ]);

  useEffect(() => {
    if (createCardStatus !== QueryStatuses.Success) return;

    //  TODO add create card success toast
    const name = nameRef.current!.getValue();
    const status = statusRef.current!.getValue();

    // TODO add base 64 on dispatch
    dispatchCard({
      type: CardActions.AddCard,
      payload: CardModel.fromApiUpdate(
        createdCardData?.data.id,
        name,
        status,
        ''
      ),
    });

    navigate(RouteUrls.Cards);
  }, [
    createdCardData?.data.id,
    nameRef,
    statusRef,
    dispatchCard,
    createCardStatus,
    navigate,
  ]);

  // TODO move to callback
  useEffect(() => {
    if (updatePhotoStatus !== QueryStatuses.Success) return;
    // TODO add update photo success toast

    updateCard();
  }, [updatePhotoStatus, updateCard]);

  // TODO move to callback
  useEffect(() => {
    if (uploadPhotoStatus !== QueryStatuses.Success) return;
    // TODO add upload photo success toast

    createCard();
  }, [uploadPhotoStatus, createCard]);

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
    if (getStatus !== QueryStatuses.Success) return;

    const cardFromApi = getData?.data?.[0];

    if (cardFromApi == null) return returnToList();

    const mappedCard = new Mapper(CardModel).map(cardFromApi);

    dispatchCard({
      type: CardActions.SetFormCard,
      payload: mappedCard,
    });
  }, [getStatus, getData, returnToList, dispatchCard]);

  useEffect(() => {
    if (!isEditing) return;

    if (!validateId(id)) return returnToList();

    const cardId = +id!;

    const cardToEdit = cards.find((c) => c.id === cardId);

    if (cardToEdit == null) return getCard();

    dispatchCard({
      type: CardActions.SetFormCard,
      payload: cardToEdit,
    });
  }, [id, isEditing, dispatchCard, navigate, cards, returnToList, getCard]);

  useEffect(() => {
    setLabel(isEditing ? 'Editar card' : 'Criar card');
  }, [isEditing]);

  useEffect(() => {
    setInputs(formCard);
  }, [setInputs, formCard]);

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();

    handleFormSubmit();
  };

  const handleFormSubmit = (): void => {
    if (!isEditing) return uploadPhoto();
    if (imageChanged) return updatePhoto();
    updateCard();
  };

  const handlePhotoChange = (event: ChangeInputEvent) => {
    dispatchCard({
      type: CardActions.SetPhotoUpload,
      payload: PhotoUpload.fromFile(event.target.files![0]),
    });

    if (isEditing) {
      setImageChanged(true);
    }
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
          label={
            isEditing
              ? 'Inclua uma imagem para substituir a imagem no card'
              : 'Inclua uma imagem para aparecer no card'
          }
          onChange={handlePhotoChange}
          ref={photoRef}
        />
      </form>
    </FormLayout>
  );
};

export default CardForm;
