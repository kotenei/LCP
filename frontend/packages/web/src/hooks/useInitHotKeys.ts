import { useHotKey } from '@lcp/hooks';
import { message } from 'antd';
import { HotkeysEvent, KeyHandler } from 'hotkeys-js';
import { cloneDeep } from 'lodash-es';

import { useAppDispatch, useAppSelector } from '../store';
import { setCopiedComponent, pasteCopiedComponent, deleteComponent } from '../routes/editor/editor.reducer';
import { debounceUpdateCompnent } from '../routes/editor/editor.actions';

type MoveDirection = 'up' | 'down' | 'left' | 'right';

const wrap = (callback: KeyHandler) => {
  return (e: KeyboardEvent, event: HotkeysEvent) => {
    e.preventDefault();
    callback(e, event);
  };
};

export default function useInitHotKeys(containerSelector: string) {
  const { currentComponent, copiedComponent, page } = useAppSelector((state) => state.editor);
  const dispatch = useAppDispatch();
  const elmContainer = document.querySelector(containerSelector) as HTMLElement;
  const move = (direction: MoveDirection) => {
    const step = 1;
    const contentWidth = elmContainer.offsetWidth;
    const contentHeight = elmContainer.offsetHeight;
    const orgTop = currentComponent?.props?.style?.top || 0;
    const orgLeft = currentComponent?.props?.style?.left || 0;
    let width = currentComponent?.props?.style?.width || 0;
    let height = currentComponent?.props?.style?.height || 0;
    let newTop = parseInt(orgTop);
    let newLeft = parseInt(orgLeft);

    switch (direction) {
      case 'up':
        newTop = orgTop - step;
        break;
      case 'down':
        newTop = orgTop + step;
        break;
      case 'left':
        newLeft = orgLeft - step;
        break;
      case 'right':
        newLeft = orgLeft + step;
        break;
      default:
        break;
    }
    const tmpWidth = newLeft + width;
    const tmpHeight = newTop + height;
    if (tmpWidth > contentWidth - 2) {
      newLeft -= step;
    }
    if (tmpHeight > contentHeight - 2) {
      newTop -= step;
    }
    newTop = Math.max(newTop, 0);
    newLeft = Math.max(newLeft, 0);

    const newComponent = cloneDeep(currentComponent);
    if (newComponent && newComponent.props && newComponent.props.style) {
      newComponent.props.style.left = newLeft;
      newComponent.props.style.top = newTop;
      dispatch(debounceUpdateCompnent(newComponent));
    }
  };

  useHotKey(
    'ctrl+c, command+c',
    () => {
      if (currentComponent) {
        message.success('已拷贝当前图层', 1);
        dispatch(setCopiedComponent(currentComponent));
      }
    },
    [currentComponent],
  );

  useHotKey(
    'ctrl+v, command+v',
    () => {
      if (copiedComponent) {
        dispatch(pasteCopiedComponent(copiedComponent));
        message.success('已粘贴图层', 1);
      }
    },
    [copiedComponent],
  );

  useHotKey(
    'delete',
    () => {
      if (currentComponent) {
        dispatch(deleteComponent(currentComponent.id));
      }
    },
    [currentComponent],
  );

  useHotKey(
    'up',
    wrap(() => {
      move('up');
    }),
    [currentComponent, page],
  );

  useHotKey(
    'down',
    wrap(() => {
      move('down');
    }),
    [currentComponent, page],
  );

  useHotKey(
    'left',
    wrap(() => {
      move('left');
    }),
    [currentComponent, page],
  );

  useHotKey(
    'right',
    wrap(() => {
      move('right');
    }),
    [currentComponent, page],
  );
}
