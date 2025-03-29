// hooks/useKeyboardVisible.ts
import { useEffect, useState } from 'react';
import { Keyboard } from 'react-native';

export const useKeyboardVisible = (): boolean => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const hide = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  return isKeyboardVisible;
};
