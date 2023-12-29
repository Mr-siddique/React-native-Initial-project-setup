import {combineReducers} from 'redux';

import configureStore from './CreateStore';
import firstcall from './firstCall';
export default () => {
  const appReducer = combineReducers({
    firstcall
  });

  const rootReducer = (state, action) => {
    return appReducer(state, action);
  };

  return configureStore(rootReducer);
};
