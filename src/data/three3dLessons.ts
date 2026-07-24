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
    'Welcome to the exciting world of 3D web development! Before we write code, it helps to know how browsers draw 3D. Browsers have a built-in tool called WebGL to talk to your computer\'s graphics card. However, WebGL is very complex. Three.js is a friendly JavaScript library that acts as a bridge, letting you build 3D worlds using simple, easy-to-understand code.',
    [
      {
        title: '1. What is WebGL?',
        beginner: 'WebGL is a tool built directly into your web browser. It uses your computer\'s graphics card (GPU) to draw incredibly fast 2D and 3D graphics without needing any plugins.',
        advanced: 'WebGL is a JavaScript API based on OpenGL ES. It runs low-level shader programs directly on the GPU, which is incredibly powerful but requires a lot of complex math.'
      },
      {
        title: '2. Why Use Three.js?',
        beginner: 'If you tried to draw a simple 3D cube using pure WebGL, you would need to write hundreds of lines of code. Three.js does all the heavy lifting for you, so you can do it in just a few lines!',
        advanced: 'Three.js provides an object-oriented, high-level abstraction over WebGL. It manages scene graphs, matrices, shaders, and hardware acceleration behind the scenes.'
      },
      {
        title: '3. The Three Core Ingredients',
        beginner: 'To create a 3D world, you always need three things: a Scene (the world where objects live), a Camera (your eyes looking into the world), and a Renderer (the artist that paints what the camera sees onto your screen).',
        advanced: 'The Scene is a graph that holds Object3D elements. The Camera calculates view projections. The WebGLRenderer rasterizes the data onto an HTML <canvas> element.'
      },
      {
        title: '4. The Animation Loop',
        beginner: 'A 3D scene is just like a flipbook or a movie. To make things move, we have to redraw the scene very fast—usually about 60 times every second!',
        advanced: 'We use the browser\'s native requestAnimationFrame API. It synchronizes your rendering code with the display monitor\'s refresh rate to prevent screen tearing.'
      }
    ],
    {
      title: 'Setting Up Your First 3D Scene',
      intro: 'Let\'s build our very first 3D canvas! In standard web development, Three.js is written in JavaScript, styled with CSS, and injected into an HTML document. Here is how it all connects.',
      steps: [
        'HTML Setup: We create a simple <div> container where our 3D canvas will live.',
        'CSS Styling: We remove the default margins and make our container take up the full screen height and width.',
        'JS Step 1: Create the Scene (the empty universe).',
        'JS Step 2: Create a Camera so we have a perspective to look from.',
        'JS Step 3: Create the Renderer, attach it to our HTML container, and tell it to paint the picture!'
      ],
      goal: 'Successfully connect HTML, CSS, and JS to render a blank, colored 3D canvas.',
      code: {
        html: `<!-- We need an element for our 3D graphics to live inside -->\n<div id="canvas-container"></div>\n\n<!-- Normally, you would include the Three.js library here like this: -->\n<!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script> -->`,
        css: `/* Reset margins so our 3D canvas touches the edges of the screen */\nbody {\n  margin: 0;\n  overflow: hidden; /* Prevents scrollbars */\n}\n\n#canvas-container {\n  width: 100vw;\n  height: 100vh;\n}`,
        js: `// 1. Create the Scene - This is our empty 3D universe
const scene = new THREE.Scene();
// Let's give our universe a dark blue background color
scene.background = new THREE.Color(0x111827);

// 2. Create the Camera - Our window into the universe
// Parameters: Field of View, Aspect Ratio, Near clipping distance, Far clipping distance
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// Move the camera back a little bit so it isn't stuck at the center (0,0,0)
camera.position.z = 5;

// 3. Create the Renderer - The engine that draws the scene
const renderer = new THREE.WebGLRenderer({ antialias: true }); // antialias smooths jagged edges
// Make the renderer the exact size of our browser window
renderer.setSize(window.innerWidth, window.innerHeight);

// Attach the canvas (created by the renderer) to our HTML document
document.body.appendChild(renderer.domElement);

// 4. Draw the scene! Tell the renderer to take a picture using the camera.
renderer.render(scene, camera);`
      }
    },
    [
      q('What tool enables the browser to draw 3D graphics using the graphics card?', ['HTML5 Canvas', 'WebGL', 'CSS3D', 'Node.js'], 1),
      q('What are the 3 main ingredients ALWAYS needed in a Three.js project?', ['HTML, CSS, JS', 'Scene, Camera, Renderer', 'Mesh, Light, Shadow', 'Texture, UV, Shader'], 1),
      q('Why do we use the requestAnimationFrame function?', ['To download API data', 'To smoothly redraw frames over and over for animation', 'To play background music', 'To compress images'], 1),
      q('What does the code `camera.position.z = 5` do?', ['Moves camera left/right', 'Moves camera up/down', 'Moves camera closer to or further from the center', 'Rotates the camera'], 2)
    ],
    ['WebGL uses GPU power directly', 'Three.js simplifies WebGL into easy JavaScript', 'Scene + Camera + Renderer = Your 3D world']
  ),

  // Lesson 2
  lesson(
    'three-2',
    2,
    '3D Objects & Meshes',
    '📦',
    'Now that we have an empty 3D universe, let\'s put something in it! In Three.js, a 3D object is called a "Mesh". To create a Mesh, you combine two things: a Geometry (the shape) and a Material (the skin or wrapper).',
    [
      {
        title: '1. What is Geometry?',
        beginner: 'Think of Geometry as the wireframe or skeleton of an object. It defines the mathematical shape, like a box, a sphere, or a pyramid.',
        advanced: 'Geometry stores the mathematical data: vertex positions, faces, normals, and texture coordinates (UVs) needed to construct the shape in 3D space.'
      },
      {
        title: '2. What is Material?',
        beginner: 'If Geometry is the skeleton, Material is the skin. It tells the browser what color the object is, if it is shiny or dull, or if it is made of wireframe lines.',
        advanced: 'Materials define the shader calculations (like PBR or Phong shading) that dictate how the surface reacts to lights and cameras in the scene.'
      },
      {
        title: '3. What is a Mesh?',
        beginner: 'A Mesh is the final product. It takes your Geometry and wraps it in your Material. Only a complete Mesh can be added to your 3D Scene.',
        advanced: 'A Mesh is an instance of Object3D. This means it inherits 3D transformation properties like position, rotation, and scale.'
      },
      {
        title: '4. Moving & Rotating',
        beginner: 'Once your Mesh is in the scene, you can move it (position) or spin it (rotation) along the X, Y, or Z axis.',
        advanced: 'Rotations in Three.js use Radians (where Math.PI equals 180 degrees). Transformations are calculated using Matrix4 math under the hood.'
      }
    ],
    {
      title: 'Creating a Spinning 3D Cube',
      intro: 'Let\'s create a 3D box and animate it. We will write an "animation loop" in JavaScript. This loop will change the cube\'s rotation slightly right before every single frame is drawn to the screen.',
      steps: [
        'Create the Geometry: A basic Box shape.',
        'Create the Material: Give it a nice purple color. We will set "wireframe: true" to see its skeleton.',
        'Create the Mesh: Combine the box and the material.',
        'Animate: Write a looping function that increases the rotation slightly every frame.'
      ],
      goal: 'Understand how to combine shape and color, and how to create a continuous animation loop.',
      code: {
        html: '<!-- The canvas will automatically be injected here by our JS -->',
        css: 'body { margin: 0; overflow: hidden; background: #000; }',
        js: `// Boilerplate Setup (Scene, Camera, Renderer)
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
camera.position.z = 4; // Pull camera back so we can see the center

// 1. Define the Geometry (Width, Height, Depth)
const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);

// 2. Define the Material (Skin/Color)
// MeshBasicMaterial doesn't need light to be seen!
const material = new THREE.MeshBasicMaterial({ color: 0x6366f1, wireframe: true });

// 3. Create the Mesh by combining them
const cube = new THREE.Mesh(geometry, material);

// 4. Add it to our world
scene.add(cube);

// 5. The Animation Loop
function animate() {
  // Tell browser to call this function again on the next frame
  requestAnimationFrame(animate);
  
  // Rotate the cube a tiny bit on the X and Y axes
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  
  // Take a picture of the updated scene
  renderer.render(scene, camera);
}

// Start the loop!
animate();`
      }
    },
    [
      q('A complete 3D object in Three.js is called a Mesh. A Mesh is made of:', ['HTML and CSS', 'Geometry and Material', 'Light and Shadow', 'Camera and Viewport'], 1),
      q('Which property turns an object into a transparent cage of lines?', ['wireframe: true', 'grid: true', 'lines: true', 'skeleton: true'], 0),
      q('Rotations are calculated in radians. How many radians make a half-circle (180 degrees)?', ['Math.PI / 2', 'Math.PI', 'Math.PI * 2', '360'], 1),
      q('Where is the best place to put the code that makes an object spin continuously?', ['Inside the HTML file', 'Inside the requestAnimationFrame loop in JS', 'In the CSS stylesheet', 'Inside the scene setup'], 1)
    ],
    ['Geometry = Shape', 'Material = Look/Color', 'Mesh = Geometry + Material', 'Animations happen inside a rendering loop function']
  ),

  // Lesson 3
  lesson(
    'three-3',
    3,
    'Built-in Geometries',
    '📐',
    'Three.js comes with a huge toybox of pre-made shapes. You don\'t need complex math to create spheres, floors, or even donut shapes—you just use the built-in Geometry classes!',
    [
      {
        title: '1. SphereGeometry (Balls)',
        beginner: 'Creates a 3D ball. You can control how big it is, and how smooth it looks by increasing its "segments".',
        advanced: 'Segment counts (widthSegments, heightSegments) determine polygon count. High segments look smooth but cost more GPU performance.'
      },
      {
        title: '2. PlaneGeometry (Floors & Walls)',
        beginner: 'Creates a flat 2D sheet in the 3D world. This is perfect for creating the ground for characters to walk on.',
        advanced: 'Planes default to facing the Z-axis (like a wall). To make it a floor, you must rotate it: `plane.rotation.x = -Math.PI / 2`.'
      },
      {
        title: '3. Cylinder & Cone Geometry',
        beginner: 'Great for making tree trunks, pillars, or pipes by setting a top size and a bottom size.',
        advanced: 'Can be left hollow by passing the `openEnded` boolean parameter, which is great for building tunnels.'
      },
      {
        title: '4. TorusGeometry (Donuts)',
        beginner: 'Creates a ring or donut shape. Very useful for decorative elements or wheels.',
        advanced: 'Three.js also provides `TorusKnotGeometry`, which generates mathematically complex, interwoven knot shapes perfect for testing reflections.'
      }
    ],
    {
      title: 'Building a 3D Shape Playground',
      intro: 'Let\'s write JavaScript to create three different objects and place them side-by-side using the `position.x` property.',
      steps: [
        'Create a shared Material that all three shapes will use.',
        'Create a Sphere and move it to the left side (-2.5 on the X axis).',
        'Create a Box and leave it in the center (0 on the X axis).',
        'Create a Torus (Donut) and move it to the right (+2.5 on the X axis).',
        'Spin them all inside the animation loop!'
      ],
      goal: 'Understand how to position multiple meshes and explore different built-in geometries.',
      code: {
        html: '',
        css: 'body { margin: 0; overflow: hidden; background: #0f172a; }',
        js: `// Setup Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// One material shared by all shapes (Cyan colored wireframe)
const mat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true });

// 1. The Sphere (Radius, widthSegments, heightSegments)
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.8, 16, 16), mat);
sphere.position.x = -2.5; // Move left

// 2. The Box (Width, Height, Depth)
const box = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 1.2), mat);
// Stays in center automatically (x: 0, y: 0, z: 0)

// 3. The Torus / Donut (Radius, TubeThickness, radialSegments, tubularSegments)
const torus = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.3, 12, 30), mat);
torus.position.x = 2.5; // Move right

// Add everything to the scene at once!
scene.add(sphere, box, torus);
camera.position.z = 5;

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  
  // Rotate each object differently
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
      q('Which geometry class would you use to create a 3D donut?', ['SphereGeometry', 'CylinderGeometry', 'TorusGeometry', 'CircleGeometry'], 2),
      q('What happens if you increase the number of segments on a SphereGeometry?', ['The color gets brighter', 'The shape gets smoother and rounder', 'It turns into a cube', 'It runs faster on the computer'], 1),
      q('Which geometry is best suited for creating a flat ground floor?', ['PlaneGeometry', 'BoxGeometry', 'RingGeometry', 'TetrahedronGeometry'], 0),
      q('How do you lay a Plane flat down so it acts like a floor?', ['Rotate X by -Math.PI / 2', 'Rotate Z by 180 degrees', 'Set position.z = -10', 'Scale Y to 0'], 0)
    ],
    ['Three.js has pre-built shapes for almost everything', 'Spheres use segments for smoothness', 'Planes are great for floors', 'Use position.x/y/z to organize objects']
  ),

  // Lesson 4
  lesson(
    'three-4',
    4,
    'Materials & Surface Styles',
    '🎨',
    'So far we used MeshBasicMaterial, which ignores light and looks flat. To make things look like real metal, plastic, or glass, we need to use advanced materials that react to lighting in the scene!',
    [
      {
        title: '1. MeshBasicMaterial',
        beginner: 'A flat, simple color. It does NOT react to light and does not show shadows. Great for basic UI or cartoon styles.',
        advanced: 'It is highly performant because it skips all shader calculations for lighting and reflections.'
      },
      {
        title: '2. MeshLambert & MeshPhong',
        beginner: 'Materials that NEED lights to be seen! Lambert is great for dull surfaces (like paper). Phong is great for shiny surfaces (like polished plastic).',
        advanced: 'Lambert uses per-vertex shading (fast but less accurate), while Phong calculates specular highlights per-pixel.'
      },
      {
        title: '3. MeshStandardMaterial (PBR)',
        beginner: 'The modern standard for realistic 3D. You give it properties like "roughness" and "metalness" to perfectly simulate real-world materials.',
        advanced: 'PBR (Physically Based Rendering) is an industry standard used in modern video games and Three.js to simulate actual physics of light bounce.'
      },
      {
        title: '4. Opacity & Transparency',
        beginner: 'Want to make a ghost or a glass window? You just tell the material to be transparent, and set the opacity (0.0 is invisible, 1.0 is solid).',
        advanced: 'To use opacity, you MUST set `transparent: true` on the material, otherwise WebGL ignores the opacity value for performance reasons.'
      }
    ],
    {
      title: 'Comparing Material Realism',
      intro: 'We are going to create a shiny, metallic sphere. Because we are using a realistic material, we MUST add some light to our scene, otherwise the sphere will be completely pitch black!',
      steps: [
        'Add a soft AmbientLight and a bright DirectionalLight to the scene.',
        'Create a sphere using MeshStandardMaterial instead of Basic material.',
        'Tweak the "roughness" (how blurry reflections are) and "metalness" (how much it behaves like a mirror).',
        'Render the scene and watch the light reflect off the surface!'
      ],
      goal: 'Learn how to use MeshStandardMaterial to simulate real-world shiny metals.',
      code: {
        html: '',
        css: 'body { margin: 0; overflow: hidden; background: #111; }',
        js: `const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// VERY IMPORTANT: Advanced materials require light!
// 1. AmbientLight lights everything softly from all directions
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); 
// 2. DirectionalLight acts like the sun, shining from a specific spot
const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
dirLight.position.set(5, 5, 5); 
scene.add(ambientLight, dirLight);

// Creating a Shiny Metal Material
const shinyMat = new THREE.MeshStandardMaterial({
  color: 0xec4899,   // Pink color
  roughness: 0.1,    // 0.0 is smooth as glass, 1.0 is rough like dirt
  metalness: 0.9     // 1.0 makes it act entirely like a reflective metal
});

const sphere = new THREE.Mesh(new THREE.SphereGeometry(1.2, 32, 32), shinyMat);
scene.add(sphere);

camera.position.z = 4;

function animate() {
  requestAnimationFrame(animate);
  // Spinning it helps us see how the lighting reflections work
  sphere.rotation.y += 0.01;
  sphere.rotation.x += 0.005;
  renderer.render(scene, camera);
}
animate();`
      }
    },
    [
      q('Which of these materials completely IGNORES lighting in the scene?', ['MeshStandardMaterial', 'MeshBasicMaterial', 'MeshPhongMaterial', 'MeshPhysicalMaterial'], 1),
      q('What material model is the standard for modern, realistic 3D graphics (like video games)?', ['PBR (Physically Based Rendering)', 'Flat Shading', 'Wireframe Rendering', 'Raytracing'], 0),
      q('To make a material semi-transparent (like glass), what rule must you follow?', ['You must set opacity: 0.5 AND transparent: true', 'You just change the color to clear', 'Set visible: false', 'Write it in CSS'], 0),
      q('Setting a low "roughness" value (like 0.1) on a MeshStandardMaterial makes the object look:', ['Dull and rough like cardboard', 'Shiny and smooth like polished plastic or glass', 'Completely invisible', 'Like a wireframe'], 1)
    ],
    ['MeshBasic ignores light', 'MeshStandard uses PBR for realism', 'Roughness/Metalness control how light bounces', 'Transparency requires the transparent: true flag']
  ),

  // Lesson 5
  lesson(
    'three-5',
    5,
    'Lighting the Scene',
    '💡',
    'In the real world, we need light to see. The same goes for 3D! Without lights, realistic materials are pitch black. Mixing different types of lights creates depth, dramatic shadows, and beautiful atmosphere.',
    [
      {
        title: '1. AmbientLight (Soft glow)',
        beginner: 'A soft light that comes from everywhere at once. It has no direction and casts no shadows. It is used to make sure the darkest parts of your scene are not 100% black.',
        advanced: 'Provides a global illumination offset. It is computationally very cheap but does not help define 3D shape.'
      },
      {
        title: '2. DirectionalLight (The Sun)',
        beginner: 'Light rays that are perfectly parallel, exactly like sunlight. It lights up one side of an object and is great for casting sharp shadows.',
        advanced: 'Uses an orthographic camera internally to calculate shadow maps over a specific target area.'
      },
      {
        title: '3. PointLight (Lightbulb)',
        beginner: 'A light that sits at a specific X/Y/Z position and shines in all directions, like a lightbulb or a firefly.',
        advanced: 'Features `distance` and `decay` parameters to calculate realistic light attenuation (falloff) over distance.'
      },
      {
        title: '4. SpotLight (Flashlight)',
        beginner: 'A light that shoots a cone of light in a specific direction, like a stage spotlight or a car headlight.',
        advanced: 'Includes `angle` (cone width) and `penumbra` (softness of the cone edges) properties for precise lighting control.'
      }
    ],
    {
      title: 'Creating a 3-Point Studio Light Setup',
      intro: 'Professional photographers use "3-point lighting" to make subjects look amazing. Let\'s replicate this in JavaScript by placing three different lights around a complex knot shape.',
      steps: [
        'Add a Key Light: A bright DirectionalLight shining on the front/side to provide the main illumination.',
        'Add a Fill Light: A soft, dim AmbientLight so the shadows aren\'t totally black.',
        'Add a Rim Light: A colored PointLight placed behind the object to give it a cool glowing outline.',
        'Render the scene and see the cinematic result!'
      ],
      goal: 'Understand how combining different light types and colors creates professional 3D presentation.',
      code: {
        html: '',
        css: 'body { margin: 0; overflow: hidden; background: #050505; }',
        js: `const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 1. Key Light (Main Bright Sun)
const keyLight = new THREE.DirectionalLight(0xffffff, 2);
keyLight.position.set(3, 3, 3); // Positioned up and to the right
scene.add(keyLight);

// 2. Fill Light (Soft ambient blue to fill in dark shadows)
const fillLight = new THREE.AmbientLight(0x1e3a8a, 1);
scene.add(fillLight);

// 3. Rim Light (Bright cyan backlight behind the object)
const rimLight = new THREE.PointLight(0x06b6d4, 4, 10);
rimLight.position.set(-3, -1, -2); // Positioned behind and to the left
scene.add(rimLight);

// A complex knot shape catches light beautifully
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
      q('Which type of light behaves exactly like sunlight shining from far away?', ['PointLight', 'DirectionalLight', 'AmbientLight', 'RectAreaLight'], 1),
      q('Which light shines equally everywhere and prevents shadows from being pure black?', ['SpotLight', 'AmbientLight', 'PointLight', 'DirectionalLight'], 1),
      q('A PointLight acts most like a:', ['Flashlight cone', 'Sun from infinite distance', 'Light bulb radiating in all directions', 'Soft sky color'], 2),
      q('What happens to a MeshStandardMaterial if you forget to add any lights to the scene?', ['It renders as plain white', 'It turns into wireframe', 'It appears completely pitch black', 'JavaScript throws an error'], 2)
    ],
    ['Ambient = Soft global glow', 'Directional = Sun rays', 'Point = Lightbulb', 'Combine them for professional looks']
  ),

  // Lesson 6
  lesson(
    'three-6',
    6,
    'Camera Controls & Interactivity',
    '🎥',
    'A 3D world is much more fun when the user can explore it! Three.js provides helper scripts that let users click, drag, rotate, and zoom the camera using their mouse or touchscreen.',
    [
      {
        title: '1. OrbitControls',
        beginner: 'A pre-written Three.js add-on that magically allows the user to click-and-drag to rotate the camera around the center of the scene.',
        advanced: 'OrbitControls updates the camera\'s transformation matrix based on DOM mouse/touch events automatically.'
      },
      {
        title: '2. Damping (Smooth Movement)',
        beginner: 'If you enable damping, the camera gets "weight". When you drag and let go, it slides smoothly to a stop instead of halting instantly.',
        advanced: 'Requires setting `enableDamping = true` and calling `controls.update()` every single frame inside your render loop.'
      },
      {
        title: '3. Resizing the Window',
        beginner: 'If a user resizes their browser, the 3D canvas gets stretched and ugly. We have to tell Three.js to update the camera and canvas size when this happens.',
        advanced: 'You must attach a window `resize` event listener, update `camera.aspect`, call `camera.updateProjectionMatrix()`, and call `renderer.setSize()`.'
      },
      {
        title: '4. Raycasting (Clicking Objects)',
        beginner: 'Because the 3D scene is drawn on a flat 2D canvas, traditional HTML clicking doesn\'t work on 3D boxes. Raycasting shoots an invisible laser from your mouse into the 3D world to see what you clicked!',
        advanced: 'The Raycaster normalizes mouse coordinates (-1 to +1) and calculates intersection vectors against scene meshes.'
      }
    ],
    {
      title: 'Making a Scene Interactive',
      intro: 'Let\'s add OrbitControls so we can fly around! Since OrbitControls is an add-on, in a vanilla HTML/JS setup, we have to import its script file right after the main Three.js script. We will also add a window resize listener so our canvas is fully responsive.',
      steps: [
        'HTML: Include the Three.js script, and then the OrbitControls script via CDN.',
        'JS: Create an instance of THREE.OrbitControls and attach it to the camera and renderer.',
        'JS: Enable "damping" for a smooth, buttery camera feel.',
        'JS: Add a resize event listener to keep the graphics crisp when the window changes size.',
        'JS: Remember to update the controls inside the animation loop!'
      ],
      goal: 'Allow the user to navigate the 3D space with their mouse and keep the canvas responsive to screen size changes.',
      code: {
        html: `<!-- First, load Three.js -->\n<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>\n<!-- Second, load OrbitControls (it depends on Three.js) -->\n<script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>\n<div id="canvas-container"></div>`,
        css: 'body { margin: 0; overflow: hidden; background: #0f172a; }',
        js: `const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 1. Initialize OrbitControls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
// 2. Enable smooth physics sliding
controls.enableDamping = true;

// Let's add a floor grid and a box so we have something to look at
const grid = new THREE.GridHelper(10, 10, 0x38bdf8, 0x334155);
scene.add(grid);

const box = new THREE.Mesh(
  new THREE.BoxGeometry(1.5, 1.5, 1.5),
  new THREE.MeshNormalMaterial() // This material shows colorful angles
);
box.position.y = 0.75;
scene.add(box);

camera.position.set(3, 3, 5);

// 3. Make it Responsive!
window.addEventListener('resize', () => {
  // Update camera aspect ratio
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix(); // Tell Three.js the camera changed
  // Update canvas size
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
  requestAnimationFrame(animate);
  // 4. Update controls every frame (required for damping to work)
  controls.update(); 
  renderer.render(scene, camera);
}
animate();`
      }
    },
    [
      q('What does OrbitControls allow users to do?', ['Edit HTML code in 3D', 'Rotate, pan, and zoom the camera with their mouse', 'Play sound effects', 'Speed up the GPU'], 1),
      q('What function MUST be called after updating the camera\'s aspect ratio during a window resize?', ['camera.updateProjectionMatrix()', 'camera.reset()', 'renderer.reload()', 'scene.refresh()'], 0),
      q('What does enableDamping = true do?', ['Slows down the computer', 'Adds smooth physics momentum to camera movement', 'Locks the camera position', 'Disables zooming'], 1),
      q('Because traditional HTML clicks do not work on 3D objects, what tool detects mouse clicks in Three.js?', ['Raycaster', 'PointLight', 'BoundingBox', 'MeshNormal'], 0)
    ],
    ['OrbitControls adds easy mouse control', 'Enable damping for smooth sliding', 'You must handle window resize events manually', 'Raycaster acts as a 3D mouse click']
  ),

  // Lesson 7
  lesson(
    'three-7',
    7,
    'Animating 3D Objects with GSAP',
    '🎬',
    'Writing math inside a loop (like cube.rotation += 0.01) is fine for basic spinning, but terrible for complex animations. GSAP (GreenSock) is a popular animation library that lets you craft smooth 3D sequences, camera sweeps, and elastic bounces with just a few lines of code.',
    [
      {
        title: '1. Why GSAP with Three.js?',
        beginner: 'GSAP handles the timing, speed curves, and smooth transitions automatically so you don\'t have to write scary math formulas.',
        advanced: 'GSAP mutates numeric object properties directly frame-by-frame. It is highly optimized and works beautifully alongside the Three.js render loop.'
      },
      {
        title: '2. Animating 3D Coordinates',
        beginner: 'You can tell GSAP to target a specific property, like moving an object\'s position, or changing its scale, over a set amount of time.',
        advanced: 'Example: `gsap.to(mesh.position, { x: 2, duration: 1.5 })` will smoothly transition the X position from its current state to 2 over 1.5 seconds.'
      },
      {
        title: '3. Easing & Bounces',
        beginner: 'Easing controls how an animation starts and stops. It can make an object glide smoothly, snap sharply, or even bounce like a rubber ball!',
        advanced: 'Popular eases include "bounce.out", "elastic.out(1, 0.3)", and "power3.inOut" to simulate real-world physics and momentum.'
      },
      {
        title: '4. Animation Timelines',
        beginner: 'Timelines let you chain multiple animations together. For example: Box moves up, THEN spins, THEN scales down, perfectly in order.',
        advanced: '`gsap.timeline()` manages sequence offsets and synchronized multi-property tweens without messy setTimeout callbacks.'
      }
    ],
    {
      title: 'Creating a Bouncing 3D Cube with GSAP',
      intro: 'We will use GSAP to animate a 3D box bouncing up and down while spinning. We just need to include the GSAP library via CDN, and then tell it which object properties to animate!',
      steps: [
        'HTML: Include the GSAP script library.',
        'JS: Setup a standard scene, camera, renderer, and lighting.',
        'JS: Create a MeshStandardMaterial box.',
        'JS: Use `gsap.to()` to animate the box\'s `position.y` with a bouncing effect.',
        'JS: Run the normal Three.js render loop (GSAP automatically updates the numbers in the background!).'
      ],
      goal: 'Understand how external animation libraries like GSAP can safely control Three.js objects for smooth motion.',
      code: {
        html: `<!-- Load GSAP Animation Library -->\n<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>\n<div id="canvas-container"></div>`,
        css: 'body { margin: 0; overflow: hidden; background: #0f172a; }',
        js: `const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add lighting so we can see the 3D shape
const light = new THREE.DirectionalLight(0xffffff, 2);
light.position.set(2, 4, 3);
scene.add(light, new THREE.AmbientLight(0xffffff, 0.5));

const mesh = new THREE.Mesh(
  new THREE.BoxGeometry(1.2, 1.2, 1.2),
  new THREE.MeshStandardMaterial({ color: 0x6366f1, roughness: 0.2 })
);
scene.add(mesh);

camera.position.z = 4;

// --- GSAP ANIMATIONS ---

// Animate Up & Down Bouncing
gsap.to(mesh.position, {
  y: 1.5,                // Move UP to Y: 1.5
  duration: 1.2,         // Take 1.2 seconds to do it
  repeat: -1,            // Repeat infinitely (-1)
  yoyo: true,            // Play back and forth (Up, Down, Up, Down)
  ease: "bounce.out"     // Give it a bouncy physics feel
});

// Animate Spinning
gsap.to(mesh.rotation, {
  y: Math.PI * 2,        // Spin a full 360 degrees
  duration: 2.4,         
  repeat: -1,            // Repeat infinitely
  ease: "none"           // Smooth linear spin (no slowing down)
});

// The standard render loop! 
// Note: We don't need to put math here because GSAP is moving the box for us.
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();`
      }
    },
    [
      q('What is the main benefit of using GSAP with Three.js?', ['It creates 3D models automatically', 'It makes complex animations and easings incredibly simple', 'It generates HTML tags', 'It speeds up internet loading times'], 1),
      q('How do you tell GSAP to target an object\'s height (Y position)?', ['gsap.to(mesh.position, { y: 2 })', 'gsap.to(mesh, { top: 200 })', 'gsap.to(mesh, { height: 2 })', 'gsap.to(mesh.geometry, { y: 2 })'], 0),
      q('What does the "yoyo: true" option do in a GSAP animation?', ['Deletes the object', 'Plays the animation forward and then neatly in reverse', 'Spins the camera in circles', 'Shakes the screen'], 1),
      q('Which easing style makes an object drop and rebound like a rubber ball?', ['power1.in', 'none', 'bounce.out', 'linear'], 2)
    ],
    ['GSAP animates position/rotation safely', 'Easings make motion feel natural', 'yoyo: true loops back and forth smoothly', 'Use GSAP to avoid complex loop math']
  ),

  // Lesson 8
  lesson(
    'three-8',
    8,
    'Textures & Surface Materials',
    '🖼️',
    'Plain colors are great, but real-world objects have patterns, scratches, and details. By using Textures, we can wrap standard image files (like JPG or PNG) around our 3D shapes like wrapping paper!',
    [
      {
        title: '1. TextureLoader',
        beginner: 'This is a Three.js tool that downloads image files from the internet or your folders and converts them into 3D textures.',
        advanced: 'It runs asynchronously. You can use callbacks or promises to know exactly when the texture file has finished loading into memory.'
      },
      {
        title: '2. The Color Map',
        beginner: 'The main image that gets wrapped over the shape is called the "map". It acts like the wallpaper for the geometry.',
        advanced: 'Applied via the `map` property on materials. It uses UV coordinates on the geometry to know exactly how to wrap the flat 2D image around the 3D surface.'
      },
      {
        title: '3. Procedural Canvas Textures',
        beginner: 'Instead of loading a JPG, you can actually draw custom graphics using a hidden HTML <canvas>, and use THAT as your 3D texture!',
        advanced: '`THREE.CanvasTexture` uses any 2D canvas context as a dynamic, updatable texture source without needing external network requests.'
      },
      {
        title: '4. Tiling & Repeating',
        beginner: 'If you stretch one small image over a massive floor, it looks blurry. Instead, you can set the texture to repeat itself like a tiled floor.',
        advanced: 'You achieve this by setting `texture.wrapS = texture.wrapT = THREE.RepeatWrapping` and modifying the `texture.repeat.set(x, y)` scale.'
      }
    ],
    {
      title: 'Applying a Dynamic Canvas Texture',
      intro: 'Instead of loading a remote image (which can be tricky due to CORS security in browsers), we are going to use JavaScript to paint a design on an invisible HTML canvas, and instantly wrap it around a 3D box!',
      steps: [
        'JS: Create a hidden HTML `<canvas>` element in memory and use standard 2D context to draw colored boxes and text on it.',
        'JS: Convert that canvas into a 3D texture using `THREE.CanvasTexture`.',
        'JS: Create a `MeshStandardMaterial` and apply our new texture to the `map` property.',
        'JS: Apply the material to a BoxGeometry and spin it to see all sides.'
      ],
      goal: 'Understand how 2D graphics map onto 3D surfaces using the `map` property.',
      code: {
        html: '',
        css: 'body { margin: 0; overflow: hidden; background: #000; }',
        js: `const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// We need light for MeshStandardMaterial
scene.add(new THREE.AmbientLight(0xffffff, 0.8));
const light = new THREE.DirectionalLight(0xffffff, 1.5);
light.position.set(3, 3, 3);
scene.add(light);

// 1. Create a 2D Canvas Pattern in memory (Not added to the HTML DOM!)
const canvas = document.createElement('canvas');
canvas.width = 256; 
canvas.height = 256;
const ctx = canvas.getContext('2d');

// Draw a pink background
ctx.fillStyle = '#ec4899';
ctx.fillRect(0, 0, 256, 256);
// Draw a dark blue square in the middle
ctx.fillStyle = '#1e1b4b';
ctx.fillRect(32, 32, 192, 192);
// Draw cyan text over it
ctx.fillStyle = '#38bdf8';
ctx.font = 'bold 36px sans-serif';
ctx.fillText('3D TEXTURE', 38, 140);

// 2. Convert that Canvas into a Three.js Texture
const texture = new THREE.CanvasTexture(canvas);

// 3. Apply the texture to the "map" property of the material
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1.8, 1.8, 1.8),
  new THREE.MeshStandardMaterial({ 
    map: texture,     // Here is our wrapped image!
    roughness: 0.3    // Give it a slightly shiny plastic look
  })
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
      q('What tool is used to load external image files into Three.js?', ['ImageBuffer', 'TextureLoader', 'MeshLoader', 'FileStream'], 1),
      q('Which material property holds the main colored image texture?', ['map', 'skin', 'colorImage', 'textureMap'], 0),
      q('How can you create dynamic textures on the fly without downloading image files?', ['By using CanvasTexture alongside an HTML5 Canvas', 'Writing SVG inline code', 'Using CSS gradients', 'Using JSON files'], 0),
      q('What setting allows a texture image to act like floor tiles instead of stretching?', ['texture.repeat.set() combined with RepeatWrapping', 'texture.stretch = true', 'texture.multiply()', 'texture.loop()'], 0)
    ],
    ['TextureLoader handles remote image files', 'The `map` property applies the image to the surface', 'CanvasTexture generates patterns with code', 'RepeatWrapping prevents stretching on large surfaces']
  ),

  // Lesson 9
  lesson(
    'three-9',
    9,
    'Loading 3D Models (GLTF & GLB)',
    '🗿',
    'Typing out geometry sizes is fine for boxes and spheres, but what if you want a detailed car, a character, or a house? 3D artists build those in software like Blender. We can load their complete models directly into the browser using the GLTF/GLB format!',
    [
      {
        title: '1. What is GLTF / GLB?',
        beginner: 'GLTF is often called the "JPEG of 3D". It is a file format that packs the model shape, the materials, the textures, and even animations into one neat package.',
        advanced: 'GLTF is JSON-based and often references external texture images. GLB is the binary version that compiles everything (geometry + textures) into a single, highly compressed file.'
      },
      {
        title: '2. GLTFLoader',
        beginner: 'Three.js requires a special add-on script called GLTFLoader to read these files. Once loaded, it spits out the fully built 3D scene ready to be used.',
        advanced: 'It loads files asynchronously. You use `.load("path", function(gltf) { ... })` to access `gltf.scene` and add it to your Three.js environment.'
      },
      {
        title: '3. Traversing the Model',
        beginner: 'A model is usually made of many smaller parts grouped together (e.g., a car has tires, doors, windows). "Traversing" means writing code to inspect every tiny piece of the loaded model.',
        advanced: '`gltf.scene.traverse((child) => { ... })` allows you to loop through the scene graph to enable shadows or swap out materials programmatically.'
      },
      {
        title: '4. Animations',
        beginner: 'If the artist animated the character walking in Blender, that animation is saved in the GLTF file! You can use an AnimationMixer to play it.',
        advanced: '`THREE.AnimationMixer(gltf.scene)` handles playback. You clip the specific animation tracks (`gltf.animations`) and call `mixer.update(deltaTime)` in your loop.'
      }
    ],
    {
      title: 'Importing a 3D Model',
      intro: 'To load a model, we must include the `GLTFLoader.js` script in our HTML. Then, we write a loader function to fetch the model from a URL, optionally resize or move it, and finally add it to our scene.',
      steps: [
        'HTML: Include the GLTFLoader script alongside Three.js.',
        'JS: Set up standard lighting (imported models almost always use realistic materials that need light).',
        'JS: Instantiate the `GLTFLoader`.',
        'JS: Call `.load(url, callback)` and wait for the model to download.',
        'JS: Inside the callback, add `gltf.scene` to your main Three.js scene.'
      ],
      goal: 'Understand the standard asynchronous pattern for downloading and displaying pre-made 3D assets.',
      code: {
        html: `<!-- 1. Load Three.js -->\n<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>\n<!-- 2. Load GLTFLoader Add-on -->\n<script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js"></script>\n<div id="canvas-container"></div>`,
        css: 'body { margin: 0; overflow: hidden; background: #222; }',
        js: `const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
camera.position.z = 5;

// Models need good lighting!
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);
const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
dirLight.position.set(5, 10, 5);
scene.add(dirLight);

// Create a loader instance
const loader = new THREE.GLTFLoader();

// Load a public domain sample GLTF model
loader.load(
  'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF/Duck.gltf',
  function (gltf) {
    // This code runs ONLY when the model finishes downloading
    const model = gltf.scene;
    
    // Sometimes models are huge or tiny, let's scale it slightly
    model.scale.set(1.5, 1.5, 1.5);
    
    // Move it down slightly
    model.position.y = -1;
    
    // Finally, add it to the universe
    scene.add(model);
  },
  function (xhr) {
    // Optional: Log loading progress
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    console.error('An error happened loading the model:', error);
  }
);

function animate() {
  requestAnimationFrame(animate);
  // Note: we aren't spinning the model here because we didn't save it to a global variable, 
  // but we can still fly around it if we added OrbitControls!
  renderer.render(scene, camera);
}
animate();`
      }
    },
    [
      q('What is GLTF/GLB?', ['A format for 3D music files', 'A highly compressed file format containing models, materials, and animations', 'A new version of HTML Canvas', 'A special lighting technique'], 1),
      q('How do you load these files into Three.js?', ['Using the built-in TextureLoader', 'Writing an SQL query', 'Using the GLTFLoader add-on script', 'You drag and drop them into the scene'], 2),
      q('Because models take time to download from the internet, the loader function is:', ['Synchronous (stops the whole page from loading)', 'Asynchronous (uses a callback when finished)', 'Instantaneous', 'Broken on mobile devices'], 1),
      q('What tool lets you play animations saved inside the GLTF file?', ['VideoPlayer', 'AnimationMixer', 'GSAP Timeline', 'RequestAnimationFrame'], 1)
    ],
    ['GLTF/GLB is the standard for web 3D models', 'GLTFLoader downloads the assets', 'Models load asynchronously', 'AnimationMixer handles pre-baked animations']
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
  ),

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
