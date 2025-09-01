import { useCallback, useRef, useState } from 'react';

interface UseLongPressOptions {
  onLongPress: () => void;
  onClick?: () => void;
  threshold?: number; // milliseconds
}

export const useLongPress = ({ onLongPress, onClick, threshold = 500 }: UseLongPressOptions) => {
  const [isLongPressing, setIsLongPressing] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPressRef = useRef(false);

  const start = useCallback((event: React.TouchEvent | React.MouseEvent) => {
    // Prevent default to avoid text selection
    event.preventDefault();
    
    isLongPressRef.current = false;
    setIsLongPressing(true);
    
    timeoutRef.current = setTimeout(() => {
      isLongPressRef.current = true;
      onLongPress();
    }, threshold);
  }, [onLongPress, threshold]);

  const clear = useCallback((event?: React.TouchEvent | React.MouseEvent, shouldTriggerClick = true) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    setIsLongPressing(false);
    
    // Only trigger click if it wasn't a long press and onClick is provided
    if (shouldTriggerClick && !isLongPressRef.current && onClick) {
      onClick();
    }
    
    isLongPressRef.current = false;
  }, [onClick]);

  return {
    isLongPressing,
    handlers: {
      onMouseDown: start,
      onMouseUp: clear,
      onMouseLeave: () => clear(undefined, false),
      onTouchStart: start,
      onTouchEnd: clear,
      onTouchCancel: () => clear(undefined, false),
    },
  };
};