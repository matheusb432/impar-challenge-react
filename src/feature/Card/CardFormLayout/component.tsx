import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SideContainer } from '../../../components';
import { RouteUrls } from '../../../types';
import { sleep } from '../../../utils';
import { CardForm } from '../CardForm';

interface CardFormLayoutProps {
  isEdit: boolean;
}

const animationMs = 500;

function CardFormLayout({ isEdit }: CardFormLayoutProps) {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setShowForm(true);
  }, []);

  const handleFormClose = async () => {
    setShowForm(false);

    await sleep(animationMs);

    navigate(RouteUrls.Cards);
  };

  return (
    <SideContainer
      show={showForm}
      onClose={handleFormClose}
      animationMs={animationMs}
    >
      <CardForm isEditing={isEdit} />
    </SideContainer>
  );
}

export default CardFormLayout;
