export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const FRONTEND_TOPIC_QUIZZES: Record<string, QuizQuestion[]> = {
  'html-basics': [
    {
      question: 'What is the primary role of HTML in web development?',
      options: [
        'Structuring the layout, content, and elements of a webpage',
        'Styling fonts, colors, and responsive animations',
        'Managing backend servers and database connections',
        'Compiling machine code for system execution'
      ],
      correctIndex: 0,
      explanation: 'HTML (HyperText Markup Language) defines the fundamental layout, structure, and text content of web pages.'
    },
    {
      question: 'Which HTML element represents the highest-level heading on a page?',
      options: ['<heading>', '<h6>', '<h1>', '<head>'],
      correctIndex: 2,
      explanation: 'The <h1> tag represents the primary, highest-level heading in an HTML document hierarchy.'
    },
    {
      question: 'Where is all visible page content placed in an HTML document?',
      options: ['Inside the <head> tag', 'Inside the <body> tag', 'Inside the <title> tag', 'Inside the <meta> tag'],
      correctIndex: 1,
      explanation: 'All content visible to website visitors must be placed inside the <body> element.'
    }
  ],
  'html-intermediate': [
    {
      question: 'Which semantic HTML tag should wrap the main navigation links?',
      options: ['<section>', '<nav>', '<aside>', '<menu>'],
      correctIndex: 1,
      explanation: '<nav> is the semantic HTML5 element specifically intended for major navigation blocks.'
    },
    {
      question: 'What attribute is required on an <img> tag for accessibility and SEO?',
      options: ['title', 'alt', 'label', 'description'],
      correctIndex: 1,
      explanation: 'The alt attribute provides alternative text for screen readers and search engine crawlers.'
    },
    {
      question: 'Which input type is best suited for collecting email addresses with browser validation?',
      options: ['type="mail"', 'type="text"', 'type="email"', 'type="address"'],
      correctIndex: 2,
      explanation: '<input type="email" /> provides built-in browser format validation and optimized mobile keyboards.'
    }
  ],
  'css-basics': [
    {
      question: 'What does CSS stand for in web development?',
      options: [
        'Cascading Style Sheets',
        'Creative Styling Syntax',
        'Computer Sheet Structure',
        'Color and Style System'
      ],
      correctIndex: 0,
      explanation: 'CSS stands for Cascading Style Sheets, used to control visual presentation, layout, and styling.'
    },
    {
      question: 'Which CSS property is used to set the text color of an element?',
      options: ['text-color', 'font-color', 'color', 'background-color'],
      correctIndex: 2,
      explanation: 'In CSS, the "color" property specifically sets the foreground text color.'
    },
    {
      question: 'How do you target an element with the ID "hero" in CSS?',
      options: ['.hero', '#hero', '*hero', '@hero'],
      correctIndex: 1,
      explanation: 'The hashtag (#) symbol is the ID selector in CSS (e.g., #hero).'
    }
  ],
  'css-flexbox': [
    {
      question: 'Which CSS property enables flexbox on a container?',
      options: ['display: flex', 'flex-direction: row', 'display: box', 'position: flex'],
      correctIndex: 0,
      explanation: 'Setting display: flex creates a flex container and activates the Flexbox layout model on its direct children.'
    },
    {
      question: 'Which property aligns flex items along the main axis?',
      options: ['align-items', 'justify-content', 'align-content', 'flex-flow'],
      correctIndex: 1,
      explanation: 'justify-content distributes flex items along the primary (main) axis.'
    },
    {
      question: 'Which property aligns flex items across the cross axis?',
      options: ['align-items', 'justify-items', 'flex-wrap', 'order'],
      correctIndex: 0,
      explanation: 'align-items aligns flex items along the cross axis inside the container.'
    }
  ],
  'js-basics': [
    {
      question: 'Which keyword creates a block-scoped variable that can be reassigned?',
      options: ['const', 'let', 'var', 'static'],
      correctIndex: 1,
      explanation: '"let" creates a block-scoped mutable variable in modern JavaScript.'
    },
    {
      question: 'What is the return value of `typeof "CodeSage"`?',
      options: ['"string"', '"text"', '"object"', '"char"'],
      correctIndex: 0,
      explanation: 'JavaScript returns the primitive type string for text enclosed in quotes.'
    },
    {
      question: 'How do you select an HTML element by its ID in JavaScript?',
      options: [
        'document.getElementById("my-id")',
        'document.queryId("my-id")',
        'window.selectElement("my-id")',
        'document.findElement("my-id")'
      ],
      correctIndex: 0,
      explanation: 'document.getElementById() returns the DOM element reference matching the specified ID.'
    }
  ],
  'react-basics': [
    {
      question: 'What is JSX in the context of React?',
      options: [
        'A syntax extension allowing HTML-like tags inside JavaScript',
        'A replacement programming language for TypeScript',
        'A CSS framework built specifically for React',
        'A database query language for state management'
      ],
      correctIndex: 0,
      explanation: 'JSX is an XML/HTML-like syntax extension to JavaScript that compiles down to React.createElement calls.'
    },
    {
      question: 'Which React hook is used to declare and update component state?',
      options: ['useEffect', 'useState', 'useRef', 'useContext'],
      correctIndex: 1,
      explanation: 'useState is the core React hook for storing and updating reactive state inside functional components.'
    },
    {
      question: 'How are read-only properties passed from parent components to child components?',
      options: ['Via Props', 'Via LocalStorage only', 'Via CSS Variables', 'Via Window Globals'],
      correctIndex: 0,
      explanation: 'Props (properties) allow unidirectional data flow from parent components down into child components.'
    }
  ]
};

