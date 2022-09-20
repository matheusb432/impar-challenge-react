import { Mapper } from 'mapper-ts/lib-esm';
import { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { FileInput, Input, InputForwardRef } from '../../../components';
import { FormLayout } from '../../../components/FormLayout';
import { ToastData } from '../../../components/Toast/toast-data';
import { useAppContext, useElementRef } from '../../../hooks';
import { ChangeInputEvent, QueryStatuses, RouteUrls } from '../../../types';
import {
  buildEqId,
  errorMessages,
  toBase64,
  validateId,
  validateImage,
  validateText,
} from '../../../utils';
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
  const [imageChanged, setImageChanged] = useState(false);

  const nameRef = useElementRef<InputForwardRef>();
  const statusRef = useElementRef<InputForwardRef>();
  const photoRef = useElementRef<InputForwardRef>();

  const [nameValid, setNameValid] = useState(false);
  const [statusValid, setStatusValid] = useState(true);
  const [photoValid, setPhotoValid] = useState(false);

  const [toggleUpdateCard, setToggleUpdateCard] = useState<boolean | undefined>(
    undefined
  );

  const [formIsValid, setFormIsValid] = useState(false);

  const { changeError, showToast } = useAppContext();
  const { cardState, dispatchCard } = useCardContext();
  const { cards, formCard, photoUpload } = cardState;

  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);

  const {
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

  const getDispatchBase64Photo = useCallback(async (): Promise<
    string | unknown
  > => {
    const file = photoUpload?.file;

    return file != null ? toBase64(file) : formCard?.base64;
  }, [formCard?.base64, photoUpload?.file]);

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
    if (toggleUpdateCard === undefined) return;

    updateCard();
  }, [toggleUpdateCard, updateCard]);

  const setInputs = useCallback(
    (card: CardModel) => {
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
    async function dispatchUpdatedCard(): Promise<void> {
      showToast(ToastData.success('Card atualizado com sucesso!'));

      const name = nameRef.current!.getValue();
      const status = statusRef.current!.getValue();
      let photoBase64: string | unknown = '';
      try {
        photoBase64 = await getDispatchBase64Photo();
      } catch (ex) {
        showToast(ToastData.error(errorMessages.photoDispatchError));
      }

      dispatchCard({
        type: CardActions.EditCard,
        payload: CardModel.fromApiUpdate(
          formCard?.id!,
          name,
          status,
          photoBase64 as string,
          formCard?.photoId!
        ),
      });

      navigate(RouteUrls.Cards);
    }
    dispatchUpdatedCard();
  }, [
    nameRef,
    statusRef,
    formCard?.id,
    navigate,
    dispatchCard,
    updateCardStatus,
    photoUpload.file,
    formCard?.photoId,
    getDispatchBase64Photo,
    showToast,
  ]);

  useEffect(() => {
    if (createCardStatus !== QueryStatuses.Success) return;
    async function dispatchCreatedCard(): Promise<void> {
      showToast(ToastData.success('Card criado com sucesso!'));

      const name = nameRef.current!.getValue();
      const status = statusRef.current!.getValue();
      let photoBase64: string | unknown = '';
      try {
        photoBase64 = await getDispatchBase64Photo();
      } catch (ex) {
        showToast(ToastData.error(errorMessages.photoDispatchError));
      }
      dispatchCard({
        type: CardActions.AddCard,
        payload: CardModel.fromApiUpdate(
          createdCardData?.data.id!,
          name,
          status,
          photoBase64 as string,
          uploadPhotoData?.data?.id!
        ),
      });

      navigate(RouteUrls.Cards);
    }
    dispatchCreatedCard();
  }, [
    createdCardData?.data.id,
    nameRef,
    statusRef,
    dispatchCard,
    createCardStatus,
    navigate,
    photoUpload.file,
    showToast,
    uploadPhotoData?.data?.id,
    getDispatchBase64Photo,
  ]);

  useEffect(() => {
    if (updatePhotoStatus !== QueryStatuses.Success) return;
    showToast(ToastData.success('Imagem atualizada com sucesso!'));

    updateCard();
  }, [updatePhotoStatus, updateCard, showToast]);

  useEffect(() => {
    if (uploadPhotoStatus !== QueryStatuses.Success) return;
    showToast(ToastData.success('Upload de imagem feito com sucesso!'));

    createCard();
  }, [uploadPhotoStatus, createCard, showToast]);

  const returnToList = useCallback(() => {
    changeError(errorMessages.invalidCardId);

    navigate(RouteUrls.Cards);
  }, [navigate, changeError]);

  const clearForm = useCallback(() => {
    dispatchCard({
      type: CardActions.SetFormCard,
      payload: CardModel.empty(),
    });

    dispatchCard({
      type: CardActions.SetPhotoUpload,
      payload: PhotoUpload.empty(),
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
      return showToast(
        ToastData.warning('Formulário inválido, não é possível submeter!')
      );
    }

    if (!isEditing) return uploadPhoto();
    if (imageChanged) return updatePhoto();
    setToggleUpdateCard((prevState) => !prevState);
  };

  const handlePhotoChange = (event: ChangeInputEvent) => {
    const file = event.target.files![0];

    const result = validatePhoto(file);

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
          blurOnChange={true}
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
