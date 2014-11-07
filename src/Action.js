var Dispatcher = require('./Dispatcher');

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
    this.callback = callback;
  }

  /**
   * Calls callback method from Dispatcher
   *
   * @param {object} payload - Data argument for callback method
   * @constructor
   */
  dispatch(payload) {
    var result = this.callback(payload);
    if (result) {
      Dispatcher.dispatch(result);
    }
  }
}

module.exports = Action;
