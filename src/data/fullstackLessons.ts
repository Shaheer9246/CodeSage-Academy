// Full Stack Frontend Development — 32 lessons
import type { NetworkingLesson, Concept, QuizQuestion } from './networkingLessons';

export interface FullstackLesson extends Omit<NetworkingLesson, 'practical'> {
  practical: NetworkingLesson['practical'] & {
    code?: {
      html?: string;
      css?: string;
      js?: string;
    };
  };
}

const lesson = (
  id: string, order: number, title: string, icon: string, philosophy: string,
  concepts: Concept[], practical: FullstackLesson['practical'], quiz: QuizQuestion[],
  keyTakeaways: string[]
): FullstackLesson => ({
  id, module: 'Module 1: Full Stack Frontend Development', order,
  title, icon, philosophy, concepts, practical, quiz, keyTakeaways,
});

const q = (question: string, options: string[], correctIndex: number, explanation?: string): QuizQuestion =>
  ({ question, options, correctIndex, explanation });

export const FULLSTACK_LESSONS: FullstackLesson[] = [
lesson('fs-1', 1, 'Web Architecture', '🏗️',
  'Before you write a line of code, understand what actually happens when someone types your URL. Every web app is a conversation between client and server. Knowing the choreography lets you debug anything, because every failure is just one broken step in the request and response flow.',
  [
    { title: '1. Client ↔ Server', beginner: 'The browser asks. The server answers. That is the whole web in one pattern. A request is a question. A response is the answer. Every page, image, login, and API call follows this loop.', advanced: 'An HTTP request contains a method, URL, headers, and optional body. The method says what kind of action is happening. The URL names the resource. Headers carry metadata such as cookies, accepted formats, and auth tokens. The body carries submitted data. An HTTP response contains a status code, headers, and body. The status says what happened. Headers describe the payload. The body contains HTML, JSON, CSS, JavaScript, or binary data. Professional debugging starts by inspecting these exact parts.' },
    { title: '2. The Request Lifecycle', beginner: 'Before a page appears, the browser does hidden work. It finds the address, opens a connection, secures it, asks for the page, receives data, and draws the result. Each step takes time.', advanced: 'A typical lifecycle is URL parse, cache check, DNS lookup, TCP connection, TLS handshake, HTTP request, server processing, HTTP response, HTML parse, CSS parse, JavaScript execution, layout, paint, and composite. Each step adds latency. DNS can be cached. TCP connections can be reused. TLS can be resumed. HTTP/2 and HTTP/3 reduce request overhead. DevTools Timing exposes queueing, DNS, connection, SSL, waiting, and download time. Developers who read this waterfall can find the real bottleneck instead of guessing.' },
    { title: '3. Frontend vs Backend', beginner: 'Frontend is what the user sees and interacts with. Backend is the hidden part that stores data, checks rules, and protects information. Frontend is the dining room. Backend is the kitchen and storage room.', advanced: 'Frontend concerns include presentation, interaction, accessibility, performance, and user experience. Backend concerns include data integrity, authentication, authorization, business rules, persistence, and scalability. Modern frameworks blur the line with SPA, SSR, SSG, and ISR. SPA sends a minimal HTML shell and relies on client-side JavaScript. SSR renders HTML per request. SSG builds HTML at build time. ISR updates static pages in the background. Choose based on SEO, data freshness, caching, interactivity, and infrastructure.' },
    { title: '4. Stateless HTTP', beginner: 'HTTP has a short memory. Each request stands alone. The server forgets you unless the request carries proof, like a cookie or token.', advanced: 'HTTP is stateless, so the protocol itself does not remember previous requests. State is added with cookies, session IDs, JWTs, tokens, or server-side stores. This is why auth is hard. Credentials must be stored, sent, expired, refreshed, and protected. Headers such as Cookie, Set-Cookie, Authorization, Cache-Control, and SameSite are central to secure state management.' },
    { title: '5. DNS — The Web Phone Book', beginner: 'A domain name is a friendly label. An IP address is the real location. DNS converts the label into the location so the browser knows where to connect.', advanced: 'DNS resolves hostnames into IP addresses through caches and nameservers. The browser may check its own cache, the OS cache, a recursive resolver, root servers, TLD servers, and authoritative servers. Records include A, AAAA, CNAME, MX, and TXT. TTL controls how long a result can be cached. DNS latency and failures are real production issues, so teams use dns-prefetch, preconnect, CDN placement, and monitoring.' },
    { title: '6. Caching and CDNs', beginner: 'Caching saves a copy so the browser or server can answer faster next time. A CDN places servers around the world so users get files from a closer location.', advanced: 'Caching is controlled by headers such as Cache-Control, ETag, Last-Modified, and Expires. Strong caching avoids network requests entirely. Revalidation asks whether a cached copy is still fresh. CDNs cache static and sometimes dynamic responses at edge locations. Understanding caching is essential because many production bugs are caused by stale assets, incorrect Cache-Control, or CDN behavior.' },
  ],
  { title: 'Watch a Request Happen', intro: 'DevTools is your X-ray vision.', steps: [
    'Open any site, such as https://example.com.',
    'Open DevTools with F12, Ctrl+Shift+I on Windows/Linux, or Cmd+Option+I on Mac.',
    'Click the Network tab and expect a request list area.',
    'Reload the page with Ctrl+R or Cmd+R and watch the waterfall appear.',
    'Click the first request, usually the HTML document.',
    'Read Headers and look for Request URL, Request Method, Status Code, and Response Headers.',
    'Read Timing and look for DNS Lookup, Initial connection, SSL, Waiting (TTFB), and Content Download.',
    'Read Response and look for the raw HTML the browser received.',
  ], goal: 'You can read any waterfall and explain it.' },
  [
    q('What does the browser do first when you visit a URL?', ['Render','DNS lookup','Send the body','Run JS'], 1),
    q('HTTP is:', ['Stateful','Stateless','Encrypted by default','Faster than TCP'], 1),
    q('TTFB stands for:', ['Time To Final Byte','Time To First Byte','Total Frontend Build','Top Tier File Buffer'], 1),
    q('Modern rendering choices include:', ['Only SPA','SSR, SPA, SSG, ISR','Only static','Only server'], 1),
    q('What step turns a domain name into an IP address?', ['DNS lookup','TCP handshake','TLS certificate','HTML parsing'], 0),
    q('How does a stateless HTTP login usually stay remembered?', ['The server remembers your face automatically','Cookies, JWTs, or session IDs','CSS cache','DNS records'], 1),
  ],
  ['Web = client ↔ server','HTTP requests contain method, URL, headers, and maybe body','HTTP responses contain status, headers, and body','HTTP is stateless','DNS, TCP, TLS, and HTTP each add latency','Caching and CDNs make the web faster','DevTools Network is the truth detector']
),

lesson('fs-2', 2, 'HTML — Semantic Foundation', '📄',
  'HTML is the skeleton. Bad semantics now create SEO pain, accessibility lawsuits, and CSS spaghetti later. Good HTML gives structure, meaning, and navigation to browsers, screen readers, search engines, and future developers.',
  [
    { title: '1. Semantic Tags', beginner: 'Use tags that describe meaning. Use header for top page information, nav for navigation, main for primary content, article for self-contained content, and footer for bottom information. A div is a blank box with no meaning.', advanced: 'Semantic elements create meaningful landmarks in the accessibility tree and document outline. Screen readers can jump between nav, main, article, and footer. Search engines use structure to understand content priority. Divs and spans are generic and do not communicate role by themselves. Prefer native semantic HTML before reaching for ARIA or JavaScript-based replacements.' },
    { title: '2. Attributes Matter', beginner: 'Attributes give extra meaning. Images need alt text so people who cannot see the image still understand it. Inputs need labels so users know what to type.', advanced: 'The alt attribute provides an accessible name for images and helps SEO when images cannot load. Decorative images should use empty alt so screen readers skip them. Form inputs need associated labels, usually with label for and input id. Missing labels hurt usability, screen reader announcements, autofill, and mobile conversion. Use ARIA only when native HTML cannot express the needed semantics.' },
    { title: '3. Document Structure', beginner: 'A page should have one main title and clear subheadings. The h1 is the big title of the page. Then h2, h3, and lower headings organize the content like a book outline.', advanced: 'Heading order creates a navigable outline for assistive technology. Screen reader users often navigate by headings, so skipped levels or random heading sizes create confusion. The title element in the head also matters because it appears in browser tabs, bookmarks, search results, and screen reader context. Semantic structure improves maintainability because styles can target meaning instead of random class names.' },
    { title: '4. Forms', beginner: 'Use real form elements. A submit button should be a button with type submit. Inputs should have labels. Do not make a clickable div and hope it works like a button.', advanced: 'Native form controls provide built-in keyboard support, focus management, screen reader roles, validation, autofill, and browser behavior. A div with onClick lacks button semantics unless you manually add tabindex, keydown handlers for Enter and Space, role, focus styles, disabled behavior, and accessible names. That is more code and more risk. Use button, input, select, textarea, label, fieldset, and legend before custom widgets.' },
    { title: '5. Links vs Buttons', beginner: 'A link takes you somewhere. A button does something. If clicking should open a new page, use a link. If clicking should submit a form or trigger an action, use a button.', advanced: 'Anchor elements with href provide navigation semantics, browser history integration, middle-click behavior, bookmarkability, and keyboard expectations. Buttons provide action semantics, form submission integration, and correct role behavior. Turning a div into a link or button requires recreating many native behaviors. Choosing the right element early prevents accessibility bugs and interaction bugs.' },
    { title: '6. Metadata and Head', beginner: 'The head contains information about the page. The title shows in the browser tab. The charset helps text display correctly. The viewport helps the page work on phones.', advanced: 'The head contains document metadata: title, meta charset, meta viewport, description, Open Graph tags, favicon links, preload hints, and stylesheet links. Metadata affects SEO, social sharing, mobile scaling, performance, and rendering. A missing viewport can cause mobile zooming problems. A missing charset can cause encoding bugs. Professional frontend work treats head metadata as part of the UI contract.' },
  ],
  { title: 'Write Semantic HTML', intro: 'Practice in the editor.', steps: [
    'Open the provided HTML starter and look at the div-based structure.',
    'Replace the outer header div with a header element.',
    'Replace the title div with an h1 element.',
    'Wrap the primary content in a main element.',
    'Wrap the post content in an article element and give it a heading such as h2.',
    'Add a footer element at the bottom.',
    'Add alt text to every meaningful image, and use empty alt for decorative images.',
    'Replace clickable div elements with real button or anchor elements.',
    'Open the inspector or accessibility tree and confirm landmarks and heading levels exist.',
  ], goal: 'A page a screen reader can navigate.',
    code: {
      html: '<!-- Rewrite this with semantic tags -->\n<div class="header">\n  <div class="title">My Blog</div>\n</div>\n<div class="content">\n  <div class="post">Hello world</div>\n</div>',
      css: 'body { font-family: system-ui; padding: 2rem; }\nh1 { color: #e94560; }',
    },
  },
  [
    q('Best tag for the main page heading?', ['<div>','<h1>','<header>','<title>'], 1),
    q('Why use <button> instead of <div onClick>?', ['Smaller HTML','Free keyboard + a11y','Faster','Required by law'], 1),
    q('alt attribute purpose?', ['Style','Accessibility + SEO fallback text','Tooltip','Required by HTML5'], 1),
    q('How many <h1> per page (recommended)?', ['Zero','One','As many as you want','Six'], 1),
    q('Which element should take the user to another page?', ['<button>','<a>','<div>','<span>'], 1),
    q('What does <label for="email"> do?', ['Only styles the input','Connects the label text to the email input','Creates an email account','Hides the input'], 1),
  ],
  ['Semantics > divs','Native elements win','Headings = outline','Forms need labels','Links navigate, buttons act','Metadata affects SEO, mobile, and performance']
),

lesson('fs-3', 3, 'CSS — Layout & Styling', '🎨',
  'CSS is not just styling. It is layout engineering. Every element is a box, every style is a rule, and the cascade resolves conflicts. Master the box model and cascade before fighting frameworks.',
  [
    { title: '1. Box Model', beginner: 'Every element is like a framed picture. The content is the picture. Padding is the space between the picture and the frame. Border is the frame. Margin is the space outside the frame.', advanced: 'The CSS box model has content, padding, border, and margin. With content-box, width applies only to content, so total width becomes width plus padding plus border. With border-box, width includes content, padding, and border, making layout math simpler. DevTools shows the computed box model. Margin collapse can affect vertical spacing. Professional layouts often set box-sizing border-box globally to avoid surprise widths.' },
    { title: '2. Cascade & Specificity', beginner: 'CSS rules can overlap. When two rules target the same element, the browser decides the winner. Usually, later rules and more specific rules win.', advanced: 'The cascade resolves conflicting declarations using origin, layer, specificity, and order. Specificity can be thought of as a score: ids are stronger than classes, and classes are stronger than type selectors. Inline styles beat normal selectors, and important overrides normal declarations but creates maintenance problems. Professional teams avoid specificity wars by using consistent class patterns, design tokens, layers, or utility systems instead of sprinkling ids and important.' },
    { title: '3. Units', beginner: 'Pixels are fixed size. Rem units scale with the root text size. Percentages are relative to a parent size. Use rem for spacing and text when you want the layout to respect user settings and zoom.', advanced: 'Common units include px, rem, em, percent, vh, vw, and fr. Rem is based on the root font size, making it useful for accessible spacing and typography. Em is based on the current font size and can compound. Percentages enable fluid widths. Viewport units relate to the browser window. Clamp enables fluid sizing with minimum and maximum bounds. Choose units based on scalability, accessibility, and layout intent.' },
    { title: '4. Positioning', beginner: 'Position controls how an element is placed. Static is normal flow. Relative lets you nudge an element. Absolute takes an element out of normal flow and pins it near a positioned parent. Fixed sticks to the screen. Sticky starts normal, then sticks after you scroll past a threshold.', advanced: 'Position changes the containing block and stacking behavior. Absolute elements are positioned relative to the nearest positioned ancestor, or the initial containing block if none exists. Fixed elements are usually relative to the viewport, but transformed ancestors can alter behavior. Sticky elements remain in flow until a scroll threshold is reached. Z-index only works within stacking contexts, so understanding position and stacking contexts is essential for overlays, modals, dropdowns, and sticky headers.' },
    { title: '5. Display and Flow', beginner: 'Display controls how an element behaves in the page. Block elements stack vertically. Inline elements flow inside text. Inline-block acts like a text item but can have width and height. Flex and grid are powerful layout modes.', advanced: 'The display property switches formatting context. Block creates block-level flow. Inline participates in inline-level text flow. Inline-block creates a block box that flows inline. Flex creates a one-dimensional flex formatting context. Grid creates a two-dimensional grid formatting context. Understanding display prevents random layout bugs because many CSS issues are really formatting-context issues.' },
    { title: '6. States and Pseudo-classes', beginner: 'Pseudo-classes let you style states. Hover styles apply when the mouse is over an element. Focus styles apply when a keyboard user selects an element. Disabled styles apply when a control cannot be used.', advanced: 'Pseudo-classes such as hover, focus, focus-visible, active, disabled, checked, and nth-child allow state-based and structural styling. Focus styles are accessibility requirements, not optional decoration. Focus-visible helps reduce noisy focus rings for mouse users while preserving keyboard accessibility. Transitions can smooth state changes, but state design should preserve clarity and performance.' },
  ],
  { title: 'Style a Card', intro: 'Use the editor.', steps: [
    'Open the provided card starter.',
    'Confirm the universal selector uses box-sizing border-box.',
    'Add padding to the card, such as 1.5rem.',
    'Add border-radius, such as 12px.',
    'Add box-shadow, such as 0 8px 24px rgba(0, 0, 0, 0.25).',
    'Use rem for spacing instead of fixed px where possible.',
    'Add a hover state with a slightly stronger shadow or small transform.',
    'Zoom the page or change font size if possible and observe whether spacing scales gracefully.',
  ], goal: 'A polished card with consistent spacing.',
    code: {
      html: '<div class="card">\n  <h2>Hello</h2>\n  <p>Style me with great CSS.</p>\n</div>',
      css: '* { box-sizing: border-box; }\nbody { font-family: system-ui; background: #1a1a2e; color: white; padding: 2rem; }\n.card {\n  /* your styles */\n}',
    },
  },
  [
    q('box-sizing: border-box does what?', ['Hides borders','Includes padding+border in width','Removes margins','Centers items'], 1),
    q('Highest specificity?', ['class','id','tag','inline style'], 3),
    q('Best unit for scalable spacing?', ['px','rem','%','vh'], 1),
    q('sticky positioning is:', ['Always fixed','Relative until threshold then fixed','Same as absolute','Removed'], 1),
    q('Which property creates space inside the border, between content and border?', ['margin','padding','gap','outline'], 1),
    q('An absolutely positioned element is placed relative to...', ['The body always','The nearest positioned ancestor','The mouse','The nearest paragraph'], 1),
  ],
  ['Master the box model','Specificity rules','rem > px for scale','Sticky = hybrid','Display changes formatting context','Focus and hover states are UX requirements']
),

lesson('fs-4', 4, 'Flexbox', '📐',
  'Flexbox is for 1-dimensional layouts: row OR column. Internalize the parent/child mental model and 80% of layouts solve themselves. The parent controls direction, alignment, and distribution. The children control how much they grow, shrink, or keep their size.',
  [
    { title: '1. The Flex Container', beginner: 'A flex layout starts with a parent. You put display flex on the parent, and its direct children become flex items. The parent becomes responsible for arranging those children in a row or column.', advanced: 'A flex container creates a flex formatting context. The flex-direction property sets the main axis: row makes a horizontal main axis, column makes a vertical main axis. Flex-wrap allows items to move onto multiple lines. Gap creates spacing between items without margin hacks. Understanding container properties is the key because Flexbox is controlled from the parent, not by styling every child individually.' },
    { title: '2. justify-content vs align-items', beginner: 'Justify-content moves items along the main direction. If the row goes left to right, justify-content controls left-right placement. Align-items moves items across that direction. In a row, align-items controls top-bottom placement.', advanced: 'Justify-content distributes space along the main axis after items are sized. It supports flex-start, flex-end, center, space-between, space-around, and space-evenly. Align-items aligns items along the cross axis within a line. Align-content only matters when wrapped lines exist. Align-self overrides align-items for one item. Knowing the current main axis is essential because changing flex-direction changes what justify and align mean.' },
    { title: '3. Flex Items', beginner: 'Flex items can share extra space. If you give an item flex 1, it can grow to fill available room. If items have different flex values, they share space in that ratio.', advanced: 'The flex shorthand combines flex-grow, flex-shrink, and flex-basis. Flex 1 usually means grow equally and shrink as needed. Flex-basis sets the starting size before free space is distributed. Flex-grow controls how extra space is shared. Flex-shrink controls how items reduce when space is limited. A common issue is min-width auto causing overflow; min-width zero often fixes flex children that refuse to shrink.' },
    { title: '4. Common Patterns', beginner: 'You can center almost anything with Flexbox. Put display flex on the parent, use justify-content center for the main direction, and align-items center for the cross direction.', advanced: 'Common Flexbox patterns include centered containers, space-between navbars, media objects, equal-height columns, sticky footers, and responsive card rows. Flexbox is especially strong when items need to distribute space, wrap, or align inside one axis. For complex two-dimensional layouts, Grid may be better. The professional skill is knowing whether the layout is mostly one-dimensional or two-dimensional.' },
    { title: '5. Wrapping and Responsive Behavior', beginner: 'When there is not enough room, flex items can squeeze or overflow. Flex-wrap tells them to move to the next line instead of overflowing.', advanced: 'Flex-wrap converts a single flex line into multiple lines when needed. With wrap, align-content becomes relevant because it controls the distribution of wrapped lines. Responsive Flexbox often combines flex-wrap, gap, min-width, and flexible basis values. This avoids brittle layouts that only work at one viewport width.' },
    { title: '6. Flexbox Pitfalls', beginner: 'Flexbox can look simple, but small details can break layouts. Items may overflow because they do not shrink. Text may push boxes wider than expected. Margins can create uneven spacing when gap is better.', advanced: 'Common Flexbox pitfalls include ignoring min-width auto, using margins instead of gap, expecting align-content to matter on a single line, forgetting that flex-direction swaps the meaning of axes, and trying to force Flexbox into two-dimensional layouts. Professionals solve these with min-width zero, gap, explicit basis values, wrap, and by choosing Grid when rows and columns must align together.' },
  ],
  { title: 'Build a Responsive Navbar', intro: 'Use the editor.', steps: [
    'Open the provided navbar starter.',
    'Add display flex to the nav container.',
    'Set justify-content space-between.',
    'Add align-items center.',
    'Use gap on the link list instead of margins between links.',
    'Add flex-wrap wrap if needed for small screens.',
    'Resize the preview if possible and observe whether the navbar adapts without floats or hacks.',
  ], goal: 'A clean navbar without floats or hacks.',
    code: {
      html: '<nav class="nav">\n  <div class="logo">Sage</div>\n  <ul class="links">\n    <li>Home</li><li>About</li><li>Contact</li>\n  </ul>\n</nav>',
      css: '* { box-sizing: border-box; margin:0; padding:0; }\nbody { font-family: system-ui; background:#1a1a2e; color:white; }\n.nav { padding: 1rem; }\n.links { list-style: none; display: flex; gap: 1rem; }',
    },
  },
  [
    q('Flexbox is best for:', ['2D grids','1D rows/columns','Tables','Print layouts'], 1),
    q('justify-content controls:', ['Cross axis','Main axis alignment','Item order','Colors'], 1),
    q('flex: 1 means:', ['Hide','Grow equally to fill','Fixed 1px','Auto height'], 1),
    q('Centering in flex needs:', ['Margin auto only','justify + align: center','position absolute','translate'], 1),
    q('Which property allows flex items to move onto multiple lines?', ['flex-wrap','justify-content','order','gap'], 0),
    q('With flex-direction: column, the main axis is...', ['Horizontal','Vertical','Circular','Hidden'], 1),
  ],
  ['Flex = 1D','Main vs cross axis','flex:1 fills space','Gap > margin hacks','Wrap enables responsive lines','Know when Grid is better']
),

lesson('fs-5', 5, 'CSS Grid', '🔲',
  'Grid is for 2-dimensional layouts. Once you stop hacking flex for grids, your layout code shrinks 60%. Grid lets you define the structure first, then place content into that structure.',
  [
    { title: '1. Grid Container', beginner: 'A grid layout starts with a parent. You put display grid on the parent and define columns with grid-template-columns. The children then automatically become grid items that fit into the rows and columns.', advanced: 'A grid container creates a grid formatting context. Grid-template-columns and grid-template-rows define explicit tracks. Implicit tracks are created automatically when content needs more room. Repeat, minmax, auto-fit, and auto-fill make grids responsive without many media queries. Grid is especially useful when both row and column relationships matter.' },
    { title: '2. fr Units', beginner: 'The fr unit means fraction of available space. If you have three columns and each is 1fr, they share the space equally. If one is 2fr and the others are 1fr, the bigger one gets twice as much of the free space.', advanced: 'The fr unit distributes free space inside the grid after fixed tracks and intrinsic sizes are considered. It is not the same as percent because percent references the container size more directly, while fr distributes remaining space among tracks. Mixing px, minmax, and fr allows powerful layouts such as fixed sidebars and fluid content areas.' },
    { title: '3. Grid Areas', beginner: 'Grid areas let you name parts of the layout. You can create a picture with names like header, sidebar, content, and footer. Then you assign elements to those names.', advanced: 'Grid-template-areas creates named regions in the grid. Children are assigned with grid-area. This separates layout intent from markup order and makes responsive redesign easier because you can rearrange the named template in a media query. It is one of the most maintainable ways to express page structure in CSS.' },
    { title: '4. Gap', beginner: 'Gap creates space between grid cells. It does not add space around the outside edge of the whole grid. If you want outer spacing, use padding on the container.', advanced: 'Gap sets row-gap and column-gap. It only creates gutters between tracks, not outside the grid container. This makes spacing more predictable than margin-based grid hacks. Use padding on the grid container or a wrapper when outer spacing is needed. Row-gap and column-gap can be different for asymmetric layouts.' },
    { title: '5. auto-fit vs auto-fill', beginner: 'Auto-fit and auto-fill both help create responsive grids. Auto-fill creates as many columns as can fit, even if some are empty. Auto-fit also creates columns but then stretches the existing items to fill the row when there are not enough items.', advanced: 'Repeat with auto-fill creates as many repeated tracks as fit and keeps empty tracks if there are not enough items. Repeat with auto-fit collapses empty tracks, allowing existing items to stretch. For responsive card grids, repeat auto-fit minmax is often preferred because items reflow and fill space without media queries.' },
    { title: '6. Placement and Alignment', beginner: 'Grid items can be placed by line numbers or named areas. An item can span multiple columns or rows. You can also align items inside their cells, like centering content vertically and horizontally.', advanced: 'Items can be positioned with grid-column, grid-row, span, named areas, or auto-placement. Alignment includes justify-items and align-items for content inside cells, justify-content and align-content for the whole grid inside the container, and justify-self and align-self for individual items. This separation of track sizing, item placement, and alignment is what makes Grid powerful.' },
  ],
  { title: 'Responsive Card Grid', intro: 'No media queries needed.', steps: [
    'Open the provided grid starter.',
    'Add display grid to the grid container.',
    'Add grid-template-columns with repeat auto-fit and minmax, such as repeat(auto-fit, minmax(180px, 1fr)).',
    'Add gap, such as 1rem.',
    'Resize the preview if possible and observe the cards reflow automatically.',
    'If outer spacing is needed, add padding to the page or container rather than relying on gap alone.',
  ], goal: 'Auto-responsive grid in 3 CSS lines.',
    code: {
      html: '<div class="grid">\n  <div class="card">1</div><div class="card">2</div>\n  <div class="card">3</div><div class="card">4</div>\n</div>',
      css: 'body { background:#1a1a2e; color:white; font-family:system-ui; padding:1rem; }\n.grid { display: grid; }\n.card { background:#16213e; padding:2rem; text-align:center; border-radius:8px; }',
    },
  },
  [
    q('Grid is best for:', ['1D','2D row + column layouts','Animations','Forms'], 1),
    q('fr unit means:', ['Pixels','Fraction of available space','Percentage','Fixed'], 1),
    q('Responsive grid without media queries:', ['flexbox','repeat(auto-fit, minmax(...))','floats','tables'], 1),
    q('grid-template-areas lets you:', ['Set colors','Name regions visually','Animate','Hide elements'], 1),
    q('What is the main difference between auto-fit and auto-fill?', ['auto-fit collapses empty tracks and stretches items','auto-fill removes all gaps','auto-fit only works with pixels','auto-fill creates no columns'], 0),
    q('What does grid-column: span 2 do?', ['Hides two columns','Makes the item span two column tracks','Creates two grids','Repeats the grid twice'], 1),
  ],
  ['Grid = 2D','fr beats % for track distribution','auto-fit + minmax = magic','Areas for readability','Gap controls inner gutters','Placement and alignment are separate skills']
),

  lesson('fs-6', 6, 'Terminal & CLI', '💻',
    'GUIs hide power by giving you buttons. The terminal exposes raw power by giving you a language. Every senior developer lives in a shell because it is the universal remote control for computers. Mastering the command line builds muscle memory, enables automation, and lets you control remote servers via SSH. Get comfortable now, and you will save thousands of hours over your career.',
    [
      {
        title: '1. Navigation & Paths',
        beginner: 'pwd tells you where you are. ls shows what is around you. cd moves you to a new folder. mkdir makes a new folder. Think of it like walking through a house: you need to know your current room, see the doors, and walk through them.',
        advanced: 'Navigation relies on absolute paths (starting from root /) and relative paths (starting from current directory). . means current directory, .. means parent directory. Understanding the working directory is critical because every relative command executes from it. Tools like pushd and popd let you jump between directories without losing your place.'
      },
      {
        title: '2. File Manipulation',
        beginner: 'cat reads a file. touch creates an empty file. cp copies. mv moves or renames. rm deletes. Be careful: the terminal has no recycle bin. When you delete, it is gone forever.',
        advanced: 'File operations interact directly with the filesystem API. cp -r copies directories recursively. mv is just a rename operation at the inode level if on the same partition. rm -rf is dangerous because it bypasses all safety prompts and recursively unlinks inodes. Professionals alias rm to safer alternatives or use trash-cli to move files to a system trash instead of permanent deletion.'
      },
      {
        title: '3. Pipes, Redirects & Streams',
        beginner: '> writes output to a file. >> adds to the end of a file. | takes the output of one command and feeds it as input to the next. This is like connecting pipes to let water flow from one machine to another.',
        advanced: 'Unix philosophy relies on small tools that do one thing well, connected via standard streams: stdin (0), stdout (1), and stderr (2). > redirects stdout, 2> redirects stderr. Pipes (|) connect stdout of the left command to stdin of the right command. Tools like grep, awk, sed, and xargs transform these streams. This composability is the true superpower of the CLI.'
      },
      {
        title: '4. Shells & Configuration',
        beginner: 'bash, zsh, and fish are different shells (the program that reads your commands). Pick one, learn its shortcuts, and customize it. Tab completion and history search will make you type 10x faster.',
        advanced: 'The shell is a REPL (Read-Eval-Print Loop) and a scripting language. Configuration files like .bashrc or .zshrc run on startup to set environment variables (PATH), aliases, and prompt themes. Frameworks like Oh-My-Zsh or Starship enhance the prompt with git status and execution times. Understanding the PATH variable is essential: it is the ordered list of directories the shell searches to find executable binaries.'
      },
      {
        title: '5. Processes & Permissions',
        beginner: 'Sometimes a program freezes. You need to know how to kill it. You also need to know who is allowed to read or change a file.',
        advanced: 'Every running command is a process with a PID (Process ID). ps, top, and htop inspect them; kill sends signals (SIGTERM, SIGKILL) to stop them. File permissions (read, write, execute) are managed via chmod and ownership via chown. The octal system (e.g., 755) or symbolic modes (u+x) control access. Sudo elevates privileges to the root user, bypassing standard permission checks.'
      },
    ],
    {
      title: 'Practice in your real terminal',
      intro: 'Open Terminal (Mac/Linux) or Windows Terminal / WSL (Windows). Do not use a GUI file manager for this.',
      steps: [
        'Type pwd and press Enter. Expect to see your current absolute path, like /Users/yourname.',
        'Type ls -la and press Enter. Expect to see all files, including hidden ones starting with a dot, along with their permissions and sizes.',
        'Type mkdir cli-test && cd cli-test. Expect the prompt to change, showing you are now inside the new folder.',
        'Type touch file1.txt file2.txt && ls. Expect to see two new empty files listed.',
        'Type echo "Hello World" > file1.txt && cat file1.txt. Expect to see "Hello World" printed to the screen.',
        'Type cd .. to go back up one level, then type rm -rf cli-test. Expect the folder and all its contents to be permanently deleted without a confirmation prompt.',
      ],
      goal: 'You can navigate, create, and destroy files without touching a mouse.'
    },
    [
      q('What command prints your current absolute directory path?', ['cd', 'pwd', 'ls', 'dir'], 1, 'pwd stands for "print working directory" and outputs the absolute path from the root to your current location. cd changes directories, ls lists contents, and dir is a Windows/DOS command (though sometimes aliased in Unix).'),
      q('How do you permanently delete a folder and everything inside it in Unix?', ['rm folder', 'rm -rf folder', 'del folder', 'trash folder'], 1, 'rm -rf folder uses the -r (recursive) flag to delete contents inside the folder, and -f (force) to ignore warnings. It permanently unlinks files from the filesystem. There is no recycle bin in the standard CLI. del is for Windows, and trash is not a standard built-in.'),
      q('Which symbol pipes the output of one command into the input of another?', ['>', '>>', '|', '&'], 2, 'The pipe symbol | connects the standard output (stdout) of the left command to the standard input (stdin) of the right command. > redirects output to a file (overwriting), >> appends to a file, and & runs a command in the background.'),
      q('What does the Tab key do in a modern terminal?', ['Indents code', 'Autocompletes paths and commands', 'Quits the program', 'Cancels the current line'], 1, 'Tab triggers shell autocompletion. It reads what you have typed and searches the PATH or current directory to complete command names, file paths, or branch names. This prevents typos and saves massive amounts of time.'),
      q('Which stream is used for error messages in the terminal?', ['stdin (0)', 'stdout (1)', 'stderr (2)', 'stdlog (3)'], 2, 'Standard error (stderr, file descriptor 2) is specifically reserved for error messages and diagnostics, keeping them separate from standard output (stdout, 1) which is used for normal data. This allows you to pipe normal data while still seeing errors on the screen.'),
      q('How do you search your past command history in zsh or bash?', ['Ctrl+C', 'Ctrl+R', 'Alt+F4', 'Shift+Tab'], 1, 'Ctrl+R triggers the reverse incremental search. As you type, it searches backward through your command history for matches. Pressing Ctrl+R again finds the next match. This is much faster than pressing the up arrow dozens of times.'),
    ],
    ['CLI = raw computer power', 'Tab + Ctrl+R = massive speed boost', 'rm -rf is permanent and unforgiving', 'Pipes compose small tools into powerful workflows', 'Understand absolute vs relative paths']
  ),

  lesson('fs-7', 7, 'Git Basics', '🔀',
    'Git is the time machine and parallel universe generator for your code. Not knowing git is like coding without an undo button — eventually, you will lose work and cry. Git tracks every change, lets you experiment safely in isolated branches, and forms the absolute foundation of all modern team collaboration.',
    [
      {
        title: '1. The 3 States',
        beginner: 'Your files live in three places. The Working Directory is where you edit. The Staging Area is where you prepare changes. The Repository is the permanent history. You move changes from working to staging, then from staging to history.',
        advanced: 'The Working Directory is the actual filesystem. The Staging Area (Index) is a binary tree preparing the next commit object. The Repository (.git folder) is an object database containing blobs (file contents), trees (directories), and commits (snapshots with metadata). git add updates the index; git commit writes the objects and updates the HEAD pointer.'
      },
      {
        title: '2. Commits & History',
        beginner: 'A commit is a saved snapshot of your code plus a message describing what you did. Good messages tell the story of the project. Bad messages make history useless.',
        advanced: 'A commit is an immutable object identified by a SHA-1 hash. It contains a pointer to a tree object, author metadata, a timestamp, and a pointer to its parent commit(s). This forms a Directed Acyclic Graph (DAG). Professional teams use Conventional Commits (feat:, fix:, refactor:) and atomic commits (one logical change per commit) to keep the DAG readable and bisectable.'
      },
      {
        title: '3. Branches & Pointers',
        beginner: 'A branch is a parallel timeline. You can make changes on a branch without affecting the main code. When you are done, you merge it back. main is the default branch.',
        advanced: 'A branch is simply a lightweight, movable pointer to a specific commit. The special pointer HEAD tracks which branch you are currently on. Creating a branch just creates a new pointer. Merging integrates the DAG histories. Fast-forward merges just move the pointer, while true merges create a new merge commit with two parents. Trunk-based development favors short-lived branches and frequent merges.'
      },
      {
        title: '4. Undoing Mistakes',
        beginner: 'If you mess up, Git can fix it. checkout restores files. reset moves the timeline back. revert creates a new commit that undoes an old one.',
        advanced: 'git checkout or restore modifies the working directory or index. git reset moves the branch pointer and optionally alters the index/working tree (--soft, --mixed, --hard). Reset rewrites local history and is dangerous on shared branches. git revert calculates the inverse diff and applies it as a new commit, preserving history and making it safe for public branches.'
      },
      {
        title: '5. Remotes & Collaboration',
        beginner: 'A remote is a copy of your project on another computer, like GitHub. origin is the default name for your GitHub remote. You push your commits up and pull other people\'s commits down.',
        advanced: 'Remotes are bookmarks to external repositories. git fetch downloads objects and updates remote-tracking branches (like origin/main) without touching your working directory. git pull is literally just git fetch followed by git merge. Understanding the difference between local branches, remote-tracking branches, and remote branches is the hallmark of Git proficiency.'
      },
    ],
    {
      title: 'Initialize a Repo',
      intro: 'In your terminal, create your first permanent history.',
      steps: [
        'Type mkdir my-repo && cd my-repo. Expect to be in an empty folder.',
        'Type git init. Expect Git to create a hidden .git folder that will store the object database.',
        'Type echo "Hello Git" > readme.md. Expect a new file to appear in your working directory.',
        'Type git status. Expect to see readme.md listed as an "Untracked file" in red.',
        'Type git add readme.md. Expect the file to move to the staging area (shown in green on the next status check).',
        'Type git commit -m "feat: initial commit". Expect Git to calculate the SHA-1 hash, write the blob and tree objects, and advance the main branch pointer.',
        'Type git log. Expect to see your commit hash, author, date, and message.',
      ],
      goal: 'Your first commit lives forever in the local object database.'
    },
    [
      q('What does git add actually do?', ['Saves changes to permanent history', 'Moves changes from working directory to the staging area', 'Pushes code to GitHub', 'Creates a new branch'], 1, 'git add updates the Index (staging area) with the current contents of the working directory file. It does not write to the permanent repository history (that is git commit), nor does it interact with remotes (git push).'),
      q('What is the safest way to undo a commit that has already been pushed to a shared team branch?', ['git reset --hard', 'git revert', 'rm -rf .git', 'git rebase -i'], 1, 'git revert calculates the inverse of the target commit and creates a new commit applying those changes. This preserves the existing history for other team members. git reset rewrites history, which will cause massive conflicts for anyone else who has pulled the branch.'),
      q('What is the modern default branch name in Git?', ['master', 'main', 'dev', 'trunk'], 1, 'The industry standard shifted from "master" to "main" to use more inclusive language. While older repositories may still use master, modern Git configurations and platforms like GitHub default to main.'),
      q('What exactly is a Git commit?', ['A single file', 'An immutable snapshot object with a SHA-1 hash, tree, and parent pointer', 'A branch name', 'A connection to GitHub'], 1, 'A commit is an immutable object in the Git database. It contains metadata, a pointer to a tree object (which points to blobs representing file contents), and a pointer to its parent commit(s). It is identified by a cryptographic SHA-1 hash.'),
      q('What is the difference between git fetch and git pull?', ['They are exactly the same', 'fetch downloads changes but doesn\'t merge; pull downloads and merges', 'fetch is for GitHub, pull is for local', 'pull is faster than fetch'], 1, 'git fetch safely downloads new commits, files, and references from the remote repository and updates your remote-tracking branches (like origin/main), but leaves your working directory untouched. git pull is essentially git fetch followed immediately by git merge, which alters your current working branch.'),
      q('What does HEAD represent in Git?', ['The first commit ever made', 'The pointer to the currently checked-out commit or branch', 'The remote server', 'The staging area'], 1, 'HEAD is a special symbolic pointer that indicates exactly which commit your working directory and index are currently based on. Usually, it points to a local branch name (like main), which in turn points to a commit.'),
    ],
    ['The 3 states (Working, Staging, Repo) dictate the flow', 'Commits are immutable objects forming a DAG', 'Branches are just lightweight movable pointers', 'Revert for shared history, reset for local history', 'Fetch downloads, pull downloads and merges']
  ),

  lesson('fs-8', 8, 'JS Logic & Fundamentals', '⚡',
    'JavaScript is the engine that runs the modern web. Before you reach for heavy frameworks, you must master the raw language. Understanding types, scope, and control flow gives you the mental model needed to debug anything, because every framework is just JavaScript underneath.',
    [
      {
        title: '1. Types & Equality',
        beginner: 'JavaScript has basic types like text (string), numbers, and true/false (boolean). It also has objects for complex data. Always use === to compare things, because == tries to be too smart and causes weird bugs.',
        advanced: 'JS has 7 primitives (string, number, boolean, null, undefined, symbol, bigint) and Object. Primitives are passed by value; Objects are passed by reference (technically pass-by-sharing). The == operator performs type coercion, leading to unpredictable results (e.g., "0" == false). The === operator checks strict type and value equality. typeof is useful but has quirks, like typeof null returning "object".'
      },
      {
        title: '2. Variables & Scope',
        beginner: 'Use const for things that won\'t change, and let for things that will. Never use var. const and let follow the rules of the blocks they are in, while var leaks out and causes confusion.',
        advanced: 'let and const are block-scoped, meaning they only exist within the nearest {} braces. var is function-scoped and gets hoisted to the top of the function, leading to silent bugs. const prevents reassignment of the binding, but if the value is an object or array, its internal properties can still be mutated. Variables declared with let/const experience a Temporal Dead Zone (TDZ) where accessing them before declaration throws a ReferenceError.'
      },
      {
        title: '3. Functions & Closures',
        beginner: 'Functions are reusable blocks of code. You can write them as function myFunc() {} or const myFunc = () => {}. Arrow functions are shorter but act slightly differently when dealing with the word "this".',
        advanced: 'Functions in JS are first-class citizens, meaning they can be stored in variables, passed as arguments, and returned from other functions. A closure is created when an inner function retains access to the outer function\'s scope even after the outer function has finished executing. Arrow functions do not bind their own this, arguments, or super; they inherit them lexically from the enclosing scope, making them ideal for callbacks but unsuitable for object methods.'
      },
      {
        title: '4. Control Flow & Arrays',
        beginner: 'if/else statements let code make decisions. for and while loops let code repeat. But for arrays, it is much better to use built-in tools like map, filter, and reduce instead of writing manual loops.',
        advanced: 'Modern JS favors declarative array methods over imperative for loops. map transforms every element, filter selects elements based on a condition, and reduce boils an array down to a single value. These methods return new arrays (promoting immutability) and clearly communicate intent. Understanding truthy and falsy values (like 0, "", null, undefined, NaN) is critical for writing clean conditional logic and utilizing short-circuit evaluation (&& and ||).'
      },
      {
        title: '5. The Event Loop (Async Basics)',
        beginner: 'JavaScript can only do one thing at a time. But it can start a task (like fetching data), step away to let the browser do other things, and come back when the task is finished. This keeps the page from freezing.',
        advanced: 'JS is single-threaded but uses an Event Loop to handle asynchronous operations. The Call Stack executes synchronous code. Web APIs (like setTimeout or fetch) handle async tasks in the background and push callbacks to the Task Queue (macrotasks) or Microtask Queue (Promises). The Event Loop waits for the Call Stack to be empty, then prioritizes the Microtask Queue before the Task Queue, ensuring Promise resolutions happen before UI renders or timers.'
      },
    ],
    {
      title: 'Sum an Array',
      intro: 'Use the editor to compare old and new ways of looping.',
      steps: [
        'Declare an array of numbers: const nums = [1, 2, 3, 4, 5];',
        'Use the reduce method to sum them: nums.reduce((acc, n) => acc + n, 0).',
        'Console log the result and verify it equals 15.',
        'Rewrite the same logic using a standard for (let i = 0; i < nums.length; i++) loop.',
        'Compare the two: notice how reduce removes the need for a mutable counter variable and clearly states the intent to "reduce" the array to a single value.',
      ],
      goal: 'Two solutions, one mental model. Understand why declarative methods win.',
      code: {
        html: '<h1>Check the console</h1>',
        js: 'const nums = [1,2,3,4,5];\nconst sum = nums.reduce((acc, n) => acc + n, 0);\nconsole.log("Sum:", sum);',
      },
    },
    [
      q('Which operator checks both value and type without coercion?', ['==', '===', '=', 'equals()'], 1, '=== (strict equality) checks both value and type without performing type coercion. == (loose equality) attempts to coerce types before comparing, leading to unpredictable bugs like "0" == false. = is the assignment operator, and equals() is not a native JS operator.'),
      q('What is the default modern variable keyword you should reach for first?', ['var', 'let', 'const', 'define'], 2, 'const should be your default because it prevents accidental reassignment of the variable binding, making code easier to reason about. Use let only when you explicitly need to reassign (like loop counters). Never use var due to function-scoping and hoisting bugs.'),
      q('How do arrow functions handle the "this" keyword?', ['They bind their own this based on how they are called', 'They inherit this lexically from the enclosing scope', 'They always point to the window object', 'They throw an error if this is used'], 1, 'Arrow functions do not have their own this binding. They capture the this value of the enclosing lexical context at the time they are created. This makes them perfect for callbacks inside object methods, but terrible for defining the object methods themselves.'),
      q('Which array method is best for transforming every item into a new format?', ['for loop', 'map', 'while', 'filter'], 1, 'map is specifically designed to iterate over an array, apply a transformation function to each element, and return a brand new array of the exact same length. filter is for removing items, and for/while are imperative loops that require manual array management.'),
      q('What happens if you try to access a let variable before it is declared?', ['It returns undefined', 'It returns null', 'It throws a ReferenceError (Temporal Dead Zone)', 'It automatically hoists to the top'], 2, 'Variables declared with let and const are hoisted to the top of their block, but they remain uninitialized in a state called the Temporal Dead Zone (TDZ). Accessing them before the declaration line throws a ReferenceError, unlike var which initializes to undefined.'),
      q('Which queue does the Event Loop process first after the Call Stack is empty?', ['Task Queue (setTimeout)', 'Microtask Queue (Promises)', 'Render Queue', 'They are processed randomly'], 1, 'The Event Loop always exhausts the Microtask Queue (which holds Promise callbacks and queueMicrotask) before it processes a single event from the Task Queue (which holds setTimeout, setInterval, and DOM events). This ensures promise chains resolve synchronously relative to the current event loop tick.'),
    ],
    ['Use === to avoid coercion bugs', 'const by default, let when needed, never var', 'Arrow functions inherit this, regular functions bind it', 'Declarative array methods (map/filter/reduce) beat imperative loops', 'The Event Loop manages async via Microtasks and Macrotasks']
  ),

  lesson('fs-9', 9, 'The DOM', '🌳',
    'The Document Object Model (DOM) is your bridge between JavaScript logic and the visual page. Frameworks like React abstract it away, but knowing the raw DOM API makes you 10× better at debugging, optimizing performance, and understanding what your framework is actually doing under the hood.',
    [
      {
        title: '1. Selecting Elements',
        beginner: 'To change something on the page, you first have to find it. document.querySelector finds the first match. document.querySelectorAll finds all matches. They let you use CSS selectors to grab elements.',
        advanced: 'querySelector and querySelectorAll accept any valid CSS selector and return either a single Element or a static NodeList. Older methods like getElementById are technically faster because they bypass the selector engine, but querySelector is vastly more flexible. Be aware that getElementsByTagName returns a live HTMLCollection that updates automatically when the DOM changes, whereas querySelectorAll returns a static snapshot.'
      },
      {
        title: '2. Modifying the Tree',
        beginner: 'Once you have an element, you can change its text, its classes, or its style. Use textContent for text. Use classList.add or classList.remove to change CSS classes safely.',
        advanced: 'Directly modifying el.style triggers inline styles, which is hard to maintain. Toggling classes via el.classList is the professional standard. Never use innerHTML to insert user-generated content, as it parses strings as HTML and creates massive Cross-Site Scripting (XSS) vulnerabilities. Use textContent for text, or createElement and appendChild for complex DOM nodes to ensure safety and better performance.'
      },
      {
        title: '3. Events & Delegation',
        beginner: 'Events are how the page knows a user did something, like clicking or typing. You attach a listener to an element. If you have 100 buttons, don\'t add 100 listeners. Add one listener to their parent and let the clicks bubble up.',
        advanced: 'The DOM uses event propagation: capturing (down the tree) and bubbling (up the tree). Event delegation leverages bubbling by attaching a single listener to a common ancestor. Inside the handler, you check event.target to see which child actually triggered the event. This drastically reduces memory consumption and automatically handles dynamically added elements without needing to re-bind listeners.'
      },
      {
        title: '4. Reflow, Repaint & Performance',
        beginner: 'Changing the size or position of an element forces the browser to recalculate the whole page layout. This is called reflow, and it is slow. Changing just the color causes a repaint, which is faster. Group your changes together so the browser only has to draw once.',
        advanced: 'The browser rendering pipeline consists of Style calculation, Layout (Reflow), Paint, and Composite. Reading layout properties (like offsetHeight) immediately after writing to the DOM forces a synchronous layout calculation, known as "layout thrashing," which destroys performance. Professionals batch DOM reads and writes, use CSS transforms for animations (which skip layout and paint, going straight to the GPU compositor), and use requestAnimationFrame to sync JS updates with the browser\'s refresh rate.'
      },
      {
        title: '5. Shadow DOM & Web Components',
        beginner: 'Sometimes you want a piece of the page to have its own private CSS so it doesn\'t mess up the rest of the site. Shadow DOM creates a hidden, isolated bubble inside an element.',
        advanced: 'The Shadow DOM API allows you to attach a hidden, separate DOM tree to an element (the shadow host). Styles and IDs inside the shadow tree are completely encapsulated and do not leak out or get affected by the main document. This is the foundational technology behind native Web Components and is how frameworks like Angular achieve style encapsulation without build-step hacks.'
      },
    ],
    {
      title: 'Click Counter',
      intro: 'Use the editor to build vanilla DOM interaction.',
      steps: [
        'Inspect the provided HTML: a button with id "btn" and a span with id "count".',
        'In JS, select both elements using document.getElementById or querySelector.',
        'Create a variable let n = 0; outside the event listener to hold state.',
        'Attach a click listener to the button: btn.addEventListener("click", () => { ... }).',
        'Inside the callback, increment n and update the span: count.textContent = n;',
        'Click the button in the preview. Expect the number to increase without page reloads.',
      ],
      goal: 'Vanilla DOM interaction. Understand state, selection, and event binding.',
      code: {
        html: '<button id="btn">Click me</button>\n<p>Count: <span id="count">0</span></p>',
        js: 'const btn = document.getElementById("btn");\nconst count = document.getElementById("count");\nlet n = 0;\nbtn.addEventListener("click", () => {\n  n++;\n  count.textContent = n;\n});',
      },
    },
    [
      q('Which method is the most flexible for selecting elements using CSS syntax?', ['getElementById', 'querySelector', 'getElementsByTagName', 'getAllElements'], 1, 'querySelector accepts any valid CSS selector (classes, pseudo-classes, combinators) and returns the first match. getElementById only works for IDs, getElementsByTagName only works for tag names, and getAllElements is not a standard DOM method.'),
      q('What is the safest way to insert plain text into an element?', ['innerHTML', 'textContent', 'outerHTML', 'document.write'], 1, 'textContent sets the text content of an element and automatically escapes any HTML tags, preventing Cross-Site Scripting (XSS) attacks. innerHTML parses the string as HTML, which is dangerous if the string contains user input. outerHTML replaces the element itself, and document.write is an obsolete, blocking API.'),
      q('Why use Event Delegation instead of adding listeners to every child?', ['It makes the code look shorter', 'It saves memory and handles dynamically added children automatically', 'It is required by HTML5', 'It stops events from bubbling'], 1, 'Event delegation attaches a single listener to a parent element. Because events bubble up, the parent catches clicks from any child. This uses vastly less memory than thousands of individual listeners and automatically works for children added to the DOM later via JavaScript.'),
      q('What does event.preventDefault() do?', ['Stops the event from bubbling up', 'Stops the browser\'s default action for that event (like submitting a form or following a link)', 'Removes the event listener', 'Hides the element'], 1, 'preventDefault() cancels the default browser behavior associated with the event, such as a form submission reloading the page or an anchor tag navigating to a new URL. It does not stop propagation (that is stopPropagation()).'),
      q('Which operation is the most expensive for browser performance?', ['Changing text color', 'Changing opacity', 'Reading offsetWidth immediately after changing a class', 'Adding a CSS transition'], 2, 'Reading layout properties like offsetWidth or clientHeight immediately after modifying the DOM forces the browser to synchronously calculate the layout (Reflow) before it can return the value. This is called "layout thrashing" and blocks the main thread, causing massive performance drops.'),
      q('What is the primary benefit of the Shadow DOM?', ['It makes pages load faster', 'It provides strict CSS and DOM encapsulation for components', 'It hides elements from screen readers', 'It encrypts the HTML'], 1, 'The Shadow DOM creates an isolated, scoped DOM tree attached to an element. CSS rules inside the shadow tree do not leak out, and global CSS rules do not bleed in. This allows developers to build reusable Web Components without style collisions.'),
    ],
    ['DOM = JS bridge to the page', 'Avoid innerHTML for user data to prevent XSS', 'Delegate events to parents for memory efficiency', 'Batch DOM reads/writes to avoid layout thrashing', 'Understand the rendering pipeline: Style, Layout, Paint, Composite']
  ),

  lesson('fs-10', 10, 'GitHub & Collaboration', '🐙',
    'Code lives on GitHub. Pull requests, issues, and CI/CD are the daily reality of every professional team. Git is the tool, but GitHub is the workflow. Learning the social and automated flow of code review is just as important as writing the code itself.',
    [
      {
        title: '1. Remotes & Tracking',
        beginner: 'A remote is just a link to a GitHub repository. origin is the default nickname for that link. You push your work up to it, and pull other people\'s work down from it.',
        advanced: 'Remotes are references to external repositories. When you clone, Git automatically creates the origin remote and sets up remote-tracking branches (like origin/main). The -u flag in git push -u origin main establishes an upstream tracking relationship, allowing you to simply type git push and git pull in the future without specifying the remote and branch names.'
      },
      {
        title: '2. Pull Requests (PRs)',
        beginner: 'A Pull Request is a formal proposal to merge your branch into the main code. It is where teammates read your code, leave comments, and approve it before it becomes permanent.',
        advanced: 'PRs are the core unit of code review. Professional teams enforce small PRs (<400 lines) because large PRs cause review fatigue and let bugs slip through. Merge strategies matter: "Merge Commit" preserves exact history, "Squash and Merge" keeps the main branch history clean with one commit per feature, and "Rebase and Merge" creates a linear history. Choosing a strategy is a team-wide convention.'
      },
      {
        title: '3. Issues & Linking',
        beginner: 'Issues are where you track bugs, feature requests, and tasks. You can link your code to an issue so that when your code is merged, the issue automatically closes.',
        advanced: 'Issues integrate with project boards, milestones, and labels for agile workflows. GitHub uses magic keywords in commit messages or PR descriptions (like "Closes #42" or "Fixes #10") to automatically link the PR to the issue and close the issue upon merge. This creates a bidirectional paper trail between the business requirement and the exact code that fulfilled it.'
      },
      {
        title: '4. GitHub Actions (CI/CD)',
        beginner: 'Actions are robots that run automatically when you push code. They can run your tests, check for typos, and even deploy your website to the internet without you lifting a finger.',
        advanced: 'GitHub Actions is a YAML-based CI/CD pipeline integrated directly into the repository. It spins up ephemeral virtual machines (runners) to execute jobs. Professional workflows use Actions to run linters, execute unit tests, perform bundle size checks, and deploy to staging environments on every PR. If the Actions fail, the PR cannot be merged, providing cheap, automated insurance against regressions.'
      },
      {
        title: '5. Forking vs Cloning',
        beginner: 'Cloning downloads a repository to your computer. Forking creates a personal copy of someone else\'s repository on your GitHub account. You fork open-source projects to suggest changes, but you clone your own company\'s projects.',
        advanced: 'Cloning creates a local replica with a direct remote link to the original. Forking creates a server-side replica under your namespace, which you then clone locally. In open-source, you fork, push to your fork, and open a PR from your fork to the upstream repository. In internal corporate environments, developers usually have direct write access to the main repo, so they use branches instead of forks.'
      },
    ],
    {
      title: 'Push Your First Repo',
      intro: 'Execute the real GitHub flow from terminal to browser.',
      steps: [
        'Create a new, empty repository on github.com. Do not initialize it with a README.',
        'In your local terminal, inside a git-initialized folder, type: git remote add origin <your-repo-url>.',
        'Type git push -u origin main. Expect Git to authenticate and upload your commits to GitHub.',
        'Create a new feature branch: git checkout -b feature/add-login.',
        'Make a change, commit it, and type git push. Expect the new branch to appear on GitHub.',
        'Go to GitHub.com, click "Compare & pull request", write a description, and open the PR.',
      ],
      goal: 'Your code is on GitHub, and you have an open Pull Request ready for review.'
    },
    [
      q('What is the default nickname Git gives to the remote repository you cloned from?', ['main', 'origin', 'master', 'remote'], 1, 'When you run git clone, Git automatically creates a remote reference named "origin" pointing to the URL you cloned from. "main" and "master" are branch names, not remote names.'),
      q('What is the generally recommended size for a Pull Request in a professional team?', ['As huge as possible to save time', 'Small (< 400 lines of changes)', 'Exactly one commit only', 'It doesn\'t matter'], 1, 'Small PRs (<400 lines) are reviewed faster, more thoroughly, and result in fewer bugs. Massive PRs cause reviewer fatigue, lead to superficial "LGTM" approvals, and make it incredibly difficult to isolate regressions if something breaks later.'),
      q('How do you automatically close Issue #42 when your Pull Request is merged?', ['You have to manually click a button on the issue', 'Include "Closes #42" in the PR description or commit message', 'It is impossible, you must close it yourself', 'Use a webhook'], 1, 'GitHub parses magic keywords like "Closes", "Fixes", or "Resolves" followed by an issue number in PR descriptions or commit messages. When the PR is merged into the default branch, GitHub automatically closes the linked issue and leaves a cross-reference comment.'),
      q('What is the primary purpose of GitHub Actions in a modern workflow?', ['Getting stars on your profile', 'Automated CI/CD pipelines (testing, linting, deploying)', 'Managing issue labels', 'Hosting static images'], 1, 'GitHub Actions is a CI/CD tool that runs automated workflows defined in YAML files. It is used to run test suites, enforce code quality, check bundle sizes, and deploy applications automatically whenever code is pushed or a PR is opened.'),
      q('When contributing to an open-source project you don\'t have write access to, what is the first step?', ['git clone the main repo and push directly', 'Fork the repo to your account, clone your fork, and PR from it', 'Email the owner the code', 'git pull request'], 1, 'Because you lack write permissions to the upstream repository, you must Fork it (creating a copy under your account), clone your fork locally, push your changes to your fork, and then open a Pull Request from your fork to the original upstream repository.'),
      q('What does the -u flag do in git push -u origin main?', ['Uploads the code faster', 'Sets the upstream tracking reference so future pushes only need "git push"', 'Unlocks the repository', 'Updates the README'], 1, 'The -u (or --set-upstream) flag links your local branch to the remote branch. After running this once, Git knows where to push and pull from, allowing you to simply type git push and git pull without specifying "origin main" every time.'),
    ],
    ['origin is the default remote link', 'Small PRs ship faster and safer', 'Link issues with magic keywords for auto-closing', 'CI/CD catches regressions before they merge', 'Fork for open-source, branch for internal teams']
  ),

  lesson('fs-11', 11, 'ES6+ Modern JavaScript', '✨',
    'Modern JavaScript is fundamentally a different, more powerful language than it was a decade ago. Destructuring, spread syntax, async/await, and modules are not optional extras; they are the baseline vocabulary of 2026. Mastering them makes your code shorter, safer, and infinitely more readable.',
    [
      {
        title: '1. Destructuring',
        beginner: 'Destructuring lets you unpack values from arrays or properties from objects into distinct variables. Instead of writing user.name and user.age, you can pull them out in one clean line.',
        advanced: 'Destructuring works on objects and iterables. It supports renaming (const { name: userName } = obj), default values (const { role = "user" } = obj), and deep nesting. It is heavily used in function parameters to accept configuration objects cleanly. It replaces dozens of lines of manual property extraction and makes refactoring significantly easier.'
      },
      {
        title: '2. Spread & Rest Operators',
        beginner: 'The three dots (...) do two opposite things. Spread expands an array or object into individual parts. Rest collects multiple items into a single array. They are the secret to copying data without accidentally changing the original.',
        advanced: 'The Spread syntax expands iterables into individual elements or object properties, enabling shallow cloning and immutable state updates (e.g., const newState = { ...oldState, updated: true }). The Rest syntax gathers remaining arguments into an array (function sum(...args)) or extracts remaining object properties. Understanding the Iterable protocol is key to knowing what can be spread.'
      },
      {
        title: '3. Async / Await',
        beginner: 'Fetching data takes time. async and await let you write code that waits for data to arrive, but looks like normal, top-to-bottom code instead of a messy chain of .then() callbacks.',
        advanced: 'async/await is syntactic sugar over Promises. An async function always returns a Promise. The await keyword pauses the execution of the async function until the Promise resolves, yielding control back to the event loop. Error handling is done via standard try/catch blocks. For parallel execution, use Promise.all(). For tolerant execution where you need all results even if some fail, use Promise.allSettled().'
      },
      {
        title: '4. Modules (ESM)',
        beginner: 'Modules let you split your code into multiple files. You export functions from one file and import them into another. This keeps your project organized and prevents variable names from clashing.',
        advanced: 'ECMAScript Modules (ESM) use static import/export syntax, allowing bundlers like Vite or Webpack to perform tree-shaking (removing unused code at build time). This is a massive shift from CommonJS (require/module.exports) which is dynamic and evaluated at runtime. Understanding the difference between default exports and named exports, and enforcing a team convention via ESLint, is critical for large codebases.'
      },
      {
        title: '5. Optional Chaining & Nullish Coalescing',
        beginner: 'Optional chaining (?.) stops your code from crashing if a property is missing. Nullish coalescing (??) provides a backup value only if the original is truly missing (null or undefined), not just if it\'s zero or false.',
        advanced: 'Optional chaining (obj?.nested?.prop) short-circuits and returns undefined if any part of the chain is nullish, preventing "Cannot read property of undefined" runtime errors. Nullish coalescing (val ?? fallback) differs from the logical OR (||) because it only falls back on null or undefined, whereas || falls back on any falsy value (0, "", false), which is a common source of logic bugs.'
      },
    ],
    {
      title: 'Modern Rewrite',
      intro: 'Use the editor to practice modern syntax patterns.',
      steps: [
        'Create an object: const user = { name: "Sage", age: 21, address: { city: "NY" } };',
        'Destructure the name and the nested city: const { name, address: { city } } = user;',
        'Create two arrays and merge them immutably using spread: const all = [...arr1, ...arr2];',
        'Write an async function that uses fetch, awaits the response, and wraps it in a try/catch block.',
        'Use optional chaining to safely read user.profile?.avatar?.url without throwing errors.',
      ],
      goal: 'Modern syntax becomes muscle memory. Write code that is safe, short, and expressive.',
      code: {
        html: '<h1>Open the console</h1>',
        js: 'const user = { name: "Sage", age: 21 };\nconst { name, age } = user;\nconsole.log(name, age);\n\nconst a = [1,2]; const b = [3,4];\nconsole.log([...a, ...b]);',
      },
    },
    [
      q('What does the spread operator (...) do when used inside an array literal?', ['Deletes the array', 'Expands an iterable into individual elements', 'Reverses the array', 'Creates a loop'], 1, 'The spread syntax expands an iterable (like an array or string) into individual elements. It is commonly used for shallow copying arrays, merging arrays together, or passing array elements as arguments to a function.'),
      q('Which pattern creates an immutable update of an object state?', ['state.key = newValue', 'const newState = { ...state, key: newValue }', 'Object.assign(state, { key: newValue })', 'delete state.key'], 1, 'Using the spread operator inside a new object literal ({ ...state, key: newValue }) creates a brand new object with the updated properties, leaving the original state object untouched. Direct assignment mutates the original, and Object.assign mutates the first argument unless an empty object is passed first.'),
      q('How do you run multiple async operations in parallel and wait for all of them to finish?', ['Using a standard for loop', 'Promise.all([p1, p2])', 'setTimeout', 'await all()'], 1, 'Promise.all() takes an array of Promises and returns a single Promise that resolves when all of them have resolved, or rejects immediately if any single Promise rejects. This runs them concurrently, whereas awaiting them sequentially in a loop would run them one after the other.'),
      q('What is the main difference between || (OR) and ?? (Nullish Coalescing)?', ['They are exactly the same', '?? only falls back on null or undefined, while || falls back on any falsy value (like 0 or "")', '?? is for numbers, || is for strings', '?? is deprecated'], 1, 'The logical OR (||) returns the right side if the left side is any falsy value (0, "", false, null, undefined). This causes bugs if 0 or "" are valid values. Nullish coalescing (??) strictly checks for null or undefined, preserving valid falsy values like 0 or empty strings.'),
      q('What happens if you use await inside a function that is not marked as async?', ['It works perfectly', 'It throws a SyntaxError', 'It runs synchronously', 'It deletes the function'], 1, 'The await keyword is only valid inside the body of an async function (or at the top level of an ES Module). Using it in a standard synchronous function will result in a SyntaxError during parsing.'),
      q('Why are ES Modules (import/export) preferred over CommonJS (require) in modern frontend?', ['They are older and more tested', 'They are statically analyzable, enabling tree-shaking by bundlers', 'They run faster in Node.js', 'They don\'t require a build step'], 1, 'ES Modules use static syntax that is evaluated at compile time. This allows bundlers like Vite or Webpack to analyze the dependency graph and safely remove unused exports (tree-shaking), drastically reducing final bundle sizes. CommonJS is dynamic and evaluated at runtime, making static analysis impossible.'),
    ],
    ['Destructure objects and arrays to extract data cleanly', 'Use Spread for immutable updates, Rest for gathering arguments', 'async/await makes asynchronous code read synchronously', 'ES Modules enable tree-shaking and static analysis', 'Use ?. and ?? to prevent runtime crashes and logic bugs']
  ),

  lesson('fs-12', 12, 'Working with APIs', '📡',
    'Modern web applications are essentially 80% glue code connecting user interfaces to backend APIs. Mastering the fetch API, understanding REST contracts, handling errors gracefully, and managing loading states are the skills that separate a junior who copies tutorials from a senior who builds resilient software.',
    [
      {
        title: '1. The Fetch API',
        beginner: 'fetch is the built-in browser tool for talking to APIs. You give it a URL, it goes to the server, and it brings back data. But it doesn\'t automatically turn that data into JavaScript objects; you have to tell it to parse the JSON.',
        advanced: 'fetch returns a Promise that resolves to a Response object representing the HTTP response. Crucially, fetch only rejects on network failures or CORS errors. It resolves successfully even on 404 or 500 status codes. You must always check response.ok or response.status before attempting to parse the body. Modern fetch also supports AbortController for canceling requests and ReadableStream for processing large payloads incrementally.'
      },
      {
        title: '2. REST Verbs & Idempotency',
        beginner: 'APIs use different verbs to explain what you want to do. GET reads data. POST creates new data. PUT updates existing data. DELETE removes it. Using the right verb keeps the API organized.',
        advanced: 'REST (Representational State Transfer) relies on standard HTTP methods. A critical concept is idempotency: GET, PUT, and DELETE are idempotent, meaning making the exact same request multiple times yields the same server state. POST is not idempotent; calling it twice might create two records. Understanding this dictates your retry logic: you can safely auto-retry a failed GET, but auto-retrying a POST could charge a credit card twice.'
      },
      {
        title: '3. Headers, Auth & CORS',
        beginner: 'Headers are invisible tags sent with your request. They tell the server who you are (Authorization) and what kind of data you want. CORS is a security rule that stops websites from talking to APIs they aren\'t allowed to.',
        advanced: 'HTTP Headers carry metadata. The Authorization header typically uses the "Bearer <token>" scheme for JWTs. CORS (Cross-Origin Resource Sharing) is enforced by the browser, not the server. For non-simple requests (custom headers, PUT/DELETE), the browser sends an OPTIONS preflight request to check if the server permits the cross-origin access. Understanding preflights is essential for debugging blocked API calls.'
      },
      {
        title: '4. Error UX & Resilience',
        beginner: 'APIs fail. The internet drops. Servers crash. A good app doesn\'t just show a blank screen or a confusing error code. It shows a loading spinner while waiting, and a friendly message with a "Retry" button if something breaks.',
        advanced: 'Resilient API integration requires state management for Loading, Success, and Error states. For transient errors (500, 503, network timeouts), implement retry logic with exponential backoff. Never auto-retry 4xx errors (400, 401, 404) as they indicate client-side faults that will just fail again. Use Optimistic UI updates to make the app feel instant, rolling back the state if the API call ultimately fails.'
      },
      {
        title: '5. REST vs GraphQL',
        beginner: 'REST gives you a different URL for every piece of data. GraphQL gives you one URL and lets you ask for exactly the fields you want, nothing more and nothing less.',
        advanced: 'REST endpoints return fixed data structures, often leading to over-fetching (getting data you don\'t need) or under-fetching (needing multiple requests to build a view). GraphQL is a query language for APIs that allows the client to define the exact shape of the response graph. While REST is simpler to cache via standard HTTP caching, GraphQL solves the N+1 request problem and provides strong, auto-generated type contracts.'
      },
    ],
    {
      title: 'Fetch a Joke',
      intro: 'Use the editor to build a resilient API loop.',
      steps: [
        'Inspect the provided HTML with a div id="joke" showing "Loading...".',
        'In JS, create an async function named load.',
        'Use fetch to call the random joke API. Await the response.',
        'Crucial step: Check if (!response.ok) throw new Error("HTTP " + response.status);',
        'Await response.json() to parse the body, then update the DOM with the setup and punchline.',
        'Wrap the entire logic in a try/catch block. In the catch, update the DOM to show the error message.',
      ],
      goal: 'Complete the API → UI loop with proper error handling and state management.',
      code: {
        html: '<div id="joke">Loading...</div>',
        js: 'async function load() {\n  try {\n    const r = await fetch("https://official-joke-api.appspot.com/random_joke");\n    if (!r.ok) throw new Error("HTTP " + r.status);\n    const j = await r.json();\n    document.getElementById("joke").innerText = j.setup + " — " + j.punchline;\n  } catch (e) { document.getElementById("joke").innerText = "Error: " + e.message; }\n}\nload();',
      },
    },
    [
      q('Does the fetch API throw an error when the server returns a 404 or 500 status code?', ['Yes, it always throws on errors', 'No, it only rejects on network failures; you must check response.ok', 'Only if you use await', 'Only in Node.js'], 1, 'fetch only rejects the Promise if a network error occurs or the request is blocked by CORS. It considers any HTTP response (even 404 Not Found or 500 Internal Server Error) as a successful network transaction. You must manually check response.ok or response.status to handle HTTP errors.'),
      q('Which HTTP methods are considered "idempotent" (safe to retry automatically)?', ['POST', 'GET, PUT, DELETE', 'None of them', 'All of them'], 1, 'Idempotent methods yield the same server state whether called once or multiple times. GET reads data, PUT replaces a specific resource, and DELETE removes it. POST creates new resources, so calling it twice might create duplicates; therefore, POST is not idempotent and should not be blindly retried.'),
      q('What is the standard header format for sending a JWT authentication token?', ['Token: xxx', 'Authorization: Bearer xxx', 'X-Auth: xxx', 'Set-Cookie: xxx'], 1, 'The standard HTTP authentication scheme is Bearer. The header should be formatted exactly as: Authorization: Bearer <your_token_here>. X-Auth is a non-standard custom header, and Set-Cookie is used by the server to send cookies to the client, not by the client to send tokens.'),
      q('What UI pattern should you display while an API request is in progress?', ['Nothing, keep the screen blank', 'A loading spinner or skeleton screen', 'A console.log message', 'An alert() popup'], 1, 'Users need immediate feedback that their action was registered and the system is working. Displaying a loading spinner, skeleton UI, or disabling buttons prevents double-submissions and reduces perceived latency. Blank screens cause confusion, and alerts block the main thread and ruin UX.'),
      q('What triggers a CORS "preflight" OPTIONS request in the browser?', ['Every single GET request', 'Requests with custom headers, or using PUT/DELETE methods', 'Only when using HTTPS', 'When the API returns a 404'], 1, 'Browsers automatically send an OPTIONS preflight request before "non-simple" cross-origin requests. A request is non-simple if it uses methods other than GET/HEAD/POST, or if it includes custom headers (like Authorization), or if it sends JSON payloads with specific Content-Types. The server must respond to the OPTIONS request with the correct Access-Control-Allow headers.'),
      q('What is the main advantage of GraphQL over REST?', ['It uses less battery on mobile devices', 'It allows the client to request exactly the fields it needs, preventing over-fetching', 'It is built into the browser natively', 'It doesn\'t require a server'], 1, 'GraphQL allows clients to define the exact shape of the response data in their query. This eliminates over-fetching (downloading massive objects when you only need an ID) and under-fetching (making 5 separate REST calls to build a single dashboard view), solving the N+1 request problem at the network level.'),
    ],
    ['fetch requires manual response.ok checks for HTTP errors', 'REST verbs define intent; idempotency defines retry safety', 'Always manage Loading, Success, and Error UI states', 'Implement exponential backoff for transient 5xx errors', 'Understand CORS preflights to debug blocked network requests']
  ),

  lesson('fs-13', 13, 'NPM & Packages', '📦',
    'NPM (Node Package Manager) is the world\'s largest software registry. Modern development means assembling giant towers of open-source blocks. Knowing how to install, audit, lock, and script these dependencies is a senior-level skill that keeps projects secure, reproducible, and fast.',
    [
      {
        title: '1. package.json & Semver',
        beginner: 'package.json is the ID card for your project. It lists the name, version, and the external libraries (dependencies) your code needs to run. It uses special number rules to decide when to update those libraries.',
        advanced: 'package.json is the manifest governing the dependency tree and lifecycle scripts. It uses Semantic Versioning (semver): MAJOR.MINOR.PATCH. A caret (^1.2.3) allows minor and patch updates. A tilde (~1.2.3) allows only patch updates. dependencies are required for production runtime, while devDependencies (like Vite or Vitest) are only needed for the build/test pipeline. Mixing them up bloats your production Docker images.'
      },
      {
        title: '2. Lockfiles',
        beginner: 'A lockfile (like package-lock.json) takes a snapshot of the exact versions of every single library installed. It ensures that your teammate gets the exact same code as you, preventing the "it works on my machine" bug.',
        advanced: 'The lockfile records the exact resolved dependency tree, including sub-dependencies, integrity hashes (SHA-512), and download URLs. It bypasses the semver ranges in package.json during installation to guarantee deterministic builds. You must commit lockfiles to version control. If package.json and the lockfile conflict, the lockfile wins. Running npm ci instead of npm install in CI/CD pipelines uses the lockfile strictly and fails if it is out of sync.'
      },
      {
        title: '3. Scripts & npx',
        beginner: 'Scripts are custom shortcuts you define in package.json. Instead of typing a massive command to start your server, you just type npm run dev. npx lets you run a tool once without installing it permanently.',
        advanced: 'The scripts field maps CLI commands to shell executions. NPM automatically adds node_modules/.bin to the PATH when running scripts, so you can call local binaries directly. NPM also supports lifecycle hooks like prebuild and postbuild for chaining tasks. npx executes packages from the local node_modules, or downloads them temporarily from the registry if missing, which is perfect for one-off scaffolding tools like create-vite.'
      },
      {
        title: '4. Security & Auditing',
        beginner: 'Because you are downloading code written by strangers, sometimes that code has security holes. npm audit scans your libraries and warns you if any known hackers are trying to exploit them.',
        advanced: 'npm audit queries the NPM security advisory database against your resolved dependency tree. It reports vulnerabilities by severity. npm audit fix attempts to upgrade dependencies within semver ranges to patch them. However, deep transitive dependencies might require overrides or resolutions in package.json to force a secure version. Professional teams run npm audit in their CI pipeline and block deployments if high-severity vulnerabilities are detected.'
      },
      {
        title: '5. Workspaces & Monorepos',
        beginner: 'If you have a frontend and a backend in the same project, workspaces let them share code and libraries without having to publish them to the internet first.',
        advanced: 'NPM Workspaces allow you to manage multiple packages (a monorepo) within a single top-level package.json. It automatically symlinks local packages together in node_modules, enabling instant cross-package refactoring and shared dependency hoisting. This is the foundation for enterprise-scale architectures, often combined with tools like Turborepo or Nx for task caching and orchestration.'
      },
    ],
    {
      title: 'Init + Install',
      intro: 'Execute the real NPM flow to understand the manifest.',
      steps: [
        'Create a folder and open the terminal inside it.',
        'Type npm init -y. Expect a package.json to be generated instantly with default values.',
        'Type npm install lodash. Expect a node_modules folder to appear, and lodash to be added to "dependencies".',
        'Type npm install --save-dev vitest. Expect vitest to be added to "devDependencies".',
        'Open package.json and inspect the "dependencies" and "devDependencies" sections.',
        'Notice the package-lock.json file. Understand that this file, not package.json, dictates the exact installed code.',
      ],
      goal: 'Understand the manifest, the registry, and the lockfile cold.'
    },
    [
      q('What is the primary purpose of the package-lock.json file?', ['To make the code look pretty', 'To pin the exact versions of the entire dependency tree for reproducible builds', 'To backup your code to the cloud', 'To run test scripts'], 1, 'The lockfile records the exact resolved versions, integrity hashes, and URLs for every package and sub-dependency. It ensures that every developer and the CI/CD server install the exact same byte-for-byte dependency tree, eliminating "works on my machine" environment bugs.'),
      q('What is the difference between dependencies and devDependencies?', ['There is no difference', 'dependencies are shipped to production; devDependencies are only used for local development and building', 'dependencies are typed; devDependencies are not', 'devDependencies are kept private'], 1, 'dependencies are required for the application to run in production (like React or Express). devDependencies are only needed during the development lifecycle (like Vite, ESLint, or Vitest). When deploying, you can use npm install --omit=dev to skip devDependencies and reduce deployment size.'),
      q('Which command checks your project for known security vulnerabilities in its libraries?', ['npm check', 'npm audit', 'npm scan', 'npm secure'], 1, 'npm audit analyzes your dependency tree against the NPM security advisory database and reports known vulnerabilities. It provides severity levels and suggests commands like npm audit fix to patch them by updating to safe semver ranges.'),
      q('When you type npm run build, what actually executes?', ['A random built-in NPM tool', 'The shell command defined under the "build" key in your package.json scripts', 'The Vite compiler directly', 'The Node.js core engine'], 1, 'npm run [script] looks inside the "scripts" object in your package.json and executes the shell command associated with that key. NPM also prepends node_modules/.bin to the PATH, allowing you to call locally installed CLI tools directly in the script.'),
      q('In Semantic Versioning (semver), what does the ^ symbol mean in ^1.2.3?', ['Only install version 1.2.3 exactly', 'Allow minor and patch updates, but not major updates (e.g., 1.9.9 is okay, 2.0.0 is not)', 'Always install the newest version possible', 'Install the oldest version available'], 1, 'The caret (^) allows changes that do not modify the left-most non-zero digit. For ^1.2.3, it allows any 1.x.x version >= 1.2.3. This is safe because semver dictates that minor updates (1.2 to 1.3) must be backward-compatible, while major updates (1.x to 2.x) may contain breaking changes.'),
      q('What does the command npx create-vite do?', ['Installs Vite permanently as a global dependency', 'Executes the create-vite package temporarily without requiring a global installation', 'Deletes the Vite cache', 'Starts a production server'], 1, 'npx is a package runner. It checks if create-vite is installed locally; if not, it downloads it temporarily, executes it, and discards it. This is ideal for scaffolding tools or one-off CLI commands that you don\'t want cluttering your global or local node_modules permanently.'),
    ],
    ['package.json is the manifest; lockfile is the truth', 'Commit lockfiles to guarantee reproducible CI/CD builds', 'Separate runtime deps from dev/build tools', 'Use npm audit in CI to block vulnerable deployments', 'npm run executes package.json scripts with local bin paths']
  ),

lesson('fs-14', 14, 'Tailwind CSS', '🌬️',
  'Tailwind is utility-first CSS. You stop inventing class names and start composing tiny, predictable building blocks. It eliminates CSS file management, speeds up iteration, and prevents spaghetti code by keeping styles colocated with the markup they affect.',
  [
    {
      title: '1. Utility Classes & Constraints',
      beginner: 'Tailwind gives you tiny Lego blocks. Instead of writing a custom CSS file, you snap blocks together right in your HTML. p-4 adds padding, text-lg makes text bigger. It forces you to use a set scale so your design stays consistent.',
      advanced: 'Tailwind is a constraint-based design system. Its spacing, typography, and color scales prevent arbitrary pixel values and eliminate "bikeshedding" over minor design tweaks. The JIT (Just-In-Time) compiler generates CSS on demand, meaning your production bundle only contains the exact classes you used, resulting in microscopic CSS file sizes.'
    },
    {
      title: '2. Responsive Prefixes',
      beginner: 'You can change styles based on screen size. md:p-8 means "use small padding on phones, but big padding on medium screens and up." It is mobile-first, meaning the base class is for mobile, and prefixes add changes for larger screens.',
      advanced: 'Tailwind uses a mobile-first breakpoint system based on min-width media queries. Unprefixed utilities apply to all screen sizes, while prefixed utilities (sm:, md:, lg:) apply at that breakpoint and cascade upward. You can stack prefixes (md:hover:bg-blue-500) to create highly specific, responsive, and interactive states without writing a single media query.'
    },
    {
      title: '3. State Variants',
      beginner: 'You can style things when users interact with them. hover: changes the look when the mouse is over it. focus: changes it when clicked or tabbed to. group-hover lets you change a child when the parent is hovered.',
      advanced: 'Tailwind exposes pseudo-classes (hover:, focus:, active:) and pseudo-elements (before:, after:) as variants. Advanced variants like group-hover, peer-checked, and aria-disabled allow you to style elements based on the state of their ancestors or siblings, entirely eliminating the need for JavaScript-driven class toggling for basic UI interactions.'
    },
    {
      title: '4. Configuration & Design Tokens',
      beginner: 'You can customize Tailwind to match your brand. The tailwind.config file lets you add your own colors, fonts, and spacing. This way, you use names like bg-brand instead of random hex codes everywhere.',
      advanced: 'The tailwind.config.js file is the source of truth for your design system. You extend the theme to add semantic tokens (e.g., colors: { primary: "#ff0000" }) rather than hardcoding values in components. This enables global theme changes, dark mode implementation via CSS variables, and strict design system governance across large teams.'
    },
    {
      title: '5. Arbitrary Values & JIT',
      beginner: 'Sometimes the standard blocks are not exactly what you need. You can use brackets to make custom sizes, like w-[345px]. But use this rarely, because it breaks the consistent design scale.',
      advanced: 'The JIT engine allows arbitrary values via bracket syntax (e.g., grid-template-columns-[1fr_500px_2fr]). While powerful for one-off edge cases, overusing arbitrary values degrades the maintainability of the constraint-based design system. Professionals use CSS variables mapped to Tailwind config for complex custom values instead of scattering arbitrary brackets across the codebase.'
    },
  ],
  {
    title: 'Style with Utilities',
    intro: 'Use the editor to build a responsive, interactive card without writing a CSS file.',
    steps: [
      'Inspect the provided HTML. Notice the script tag loading the Tailwind CDN (for demo purposes only; real apps use a build step).',
      'Add base utilities to the div: p-4 bg-blue-500 text-white rounded-lg. Expect the div to become a blue, padded, rounded box with white text.',
      'Add a transition utility: transition-colors duration-200. Expect the color changes to animate smoothly.',
      'Add a hover state: hover:bg-blue-700. Expect the background to darken smoothly when you move your mouse over it.',
      'Add a responsive prefix: md:p-8 md:text-xl. Resize the preview window wider. Expect the padding and text size to jump up at the medium breakpoint.',
    ],
    goal: 'A responsive, hover-able card built entirely in the class attribute.',
    code: {
      html: '<!-- Tailwind via CDN for demo -->\n<script src="https://cdn.tailwindcss.com"></script>\n<div class="p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition md:p-8 md:text-xl">\n  Hover me and resize the window\n</div>',
    },
  },
  [
    q('What does p-4 mean in Tailwind?', ['padding 4px', 'padding 1rem (16px)', 'padding 4%', 'no padding'], 1, 'In Tailwind, spacing utilities are based on a consistent scale where 1 unit equals 0.25rem. Therefore, p-4 means 1rem of padding, which is typically 16px. It is not 4px or a percentage.'),
    q('What does the md: prefix target?', ['Mobile only', 'medium screens and up', 'Print media', 'Dark mode'], 1, 'Tailwind uses a mobile-first approach. The md: prefix applies the utility at the "medium" breakpoint (usually 768px) and all larger screen sizes. It does not target only mobile, print, or dark mode.'),
    q('How do you apply a style only when an element is hovered?', [':hover', 'hover:', 'onHover', 'hoverable'], 1, 'Tailwind uses the hover: variant prefix (e.g., hover:bg-red-500). :hover is standard CSS syntax, not a Tailwind class prefix. onHover and hoverable are not valid Tailwind utilities.'),
    q('Where do you define custom colors and fonts in a Tailwind project?', ['Random JS file', 'tailwind.config.js', 'index.css only', 'Inline styles'], 1, 'The tailwind.config.js file is the central configuration file where you extend the default theme with custom design tokens like colors, fonts, and breakpoints. This ensures your design system is centralized and reusable.'),
    q('Why is Tailwind\'s production CSS file so small?', ['It deletes your HTML', 'It uses a JIT compiler to only include the classes you actually used', 'It compresses images', 'It removes JavaScript'], 1, 'Tailwind\'s Just-In-Time (JIT) engine scans your HTML/JSX files and generates CSS only for the specific utility classes you have used in your code. Unused classes are never generated, resulting in near-zero CSS bloat in production.'),
  ],
  ['Utility-first = less CSS file management', 'Mobile-first responsive prefixes', 'Variants stack for complex interactions', 'Configure design tokens once, use everywhere']
),

lesson('fs-15', 15, 'React Basics', '⚛️',
  'React is the most-used UI library on Earth because it changes how you think about building software. Component thinking plus state-driven rendering equals the modern frontend paradigm. You stop manipulating the DOM manually and start describing what the UI should look like for a given state.',
  [
    {
      title: '1. Components & Composition',
      beginner: 'Components are like custom HTML tags. They are JavaScript functions that return UI. You build big pages by snapping small components together, like Lego bricks.',
      advanced: 'React components should follow the Single Responsibility Principle. Composition is preferred over inheritance; you pass components as children or props to build complex UIs. React uses a Virtual DOM (a lightweight JS tree) to diff changes and batch minimal updates to the real DOM, optimizing rendering performance.'
    },
    {
      title: '2. JSX Syntax',
      beginner: 'JSX lets you write HTML-like code inside JavaScript. You use curly braces {} to insert JavaScript variables or math. It looks like HTML, but it is actually JavaScript in disguise.',
      advanced: 'JSX is syntactic sugar that compiles down to React.createElement() calls (or the new JSX transform). Because it is JavaScript, you must use className instead of class, htmlFor instead of for, and camelCase for event handlers (onClick). JSX automatically escapes embedded variables, providing a strong defense against Cross-Site Scripting (XSS) attacks.'
    },
    {
      title: '3. Props (Properties)',
      beginner: 'Props are how parent components pass data down to child components. They are like arguments to a function. A child can read them, but it cannot change them.',
      advanced: 'Props are strictly read-only (immutable) from the perspective of the receiving component. Prop drilling (passing props through many layers of components that do not need them) is a code smell. For deep trees, professionals use React Context, Composition patterns, or state management libraries to avoid tight coupling.'
    },
    {
      title: '4. State & Immutability',
      beginner: 'State is a component\'s memory. When state changes, React redraws the component. You must never change state directly; you must always give React a brand new copy so it knows to update.',
      advanced: 'React relies on referential equality to determine if state has changed. Mutating an object or array directly (e.g., state.count++) will not trigger a re-render because the memory reference is the same. You must always provide a new reference (e.g., setCount(c => c + 1) or setItems([...items, newItem])). React 18 automatically batches state updates for performance.'
    },
    {
      title: '5. The Virtual DOM & Reconciliation',
      beginner: 'React keeps a fake, lightweight copy of the page in memory. When data changes, it updates the fake copy, compares it to the old one, and only changes the exact parts of the real page that are different.',
      advanced: 'The Virtual DOM is an in-memory representation of the real DOM. During the render phase, React builds a new Virtual DOM tree. During the commit phase, the reconciliation algorithm (Fiber) diffs the new tree against the old one and calculates the minimal set of DOM mutations required. Understanding this prevents performance bugs caused by unnecessary re-renders.'
    },
  ],
  {
    title: 'A Toggle Component',
    intro: 'Use the editor to build state-driven UI in under 10 lines of code.',
    steps: [
      'Inspect the setup: React, ReactDOM, and Babel are loaded via CDN to allow JSX in the browser.',
      'Create a function component named App that returns a button.',
      'Inside App, use const [on, setOn] = useState(false); to create a boolean state variable.',
      'Add an onClick handler to the button: onClick={() => setOn(!on)}.',
      'Change the button text using a ternary operator: {on ? "ON" : "OFF"}.',
      'Click the button in the preview. Expect the text to toggle and the component to re-render instantly.',
    ],
    goal: 'State-driven UI. Understand that UI is a pure function of state.',
    code: {
      html: '<div id="root"></div>\n<script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>\n<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>\n<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>\n<script type="text/babel">\nconst { useState } = React;\nfunction App() {\n  const [on, setOn] = useState(false);\n  return <button onClick={() => setOn(!on)}>{on ? "ON" : "OFF"}</button>;\n}\nReactDOM.createRoot(document.getElementById("root")).render(<App />);\n</script>',
    },
  },
  [
    q('What is the correct attribute name for CSS classes in JSX?', ['class', 'className', 'classname', 'class-name'], 1, 'Because JSX compiles to JavaScript, and "class" is a reserved keyword in JavaScript (used for ES6 classes), React uses "className" to avoid syntax conflicts. "classname" and "class-name" are invalid.'),
    q('Why must you never mutate state directly in React?', ['It breaks the internet', 'React relies on new memory references to detect changes and trigger re-renders', 'It is illegal', 'It makes the code slower'], 1, 'React uses referential equality (===) to check if state has changed. If you mutate an existing object or array, the memory reference stays the same, and React will not know it needs to re-render the component. You must always pass a new reference.'),
    q('What are Props in React?', ['Mutable local variables', 'Read-only inputs passed from parent to child', 'Functions only', 'Database connections'], 1, 'Props (properties) are the mechanism for passing data down the component tree. They are strictly read-only from the perspective of the child component to ensure predictable, one-way data flow.'),
    q('What does "Composition" mean in React?', ['Using class inheritance', 'Building complex UIs by nesting smaller, reusable components', 'Writing everything in one file', 'Using CSS-in-JS'], 1, 'React favors composition over inheritance. You build complex UIs by nesting components and passing them as children or props, rather than creating deep, fragile class inheritance hierarchies.'),
    q('What happens when you call a state setter function like setCount(5)?', ['The variable updates instantly and the page freezes', 'React schedules a re-render of the component with the new state value', 'It updates the global database', 'It throws an error'], 1, 'Calling a state setter does not mutate the variable immediately. Instead, it enqueues a state update and schedules a re-render of the component. During the next render, the component will receive the new state value.'),
  ],
  ['Components are pure functions of state and props', 'JSX is JavaScript, not HTML', 'Props are read-only; data flows down', 'Always provide new references when updating state']
),

lesson('fs-16', 16, 'React Hooks', '🪝',
  'Hooks unlocked the full power of functional components, making class components obsolete. useState, useEffect, useMemo, and useCallback are the core primitives. Master these four, understand their lifecycle, and you can handle 90% of real-world React scenarios.',
  [
    {
      title: '1. useState & State Batching',
      beginner: 'useState gives your component a memory. It returns the current value and a function to change it. React groups multiple changes together so it only redraws the screen once.',
      advanced: 'useState accepts a lazy initializer function (useState(() => expensiveCalc())) to avoid recalculating on every render. State updates are batched in React 18. When updating state based on the previous state, always use the functional updater form (setCount(c => c + 1)) to avoid stale closure bugs.'
    },
    {
      title: '2. useEffect & Side Effects',
      beginner: 'useEffect lets your component talk to the outside world, like fetching data or setting up a timer. It runs after the screen is drawn. You must clean up timers when the component goes away.',
      advanced: 'useEffect is for synchronizing external systems (APIs, DOM, subscriptions) with React state. The dependency array dictates when the effect re-runs. An empty array [] means "run once on mount". Omitting the array means "run after every render". You must return a cleanup function to prevent memory leaks when dependencies change or the component unmounts.'
    },
    {
      title: '3. useMemo & useCallback',
      beginner: 'These hooks tell React to "remember" a calculation or a function so it does not have to redo it every time the screen redraws. Only use them if your app is actually slow.',
      advanced: 'useMemo memoizes a computed value, while useCallback memoizes a function reference. They are used to preserve referential equality across renders, preventing unnecessary re-renders of child components wrapped in React.memo. However, premature optimization is a real trap; only use them when the React Profiler identifies a specific performance bottleneck.'
    },
    {
      title: '4. Custom Hooks & Rules of Hooks',
      beginner: 'You can combine built-in hooks into your own custom hooks to share logic between components. They must always start with the word "use".',
      advanced: 'Custom hooks extract reusable stateful logic (e.g., useFetch, useDebounce, useLocalStorage) without duplicating component UI. The Rules of Hooks dictate that hooks must only be called at the top level of a component or custom hook, never inside loops, conditions, or nested functions. This is because React tracks hooks internally via a linked list indexed by call order.'
    },
    {
      title: '5. useRef & The DOM',
      beginner: 'useRef creates a box that holds a value. Changing the value does not cause a redraw. It is mostly used to grab a direct reference to an HTML element, like an input box.',
      advanced: 'useRef returns a mutable object ({ current: initialValue }) that persists across the entire lifecycle of the component. It is used to access underlying DOM nodes (e.g., focusing an input) or to store mutable state that should not trigger a re-render when changed, such as timer IDs or previous prop values.'
    },
  ],
  {
    title: 'Counter with Effect',
    intro: 'Use the editor to understand the dependency array and side effects.',
    steps: [
      'Create a state variable: const [n, setN] = useState(0);.',
      'Add an effect: useEffect(() => { console.log("n is", n); }, [n]);.',
      'Notice the [n] dependency array. Expect the effect to run only when "n" changes.',
      'Change the dependency array to [] and reload. Expect the log to run only once on mount.',
      'Remove the array entirely. Expect the log to run after every single render (usually a bug).',
      'Add a cleanup function: return () => console.log("cleanup"); inside the effect to see when it runs.',
    ],
    goal: 'You understand the dependency array and the effect lifecycle.',
    code: {
      html: '<div id="root"></div>\n<script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>\n<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>\n<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>\n<script type="text/babel">\nconst { useState, useEffect } = React;\nfunction App() {\n  const [n, setN] = useState(0);\n  useEffect(() => { console.log("n is", n); }, [n]);\n  return <button onClick={() => setN(n+1)}>Count: {n}</button>;\n}\nReactDOM.createRoot(document.getElementById("root")).render(<App />);\n</script>',
    },
  },
  [
    q('What does an empty dependency array [] mean in useEffect?', ['Run after every render', 'Run exactly once when the component mounts', 'Never run', 'Run only when unmounting'], 1, 'An empty dependency array tells React that the effect does not depend on any props or state, so it only needs to run once after the initial render (mount). It will not run again until the component unmounts.'),
    q('Why use the functional updater form: setCount(c => c + 1)?', ['It is shorter', 'It prevents stale closure bugs when updating state based on the previous state', 'It makes the code run faster', 'It is required by TypeScript'], 1, 'When state updates are batched or asynchronous, the "count" variable in the closure might be stale. The functional updater guarantees you are calculating the new state based on the most current, accurate previous state value provided by React.'),
    q('What is the strict naming rule for Custom Hooks?', ['They must be classes', 'They must start with the word "use"', 'They must return JSX', 'They must be async'], 1, 'Custom hooks must start with "use" (e.g., useAuth, useFetch). This is not just a convention; the React linter and compiler rely on this naming prefix to enforce the Rules of Hooks and ensure they are only called in valid contexts.'),
    q('When should you use useMemo or useCallback?', ['On every single variable and function', 'Only when the React Profiler shows a specific performance bottleneck', 'Never, they are deprecated', 'Only inside useEffect'], 1, 'Memoization has a memory and CPU cost. Premature optimization clutters code. You should only use useMemo/useCallback when you have identified a measurable performance issue (like a child component re-rendering unnecessarily) via the React DevTools Profiler.'),
    q('What happens if you put a hook inside an if-statement?', ['It works perfectly', 'It breaks the Rules of Hooks and causes state corruption', 'It runs twice', 'It throws a syntax error'], 1, 'Hooks must be called at the top level in the exact same order on every render. React tracks hooks via an internal array/linked list. Putting a hook inside a condition changes the call order, causing React to assign the wrong state to the wrong hook.'),
  ],
  ['useState + useEffect cover 90% of cases', 'Always respect the dependency array', 'Use functional updaters for derived state', 'Extract reusable logic into custom hooks']
),

lesson('fs-17', 17, 'Context & Global State', '🔄',
  'Prop drilling 5 levels deep is misery. Context gives any component access to shared state without the relay race. But Context is not a silver bullet; knowing when to use it, when to split it, and when to reach for external stores like Zustand is the mark of a senior engineer.',
  [
    {
      title: '1. React Context API',
      beginner: 'Context is like a radio broadcast. A parent component sends out data, and any child component, no matter how deep, can tune in and grab it without passing it through every room.',
      advanced: 'Context provides dependency injection via createContext, Provider, and useContext. However, any change to the context value triggers a re-render for all consuming components, regardless of whether they use the specific part of the state that changed. This makes it unsuitable for high-frequency state updates.'
    },
    {
      title: '2. Context Splitting',
      beginner: 'If you put everything in one giant Context, the whole app redraws when one tiny thing changes. Split it into smaller Contexts, like one for Theme and one for User.',
      advanced: 'To prevent unnecessary re-renders, professionals split context by update frequency and domain. A ThemeContext changes rarely, while a UserContext might change often. Separating the "state" value from the "dispatch" function into two distinct contexts is a common pattern to prevent components that only dispatch actions from re-rendering when state changes.'
    },
    {
      title: '3. Server State vs Client State',
      beginner: 'Not all data is the same. Data from a server (like a list of users) is different from UI data (like "is this modal open?"). Keep them separate.',
      advanced: 'Server state (asynchronous data from APIs) should not live in Redux or Context. It belongs in dedicated caching libraries like TanStack Query (React Query) or SWR, which handle deduplication, background refetching, and stale-while-revalidate logic. Client state (UI toggles, form inputs) belongs in local component state or lightweight stores.'
    },
    {
      title: '4. Zustand & External Stores',
      beginner: 'Zustand is a tiny tool for global state. It is much simpler than Redux. You just create a store and grab exactly the piece of data you need.',
      advanced: 'Zustand is a lightweight (4kb) state management library that uses proxy-based reactivity and selector-based subscriptions. Unlike Context, Zustand only re-renders the exact components whose selected slice of state has changed, completely bypassing React\'s render cycle for unrelated updates.'
    },
    {
      title: '5. Redux Toolkit (RTK)',
      beginner: 'Redux is the heavy-duty option. It is very strict and requires more setup, but it makes complex data flows very predictable for huge teams.',
      advanced: 'Redux enforces a single source of truth, unidirectional data flow, and immutable updates via actions and reducers. Redux Toolkit (RTK) modernizes this by using Immer under the hood, allowing you to write "mutating" logic that is safely converted to immutable updates. It is overkill for most apps but essential for large-scale enterprise applications with complex state transitions.'
    },
  ],
  {
    title: 'Theme Context',
    intro: 'In the editor, build a context to share a theme without prop drilling.',
    steps: [
      'Create a context: const ThemeContext = createContext("light");.',
      'Wrap your root App component in <ThemeContext.Provider value="dark">.',
      'Deep inside the tree, create a child component.',
      'Inside the child, call const theme = useContext(ThemeContext);.',
      'Render the theme variable. Expect it to read "dark" directly, bypassing all intermediate components.',
      'Change the provider value to "light" and observe the child update instantly.',
    ],
    goal: 'Shared state without prop drilling. Understand the Provider/Consumer model.'
  },
  [
    q('When does a Context Provider re-render its consumers?', ['Always, on every tick', 'Only when the "value" prop passed to the Provider changes', 'Never', 'Only when the user clicks'], 1, 'React re-renders all components consuming a Context whenever the "value" reference passed to the Provider changes. This is why passing a new object literal on every render without memoization causes massive performance issues.'),
    q('Where should asynchronous server data (like API responses) ideally live?', ['Redux', 'TanStack Query (React Query)', 'useState in the root component', 'Context'], 1, 'Server state has unique requirements like caching, deduplication, background refetching, and stale-while-revalidate logic. TanStack Query is purpose-built for this. Redux and Context are designed for synchronous client-side state and lack these network-specific optimizations.'),
    q('What is the primary performance advantage of Zustand over React Context?', ['It has a bigger API', 'It uses selector-based subscriptions to only re-render components when their specific slice of state changes', 'It only works with TypeScript', 'It is a newer language'], 1, 'React Context re-renders all consumers when the value changes. Zustand allows components to subscribe to specific selectors (e.g., state => state.user). If a different part of the store updates, the component does not re-render, preventing unnecessary render cycles.'),
    q('What is "Prop Drilling"?', ['A best practice for passing data', 'A code smell where props are passed through many intermediate components that do not need them', 'A required React pattern', 'A way to make apps faster'], 1, 'Prop drilling occurs when you pass data through multiple layers of components just to reach a deeply nested child. It creates tight coupling and makes refactoring difficult. Context or state managers solve this by providing direct access to the data.'),
    q('Why split a massive Context into smaller ones (e.g., ThemeContext and AuthContext)?', ['To make the code look longer', 'To prevent components from re-rendering when unrelated context values change', 'Because React limits you to one Context', 'To improve SEO'], 1, 'If a single Context holds both Theme and User data, a component that only needs the Theme will still re-render when the User data changes. Splitting them isolates the re-render scope, improving performance.'),
  ],
  ['Context fixes prop drilling but causes re-render cascades', 'Split contexts by update frequency', 'Server state belongs in TanStack Query, not Redux', 'Pick the smallest, simplest store that solves the problem']
),

lesson('fs-18', 18, 'Testing Basics', '🧪',
  'Untested code rots. Tests are how you sleep at night, refactor without fear, and ship faster forever. Start with one test, understand the pyramid, and treat testing as a core part of the development loop, not an afterthought.',
  [
    {
      title: '1. The Test Pyramid',
      beginner: 'Tests come in three sizes. Unit tests are tiny and fast. Integration tests check if pieces work together. End-to-End (E2E) tests simulate a real user clicking through the whole app. You want lots of small tests and a few big ones.',
      advanced: 'The test pyramid balances execution speed, cost, and confidence. Unit tests (Vitest/Jest) are fast and cheap but lack real-world context. Integration tests verify module boundaries. E2E tests (Playwright/Cypress) are slow, brittle, and expensive, but catch real user-flow bugs. The modern "Testing Trophy" emphasizes heavy integration testing over excessive unit testing of implementation details.'
    },
    {
      title: '2. Vitest & Jest',
      beginner: 'These are the tools that actually run your tests. You use words like describe, it, and expect to write sentences that prove your code works.',
      advanced: 'Vitest is a Vite-native testing framework that shares the exact same configuration and transform pipeline as your dev server, making it blazing fast. Jest is the older Webpack-era standard. Both use jsdom or happy-dom to simulate a browser environment for component tests, or a pure Node environment for logic tests.'
    },
    {
      title: '3. React Testing Library (RTL)',
      beginner: 'RTL forces you to test your app like a real user. Instead of looking for hidden CSS classes, you look for buttons by their text or role, like "Submit".',
      advanced: 'RTL enforces testing behavior over implementation details. By querying the DOM via accessibility roles (getByRole), text (getByText), or labels (getByLabelText), your tests become resilient to refactoring. If you change the internal state logic but the UI output remains the same, the test still passes.'
    },
    {
      title: '4. Playwright & Cypress (E2E)',
      beginner: 'These tools open a real web browser, click buttons, fill out forms, and check if the right page loads. They test the whole system from front to back.',
      advanced: 'E2E frameworks run real browser instances (Chromium, Firefox, WebKit) and intercept network requests to mock API responses. They are used strictly for critical user journeys (signup, checkout, payment) because they are slow and prone to flakiness. Playwright is currently the industry standard due to its auto-waiting and multi-tab capabilities.'
    },
    {
      title: '5. Mocking & Spies',
      beginner: 'Sometimes your code talks to the outside world, like an API. In tests, you fake those outside calls so your test runs fast and does not depend on the internet.',
      advanced: 'Mocking replaces real implementations with controlled test doubles. vi.mock() or jest.mock() intercepts module imports. Spies (vi.spyOn) observe function calls without necessarily changing their behavior. Over-mocking is a trap; if you mock everything, you are only testing your mocks, not your actual integration.'
    },
  ],
  {
    title: 'Your First Test',
    intro: 'Concept exercise. Set up a basic unit test.',
    steps: [
      'In a real project, run: npm install -D vitest.',
      'Create a logic file: sum.ts → export const sum = (a, b) => a + b.',
      'Create a test file: sum.test.ts.',
      'Write the test: import { expect, test } from "vitest"; test("adds 1 + 2 to equal 3", () => { expect(sum(1, 2)).toBe(3); });',
      'Run the test via CLI: npx vitest. Expect a green checkmark and a success message.',
      'Change the expectation to toBe(4) and run it again. Expect a red failure and a diff showing the mismatch.',
    ],
    goal: 'Green checkmark. Understand the Arrange-Act-Assert pattern.'
  },
  [
    q('What forms the base (largest portion) of the Test Pyramid?', ['E2E tests', 'Unit tests', 'Integration tests', 'Smoke tests'], 1, 'The base of the pyramid consists of Unit tests. They are the most numerous because they are extremely fast, cheap to write, and easy to isolate. E2E tests form the tiny tip of the pyramid.'),
    q('What does React Testing Library (RTL) recommend querying by?', ['CSS class names', 'Accessibility roles and visible text', 'Element IDs', 'HTML tag names'], 1, 'RTL enforces testing behavior from the user\'s perspective. Users do not see CSS classes or internal state; they see text and interactive roles (like "button" or "heading"). Querying by role/text ensures tests survive UI refactors.'),
    q('What is Vitest built on?', ['Webpack', 'Vite', 'Rollup', 'esbuild only'], 1, 'Vitest is built natively on Vite. It reuses Vite\'s config, transformers, and resolve logic, meaning your test environment perfectly matches your development environment without needing separate Webpack/Babel configurations.'),
    q('Where should End-to-End (E2E) tests be focused?', ['Every single math function', 'Critical user paths (login, checkout, core flows)', 'Static pages only', 'Individual UI components'], 1, 'E2E tests are slow, expensive, and brittle. They should be reserved exclusively for critical user journeys that directly impact revenue or core functionality. Testing every component or function with E2E will destroy CI pipeline speed.'),
    q('Why do we "mock" API calls in unit tests?', ['To make the API faster', 'To isolate the test from network failures and external dependencies', 'To hack the server', 'Because APIs are illegal in tests'], 1, 'Unit tests must be deterministic and fast. Relying on a real external API introduces network latency, rate limits, and flaky data. Mocking replaces the network call with a predictable, instant response so you can test how your code handles the data.'),
  ],
  ['Pyramid > inverted pyramid', 'Test behavior, not implementation details', 'RTL = role-based queries', 'E2E sparingly for critical paths']
),

lesson('fs-19', 19, 'Security Essentials', '🛡️',
  'Most breaches are not sophisticated hacks; they are stupid mistakes — exposed keys, unescaped input, missing auth. Knowing the OWASP top 5 and the principle of least privilege saves your company millions and saves your career.',
  [
    {
      title: '1. Cross-Site Scripting (XSS)',
      beginner: 'XSS happens when a hacker tricks your site into running their malicious code. Never trust text typed by users. Always let the framework clean it before putting it on the screen.',
      advanced: 'XSS occurs when untrusted data is injected into the DOM and executed as code. React and Vue auto-escape JSX/template bindings by default. If you must render raw HTML, use DOMPurify to sanitize it. Implement a strict Content Security Policy (CSP) header to block inline scripts and restrict script sources to trusted domains.'
    },
    {
      title: '2. Secrets Management',
      beginner: 'Never put passwords or API keys in your code. If you push them to GitHub, hackers will find them in seconds. Use hidden environment files instead.',
      advanced: 'Secrets must never touch version control. Use .env files (strictly .gitignored) for local development, and inject environment variables via your CI/CD pipeline or a secrets manager (AWS Secrets Manager, HashiCorp Vault) in production. Use tools like truffleHog or GitGuardian in pre-commit hooks to prevent accidental secret commits.'
    },
    {
      title: '3. CORS & CSRF',
      beginner: 'CORS stops websites from stealing data from APIs they are not allowed to talk to. CSRF stops hackers from tricking your browser into doing things you did not click on.',
      advanced: 'CORS (Cross-Origin Resource Sharing) is a browser-enforced security mechanism, not a server-side one. It uses preflight OPTIONS requests to check permissions. CSRF (Cross-Site Request Forgery) is mitigated by setting the SameSite=Strict or Lax attribute on cookies, and using anti-forgery tokens (double-submit cookie pattern) for state-changing operations.'
    },
    {
      title: '4. Auth & Session Security',
      beginner: 'Passwords must be scrambled (hashed) before saving. When users log in, give them a secure ticket (token) that lives in a locked box in the browser, not in plain text.',
      advanced: 'Passwords must be hashed with bcrypt, Argon2, or scrypt. JWTs should never be stored in localStorage (vulnerable to XSS). They belong in httpOnly, Secure, SameSite cookies. Implement refresh-token rotation with short-lived access tokens. Always check tokens against a blocklist or use opaque session tokens stored server-side for immediate revocation capability.'
    },
    {
      title: '5. Dependency Auditing',
      beginner: 'Your code uses libraries written by strangers. Sometimes those libraries have holes. Regularly scan them to find and fix the weak spots.',
      advanced: 'Supply chain attacks are rising. Run npm audit or use Snyk/Dependabot in your CI pipeline to detect known CVEs (Common Vulnerabilities and Exposures) in your dependency tree. Pin exact versions in production via lockfiles to prevent malicious minor/patch updates from slipping in automatically.'
    },
  ],
  {
    title: 'Security Audit',
    intro: 'Audit your own codebase for common vulnerabilities.',
    steps: [
      'Open your terminal and grep your repo for hardcoded secrets: grep -rnw . -e "sk_" -e "AKIA" -e "password =".',
      'Check your .gitignore file. Expect .env, .env.local, and node_modules to be listed.',
      'Run npm audit in your project root. Expect a report of known vulnerabilities in your dependency tree.',
      'Search your codebase for dangerouslySetInnerHTML. If found, verify the input is sanitized with DOMPurify.',
      'Check your API cookies. Expect them to have httpOnly, Secure, and SameSite attributes set.',
    ],
    goal: 'No secrets in source. No XSS holes. Secure cookie configurations.'
  },
  [
    q('How does React protect against XSS by default?', ['It blocks all internet connections', 'It auto-escapes variables embedded in JSX', 'It sanitizes everything on the server', 'It uses a CSP header automatically'], 1, 'React automatically escapes any values embedded in JSX before rendering them to the DOM. This converts dangerous characters (like < and >) into harmless strings, preventing injected scripts from executing.'),
    q('Where should API keys and database passwords be stored?', ['Hardcoded in the source code', 'In .env files that are strictly .gitignored', 'In package.json', 'In HTML comments'], 1, 'Secrets must never be committed to version control. They belong in .env files (which are ignored by Git) locally, and are injected as environment variables by the hosting platform or secrets manager in production.'),
    q('Where is the safest place to store a JWT (JSON Web Token) in the browser?', ['localStorage', 'httpOnly, Secure cookies', 'sessionStorage', 'URL parameters'], 1, 'localStorage and sessionStorage are accessible via JavaScript, making them vulnerable to XSS theft. URL parameters leak in server logs and browser history. httpOnly cookies cannot be read by JavaScript, protecting the token from XSS attacks.'),
    q('What does npm audit check for?', ['CSS styling errors', 'Known security vulnerabilities (CVEs) in your installed packages', 'Code execution speed', 'Missing unit tests'], 1, 'npm audit queries the NPM security advisory database against your resolved dependency tree to identify packages with known vulnerabilities. It provides severity levels and suggests commands to patch them.'),
    q('What is the primary defense against CSRF (Cross-Site Request Forgery) attacks?', ['Using HTTPS', 'Setting the SameSite attribute on cookies and using anti-forgery tokens', 'Minifying JavaScript', 'Using strong passwords'], 1, 'CSRF attacks trick a user\'s browser into sending authenticated requests. Setting SameSite=Lax or Strict on cookies prevents the browser from sending them on cross-origin requests. Anti-forgery tokens ensure the request originated from your actual UI.'),
  ],
  ['Escape user input / rely on framework auto-escaping', 'Never commit secrets to version control', 'Store JWTs in httpOnly cookies, never localStorage', 'Audit dependencies regularly in CI/CD']
),

lesson('fs-20', 20, 'Deployment & CI/CD', '🚀',
  'Code that does not ship does not matter. Modern deployment is git-push-and-done. Vercel, Netlify, and Cloudflare have turned complex infrastructure into a single click. Knowing the pipeline turns a coder into a shipper.',
  [
    {
      title: '1. Static vs Dynamic Hosting',
      beginner: 'Static sites are pre-built HTML, CSS, and JS files. They are incredibly fast and cheap to host. Dynamic sites need a server running code every time someone visits. Use static whenever possible.',
      advanced: 'Static Site Generation (SSG) deploys immutable assets to a global CDN edge network, resulting in near-zero Time to First Byte (TTFB). Dynamic rendering (SSR) requires serverless functions or VPS instances. Modern platforms use Edge Runtimes to execute dynamic logic physically closer to the user, blurring the line between static and dynamic performance.'
    },
    {
      title: '2. Modern Platforms (PaaS)',
      beginner: 'Platforms like Vercel and Netlify connect to your GitHub. Every time you save code, they automatically build it and put it on the internet. They handle all the hard server stuff for you.',
      advanced: 'Platforms like Vercel, Netlify, and Cloudflare Pages abstract away infrastructure. They provide automated build pipelines, global CDN distribution, automatic SSL provisioning, and serverless function deployment. Vercel is highly optimized for Next.js, while Cloudflare Pages offers unmatched edge compute pricing and Durable Objects for stateful edge logic.'
    },
    {
      title: '3. CI/CD & Preview Environments',
      beginner: 'CI/CD is a robot that tests your code and puts it online. Preview environments create a secret, temporary link for every code change, so your team can test it before it goes live to the public.',
      advanced: 'Continuous Integration (CI) runs linters, type-checkers, and tests on every commit via GitHub Actions. Continuous Deployment (CD) automatically promotes merged code to production. Preview deployments spin up ephemeral, fully functional environments for every Pull Request, enabling high-velocity code review and stakeholder approval without touching the main branch.'
    },
    {
      title: '4. Monitoring & Observability',
      beginner: 'Once your app is live, you need to know if it breaks. Monitoring tools catch errors and tell you exactly which line of code failed, before your users complain.',
      advanced: 'Observability consists of logs, metrics, and traces. Tools like Sentry capture client-side and server-side exceptions with full stack traces and breadcrumbs. APM (Application Performance Monitoring) tools track API latency and database query times. Setting up alerting thresholds is critical; silent errors destroy user trust faster than anything else.'
    },
    {
      title: '5. Environment Variables & Branch Protection',
      beginner: 'Your live site needs different settings than your test site. Environment variables keep passwords and API keys safe. Branch protection stops bad code from merging into the main site.',
      advanced: 'Environment variables (.env) separate configuration from code (Twelve-Factor App methodology). Production, staging, and preview environments must have isolated secrets. Branch protection rules in GitHub require passing CI checks and peer reviews before merging to main, ensuring the production deployment pipeline is never triggered by unverified code.'
    },
  ],
  {
    title: 'Deploy to Vercel',
    intro: 'Ship your code to the global edge network in 60 seconds.',
    steps: [
      'Push your local repository to GitHub.',
      'Go to vercel.com and click "Add New Project".',
      'Import your GitHub repository. Vercel will auto-detect the framework (Vite, Next.js, etc.).',
      'Click Deploy. Expect Vercel to spin up a build container, run your build script, and distribute the assets to the CDN.',
      'Copy the live URL and open it in an incognito window. Expect a blazing-fast, SSL-secured site.',
      'Make a small code change, commit, and push. Expect Vercel to automatically trigger a new deployment and update the live URL.',
    ],
    goal: 'Live URL anyone can visit. Automated CI/CD pipeline established.'
  },
  [
    q('What is the cheapest, fastest, and most secure way to deploy a frontend app?', ['Renting a VPS and configuring Nginx', 'Static assets deployed to a global CDN', 'Bare metal servers', 'FTP uploads'], 1, 'Deploying static assets to a CDN (via Vercel, Netlify, or Cloudflare) is practically free, infinitely scalable, and highly secure because there is no backend server to hack. It offers the lowest latency globally.'),
    q('What is the primary benefit of Preview URLs in CI/CD?', ['They are useless', 'They boost review velocity by providing a live, isolated environment for every Pull Request', 'They are only available on paid plans', 'They are insecure'], 1, 'Preview URLs spin up an ephemeral deployment for every branch/PR. This allows reviewers, designers, and stakeholders to interact with the exact code changes in a real browser before approving the merge to production.'),
    q('Which tool is the industry standard for frontend error monitoring?', ['Spotify', 'Sentry', 'Slack', 'Notion'], 1, 'Sentry is the industry standard for application monitoring. It captures unhandled exceptions, provides source-mapped stack traces, records user breadcrumbs leading up to the crash, and alerts developers to regressions in real-time.'),
    q('What typically triggers an auto-deploy in a modern CI/CD pipeline?', ['Manual FTP upload', 'A Git push to the main branch or a merged Pull Request', 'Sending an email', 'A daily cron job'], 1, 'Modern GitOps workflows use webhooks. When code is pushed to a tracked branch (like main) or a PR is merged, the hosting platform automatically triggers the build and deployment pipeline.'),
    q('Why use Edge Runtimes instead of traditional serverless functions?', ['They are cheaper to build', 'They execute code physically closer to the user, eliminating cold starts and reducing latency', 'They don\'t require code', 'They only work for images'], 1, 'Edge runtimes (like Cloudflare Workers or Vercel Edge Functions) deploy your code to thousands of locations globally. When a user requests data, the code runs at the nearest edge node, resulting in sub-50ms response times and zero cold starts compared to centralized serverless regions.'),
  ],
  ['Static on a CDN = cheap, fast, safe', 'Vercel/Netlify/Cloudflare abstract infrastructure', 'CI/CD = push to deploy with preview environments', 'Monitor errors before users report them']
),

lesson('fs-21', 21, 'TypeScript Fundamentals', '🟦',
  'TypeScript is JavaScript with a safety net. It catches bugs before runtime, enables fearless refactoring, and provides elite autocompletion. Every serious frontend team uses it. Being fluent in its type system is non-negotiable for modern development.',
  [
    {
      title: '1. Type Annotations & Inference',
      beginner: 'TypeScript adds labels to your variables so the computer knows what kind of data they hold. But it is smart; if you say let x = 5, it already knows it is a number. You only need labels when it cannot guess.',
      advanced: 'TypeScript uses a powerful type inference engine to reduce boilerplate. You should only annotate function parameters, return types, and complex object shapes. Over-annotating local variables clutters code. Understanding the boundary of inference (e.g., it cannot infer generic types from empty arrays) is key to clean TS.'
    },
    {
      title: '2. Interfaces, Types & Unions',
      beginner: 'Interfaces describe the shape of an object, like a blueprint. Types can do that too, but they can also describe choices, like "this variable can be a string OR a number".',
      advanced: 'Interfaces are extensible via declaration merging and are best for defining object contracts and public APIs. Types are more flexible, supporting unions (string | number), intersections (A & B), and mapped types. Discriminated unions (using a literal type property like status: "success" | "error") are the safest way to handle complex state machines.'
    },
    {
      title: '3. Generics',
      beginner: 'Generics let you write functions that work with any type of data, while still remembering exactly what type was passed in. It is like a function with a blank space for a type.',
      advanced: 'Generics (<T>) enable reusable, type-safe abstractions. They are the foundation of utility types like Partial<T>, Pick<T, K>, and Record<K, V>. Advanced generics involve constraints (<T extends BaseType>), conditional types (T extends U ? X : Y), and infer keywords to extract deep type information dynamically.'
    },
    {
      title: '4. Strict Mode & Soundness',
      beginner: 'Strict mode turns on all the hardest safety checks. It yells at you if you forget to check for null or undefined. It is annoying at first, but it stops your app from crashing later.',
      advanced: 'Enabling strict: true in tsconfig.json activates strictNullChecks, noImplicitAny, and strictFunctionTypes. This enforces type soundness, forcing you to explicitly handle null/undefined states and preventing implicit any leaks. It eliminates roughly 80% of common JavaScript runtime errors at compile time.'
    },
    {
      title: '5. any vs unknown',
      beginner: 'any turns off the safety checks completely. unknown is safer; it says "I do not know what this is yet," and forces you to check what it is before you use it.',
      advanced: 'any opts out of the type system entirely, destroying all safety guarantees and propagating silently through your code. unknown is the type-safe counterpart; it accepts any value but forces you to perform type narrowing (via typeof, instanceof, or type guards) before interacting with it. Never use any in a professional codebase.'
    },
  ],
  {
    title: 'Type a Function',
    intro: 'Annotate this code to see the safety net in action.',
    steps: [
      'Create an untyped function: const add = (a, b) => a + b.',
      'Add type annotations: const add = (a: number, b: number): number => a + b.',
      'Define an interface: interface User { name: string; age: number; }.',
      'Write a typed function: function greet(u: User): string { return `Hello ${u.name}`; }.',
      'Try calling greet({ name: "Sage" }). Expect a red squiggly line and a TS error complaining about the missing "age" property.',
      'Add age: 21 to the object. Expect the error to vanish and autocompletion to work perfectly.',
    ],
    goal: 'You can write typed JS without fear. Understand structural typing.'
  },
  [
    q('Why use TypeScript over plain JavaScript?', ['It makes the final code smaller', 'It catches type errors at build time, preventing runtime crashes', 'It makes the code run faster in the browser', 'It requires less typing'], 1, 'TypeScript is a superset of JavaScript that adds static typing. It compiles down to standard JS, meaning it does not affect runtime speed or bundle size directly. Its primary value is catching logical errors during development and enabling elite IDE autocompletion.'),
    q('What does "Type Inference" mean?', ['TypeScript guesses your code\'s intent', 'TypeScript automatically derives types based on assigned values, allowing you to skip explicit annotations', 'Errors are silenced', 'None of the above'], 1, 'Type inference allows the compiler to automatically determine the type of a variable based on its initialization (e.g., let x = "hello" is inferred as string). This reduces boilerplate while maintaining strict type safety.'),
    q('What is the difference between any and unknown?', ['They are exactly the same', 'any disables type checking; unknown requires type narrowing before use', 'any is for numbers, unknown is for strings', 'unknown is deprecated'], 1, 'any completely opts out of the type system, allowing any operation without errors. unknown is type-safe; it accepts any value but forces you to verify (narrow) the type before you can call methods or access properties on it.'),
    q('What do Generics (<T>) provide?', ['Reusable, type-safe code that adapts to the types passed into it', 'Faster runtime execution', 'Smaller bundle sizes', 'Less syntax'], 0, 'Generics allow you to write functions, interfaces, or classes that work with a variety of types while still retaining the specific type information. They are essential for building reusable utility types and library code.'),
    q('What does TypeScript use to determine if two types are compatible?', ['Nominal typing (matching exact names)', 'Structural typing (matching the shape and properties of the object)', 'Memory addresses', 'File names'], 1, 'TypeScript uses structural typing (often called "duck typing"). If an object has the required properties and methods defined by the interface, it is considered compatible, regardless of its class name or explicit declaration.'),
  ],
  ['Types catch bugs at compile time', 'Rely on inference; annotate only boundaries', 'Use strict mode to enforce soundness', 'Generics enable reusable, type-safe abstractions']
),
  
lesson('fs-22', 22, 'React Router & Navigation', '🧭',
  'Modern Single Page Applications (SPAs) route on the client. React Router is the industry standard. Learning its patterns means you can build clean URLs, fast client-side navigation, and bookmarkable state without full page reloads.',
  [
    { title: '1. Routes & Links', beginner: 'Routes tell the app which page to show based on the URL. Links let users move between pages without reloading the whole site. Always use the special Link component instead of standard HTML links.', advanced: 'React Router intercepts click events on <Link> and <NavLink> to prevent default browser reloads, using the History API to update the URL and swap components. NavLink provides active state styling out of the box. useNavigate is used for programmatic navigation after side effects like form submissions.' },
    { title: '2. Nested Routes & Layouts', beginner: 'You can put routes inside other routes. This is great for sidebars or headers that stay on the screen while the main content changes. The Outlet component acts as a placeholder for the child page.', advanced: 'Layout routes share UI across multiple child paths without re-rendering the shared elements. Index routes render automatically when the parent path is matched exactly but no child path is active. This architecture mirrors the visual hierarchy of the UI and prevents unnecessary unmounting of heavy layout components.' },
    { title: '3. Params & Search Strings', beginner: 'Params grab specific IDs from the URL, like a user ID. Search strings grab filters, like sorting or searching. Treat the URL as the ultimate source of truth for what the user is looking at.', advanced: 'useParams extracts dynamic path segments (/post/:id). useSearchParams manages query strings (?sort=new). Treating the URL as state ensures that back/forward navigation works perfectly, and users can bookmark or share exact filtered views. Avoid duplicating URL state in local useState to prevent synchronization bugs.' },
    { title: '4. Loaders, Actions & Guards', beginner: 'Loaders fetch data before the page even shows up, preventing blank loading screens. Guards check if a user is logged in and redirect them if they are not allowed to see a page.', advanced: 'React Router v6.4+ introduces data APIs: loaders fetch data before render, and actions handle form mutations. Protected routes are implemented via wrapper components that check auth state and return a <Navigate> component to redirect unauthenticated users to a login page.' },
    { title: '5. History & State Passing', beginner: 'Sometimes you need to pass a quick message to the next page, like "Item saved successfully". You can pass this in the background without putting it in the URL.', advanced: 'The History API allows passing a transient state object during navigation (navigate("/success", { state: { from: "/cart" } })). This state is accessible via useLocation().state. It is perfect for one-time toast notifications or preserving scroll positions, as it does not pollute the URL and is cleared on hard refresh.' },
  ],
  { title: 'Build a Route', intro: 'Create a multi-page SPA with dynamic parameters.', steps: [
    'Install the router: npm install react-router-dom.',
    'Wrap your root component in <BrowserRouter> to enable the History API.',
    'Define your routes using <Routes> and <Route path="/" element={<Home />} />.',
    'Add a dynamic route: <Route path="/post/:id" element={<PostPage />} />.',
    'In PostPage, use const { id } = useParams() to read the URL parameter.',
    'Add navigation using <Link to="/post/123"> instead of standard <a> tags.',
    'Implement a search filter using const [searchParams, setSearchParams] = useSearchParams().',
  ], goal: 'You can build a multi-page SPA with client-side routing.' },
  [
    q('Which component should you use to navigate between routes in React Router?', ['<a href="...">', '<Link to="...">', 'window.location.href', '<Redirect>'], 1, '<Link> is the correct component because it intercepts the click event and uses the History API to update the URL without triggering a full browser reload. Standard <a> tags cause full page refreshes, destroying SPA state. window.location also forces a full reload.'),
    q('How do you read dynamic URL parameters like /user/:id?', ['useState', 'useParams', 'props.params', 'useContext'], 1, 'useParams is the dedicated hook that returns an object of key/value pairs of the dynamic parameters parsed from the current URL path. useState is for local state, and props do not automatically contain URL params unless explicitly passed down.'),
    q('How do you protect a route from unauthenticated users?', ['Return a <Navigate to="/login" /> component', 'Send an HTTP 401 status code', 'Hide the link in the menu', 'Use a meta tag'], 0, 'In React Router, route guards are typically implemented as wrapper components that check authentication state. If the user is not authenticated, the component returns <Navigate to="/login" /> to declaratively redirect them. HTTP 401 is a server-side concept, and hiding links does not prevent direct URL access.'),
    q('Why should you treat the URL (search params) as the source of truth for filters?', ['It makes the code shorter', 'It enables bookmarking, sharing, and proper back/forward browser navigation', 'It is required by React', 'It speeds up the database'], 1, 'When filters are stored in the URL via search params, users can bookmark their exact view, share the link with colleagues, and use the browser back button to return to previous filter states. Storing them in local useState breaks these native web behaviors.'),
    q('What is the purpose of the <Outlet /> component in nested routes?', ['It fetches data from an API', 'It acts as a placeholder where child routes will be rendered', 'It closes the application', 'It handles form submissions'], 1, '<Outlet /> is a special component provided by React Router that tells the parent layout exactly where to render the currently active child route. It allows shared UI (like sidebars) to persist while the main content area swaps out based on the URL.'),
  ],
  ['Use <Link> for client-side navigation to prevent full reloads', 'useParams for path segments, useSearchParams for query strings', 'The URL is the ultimate source of truth for shareable state', 'Implement route guards via wrapper components and <Navigate>']
),

lesson('fs-23', 23, 'State Management Patterns', '🧠',
  'Local state, lifted state, context, Zustand, Redux — each has a specific use case. Picking the right tool separates a tidy, performant app from a tangled, slow one. State management is mostly about knowing where data belongs.',
  [
    { title: '1. Local First', beginner: 'Start with useState inside the component that needs the data. Only move it up to a parent component if a sibling also needs to see or change it.', advanced: 'Most React apps live happily with local state and a sprinkle of context. Lifting state up maintains React\'s unidirectional data flow. Reach for an external store only when prop drilling becomes unmanageable or when state must persist across entirely disconnected component trees.' },
    { title: '2. Context API', beginner: 'Context is like a radio broadcast for data that almost never changes, like dark mode or the logged-in user. Any component can tune in without passing props down manually.', advanced: 'Context provides dependency injection but causes re-render cascades. Any change to the context value triggers a re-render for all consuming components, regardless of whether they use the specific part of the state that changed. Split contexts by update frequency to limit the blast radius of re-renders.' },
    { title: '3. Zustand & External Stores', beginner: 'Zustand is a tiny, simple tool for global state. You create a store once, and any component can grab exactly the piece of data it needs without extra setup.', advanced: 'Zustand is a lightweight (4kb) state management library that uses proxy-based reactivity and selector-based subscriptions. Unlike Context, Zustand only re-renders the exact components whose selected slice of state has changed, completely bypassing React\'s render cycle for unrelated updates. It also supports middleware for persisting state to localStorage.' },
    { title: '4. Server State vs Client State', beginner: 'Data from an API (like a list of products) is different from UI data (like "is this dropdown open?"). Keep them in separate places.', advanced: 'Server state is asynchronous, cached, and prone to staleness. It belongs in dedicated caching libraries like TanStack Query (React Query) or SWR. Client state is synchronous and derived. Mixing them in Redux leads to massive boilerplate and duplicate caching logic. Separate lifecycles require separate tools.' },
    { title: '5. Derived State', beginner: 'If you can calculate a value from other values you already have, do not store it as a new state. Just calculate it while the page renders.', advanced: 'Derived state prevents synchronization bugs. If you store `firstName`, `lastName`, and `fullName` in state, you risk them falling out of sync. Instead, compute `const fullName = firstName + lastName` during render. For expensive calculations, wrap them in `useMemo` to cache the result across renders.' },
  ],
  { title: 'Zustand Counter', intro: 'Build a global store in 5 lines.', steps: [
    'Install the library: npm install zustand.',
    'Create a store file: const useStore = create((set) => ({ count: 0, inc: () => set((state) => ({ count: state.count + 1 })) })).',
    'In a deeply nested component, read the state: const count = useStore((state) => state.count).',
    'Read the action: const inc = useStore((state) => state.inc).',
    'Attach the action to a button: <button onClick={inc}>. Watch it update globally without prop drilling.',
  ], goal: 'You can pick the right state tool for the job.' },
  [
    q('What is the first tool you should reach for when managing state?', ['Redux', 'useState (Local State)', 'MobX', 'Context'], 1, 'Local state via useState should always be the default. It is the simplest, most performant, and easiest to test. You should only lift state or introduce global stores when local state fails to solve the data sharing problem.'),
    q('React Context is best suited for:', ['High-frequency updates like mouse coordinates', 'App-wide values that rarely change (theme, auth, locale)', 'Large lists of data', 'Asynchronous API caching'], 1, 'Context is ideal for low-frequency, app-wide data like themes or user authentication. Because updating a Context value re-renders all consumers, using it for high-frequency data (like mouse position or typing inputs) will cause severe performance bottlenecks.'),
    q('Where should asynchronous server data (API responses) ideally live?', ['Redux', 'TanStack Query (React Query)', 'useState in the root component', 'Context'], 1, 'Server state has unique requirements like caching, deduplication, background refetching, and stale-while-revalidate logic. TanStack Query is purpose-built for this. Redux and Context are designed for synchronous client-side state and lack these network-specific optimizations.'),
    q('What is the primary performance advantage of using selectors in Zustand?', ['They make the code shorter', 'They prevent unnecessary re-renders by only subscribing to specific slices of state', 'They are required by TypeScript', 'They speed up the network'], 1, 'Selectors (e.g., useStore(state => state.user)) tell Zustand exactly which part of the store the component cares about. If a different part of the store updates, the component does not re-render, preventing the "re-render storms" common in React Context.'),
    q('Why should you avoid storing derived state (like a filtered list) in useState?', ['It is illegal in React', 'It creates two sources of truth that can fall out of sync', 'It makes the app slower to load', 'It breaks the router'], 1, 'Derived state should be computed during render. If you store both the original list and the filtered list in state, you must manually remember to update the filtered list every time the original list changes. Computing it on the fly guarantees it is always perfectly in sync.'),
  ],
  ['Local > lifted > context > external store', 'Split contexts by update frequency', 'Zustand provides selector-based subscriptions to prevent re-renders', 'Server state belongs in TanStack Query, not Redux']
),

lesson('fs-24', 24, 'Forms & Validation', '📋',
  'Forms are the number one source of frontend pain and performance issues. Controlled inputs cause re-render storms. The modern solution is react-hook-form combined with Zod, giving you type-safe, performant, accessible forms in very few lines of code.',
  [
    { title: '1. Controlled vs Uncontrolled', beginner: 'Controlled means React holds the input value in state and updates it on every single keystroke. Uncontrolled means the browser\'s DOM holds the value, and React only grabs it when you submit the form.', advanced: 'Controlled components cause a full component tree re-render on every keystroke, which destroys performance in large forms. react-hook-form uses uncontrolled inputs via register() and useRef, bypassing React\'s render cycle for typing. This isolates input state and keeps the UI buttery smooth.' },
    { title: '2. react-hook-form', beginner: 'This library handles all the messy form logic. You just register your inputs and tell it what to do when the user clicks submit. It tracks errors and validity automatically.', advanced: 'react-hook-form minimizes re-renders by isolating input state. The register() function wires up refs and event listeners. formState.errors and isValid drive the UI reactively. It integrates seamlessly with any UI library (MUI, Tailwind, Radix) via the Controller component for complex custom inputs.' },
    { title: '3. Zod Schemas', beginner: 'Zod lets you write rules for your data, like "email must be an email" and "password must be 8 characters". It checks the data and gives you exact error messages if it fails.', advanced: 'Zod is a TypeScript-first schema declaration and validation library. By defining a schema (z.object({ email: z.string().email() })), you get runtime validation and static TypeScript inference for free via z.infer<typeof schema>. This creates a single source of truth for both frontend forms and backend API contracts.' },
    { title: '4. UX & Error Handling', beginner: 'Do not yell at the user while they are typing. Wait until they click away from the box (blur) or try to submit before showing red error messages. Always tell them exactly what is wrong.', advanced: 'Optimal form UX validates on blur for individual fields and on submit for the whole form. react-hook-form exposes formState.touchedFields and submitCount to control when errors render. Always programmatically focus the first invalid input on submit failure using the setFocus() API to maintain keyboard accessibility.' },
    { title: '5. Async Validation & Submissions', beginner: 'Sometimes you need to check if a username is taken by asking the server. You can make your validation rules wait for the server to answer before letting the user submit.', advanced: 'Zod supports async refinements (z.string().refine(async (val) => await checkUsername(val))) for server-side uniqueness checks. For submissions, handle the async mutation inside the onSubmit handler, managing local loading and error states, and reset the form via the reset() API upon successful server confirmation.' },
  ],
  { title: 'Hook-Form + Zod', intro: 'Build a robust, type-safe login form.', steps: [
    'Install dependencies: npm install react-hook-form zod @hookform/resolvers.',
    'Define your schema: const schema = z.object({ email: z.string().email(), password: z.string().min(8) }).',
    'Initialize the form: const { register, handleSubmit, formState } = useForm({ resolver: zodResolver(schema) }).',
    'Wire up inputs: <input {...register("email")} />.',
    'Render errors conditionally: {formState.errors.email && <span>{formState.errors.email.message}</span>}.',
    'Handle submission: <form onSubmit={handleSubmit((data) => console.log(data))}>. Notice the data is fully typed.',
  ], goal: 'You build robust, accessible, type-safe forms quickly.' },
  [
    q('How does react-hook-form handle inputs by default?', ['Controlled (React state)', 'Uncontrolled (DOM refs)', 'Hybrid', 'Server-driven'], 1, 'react-hook-form uses uncontrolled inputs by default via useRef. This means typing in an input does not trigger React re-renders, resulting in massive performance gains for large forms compared to traditional controlled components.'),
    q('What is the primary benefit of using Zod with TypeScript?', ['It adds CSS animations', 'It provides runtime validation and automatically infers static TypeScript types from the same schema', 'It manages global state', 'It handles routing'], 1, 'Zod allows you to define a schema once and use z.infer<typeof schema> to extract the exact TypeScript interface. This eliminates the duplication of writing both runtime validation logic and static type definitions, creating a single source of truth.'),
    q('When is the best time to show validation errors to a user?', ['On every single keystroke', 'On blur (when they leave the field) or on form submit', 'Never, just block submit', 'Only on the server'], 1, 'Showing errors on every keystroke is frustrating (e.g., telling a user their email is invalid after they type just "a"). Validating on blur provides immediate feedback without interrupting the flow, and validating on submit catches any remaining issues before the network request.'),
    q('What is the "Single Source of Truth" combo for modern forms?', ['react-hook-form alone', 'react-hook-form + Zod', 'Yup + Redux', 'Joi + Mobx'], 1, 'Combining react-hook-form (for UI state and performance) with Zod (for schema validation and type inference) is the modern industry standard. Yup is older and lacks native TS inference, while Redux/Mobx are overkill for local form state.'),
    q('How do you programmatically focus the first invalid field on submit failure in react-hook-form?', ['document.querySelector(".error").focus()', 'Use the setFocus(fieldName) API provided by the useForm hook', 'It is impossible', 'Use a ref on every input'], 1, 'react-hook-form tracks which fields are invalid. You can use the setFocus() method inside the onSubmit handler or via an effect watching formState.errors to automatically move the user\'s keyboard focus to the first broken field, which is a massive accessibility and UX win.'),
  ],
  ['Uncontrolled inputs = massive performance wins', 'register() + handleSubmit() replaces messy state', 'Zod schemas double as TypeScript types', 'Validate on blur/submit, not on every keystroke']
),

lesson('fs-25', 25, 'Accessibility (a11y)', '♿',
  'Accessible apps work for everyone — screen readers, keyboards, low-vision, and motor disabilities. They are also a legal requirement in most countries. Accessibility is not a feature you add at the end; it is a fundamental constraint of good UI engineering.',
  [
    { title: '1. Semantic HTML', beginner: 'Screen readers read the code underneath the visual design. If you use a div for a button, a blind user just hears "text". If you use a real button element, they hear "button". Always use the right tag.', advanced: 'The Accessibility Tree is a parallel structure to the DOM that the browser exposes to assistive technologies. Native HTML elements automatically populate this tree with roles, states, and properties. Divs and spans are invisible to this tree. Semantic HTML is the foundation of a11y; no amount of CSS or JS can fix a broken document outline.' },
    { title: '2. Keyboard Navigation', beginner: 'Put your mouse away and try to use your app with only the Tab and Enter keys. Everything interactive must be reachable and usable without a mouse.', advanced: 'Tab order follows DOM order, not visual CSS order. Use tabindex="0" to make custom non-interactive elements focusable, and tabindex="-1" to programmatically focus elements without adding them to the tab ring. Never use positive tabindex values, as they create unpredictable navigation traps.' },
    { title: '3. ARIA Attributes', beginner: 'ARIA lets you add extra labels and descriptions for screen readers. Use aria-label for icon buttons that have no text. But remember: the first rule of ARIA is to not use ARIA if a normal HTML tag works.', advanced: 'ARIA (Accessible Rich Internet Applications) manually patches the Accessibility Tree when native semantics are insufficient. However, incorrect ARIA creates conflicting information that breaks screen readers entirely. Use aria-live="polite" for dynamic toast notifications, and aria-expanded for dropdowns. Never use ARIA to override native HTML behavior.' },
    { title: '4. Contrast & Motion', beginner: 'Text must be dark enough to read against the background. Animations should not make people dizzy. Always provide a way to turn off bouncing or spinning animations.', advanced: 'WCAG AA requires a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text. For motion, you must wrap all non-essential animations in a @media (prefers-reduced-motion: reduce) query. Users with vestibular disorders can trigger severe nausea from uncontrolled parallax or spinning effects.' },
    { title: '5. Focus Management', beginner: 'When a modal popup opens, the keyboard focus must jump inside it. When the modal closes, focus must return to the button that opened it. Otherwise, keyboard users get lost.', advanced: 'Focus trapping is mandatory for modals and dialogs. When a layer opens, focus must be moved to the first interactive element inside it, and Tab/Shift+Tab must be intercepted to cycle only within that layer. Upon unmounting, focus must be programmatically restored to the trigger element to maintain spatial context for screen reader users.' },
  ],
  { title: 'Audit Your App', intro: 'Five minutes, three tools to find 80% of issues.', steps: [
    'Open Chrome DevTools → Lighthouse → Check "Accessibility" → Click "Analyze page load".',
    'Put your mouse away. Tab through every page. Verify every interactive element gets a visible focus ring.',
    'Install the "axe DevTools" browser extension → Run a scan on your current page.',
    'Fix the top 3 critical issues identified by axe (usually missing alt tags or low contrast).',
    'Turn on your OS screen reader (VoiceOver on Mac, NVDA on Windows) and listen to how your main navigation is announced.',
  ], goal: 'Your app is usable by everyone, regardless of how they interact with it.' },
  [
    q('What is the single biggest accessibility win you can make?', ['Adding ARIA everywhere', 'Using Semantic HTML (button, nav, main, h1)', 'Using SVG sprites', 'Building custom div-based widgets'], 1, 'Semantic HTML automatically provides keyboard focus, screen reader roles, and event handling for free. ARIA is only a patch for when native HTML falls short. Custom div widgets require massive amounts of manual JS to replicate native accessibility features.'),
    q('What is the minimum WCAG AA contrast ratio for normal text?', ['1:1', '3:1', '4.5:1', '10:1'], 2, 'WCAG AA mandates a 4.5:1 contrast ratio for normal text and 3:1 for large text (18pt+ or 14pt bold). AAA requires 7:1. Failing these ratios excludes users with low vision or color blindness, and fails legal compliance in many jurisdictions.'),
    q('How do you respect users who get dizzy from animations?', ['Install a plugin', 'Use the prefers-reduced-motion CSS media query', 'Always disable JS', 'Make animations slower'], 1, 'The prefers-reduced-motion media query detects if the user has requested minimal animations at the OS level. You should use it to disable parallax, auto-playing videos, and complex transitions, replacing them with simple fades or instant state changes.'),
    q('What is the First Rule of ARIA?', ['Use lots of ARIA to be safe', 'Use native HTML elements instead of ARIA whenever possible', 'Avoid keyboard navigation', 'Skip alt text on images'], 1, 'The First Rule of ARIA is "don\'t use ARIA". If a native HTML element (like <button> or <input>) exists that provides the semantics you need, use it. Native elements are tested across all screen readers; custom ARIA implementations often contain subtle bugs that break assistive tech.'),
    q('What must happen to keyboard focus when a modal dialog opens?', ['Nothing, it stays on the background button', 'It must be trapped inside the modal and moved to the first interactive element', 'It should move to the browser URL bar', 'It should be disabled entirely'], 1, 'When a modal opens, focus must be programmatically moved inside the modal, and "focus trapping" must be implemented so the Tab key cannot escape to the background page. When the modal closes, focus must return to the element that triggered it.'),
  ],
  ['Semantic HTML is the foundation; ARIA is a last resort', 'Keyboard focus must reach every interactive element', '4.5:1 contrast ratio is the legal minimum', 'Always respect prefers-reduced-motion']
),

lesson('fs-26', 26, 'Performance & Optimization', '⚡',
  'Slow apps lose users and revenue. Most performance wins are surprisingly easy, but you must measure first. Optimize what actually matters based on real data, and ignore micro-optimizations that add complexity without real-world impact.',
  [
    { title: '1. Measure First (Core Web Vitals)', beginner: 'Do not guess what is slow. Use tools to measure it. Google tracks three main numbers: how fast the biggest thing loads, how fast it responds to clicks, and if things jump around while loading.', advanced: 'Core Web Vitals (CWV) are the actual metrics Google uses to rank UX. LCP (Largest Contentful Paint) measures loading performance. INP (Interaction to Next Paint) measures responsiveness and event loop blocking. CLS (Cumulative Layout Shift) measures visual stability. Real-user monitoring (RUM) via Sentry or Vercel Analytics beats synthetic Lighthouse tests.' },
    { title: '2. Code Splitting', beginner: 'Do not force the user to download the entire app just to see the login page. Split your code into small chunks so the browser only downloads the page they are currently visiting.', advanced: 'Code splitting via React.lazy and dynamic import() creates separate chunks in the Vite/Webpack build output. The browser only downloads the chunk when the route is visited. Preload critical chunks using <link rel="modulepreload"> or router-level prefetching to eliminate network waterfalls during navigation.' },
    { title: '3. Memoization & Re-renders', beginner: 'React redraws components a lot. Sometimes this is slow. You can tell React to "remember" heavy calculations or skip redrawing components if their data has not changed. But only do this if it is actually slow.', advanced: 'React.memo prevents a child component from re-rendering if its props are referentially equal. useMemo caches expensive pure computations. useCallback preserves function references across renders. Premature memoization adds noise and memory overhead. Profile first using React DevTools; only memoize hot components that render frequently with identical props.' },
    { title: '4. Asset Optimization', beginner: 'Pictures are usually the heaviest part of a website. Shrink them, use modern formats, and do not load pictures that are at the very bottom of the page until the user scrolls down.', advanced: 'Serve images in modern formats like WebP or AVIF, which are 30-50% smaller than JPEG. Use native lazy-loading (loading="lazy") for below-the-fold images, but never lazy-load the LCP hero image. Use CDN edge caching and set aggressive Cache-Control headers for immutable hashed assets.' },
    { title: '5. The Critical Rendering Path', beginner: 'The browser needs to download CSS and read HTML before it can draw anything. Put the most important CSS at the very top, and let the heavy JavaScript wait until the page is visible.', advanced: 'The browser blocks rendering on synchronous CSS and JS in the head. Inline critical above-the-fold CSS to achieve instant First Paint. Defer non-critical JS using the defer or async attributes. Move heavy third-party scripts (analytics, chat widgets) to web workers or load them after the hydration phase to protect INP.' },
  ],
  { title: 'Speed Audit', intro: 'Fix the biggest bottlenecks in ten minutes.', steps: [
    'Open Chrome DevTools → Lighthouse → Performance scan. Note your LCP and CLS scores.',
    'Identify your largest route or heaviest component and wrap it in React.lazy() and <Suspense>.',
    'Find your hero image. Convert it to WebP format using an online tool and replace the source.',
    'Add width and height attributes to all images to prevent Cumulative Layout Shift (CLS).',
    'Run Lighthouse again. Compare the before and after scores. Aim for >90 before optimizing further.',
  ], goal: 'Your app loads fast on real, constrained mobile devices.' },
  [
    q('When is the correct time to optimize a component for performance?', ['Before writing the code', 'After measuring and identifying a real bottleneck via profiling', 'Never, it is always premature', 'On every single component by default'], 1, 'Premature optimization adds complexity and bugs. You should only optimize after measuring real-world performance (via Lighthouse or RUM) and identifying a specific bottleneck using the React DevTools Profiler. Optimize the actual problem, not theoretical ones.'),
    q('How do you split your JavaScript bundle so users only download what they need?', ['Manually creating script tags', 'Using React.lazy() and dynamic import()', 'Changing tsconfig.json', 'Using Webpack only'], 1, 'React.lazy() combined with dynamic import() tells the bundler to split the code into separate chunks. The browser will only download the chunk when the component is actually rendered (usually tied to a route change), drastically reducing initial load time.'),
    q('Which image formats should you use for modern web performance?', ['JPG only', 'WebP and AVIF', 'BMP', 'GIF only'], 1, 'WebP and AVIF are modern, next-generation image formats that support both lossy and lossless compression, alpha transparency, and are significantly smaller (30-50%) than legacy JPEG or PNG formats at the same visual quality.'),
    q('Why is premature use of useMemo considered bad practice?', ['It crashes the app', 'It adds code noise, memory overhead, and complexity without measurable performance gains', 'It is deprecated in React 18', 'It makes the app slower to compile'], 1, 'Memoization is not free. It requires React to allocate memory to store the previous value and run a shallow comparison on every render. If the calculation is cheap, the cost of memoization is higher than just recalculating it. Only use it for proven expensive operations.'),
    q('What causes Cumulative Layout Shift (CLS) and how do you fix it?', ['Slow JavaScript; fix it by adding async', 'Images loading without defined dimensions; fix it by always setting width and height attributes', 'Too many CSS files; fix it by combining them', 'Using React; fix it by using Vue'], 1, 'CLS occurs when visible elements move unexpectedly during page load, usually because an image or ad loads and pushes text down. Setting explicit width and height attributes (or aspect-ratio CSS) reserves the exact space in the layout before the asset downloads, preventing the shift.'),
  ],
  ['Measure Core Web Vitals before guessing', 'Lazy-load routes and heavy components', 'Serve WebP/AVIF images with explicit dimensions', 'Memoize only proven hot paths, never by default']
),

lesson('fs-27', 27, 'Animations: CSS & Framer Motion', '🎬',
  'Motion communicates change, hierarchy, and state — but only when used with extreme restraint. Subtle micro-animations make a UI feel premium and alive; over-animation causes cognitive overload and motion sickness. Master the rendering pipeline to keep animations at 60fps.',
  [
    { title: '1. CSS Transitions & The GPU', beginner: 'Transitions make changes smooth, like fading a button color when you hover over it. Only animate things that are easy for the computer to draw, like fading or moving.', advanced: 'The browser rendering pipeline separates Paint and Composite from Layout. Animating transform (translate, scale, rotate) and opacity only triggers the Composite step, which runs on the GPU at 60fps. Animating width, height, top, or left triggers Layout (Reflow), forcing the CPU to recalculate the geometry of the entire page on every frame, causing severe jank.' },
    { title: '2. Keyframes & Complex Scenes', beginner: 'Keyframes let you define a multi-step animation, like a loading spinner that rotates continuously. You can pause them or loop them forever.', advanced: '@keyframes define complex, multi-stage animations in pure CSS. You can control timing functions (cubic-bezier), delays, and iteration counts. Use animation-play-state: paused to halt animations when they scroll out of the viewport (via Intersection Observer) to save battery and CPU on mobile devices.' },
    { title: '3. Framer Motion', beginner: 'Framer Motion is a tool for React that makes complex animations easy. It handles things entering and leaving the screen, and can even animate the layout when items change size or order.', advanced: 'Framer Motion uses the Web Animations API and the FLIP (First, Last, Invert, Play) technique to achieve 60fps layout animations. The layoutId prop enables "magic move" transitions where elements seamlessly morph between different DOM positions. AnimatePresence is required to handle exit animations, as React normally unmounts components instantly.' },
    { title: '4. Spring Physics', beginner: 'Real things do not move at a perfectly constant speed. They speed up and slow down like a spring. Framer Motion uses springs by default to make UI feel natural and heavy.', advanced: 'Linear easing feels robotic and artificial. Spring physics (mass, stiffness, damping) simulate real-world momentum, creating organic deceleration. Framer Motion\'s spring engine calculates the exact transform values per frame, avoiding the rigid boundaries of cubic-bezier curves and allowing interruptions mid-animation.' },
    { title: '5. Respecting Users (Vestibular Disorders)', beginner: 'Some people get physically dizzy or nauseous from moving screens. You must check if their computer is set to "reduce motion" and turn off your animations if it is.', advanced: 'You must wrap all non-essential motion in a @media (prefers-reduced-motion: reduce) query in CSS, or use the useReducedMotion hook in Framer Motion. For users with vestibular disorders, parallax scrolling, large zooming transitions, and spinning elements can trigger severe vertigo. Health and accessibility always trump visual flash.' },
  ],
  { title: 'Page Fade-in', intro: 'Compare CSS vs JS animation approaches.', steps: [
    'CSS Approach: Add animation: fadeIn 0.4s ease-out to your container. Define @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }.',
    'Framer Approach: Replace the div with <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring" }}>.',
    'Compare the bundle size impact. CSS adds 0kb. Framer adds ~30kb but offers vastly more control.',
    'Rule of thumb: For simple UI primitives (hover, fade) → use CSS. For interactive gestures, layout shifts, and exits → use Framer.',
    'Open DevTools → Rendering → Emulate CSS media feature prefers-reduced-motion. Verify your animations stop.',
  ], goal: 'Subtle, GPU-accelerated motion that improves UX without causing jank.' },
  [
    q('Which CSS properties are safe to animate without causing performance jank?', ['top and left', 'width and height', 'transform and opacity', 'margin and padding'], 2, 'transform and opacity are the only properties that can be handled entirely by the GPU during the Composite phase. Animating geometry (width, height, top, margin) forces the browser to recalculate the Layout (Reflow) of the entire page on every single frame, destroying performance.'),
    q('What Framer Motion feature allows an element to seamlessly morph between two completely different DOM positions?', ['useState', 'layoutId', 'context', 'styled-components'], 1, 'layoutId is a powerful Framer Motion prop. If two different components share the same layoutId, Framer uses the FLIP technique to calculate the geometric difference and animate the element smoothly from the old position to the new one, even if they are in different parts of the React tree.'),
    q('How do you properly handle users who have enabled "Reduce Motion" in their OS settings?', ['Ignore it, animations are important', 'Use the prefers-reduced-motion media query or hook to disable non-essential motion', 'Make the animations slower', 'Disable JavaScript entirely'], 1, 'You must respect the OS-level accessibility setting. In CSS, use @media (prefers-reduced-motion: reduce) to swap animations for instant transitions. In Framer Motion, use the useReducedMotion() hook to conditionally render static UI. This prevents triggering vertigo in users with vestibular disorders.'),
    q('Why do spring physics feel better than standard linear or ease-in-out animations?', ['They are faster to compute', 'They simulate real-world momentum and deceleration, allowing for organic interruptions', 'They use less battery', 'They are required by React'], 1, 'Linear animations feel robotic. Spring physics (mass, stiffness, damping) simulate real-world inertia. They allow animations to be interrupted and reversed mid-flight naturally, and they settle into place organically rather than hitting a hard mathematical stop at the end of a bezier curve.'),
    q('Why do exit animations in React require a special wrapper like AnimatePresence?', ['React is too slow to animate', 'React unmounts components instantly, destroying the DOM node before the exit animation can play', 'CSS cannot handle exits', 'It is a bug in Framer Motion'], 1, 'When a component is removed from the React tree, React immediately destroys the DOM node. AnimatePresence intercepts this unmounting process, keeps the DOM node alive just long enough to play the exit animation, and then removes it. Without it, elements simply vanish instantly.'),
  ],
  ['Animate transform and opacity only for 60fps GPU compositing', 'Spring physics create natural, interruptible motion', 'layoutId enables magic-move layout transitions', 'Always respect prefers-reduced-motion for accessibility']
),

lesson('fs-28', 28, 'Capstone: Ship a Real SPA', '🏆',
  'You have learned all the parts. Now combine them: build, test, deploy, and monitor. A tutorial is not a portfolio piece. Shipping a real, flawed, live application that solves a problem is what makes you a professional frontend engineer.',
  [
    { title: '1. Pick a Ruthless Scope', beginner: 'A small, finished app is infinitely better than a giant, half-built one. Build a notes app, a weather dashboard, or a recipe browser. Cut features until it feels too small, then build that.', advanced: 'Scope creep kills capstones. Define three core features that must work flawlessly. Everything else is a "nice to have" for version 2.0. A polished, deployed MVP (Minimum Viable Product) demonstrates execution skills, whereas a massive, broken GitHub repo demonstrates abandoned ambition.' },
    { title: '2. Professional Architecture', beginner: 'Organize your files by what they do for the user, not by what type of file they are. Put the login button, the login form, and the login logic in the same folder.', advanced: 'Group code by feature (e.g., src/features/auth, src/features/dashboard), not by technical type (src/components, src/hooks, src/utils). Features change together; technical types do not. This colocation reduces cognitive load and makes it easy to delete or move entire features without hunting through 10 different directories.' },
    { title: '3. Quality Gates & CI', beginner: 'Do not trust yourself to remember to run tests or check for typos. Set up robots to block you from saving bad code or merging broken features.', advanced: 'Implement Husky pre-commit hooks with lint-staged to run Prettier and ESLint before every commit. Set up GitHub Actions to run TypeScript type-checking and Vitest on every Pull Request. Configure branch protection rules to block merging to main if the CI pipeline fails. This enforces a baseline of quality automatically.' },
    { title: '4. Ship, Monitor & Polish', beginner: 'Push your code to Vercel or Netlify. Get a live URL. Add a tool to catch errors when users click things. Then, add a nice picture for when people share the link on Twitter.', advanced: 'Deploy to Vercel/Cloudflare. Integrate Sentry for production error tracking and Vercel Analytics for real-user Core Web Vitals. Add SEO metadata: dynamic <title> tags, Open Graph images for social sharing, robots.txt, and a sitemap.xml. Production polish separates student projects from professional products.' },
    { title: '5. The Feedback Loop', beginner: 'Show your live link to three people. Watch them use it without helping them. Write down where they get confused. Fix the most confusing thing first.', advanced: 'Software is built for users, not developers. Conduct guerrilla usability testing by watching real people interact with your deployed app. Identify friction points, broken mental models, and UI dead ends. Iterate based on empirical observation, not assumptions. This loop is the core of product engineering.' },
  ],
  { title: 'Build, Ship, Share', intro: 'Execute a 3-day sprint to ship your capstone.', steps: [
    'Day 1: Scaffold the repo (Vite + TS + Tailwind). Set up routing and core layout. Build the main UI feature.',
    'Day 2: Integrate data (TanStack Query or local state). Add form validation (Zod). Write one critical integration test.',
    'Day 3: Deploy to Vercel. Configure custom domain, OG images, and Sentry. Share the live URL on LinkedIn/Twitter/Reddit.',
    'Watch 3 friends use the app. Do not explain how it works. Take notes on where they struggle.',
    'Ship v0.2 a week later, fixing the exact pain points you observed. You are now iterating like a senior engineer.',
  ], goal: 'You have shipped a real, live, monitored SPA that you can proudly show employers.' },
  [
    q('What is the best scope for a portfolio capstone project?', ['Massive, with 20 features', 'Small, polished, and fully deployed', 'Average, copied from a tutorial', 'Just a single static page'], 1, 'A small, finished, and deployed project demonstrates the ability to execute, ship, and maintain software. Massive projects usually end up abandoned and broken. Employers value a live, working URL over a massive, un-deployed GitHub repository.'),
    q('What is the best way to organize folders in a professional React app?', ['By file type (components, hooks, utils)', 'By feature/domain (features/auth, features/dashboard)', 'Completely flat', 'Alphabetically'], 1, 'Organizing by feature (Domain-Driven Design) groups code that changes together. When you need to update the "checkout" flow, all related components, hooks, and API calls are in one folder. Organizing by type forces you to jump between 5 different directories to make a single UI change.'),
    q('How do you automatically block bad code from being merged into the main branch?', ['Hope and trust', 'Pre-commit hooks (Husky) and CI pipeline checks', 'Emailing the team', 'Manual code reviews only'], 1, 'Automated quality gates are essential. Husky runs local pre-commit checks (linting, formatting). GitHub Actions runs CI checks (TypeScript compilation, unit tests) on every PR. Branch protection rules physically block the "Merge" button if any of these automated checks fail, guaranteeing main is always deployable.'),
    q('What is the most important step immediately after shipping v1.0?', ['Walk away and never look at it', 'Get real user feedback and iterate based on friction points', 'Pivot to a completely new idea', 'Rewrite it in a different framework'], 1, 'Shipping is not the end; it is the beginning of the feedback loop. Watching real users interact with your deployed app reveals broken mental models and UX flaws that you cannot see as the developer. Iterating based on this data is the core skill of product engineering.'),
    q('Why should you integrate an error monitoring tool like Sentry on day one of deployment?', ['To make the app load faster', 'To catch silent JavaScript errors and stack traces from real users before they report them', 'To handle database connections', 'To replace unit tests'], 1, 'Users rarely report bugs; they just leave. Sentry captures unhandled exceptions, provides source-mapped stack traces, and records the exact user actions (breadcrumbs) that led to the crash. This allows you to proactively fix silent failures that are destroying your user experience.'),
  ],
  ['Small + shipped > massive + abandoned', 'Organize code by feature, not by technical type', 'Automate quality gates via Husky and CI', 'Ship → observe real users → iterate']
 ),
];
 
  

export const getFullstackLessonById = (id: string): FullstackLesson | undefined =>
  FULLSTACK_LESSONS.find(l => l.id === id);

export const isFullstackLessonUnlocked = (id: string, completedLessons: string[]): boolean => {
  const idx = FULLSTACK_LESSONS.findIndex(l => l.id === id);
  if (idx <= 0) return true;
  return completedLessons.includes(FULLSTACK_LESSONS[idx - 1].id);
};
