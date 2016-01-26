

var d3_category_alarm = [ "#3182bd", "#6baed6", "#9ecae1","#c6dbef", "#a1d99b", "#dadaeb"];


var category_alarm = function() {
  //return d3.scale.ordinal().range(d3_category_alarm);
  return d3.scale.ordinal().domain([""])
}

function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}
function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}

// DrawMap module start
// TODO: あとでモジュール化する
var DrawMap = function(options) {
  this.options = options;
  this.color = d3.scale.category20c();
  //this.color = category_alarm();
  this.queue = [];
};


DrawMap.prototype.changePos = function() {
  var current = this;
  this.all_g.selectAll("image")
  .call(function(d) {
    d.attr("transform", function(data) { 
      var w = d.attr("width");
      var h = d.attr("height");
      var coord = current.projection([data[0], data[1]]);
      coord = [coord[0]-(w/2), coord[1]-(h/2)];
      return "translate(" + coord.join(",") + ")"; 
    });
  });
}

DrawMap.prototype.changeSize = function(width, height) {
  var duration = 0;
  var current = this;
  current.all_g.selectAll("image")
  .call(function(elem) {
    if(elem !== null) {
      var w = elem.attr("width");
      var h = elem.attr("height");
      elem.transition()
      .delay(0)
      .duration(duration)
      /*
      .attr('width', width)
      .attr('height', height)
      .attr("transform", function(d) { 
        var coord = current.projection([d.lng, d.lat]);
        coord = [coord[0]-(width/2), coord[1]-(height/2)];
        return "translate(" + coord.join(",") + ")"; 
      })
      */
      .each('end', function(d, i) {
        d.removed = true;
      });
    }
  });
};

DrawMap.prototype.drawJapan = function(target, callback) {
  //  日本地図
  var topoJsonUrl = "/json/japan.topo.json";
  var width = (this.options.width) ? this.options.width  : 200; 
  var height= (this.options.height)? this.options.height : 200; 
  var scale = (this.options.scale)? this.options.scale   : 800; 

  // SVG
  this.svg = target.append("svg")
    .attr("width", width)
    .attr("height", height);
  
  this.all_g = this.svg.append("g")
    .attr("id", "all-g")
  //投影法の設定
  this.projection = d3.geo.mercator()
      .center([138, 38])
      .scale(scale)
      .translate([width / 2, height / 2]);


  var current = this;
  // 地図読み込み
  d3.json(topoJsonUrl, function(error, jp) {
    var path = d3.geo.path().projection(current.projection);
    var features = topojson.feature(jp, jp.objects.ne_10m_admin_1_states_provinces);
    var map = d3.select("#all-g")
            .append("g").attr("id", "path-g").selectAll("path")
                .data(features.features)
                .enter()
                .append("path")
                .attr("fill", "#2C2C43")
                .attr("stroke", "#4A4A70")
                .attr("stroke-width", 0.5)
                .attr("d", path);

    current.image_g = d3.selectAll("#all-g")
      .append("g")
      .attr("id","image-g");

    callback();

  });
}; //drawJapan function 

