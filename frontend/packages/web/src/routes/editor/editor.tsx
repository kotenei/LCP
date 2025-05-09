import { HTMLAttributes, memo, useMemo, useRef } from 'react';
import { Layout as ALayout, Button, Space, message } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { useState } from '@lcp/hooks';
import { getBase64 } from '@lcp/utils';
import { cloneDeep } from 'lodash-es';
import { RcFile } from 'antd/es/upload';

import { useAppDispatch, useAppSelector } from '../../store';
import { Layout } from '../../components/layout';
import { LeftPanel, LeftPanelData } from './components/left-panel';
import { RightPanel } from './components/right-panel';
import { Canvas } from './components/canvas';
import { debounceUpdateCompnent } from './editor.actions';
import {
  addComponent,
  setCurrentComponent,
  updatePage,
  updateComponents,
  undo,
  redo,
  setCopiedComponent,
  pasteCopiedComponent,
  deleteComponent,
} from './editor.reducer';
import { presetData } from '../../common/schema';
import { ComponentData } from './editor.types';
import { useInitHotKeys } from '../../hooks';
import { commonStyle } from '../../common/schema/style';
import EditorContext, { EditorContextProps } from './editor.context';
import { ContextMenu } from '../../components/context-menu';
import './editor.scss';

export interface EditorProps extends LCPWeb.BasicProps<HTMLAttributes<HTMLDivElement>> {}

const { Sider, Content } = ALayout;

