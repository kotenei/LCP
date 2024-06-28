import { HTMLAttributes, memo } from "react";
import classnames from "classnames";
import {
  Button,
  Upload as AntUpload,
  UploadProps as AntUploadProps,
} from "antd";
import { UploadOutlined, ScissorOutlined } from "@ant-design/icons";
import { RcFile } from "antd/es/upload";
import { useState } from "@lcp/hooks";

import UploadCropper from "./upload-cropper";
import { getBase64 } from "../../utils";
import "./upload.scss";

export interface UploadProps
  extends LCPWeb.BasicProps<HTMLAttributes<HTMLDivElement>, "onChange"> {
  action?: string;
  value?: string;
  onChange?: (value: string) => void;
}

const Upload = (props: UploadProps) => {
  const {
    prefixCls = "lcp-web-upload",
    className,
    value,
    action,
    onChange,
  } = props;

  const [state, setState] = useState({
    loading: false,
    open: false,
  });

  const classString = classnames(prefixCls, className);

  const uploadProps: AntUploadProps = {
    showUploadList: false,
    name: "file",
    action,

    beforeUpload(file: RcFile) {
      getBase64(file, (url) => {
        onChange && onChange(url);
      });
      return false;
    },
    onChange(info) {
      console.log(info.file.status);
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

  return (
    <div className={classString}>
      <div
        className={`${prefixCls}-preview`}
        style={
          value
            ? {
                backgroundRepeat: `no-repeat`,
                backgroundImage: `url(${value})`,
                backgroundSize: "contain",
                backgroundPosition: "center",
              }
            : undefined
        }
      ></div>
      <div className={`${prefixCls}-control`}>
        <AntUpload {...uploadProps}>
          <Button icon={<UploadOutlined />} loading={state.loading}>
            更换图片
          </Button>
        </AntUpload>
        <Button
          icon={<ScissorOutlined />}
          style={{ margin: "8px 0" }}
          disabled={state.loading}
          onClick={() => {
            setState({ open: true });
          }}
        >
          裁剪图片
        </Button>

        <UploadCropper
          prefixCls={prefixCls}
          open={state.open}
          imgUrl={value}
          onCancel={() => {
            setState({
              open: false,
            });
          }}
        />
      </div>
    </div>
  );
};

export default memo(Upload);
