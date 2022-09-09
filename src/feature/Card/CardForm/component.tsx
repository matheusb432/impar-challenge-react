import { SyntheticEvent, useEffect, useState } from 'react';

import { FileInput, Image, Input } from '../../../components';
import { FormLayout } from '../../../components/FormLayout';
import { ChangeInputEvent } from '../../../types';

interface CardFormProps {
  isEditing: boolean;
}

const CardForm = ({ isEditing }: CardFormProps) => {
  const [photo, setPhoto] = useState<string>();

  useEffect(() => {
    console.log(photo);
  }, [photo]);

  // TODO implement
  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();

    handleFormSubmit();
  };

  const handleFormSubmit = () => {
    console.log('submit!');
  };

  const handlePhotoChange = (event: ChangeInputEvent) => {
    console.log(event.target.files);
    console.log(event.target.name);
    setPhoto(URL.createObjectURL(event.target.files![0]));
  };

  return (
    <FormLayout
      onSubmit={handleFormSubmit}
      title={'Criar card'}
      submitLabel={'Criar card'}
    >
      <form onSubmit={handleSubmit}>
        <Input
          id="cardName"
          label="Digite um nome para o card"
          placeholder="Digite o título"
        />
        <Input
          id="cardStatus"
          label="Defina o status do card"
          placeholder="Digite o status"
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
