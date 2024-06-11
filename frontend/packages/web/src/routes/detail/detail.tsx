import { HTMLAttributes, memo } from "react";
import { Row, Col, Card } from "antd";
import { Layout } from "../../components/layout";

import "./detail.scss";

export interface DetailProps
  extends LCPWeb.BasicProps<HTMLAttributes<HTMLDivElement>> {}

const Detail = (props: DetailProps) => {
  const { prefixCls = "lcp-web-detail" } = props;
  return (
    <Layout className={prefixCls}>
      <div className={`${prefixCls}-container`}></div>
    </Layout>
  );
};

export default memo(Detail);
