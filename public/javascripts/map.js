var map = L.map('map');

L.tileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png', {
	maxZoom: 18,
	attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery Â© <a href="http://cloudmade.com">CloudMade</a>'
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
}

$.getJSON("javascripts/wea.geojson",function(wea){
	var markers = new L.MarkerClusterGroup({
		maxClusterRadius: 30,
		iconCreateFunction: function (cluster) {
			var markers = cluster.getAllChildMarkers();
			var n = 0;
			for (var i = 0; i < markers.length; i++) {

				n += Number(parsePowerValue(markers[i].feature.properties['generator:output:electricity']));
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
			var size = Math.sqrt(n*2)+4;

			return L.divIcon({ html: n+" MW", className: 'cluster', iconSize: L.point(size, size) });
		},
		//Disable all of the defaults:
		//spiderfyOnMaxZoom: false, showCoverageOnHover: false, zoomToBoundsOnClick: false
	});
	
	
	var wealayer = L.geoJson(wea, {

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

