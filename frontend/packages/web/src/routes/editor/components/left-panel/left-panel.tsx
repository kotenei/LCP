import { memo, useContext, useMemo } from "react";
import { Tabs, Upload, Button, UploadProps } from "antd";
import { UploadOutlined } from "@ant-design/icons";

import { ComponentData } from "../../editor.types";
import { DynamicTag } from "../../../../components/dynamic-tag";

import "./left-panel.scss";
import { useState } from "@lcp/hooks";
import { RcFile } from "antd/es/upload";
import EditorContext from "../../editor.context";

export interface LeftPanelData {
  title: React.ReactNode;
  key: string;
  tabKey: string;
  icon?: any;
  components?: ComponentData[];
}

export interface LeftPanelProps {
  prefixCls?: string;
  data?: LeftPanelData[];
  activeKey?: string;
  onTabChange?: (activeKey: string) => void;
  onUpload?: (file: RcFile) => void;
}

const LeftPanel = (props: LeftPanelProps) => {
  const { prefixCls, data, activeKey, onTabChange, onUpload } = props;
  const prefix = `${prefixCls}-leftpanel`;
  const [state, setState] = useState({
    loading: false,
  });
  const { onItemAdd } = useContext(EditorContext) || {};

  const uploadProps: UploadProps = {
    showUploadList: false,
    name: "file",
    action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",

    beforeUpload(file) {
      onUpload && onUpload(file);
      return false;
    },
    onChange(info) {
      if (info.file.status === "uploading" && !state.loading) {
        setState({
          loading: true,
        });
      } else {
        setState({
          loading: false,
        });
      }
    },
  };

  const items = useMemo(() => {
    if (data === null || data === undefined) {
      return null;
    }
    const result = data.map((item) => {
      return {
        label: item.title,
        key: item.key,
        children: (
          <>
            {item.tabKey === "img" && (
              <Upload className={`${prefix}-upload`} {...uploadProps}>
                <Button
                  loading={state.loading}
                  icon={<UploadOutlined />}
                  block
                  size="large"
                  type="primary"
                >
                  上传图片
                </Button>
              </Upload>
            )}
            <div className={`${prefix}-list ${prefix}-list__${item.tabKey}`}>
              {item.components &&
                item.components.map((component) => {
                  return (
                    <div
                      key={component.id}
                      className={`${prefix}-item ${prefix}-item__${item.tabKey}`}
                      onClick={() => onItemAdd && onItemAdd(component, false)}
                    >
                      <DynamicTag
                        type={component.type}
                        props={component.props}
                      />
                    </div>
                  );
                })}
            </div>
          </>
        ),
      };
    });
    return result;
  }, [prefix, data, state.loading, onItemAdd]);

  return (
    items && (
      <Tabs
        centered
        className={prefix}
        activeKey={activeKey}
        items={items}
        onChange={onTabChange}
      ></Tabs>
    )
  );
};

export default memo(LeftPanel);
