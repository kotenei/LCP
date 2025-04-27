import { cloneDeep } from 'lodash-es';
import { debounce } from '@lcp/utils';
import { ComponentData, HistoryProps } from './editor.types';
import { pushModifyHistory, updateComponents, setCurrentComponent, setOldValue } from './editor.reducer';
import { AppDispatch, RootState } from '../../store';


const pushUpdateHistory = (dispatch: AppDispatch, { componentId, data }: HistoryProps) => {
  dispatch(pushModifyHistory({ componentId, data, type: 'update' }));
};

const pushHistoryDebounce = debounce(pushUpdateHistory);


export const debounceUpdateCompnent = (component: ComponentData) => (dispatch: AppDispatch, getState: () => RootState) => {
  const state = getState() as RootState;
  const editor = state.editor;
  const newComponents = editor.components ? [...editor.components] : [];
  const index = newComponents.findIndex((c) => c.id === component.id);
  if (index >= 0) {
    const oldComponent = newComponents[index];
    newComponents[index] = component;
    if (!editor.oldValue) {
      const oldValue = cloneDeep({
        name: oldComponent.name,
        show: oldComponent.show,
        props: oldComponent.props,
      });
      dispatch(setOldValue(oldValue));
    }
    dispatch(updateComponents(newComponents));
    dispatch(setCurrentComponent(component));
    pushHistoryDebounce(dispatch, {
      componentId: component.id,
      data: {
        newValue: {
          name: component.name,
          show: component.show,
          props: component.props,
        },
        index,
      },
    });
  }
};