const Editor = (props: EditorProps) => {
  const { prefixCls = 'lcp-web-editor' } = props;
  const { components, currentComponent, page, histories, historyIndex, copiedComponent } = useAppSelector((state) => state.editor);
  const dispatch = useAppDispatch();
  const [state, setState] = useState({
    leftTabKey: '1',
    rightTabKey: '1',
    currentElement: null,
    imageUrl: '',
    canShowContextMenu: true,
  });
  const timer = useRef<number | null>(null);

  useInitHotKeys('#editorContainer');

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
      onRightTabChange('1');
    }
    setContextMenuShow(false);
  };

  const onItemAdd = (item: ComponentData) => {
    const newItem = cloneDeep(item);
    newItem.show = true;
    dispatch(addComponent(newItem));
  };

  const onUpload = (file: RcFile) => {
    getBase64(file, (url) => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        let width = img.width;
        if (width > 300) {
          width = 300;
        }
        onItemAdd({
          id: uuidv4(),
          type: 'img',
          props: {
            src: url,
            style: { ...commonStyle, width, height: '', left: 0, top: 0 },
          },
        });
      };
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
      dispatch(debounceUpdateCompnent(component));
    }
  };

  const onToggle = (id: string, show: boolean) => {
    const component = getUpdateComponent(id);
    if (component) {
      component.show = show;
      dispatch(debounceUpdateCompnent(component));
    }
  };

  const onNameChange = (id: string, name: string) => {
    const component = getUpdateComponent(id);
    if (component && component.name !== name) {
      component.name = name;
      dispatch(debounceUpdateCompnent(component));
    }
  };

  const onPageChange = (key: string, value: any) => {
    dispatch(updatePage({ key, value }));
  };

  const onCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.id === 'editorContainer') {
      dispatch(setCurrentComponent(null));
      onRightTabChange('3');
    } else if (target.getAttribute('data-type') === 'component') {
      const parentElement = target.parentElement;
      const id = parentElement?.id;
      const component = components?.find((item) => item.id === id);
      if (component) {
        onItemClick(component);
      }
    }
  };

  const onSort = (components: ComponentData[]) => {
    dispatch(updateComponents(components));
  };

  const onPositionUpdate = (position: { left: number; top: number; id: string }) => {
    const { left, top, id } = position;
    const component = components?.find((item) => item.id === id);
    if (component) {
      const newComponent = cloneDeep(component);
      if (newComponent.props && newComponent.props.style) {
        newComponent.props.style.left = left;
        newComponent.props.style.top = top;
        dispatch(debounceUpdateCompnent(newComponent));
      }
    }
  };

  const onSizeUpdate = (size: { left: number; top: number; width: number; height: number; id: string }) => {
    const { left, top, width, height, id } = size;
    const component = components?.find((item: any) => item.id === id);
    if (component) {
      const newComponent = cloneDeep(component);
      if (newComponent.props && newComponent.props.style) {
        newComponent.props.style.left = left;
        newComponent.props.style.top = top;
        newComponent.props.style.width = width;
        newComponent.props.style.height = height;
        dispatch(debounceUpdateCompnent(newComponent));
      }
    }
  };

  const onUndo = () => {
    dispatch(undo());
  };

  const onRedo = () => {
    dispatch(redo());
  };

  const onMenuOpen = (wrapperElement: HTMLElement) => {
    const id = wrapperElement.getAttribute('id');
    const component = components?.find((item) => item.id === id);
    if (component) {
      onItemClick(component);
      setContextMenuShow(true);
    }
  };

  const setContextMenuShow = (show: boolean) => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    timer.current = setTimeout(() => {
      setState({
        canShowContextMenu: show,
      });
    });
  };

  const getUpdateComponent = (id: string) => {
    const component = components ? components.find((item) => item.id === id) : null;
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

  const undoDisabled = useMemo(() => {
    if (historyIndex > -1) {
      return false;
    }
    return true;
  }, [histories, historyIndex]);

  const redoDisabled = useMemo(() => {
    if (histories.length > 0 && historyIndex < histories.length - 1) {
      return false;
    }
    return true;
  }, [histories, historyIndex]);

  const contextValue: EditorContextProps = {
    onItemAdd,
    onItemClick,
    onToggle,
    onNameChange,
    onPageChange,
    onPropChange,
    onSort,
    onUndo,
    onRedo,
  };

  const contextMenuActions = useMemo(() => {
    const result = [
      {
        type: 'item',
        trigger: `${prefixCls}-canvas-wrapper`,
        actions: [
          {
            text: '复制',
            shortcut: '⌘C / Ctrl+C',
            action: (id?: string) => {
              const component = components?.find((item) => item.id === id);
              message.success('已拷贝当前图层', 1);
              dispatch(setCopiedComponent(component));
            },
          },
          {
            text: '删除',
            shortcut: 'Backspace / Delete',
            action: (id?: string) => {
              dispatch(deleteComponent(id));
            },
          },
        ],
      },
    ];
    if (copiedComponent) {
      result.push({
        type: 'page',
        trigger: `${prefixCls}-canvas-body__container`,
        actions: [
          {
            text: '粘贴',
            shortcut: '⌘V / Ctrl+V',
            action: () => {
              dispatch(pasteCopiedComponent(copiedComponent));
              message.success('已粘贴图层', 1);
            },
          },
        ],
      });
    }
    return result;
  }, [components, copiedComponent]);

  return (
    <EditorContext.Provider value={contextValue}>
      <Layout
        className={prefixCls}
        showFooter={false}
        extra={
          <Space size={16}>
            <Button type='primary'>预览</Button>
            <Button type='primary'>保存</Button>
          </Space>
        }
      >
        <ALayout className={`${prefixCls}-container`}>
          <Sider className={`${prefixCls}-container__left`} width={350}>
            {state.imageUrl ? <img src={state.imageUrl} alt='avatar' style={{ width: '100%' }} /> : null}
            <LeftPanel
              prefixCls={prefixCls}
              activeKey={state.leftTabKey}
              data={leftPanelData}
              onTabChange={onLeftTabChange}
              onUpload={onUpload}
            />
          </Sider>
          <Content className={`${prefixCls}-container__main`} onClick={onCanvasClick}>
            <Canvas
              prefixCls={prefixCls}
              components={components}
              currentComponent={currentComponent}
              page={page}
              pageActive={state.rightTabKey === '3'}
              undoDisabled={undoDisabled}
              redoDisabled={redoDisabled}
              onPositionUpdate={onPositionUpdate}
              onSizeUpdate={onSizeUpdate}
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
        <ContextMenu
          // actions={contextMenuActions}
          // triggerContainer={`${prefixCls}-canvas-wrapper`}
          triggerActions={contextMenuActions}
          // canShow={state.canShowContextMenu}
          onMenuOpen={onMenuOpen}
        />
        {/* <ContextMenu
          actions={contextMenuActionsForCanvas}
          triggerContainer={`${prefixCls}-canvas-body__container`}
        /> */}
      </Layout>
    </EditorContext.Provider>
  );
};

export default memo(Editor);
