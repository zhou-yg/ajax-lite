;
(function (root, factory) {
  'use strict';
  /* istanbul ignore next */
  if (typeof define === 'function' && define.amd) {
    define('Ajax', factory);
  }
  else if (typeof exports === 'object') {
    exports = module.exports = factory();
  }
  else {
    root.Ajax = factory();
  }
})(this, function () {
  'use strict';

  function XHRConnection(type, url, data) {

    var xhr = new XMLHttpRequest();

    xhr.open(type, url || '', true);

    if (!(data instanceof FormData)) {
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    }

    return new Promise(function(resolve,reject){

      xhr.addEventListener('readystatechange', function(){

        var DONE = 4;
        if (xhr.readyState === DONE) {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(parseResponse(xhr))
          }else{
            var e =new Error('network');
            e.status = xhr.status;
            reject(e);
          }
        }

      }, false);
      xhr.send(objectToQueryString(data));
    });
  };
  function parseResponse(xhr) {
    var result;
    try {
      result = JSON.parse(xhr.responseText);
    }
    catch (e) {
      result = xhr.responseText;
    }
    return result
  };

  function objectToQueryString(data) {
    return (data instanceof FormData) ? data :
      isObject(data) ? getQueryString(data) : data;
  };

  function getQueryString(object) {
    return Object.keys(object).filter(function (key) {
      return object[key] !== undefined && object[key] !== null;
    }).map(function (item) {
      var value = object[item];
      if (typeof value === 'object') {
        value = JSON.stringify(value);
      }

      return encodeURIComponent(item)
        + '=' + encodeURIComponent(value);
    }).join('&');
  };

  function isObject(data) {
    return '[object Object]' === Object.prototype.toString.call(data);
  };

  function Ajax(url) {
    var pub = {};

    pub.get = function get(data) {

      return XHRConnection('GET', url + '?' + objectToQueryString(data));
    };

    pub.post = function post(data) {
      return XHRConnection('POST', url, data);
    };

    pub.put = function put(data) {
      return XHRConnection('PUT', url, data);
    };

    pub.delete = function del(data) {
      return XHRConnection('DELETE', url, data);
    };

    return pub;
  }

  window.ajax = Ajax;

  return Ajax;
});