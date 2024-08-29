import { useEffect } from "react";
import hotkeys, { KeyHandler } from "hotkeys-js";

const useHotKey = (keys: string, callback: KeyHandler, deps: any[] = []) => {
  useEffect(() => {
    hotkeys(keys, callback);
    return () => {
      hotkeys.unbind(keys, callback);
    };
  }, deps);
};

export default useHotKey;
