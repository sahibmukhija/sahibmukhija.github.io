'use strict';

/**
 * @ngdoc function
 * @name budgetApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the budgetApp
 
angular.module('budgetApp')
  .controller('AboutCtrl', function () {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
*/

angular
  .module('aboutApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ]).directive('barsChart', function ($parse) {
     //explicitly creating a directive definition variable
     //this may look verbose but is good for clarification purposes
     //in real life you'd want to simply return the object {...}
     var directiveDefinitionObject = {
         //We restrict its use to an element
         //as usually  <bars-chart> is semantically
         //more understandable
         restrict: 'E',
         //this is important,
         //we don't want to overwrite our directive declaration
         //in the HTML mark-up
         replace: false,
         //our data source would be an array
         //passed thru chart-data attribute
         scope: {data: '=chartData'},
         link: function (scope, element, attrs) {
           
           var monthNames = ["January", "February", "March", "April", "May", "June",
                      "July", "August", "September", "October", "November", "December"];
                    var ndx = crossfilter(scope.data);
                    var parseDate = d3.time.format("%Y-%m-%d").parse;
                    scope.data.forEach(function(d) {
                            d.date = parseDate(d.date);
                            d.Spent = -d.Spent; 
                            d.Month = monthNames[d.date.getMonth()]  });

                    //Dimensions
                    var dateDim = ndx.dimension(function(d) {return d.date;});
                    var spentDim = ndx.dimension(function(d) {return d.Spent;});
                    var categoryGroupDim  = ndx.dimension(function(d) {return d.CategoryGroup;});
                    var monthDim = ndx.dimension(function(d) {return d.Month;});
                    
                    //For spentInADayChart 
                    var maxDate = dateDim.top(1)[0].date;
                    var minDate = dateDim.bottom(1)[0].date;
                    var spentInADay = dateDim.group().reduceSum(function(d) {return d.Spent;});
                    var spentInADayChart = dc.lineChart("#chart-line-spentinaday");


                    //For categoryRingChart 
                    var categoryGroupTotal = categoryGroupDim.group().reduceSum(function(d) {return +d.Spent;});
                    var categoryRingChart   = dc.pieChart("#category-ring-chart");

                    //For Transaction Table
                    var transactionTable   = dc.dataTable("#transaction-table");

                    //For monthExpenditureChart 
                    var monthExpenditureTotal = monthDim.group().reduceSum(function(d) {return +d.Spent;});
                    var monthExpenditureChart   = dc.pieChart("#month-expenditure-chart");

                    spentInADayChart
                      .width(800)
                      .height(300)
                      .dimension(dateDim)
                      .group(spentInADay, "Expenditure")
                      .renderArea(true)
                      .x(d3.time.scale().domain([minDate,maxDate]))
                      .elasticX(true) 
                      .elasticY(true) 
                      .legend(dc.legend().x(50).y(10).itemHeight(13).gap(5))
                      .yAxisLabel("Expenditure"); 

                    categoryRingChart
                        .width(200).height(200)
                        .dimension(categoryGroupDim)
                        .group(categoryGroupTotal)
                        .innerRadius(30);

                    monthExpenditureChart
                        .width(200).height(200)
                        .dimension(monthDim)
                        .group(monthExpenditureTotal)
                        .innerRadius(30); 

                    transactionTable
                        .dimension(dateDim)
                        .group(function(d) {return "Month " + (d.date.getMonth() + 1) + ":   " + monthNames[d.date.getMonth()];})
                        // dynamic columns creation using an array of closures
                        .columns([
                            function(d) { return d.date.getDate() + "/" + (d.date.getMonth() + 1) + "/" + d.date.getFullYear(); },
                            function(d) {return d.CategoryGroup;},
                            function(d) {return d.Category;},
                            function(d) {return d.Spent;}
                        ]);

                    dc.renderAll(); 

           //a little of magic: setting it's width based
           //on the data value (d) 
           //and text all with a smooth transition
         } 
      };
      return directiveDefinitionObject;
   });


angular.module('budgetApp')
  .controller('aboutCtrl', function ($scope, $http) {

    $http.get('budget.json').then(successCallback, errorCallback);
                          function successCallback(response){
                            $scope.budgetData = response.data;
    //success code
}
function errorCallback(error){
    //error code
}

    
});

    //$scope.myData = [10,20,30,40,60, 90, 20, 50];
   // $scope.myData = d3.tsv("budget.tsv", function(budget){ return;});
  