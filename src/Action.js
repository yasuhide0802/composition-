var Dispatcher = require('./Dispatcher');
var Promise = require('es6-promise').Promise;

var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;

function callbackToPromise(func) {
  var fnStr = func.toString().replace(STRIP_COMMENTS, '');
  var args = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')'));
  
  if ((/^\s*?\$done/i).test(args)) {
    return function () {
      var _self = this, _args = Array.prototype.slice.call(arguments);
      return new Promise(function(resolve, reject){
        var done = function $done(err, result) {
          if (err) return reject(err);
          return resolve(result);
        };

        _args.unshift(done);
        func.apply(_self, _args);
      });
    };
  }

  return func;
}

function reThrow(reject, error) {
  setTimeout(function(){ throw error; }, 0);
  return reject();
}

function dispatchPayload(payload) {
  console.log('dispatched!', payload)
  return new Promise(function(resolve, reject){
    if (!payload) return reject();
    if (!payload.actionType) return reThrow(reject,
      "Payload object requires an actionType property"
    );
    Dispatcher.dispatch(payload);
    resolve();
  });
}

/**
 * Action class
 */
class Action {

  /**
   * Constructs an Action object
   *
   * @param {function} callback - Callback method for Action
   * @constructor
   */
  constructor(callback) {
    this.callback = callbackToPromise(callback);
  }

  /**
   * Calls callback method from Dispatcher
   *
   * @param {...*} arguments - arguments for callback method
   * @returns Promise object
   */
  dispatch() {
    return Promise.resolve(this.callback.apply(this, arguments))
      .then(dispatchPayload);
  }
}

module.exports = Action;
