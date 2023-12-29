// import NetInfo from '@react-native-community/netinfo';
// import {UPDATE_INTERNET_CONNECTIVITY} from '../Utils';
// import {firebaseLogEvent} from '../../FirebaseLogger';

export default function clientMiddleware(client) {
  return ({dispatch, getState}) => {
    return next => action => {
      if (typeof action === 'function') {
        return action(dispatch, getState);
      }

      const {promise, types, ...rest} = action; // eslint-disable-line no-redeclare

      if (!promise) {
        return next(action);
      }

      if (rest.ignoreUpdates) {
        if (__DEV__) {
          return promise(client).then(result =>
            console.log('ignoring further action dispatches: ', result),
          );
        } else {
          return promise(client);
        }
      }

      const [REQUEST, SUCCESS, FAILURE] = types;
      next({...rest, type: REQUEST});
      const actionPromise = promise(client);
      actionPromise
        .then(
          result => {
            try {
              if (
                // eslint-disable-next-line eqeqeq
                JSON.parse(result).status != undefined &&
                !!JSON.parse(result).status &&
                !isNaN(JSON.parse(result).status)
              ) {
                if (
                  // eslint-disable-next-line eqeqeq
                  parseInt(parseInt(JSON.parse(result).status, 10) / 100, 10) ==
                  2
                ) {
                  next({...rest, result, type: SUCCESS});
                } else {
                  next({...rest, result, type: FAILURE});
                }
              } else {
                next({...rest, result, type: SUCCESS});
              }
            } catch (err) {
              next({...rest, result, type: SUCCESS});
            }

            // NetInfo.fetch().then(state => {
            //   next({
            //     no_internet: !state.isConnected,
            //     type: UPDATE_INTERNET_CONNECTIVITY,
            //   });
            // });
          },
          ({error, response, code}) => {
            // NetInfo.fetch().then(state => {
            //   // console.log('connection info: ', state.isConnected)
            //   if (!state.isConnected || (error && error.timeout)) {
            //     next({no_internet: true, type: UPDATE_INTERNET_CONNECTIVITY});
            //     return next({...rest, error, result: response, type: FAILURE});
            //   }
            //   next({
            //     ...rest,
            //     no_internet: false,
            //     type: UPDATE_INTERNET_CONNECTIVITY,
            //   });
            //   // console.log(error)
            //   if (
            //     (error && error.status == 401) ||
            //     code == 'ENSNETSERVICESERRORDOMAIN401'
            //   )
            //     next({auth_failure: true, type: 'login/global_auth_failure'});
            //   return next({...rest, error, result: response, type: FAILURE});
            // });
          },
        )
        .catch(error => {
          if (__DEV__) console.log('MIDDLEWARE ERROR:', error);
          else {
            // firebaseLogEvent('>r>middleware error>k>>' + JSON.stringify(error));
          }
          next({...rest, error, type: FAILURE});
        });

      return actionPromise;
    };
  };
}
