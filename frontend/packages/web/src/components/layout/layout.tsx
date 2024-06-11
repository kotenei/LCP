import { HTMLAttributes, memo } from "react";
import classnames from "classnames";
import { Layout as ALayout } from "antd";

import "./layout.scss";

export interface LayoutProps
  extends LCPWeb.BasicProps<HTMLAttributes<HTMLDivElement>, "title"> {
  showHeader?: boolean;
  showFooter?: boolean;
  title?: React.ReactNode;
  extra?: React.ReactNode;
}

const { Header, Content, Footer } = ALayout;

const Layout = (props: LayoutProps) => {
  const {
    prefixCls = "lcp-web-layout",
    className,
    showHeader = true,
    showFooter = true,
    children,
    title = "LCP 低代码",
    extra,
  } = props;

  const classString = classnames(prefixCls, className);

  return (
    <ALayout className={classString}>
      {showHeader && (
        <Header className={`${prefixCls}-header`}>
          <div className={`${prefixCls}-header__left`}>
            <h1>{title}</h1>
          </div>
          <div className={`${prefixCls}-header__right`}>{extra}</div>
        </Header>
      )}
      <Content className={`${prefixCls}-content`}>{children}</Content>

      {showFooter && (
        <Footer className={`${prefixCls}-footer`}>
          LCP ©2024 Created by Rain
        </Footer>
      )}
    </ALayout>
  );
};

export default memo(Layout);
