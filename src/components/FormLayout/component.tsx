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
  onCancel?: () => void;
}

const FormLayout = ({
  title,
  children,
  submitLabel,
  onSubmit,
  canSubmit = true,
  onCancel,
}: FormLayoutProps) => {
  return (
    <section className={styles['form-layout']}>
      <header>
        <Image src={'images/create-icon.svg'} alt="Create icon" />
        <Title text={title} style={{ fontWeight: 'bold' }} />
      </header>
      {children}
      <footer>
        {onCancel ? (
          <Button type="button" onClick={onCancel} outlineStyle={true}>
            {/* TODO clean */}
            {/* style={{ backgroundColor: '#fff', color: '#e76316' }} */}
            Cancelar
          </Button>
        ) : null}
        <Button type="button" onClick={onSubmit} disabled={!canSubmit}>
          {submitLabel}
        </Button>
      </footer>
    </section>
  );
};

export default FormLayout;
