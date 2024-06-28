import { HTMLAttributes, memo, useEffect, useRef } from "react";
import classNames from "classnames";
import { Empty, Button, Tooltip, List, Input } from "antd";
import {
  EyeOutlined,
  EyeInvisibleOutlined,
  DragOutlined,
} from "@ant-design/icons";

import { ComponentData } from "../../typing";

import "./layer-setting.scss";
import { useClickOutside, useState } from "@lcp/hooks";
import editor from "../../editor";

export interface LayerSettingProps
  extends LCPWeb.BasicProps<HTMLAttributes<HTMLUListElement>> {
  components?: ComponentData[];
  currentComponent?: ComponentData | null;
  onToggle?: (id: string, show: boolean) => void;
  onItemClick?: (item: ComponentData) => void;
  onNameChange?: (id: string, name: string) => void;
}

const LayerSetting = (props: LayerSettingProps) => {
  const triggerRef = useRef(null);
  const {
    prefixCls,
    components,
    currentComponent,
    onItemClick,
    onToggle,
    onNameChange,
  } = props;
  const prefix = `${prefixCls}-layer-setting`;
  const [state, setState] = useState({
    editor: null,
  });

  useEffect(() => {
    if (state.editor) {
      const elm = document.getElementById(state.editor.id);
      if (elm) {
        elm.focus();
      }
    }
  }, [state.editor]);

  useClickOutside({
    ref: triggerRef,
    ignoreList: [],
    callback: () => {
      setState({ editor: null });
    },
  });

  return (
    <div ref={triggerRef}>
      {components && components.length ? (
        <List className={prefix} bordered>
          {components.map((item) => {
            return (
              <List.Item
                key={item.id}
                className={classNames({
                  [`${prefix}-item`]: true,
                  [`${prefix}-item--active`]:
                    currentComponent && currentComponent.id === item.id,
                })}
                onClick={(e) => {
                  e.stopPropagation();
                  onItemClick && onItemClick(item);
                }}
              >
                <Tooltip title={item.show ? "隐藏" : "显示"}>
                  <Button
                    shape="circle"
                    icon={
                      item.show ? <EyeInvisibleOutlined /> : <EyeOutlined />
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggle && onToggle(item.id, !item.show);
                    }}
                  ></Button>
                </Tooltip>
                <div className={`${prefix}-item__edit`}>
                  {!state.editor || state.editor.id !== item.id ? (
                    <span
                      className={`${prefix}-item__label`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setState({
                          editor: { id: item.id, name: item.name },
                        });
                      }}
                    >
                      {item.name}&nbsp;
                    </span>
                  ) : (
                    <Input
                      id={state.editor.id}
                      value={state.editor.name}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      onChange={(e) => {
                        e.stopPropagation();
                        setState({
                          editor: { ...state.editor, name: e.target.value },
                        });
                      }}
                      onBlur={(e) => {
                        e.stopPropagation();
                        if (state.editor && onNameChange) {
                          onNameChange(state.editor.id, e.target.value);
                        }
                        setState({
                          editor: null,
                        });
                      }}
                    />
                  )}
                </div>
                <Tooltip title="拖动排序">
                  <Button shape="circle" icon={<DragOutlined />}></Button>
                </Tooltip>
              </List.Item>
            );
          })}
        </List>
      ) : (
        <Empty description="暂无相关图层" />
      )}
    </div>
  );
};

export default memo(LayerSetting);
