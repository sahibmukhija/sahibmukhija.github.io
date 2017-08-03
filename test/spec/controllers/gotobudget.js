'use strict';

describe('Controller: GotobudgetCtrl', function () {

  // load the controller's module
  beforeEach(module('budgetApp'));

  var GotobudgetCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    GotobudgetCtrl = $controller('GotobudgetCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(GotobudgetCtrl.awesomeThings.length).toBe(3);
  });
});
