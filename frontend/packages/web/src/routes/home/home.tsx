import { memo } from "react";
import { Layout } from "antd";

import "./home.scss";

const { Header, Content, Footer } = Layout;

const prefixCls = "lcp-web-home";

const Home = (props: any) => {
  return (
    <Layout className={prefixCls}>
      <Header>LCP 低代码</Header>
      <Content>Content</Content>
      <Footer>Footer</Footer>
    </Layout>
  );
};

export default memo(Home);
