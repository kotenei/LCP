import {
  HTMLAttributes,
  memo,
  useMemo,
  useContext,
  useRef,
  MouseEventHandler,
} from "react";
import classnames from "classnames";
import { Space, Button, Tooltip, Spin } from "antd";
import { UndoOutlined, RedoOutlined, LoadingOutlined } from "@ant-design/icons";
import { getParentElement } from "@lcp/utils";

import { DynamicTag } from "../../../../components/dynamic-tag";
import { ComponentData, PageData } from "../../typing";
import EditorContext from "../../editor.context";
import "./canvas.scss";

export interface CanvasProps
  extends LCPWeb.BasicProps<HTMLAttributes<HTMLDivElement>> {
  data?: any;
  components?: ComponentData[];
  currentComponent?: ComponentData | null;
  loading?: false;
  page?: PageData;
  pageActive?: boolean;
  boundaryCheck?: boolean;
  undoDisabled?: boolean;
  redoDisabled?: boolean;
  onPositionUpdate?: (position: {
    left: number;
    top: number;
    id: string;
  }) => void;
  onSizeUpdate?: (size: {
    left: number;
    top: number;
    height: number;
    width: number;
    id: string;
  }) => void;
}

const Canvas = (props: CanvasProps) => {
  const {
    prefixCls,
    className,
    loading,
    currentComponent,
    components,
    page,
    pageActive,
    boundaryCheck = true,
    undoDisabled = false,
    redoDisabled = false,
    onPositionUpdate,
    onSizeUpdate,
    ...others
  } = props;
  const prefix = `${prefixCls}-canvas`;
  const classString = classnames(prefix, className);
  const { onItemClick, onUndo, onRedo } = useContext(EditorContext) || {};
  const content = useRef<any>(null);
  const gap = useRef({ x: 0, y: 0 });

  const pageStyle = useMemo(() => {
    if (page && page.props && page.props.style) {
      const style = {
        ...page.props.style,
        backgroundImage: `url(${page.props.style.backgroundImage})`,
      };
      return style;
    }
    return undefined;
  }, [page]);

  const calculatePosition = (e: MouseEvent) => {
    let cLeft = 0;
    let cTop = 0;
    if (content.current) {
      const cr = content.current.getBoundingClientRect();
      cLeft = cr.left;
      cTop = cr.top;
    }
    const left = e.clientX - gap.current.x - cLeft;
    const top = e.clientY - gap.current.y - cTop;
    return { top, left };
  };

  const onMouseDown: MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    const target = e.target as HTMLElement;
    const parentElement = getParentElement(target, `${prefix}-wrapper`);
    let isMoving = false;
    let maxLeft: number;
    let maxTop: number;
    let curLeft: number;
    let curTop: number;
    let id: string;

    if (parentElement) {
      const { left, top } = parentElement.getBoundingClientRect();
      gap.current.x = e.clientX - left;
      gap.current.y = e.clientY - top;
      maxLeft = content.current.offsetWidth - parentElement.offsetWidth - 2;
      maxTop = content.current.offsetHeight - parentElement.offsetHeight - 2;
    }

    const onMove = (e: MouseEvent) => {
      e.preventDefault();

      const { left, top } = calculatePosition(e);
      isMoving = true;

      if (parentElement) {
        let newLeft = left;
        let newTop = top;

        if (boundaryCheck) {
          if (left < 0) {
            newLeft = 0;
          }

          if (top < 0) {
            newTop = 0;
          }

          if (maxLeft != null && newLeft > maxLeft) {
            newLeft = maxLeft;
          }

          if (maxTop != null && newTop > maxTop) {
            newTop = maxTop;
          }
        }

        newLeft = Math.round(newLeft);
        newTop = Math.round(newTop);

        parentElement.style.left = newLeft + "px";
        parentElement.style.top = newTop + "px";
        curLeft = newLeft;
        curTop = newTop;
        id = parentElement.id;
      }
    };

    const onMouseUp = (e: MouseEvent) => {
      e.preventDefault();
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onMouseUp);
      if (isMoving && curLeft >= 0 && curTop >= 0 && onPositionUpdate) {
        onPositionUpdate({ left: curLeft, top: curTop, id });
      }
      isMoving = false;
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const onStartResize = (type: string) => (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const target = e.target as HTMLElement;
    const parentElement = getParentElement(target, `${prefix}-wrapper`);
    const component = parentElement?.querySelector(
      `.${prefix}-component`
    ) as HTMLElement;
    const startX = e.clientX;
    const startY = e.clientY;
    const contentWidth = content.current.offsetWidth;
    const contentHeight = content.current.offsetHeight;
    let isMoving = false;
    let wrapperWidth = 0;
    let wrapperHeight = 0;
    let wrapperTop = 0;
    let wrapperLeft = 0;
    let width = 0;
    let height = 0;
    let top = 0;
    let left = 0;
    let id: string;

    if (parentElement) {
      const bcr = parentElement.getBoundingClientRect();
      wrapperWidth = bcr.width;
      wrapperHeight = bcr.height;
      top = wrapperTop = parentElement.offsetTop;
      left = wrapperLeft = parentElement.offsetLeft;
      id = parentElement.id;
    }

    const onMove = (e: MouseEvent) => {
      e.preventDefault();

      if (parentElement && component && content.current) {
        const { clientX, clientY } = e;
        isMoving = true;

        switch (type) {
          case "bottomRight":
            width = wrapperWidth + (clientX - startX);
            height = wrapperHeight + (clientY - startY);
            break;
          case "bottomLeft":
            height = wrapperHeight + (clientY - startY);
            width = wrapperWidth + (startX - clientX);
            left = wrapperLeft - (startX - clientX);
            break;
          case "topLeft":
            width = wrapperWidth + (startX - clientX);
            height = wrapperHeight - (clientY - startY);
            left = wrapperLeft - (startX - clientX);
            top = wrapperTop - (startY - clientY);
            break;
          case "topRight":
            width = wrapperWidth + (clientX - startX);
            height = wrapperHeight - (clientY - startY);
            top = wrapperTop - (startY - clientY);
            break;
          default:
            break;
        }

        if (boundaryCheck) {
          if (left < 0) {
            left = 0;
          }

          if (top < 0) {
            top = 0;
          }

          if (left + width > contentWidth) {
            width = contentWidth - left - 2;
          }

          if (top + height > contentHeight) {
            height = contentHeight - top - 2;
          }
        }

        width = Math.round(width);
        height = Math.round(height);
        top = Math.round(top);
        left = Math.round(left);

        parentElement.style.width = width + "px";
        parentElement.style.height = height + "px";
        component.style.width = width + "px";
        component.style.height = height + "px";

        parentElement.style.top = top + "px";
        parentElement.style.left = left + "px";
        component.style.left = top + "px";
        component.style.left = left + "px";
      }
    };

    const onMouseUp = (e: MouseEvent) => {
      e.preventDefault();
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onMouseUp);
      if (isMoving && onSizeUpdate) {
        onSizeUpdate({ left, top, width, height, id });
      }
      isMoving = false;
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  return (
    <div className={classString} {...others}>
      <div className={`${prefix}-header`}>
        <Space size={16}>
          <Tooltip title="撤销">
            <Button
              shape="circle"
              icon={<UndoOutlined />}
              disabled={undoDisabled}
              onClick={(e) => {
                e.preventDefault();
                onUndo && onUndo();
              }}
            />
          </Tooltip>
          <Tooltip title="重做">
            <Button
              shape="circle"
              icon={<RedoOutlined />}
              disabled={redoDisabled}
              onClick={onRedo}
            />
          </Tooltip>
        </Space>
      </div>
      <div className={`${prefix}-body`}>
        {loading && (
          <Spin
            className={`${prefix}-loading`}
            size="large"
            indicator={<LoadingOutlined spin />}
          />
        )}
        <div className={`${prefix}-body__container`}>
          <div
            id="editorContainer"
            ref={content}
            className={`${prefix}-body__content ${pageActive ? "active" : ""}`}
            style={pageStyle}
          >
            {components &&
              components.map((component) => {
                const wrapperClass = classnames({
                  [`${prefix}-wrapper`]: true,
                  [`${prefix}-wrapper--active`]:
                    currentComponent && currentComponent.id === component.id,
                });

                const style = component.props?.style || {};

                return (
                  component.show && (
                    <div
                      className={wrapperClass}
                      id={component.id}
                      key={component.id}
                      style={{
                        position: style.position,
                        left: style.left,
                        top: style.top,
                        width: style.width,
                        height: style.height,
                      }}
                      onMouseDown={onMouseDown}
                      onClick={(e) => {
                        e.stopPropagation();
                        onItemClick && onItemClick(component);
                      }}
                    >
                      <DynamicTag
                        type={component.type}
                        props={{
                          className: `${prefix}-component`,
                          ...component.props,
                        }}
                      />
                      <div className={`${prefix}-resizers`}>
                        <div
                          className={`${prefix}-resizers__resizer topLeft`}
                          onMouseDown={onStartResize("topLeft")}
                        ></div>
                        <div
                          className={`${prefix}-resizers__resizer topRight`}
                          onMouseDown={onStartResize("topRight")}
                        ></div>
                        <div
                          className={`${prefix}-resizers__resizer bottomLeft`}
                          onMouseDown={onStartResize("bottomLeft")}
                        ></div>
                        <div
                          className={`${prefix}-resizers__resizer bottomRight`}
                          onMouseDown={onStartResize("bottomRight")}
                        ></div>
                      </div>
                    </div>
                  )
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Canvas);
