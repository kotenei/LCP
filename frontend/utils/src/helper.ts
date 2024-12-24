export const getBase64 = (img: any, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

export const getParentElement = (element: HTMLElement, className: string) => {
  while (element) {
    if (element.classList && element.classList.contains(className)) {
      return element;
    }
    element = element.parentElement as HTMLElement;
  }
};

export const insertAt = (arr: any[], index: number, newItem: any) => {
  return [...arr.slice(0, index), newItem, ...arr.slice(index)];
};

export const debounce = (
  callback: (...args: any) => void,
  timeout: number = 300
) => {
  let timer: number;
  return (...args: any) => {
    if (timer) {
      console.log('aaaaa')
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      callback(...args);
    }, timeout);
  };
};
