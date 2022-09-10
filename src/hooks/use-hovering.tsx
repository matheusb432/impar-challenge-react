import { useState } from 'react';

const useHovering = () => {
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
