import { HTMLAttributes, memo, useMemo } from "react";
import { Collapse, Empty } from "antd";

import { mapPropsCategory } from "../../../../common/schema";
import { componentToFormProps } from "../../../../utils";
import PropsTableItems from "./props-table-items";
import { ComponentData } from "../../typing";
import "./props-table.scss";

export interface PropsTableProps
  extends LCPWeb.BasicProps<HTMLAttributes<HTMLDivElement>, "onChange"> {
  currentComponent?: ComponentData | null;
  onChange?: (key: string, value: any) => void;
}

const PropsTable = (props: PropsTableProps) => {
  const { prefixCls, currentComponent, onChange } = props;
  const prefix = `${prefixCls}-props-table`;

  const items = useMemo(() => {
    if (currentComponent) {
      const allComponents = componentToFormProps(currentComponent.props);
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
