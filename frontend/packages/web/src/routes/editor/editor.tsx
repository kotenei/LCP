import { HTMLAttributes, memo, useEffect, useMemo } from "react";
import { Layout as ALayout, Button, Space } from "antd";
import { v4 as uuidv4 } from "uuid";
import { useState } from "@lcp/hooks";
import { cloneDeep } from "lodash-es";

import { useAppDispatch, useAppSelector } from "../../store";
import { Layout } from "../../components/layout";
import { LeftPanel, LeftPanelData } from "./components/left-panel";
import { RightPanel } from "./components/right-panel";
import { Canvas } from "./components/canvas";
import { getTemplate } from "./editor.actions";
import {
  addComponent,
  updateComponent,
  setCurrentComponent,
} from "./editor.reducer";
import { presetData } from "../../common/schema";
import { ComponentData } from "../../common/schema/typing";

import "./editor.scss";

export interface EditorProps
  extends LCPWeb.BasicProps<HTMLAttributes<HTMLDivElement>> {}

const { Sider, Content } = ALayout;

const Editor = (props: EditorProps) => {
  const { prefixCls = "lcp-web-editor" } = props;
  const { template, templateLoading, components, currentComponent } =
    useAppSelector((state) => state.editor);
  const dispatch = useAppDispatch();
  const [state, setState] = useState({
    leftTabKey: "1",
    rightTabKey: "1",
    currentElement: null,
  });

  // useEffect(() => {
  //   dispatch(getTemplate(1));
  // }, []);

  const onLeftTabChange = (activeKey: string) => {
    setState({
      leftTabKey: activeKey,
    });
  };

  const onRightTabChange = (activeKey: string) => {
    setState({
      rightTabKey: activeKey,
    });
  };

  const onPropChange = (key: string, value: any) => {
    dispatch(updateComponent({ key, value }));
  };

  const onItemAdd = (item: ComponentData) => {
    const newItem = cloneDeep(item);
    newItem.id = uuidv4();
    dispatch(addComponent(newItem));
  };

  const onItemActive = (item: ComponentData) => {
    dispatch(setCurrentComponent(item));
  };

  const leftPanelData = useMemo(() => {
    const result: LeftPanelData[] = [];
    let flag = 1;

    for (const key in presetData) {
      const item = presetData[key];
      result.push({
        key: String(flag++),
        title: item.title,
        components: item.components,
      });
    }
    return result;
  }, []);

  return (
    <Layout
      className={prefixCls}
      showFooter={false}
      extra={
        <Space size={16}>
          <Button type="primary">预览</Button>
          <Button type="primary">保存</Button>
        </Space>
      }
    >
      <ALayout className={`${prefixCls}-container`}>
        <Sider className={`${prefixCls}-container__left`} width={350}>
          <LeftPanel
            prefixCls={prefixCls}
            activeKey={state.leftTabKey}
            data={leftPanelData}
            onTabChange={onLeftTabChange}
            onItemClick={onItemAdd}
          />
        </Sider>
        <Content className={`${prefixCls}-container__main`}>
          <Canvas
            prefixCls={prefixCls}
            components={components}
            currentComponent={currentComponent}
            onItemClick={onItemActive}
          />
        </Content>
        <Sider className={`${prefixCls}-container__right`} width={350}>
          <RightPanel
            prefixCls={prefixCls}
            activeKey={state.rightTabKey}
            currentComponent={currentComponent}
            onTabChange={onRightTabChange}
            onPropChange={onPropChange}
          />
        </Sider>
      </ALayout>
    </Layout>
  );
};

export default memo(Editor);
