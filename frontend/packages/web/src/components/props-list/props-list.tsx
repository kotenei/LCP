import { HTMLAttributes, memo } from "react";
import { FormProps } from "../../routes/editor/editor.types";
import "./props-list.scss";

export interface PropsList
  extends LCPWeb.BasicProps<HTMLAttributes<HTMLUListElement>, "onChange"> {
  data?: FormProps[];
  onChange?: (key: string, value: any) => void;
}

const PropsList = (props: PropsList) => {
  const { prefixCls = "lcp-web-props-list", data, onChange } = props;

  return (
    <ul className={prefixCls}>
      {data &&
        data.map((item) => {
          return (
            <li
              key={item.key}
              id={`item-${item.key}`}
              className={`${prefixCls}-item ${
                !item.label ? `${prefixCls}-item__notext` : ""
              }`}
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

export default memo(PropsList);
