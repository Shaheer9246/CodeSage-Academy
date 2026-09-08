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
    `3D on the web is not magic — it is a carefully orchestrated conversation between your JavaScript code, your computer's graphics card (GPU), and your browser's rendering engine. Before we write a single line of Three.js, you need to understand what is actually happening under the hood.

Your computer has two processors that matter here: the CPU (which runs your JavaScript) and the GPU (which draws millions of pixels on your screen). WebGL is the bridge that lets JavaScript send instructions to the GPU. But raw WebGL is like writing assembly code — incredibly powerful but impossibly complex. You would need to write shader programs in GLSL, manage vertex buffers by hand, and calculate transformation matrices yourself.

Three.js is a friendly abstraction layer that lets you build 3D worlds using simple, intuitive concepts like "scene," "camera," and "mesh" instead of raw GPU commands. Every 3D scene you will ever build follows the same pattern: create a Scene (the universe), create a Camera (your eyes), create a Renderer (the painter), and then tell the Renderer to draw what the Camera sees. Once you internalize this pattern, every Three.js tutorial — and every Awwwards-winning website you see — becomes instantly understandable.`,
    [
      {
        title: '1. What is WebGL?',
        beginner: 'WebGL is a tool built directly into your web browser. It uses your computer\'s graphics card (GPU) to draw incredibly fast 2D and 3D graphics without needing any plugins. Think of it like a direct phone line from JavaScript to your GPU — but the language they speak is very technical and hard to learn. That is why we use Three.js on top of it.',
        advanced: 'WebGL is a JavaScript API based on OpenGL ES 2.0/3.0. It provides low-level access to the GPU by running shader programs (written in GLSL) directly on the graphics hardware. These shaders execute in parallel across thousands of GPU cores, which is why WebGL can render millions of polygons at 60 FPS. However, you must manually manage vertex buffers, transformation matrices, texture units, and framebuffers — which is why we use Three.js instead.'
      },
      {
        title: '2. Why Use Three.js?',
        beginner: 'If you tried to draw a simple 3D cube using pure WebGL, you would need to write hundreds of lines of code — shaders, buffers, matrices. Three.js does all the heavy lifting for you, so you can do it in just a few lines! It is like the difference between building a car from scratch versus driving one — both get you to the destination, but one takes years and the other takes minutes.',
        advanced: 'Three.js provides an object-oriented, high-level abstraction over WebGL. It manages scene graphs, transformation matrices, shader compilation, texture loading, and hardware acceleration behind the scenes. The library automatically handles browser differences, WebGL context loss, and device pixel ratios. Under the hood, Three.js still generates GLSL shaders and manages GPU buffers, but it exposes a clean API like `new THREE.Mesh(geometry, material)` instead of requiring you to write raw shader code.'
      },
      {
        title: '3. The Three Core Ingredients',
        beginner: 'To create a 3D world, you always need three things: a Scene (the world where objects live), a Camera (your eyes looking into the world), and a Renderer (the artist that paints what the camera sees onto your screen). If you forget any of these three, nothing will show up. Think of it like a movie set: the Scene is the stage, the Camera is the film crew, and the Renderer is the projector showing the movie to the audience.',
        advanced: 'The Scene is a graph data structure that holds Object3D elements (meshes, lights, cameras). The Camera calculates view and projection matrices that transform 3D world coordinates into 2D screen coordinates. The WebGLRenderer rasterizes the scene data onto an HTML <canvas> element by compiling shaders, uploading geometry to GPU buffers, and executing draw calls. Every frame, the renderer traverses the scene graph, sorts objects by depth and material, and issues WebGL commands to the GPU.'
      },
      {
        title: '4. The Animation Loop',
        beginner: 'A 3D scene is just like a flipbook or a movie. To make things move, we have to redraw the scene very fast — usually about 60 times every second! This is called the "animation loop" or "render loop". We tell the browser to call our drawing function over and over, and each time we change the position or rotation slightly to create the illusion of motion.',
        advanced: 'We use the browser\'s native `requestAnimationFrame` API, which synchronizes your rendering code with the display monitor\'s refresh rate (typically 60Hz or 120Hz). This prevents screen tearing and ensures smooth animation. The browser calls your callback function before the next repaint, giving you a `timestamp` argument that you can use to calculate frame-independent animation speeds. Never use `setInterval` or `setTimeout` for animation — they are not synchronized with the display and will cause jank.'
      },
      {
        title: '5. The HTML Canvas Element',
        beginner: 'WebGL draws its 3D graphics onto a special HTML element called a <canvas>. Think of the canvas as a digital piece of paper that JavaScript can draw on. The Three.js Renderer creates this canvas element for you automatically, and you just attach it to your webpage.',
        advanced: 'The `<canvas>` element is a bitmap drawing surface managed by the GPU. When you create a WebGLRenderer, Three.js calls `canvas.getContext("webgl2")` to acquire a WebGL rendering context. The canvas has its own internal resolution (set by `renderer.setSize()`), which may differ from its CSS display size — a common source of blurry 3D graphics if you forget to update both.'
      },
      {
        title: '6. Device Pixel Ratio (Retina Screens)',
        beginner: 'Modern screens like iPhones and MacBooks have "retina" displays where each logical pixel is actually made of 2x or 3x physical pixels. If you do not tell Three.js about this, your 3D scene will look blurry on expensive screens. You fix it with a single line: `renderer.setPixelRatio(window.devicePixelRatio)`.',
        advanced: 'The `devicePixelRatio` property reports the ratio between physical and logical pixels (usually 1 on standard displays, 2 on Retina, 3 on high-end mobile). Three.js must scale the internal canvas buffer resolution by this factor to render crisp edges. However, rendering at 2x or 3x resolution is expensive — high-end 3D sites often cap the pixel ratio at 2 with `Math.min(window.devicePixelRatio, 2)` to preserve performance on 3x displays.'
      }
    ],
    {
      title: 'Setting Up Your First 3D Scene',
      intro: 'Let\'s build our very first 3D canvas! In standard web development, Three.js is written in JavaScript, styled with CSS, and injected into an HTML document. Here is how it all connects.',
      steps: [
        'HTML Setup: Create a <div id="canvas-container"></div> where our 3D canvas will live. Expect to see an empty div in your HTML source.',
        'CSS Styling: Add `body { margin: 0; overflow: hidden; }` to remove default margins and prevent scrollbars from appearing. Expect the page to have no white borders.',
        'CSS Sizing: Set `#canvas-container { width: 100vw; height: 100vh; }` to make the container fill the entire viewport. Expect the container to take up the full screen.',
        'JS Step 1: Create the Scene with `const scene = new THREE.Scene();`. Expect an empty 3D universe object in memory, represented as an empty scene graph.',
        'JS Step 2: Set the scene background with `scene.background = new THREE.Color(0x111827);`. Expect the scene to have a dark blue-gray background color.',
        'JS Step 3: Create the Camera with `new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);`. Expect a camera object with a 75-degree field of view, correct aspect ratio, and near/far clipping planes at 0.1 and 1000 units.',
        'JS Step 4: Position the camera with `camera.position.z = 5;`. Expect the camera to move 5 units away from the origin along the Z-axis so it can see objects placed at (0,0,0).',
        'JS Step 5: Create the Renderer with `new THREE.WebGLRenderer({ antialias: true });`. Expect a WebGL renderer object configured to smooth jagged edges on diagonal lines.',
        'JS Step 6: Set the renderer size with `renderer.setSize(window.innerWidth, window.innerHeight);`. Expect the renderer to match the browser window dimensions in pixels.',
        'JS Step 7: Attach the canvas to the DOM with `document.body.appendChild(renderer.domElement);`. Expect a <canvas> element to appear in your HTML document, injected by the renderer.',
        'JS Step 8: Render the scene with `renderer.render(scene, camera);`. Expect to see the dark blue-gray background color on the canvas — your first frame of 3D output.'
      ],
      goal: 'Successfully connect HTML, CSS, and JS to render a blank, colored 3D canvas.',
      code: {
        html: `<!-- We need an element for our 3D graphics to live inside -->
<div id="canvas-container"></div>

<!-- Normally, you would include the Three.js library here like this: -->
<!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script> -->`,
        css: `/* Reset margins so our 3D canvas touches the edges of the screen */
body {
  margin: 0;
  overflow: hidden; /* Prevents scrollbars */
}

#canvas-container {
  width: 100vw;
  height: 100vh;
}`,
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
      q('What tool enables the browser to draw 3D graphics using the graphics card?', ['HTML5 Canvas', 'WebGL', 'CSS3D', 'Node.js'], 1, 'WebGL is the correct answer because it is a JavaScript API that provides direct access to the GPU for rendering 2D and 3D graphics. HTML5 Canvas is a 2D drawing API that cannot access the GPU directly. CSS3D is a CSS transform technique, not a rendering engine. Node.js is a server-side JavaScript runtime that has no access to browser graphics capabilities.'),
      q('What are the 3 main ingredients ALWAYS needed in a Three.js project?', ['HTML, CSS, JS', 'Scene, Camera, Renderer', 'Mesh, Light, Shadow', 'Texture, UV, Shader'], 1, 'Scene, Camera, and Renderer are the three core ingredients. The Scene holds all 3D objects, the Camera defines the viewpoint, and the Renderer draws the scene to a canvas. HTML/CSS/JS are web technologies but not Three.js-specific requirements. Mesh, Light, and Shadow are optional objects you add to the scene. Texture, UV, and Shader are advanced material properties, not required for a basic scene.'),
      q('Why do we use the requestAnimationFrame function?', ['To download API data', 'To smoothly redraw frames over and over for animation', 'To play background music', 'To compress images'], 1, 'requestAnimationFrame is the correct answer because it tells the browser to call your callback function before the next repaint, synchronizing with the display refresh rate for smooth animation. It does not download data, play audio, or compress images. Using setInterval or setTimeout for animation causes jank because they are not synchronized with the display.'),
      q('What does the code `camera.position.z = 5` do?', ['Moves camera left/right', 'Moves camera up/down', 'Moves camera closer to or further from the center', 'Rotates the camera'], 2, 'Setting camera.position.z = 5 moves the camera 5 units along the Z-axis, which in a right-handed coordinate system means moving the camera away from the origin (0,0,0). This allows the camera to see objects placed at the center. The X-axis controls left/right movement, the Y-axis controls up/down movement, and rotation is controlled by the rotation property, not position.'),
      q('What happens if you forget to call renderer.render(scene, camera)?', ['The scene renders automatically', 'Nothing appears on the canvas', 'The browser crashes', 'JavaScript throws an error'], 1, 'Nothing appears on the canvas because the renderer does not automatically draw the scene. You must explicitly call renderer.render() to tell the GPU to draw what the camera sees. The browser will not crash and JavaScript will not throw an error — the canvas will simply remain blank or show the previous frame.'),
      q('What does the `antialias: true` option do when creating the WebGLRenderer?', ['Makes the canvas transparent', 'Smooths jagged edges on 3D objects', 'Increases rendering speed', 'Enables shadows'], 1, 'Antialiasing smooths jagged edges (aliasing) on 3D objects by blending pixel colors at object boundaries. It does not make the canvas transparent, increase speed (it actually slightly decreases performance), or enable shadows. Antialiasing is a quality improvement that makes edges look smoother, especially on diagonal lines and curves.'),
      q('What property reports the physical-to-logical pixel ratio on Retina displays?', ['window.pixelScale', 'window.devicePixelRatio', 'renderer.resolution', 'screen.retinaScale'], 1, 'window.devicePixelRatio is the standard browser property that reports the ratio between physical and logical pixels. It returns 1 on standard displays, 2 on Retina displays, and 3 on high-end mobile devices. You pass this value to renderer.setPixelRatio() to ensure crisp rendering on high-density screens.'),
      q('Why is setInterval a bad choice for animation loops?', ['It is deprecated', 'It is not synchronized with the display refresh rate, causing jank', 'It only works on mobile', 'It is too slow'], 1, 'setInterval runs on a fixed timer that is independent of the display refresh rate. If your timer fires at the wrong moment relative to the screen repaint, you get screen tearing, stuttering, and wasted frames. requestAnimationFrame is synchronized with the browser\'s repaint cycle, guaranteeing smooth animation without tearing.')
    ],
    ['WebGL uses GPU power directly for fast 3D rendering', 'Three.js simplifies WebGL into easy JavaScript abstractions', 'Scene + Camera + Renderer = Your 3D world', 'requestAnimationFrame synchronizes animation with display refresh rate', 'camera.position.z moves the camera forward/backward', 'Always call renderer.render() to draw the scene', 'Use devicePixelRatio for crisp Retina rendering']
  ),

  // Lesson 2
  lesson(
    'three-2',
    2,
    '3D Objects & Meshes',
    '📦',
    `Now that we have an empty 3D universe, let's put something in it! In Three.js, every 3D object you see — a spinning cube, a character, a planet — is called a "Mesh". A Mesh is created by combining two things: a Geometry (the shape) and a Material (the skin or wrapper).

Think of it like building with LEGO: the Geometry is the plastic brick shape (a 2x4 rectangle, a wheel, a door), and the Material is the color and texture you paint on it (red plastic, rubber tire, wooden grain). Only when you snap them together do you get a complete 3D object you can place in your world.

But there is a third invisible ingredient: the Mesh also inherits from Object3D, the base class for all 3D things in Three.js. This gives every Mesh the superpower to move (position), spin (rotation), and resize (scale) in 3D space. These three properties — position, rotation, and scale — are the fundamental tools you will use for the rest of your 3D career. Master them now, and everything else becomes easy.`,
    [
      {
        title: '1. What is Geometry?',
        beginner: 'Think of Geometry as the wireframe or skeleton of an object. It defines the mathematical shape, like a box, a sphere, or a pyramid. Geometry stores all the points (called vertices) and the triangles that connect them, but it has no color or texture yet — it is just the raw shape data.',
        advanced: 'Geometry stores the mathematical data: vertex positions (x, y, z coordinates in Float32Array), face indices (which vertices connect to form triangles), normals (perpendicular vectors for lighting calculations), and texture coordinates (UVs that map 2D images onto 3D surfaces). Three.js provides built-in geometries like BoxGeometry, SphereGeometry, and PlaneGeometry, or you can create custom geometries by manually defining vertex arrays using BufferGeometry.'
      },
      {
        title: '2. What is Material?',
        beginner: 'If Geometry is the skeleton, Material is the skin. It tells the browser what color the object is, if it is shiny or dull, or if it is made of wireframe lines. Materials can be simple flat colors or complex realistic surfaces that react to light and reflections.',
        advanced: 'Materials define the shader calculations (like PBR or Phong shading) that dictate how the surface reacts to lights and cameras in the scene. Three.js provides several material types: MeshBasicMaterial (flat, unlit), MeshLambertMaterial (matte, light-reactive), MeshPhongMaterial (shiny, specular highlights), and MeshStandardMaterial (physically-based rendering with roughness and metalness). Each material type compiles to different GLSL shaders on the GPU.'
      },
      {
        title: '3. What is a Mesh?',
        beginner: 'A Mesh is the final product. It takes your Geometry and wraps it in your Material. Only a complete Mesh can be added to your 3D Scene. Think of it like a finished LEGO piece: you have the shape (geometry) and the color (material) combined into one object you can place in your world.',
        advanced: 'A Mesh is an instance of Object3D, the base class for all 3D objects in Three.js. This means it inherits 3D transformation properties like position (Vector3), rotation (Euler), scale (Vector3), and methods like translateX(), rotateY(), and lookAt(). When you call scene.add(mesh), Three.js adds it to the scene graph and includes it in the next render pass.'
      },
      {
        title: '4. Position, Rotation & Scale',
        beginner: 'Once your Mesh is in the scene, you can move it (position) or spin it (rotation) along the X, Y, or Z axis. Position uses numbers like `position.x = 2` to move right, `position.y = 3` to move up, or `position.z = -5` to move backward. Rotation uses angles to tilt the object, and scale changes its size.',
        advanced: 'Rotations in Three.js use Radians (where Math.PI equals 180 degrees, Math.PI * 2 equals 360 degrees). Transformations are calculated using Matrix4 math under the hood — every object has a `matrix` property that stores its combined position, rotation, and scale as a 4x4 transformation matrix. When you set position.x = 2, Three.js updates the matrix, and the GPU uses that matrix to transform vertices during rendering. You can force an immediate matrix update with `mesh.updateMatrix()`.'
      },
      {
        title: '5. The 3D Coordinate System',
        beginner: 'Three.js uses a "right-hand rule" coordinate system. Point your right thumb to the right (that is +X), your index finger up (that is +Y), and your middle finger toward you (that is +Z). Positive Z comes OUT of the screen toward you, negative Z goes INTO the screen away from you. This is the opposite of what most beginners expect!',
        advanced: 'Three.js uses a right-handed, Y-up coordinate system. The origin (0,0,0) is at the center of the world. Camera by default looks down the negative Z-axis, which is why you must set `camera.position.z = 5` (positive Z) to pull the camera back and see objects at the origin. This coordinate convention matches OpenGL but differs from DirectX (left-handed) and CSS (Y-down). Remembering this prevents the #1 beginner bug: objects appearing "behind" the camera.'
      },
      {
        title: '6. The Scene Graph (Parent-Child)',
        beginner: 'You can put meshes inside other meshes, like a steering wheel inside a car. When the car moves, the steering wheel moves with it automatically! This is called the "scene graph" — a family tree of 3D objects where children follow their parents.',
        advanced: 'Every Object3D has a `children` array and a `parent` reference, forming a tree data structure called the scene graph. When you call `parent.add(child)`, the child\'s transformations become relative to the parent. This enables hierarchical animations: rotating a car\'s body automatically rotates its wheels. The renderer traverses this tree recursively each frame, composing parent and child matrices together using matrix multiplication.'
      }
    ],
    {
      title: 'Creating a Spinning 3D Cube',
      intro: 'Let\'s create a 3D box and animate it. We will write an "animation loop" in JavaScript. This loop will change the cube\'s rotation slightly right before every single frame is drawn to the screen.',
      steps: [
        'Setup: Create the Scene, Camera, and Renderer boilerplate. Set camera.position.z = 4 to pull the camera back so we can see the center of the scene.',
        'Create the Geometry: Use `new THREE.BoxGeometry(1.5, 1.5, 1.5)` to create a cube with width, height, and depth of 1.5 units. Expect a box shape definition in memory.',
        'Create the Material: Use `new THREE.MeshBasicMaterial({ color: 0x6366f1, wireframe: true })` to create a purple wireframe material. Expect a material that shows the skeleton of the shape.',
        'Create the Mesh: Combine them with `const cube = new THREE.Mesh(geometry, material);`. Expect a complete 3D object ready to be added to the scene.',
        'Add to Scene: Call `scene.add(cube);` to place the cube in the 3D world. Expect the cube to be registered in the scene graph.',
        'Create Animation Loop: Write `function animate() { requestAnimationFrame(animate); renderer.render(scene, camera); }`. Expect a function that calls itself 60 times per second.',
        'Add Rotation: Inside the loop, add `cube.rotation.x += 0.01; cube.rotation.y += 0.01;` before the render call. Expect the cube to spin slightly on each frame.',
        'Start the Loop: Call `animate();` once to kick off the animation. Expect to see the cube spinning continuously on the canvas.'
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
      q('A complete 3D object in Three.js is called a Mesh. A Mesh is made of:', ['HTML and CSS', 'Geometry and Material', 'Light and Shadow', 'Camera and Viewport'], 1, 'A Mesh is made of Geometry (the shape) and Material (the surface appearance). HTML and CSS are web technologies, not 3D object components. Light and Shadow are scene elements, not object components. Camera and Viewport are rendering settings, not object parts.'),
      q('Which property turns an object into a transparent cage of lines?', ['wireframe: true', 'grid: true', 'lines: true', 'skeleton: true'], 0, 'wireframe: true is the correct property that renders only the edges of the geometry as lines, creating a cage-like appearance. The other options (grid, lines, skeleton) are not valid Three.js material properties. Wireframe mode is useful for debugging and visualizing geometry structure.'),
      q('Rotations are calculated in radians. How many radians make a half-circle (180 degrees)?', ['Math.PI / 2', 'Math.PI', 'Math.PI * 2', '360'], 1, 'Math.PI radians equals 180 degrees (a half-circle). Math.PI / 2 equals 90 degrees (quarter-circle). Math.PI * 2 equals 360 degrees (full circle). 360 is degrees, not radians. Three.js uses radians because they are the standard unit in mathematics and trigonometry.'),
      q('Where is the best place to put the code that makes an object spin continuously?', ['Inside the HTML file', 'Inside the requestAnimationFrame loop in JS', 'In the CSS stylesheet', 'Inside the scene setup'], 1, 'The requestAnimationFrame loop is the correct place because it runs 60 times per second, allowing you to update rotation values incrementally on each frame. HTML files define structure, not animation logic. CSS cannot animate 3D object properties. Scene setup runs once, not continuously.'),
      q('What does `cube.rotation.x += 0.01` do?', ['Moves the cube right by 0.01 units', 'Rotates the cube around the X-axis by 0.01 radians', 'Scales the cube to 0.01 size', 'Changes the cube color'], 1, 'cube.rotation.x += 0.01 adds 0.01 radians to the cube\'s X-axis rotation on each frame, causing it to spin. The += operator means "add to the current value," so the rotation accumulates over time. Position controls movement, scale controls size, and color is a material property, not a rotation property.'),
      q('In Three.js, which direction does the positive Z-axis point?', ['Into the screen (away from you)', 'Out of the screen (toward you)', 'To the right', 'Upward'], 1, 'In Three.js\'s right-handed coordinate system, positive Z points OUT of the screen toward you. This is why the camera must be at positive Z (like z=5) to look back at objects at the origin (0,0,0). This convention matches OpenGL but differs from DirectX (left-handed) and CSS (Y-down).'),
      q('When you add a child mesh to a parent mesh and move the parent, what happens to the child?', ['Nothing, it stays in place', 'It moves with the parent automatically', 'It disappears', 'It moves in the opposite direction'], 1, 'The child moves with the parent automatically because of the scene graph hierarchy. Children inherit their parent\'s transformations, so rotating a car\'s body rotates its wheels too. This enables complex hierarchical animations without manual coordinate math.'),
      q('Why do we use MeshBasicMaterial instead of MeshStandardMaterial in this example?', ['MeshBasicMaterial is faster and does not require lights', 'MeshBasicMaterial looks more realistic', 'MeshStandardMaterial is deprecated', 'There is no difference'], 0, 'MeshBasicMaterial is used because it does not require lights to be visible and renders faster since it skips lighting calculations. MeshStandardMaterial would appear pitch black without lights in the scene. MeshStandardMaterial is not deprecated — it is the modern standard for realistic rendering. The two materials serve different purposes.')
    ],
    ['Geometry = Shape (vertices and faces)', 'Material = Look/Color (surface appearance)', 'Mesh = Geometry + Material (complete 3D object)', 'Animations happen inside a requestAnimationFrame loop', 'Rotations use radians (Math.PI = 180 degrees)', 'Position, rotation, and scale are Vector3/Euler properties', 'Right-handed coordinate system: +Z points toward you', 'Scene graph enables parent-child hierarchical transforms']
  ),

  // Lesson 3
  lesson(
    'three-3',
    3,
    'Built-in Geometries',
    '📐',
    `Three.js comes with a huge toybox of pre-made shapes called "geometries." You do not need complex math to create spheres, floors, or even donut shapes — you just use the built-in Geometry classes.

But here is the secret most beginners miss: every geometry is made of triangles. Even a smooth-looking sphere is actually hundreds of tiny triangles glued together. The more triangles (called "segments"), the smoother the shape looks — but the more work your GPU has to do.

This is the fundamental tradeoff in 3D graphics: visual quality versus performance. A sphere with 8 segments looks like a diamond and renders instantly. A sphere with 128 segments looks perfectly round but might lag on mobile phones. Learning to choose the right segment count for each situation is what separates amateur 3D from professional 3D.`,
    [
      {
        title: '1. SphereGeometry (Balls)',
        beginner: 'Creates a 3D ball. You can control how big it is with the radius, and how smooth it looks by increasing its "segments". More segments = smoother ball but slower performance. For most games and websites, 16-32 segments is perfect.',
        advanced: 'Segment counts (widthSegments, heightSegments) determine polygon count. A sphere with 32x32 segments contains 2,048 triangles. High segments look smooth but cost more GPU performance. For distant objects, use 8-16 segments; for hero objects near the camera, use 32-64. Three.js also offers IcosahedronGeometry, which distributes vertices more evenly than SphereGeometry for the same triangle count.'
      },
      {
        title: '2. PlaneGeometry (Floors & Walls)',
        beginner: 'Creates a flat 2D sheet in the 3D world. This is perfect for creating the ground for characters to walk on, or walls for rooms. By default, a plane stands upright like a wall — you have to rotate it 90 degrees to lay it flat as a floor.',
        advanced: 'Planes default to facing the Z-axis (perpendicular to the camera view, like a wall). To make it a floor, you must rotate it by -Math.PI / 2 around the X-axis. PlaneGeometry accepts width and height segments for subdivision — useful when you want to apply height-mapped terrain or displacement effects. A single-segment plane is just two triangles, making it the cheapest geometry possible.'
      },
      {
        title: '3. Cylinder & Cone Geometry',
        beginner: 'Great for making tree trunks, pillars, pipes, or party hats. You set the top size and bottom size separately. If both sizes are the same, it is a cylinder. If the top is zero, it becomes a cone (party hat).',
        advanced: 'CylinderGeometry takes (radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded). Can be left hollow by passing `openEnded: true`, which is great for building tunnels and pipes. ConeGeometry is just a Cylinder with radiusTop = 0. LatheGeometry is a more advanced alternative that rotates any 2D profile around the Y-axis to create custom vase-like shapes.'
      },
      {
        title: '4. TorusGeometry (Donuts)',
        beginner: 'Creates a ring or donut shape. Very useful for decorative elements, wheels, tires, or jewelry. You control the main ring size and the thickness of the tube that makes up the ring.',
        advanced: 'TorusGeometry takes (radius, tube, radialSegments, tubularSegments, arc). The `arc` parameter lets you create partial rings (like a horseshoe) instead of full circles. Three.js also provides `TorusKnotGeometry`, which generates mathematically complex, interwoven knot shapes based on parametric equations — perfect for testing reflections, shaders, and demonstrating mathematical beauty.'
      },
      {
        title: '5. Polygon Count & Performance',
        beginner: 'Every triangle your 3D scene draws costs a tiny bit of work for your graphics card. A scene with too many triangles runs slowly. Professional 3D artists always check their polygon count and reduce it wherever possible without making the shapes look ugly.',
        advanced: 'Modern GPUs can render millions of triangles per second, but draw calls (the number of separate objects) matter more than raw triangle count. A scene with 1,000 objects of 100 triangles each runs much slower than 10 objects of 10,000 triangles each. Techniques like instanced rendering (InstancedMesh) and geometry merging reduce draw calls dramatically. Always profile with Chrome DevTools\' Performance tab to find bottlenecks.'
      },
      {
        title: '6. When to Use Custom Geometry',
        beginner: 'The built-in shapes are great for simple objects, but sometimes you need a shape Three.js does not have — like a custom logo, a character, or a car. For those, 3D artists use software like Blender to create the shape and then load it into Three.js as a model file.',
        advanced: 'For truly custom shapes, use BufferGeometry to define vertex positions, normals, and UVs manually. This gives you full control but requires understanding linear algebra. For complex assets, use GLTF/GLB format loaded via GLTFLoader — this is the industry standard workflow. Never hand-code a car or character in BufferGeometry; model it in Blender and export to GLTF instead.'
      }
    ],
    {
      title: 'Building a 3D Shape Playground',
      intro: 'Let\'s write JavaScript to create three different objects and place them side-by-side using the `position.x` property.',
      steps: [
        'Create a shared Material that all three shapes will use: `new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true })`. Expect a single cyan wireframe material that we will reuse across all meshes.',
        'Create a Sphere with `new THREE.SphereGeometry(0.8, 16, 16)`. The 16x16 segments create a moderately smooth ball. Wrap it in a Mesh with the shared material.',
        'Move the Sphere left: Set `sphere.position.x = -2.5`. Expect the sphere to shift 2.5 units to the left of the origin.',
        'Create a Box with `new THREE.BoxGeometry(1.2, 1.2, 1.2)`. Wrap it in a Mesh with the shared material. Leave it at the center (0,0,0) by default.',
        'Create a Torus (Donut) with `new THREE.TorusGeometry(0.7, 0.3, 12, 30)`. The first number is the ring radius, the second is the tube thickness. Wrap it in a Mesh.',
        'Move the Torus right: Set `torus.position.x = 2.5`. Expect the donut to shift 2.5 units to the right of the origin.',
        'Add all three to the scene at once: `scene.add(sphere, box, torus)`. Expect all three shapes to appear side-by-side in the scene graph.',
        'Position the camera with `camera.position.z = 5` to pull back and see all three shapes.',
        'Create an animation loop that rotates each object differently: sphere on Y-axis, box on X-axis, torus on both X and Y axes. Expect each shape to spin uniquely.'
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
      q('Which geometry class would you use to create a 3D donut?', ['SphereGeometry', 'CylinderGeometry', 'TorusGeometry', 'CircleGeometry'], 2, 'TorusGeometry is the correct class for creating donut/ring shapes. SphereGeometry creates balls, CylinderGeometry creates tubes/pillars, and CircleGeometry creates 2D flat circles (not 3D donuts). The Torus takes a radius and tube thickness to create the classic donut shape.'),
      q('What happens if you increase the number of segments on a SphereGeometry?', ['The color gets brighter', 'The shape gets smoother and rounder', 'It turns into a cube', 'It runs faster on the computer'], 1, 'Increasing segment count adds more triangles to the sphere, making it look smoother and rounder. It does not affect color (that is the material), does not turn it into a cube (that would require different geometry), and actually runs SLOWER because there are more triangles to render.'),
      q('Which geometry is best suited for creating a flat ground floor?', ['PlaneGeometry', 'BoxGeometry', 'RingGeometry', 'TetrahedronGeometry'], 0, 'PlaneGeometry is the best choice for flat surfaces like floors, walls, and backgrounds. It creates a simple 2D rectangle in 3D space with minimal triangle count. BoxGeometry creates 3D volumes, RingGeometry creates 2D rings with holes, and TetrahedronGeometry creates triangular pyramids.'),
      q('How do you lay a Plane flat down so it acts like a floor?', ['Rotate X by -Math.PI / 2', 'Rotate Z by 180 degrees', 'Set position.z = -10', 'Scale Y to 0'], 0, 'Rotating the plane by -Math.PI / 2 (negative 90 degrees) around the X-axis lays it flat as a floor. Planes default to facing the Z-axis (standing upright like a wall). Rotating Z by 180 degrees flips it backward but keeps it upright. Changing position.z moves it backward but does not rotate it. Scaling Y to 0 flattens it to invisible.'),
      q('What is the main performance cost of using very high segment counts on geometries?', ['Larger file size', 'More triangles to render, which slows down the GPU', 'More colors to calculate', 'Slower internet download'], 1, 'High segment counts increase triangle count, which means the GPU must process and draw more triangles every frame. This directly reduces frame rate on lower-end devices. File size and download speed are not affected by segment count (only by model complexity and texture size). Color calculation cost is roughly constant regardless of triangle count.'),
      q('Which geometry would you use to create a traffic cone or party hat?', ['CylinderGeometry with radiusTop = 0', 'SphereGeometry', 'TorusGeometry', 'ConeGeometry with height = 0'], 0, 'CylinderGeometry with radiusTop = 0 creates a cone shape (like a traffic cone or party hat). Three.js also has ConeGeometry, but it is essentially a shortcut that internally creates a CylinderGeometry with radiusTop = 0. SphereGeometry creates balls, TorusGeometry creates donuts, and ConeGeometry with height = 0 creates nothing visible.'),
      q('Why might you share a single Material across multiple Meshes instead of creating a new one for each?', ['Materials cannot be shared', 'Sharing reduces memory usage and improves rendering performance', 'It makes the code longer', 'It prevents animations'], 1, 'Sharing materials reduces memory usage because each material compiles to a GPU shader program. When multiple meshes share a material, the GPU can batch their rendering together (instanced rendering), dramatically improving performance. Creating a new material for every mesh wastes memory and forces the GPU to switch shaders constantly.')
    ],
    ['Three.js has pre-built shapes for almost everything', 'Spheres use segments for smoothness (tradeoff: quality vs performance)', 'Planes are great for floors and walls (rotate -Math.PI/2 to lay flat)', 'Use position.x/y/z to organize objects in 3D space', 'Polygon count affects performance — fewer triangles = faster rendering', 'Share materials across meshes for better GPU batching', 'Use GLTF models for complex custom shapes']
  ),

  // Lesson 4
  lesson(
    'three-4',
    4,
    'Materials & Surface Styles',
    '🎨',
    `So far we have used MeshBasicMaterial, which is like painting with flat crayon colors — it ignores light completely and always looks the same no matter what. To make things look like real metal, plastic, glass, or skin, we need to use advanced materials that react to lighting in the scene.

Materials are where 3D graphics become art. The same sphere can look like a rubber ball, a polished steel bearing, or a glass marble — all by changing just two numbers on the material (roughness and metalness). Understanding materials is what separates a 3D scene that looks like a video game from 1995 and one that looks like a Pixar movie.

The secret is this: realistic materials do not fake their appearance. They actually simulate how light behaves in the real world. When light hits a rough surface, it scatters in all directions. When light hits a smooth metal surface, it bounces off in a sharp reflection. Three.js has different material types that calculate these light behaviors at different levels of realism and performance cost.`,
    [
      {
        title: '1. MeshBasicMaterial',
        beginner: 'A flat, simple color. It does NOT react to light and does not show shadows. Great for basic UI elements, cartoon styles, or when you need maximum performance. Think of it like painting with a flat marker — the color never changes no matter what light is in the room.',
        advanced: 'MeshBasicMaterial is highly performant because it skips all shader calculations for lighting and reflections. It compiles to a simple fragment shader that outputs the color directly. It supports color, map (texture), opacity, wireframe, and transparent properties. Use it for UI overlays, unlit objects, or when you need to render thousands of objects quickly.'
      },
      {
        title: '2. MeshLambert & MeshPhong',
        beginner: 'Materials that NEED lights to be seen! If you forget to add lights, they appear pitch black. Lambert is great for dull surfaces (like paper, chalk, or unpolished wood). Phong is great for shiny surfaces (like polished plastic or billiard balls). Both are older but still very useful.',
        advanced: 'MeshLambertMaterial uses per-vertex shading (Gouraud shading) — it calculates lighting at each vertex and interpolates across the triangle. This is fast but less accurate on large polygons. MeshPhongMaterial uses per-pixel shading — it calculates lighting for every pixel, producing sharper specular highlights. Phong is slower but more realistic for shiny surfaces. Both support the classic Phong reflection model: ambient + diffuse + specular.'
      },
      {
        title: '3. MeshStandardMaterial (PBR)',
        beginner: 'The modern standard for realistic 3D. You give it properties like "roughness" (how blurry reflections are) and "metalness" (how much it behaves like a mirror). A roughness of 0.0 is smooth as glass, 1.0 is rough like dirt. A metalness of 1.0 makes it act entirely like a reflective metal, 0.0 is non-metal like plastic or wood.',
        advanced: 'PBR (Physically Based Rendering) is an industry standard used in modern video games, Three.js, and Hollywood VFX to simulate actual physics of light bounce. MeshStandardMaterial uses a Cook-Torrance BRDF (Bidirectional Reflectance Distribution Function) that calculates how light reflects based on microsurface roughness. It supports roughnessMap, metalnessMap, normalMap, and displacementMap for ultra-realistic surfaces. This is the default material for GLTF models.'
      },
      {
        title: '4. MeshPhysicalMaterial',
        beginner: 'An even more realistic version of Standard material. It adds advanced effects like clearcoat (like car paint), sheen (like fabric), and transmission (like glass that actually bends light). Use this for the most premium-looking objects.',
        advanced: 'MeshPhysicalMaterial extends MeshStandardMaterial with physically accurate features: clearcoat (thin transparent layer on top, like car paint), clearcoatRoughness, sheen (soft fabric-like reflection), sheenColor, transmission (glass-like transparency with refraction), ior (index of refraction), and thickness (for volumetric glass). It is more expensive to render but produces cinema-quality materials.'
      },
      {
        title: '5. Opacity & Transparency',
        beginner: 'Want to make a ghost or a glass window? You just tell the material to be transparent, and set the opacity (0.0 is invisible, 1.0 is solid). But there is a catch: you MUST set `transparent: true` on the material, otherwise Three.js ignores the opacity value.',
        advanced: 'To use opacity, you MUST set `transparent: true` on the material, otherwise WebGL ignores the opacity value for performance reasons. Transparent objects must be sorted by distance from the camera (depth sorting) to render correctly — if you see strange rendering artifacts with overlapping transparent objects, this is usually why. For advanced transparency effects like refraction, use MeshPhysicalMaterial with transmission.'
      },
      {
        title: '6. Texture Maps',
        beginner: 'Materials can use images to add details without adding more geometry. A "color map" wraps an image around the shape like wallpaper. A "normal map" fakes bumps and dents using a purple-tinted image. A "roughness map" uses black-and-white to control which parts are shiny and which are dull.',
        advanced: 'PBR materials support multiple texture maps: `map` (color/albedo), `normalMap` (surface detail without geometry), `roughnessMap` (per-pixel roughness), `metalnessMap` (per-pixel metalness), `aoMap` (ambient occlusion shadows), `displacementMap` (actual geometry deformation), `emissiveMap` (self-illumination), and `alphaMap` (transparency). Each map uses UV coordinates from the geometry to determine how the 2D image wraps around the 3D surface.'
      }
    ],
    {
      title: 'Comparing Material Realism',
      intro: 'We are going to create a shiny, metallic sphere. Because we are using a realistic material, we MUST add some light to our scene, otherwise the sphere will be completely pitch black!',
      steps: [
        'Setup the Scene, Camera, and Renderer boilerplate. Position the camera at z=4 to view the sphere.',
        'Add a soft AmbientLight with `new THREE.AmbientLight(0xffffff, 0.5)`. Expect a gentle fill light that prevents shadows from being pure black.',
        'Add a bright DirectionalLight with `new THREE.DirectionalLight(0xffffff, 1.5)` and position it at (5, 5, 5). Expect a sun-like light shining from above and to the right.',
        'Add both lights to the scene: `scene.add(ambientLight, dirLight);`. Expect the lights to be registered in the scene graph.',
        'Create a shiny metal material with `new THREE.MeshStandardMaterial({ color: 0xec4899, roughness: 0.1, metalness: 0.9 })`. Expect a pink material with smooth reflections (low roughness) and strong metallic behavior (high metalness).',
        'Create a sphere with `new THREE.SphereGeometry(1.2, 32, 32)`. The 32x32 segments create a smooth ball.',
        'Combine them into a Mesh and add it to the scene. Expect to see a shiny pink metallic sphere reflecting the light.',
        'Create an animation loop that rotates the sphere slightly on both X and Y axes. Expect the reflections to move across the surface as it spins, revealing the metallic sheen.'
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
      q('Which of these materials completely IGNORES lighting in the scene?', ['MeshStandardMaterial', 'MeshBasicMaterial', 'MeshPhongMaterial', 'MeshPhysicalMaterial'], 1, 'MeshBasicMaterial completely ignores lighting and renders the same color regardless of lights in the scene. MeshStandardMaterial, MeshPhongMaterial, and MeshPhysicalMaterial all require lights to be visible — without lights, they appear pitch black. MeshBasicMaterial is the only unlit material in this list.'),
      q('What material model is the standard for modern, realistic 3D graphics (like video games)?', ['PBR (Physically Based Rendering)', 'Flat Shading', 'Wireframe Rendering', 'Raytracing'], 0, 'PBR (Physically Based Rendering) is the industry standard for realistic 3D graphics, used in modern video games, Three.js, and Hollywood VFX. It simulates actual physics of light bounce using roughness and metalness parameters. Flat shading is a simple technique, wireframe is for debugging, and raytracing is an advanced rendering technique (not a material model).'),
      q('To make a material semi-transparent (like glass), what rule must you follow?', ['You must set opacity: 0.5 AND transparent: true', 'You just change the color to clear', 'Set visible: false', 'Write it in CSS'], 0, 'You must set BOTH opacity: 0.5 (or any value between 0 and 1) AND transparent: true. If you only set opacity without transparent: true, WebGL ignores the opacity value for performance reasons. Changing color to clear does not work (colors are always opaque unless alpha channel is used). Setting visible: false hides the object entirely. CSS cannot control WebGL material properties.'),
      q('Setting a low "roughness" value (like 0.1) on a MeshStandardMaterial makes the object look:', ['Dull and rough like cardboard', 'Shiny and smooth like polished plastic or glass', 'Completely invisible', 'Like a wireframe'], 1, 'A low roughness value (0.0-0.3) makes the surface smooth and shiny, like polished plastic, glass, or metal. A high roughness value (0.7-1.0) makes it dull and rough like cardboard, dirt, or unpolished stone. Roughness controls how blurry reflections are — low roughness = sharp reflections, high roughness = blurry reflections.'),
      q('What happens to a MeshStandardMaterial if you forget to add any lights to the scene?', ['It renders as plain white', 'It turns into wireframe', 'It appears completely pitch black', 'JavaScript throws an error'], 2, 'MeshStandardMaterial appears completely pitch black without lights because it is a physically-based material that calculates lighting from scene lights. Without lights, there is no light to reflect, so the surface appears black. It does not render as white (that would be MeshBasicMaterial), does not turn into wireframe (that is a material property), and JavaScript does not throw an error — the scene just renders dark.'),
      q('Which material would you choose for a realistic glass window that bends light?', ['MeshBasicMaterial', 'MeshLambertMaterial', 'MeshStandardMaterial', 'MeshPhysicalMaterial with transmission'], 3, 'MeshPhysicalMaterial with transmission is the correct choice for realistic glass that bends light (refraction). The transmission property simulates light passing through and bending based on the index of refraction (ior). MeshBasicMaterial ignores light, MeshLambertMaterial is too simple for glass, and MeshStandardMaterial can do transparency but not realistic refraction.'),
      q('What is a "normal map" used for in PBR materials?', ['Changing the object color', 'Faking bumps and surface details without adding geometry', 'Making the object transparent', 'Controlling the animation speed'], 1, 'A normal map uses a purple-tinted image to fake bumps, dents, and surface details without actually adding more triangles to the geometry. It stores surface direction (normals) per pixel, tricking the lighting calculations into thinking the surface has more detail than it actually does. This is essential for realistic materials — a brick wall uses a normal map to show mortar lines without modeling each brick individually.'),
      q('Why does MeshBasicMaterial render faster than MeshStandardMaterial?', ['It uses fewer colors', 'It skips all lighting calculations', 'It has smaller file size', 'It runs on the CPU instead of GPU'], 1, 'MeshBasicMaterial renders faster because it skips all lighting calculations — it compiles to a simple fragment shader that outputs the color directly. MeshStandardMaterial must calculate complex PBR lighting equations (Cook-Torrance BRDF) for every pixel, which is much more expensive. The performance difference can be 10x or more on complex scenes.')
    ],
    ['MeshBasic ignores light (fastest, flat colors)', 'MeshStandard uses PBR for realism (roughness + metalness)', 'Roughness/Metalness control how light bounces (0-1 range)', 'Transparency requires the transparent: true flag', 'MeshPhysical adds clearcoat, sheen, and transmission', 'Normal maps fake surface details without geometry', 'Always add lights for Standard/Phong/Physical materials']
  ),

    // Lesson 5
  lesson(
    'three-5',
    5,
    'Lighting the Scene',
    '💡',
    `In the real world, we do not see objects; we see the light bouncing off them. The exact same rule applies to 3D graphics. Without light, your beautiful MeshStandardMaterials will render as pitch black voids, because physically-based rendering (PBR) calculates color by simulating how photons interact with surfaces.

Lighting is where 3D programming crosses over into cinematography. A single light placed directly in front of a face makes it look flat and unnatural. But a "3-point lighting" setup — a key light, a fill light, and a rim light — instantly creates drama, depth, and professional polish. 

Three.js provides several types of virtual lights, each mimicking a real-world light source. Directional lights act like the sun, Point lights act like lightbulbs, and Spot lights act like flashlights. Understanding how to mix, color, and position these lights is the single fastest way to elevate your 3D scenes from "amateur video game" to "high-end product showcase."`,
    [
      {
        title: '1. AmbientLight (Soft Global Glow)',
        beginner: 'A soft, omnidirectional light that comes from everywhere at once. It has no specific direction and casts no shadows. We use it as a "fill" to make sure the darkest shadows in your scene are not 100% pure black, which looks unnatural.',
        advanced: 'AmbientLight provides a global illumination offset. Mathematically, it simply adds a flat color value to every pixel in the scene regardless of surface normals. It is computationally extremely cheap but provides zero depth or shape definition. In professional scenes, it is often replaced by HemisphereLight or environment maps for more realistic ambient bounce.'
      },
      {
        title: '2. DirectionalLight (The Sun)',
        beginner: 'Light rays that are perfectly parallel, exactly like sunlight coming from millions of miles away. It lights up one side of an object and is the best light for casting sharp, realistic shadows across a large scene.',
        advanced: 'DirectionalLight simulates a light source at infinity. Because the rays are parallel, the position of the light only matters for calculating the angle of incidence; moving it closer or further does not change light intensity (no falloff). Internally, it uses an orthographic camera to render a shadow map, which you must configure via `light.shadow.camera.left/right/top/bottom` to fit your scene bounds.'
      },
      {
        title: '3. PointLight (The Lightbulb)',
        beginner: 'A light that sits at a specific X/Y/Z position and shines equally in all directions, exactly like a bare lightbulb hanging from a ceiling or a glowing firefly. Objects get darker the further they move away from it.',
        advanced: 'PointLight features `distance` and `decay` parameters to calculate physically accurate light attenuation (falloff). A decay of 2 is physically correct for real-world light (inverse-square law). However, physically accurate decay often requires massive intensity values (e.g., 100+) to be visible in Three.js, which is why many developers use a decay of 1 or 0 for artistic control.'
      },
      {
        title: '4. SpotLight (The Flashlight)',
        beginner: 'A light that shoots a cone of illumination in a specific direction, like a stage spotlight, a car headlight, or a flashlight. You can control how wide the cone is and how soft the edges are.',
        advanced: 'SpotLight includes an `angle` (cone width in radians, max Math.PI/2) and `penumbra` (softness of the cone edges from 0 to 1). It also supports distance and decay. Spotlights are the most expensive light to render because they require perspective shadow maps, but they are essential for dramatic, focused lighting effects.'
      },
      {
        title: '5. HemisphereLight (Sky & Ground)',
        beginner: 'A special ambient light that comes from two directions: a bright color from above (like the sky) and a darker color from below (like the ground reflecting light). It makes outdoor scenes look much more natural than a flat AmbientLight.',
        advanced: 'HemisphereLight calculates a gradient between the sky color and ground color based on the surface normal of the geometry. Faces pointing up get the sky color, faces pointing down get the ground color, and side faces get a blend. It is an incredibly cheap way to fake complex environmental light bounces without using heavy environment maps.'
      },
      {
        title: '6. Light Helpers (Debugging)',
        beginner: 'Because lights are invisible (you only see what they hit), it can be hard to tell where they are pointing or how wide their cone is. Three.js provides "Helpers" that draw visible wireframes showing exactly where your lights are and where they are aiming.',
        advanced: 'Classes like `DirectionalLightHelper`, `SpotLightHelper`, and `CameraHelper` render visual gizmos in the scene. You must add the helper to the scene, and crucially, call `helper.update()` inside your animation loop if the light is moving, otherwise the visual gizmo will lag behind the actual light position.'
      }
    ],
    {
      title: 'Creating a 3-Point Studio Light Setup',
      intro: 'Professional photographers and cinematographers use "3-point lighting" to make subjects look amazing. Let\'s replicate this in JavaScript by placing three different lights around a complex knot shape to create dramatic depth.',
      steps: [
        'Setup the Scene, Camera, and Renderer boilerplate. Set the scene background to a very dark gray (0x050505) to make the lights pop.',
        'Add a Key Light: Create a bright DirectionalLight (color 0xffffff, intensity 2) and position it at (3, 3, 3). Expect this to act as the main sun, illuminating the front-right of the object.',
        'Add a Fill Light: Create a soft, dim AmbientLight or HemisphereLight (color 0x1e3a8a, intensity 1). Expect this to fill in the harsh black shadows created by the key light with a cool blue tint.',
        'Add a Rim Light: Create a bright, colored PointLight (color 0x06b6d4, intensity 4, distance 10) and position it at (-3, -1, -2) behind the object. Expect this to catch the back edges of the geometry, creating a glowing cyan outline.',
        'Create the Subject: Use `new THREE.TorusKnotGeometry(1, 0.3, 100, 16)` to create a complex, interwoven shape that catches light beautifully from multiple angles.',
        'Apply a Material: Use `MeshStandardMaterial` with a white color and a roughness of 0.3. Expect the surface to be slightly shiny, picking up the cyan rim light and white key light.',
        'Add all lights and the mesh to the scene. Position the camera at z=4.5 to frame the knot perfectly.',
        'Create an animation loop that slowly rotates the knot on the X and Y axes. Expect the highlights and shadows to slide across the complex geometry as it spins, revealing the 3D depth.'
      ],
      goal: 'Understand how combining different light types, colors, and positions creates professional, cinematic 3D presentation.',
      code: {
        html: '',
        css: 'body { margin: 0; overflow: hidden; background: #050505; }',
        js: `const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050505);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 1. Key Light (Main Bright Sun - Front Right)
const keyLight = new THREE.DirectionalLight(0xffffff, 2);
keyLight.position.set(3, 3, 3);
scene.add(keyLight);

// 2. Fill Light (Soft ambient blue to fill in dark shadows)
const fillLight = new THREE.AmbientLight(0x1e3a8a, 1);
scene.add(fillLight);

// 3. Rim Light (Bright cyan backlight behind the object)
const rimLight = new THREE.PointLight(0x06b6d4, 4, 10);
rimLight.position.set(-3, -1, -2);
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
      q('Which type of light behaves exactly like sunlight shining from far away, with perfectly parallel rays?', ['PointLight', 'DirectionalLight', 'AmbientLight', 'RectAreaLight'], 1, 'DirectionalLight simulates a light source at infinity (like the sun), where all rays are perfectly parallel. PointLight radiates in all directions from a single point. AmbientLight has no direction at all. RectAreaLight emits from a flat rectangular surface.'),
      q('Which light shines equally everywhere and prevents shadows from being pure black, but casts no shadows itself?', ['SpotLight', 'AmbientLight', 'PointLight', 'DirectionalLight'], 1, 'AmbientLight provides a flat, global illumination offset that affects all pixels equally regardless of geometry or direction. It cannot cast shadows because it has no directional vector to calculate shadow maps from.'),
      q('A PointLight acts most like a:', ['Flashlight cone', 'Sun from infinite distance', 'Light bulb radiating in all directions', 'Soft sky color'], 2, 'A PointLight radiates light equally in all directions from a specific X/Y/Z coordinate, exactly like a bare lightbulb. A flashlight cone is a SpotLight, the sun is a DirectionalLight, and a soft sky color is a HemisphereLight.'),
      q('What happens to a MeshStandardMaterial if you forget to add any lights to the scene?', ['It renders as plain white', 'It turns into wireframe', 'It appears completely pitch black', 'JavaScript throws an error'], 2, 'MeshStandardMaterial is a physically-based material that calculates color by simulating light bouncing off the surface. If there are no lights in the scene, there are no photons to bounce, so the material renders as pitch black. It does not throw an error; it just renders dark.'),
      q('Which parameter on a SpotLight controls how soft or hard the edges of the light cone are?', ['angle', 'penumbra', 'decay', 'distance'], 1, 'The `penumbra` parameter (from 0.0 to 1.0) controls the softness of the spotlight\'s edge. 0.0 creates a sharp, hard edge (like a laser), while 1.0 creates a completely soft, feathered edge. The `angle` controls the width of the cone, not the softness.'),
      q('Why might a DirectionalLight\'s shadows look cut off or missing on large objects?', ['The light is too bright', 'The internal shadow camera frustum is too small and needs its bounds adjusted', 'The material is transparent', 'Shadows only work on spheres'], 1, 'DirectionalLight uses an internal orthographic camera to render shadow maps. By default, this camera only covers a small area (usually -5 to +5 units). If your scene is larger, objects fall outside the shadow camera\'s view frustum and stop casting/receiving shadows. You must adjust `light.shadow.camera.left/right/top/bottom`.'),
      q('What is the main advantage of using HemisphereLight over AmbientLight for outdoor scenes?', ['It casts sharper shadows', 'It simulates a gradient between sky color (top) and ground color (bottom) based on surface normals', 'It is brighter', 'It supports spotlights'], 1, 'HemisphereLight calculates a gradient based on the geometry\'s surface normals. Faces pointing up receive the sky color, faces pointing down receive the ground color, creating a much more realistic ambient bounce than the flat, uniform color of an AmbientLight.'),
      q('If you move a PointLight further away from an object, what happens to the light intensity hitting that object?', ['It stays exactly the same', 'It decreases based on the distance and decay parameters (falloff)', 'It increases', 'It turns red'], 1, 'PointLights simulate real-world light attenuation (falloff). As the distance between the light and the object increases, the intensity decreases. The rate of this decrease is controlled by the `decay` parameter (a decay of 2 is physically accurate inverse-square falloff).')
    ],
    ['Ambient = Soft global glow (no shadows)', 'Directional = Sun rays (parallel, casts shadows)', 'Point = Lightbulb (radiates, has falloff)', 'Spot = Flashlight (cone, angle, penumbra)', 'Hemisphere = Sky/ground gradient ambient', 'Use 3-point lighting for cinematic depth', 'Use LightHelpers to debug invisible light positions']
  ),

  // Lesson 6
  lesson(
    'three-6',
    6,
    'Camera Controls & Interactivity',
    '🎥',
    `A static 3D scene is just a picture. An interactive 3D scene is a world. The camera is the user's avatar — their eyes and their means of exploring the digital space you have built. If the camera feels stiff, laggy, or confusing, the entire experience feels broken, no matter how beautiful the 3D models are.

Three.js provides powerful helper classes that handle the complex trigonometry required to translate 2D mouse movements (dragging, scrolling, pinching) into smooth 3D camera orbits, pans, and zooms. But adding controls is only half the battle. You must also handle the messy reality of the web: users resizing their browser windows, switching between desktop and mobile, and trying to click on 3D objects that exist behind a flat 2D screen.

Mastering camera controls, responsive resizing, and raycasting (the art of shooting invisible lasers from the mouse into the 3D world) is what transforms your code from a "cool tech demo" into a polished, interactive web application.`,
    [
      {
        title: '1. OrbitControls (The Standard)',
        beginner: 'A pre-written Three.js add-on that magically allows the user to click-and-drag to rotate the camera around the center of the scene, right-click to pan, and scroll to zoom. It is the standard way to let users explore a 3D object.',
        advanced: 'OrbitControls intercepts DOM mouse, touch, and wheel events and updates the camera\'s transformation matrix accordingly. It maintains an internal "target" vector (the point the camera looks at) and calculates spherical coordinates to orbit around it. It is imported from the Three.js examples/addons directory, not the core library.'
      },
      {
        title: '2. Damping (Physics & Weight)',
        beginner: 'If you enable damping, the camera gets "weight" and momentum. When you drag and let go, it slides smoothly to a stop instead of halting instantly like a robot. This makes the 3D world feel premium and buttery smooth.',
        advanced: 'Damping requires setting `controls.enableDamping = true` and, crucially, calling `controls.update()` inside your `requestAnimationFrame` loop. The controls use a lerp (linear interpolation) algorithm to smoothly ease the camera\'s current position toward its target position on every frame. Forgetting to call `.update()` breaks the damping effect entirely.'
      },
      {
        title: '3. Responsive Window Resizing',
        beginner: 'If a user resizes their browser window or rotates their phone, the 3D canvas gets stretched and ugly. We have to listen for the window "resize" event and tell Three.js to update the camera and canvas size immediately.',
        advanced: 'When the window resizes, you must update `camera.aspect = window.innerWidth / window.innerHeight`, call `camera.updateProjectionMatrix()` to recalculate the 3D-to-2D projection math, and call `renderer.setSize()` to resize the underlying HTML canvas buffer. Failing to update the projection matrix results in a stretched, distorted 3D scene.'
      },
      {
        title: '4. Raycasting (3D Mouse Clicks)',
        beginner: 'Because the 3D scene is drawn on a flat 2D canvas, traditional HTML `onclick` events do not work on 3D boxes. Raycasting solves this by shooting an invisible laser from your mouse cursor into the 3D world to see which object it hits first!',
        advanced: 'The `THREE.Raycaster` normalizes 2D screen mouse coordinates (from -1 to +1) and unprojects them into a 3D ray using the camera\'s projection matrix. It then performs bounding-box and triangle-intersection math against an array of meshes to return an array of intersection points, complete with exact 3D coordinates, face normals, and distance from the camera.'
      },
      {
        title: '5. MapControls vs OrbitControls',
        beginner: 'OrbitControls is great for looking at a single object in the center of the screen. But if you are building a strategy game or a map where the user needs to drag the camera sideways across a flat floor, MapControls feels much more natural.',
        advanced: 'MapControls modifies the camera\'s position and target simultaneously along the X/Z plane, keeping the camera\'s Y height and viewing angle constant during drag events. OrbitControls rotates around a fixed target point. Choosing the right control scheme based on the application\'s UX requirements is a hallmark of professional 3D development.'
      },
      {
        title: '6. Clipping Planes (Near & Far)',
        beginner: 'Have you ever moved a camera really close to an object and seen the front of it get sliced off? Or looked into the distance and seen objects disappear? This is controlled by the camera\'s "near" and "far" clipping planes.',
        advanced: 'The PerspectiveCamera constructor takes `near` and `far` arguments (e.g., 0.1 and 1000). These define the viewing frustum. Objects closer than `near` or further than `far` are not rendered. Setting `near` too close to 0 (like 0.0001) causes severe Z-fighting (depth buffer precision errors) where surfaces flicker. Always set `near` as high as possible (e.g., 0.1 or 1.0) for your specific scene scale.'
      }
    ],
    {
      title: 'Making a Scene Interactive & Responsive',
      intro: 'Let\'s add OrbitControls so we can fly around! Since OrbitControls is an add-on, in a vanilla HTML/JS setup, we have to import its script file right after the main Three.js script. We will also add a window resize listener so our canvas is fully responsive.',
      steps: [
        'HTML Setup: Include the Three.js core script, and then the OrbitControls add-on script via CDN. Expect both libraries to be available in the global `THREE` namespace.',
        'Create a floor grid: Use `new THREE.GridHelper(10, 10, 0x38bdf8, 0x334155)` to create a visual reference plane. Expect a 10x10 cyan and gray grid to appear on the floor.',
        'Create a subject: Add a BoxGeometry with `MeshNormalMaterial` (which colors faces based on their direction). Position it at y=0.75 so it sits perfectly on the grid.',
        'Initialize OrbitControls: `const controls = new THREE.OrbitControls(camera, renderer.domElement);`. Expect the mouse to now be able to rotate the view when clicked and dragged.',
        'Enable Damping: Set `controls.enableDamping = true;`. Expect the camera to have momentum, but notice it will not work yet because we are missing the update call.',
        'Add Resize Listener: Attach `window.addEventListener("resize", ...)`. Inside, update the camera aspect ratio, call `camera.updateProjectionMatrix()`, and call `renderer.setSize()`. Expect the 3D scene to maintain perfect proportions when you resize the browser window.',
        'Update Controls in Loop: Inside the `animate()` function, add `controls.update();` right before `renderer.render()`. Expect the damping momentum to now work perfectly when you release the mouse.',
        'Position Camera: Set `camera.position.set(3, 3, 5);` to give a nice angled isometric view of the grid and box before the user interacts.'
      ],
      goal: 'Allow the user to navigate the 3D space with their mouse and keep the canvas perfectly responsive to screen size changes.',
      code: {
        html: `<!-- First, load Three.js -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<!-- Second, load OrbitControls (it depends on Three.js) -->
<script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>
<div id="canvas-container"></div>`,
        css: 'body { margin: 0; overflow: hidden; background: #0f172a; }',
        js: `const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 1. Initialize OrbitControls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
// 2. Enable smooth physics sliding (requires controls.update() in the loop!)
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
  // 4. Update controls every frame (REQUIRED for damping to work)
  controls.update(); 
  renderer.render(scene, camera);
}
animate();`
      }
    },
    [
      q('What does OrbitControls allow users to do?', ['Edit HTML code in 3D', 'Rotate, pan, and zoom the camera with their mouse or touch', 'Play sound effects', 'Speed up the GPU'], 1, 'OrbitControls intercepts mouse and touch events to rotate the camera around a target point, pan the camera sideways, and zoom in/out via the scroll wheel. It does not edit HTML, play audio, or affect GPU hardware speed.'),
      q('What function MUST be called after updating the camera\'s aspect ratio during a window resize?', ['camera.updateProjectionMatrix()', 'camera.reset()', 'renderer.reload()', 'scene.refresh()'], 0, 'After changing `camera.aspect`, you must call `camera.updateProjectionMatrix()` to recalculate the internal 4x4 projection matrix. Without this, the 3D-to-2D mapping remains outdated, and the scene will appear stretched or squished to match the old aspect ratio.'),
      q('What does `enableDamping = true` do on OrbitControls?', ['Slows down the computer', 'Adds smooth physics momentum to camera movement', 'Locks the camera position', 'Disables zooming'], 1, 'Damping applies a lerp (linear interpolation) algorithm to the camera\'s movement, giving it momentum so it slides smoothly to a stop when you release the mouse. It requires calling `controls.update()` inside the animation loop to calculate the easing on every frame.'),
      q('Because traditional HTML clicks do not work on 3D objects drawn on a canvas, what tool detects mouse clicks in Three.js?', ['Raycaster', 'PointLight', 'BoundingBox', 'MeshNormal'], 0, 'The Raycaster shoots an invisible mathematical ray from the camera through the 2D mouse coordinate into 3D space, calculating intersections with mesh bounding boxes and triangles. PointLights emit photons, BoundingBoxes are just math volumes, and MeshNormal is a material type.'),
      q('If you drag the camera and the 3D scene stretches or squishes when you resize the browser window, what did you forget to call?', ['renderer.clear()', 'camera.updateProjectionMatrix()', 'scene.update()', 'controls.reset()'], 1, 'You forgot `camera.updateProjectionMatrix()`. When the window resizes, the aspect ratio changes. If you update the aspect ratio property but forget to call this method, the camera continues using the old projection math, resulting in distorted, stretched geometry.'),
      q('Which control class is best suited for a top-down strategy game or map application where the user drags the view sideways?', ['OrbitControls', 'MapControls', 'FlyControls', 'PointerLockControls'], 1, 'MapControls is designed specifically for top-down or isometric map navigation. It pans the camera along the X/Z plane while maintaining a constant viewing angle and height, whereas OrbitControls rotates around a fixed central target point.'),
      q('What happens if you set the PerspectiveCamera `near` clipping plane to an extremely small number like 0.00001?', ['The camera can see infinitely far', 'It causes severe Z-fighting (flickering surfaces) due to depth buffer precision loss', 'The browser crashes', 'The canvas turns black'], 1, 'Setting the `near` plane too close to 0 destroys the precision of the GPU\'s depth buffer (Z-buffer). This causes "Z-fighting," where overlapping surfaces flicker rapidly because the GPU cannot mathematically determine which surface is closer. Always set `near` as high as your scene allows (e.g., 0.1 or 1.0).'),
      q('Why must `controls.update()` be called inside the `requestAnimationFrame` loop when damping is enabled?', ['To redraw the HTML', 'Because damping uses per-frame interpolation (lerp) that must be calculated continuously', 'To download textures', 'To prevent memory leaks'], 1, 'Damping does not happen instantly; it eases the camera position over multiple frames using linear interpolation. If you do not call `controls.update()` on every single frame inside the render loop, the interpolation math stops running, and the momentum effect breaks entirely.')
    ],
    ['OrbitControls adds intuitive mouse/touch navigation', 'Enable damping and call controls.update() for buttery momentum', 'Always handle window resize: aspect ratio + updateProjectionMatrix + setSize', 'Raycaster translates 2D mouse clicks into 3D object intersections', 'MapControls are better for top-down/strategy panning', 'Keep camera "near" plane high (e.g. 0.1) to prevent Z-fighting']
  ),

  // Lesson 7
  lesson(
    'three-7',
    7,
    'Animating 3D Objects with GSAP',
    '🎬',
    `Writing manual math inside a \`requestAnimationFrame\` loop (like \`cube.rotation.y += 0.01\`) is fine for a simple spinning box. But the moment you need an object to bounce with gravity, elastic overshoot, or follow a complex choreographed sequence, manual math becomes a nightmare of nested timeouts and trigonometry.

Enter GSAP (GreenSock Animation Platform). GSAP is the industry-standard animation library used by top-tier web agencies, Awwwards-winning sites, and AAA game UIs. It does not replace Three.js; it partners with it. GSAP handles the complex timing, easing curves, and sequencing, while Three.js handles the rendering.

The secret to professional 3D animation is "easing." Nothing in the real world moves at a perfectly constant linear speed. Things accelerate, decelerate, bounce, and overshoot. GSAP gives you a massive library of physics-based easings that instantly make your 3D objects feel like they have weight, mass, and personality.`,
    [
      {
        title: '1. Why GSAP with Three.js?',
        beginner: 'GSAP handles the timing, speed curves, and smooth transitions automatically so you do not have to write scary math formulas. You just tell it "move this box to X=5 over 2 seconds with a bounce," and GSAP does the rest.',
        advanced: 'GSAP mutates numeric object properties directly frame-by-frame. Because Three.js objects (like \`mesh.position\` or \`mesh.rotation`) are just JavaScript objects with numeric properties (x, y, z), GSAP can interpolate them seamlessly. It is highly optimized, avoids garbage collection spikes, and works beautifully alongside the Three.js render loop without conflicting.'
      },
      {
        title: '2. Animating 3D Coordinates',
        beginner: 'You can tell GSAP to target a specific property, like moving an object\'s position, or changing its scale, over a set amount of time. You just pass the object and the destination values.',
        advanced: 'Example: `gsap.to(mesh.position, { x: 2, duration: 1.5 })\`. Notice we target \`mesh.position\` (the Vector3 object), not \`mesh\` directly, because GSAP needs to mutate the \`x\` property inside it. GSAP automatically hooks into \`requestAnimationFrame\` under the hood, updating the values 60 times a second until the duration is complete.'
      },
      {
        title: '3. Easing & Physics',
        beginner: 'Easing controls how an animation starts and stops. It can make an object glide smoothly, snap sharply, or even bounce like a rubber ball! Without easing, animations look robotic and lifeless.',
        advanced: 'GSAP provides dozens of eases: \`power1.inOut\` for smooth mechanical movement, \`bounce.out\` for gravity, \`elastic.out(1, 0.3)\` for springy overshoot, and \`expo.in\` for dramatic cinematic snaps. Easing is applied via a mathematical curve that modifies the interpolation progress (0 to 1) over the duration, creating non-linear motion.'
      },
      {
        title: '4. Animation Timelines',
        beginner: 'Timelines let you chain multiple animations together perfectly. For example: Box moves up, THEN spins, THEN scales down, all in one continuous sequence without messy code.',
        advanced: '\`gsap.timeline()\` creates a master controller. You can append tweens with \`.to()`, offset them with relative delays (e.g., `"+=0.5"\` to start half a second after the previous one ends), and control the entire sequence with \`.play()`, `.pause()`, `.reverse()`, or `.timeScale()\`. This is essential for complex 3D intro sequences.'
      },
      {
        title: '5. The Render Loop Partnership',
        beginner: 'GSAP changes the numbers (like position and rotation), but Three.js still needs to draw the picture. You must keep your standard \`requestAnimationFrame\` loop running so Three.js can render the changes GSAP is making.',
        advanced: 'GSAP and Three.js run on separate loops that happen to sync at 60fps. GSAP updates the JavaScript object properties, and then Three.js reads those updated properties during its render pass. You can actually tell GSAP to use Three.js\'s clock via \`gsap.ticker`, but for 99% of use cases, letting them run parallel is perfectly fine and highly performant.'
      },
      {
        title: '6. Killing & Overwriting Tweens',
        beginner: 'If you click a button to move a box, and click it again before it finishes, the animations might fight each other. GSAP lets you kill old animations so the new one takes over smoothly.',
        advanced: 'Use `gsap.killTweensOf(mesh.position)\` to instantly stop and clear any active animations targeting that specific object. Alternatively, use the \`overwrite: "auto"\` property inside your tween config, which tells GSAP to automatically find and kill conflicting tweens on the same properties, preventing animation buildup and jitter.'
      }
    ],
    {
      title: 'Creating a Bouncing 3D Cube with GSAP',
      intro: 'We will use GSAP to animate a 3D box bouncing up and down while spinning. We just need to include the GSAP library via CDN, and then tell it which object properties to animate!',
      steps: [
        'HTML Setup: Include the GSAP library via CDN script tag before your custom JS. Expect the global \`gsap\` object to be available.',
        'Setup Three.js: Create the standard Scene, Camera, Renderer, and add a DirectionalLight and AmbientLight so the 3D shape is visible.',
        'Create the Subject: Build a BoxGeometry with a MeshStandardMaterial (color 0x6366f1, roughness 0.2). Add it to the scene.',
        'Animate Y Position (Bounce): Use \`gsap.to(mesh.position, { y: 1.5, duration: 1.2, repeat: -1, yoyo: true, ease: "bounce.out" })\`. Expect the box to jump up and fall back down with realistic gravity.',
        'Understand \`repeat: -1\`: This tells GSAP to loop the animation infinitely. Expect the bounce to never stop.',
        'Understand \`yoyo: true\`: This tells GSAP to play the animation in reverse on every other loop (Up, then Down, then Up). Without this, the box would teleport back to the floor instantly.',
        'Animate Rotation (Spin): Add a second \`gsap.to(mesh.rotation, { y: Math.PI * 2, duration: 2.4, repeat: -1, ease: "none" })\`. Expect the box to spin continuously on the Y-axis while bouncing.',
        'Maintain Render Loop: Keep the standard \`requestAnimationFrame\` loop running \`renderer.render()\`. Expect the screen to update, showing GSAP\'s mathematical changes visually.'
      ],
      goal: 'Understand how external animation libraries like GSAP can safely control Three.js objects for smooth, physics-based motion.',
      code: {
        html: \`<!-- Load GSAP Animation Library -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
<div id="canvas-container"></div>\`,
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
      q('What is the main benefit of using GSAP with Three.js?', ['It creates 3D models automatically', 'It handles complex timing, easings, and sequencing so you avoid manual math', 'It generates HTML tags', 'It speeds up internet loading times'], 1, 'GSAP abstracts away the complex trigonometry and timing logic required for smooth, physics-based animations. It does not generate 3D geometry, HTML, or affect network speeds. It purely interpolates JavaScript object properties over time.'),
      q('How do you tell GSAP to animate a mesh\'s height (Y position)?', ['gsap.to(mesh.position, { y: 2 })', 'gsap.to(mesh, { top: 200 })', 'gsap.to(mesh, { height: 2 })', 'gsap.to(mesh.geometry, { y: 2 })'], 0, 'You must target the specific Vector3 object that holds the coordinates: `mesh.position`. GSAP will then interpolate the `y` property inside that object. Targeting `mesh` directly fails because `y` is not a direct property of the Mesh class, and `geometry` holds shape data, not transform data.'),
      q('What does the "yoyo: true" option do in a GSAP animation?', ['Deletes the object', 'Plays the animation forward, then neatly in reverse, creating a continuous loop', 'Spins the camera in circles', 'Shakes the screen'], 1, '`yoyo: true` requires `repeat` to be set. It plays the tween normally, then plays it in reverse on the next iteration, then normally again. This is essential for continuous back-and-forth animations like breathing, hovering, or bouncing without writing separate "return" animations.'),
      q('Which easing style makes an object drop and rebound like a rubber ball hitting the floor?', ['power1.in', 'none', 'bounce.out', 'linear'], 2, '`bounce.out` applies a mathematical curve that simulates gravity and elastic collisions, causing the value to overshoot and settle. `power1` is a standard quadratic ease, `none` and `linear` are constant speeds with no acceleration or deceleration.'),
      q('If you use GSAP to move a 3D object, what must you still do in your Three.js code?', ['Write manual math to move it', 'Keep the requestAnimationFrame render loop running so Three.js draws the updates', 'Stop the render loop', 'Call gsap.render()'], 1, 'GSAP only updates the JavaScript values (like position.y). Three.js still needs its `requestAnimationFrame` loop to read those updated values and draw the pixels to the canvas. If you stop the render loop, the screen will freeze even though GSAP is updating the math in the background.'),
      q('What is the purpose of `gsap.timeline()`?', ['To download 3D models', 'To chain and sequence multiple animations together with precise offsets', 'To change the background color', 'To compile shaders'], 1, 'A timeline acts as a master controller for multiple tweens. It allows you to sequence animations (e.g., move, THEN rotate, THEN fade) with precise control over overlaps and delays, rather than managing dozens of messy setTimeout callbacks or calculating manual delays.'),
      q('How do you stop an active GSAP animation that is currently moving an object?', ['gsap.stop(mesh)', 'gsap.killTweensOf(mesh.position)', 'mesh.pause()', 'cancelAnimationFrame()'], 1, '`gsap.killTweensOf(target)` immediately halts and clears any active tweens affecting the specified target object or property. `cancelAnimationFrame` stops the render loop entirely, and `mesh.pause()` is not a valid Three.js or GSAP method.'),
      q('Why is "ease: none" (linear) usually a bad choice for UI or character animations?', ['It crashes the browser', 'Nothing in the real world moves at a perfectly constant speed; it looks robotic and lifeless', 'It uses too much memory', 'It only works on 2D objects'], 1, 'Linear motion lacks acceleration and deceleration. In the real world, objects have mass and inertia; they speed up and slow down. Using linear easing makes 3D objects feel weightless, robotic, and artificial. Easing adds the "personality" and physics to the motion.')
    ],
    ['GSAP animates position/rotation safely alongside Three.js', 'Target the Vector3 object: gsap.to(mesh.position, {...})', 'Easings (bounce, elastic, power) add weight and physics', 'yoyo: true + repeat: -1 creates infinite back-and-forth loops', 'Timelines sequence complex choreographies without setTimeout', 'Keep the Three.js render loop running to draw GSAP\'s updates']
  ),

  // Lesson 8
  lesson(
    'three-8',
    8,
    'Textures & Surface Materials',
    '🖼️',
    `Plain colors are great for prototyping, but real-world objects have patterns, scratches, fingerprints, and grain. If every object in your 3D scene is a perfect, flat color, it will look like a cheap plastic toy. To achieve realism, we must wrap 2D images around our 3D shapes.

These images are called Textures. A texture can be a photograph of rusted metal, a scan of brick mortar, or a pattern of wood grain. But textures are not just for color. We use special textures to tell the GPU how bumpy a surface is (Normal maps), how shiny it is (Roughness maps), and how much it acts like metal (Metalness maps).

The magic trick of 3D graphics is UV Mapping. This is the mathematical process of taking a flat 2D image and "unwrapping" it onto a 3D surface, exactly like peeling an orange and laying the skin flat. Understanding how to load, apply, and optimize textures is the bridge between amateur 3D and professional, photorealistic rendering.`,
    [
      {
        title: '1. TextureLoader & Async Loading',
        beginner: 'This is a Three.js tool that downloads image files (JPG, PNG) from the internet and converts them into 3D textures. Because downloading takes time, it happens in the background without freezing your website.',
        advanced: 'TextureLoader runs asynchronously using the browser\'s Image API under the hood. It returns a Texture object immediately, but the actual image data loads later. You can use the `onLoad` callback to trigger actions when the image is ready, or use modern `loader.loadAsync(url)` which returns a Promise for cleaner async/await code.'
      },
      {
        title: '2. The Color Map (Albedo)',
        beginner: 'The main image that gets wrapped over the shape is called the "map" (or Albedo). It acts like the wallpaper for the geometry, providing the base color and pattern of the object.',
        advanced: 'Applied via the `map` property on materials. The GPU uses the geometry\'s UV coordinates (stored in the `uv` attribute of the BufferGeometry) to determine exactly how to stretch and wrap the flat 2D image pixels onto the 3D triangles. If the UVs are bad, the texture will look stretched or warped.'
      },
      {
        title: '3. Procedural Canvas Textures',
        beginner: 'Instead of downloading a JPG, you can actually draw custom graphics using a hidden HTML `<canvas>`, and use THAT drawing as your 3D texture! This is great for generating dynamic text, charts, or patterns on the fly.',
        advanced: '`THREE.CanvasTexture` accepts any HTML5 Canvas element as its source. Because the canvas is a live DOM element, you can redraw it using the 2D Context API and call `texture.needsUpdate = true` to push the new pixels to the GPU. This is incredibly powerful for dynamic dashboards, live data visualizations, or in-game computer screens.'
      },
      {
        title: '4. Tiling & RepeatWrapping',
        beginner: 'If you stretch one small image of a brick over a massive floor, it looks blurry and pixelated. Instead, you can tell Three.js to repeat the image over and over like real floor tiles.',
        advanced: 'By default, textures use `ClampToEdgeWrapping` (the edge pixels stretch infinitely). To tile, you must set `texture.wrapS = texture.wrapT = THREE.RepeatWrapping`, and then scale the UVs via `texture.repeat.set(x, y)`. Note: For tiling to work mathematically, the source image dimensions must be powers of two (e.g., 512x512, 1024x1024), though modern WebGL2 is more forgiving.'
      },
      {
        title: '5. Normal Maps (Faking Detail)',
        beginner: 'A Normal Map is a special purple-tinted image that tricks the lighting into thinking the surface has bumps, dents, and scratches, even though the actual 3D shape is perfectly smooth. It saves millions of polygons!',
        advanced: 'Normal maps store XYZ normal vectors in the RGB channels of an image. During the fragment shader pass, the GPU reads these vectors and perturbs the surface normals before calculating lighting (Phong/PBR). This creates the illusion of high-frequency geometric detail (like brick mortar or skin pores) without increasing the actual triangle count of the geometry.'
      },
      {
        title: '6. Texture Memory & Disposal',
        beginner: 'Textures take up a lot of memory on your graphics card. If you delete a 3D object but forget to delete its texture, your website will slowly run out of memory and crash. You must clean up after yourself.',
        advanced: 'JavaScript\'s garbage collector does not know about GPU memory. When removing a mesh, you must explicitly call `mesh.geometry.dispose()`, `mesh.material.dispose()`, and `material.map.dispose()` to free the WebGL buffers. Failing to do this causes "memory leaks" that will eventually crash the browser tab on mobile devices.'
      }
    ],
    {
      title: 'Applying a Dynamic Canvas Texture',
      intro: 'Instead of loading a remote image (which can be tricky due to CORS security in browsers), we are going to use JavaScript to paint a design on an invisible HTML canvas, and instantly wrap it around a 3D box!',
      steps: [
        'Setup Scene: Create the standard Scene, Camera, Renderer, and add Ambient and Directional lights so the MeshStandardMaterial is visible.',
        'Create Hidden Canvas: Use `document.createElement("canvas")` to create a canvas in memory (do not append it to the DOM). Set its width and height to 256x256.',
        'Draw 2D Graphics: Get the 2D context (`ctx = canvas.getContext("2d")`). Draw a pink background, a dark blue square in the center, and cyan text saying "3D TEXTURE". Expect these commands to paint pixels into the hidden canvas memory.',
        'Convert to Texture: Create a Three.js texture using `const texture = new THREE.CanvasTexture(canvas);`. Expect the 2D canvas data to be wrapped in a WebGL-compatible texture object.',
        'Create Material: Build a `MeshStandardMaterial` and assign your new texture to the `map` property. Set roughness to 0.3 for a slight plastic shine.',
        'Apply to Geometry: Create a BoxGeometry (1.8 size) and combine it with the material into a Mesh. Add it to the scene.',
        'Animate: Create a render loop that slowly rotates the cube on the X and Y axes. Expect to see your 2D canvas drawing perfectly wrapped around all 6 sides of the spinning 3D cube.'
      ],
      goal: 'Understand how 2D graphics map onto 3D surfaces using the `map` property and procedural CanvasTextures.',
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
      q('What tool is used to load external image files (JPG/PNG) into Three.js?', ['ImageBuffer', 'TextureLoader', 'MeshLoader', 'FileStream'], 1, 'TextureLoader is the dedicated Three.js class for fetching image files via HTTP, decoding them, and uploading them to the GPU as WebGL textures. MeshLoader is not a standard class, and ImageBuffer/FileStream are not related to Three.js texture management.'),
      q('Which material property holds the main colored image texture?', ['map', 'skin', 'colorImage', 'textureMap'], 0, 'The `map` property (often called the albedo or color map) is the standard property on Three.js materials that accepts a Texture object for the base surface color. The other options are not valid Three.js material properties.'),
      q('How can you create dynamic textures on the fly without downloading image files from a server?', ['By using CanvasTexture alongside an HTML5 Canvas', 'Writing SVG inline code', 'Using CSS gradients', 'Using JSON files'], 0, 'THREE.CanvasTexture wraps an HTML5 Canvas element, allowing you to use the 2D Context API to draw shapes, text, or charts dynamically, and then use that live drawing as a WebGL texture. SVGs, CSS, and JSON cannot be directly applied as WebGL textures without rasterization.'),
      q('What setting allows a texture image to act like floor tiles instead of stretching the edges?', ['texture.wrapS/T = RepeatWrapping and texture.repeat.set()', 'texture.stretch = true', 'texture.multiply()', 'texture.loop()'], 0, 'By default, textures use ClampToEdgeWrapping. To tile an image, you must change the wrapping mode to `THREE.RepeatWrapping` on both the S (U) and T (V) axes, and then use `texture.repeat.set(x, y)` to define how many times it tiles across the surface.'),
      q('What is a "Normal Map" used for in 3D graphics?', ['Changing the base color of the object', 'Faking high-frequency bumps and surface details without adding actual geometry', 'Making the object transparent', 'Animating the object'], 1, 'Normal maps store perturbed surface normals in an RGB image (usually purple-tinted). The shader uses these to calculate lighting as if the surface had deep bumps and scratches, creating the illusion of complex geometry while keeping the actual triangle count extremely low.'),
      q('If you delete a 3D Mesh from the scene, what must you do to prevent GPU memory leaks?', ['Nothing, JavaScript garbage collects it', 'Call .dispose() on the geometry, material, and textures', 'Reload the page', 'Clear the browser cache'], 1, 'JavaScript\'s garbage collector only cleans up CPU memory. GPU buffers (WebGL textures, vertex arrays) must be explicitly freed by calling `.dispose()` on the geometry, material, and any texture maps. Failing to do this will eventually crash the browser tab due to GPU memory exhaustion.'),
      q('If you update a CanvasTexture by drawing new shapes on the canvas, what must you do to make Three.js show the changes?', ['Call renderer.update()', 'Set texture.needsUpdate = true', 'Reload the texture from the server', 'Create a new Mesh'], 1, 'When the underlying HTML Canvas changes, Three.js does not automatically know it needs to re-upload the pixels to the GPU. You must explicitly flag `texture.needsUpdate = true` so the renderer pushes the new canvas data to the WebGL texture buffer on the next frame.'),
      q('Why do 3D artists prefer texture dimensions that are "Powers of Two" (e.g., 512, 1024, 2048)?', ['They look better', 'GPUs process them faster, and they are required for features like mipmapping and repeating', 'They use less color', 'They are easier to draw'], 1, 'Historically, WebGL required Power of Two (POT) dimensions for features like mipmapping (which prevents aliasing at a distance) and RepeatWrapping. While modern WebGL2 supports Non-Power-Of-Two (NPOT) textures, POT textures still offer better GPU memory alignment, faster processing, and full compatibility with all filtering modes.')
    ],
    ['TextureLoader handles async remote image downloading', 'The `map` property applies the base color image to the surface', 'CanvasTexture generates dynamic patterns with 2D code', 'RepeatWrapping + repeat.set() tiles textures without stretching', 'Normal maps fake geometric detail via lighting tricks', 'Always call .dispose() to free GPU memory and prevent crashes']
  ),

  // Lesson 9
  lesson(
    'three-9',
    9,
    'Loading 3D Models (GLTF & GLB)',
    '🗿',
    `Typing out geometry sizes in JavaScript is fine for boxes, spheres, and simple prototypes. But what if you want a detailed sports car, a realistic human character, or an entire architectural building? You do not code those by hand. 3D artists build them in professional software like Blender, Maya, or Cinema4D.

The bridge between the artist's software and your web browser is the GLTF (GL Transmission Format) file format. Often called the "JPEG of 3D," GLTF is the undisputed industry standard for web 3D. It packs the geometry, materials, textures, and even skeletal animations into a highly optimized package that Three.js can download and render instantly.

Learning the GLTF pipeline — exporting from Blender, compressing with Draco, loading asynchronously in Three.js, and traversing the scene graph to modify materials — is the exact workflow used by every professional 3D web agency in the world. This is where your code stops being a "tech demo" and starts being a production-ready 3D application.`,
    [
      {
        title: '1. What is GLTF / GLB?',
        beginner: 'GLTF is a file format that packs the model shape, the materials, the textures, and even animations into one neat package. GLB is the "binary" version of GLTF — it squishes everything into a single, highly compressed file that is perfect for the web.',
        advanced: 'GLTF is a JSON-based specification that references external binary buffers (.bin) and texture images (.png). GLB (GL Transmission Format Binary) encapsulates the JSON, buffers, and textures into a single binary container. GLB is strongly preferred for the web because it eliminates CORS issues with external textures, reduces HTTP requests to exactly one, and loads significantly faster.'
      },
      {
        title: '2. GLTFLoader',
        beginner: 'Three.js cannot read GLTF files by default. You must include a special add-on script called GLTFLoader. Once loaded, it downloads the file and hands you a fully built 3D scene ready to be dropped into your world.',
        advanced: 'GLTFLoader is an asynchronous addon imported from the Three.js examples directory. It parses the JSON structure, creates BufferGeometries, compiles MeshStandardMaterials, and links textures. It returns a `gltf` object containing `gltf.scene` (the root Object3D), `gltf.animations` (animation clips), and `gltf.cameras` (if the artist saved cameras in the file).'
      },
      {
        title: '3. Traversing the Scene Graph',
        beginner: 'A 3D model is usually made of many smaller parts grouped together (e.g., a car has separate meshes for tires, doors, and glass). "Traversing" means writing code to loop through every tiny piece of the loaded model to change its settings.',
        advanced: '`gltf.scene.traverse((child) => { ... })` recursively walks the entire scene graph hierarchy. This is essential for post-load modifications: enabling `child.castShadow = true` on all meshes, swapping out default materials for custom shaders, or finding a specific bone by name to attach a weapon to a character\'s hand.'
      },
      {
        title: '4. Draco Compression',
        beginner: '3D models can be massive files (10MB+). Draco is a special compression tool created by Google that squishes the geometry data down by up to 90%, making your website load almost instantly.',
        advanced: 'Draco compresses vertex positions, normals, and UVs using quantization and predictive coding. To use it, the artist exports with Draco compression enabled (e.g., via `gltf-pipeline` or Blender). In Three.js, you must instantiate `DRACOLoader`, point it to the Draco decoder WASM files, and attach it to the `GLTFLoader`. The decoding happens on a Web Worker to prevent blocking the main thread.'
      },
      {
        title: '5. Playing Animations (AnimationMixer)',
        beginner: 'If the artist animated a character walking or a car driving in Blender, that animation data is saved inside the GLTF file! You use a tool called AnimationMixer to press "play" on those animations.',
        advanced: '`THREE.AnimationMixer(gltf.scene)` acts as the playback engine. You extract specific clips from `gltf.animations` and call `mixer.clipAction(clip).play()`. Crucially, you must call `mixer.update(deltaTime)` inside your `requestAnimationFrame` loop, passing the exact time elapsed since the last frame (using `THREE.Clock`), so the animation advances at the correct speed regardless of framerate.'
      },
      {
        title: '6. Preloading & Asset Management',
        beginner: 'Downloading a 5MB model takes time. If you wait until the user clicks a button to start downloading, the app will freeze. Professional apps download the models in the background while showing a loading screen.',
        advanced: 'Use `THREE.LoadingManager` to track the progress of multiple assets and display a UI progress bar. In modern React/Three.js (R3F), this is handled elegantly via React `Suspense` and `useGLTF.preload()`, which suspends the component tree until the GLB file is fully parsed and uploaded to the GPU, preventing UI jank.'
      }
    ],
    {
      title: 'Importing a 3D Model',
      intro: 'To load a model, we must include the `GLTFLoader.js` script in our HTML. Then, we write a loader function to fetch the model from a URL, optionally resize or move it, and finally add it to our scene.',
      steps: [
        'HTML Setup: Include the core Three.js script, followed by the GLTFLoader addon script via CDN. Expect the `THREE.GLTFLoader` class to be available.',
        'Setup Scene & Lighting: Create the standard Scene, Camera, Renderer. Add strong Ambient and Directional lights. Expect the scene to be ready to receive PBR materials from the model.',
        'Instantiate Loader: Create a new instance with `const loader = new THREE.GLTFLoader();`. Expect a controller object ready to fetch files.',
        'Call Load Method: Use `loader.load(url, onLoad, onProgress, onError)`. Pass the URL of a public domain GLTF model (like the classic Khronos Duck).',
        'Handle Progress: In the `onProgress` callback, log the download percentage. Expect to see console logs updating as the file downloads.',
        'Process Loaded Model: In the `onLoad` callback, extract `gltf.scene`. This is the root Object3D containing the entire model hierarchy.',
        'Transform Model: Scale the model up (`model.scale.set(1.5, 1.5, 1.5)`) and adjust its Y position to sit correctly in the frame. Expect the model to be resized and repositioned.',
        'Add to Scene: Call `scene.add(model)`. Expect the 3D duck to appear in the center of your canvas, fully textured and lit.',
        'Handle Errors: In the `onError` callback, log any network or parsing failures. Expect this to catch 404s or corrupted files gracefully.'
      ],
      goal: 'Understand the standard asynchronous pattern for downloading, processing, and displaying pre-made 3D assets.',
      code: {
        html: `<!-- 1. Load Three.js -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<!-- 2. Load GLTFLoader Add-on -->
<script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js"></script>
<div id="canvas-container"></div>`,
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

// Load a public domain sample GLTF model (Khronos Duck)
loader.load(
  'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb',
  function (gltf) {
    // This code runs ONLY when the model finishes downloading and parsing
    const model = gltf.scene;
    
    // Sometimes models are huge or tiny, let's scale it slightly
    model.scale.set(1.5, 1.5, 1.5);
    
    // Move it down slightly to center it
    model.position.y = -1;
    
    // Finally, add it to the universe
    scene.add(model);
    console.log('Model loaded successfully!');
  },
  function (xhr) {
    // Optional: Log loading progress
    console.log((xhr.loaded / xhr.total * 100).toFixed(0) + '% loaded');
  },
  function (error) {
    console.error('An error happened loading the model:', error);
  }
);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();`
      }
    },
    [
      q('What is GLTF/GLB?', ['A format for 3D music files', 'The industry-standard file format containing models, materials, textures, and animations', 'A new version of HTML Canvas', 'A special lighting technique'], 1, 'GLTF (GL Transmission Format) is the "JPEG of 3D," designed specifically for efficient transmission and loading of 3D scenes on the web. GLB is its binary counterpart. It is not used for audio, HTML, or lighting.'),
      q('How do you load GLTF/GLB files into Three.js?', ['Using the built-in TextureLoader', 'Writing an SQL query', 'Using the GLTFLoader add-on script', 'You drag and drop them into the scene'], 2, 'Three.js core does not include 3D model parsers to keep the library size small. You must import the `GLTFLoader` addon from the examples directory to parse the JSON/binary structure and generate Three.js objects.'),
      q('Why is the GLB (Binary) format generally preferred over standard GLTF for web deployment?', ['It has better colors', 'It packages everything into a single file, reducing HTTP requests and avoiding CORS texture issues', 'It is older and more stable', 'It does not require a loader'], 1, 'Standard GLTF uses a JSON file that references external .bin and .png files, requiring multiple HTTP requests and often triggering CORS errors. GLB encapsulates the JSON, geometry buffers, and textures into a single binary file, requiring exactly one fetch request and bypassing external texture CORS issues.'),
      q('Because models take time to download from the internet, the GLTFLoader function is:', ['Synchronous (stops the whole page from loading)', 'Asynchronous (uses callbacks or promises to run when finished)', 'Instantaneous', 'Broken on mobile devices'], 1, 'Network requests are inherently asynchronous. GLTFLoader fetches the file in the background, allowing the rest of the website to remain interactive. When the download and parsing complete, it triggers the `onLoad` callback.'),
      q('What tool lets you play skeletal or keyframe animations saved inside the GLTF file?', ['VideoPlayer', 'THREE.AnimationMixer', 'GSAP Timeline', 'RequestAnimationFrame'], 1, 'THREE.AnimationMixer is the specific Three.js class designed to read `AnimationClip` data (from `gltf.animations`), manage playback states, and interpolate keyframes over time. GSAP can animate properties, but AnimationMixer is built specifically for complex skeletal and morph target animations.'),
      q('What is the purpose of `gltf.scene.traverse()`?', ['To delete the model', 'To recursively loop through every child mesh and bone in the model\'s hierarchy', 'To compress the file size', 'To change the background color'], 1, 'GLTF models are complex scene graphs containing nested Groups, Meshes, and Bones. `traverse()` executes a callback function on every single node in that hierarchy, allowing you to globally enable shadows, swap materials, or find specific named parts without manually digging through nested children arrays.'),
      q('What does Draco compression do to a 3D model?', ['Makes it brighter', 'Drastically reduces the geometry file size (up to 90%) by compressing vertex data', 'Adds animations', 'Converts it to 2D'], 1, 'Draco is a Google-developed algorithm that compresses vertex positions, normals, and UV coordinates using quantization. It requires a WebAssembly decoder in the browser but dramatically reduces payload size, which is critical for mobile web performance.'),
      q('When updating an AnimationMixer inside the render loop, what value must you pass to `mixer.update()`?', ['The total frame count', 'The delta time (seconds elapsed since the last frame)', 'The mouse position', 'The camera rotation'], 1, 'You must pass the `delta` time (usually obtained from `THREE.Clock.getDelta()`). This tells the mixer exactly how much time has passed since the last frame, ensuring the animation plays at the correct real-world speed regardless of whether the user\'s monitor runs at 60Hz, 120Hz, or drops to 30fps.')
    ],
    ['GLTF/GLB is the "JPEG of 3D" (industry standard)', 'Use GLTFLoader addon to fetch and parse files asynchronously', 'Prefer GLB (binary) over GLTF to avoid CORS and reduce HTTP requests', 'Use traverse() to modify nested meshes and enable shadows post-load', 'Draco compression reduces geometry payload by up to 90%', 'AnimationMixer + Clock.getDelta() plays baked artist animations']
  ),

  // Lesson 10
  lesson(
    'three-10',
    10,
    'Shadows & Realism',
    '👤',
    `Shadows are the subconscious anchor of reality. When you look at a cup on a table, your brain uses the shadow to instantly calculate the cup's distance from the table, the direction of the sun, and the hardness of the surface. Without shadows, 3D objects look like they are floating in a void, completely disconnected from their environment.

But real-time shadows are not free. They are one of the most computationally expensive effects in 3D graphics. To cast a shadow, the GPU must essentially render the entire scene a second time from the perspective of the light bulb, creating a "shadow map." It then projects that map back onto the scene from the camera's perspective. 

Understanding how to enable shadows, configure the shadow camera frustum, fix "shadow acne" (ugly visual artifacts), and balance performance is the final hurdle between a scene that looks like a 1990s video game and one that looks like a modern cinematic experience.`,
    [
      {
        title: '1. Enable Shadows on Renderer',
        beginner: 'Shadows are turned off by default in Three.js because they slow down the computer. You must explicitly turn them on by telling the renderer to calculate shadow maps.',
        advanced: 'Set `renderer.shadowMap.enabled = true`. You can also change the algorithm via `renderer.shadowMap.type`. `THREE.PCFSoftShadowMap` is the industry standard for web, providing smooth, anti-aliased shadow edges at a reasonable performance cost compared to the harsh edges of `BasicShadowMap`.'
      },
      {
        title: '2. Light Shadow Setup',
        beginner: 'Not all lights can cast shadows. Ambient light comes from everywhere, so it cannot cast a shadow. Only directional, point, and spot lights can cast shadows, and you must turn the feature on for each light individually.',
        advanced: 'Set `light.castShadow = true`. You must also configure the internal shadow camera. For DirectionalLight, adjust `light.shadow.camera.left/right/top/bottom` to tightly fit your scene. If the shadow camera frustum is too large, the shadow map resolution is stretched thin, resulting in pixelated, blocky shadows.'
      },
      {
        title: '3. Mesh Shadow Flags',
        beginner: 'You must explicitly tell Three.js which objects are solid enough to block light (cast a shadow) and which objects are surfaces that can receive a shadow (like a floor).',
        advanced: 'Set `mesh.castShadow = true` for obstacles (characters, props). Set `mesh.receiveShadow = true` for ground planes and walls. An object can both cast and receive shadows (like a brick wall), but separating these flags allows you to optimize performance by stopping invisible or distant objects from participating in the shadow pass.'
      },
      {
        title: '4. Shadow Acne & Bias',
        beginner: 'Sometimes shadows look like they have ugly, striped zebra patterns or flickering noise on the surface of the object casting them. This is called "shadow acne." You fix it by tweaking a setting called "bias".',
        advanced: 'Shadow acne occurs due to depth buffer precision errors (self-shadowing artifacts). The GPU incorrectly calculates that the surface is slightly behind itself. You fix this by applying a `light.shadow.bias` (usually a small negative number like -0.0005) which artificially pushes the shadow map depth slightly away from the surface. Too much bias causes "Peter Panning" (shadows detaching from the object).'),
      {
        title: '5. Shadow Map Resolution',
        beginner: 'If your shadows look blocky and pixelated, the "resolution" of the shadow map is too low. You can increase it to make the shadows crisp and sharp, but it costs more performance.',
        advanced: 'Configure `light.shadow.mapSize.width` and `height` (default is 512x512). Increasing to 1024, 2048, or 4096 yields crisp shadows but exponentially increases GPU memory and render time. Professional developers keep shadow resolution as low as visually acceptable and rely on `PCFSoftShadowMap` to blur the edges, hiding the low resolution.'
      },
      {
        title: '6. Performance Costs',
        beginner: 'Every single light that casts a shadow forces the computer to draw the whole scene an extra time. If you have 5 shadow-casting lights, the computer is drawing the scene 6 times! Keep shadow lights to an absolute minimum.',
        advanced: 'Shadow mapping requires a separate render pass to a framebuffer texture for every shadow-casting light. In a complex scene, this destroys the fill rate. The professional approach is to use exactly ONE DirectionalLight for main shadows (the sun), and use fake "blob shadows" (a simple dark decal projected under characters) or baked ambient occlusion for secondary contact shadows.')
    ],
    {
      title: 'Real-time Soft Shadow Scene',
      intro: 'Let\'s build a scene with a bouncing sphere casting a soft, realistic shadow onto a floor plane. We will configure the renderer, the light, and the meshes to participate in the shadow pass.',
      steps: [
        'Enable Renderer Shadows: Set `renderer.shadowMap.enabled = true` and `renderer.shadowMap.type = THREE.PCFSoftShadowMap`. Expect the renderer to allocate memory for shadow framebuffers.',
        'Setup Shadow Light: Create a DirectionalLight. Set `light.castShadow = true`. Expect the light to prepare its internal orthographic shadow camera.',
        'Configure Shadow Quality: Set `light.shadow.mapSize.width = 1024` and `height = 1024`. Expect the shadow resolution to be upgraded from the default 512, yielding sharper edges.',
        'Create the Floor: Build a large PlaneGeometry. Rotate it flat (`rotation.x = -Math.PI / 2`). Crucially, set `floor.receiveShadow = true`. Expect the floor to be registered as a shadow receiver.',
        'Create the Sphere: Build a SphereGeometry. Set `sphere.castShadow = true`. Expect the sphere to be registered as a shadow caster.',
        'Add Lighting: Add the DirectionalLight and a soft AmbientLight (ambient does not cast shadows but fills the dark areas). Add all meshes to the scene.',
        'Animate Bounce: Use `THREE.Clock` to get elapsed time. Use `Math.sin()` to make the sphere bounce up and down on the Y-axis. Expect the sphere to move vertically.',
        'Render: Run the animation loop. Expect to see the sphere bouncing, and a soft, dark shadow stretching and shrinking on the floor directly beneath it, anchoring it to reality.'
      ],
      goal: 'See realistic real-time soft shadows cast on the floor, and understand the cast/receive relationship.',
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
light.castShadow = true; // REQUIRED
light.shadow.mapSize.width = 1024; // Higher quality
light.shadow.mapSize.height = 1024;
scene.add(light);

// Floor (Receives Shadow)
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({ color: 0x334155 })
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -1;
floor.receiveShadow = true; // REQUIRED
scene.add(floor);

// Sphere (Casts Shadow)
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.2 })
);
sphere.castShadow = true; // REQUIRED
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
      q('Which property turns on shadow calculation in the WebGLRenderer?', ['renderer.shadows = true', 'renderer.shadowMap.enabled = true', 'renderer.enableDepth = true', 'renderer.darkness = 1'], 1, 'renderer.shadowMap.enabled = true is the master switch that tells the WebGLRenderer to allocate framebuffers and execute shadow passes for any lights marked with castShadow. The other properties do not exist or control different rendering features.'),
      q('Which light type CANNOT cast shadows in Three.js?', ['DirectionalLight', 'SpotLight', 'AmbientLight', 'PointLight'], 2, 'AmbientLight cannot cast shadows because it has no directional vector or point of origin; it illuminates all pixels equally from all directions. Shadows require a specific light position or direction to calculate occlusion. Directional, Spot, and Point lights all support shadow mapping.'),
      q('To cast a shadow on the floor, what flag must be set on the moving object (like a character)?', ['receiveShadow = true', 'castShadow = true', 'opaque = true', 'visible = true'], 1, 'castShadow = true tells the renderer that this specific mesh is solid enough to block light rays and project a silhouette onto the shadow map. receiveShadow is for the floor, opaque is a material blending flag, and visible just hides the mesh entirely.'),
      q('What flag must be set on the ground floor mesh to show the shadow falling on it?', ['receiveShadow = true', 'castShadow = true', 'floor = true', 'ground = true'], 0, 'receiveShadow = true tells the renderer to sample the shadow map during the fragment shader pass for this specific mesh. If false, the floor will be fully lit even if an object is blocking the light above it.'),
      q('What causes "Shadow Acne" (ugly striped artifacts on the surface of an object casting a shadow)?', ['The texture is corrupted', 'Depth buffer precision errors causing the surface to shadow itself', 'The light is too bright', 'The material is transparent'], 1, 'Shadow acne is a self-shadowing artifact caused by limited depth buffer precision. The GPU incorrectly calculates that parts of the surface are slightly behind the shadow map. It is fixed by applying a small negative `light.shadow.bias` to offset the depth calculation.'),
      q('If your shadows look incredibly blocky and pixelated, what is the most likely fix?', ['Increase the light intensity', 'Increase light.shadow.mapSize.width and height (e.g., to 2048)', 'Change the material color', 'Add more AmbientLight'], 1, 'Shadow maps are textures rendered from the light\'s perspective. If the resolution (mapSize) is too low (e.g., 256x256), the shadow will look pixelated when projected over a large area. Increasing the mapSize yields crisper shadows at the cost of GPU memory.'),
      q('Why is it a bad idea to have 5 different PointLights all casting shadows in a single scene?', ['The colors will mix badly', 'Each shadow-casting light forces the GPU to render the entire scene an extra time, destroying performance', 'Three.js will crash', 'Shadows only work with 1 light'], 1, 'Shadow mapping requires a separate render pass to a framebuffer for every shadow-casting light. Five shadow-casting lights means the GPU must render the scene geometry six times per frame (1 camera pass + 5 light passes). This destroys the fill rate and framerates, especially on mobile.'),
      q('What is "Peter Panning" in 3D graphics?', ['A flying animation', 'When the shadow bias is too high, causing the shadow to detach and float away from the object casting it', 'A type of texture', 'A camera control'], 1, 'Peter Panning is the side-effect of over-correcting Shadow Acne. If you set `light.shadow.bias` too high (too negative) to fix acne, you push the shadow map too far away from the geometry, causing the shadow to visually detach from the object\'s base, making it look like it is floating or hovering.')
    ],
    ['Enable renderer.shadowMap.enabled globally', 'Set castShadow = true on obstacles, receiveShadow = true on floors', 'Use PCFSoftShadowMap for smooth, anti-aliased edges', 'Increase shadow.mapSize for crispness (costs memory)', 'Fix shadow acne with small negative light.shadow.bias', 'Limit shadow-casting lights to 1 or 2 for performance']
  ),

 
    // Lesson 11
  lesson(
    'three-11',
    11,
    'Particle Systems & Performance',
    '✨',
    `In 3D graphics, complexity is the enemy of performance. If you try to render a snowstorm by creating 10,000 individual \`THREE.Mesh\` spheres, your browser will instantly freeze. Every single mesh requires a "draw call" — a command sent from the CPU to the GPU. Sending 10,000 commands per frame creates a massive bottleneck, choking the processor before the graphics card even gets a chance to draw.

The solution is the Particle System. Instead of 10,000 separate objects, we create a single \`THREE.Points\` object that contains 10,000 vertices. The GPU renders all 10,000 points in a single, highly optimized draw call. This is the secret behind galaxies, rain, fire, dust motes, and magical spell effects in high-end web experiences.

But particle systems require a shift in how you think about data. Instead of manipulating JavaScript objects, you must manipulate raw, contiguous blocks of memory called Typed Arrays (\`Float32Array\`). You are no longer just a JavaScript developer; you are feeding raw coordinates directly into the graphics card's pipeline. Mastering this bridge between CPU memory and GPU rendering is the hallmark of a senior WebGL engineer.`,
    [
      {
        title: '1. The Draw Call Bottleneck',
        beginner: 'Imagine asking a painter to paint 10,000 dots, but you make them pick up a new brush and dip it in paint for every single dot. That is what creating 10,000 meshes does to your computer. Particles tell the painter to use a single spray can for all 10,000 dots at once.',
        advanced: 'The CPU-GPU bus is a severe bottleneck. Every `THREE.Mesh\` triggers a state change and a draw call (\`gl.drawElements`). 10,000 meshes mean 10,000 draw calls, which will drop framerates to single digits even on powerful GPUs. `THREE.Points\` uses a single \`gl.drawArrays(gl.POINTS, ...)\` call, shifting the bottleneck from CPU draw calls to GPU fragment processing, which modern hardware handles effortlessly.'
      },
      {
        title: '2. Float32Array & BufferGeometry',
        beginner: 'To handle thousands of particles, we cannot use standard JavaScript arrays. We use special "typed arrays" that store numbers in a continuous block of memory, exactly how the graphics card expects to receive them.',
        advanced: '\`THREE.BufferGeometry\` relies on \`Float32Array\` to store vertex attributes. A particle system with 10,000 points requires a \`Float32Array\` of length 30,000 (x, y, z for each point). This contiguous memory layout allows the browser to upload the entire buffer to the GPU\'s VRAM in a single operation via \`gl.bufferData`, bypassing the overhead of JavaScript object parsing.'
      },
      {
        title: '3. THREE.Points & PointsMaterial',
        beginner: 'THREE.Points is the special object that draws dots instead of solid shapes. PointsMaterial lets you control the size, color, and transparency of every single dot in the system at once.',
        advanced: '`THREE.PointsMaterial\` compiles to a specific shader that utilizes \`gl_PointSize\` and \`gl_PointCoord\` in the vertex and fragment shaders. It supports \`sizeAttenuation\` (particles shrink with distance from the camera) and \`alphaMap\` (using a texture to make square points look like soft, round glowing orbs or snowflakes).'
      },
      {
        title: '4. Vertex Colors & Custom Attributes',
        beginner: 'What if you want every star in your galaxy to be a different color? You can pass a second array of colors to the geometry, telling the graphics card exactly what color to paint each individual dot.',
        advanced: 'Beyond positions, \`BufferGeometry\` accepts custom attributes like \`color\` (Float32Array of RGB values) or \`size\` (Float32Array of individual point sizes). By setting \`material.vertexColors = true`, the shader interpolates these attributes per-vertex. Advanced developers use custom `ShaderMaterial\` to pass arbitrary data (like velocity or lifespan) as attributes for GPU-driven particle physics.'
      },
      {
        title: '5. GPU-Driven Animation',
        beginner: 'Moving 10,000 particles using JavaScript math on every frame is slow. Professional developers write custom "shaders" (tiny programs that run directly on the graphics card) to move the particles at lightning speed.',
        advanced: 'Updating a \`Float32Array\` on the CPU and re-uploading it to the GPU every frame destroys performance. The professional approach is to pass a \`uTime\` uniform to a custom \`ShaderMaterial\` and calculate sine waves, noise, or orbital math directly in the GLSL vertex shader. The CPU does zero math; the GPU parallelizes the movement of millions of particles instantly.'
      },
      {
        title: '6. Memory Leaks & Disposal',
        beginner: 'When you delete a particle system, the graphics card does not automatically forget about it. If you do not explicitly tell the computer to "throw away" the geometry and materials, your website will slowly eat up all the memory and crash.',
        advanced: 'JavaScript\'s Garbage Collector only cleans up CPU heap memory. WebGL buffers (VBOs, VAOs) and textures live in GPU VRAM. When unmounting a particle system, you must explicitly call \`geometry.dispose()`, `material.dispose()`, and `material.map.dispose()\`. In React Three Fiber, the reconciler handles basic disposal, but custom attributes and render targets require manual cleanup in \`useEffect\` return functions.')
      }
    ],
    {
      title: 'Building a 3D Galaxy Starfield',
      intro: 'We will generate 5,000 particles distributed in a spherical cloud, assigning each one a randomized color to create a vibrant, deep-space starfield.',
      steps: [
        'Setup the Scene: Create the standard Scene, Camera, and Renderer boilerplate with a pitch-black background (0x030712).',
        'Define Particle Count: Set \`const count = 5000\`. Expect to manage 5,000 individual points.',
        'Allocate Position Memory: Create \`const positions = new Float32Array(count * 3)\`. Expect a contiguous block of memory holding 15,000 empty floats.',
        'Allocate Color Memory: Create \`const colors = new Float32Array(count * 3)\`. Expect a second block for RGB values.',
        'Populate Data: Loop 5,000 times. For each particle, assign a random X, Y, Z position (spread out by multiplying Math.random() by 10) and a random RGB color. Expect the arrays to fill with spatial and color data.',
        'Build BufferGeometry: Create \`new THREE.BufferGeometry()\`. Attach the positions via \`setAttribute("position", ...)\` and colors via \`setAttribute("color", ...)\`. Expect the geometry to map the raw arrays to GPU attributes.',
        'Create Material: Use \`new THREE.PointsMaterial({ size: 0.05, vertexColors: true })\`. Expect the material to read the color attribute instead of a single flat color.',
        'Create Points Object: Combine geometry and material into \`new THREE.Points()\`. Add it to the scene.',
        'Animate: In the render loop, slowly rotate the entire Points object on the Y and X axes. Expect the entire galaxy to spin as a single cohesive unit, maintaining 60 FPS effortlessly.'
      ],
      goal: 'Build a high-performance, multi-colored 3D particle system using raw typed arrays.',
      code: {
        html: '',
        css: 'body { margin: 0; overflow: hidden; background: #030712; }',
        js: \`const scene = new THREE.Scene();
scene.background = new THREE.Color(0x030712);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const count = 5000;
const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i += 3) {
  // Positions (Spread out in a 10x10x10 cube)
  positions[i] = (Math.random() - 0.5) * 10;     // x
  positions[i + 1] = (Math.random() - 0.5) * 10; // y
  positions[i + 2] = (Math.random() - 0.5) * 10; // z

  // Colors (Random vibrant RGB values)
  colors[i] = Math.random();     // r
  colors[i + 1] = Math.random(); // g
  colors[i + 2] = Math.random(); // b
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const material = new THREE.PointsMaterial({
  size: 0.05,
  vertexColors: true, // Tell material to use the color attribute
  transparent: true,
  opacity: 0.9,
  sizeAttenuation: true // Shrink with distance
});

const starfield = new THREE.Points(geometry, material);
scene.add(starfield);

camera.position.z = 5;

function animate() {
  requestAnimationFrame(animate);
  starfield.rotation.y += 0.001;
  starfield.rotation.x += 0.0005;
  renderer.render(scene, camera);
}
animate();\`
      }
    },
    [
      q('Why are particle systems vastly faster than creating 5,000 individual THREE.Mesh spheres?', ['They run without WebGL', 'They render all points using a single GPU draw call', 'They don\'t require a camera', 'They use less HTML'], 1, 'Every THREE.Mesh requires a separate draw call (CPU to GPU command). 5,000 meshes mean 5,000 draw calls, which chokes the CPU. THREE.Points renders all 5,000 vertices in a single `gl.drawArrays` call, shifting the workload to the highly parallel GPU.'),
      q('Which JavaScript data structure is required to store vertex positions for fast GPU upload?', ['Standard Array []', 'Float32Array', 'Map object', 'JSON string'], 1, 'Float32Array is a Typed Array that stores 32-bit floating-point numbers in a contiguous block of memory. This exact memory layout matches what the GPU expects, allowing the browser to upload the entire buffer to VRAM in a single operation via `gl.bufferData`.'),
      q('What object combines a BufferGeometry with a PointsMaterial to render particles?', ['THREE.Points', 'THREE.Mesh', 'THREE.Line', 'THREE.ParticleEmitter'], 0, 'THREE.Points is the specific Object3D subclass designed to render BufferGeometry as point sprites (gl.POINTS) rather than solid triangles (gl.TRIANGLES) which THREE.Mesh uses.'),
      q('How do you make every single particle in a system a different color?', ['Create a different material for each particle', 'Use a Float32Array for colors, attach it as a "color" attribute, and set vertexColors: true', 'Use CSS classes', 'It is impossible in WebGL'], 1, 'By creating a Float32Array of RGB values and attaching it via `geometry.setAttribute("color", ...)`, you pass per-vertex color data to the GPU. Setting `vertexColors: true` on the material tells the shader to interpolate and apply these colors per-particle.'),
      q('If you want to move 10,000 particles using sine waves, what is the most performant approach?', ['Loop through the Float32Array in JavaScript and update every frame', 'Write a custom GLSL vertex shader and pass a time uniform to calculate movement on the GPU', 'Use CSS animations', 'Use GSAP to animate the geometry'], 1, 'Updating a Float32Array on the CPU and re-uploading it to the GPU every frame causes massive bus bottlenecks. A custom vertex shader calculates the sine waves in parallel across thousands of GPU cores instantly, requiring zero CPU math and zero buffer re-uploads.'),
      q('What happens if you remove a particle system from the scene but forget to call geometry.dispose() and material.dispose()?', ['Nothing, JavaScript cleans it up', 'The GPU memory (VRAM) is not freed, eventually causing a memory leak and browser crash', 'The particles turn black', 'The camera resets'], 1, 'JavaScript\'s Garbage Collector only cleans up CPU heap memory. WebGL buffers and textures live in GPU VRAM and must be explicitly freed by calling `.dispose()`. Failing to do this causes VRAM exhaustion, leading to tab crashes, especially on mobile devices.'),
      q('What does the `sizeAttenuation: true` property do on a PointsMaterial?', ['Makes the particles flash', 'Makes particles appear smaller as they get further away from the camera', 'Increases the size of the texture', 'Attaches the particles to the camera'], 1, 'sizeAttenuation applies perspective scaling to the point sprites. Without it, particles remain the exact same pixel size on screen regardless of their 3D depth, which breaks the illusion of 3D space. With it enabled, distant particles shrink naturally.'),
      q('Why do professional 3D developers use an `alphaMap` texture (like a soft radial gradient) on particle materials?', ['To make the particles square', 'To mask out the hard square edges of the point sprite, making them look like soft glowing orbs or snowflakes', 'To change the particle color', 'To add sound effects'], 1, 'WebGL point sprites are inherently square. By applying a black-and-white radial gradient as an `alphaMap`, the shader discards the black corners (using alpha testing), leaving only the soft, round white center visible. This creates the illusion of volumetric light or soft particles.')
    ],
    ['Particles use single draw calls for massive performance', 'Float32Arrays provide contiguous memory for fast GPU upload', 'THREE.Points renders vertices as point sprites', 'Vertex colors allow per-particle RGB data', 'Custom shaders move particles on the GPU, not the CPU', 'Always call .dispose() to prevent GPU memory leaks']
  ),

  // Lesson 12
  lesson(
    'three-12',
    12,
    'React Three Fiber (R3F) Basics',
    '⚛️',
    `Writing imperative Three.js code is powerful, but it becomes incredibly difficult to manage as your application grows. Trying to synchronize React's state (like a shopping cart or a UI menu) with a separate, imperative Three.js scene graph leads to spaghetti code, memory leaks, and endless \`useEffect\` cleanup functions.

Enter React Three Fiber (R3F). R3F is not a "wrapper" around Three.js. It is a custom React Renderer, exactly like \`react-dom\` is for HTML and \`react-native\` is for iOS/Android. It allows you to write Three.js objects using declarative JSX tags. 

When you write \`<mesh position={[0, 1, 0]}>\`, R3F's reconciler intercepts that tag and executes \`new THREE.Mesh()\` under the hood. This means you get the full, uncompromised performance of raw WebGL, combined with the component reusability, state management, and ecosystem of React. It is the undisputed industry standard for building production 3D web applications.`,
    [
      {
        title: '1. The React Renderer Architecture',
        beginner: 'R3F translates your React JSX tags directly into Three.js objects. It does not slow things down or add an extra layer of HTML. It speaks directly to the graphics card using React\'s language.',
        advanced: 'R3F uses the `react-reconciler\` package to create a custom host config. When React commits changes to the virtual DOM, R3F intercepts these mutations and maps them to Three.js scene graph operations (\`scene.add()`, `mesh.position.set()`). This happens entirely outside the browser\'s HTML DOM, meaning R3F has zero DOM overhead and matches raw Three.js performance.'
      },
      {
        title: '2. The <Canvas> Component',
        beginner: 'The `<Canvas>\` tag is the portal to the 3D world. You put it in your HTML, and it automatically creates the scene, the camera, the renderer, and the animation loop for you.',
        advanced: '\`<Canvas>\` mounts a WebGL context, instantiates a \`THREE.WebGLRenderer`, and starts a `requestAnimationFrame\` loop via an internal clock. It automatically handles window resize events, device pixel ratio matching, and context loss recovery. Everything placed inside \`<Canvas>\` is rendered into the WebGL context, not the HTML DOM.'
      },
      {
        title: '3. Declarative Meshes & JSX',
        beginner: 'Instead of writing \`new THREE.Mesh(geometry, material)`, you simply write `<mesh>\` and nest the geometry and material inside it like HTML children. React handles the creation and destruction automatically.',
        advanced: 'In R3F, lowercase JSX tags map to Three.js classes. \`<mesh>\` becomes \`THREE.Mesh\`. R3F automatically attaches nested children to their parents. If a geometry is nested inside a mesh, R3F automatically assigns it to the mesh\'s \`geometry\` property. This declarative tree structure makes complex scene graphs readable and maintainable.'
      },
      {
        title: '4. Props, Args, and the \`attach\` API',
        beginner: 'You pass settings to 3D objects using React props. If a Three.js class needs arguments in its constructor (like the width and height of a box), you use the special \`args\` prop.',
        advanced: 'Standard props map to setters (e.g., \`position={[1,2,3]}\` calls \`mesh.position.set(1,2,3)`). However, constructor arguments cannot be changed via setters. R3F introduces the `args\` prop to pass array values directly to the class constructor (e.g., \`<boxGeometry args={[1, 1, 1]} />`). If a child needs to attach to a specific property other than the default, the `attach\` prop is used (e.g., \`<fog attach="fog" args={['#000', 10, 20]} />`).'
      },
      {
        title: '5. Auto-Disposal & Memory Management',
        beginner: 'In raw Three.js, you have to manually delete objects from memory when you are done with them. R3F does this for you automatically when a React component unmounts.',
        advanced: 'R3F\'s reconciler tracks every geometry, material, and texture created via JSX. When a component unmounts, R3F automatically traverses the removed sub-tree and calls `.dispose()\` on all disposable WebGL resources. This virtually eliminates the memory leaks that plague imperative Three.js applications, provided you do not manually create resources outside the JSX tree.'
      },
      {
        title: '6. The \`extend\` API',
        beginner: 'R3F knows about all the standard Three.js objects out of the box. But if you install a special add-on (like OrbitControls), you have to tell R3F about it so you can use it as a JSX tag.',
        advanced: 'The \`extend()\` function registers external Three.js classes with R3F\'s internal catalog. For example, \`extend({ OrbitControls })\` allows you to use \`<orbitControls />\` in JSX. R3F dynamically generates the reconciler mappings at runtime, allowing any custom class that extends \`Object3D\` to participate in the declarative scene graph.')
    ],
    {
      title: 'First R3F Component Scene',
      intro: 'Let\'s build a 3D box using React Three Fiber\'s declarative JSX syntax, comparing it to the imperative code we wrote in previous lessons.',
      steps: [
        'Import Canvas: Import \`{ Canvas }\` from \`@react-three/fiber\`. Expect the React renderer to be available.',
        'Create the Box Component: Write a standard React function component named \`Box\`. Expect it to return JSX.',
        'Declarative Mesh: Return \`<mesh>\` instead of \`new THREE.Mesh()\`. Expect R3F to instantiate the object.',
        'Pass Constructor Args: Add \`<boxGeometry args={[1.5, 1.5, 1.5]} />\` as a child. Expect R3F to pass the array to the BoxGeometry constructor.',
        'Declarative Material: Add \`<meshStandardMaterial color="#6366f1" />\` as a child. Expect R3F to attach it to the mesh automatically.',
        'Setup the App Component: Create an \`App\` component that returns a full-screen \`<div>\` containing the \`<Canvas>\` tag.',
        'Configure Camera: Pass \`camera={{ position: [0, 0, 4] }}\` as a prop to \`<Canvas>\`. Expect R3F to initialize the PerspectiveCamera with these settings.',
        'Add Lighting: Nest \`<ambientLight>\` and \`<directionalLight>\` inside the Canvas. Expect R3F to add them to the scene graph.',
        'Render to DOM: Use \`createRoot\` to render \`<App />\` into the HTML root. Expect the WebGL canvas to mount and display the purple box.'
      ],
      goal: 'Render a 3D mesh using clean, declarative React JSX components and understand the R3F architecture.',
      code: {
        html: '',
        css: 'body { margin: 0; background: #0f172a; height: 100vh; }',
        js: \`import React from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas } from '@react-three/fiber';

function Box() {
  return (
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[1.5, 1.5, 1.5]} />
      <meshStandardMaterial color="#6366f1" roughness={0.2} />
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
root.render(<App />);\`
      }
    },
    [
      q('What is React Three Fiber (R3F) fundamentally?', ['A wrapper that slows down Three.js for React', 'A custom React Renderer that maps JSX directly to Three.js objects', 'A replacement for CSS', 'A backend database for 3D models'], 1, 'R3F is a custom React Renderer built on `react-reconciler`. It does not wrap Three.js in HTML; it intercepts React\'s virtual DOM commits and translates them into Three.js scene graph operations, achieving raw WebGL performance with React\'s declarative syntax.'),
      q('Which component automatically manages the WebGL context, scene, camera, and render loop in R3F?', ['<Canvas>', '<SceneManager>', '<ThreeView>', '<WebGLContext>'], 0, 'The `<Canvas>` component is the root of an R3F application. It mounts the HTML canvas element, initializes the WebGLRenderer, creates the default Scene and Camera, and starts the `requestAnimationFrame` loop.'),
      q('How do you pass constructor arguments (like width, height, depth) to a geometry in R3F?', ['size="1,1,1"', 'args={[1, 1, 1]}', 'dimensions={[1, 1, 1]}', 'constructor={[1, 1, 1]}'], 1, 'The `args` prop is a special R3F property that accepts an array and passes its contents directly to the class constructor (e.g., `new THREE.BoxGeometry(1, 1, 1)`). Standard props map to setters, but constructor arguments require `args`.'),
      q('If you write `<mesh><boxGeometry /><meshStandardMaterial /></mesh>`, how does R3F know to attach the geometry and material to the mesh?', ['You must manually write attach="geometry" and attach="material"', 'R3F automatically attaches recognized Three.js children to their parent\'s default properties', 'It uses CSS classes', 'It reads the HTML DOM'], 1, 'R3F\'s reconciler recognizes standard Three.js classes. If a geometry is nested in a mesh, R3F automatically assigns it to `mesh.geometry`. If a material is nested, it assigns it to `mesh.material`. The `attach` prop is only needed for non-standard properties.'),
      q('How does R3F handle memory disposal when a 3D component unmounts?', ['You must call useEffect and manually dispose everything', 'R3F\'s reconciler automatically traverses the removed tree and calls .dispose() on geometries and materials', 'The browser garbage collects WebGL automatically', 'Memory is never freed in R3F'], 1, 'R3F tracks all resources created via JSX. When a component unmounts, the reconciler automatically walks the sub-tree and calls `.dispose()` on all disposable WebGL resources (geometries, materials, textures), preventing the memory leaks common in imperative Three.js.'),
      q('What does the `extend()` function do in R3F?', ['It makes the canvas larger', 'It registers external Three.js classes (like OrbitControls) so they can be used as JSX tags', 'It extends the animation duration', 'It adds more lights to the scene'], 1, 'Because R3F only knows about core Three.js classes by default, you must use `extend({ OrbitControls })` to register addons. This dynamically adds them to R3F\'s internal catalog, allowing you to use `<orbitControls />` in your JSX.'),
      q('How do you set a property that requires a Three.js Vector3 or Color object in R3F JSX?', ['You must write new THREE.Vector3(1,2,3) inside the JSX', 'You pass an array or string, and R3F automatically converts it (e.g., position={[1,2,3]} or color="red")', 'You cannot use Vector3 in R3F', 'You must use a special <Vector> tag'], 1, 'R3F includes an intelligent property parser. If it detects a setter that expects a Vector3, Color, or Euler, it automatically converts arrays (`[1,2,3]`) or strings (`"red"`, `"#ff0000"`) into the appropriate Three.js math objects under the hood.'),
      q('Why is R3F preferred over imperative Three.js for complex web applications?', ['It renders faster than raw WebGL', 'It integrates seamlessly with React state, UI overlays, and the vast React ecosystem without sacrificing WebGL performance', 'It does not require JavaScript', 'It automatically writes GLSL shaders'], 1, 'R3F matches raw Three.js performance while allowing developers to use React hooks, context, and state to drive 3D scenes. This eliminates the "two separate worlds" problem of syncing a React UI with an imperative WebGL canvas, making complex, data-driven 3D apps maintainable.')
    ],
    ['R3F is a React Renderer, not a wrapper', '<Canvas> manages the WebGL context and render loop', 'Use args={[...]} for constructor parameters', 'R3F auto-attaches geometries and materials to meshes', 'Auto-disposal prevents GPU memory leaks on unmount', 'extend() registers external classes for JSX usage']
  ),

  // Lesson 13
  lesson(
    'three-13',
    13,
    'R3F Hooks (useFrame & useThree)',
    '🪝',
    `React is designed to re-render components when state changes. But 3D animation requires updating positions and rotations 60 times a second, regardless of React state. If you used \`useState\` to animate a spinning cube, React would rebuild the virtual DOM 60 times a second, destroying your application's performance.

React Three Fiber solves this paradox with specialized hooks. \`useFrame\` allows you to tap directly into the native WebGL render loop, bypassing React's reconciliation entirely. \`useThree\` gives you instant access to the global renderer, camera, and viewport size.

These hooks are the bridge between React's declarative UI paradigm and the imperative, high-performance reality of real-time 3D graphics. Mastering them is the key to building smooth, interactive, and highly optimized 3D experiences in React.`,
    [
      {
        title: '1. The Render Loop vs React Render',
        beginner: 'React re-renders when data changes. The 3D render loop redraws the screen 60 times a second. `useFrame` lets you run code inside the 3D loop without forcing React to re-render your components.',
        advanced: '`useFrame` subscribes a callback to R3F\'s internal `requestAnimationFrame` loop. The callback executes imperatively before every WebGL frame is drawn. Because it bypasses React\'s virtual DOM diffing, it has zero overhead, allowing you to mutate thousands of object properties per frame without triggering React re-renders.'
      },
      {
        title: '2. Delta Time & Framerate Independence',
        beginner: 'If you move an object by 0.1 pixels every frame, it will move faster on a 120Hz gaming monitor than on a 60Hz laptop. To fix this, we multiply movement by the time that passed since the last frame.',
        advanced: '`useFrame` receives a `state` and `delta` argument. `delta` is the exact time in seconds since the last frame. By multiplying velocity by `delta` (e.g., `rotation.y += 1.0 * delta`), you guarantee that the object moves at the exact same real-world speed regardless of whether the GPU is rendering at 30, 60, or 144 FPS.'
      },
      {
        title: '3. useRef for Imperative Mutations',
        beginner: 'To change a 3D object inside `useFrame`, you need a way to grab it. `useRef` creates a permanent reference to the mesh that you can mutate directly without waking up React.',
        advanced: '`useRef` returns a mutable object (`{ current: mesh }`) that persists across renders without triggering them. Inside `useFrame`, you directly mutate `meshRef.current.rotation.y`. This is critical: using `useState` for animation positions causes catastrophic performance issues because every state update enqueues a React reconciliation pass.'
      },
      {
        title: '4. useThree (Global State Access)',
        beginner: 'Sometimes you need to know how wide the screen is, or where the camera is looking. `useThree` gives you a dictionary containing all the core Three.js objects R3F created for you.',
        advanced: '`useThree` returns the R3F state object, which includes `gl` (the WebGLRenderer), `scene`, `camera`, `size` (viewport dimensions), `pointer` (normalized mouse coordinates), and `raycaster`. This hook allows deeply nested child components to access global rendering context without prop drilling.'
      },
      {
        title: '5. useLoader & Suspense',
        beginner: 'Downloading 3D models takes time. `useLoader` fetches the file and pauses the component until it is ready, working perfectly with React\'s built-in `<Suspense>` loading screens.',
        advanced: '`useLoader(LoaderClass, url)` suspends the React component tree until the asset is fully downloaded and parsed. It caches the result globally, so subsequent mounts are instant. Combined with React `<Suspense fallback={<HtmlLoader />}>`, it provides an elegant, declarative way to handle asynchronous asset pipelines without manual loading states.'
      },
      {
        title: '6. Performance Pitfalls in useFrame',
        beginner: 'Because `useFrame` runs 60 times a second, creating new variables or objects inside it will quickly fill up the computer\'s memory and cause the app to stutter.',
        advanced: 'Never allocate memory inside `useFrame`. Creating new `THREE.Vector3()` objects, arrays, or calling `Math.random()` inside the loop triggers the JavaScript Garbage Collector on every frame, causing micro-stutters (GC spikes). Always instantiate vectors outside the component or use `.set()` methods to mutate existing objects in place.')
    ],
    {
      title: 'Spinning Mesh with useFrame & Delta Time',
      intro: 'Let\'s animate a 3D torus (donut) using `useRef` and `useFrame`, ensuring the spin speed is perfectly consistent across all monitor refresh rates.',
      steps: [
        'Import Hooks: Import `{ useFrame }` from `@react-three/fiber` and `{ useRef }` from React.',
        'Create Component: Define a `SpinningTorus` component that returns a `<mesh>` with a `<torusGeometry>` and `<meshStandardMaterial>`.',
        'Create Ref: Inside the component, declare `const torusRef = useRef();`. Expect a persistent reference object.',
        'Attach Ref: Add `ref={torusRef}` to the `<mesh>` tag. Expect R3F to map the underlying Three.js Mesh object into `torusRef.current`.',
        'Call useFrame: Add `useFrame((state, delta) => { ... })` inside the component body. Expect the callback to execute before every WebGL frame.',
        'Mutate Rotation: Inside the callback, write `torusRef.current.rotation.x += delta * 0.8;`. Expect the X rotation to increase smoothly, scaled by framerate.',
        'Mutate Y Axis: Add `torusRef.current.rotation.y += delta * 1.2;`. Expect the Y axis to spin slightly faster than the X axis.',
        'Setup Scene: In the `App` component, wrap the canvas with lighting and place `<SpinningTorus />` inside. Expect the donut to spin continuously without triggering React re-renders.'
      ],
      goal: 'Animate R3F components imperatively with framerate-independent speed using hooks.',
      code: {
        html: '',
        css: 'body { margin: 0; background: #000; height: 100vh; }',
        js: `import React, { useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas, useFrame } from '@react-three/fiber';

function SpinningTorus() {
  const torusRef = useRef();

  useFrame((state, delta) => {
    // Mutate the mesh directly. No React re-renders!
    // Multiply by delta to ensure equal speed on 60Hz and 144Hz monitors.
    torusRef.current.rotation.x += delta * 0.8;
    torusRef.current.rotation.y += delta * 1.2;
  });

  return (
    <mesh ref={torusRef}>
      <torusGeometry args={[1, 0.3, 16, 100]} />
      <meshStandardMaterial color="#38bdf8" roughness={0.1} metalness={0.8} />
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
      q('Which R3F hook runs code on every rendered frame update (60fps)?', ['useEffect', 'useFrame', 'useRender', 'useAnimation'], 1, 'useFrame subscribes a callback to R3F\'s internal requestAnimationFrame loop, executing imperatively before every WebGL frame is drawn. useEffect only runs when React dependencies change, which is unsuitable for continuous 60fps animation.'),
      q('Why must you multiply movement values by the `delta` argument inside useFrame?', ['To change mesh color', 'To ensure the object moves at the same real-world speed regardless of monitor refresh rate (60Hz vs 144Hz)', 'To save memory', 'To pause the game'], 1, 'Delta represents the time in seconds since the last frame. Multiplying velocity by delta guarantees framerate independence. Without it, an object moving "1 unit per frame" will move twice as fast on a 120Hz monitor compared to a 60Hz monitor.'),
      q('How do you target a mesh for direct mutation in R3F without causing heavy React component re-renders?', ['useState', 'useRef', 'useContext', 'useCallback'], 1, 'useRef provides a mutable `.current` property that persists across renders without triggering them. Mutating `meshRef.current.position` inside `useFrame` updates the WebGL object directly, bypassing React\'s virtual DOM diffing entirely.'),
      q('Which hook gives access to the global WebGLRenderer, Camera, Scene, and viewport size?', ['useThree', 'useCamera', 'useCanvas', 'useViewport'], 0, 'useThree returns the global R3F state object, providing access to `gl` (renderer), `camera`, `scene`, `size` (viewport dimensions), and `pointer` (normalized mouse coordinates) without requiring prop drilling.'),
      q('What is the primary danger of creating new objects (like `new THREE.Vector3()`) inside a `useFrame` callback?', ['It changes the color', 'It triggers the JavaScript Garbage Collector every frame, causing micro-stutters and performance spikes', 'It crashes the browser', 'It deletes the mesh'], 1, 'Allocating memory inside a 60fps loop creates thousands of discarded objects per second. This forces the JavaScript Garbage Collector to run constantly, pausing the main thread and causing visible frame drops (GC spikes). Always instantiate vectors outside the loop and use `.set()` methods.'),
      q('How does `useLoader` handle asynchronous 3D model downloads in R3F?', ['It returns a Promise you must resolve manually', 'It integrates with React Suspense, pausing the component tree until the asset is fully downloaded and parsed', 'It downloads the model in the background and shows a black screen', 'It blocks the entire browser window'], 1, 'useLoader throws a Promise internally, which React\'s `<Suspense>` boundary catches. This suspends the rendering of the component tree until the asset is ready, allowing you to declaratively show a fallback UI (like a loading spinner) without manual state management.'),
      q('If you use `useState` to update a mesh\'s position 60 times a second, what happens?', ['It works perfectly', 'React enqueues 60 reconciliation passes per second, destroying performance and dropping framerates', 'The mesh turns invisible', 'R3F automatically converts it to useRef'], 1, 'useState triggers React\'s reconciliation algorithm. Calling it 60 times a second forces React to diff the virtual DOM 60 times a second, which is catastrophically slow for 3D animation. Always use `useRef` and `useFrame` for continuous animation.'),
      q('What does the `pointer` property inside `useThree()` provide?', ['The user\'s mouse click coordinates in HTML pixels', 'The mouse coordinates normalized to a -1 to +1 range, ready for 3D raycasting', 'The touch screen pressure', 'The camera rotation'], 1, '`useThree().pointer` provides the current mouse/touch position normalized to Normalized Device Coordinates (NDC), where X and Y range from -1 to +1. This is the exact format required by `THREE.Raycaster` to cast rays from the camera into the 3D scene.')
    ],
    ['useFrame executes imperatively at 60fps, bypassing React', 'Always multiply movement by delta for framerate independence', 'Use useRef to mutate meshes without triggering re-renders', 'useThree provides global access to camera, gl, and viewport', 'Never allocate memory (new Vector3) inside useFrame', 'useLoader integrates with Suspense for async asset loading']
  ),

  // Lesson 14
  lesson(
    'three-14',
    14,
    'Drei Utilities & Controls',
    '🧰',
    `Building 3D experiences from scratch involves solving the same difficult problems over and over: parsing fonts for 3D text, setting up image-based lighting, handling camera orbit math, and projecting HTML onto 3D surfaces. 

Enter \`@react-three/drei\` (German for "three"). Drei is the official, community-maintained standard library for React Three Fiber. It provides a massive collection of battle-tested, highly optimized helper components that reduce hundreds of lines of complex WebGL math into single, declarative JSX tags.

Drei is not just a convenience; it is the industry standard. Almost every Awwwards-winning 3D website and professional R3F application relies heavily on Drei. Knowing which components to reach for—and how they work under the hood—is what separates a junior developer struggling with math from a senior developer shipping polished experiences rapidly.`,
    [
      {
        title: '1. The Drei Ecosystem',
        beginner: 'Drei is a toolbox full of pre-built 3D components. Need a camera controller? Need 3D text? Need a skybox? Drei has a tag for it, ready to drop into your Canvas.',
        advanced: 'Maintained by the pmndrs open-source collective (the creators of R3F and Zustand), Drei provides production-ready abstractions for cameras, controls, loaders, shapes, and shaders. It is tree-shakeable, meaning bundlers like Vite only include the specific components you import, keeping bundle sizes small.'
      },
      {
        title: '2. <OrbitControls> & Camera Rigs',
        beginner: 'Drop `<OrbitControls />` inside your Canvas, and users can instantly click, drag, and zoom around your 3D scene with their mouse or touchscreen.',
        advanced: 'Drei\'s `<OrbitControls>` wraps the Three.js addon, exposing its properties as React props (`enableZoom`, `autoRotate`, `maxPolarAngle`). Crucially, it handles the imperative `controls.update()` call inside the R3F render loop automatically when damping is enabled, bridging the gap between Three.js addons and React\'s declarative lifecycle.'
      },
      {
        title: '3. <Environment> & Image-Based Lighting',
        beginner: 'Instead of manually placing 10 different lights to make a metallic object look realistic, you can use `<Environment preset="city" />` to instantly wrap your scene in a 360-degree photograph that lights the objects automatically.',
        advanced: '`<Environment>` loads an HDRI (High Dynamic Range Image) equirectangular texture. It generates a PMREM (Prefiltered Mipmapped Radiance Environment Map) via the WebGLRenderer, which `MeshStandardMaterial` and `MeshPhysicalMaterial` use to calculate physically accurate reflections and ambient light bounces. This is the secret to photorealistic product renders on the web.'
      },
      {
        title: '4. <Float> & Animation Helpers',
        beginner: 'Want an object to gently bob up and down like it is floating in zero gravity? Wrap it in `<Float>` and Drei handles the sine-wave math for you.',
        advanced: '`<Float>` wraps its children in a `THREE.Group` and applies continuous sine-wave transformations to position and rotation inside a `useFrame` loop. It accepts props for `speed`, `rotationIntensity`, and `floatIntensity`. Because it uses refs internally, it animates smoothly without triggering React re-renders.'
      },
      {
        title: '5. <Text> & SDF Rendering',
        beginner: 'Rendering text in 3D is notoriously difficult. Drei\'s `<Text>` component lets you write crisp, perfectly aligned 3D text using simple React children and props.',
        advanced: 'Drei\'s `<Text>` does not use 3D geometry (which is heavy and pixelates). Instead, it uses Troika-three-text, which renders text using SDF (Signed Distance Field) textures on a flat plane. SDF rendering allows text to remain perfectly crisp at any scale or camera distance, with a fraction of the memory footprint of extruded 3D text geometry.'
      },
      {
        title: '6. <Html> & DOM Overlays',
        beginner: 'Sometimes you need standard HTML (like a tooltip, a button, or a video) to exist inside the 3D world, moving with the 3D objects. `<Html>` projects standard React DOM elements onto 3D coordinates.',
        advanced: '`<Html>` creates a portal that synchronizes a standard HTML `<div>` with a 3D `Vector3` position. It calculates the 2D screen projection of the 3D coordinate on every frame and applies CSS `transform: translate3d()` to the DOM element. This allows you to mix WebGL rendering with standard CSS, Tailwind, and DOM events seamlessly.')
    ],
    {
      title: 'Building an Interactive Floating Showcase',
      intro: 'Let\'s combine Drei\'s most powerful utilities to build a scene with smooth camera controls, image-based lighting, floating animation, and crisp 3D text.',
      steps: [
        'Import Drei: Import `{ OrbitControls, Float, Text, Environment }` from `@react-three/drei`.',
        'Setup Canvas: Create the standard `<Canvas>` and `App` boilerplate.',
        'Add OrbitControls: Place `<OrbitControls enableZoom={true} enableDamping />` inside the Canvas. Expect mouse dragging to orbit the camera smoothly.',
        'Add Environment Lighting: Place `<Environment preset="city" />`. Expect the scene to instantly have realistic, photorealistic reflections without manually adding lights.',
        'Create Floating Subject: Wrap a `<mesh>` (using an OctahedronGeometry and MeshStandardMaterial) inside a `<Float speed={2} floatIntensity={1.5}>` tag. Expect the geometry to bob gently in 3D space.',
        'Add 3D Text: Place `<Text position={[0, -2, 0]} fontSize={0.5} color="#38bdf8">`. Type "DRUI IS AWESOME" inside the tag. Expect crisp, SDF-rendered text to appear below the floating object.',
        'Configure Text Alignment: Add `anchorX="center"` to the Text component. Expect the text to center perfectly on the X-axis.',
        'Review Performance: Drag the camera around the scene. Expect the HDRI reflections to slide across the metallic octahedron smoothly at 60 FPS.'
      ],
      goal: 'Build a professional, interactive 3D scene effortlessly using Drei\'s standard library components.',
      code: {
        html: '',
        css: 'body { margin: 0; background: #030712; height: 100vh; }',
        js: `import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Text, Environment } from '@react-three/drei';

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 0, 5] }}>
        <Suspense fallback={null}>
          {/* Instant photorealistic lighting and reflections */}
          <Environment preset="city" />
          
          {/* Smooth mouse/touch camera controls */}
          <OrbitControls enableZoom={true} enableDamping />

          {/* Automatic zero-gravity floating animation */}
          <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
            <mesh>
              <octahedronGeometry args={[1.2, 0]} />
              <meshStandardMaterial color="#ec4899" roughness={0.1} metalness={0.9} />
            </mesh>
          </Float>

          {/* Crisp SDF-rendered 3D text */}
          <Text 
            position={[0, -2.5, 0]} 
            fontSize={0.5} 
            color="#38bdf8" 
            anchorX="center"
            anchorY="middle"
          >
            DRUI IS AWESOME
          </Text>
        </Suspense>
      </Canvas>
    </div>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);`
      }
    },
    [
      q('What is @react-three/drei?', ['A 3D modeling software like Blender', 'A community-maintained standard library of helper components for R3F', 'A CSS styling framework', 'A backend database for WebGL'], 1, 'Drei is the official utility library for React Three Fiber, maintained by the pmndrs collective. It provides battle-tested abstractions for common 3D web problems like controls, text, environments, and loaders, reducing complex WebGL math to single JSX tags.'),
      q('Which Drei component instantly adds drag, pan, and zoom camera controls to a scene?', ['<OrbitControls />', '<CameraController />', '<MouseDrag />', '<ViewControls />'], 0, '<OrbitControls /> wraps the Three.js addon, exposing its properties as React props and automatically handling the imperative `update()` loop required for damping, bridging the gap between Three.js addons and React\'s declarative lifecycle.'),
      q('How does Drei\'s `<Environment preset="city" />` achieve photorealistic lighting?', ['It adds 100 invisible point lights', 'It loads an HDRI image and generates a PMREM (Prefiltered Mipmapped Radiance Environment Map) for physically accurate reflections', 'It uses CSS filters', 'It changes the material color to white'], 1, 'The Environment component loads an equirectangular HDRI texture and uses the WebGLRenderer to generate a PMREM. PBR materials (Standard/Physical) sample this map to calculate accurate ambient light bounces and reflections, which is the industry standard for product visualization.'),
      q('What does the Drei `<Float>` component do to its children?', ['Makes them drop to the floor via gravity', 'Wraps them in a Group and applies continuous sine-wave position and rotation animations via useFrame', 'Compresses their geometry', 'Hides them from the camera'], 1, 'Float applies continuous, framerate-independent sine-wave transformations to position and rotation inside a `useFrame` loop. Because it uses refs internally, it animates smoothly without triggering React re-renders, creating a zero-gravity floating effect.'),
      q('How does Drei\'s `<Text>` component render crisp text at any distance without using heavy 3D geometry?', ['It uses standard HTML text overlaid on the canvas', 'It uses SDF (Signed Distance Field) textures mapped to flat planes', 'It extrudes fonts into thousands of triangles', 'It uses CSS text-shadow'], 1, 'Drei uses `troika-three-text`, which renders text using SDF (Signed Distance Field) textures. SDF allows the GPU to calculate perfectly crisp text edges at any scale or camera distance using a fraction of the memory and draw calls required by extruded 3D text geometry.'),
      q('What is the purpose of the `<Html>` component in Drei?', ['To write HTML inside GLSL shaders', 'To project standard DOM elements (divs, buttons, videos) into 3D space, syncing their CSS position with 3D coordinates', 'To convert HTML to WebGL', 'To read HTML files from the server'], 1, '<Html> creates a portal that synchronizes a standard HTML DOM element with a 3D Vector3 position. It calculates the 2D screen projection on every frame and applies CSS transforms, allowing developers to mix WebGL rendering with standard CSS, Tailwind, and DOM events seamlessly.'),
      q('Why must components like `<Environment>` and `<Html>` often be wrapped in React `<Suspense>`?', ['They are visually suspenseful', 'They load external assets (HDRIs, fonts) asynchronously, and Suspense handles the loading state gracefully', 'They pause the animation loop', 'They are deprecated in React 18'], 1, 'Components like Environment and Text fetch external files (HDRIs, font files) over the network. They utilize React\'s Suspense mechanism to pause the rendering of the 3D tree until the assets are fully downloaded and parsed, preventing UI pop-in and allowing declarative fallback loaders.'),
      q('If you want to restrict the user from zooming in too close or flipping the camera upside down, which component props do you adjust?', ['<mesh scale={...}>', '<OrbitControls minDistance={2} maxPolarAngle={Math.PI / 2} />', '<Canvas zoom={false}>', '<Camera limit={true}>'], 1, 'OrbitControls exposes the underlying Three.js control limits as React props. `minDistance` and `maxDistance` restrict zoom, while `maxPolarAngle` (e.g., Math.PI / 2) prevents the camera from rotating below the floor horizon.')
    ],
    ['Drei is the standard library for R3F abstractions', '<OrbitControls /> handles imperative camera math declaratively', '<Environment> uses HDRIs and PMREM for photorealistic PBR lighting', '<Float> provides zero-gravity animation without React re-renders', '<Text> uses SDF rendering for crisp, lightweight typography', '<Html> seamlessly projects DOM elements into 3D coordinate space']
  ),

  // Lesson 15
  lesson(
    'three-15',
    15,
    '3D Interactivity & Events',
    '🖱️',
    `A beautiful 3D scene is just a painting until the user can interact with it. But interacting with 3D objects through a flat 2D screen is a complex mathematical problem. When you click your mouse on a 2D monitor, how does the browser know which 3D object sitting behind the glass you actually meant to click?

In raw Three.js, this requires setting up a "Raycaster"—shooting an invisible mathematical laser from the camera lens through the mouse cursor into the 3D world, calculating bounding box intersections, and manually wiring up event listeners. It is tedious, error-prone, and difficult to sync with React state.

React Three Fiber completely revolutionizes this. It abstracts the complex raycasting math away, exposing standard React pointer events (\`onClick\`, \`onPointerOver\`) directly on 3D mesh tags. This allows you to build interactive 3D UIs with the exact same mental model you use for standard HTML buttons.`,
    [
      {
        title: '1. The Raycaster Abstraction',
        beginner: 'R3F automatically shoots an invisible laser from your mouse into the 3D scene. When the laser hits a mesh, R3F triggers the \`onClick\` or \`onPointerOver\` event on that specific mesh, just like an HTML button.',
        advanced: 'R3F runs an internal \`THREE.Raycaster\` on every pointer move. It unprojects the 2D Normalized Device Coordinates (NDC) from the \`useThree().pointer\` state into a 3D ray, and performs bounding-sphere and triangle intersection tests against all interactive meshes in the scene graph. It then bubbles the event up the React component tree.'
      },
      {
        title: '2. Pointer Events API',
        beginner: 'You can attach \`onClick`, `onPointerOver\` (hover), and \`onPointerOut\` (un-hover) directly to \`<mesh>\` tags. This makes 3D objects feel as interactive as standard web buttons.',
        advanced: 'R3F implements the unified W3C Pointer Events API. This means \`onPointerDown`, `onPointerMove`, and `onPointerUp\` work identically across desktop mice, mobile touchscreens, and stylus pens. The event object contains rich data, including the exact 3D intersection point (\`event.point`), the face normal (`event.face.normal`), and the distance from the camera.'
      },
      {
        title: '3. Event Bubbling & stopPropagation',
        beginner: 'If you click a 3D button that is sitting on top of a 3D table, the click might register on both. You can stop the click from passing through the button by using `event.stopPropagation()\`.',
        advanced: 'R3F events bubble up the scene graph hierarchy, mirroring DOM event bubbling. If a ray intersects multiple nested meshes, the event fires on the deepest child first, then propagates to parents. Calling \`event.stopPropagation()\` halts this propagation, which is critical for UI overlays, nested models, and preventing background objects from triggering clicks.'
      },
      {
        title: '4. Hover States & DOM Cursor Syncing',
        beginner: 'When you hover over a 3D object, you usually want the mouse cursor to change to a "pointer" hand, and the object to highlight. R3F makes syncing the 3D hover state with the HTML cursor easy.',
        advanced: 'By combining \`onPointerOver\`/\`onPointerOut\` with React \`useState`, you can drive material color or mesh scale changes declaratively. To sync the DOM cursor, you use a side effect: `document.body.style.cursor = hovered ? "pointer" : "auto"\`. R3F does not mutate the DOM cursor automatically to prevent conflicts with standard HTML UI overlays.'
      },
      {
        title: '5. Touch & Mobile Support',
        beginner: 'Because R3F uses the unified Pointer Events API, your 3D clicks and hovers automatically work on mobile touchscreens without writing any extra code.',
        advanced: 'The W3C Pointer Events API abstracts mouse, touch, and pen inputs into a single event stream. R3F maps touch taps to \`onClick\` and touch drags to \`onPointerMove\`. However, developers must be mindful that \`onPointerOver\` (hover) does not exist on mobile touch devices, requiring fallback UI states for mobile users.'
      },
      {
        title: '6. HTML Overlays & Tooltips',
        beginner: 'Sometimes you want a standard HTML tooltip or info card to pop up when you hover over a 3D object. Drei\'s \`<Html>\` component lets you attach DOM elements directly to 3D meshes.',
        advanced: 'By combining R3F pointer events with Drei\'s \`<Html>\` component, you can conditionally render React DOM components (like Tailwind-styled tooltips) that track the 3D intersection point (\`event.point`) in real-time. This bridges the gap between high-performance WebGL rendering and the rich styling capabilities of the HTML/CSS DOM.')
    ],
    {
      title: 'Interactive 3D Product Card',
      intro: 'Let\'s build a 3D product card that scales up and changes color when hovered, and toggles an "active" state when clicked, using standard React state.',
      steps: [
        'Import Hooks: Import `{ useState }\` from React and \`{ Canvas }\` from R3F.',
        'Create Component: Define an \`InteractiveCube\` component that returns a \`<mesh>\` with a \`<boxGeometry>\` and \`<meshStandardMaterial>\`.',
        'Setup State: Declare \`const [active, setActive] = useState(false)\` and \`const [hovered, setHovered] = useState(false)\`.',
        'Attach Click: Add \`onClick={() => setActive(!active)}\` to the \`<mesh>\`. Expect the state to toggle on click.',
        'Attach Hover: Add \`onPointerOver={() => setHovered(true)}\` and \`onPointerOut={() => setHovered(false)}\`. Expect the state to track the mouse.',
        'Drive Scale: Set the mesh \`scale\` prop to \`active ? 1.4 : 1\`. Expect the box to grow when clicked.',
        'Drive Color: Set the material \`color\` prop to \`hovered ? "#ec4899" : "#38bdf8"\`. Expect the box to turn pink on hover.',
        'Sync DOM Cursor: Add a \`useEffect\` that sets \`document.body.style.cursor = hovered ? "pointer" : "auto"\`. Expect the mouse cursor to change to a hand when hovering the 3D object.',
        'Render: Wrap the component in a \`<Canvas>\` with lighting and \`<OrbitControls>\`. Expect a fully interactive, state-driven 3D UI element.'
      ],
      goal: 'Handle complex 3D raycasting interactions using standard React state and pointer events.',
      code: {
        html: '',
        css: 'body { margin: 0; background: #0f172a; height: 100vh; }',
        js: \`import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

function InteractiveCube() {
  const [active, setActive] = useState(false);
  const [hovered, setHovered] = useState(false);

  // Sync the HTML mouse cursor with the 3D hover state
  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
    return () => { document.body.style.cursor = 'auto'; };
  }, [hovered]);

  return (
    <mesh
      scale={active ? 1.4 : 1}
      onClick={(e) => {
        e.stopPropagation(); // Prevent click from hitting objects behind
        setActive(!active);
      }}
      onPointerOver={(e) => setHovered(true)}
      onPointerOut={(e) => setHovered(false)}
    >
      <boxGeometry args={[1.5, 1.5, 1.5]} />
      <meshStandardMaterial 
        color={hovered ? '#ec4899' : '#38bdf8'} 
        roughness={0.2}
        metalness={0.5}
      />
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
root.render(<App />);\`
      }
    },
    [
      q('How does R3F handle mouse clicks on 3D objects under the hood?', ['It uses standard HTML onclick attributes on the canvas', 'It runs an internal Raycaster that unprojects 2D mouse coordinates into a 3D ray and tests for mesh intersections', 'It uses CSS hover states', 'It relies on the browser\'s native 3D API'], 1, 'R3F maintains an internal `THREE.Raycaster`. On every pointer move, it converts the 2D Normalized Device Coordinates (NDC) into a 3D ray originating from the camera, and performs bounding/triangle intersection tests against the scene graph to determine which mesh was hit.'),
      q('Which event triggers when the mouse cursor enters the surface of a 3D mesh?', ['onMouseEnter', 'onPointerOver', 'onHover3D', 'onCollision'], 1, 'R3F implements the W3C Pointer Events API. `onPointerOver` fires when the raycaster intersection first hits the mesh, and `onPointerOut` fires when the ray leaves it. These replace standard DOM mouse events for WebGL contexts.'),
      q('What function prevents a click event from bubbling up and triggering objects located behind your clicked mesh?', ['e.preventDefault()', 'e.stopPropagation()', 'e.stopRaycast()', 'e.cancelBubble()'], 1, 'R3F events bubble up the scene graph hierarchy, mirroring DOM event bubbling. Calling `e.stopPropagation()` inside the event handler halts this propagation, preventing background or parent meshes from registering the click.'),
      q('Do R3F pointer events (onClick, onPointerMove) work on mobile touchscreens?', ['No, they require a physical mouse', 'Yes, automatically via the unified W3C Pointer Events API', 'Only if you install a mobile plugin', 'Only on iOS devices'], 1, 'The W3C Pointer Events API abstracts mouse, touch, and pen inputs into a single event stream. R3F maps touch taps to `onClick` and touch drags to `onPointerMove` automatically, providing seamless cross-platform interactivity.'),
      q('Why doesn\'t R3F automatically change the HTML mouse cursor to a "pointer" when hovering a 3D mesh?', ['It is a bug in R3F', 'To prevent conflicts with standard HTML UI overlays; developers must sync it manually via document.body.style.cursor', 'WebGL cannot change cursors', 'It only works on Mac'], 1, 'R3F avoids mutating the DOM automatically to prevent conflicts with HTML overlays (like menus or tooltips) that might be sitting on top of the canvas. Developers must explicitly sync the 3D hover state to the DOM cursor using a `useEffect` side effect.'),
      q('What rich data does the event object (`e`) contain when a 3D mesh is clicked?', ['Only the mesh name', 'The exact 3D intersection point (e.point), the face normal, and the distance from the camera', 'The user\'s IP address', 'The texture color'], 1, 'The R3F intersection event provides the exact `Vector3` coordinate where the ray hit the geometry (`e.point`), the normal vector of the specific triangle face hit (`e.face.normal`), and the distance from the camera. This is invaluable for placing decals, spawning objects, or calculating impact physics.'),
      q('If you have a 3D button sitting on top of a 3D floor, and you click the button, what happens by default?', ['Only the button registers the click', 'The click fires on the button, then bubbles up and fires on the floor beneath it', 'The browser crashes', 'The floor deletes the button'], 1, 'By default, R3F events bubble up the scene graph. The ray intersects the button first (firing its onClick), and then continues to intersect the floor (firing its onClick). You must use `e.stopPropagation()` on the button to prevent the floor from registering the click.'),
      q('Why must developers be careful when using `onPointerOver` (hover) for critical UI information on mobile devices?', ['Mobile devices do not support WebGL', 'Mobile touchscreens do not have a "hover" state; the event only fires on tap, making hover-based UI inaccessible', 'Hover drains mobile battery', 'React blocks hover on mobile'], 1, 'Touchscreens lack a continuous spatial pointer, meaning `onPointerOver` and `onPointerOut` do not behave like desktop hovers. Critical UI information should never be hidden exclusively behind a hover state; it must be accessible via a tap/click fallback for mobile users.')
    ],
    ['R3F abstracts Raycasting into standard React pointer events', 'Use onPointerOver/Out for hover states', 'Call e.stopPropagation() to prevent background clicks', 'Pointer Events API unifies mouse, touch, and pen inputs', 'Sync DOM cursor manually via document.body.style.cursor', 'Event objects contain exact 3D intersection points and normals']
  ),

  // Lesson 16
  lesson(
    'three-16',
    16,
    '3D Web App Production & Deployment',
    '🚀',
    `Building a beautiful 3D scene on your powerful development machine is only half the battle. The real challenge is shipping that experience to millions of users on low-end Android phones, spotty 4G networks, and laptops with integrated graphics. 

A 50-megabyte 3D model with uncompressed textures might load instantly on your local machine, but it will cause a mobile user\'s browser to crash or drain their battery in minutes. Professional 3D web development is an exercise in extreme optimization, asset compression, and graceful degradation.

This final lesson bridges the gap between a "cool tech demo" and a production-ready, commercially viable 3D web application. We will cover asset pipelines, performance budgets, React Suspense integration, and the tools used by top-tier agencies to ensure their 3D experiences run at a buttery 60 FPS on every device on Earth.`,
    [
      {
        title: '1. The Performance Budget',
        beginner: 'Graphics cards have limits. If you put too many objects or high-resolution textures in your scene, the website will lag. You must set a "budget" for how much 3D data you are allowed to use.',
        advanced: 'A strict performance budget is mandatory for production 3D. Target < 100,000 triangles for mobile, < 50 draw calls per frame, and < 50MB of total VRAM texture memory. Exceeding these limits destroys the fill-rate and causes thermal throttling on mobile devices. Use tools like `gl.report()` or R3F\'s `<Perf />` component to monitor these metrics in real-time.'
      },
      {
        title: '2. Asset Pipelines (gltf-transform)',
        beginner: '3D artists export massive files. Before putting them on your website, you must run them through a "compressor" that strips out useless data and squishes the file size down by 90%.',
        advanced: 'Never serve raw GLTF files directly from an artist\'s export. Use CLI tools like `gltf-transform` or `gltf-pipeline` in your build step to apply Draco compression (geometry), Meshopt compression (indexing), and texture resizing (converting PNGs to WebP/KTX2). This automated pipeline ensures optimal payloads without relying on the artist to manually optimize.'
      },
      {
        title: '3. React Suspense & Preloading',
        beginner: 'Nobody likes a blank screen while a 3D model downloads. React\'s Suspense lets you show a beautiful loading bar, and "preloading" downloads the model in the background before the user even clicks the button.',
        advanced: 'Wrap your 3D scene in `<Suspense fallback={<HtmlLoader />}>`. Use `useGLTF.preload(\'/model.glb\')` at the top level of your module to initiate the network fetch and GPU parsing immediately upon page load, before the component mounts. This eliminates the "pop-in" effect and ensures the asset is instantly available when the user navigates to the 3D view.'
      },
      {
        title: '4. Adaptive DPR (Device Pixel Ratio)',
        beginner: 'Rendering a 3D scene on a 4K iPhone screen requires drawing 4 times as many pixels as a standard laptop. To keep the framerate smooth, R3F can automatically lower the resolution on weaker devices.',
        advanced: 'Use the `dpr` (Device Pixel Ratio) prop on the `<Canvas>` component. Setting `dpr={[1, 2]}` tells R3F to cap the rendering resolution at 2x, even if the user has a 3x Retina display. For aggressive performance, use the `useDetectGPU` hook from Drei to classify the user\'s GPU tier, and dynamically lower the `dpr` or disable post-processing for low-end devices.'
      },
      {
        title: '5. Post-Processing Costs',
        beginner: 'Effects like Bloom (glowing lights) and Depth of Field (blurry backgrounds) look amazing, but they force the computer to draw the entire scene multiple extra times. Use them sparingly on mobile.',
        advanced: 'Post-processing via `@react-three/postprocessing` (EffectComposer) requires rendering the scene to an off-screen framebuffer texture, then running full-screen shader passes over it. Effects like Bloom require multiple down-sampling and up-sampling passes. On mobile GPUs, this destroys the fill-rate. Always profile the cost of effects and consider baking lighting instead of using real-time bloom.'
      },
      {
        title: '6. Profiling & Debugging Tools',
        beginner: 'If your scene is lagging, you need to know why. Is it the textures? The shadows? The JavaScript? Special browser tools let you look inside the graphics card to find the exact bottleneck.',
        advanced: 'Use Spector.js (a Chrome extension) to capture WebGL frames and inspect exact draw calls, shader compilations, and state changes. Use the R3F `<Perf />` component to monitor FPS, memory, and draw calls in real-time. Use Chrome DevTools\' "Performance" and "Memory" tabs to identify JavaScript GC spikes and detached DOM/WebGL memory leaks.')
    ],
    {
      title: 'Production-Ready Optimized Showcase',
      intro: 'Let\'s build a production-grade component that utilizes React Suspense for loading, adaptive DPR for performance scaling, and optimized geometries to ensure a smooth 60 FPS experience on all devices.',
      steps: [
        'Import Tools: Import `{ Suspense }` from React, and `{ useDetectGPU, BakeShadows, ContactShadows }` from Drei.',
        'Setup Canvas: Create the `<Canvas>` and configure `dpr={[1, 2]}` to cap the pixel ratio at 2x for performance on high-density mobile screens.',
        'Add Suspense Boundary: Wrap the 3D contents in `<Suspense fallback={<HtmlLoader />}>`. Expect the app to handle async asset loading gracefully.',
        'Create Loader: Build a simple `HtmlLoader` component using Drei\'s `<Html>` to display a CSS spinner in the center of the canvas.',
        'Optimize Shadows: Replace expensive real-time `DirectionalLight` shadows with `<ContactShadows />`. Expect realistic ground shadows with a fraction of the GPU cost.',
        'Add Subject: Create an interactive `<ProductCard>` mesh with `onPointerOver` states and optimized geometry (low segment count).',
        'Add Environment: Use `<Environment preset="studio" />` for instant PBR lighting without manual light placement.',
        'Review Performance: Inspect the draw calls and memory. Expect a highly polished, responsive 3D UI that degrades gracefully on lower-end hardware.'
      ],
      goal: 'Ship a production-ready, optimized 3D web component using industry-standard performance techniques.',
      code: {
        html: '',
        css: 'body { margin: 0; background: #030712; height: 100vh; font-family: sans-serif; }',
        js: `import React, { useState, useRef, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Text, Environment, ContactShadows, Html } from '@react-three/drei';

function Loader() {
  return (
    <Html center>
      <div style={{ color: '#38bdf8', fontSize: '18px', fontWeight: 'bold' }}>
        Loading 3D Assets...
      </div>
    </Html>
  );
}

function ProductCard() {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef();

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * (hovered ? 1.5 : 0.3);
    }
  });

  return (
    <mesh
      ref={meshRef}
      scale={hovered ? 1.1 : 1}
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
  );
}

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      {/* Cap DPR at 2 to save mobile GPU fill-rate */}
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 4.5] }}>
        
        <Suspense fallback={<Loader />}>
          <Environment preset="studio" />
          
          <OrbitControls enableZoom={false} enablePan={false} />

          <Float speed={2} floatIntensity={1}>
            <ProductCard />
          </Float>

          {/* Cheap, baked-style ground shadows instead of real-time shadow maps */}
          <ContactShadows 
            position={[0, -1.5, 0]} 
            opacity={0.6} 
            scale={10} 
            blur={2} 
            far={4} 
          />

          <Text position={[0, -2.2, 0]} fontSize={0.35} color="#38bdf8" anchorX="center">
            HOVER OR DRAG TO ROTATE
          </Text>
        </Suspense>

      </Canvas>
    </div>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);`
      }
    },
    [
      q('What tool compresses GLTF 3D model geometry file sizes by up to 90% for web deployment?', ['Zip', 'Draco Compression', 'MP4 Loader', 'PNG Minimizer'], 1, 'Draco is a Google-developed algorithm that compresses vertex positions, normals, and UV coordinates using quantization. It drastically reduces network payload size, which is critical for mobile web performance, though it requires a WebAssembly decoder in the browser.'),
      q('How do you show a loading UI while R3F 3D assets (like GLTF models or HDRIs) load asynchronously in React?', ['window.onload', 'React <Suspense fallback={<Loader />}>', 'setInterval', 'CSS spinner only'], 1, 'R3F loaders (like useGLTF and useTexture) integrate with React\'s Suspense API. They suspend the component tree until the assets are fully downloaded and parsed, allowing you to declaratively render a fallback UI (like a DOM spinner via Drei\'s `<Html>`) without manual loading state management.'),
      q('What is a realistic target draw call budget for smooth 60 FPS performance on mobile 3D web apps?', ['Under 50 draw calls', 'Over 1,000 draw calls', '10,000 draw calls', 'Unlimited'], 0, 'The CPU-GPU bus is a severe bottleneck on mobile devices. Keeping draw calls under 50 (and ideally under 20) ensures the CPU can feed the GPU fast enough to maintain 60 FPS. Exceeding this limit causes severe frame drops regardless of how simple the geometry is.'),
      q('What does setting `dpr={[1, 2]}` on the R3F `<Canvas>` component do?', ['It doubles the animation speed', 'It caps the rendering resolution at 2x Device Pixel Ratio, saving GPU fill-rate on 3x Retina mobile screens', 'It adds 2 extra cameras', 'It enables VR mode'], 1, 'High-end mobile devices have 3x or 4x pixel ratios, meaning the GPU must render 9 to 16 times as many pixels as a standard 1080p screen. Capping the `dpr` at 2 drastically reduces the fill-rate burden, preventing thermal throttling and frame drops on mobile, with minimal perceptible loss in visual quality.'),
      q('Why are real-time shadow maps (castShadow/receiveShadow) often avoided in high-performance mobile 3D scenes?', ['They look ugly', 'They require rendering the entire scene an extra time per light, destroying mobile GPU fill-rates', 'They only work in the dark', 'React blocks them'], 1, 'Real-time shadow mapping requires a separate render pass to a framebuffer for every shadow-casting light. On mobile GPUs with limited memory bandwidth, this destroys the fill-rate. Professionals use "ContactShadows" (a baked decal) or fake blob shadows instead to maintain 60 FPS.'),
      q('What is the purpose of `useGLTF.preload(\'/model.glb\')` at the top level of a module?', ['It deletes the model', 'It initiates the network fetch and GPU parsing immediately upon page load, before the component mounts', 'It converts the model to 2D', 'It plays an animation'], 1, 'Calling `preload` outside the component lifecycle triggers the asset download and parsing immediately when the JavaScript module is evaluated. This eliminates the "pop-in" effect and ensures the asset is instantly available in the cache when the user navigates to the 3D view.'),
      q('Which Chrome extension is the industry standard for capturing WebGL frames and inspecting exact draw calls and shader state?', ['React DevTools', 'Spector.js', 'Redux DevTools', 'Lighthouse'], 1, 'Spector.js is a powerful WebGL debugger that allows you to capture a single frame, step through every individual WebGL command (draw calls, state changes, texture bindings), and inspect the exact GLSL shaders and framebuffers being executed on the GPU.'),
      q('Why is post-processing (like Bloom and Depth of Field) considered "expensive" in WebGL?', ['It requires downloading large plugins', 'It requires rendering the scene to off-screen framebuffers and running full-screen shader passes over them, multiplying the GPU workload', 'It slows down the internet', 'It uses the CPU instead of the GPU'], 1, 'Post-processing effects require the EffectComposer to render the 3D scene to an off-screen texture, then execute multiple full-screen fragment shader passes (e.g., down-sampling, blurring, up-sampling for Bloom). This multiplies the GPU fill-rate requirements, often causing severe frame drops on mobile and integrated graphics.')
    ],
    ['Strict performance budgets: < 50 draw calls, < 100k tris', 'Compress GLTF assets via Draco/Meshopt in the build pipeline', 'Use React Suspense for declarative, elegant asset loading', 'Cap DPR (dpr={[1,2]}) to save mobile GPU fill-rate', 'Use ContactShadows instead of real-time shadow maps for performance', 'Profile with Spector.js and R3F Perf to find bottlenecks']
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
