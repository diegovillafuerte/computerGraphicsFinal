
var raycaster, camera, mouse = { x : 0, y : 0 };


function init() {
	i = 0;

	var scene = new THREE.Scene(); //Create a scene

	var gui = new dat.GUI(); //Create a dat gui to interactivelly change parameters

	var numCubs = 10;
	var numCubesAux = numCubs + 1;

	var plane = getPlane(numCubesAux*3); // Create a plane
	plane.name = 'plane-1'; //Give a name to the plane
	var light = getDirectionalLight(0xffffff,1); //Create a lightsource
	var sphere = getSphere(0.05);
	//var box = getBox(1,1,1);
	var boxGrid = getBoxGrid(numCubesAux, 2);
	boxGrid.name = 'boxGrid';

	plane.rotation.x = Math.PI/2; // Move the plane 90 degrees (pi/2 radians)
	light.position.x = numCubesAux;
	light.position.y = numCubesAux/2;
	light.position.z = numCubesAux;
	light.intensity = 2;
	
	
	scene.add(plane); //Add the plane object to the scene
	scene.add(light); // Add the light source to the scene
	light.add(sphere); // Add a sphere to the light object. With this I can see the "light bulb"
	for (var g=0; g<boxGrid.length;g++){
		scene.add(boxGrid[g]);
	}
	

	gui.add(light, 'intensity', 0, 10);
	gui.add(light.position, 'y', 0,numCubesAux*2);
	gui.add(light.position, 'x', numCubesAux*-2,numCubesAux*2);
	gui.add(light.position, 'z', numCubesAux*-2,numCubesAux*2);

	camera = new THREE.PerspectiveCamera( //Create a camera
		45, // Field of view
		window.innerWidth/window.innerHeight, // Ratio of the screen to be used
		1,  //Limit the closest an object can be to the camera to be rendered
		1000 //Limit how far can an object be from the camera and still be rendered
	);

	camera.position.x = numCubesAux*2;
	camera.position.y = numCubesAux*2;
	camera.position.z = numCubesAux*2;

	camera.lookAt(new THREE.Vector3(0,0,0));


	var renderer = new THREE.WebGLRenderer(); // Transofrms the 3d object into a 2d render of it
	//renderer.shadowMap.enabled = true; //Enable the generation of shadows
	renderer.setSize(window.innerWidth, window.innerHeight); // Ratio of the render
	renderer.setClearColor('rgb(120,120,120)');
	document.getElementById('webgl').appendChild(renderer.domElement); //Use the WebGL lib to render the object

	raycaster = new THREE.Raycaster();
    renderer.domElement.addEventListener('click', raycast, false );

	var controls = new THREE.OrbitControls(camera, renderer.domElement);

	update(renderer, scene, camera, controls); //Render the current image (perspective)

	return scene;
}

function raycast ( e ) {

    //1. sets the mouse position with a coordinate system where the center
    //   of the screen is the origin
    mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;

    //2. set the picking ray from the camera position and mouse coordinates
    raycaster.setFromCamera( mouse, camera );    

    //3. compute intersections
    var intersects = raycaster.intersectObjects( scene.children );

    if(intersects.length>0){
	    console.log(intersects[0].object);
	    console.log(intersects[0].object.material.color);
	    var red3 = new THREE.Color( Math.random(), Math.random(), Math.random() );  // color cube
	    intersects[0].object.material.color = red3;
	    intersects[0].object.scale.y = intersects[0].object.scale.y + Math.random();
	    for ( var i = 0; i < intersects.length; i++ ) {
	        //console.log( intersects[ i ] ); 
	        /*
	            An intersection has the following properties :
	                - object : intersected object (THREE.Mesh)
	                - distance : distance from camera to intersection (number)
	                - face : intersected face (THREE.Face3)
	                - faceIndex : intersected face index (number)
	                - point : intersection point (THREE.Vector3)
	                - uv : intersection point in the object's UV coordinates (THREE.Vector2)
	        */
	    }
	    console.log(intersects.length)
	    return intersects[0].object
    }

    

}


