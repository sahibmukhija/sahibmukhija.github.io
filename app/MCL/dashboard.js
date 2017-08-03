d3.tsv("budget.tsv", function(budget) { var monthNames = ["January", "February", "March", "April", "May", "June",
										  "July", "August", "September", "October", "November", "December"];
										var ndx = crossfilter(budget);
										var parseDate = d3.time.format("%Y-%m-%d").parse;
										budget.forEach(function(d) {
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


									}
	);//.attr("x",200);


