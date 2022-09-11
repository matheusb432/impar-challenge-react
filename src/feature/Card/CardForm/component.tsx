import { Mapper } from 'mapper-ts/lib-esm';
import { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { FileInput, Input, InputForwardRef } from '../../../components';
import { FormLayout } from '../../../components/FormLayout';
import { useAppContext, useInputRef } from '../../../hooks';
import { ChangeInputEvent, QueryStatuses, RouteUrls } from '../../../types';
import {
  buildEqId,
  errorMessages,
  validateId,
  validateImage,
  validateText,
} from '../../../utils';
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

  const [nameValid, setNameValid] = useState(false);
  const [statusValid, setStatusValid] = useState(false);
  const [photoValid, setPhotoValid] = useState(false);

  const [toggle, setToggle] = useState<boolean | undefined>(undefined);

  const [formIsValid, setFormIsValid] = useState(false);

  const { changeError } = useAppContext();
  const { cardState, dispatchCard } = useCardContext();
  const { cards, formCard, photoUpload } = cardState;

  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);

  const {
    isLoading: isLoadingCard,
    data: getData,
    status: getStatus,
    mutate: getCard,
  } = api.useODataMutation<CardModel[]>({ $filter: buildEqId(id) });

  const {
    isLoading: isLoadingPhotoUpload,
    data: uploadPhotoData,
    status: uploadPhotoStatus,
    mutate: uploadPhoto,
  } = api.usePostPhoto(photoUpload?.file);

  const {
    isLoading: isLoadingUpdatePhoto,
    status: updatePhotoStatus,
    mutate: updatePhoto,
  } = api.usePutPhoto(formCard?.photoId, photoUpload?.file);

  const {
    isLoading: isLoadingCreateCard,
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

  const {
    isLoading: isLoadingUpdateCard,
    status: updateCardStatus,
    mutate: updateCard,
  } = api.usePut(
    formCard?.id,
    CardModel.forPut(
      formCard?.id,
      nameRef.current?.getValue(),
      statusRef.current?.getValue(),
      uploadPhotoData?.data?.id ?? formCard?.photoId
    )
  );

  useEffect(() => {
    setIsLoadingSubmit(
      isLoadingCreateCard ||
        isLoadingUpdateCard ||
        isLoadingPhotoUpload ||
        isLoadingUpdatePhoto
    );
  }, [
    isLoadingCreateCard,
    isLoadingPhotoUpload,
    isLoadingUpdateCard,
    isLoadingUpdatePhoto,
  ]);

  useEffect(() => {
    if (toggle === undefined) return;

    updateCard();
  }, [toggle, updateCard]);

  const setInputs = useCallback(
    (card: CardModel) => {
      // TODO error toast
      if (card == null) return;

      nameRef.current!.setValue(card.name);
      statusRef.current!.setValue(card.status);

      if (isEditing) {
        setNameValid(true);
        setStatusValid(true);
        setPhotoValid(true);
      }
    },
    [nameRef, statusRef, isEditing]
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

  useEffect(() => {
    setFormIsValid(nameValid && statusValid && photoValid);
  }, [nameValid, photoValid, statusValid]);

  const handleFormSubmit = (event: SyntheticEvent) => {
    event.preventDefault();

    handleSubmit();
  };

  const handleSubmit = (): void => {
    if (!formIsValid) {
      // TODO toast warning here
      console.log('not valid!');

      return;
    }

    console.log(imageChanged);
    if (!isEditing) return uploadPhoto();
    if (imageChanged) return updatePhoto();
    console.log(nameRef?.current?.getValue().toString());
    console.log(statusRef?.current?.getValue().toString());
    setToggle((prevState) => !prevState);
    // updateCard();
  };

  const handlePhotoChange = (event: ChangeInputEvent) => {
    const file = event.target.files![0];

    const result = validatePhoto(file);

    console.log(result, isEditing);
    if (!result) return;

    dispatchCard({
      type: CardActions.SetPhotoUpload,
      payload: PhotoUpload.fromFile(event.target.files![0]),
    });

    if (isEditing) {
      setImageChanged(true);
    }
  };

  const validateName = () => {
    const name = nameRef.current?.getValue();

    setNameValid(validateText(name, { min: 1, max: 100 }));
  };

  const validateStatus = () => {
    const status = statusRef.current?.getValue();

    setStatusValid(validateText(status, { required: false, min: 1, max: 100 }));
  };

  const validatePhoto = (photo?: File) => {
    photo ??= photoUpload?.file;
    // const photo = photoRef.current?.getValue();
    console.log(photo?.type);
    const result = validateImage(photo);

    setPhotoValid(result);

    return result;
  };

  return (
    <FormLayout
      onSubmit={handleSubmit}
      title={label}
      submitLabel={label}
      canSubmit={formIsValid}
      isLoadingSubmit={isLoadingSubmit}
    >
      <form onSubmit={handleFormSubmit}>
        <Input
          id="cardName"
          label="Digite um nome para o card"
          placeholder="Digite o título"
          helperText={
            'Nome inválido! precisa ser um valor de 1 e 100 caracteres'
          }
          ref={nameRef}
          onBlur={validateName}
          isInvalid={!nameValid}
        />
        <Input
          id="cardStatus"
          label="Defina o status do card"
          placeholder="Digite o status"
          helperText={
            'Status inválido! precisa ser um valor de 0 e 100 caracteres'
          }
          ref={statusRef}
          required={false}
          onBlur={validateStatus}
          isInvalid={!statusValid}
        />
        <FileInput
          id="cardPhoto"
          accept=""
          helperText={'Arquivo inválido!'}
          isInvalid={!photoValid}
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
