import { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { FileInput, Image, Input, InputForwardRef } from '../../../components';
import { FormLayout } from '../../../components/FormLayout';
import { useInputRef } from '../../../hooks';
import { ChangeInputEvent, RouteUrls } from '../../../types';
import { validateId } from '../../../utils';
import { useCardContext } from '../hooks';
import { CardActions } from '../store';
import { CardModel } from '../types';

interface CardFormProps {
  isEditing: boolean;
}

const CardForm = ({ isEditing }: CardFormProps) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [label, setLabel] = useState<string>('');

  const nameRef = useInputRef<InputForwardRef>();
  const statusRef = useInputRef<InputForwardRef>();

  const [name, setName] = useState<string>();
  const [status, setStatus] = useState<string>();
  const [photo, setPhoto] = useState<string>();

  const { cardState, dispatchCard } = useCardContext();
  const { cards, formCard } = cardState;

  const returnToList = useCallback(() => {
    navigate(RouteUrls.Cards);

    // TODO add error toast here
  }, [navigate]);

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

  // TODO generic method for this?
  useEffect(() => {
    nameRef.current!.setValue(name!);
  }, [nameRef, name]);

  useEffect(() => {
    statusRef.current!.setValue(status!);
  }, [statusRef, status]);

  const setInputs = (card: CardModel) => {
    // TODO error toast
    if (card == null) return;
    const { name, status, photo } = card;

    setName(name);
    setStatus(status);
    setPhoto(photo?.base64 ?? '');
  };

  // TODO implement
  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();

    handleFormSubmit();
  };

  const handleFormSubmit = () => {
    if (!isEditing) {
      dispatchCard({
        type: CardActions.AddCard,
        payload: CardModel.fromInputs(name!, status!, photo!),
      });
    } else {
      // TODO error toast here
      if (!validateId(id)) return;

      dispatchCard({
        type: CardActions.EditCard,
        payload: CardModel.fromEdit(+id!, name!, status!, photo!),
      });
    }

    // TODO run only if no errors
    clearForm();
  };

  // TODO clean
  // const clearForm = () => {
  //   dispatchCard({
  //     type: CardActions.SetFormCard,
  //     payload: CardModel.empty(),
  //   });
  // };

  const handleNameChange = (event: ChangeInputEvent) => {
    setName(event.target.value);
  };

  const handleStatusChange = (event: ChangeInputEvent) => {
    setStatus(event.target.value);
  };

  const handlePhotoChange = (event: ChangeInputEvent) => {
    setPhoto(URL.createObjectURL(event.target.files![0]));
  };

  return (
    <FormLayout onSubmit={handleFormSubmit} title={label} submitLabel={label}>
      <form onSubmit={handleSubmit}>
        {/* value={name} */}
        <Input
          id="cardName"
          label="Digite um nome para o card"
          placeholder="Digite o título"
          ref={nameRef}
          onChange={handleNameChange}
        />
        {/* value={status} */}
        <Input
          id="cardStatus"
          label="Defina o status do card"
          placeholder="Digite o status"
          ref={statusRef}
          onChange={handleStatusChange}
        />
        <FileInput
          id="cardPhoto"
          label="Inclua uma imagem para aparecer no card"
          placeholder="Nenhum arquivo selecionado"
          onChange={handlePhotoChange}
        />
        {/* TODO preview works! */}
        {/* <Image src={photo!} alt="" /> */}
      </form>
    </FormLayout>
  );
};

export default CardForm;
