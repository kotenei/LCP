import { HTMLAttributes, useEffect, useRef } from 'react';
import classnames from 'classnames';

import './context-menu.scss';
import { getParentElement } from '@lcp/utils';
import { useState } from '@lcp/hooks';

export interface ActionItem {
  text: string;
  shortcut: string;
  action: (id?: string) => void;
}

export interface TriggerAction {
  type: string;
  trigger: string;
  actions: ActionItem[];
}

export interface ContextMenuProps extends LCPWeb.BasicProps<HTMLAttributes<HTMLUListElement>> {
  actions?: ActionItem[];
  triggerActions?: TriggerAction[];
  triggerContainer?: string;
  canShow?: boolean;
  onMenuOpen?: (target: HTMLElement, type: string) => void;
}

export const ContextMenu = (props: ContextMenuProps) => {
  const { prefixCls = 'lcp-web-context-menu', className, triggerActions, onMenuOpen } = props;
  const classString = classnames(prefixCls, className);
  const menuRef = useRef<HTMLUListElement>(null);
  const wrapperElementId = useRef<string>('');
  const [state, setState] = useState({
    trigger: '',
  });

  useEffect(() => {
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('click', handleClick);
    };
  }, [triggerActions]);

  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    const target = e.target as HTMLElement;
    let wrapperElement: HTMLElement | undefined;
    let action: TriggerAction | undefined;

    if (triggerActions) {
      triggerActions.some((item) => {
        wrapperElement = getParentElement(target, item.trigger);
        if (wrapperElement) {
          action = item;
          setState({ trigger: item.trigger });
          return true;
        }
      });
    }

    if (wrapperElement && action && menuRef.current) {
      const { clientX, clientY } = e;
      menuRef.current.style.left = `${clientX}px`;
      menuRef.current.style.top = `${clientY}px`;
      menuRef.current.style.display = 'block';
      const wrapperElmId = wrapperElement.getAttribute('id');
      if (wrapperElmId) {
        wrapperElementId.current = wrapperElmId;
      }
      onMenuOpen?.(wrapperElement, action.type);
    }
  };

  const handleClick = (e: MouseEvent) => {
    if (menuRef.current) {
      menuRef.current.style.display = 'none';
    }
  };

  const renderTriggerActions = () => {
    const triggerAction = triggerActions?.find((item) => item.trigger === state.trigger);
    if (triggerAction) {
      return triggerAction.actions.map((action, index) => {
        return (
          <li className={`${prefixCls}-item`} key={index} onClick={() => action.action(wrapperElementId.current)}>
            <span className={`${prefixCls}-item-text`}>{action.text}</span>
            <span className={`${prefixCls}-item-shortcut`}>{action.shortcut}</span>
          </li>
        );
      });
    }
  };

  return (
    <ul className={classString} ref={menuRef}>
      {renderTriggerActions()}
    </ul>
  );
};

export default ContextMenu;
