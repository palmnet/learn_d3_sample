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
      }
    });
    
  });

})(jQuery, $.AdminLTE);
