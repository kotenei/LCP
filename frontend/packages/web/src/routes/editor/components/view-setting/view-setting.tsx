import { HTMLAttributes, memo } from "react";

import { PropsTableItems } from "../props-table";
import { componentToFormProps } from "../../../../utils";
import { PageData } from "../../typing";

export interface ViewSetting
  extends LCPWeb.BasicProps<HTMLAttributes<HTMLElement>, "onChange"> {
  page?: PageData;
  onChange?: (key: string, value: any) => void;
}

const ViewSetting = (props: ViewSetting) => {
  const { prefixCls, page, onChange } = props;
  const prefix = `${prefixCls}-viewsetting`;

  const formPropsData = componentToFormProps(page?.props);

  return (
    <div className={prefix}>
      <PropsTableItems
        prefixCls={prefix}
        data={formPropsData}
        onChange={onChange}
      />
    </div>
  );
};

export default memo(ViewSetting);
