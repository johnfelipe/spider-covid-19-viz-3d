// copyright 2020 Spider contributors. MIT license.
// 2020-03-26
/* global THREE, controls, drawThreeGeo, aSource, imgIcon, sTitle, sVersion, divMessage, divStats, divSettings, detStats, navMenu, THR */



let pathAssets = "../../../assets/"; // change in html of stable

let messageOfTheDay = `
<mark>New for 2020-03-31<br>
* "<a
	href="https://www.ladybug.tools/spider-covid-19-viz-3d/dev/v-2020-03-31-15-24/covid-19-viz3d-wikipedia/covid-19-viz-3d-wikipedia.html"
	target="_blank">Wikipedia Global</a>".<br>
* Includes detailed data in pop-ups</mark>
`;



aSource.href = "https://github.com/ladybug-tools/spider-covid-19-viz-3d/";
imgIcon.src = pathAssets + "images/github-mark-32.png";

sTitle.innerHTML = document.title; // ? document.title : location.href.split( "/" ).pop().slice( 0, - 5 ).replace( /-/g, " " );
const version = document.head.querySelector( "[ name=version ]" );
sVersion.innerHTML = version ? version.content : "";
//divDescription.innerHTML = document.head.querySelector( "[ name=description ]" ).content;

let group = new THREE.Group();
let groupCases = new THREE.Group();
let groupCasesNew = new THREE.Group();
let groupCasesNewGrounded = new THREE.Group();
let groupRecoveries = new THREE.Group();
let groupDeaths = new THREE.Group();
let groupDeathsNew = new THREE.Group();
let groupPlacards = new THREE.Group();
let groupLines = new THREE.Group();
let groupPrevious;

let geoJsonArray = {};

let linesCases;
let linesCasesNew;
let linesRecoveries;
let linesDeaths;
let linesDeathsNew;

let intersected;

//let mesh;
let scene, camera, controls, renderer;


let scaleHeights = 0.0003;

THR.init();
THR.animate();

//init(); // see html



function init() {

	scene = THR.scene;
	camera = THR.camera;
	controls = THR.controls;
	renderer = THR.renderer;


	divMessageTitle.innerHTML = `<b>${ document.title } - ${ version.content }</b>`;

	const urlJsonStatesProvinces = pathAssets + "json/ne_50m_admin_1_states_provinces_lines.geojson";

	requestFile( urlJsonStatesProvinces, onLoadGeoJson );

	const urlJsonChina = pathAssets + "json/china.geojson";

	requestFile( urlJsonChina, onLoadGeoJson );

	const urlJson = pathAssets + "json/ne_110m_admin_0_countries_lakes.geojson";

	requestFile( urlJson, onLoadGeoJson );


	addLights();

	addGlobe();

	addSkyBox();

	getNotes();


	//document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	renderer.domElement.addEventListener( "mousedown", onDocumentMouseMove, false );
	renderer.domElement.addEventListener( "touchstart", onDocumentTouchStart, false );

}



function requestFile( url, callback ) {

	const xhr = new XMLHttpRequest();
	xhr.open( "GET", url, true );
	xhr.onerror = ( xhr ) => console.log( "error:", xhr );
	//xhr.onprogress = ( xhr ) => console.log( 'bytes loaded:', xhr.loaded );
	xhr.onload = callback;
	xhr.send( null );

}



function resetGroups () {

	scene.remove( group, groupCases, groupCasesNew, groupCasesNewGrounded, groupRecoveries, groupDeaths, groupDeathsNew, groupPlacards, groupLines );

	group = new THREE.Group();
	groupCases = new THREE.Group();
	groupCasesNew = new THREE.Group();
	groupCasesNewGrounded = new THREE.Group();
	groupDeaths = new THREE.Group();
	groupDeathsNew = new THREE.Group();
	groupRecoveries = new THREE.Group();
	groupPlacards = new THREE.Group();
	groupLines = new THREE.Group();

	scene.add( group, groupCases, groupCasesNew, groupCasesNewGrounded, groupRecoveries, groupDeaths, groupDeathsNew, groupPlacards, groupLines );

}




//////////

function toggleBars( group = groupCases ) {

	if ( group === window.groupPrevious ) {

		groupCases.visible = true;
		groupCasesNew.visible = true;
		groupDeaths.visible = true;
		groupDeathsNew.visible = true;
		groupRecoveries.visible = true;

		groupCasesNewGrounded.visible = false;

		group = undefined;

	} else {

		groupCases.visible = false;
		groupCasesNew.visible = false;
		groupDeaths.visible = false;
		groupDeathsNew.visible = false;
		groupRecoveries.visible = false;
		groupCasesNewGrounded.visible = false;

		group.visible = true;

	}

	groupPrevious = group;

}



