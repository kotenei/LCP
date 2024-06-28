import { HTMLAttributes, memo, useEffect, useRef } from "react";
import { Modal } from "antd";
import Cropper from "cropperjs";

import "cropperjs/dist/cropper.css";

export interface UploadCropperProps
  extends LCPWeb.BasicProps<HTMLAttributes<HTMLDivElement>> {
  open?: boolean;
  imgUrl?: string;
  onCancel?: () => void;
}

const UploadCropper = (props: UploadCropperProps) => {
  const { prefixCls, open, imgUrl, onCancel } = props;
  const imgRef = useRef(null);

  useEffect(() => {
    let cropper: Cropper;
    if (imgRef.current && open) {
      cropper = new Cropper(imgRef.current, {
        crop(event) {
          //   console.log(event.detail.x);
          //   console.log(event.detail.y);
          //   console.log(event.detail.width);
          //   console.log(event.detail.height);
          //   console.log(event.detail.rotate);
          //   console.log(event.detail.scaleX);
          //   console.log(event.detail.scaleY);
        },
      });
    }
    return () => {
      if (cropper) {
        cropper.destroy();
      }
    };
  }, [open]);

  const onOK = () => {};

  return (
    <Modal
      key={imgUrl}
      className={`${prefixCls}-cropper`}
      title="剪裁图片"
      open={open}
      width={520}
      cancelText="取消"
      okText="确定"
      //   styles={{
      //     header: {
      //       borderBottom: "1px solid #f0f0f0",
      //     },
      //     footer: {
      //       borderTop: "1px solid #f0f0f0",
      //     },
      //   }}
      onOk={onOK}
      onCancel={onCancel}
    >
      <div className={`${prefixCls}-cropper-container`}>
        <img ref={imgRef} src={imgUrl} />
      </div>
    </Modal>
  );
};

export default memo(UploadCropper);
