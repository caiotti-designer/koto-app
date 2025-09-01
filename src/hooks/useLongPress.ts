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
  const startPositionRef = useRef<{ x: number; y: number } | null>(null);
  const hasMoved = useRef(false);

  const start = useCallback((event: React.TouchEvent | React.MouseEvent) => {
    // Store initial position
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
    startPositionRef.current = { x: clientX, y: clientY };
    hasMoved.current = false;
    
    isLongPressRef.current = false;
    setIsLongPressing(true);
    
    timeoutRef.current = setTimeout(() => {
      // Only trigger long press if user hasn't moved significantly
      if (!hasMoved.current) {
        isLongPressRef.current = true;
        onLongPress();
      }
    }, threshold);
  }, [onLongPress, threshold]);

  const move = useCallback((event: React.TouchEvent | React.MouseEvent) => {
    if (!startPositionRef.current) return;
    
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
    
    const deltaX = Math.abs(clientX - startPositionRef.current.x);
    const deltaY = Math.abs(clientY - startPositionRef.current.y);
    
    // If user moved more than 10px, consider it scrolling/movement
    if (deltaX > 10 || deltaY > 10) {
      hasMoved.current = true;
      // Cancel long press if user is moving
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
        setIsLongPressing(false);
      }
    }
  }, []);

  const clear = useCallback((event?: React.TouchEvent | React.MouseEvent, shouldTriggerClick = true) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    setIsLongPressing(false);
    
    // Only trigger click if it wasn't a long press, user didn't move, and onClick is provided
    if (shouldTriggerClick && !isLongPressRef.current && !hasMoved.current && onClick) {
      onClick();
    }
    
    // Reset state
    isLongPressRef.current = false;
    startPositionRef.current = null;
    hasMoved.current = false;
  }, [onClick]);

  return {
    isLongPressing,
    handlers: {
      onMouseDown: start,
      onMouseUp: clear,
      onMouseLeave: () => clear(undefined, false),
      onMouseMove: move,
      onTouchStart: start,
      onTouchMove: move,
      onTouchEnd: clear,
      onTouchCancel: () => clear(undefined, false),
    },
  };
};