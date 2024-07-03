import { HTMLAttributes, memo, useEffect, useRef } from "react";
import { Modal } from "antd";
import Cropper from "cropperjs";

import "cropperjs/dist/cropper.css";

export interface CropperData {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface UploadCropperProps
  extends LCPWeb.BasicProps<HTMLAttributes<HTMLDivElement>> {
  open?: boolean;
  imgUrl?: string;
  onOK?: (blob: Blob) => void;
  onCancel?: () => void;
}

const UploadCropper = (props: UploadCropperProps) => {
  const { prefixCls, open, imgUrl, onCancel, onOK } = props;
  const imgRef = useRef(null);
  const cropperData = useRef<any>({});
  const cropper = useRef<any>(null);

  useEffect(() => {
    if (imgRef.current && open) {
      cropper.current = new Cropper(imgRef.current, {
        crop(event) {
          const { x, y, width, height } = event.detail;
          cropperData.current = {
            x: Math.floor(x),
            y: Math.floor(y),
            width: Math.floor(width),
            height: Math.floor(height),
          };
        },
      });
    }
    return () => {
      if (cropper.current) {
        cropper.current.destroy();
      }
    };
  }, [open]);

  const onConfirm = () => {
    if (cropper.current) {
      cropper.current.getCroppedCanvas().toBlob((blob: Blob) => {
        if (blob && onOK) {
          onOK(blob);
        }
      });
    }
  };

  return (
    <Modal
      key={imgUrl}
      className={`${prefixCls}-cropper`}
      title="剪裁图片"
      open={open}
      maskClosable={false}
      width={520}
      cancelText="取消"
      okText="确定"
      onOk={onConfirm}
      onCancel={onCancel}
    >
      <div className={`${prefixCls}-cropper-container`}>
        <img ref={imgRef} src={imgUrl} />
      </div>
    </Modal>
  );
};

export default memo(UploadCropper);
