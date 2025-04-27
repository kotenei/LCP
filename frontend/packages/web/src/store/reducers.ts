import { templateReducerKey, templateReducer } from '../common/modules/template';
import { editorReducerKey, editorReducer } from '../routes/editor';
import { homeReducerKey, homeReducer } from '../routes/home';

export const reducers = {
  [templateReducerKey]: templateReducer,
  [editorReducerKey]: editorReducer,
  [homeReducerKey]: homeReducer,
};
