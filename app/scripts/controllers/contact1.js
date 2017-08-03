d3.tsv("data2.tsv", function(budget) { var monthNames = ["January", "February", "March", "April", "May", "June",
										  "July", "August", "September", "October", "November", "December"];
										var ndx = crossfilter(budget);
										var parseDate = d3.time.format("%Y-%m-%d").parse;
										budget.forEach(function(d) {
														d.date = parseDate(d.date);
														//d.Spent = -d.Spent; 
														d.Month = monthNames[d.date.getMonth()]
														d.Year  = d.date.getFullYear()   });

										var dateFormat = d3.time.format('%m/%d/%Y');
    									var numberFormat = d3.format('.2f');

										//Dimensions
										var dateDim = ndx.dimension(function(d) {return d.date;});
										var spentDim = ndx.dimension(function(d) {return d.Spent;});
										var categoryGroupDim  = ndx.dimension(function(d) {return d.CategoryGroup;});
										var borrowLendDim = ndx.dimension(function(d) {if (d.CategoryGroup == 'Borrow/Lend')
																							return d.CategoryGroup;});
										var borrowLendGroup = borrowLendDim.group();
										var monthDim = ndx.dimension(function(d) {return d.Month;});
										var yearDim = ndx.dimension(function(d) {return d.Year;});
										var budgetedDim = ndx.dimension(function(d) {return d.Budgeted;});
										var categoryDim  = ndx.dimension(function(d) {return d.Category;});
										var totalDim  = ndx.dimension(function(d) {return d.Total;});
										var availableDim  = ndx.dimension(function(d) {return d.Available;});
										
										//For spentInADayChart 
										var maxDate = dateDim.top(1)[0].date;
										var minDate = dateDim.bottom(1)[0].date;
										var spentInADay = dateDim.group().reduceSum(function(d) {return d.Spent;});
										var availableGroup = availableDim.group().reduceSum(function(d) {return d.Available;});
										var spentInADayScaled = dateDim.group().reduceSum(function(d) {return d.Spent=0;});
										//var spentInADayForTable = dateDim.group().reduceSum(function(d) {return d.Spent;});
										//var spentInADayChart = dc.lineChart("#chart-line-spentinaday");
										var budgeted = dateDim.group().reduceSum(function(d) {return d.Budgeted;});
										var total = dateDim.group().reduceSum(function(d) {return d.Total;});
										//var total = dateDim.group().reduce(reduceAdd);

									/*	
										function reduceAdd(p, v) {
  ++p.count;
  p.tot += v.Spent;
  p.average = p.total / p.count
  return p;
}
*/

										//For categoryRingChart	
										var categoryGroupTotal = categoryGroupDim.group().reduceSum(function(d) {return +d.Spent;});
										var categoryRingChart   = dc.rowChart("#category-ring-chart");

										//For borrowLendChart	
										var borrowLendGroup = borrowLendDim.group().reduceSum(function(d) {return d.Spent;});
										var borrowLendChart   = dc.rowChart("#borrow-lend-chart");

										//For Transaction Table
										var transactionTable   = dc.dataTable("#transaction-table");
										
										//monthly savings
										var monthSavings = monthDim.group().reduceSum(function(d) {return +d.Saved;});
										var sortByCnt = budget.sort(function (a, b) { return a.Saved < b.Saved; });
                                        var names = sortByCnt.map(function (d) { return d.Month; });
										var monthSavingsChart   = dc.barChart("#month-savings-chart");

										//For monthExpenditureChart	
										var monthExpenditureTotal = monthDim.group().reduceSum(function(d) {return +d.Spent;});
										var monthExpenditureChart   = dc.rowChart("#month-expenditure-chart");

										//For yearExpenditureChart	
										var yearExpenditureTotal = yearDim.group().reduceSum(function(d) {return +d.Spent;});
										var yearExpenditureChart   = dc.rowChart("#year-expenditure-chart");

										//For selection chart
										var selectionChart = dc.barChart("#selection-chart");


										//For composite chart
										var compositeChart = dc.compositeChart('#composite-chart');
										//var compositeChart = dc.lineChart('#composite-chart');


										/*compositeChart
											.width(1200)
											.height(300)
											.transitionDuration(1000)
											//.mouseZoomable(true)
											//.rangeChart(selectionChart)
											.dimension(dateDim)
											.group(total, "Expenditure")
											//.renderArea(true)
											.x(d3.time.scale().domain([minDate, maxDate]))
											.margins({top: 30, right: 50, bottom: 25, left: 40})
											.elasticY(true) 
											.round(d3.time.month.round)
        									//.xUnits(d3.time.months)
											.legend(dc.legend().x(50).y(10).itemHeight(13).gap(5))
											.yAxisLabel("Expenditure (Euros)")
											//.brushOn(false)
											.renderHorizontalGridLines(true)
											//.colors(['#ffaa00']).renderArea(true).useRightYAxis(true).ordinalColors(["black"]).renderDataPoints({radius: 2, fillOpacity: 0.8, strokeOpacity: 0.8}).xyTipsOn(true)
											.renderTitle(true)
											.title(function (d) {
												return numberFormat(d.Total) + " Euros";});
												
											//.stack(budgeted, "Budgeted"); */
										

										compositeChart
									      .width(680)
									      .height(350)
									      .transitionDuration(0)
									      .rangeChart(selectionChart)
									      .dimension(dateDim)
									      //.group(spentInADay)
									      .margins({top: 30, right: 50, bottom: 25, left: 40})
									      //.renderArea(true)
									      .brushOn(false)
									      .elasticY(true)
									      //.mouseZoomable(true)
									      //.renderLabel(true)
									      .renderHorizontalGridLines(true)
									      .x(d3.time.scale().domain([minDate, maxDate]))
									      .rightYAxisLabel("Euros")
									      .yAxisLabel("Euros")
									      //.useRightYAxis(true)
										  .shareTitle(false)
										  //.elasticX(true)
										  //.elasticY(true)
										  .valueAccessor(function (d){return d.value.total;})
									      //.legend(dc.legend().x(40).y(0).itemHeight(16).gap(4))
									     /* .title(function (d) {
									      	var value = parseInt(d.Spent);
									      	/*if (isNaN(value)) {
													            value = 0;
													            }*/
            										//return d.Spent + '\n' + "Eurosdddd".join('\n'); })
													
													/*.title(function (p) {
                                                                return [
                                                               // p.key,
                'Index Gairrrn: ' + numberFormat(p.Total)
                //'Index Gain in Percentage: ' + numberFormat(p.value.percentageGain) + '%',
              //  'Fluctuation / Index Ratio: ' + numberFormat(p.value.fluctuationPercentage) + '%'
            ].join('\n');
        })*/
									      .compose([
									      	dc.lineChart(compositeChart).group(budgeted, 'Budget').colors(['#bb00cf']).renderArea(true).ordinalColors(["red"]).renderDataPoints({radius: 0.1, fillOpacity: 0.1, strokeOpacity: 0.1}).dashStyle([5,5]),
									        dc.lineChart(compositeChart).group(total, 'Cumulative').colors(['#ffaa00']).renderArea(true).elasticY(true).ordinalColors(["green"]).renderDataPoints({radius: 2, fillOpacity: 0.8, strokeOpacity: 0.8}).xyTipsOn(true)
											//.valueAccessor(function (d){return d.value.total;})
											.title(function (d) {
												var value = d.value;
											return /*dateFormat(d.key) +*/ '\n' + 'Spent '+ numberFormat(value);})
																			        //.renderArea(true)
									        //dc.lineChart(compositeChart).group(cashTotalsGroup, 'cash').colors(['#00aaff'])
											/*.renderlet(function(chart) {
    chart.selectAll("circle-dots")
    .append("text")
    .attr("text", function(d) { return d.value ;}) })*/
									      ]);
										  
										  
										  
										  

										categoryRingChart
										    .width(550).height(300)
										    .dimension(categoryGroupDim)
										    .group(categoryGroupTotal)
										    .elasticX(true)
											//.labelOffsetX(-28)
											.titleLabelOffsetX(20)
											.ordinalColors(['#FF0000','#FF2000','#FF3800','#FF4F00','#FF6A00','#FF8800','#682049'])
										    .xAxis();

											
											
											
											
											monthSavingsChart
											.width(550).height(300)
										    .dimension(monthDim)
										    .group(monthSavings)
										    .ordering(function(d) { return d.Saved; })
											.x(d3.scale.ordinal().domain(names))
										    //.centerBar(true)
										    .gap(0.5)
										    .barPadding(0.1)
          									.outerPadding(0.05)
										    .x(d3.scale.ordinal())
										    .xUnits(dc.units.ordinal)
										    .round(dc.round.floor)
										    .elasticY(true)
										    .brushOn(false)
										    .yAxisLabel("Savings")
											.ordinalColors(['#FFFFFF','#FF2000','#FF3800','#FF4F00','#FF6A00','#FF8800','#682049'])
										    //.x(d3.time.scale().domain([minDate, maxDate]))
										    .xAxis();
											
											
											
											
											
										borrowLendChart
										    .width(400).height(300)
										    .dimension(borrowLendDim)
										    .group(borrowLendGroup)
										    .elasticX(true);

										monthExpenditureChart
										    .width(550).height(220)
										    .dimension(monthDim)
										    .group(monthExpenditureTotal)
										    .elasticX(true)
											.ordinalColors(['#FF0000','#FF2000','#FF3800','#FF4F00','#FF6A00','#FF8800','#682049'])
											//.ordinalColors(['#204968','#204968','#204968','#204968','#204968','#204968','#204968'])
											/*.ordering(function(d) {
                                             if(d.key == "October") return d.value;
                                               else if(d.key == "November") return d.value;
										       else if(d.key == "December") return d.value;
											   else if(d.key == "January") return d.value;
											   else if(d.key == "February") return d.value;
											   else(d.key == "March") return d.value;
    
                                                        })
											*/
											.ordering(function(d) { return -d.value; })
										    .xAxis(); 



										yearExpenditureChart
										    .width(550).height(220)
										    .dimension(yearDim)
										    .group(yearExpenditureTotal)
										    .elasticX(true)
											.ordinalColors(['#FF2100','#FF7100'])
										    .xAxis(); 

										transactionTable
										    .dimension(dateDim)
										    .group(function(d) {return "Month " + (d.date.getMonth() + 1) + ":   " + monthNames[d.date.getMonth()];})
										    .showGroups(true)
										    //.group(spentInADayForTable)
										    //.rangeChart(spentInADayChart)
										    // dynamic columns creation using an array of closures
										    .columns([
										        function(d) { return d.date.getDate() + "/" + (d.date.getMonth() + 1) + "/" + d.date.getFullYear(); },
										        function(d) {return d.CategoryGroup;},
										        function(d) {return d.Category;},
										        function(d) {return d.Spent;}
										    ])
										    .on('renderlet', function (table) {
										            table.selectAll('.dc-table-group').classed('info', true)})
										    //.order(d3.ascending)
										    .sortBy(function (d) {
										            return d.date;
										        });
										        


										selectionChart.width(700) 
									        .height(40)
									        .margins({top: 0, right: 50, bottom: 20, left: 40})
									        //.elasticX(true)
									        //.elasticY(true)
									        .dimension(dateDim)
									        .group(availableGroup)
									        .centerBar(true)
									        .gap(1)
									        .x(d3.time.scale().domain([minDate, maxDate]))
									        .round(d3.time.month.round)
									        //.brushOn(false)
									        //.alwaysUseRounding(true)
									        .xUnits(d3.time.months);
									

										dc.renderAll(); 
										
										
										
										 function AddXAxis(chartToUpdate, displayText) {
            chartToUpdate.svg()
                .append("text")
                .attr("class", "x-axis-label")
                .attr("text-anchor", "middle")
                .attr("x", chartToUpdate.width() / 2)
                .attr("y", chartToUpdate.height())
				//.attr("transform", "translate("+ (padding/2) +","+(height/2)+")rotate(-90)")
                .text(displayText);
        }
		
		
                 AddXAxis(yearExpenditureChart, "Euros");
				  AddXAxis(monthExpenditureChart, "Euros");
				   AddXAxis(categoryRingChart, "Euros");
				 
				/* function AddXAxiss(chartToUpdatee) {
				 chartToUpdatee.svg()
				 .axis()
                  .scale(yScale)
                 .orient('bottom')
                  .ticks(5);
				  }
				 AddXAxiss(yearExpenditureChart);*/

									}
	);//.attr("x",200);


