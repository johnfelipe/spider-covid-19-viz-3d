

function getPandemicDataGlobal() {

	timeStart = performance.now();

	const api = "https://en.wikipedia.org/w/api.php?";

	const query = "action=parse&format=json&page=";

	const article = "Template:2019–20_coronavirus_pandemic_data";

	requestFileCors( api + query + article, onLoadDataGlobal );

}


function onLoadDataGlobal ( xhr ) {
	//console.log( '', xhr.target.response );

	const response =  xhr.target.response;

	const json = JSON.parse( response );
	//console.log( 'json',json );

	const text = json.parse.text[ "*" ];
	//console.log( 'text', text );

	const parser = new DOMParser();
	const html = parser.parseFromString( text, "text/html");

	const tables = html.querySelectorAll(".wikitable");
	//console.log(tables );

	const trs = tables[ 0 ].querySelectorAll("tr");
	//console.log( 'trs', trs );

	const vals = Array.from( trs ).slice( 2, -2 ).map( tr => tr.innerText.trim().replace( /\[(.*?)\]/g, "" ).split( "\n") ).sort();
	//console.log( "vals", vals );

	vals[ 43 ][ 0 ] = "China";

	dataGlobalGeo.forEach( country => {

		const find = vals.find( items => items[ 0 ] === country.country && country.region === "" );

		if ( find ) {

			country.cases = find[ 2 ].replace( /,/g, "" );
			country.deaths = find[ 4 ].replace( /,/g, "" );
			country.recoveries = find[ 6 ].replace( /,/g, "" );

		} else {

			find2 = vals.find( items => items[ 0 ] === country.region );

			if ( find2 ) {

				country.cases = find2[ 2 ].replace( /,/g, "" );
				country.deaths = find2[ 4 ].replace( /,/g, "" );
				country.recoveries = find2[ 6 ].replace( /,/g, "" );

			}

		}

	} );

	console.log( "time", performance.now() - timeStart );

	updateBars( dataGlobalGeo );

}