function getDirectionalLight(color, intensity){
	var light = new THREE.DirectionalLight(color,intensity);
	light.castShadow = true;
	light.shadow.bias = 0.001;
	light.shadow.mapSize.width = 2048;
	light.shadow.mapSize.height = 2048;
	light.shadow.camera.left = -10;
	light.shadow.camera.bottom = -10;
	light.shadow.camera.right = 10;
	light.shadow.camera.top = 10;

	return light;
}

function getBox(w, h, d){
	var geometry = new THREE.BoxGeometry(w,h,d); //Create the shape of a cube

	var material = new THREE.MeshPhongMaterial({ //Define the characteristics of the material for the object
		color: 'rgb(120,120,120)'
	});

	var mesh = new THREE.Mesh(geometry, material); //Join the shape and the characteristics and create the mesh object
	mesh.castShadow = true;

	return mesh;
};

function getBoxGrid(numBoxes, separationBoxes){
	var group = new Array();

	for (var i=1;i<numBoxes;i++){
		for (var j=1;j<numBoxes;j++){
			if (i<=numBoxes/2){
				if (j<=numBoxes/2){
					var obj = getBox(1,Math.sqrt(j*i),1);
				}
				else{
					var obj = getBox(1,Math.sqrt((numBoxes-j)*i),1);
				}
				obj.position.x = i * separationBoxes;
				obj.position.y = obj.geometry.parameters.height/2;
				obj.position.z = j * separationBoxes;
				group.push(obj);
			}
			else{
				if (j<=numBoxes/2){
					var obj = getBox(1,Math.sqrt(j*(numBoxes-i)),1);
				}
				else{
					var obj = getBox(1,Math.sqrt((numBoxes-j)*(numBoxes-i)),1);
				}
				obj.position.x = i * separationBoxes;
				obj.position.y = obj.geometry.parameters.height/2;
				obj.position.z = j * separationBoxes;
				group.push(obj);
			}
		}
	}

	for(var h = 0;h<group.length;h++){
		group[h].position.x = group[h].position.x -(separationBoxes*(numBoxes))/2;
		group[h].position.z = group[h].position.z -(separationBoxes*(numBoxes))/2;
	}	


	return group;
};

function getSphere(size){
	var geometry = new THREE.SphereGeometry(size, 24, 24); //Create the shape of a cube

	var material = new THREE.MeshBasicMaterial({ //Define the characteristics of the material for the object
		color: 'rgb(255,255,255)'
	});

	var mesh = new THREE.Mesh(geometry, material); //Join the shape and the characteristics and create the mesh object

	return mesh;
};

function getPlane(size){
	var geometry = new THREE.PlaneGeometry(size, size); //Create the shape of a plane

	var material = new THREE.MeshPhongMaterial({ //Define the characteristics of the material for the object
		color: 'rgb(120,120,120)',
		side: THREE.DoubleSide
	});

	var mesh = new THREE.Mesh(geometry, material); //Join the shape and the characteristics and create the mesh object

	mesh.receiveShadow = true;

	return mesh;
};


function update(renderer, scene, camera, controls){
	renderer.render(scene, camera);

	//boxGrid = scene.getObjectByName('boxGrid');
	//boxGrid.scale.y = 1.001;
	/*boxGrid = scene.getObjectByName('boxGrid');
	boxGrid.children.forEach(function(child){
		child.scale.y = Math.random();
		child.position.y = child.geometry.parameters.height/2;
	});*/

	// Make the camera rotate around the scene
	/*camera.position.x = Math.cos(i)*20;
	camera.position.z = Math.sin(i)*20;
	i = i + Math.PI/180;*/

	controls.update();	

	requestAnimationFrame(function(){
		update(renderer, scene, camera, controls);
	})
};

var scene = init();
