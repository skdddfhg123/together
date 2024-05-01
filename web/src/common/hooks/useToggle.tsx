import { useState } from 'react';

/* 
  ? HOW TO USE
  
  const { isOn, toggle } = useToggle(false);
  <button onClick={toggle} />
*/

export function useToggle(initialValue: boolean): {
  isOn: boolean;
  toggle: () => void;
} {
  const [isOn, setIsOn] = useState<boolean>(initialValue);

  const toggle = () => {
    setIsOn((curr) => !curr);
  };

  return { isOn, toggle };
}
