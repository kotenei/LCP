import { HTMLAttributes, memo, useContext } from "react";

import { PropsList } from "../../../../components/props-list";
import { componentToFormProps } from "../../../../utils";
import { PageData } from "../../editor.types";

import "./view-setting.scss";
import EditorContext from "../../editor.context";

export interface ViewSetting
  extends LCPWeb.BasicProps<HTMLAttributes<HTMLElement>, "onChange"> {
  page?: PageData;
}

const ViewSetting = (props: ViewSetting) => {
  const { prefixCls, page } = props;
  const { onPageChange } = useContext(EditorContext) || {};
  const prefix = `${prefixCls}-view-setting`;
  const formPropsData = componentToFormProps(page?.props);

  return (
    <div className={prefix}>
      <PropsList data={formPropsData} onChange={onPageChange} />
    </div>
  );
};

export default memo(ViewSetting);
