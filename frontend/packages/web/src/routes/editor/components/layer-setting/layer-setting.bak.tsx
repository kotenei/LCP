import {
  DragEvent,
  HTMLAttributes,
  memo,
  useContext,
  useEffect,
  useRef,
} from "react";
import classNames from "classnames";
import { Empty, Button, Tooltip, Input } from "antd";
import {
  EyeOutlined,
  EyeInvisibleOutlined,
  DragOutlined,
} from "@ant-design/icons";
import { arrayMoveImmutable } from "array-move";

import { useClickOutside, useState } from "@lcp/hooks";
import { getParentElement } from "@lcp/utils";
import { ComponentData } from "../../typing";
import "./layer-setting.scss";
import EditorContext from "../../editor.context";

export interface LayerSettingProps
  extends LCPWeb.BasicProps<HTMLAttributes<HTMLUListElement>> {
  components?: ComponentData[];
  currentComponent?: ComponentData | null;
}

const LayerSetting = (props: LayerSettingProps) => {
  const triggerRef = useRef(null);
  const { prefixCls, components, currentComponent } = props;
  const prefix = `${prefixCls}-layer-setting`;
  const [state, setState] = useState({
    editor: null,
  });
  const { onItemClick, onToggle, onNameChange, onSort } =
    useContext(EditorContext) || {};
  const dragData = useRef({ index: -1 });

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

  const onDragStart = (e: DragEvent) => {
    const target = e.target as HTMLElement;
    const li = target.parentElement;
    const id = li && li.getAttribute("id");
    if (e.dataTransfer && id) {
      // e.dataTransfer.setData("orgIndex", li.dataset.index as string);
      dragData.current.index = li.dataset.index
        ? parseInt(li.dataset.index)
        : -1;

      // 创建一个抓取元素图像
      const clone = li.cloneNode(true) as any;

      // 设置克隆元素的样式
      const computedStyle = window.getComputedStyle(li);
      for (const key of computedStyle) {
        clone.style[key] = computedStyle.getPropertyValue(key);
      }
      clone.style.position = "absolute";
      clone.style.top = "-9999px";
      document.body.appendChild(clone);

      // 设置拖拽图像
      e.dataTransfer.setDragImage(
        clone,
        li.offsetWidth - target.offsetWidth,
        li.offsetHeight - target.offsetHeight
      );
      e.dataTransfer.effectAllowed = "move";

      setTimeout(() => document.body.removeChild(clone), 0);
    }
  };

  const onDragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  const onDragEnter = (e: DragEvent) => {
    e.preventDefault();
    sort(e);
  };

  const sort = (e: DragEvent) => {
    const curElement = e.target as HTMLElement;
    const parentElement = getParentElement(curElement, `${prefix}-item`);
    if (parentElement) {
      const orgIndex = dragData.current.index;
      const targetIndex = parseInt(parentElement.dataset.index as string);
      if (orgIndex === targetIndex) {
        return;
      }
      const newComponents = arrayMoveImmutable(
        components || [],
        orgIndex,
        targetIndex
      );
      onSort && onSort(newComponents);
      dragData.current.index = targetIndex;
    }
  };

  return (
    <div
      ref={triggerRef}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnter={onDragEnter}
    >
      {components && components.length ? (
        <ul className={prefix}>
          {components.map((item, index) => {
            return (
              <li
                id={item.id}
                key={item.id}
                className={classNames({
                  [`${prefix}-item`]: true,
                  [`${prefix}-item--active`]:
                    currentComponent && currentComponent.id === item.id,
                })}
                data-index={index}
                onClick={(e) => {
                  e.stopPropagation();
                  onItemClick && onItemClick(item, false);
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
                  <Button
                    shape="circle"
                    icon={<DragOutlined />}
                    draggable
                  ></Button>
                </Tooltip>
              </li>
            );
          })}
        </ul>
      ) : (
        <Empty description="暂无相关图层" />
      )}
    </div>
  );
};

export default memo(LayerSetting);
