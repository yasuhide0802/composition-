var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var invariant = require('invariant');

function createPRSwitchCase(key) {
  var switchCases = "";
  switchCases += "case '"+key+"': res = methods['"+key+"'].call(store, payload); break;";
  return switchCases;
}

function createPayloadReceiver(store, callback) {
  if (typeof callback === 'function') {
    return callback;
  }

  var i, fnStr, fn;

  fnStr = "return function(payload){ var res;";
  fnStr += "switch(payload.actionType){";

  for (i in callback) {
    if (callback.hasOwnProperty(i)) {
      fnStr += createPRSwitchCase(i);
    }
  }

  fnStr += "} return res; }";

  fn = new Function("store,methods", fnStr);
  
  return fn(store, callback);
}

/**
 * Store class
 */
class Store {

  /**
   * Constructs a Store object, extends it with EventEmitter and supplied
   * methods parameter,  and creates a mixin property for use in components.
   *
   * @param {object} methods - Public methods for Store instance
   * @param {function} callback - Callback method for Dispatcher dispatches
   * @constructor
   */
  constructor(methods, callback) {
    var self = this;
    this.callback = createPayloadReceiver(this,callback);
    invariant(!methods.callback, '"callback" is a reserved name and cannot be used as a method name.');
    invariant(!methods.mixin,'"mixin" is a reserved name and cannot be used as a method name.');
    assign(this, new EventEmitter(), methods);
    this.mixin = {
      componentDidMount: function() {
        var warn = (console.warn || console.log).bind(console);
        if(!this.storeDidChange){
            warn("A component that uses a McFly Store mixin is not implementing\
                  storeDidChange. onChange will be called instead, but this will\
                  no longer be supported from version 1.0.");
        }

        self.addChangeListener(this.storeDidChange || this.onChange);
      },
      componentWillUnmount: function() {
        self.removeChangeListener(this.storeDidChange || this.onChange);
      }
    };
  }

  /**
   * Returns dispatch token
   */
  getDispatchToken() {
    return this.dispatcherID;
  }

  /**
   * Emits change event
   */
  emitChange() {
    this.emit('change');
  }

  /**
   * Adds a change listener
   *
   * @param {function} callback - Callback method for change event
   */
  addChangeListener(callback) {
    this.on('change', callback);
  }

  /**
   * Removes a change listener
   *
   * @param {function} callback - Callback method for change event
   */
  removeChangeListener(callback) {
    this.removeListener('change', callback);
  }

}

module.exports = Store;