export function getQuizForLesson(lessonId: string, topicName: string, lessonTitle: string): QuizQuestion[] {
  // 1. Direct topic match
  const normalizedTopic = (topicName || '').toLowerCase().replace(/[^a-z0-9]/g, '-');
  for (const [key, questions] of Object.entries(FRONTEND_TOPIC_QUIZZES)) {
    if (normalizedTopic.includes(key) || lessonId.includes(key) || key.includes(normalizedTopic)) {
      return questions;
    }
  }

  // 2. Keyword heuristic match
  const t = (topicName + ' ' + lessonTitle).toLowerCase();
  if (t.includes('html')) {
    return FRONTEND_TOPIC_QUIZZES['html-basics'];
  }
  if (t.includes('css') || t.includes('style') || t.includes('color')) {
    return FRONTEND_TOPIC_QUIZZES['css-basics'];
  }
  if (t.includes('react') || t.includes('component') || t.includes('jsx')) {
    return FRONTEND_TOPIC_QUIZZES['react-basics'];
  }
  if (t.includes('javascript') || t.includes('js') || t.includes('function') || t.includes('variable')) {
    return FRONTEND_TOPIC_QUIZZES['js-basics'];
  }

  // 3. Fallback generic high-quality questions for the lesson
  return [
    {
      question: `What is the key concept covered in "${lessonTitle}"?`,
      options: [
        `Understanding and applying core principles of ${topicName || 'modern web development'}`,
        'Configuring raw database cluster instances',
        'Compiling native low-level binary drivers',
        'Writing raw assembly instructions'
      ],
      correctIndex: 0,
      explanation: `This lesson focuses on mastering practical syntax and problem-solving in ${topicName || 'frontend development'}.`
    },
    {
      question: `How should code written in "${lessonTitle}" be verified?`,
      options: [
        'By testing the output in the live preview and checking console logs',
        'By printing the code on physical paper',
        'By disabling all validation safeguards',
        'By restarting the entire operating system'
      ],
      correctIndex: 0,
      explanation: 'Real-time testing with live previews and console inspection is the standard development workflow.'
    },
    {
      question: 'What is the best practice when writing clean frontend code?',
      options: [
        'Write clear, semantic, and well-structured code with consistent formatting',
        'Place all code on a single unformatted line without spacing',
        'Avoid closing tags and ignore browser warnings',
        'Use random variable names and avoid comments'
      ],
      correctIndex: 0,
      explanation: 'Clean code requires semantic structure, readability, and consistent naming conventions.'
    }
  ];
}
