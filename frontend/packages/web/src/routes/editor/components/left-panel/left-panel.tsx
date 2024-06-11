import { memo, useMemo } from "react";
import { Tabs } from "antd";
import { ComponentData } from "../../typing";
import { DynamicTag } from "../../../../components/dynamic-tag";

import "./left-panel.scss";

export interface LeftPanelData {
  title: React.ReactNode;
  key: string;
  icon?: any;
  components?: ComponentData[];
}

export interface LeftPanelProps {
  prefixCls?: string;
  data?: LeftPanelData[];
  activeKey?: string;
  onTabChange?: (activeKey: string) => void;
  onItemClick?: (item: ComponentData) => void;
}

const LeftPanel = (props: LeftPanelProps) => {
  const { prefixCls, data, activeKey, onTabChange, onItemClick } = props;
  const prefix = `${prefixCls}-leftpanel`;

  const items = useMemo(() => {
    if (data === null || data === undefined) {
      return null;
    }
    const result = data.map((item) => {
      return {
        label: item.title,
        key: item.key,
        children:
          item.components &&
          item.components.map((component) => {
            return (
              <div
                key={component.id}
                className={`${prefix}__item`}
                onClick={() => onItemClick && onItemClick(component)}
              >
                <DynamicTag type={component.type} props={component.props} />
              </div>
            );
          }),
      };
    });
    return result;
  }, [prefix, data, onItemClick]);

  return (
    items && (
      <Tabs
        className={prefix}
        activeKey={activeKey}
        items={items}
        onChange={onTabChange}
      ></Tabs>
    )
  );
};

export default memo(LeftPanel);
