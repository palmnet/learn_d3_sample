
function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}
function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}
function drawJson() {
//	日本地図
var topoJsonUrl = "/json/japan.topo.json";

//	変数設定
var width = 500,
    height = 500,
    scale = 1200;

// Color 
var color = d3.scale.category20c();

// bodyにSVGをつくり、g(地図グループ）を作る
var svg = d3.select("body").append("svg")
	.attr("width", width)
	.attr("height", height)

svg.append("g").attr("id", "all-g");

//投影法の設定
var projection = d3.geo.mercator()
		.center([138, 38])
		.scale(scale)
		.translate([width / 2, height / 2]);
    
// 地図読み込み
d3.json(topoJsonUrl, function(error, uk) {
  if (error) return console.error(error);
  console.log(uk);
  onLoadMap(uk);
});

//d3.json(topoJsonUrl, onLoadMap);

// データ設定
var mydata =[
[135.25508,34.336263],
[140.039359,35.652929],
[140.103417,39.706976],
[139.69194,35.659432]
];

var pointdata = [
	{"type": "LineString", "coordinates": [
		[135.25508,34.336263],
		[140.039359,35.652929]
		]
  	},
	{"type": "LineString", "coordinates": [
		[140.103417,39.706976],
		[139.69194,35.659432]
		]

  	}
];
	particle = new Image();
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
    }
    
    


//==============================//
//	地図と点を描く		//
//==============================//
function onLoadMap (jp) {

	//地図を描く
	var path = d3.geo.path().projection(projection);
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

    //ズームイベント設定    
    var zoom = d3.behavior.zoom().on('zoom', function(){
       projection.scale(scale * d3.event.scale);       
       map.attr('d', path)       
       changeSize(10, 10);
    });
    svg.call(zoom);
 
    //ドラッグイベント設定
    drag = d3.behavior.drag().on('drag', function(){
       var tl = projection.translate();
       projection.translate([tl[0] + d3.event.dx, tl[1] + d3.event.dy]);
       map.attr('d', path);
       changeSize(10, 10);
    });
    svg.call(drag);

	//	点を描く
/*
	d3.select("#all-g")
		.append("g").attr("id","circle-g").selectAll("circle")
		.data(mydata)
		.enter()
		.append("circle");

	//	赤く塗る
	d3.selectAll("#circle-g circle")
		.attr("fill", function(d, i) { return color(i); } )
		.attr("opacity", 0.5)
		.attr("transform", function(d) { 
			var coord = projection([d[0], d[1]]);
			return "translate(" + coord.join(",") + ")"; 
		})
		.attr("r", 5/scale);
*/

	// 画像
	d3.select("#all-g")
		.append("g").attr("id","image-g").selectAll("image")
		.data(mydata)
		.enter()
		.append("image");

    var src = particle.src;
	d3.selectAll("#image-g image")
        .attr('xlink:href', function(d, i) { return colorize(particle, color(i), 1)} )
        .attr('width', 100)
        .attr('height', 100)
		.attr("transform", function(d) { 
			var coord = projection([d[0], d[1]]);
            coord = [coord[0]-50, coord[1]-50];
			return "translate(" + coord.join(",") + ")"; 
		})

    changeSize(10, 10);

    function changeSize(width, height) {
        var duration = 1000;
        d3.selectAll("#image-g image")
        .transition()
        .delay(2000)
        .duration(duration)
        .attr('width', width)
        .attr('height', height)
		.attr("transform", function(d) { 
			var coord = projection([d[0], d[1]]);
            coord = [coord[0]-(width/2), coord[1]-(height/2)];
			return "translate(" + coord.join(",") + ")"; 
		})
        .each('end', function(d, i) {
            var nextWidth = (width == 100)? 10 : 100; 
            var nextHeight= (height== 100)? 10 : 100; 
            changeSize(nextWidth, nextHeight);
        });
    }




	//都市間を線で結ぶ
    /*
	var line = svg.selectAll(".line")
			.data(pointdata)
			.enter()
			.append("path")
			.attr({
				"class":"line",
				"d": path,
				"fill": "none",
				"stroke": function(d, i) { return color(i); } ,
				"stroke-width": 0.5
	});
    */
 }
}


