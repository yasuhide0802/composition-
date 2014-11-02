var EventEmitter = require('events').EventEmitter;
var Dispatcher = require('./Dispatcher');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';
_actions = [];

/**
 * Store class
 */
class Store {

  /**
   * Constructs a Store object, extends it with EventEmitter and supplied
   * methods parameter,  and creates a mixin property for use in components.
   *
   * @param {object} methods - Public methods for Store instance
   * @constructor
   */
  constructor(methods) {
    var self = this;
    this.callback = function(payload){
      this.emitChange(payload)
    }.bind(this)
    assign(this, EventEmitter.prototype, methods);
    this.mixin = {
      componentDidMount: function() {
        self.addChangeListener(this.onChange);
      },
      componentWillUnmount: function() {
        self.removeChangeListener(this.onChange);
      }
    }
  }

  /**
   * Adds a change listener
   *
   * @param {function} callback - Callback method for change event
   */
  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  }

  /**
   * Removes a change listener
   *
   * @param {function} callback - Callback method for change event
   */
  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }

  /**
   * Register an action
   *
   * @param {string} type - Unique constant that represent the action
   * @param {function} callback - Callback method this action
   */
  addAction(type, callback){
    _actions[type] = callback;
  }

  /**
   * Callback triggered by a Dispatcher
   *
   * @param {object} payload - Data argument for callback method
   */
  emitChange(payload) {

    var callback = _actions[payload.actionType];

    if(callback){
      callback(payload);
      this.emit(CHANGE_EVENT);
      return true;
    }
    return true;
  }

}

module.exports = Store;