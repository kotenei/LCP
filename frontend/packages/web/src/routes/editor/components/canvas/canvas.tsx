import { HTMLAttributes, memo } from "react";
import classnames from "classnames";
import { Space, Button, Tooltip, Spin } from "antd";
import { UndoOutlined, RedoOutlined, LoadingOutlined } from "@ant-design/icons";
import "./canvas.scss";
import { DynamicTag } from "../../../../components/dynamic-tag";
import { ComponentData } from "../../typing";

export interface CanvasProps
  extends LCPWeb.BasicProps<HTMLAttributes<HTMLDivElement>> {
  data?: any;
  components?: ComponentData[];
  currentComponent?: ComponentData | null;
  loading?: false;
  onItemClick?: (item: ComponentData) => void;
  onPageClick?: () => void;
}

const Canvas = (props: CanvasProps) => {
  const {
    prefixCls,
    className,
    loading,
    currentComponent,
    components,
    onItemClick,
    onPageClick,
  } = props;
  const prefix = `${prefixCls}-canvas`;
  const classString = classnames(prefix, className);

  return (
    <div className={classString}>
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
          <div className={`${prefix}-body__content`} onClick={onPageClick}>
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
