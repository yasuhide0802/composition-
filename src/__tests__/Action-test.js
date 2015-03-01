// __tests__/Action-test.js

jest.dontMock('../Action');
jest.dontMock('invariant');

describe('Action', function() {

  var Action = require('../Action');
  var dispatcher = {dispatch: jest.genMockFunction()};
  var mockAction;
  var callback;

  it('should attach the callback argument to the instance', function() {

    callback = function() {
      return;
    };

    mockAction = new Action(callback, dispatcher);

    expect(mockAction.callback).toBe(callback);

  });

  it('should throw if actionType isn\'t supplied', function(){

    callback = function(argument) {
      return{
        test: argument
      };
    };

    mockAction = new Action(callback,dispatcher);

    expect(function() {
      mockAction.dispatch("test");
    }).toThrow();

  });

  it('should not throw if actionType IS supplied', function(){

    callback = function(argument) {
      return{
        actionType: 'TEST_ACTION',
        test: argument
      };
    };

    mockAction = new Action(callback,dispatcher);

    expect(function() {
      mockAction.dispatch("test");
    }).not.toThrow();

  });

  it('should have dispatched the supplied payload', function(){
      expect(mockAction.dispatcher.dispatch.mock.calls.length).toEqual(1);
  });

});