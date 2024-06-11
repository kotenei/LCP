import { HTMLAttributes, memo, useMemo } from "react";
import { Collapse, Input, Empty } from "antd";
const { TextArea } = Input;

import {
  defaultFormItem,
  mapPropsCategory,
  mapPropsToForm,
} from "../../../../common/schema";
import PropsTableItems from "./props-table-items";
import { ComponentData, FormProps } from "../../typing";
import "./props-table.scss";

export interface PropsTableProps
  extends LCPWeb.BasicProps<HTMLAttributes<HTMLDivElement>, "onChange"> {
  currentComponent?: ComponentData | null;
  onChange?: (key: string, value: any) => void;
}

const PropsTable = (props: PropsTableProps) => {
  const { prefixCls, currentComponent, onChange } = props;
  const prefix = `${prefixCls}-props-table`;

  const getAllComponents = (data: ComponentData) => {
    const components: FormProps[] = [];

    if (data.props) {
      if (
        data.props.children != null &&
        typeof data.props.children === "string"
      ) {
        components.push({
          ...defaultFormItem,
          key: "children",
          component: TextArea,
          extraProps: { rows: 3 },
          value: data.props.children,
          afterTransform: (e) => e.target.value,
        });
      }

      if (data.props.style) {
        for (const key in data.props.style) {
          const item = mapPropsToForm[key as keyof React.CSSProperties];
          const value = data.props.style[key as keyof React.CSSProperties];

          if (item) {
            const newItem = {
              ...item,
              key,
              value: item.initalTransform ? item.initalTransform(value) : value,
            };
            components.push(newItem);
          }
        }
      }
    }

    return components;
  };

  const items = useMemo(() => {
    if (currentComponent) {
      const allComponents = getAllComponents(currentComponent);
      return mapPropsCategory.map((item) => {
        const components = allComponents.filter((c) => c.category === item.id);
        return {
          key: item.id,
          label: item.label,
          children: (
            <PropsTableItems
              key={item.id}
              prefixCls={prefix}
              data={components}
              onChange={onChange}
            />
          ),
        };
      });
    } else {
      return [];
    }
  }, [prefix, currentComponent, onChange]);

  return items.length ? (
    <Collapse className={prefix} items={items} defaultActiveKey={["1"]} />
  ) : (
    <Empty description="在画布中选择要编辑的元素" />
  );
};

export default memo(PropsTable);
