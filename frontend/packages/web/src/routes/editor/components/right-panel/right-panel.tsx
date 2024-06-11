import { HTMLAttributes, memo, useEffect } from "react";
import { Tabs } from "antd";
import { useState } from "@lcp/hooks";
import { PropsTable } from "../props-table";
import { ComponentData } from "../../typing";

export interface RightPanelProps
  extends LCPWeb.BasicProps<HTMLAttributes<HTMLDivElement>> {
  activeKey?: string;
  currentComponent?: ComponentData | null;
  onTabChange?: (activeKey: string) => void;
  onPropChange?: (key: string, value: any) => void;
}

const RightPanel = (props: RightPanelProps) => {
  const { prefixCls, activeKey, currentComponent, onTabChange, onPropChange } =
    props;
  const [staet, setState] = useState({});

  return (
    <Tabs
      type="card"
      activeKey={activeKey}
      items={[
        {
          label: "属性设置",
          key: "1",
          children: (
            <PropsTable
              prefixCls={prefixCls}
              currentComponent={currentComponent}
              onChange={onPropChange}
            />
          ),
        },
        {
          label: "图层设置",
          key: "2",
          children: "Tab 2",
        },
        {
          label: "页面设置",
          key: "3",
          children: "Tab 3",
        },
      ]}
      onChange={onTabChange}
    ></Tabs>
  );
};

export default memo(RightPanel);
