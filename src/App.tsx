import React, { useState } from 'react';
import { TrashIcon } from './assets/icons';

import './assets/styles/styles.scss';
import {
  Layout,
  Modal,
  ModalData,
  SearchInput,
  SideContainer,
} from './components';
import { BackgroundImage } from './components/BackgroundImage';
import { Container } from './components/Container';
import { CardList, CardHeader, CardForm } from './feature/Card';

import styles from './style.module.scss';

const App = () => {
  const modalData: ModalData = {
    title: 'Excluir',
    confirmText: 'Excluir',
    // icon: <TrashIcon className={styles['trash-icon']}></TrashIcon>,
    iconFn: TrashIcon,
    iconProps: { className: styles['trash-icon'] },
    colorTheme: '#db2525',
  };
  // TODO set to show on delete confirm
  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // TODO implement
  const handleBackdropClick = () => {
    console.log('backdrop clicked!');
  };

  return (
    <Layout>
      <BackgroundImage>
        <SearchInput
          className={styles['card-search-input']}
          id="searchCards"
          placeholder="Digite aqui sua busca..."
          filter={() => {}}
        />
      </BackgroundImage>
      {/* TODO routing will go inside here */}
      <Container>
        <CardHeader />
        <CardList />
      </Container>

      <SideContainer onBackdropClick={handleBackdropClick}>
        <CardForm isEditing={false} />
      </SideContainer>

      <Modal
        modalData={modalData}
        show={showModal}
        closeModal={handleCloseModal}
      >
        Certeza que deseja excluir?
      </Modal>
    </Layout>
  );
};

export default App;
