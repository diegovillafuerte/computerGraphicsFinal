
function init() {
	var scene = new THREE.Scene(); //Create a scene

	var gui = new dat.GUI(); //Create a dat gui to interactivelly change parameters

	var enable_fog = false;

	if (enable_fog){
		scene.fog = new THREE.FogExp2(0xffffff, 0.2); //Add fog to the scene
	}


	var box = getBox(1,1,1); //Create a box 
	var plane = getPlane(20); // Create a plane
	plane.name = 'plane-1'; //Give a name to the plane
	var light = getLight(0xffffff,1); //Create a lightsource
	var sphere = getSphere(0.05);

	box.position.y = box.geometry.parameters.height/2; // Move the box up on the y axis by half of its height to make it appear on top of the plane
	plane.rotation.x = Math.PI/2; // Move the plane 90 degrees (pi/2 radians)
	light.position.y = 2;
	light.intensity = 2;

	gui.add(light, 'intensity', 0, 10);
	gui.add(light.position, 'y', 0,20);
	
	scene.add(box); // Add the mesh object to the scene
	scene.add(plane); //Add the plane object to the scene
	scene.add(light); // Add the light source to the scene
	light.add(sphere); // Add a sphere to the light object. With this I can see the "light bulb"

	var camera = new THREE.PerspectiveCamera( //Create a camera
		45, // Field of view
		window.innerWidth/window.innerHeight, // Ratio of the screen to be used
		1,  //Limit the closest an object can be to the camera to be rendered
		1000 //Limit how far can an object be from the camera and still be rendered
	);

	camera.position.x = 1;
	camera.position.y = 2;
	camera.position.z = 5;

	camera.lookAt(new THREE.Vector3(0,0,0));

	var renderer = new THREE.WebGLRenderer(); // Transofrms the 3d object into a 2d render of it
	renderer.setSize(window.innerWidth, window.innerHeight); // Ratio of the render
	renderer.setClearColor('rgb(120,120,120)');
	document.getElementById('webgl').appendChild(renderer.domElement); //Use the WebGL lib to render the object

	var controls = new THREE.OrbitControls(camera, renderer.domElement);

	update(renderer, scene, camera, controls); //Render the current image (perspective)

	return scene;
}

function getLight(color, intensity){
	var light = new THREE.PointLight(color,intensity);
	return light;
}

function getBox(w, h, d){
	var geometry = new THREE.BoxGeometry(w,h,d); //Create the shape of a cube

	var material = new THREE.MeshPhongMaterial({ //Define the characteristics of the material for the object
		color: 'rgb(120,120,120)'
	});

	var mesh = new THREE.Mesh(geometry, material); //Join the shape and the characteristics and create the mesh object

	return mesh;
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

	return mesh;
};

function update(renderer, scene, camera, controls){
	renderer.render(scene, camera);

	controls.update();	

	requestAnimationFrame(function(){
		update(renderer, scene, camera, controls);
	})
};

var scene = init();
