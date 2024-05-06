import { useMemo } from 'react';

interface UseUpdateModalStyleProps {
  position: { x: number; y: number };
  setModalStyle: React.Dispatch<React.SetStateAction<React.CSSProperties>>;
}

export default function useUpdateModalStyle({ position, setModalStyle }: UseUpdateModalStyleProps) {
  useMemo(() => {
    const modalWidth = 384;
    const modalHeight = 80;
    const newX = Math.max(10, Math.min(position.x - 100, window.innerWidth - modalWidth - 10));
    const newY = Math.max(10, Math.min(position.y + 50, window.innerHeight - modalHeight - 10));

    setModalStyle({
      top: `${newY}px`,
      left: `${newX}px`,
    });
  }, [position, setModalStyle]);
}
