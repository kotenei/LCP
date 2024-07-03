import { HTMLAttributes, memo, useMemo, useContext } from "react";
import classnames from "classnames";
import { Space, Button, Tooltip, Spin } from "antd";
import { UndoOutlined, RedoOutlined, LoadingOutlined } from "@ant-design/icons";
import "./canvas.scss";
import { DynamicTag } from "../../../../components/dynamic-tag";
import { ComponentData, PageData } from "../../typing";
import EditorContext from "../../editor.context";

export interface CanvasProps
  extends LCPWeb.BasicProps<HTMLAttributes<HTMLDivElement>> {
  data?: any;
  components?: ComponentData[];
  currentComponent?: ComponentData | null;
  loading?: false;
  page?: PageData;
  pageActive?: boolean;
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
    ...others
  } = props;
  const prefix = `${prefixCls}-canvas`;
  const classString = classnames(prefix, className);
  const { onItemClick } = useContext(EditorContext) || {};

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

  return (
    <div className={classString} {...others}>
      <div className={`${prefix}-header`}>
        <Space size={16}>
          <Tooltip title="撤销">
            <Button shape="circle" icon={<UndoOutlined />} />
          </Tooltip>
          <Tooltip title="重做">
            <Button shape="circle" icon={<RedoOutlined />} />
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
                      key={component.id}
                      style={{
                        position: style.position,
                        left: style.left,
                        top: style.top,
                        width: style.width,
                        height: style.height,
                      }}
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
