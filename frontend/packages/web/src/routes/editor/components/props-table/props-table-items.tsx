import { HTMLAttributes, memo } from "react";
import { FormProps } from "../../typing";

export interface PropsTableItems
  extends LCPWeb.BasicProps<HTMLAttributes<HTMLUListElement>, "onChange"> {
  data?: FormProps[];
  onChange?: (key: string, value: any) => void;
}

const PropsTableItems = (props: PropsTableItems) => {
  const { prefixCls, data, onChange } = props;
  const prefix = `${prefixCls}-items`;

  return (
    <ul className={prefix}>
      {data &&
        data.map((item) => {
          return (
            <li
              id={`item-${item.key}`}
              className={`${prefix}-item ${
                !item.label ? `${prefix}-item__notext` : ""
              }`}
              key={item.key}
            >
              <span>{item.label ? `${item.label}:` : ""}</span>
              <div>
                <item.component
                  {...item.extraProps}
                  value={item.value}
                  onChange={(e: any, ...args: any[]) => {
                    let value;
                    if (item.afterTransform) {
                      value = item.afterTransform(e, ...args);
                    } else {
                      if (e && e.target) {
                        value = e.target.value;
                      } else {
                        value = e;
                      }
                    }
                    onChange && onChange(item.key, value);
                  }}
                >
                  {item.options &&
                    item.subComponent &&
                    item.options.map((o) => {
                      return (
                        <item.subComponent value={o.value} key={o.value}>
                          {o.text}
                        </item.subComponent>
                      );
                    })}
                </item.component>
              </div>   
            </li>
          );
        })}
    </ul>
  );
};

export default memo(PropsTableItems);
