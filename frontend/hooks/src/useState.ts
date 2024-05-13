import { useState as uState, useRef, useEffect } from "react";

const useState = (initialState: object) => {
  const [state, set] = uState<any>(initialState);
  const callbackRef = useRef<any>(null);

  useEffect(() => {
    if (callbackRef.current) {
      callbackRef.current(state);
      callbackRef.current = null;
    }
  }, [state]);

  const setState = (newState: any, callback?: () => void) => {
    set((prevState: any) => {
      return {
        ...prevState,
        ...newState,
      };
    });
    if (typeof callback === "function") {
      callbackRef.current = callback;
    }
  };

  return [state, setState];
};

export default useState;
