import { ReactNode } from 'react';
import { Button } from '../Button';
import { Image } from '../Image';
import { Title } from '../Title';
import styles from './style.module.scss';

interface FormLayoutProps {
  children: ReactNode;
  title: string;
  submitLabel: string;
  onSubmit: () => void;
  canSubmit?: boolean;
  isLoadingSubmit?: boolean;
  onCancel?: () => void;
}

function FormLayout({
  title,
  children,
  submitLabel,
  onSubmit,
  canSubmit = true,
  isLoadingSubmit = false,
  onCancel,
}: FormLayoutProps) {
  return (
    <section className={styles['form-layout']}>
      <header>
        <Image src="/images/create-icon.svg" alt="Create icon" />
        <Title text={title} style={{ fontWeight: 'bold' }} />
      </header>
      {children}
      <footer>
        {onCancel ? (
          <Button type="button" onClick={onCancel} outlineStyle>
            Cancelar
          </Button>
        ) : null}
        <Button
          type="button"
          onClick={onSubmit}
          disabled={!canSubmit || isLoadingSubmit}
          isLoading={isLoadingSubmit}
          disabledReason={
            isLoadingSubmit
              ? 'Processando requisição...'
              : 'Um ou mais campos do formulário estão inválidos'
          }
        >
          {submitLabel}
        </Button>
      </footer>
    </section>
  );
}

export default FormLayout;
