import { HTMLAttributes, memo, useMemo } from "react";
import classnames from "classnames";
import { ColorPicker, Slider } from "antd";

import "./shadow-picker.scss";

export interface ShadowPickerProps
  extends LCPWeb.BasicProps<HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: string;
  onChange?: (value: string) => void;
}

const ShadowPicker = (props: ShadowPickerProps) => {
  const {
    prefixCls = "lcp-web-shadow-picker",
    className,
    value,
    onChange,
  } = props;
  const classString = classnames(prefixCls, className);

  const pickerValue = useMemo(() => {
    const result = { color: "", offset: 0, size: 0 };

    if (value) {
      const arr = value.split(" ");
      result.offset = parseInt(arr[0]) || 0;
      result.size = parseInt(arr[2]) || 0;
      result.color = arr[3] || "";
    }

    return result;
  }, [value]);

  const onColorChange = (color: any, value: string) => {
    pickerValue.color = value;
    onPickerChange(pickerValue);
  };

  const onOffsetChange = (value: number) => {
    pickerValue.offset = value;
    onPickerChange(pickerValue);
  };

  const onSizeChange = (value: number) => {
    pickerValue.size = value;
    onPickerChange(pickerValue);
  };

  const onPickerChange = (pickerValue: any) => {
    onChange &&
      onChange(
        `${pickerValue.offset}px ${pickerValue.offset}px ${pickerValue.size}px ${pickerValue.color}`
      );
  };

  return (
    <div className={classString}>
      <div className={`${prefixCls}-item`}>
        <span>阴影颜色：</span>
        <div>
          <ColorPicker value={pickerValue.color} onChange={onColorChange} />
        </div>
      </div>
      <div className={`${prefixCls}-item`}>
        <span>阴影大小：</span>
        <div>
          <Slider
            min={0}
            max={20}
            value={pickerValue.offset}
            onChange={onOffsetChange}
          />
        </div>
      </div>
      <div className={`${prefixCls}-item`}>
        <span>阴影模糊：</span>
        <div>
          <Slider
            min={0}
            max={20}
            value={pickerValue.size}
            onChange={onSizeChange}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(ShadowPicker);
