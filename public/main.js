
function init() {
	i = 0;
	var scene = new THREE.Scene(); //Create a scene

	var gui = new dat.GUI(); //Create a dat gui to interactivelly change parameters

	var plane = getPlane(30); // Create a plane
	plane.name = 'plane-1'; //Give a name to the plane
	var light = getDirectionalLight(0xffffff,1); //Create a lightsource
	var Ambientlight = getAmbientLight('rgb(10,20,30)',1);
	var sphere = getSphere(0.05);
	var boxGrid = getBoxGrid(10, 1.5);
	boxGrid.name = 'boxGrid';
	light.name = 'lightsource'

	plane.rotation.x = Math.PI/2; // Move the plane 90 degrees (pi/2 radians)
	light.position.x = 8;
	light.position.y = 4;
	light.position.z = 10;
	light.intensity = 2;
	
	
	scene.add(plane); //Add the plane object to the scene
	scene.add(light); // Add the light source to the scene
	scene.add(Ambientlight); //Add the ambient light to the scene
	light.add(sphere); // Add a sphere to the light object. With this I can see the "light bulb"
	scene.add(boxGrid);

	gui.add(light, 'intensity', 0, 10);
	gui.add(light.position, 'y', 0,10);
	gui.add(light.position, 'x', -10,10);
	gui.add(light.position, 'z', -10,10);
	//gui.add(light, 'penumbra', 0, 1);

	var camera = new THREE.PerspectiveCamera( //Create a camera
		45, // Field of view
		window.innerWidth/window.innerHeight, // Ratio of the screen to be used
		1,  //Limit the closest an object can be to the camera to be rendered
		1000 //Limit how far can an object be from the camera and still be rendered
	);

	camera.position.x = 10;
	camera.position.y = 10;
	camera.position.z = 10;

	camera.lookAt(new THREE.Vector3(0,0,0));

	var renderer = new THREE.WebGLRenderer(); // Transofrms the 3d object into a 2d render of it
	renderer.shadowMap.enabled = true; //Enable the generation of shadows
	renderer.setSize(window.innerWidth, window.innerHeight); // Ratio of the render
	renderer.setClearColor('rgb(120,120,120)');
	document.getElementById('webgl').appendChild(renderer.domElement); //Use the WebGL lib to render the object

	var controls = new THREE.OrbitControls(camera, renderer.domElement);

	update(renderer, scene, camera, controls); //Render the current image (perspective)

	return scene;
}

function getLight(color, intensity){
	var light = new THREE.PointLight(color,intensity);
	light.castShadow = true;
	return light;
}

function getSpotLight(color, intensity){
	var light = new THREE.SpotLight(color,intensity);
	light.castShadow = true;
	light.shadow.bias = 0.001;
	light.shadow.mapSize.width = 2048;
	light.shadow.mapSize.height = 2048;
	return light;
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

function getAmbientLight(color, intensity){
	var light = new THREE.AmbientLight(color,intensity);
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
	var group = new THREE.Group();

	for (var i=0;i<numBoxes;i++){
		for (var j=0;j<numBoxes;j++){
			///var obj = getBox(1,1,1);
			if (i<=numBoxes/2){
				if (j<=numBoxes/2)
					var obj = getBox(1,(j+i)/2,1);
				else
					var obj = getBox(1,(numBoxes-j)/2,1);
				obj.position.x = i * separationBoxes;
				obj.position.y = obj.geometry.parameters.height/2;
				obj.position.z = j * separationBoxes;
				group.add(obj);
			}
			else{
				if (j<=numBoxes/2)
					var obj = getBox(1,(j+i)/2,1);
				else
					var obj = getBox(1,(numBoxes-j)/2,1);
				obj.position.x = i * separationBoxes;
				obj.position.y = obj.geometry.parameters.height/2;
				obj.position.z = j * separationBoxes;
				group.add(obj);
			}
		}
	}

	group.position.x = -(separationBoxes*(numBoxes-1))/2;
	group.position.z = -(separationBoxes*(numBoxes-1))/2;

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

	/*var boxGrid = getObjectByName('boxGrid');
	boxGrid.children.forEach(function(child){
		child.scale.y = Math.random();
		child.position.y = child.scale.y/2;
	});*/

	/*var light = getObjectByName('lightsource');
	light.position.x = Math.cos(i)*20;
	light.position.z = Math.sin(i)*20;
	i = i + Math.PI/180;*/


	controls.update();	

	requestAnimationFrame(function(){
		update(renderer, scene, camera, controls);
	})
};

var scene = init();
