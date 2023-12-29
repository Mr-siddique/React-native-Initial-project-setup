export default function answersLogMiddleware() {
  return ({dispatch, getState}) => {
    return next => action => {
      return next(action);
    };
  };
}
