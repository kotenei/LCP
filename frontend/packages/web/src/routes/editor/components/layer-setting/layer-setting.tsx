import { HTMLAttributes, memo, useContext, useEffect, useRef } from "react";
import classNames from "classnames";
import { Empty, Button, Tooltip, Input } from "antd";
import {
  EyeOutlined,
  EyeInvisibleOutlined,
  DragOutlined,
} from "@ant-design/icons";
import { arrayMoveImmutable } from "array-move";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";

import { useClickOutside, useState } from "@lcp/hooks";
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

  const sort = (dragIndex: number, dropIndex?: number) => {
    console.log(dragIndex, dropIndex);
    if (dragIndex !== dropIndex && dropIndex !== undefined) {
      const newComponents = arrayMoveImmutable(
        components || [],
        dragIndex,
        dropIndex
      );
      onSort && onSort(newComponents);
    }
  };

  const onDragEnd = (result: DropResult) => {
    sort(result.source.index, result.destination?.index);
  };

  const range = (
    transform: string,
    type: "vertical" | "horizontal" | "auto" = "auto"
  ) => {
    if (type === "auto" || !transform) {
      return transform;
    }
    const arr = transform.split(",");
    if (type === "vertical") {
      return `translate(0px, ${arr[1].replace(")", "")})`;
    } else {
      return `translate(${arr[0].substring(arr[0].indexOf("("))}, 0px)`;
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div ref={triggerRef}>
        {components && components.length ? (
          <Droppable droppableId="sortable">
            {(provided: any) => (
              <ul
                className={prefix}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {components.map((item, index) => {
                  return (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(provided: any) => {
                        return (
                          <>
                            <li
                              {...provided.draggableProps}
                              ref={provided.innerRef}
                              id={item.id}
                              className={classNames({
                                [`${prefix}-item`]: true,
                                [`${prefix}-item--active`]:
                                  currentComponent &&
                                  currentComponent.id === item.id,
                              })}
                              data-index={index}
                              onClick={(e) => {
                                e.stopPropagation();
                                onItemClick && onItemClick(item, false);
                              }}
                              style={{
                                ...provided.draggableProps.style,
                                transform: range(
                                  provided.draggableProps.style.transform,
                                  "vertical"
                                ),
                              }}
                            >
                              <Tooltip title={item.show ? "隐藏" : "显示"}>
                                <Button
                                  shape="circle"
                                  icon={
                                    item.show ? (
                                      <EyeInvisibleOutlined />
                                    ) : (
                                      <EyeOutlined />
                                    )
                                  }
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onToggle && onToggle(item.id, !item.show);
                                  }}
                                ></Button>
                              </Tooltip>
                              <div className={`${prefix}-item__edit`}>
                                {!state.editor ||
                                state.editor.id !== item.id ? (
                                  <span
                                    className={`${prefix}-item__label`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setState({
                                        editor: {
                                          id: item.id,
                                          name: item.name,
                                        },
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
                                        editor: {
                                          ...state.editor,
                                          name: e.target.value,
                                        },
                                      });
                                    }}
                                    onBlur={(e) => {
                                      e.stopPropagation();
                                      if (state.editor && onNameChange) {
                                        onNameChange(
                                          state.editor.id,
                                          e.target.value
                                        );
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
                                  {...provided.dragHandleProps}
                                ></Button>
                              </Tooltip>
                            </li>
                          </>
                        );
                      }}
                    </Draggable>
                  );
                })}
              </ul>
            )}
          </Droppable>
        ) : (
          <Empty description="暂无相关图层" />
        )}
      </div>
    </DragDropContext>
  );
};

export default memo(LayerSetting);
