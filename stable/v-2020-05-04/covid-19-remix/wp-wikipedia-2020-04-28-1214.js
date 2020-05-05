// copyright 2020 Spider contributors. MIT license.
// 2020-03-26
/* global THR, resetGroups , THREE, camera, renderer,intersected, linecases, DMTdragParent, divMessage */
/* globals */
// jshint esversion: 6
// jshint loopfunc: true

// https://en.wikipedia.org/wiki/Template:2019%E2%80%9320_coronavirus_pandemic_data
// https://en.wikipedia.org/wiki/Template:2019%E2%80%9320_coronavirus_pandemic_data/United_States_medical_cases_by_state


const BAR = {

	lat: 0,
	lon: 0,
	places: "Null Island",
	index: 0,
	color: "red",
	radius: 0.4,
	height: 40,
	offset: 0,
	radialSegments: 5,
	heightSegments: 1,
	openEnded: true

};

const WP = {};


//WP.cors = location.protocol === "https:" ? "" : "https://cors-anywhere.herokuapp.com/";
WP.cors = "https://cors-anywhere.herokuapp.com/";

WP.api = "https://en.wikipedia.org/w/api.php?";

WP.query = "action=parse&format=json&page=";

WP.chartPrefix = "https://en.wikipedia.org/wiki/2020_coronavirus_pandemic_in_";

WP.templateUsa = "Template:2019–20_coronavirus_pandemic_data/United_States_medical_cases_by_state";

WP.templateGlobal = "Template:2019–20_coronavirus_pandemic_data";

WP.init = function () {

	resetGroups();

	const timeStartAll = performance.now();

	WP.getPandemicData( c19GeoDataUsa, WP.templateUsa );

	WP.getPandemicData( c19GeoDataGlobal, WP.templateGlobal );

	//console.log( "time start all", performance.now() - timeStartAll );

};



WP.getPandemicData = function ( c19GeoData, chart ) {

	WP.timeStart = performance.now();

	WP.requestFileUserData( WP.cors + WP.api + WP.query + chart, WP.onLoadData, c19GeoData );

};



WP.requestFileUserData = function ( url, callback, userData ) {

	const xhr = new XMLHttpRequest();
	xhr.open( "GET", url, true );
	xhr.onerror = ( xhr ) => console.log( "error:", xhr );
	//xhr.onprogress = ( xhr ) => console.log( 'bytes loaded:', xhr.loaded );
	xhr.onload = ( xhr ) => callback( xhr, userData );
	xhr.send( null );

};



WP.onLoadData = function ( xhr, c19GeoData ) {

	//console.log( "xhr", xhr, c19GeoData );

	const response = xhr.target.response;

	const json = JSON.parse( response );
	//console.log( 'json',json );

	const text = json.parse.text[ "*" ];
	//console.log( 'text', text );

	const parser = new DOMParser();
	const html = parser.parseFromString( text, "text/html" );

	const table = html.querySelector( ".wikitable" );
	//console.log(table );

	const trs = table.querySelectorAll( "tr" );
	//console.log( 'trs', trs );

	let rows = Array.from( trs ).slice( 0, - 2 ).map( tr => tr.innerText.trim()
		.replace( /\[(.*?)\]/g, "" )
		.split( "\n" ) );

	//rows = rows.slice( 2 )// .sort();
	//console.log( "rows", rows);

	if ( c19GeoData === c19GeoDataUsa ) {

		const totals = rows[ 2 ];
		WP.totalsUsa = totals;
		WP.parseUsa( rows );

	} else {

		const totals = rows[ 1 ];
		WP.totalsGlobal = totals;
		WP.parseGlobal( rows );

		sta.init();

	}

};



WP.parseUsa = function ( rows ) {

	//console.log( "rows", rows );

	c19GeoDataUsa.forEach( state => {

		const find = rows.slice( 1 ).find( row => row[ 0 ] === state.region );

		if ( find ) {

			state.cases = find[ 2 ].trim().replace( /,/g, "" );
			state.deaths = find[ 4 ].trim().replace( /,/g, "" );
			state.recoveries = find[ 6 ].trim().replace( /,/g, "" );

		} else {

			//console.log( "state", state );

		}

	} );
	//console.log( "time", performance.now() - WP.timeStart );

	WP.updateBars( c19GeoDataUsa );

};



