import { ReactNode } from 'react';
import { TrashIcon } from '../../assets/icons';
import { BaseModalProps, Modal, ModalData } from '../Modal';

interface DeleteModalProps extends BaseModalProps {
  children?: ReactNode;
}

const modalData: ModalData = {
  title: 'Excluir',
  confirmText: 'Excluir',
  iconFn: TrashIcon,
  iconProps: { className: 'ui__remove-icon' },
  colorTheme: '#db2525',
};

export function DeleteModal({ children, ...modalProps }: DeleteModalProps) {
  return (
    <Modal modalData={modalData} {...modalProps}>
      {children ?? 'Certeza que deseja excluir?'}
    </Modal>
  );
}