DrawMap.prototype.addPoint = function(data, callback) {
  var particle = new Image();
  particle.src = "data:image/png;base64,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";

  var tempFileCanvas;
  function colorize(img, color, a) {
      var r = hexToR(color);
      var g = hexToG(color);
      var b = hexToB(color);

      if (!img)
          return img;

      if (!tempFileCanvas)
          tempFileCanvas = document.createElement("canvas");

      if (tempFileCanvas.width != img.width)
          tempFileCanvas.width = img.width;

      if (tempFileCanvas.height != img.height)
          tempFileCanvas.height = img.height;

      var imgCtx = tempFileCanvas.getContext("2d"),
              imgData, i;
      imgCtx.drawImage(img, 0, 0);

      imgData = imgCtx.getImageData(0, 0, img.width, img.height);

      i = imgData.data.length;
      while((i -= 4) > -1) {
          imgData.data[i + 3] = imgData.data[i] * a;
          if (imgData.data[i + 3]) {
              imgData.data[i] = r;
              imgData.data[i + 1] = g;
              imgData.data[i + 2] = b;
          }
      }

      imgCtx.putImageData(imgData, 0, 0);
      return tempFileCanvas.toDataURL("image/png");
  };

  var current = this;
  var imageSize = function(d) {
    return d.removed? 20 : 100
  };
  var nextImageSize = function(d) {
    if(d.removed === undefined){
      var small = imageSize({removed: true});
      return small;
    }
    else {
      return imageSize(d);
    }
  };

  current.all_g.selectAll("image")
    .data(data)
    .enter()
    .append("image");

  current.all_g.selectAll("image")
    .attr('xlink:href', function(d, i) { 
      var c = d.lng + d.lat;
      return colorize(particle, current.color(c), 1)
    })
    .attr('width', imageSize)
    .attr('height', imageSize)
    .attr("transform", function(d) { 
      var coord = current.projection([d.lng, d.lat]);
      var minus = imageSize(d) / 2;
      coord = [coord[0] - minus, coord[1] - minus];
      return "translate(" + coord.join(",") + ")"; 
    })
    .transition()
    //.delay(function(d, i) { return i;})
    .duration(1000)
    .attr('width', nextImageSize)
    .attr('height', nextImageSize)
    .attr("transform", function(d) { 
      var width = nextImageSize(d);
      var height = nextImageSize(d);
      var coord = current.projection([d.lng, d.lat]);
      coord = [coord[0]-(width/2), coord[1]-(height/2)];
      console.log(d.pref + " " +coord + " " + d.removed);
      return "translate(" + coord.join(",") + ")"; 
    })
    .each('end', function(d, i) {
      d.removed = true;
    });


  //this.changeSize(20, 20);


}; //addPoint function 

// end drawMap


// dashboard.html main
(function ($, AdminLTE) {
  "use strict";
  var socket = io.connect();
  function init_alarm_tables(scrollY) {
    d3.json("/init_alarms", function(error, alarms){
      var removed = alarms.map(function(elem) {
        elem.blink = true; 
        elem.removed = true; 
        return elem 
      });
      refresh_alarm_tables(removed);
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

      var target = d3.select("#japanMap");
      var map = new DrawMap({width: 400, height:400});
      map.drawJapan(target, function() {
        //map.addPoint(removed);
        socket.on('send-alarm', function(alarm, fn) {
          removed.unshift(alarm);
          if(removed.length >= 30) {
            removed.pop()
          }
          refresh_alarm_tables(removed);
          map.addPoint(removed.filter(function(d) { return d.removed == undefined; }));
          //map.addPoint(removed);
        });
        socket.on('last-alarm', function(alarm, fn) {
          //map.addPoint(alarm);
        });
      });
    });
  }

  socket.on('publish', function(value, fn) {
    init_top10_all();
  });

  socket.on('total-alarms', function(value, fn) {
    d3.selectAll('#totalAlarms')
      .transition()
      .duration(100)
      .text(value);
  });

  var init_bg_color = $(".content").css("background-color");

  function _refresh_tables(table_name, data, columns) {
    var table = d3.select(table_name + '>tbody')
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

  function init_top10(name) {
    var columns = [name, "count"];
    var table_name = "#table-top10-" + name;
    var url = "top10/" + name;
    d3.json(url, function(error, data){
      _refresh_tables(table_name, data, columns);
    });
  }

  function init_top10_all() {
    init_top10("pref");
    init_top10("eqp");
  }

  function init_top10_header(name) {
    var columns = [name, "count"];
    var table_name = "#table-top10-" + name;
    var thead = d3.select(table_name + '>thead')
    thead.append('tr')    //trタグ追加
      .selectAll('th') 
      .data(columns) 
      .enter()
      .append('th')    //thタグ追加
      .text(function(key){return key}); 


  }

  //日本地図
  /*
  function init_japan_map() {
    var target = d3.select("#japanMap");
    var map = new DrawMap({width: 400, height:400});
    map.drawJapan(target, function() {
      var mydata =[
        {lng: 135.25508, lat: 34.336263},
        {lng: 140.039359,lat: 35.652929},
        {lng: 140.103417,lat: 39.706976},
        {lng: 139.69194, lat: 35.659432}
      ];

      map.addPoint(mydata);
    });
  }
  */

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

          init_top10_header("pref");
          init_top10_header("eqp");
          init_top10_all();
          init_alarm_tables("150px");
          //init_japan_map();
        }
        else if(elem.attr('id') == 'alarms') {
          init_alarm_tables();
        }
      }

      var desc = elem.attr("desc");
      $(".content-header>h1").html(toTitle(file) + "<small>" + desc + "</small>");
    });
  });
  $("#dashboard").click();
})(jQuery, $.AdminLTE);
