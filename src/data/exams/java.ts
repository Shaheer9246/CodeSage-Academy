import { ExamTrack } from './python';

export const javaTrack: ExamTrack = {
  id: 'java',
  title: 'Java Developer',
  description: 'Test your knowledge across core Java, JVM architecture, concurrency, memory management, and modern features.',
  totalAvailable: 24,
  questions: [
    // ================= EASY (6 Questions) =================
    {
      topic: 'Core Concepts',
      difficulty: 'Easy',
      q: 'Which keyword is used to define a class in Java?',
      options: ['struct', 'class', 'define', 'interface'],
      answer: 1
    },
    {
      topic: 'Syntax',
      difficulty: 'Easy',
      q: 'What is the correct method signature for the main entry point in Java?',
      options: [
        'public static void main(String[] args)',
        'public void main(String args[])',
        'static void main(String[] args)',
        'public static int main(String[] args)'
      ],
      answer: 0
    },
    {
      topic: 'Data Types',
      difficulty: 'Easy',
      q: 'Which of the following is a primitive data type in Java?',
      options: ['String', 'Integer', 'double', 'ArrayList'],
      answer: 2
    },
    {
      topic: 'Syntax',
      difficulty: 'Easy',
      q: 'How do you insert a single-line comment in Java?',
      options: ['# This is a comment', '// This is a comment', '/* This is a comment', '<!-- This is a comment -->'],
      answer: 1
    },
    {
      topic: 'Control Flow',
      difficulty: 'Easy',
      q: 'Which keyword is used to exit a loop early in Java?',
      options: ['exit', 'stop', 'break', 'return'],
      answer: 2
    },
    {
      topic: 'OOP Basics',
      difficulty: 'Easy',
      q: 'Which keyword allows a subclass to inherit properties from a parent class?',
      options: ['implements', 'extends', 'inherits', 'super'],
      answer: 1
    },

    // ================= INTERMEDIATE (8 Questions) =================
    {
      topic: 'Object-Oriented Programming',
      difficulty: 'Intermediate',
      q: 'Which keyword prevents a method from being overridden or a class from being inherited?',
      options: ['static', 'abstract', 'final', 'private'],
      answer: 2
    },
    {
      topic: 'Collections Framework',
      difficulty: 'Intermediate',
      q: 'Which Java Collection class allows duplicate elements and maintains insertion order?',
      options: ['HashSet', 'TreeSet', 'ArrayList', 'HashMap'],
      answer: 2
    },
    {
      topic: 'Exception Handling',
      difficulty: 'Intermediate',
      q: 'Which keyword is used in a method signature to declare exceptions that the method might throw?',
      options: ['throw', 'throws', 'catch', 'try'],
      answer: 1
    },
    {
      topic: 'Memory & References',
      difficulty: 'Intermediate',
      q: 'Where are local primitive variables created during method execution in Java?',
      options: ['Heap Memory', 'Stack Memory', 'Metaspace', 'PermGen'],
      answer: 1
    },
    {
      topic: 'Generics',
      difficulty: 'Intermediate',
      q: 'What is Type Erasure in Java Generics?',
      options: ['Generics are deleted from source code by the IDE before compilation.', 'Type parameters are removed by the compiler during compilation and replaced with bounds or Object.', 'Runtime types are dynamically created for each type parameter.', 'Generics convert primitive types to their wrapper classes at runtime.'],
      answer: 1
    },
    {
      topic: 'Collections',
      difficulty: 'Intermediate',
      q: 'How does HashMap handle bucket collisions in Java 8+ when a single bucket exceeds a threshold (TREEIFY_THRESHOLD)?',
      options: ['It throws an OutOfMemoryError.', 'It converts the linked list bucket into a Red-Black tree.', 'It doubles the total capacity of the map instantly.', 'It discards older entries using LRU eviction.'],
      answer: 1
    },
    {
      topic: 'String Pool',
      difficulty: 'Intermediate',
      q: 'What happens when you execute String s1 = new String("Java"); ?',
      options: ['One object is created on the Heap.', 'One object is created in the String Constant Pool.', 'Two objects are created: one on the Heap and one in the String Constant Pool (if not present).', 'No objects are created until s1 is evaluated.'],
      answer: 2
    },
    {
      topic: 'Concurrency',
      difficulty: 'Intermediate',
      q: 'What is the main advantage of using java.util.concurrent.atomic classes (e.g., AtomicInteger) over synchronized blocks?',
      options: ['They use hardware-level CAS (Compare-And-Swap) instructions, avoiding heavy OS-level thread locking.', 'They run code asynchronously on background daemon threads.', 'They bypass Heap memory allocation entirely.', 'They prevent deadlocks by removing multi-threading.'],
      answer: 0
    },

    // ================= HARD (10 Questions - Advanced & Tough) =================
    {
      topic: 'JVM Architecture',
      difficulty: 'Hard',
      q: 'What replaced PermGen (Permanent Generation) in Java 8 for storing class metadata?',
      options: ['Metaspace', 'Heap Space', 'Native Stack', 'Code Cache'],
      answer: 0
    },
    {
      topic: 'Memory Management',
      difficulty: 'Hard',
      q: 'In the JVM memory model, where is the String Constant Pool stored as of Java 7 and onwards?',
      options: ['PermGen', 'Metaspace', 'Heap Memory', 'Thread Stack'],
      answer: 2
    },
    {
      topic: 'Garbage Collection',
      difficulty: 'Hard',
      q: 'What is a key structural difference between G1 GC (Garbage-First) and legacy collectors like Parallel GC?',
      options: [
        'G1 does not use Generational hypothesis at all.',
        'G1 splits the heap into many equal-sized regions instead of contiguous Eden, Survivor, and Tenured regions.',
        'G1 requires manual memory allocation via Unsafe API.',
        'G1 cannot run concurrently with application threads.'
      ],
      answer: 1
    },
    {
      topic: 'Concurrency',
      difficulty: 'Hard',
      q: 'What guarantees does the "volatile" keyword provide for a variable in Java?',
      options: [
        'Atomicity of compound operations (e.g., count++)',
        'Visibility of reads/writes across threads via CPU cache flushing and instruction reordering suppression',
        'Automatic thread-safe lock creation',
        'Guaranteed prevention of Garbage Collection'
      ],
      answer: 1
    },
    {
      topic: 'Concurrency',
      difficulty: 'Hard',
      q: 'In Java thread synchronization, what condition causes a "False Sharing" performance degradation?',
      options: [
        'Two threads locking two different objects simultaneously in reverse order.',
        'Independent variables used by different threads residing on the same CPU cache line (64 bytes).',
        'A thread waiting indefinitely on a lock that was never released.',
        'ThreadPoolExecutor exhausting all worker threads in the pool.'
      ],
      answer: 1
    },
    {
      topic: 'Streams API',
      difficulty: 'Hard',
      q: 'What is the key difference between intermediate and terminal operations in the Java Streams API?',
      options: [
        'Intermediate operations produce side effects; terminal operations do not.',
        'Intermediate operations return a new Stream and are lazy; terminal operations trigger pipeline execution.',
        'Terminal operations can only be executed once on a stream, but intermediate operations can be reused across streams.',
        'Terminal operations return Streams, while intermediate operations return collections.'
      ],
      answer: 1
    },
    {
      topic: 'Streams API',
      difficulty: 'Hard',
      q: 'Why should you be cautious when using parallelStream() on operations that rely on order or state?',
      options: [
        'It forces single-threaded execution under the hood.',
        'It uses the common ForkJoinPool.commonPool(), which can cause resource starvation across the application if blocked.',
        'Parallel streams cannot perform reductions or filtering.',
        'It allocates memory outside the JVM Heap.'
      ],
      answer: 1
    },
    {
      topic: 'Bytecode & Classloading',
      difficulty: 'Hard',
      q: 'What is the correct order of parent delegation in Java standard class loading?',
      options: [
        'Application ClassLoader -> Extension/Platform ClassLoader -> Bootstrap ClassLoader',
        'Bootstrap ClassLoader -> Extension/Platform ClassLoader -> Application ClassLoader',
        'Extension/Platform ClassLoader -> Bootstrap ClassLoader -> Custom ClassLoader',
        'Custom ClassLoader -> Application ClassLoader -> Bootstrap ClassLoader'
      ],
      answer: 0
    },
    {
      topic: 'Advanced OOP & References',
      difficulty: 'Hard',
      q: 'What is the primary usage scenario for a PhantomReference in Java?',
      options: [
        'Caching objects until memory runs low.',
        'Scheduling cleanup actions after an object has been garbage collected (alternative to finalize()).',
        'Preventing Garbage Collection indefinitely.',
        'Creating deep clones of objects on the heap.'
      ],
      answer: 1
    },
    {
      topic: 'Design Patterns & JVM',
      difficulty: 'Hard',
      q: 'Why is the Initialization-on-demand Holder idiom (Bill Pugh Singleton) thread-safe without explicit synchronization?',
      options: [
        'It uses volatile fields internally.',
        'Class loading in Java is guaranteed by the JVM spec to be thread-safe and thread-confined.',
        'It relies on native OS mutex locks during class initialization.',
        'It uses AtomicReference under the hood.'
      ],
      answer: 1
    }
  ]
};
