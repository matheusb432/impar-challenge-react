import React, { useState } from 'react';
import { TrashIcon } from './assets/icons';

import './assets/styles/styles.scss';
import {
  Button,
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
    iconFn: TrashIcon,
    iconProps: { className: styles['ui__remove-icon'] },
    colorTheme: '#db2525',
  };
  // TODO set to show on delete confirm
  const [showModal, setShowModal] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleClose = () => {
    console.log('closing modal...');
    setShowModal(false);
  };

  const handleConfirm = () => {
    console.log('confirming modal action!');
    setShowModal(false);
  };

  // TODO implement
  const handleFormClose = () => {
    setShowForm(false);
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

      <SideContainer show={showForm} onClose={handleFormClose}>
        <CardForm isEditing={false} />
      </SideContainer>

      {/* TODO remove debug buttons  */}
      <Button onClick={() => setShowModal(true)}>showModal</Button>
      <Button onClick={() => setShowForm(true)}>showForm</Button>
      <Modal
        modalData={modalData}
        show={showModal}
        onClose={handleClose}
        onConfirm={handleConfirm}
      >
        Certeza que deseja excluir?
      </Modal>
    </Layout>
  );
};

export default App;
