import {createStore, applyMiddleware, compose} from 'redux';
import createMiddleware from './Middleware/clientMiddleware';
import answersLogMiddleware from './Middleware/answersLogMiddleware';
import {createLogger} from 'redux-logger';
import R from 'ramda';
import ApiClient from '../Services';

// creates the store
export default rootReducer => {
  /* ------------- Redux Configuration ------------- */

  const middleware = [];
  const enhancers = [];

  middleware.push(createMiddleware(new ApiClient()));
  middleware.push(answersLogMiddleware());

  const SAGA_LOGGING_BLACKLIST = [
    'EFFECT_TRIGGERED',
    'EFFECT_RESOLVED',
    'EFFECT_REJECTED',
    'persist/REHYDRATE',
  ];
  if (__DEV__) {
    const USE_LOGGING = __DEV__; //Config.reduxLogging;

    const logger = createLogger({
      // predicate: (getState, {type}) =>
      //   USE_LOGGING && R.not(R.contains(type, SAGA_LOGGING_BLACKLIST)),
      predicate: (getState, {type})=>true
    });
    middleware.push(logger);
  }
  /* ------------- Assemble Middleware ------------- */

  enhancers.push(applyMiddleware(...middleware));

  const store = createStore(rootReducer, compose(...enhancers));

  return store;
};