WP.parseGlobal = function ( rows ) {

	//console.log( "rows", rows );

	const ignores = [ "Coral Princess", "Diamond Princess", "Greg Mortimer", "MS Zaandam", "Leopold I",
		"Recovered", "USS Theodore Roosevelt", "Charles de Gaulle", "HNLMS Dolfijn", "International conveyances",
		"American Samoa", "Guam", "Guantanamo Bay", "Northern Mariana Islands", "Puerto Rico",
		"U.S. Virgin Islands" ];


	const filter1 = rows.filter( row => ignores.includes( row[ 0 ].trim() ) === false );
	//console.log( "filter1", filter1 );

	const filter = filter1.filter( row => {

		const find1 = c19GeoDataGlobal.find( country => row[ 0 ] === country.country );

		const find2 = c19GeoDataGlobal.find( country => row[ 0 ] === country.region );

		// if ( ! find1 && ! find2 ) {

		// 	//console.log( "not find", row );

		// }

		return find1 || find2;

	} );
	//console.log( "filter", filter );


	const countries = filter.map( row => {

		let country;

		country = c19GeoDataGlobal.find( country => row[ 0 ] === country.country && country.region === "" );

		if ( country ) {

			country.cases = row[ 2 ].replace( /,/g, "" );
			country.deaths = row[ 4 ].replace( /,/g, "" );
			country.recoveries = row[ 6 ].replace( /,/g, "" );

		} else {

			country = c19GeoDataGlobal.find( country => row[ 0 ] === country.region );

			if ( country ) {

				country.cases = row[ 2 ].replace( /,/g, "" );
				country.deaths = row[ 4 ].replace( /,/g, "" );
				country.recoveries = row[ 6 ].replace( /,/g, "" );

			} else {

				//console.log( "not found", country );

			}

		}

		return country;

	} );
	// console.log( "", countries );

	WP.updateBars( countries );

};



WP.updateBars = function ( places ) {

	//console.log( "", places );

	const heightsCases = places.map( line => Number( line.cases ) );
	//console.log( 'heightsCases', heightsCases );

	const meshesCases = places.map( ( line, index ) =>
		WP.addBar( line.latitude, line.longitude, places, index, "red", 0.4, heightsCases[ index ], 0, 12, 1, false ) );

	groupCasesWP.add( ...meshesCases );


	const heightsDeaths = places.map( line => Number( line.deaths ) );
	//console.log( 'heightsDeaths', heightsDeaths );

	const meshesDeaths = places.map( ( line, index ) =>
		WP.addBar( line.latitude, line.longitude, places, index, "black", 0.5, heightsDeaths[ index ] ) );

	groupDeathsWP.add( ...meshesDeaths );


	const heightsRecoveries = places.map( line => Number( line.recoveries ) );
	//console.log( 'heightsRecoveries', heightsRecoveries );

	const meshesRecoveries = places.map( ( line, index ) =>
		WP.addBar( line.latitude, line.longitude, places, index, "green", 0.45, heightsRecoveries[ index ] ) );

	groupRecoveriesWP.add( ...meshesRecoveries );

};



WP.addBar = function ( lat, lon, places, index, color = "red", radius = 0.4, height = 0, offset = 0, radialSegments = 12, heightSegments = 1, openEnded = false ) {

	//console.log( 'rad', radius );

	//if ( ! height || height === 0 ) { return new THREE.Mesh(); }


	const heightScaled = WP.scale ? 0.05 * Math.sqrt( height ) : 0.0002 * height;

	//let geometry = new THREE.CylinderGeometry( 0.2, radius, heightScaled, radialSegments, heightSegments, openEnded );
	let geometry = new THREE.CylinderBufferGeometry( 0.1, BAR.radius, 1, BAR.radialSegments, BAR.heightSegments, BAR.openEnded );
	geometry.applyMatrix4( new THREE.Matrix4().makeRotationX( -0.5 * Math.PI ) );

	const matrix = getMatrixComposed( 50, lat, lon, heightScaled );
	geometry.applyMatrix4( matrix );

	let material = new THREE.MeshPhongMaterial( { color: color, side: 2 } );
	let mesh = new THREE.Mesh( geometry, material );
	mesh.userData.index = index;
	mesh.userData.places = places;
	//mesh.name = rows[ index ][ 0 ];

	return mesh;

};



function getMatrixComposed ( r = 50, lat = 0, lon = 0, height = 5 ) {

	const position = latLonToXYZ( r + 0.5 * height, lat, lon );
	const quaternion = new THREE.Quaternion().setFromUnitVectors (
		new THREE.Vector3( 0, 0, 1 ), position.clone().normalize() )
	const scale = new THREE.Vector3( 1, 1, height );
	const matrix = new THREE.Matrix4();
	matrix.compose( position, quaternion, scale );

	return matrix;

}


function latLonToXYZ ( radius, lat, lon ) {

	const phi = ( 90 - lat ) * Math.PI / 180;
	const theta = ( 180 - lon ) * Math.PI / 180;
	//console.log( "lat/lon", theta, phi, index);

	const x = radius * Math.sin( phi ) * Math.cos( theta );
	const y = radius * Math.sin( phi ) * Math.sin( theta );
	const z = radius * Math.cos( phi );

	return new THREE.Vector3( - x, y, z );

};

