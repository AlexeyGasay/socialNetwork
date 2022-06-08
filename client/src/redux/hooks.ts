import { useState, useEffect } from 'react';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useDebounce = (value: string, delay: number ) => {
  
  const   [debounceValue, setDebounceValue] = useState('');

  useEffect(() => {

    const handler = setTimeout(() => {
      setDebounceValue(value)
    }, 500)


    return () => {
      clearTimeout(handler);
    }

  }, [value])


  return debounceValue;

} 