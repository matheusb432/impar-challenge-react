import { useContext } from 'react';
import { AppContext } from '../store';

const useAppContext = () => useContext(AppContext);

export default useAppContext;
