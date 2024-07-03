import { HTMLAttributes, memo } from "react";
import { Tabs } from "antd";

import { PropsSetting } from "../props-setting";
import { LayerSetting } from "../layer-setting";
import { ViewSetting } from "../view-setting";
import { ComponentData, PageData } from "../../typing";

export interface RightPanelProps
  extends LCPWeb.BasicProps<HTMLAttributes<HTMLDivElement>> {
  activeKey?: string;
  components?: ComponentData[];
  currentComponent?: ComponentData | null;
  page?: PageData;
  onTabChange?: (activeKey: string) => void;
}

const RightPanel = (props: RightPanelProps) => {
  const {
    prefixCls,
    activeKey,
    currentComponent,
    components,
    page,
    onTabChange,
  } = props;
  return (
    <Tabs
      type="card"
      activeKey={activeKey}
      items={[
        {
          label: "属性设置",
          key: "1",
          children: (
            <PropsSetting
              prefixCls={prefixCls}
              currentComponent={currentComponent}
            />
          ),
        },
        {
          label: "图层设置",
          key: "2",
          children: (
            <LayerSetting
              prefixCls={prefixCls}
              components={components}
              currentComponent={currentComponent}
            />
          ),
        },
        {
          label: "页面设置",
          key: "3",
          children: <ViewSetting prefixCls={prefixCls} page={page} />,
        },
      ]}
      onChange={onTabChange}
    ></Tabs>
  );
};

export default memo(RightPanel);