function toggleNewCases ( group = groupCases ) {

	if ( group === groupPrevious ) {

		groupCases.visible = true;
		groupCasesNew.visible = true;
		groupDeaths.visible = true;
		groupDeathsNew.visible = true;
		groupRecoveries.visible = true;

		groupCasesNewGrounded.visible = false;

		group = undefined;

	} else {

		groupCases.visible = false;
		groupCasesNew.visible = false;
		groupDeaths.visible = false;
		groupDeathsNew.visible = false;
		groupRecoveries.visible = false;
		groupCasesNewGrounded.visible = true;
		if ( ! groupCasesNewGrounded.children.length ) {

			const heightsCasesNewGrounded = linesCases.slice( 1 ).map( line => + line[ line.length - 1 ] - line[ line.length - 2 ] );

			const meshesCasesNewGrounded = linesCases.slice( 1 ).map( ( line, index ) =>
				addBar( line[ 2 ], line[ 3 ], index, "cyan", 0.6, heightsCasesNewGrounded[ index ], 0, 12, 1, false ) );

			groupCasesNewGrounded.add( ...meshesCasesNewGrounded );

		}

	}

	groupPrevious = group;

}



function addBar( lat, lon, index, color = "red", radius = 0.4, height = 0, offset = 0, radialSegments = 12, heightSegments = 1, openEnded = true ) {

	//console.log( 'rad', radius );
	if ( ! height || height === 0 ) { return new THREE.Mesh(); }

	const heightScaled = scaleHeights * height;

	let p1 = THR.latLonToXYZ( 50 + ( offset + 0.5 * heightScaled ), lat, lon );
	let p2 = THR.latLonToXYZ( 100, lat, lon );

	let geometry = new THREE.CylinderGeometry( radius, radius, heightScaled, radialSegments, heightSegments, openEnded );
	geometry.applyMatrix4( new THREE.Matrix4().makeRotationX( -0.5 * Math.PI ) );
	let material = new THREE.MeshPhongMaterial( { color: color, side: 2 } );
	let mesh = new THREE.Mesh( geometry, material );
	mesh.position.copy( p1 );
	mesh.lookAt( p2 );
	mesh.userData = index;
	//mesh.name = rows[ index ][ 0 ];

	return mesh;

}



/////////

function displayStats ( totalsGlobal, totalsChina, totalsEurope, totalsUsa, totalsRow ) {

	// [text], scale, color, x, y, z )
	// groupPlacards.add( THR.drawPlacard( "Null Island", "0.01", 1, 80, 0, 0 ) );

	vGlo = THR.latLonToXYZ( 75, 65, -20 );
	groupPlacards.add( THR.drawPlacard( totalsGlobal, "0.02", 200, vGlo.x, vGlo.y, vGlo.z ) );

	vChi = THR.latLonToXYZ( 85, 50, 110 );
	groupPlacards.add( THR.drawPlacard( totalsChina, "0.02", 1, vChi.x, vChi.y, vChi.z ) );

	const vEur = THR.latLonToXYZ( 80, 60, 20 );
	groupPlacards.add( THR.drawPlacard( totalsEurope, "0.02", 120, vEur.x, vEur.y, vEur.z ) );

	const vUsa = THR.latLonToXYZ( 80, 40, -120 );
	groupPlacards.add( THR.drawPlacard( totalsUsa, "0.02", 60, vUsa.x, vUsa.y, vUsa.z ) );

	const vRow = THR.latLonToXYZ( 90, 30, 180 );
	groupPlacards.add( THR.drawPlacard( totalsRow, "0.02", 180, vRow.x, vRow.y, vRow.z ) );


	divStats.innerHTML = `
<details id=detStats >

	<summary><b>global data </b></summary>

	<p>
		${ totalsGlobal.join( "<br>" ).replace( /Global totals/, "<b>Global totals</b>" ) }
	</p>

	<p>
		${ totalsChina.join( "<br>" ).replace( /China/, "<b>China</b>" ) }
	</p>

	<p>
		${ totalsEurope.join( "<br>" ).replace( /Europe/, "<b>Europe</b>" ) }
	</p>

	<p>
		${ totalsUsa.join( "<br>" ).replace( /USA/, "<b>USA</b>" ) }
	</p>

	<p>
		${ totalsRow.join( "<br>" ).replace( /Rest of World/, "<b>Rest of World</b>" ) }
	</p>

</details>`;

	detStats.open = window.innerWidth > 640;

}



