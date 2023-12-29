import superagent from 'superagent';

const hosts = {
  aryan: 'https://aryan.magicpin.in',
  hop: 'https://hop.magicpin.in',
  ultrontest: 'https://ultrontest.magicpin.com',
  ultron: 'https://ultron.magicpin.com',
  searchtest: 'http://34.93.176.223',
  webapi: 'https://webapi.magicpin.in',
  uig: 'http://uig.api.magicpin.in',
  uigWithPort: 'http://uig.api.magicpin.in:8081',
  locality: 'https://locality.magicpin.in',
  delivery: 'https://delivery.magicpin.com',
  helpDeskV6: 'http://sales.magicpin.in',
  default: '',
};

const methods = ['get', 'post', 'put', 'patch', 'del'];

function formatUrl(host, path) {
  if (path.substring(0, 4) === 'http' || host === 'default') return path;
  const adjustedPath = path[0] !== '/' ? '/' + path : path;
  return hosts[host] + adjustedPath;
}

export default class ApiClient {
  constructor(req) {
    this._pendingRequests = {};

    Object.keys(hosts).forEach(host => {
      this[host] = {};
      methods.forEach(
        method =>
          (this[host][method] = (
            path,
            {
              params,
              data,
              json,
              form,
              urlencodeddata,
              headers,
              cancelPrevious,
              retryCount = 0,
              timeout = 15000,
            } = {},
          ) =>
            new Promise((resolve, reject) => {
              var request;
              headers = headers || {};
              let x = headers;
              headers = {
                ...headers,
                'version-code': 0,
                'version-name': 0,
                'Accept-Encoding': 'gzip',
                'user-country': 'IN',
                lat: 0,
                lon: 0,
              };
              if (__DEV__) {
                console.log(
                  'jsk..jsr.url.',
                  formatUrl(host, path),
                  params,
                  JSON.stringify(data),
                  urlencodeddata,
                  headers,
                  json,
                );
              }

              try {
                var request = superagent[method](formatUrl(host, path)).buffer(
                  true,
                );
              } catch (err) {
                var request = superagent[method](formatUrl(host, path));
              }
              if (headers) {
                request.set(headers);
              }
              request.timeout(timeout);

              if (params) {
                request.query(params);
              }
              if (data) {
                request.send(data);
              } else if (urlencodeddata) {
                request.type('form').send(urlencodeddata);
              } else if (json) {
                request.send(json).set('Content-Type', 'application/json');
              } else if (form) {
                Object.keys(form).forEach(key => {
                  if (typeof form[key] === 'object') {
                    if (form[key].type === 'file') {
                      // console.log("attaching the file: ", form[key]["value"]);
                      request.attach(key, form[key].value);
                    } else {
                      request.field(key, form[key].value);
                    }
                  } else {
                    request.field(key, form[key]);
                  }
                });
              }
              var url = formatUrl(host, path);
              this._pendingRequests[url] = this._pendingRequests[url] || [];
              if (cancelPrevious) {
                for (var i = 0; i < this._pendingRequests[url].length; i++) {
                  if (this._pendingRequests[url][i]) {
                    this._pendingRequests[url][i]._callback = () => {};
                    this._pendingRequests[url][i].abort();
                    this._pendingRequests[url][i] = null;
                  }
                }
              }
              const start_time = Date.now();

              let noOfRetries = 0;

              this._pendingRequests[url].push(
                request.end((err, res) => {
                  let status = '';
                  // eslint-disable-next-line eqeqeq
                  if (err || res == undefined) {
                    if (noOfRetries < retryCount) {
                      resolve(
                        this[host][method](path, {
                          params,
                          data,
                          json,
                          form,
                          urlencodeddata,
                          headers,
                          cancelPrevious,
                          retryCount: retryCount - 1,
                        }),
                      );
                    } else {
                      if (err) {
                        reject({error: err, response: res});
                        status = err.status;
                      } else {
                        reject(
                          '{"type": "connection_error", "error": "Please check your internet connection"}',
                        );
                      }
                    }
                  } else {
                    resolve(res.text);
                    status = res.status;
                  }
                  if (!!err && !!status) {
                    console.log('>>apiCallError', err.message);
                  }
                }),
              );
            })),
      );
    });
  }
  /*
   * There's a V8 bug where, when using Babel, exporting classes with only
   * constructors sometimes fails. Until it's patched, this is a solution to
   * "ApiClient is not defined" from issue #14.
   * https://github.com/erikras/react-redux-universal-hot-example/issues/14
   *
   * Relevant Babel bug (but they claim it's V8): https://phabricator.babeljs.io/T2455
   *
   * Remove it at your own risk.
   */
  empty() {}
}
