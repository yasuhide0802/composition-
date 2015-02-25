var biff = require('../flux/biff');

var _count = 0;

function countOne(text) {
  _count++;
}

var CounterStore = biff.createStore({

  getCount: function() {
    return _count;
  }

}, function(payload){

  switch(payload.actionType) {
    case 'COUNT_ONE':
      countOne();
    break;
    default:
      return true;
  }

  CounterStore.emitChange();

  return true;

});

module.exports = CounterStore;
