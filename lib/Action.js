var invariant = require('invariant');

/**
 * Action class
 */


  /**
   * Constructs an Action object
   *
   * @param {function} callback - Callback method for Action
   * @constructor
   */
  function Action(callback,dispatcher) {"use strict";
    this.callback = callback;
    this.dispatcher = dispatcher;
  }

  /**
   * Calls callback method from Dispatcher
   *
   * @param {...*} arguments - arguments for callback method
   * @constructor
   */
  Action.prototype.dispatch=function() {"use strict";
    var payload = this.callback.apply(this, arguments);
    invariant(payload.actionType, "Payload object requires an actionType property");
    this.dispatcher.dispatch(payload);
  };


module.exports = Action;