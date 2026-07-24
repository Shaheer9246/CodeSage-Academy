import type { NetworkingLesson, Concept, QuizQuestion } from './networkingLessons';

export interface Three3dLesson extends Omit<NetworkingLesson, 'practical'> {
  practical: NetworkingLesson['practical'] & {
    code?: {
      html?: string;
      css?: string;
      js?: string;
    };
  };
}

const lesson = (
  id: string,
  order: number,
  title: string,
  icon: string,
  philosophy: string,
  concepts: Concept[],
  practical: Three3dLesson['practical'],
  quiz: QuizQuestion[],
  keyTakeaways: string[]
): Three3dLesson => ({
  id,
  module: 'Module 1: 3D Web Development & Three.js',
  order,
  title,
  icon,
  philosophy,
  concepts,
  practical,
  quiz,
  keyTakeaways,
});

const q = (
  question: string,
  options: string[],
  correctIndex: number,
  explanation?: string
): QuizQuestion => ({ question, options, correctIndex, explanation });

export const THREE3D_LESSONS: Three3dLesson[] = [
  // Lesson 1
  lesson(
    'three-1',
    1,
    'Introduction to 3D on the Web',
    '🌐',
    'Before writing 3D code, understand how web browsers draw 3D. WebGL lets your graphics card render pixels, and Three.js makes talking to WebGL easy.',
    [
      {
        title: '1. What is WebGL?',
        beginner: 'WebGL is built into browsers to draw fast 2D and 3D graphics using your computer graphics card (GPU).',
        advanced: 'WebGL runs low-level shader programs directly on the GPU using OpenGL ES shading language (GLSL).'
      },
      {
        title: '2. Why Use Three.js?',
        beginner: 'Raw WebGL requires hundreds of lines of code for a simple cube. Three.js lets you do it in just a few lines.',
        advanced: 'Three.js provides high-level abstractions for scenes, cameras, renderers, lighting, materials, and loaders.'
      },
      {
        title: '3. The Core 3D Ingredients',
        beginner: 'To see anything in 3D, you always need three things: a Scene, a Camera, and a Renderer.',
        advanced: 'The Scene holds 3D objects, the Camera sets the viewpoint, and the Renderer calculates pixels on a HTML <canvas>.'
      },
      {
        title: '4. The Frame Loop',
        beginner: '3D scenes are like flipbooks. You redrawing the scene around 60 times every second to show movement.',
        advanced: 'requestAnimationFrame synchronizes the render cycle with the display screen refresh rate.'
      }
    ],
    {
      title: 'Your First 3D Scene',
      intro: 'Create a Three.js scene and render a basic canvas background.',
      steps: [
        'Create a Scene instance.',
        'Create a PerspectiveCamera.',
        'Create a WebGLRenderer.',
        'Append renderer element to document body and call render().'
      ],
      goal: 'Render a blank 3D canvas successfully.',
      code: {
        html: '<div id="canvas-container"></div>',
        css: 'body { margin: 0; background: #000; overflow: hidden; }\n#canvas-container { width: 100vw; height: 100vh; }',
        js: `// 1. Create Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111827);

// 2. Create Camera (FOV, Aspect Ratio, Near, Far)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// 3. Create Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 4. Draw scene
renderer.render(scene, camera);`
      }
    },
    [
      q('What tool enables browser 3D graphics using the GPU?', ['HTML5 Canvas', 'WebGL', 'CSS3D', 'Node.js'], 1),
      q('What are the 3 main ingredients needed in Three.js?', ['HTML, CSS, JS', 'Scene, Camera, Renderer', 'Mesh, Light, Shadow', 'Texture, UV, Shader'], 1),
      q('Why do we use requestAnimationFrame?', ['To fetch API data', 'To smooth out drawing frames', 'To play audio', 'To compress images'], 1),
      q('What does camera.position.z do?', ['Moves camera left/right', 'Moves camera up/down', 'Moves camera closer/further', 'Rotates camera'], 2)
    ],
    ['WebGL uses GPU power', 'Three.js simplifies WebGL', 'Scene + Camera + Renderer = 3D screen']
  ),

  // Lesson 2
  lesson(
    'three-2',
    2,
    '3D Objects & Meshes',
    '📦',
    'A 3D object on screen is called a Mesh. A Mesh combines a shape (Geometry) and a surface appearance (Material).',
    [
      {
        title: '1. What is Geometry?',
        beginner: 'Geometry is the wireframe skeleton or mathematical shape of a 3D object.',
        advanced: 'Geometry stores vertex positions, face normals, texture coordinates (UVs), and bounding volumes.'
      },
      {
        title: '2. What is Material?',
        beginner: 'Material is the skin or clothing that covers the shape, giving it color, shine, or texture.',
        advanced: 'Materials define shading models (unlit, Phong, PBR) and react to lights in the scene.'
      },
      {
        title: '3. What is a Mesh?',
        beginner: 'Mesh = Geometry + Material put together so it can be added to the scene.',
        advanced: 'A Mesh inherits from Object3D, holding transformation properties like position, rotation, and scale.'
      },
      {
        title: '4. Moving & Rotating',
        beginner: 'You can change an object position (x, y, z) and rotation (x, y, z) at any time.',
        advanced: 'Rotations are calculated in radians (Math.PI = 180 degrees) or via Quaternions to avoid gimbal lock.'
      }
    ],
    {
      title: 'Spinning 3D Cube',
      intro: 'Build a cube mesh and animate its rotation inside the animation loop.',
      steps: [
        'Create BoxGeometry(1, 1, 1).',
        'Create MeshBasicColor material.',
        'Combine into a Mesh and add to scene.',
        'In animate function, increase rotation.x and rotation.y.'
      ],
      goal: 'See a spinning 3D box on the screen.',
      code: {
        html: '',
        css: 'body { margin: 0; overflow: hidden; }',
        js: `const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create Cube Mesh
const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
const material = new THREE.MeshBasicMaterial({ color: 0x6366f1, wireframe: true });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 4;

// Render loop
function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();`
      }
    },
    [
      q('A 3D Mesh is made up of:', ['HTML and CSS', 'Geometry and Material', 'Light and Shadow', 'Camera and Viewport'], 1),
      q('Which property changes wireframe look in MeshBasicMaterial?', ['wireframe: true', 'grid: true', 'lines: true', 'skeleton: true'], 0),
      q('How many radians are in 180 degrees?', ['Math.PI / 2', 'Math.PI', 'Math.PI * 2', '360'], 1),
      q('Where should you put object movement code?', ['Inside HTML', 'Inside animation loop function', 'In CSS stylesheet', 'Inside index.html head'], 1)
    ],
    ['Mesh = Geometry + Material', 'Geometries define shape', 'Materials define look', 'Animate in requestAnimationFrame']
  ),

  // Lesson 3
  lesson(
    'three-3',
    3,
    'Built-in Geometries',
    '📐',
    'Three.js includes many pre-made 3D shapes ready to use out of the box like Spheres, Cylinders, and Planes.',
    [
      {
        title: '1. SphereGeometry',
        beginner: 'Creates a 3D ball. You control radius and how smooth it looks with segment numbers.',
        advanced: 'Segment counts (widthSegments, heightSegments) determine polygon count and render performance.'
      },
      {
        title: '2. PlaneGeometry',
        beginner: 'Creates a flat 2D sheet in 3D space, useful for floors or walls.',
        advanced: 'Planes default to facing the Z-axis, so rotating plane.rotation.x = -Math.PI / 2 lays it flat like a floor.'
      },
      {
        title: '3. CylinderGeometry & ConeGeometry',
        beginner: 'Creates tube, column, or cone shapes by setting top and bottom radiuses.',
        advanced: 'Can be opened at ends using openEnded parameter to build pipes or tunnels.'
      },
      {
        title: '4. TorusGeometry',
        beginner: 'Creates a ring or donut shape in 3D space.',
        advanced: 'TorusKnotGeometry generates complex interwoven 3D geometric shapes.'
      }
    ],
    {
      title: 'Build a 3D Shape Playground',
      intro: 'Create multiple different geometric shapes side-by-side.',
      steps: [
        'Create a Sphere on the left.',
        'Create a Box in the center.',
        'Create a Torus on the right.',
        'Animate all three objects in the loop.'
      ],
      goal: 'Understand how different 3D shapes behave.',
      code: {
        html: '',
        css: 'body { margin: 0; overflow: hidden; background: #0f172a; }',
        js: `const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const mat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true });

// Sphere
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.8, 16, 16), mat);
sphere.position.x = -2.5;

// Box
const box = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 1.2), mat);

// Torus (Donut)
const torus = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.3, 12, 30), mat);
torus.position.x = 2.5;

scene.add(sphere, box, torus);
camera.position.z = 5;

function animate() {
  requestAnimationFrame(animate);
  sphere.rotation.y += 0.01;
  box.rotation.x += 0.01;
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();`
      }
    },
    [
      q('Which shape creates a 3D donut?', ['SphereGeometry', 'CylinderGeometry', 'TorusGeometry', 'CircleGeometry'], 2),
      q('What happens if you increase sphere segments?', ['Color gets brighter', 'Shape gets smoother with more polygons', 'Shape turns into cube', 'It renders faster'], 1),
      q('Which geometry is best for a flat ground floor?', ['PlaneGeometry', 'BoxGeometry', 'RingGeometry', 'TetrahedronGeometry'], 0),
      q('How do you lay a flat plane down like a floor?', ['Rotate X by -Math.PI / 2', 'Rotate Z by 180', 'Set position.z = -10', 'Scale Y to 0'], 0)
    ],
    ['Spheres use segments for smoothness', 'Planes make floors/walls', 'Torus makes ring/donut shapes']
  ),

  // Lesson 4
  lesson(
    'three-4',
    4,
    'Materials & Surface Styles',
    '🎨',
    'Materials determine how surfaces look and how light bounces off objects.',
    [
      {
        title: '1. MeshBasicMaterial',
        beginner: 'Simple flat color material. It ignores lights completely and is fast to render.',
        advanced: 'Does not calculate light reflections or shadows. Great for basic UI or wireframe previews.'
      },
      {
        title: '2. MeshLambertMaterial & MeshPhongMaterial',
        beginner: 'Materials that need light to be seen. MeshPhong shows shiny plastic-like highlights.',
        advanced: 'MeshLambert uses per-vertex shading (fast), while Phong calculates specular highlights per-pixel.'
      },
      {
        title: '3. MeshStandardMaterial (PBR)',
        beginner: 'Modern standard realistic material. Uses rough and metallic controls like real-world items.',
        advanced: 'Physically Based Rendering (PBR) uses roughness and metalness parameters for real lighting physics.'
      },
      {
        title: '4. Opacity & Transparency',
        beginner: 'To make glass or transparent items, set transparent: true and adjust opacity.',
        advanced: 'Requires transparent: true flag; depth writing and blending modes can be configured.'
      }
    ],
    {
      title: 'Compare Material Realism',
      intro: 'Observe how lighting changes standard realistic materials compared to basic materials.',
      steps: [
        'Add an AmbientLight and DirectionalLight.',
        'Create a MeshStandardMaterial sphere.',
        'Adjust roughness and metalness values.'
      ],
      goal: 'See realistic shiny metal and smooth plastic reflections.',
      code: {
        html: '',
        css: 'body { margin: 0; overflow: hidden; background: #000; }',
        js: `const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lights are required for Standard Material
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
dirLight.position.set(5, 5, 5);
scene.add(ambientLight, dirLight);

// Shiny Metal Sphere
const shinyMat = new THREE.MeshStandardMaterial({
  color: 0xec4899,
  roughness: 0.1,
  metalness: 0.9
});
const sphere = new THREE.Mesh(new THREE.SphereGeometry(1.2, 32, 32), shinyMat);
scene.add(sphere);

camera.position.z = 4;

function animate() {
  requestAnimationFrame(animate);
  sphere.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();`
      }
    },
    [
      q('Which material IGNORES scene lighting?', ['MeshStandardMaterial', 'MeshBasicMaterial', 'MeshPhongMaterial', 'MeshPhysicalMaterial'], 1),
      q('What material model is standard for modern realistic 3D graphics?', ['PBR (Physically Based Rendering)', 'Flat Shading', 'Wireframe Rendering', 'Raytracing'], 0),
      q('To make a material semi-transparent, you must set:', ['opacity: 0.5 and transparent: true', 'alpha: 50', 'visible: false', 'clear: true'], 0),
      q('Low roughness value (e.g. 0.1) creates:', ['A dull rough surface', 'A shiny smooth surface', 'A invisible surface', 'A wireframe surface'], 1)
    ],
    ['MeshBasic ignores light', 'MeshStandard uses PBR realism', 'Roughness/Metalness control shine', 'Set transparent: true for glass opacity']
  ),

  // Lesson 5
  lesson(
    'three-5',
    5,
    'Lighting the Scene',
    '💡',
    'Without lights, realistic 3D materials appear pitch black. Lighting creates depth, shadows, and atmosphere.',
    [
      {
        title: '1. AmbientLight',
        beginner: 'Soft light coming from every direction equally. Softens harsh black shadows.',
        advanced: 'Provides global illumination offset. Cannot cast directional shadows.'
      },
      {
        title: '2. DirectionalLight',
        beginner: 'Parallel light rays like sunlight from far away.',
        advanced: 'Simulates distant light sources. Uses a target vector and supports shadow mapping.'
      },
      {
        title: '3. PointLight',
        beginner: 'Light emitting from a single point in all directions like a light bulb or firefly.',
        advanced: 'Has decay and distance parameters controlling light attenuation over space.'
      },
      {
        title: '4. SpotLight',
        beginner: 'Cone-shaped light like a flashlight or stage light.',
        advanced: 'Includes angle, penumbra (edge softness), and target controls.'
      }
    ],
    {
      title: '3-Point Studio Lighting',
      intro: 'Set up key, fill, and rim lights to highlight a 3D object like a studio setup.',
      steps: [
        'Add main bright DirectionalLight (Key Light).',
        'Add dim AmbientLight (Fill Light).',
        'Add colored PointLight behind the object (Rim Light).'
      ],
      goal: 'Produce professional studio lighting effects.',
      code: {
        html: '',
        css: 'body { margin: 0; overflow: hidden; background: #050505; }',
        js: `const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Key Light
const keyLight = new THREE.DirectionalLight(0xffffff, 2);
keyLight.position.set(3, 3, 3);
scene.add(keyLight);

// Fill Light (Soft Blue)
const fillLight = new THREE.AmbientLight(0x1e3a8a, 1);
scene.add(fillLight);

// Rim Light (Cyan backlight)
const rimLight = new THREE.PointLight(0x06b6d4, 4, 10);
rimLight.position.set(-3, -1, -2);
scene.add(rimLight);

// Object
const mat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
const torusKnot = new THREE.Mesh(new THREE.TorusKnotGeometry(1, 0.3, 100, 16), mat);
scene.add(torusKnot);

camera.position.z = 4.5;

function animate() {
  requestAnimationFrame(animate);
  torusKnot.rotation.x += 0.005;
  torusKnot.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();`
      }
    },
    [
      q('Which light mimics sunlight?', ['PointLight', 'DirectionalLight', 'AmbientLight', 'RectAreaLight'], 1),
      q('Which light shines equally everywhere without directional shadows?', ['SpotLight', 'AmbientLight', 'PointLight', 'DirectionalLight'], 1),
      q('PointLight acts like a:', ['Flashlight cone', 'Sun from infinite distance', 'Light bulb radiating in all directions', 'Soft sky color'], 2),
      q('What happens to MeshStandardMaterial without lights?', ['Renders white', 'Renders wireframe', 'Appears completely black', 'Throws an error'], 2)
    ],
    ['Ambient illuminates everywhere', 'Directional = Sun', 'PointLight = Light bulb', 'Multiple lights add depth']
  ),

  // Lesson 6
  lesson(
    'three-6',
    6,
    'Camera Controls & Interactivity',
    '🎥',
    'Allow users to rotate, pan, and zoom around your 3D world using mouse or touch controls.',
    [
      {
        title: '1. OrbitControls',
        beginner: 'Official helper tool allowing users to drag-rotate around a target point.',
        advanced: 'OrbitControls updates camera position and rotation automatically based on mouse drag/scroll.'
      },
      {
        title: '2. Damping (Smooth Movement)',
        beginner: 'Adds weight and inertia so camera movement glides smoothly to a stop.',
        advanced: 'Requires enableDamping = true and calling controls.update() inside the render loop.'
      },
      {
        title: '3. Resizing the Window',
        beginner: 'When browser window size changes, update camera aspect ratio and renderer size.',
        advanced: 'Update camera.aspect = width / height, call camera.updateProjectionMatrix(), and renderer.setSize().'
      },
      {
        title: '4. Raycasting (Clicking 3D Objects)',
        beginner: 'Detects which 3D object the user clicked on screen using a virtual mouse laser beam.',
        advanced: 'Raycaster calculates intersection vectors between screen coordinates and 3D scene meshes.'
      }
    ],
    {
      title: 'Interactive 3D Scene',
      intro: 'Enable OrbitControls and smooth window resize handling.',
      steps: [
        'Attach THREE.OrbitControls (or OrbitControls helper script).',
        'Enable damping for smooth sliding.',
        'Add window resize event listener.'
      ],
      goal: 'Freely rotate and zoom around a 3D scene with mouse controls.',
      code: {
        html: '<script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>',
        css: 'body { margin: 0; overflow: hidden; background: #0f172a; }',
        js: `const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add OrbitControls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Add Objects
const grid = new THREE.GridHelper(10, 10, 0x38bdf8, 0x334155);
scene.add(grid);

const box = new THREE.Mesh(
  new THREE.BoxGeometry(1.5, 1.5, 1.5),
  new THREE.MeshNormalMaterial()
);
box.position.y = 0.75;
scene.add(box);

camera.position.set(3, 3, 5);

// Resize Handler
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
  requestAnimationFrame(animate);
  controls.update(); // needed for damping
  renderer.render(scene, camera);
}
animate();`
      }
    },
    [
      q('What does OrbitControls allow users to do?', ['Edit code in 3D', 'Rotate, pan, and zoom camera with mouse', 'Play sound effects', 'Speed up GPU'], 1),
      q('What function MUST be called after updating camera aspect ratio on window resize?', ['camera.updateProjectionMatrix()', 'camera.reset()', 'renderer.reload()', 'scene.refresh()'], 0),
      q('What does enableDamping = true do?', ['Slows down computer', 'Adds smooth physics momentum to camera movement', 'Locks camera position', 'Disables zooming'], 1),
      q('What tool detects mouse clicks on 3D meshes?', ['Raycaster', 'PointLight', 'BoundingBox', 'MeshNormal'], 0)
    ],
    ['OrbitControls adds mouse control', 'Enable damping for smooth movement', 'Handle resize events', 'Raycaster detects clicks']
  )
  },

  // Lesson 7
  lesson(
    'three-7',
    7,
    'Animating 3D Objects with GSAP',
    '🎬',
    'While basic math loops work for continuous spinning, GSAP (GreenSock) lets you craft complex, smooth 3D animations, camera sweeps, and elastic bounces with simple code.',
    [
      {
        title: '1. Why GSAP with Three.js?',
        beginner: 'GSAP handles timing, easing, and smooth transitions automatically so you do not have to write math formulas.',
        advanced: 'GSAP directly mutates properties like position.x, rotation.y, and scale.z frame-by-frame with high performance.'
      },
      {
        title: '2. Animating 3D Coordinates',
        beginner: 'You target specific object axes like cube.position or cube.rotation in your GSAP tween.',
        advanced: 'Example: gsap.to(mesh.position, { x: 2, duration: 1.5, ease: "power2.out" }).'
      },
      {
        title: '3. Easing & Bounces',
        beginner: 'Easing changes how an object starts and stops, making movements feel natural or bouncy.',
        advanced: 'Popular eases include "bounce.out", "elastic.out(1, 0.3)", and "power3.inOut".'
      },
      {
        title: '4. Animation Timelines',
        beginner: 'Timelines let you chain multiple animations one after another in order.',
        advanced: 'gsap.timeline() manages sequence offsets and synchronized multi-property tweens.'
      }
    ],
    {
      title: 'GSAP Bouncing 3D Cube',
      intro: 'Use GSAP to animate a 3D box bouncing and rotating smoothly.',
      steps: [
        'Create a standard box mesh.',
        'Use gsap.to() on box.position.y with bounce easing.',
        'Animate box.rotation.y simultaneously.'
      ],
      goal: 'Create smooth elastic 3D animation using GSAP.',
      code: {
        html: '',
        css: 'body { margin: 0; overflow: hidden; background: #0f172a; }',
        js: `const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const light = new THREE.DirectionalLight(0xffffff, 2);
light.position.set(2, 4, 3);
scene.add(light, new THREE.AmbientLight(0xffffff, 0.5));

const mesh = new THREE.Mesh(
  new THREE.BoxGeometry(1.2, 1.2, 1.2),
  new THREE.MeshStandardMaterial({ color: 0x6366f1, roughness: 0.2 })
);
scene.add(mesh);

camera.position.z = 4;

// GSAP Animation Loop
gsap.to(mesh.position, {
  y: 1.5,
  duration: 1.2,
  repeat: -1,
  yoyo: true,
  ease: "bounce.out"
});

gsap.to(mesh.rotation, {
  y: Math.PI * 2,
  duration: 2.4,
  repeat: -1,
  ease: "none"
});

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();`
      }
    },
    [
      q('What is the main benefit of using GSAP with Three.js?', ['Creates 3D models automatically', 'Simplifies smooth property animations and easing', 'Generates HTML canvas tags', 'Speeds up image loading'], 1),
      q('How do you target an object\'s height in a GSAP tween?', ['gsap.to(mesh.position, { y: 2 })', 'gsap.to(mesh, { top: 200 })', 'gsap.to(mesh, { height: 2 })', 'gsap.to(mesh.geometry, { y: 2 })'], 0),
      q('What does the "yoyo: true" option do in GSAP?', ['Deletes the object', 'Plays the animation forward and then in reverse', 'Spins the camera', 'Shakes the screen'], 1),
      q('Which easing makes an object drop and rebound like a rubber ball?', ['power1.in', 'none', 'bounce.out', 'linear'], 2)
    ],
    ['GSAP animates position/rotation/scale', 'Use easing for natural motion', 'yoyo: true plays forward and back', 'Timelines chain sequence steps']
  ),

  // Lesson 8
  lesson(
    'three-8',
    8,
    'Textures & Surface Materials',
    '🖼️',
    'Plain colors look flat. Textures wrap image files onto 3D objects to add wood, brick, metal, or custom artwork surfaces.',
    [
      {
        title: '1. TextureLoader',
        beginner: 'Three.js utility that loads image files (PNG/JPG) and turns them into 3D textures.',
        advanced: 'const texture = new THREE.TextureLoader().load("path/to/image.jpg");'
      },
      {
        title: '2. Map (Color Texture)',
        beginner: 'The main color image wrapped over the geometry surface like wallpaper.',
        advanced: 'Applied via the `map` property on materials like MeshStandardMaterial.'
      },
      {
        title: '3. Procedural Canvas Textures',
        beginner: 'You can generate custom patterns on an HTML <canvas> and use it as a 3D texture.',
        advanced: 'THREE.CanvasTexture uses any 2D canvas context as a dynamic texture source.'
      },
      {
        title: '4. Texture Tiling & Repeat',
        beginner: 'Repeat textures across large floors or walls so they do not stretch.',
        advanced: 'Set texture.wrapS = texture.wrapT = THREE.RepeatWrapping and modify texture.repeat.set(x, y).'
      }
    ],
    {
      title: 'Canvas-Generated Dynamic Texture',
      intro: 'Create a custom procedural pattern on an HTML canvas and apply it as a 3D texture.',
      steps: [
        'Draw a striped canvas pattern.',
        'Pass the canvas to THREE.CanvasTexture.',
        'Apply texture to a MeshStandardMaterial cube.'
      ],
      goal: 'Wrap a dynamic custom texture around a 3D object.',
      code: {
        html: '',
        css: 'body { margin: 0; overflow: hidden; background: #000; }',
        js: `const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

scene.add(new THREE.AmbientLight(0xffffff, 0.8));
const light = new THREE.DirectionalLight(0xffffff, 1.5);
light.position.set(3, 3, 3);
scene.add(light);

// Create 2D Canvas Pattern
const canvas = document.createElement('canvas');
canvas.width = 256; canvas.height = 256;
const ctx = canvas.getContext('2d');
ctx.fillStyle = '#ec4899';
ctx.fillRect(0, 0, 256, 256);
ctx.fillStyle = '#1e1b4b';
ctx.fillRect(32, 32, 192, 192);
ctx.fillStyle = '#38bdf8';
ctx.font = 'bold 36px sans-serif';
ctx.fillText('3D TEXTURE', 38, 140);

// Convert Canvas to Three.js Texture
const texture = new THREE.CanvasTexture(canvas);

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1.8, 1.8, 1.8),
  new THREE.MeshStandardMaterial({ map: texture, roughness: 0.3 })
);
scene.add(cube);

camera.position.z = 4;

function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.008;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();`
      }
    },
    [
      q('What tool loads images into Three.js textures?', ['ImageBuffer', 'TextureLoader', 'MeshLoader', 'FileStream'], 1),
      q('Which material property holds the main color image?', ['map', 'skin', 'colorImage', 'textureMap'], 0),
      q('How can you create dynamic runtime textures without external image files?', ['CanvasTexture using HTML5 Canvas', 'SVG inline code', 'CSS gradients', 'JSON files'], 0),
      q('What texture setting lets images repeat across a floor mesh?', ['texture.repeat.set() and RepeatWrapping', 'texture.stretch = true', 'texture.multiply()', 'texture.loop()'], 0)
    ],
    ['TextureLoader handles PNG/JPG files', 'map property applies color textures', 'CanvasTexture creates runtime patterns', 'RepeatWrapping enables tiling']
  ),

  // Lesson 9
  lesson(
    'three-9',
    9,
    'Loading 3D Models (GLTF & GLB)',
    '🗿',
    '3D artists create complex models in software like Blender. GLTF/GLB is the standard format for loading ready-made 3D assets into web apps.',
    [
      {
        title: '1. What is GLTF / GLB?',
        beginner: 'GLTF is the "JPEG of 3D". It packs models, materials, textures, and animations into compact files.',
        advanced: 'GLB is the binary version of GLTF, containing all geometry and embedded texture data in one file.'
      },
      {
        title: '2. GLTFLoader',
        beginner: 'The Three.js addon that reads `.gltf` or `.glb` files and adds them to your scene.',
        advanced: 'loader.load(url, (gltf) => scene.add(gltf.scene)) asynchronously fetches and parses the asset.'
      },
      {
        title: '3. Traversing Models',
        beginner: 'A loaded model is a group of smaller meshes. You can inspect or change all parts at once.',
        advanced: 'model.traverse((child) => { if (child.isMesh) child.castShadow = true; }) updates nested meshes.'
      },
      {
        title: '4. Model Animations',
        beginner: 'Many 3D models come with built-in character movements (walking, jumping).',
        advanced: 'AnimationMixer plays clip animations bundled inside `gltf.animations`.'
      }
    ],
    {
      title: 'Inspect & Configure Model Code',
      intro: 'Understand the syntax for loading external 3D models with GLTFLoader.',
      steps: [
        'Import GLTFLoader script.',
        'Instantiate loader and call loader.load().',
        'Add gltf.scene to your scene.'
      ],
      goal: 'Master GLTFLoader setup pattern.',
      code: {
        html: '<script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js"></script>',
        css: 'body { margin: 0; overflow: hidden; background: #0f172a; }',
        js: `const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

scene.add(new THREE.AmbientLight(0xffffff, 1));
const dirLight = new THREE.DirectionalLight(0xffffff, 2);
dirLight.position.set(5, 5, 5);
scene.add(dirLight);

// Fallback visual shape representing model container
const placeholder = new THREE.Mesh(
  new THREE.CylinderGeometry(0.8, 0.8, 1.8, 16),
  new THREE.MeshStandardMaterial({ color: 0x38bdf8 })
);
scene.add(placeholder);

camera.position.set(0, 1, 4);

// GLTFLoader usage structure:
// const loader = new THREE.GLTFLoader();
// loader.load('model.glb', (gltf) => {
//   scene.add(gltf.scene);
// });

function animate() {
  requestAnimationFrame(animate);
  placeholder.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();`
      }
    },
    [
      q('What is known as the "JPEG of 3D" for web applications?', ['OBJ', 'FBX', 'GLTF / GLB', 'STL'], 2),
      q('Which loader component loads `.glb` files into Three.js?', ['GLTFLoader', 'ObjLoader', 'AssetLoader', 'ModelStreamer'], 0),
      q('How do you modify all nested meshes inside a loaded 3D model group?', ['model.selectAll()', 'model.traverse()', 'model.filter()', 'model.children.map()'], 1),
      q('Where are pre-made character animations stored inside a loaded GLTF object?', ['gltf.animations', 'gltf.videos', 'gltf.actions', 'gltf.keyframes'], 0)
    ],
    ['GLTF/GLB is standard web 3D format', 'GLTFLoader handles asynchronous loading', 'model.traverse iterates through nested meshes', 'AnimationMixer plays embedded clip movements']
  ),

  // Lesson 10
  lesson(
    'three-10',
    10,
    'Shadows & Realism',
    '👤',
    'Shadows anchor objects to the environment. Without shadows, floating 3D objects look ungrounded and fake.',
    [
      {
        title: '1. Enable Shadows on Renderer',
        beginner: 'Shadows are turned off by default for speed. Turn them on via renderer.shadowMap.enabled = true.',
        advanced: 'renderer.shadowMap.type = THREE.PCFSoftShadowMap provides smooth shadow edges.'
      },
      {
        title: '2. Light Shadow Setup',
        beginner: 'Only specific lights (Directional, Point, Spot) can cast shadows.',
        advanced: 'Set light.castShadow = true and configure light.shadow.mapSize width and height.'
      },
      {
        title: '3. Mesh Shadow Flags',
        beginner: 'You must specify which objects throw shadows and which objects catch shadows.',
        advanced: 'Set mesh.castShadow = true for obstacles and mesh.receiveShadow = true for ground floors.'
      },
      {
        title: '4. Performance Tip',
        beginner: 'Every shadow-casting light slows down rendering; use only 1 or 2 shadow lights.',
        advanced: 'Shadow maps render the scene from light position into extra framebuffer textures.'
      }
    ],
    {
      title: 'Real-time Shadow Scene',
      intro: 'Configure light and floor shadows for realistic depth.',
      steps: [
        'Enable renderer shadowMap.',
        'Set light.castShadow = true.',
        'Set sphere.castShadow = true and floor.receiveShadow = true.'
      ],
      goal: 'See realistic real-time soft shadows cast on the floor.',
      code: {
        html: '',
        css: 'body { margin: 0; overflow: hidden; background: #000; }',
        js: `const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
// 1. Enable Renderer Shadow Map
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

scene.add(new THREE.AmbientLight(0xffffff, 0.4));

// 2. Setup Shadow Light
const light = new THREE.DirectionalLight(0xffffff, 1.5);
light.position.set(3, 5, 2);
light.castShadow = true;
light.shadow.mapSize.width = 1024;
light.shadow.mapSize.height = 1024;
scene.add(light);

// Floor (Receives Shadow)
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({ color: 0x334155 })
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -1;
floor.receiveShadow = true;
scene.add(floor);

// Sphere (Casts Shadow)
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.2 })
);
sphere.castShadow = true;
scene.add(sphere);

camera.position.set(0, 2, 5);
camera.lookAt(0, 0, 0);

let clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();
  sphere.position.y = Math.sin(t * 3) * 0.5 + 0.5; // bouncing
  renderer.render(scene, camera);
}
animate();`
      }
    },
    [
      q('Which property turns on shadow calculation in the WebGLRenderer?', ['renderer.shadows = true', 'renderer.shadowMap.enabled = true', 'renderer.enableDepth = true', 'renderer.darkness = 1'], 1),
      q('Which light type CANNOT cast shadows?', ['DirectionalLight', 'SpotLight', 'AmbientLight', 'PointLight'], 2),
      q('To cast a shadow on the floor, what flag must be on the moving object?', ['receiveShadow = true', 'castShadow = true', 'opaque = true', 'visible = true'], 1),
      q('What flag must be set on the ground floor to show the shadow?', ['receiveShadow = true', 'castShadow = true', 'floor = true', 'ground = true'], 0)
    ],
    ['Enable renderer.shadowMap.enabled', 'Use castShadow on moving objects', 'Use receiveShadow on floor planes', 'Keep shadow light counts low for performance']
  ),

  // Lesson 11
  lesson(
    'three-11',
    11,
    'Particle Systems & Performance',
    '✨',
    'Creating thousands of separate 3D meshes will freeze the browser. Particle systems render thousands of points efficiently in a single drawing call.',
    [
      {
        title: '1. Why Use Particles?',
        beginner: 'Particles make snow, rain, dust, stars, and spark effects effortlessly.',
        advanced: 'A particle system uses a single GPU draw call for thousands of points.'
      },
      {
        title: '2. THREE.BufferGeometry',
        beginner: 'Stores thousands of particle (x, y, z) coordinates in a fast lightweight array.',
        advanced: 'Populates a Float32Array containing contiguous x,y,z vertex position attribute buffer data.'
      },
      {
        title: '3. THREE.Points & PointsMaterial',
        beginner: 'Special material that draws dots/sprites at every coordinate in the geometry.',
        advanced: 'PointsMaterial supports size, sizeAttenuation, transparent, and custom alphaMap textures.'
      },
      {
        title: '4. Disposal & Memory Cleanup',
        beginner: 'Always clean up old geometries and materials when removing items to prevent memory leaks.',
        advanced: 'Call geometry.dispose() and material.dispose() when objects are removed from scene.'
      }
    ],
    {
      title: '3D Floating Starfield',
      intro: 'Generate 1,000 particle points floating in 3D space.',
      steps: [
        'Create a Float32Array with 3,000 random numbers (1,000 points x 3 coordinates).',
        'Attach positions buffer to BufferGeometry.',
        'Render with THREE.Points.'
      ],
      goal: 'Build a smooth 60 FPS 3D particle starfield.',
      code: {
        html: '',
        css: 'body { margin: 0; overflow: hidden; background: #030712; }',
        js: `const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create 1000 Particles
const count = 1000;
const positions = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 10;
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const material = new THREE.PointsMaterial({
  size: 0.04,
  color: 0x38bdf8,
  transparent: true,
  opacity: 0.8
});

const starfield = new THREE.Points(geometry, material);
scene.add(starfield);

camera.position.z = 3;

function animate() {
  requestAnimationFrame(animate);
  starfield.rotation.y += 0.002;
  starfield.rotation.x += 0.001;
  renderer.render(scene, camera);
}
animate();`
      }
    },
    [
      q('Why are particle systems faster than creating 1,000 individual meshes?', ['They run without WebGL', 'They render all points using a single GPU draw call', 'They don\'t require a camera', 'They use less HTML'], 1),
      q('Which geometry class stores raw coordinate arrays for fast particle rendering?', ['BufferGeometry', 'BoxGeometry', 'ShapeGeometry', 'ArrayGeometry'], 0),
      q('What object combines BufferGeometry with PointsMaterial?', ['THREE.Points', 'THREE.Mesh', 'THREE.Line', 'THREE.Group'], 0),
      q('How do you free up GPU memory when deleting a geometry?', ['geometry.dispose()', 'geometry.delete()', 'geometry.clear()', 'scene.remove() only'], 0)
    ],
    ['Particles use single draw calls', 'BufferGeometry holds Float32Arrays', 'THREE.Points draws point sprites', 'Call .dispose() to prevent memory leaks']
  )

