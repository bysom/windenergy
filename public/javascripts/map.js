var map = L.map('map');

// L.tileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png', {
// 	maxZoom: 18,
// 	attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery Â© <a href="http://cloudmade.com">CloudMade</a>'
// }).addTo(map);
L.tileLayer('http://a.tile.stamen.com/toner/{z}/{x}/{y}.png', {
	maxZoom: 18,
	attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://stamen.com/">Stamen Black & White map</a>'
}).addTo(map);
map.setView([53.7,8.9],10);
function onLocationFound(e) {
	var radius = e.accuracy / 2;

	L.marker(e.latlng).addTo(map)
		.bindPopup("You are within " + radius + " meters from this point").openPopup();

	L.circle(e.latlng, radius).addTo(map);
}

function onLocationError(e) {
	alert(e.message);
}

function onEachFeature(feature, layer) {
	var popupContent = "<p> ";
	$.each(feature.properties, function( index, value ) {
		popupContent += index + ": " + value+"</br>" ;
	});
	popupContent += "</p>";
	layer.bindPopup(popupContent);
	feature.properties["currentPower"] = randomInt(0,parsePowerValue(feature.properties['generator:output:electricity']));
	
}

var wealayer, markers;
$.getJSON("javascripts/wea.geojson",function(wea){
	markers = new L.MarkerClusterGroup({
		maxClusterRadius: 30,
		iconCreateFunction: function (cluster) {
			var markers = cluster.getAllChildMarkers();
			var n = 0;
			var currentPower = 0;
			for (var i = 0; i < markers.length; i++) {

				n += Number(parsePowerValue(markers[i].feature.properties['generator:output:electricity']));
				currentPower += Number(markers[i].feature.properties["currentPower"]);
			}

			// return L.circleMarker(latlng, {
			// 	radius: n/1000,
			// 	fillColor: "#ff7800",
			// 	color: "#000",
			// 	weight: 4,
			// 	opacity: 1,
			// 	fillOpacity: 0.8
			// });
			n = round(n/1000,2);
			currentPower = round(currentPower/1000,2);
			var rel = currentPower/n;
			var size1 = Math.sqrt(n*10/Math.PI)+5; //v = pi * r²
			var size2 = Math.sqrt(currentPower*10/Math.PI);
			//alert((size2*5/size1))
			size2 += (size2*5/size1);

			var style1 = "width:"+size1+"px;height:"+size1+"px;border-radius:"+(size1/2+3)+"px;box-shadow: 0px 0px 10px "+rel*10+"px #ff7d00;";
			var style2 = "width:"+size2+"px;height:"+size2+"px;border-radius:"+(size2/2)+"px;margin-top:-"+(size2/2)+"px;margin-left:-"+(size2/2)+"px;";

			return L.divIcon({ html: "<div class='outerCluster' style='"+style1+"'><div class='innerCluster' style='"+style2+"'></div></div>", className: 'cluster', iconSize: L.point(size1, size1) });
		},
		//Disable all of the defaults:
		//spiderfyOnMaxZoom: false, showCoverageOnHover: false, zoomToBoundsOnClick: false
	});
	
	
	wealayer = L.geoJson(wea, {

		style: function (feature) {
			return feature.properties && feature.properties.style;
		},

		onEachFeature: onEachFeature,

		pointToLayer: function (feature, latlng) {
			var bc = feature.properties.manufacturer != null   ? 	'#ff7800' :
            					//d > 10   ? 	'#FED976' :
                       					'#FF0000';
            var fc = getPowerColor(feature.properties['generator:output:electricity']);

            var radius = 20;
            if(feature.properties["rotor:diameter"] > 0){
            	radius = feature.properties["rotor:diameter"]/2;
            }


		// 	return L.circleMarker(latlng, {
		// 		radius: radius/2,
		// 		fillColor: fc,//"#ff7800",
		// 		color: bc,//"#000",
		// 		weight: 2,
		// 		opacity: 1,
		// 		fillOpacity: 0.8
		// 	});

			return L.circle(latlng,radius,{
				fillColor: fc,//"#ff7800",
				color: bc,//"#000",
				weight: 2,
				opacity: 1,
				fillOpacity: 0.8
			});
		}
	})//.addTo(map)
	markers.addLayer(wealayer);
	map.addLayer(markers);
});

map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);

map.locate({setView: true, maxZoom: 10});

