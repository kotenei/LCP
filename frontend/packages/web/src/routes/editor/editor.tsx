import { HTMLAttributes, memo, useEffect, useMemo } from "react";
import { Layout as ALayout, Button, Space } from "antd";
import { v4 as uuidv4 } from "uuid";
import { useState } from "@lcp/hooks";
import { cloneDeep } from "lodash-es";
import { RcFile } from "antd/es/upload";

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
  updatePage,
  deleteComponent,
  updateComponents,
} from "./editor.reducer";
import { presetData } from "../../common/schema";
import { ComponentData } from "./typing";
import { getBase64 } from "../../utils";
import { commonStyle } from "../../common/schema/style";
import EditorContext, { EditorContextProps } from "./editor.context";
import "./editor.scss";

export interface EditorProps
  extends LCPWeb.BasicProps<HTMLAttributes<HTMLDivElement>> {}

const { Sider, Content } = ALayout;

const Editor = (props: EditorProps) => {
  const { prefixCls = "lcp-web-editor" } = props;
  const { template, templateLoading, components, currentComponent, page } =
    useAppSelector((state) => state.editor);
  const dispatch = useAppDispatch();
  const [state, setState] = useState({
    leftTabKey: "1",
    rightTabKey: "1",
    currentElement: null,
    imageUrl: "",
  });

  useEffect(() => {
    const keyup = (e: KeyboardEvent) => {
      if (e.key === "Delete" && currentComponent) {
        dispatch(deleteComponent(currentComponent.id));
      }
    };

    document.addEventListener("keyup", keyup);

    return () => {
      document.removeEventListener("keyup", keyup);
    };
  }, [currentComponent]);

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

  const onItemClick = (item: ComponentData, changeTab: boolean = true) => {
    dispatch(setCurrentComponent(item));
    if (changeTab) {
      onRightTabChange("1");
    }
  };

  const onItemAdd = (item: ComponentData) => {
    const len = components?.length || 0;
    const newItem = cloneDeep(item);
    newItem.id = uuidv4();
    newItem.name = `图层${len + 1}`;
    newItem.show = true;
    dispatch(addComponent(newItem));
  };

  const onUpload = (file: RcFile) => {
    getBase64(file, (url) => {
      onItemAdd({
        id: uuidv4(),
        type: "img",
        props: {
          src: url,
          style: { ...commonStyle, width: "", height: "", left: 0, top: 0 },
        },
      });
    });
  };

  const onPropChange = (key: string, value: any) => {
    if (currentComponent) {
      const component = cloneDeep(currentComponent);
      if (component.props) {
        if (component.props[key] != null) {
          component.props[key] = value;
        } else {
          for (const k in component.props.style) {
            if (k === key) {
              component.props.style[key] = value;
              break;
            }
          }
        }
      }
      dispatch(updateComponent(component));
    }
  };

  const onToggle = (id: string, show: boolean) => {
    const component = getUpdateComponent(id);
    if (component) {
      component.show = show;
      dispatch(updateComponent(component));
    }
  };

  const onNameChange = (id: string, name: string) => {
    const component = getUpdateComponent(id);
    if (component && component.name !== name) {
      component.name = name;
      dispatch(updateComponent(component));
    }
  };

  const onPageChange = (key: string, value: any) => {
    dispatch(updatePage({ key, value }));
  };

  const onCanvasClick = () => {
    dispatch(setCurrentComponent(null));
    onRightTabChange("3");
  };

  const onSort = (components: ComponentData[]) => {
    dispatch(updateComponents(components));
  };

  const getUpdateComponent = (id: string) => {
    const component = components
      ? components.find((item) => item.id === id)
      : null;
    return component ? cloneDeep(component) : null;
  };

  const leftPanelData = useMemo(() => {
    const result: LeftPanelData[] = [];
    let flag = 1;

    for (const key in presetData) {
      const item = presetData[key];
      result.push({
        key: String(flag++),
        title: item.title,
        tabKey: key,
        components: item.components,
      });
    }
    return result;
  }, []);

  const contextValue: EditorContextProps = {
    onItemAdd,
    onItemClick,
    onToggle,
    onNameChange,
    onPageChange,
    onPropChange,
    onSort,
  };

  return (
    <EditorContext.Provider value={contextValue}>
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
            {state.imageUrl ? (
              <img
                src={state.imageUrl}
                alt="avatar"
                style={{ width: "100%" }}
              />
            ) : null}
            <LeftPanel
              prefixCls={prefixCls}
              activeKey={state.leftTabKey}
              data={leftPanelData}
              onTabChange={onLeftTabChange}
              onUpload={onUpload}
            />
          </Sider>
          <Content
            className={`${prefixCls}-container__main`}
            onClick={onCanvasClick}
          >
            <Canvas
              prefixCls={prefixCls}
              components={components}
              currentComponent={currentComponent}
              page={page}
              pageActive={state.rightTabKey === "3"}
            />
          </Content>
          <Sider className={`${prefixCls}-container__right`} width={350}>
            <RightPanel
              prefixCls={prefixCls}
              activeKey={state.rightTabKey}
              currentComponent={currentComponent}
              components={components}
              page={page}
              onTabChange={onRightTabChange}
            />
          </Sider>
        </ALayout>
      </Layout>
    </EditorContext.Provider>
  );
};

export default memo(Editor);
