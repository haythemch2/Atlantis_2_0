/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useCallback, useRef } from 'react';

interface UseKeyboardControlsProps {
  setHasAttemptedToStart: React.Dispatch<React.SetStateAction<boolean>>;
  setPaused: React.Dispatch<React.SetStateAction<boolean>>;
  navigationKeys: string[];
}

const useKeyboardControls = ({ setHasAttemptedToStart, setPaused, navigationKeys }: UseKeyboardControlsProps) => {
    const keysPressedRef = useRef<Record<string, boolean>>({});

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (navigationKeys.includes(event.key)) {
            event.preventDefault();
        }
        keysPressedRef.current = { ...keysPressedRef.current, [event.key]: true };
        setHasAttemptedToStart(true);
    }, [navigationKeys]);

    const handleKeyUp = useCallback((event: KeyboardEvent) => {
        if (navigationKeys.includes(event.key)) {
            event.preventDefault();
        }
        keysPressedRef.current = { ...keysPressedRef.current, [event.key]: false };
    }, [navigationKeys]);

    const handleUnpause = useCallback(() => {
        setPaused(false);
    }, []);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        window.addEventListener('keydown', handleUnpause, { once: true });

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [handleKeyDown, handleKeyUp, handleUnpause]);

    return keysPressedRef;
};

export default useKeyboardControls;
