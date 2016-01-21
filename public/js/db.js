(function ($, AdminLTE) {
  "use strict";
  
  var socket = io.connect();
  socket.on('publish', function(value, fn) {
    init_top10pref();
  });

  var init_bg_color = $(".content").css("background-color");

  function _refresh_tables(data, columns) {

    var table = d3.select('#table-top10pref>tbody')
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

  function init_top10pref() {
    var columns = ["pref", "count"];
    d3.json("/top10pref", function(error, data){
      var thead = d3.select('#table-top10pref>thead')
      var th = thead.selectAll("th")
              .data(columns)

      th.enter().append("th");
          th.text(function(d) { return d });
      th.exit().remove()

      _refresh_tables(data, columns);
    });
  }

  function openMap() {
    $(".content-header").hide();
    $(".content")
      .css("min-height","1700px")
      .css("background-color", "#222234");
    loadMap(d3.select(".content"));
  }

  function closeMap() {
    $(".content-header").show();
    $(".content")
      .css("min-height","0")
      .css("background-color", init_bg_color);
    $(".content>svg").hide();
  }

  function toTitle(base) {
    var first = base.substring(0, 1);
    var rest = base.substring(1, base.length);
    return first.toUpperCase() + rest;
  }

  $(".sidebar-menu>li>a").click(function() {
    var elem  = $(this);
    var text = elem.text()
    $(".sidebar-menu>li").removeClass("active");
    $(this).closest("li").addClass("active");
    var file = elem.attr("id");

    $(".content").load(file, function() {
      if(elem.attr('id') == 'map') {
        openMap();
      }
      else {
        closeMap();
        if(elem.attr('id') == 'dashboard') {
          init_alarms();
          init_top10pref();
        }
        else if(elem.attr('id') == 'alarms') {
          init_tables();
        }

      }

      var desc = elem.attr("desc");
      $(".content-header>h1").html(toTitle(file) + "<small>" + desc + "</small>");

    });
    
  });
  $("#dashboard").click();
})(jQuery, $.AdminLTE);
