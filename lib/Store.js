'use strict';

var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var iv = require('invariant');

/**
 * Store class
 */


  /**
   * Constructs a Store object, extends it with EventEmitter and supplied
   * methods parameter,  and creates a mixin property for use in components.
   *
   * @param {object} methods - Public methods for Store instance
   * @param {function} callback - Callback method for Dispatcher dispatches
   * @constructor
   */
  function Store(methods, callback) {
    var self = this;
    this.callback = callback;
    iv(!methods.callback, '"callback" is a reserved name and cannot be used as a method name.');
    iv(!methods.mixin,'"mixin" is a reserved name and cannot be used as a method name.');
    assign(this, EventEmitter.prototype, methods);
    this.mixin = {
      componentDidMount: function() {
        var warn = (console.warn || console.log).bind(console);
        if(!this.storeDidChange){
            warn("A change handler is missing from a component with a Biff mixin. Notifications from Stores are not being handled.");
        }
        this.listener = function(){ this.isMounted() && this.storeDidChange(); }.bind(this)
        this.errorListener = function(){ this.isMounted() && this.storeError && this.storeError(); }.bind(this)
        self.addChangeListener(this.listener);
        self.addErrorListener(this.errorListener);
      },
      componentWillUnmount: function() {
        this.listener && self.removeChangeListener(this.listener);
        this.errorListener && self.removeErrorListener(this.errorListener);
      }
    }
  }

  /**
   * Returns dispatch token
   */
  Store.prototype.getDispatchToken=function() {
    return this.dispatcherID;
  };

  /**
   * Emits change event
   */
  Store.prototype.emitChange=function() {
    this.emit('change');
  };

  /**
   * Emits an error event
   */

   Store.prototype.emitError=function() {
    this.emit('error',arguments);
   };

  /**
   * Adds a change listener
   *
   * @param {function} callback - Callback method for change event
   */
  Store.prototype.addChangeListener=function(callback) {
    this.on('change', callback);
  };

  /**
   * Removes a change listener
   *
   * @param {function} callback - Callback method for change event
   */
  Store.prototype.removeChangeListener=function(callback) {
    this.removeListener('change', callback);
  };

  /**
   * Adds an error listener
   *
   * @param {function} callback - Callback method for error event
   */
  Store.prototype.addErrorListener=function(callback) {
    this.on('error', callback);
  };

  /**
   * Removes an error listener
   *
   * @param {function} callback - Callback method for error event
   */
  Store.prototype.removeErrorListener=function(callback) {
    this.removeListener('error', callback);
  };



module.exports = Store;
