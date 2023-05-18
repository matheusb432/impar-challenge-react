import { SyntheticEvent, useCallback, useEffect, useMemo, useState } from 'react';
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
import { CardModel, PhotoModel } from '../types';
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

  const { changeError, showToast } = useAppContext();
  const { cardState, dispatchCard } = useCardContext();
  const { cards, formCard, photoUpload } = cardState;

  const { data: getData, status: getStatus } = cardApi.useOData<CardModel[]>(
    { $filter: buildEqId(id) },
    { enabled: isEditing },
  );

  const {
    isLoading: isLoadingPhotoUpload,
    data: uploadPhotoData,
    mutate: uploadPhoto,
  } = photoApi.usePost({
    onSuccess: (res) => {
      createCard(CardModel.forPost(name, status, res.id));
    },
  });

  const { isLoading: isLoadingUpdatePhoto, mutate: updatePhoto } = photoApi.usePut({
    onSuccess: () => {
      updateCard(updateCardPayload);
    },
  });

  const { isLoading: isLoadingCreateCard, mutate: createCard } = cardApi.usePost({
    onSuccess: (res, vars) => {
      const uploadPhotoId = vars.photoId;

      if (!uploadPhotoId) return cardApi.invalidateFeatureQueries();

      return handleCreatedCard(res.id, uploadPhotoId);
    },
  });

  const { isLoading: isLoadingUpdateCard, mutate: updateCard } = cardApi.usePut({
    onSuccess(_, variables) {
      const card = variables;

      const updatedId = card?.id;
      const photoId = card.body?.photoId;

      if (!updatedId || !photoId) return cardApi.invalidateFeatureQueries();

      return dispatchUpdatedCard(updatedId, photoId);
    },
  });

  const isLoadingSubmit =
    isLoadingCreateCard || isLoadingUpdateCard || isLoadingPhotoUpload || isLoadingUpdatePhoto;

  const updateCardPayload = useMemo(
    () => ({
      id: formCard.id ?? 0,
      body: CardModel.forPut(formCard?.id, name, status, uploadPhotoData?.id ?? formCard.photoId),
    }),
    [formCard.id, name, status, uploadPhotoData?.id, formCard.photoId],
  );

  const getDispatchBase64Photo = useCallback(async (): Promise<string | unknown> => {
    const file = photoUpload?.file;

    return file != null ? toBase64(file) : formCard?.photo?.base64 ?? '';
  }, [formCard?.photo?.base64, photoUpload?.file]);

  const setInputs = useCallback(
    (card: CardModel) => {
      if (card == null) return;

      setName(card.name!);

      setStatus(card.status!);

      if (isEditing) setPhotoValid(true);
    },
    [isEditing, setName, setStatus],
  );

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

    dispatchCard({
      type: CardActions.SetFormCard,
      payload: cardFromApi,
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

    if (cardToEdit == null) return;

    dispatchCard({
      type: CardActions.SetFormCard,
      payload: cardToEdit,
    });
  }, [id, isEditing, dispatchCard, cards, returnToList]);

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

  async function handleCreatedCard(cardId: number, photoId: number): Promise<void> {
    showToast(ToastData.success('Card criado com sucesso!'));

    let photoBase64: string | unknown = '';
    try {
      photoBase64 = await getDispatchBase64Photo();
    } catch (ex) {
      showToast(ToastData.error(errorMessages.photoDispatchError));
    }
    dispatchCard({
      type: CardActions.AddCard,
      payload: CardModel.fromApiUpdate(cardId, name, status, photoBase64 as string, photoId),
    });

    navigate(RouteUrls.Cards);
  }

  async function dispatchUpdatedCard(updatedId: number, photoId: number): Promise<void> {
    showToast(ToastData.success('Card atualizado com sucesso!'));

    let photoBase64: string | unknown = '';
    try {
      photoBase64 = await getDispatchBase64Photo();
    } catch (ex) {
      showToast(ToastData.error(errorMessages.photoDispatchError));
    }

    dispatchCard({
      type: CardActions.EditCard,
      payload: CardModel.fromApiUpdate(updatedId, name, status, photoBase64 as string, photoId),
    });

    navigate(RouteUrls.Cards);
  }

  function handleSubmit() {
    if (!formIsValid) {
      return showToast(ToastData.warning('Formulário inválido, não é possível submeter!'));
    }

    if (!isEditing) {
      return uploadPhoto(PhotoModel.createPhotoFormData(photoUpload?.file));
    }
    if (imageChanged) {
      return updatePhoto({
        id: formCard.photoId!,
        body: PhotoModel.createPhotoFormData(photoUpload?.file),
      });
    }
    return updateCard(updateCardPayload);
  }

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
      onSubmit={() => handleSubmit()}
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
