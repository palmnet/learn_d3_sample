var list = [];
var list_all = [];


function init_alarm_tables(scrollY) {
	d3.json("/init_alarms", function(error, alarms){
    refresh_alarm_tables(alarms);
    if(!scrollY) {
      scrollY = "200px";
    }

    $('#result').dataTable({
      order: [[ 0, "desc" ]],
      paging: false,
      searching: false,
      info: false,
      scrollY: scrollY,
      scrollCollapse: true
    });

    var socket = io.connect();
    socket.on('send-alarm', function(alarm, fn) {
      fn(true);
      alarms.unshift(alarm);
      if(alarms.length >= 10) {
        alarms.pop()
      }
      refresh_alarm_tables(alarms);
    });
	});
}

function refresh_alarm_tables(data) {
  var columns = ["date", "time", "pref", "build", "bay", "maker", "eqp"];

  // appending the header row
/*
  var thead = d3.select('#result>thead')
  var th = thead.selectAll("th")
          .data(columns)

  th.enter().append("th");
      th.text(function(d) { return d });
  th.exit().remove()
*/

  var table = d3.select('#result>tbody')
      .selectAll('tr')
      .data(data);
    table.enter().append('tr');
    table.exit().remove();
    var cells = table.selectAll('td')
      .data(function(row) { 
        return columns.map(function(key) {
          return {key: key, value: row[key]};
        });
      });
    cells.enter()
      .append('td')
      .text(function(d) { return d.value });
    cells.text(function(d) { return d.value });
    cells.exit().remove();
}

function init_alarms() {
  var width = 400;
  var height = 150;
  // line chart
  var n = 40,
      max_y_domain = 10,
      random = d3.random.normal(0, .2),
      data = d3.range(n).map(random);
  var margin = {top: 20, right: 20, bottom: 20, left: 40},
      width = width - margin.left - margin.right,
      height = height - margin.top - margin.bottom;
  var x = d3.scale.linear()
      .domain([0, n - 1])
      .range([0, width]);
  var y = d3.scale.linear()
      .domain([0, max_y_domain])
      .range([height, 0]);
  var line = d3.svg.line()
      .interpolate('basis')
      .x(function(d, i) {  return x(i); })
      .y(function(d, i) {  return y(d[1]); });

  var yScale = d3.scale.linear()
              .domain([0, max_y_domain])
              .range([height,0]);

  var yAxis = d3.svg.axis()
                .ticks(5) // 軸のチックの数。
                .scale(yScale)
                .orient("left")
                .tickSize(6, -width);


  var svg = d3.select("#graph").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  svg.append("defs").append("clipPath")
      .attr("id", "clip")
    .append("rect")
      .attr("width", width)
      .attr("height", height);
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + y(0) + ")")
      .call(d3.svg.axis().scale(x).orient("bottom"));
  svg.append("g")
      .attr("class", "y axis")
      .call(d3.svg.axis().scale(y).orient("left"));
  var path = svg.append("g")
      .attr("clip-path", "url(#clip)")
    .append("path")
      .datum(list_all)
      .attr("class", "line")
      .attr("d", line);

  var socket = io.connect();
  socket.on('publish', function(value, fn) {
    var row = [];
    row.push(list_all.length);
    row.push(value);
    list.push(row);
    list_all.push(row);
   
    tick();
    value = parseInt(value);

    if(value > max_y_domain) {
      //max_y_domain = max_y_domain + ((((max_y_domain - 100) % 50) + 1) * 50);
      max_y_domain = value;
      console.log("max_y_domain=" + max_y_domain);
      var yScale = d3.scale.linear()
                  .domain([0, max_y_domain])
                  .range([height,0]);

      var yAxis = d3.svg.axis()
                    .ticks(5) // 軸のチックの数。
                    .scale(yScale)
                    .orient("left")
                    .tickSize(6, -width);

      svg.selectAll("g.y.axis")
            .call(yAxis);

      var y = d3.scale.linear()
        .domain([0, max_y_domain])
        .range([height, 0]);

      line
      .x(function(d, i) { return x(i); })
      .y(function(d, i) { return y(d[1]); });
    }

    if(list_all.length > n) {
      list_all.shift();
      list.shift();
    }

    d3.selectAll('#alarm_per_sec')
      .text(value)
      .transition()
      .duration(100)

    function tick() {
      // redraw the line, and slide it to the left
      path
          .attr("d", line)
          .attr("transform", null)
        .transition()
          .duration(500)
          .ease("linear")
          .attr("transform", "translate(" + x(-1) + ",0)")

    }

/*
		var xScale = d3.scale.linear()
                .domain([0, 10])
                .range([0, width]);
                //
		// 軸を設定する。
		var xAxis = d3.svg.axis()
									.scale(xScale)
									.orient("bottom")
									.tickSize(6, -height) // 棒の長さと方向。
									.tickFormat(function(d){ return d; }); // 数字に年をつけている。

		margin = 50;
		svg.append("g")
			.attr("class", "x.axis")
      //.attr("transform", "translate(0," + (height - margin) + ")")
      .call(xAxis);
	
		var line = d3.svg.line()
			.x(function(d) { return xScale(d[0]); })
			.y(function(d) { return yScale(d[1]); })
			.interpolate("cardinal"); // 線の形を決める。

		var path = svg.append("path")
     .datum(list)
     .attr("class", "line")
     .attr("d", line); // 上で作ったlineを入れて、ラインpathを作る。

    var tick = function() {
      path
        .attr("d", line)
        .attr("transform", null)
      .transition()
        .duration(500)
        .ease("linear")
        .attr("transform", "translate(" + xScale(+1) + ",0)")
        .each("end", tick);
    };
    tick();
*/
/*
	  svg.selectAll("circle")
      .data(list_all)
      .enter()
      .append("circle")
      .attr("r", 10)
      .attr("cx", function(d){ console.log("cx:" + d); return xScale(d[0]); })
      .attr("cy", function(d){ console.log("cy:" + d); return yScale(d[1]); });

      svg.selectAll("g.x.axis") // x軸を
        .duration(750) // 750msで
        .call(xAxis); 
*/

  });

  socket.on('greeting', function(data, fn) {
    fn(true);
    var table = d3.select('#result');
    var thead = table.append('thead'); //theadタグ追加
    var tbody = table.append('tbody'); //tbodyタグ追加
  });

}
