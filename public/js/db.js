(function ($, AdminLTE) {
  "use strict";
  $("#link_map").click(function() {
    $(".content-header").css("display", "none");
    $(".content").css("min-height","1700px")
    .css("background-color", "#222234");

    loadMap(d3.select(".content"));
  });

  $(".sidebar-menu>li>a").click(function() {
    var elem  = $(this);
    
  });

})(jQuery, $.AdminLTE);
