import { memo } from "react";
import { Button, ButtonProps, Tooltip } from "antd";

export interface IconButton
  extends LCPWeb.BasicProps<ButtonProps, "onChange" | "value"> {
  icon: React.ReactNode;
  tooltip?: boolean;
  tooltipTitle?: React.ReactNode;
  activeValue: string;
  value?: boolean;
  onChange?: (value: boolean) => void;
}

const IconButton = (props: IconButton) => {
  const { icon, tooltip, tooltipTitle, value, onChange, ...others } = props;

  const onClick = () => {
    onChange && onChange(!value);
  };

  const btn = (
    <Button
      shape="circle"
      type={value ? "primary" : undefined}
      icon={icon}
      onClick={onClick}
      {...others}
    ></Button>
  );

  return tooltip ? <Tooltip title={tooltipTitle}>{btn}</Tooltip> : btn;
};

export default memo(IconButton);
