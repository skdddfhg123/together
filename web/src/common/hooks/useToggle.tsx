import { useState } from 'react';

/* 
  ? HOW TO USE
  
  const { isOn, toggle } = useToggle(false);
  <button onClick={toggle} />
*/

export default function useToggle(initialValue: boolean) {
  const [isOn, setIsOn] = useState<boolean>(initialValue);
  const toggle = () => {
    setIsOn((curr: boolean) => !curr);
  };

  return { isOn, toggle };
}
