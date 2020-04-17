/* global THREE, groupCasesWP, displayMessage, DMTdivHeader, DMTdivContent, DMTdivContainer, DMTdivParent, renderer, camera, group, txt */
// 2020-04-16

const DMT = {};

DMT.x = 0;
DMT.y = 0;

DMT.intersected = undefined;



DMT.init = function () {

	const div = document.body.appendChild( document.createElement( 'div' ) );
	div.id = "DMTdivPopUp";
	div.innerHTML = `
	<div id="DMTdivParent" >
		<div id="DMTdivHeader" style=font-size:2ch; >

			🕷
			<span onclick=DMTdivPopUp.hidden=true; style=float:right;z-index:20>[ x ]</span>

		</div>
		<div id="DMTdivContainer" >
			<div id=DMTdivContent >

				<p>lorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem. ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? quis autem vel eum iure reprehenderit, qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur?</p>

			</div>
		</div>
	</div>`;

	window.addEventListener( 'keydown', DMT.onStart );

	renderer.domElement.addEventListener( 'mousedown', DMT.onStart );
	//renderer.domElement.addEventListener( 'mousemove', DMT.onStart );
	renderer.domElement.addEventListener( 'wheel', DMT.onStart );

	renderer.domElement.addEventListener( 'touchstart', DMT.onStart );
	renderer.domElement.addEventListener( 'touchmove', DMT.onStart );
	renderer.domElement.addEventListener( 'touchend', DMT.onStart );

	DMTdivHeader.addEventListener( "mousedown", DMT.onMouseDown );

};


DMT.onStart = function () {

	window.removeEventListener( 'keydown', DMT.onStart );

	//renderer.domElement.removeEventListener( 'mousedown', DMT.onStart );
	//renderer.domElement.removeEventListener( 'mousemove', DMT.onStart );
	renderer.domElement.removeEventListener( 'wheel', DMT.onStart );

	renderer.domElement.removeEventListener( 'touchstart', DMT.onStart );
	renderer.domElement.removeEventListener( 'touchmove', DMT.onStart );
	renderer.domElement.removeEventListener( 'touchend', DMT.onStart );

	renderer.domElement.addEventListener( "mouseover", DMT.onEvent );
	renderer.domElement.addEventListener( "touchstart", DMT.onEvent );

	DMTdivPopUp.hidden = true;

	DMT.objects = group.children;

	DMT.onEvent(); // activates onMove

};



DMT.onEvent = function ( e ) {

	renderer.domElement.addEventListener( "touchstart", DMT.onMove );
	renderer.domElement.addEventListener( "touchmove", DMT.onMove );
	renderer.domElement.addEventListener( "touchend", DMT.onOut );
	renderer.domElement.addEventListener( "mousemove", DMT.onMove );
	renderer.domElement.addEventListener( "mouseout", DMT.onOut );

	DMT.onMove( e ); // activates touch

};



DMT.onMove = function ( e ) {

	if ( e ) {

		DMT.checkIntersect( e );

	}

};



DMT.onMouseOverOut = function () {

	renderer.domElement.removeEventListener( "touchmove", DMT.onMove );
	renderer.domElement.removeEventListener( "touchend", DMT.onOut );
	renderer.domElement.removeEventListener( "mousemove", DMT.onMove );
	renderer.domElement.removeEventListener( "mouseup", DMT.onOut );

};



DMT.checkIntersect = function ( event ) {

	if ( event.type === "touchmove" || event.type === "touchstart" ) {

		event.clientX = event.touches[ 0 ].clientX;
		event.clientY = event.touches[ 0 ].clientY;

	}

	const mouse = new THREE.Vector2();
	mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;

	const raycaster = new THREE.Raycaster();
	raycaster.setFromCamera( mouse, camera );

	const intersects = raycaster.intersectObjects( DMT.objects );

	DMT.intersects = intersects;

	if ( intersects.length > 0 ) {

		if ( DMT.intersected !== intersects[ 0 ].object ) {

			//console.log( "int", intersects[ 0 ] )

			DMT.intersected = intersects[ 0 ].object;

			DMTdivPopUp.hidden = false;
			DMTdivPopUp.style.left = event.clientX + "px";
			DMTdivPopUp.style.top = event.clientY + "px";
			//DMTdivContainer.scrollTop = 0;

			DMT.displayMessage();

		}

	} else {

		DMT.intersected = null;

		if ( event.type === "touchmove" || event.type === "touchstart" ) {

			DMTdivPopUp.hidden;

		}

	}

};



DMT.displayMessage = function () {

	console.log( "event", event );
	console.log( "DMT.intersects", DMT.intersects );

	DMTdivPopUp.innerHTML = `
	<div id="DMTdivIntersected" >
		<div>DOM x: ${ event.clientX }
		<div>DOM y: ${ event.clientY }
		<div>DOM time: ${ event.timeStamp.toLocaleString() } ms
		<div>Ray found ${ DMT.intersects.length }
		<div id=divTest><button onclick=DMT.getMorePopUp() >details ${ DMT.intersects.length } found</button>
		<div id=DMTdivMore ></button>
	</div>`;


};



DMT.getMorePopUp = function () {

	htm = DMT.intersects.map( ( obj, i ) => `
	<p>
		Object ${ i }: ${ obj.object.name }<br>
		distance: ${ obj.distance.toLocaleString() }<br>
		point: x${ obj.point.x.toLocaleString() }, y${ obj.point.y.toLocaleString() }, z${ obj.point.z.toLocaleString() }<br>
	</p>`
	).join( "" );

	DMTdivMore.innerHTML = `
	<div id="DMTdivMore">
		${ htm }
		<p>lorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem. ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? quis autem vel eum iure reprehenderit, qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur?</p>
	</div>`;

	maxHeight = ( window.innerHeight - DMTdivPopUp.offsetTop - DMTdivIntersected.clientHeight - 15 );
	console.log( "max", maxHeight );

	if ( DMTdivIntersected.clientHeight > maxHeight ) {

		DMTdivIntersected.style.height = maxHeight + "px";
		//DMTdivMore.offsetTop
	}
};



DMT.onMouseDown = function ( e ) {

	DMTdivHeader.addEventListener( "touchmove", DMT.onMouseDownMove );
	DMTdivHeader.addEventListener( "touchend", DMT.onMouseDownOut );
	DMTdivHeader.addEventListener( "mousemove", DMT.onMouseDownMove );
	DMTdivHeader.addEventListener( "mouseup", DMT.onMouseDownOut );

	DMT.onMouseDownMove( e ); // for touch

};



DMT.onMouseDownMove = function ( e ) {

	DMTdivPopUp.style.left = ( event.clientX - 15 ) + "px";
	DMTdivPopUp.style.top = ( event.clientY - 15 ) + "px";

};



DMT.onMouseDownOut = function () {

	DMTdivHeader.removeEventListener( "touchmove", DMT.onMouseDownMove );
	DMTdivHeader.removeEventListener( "touchend", DMT.onMouseDownOut );
	DMTdivHeader.removeEventListener( "mousemove", DMT.onMouseDownMove );
	DMTdivHeader.removeEventListener( "mouseup", DMT.onMouseDownOut );

};
