import { HTMLAttributes, memo, useEffect } from "react";
import { Tabs } from "antd";
import { useState } from "@lcp/hooks";

import { PropsTable } from "../props-table";
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
  onPropChange?: (key: string, value: any) => void;
  onItemClick?: (item: ComponentData) => void;
  onToggle?: (id: string, show: boolean) => void;
  onNameChange?: (id: string, name: string) => void;
}

const RightPanel = (props: RightPanelProps) => {
  const {
    prefixCls,
    activeKey,
    currentComponent,
    components,
    page,
    onTabChange,
    onPropChange,
    onItemClick,
    onToggle,
    onNameChange,
  } = props;
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
          children: (
            <LayerSetting
              prefixCls={prefixCls}
              components={components}
              currentComponent={currentComponent}
              onItemClick={onItemClick}
              onToggle={onToggle}
              onNameChange={onNameChange}
            />
          ),
        },
        {
          label: "页面设置",
          key: "3",
          children: (
            <ViewSetting
              prefixCls={prefixCls}
              page={page}
              onChange={onPropChange}
            />
          ),
        },
      ]}
      onChange={onTabChange}
    ></Tabs>
  );
};

export default memo(RightPanel);
