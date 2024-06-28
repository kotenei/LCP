import { customPropsToForm, mapPropsToForm } from "../common/schema";
import { ComponentProps, FormProps } from "../routes/editor/typing";

export const componentToFormProps = (component?: ComponentProps) => {
  const formProps: FormProps[] = [];

  const newFormProps = (key: any, value: any, mapProps: any) => {
    return {
      ...mapProps,
      key,
      value: mapProps.initalTransform ? mapProps.initalTransform(value) : value,
    };
  };

  if (component) {
    for (const key in component) {
      if (key === "style") {
        for (const key in component.style) {
          const styleMapProps =
            mapPropsToForm[key as keyof React.CSSProperties];
          const value = component.style[key as keyof React.CSSProperties];
          if (styleMapProps) {
            formProps.push(newFormProps(key, value, styleMapProps));
          }
        }
      } else {
        const customMapProps = customPropsToForm[key];
        if (customMapProps) {
          formProps.push(newFormProps(key, component[key], customMapProps));
        }
      }
    }
  }

  return formProps;
};
