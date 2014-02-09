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
		var parts = power.split(" ");

		if(parts.length === 2){
			if(parts[0] > 0 && toLowerCase(parts[1]) === "kw"){
				return parts[0];
			}
			else if(parts[0] > 0 && toLowerCase(parts[1]) === "mw"){
				return parts[0]*1000;
			}
			else return 0;

		}
		//Leerzeichen vergessen?
		else{
			if(power.slice(0,power.length-2) > 0){
				return toKW(power.slice(0,power.length-2));
			}
			else return 0;
		}
	}
	//Ich hätte einfach RegEx nutzen sollen -.-
}


function meter2px(value){
	// Ist doch von der Zoomstufe abhängig...
}