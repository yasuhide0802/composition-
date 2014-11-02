var mcFly = require('../flux/mcFly');

var _count = 0;

function countOne() {
  _count++;
}

var CounterStore = mcFly.createStore({

  getCount: function() {
    return _count;
  }

});

CounterStore.addAction('COUNT_ONE', countOne);

module.exports = CounterStore;
