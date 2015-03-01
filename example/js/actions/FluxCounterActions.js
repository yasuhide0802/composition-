var biff = require('../flux/biff');

var FluxCounterActions = biff.createActions({
  countOne: function() {
    return {
      actionType: 'COUNT_ONE'
    }
  }
});

module.exports = FluxCounterActions;
