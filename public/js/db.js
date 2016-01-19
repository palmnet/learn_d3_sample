(function ($, AdminLTE) {
  "use strict";

  
  var init_bg_color = $(".content").css("background-color");


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
