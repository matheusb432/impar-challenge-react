import { useContext } from 'react';
import CardContext from '../store/context';

const useCardContext = () => useContext(CardContext);

export default useCardContext;
