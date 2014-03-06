/**
* Runden mit Angabe der Nachkommastellen
*/
function round(value, digits){
	return Math.round(value*Math.pow(10,digits))/Math.pow(10,digits);
}

function randomInt(start, end){


	return Math.floor((Math.random()*(Number(end)+1-Number(start)))+Number(start)); 
}


/**
 * Checkt schätzt eigentlich nur, ob das jetzt kW oder MW ist und gibt kW wieder raus
 */
function toKW(value){
	if(value > 0){
		//Größer 25 bedeutet vermutlich, dass die Einheit kW ist
		if(value > 25){
			return value;
		}
		//Ansonsten vermutlich MW
		return value * 1000;
	}
	//#mimimi
	else return 0;
}

/**
* Diese Funktion wandelt den Leistungswert aus OSM in etwas benutzbares um (in kW).
*/
function parsePowerValue(power){
	var value = 0;

	//Wenn einfache Zahl größer 0
	if(power > 0){
		return toKW(power);
	}
	//Wenn keine Zahl
	else{
		var parts = String(power).split(" ");

		if(parts.length === 2){
			if(parts[0] > 0 && String(parts[1].toLowerCase()) === "kw"){
				return parts[0];
			}
			else if(parts[0] > 0 && String(parts[1].toLowerCase()) === "mw"){
				return parts[0]*1000;
			}
			else return 0;

		}
		//Leerzeichen vergessen?
		else{
			if(String(power).slice(0,String(power).length-2) > 0){
				return toKW(String(power).slice(0,String(power).length-2));
			}
			else return 0;
		}
	}
	//Ich hätte einfach RegEx nutzen sollen -.-
}

function getPowerColor(power){
	var d = parsePowerValue(power);

	return d >= 3000	? '#800026' :
           d >= 2000 	? '#BD0026' :
           d >= 1000 	? '#E31A1C' :
           d >= 500		? '#FC4E2A' :
           d >= 300		? '#FD8D3C' :
           d >= 200   	? '#FEB24C' :
           d > 10 		? '#FED976' :
                      	  '#0000ff';
}


