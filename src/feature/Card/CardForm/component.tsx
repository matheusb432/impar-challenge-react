import { FormEventHandler, SyntheticEvent } from 'react';
import { FileInput, Input } from '../../../components';
import { FormLayout } from '../../../components/FormLayout';
import styles from './style.module.scss';

interface CardFormProps {
  isEditing: boolean;
}

const CardForm = ({ isEditing }: CardFormProps) => {
  // TODO implement
  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();

    handleFormSubmit();
  };

  const handleFormSubmit = () => {
    console.log('submit!');
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
        />
      </form>
    </FormLayout>
  );
};

export default CardForm;
