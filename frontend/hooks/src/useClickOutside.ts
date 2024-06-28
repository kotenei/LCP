import { useEffect, RefObject } from "react";

export interface useClickOutsideProps {
  ref: RefObject<HTMLElement>;
  ignoreList?: string[];
  callback?: () => void;
}

const useClickOutside = (options: useClickOutsideProps) => {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const isIgnored =
        options.ignoreList && options.ignoreList.length > 0
          ? options.ignoreList.findIndex((item: string) => {
              const elmItem = document.querySelector(item);
              return elmItem && elmItem.contains(event.target as Node);
            })
          : -1;

      if (
        options.ref.current &&
        isIgnored === -1 &&
        !options.ref.current.contains(event.target as Node)
      ) {
        options.callback && options.callback();
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [options]);
};

export default useClickOutside;