//////////

function getCountries () {

	let countries = linesCases.map( line => line[ 1 ] );

	countries = [ ...new Set( countries ) ];

	//console.log( 'countries', countries );

	const options = countries.map( country => `<option>${ country }</option>` );

	divCountries.innerHTML = `
<select id=selCountries onchange=getProvince(this.value) style=width:100%; >${ options }</select>
<div id=divProvinces > </div>
`;

}



function getProvince ( country ) {

	THR.controls.autoRotate = false;

	divMessage.hidden = true;
	divMessage.innerHTML = "";

	let provinces = linesCases.filter( line => line[ 1 ] === country );
	//console.log( 'provinces', provinces );


	if ( provinces[ 0 ][ 0 ] === "" ) {

		camera.position.copy( THR.latLonToXYZ( 70, provinces[ 0 ][ 2 ], provinces[ 0 ][ 3 ] ) );

		divProvinces.innerHTML = "";

	} else {

		const options = provinces.map( province => `<option>${ province[ 0 ] || province[ 1 ] }</option>` );

		divProvinces.innerHTML = `<p><select id=selProvinces onchange=getPlace(this.value) >${ options }</select></p>`;

	}
}



function getPlace ( province ) {

	const place = linesCases.find( line => line[ 0 ] === province );
	//console.log( 'place', place );

	camera.position.copy( THR.latLonToXYZ( 70, place[ 2 ], place[ 3 ] ) );


}



//////////

function getNotes () {

	divSettings.innerHTML = `<details id=detSettings ontoggle=getNotesContent() >

		<summary><b>notes & settings</b></summary>

		<div id=divNoteSettings ></div>

	</details>`;

}



function getNotesContent () {

	DMTdragParent.hidden = !DMTdragParent.hidden;

	divMessage.innerHTML = `

	<div >

		<p>
			<i>Why are there messages in the background?</i></p>
		<p>
			An early visitor to our tracker raised this issue
			"<a href="https://github.com/ladybug-tools/spider-covid-19-viz-3d/issues/5" target="_blank">Expressions of Hope</a>"<br>
			Oleg asked "I wonder if we could show positive tweets and expressions of hope and gratitude for the courage of health workers around the world."
		</p>

		<p>
			What you see is our first attempt to provide Oleg with some delight.<br>
			&bull; Zoom out then rotate. Trying to read the messages on a phone is a little guessing game.<br>
			&bull; The text is huge and leaves much white space. This is so you are not totally distracted while looking at the data.
		</p>

		<hr>

		<p>US States new cases data coming soon</p>

		<p>Black bar flare indicates high deaths to cases ratio.</p>

		<p>Cyan bar flare indicates rapid increase in new cases compared to number of previous cases.</p>

		<p>
			Not all populations and GDPs are reported.
		</p>

	</div>`;

}



//////////

function onDocumentTouchStart ( event ) {

	//event.preventDefault();

	event.clientX = event.touches[ 0 ].clientX;
	event.clientY = event.touches[ 0 ].clientY;

	onDocumentMouseMove( event );

}


function onDocumentMouseMove ( event ) {

	//event.preventDefault();

	const mouse = new THREE.Vector2();
	mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;

	const raycaster = new THREE.Raycaster();
	raycaster.setFromCamera( mouse, camera );

	const intersects = raycaster.intersectObjects( groupCases.children );

	if ( intersects.length > 0 ) {

		if ( intersected !== intersects[ 0 ].object ) {

			intersected = intersects[ 0 ].object;

			displayMessage();

		}

	} else {

		intersected = null;
		DMTdragParent.hidden = true;
		divMessage.innerHTML = "";

	}

}



function getBars2D ( arr ) {

	arr.reverse();

	const max = Math.max( ...arr );
	const scale = 100 / max;
	const dateStrings = linesCases[ 0 ].slice( 4 ).reverse();

	const bars = arr.map( ( item, index ) =>
		`<div style="background-color: cyan; color: black; margin-top:1px; height:1ch; width:${ scale * item }%;"
			title="date: ${ dateStrings[ index ] } new cases : ${ item.toLocaleString() }">&nbsp;</div>`
	).join( "" );

	return `<div style="background-color:pink;width:95%;"
		title="New cases per day. Latest at top.The curve you hope to see flatten!" >${ bars }
	</div>`;

}