import { useState } from 'react';

interface HoveringData {
  hovering: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const useHovering = (): HoveringData => {
  const [hovering, setHovering] = useState(false);

  const onMouseEnter = () => {
    setHovering(true);
  };

  const onMouseLeave = () => {
    setHovering(false);
  };

  return { hovering, onMouseEnter, onMouseLeave };
};

export default useHovering;
