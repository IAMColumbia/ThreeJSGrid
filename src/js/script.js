import * as THREE from "three";
import { DoubleSide } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor("#89cfe8");
document.body.appendChild(renderer.domElement);
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, .1, 1000);
camera.position.set(10, 15, -22);
camera.updateProjectionMatrix();
const orbit = new OrbitControls(camera, renderer.domElement);
orbit.mouseButtons.RIGHT = THREE.MOUSE.ROTATE;
orbit.mouseButtons.LEFT = null;
renderer.setClearColor( {color: 0x000000});

const mousePos = new THREE.Vector3();
const raycaster = new THREE.Raycaster();
let intersects;

const ground = new THREE.PlaneGeometry(20, 20, 20, 20);
const wireFrameMat = new THREE.MeshBasicMaterial({side: DoubleSide, visible: false});
const groundMesh = new THREE.Mesh(ground, wireFrameMat);
groundMesh.name = 'ground';
groundMesh.rotateX(Math.PI / 2);
scene.add(groundMesh);

const grid = new THREE.GridHelper(20, 20);
scene.add(grid);

const highlight = new THREE.PlaneGeometry(1, 1, 1, 1);
const highlightMat = new THREE.MeshBasicMaterial({color: 0xffffff});
const highlightMesh = new THREE.Mesh(highlight, highlightMat);
highlightMesh.rotateX(-Math.PI / 2);
scene.add(highlightMesh);

const spawnObjectMat = new THREE.MeshBasicMaterial({color: 0x73d43b})

const sphere = new THREE.SphereGeometry(.5, 8, 8);
const sphereMesh = new THREE.Mesh(sphere, spawnObjectMat);
const box = new THREE.BoxGeometry(.5, .5);
const boxMesh = new THREE.Mesh(box, spawnObjectMat);
const cone = new THREE.ConeGeometry(.5, .5);
const coneMesh = new THREE.Mesh(cone, spawnObjectMat);
const capsule = new THREE.CapsuleGeometry(.5, .5);
const capsuleMesh = new THREE.Mesh(capsule, spawnObjectMat);
const torus = new THREE.TorusGeometry(.5, .5);
const torusMesh = new THREE.Mesh(torus, spawnObjectMat);

const objectsToSpawn = [ sphereMesh, boxMesh, coneMesh, capsuleMesh, torusMesh ];
const objects = [];




function animate(time)
{
    renderer.render(scene, camera);
}

function exists()
{
    return objects.find(function(object)
    {
        return (object.position.x === highlightMesh.position.x) &&
        (object.position.z === highlightMesh.position.z);
    });
}

renderer.setAnimationLoop(animate);

window.addEventListener("mousemove", function(e){
    mousePos.x = (e.clientX / this.window.innerWidth) * 2 - 1; 
    mousePos.y = -(e.clientY / this.window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mousePos, camera);
    intersects = raycaster.intersectObjects(scene.children);
    
    intersects.forEach(function(intersect)
    {
        if(intersect.object.name === 'ground')
        {
            const highlightPos = new THREE.Vector3().copy(intersect.point).floor().addScalar(0.5);
            highlightMesh.position.set(highlightPos.x, 0, highlightPos.z);
        }
    });

    if(!exists())
    { highlightMesh.material.color.setHex(0xffffff); }
    else
    { highlightMesh.material.color.setHex(0xff0000); }
});

function randomRange(min, max) { 
    return Math.random() * (max - min) + min;
}

window.addEventListener("mousedown", function(e)
{
    if(!exists())
    {
        intersects.forEach(function(intersect)
        {
            if(intersect.object.name === 'ground')
            {
                console.log("spawn");
                //const clone = objectsToSpawn[randomRange(0, objectsToSpawn.length - 1)].clone();
                let index = parseInt(randomRange(0, 5));
                const clone = objectsToSpawn[index].clone();
                clone.material = new THREE.MeshBasicMaterial({color: 0xFFFFFF * Math.random()})
                clone.position.copy(highlightMesh.position);
                clone.rotateX(Math.random() * Math.PI);
                clone.rotateZ(Math.random() * Math.PI);
                clone.position.setY(Math.random() * 2);

                scene.add(clone);
                objects.push(clone);
            }
        });
    }
});

window.addEventListener("resize", function()
{
    camera.aspect = this.window.innerWidth / this.window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(this.window.innerWidth, this.window.innerHeight);
});

window.addEventListener("newSize", () => {
    renderer.setSize(this.window.innerWidth, this.window.innerHeight);
    camera.aspect = this.window.innerWidth / this.window.innerHeight;
    camera.updateProjectionMatrix();
})