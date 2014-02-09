var map = L.map('map');

L.tileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png', {
	maxZoom: 18,
	attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery Â© <a href="http://cloudmade.com">CloudMade</a>'
}).addTo(map);

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
	var markers = new L.MarkerClusterGroup();
	
	
	var wealayer = L.geoJson(wea, {

		style: function (feature) {
			return feature.properties && feature.properties.style;
		},

		onEachFeature: onEachFeature,

		pointToLayer: function (feature, latlng) {
			 var fc = feature.properties.manufacturer != null   ? 	'#ff7800' :
            					//d > 10   ? 	'#FED976' :
                       					'#FF0000';

			return L.circleMarker(latlng, {
				radius: 8,
				fillColor: fc,//"#ff7800",
				color: "#000",
				weight: 1,
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