const dataGlobalGeo = [

	{ "country": "Afghanistan", "region": "", "latitude": "33.0", "longitude": "65.0", "continent": "Asia", "population": "38041754" },
	{ "country": "Albania", "region": "", "latitude": "41.1533", "longitude": "20.1683", "continent": "Europe", "population": "2880917" },
	{ "country": "Algeria", "region": "", "latitude": "28.0339", "longitude": "1.6596", "continent": "Africa", "population": "43053054" },
	{ "country": "Andorra", "region": "", "latitude": "42.5063", "longitude": "1.5218", "continent": "Europe", "population": "77142" },
	{ "country": "Angola", "region": "", "latitude": "-11.2027", "longitude": "17.8739", "continent": "Africa", "population": "31825295" },
	{ "country": "Antigua and Barbuda", "region": "", "latitude": "17.0608", "longitude": "-61.7964", "continent": "Americas", "population": "97118" },
	{ "country": "Argentina", "region": "", "latitude": "-38.4161", "longitude": "-63.6167", "continent": "Americas", "population": "44780677" },
	{ "country": "Armenia", "region": "", "latitude": "40.0691", "longitude": "45.0382", "continent": "Asia", "population": "2957731" },
	{ "country": "Australia", "region": "Australian Capital Territory", "latitude": "-35.4735", "longitude": "149.0124" },
	{ "country": "Australia", "region": "New South Wales", "latitude": "-33.8688", "longitude": "151.2093" },
	{ "country": "Australia", "region": "Northern Territory", "latitude": "-12.4634", "longitude": "130.8456" },
	{ "country": "Australia", "region": "Queensland", "latitude": "-28.0167", "longitude": "153.4" },
	{ "country": "Australia", "region": "South Australia", "latitude": "-34.9285", "longitude": "138.6007" },
	{ "country": "Australia", "region": "Tasmania", "latitude": "-41.4545", "longitude": "145.9707" },
	{ "country": "Australia", "region": "Victoria", "latitude": "-37.8136", "longitude": "144.9631" },
	{ "country": "Australia", "region": "Western Australia", "latitude": "-31.9505", "longitude": "115.8605" },
	{ "country": "Australia", "region": "", "latitude": "-25.2744", "longitude": "133.7751", "continent": "Oceania", "population": "25203198" },
	{ "country": "Austria", "region": "", "latitude": "47.5162", "longitude": "14.5501", "continent": "Europe", "population": "8955102" },
	{ "country": "Azerbaijan", "region": "", "latitude": "40.1431", "longitude": "47.5769", "continent": "Asia", "population": "10047718" },
	{ "country": "Bahamas", "region": "", "latitude": "25.0343", "longitude": "-77.3963", "continent": "Americas", "population": "389482" },
	{ "country": "Bahrain", "region": "", "latitude": "26.0275", "longitude": "50.55", "continent": "Asia", "population": "1641172" },
	{ "country": "Bangladesh", "region": "", "latitude": "23.685", "longitude": "90.3563", "continent": "Asia", "population": "163046161" },
	{ "country": "Barbados", "region": "", "latitude": "13.1939", "longitude": "-59.5432", "continent": "Americas", "population": "287025" },
	{ "country": "Belarus", "region": "", "latitude": "53.7098", "longitude": "27.9534", "continent": "Europe", "population": "9452411" },
	{ "country": "Belgium", "region": "", "latitude": "50.8333", "longitude": "4.0", "continent": "Europe", "population": "11539328" },
	{ "country": "Belize", "region": "", "latitude": "13.1939", "longitude": "-59.5432", "continent": "Americas", "population": "390353" },
	{ "country": "Benin", "region": "", "latitude": "9.3077", "longitude": "2.3158", "continent": "Africa", "population": "11801151" },
	{ "country": "Bhutan", "region": "", "latitude": "27.5142", "longitude": "90.4336", "continent": "Asia", "population": "763092" },
	{ "country": "Bolivia", "region": "", "latitude": "-16.2902", "longitude": "-63.5887", "continent": "Americas", "population": "11513100" },
	{ "country": "Bosnia and Herzegovina", "region": "", "latitude": "43.9159", "longitude": "17.6791", "continent": "Europe", "population": "3301000" },
	{ "country": "Botswana", "region": "", "latitude": "-22.3285", "longitude": "24.6849", "continent": "Africa", "population": "2303697" },
	{ "country": "Brazil", "region": "", "latitude": "-14.235", "longitude": "-51.9253", "continent": "Americas", "population": "211049527" },
	{ "country": "Brunei", "region": "", "latitude": "4.5353", "longitude": "114.7277", "continent": "Asia", "population": "433285" },
	{ "country": "Bulgaria", "region": "", "latitude": "42.7339", "longitude": "25.4858", "continent": "Europe", "population": "7000119" },
	{ "country": "Burkina Faso", "region": "", "latitude": "12.2383", "longitude": "-1.5616", "continent": "Africa", "population": "20321378" },
	{ "country": "Burundi", "region": "", "latitude": "-3.3731", "longitude": "29.9189", "continent": "Africa", "population": "10864245" },
	{ "country": "Cambodia", "region": "", "latitude": "11.55", "longitude": "104.9167", "continent": "Asia", "population": "16486542" },
	{ "country": "Cameroon", "region": "", "latitude": "3.8480000000000003", "longitude": "11.5021", "continent": "Africa", "population": "25876380" },
	{ "country": "Canada", "region": "Alberta", "latitude": "53.9333", "longitude": "-116.5765" },
	{ "country": "Canada", "region": "British Columbia", "latitude": "49.2827", "longitude": "-123.1207" },
	{ "country": "Canada", "region": "Grand Princess", "latitude": "37.6489", "longitude": "-122.6655" },
	{ "country": "Canada", "region": "Manitoba", "latitude": "53.7609", "longitude": "-98.8139" },
	{ "country": "Canada", "region": "New Brunswick", "latitude": "46.5653", "longitude": "-66.4619" },
	{ "country": "Canada", "region": "Newfoundland and Labrador", "latitude": "53.1355", "longitude": "-57.6604" },
	{ "country": "Canada", "region": "Nova Scotia", "latitude": "44.681999999999995", "longitude": "-63.7443" },
	{ "country": "Canada", "region": "Ontario", "latitude": "51.2538", "longitude": "-85.3232" },
	{ "country": "Canada", "region": "Prince Edward Island", "latitude": "46.5107", "longitude": "-63.4168" },
	{ "country": "Canada", "region": "Quebec", "latitude": "52.9399", "longitude": "-73.5491" },
	{ "country": "Canada", "region": "Saskatchewan", "latitude": "52.9399", "longitude": "-106.4509" },
	{ "country": "Canada", "region": "Northwest Territories", "latitude": "64.8255", "longitude": "-124.8457" },
	{ "country": "Canada", "region": "Yukon", "latitude": "64.2823", "longitude": "-135.0" },
	{ "country": "Canada", "region": "", "latitude": "56.1304", "longitude": "-106.3468", "continent": "Americas", "population": "37411047" },
	{ "country": "Cape Verde", "region": "", "latitude": "16.5388", "longitude": "-23.0418", "continent": "Africa", "population": "549935" },
	{ "country": "Central African Republic", "region": "", "latitude": "6.6111", "longitude": "20.9394", "continent": "Africa", "population": "4745185" },
	{ "country": "Chad", "region": "", "latitude": "15.4542", "longitude": "18.7322", "continent": "Africa", "population": "15946876" },
	{ "country": "Chile", "region": "", "latitude": "-35.6751", "longitude": "-71.543", "continent": "Americas", "population": "18952038" },
	{ "country": "China", "region": "Anhui", "latitude": "31.8257", "longitude": "117.2264" },
	{ "country": "China", "region": "Beijing", "latitude": "40.1824", "longitude": "116.4142" },
	{ "country": "China", "region": "Chongqing", "latitude": "30.0572", "longitude": "107.874" },
	{ "country": "China", "region": "Fujian", "latitude": "26.0789", "longitude": "117.9874" },
	{ "country": "China", "region": "Gansu", "latitude": "37.8099", "longitude": "101.0583" },
	{ "country": "China", "region": "Guangdong", "latitude": "23.3417", "longitude": "113.4244" },
	{ "country": "China", "region": "Guangxi", "latitude": "23.8298", "longitude": "108.7881" },
	{ "country": "China", "region": "Guizhou", "latitude": "26.8154", "longitude": "106.8748" },
	{ "country": "China", "region": "Hainan", "latitude": "19.1959", "longitude": "109.7453" },
	{ "country": "China", "region": "Hebei", "latitude": "39.549", "longitude": "116.1306" },
	{ "country": "China", "region": "Heilongjiang", "latitude": "47.861999999999995", "longitude": "127.7615" },
	{ "country": "China", "region": "Henan", "latitude": "33.882", "longitude": "113.61399999999999" },
	{ "country": "China", "region": "Hong Kong", "latitude": "22.3", "longitude": "114.2", "continent": "Asia", "population": "7436154" },
	{ "country": "China", "region": "Hubei", "latitude": "30.9756", "longitude": "112.2707" },
	{ "country": "China", "region": "Hunan", "latitude": "27.6104", "longitude": "111.7088" },
	{ "country": "China", "region": "Inner Mongolia", "latitude": "44.0935", "longitude": "113.9448" },
	{ "country": "China", "region": "Jiangsu", "latitude": "32.9711", "longitude": "119.455" },
	{ "country": "China", "region": "Jiangxi", "latitude": "27.614", "longitude": "115.7221" },
	{ "country": "China", "region": "Jilin", "latitude": "43.6661", "longitude": "126.1923" },
	{ "country": "China", "region": "Liaoning", "latitude": "41.2956", "longitude": "122.6085" },
	{ "country": "China", "region": "Macau", "latitude": "22.1667", "longitude": "113.55", "continent": "Asia", "population": "640445" },
	{ "country": "China", "region": "Ningxia", "latitude": "37.2692", "longitude": "106.1655" },
	{ "country": "China", "region": "Qinghai", "latitude": "35.7452", "longitude": "95.9956" },
	{ "country": "China", "region": "Shaanxi", "latitude": "35.1917", "longitude": "108.8701" },
	{ "country": "China", "region": "Shandong", "latitude": "36.3427", "longitude": "118.1498" },
	{ "country": "China", "region": "Shanghai", "latitude": "31.201999999999998", "longitude": "121.4491" },
	{ "country": "China", "region": "Shanxi", "latitude": "37.5777", "longitude": "112.2922" },
	{ "country": "China", "region": "Sichuan", "latitude": "30.6171", "longitude": "102.7103" },
	{ "country": "China", "region": "Tianjin", "latitude": "39.3054", "longitude": "117.323" },
	{ "country": "China", "region": "Tibet", "latitude": "31.6927", "longitude": "88.0924" },
	{ "country": "China", "region": "Xinjiang", "latitude": "41.1129", "longitude": "85.2401" },
	{ "country": "China", "region": "Yunnan", "latitude": "24.974", "longitude": "101.48700000000001" },
	{ "country": "China", "region": "Zhejiang", "latitude": "29.1832", "longitude": "120.0934" },
	{ "country": "China", "region": "", "latitude": "35.8617", "longitude": "104.1954", "continent": "Asia", "population": "1433783686" },
	{ "country": "Colombia", "region": "", "latitude": "4.5709", "longitude": "-74.2973", "continent": "Americas", "population": "50339443" },
	{ "country": "Congo (Brazzaville)", "region": "", "latitude": "-4.0383", "longitude": "21.7587", "continent": "Africa", "population": "5380508" },
	{ "country": "Congo (Kinshasa)", "region": "", "latitude": "-4.0383", "longitude": "21.7587", "continent": "Africa", "population": "86790567" },
	{ "country": "Costa Rica", "region": "", "latitude": "9.7489", "longitude": "-83.7534", "continent": "Americas", "population": "5047561" },
	{ "country": "Croatia", "region": "", "latitude": "45.1", "longitude": "15.2", "continent": "Europe", "population": "4130304" },
	{ "country": "Cuba", "region": "", "latitude": "22.0", "longitude": "-80.0", "continent": "Americas", "population": "11333483" },
	{ "country": "Cyprus", "region": "", "latitude": "35.1264", "longitude": "33.4299", "continent": "Asia", "population": "1179551" },
	{ "country": "Czech Republic", "region": "", "latitude": "49.8175", "longitude": "15.472999999999999", "continent": "Europe", "population": "10689209" },
	{ "country": "Denmark", "region": "Faroe Islands", "latitude": "61.8926", "longitude": "-6.9118", "continent": "Europe", "population": "48678" },
	{ "country": "Denmark", "region": "Greenland", "latitude": "71.7069", "longitude": "-42.6043", "continent": "Americas", "population": "56672" },
	{ "country": "Denmark", "region": "", "latitude": "56.2639", "longitude": "9.5018", "continent": "Europe", "population": "5771876" },
	{ "country": "Djibouti", "region": "", "latitude": "11.8251", "longitude": "42.5903", "continent": "Africa", "population": "973560" },
	{ "country": "Dominica", "region": "", "latitude": "15.415", "longitude": "-61.371", "continent": "Americas", "population": "71808" },
	{ "country": "Dominican Republic", "region": "", "latitude": "18.7357", "longitude": "-70.1627", "continent": "Americas", "population": "10738958" },
	{ "country": "East Timor", "region": "", "latitude": "-8.874217", "longitude": "125.727539", "continent": "Asia", "population": "1293119" },
	{ "country": "Ecuador", "region": "", "latitude": "-1.8312", "longitude": "-78.1834", "continent": "Americas", "population": "17373662" },
	{ "country": "Egypt", "region": "", "latitude": "26.0", "longitude": "30.0", "continent": "Africa", "population": "100388073" },
	{ "country": "El Salvador", "region": "", "latitude": "13.7942", "longitude": "-88.8965", "continent": "Americas", "population": "6453553" },
	{ "country": "Equatorial Guinea", "region": "", "latitude": "1.5", "longitude": "10.0", "continent": "Africa", "population": "1355986" },
	{ "country": "Eritrea", "region": "", "latitude": "15.1794", "longitude": "39.7823", "continent": "Africa", "population": "3497117" },
	{ "country": "Estonia", "region": "", "latitude": "58.5953", "longitude": "25.0136", "continent": "Europe", "population": "1325648" },
	{ "country": "Eswatini", "region": "", "latitude": "-26.5225", "longitude": "31.4659", "continent": "Africa", "population": "1148130" },
	{ "country": "Ethiopia", "region": "", "latitude": "9.145", "longitude": "40.4897", "continent": "Africa", "population": "112078730" },
	{ "country": "Fiji", "region": "", "latitude": "-17.7134", "longitude": "178.065", "continent": "Oceania", "population": "889953" },
	{ "country": "Finland", "region": "", "latitude": "64.0", "longitude": "26.0", "continent": "Europe", "population": "5532156" },
	{ "country": "France", "region": "French Guiana", "latitude": "3.9339", "longitude": "-53.1258", "continent": "Americas", "population": "282731" },
	{ "country": "France", "region": "French Polynesia", "latitude": "-17.6797", "longitude": "149.4068", "continent": "Oceania", "population": "279287" },
	{ "country": "France", "region": "Guadeloupe", "latitude": "16.25", "longitude": "-61.5833", "continent": "Americas", "population": "447905" },
	{ "country": "France", "region": "Mayotte", "latitude": "-12.8275", "longitude": "45.1662", "continent": "Africa", "population": "266150" },
	{ "country": "France", "region": "New Caledonia", "latitude": "-20.9043", "longitude": "165.618", "continent": "Oceania", "population": "282750" },
	{ "country": "France", "region": "Reunion", "latitude": "-21.1351", "longitude": "55.2471", "continent": "Africa", "population": "888927" },
	{ "country": "France", "region": "Saint Barthelemy", "latitude": "17.9", "longitude": "-62.8333" },
	{ "country": "France", "region": "St Martin", "latitude": "18.0708", "longitude": "-63.0501" },
	{ "country": "France", "region": "Martinique", "latitude": "14.6415", "longitude": "-61.0242", "continent": "Americas", "population": "375554" },
	{ "country": "France", "region": "", "latitude": "46.2276", "longitude": "2.2137", "continent": "Europe", "population": "65129728" },
	{ "country": "France", "region": "Saint Pierre and Miquelon", "latitude": "46.8852", "longitude": "-56.3159", "continent": "Americas", "population": "5822" },
	{ "country": "Gabon", "region": "", "latitude": "-0.8037", "longitude": "11.6094", "continent": "Africa", "population": "2172579" },
	{ "country": "Gambia", "region": "", "latitude": "13.4432", "longitude": "-15.3101", "continent": "Africa", "population": "2347706" },
	{ "country": "Georgia", "region": "", "latitude": "42.3154", "longitude": "43.3569", "continent": "Asia", "population": "3996765" },
	{ "country": "Germany", "region": "", "latitude": "51.0", "longitude": "9.0", "continent": "Europe", "population": "83517045" },
	{ "country": "Ghana", "region": "", "latitude": "7.9465", "longitude": "-1.0232", "continent": "Africa", "population": "28833629" },
	{ "country": "Greece", "region": "", "latitude": "39.0742", "longitude": "21.8243", "continent": "Europe", "population": "10473455" },
	{ "country": "Grenada", "region": "", "latitude": "12.1165", "longitude": "-61.678999999999995", "continent": "Americas", "population": "112003" },
	{ "country": "Guatemala", "region": "", "latitude": "15.7835", "longitude": "-90.2308", "continent": "Americas", "population": "17581472" },
	{ "country": "Guinea", "region": "", "latitude": "9.9456", "longitude": "-9.6966", "continent": "Africa", "population": "12771246" },
	{ "country": "Guinea-Bissau", "region": "", "latitude": "11.8037", "longitude": "-15.1804", "continent": "Africa", "population": "1920922" },
	{ "country": "Guyana", "region": "", "latitude": "5.0", "longitude": "-58.75", "continent": "Americas", "population": "782766" },
	{ "country": "Haiti", "region": "", "latitude": "18.9712", "longitude": "-72.2852", "continent": "Americas", "population": "11263770" },
	{ "country": "Honduras", "region": "", "latitude": "15.2", "longitude": "-86.2419", "continent": "Americas", "population": "9746117" },
	{ "country": "Hungary", "region": "", "latitude": "47.1625", "longitude": "19.5033", "continent": "Europe", "population": "9684679" },
	{ "country": "Iceland", "region": "", "latitude": "64.9631", "longitude": "-19.0208", "continent": "Europe", "population": "339031" },
	{ "country": "India", "region": "", "latitude": "21.0", "longitude": "78.0", "continent": "Asia", "population": "1366417754" },
	{ "country": "Indonesia", "region": "", "latitude": "-0.7893", "longitude": "113.9213", "continent": "Asia", "population": "270625568" },
	{ "country": "Iran", "region": "", "latitude": "32.0", "longitude": "53.0", "continent": "Asia", "population": "82913906" },
	{ "country": "Iraq", "region": "", "latitude": "33.0", "longitude": "44.0", "continent": "Asia", "population": "39309783" },
	{ "country": "Ireland", "region": "", "latitude": "53.1424", "longitude": "-7.6921", "continent": "Europe", "population": "4882495" },
	{ "country": "Israel", "region": "", "latitude": "31.0", "longitude": "35.0", "continent": "Asia", "population": "8519377" },
	{ "country": "Italy", "region": "", "latitude": "43.0", "longitude": "12.0", "continent": "Europe", "population": "60550075" },
	{ "country": "Ivory Coast", "region": "", "latitude": "7.54", "longitude": "-5.5471", "continent": "Africa", "population": "25716544" },
	{ "country": "Jamaica", "region": "", "latitude": "18.1096", "longitude": "-77.2975", "continent": "Americas", "population": "2948279" },
	{ "country": "Japan", "region": "", "latitude": "36.0", "longitude": "138.0", "continent": "Asia", "population": "126860301" },
	{ "country": "Jordan", "region": "", "latitude": "31.24", "longitude": "36.51", "continent": "Asia", "population": "10101694" },
	{ "country": "Kazakhstan", "region": "", "latitude": "48.0196", "longitude": "66.9237", "continent": "Asia", "population": "18551427" },
	{ "country": "Kenya", "region": "", "latitude": "-0.0236", "longitude": "37.9062", "continent": "Africa", "population": "52573973" },
	{ "country": "Kosovo", "region": "", "latitude": "42.602636", "longitude": "20.902977", "continent": "Europe", "population": 1810463 },
	{ "country": "Kuwait", "region": "", "latitude": "29.5", "longitude": "47.75", "continent": "Asia", "population": "4207083" },
	{ "country": "Kyrgyzstan", "region": "", "latitude": "41.2044", "longitude": "74.7661", "continent": "Asia", "population": "6415850" },
	{ "country": "Laos", "region": "", "latitude": "19.856270000000002", "longitude": "102.495496", "continent": "Asia", "population": "7169455" },
	{ "country": "Latvia", "region": "", "latitude": "56.8796", "longitude": "24.6032", "continent": "Europe", "population": "1906743" },
	{ "country": "Lebanon", "region": "", "latitude": "33.8547", "longitude": "35.8623", "continent": "Asia", "population": "6855713" },
	{ "country": "Liberia", "region": "", "latitude": "6.4281", "longitude": "-9.4295", "continent": "Africa", "population": "4937374" },
	{ "country": "Libya", "region": "", "latitude": "26.3351", "longitude": "17.228331", "continent": "Africa", "population": "6777452" },
	{ "country": "Liechtenstein", "region": "", "latitude": "47.14", "longitude": "9.55", "continent": "Europe", "population": "38019" },
	{ "country": "Lithuania", "region": "", "latitude": "55.1694", "longitude": "23.8813", "continent": "Europe", "population": "2759627" },
	{ "country": "Luxembourg", "region": "", "latitude": "49.8153", "longitude": "6.1296", "continent": "Europe", "population": "615729" },
	{ "country": "Madagascar", "region": "", "latitude": "-18.7669", "longitude": "46.8691", "continent": "Africa", "population": "26969307" },
	{ "country": "Malawi", "region": "", "latitude": "-13.254307999999998", "longitude": "34.301525", "continent": "Africa", "population": "18628747" },
	{ "country": "Malaysia", "region": "", "latitude": "2.5", "longitude": "112.5", "continent": "Asia", "population": "31949777" },
	{ "country": "Maldives", "region": "", "latitude": "3.2028", "longitude": "73.2207", "continent": "Asia", "population": "530953" },
	{ "country": "Mali", "region": "", "latitude": "17.570692", "longitude": "-3.9961660000000006", "continent": "Africa", "population": "19658031" },
	{ "country": "Malta", "region": "", "latitude": "35.9375", "longitude": "14.3754", "continent": "Europe", "population": "440372" },
	{ "country": "Mauritania", "region": "", "latitude": "21.0079", "longitude": "10.9408", "continent": "Africa", "population": "4525696" },
	{ "country": "Mauritius", "region": "", "latitude": "-20.2", "longitude": "57.5", "continent": "Africa", "population": "1198575" },
	{ "country": "Mexico", "region": "", "latitude": "23.6345", "longitude": "-102.5528", "continent": "Americas", "population": "127575529" },
	{ "country": "Moldova", "region": "", "latitude": "47.4116", "longitude": "28.3699", "continent": "Europe", "population": "4043263" },
	{ "country": "Monaco", "region": "", "latitude": "43.7333", "longitude": "7.4167", "continent": "Europe", "population": "38964" },
	{ "country": "Mongolia", "region": "", "latitude": "46.8625", "longitude": "103.8467", "continent": "Asia", "population": "3225167" },
	{ "country": "Montenegro", "region": "", "latitude": "42.5", "longitude": "19.3", "continent": "Europe", "population": "627987" },
	{ "country": "Morocco", "region": "", "latitude": "31.7917", "longitude": "-7.0926", "continent": "Africa", "population": "36471769" },
	{ "country": "Mozambique", "region": "", "latitude": "-18.665695", "longitude": "35.529562", "continent": "Africa", "population": "30366036" },
	{ "country": "Myanmar", "region": "", "latitude": "21.9162", "longitude": "95.956", "continent": "Asia", "population": "54045420" },
	{ "country": "Namibia", "region": "", "latitude": "-22.9576", "longitude": "18.4904", "continent": "Africa", "population": "2494530" },
	{ "country": "Nepal", "region": "", "latitude": "28.1667", "longitude": "84.25", "continent": "Asia", "population": "28608710" },
	{ "country": "Netherlands", "region": "Aruba", "latitude": "12.5186", "longitude": "-70.0358", "continent": "Americas", "population": "106314" },
	{ "country": "Netherlands", "region": "Curacao", "latitude": "12.1696", "longitude": "-68.99" },
	{ "country": "Netherlands", "region": "Sint Maarten", "latitude": "18.0425", "longitude": "-63.0548", "continent": "Americas", "population": "42388" },
	{ "country": "Netherlands", "region": "", "latitude": "52.1326", "longitude": "5.2913", "continent": "Europe", "population": "17097130" },
	{ "country": "Netherlands", "region": "Bonaire Sint Eustatius and Saba", "latitude": "12.1784", "longitude": "-68.2385" },
	{ "country": "New Zealand", "region": "", "latitude": "-40.9006", "longitude": "174.886", "continent": "Oceania", "population": "4783063" },
	{ "country": "Nicaragua", "region": "", "latitude": "12.8654", "longitude": "-85.2072", "continent": "Americas", "population": "6545502" },
	{ "country": "Niger", "region": "", "latitude": "17.6078", "longitude": "8.0817", "continent": "Africa", "population": "23310715" },
	{ "country": "Nigeria", "region": "", "latitude": "9.082", "longitude": "8.6753", "continent": "Africa", "population": "200963599" },
	{ "country": "Niue", "region": "", "latitude": "19.0544", "longitude": "-169.8672", "continent": "Oceania", "population": "1620" },
	{ "country": "North Macedonia", "region": "", "latitude": "41.6086", "longitude": "21.7453", "continent": "Europe", "population": "2083459" },
	{ "country": "Norway", "region": "", "latitude": "60.472", "longitude": "8.4689", "continent": "Europe", "population": "5378857" },
	{ "country": "Oman", "region": "", "latitude": "21.0", "longitude": "57.0", "continent": "Asia", "population": "4974986" },
	{ "country": "Pakistan", "region": "", "latitude": "30.3753", "longitude": "69.3451", "continent": "Asia", "population": "216565318" },
	{ "country": "Palestine", "region": "", "latitude": "31.9522", "longitude": "35.2332", "continent": "Asia", "population": "4981420" },
	{ "country": "Panama", "region": "", "latitude": "8.538", "longitude": "-80.7821", "continent": "Americas", "population": "4246439" },
	{ "country": "Papua New Guinea", "region": "", "latitude": "-6.315", "longitude": "143.9555", "continent": "Oceania", "population": "8776109" },
	{ "country": "Paraguay", "region": "", "latitude": "-23.4425", "longitude": "-58.4438", "continent": "Americas", "population": "7044636" },
	{ "country": "Peru", "region": "", "latitude": "-9.19", "longitude": "-75.0152", "continent": "Americas", "population": "32510453" },
	{ "country": "Philippines", "region": "", "latitude": "13.0", "longitude": "122.0", "continent": "Asia", "population": "108116615" },
	{ "country": "Poland", "region": "", "latitude": "51.9194", "longitude": "19.1451", "continent": "Europe", "population": "37887768" },
	{ "country": "Portugal", "region": "", "latitude": "39.3999", "longitude": "-8.2245", "continent": "Europe", "population": "10226187" },
	{ "country": "Qatar", "region": "", "latitude": "25.3548", "longitude": "51.1839", "continent": "Asia", "population": "2832067" },
	{ "country": "Romania", "region": "", "latitude": "45.9432", "longitude": "24.9668", "continent": "Europe", "population": "19364557" },
	{ "country": "Russia", "region": "", "latitude": "60.0", "longitude": "90.0", "continent": "Europe", "population": "145872256" },
	{ "country": "Rwanda", "region": "", "latitude": "-1.9403", "longitude": "29.8739", "continent": "Africa", "population": "12626950" },
	{ "country": "Saint Kitts and Nevis", "region": "", "latitude": "17.357822", "longitude": "-62.782998", "continent": "Americas", "population": "52823" },
	{ "country": "Saint Lucia", "region": "", "latitude": "13.9094", "longitude": "-60.9789", "continent": "Americas", "population": "182790" },
	{ "country": "Saint Vincent and the Grenadines", "region": "", "latitude": "12.9843", "longitude": "-61.2872", "continent": "Americas", "population": "110589" },
	{ "country": "San Marino", "region": "", "latitude": "43.9424", "longitude": "12.4578", "continent": "Europe", "population": "33860" },
	{ "country": "Sao Tome and Principe", "region": "", "latitude": "0.18636", "longitude": "6.613081", "continent": "Africa", "population": "" },
	{ "country": "Saudi Arabia", "region": "", "latitude": "24.0", "longitude": "45.0", "continent": "Asia", "population": "34268528" },
	{ "country": "Senegal", "region": "", "latitude": "14.4974", "longitude": "-14.4524", "continent": "Africa", "population": "16296364" },
	{ "country": "Serbia", "region": "", "latitude": "44.0165", "longitude": "21.0059", "continent": "Europe", "population": "8772235" },
	{ "country": "Seychelles", "region": "", "latitude": "-4.6796", "longitude": "55.492", "continent": "Africa", "population": "97739" },
	{ "country": "Sierra Leone", "region": "", "latitude": "8.460555000000001", "longitude": "-11.779889", "continent": "Africa", "population": "7813215" },
	{ "country": "Singapore", "region": "", "latitude": "1.2833", "longitude": "103.8333", "continent": "Asia", "population": "5804337" },
	{ "country": "Slovakia", "region": "", "latitude": "48.669", "longitude": "19.699", "continent": "Europe", "population": "5457013" },
	{ "country": "Slovenia", "region": "", "latitude": "46.1512", "longitude": "14.9955", "continent": "Europe", "population": "2078654" },
	{ "country": "Somalia", "region": "", "latitude": "5.1521", "longitude": "46.1996", "continent": "Africa", "population": "15442905" },
	{ "country": "South Africa", "region": "", "latitude": "-30.5595", "longitude": "22.9375", "continent": "Africa", "population": "58558270" },
	{ "country": "South Korea", "region": "", "latitude": "36.0", "longitude": "128.0", "continent": "Asia", "population": "51225308" },
	{ "country": "South Sudan", "region": "", "latitude": "6.877000000000001", "longitude": "31.307", "continent": "Africa", "population": "11062113" },
	{ "country": "Spain", "region": "", "latitude": "40.0", "longitude": "-4.0", "continent": "Europe", "population": "46736776" },
	{ "country": "Sri Lanka", "region": "", "latitude": "7.0", "longitude": "81.0", "continent": "Asia", "population": "21323733" },
	{ "country": "Sudan", "region": "", "latitude": "12.8628", "longitude": "30.2176", "continent": "Africa", "population": "42813238" },
	{ "country": "Suriname", "region": "", "latitude": "3.9193", "longitude": "-56.0278", "continent": "Americas", "population": "581372" },
	{ "country": "Sweden", "region": "", "latitude": "63.0", "longitude": "16.0", "continent": "Europe", "population": "10036379" },
	{ "country": "Switzerland", "region": "", "latitude": "46.8182", "longitude": "8.2275", "continent": "Europe", "population": "8591365" },
	{ "country": "Syria", "region": "", "latitude": "34.802075", "longitude": "38.996815000000005", "continent": "Asia", "population": "17070135" },
	{ "country": "Taiwan", "region": "", "latitude": "23.7", "longitude": "121.0", "continent": "Asia", "population": "23726460" },
	{ "country": "Tanzania", "region": "", "latitude": "-6.369", "longitude": "34.8888", "continent": "Africa", "population": "58005463" },
	{ "country": "Thailand", "region": "", "latitude": "15.0", "longitude": "101.0", "continent": "Asia", "population": "69037513" },
	{ "country": "Togo", "region": "", "latitude": "8.6195", "longitude": "0.8248", "continent": "Africa", "population": "8082366" },
	{ "country": "Trinidad and Tobago", "region": "", "latitude": "10.6918", "longitude": "-61.2225", "continent": "Americas", "population": "1394973" },
	{ "country": "Tunisia", "region": "", "latitude": "34.0", "longitude": "9.0", "continent": "Africa", "population": "11694719" },
	{ "country": "Turkey", "region": "", "latitude": "38.9637", "longitude": "35.2433", "continent": "Asia", "population": "83429615" },
	{ "country": "Uganda", "region": "", "latitude": "1.0", "longitude": "32.0", "continent": "Africa", "population": "44269594" },
	{ "country": "Ukraine", "region": "", "latitude": "48.3794", "longitude": "31.1656", "continent": "Europe", "population": "43993638" },
	{ "country": "United Arab Emirates", "region": "", "latitude": "24.0", "longitude": "54.0", "continent": "Asia", "population": "9770529" },
	{ "country": "United Kingdom", "region": "Bermuda", "latitude": "32.3078", "longitude": "-64.7505", "continent": "Americas", "population": "62506" },
	{ "country": "United Kingdom", "region": "Cayman Islands", "latitude": "19.3133", "longitude": "-81.2546", "continent": "Americas", "population": "64948" },
	{ "country": "United Kingdom", "region": "Channel Islands", "latitude": "49.3723", "longitude": "-2.3644" },
	{ "country": "United Kingdom", "region": "Gibraltar", "latitude": "36.1408", "longitude": "-5.3536", "continent": "Europe", "population": "33701" },
	{ "country": "United Kingdom", "region": "Isle of Man", "latitude": "54.2361", "longitude": "-4.5481", "continent": "Europe", "population": "84584" },
	{ "country": "United Kingdom", "region": "Montserrat", "latitude": "16.7425", "longitude": "-62.1874", "continent": "Americas", "population": "4989" },
	{ "country": "United Kingdom", "region": "", "latitude": "55.3781", "longitude": "-3.4360000000000004", "continent": "Europe", "population": "67530172" },
	{ "country": "United Kingdom", "region": "Anguilla", "latitude": "18.2206", "longitude": "-63.0686", "continent": "Americas", "population": "14869" },
	{ "country": "United Kingdom", "region": "British Virgin Islands", "latitude": "18.4207", "longitude": "-64.64", "continent": "Americas", "population": "30030" },
	{ "country": "United Kingdom", "region": "Turks and Caicos Islands", "latitude": "21.694000000000003", "longitude": "-71.7979", "continent": "Americas", "population": "38191" },
	{ "country": "United Kingdom", "region": "Falkland Islands", "latitude": "-51.7963", "longitude": "-59.5236", "continent": "Americas", "population": "3377" },
	{ "country": "United States", "region": "", "latitude": "37.0902", "longitude": "-95.7129", "continent": "Americas", "population": "329064917" },
	{ "country": "Uruguay", "region": "", "latitude": "-32.5228", "longitude": "-55.7658", "continent": "Americas", "population": "3461734" },
	{ "country": "Uzbekistan", "region": "", "latitude": "41.3775", "longitude": "64.5853", "continent": "Asia", "population": "32981716" },
	{ "country": "Vatican City", "region": "", "latitude": "41.9029", "longitude": "12.4534", "continent": "Europe", "population": "799" },
	{ "country": "Venezuela", "region": "", "latitude": "6.4238", "longitude": "-66.5897", "continent": "Americas", "population": "28515829" },
	{ "country": "Vietnam", "region": "", "latitude": "16.0", "longitude": "108.0", "continent": "Asia", "population": "96462106" },
	{ "country": "Western Sahara", "region": "", "latitude": "24.2155", "longitude": "-12.8858", "continent": "Africa", "population": "582463" },
	{ "country": "Yemen", "region": "", "latitude": "15.5527", "longitude": "48.5164", "continent": "Asia", "population": "29161922" },
	{ "country": "Zambia", "region": "", "latitude": "-15.4167", "longitude": "28.2833", "continent": "Africa", "population": "17861030" },
	{ "country": "Zimbabwe", "region": "", "latitude": "-20.0", "longitude": "30.0", "continent": "Africa", "population": "14645468" }
];
