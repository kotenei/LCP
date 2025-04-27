import { HTMLAttributes, memo, useContext, useMemo } from "react";
import { Collapse, Empty } from "antd";

import { mapPropsCategory } from "../../../../common/schema";
import { componentToFormProps } from "../../../../utils";
import { PropsList } from "../../../../components/props-list";
import { ComponentData } from "../../editor.types";
import "./props-setting.scss";
import EditorContext from "../../editor.context";

export interface PropsSettingProps
  extends LCPWeb.BasicProps<HTMLAttributes<HTMLDivElement>, "onChange"> {
  currentComponent?: ComponentData | null;
}

const PropsSetting = (props: PropsSettingProps) => {
  const { prefixCls, currentComponent } = props;
  const prefix = `${prefixCls}-props-setting`;
  const { onPropChange } = useContext(EditorContext) || {};

  const items = useMemo(() => {
    if (currentComponent) {
      const allComponents = componentToFormProps(currentComponent.props);
      return mapPropsCategory.map((item) => {
        const components = allComponents.filter((c) => c.category === item.id);
        return {
          key: item.id,
          label: item.label,
          children: <PropsList data={components} onChange={onPropChange} />,
        };
      });
    } else {
      return [];
    }
  }, [prefix, currentComponent, onPropChange]);

  return items.length ? (
    <Collapse className={prefix} items={items} defaultActiveKey={["1"]} />
  ) : (
    <Empty description="在画布中选择要编辑的元素" />
  );
};

export default memo(PropsSetting);