// Lesson 12
  lesson(
    'three-12',
    12,
    'React Three Fiber (R3F) Basics',
    '⚛️',
    'React Three Fiber brings Three.js into the React ecosystem. Instead of writing long imperative code, you write clean, re-usable React component tags.',
    [
      {
        title: '1. What is React Three Fiber (R3F)?',
        beginner: 'R3F is a React renderer for Three.js. Anything you can build in Three.js, you can write as a React tag.',
        advanced: 'R3F converts JSX tags directly to Three.js objects without adding overhead or performance loss.'
      },
      {
        title: '2. The <Canvas> Component',
        beginner: 'The <Canvas> component sets up the 3D scene, camera, and render loop automatically.',
        advanced: 'Canvas automatically handles window resizing, device pixel ratio matching, and animation loops.'
      },
      {
        title: '3. Declarative Meshes',
        beginner: '<mesh> replaces `new THREE.Mesh()`, and nested tags like <boxGeometry> attach shape and materials.',
        advanced: 'JSX element children attach automatically to parent arguments via R3F args array properties.'
      },
      {
        title: '4. Props & Shorthands',
        beginner: 'You pass position, rotation, and color as simple React props like `position={[0, 1, 0]}`.',
        advanced: 'Props translate directly to Three.js setters, like `position.set(0, 1, 0)`.'
      }
    ],
    {
      title: 'First R3F Component Scene',
      intro: 'Build a 3D box using React Three Fiber declarative JSX syntax.',
      steps: [
        'Import Canvas from @react-three/fiber.',
        'Create a <Box /> React component returning a <mesh>.',
        'Render <Canvas> inside your React root.'
      ],
      goal: 'Render a 3D mesh using clean React JSX components.',
      code: {
        html: '',
        css: 'body { margin: 0; background: #0f172a; height: 100vh; }',
        js: `import React from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas } from '@react-three/fiber';

function Box() {
  return (
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[1.5, 1.5, 1.5]} />
      <meshStandardMaterial color="#6366f1" />
    </mesh>
  );
}

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 0, 4] }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 3, 3]} intensity={1.5} />
        <Box />
      </Canvas>
    </div>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);`
      }
    },
    [
      q('What is React Three Fiber (R3F)?', ['A video editor', 'A React wrapper and renderer for Three.js', 'A replacement for CSS', 'A backend server'], 1),
      q('Which component automatically manages scene, camera, and render loops in R3F?', ['<Canvas>', '<SceneManager>', '<ThreeView>', '<WebGLContext>'], 0),
      q('How do you pass position coordinates in R3F mesh tags?', ['position="0,0,0"', 'position={[x, y, z]}', 'x={0} y={0} z={0}', 'pos="xyz"'], 1),
      q('What R3F property sets constructor parameters like size for geometries?', ['size', 'args={[width, height, depth]}', 'dimensions', 'bounds'], 1)
    ],
    ['R3F converts Three.js to React tags', '<Canvas> manages render loops automatically', 'Props like position={[x,y,z]} configure objects', 'args prop sets constructor dimensions']
  ),

  // Lesson 13
  lesson(
    'three-13',
    13,
    'R3F Hooks (useFrame & useThree)',
    '🪝',
    'Hooks are R3F secret weapons. `useFrame` runs code on every rendered frame, and `useThree` gives instant access to camera, scene, and viewport state.',
    [
      {
        title: '1. What is useFrame?',
        beginner: 'A hook that runs your custom code on every frame update (60 times per second) for continuous animation.',
        advanced: 'Receives state (clock, camera, raycaster) and delta (time between frames) arguments.'
      },
      {
        title: '2. useRef for Mesh References',
        beginner: 'Use standard React `useRef` to target a 3D mesh object and mutate its position or rotation.',
        advanced: 'Directly mutates object properties inside `useFrame` without triggering heavy React component re-renders.'
      },
      {
        title: '3. Frame Delta Time',
        beginner: 'Always multiply movement by frame `delta` time so animations run at equal speed on 60Hz or 120Hz screens.',
        advanced: '`useFrame((state, delta) => { meshRef.current.rotation.y += delta; });` guarantees framerate independence.'
      },
      {
        title: '4. What is useThree?',
        beginner: 'A hook providing direct access to the R3F state object containing camera, scene, size, and gl renderer.',
        advanced: 'Extract viewport dimensions or change camera settings dynamically inside any child component.'
      }
    ],
    {
      title: 'Spinning Mesh with useFrame',
      intro: 'Animate a 3D object inside R3F using useRef and useFrame hook.',
      steps: [
        'Attach a useRef hook to <mesh>.',
        'Call useFrame inside component.',
        'Increment meshRef.current.rotation.y on every frame.'
      ],
      goal: 'Animate R3F components with framerate-independent speed.',
      code: {
        html: '',
        css: 'body { margin: 0; background: #000; height: 100vh; }',
        js: `import React, { useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas, useFrame } from '@react-three/fiber';

function SpinningTorus() {
  const torusRef = useRef();

  useFrame((state, delta) => {
    torusRef.current.rotation.x += delta * 0.8;
    torusRef.current.rotation.y += delta * 1.2;
  });

  return (
    <mesh ref={torusRef}>
      <torusGeometry args={[1, 0.3, 16, 100]} />
      <meshStandardMaterial color="#38bdf8" roughness={0.1} />
    </mesh>
  );
}

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 0, 4] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 4, 3]} intensity={2} />
        <SpinningTorus />
      </Canvas>
    </div>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);`
      }
    },
    [
      q('Which R3F hook runs code on every rendered frame update?', ['useEffect', 'useFrame', 'useRender', 'useAnimation'], 1),
      q('Why should you multiply movement by the `delta` argument inside useFrame?', ['To change mesh color', 'To ensure smooth equal speed on 60Hz and 120Hz screens', 'To save memory', 'To pause the game'], 1),
      q('How do you target a mesh for direct mutation in R3F without component re-renders?', ['useRef', 'useState', 'useContext', 'useCallback'], 0),
      q('Which hook gives access to camera and viewport state?', ['useThree', 'useCamera', 'useCanvas', 'useViewport'], 0)
    ],
    ['useFrame runs 60 times per second', 'Use useRef to target meshes without re-rendering', 'Multiply movement by delta for framerate independence', 'useThree provides camera and renderer context']
  ),

  // Lesson 14
  lesson(
    'three-14',
    14,
    'Drei Utilities & Controls',
    '🧰',
    'Drei is the official collection of helper components for R3F. It cuts down hundreds of lines of camera, text, environment, and model code into single tags.',
    [
      {
        title: '1. What is @react-three/drei?',
        beginner: 'Drei provides plug-and-play components like OrbitControls, Text, Float, and Sky.',
        advanced: 'Maintained by the pmndrs open-source team, providing production-ready abstractions for R3F.'
      },
      {
        title: '2. <OrbitControls />',
        beginner: 'Drop `<OrbitControls />` inside `<Canvas>` to instantly add drag, zoom, and camera pan features.',
        advanced: 'Supports props like enableZoom, autoRotate, maxPolarAngle, and damping settings.'
      },
      {
        title: '3. <Float />',
        beginner: 'Wrap any mesh inside `<Float>` to give it a gentle floating bounce animation automatically.',
        advanced: 'Float component uses sine-wave calculations to wiggle and float children objects smoothly.'
      },
      {
        title: '4. 3D Text with <Text3D> & <Text>',
        beginner: 'Display crisp 3D text in your canvas using simple string props.',
        advanced: 'R3F Text handles font loading (SDF textures or JSON fonts) asynchronously in the background.'
      }
    ],
    {
      title: 'Drei Floating Scene',
      intro: 'Build a scene with OrbitControls, Float, and Drei Text.',
      steps: [
        'Import OrbitControls, Float, and Text from @react-three/drei.',
        'Drop <OrbitControls /> into Canvas.',
        'Wrap 3D Mesh in <Float speed={2}>.'
      ],
      goal: 'Build an interactive floating 3D scene effortlessly.',
      code: {
        html: '',
        css: 'body { margin: 0; background: #030712; height: 100vh; }',
        js: `import React from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Text } from '@react-three/drei';

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[3, 3, 3]} intensity={1.5} />
        
        <OrbitControls enableZoom={true} />

        <Float speed={3} rotationIntensity={1.5} floatIntensity={2}>
          <mesh>
            <octahedronGeometry args={[1.2, 0]} />
            <meshStandardMaterial color="#ec4899" roughness={0.2} />
          </mesh>
        </Float>

        <Text position={[0, -2, 0]} fontSize={0.5} color="#38bdf8" anchorX="center">
          DRUI IS AWESOME
        </Text>
      </Canvas>
    </div>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);`
      }
    },
    [
      q('What is @react-three/drei?', ['A 3D modeling software', 'A collection of ready-made helper components for R3F', 'A CSS styling framework', 'A database plugin'], 1),
      q('Which Drei component adds drag and zoom camera controls instantly?', ['<OrbitControls />', '<CameraController />', '<MouseDrag />', '<ViewControls />'], 0),
      q('What does the Drei <Float> component do?', ['Makes objects drop to floor', 'Adds gentle floating and bobbing motion to its children', 'Compresses 3D models', 'Hides transparent meshes'], 1),
      q('How do you render 3D text in Drei?', ['<Text> or <Text3D>', '<Paragraph>', '<Label3D>', '<Title>'], 0)
    ],
    ['Drei provides ready-made R3F helpers', '<OrbitControls /> adds instant camera drag', '<Float> creates floating animations', '<Text> renders 3D strings']
  ),

  // Lesson 15
  lesson(
    'three-15',
    15,
    '3D Interactivity & Events',
    '🖱️',
    'React Three Fiber turns complex raycasting click detection into standard React mouse event handlers like `onClick`, `onPointerOver`, and `onPointerOut`.',
    [
      {
        title: '1. Pointer Events in R3F',
        beginner: 'Attach event listeners directly onto <mesh> tags, just like standard HTML buttons.',
        advanced: 'R3F raycasts behind the scenes to map screen mouse coordinates to 3D object surfaces.'
      },
      {
        title: '2. Hover & Click State',
        beginner: 'Combine standard React `useState` with `onPointerOver` and `onPointerOut` to change object color or scale.',
        advanced: '`e.stopPropagation()` prevents click events from bubbling through to objects behind.'
      },
      {
        title: '3. Cursor Styles',
        beginner: 'Change mouse cursor to pointer when hovering over clickable 3D objects.',
        advanced: 'Set `document.body.style.cursor = hovered ? "pointer" : "auto"` inside side-effects.'
      },
      {
        title: '4. Touch & Mobile Support',
        beginner: 'R3F pointer events automatically work on both desktop mouse clicks and mobile touch screens.',
        advanced: 'Uses Unified Pointer Event standard for seamless cross-platform input.'
      }
    ],
    {
      title: 'Interactive Clickable 3D Box',
      intro: 'Build a 3D box that changes scale on hover and color when clicked.',
      steps: [
        'Set up active and hovered useState hooks.',
        'Attach onClick, onPointerOver, and onPointerOut props to <mesh>.',
        'Animate scale and color based on state.'
      ],
      goal: 'Handle 3D clicks using React state.',
      code: {
        html: '',
        css: 'body { margin: 0; background: #0f172a; height: 100vh; }',
        js: `import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

function InteractiveCube() {
  const [active, setActive] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <mesh
      scale={active ? 1.4 : 1}
      onClick={() => setActive(!active)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[1.5, 1.5, 1.5]} />
      <meshStandardMaterial color={hovered ? '#ec4899' : '#38bdf8'} />
    </mesh>
  );
}

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 0, 4] }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 3, 3]} intensity={1.5} />
        <OrbitControls />
        <InteractiveCube />
      </Canvas>
    </div>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);`
      }
    },
    [
      q('How do you listen for clicks on a 3D object in R3F?', ['Attach onClick prop directly to <mesh>', 'Write manual raycasting event code', 'Use standard window.onclick', 'Clicks are not supported in 3D'], 0),
      q('Which event triggers when mouse enters a 3D mesh surface?', ['onMouseEnterOnly', 'onPointerOver', 'onHover3D', 'onCollision'], 1),
      q('What function prevents click events from hitting objects behind your mesh?', ['e.stopPropagation()', 'e.preventDefault()', 'e.stopRaycast()', 'e.cancel()'], 0),
      q('Do R3F pointer events work on mobile touchscreens?', ['No, only desktop', 'Yes, automatically via unified Pointer Events', 'Only with special plugins', 'Only on iOS'], 1)
    ],
    ['R3F uses standard props like onClick', 'onPointerOver and onPointerOut handle hovers', 'React useState controls interactive 3D scale/color', 'Pointer events support desktop and mobile']
  ),

  // Lesson 16
  lesson(
    'three-16',
    16,
    '3D Web App Production & Deployment',
    '🚀',
    'Ship high-performance 3D web apps. Learn optimization techniques, asset compression, and portfolio deployment.',
    [
      {
        title: '1. Optimizing Performance',
        beginner: 'Keep polycounts reasonable, reuse materials, and compress 3D asset file sizes.',
        advanced: 'Target under 100,000 polygons and keep total draw calls under 50 for smooth 60 FPS performance.'
      },
      {
        title: '2. Draco GLTF Compression',
        beginner: 'Draco compresses 3D mesh file sizes by up to 90%, speeding up load times dramatically.',
        advanced: 'Use gltf-pipeline or Blender Draco exporter to compress geometries before deployment.'
      },
      {
        title: '3. Asset Preloading & Suspense',
        beginner: 'Use React `<Suspense fallback={<Loader />}>` to display pleasant loading screens while 3D models load.',
        advanced: '`useGLTF.preload(url)` downloads assets ahead of component mount time.'
      },
      {
        title: '4. Summary & Next Steps',
        beginner: 'You now possess the foundational toolkit to build immersive 3D landing pages and web apps.',
        advanced: 'Combine Three.js/R3F with GSAP ScrollTrigger or Lenis smooth scroll for world-class web experiences.'
      }
    ],
    {
      title: 'Production Ready 3D Card Showcase',
      intro: 'Combine lighting, materials, R3F, Drei, and interactive hover mechanics into a production project.',
      steps: [
        'Setup ambient and directional lighting.',
        'Build animated interactive 3D product card.',
        'Add OrbitControls and floating ambient text.'
      ],
      goal: 'Build a production-ready interactive 3D web portfolio showcase.',
      code: {
        html: '',
        css: 'body { margin: 0; background: #030712; height: 100vh; font-family: sans-serif; }',
        js: `import React, { useState, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Text } from '@react-three/drei';

function ProductCard() {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef();

  useFrame((_, delta) => {
    meshRef.current.rotation.y += delta * (hovered ? 1.5 : 0.3);
  });

  return (
    <group>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[1.8, 2.4, 0.2]} />
        <meshStandardMaterial
          color={hovered ? '#ec4899' : '#1e1b4b'}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </group>
  );
}

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 0, 4.5] }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[4, 5, 4]} intensity={2} />
        <OrbitControls enableZoom={false} />

        <Float speed={2} floatIntensity={1}>
          <ProductCard />
        </Float>

        <Text position={[0, -1.8, 0]} fontSize={0.35} color="#38bdf8" anchorX="center">
          HOVER OR ROTATE CARD
        </Text>
      </Canvas>
    </div>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);`
      }
    },
    [
      q('What tool compresses GLTF 3D model file sizes by up to 90%?', ['Zip', 'Draco Compression', 'MP4 Loader', 'PNG Minimizer'], 1),
      q('How do you show a loading UI while R3F 3D assets load in React?', ['React <Suspense fallback={<Loader />}>', 'window.onload', 'setInterval', 'CSS spinner only'], 0),
      q('What is a realistic target draw call budget for smooth mobile 3D performance?', ['Under 50 draw calls', 'Over 1,000 draw calls', '10,000 draw calls', 'Unlimited'], 0),
      q('What function preloads 3D models before component mount?', ['useGLTF.preload(url)', 'fetchModel()', 'loadEarly()', 'bufferAsset()'], 0)
    ],
    ['Compress assets with Draco for fast loads', 'Use React Suspense for elegant load screens', 'Keep draw calls under 50 for mobile 60 FPS', 'Combine R3F + GSAP for world-class landing pages']
  )
];
  
// Helper utilities for 3D Course lookup and unlock logic
export const getThree3dLessonById = (id: string): Three3dLesson | undefined =>
  THREE3D_LESSONS.find(l => l.id === id);

export const isThree3dLessonUnlocked = (id: string, completedLessons: string[]): boolean => {
  const idx = THREE3D_LESSONS.findIndex(l => l.id === id);
  if (idx <= 0) return true;
  return completedLessons.includes(THREE3D_LESSONS[idx - 1].id);
};
