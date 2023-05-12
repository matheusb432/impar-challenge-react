import { Mapper } from 'mapper-ts/lib-esm';
import { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { FileInput, Input } from '../../../components';
import { FormLayout } from '../../../components/FormLayout';
import { ToastData } from '../../../components/Toast/toast-data';
import { useAppContext, useInput } from '../../../hooks';
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
import { usePhotoApi } from '../hooks/use-photo-api';

interface CardFormProps {
  isEditing: boolean;
}

function CardForm({ isEditing }: CardFormProps) {
  const navigate = useNavigate();
  const { id } = useParams();
  const cardApi = useCardApi();
  const photoApi = usePhotoApi();

  const [label, setLabel] = useState<string>('');
  const [imageChanged, setImageChanged] = useState(false);

  const validateName = useCallback((name: string) => validateText(name, { min: 1, max: 100 }), []);
  const validateStatus = useCallback(
    (status: string) => validateText(status, { required: false, min: 1, max: 100 }),
    [],
  );

  const {
    value: name,
    isValid: nameIsValid,
    hasError: nameHasError,
    changeHandler: nameChangeHandler,
    blurHandler: nameBlurHandler,
    setValue: setName,
  } = useInput(validateName);
  const {
    value: status,
    isValid: statusIsValid,
    hasError: statusHasError,
    setValue: setStatus,
    changeHandler: statusChangeHandler,
    blurHandler: statusBlurHandler,
  } = useInput(validateStatus);
  const { blurHandler: photoBlurHandler, touched: photoTouched } = useInput();

  const [photoValid, setPhotoValid] = useState(false);

  const formIsValid = nameIsValid && statusIsValid && photoValid;

  const [toggleUpdateCard, setToggleUpdateCard] = useState<boolean | undefined>(undefined);

  const { changeError, showToast } = useAppContext();
  const { cardState, dispatchCard } = useCardContext();
  const { cards, formCard, photoUpload } = cardState;

  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);

  const {
    data: getData,
    status: getStatus,
    mutate: getCard,
  } = cardApi.useODataMutation<CardModel[]>({ $filter: buildEqId(id) });

  const {
    isLoading: isLoadingPhotoUpload,
    data: uploadPhotoData,
    status: uploadPhotoStatus,
    mutate: uploadPhoto,
  } = photoApi.usePost(photoUpload?.file);

  const {
    isLoading: isLoadingUpdatePhoto,
    status: updatePhotoStatus,
    mutate: updatePhoto,
  } = photoApi.usePut(formCard?.photoId, photoUpload?.file);

  const {
    isLoading: isLoadingCreateCard,
    data: createdCardData,
    status: createCardStatus,
    mutate: createCard,
  } = cardApi.usePost(CardModel.forPost(name, status, uploadPhotoData?.id));

  const {
    isLoading: isLoadingUpdateCard,
    status: updateCardStatus,
    mutate: updateCard,
  } = cardApi.usePutId(
    formCard?.id ?? 0,
    CardModel.forPut(formCard?.id, name, status, uploadPhotoData?.id ?? formCard?.photoId),
  );

  const getDispatchBase64Photo = useCallback(async (): Promise<string | unknown> => {
    const file = photoUpload?.file;

    return file != null ? toBase64(file) : formCard?.base64;
  }, [formCard?.base64, photoUpload?.file]);

  useEffect(() => {
    setIsLoadingSubmit(
      isLoadingCreateCard || isLoadingUpdateCard || isLoadingPhotoUpload || isLoadingUpdatePhoto,
    );
  }, [isLoadingCreateCard, isLoadingPhotoUpload, isLoadingUpdateCard, isLoadingUpdatePhoto]);

  useEffect(() => {
    if (toggleUpdateCard === undefined) return;

    updateCard();
  }, [toggleUpdateCard, updateCard]);

  const setInputs = useCallback(
    (card: CardModel) => {
      if (card == null) return;

      setName(card.name!);

      setStatus(card.status!);

      if (isEditing) setPhotoValid(true);
    },
    [isEditing, setName, setStatus],
  );

  useEffect(() => {
    if (updateCardStatus !== QueryStatuses.Success) return;
    async function dispatchUpdatedCard(): Promise<void> {
      showToast(ToastData.success('Card atualizado com sucesso!'));

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
          formCard?.photoId!,
        ),
      });

      navigate(RouteUrls.Cards);
    }
    dispatchUpdatedCard();
  }, [
    dispatchCard,
    formCard?.id,
    formCard?.photoId,
    getDispatchBase64Photo,
    name,
    navigate,
    showToast,
    status,
    updateCardStatus,
  ]);

  useEffect(() => {
    if (createCardStatus !== QueryStatuses.Success) return;
    async function dispatchCreatedCard(): Promise<void> {
      showToast(ToastData.success('Card criado com sucesso!'));

      let photoBase64: string | unknown = '';
      try {
        photoBase64 = await getDispatchBase64Photo();
      } catch (ex) {
        showToast(ToastData.error(errorMessages.photoDispatchError));
      }
      dispatchCard({
        type: CardActions.AddCard,
        payload: CardModel.fromApiUpdate(
          createdCardData?.id!,
          name,
          status,
          photoBase64 as string,
          uploadPhotoData?.id!,
        ),
      });

      navigate(RouteUrls.Cards);
    }
    dispatchCreatedCard();
  }, [
    createdCardData?.id,
    dispatchCard,
    createCardStatus,
    navigate,
    photoUpload.file,
    showToast,
    uploadPhotoData?.id,
    getDispatchBase64Photo,
    name,
    status,
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

    const cardFromApi = getData?.[0];

    if (cardFromApi == null) {
      returnToList();
      return;
    }

    const mappedCard = new Mapper(CardModel).map(cardFromApi);

    dispatchCard({
      type: CardActions.SetFormCard,
      payload: mappedCard,
    });
  }, [getStatus, getData, returnToList, dispatchCard]);

  useEffect(() => {
    if (!isEditing) return;

    if (!validateId(id)) {
      returnToList();
      return;
    }

    const cardId = +id!;

    const cardToEdit = cards.find((c) => c.id === cardId);

    if (cardToEdit == null) {
      getCard();
      return;
    }

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

  const handleFormSubmit = (event: SyntheticEvent) => {
    event.preventDefault();

    handleSubmit();
  };

  const handleSubmit = (): void => {
    if (!formIsValid) {
      return showToast(ToastData.warning('Formulário inválido, não é possível submeter!'));
    }

    if (!isEditing) return uploadPhoto();
    if (imageChanged) return updatePhoto();
    return setToggleUpdateCard((prevState) => !prevState);
  };

  const handlePhotoChange = (event: ChangeInputEvent) => {
    photoBlurHandler();

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

  const validatePhoto = (photo?: File) => {
    const result = validateImage(photo ?? photoUpload?.file);

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
          helperText="Nome inválido! Precisa ser um valor de 1 e 100 caracteres"
          value={name}
          onChange={nameChangeHandler}
          hasError={nameHasError}
          onBlur={nameBlurHandler}
        />
        <Input
          id="cardStatus"
          label="Defina o status do card"
          placeholder="Digite o status"
          helperText="Status inválido! Precisa ser um valor de 0 e 100 caracteres"
          required={false}
          value={status}
          onChange={statusChangeHandler}
          hasError={statusHasError}
          onBlur={statusBlurHandler}
        />
        <FileInput
          id="cardPhoto"
          accept=""
          helperText="Arquivo inválido!"
          label={
            isEditing
              ? 'Inclua uma imagem para substituir a imagem no card'
              : 'Inclua uma imagem para aparecer no card'
          }
          onChange={handlePhotoChange}
          fileName={photoUpload?.file?.name ?? ''}
          hasError={!photoValid && photoTouched}
        />
      </form>
    </FormLayout>
  );
}

export default CardForm;
