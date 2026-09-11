// Java Expert Track — Part 1: Lessons 1–5 (JVM Internals & Bytecode)
import type { NetworkingLesson, Concept, QuizQuestion } from './networkingLessons';

export type JavaExpertLesson = NetworkingLesson;

const L = (
  id: string, order: number, title: string, icon: string, philosophy: string,
  concepts: Concept[], practical: JavaExpertLesson['practical'], quiz: QuizQuestion[],
  keyTakeaways: string[], terminalNotice?: string
): JavaExpertLesson => ({
  id, module: 'Expert Track: JVM Internals', order, title, icon, philosophy,
  concepts, practical, quiz, keyTakeaways, terminalNotice,
});

const q = (question: string, options: string[], correctIndex: number, explanation?: string): QuizQuestion =>
  ({ question, options, correctIndex, explanation });

export const JAVA_EXPERT_TRACK_NOTICE = {
  type: "track-notice",
  notice: "💎 Java Expert Track: Welcome to the deepest level of Java engineering. This track covers JVM internals, bytecode manipulation, advanced concurrency, performance engineering, and enterprise architecture patterns used by FAANG companies. All lessons require JDK 21+ and a local development environment."
};

export const JAVA_EXPERT_LESSONS: JavaExpertLesson[] = [

// ==========================================
// LESSON javax-01: BYTECODE DEEP DIVE — ASM & BYTEBUDDY
// ==========================================
L(
  'javax-01', 1, 'Bytecode Deep Dive: ASM & ByteBuddy', '🔬',
  '🔬 You have written Java code that compiles to bytecode. Now it is time to READ, WRITE, and MANIPULATE that bytecode directly. Bytecode is the true language of the JVM — the instruction set that powers every Java application on Earth. Frameworks like Spring, Hibernate, Mockito, and Lombok do not use reflection to perform their magic; they generate and transform bytecode at runtime. Mastering ASM and ByteBuddy transforms you from a consumer of frameworks into an architect who builds them. This is the foundation of AOP proxies, mocking frameworks, agent instrumentation, and runtime code generation.',
  [
    {
      title: '1. The .class File Binary Format',
      beginner: 'Every .class file is a binary document with a strict structure. It starts with a magic number (0xCAFEBABE) that tells the JVM "this is a valid class file." Then comes the version, the constant pool (a table of all strings, class names, and method references), access flags, field descriptors, method bytecode, and attributes. Understanding this layout is the first step to bytecode manipulation.',
      advanced: 'The .class file format is defined by JVMS §4. Structure: (1) magic (u4: 0xCAFEBABE), (2) minor_version/major_version (u2 each — Java 21 = major 65), (3) constant_pool_count + constant_pool (variable — stores CONSTANT_Utf8, CONSTANT_Class, CONSTANT_Methodref, CONSTANT_String, etc.), (4) access_flags (u2 — ACC_PUBLIC=0x0001, ACC_FINAL=0x0010, ACC_SUPER=0x0020), (5) this_class/super_class (u2 indices into constant pool), (6) interfaces_count + interfaces, (7) fields_count + fields (each with name_index, descriptor, attributes), (8) methods_count + methods (each with Code attribute containing max_stack, max_locals, bytecode array, exception_table), (9) attributes_count + attributes (SourceFile, InnerClasses, etc.). Use javap -v to inspect. The descriptor format encodes types: I=int, J=long, Ljava/lang/String;=String reference, ([I)V=method taking int[] returning void.'
    },
    {
      title: '2. Stack-Based Bytecode Execution Model',
      beginner: 'The JVM is a stack machine, not a register machine like your CPU. Instructions like iadd pop two integers off the operand stack, add them, and push the result back. There are no "registers" in bytecode — everything flows through the stack. Understanding this model is essential for reading and writing bytecode.',
      advanced: 'The JVM operand stack is a LIFO structure within each stack frame. Key instruction categories: (1) Load/Store: iload_0, istore_1, aload_0 (slot 0 = this for instance methods). (2) Arithmetic: iadd, isub, imul, idiv (pop operands, push result). (3) Stack manipulation: dup, pop, swap. (4) Control flow: ifeq, if_icmpge, goto, tableswitch, lookupswitch. (5) Method invocation: invokevirtual (vtable dispatch), invokeinterface (itable dispatch), invokespecial (constructors/super/private), invokestatic, invokedynamic (lambdas). (6) Object creation: new (allocates), dup (duplicate ref), invokespecial <init>. The verifier ensures stack depth never exceeds max_stack and type safety at every instruction. Example: int add(int a, int b) compiles to: iload_1, iload_2, iadd, ireturn (4 bytes).'
    },
    {
      title: '3. ASM: Low-Level Bytecode Generation',
      beginner: 'ASM is a lightweight, high-performance library for reading and writing .class files directly. It uses a visitor pattern: you walk through a class file instruction by instruction, and you can modify, add, or remove instructions on the fly. It is the engine behind CGLIB, Spring AOP, and many Java agents.',
      advanced: 'ASM provides two APIs: (1) Core API (event-based): ClassReader → ClassVisitor → ClassWriter. You override visitMethod(), visitField(), and inside MethodVisitor override visitInsn(), visitMethodInsn(), visitVarInsn(). (2) Tree API (object-based): ClassNode holds the entire class as a mutable object graph — easier for complex transformations. ASM is ZERO-allocation for simple transformations (streaming mode). Performance: ASM processes ~50MB of bytecode per second. Key patterns: adding a method (visitMethod + Code emission), wrapping existing methods (MethodAdapter pattern), injecting logging (insert println before/after method body). Spring uses ASM to scan @Component annotations without loading classes. Hibernate uses ASM/ByteBuddy for lazy-loading proxies.'
    },
    {
      title: '4. ByteBuddy: High-Level Runtime Code Generation',
      beginner: 'If ASM is assembly language, ByteBuddy is Python. It provides a fluent, readable API for creating and modifying classes at runtime WITHOUT writing raw bytecode. You describe WHAT you want ("create a subclass of UserService, intercept the getUser method, and call my handler"), and ByteBuddy generates the bytecode for you.',
      advanced: 'ByteBuddy (built on top of ASM) provides a domain-specific language for bytecode generation. Core API: new ByteBuddy().subclass(TargetClass.class).method(named("getUser")).intercept(MethodDelegation.to(MyInterceptor.class)).make().load(classLoader, ClassReloadingStrategy.fromInstalledAgent()). Key features: (1) Subclassing with method interception (used by Mockito for mocks). (2) Runtime class redefinition (hot-swapping method bodies in running JVMs). (3) Agent-based instrumentation (attaching to running processes). (4) Annotation-driven interception (@RuntimeType, @This, @Argument). ByteBuddy is the engine behind Mockito 2+, Hibernate 5+ lazy proxies, and OpenTelemetry Java agent. Performance: ~10x slower than raw ASM but 100x more developer-productive.'
    },
    {
      title: '5. invokedynamic & Runtime Code Generation',
      beginner: 'Java 7 introduced a revolutionary bytecode instruction: invokedynamic. Unlike invokevirtual (which calls a fixed method), invokedynamic delegates the call target resolution to RUNTIME. This is how lambda expressions work — the JVM generates the lambda implementation class dynamically on first invocation, then caches it forever.',
      advanced: 'invokedynamic (bytecode 0xBA) was introduced in JSR 292 (Java 7) and revolutionized Java in Java 8 with lambdas. Structure: opcode + index into constant pool → CONSTANT_InvokeDynamic_info → bootstrap_method_ref + name_and_type. The bootstrap method (LambdaMetafactory.metafactory for lambdas) is called ONCE on first execution, generates a CallSite containing a MethodHandle, and all subsequent calls go directly through the cached MethodHandle. This means: (1) Zero allocation for stateless lambdas (singleton). (2) JIT can inline the lambda body. (3) No anonymous class file bloat. Nashorn JavaScript engine, JRuby, and Jython use invokedynamic for dynamic dispatch. Understanding invokedynamic is essential for building DSLs, AOP frameworks, and dynamic proxy systems.'
    }
  ],
  {
    title: '🔬 Lab: Bytecode Inspection & Runtime Class Generation',
    intro: '⚠️ NOTE: This lab requires JDK 21+ and Maven/Gradle. You will inspect raw bytecode with javap, generate a class at runtime using ByteBuddy, and verify the generated bytecode with javap.',
    steps: [
      'Create a Maven project with ByteBuddy dependency: Add <dependency><groupId>net.bytebuddy</groupId><artifactId>byte-buddy</artifactId><version>1.14.18</version></dependency> to pom.xml.',
      'Create a simple class Greeter.java: public class Greeter { public String greet(String name) { return "Hello, " + name; } }.',
      'Compile and inspect bytecode: javac Greeter.java && javap -c -v Greeter. Identify: magic number (CAFEBABE), constant pool entries, method descriptor (Ljava/lang/String;)Ljava/lang/String;, and bytecode instructions (aload_1, invokedynamic for string concat, areturn).',
      'Create ByteBuddyDemo.java. Import net.bytebuddy.ByteBuddy, net.bytebuddy.implementation.FixedValue, static net.bytebuddy.matcher.ElementMatchers.named.',
      'Generate a dynamic subclass: Class<?> dynamicType = new ByteBuddy().subclass(Greeter.class).method(named("greet")).intercept(FixedValue.value("Intercepted!")).make().load(Greeter.class.getClassLoader()).getLoaded();.',
      'Instantiate and invoke: Object instance = dynamicType.getDeclaredConstructor().newInstance(); java.lang.reflect.Method m = dynamicType.getMethod("greet", String.class); System.out.println(m.invoke(instance, "World")); — expect "Intercepted!" not "Hello, World".',
      'Save the generated class to disk for inspection: .make().saveIn(new java.io.File("generated"));.',
      'Inspect the generated bytecode: javap -c generated/Greeter$ByteBuddy*.class. Observe the intercepted method body.',
      'BONUS: Use MethodDelegation.to() with a custom interceptor class to add logging before/after the original method call.'
    ],
    goal: 'You inspected raw JVM bytecode structure, understood the stack-based execution model, and generated a runtime subclass with intercepted method behavior using ByteBuddy.'
  },
  [
    q('What is the magic number at the start of every valid .class file?', ['0xDEADBEEF', '0xCAFEBABE', '0xJAVA0001', '0xCLASS000'], 1, 'Every .class file begins with the 4-byte magic number 0xCAFEBABE (bytes CA FE BA BE). The JVM verifier checks this immediately upon loading. If it does not match, the file is rejected with ClassFormatError. Why others are wrong: 0xDEADBEEF is a debugging placeholder. The others are not valid Java magic numbers.'),
    q('How does the JVM execute the bytecode instruction iadd?', ['It adds the value in register R1 to register R2', 'It pops two integers from the operand stack, adds them, and pushes the result back onto the stack', 'It reads two values from the heap and stores the sum in Metaspace', 'It calls the native CPU ADD instruction directly'], 1, 'The JVM is a stack-based machine. iadd pops the top two int values from the operand stack, computes their sum, and pushes the result. There are no registers in bytecode. Why others are wrong: JVM has no registers. Heap/Metaspace are not involved. Native instructions are only used after JIT compilation.'),
    q('What bytecode instruction is used to invoke a lambda expression in Java 8+?', ['invokevirtual', 'invokeinterface', 'invokedynamic', 'invokestatic'], 2, 'Lambda expressions compile to invokedynamic instructions. On first execution, LambdaMetafactory.metafactory() is called as the bootstrap method, which generates the implementation class and returns a CallSite. Subsequent calls use the cached MethodHandle. Why others are wrong: invokevirtual is for class methods. invokeinterface is for interface methods. invokestatic is for static methods.'),
    q('What is the key advantage of ByteBuddy over raw ASM for runtime code generation?', ['ByteBuddy is faster than ASM', 'ByteBuddy provides a fluent, readable API that eliminates manual bytecode instruction emission while still using ASM internally', 'ByteBuddy does not require a ClassLoader', 'ByteBuddy can modify JDK core classes but ASM cannot'], 1, 'ByteBuddy is built on top of ASM but provides a domain-specific language (subclass, method, intercept) that is 100x more developer-productive. ASM is faster but requires manual bytecode emission. Why others are wrong: ByteBuddy is slower than raw ASM. Both require ClassLoaders. Neither can modify JDK bootstrap classes without agents.'),
    q('What does the method descriptor (ILjava/lang/String;)V represent?', ['A method taking int and String, returning void', 'A method taking Integer and String objects, returning a value', 'A void method with no parameters', 'A method returning int and String'], 0, 'JVM descriptors encode types: I=int, Ljava/lang/String;=String reference, V=void. So (ILjava/lang/String;)V means: parameters are (int, String), return type is void. Why others are wrong: I is primitive int, not Integer. It does have parameters. V means void return, not int/String.')
  ],
  [
    'The .class file format is a binary structure: magic number, constant pool, access flags, fields, methods with bytecode, and attributes.',
    'The JVM is a stack-based machine — all arithmetic and method calls operate via the operand stack, not registers.',
    'ASM provides low-level, zero-allocation bytecode manipulation via visitor and tree APIs.',
    'ByteBuddy provides a fluent API over ASM for runtime class generation, method interception, and agent instrumentation.',
    'invokedynamic enables runtime call target resolution — the foundation of lambdas, DSLs, and dynamic dispatch.'
  ],
  'This Expert Track lab requires a local JDK 21+ installation with Maven or Gradle. Use your native terminal for compilation and javap inspection. See Lesson 1 of the free track for JDK setup.'
),

// ==========================================
// LESSON javax-02: CUSTOM CLASSLOADERS & HOT DEPLOYMENT
// ==========================================
L(
  'javax-02', 2, 'Custom ClassLoaders & Hot Deployment', '📦',
  '📦 ClassLoaders are the gatekeepers of the JVM. They determine which classes are visible, where they are loaded from, and how they are isolated. Every application server (Tomcat, WildFly), every plugin system (OSGi, Minecraft mods), and every hot-reload tool (Spring DevTools, JRebel) is built on custom ClassLoaders. Understanding the delegation model, namespace isolation, and class unloading is the key to building plugin architectures, hot-deployment systems, and multi-tenant applications.',
  [
    {
      title: '1. The ClassLoader Hierarchy & Delegation Model',
      beginner: 'ClassLoaders are organized like a family tree. The Bootstrap ClassLoader (built into the JVM) loads core Java classes like String and System. The Platform ClassLoader loads extension modules. The Application ClassLoader loads YOUR classes from the classpath. When a loader is asked to find a class, it FIRST asks its parent — this is the Delegation Model.',
      advanced: 'The ClassLoader hierarchy (Java 9+): Bootstrap (loads java.base module — null parent, implemented in native code) → Platform (loads platform modules — java.sql, java.xml, etc.) → Application/System (loads classpath/module path). Delegation: loadClass(name) first calls parent.loadClass(name). Only if parent returns ClassNotFoundException does the child attempt findClass(name). This ensures core classes are always loaded by the same loader (security: you cannot override java.lang.String). The findClass() method is where custom loaders define their loading strategy (file, network, database, encrypted bytes). defineClass() converts byte[] to a Class object and links it to the loader\'s namespace.'
    },
    {
      title: '2. Building a Custom ClassLoader',
      beginner: 'You can write your own ClassLoader to load classes from ANY source: a database, an encrypted file, a network URL, or even generated bytecode. You extend java.lang.ClassLoader and override findClass() to define WHERE and HOW to find the class bytes.',
      advanced: 'Custom ClassLoader implementation: extend ClassLoader, override findClass(String name). Steps: (1) Locate byte source (read file, decrypt, download, generate via ByteBuddy). (2) Call defineClass(name, bytes, 0, bytes.length) to convert bytes to Class. (3) Optionally call resolveClass() to eagerly link. Key considerations: (1) Each ClassLoader has its own namespace — same class name loaded by different loaders = DIFFERENT classes (ClassCastException risk). (2) Loaded classes cannot be unloaded individually — the entire ClassLoader must be garbage collected. (3) Parent-first delegation can be overridden (child-first) for plugin isolation (Tomcat WebappClassLoader uses child-first for WEB-INF/classes).'
    },
    {
      title: '3. Class Unloading & Metaspace',
      beginner: 'Classes are loaded into Metaspace (off-heap memory since Java 8). They stay there forever UNLESS the ClassLoader that loaded them becomes garbage. This is how application servers hot-deploy: they throw away the old ClassLoader (and all its classes) and create a new one with the updated code.',
      advanced: 'Class unloading conditions (ALL must be true): (1) All instances of the class are garbage collected. (2) The ClassLoader that loaded the class is garbage collected. (3) The Class object is no longer referenced. Metaspace (replaced PermGen in Java 8) stores: class metadata, method bytecode, constant pool, annotations. Configure: -XX:MaxMetaspaceSize=256m, -XX:MetaspaceSize=128m (initial threshold triggering GC). Monitor: jcmd <pid> VM.metaspace, -Xlog:class+unload. Common Metaspace leak: frameworks creating ClassLoaders per request without cleanup (Groovy scripts, reflection inflation). Spring DevTools uses a RestartClassLoader that is discarded and recreated on file changes.'
    },
    {
      title: '4. Plugin Systems & Namespace Isolation',
      beginner: 'Plugin systems (like Minecraft mods, IDE plugins, or microservice modules) need to load user code WITHOUT letting it interfere with the host application. Custom ClassLoaders create isolated "sandboxes" — each plugin gets its own loader, its own namespace, and its own set of classes that cannot collide with other plugins.',
      advanced: 'Plugin architecture patterns: (1) OSGi: Each bundle gets its own ClassLoader with explicit Import-Package/Export-Package manifests. Complex but powerful. (2) ServiceLoader (SPI): java.util.ServiceLoader discovers implementations via META-INF/services/ files. Works within a single ClassLoader. (3) Child-first ClassLoader: Override loadClass() to check local classes BEFORE delegating to parent. Enables plugin classes to shadow host classes. (4) Class isolation for multi-tenancy: Each tenant gets a separate ClassLoader loading tenant-specific code. Key challenge: passing objects between ClassLoader boundaries requires shared interfaces loaded by a common parent.'
    },
    {
      title: '5. Hot Deployment & Spring DevTools Internals',
      beginner: 'Have you wondered how Spring DevTools restarts your app in 2 seconds when you save a file? It uses a custom ClassLoader! Your application classes are loaded by a "RestartClassLoader" that can be thrown away and recreated. Library classes (Spring, Hibernate) stay in a "BaseClassLoader" that never reloads.',
      advanced: 'Spring DevTools architecture: (1) BaseClassLoader loads third-party JARs (spring-web, hibernate-core) — never reloaded. (2) RestartClassLoader loads YOUR project classes — discarded and recreated on file change. (3) A file watcher (Java WatchService) detects .class changes in target/classes. (4) On change: create new RestartClassLoader, reload application classes, reinitialize Spring context. This achieves ~1-2s restart vs ~30s full restart. JRebel goes further: it instruments class definitions via a Java Agent and patches individual method bodies without ClassLoader replacement. Trade-off: ClassLoader-based restart loses all in-memory state (sessions, caches). Agent-based hot-swap preserves state but risks memory leaks from old class versions.'
    }
  ],
  {
    title: '📦 Lab: Custom ClassLoader & Plugin Isolation',
    intro: '⚠️ NOTE: Build a custom ClassLoader that loads classes from an encrypted source, demonstrates namespace isolation, and simulates hot deployment by unloading and reloading classes.',
    steps: [
      'Create a Maven project. Create a simple plugin class: src/plugins/MyPlugin.java with public class MyPlugin { public String execute() { return "Plugin v1"; } }.',
      'Compile the plugin separately: javac -d plugins/ src/plugins/MyPlugin.java.',
      'Create PluginClassLoader extends ClassLoader. Override findClass(String name): read the .class file bytes from the plugins/ directory, call defineClass(name, bytes, 0, bytes.length).',
      'In Main.java, instantiate PluginClassLoader and load MyPlugin: Class<?> cls = loader.loadClass("MyPlugin"); Object plugin = cls.getDeclaredConstructor().newInstance();.',
      'Invoke via reflection: Method m = cls.getMethod("execute"); System.out.println(m.invoke(plugin)); — expect "Plugin v1".',
      'Demonstrate namespace isolation: Create a SECOND PluginClassLoader instance. Load MyPlugin again. Verify cls1 != cls2 (different Class objects despite same name): System.out.println(cls1 == cls2); — expect false.',
      'Simulate hot deployment: Set loader1 = null; plugin1 = null; System.gc(); — the old ClassLoader and its classes become eligible for GC.',
      'Create loader2 = new PluginClassLoader(); Load the UPDATED MyPlugin (modify execute() to return "Plugin v2" and recompile). Verify the new version is active.',
      'BONUS: Implement an EncryptedClassLoader that XOR-decrypts class bytes before calling defineClass().'
    ],
    goal: 'You built a custom ClassLoader with file-based loading, demonstrated namespace isolation between loaders, and simulated hot deployment via ClassLoader replacement.'
  },
  [
    q('In the Java ClassLoader delegation model, what happens when the Application ClassLoader is asked to load java.lang.String?', ['It loads String from the application classpath', 'It delegates to the Platform ClassLoader, which delegates to the Bootstrap ClassLoader, which loads String from java.base', 'It throws ClassNotFoundException because String is not on the classpath', 'It creates a new class named String in the application namespace'], 1, 'Delegation is parent-first. Application → Platform → Bootstrap. Bootstrap loads java.lang.String from the java.base module. This prevents malicious code from overriding core classes. Why others are wrong: Application loader does not load core classes. No exception is thrown. You cannot override java.lang.String.'),
    q('What three conditions must ALL be true for a class to be unloaded from Metaspace?', ['The class must be final, static, and private', 'All instances are GC\'d, the loading ClassLoader is GC\'d, and the Class object is no longer referenced', 'The JVM must be restarted, the class must be deprecated, and GC must run', 'The class must implement Serializable, have no static fields, and be in the default package'], 1, 'Class unloading requires: (1) zero live instances, (2) the defining ClassLoader is garbage collected, (3) the java.lang.Class object is unreachable. All three must be true simultaneously. Why others are wrong: final/static/private are irrelevant. JVM restart is not required. Serializable has no effect on unloading.'),
    q('Why does loading the same class name with two different ClassLoaders produce two DIFFERENT Class objects?', ['Because the JVM has a bug', 'Because each ClassLoader maintains its own namespace — class identity is (name + defining ClassLoader), not just the name', 'Because the second loader encrypts the class', 'Because Java does not support duplicate class names'], 1, 'Class identity in the JVM is the pair (fully-qualified name, defining ClassLoader). Two loaders loading "com.example.Foo" produce distinct Class objects. Casting between them throws ClassCastException. Why others are wrong: It is not a bug. No encryption occurs. Java absolutely supports the same name in different namespaces.'),
    q('How does Spring DevTools achieve fast application restarts (~1-2 seconds)?', ['It keeps the entire JVM warm and only reloads changed files', 'It uses two ClassLoaders: a BaseClassLoader for libraries (never reloaded) and a RestartClassLoader for application classes (discarded and recreated on change)', 'It compiles code to native machine code ahead of time', 'It uses a separate JVM process for each restart'], 1, 'DevTools splits classloading: third-party JARs stay in a persistent BaseClassLoader. Only YOUR classes are in the RestartClassLoader, which is thrown away and recreated on file change. This avoids reloading 200MB of Spring/Hibernate JARs. Why others are wrong: It does reload changed files via ClassLoader replacement. No AOT compilation. Same JVM process.'),
    q('What is the purpose of a child-first (parent-last) ClassLoader in plugin systems?', ['To load classes faster than parent-first', 'To allow plugin classes to shadow (override) classes provided by the host application, enabling plugin isolation', 'To prevent the plugin from loading any classes', 'To encrypt plugin classes for security'], 1, 'Child-first ClassLoaders override loadClass() to search their own classes BEFORE delegating to the parent. This allows plugins to bundle their own version of a library (e.g., Guava 32) without conflicting with the host\'s version (e.g., Guava 30). Tomcat WebappClassLoader uses child-first for WEB-INF/classes. Why others are wrong: Speed is not the primary goal. It does not prevent loading. It does not encrypt.')
  ],
  [
    'ClassLoader delegation is parent-first: Application → Platform → Bootstrap. Core classes are always loaded by Bootstrap.',
    'Custom ClassLoaders override findClass() and call defineClass() to load bytes from any source.',
    'Class identity is (name + ClassLoader) — same name in different loaders = different classes.',
    'Class unloading requires ALL instances, the ClassLoader, and the Class object to be garbage collected.',
    'Spring DevTools uses a RestartClassLoader for app classes and a persistent BaseClassLoader for libraries.'
  ],
  'This Expert Track lab requires a local JDK 21+ installation. Use your native terminal for compilation and class loading experiments.'
),

// ==========================================
// LESSON javax-03: JAVA AGENTS & RUNTIME INSTRUMENTATION
// ==========================================
L(
  'javax-03', 3, 'Java Agents & Runtime Instrumentation', '🕵️',
  '🕵️ Java Agents are programs that attach to a running JVM and modify the bytecode of already-loaded classes WITHOUT restarting the application. This is the technology behind APM tools (Datadog, New Relic, Dynatrace), AOP frameworks (Spring AOP), mocking libraries (Mockito), and profiling tools (async-profiler). Understanding the java.lang.instrument API, premain vs agentmain entry points, and class retransformation is essential for building observability tools, security scanners, and runtime patching systems.',
  [
    {
      title: '1. Java Agent Architecture (premain vs agentmain)',
      beginner: 'A Java Agent is a special JAR file that hooks into the JVM. There are two ways to attach: (1) premain — the agent starts BEFORE your application\'s main() method (via -javaagent flag). (2) agentmain — the agent attaches to an ALREADY RUNNING JVM (via the Attach API). Both give you an Instrumentation object that can transform classes.',
      advanced: 'Agent entry points: (1) premain(String agentArgs, Instrumentation inst): called before application main(). Specified via -javaagent:path/to/agent.jar JVM argument. MANIFEST.MF must declare Premain-Class. (2) agentmain(String agentArgs, Instrumentation inst): called when attaching to a running JVM via com.sun.tools.attach.VirtualMachine.attach(pid). MANIFEST.MF must declare Agent-Class. The Instrumentation interface provides: addTransformer(ClassFileTransformer), retransformClasses(Class<?>...), redefineClasses(ClassDefinition...), getAllLoadedClasses(), getObjectSize(Object). Agents can be packaged as executable JARs with Agent-Class + Premain-Class in MANIFEST.'
    },
    {
      title: '2. ClassFileTransformer & Bytecode Interception',
      beginner: 'Once your agent is attached, you register a ClassFileTransformer. Every time the JVM loads or retransforms a class, your transformer receives the raw class bytes. You can modify them (add logging, inject metrics, change behavior) and return the modified bytes. The JVM then uses YOUR bytes instead of the original!',
      advanced: 'ClassFileTransformer interface: byte[] transform(ClassLoader loader, String className, Class<?> classBeingRedefined, ProtectionDomain domain, byte[] classfileBuffer). Return modified bytes or null to leave unchanged. Transformers are called in registration order — each receives the output of the previous. Use ASM or ByteBuddy inside the transformer for bytecode manipulation. CRITICAL: transformers must be fast (< 1ms) — they run on the class loading path and block the loading thread. For retransformation (modifying already-loaded classes), call inst.retransformClasses(Target.class) — this triggers transformers with canRetransform=true. Cannot add/remove fields or methods via retransformation — only method bodies can be changed (JVM limitation).'
    },
    {
      title: '3. The Attach API & Runtime Agent Loading',
      beginner: 'You don\'t have to restart your application to attach an agent! The Attach API lets you connect to a running JVM by its Process ID (PID), load your agent JAR, and start transforming classes immediately. This is how tools like jconsole, VisualVM, and async-profiler work.',
      advanced: 'The Attach API (com.sun.tools.attach): (1) VirtualMachine vm = VirtualMachine.attach(pid) — connects to target JVM via platform-specific mechanism (Unix domain socket on Linux, named pipe on Windows). (2) vm.loadAgent(pathToAgentJar) — triggers agentmain() in the target JVM. (3) vm.detach(). The target JVM must be running with the same user (or root). On Java 9+, the target must allow attach (-XX:+AllowRedefinitionToAddDeleteMethods for method addition). Tools: jps lists JVM PIDs. jcmd <pid> VM.version verifies connectivity. Security: attach requires appropriate file permissions. Docker containers require --pid=host or --privileged for cross-container attach.'
    },
    {
      title: '4. APM Agents & Distributed Tracing',
      beginner: 'Every major monitoring tool (Datadog, New Relic, OpenTelemetry) uses Java Agents to automatically instrument your code. Without you writing a single line of instrumentation code, the agent intercepts HTTP calls, database queries, and message queue operations to collect metrics and traces.',
      advanced: 'APM agent architecture: (1) Agent JAR is loaded via -javaagent (premain). (2) ClassFileTransformer intercepts loading of known frameworks (Spring MVC, JDBC drivers, Kafka clients, gRPC). (3) ByteBuddy/ASM injects interceptor code at method entry/exit. (4) Interceptors create Span objects, record timing, propagate trace context via HTTP headers (W3C TraceContext / B3 format). (5) Spans are batched and exported to collector (OTLP, Jaeger, Zipkin). OpenTelemetry Java Agent: instruments 100+ libraries, zero code changes, ~2-5% overhead. Key challenge: avoiding transformation of agent\'s own classes (bootstrap classloader injection). Performance: transformation happens once at class load — runtime overhead is only the injected interceptor code (~50ns per span).'
    },
    {
      title: '5. Security Agents & Runtime Patching',
      beginner: 'Agents aren\'t just for monitoring. Security agents scan loaded classes for vulnerabilities, enforce access policies, and even patch security holes at runtime WITHOUT deploying new code. This is called "virtual patching" and is used by tools like Contrast Security and RASP (Runtime Application Self-Protection).',
      advanced: 'Security agent patterns: (1) Taint tracking: instrument all input sources (HttpServletRequest.getParameter) and sinks (Runtime.exec, PreparedStatement) to detect injection attacks at runtime. (2) Virtual patching: retransform vulnerable methods to add input validation without code deployment. (3) Runtime policy enforcement: intercept ClassLoader.defineClass() to block loading of known-malicious classes. (4) Secret detection: instrument String operations to detect hardcoded credentials. Challenges: (1) Performance overhead must be < 5%. (2) Cannot break application behavior. (3) Must handle obfuscated code. (4) Agent itself must be protected from tampering. RASP is increasingly used alongside WAF for defense-in-depth.'
    }
  ],
  {
    title: '🕵️ Lab: Building a Method Timing Agent',
    intro: '⚠️ NOTE: Build a Java Agent that automatically instruments all methods in a target application to log execution time, using ByteBuddy for bytecode transformation and the Attach API for runtime attachment.',
    steps: [
      'Create a Maven project for the agent. Add ByteBuddy and ByteBuddy-agent dependencies.',
      'Create AgentMain.java with premain method: public static void premain(String args, Instrumentation inst) { new AgentBuilder.Default().type(nameStartsWith("com.myapp")).transform((builder, type, cl, module, pd) -> builder.method(isMethod()).intercept(Advice.to(TimingAdvice.class))).installOn(inst); }.',
      'Create TimingAdvice.java using ByteBuddy Advice: @Advice.OnMethodEnter static long enter() { return System.nanoTime(); } @Advice.OnMethodExit static void exit(@Advice.Enter long start, @Advice.Origin String method) { System.out.println(method + " took " + (System.nanoTime() - start) + "ns"); }.',
      'Create MANIFEST.MF: Premain-Class: com.example.AgentMain, Agent-Class: com.example.AgentMain, Can-Retransform-Classes: true.',
      'Build the agent JAR: mvn package. Verify the MANIFEST is correct: jar tf target/agent.jar | grep MANIFEST.',
      'Create a target application TargetApp.java with several methods (computeFibonacci, processData, etc.).',
      'Run target with agent: java -javaagent:target/agent.jar -cp target/classes com.example.TargetApp.',
      'Observe timing output for every method call in the target application!',
      'BONUS: Use the Attach API to attach the agent to an ALREADY RUNNING TargetApp: VirtualMachine.attach(pid).loadAgent("target/agent.jar"). Verify instrumentation activates on the live process.'
    ],
    goal: 'You built a functional Java Agent with bytecode transformation, automatic method timing instrumentation, and runtime attachment via the Attach API.'
  },
  [
    q('What is the difference between premain and agentmain in Java Agent architecture?', ['premain is for production, agentmain is for development', 'premain runs BEFORE the application main() method (via -javaagent flag); agentmain attaches to an ALREADY RUNNING JVM via the Attach API', 'premain is faster than agentmain', 'premain can only transform JDK classes; agentmain can only transform application classes'], 1, 'premain is specified via -javaagent:path.jar and executes before main(). agentmain is triggered at runtime via VirtualMachine.attach(pid).loadAgent(). Both receive an Instrumentation object. Why others are wrong: Neither is environment-specific. Speed is identical. Both can transform any class.'),
    q('What is the primary limitation of retransformClasses() in the Instrumentation API?', ['It can only retransform classes in the java.base module', 'It can modify method bodies but CANNOT add or remove fields, methods, or change class hierarchy', 'It requires a JVM restart to take effect', 'It can only retransform one class at a time'], 1, 'Retransformation is limited to method body changes. You cannot add/remove fields, add/remove methods, change superclass, or modify interfaces. This is a JVM specification limitation. For structural changes, full class redefinition via redefineClasses() with a new ClassDefinition is needed (still cannot change hierarchy). Why others are wrong: Any class can be retransformed. No restart needed. Multiple classes can be retransformed in one call.'),
    q('How does the OpenTelemetry Java Agent instrument HTTP calls without any code changes?', ['It requires developers to add @Traced annotations to every method', 'It uses a ClassFileTransformer to intercept loading of HTTP client classes (HttpClient, OkHttp, Apache HttpClient) and injects tracing interceptor code via ByteBuddy', 'It modifies the application source code before compilation', 'It replaces the JVM network stack with a custom implementation'], 1, 'The OTel agent registers a ClassFileTransformer that matches known HTTP client class names. When those classes are loaded, ByteBuddy injects Advice interceptors at method entry/exit to create Spans, record timing, and propagate trace context headers. Zero code changes required. Why others are wrong: No annotations needed. Source is not modified. JVM stack is unchanged.'),
    q('What mechanism does the Attach API use to connect to a running JVM on Linux?', ['TCP socket on port 8080', 'Unix domain socket in /tmp/.java_pid<PID>', 'HTTP REST endpoint on the target JVM', 'Shared memory segment in /dev/shm'], 1, 'On Linux, the Attach API creates a Unix domain socket at /tmp/.java_pid<PID>. The attaching process connects to this socket and sends the load command. On Windows, it uses a named pipe. Why others are wrong: No TCP/HTTP is used. Shared memory is not the attach mechanism.'),
    q('Why must ClassFileTransformer implementations be extremely fast (< 1ms)?', ['Because the JVM has a 1ms timeout for transformers', 'Because transformers run on the class loading path — slow transformers block the thread loading the class, stalling application startup and request processing', 'Because the GC pauses during transformation', 'Because the JIT compiler cannot optimize transformed classes'], 1, 'ClassFileTransformer.transform() is called synchronously during class loading. If a transformer takes 100ms, every thread that triggers loading of that class blocks for 100ms. In a web server handling 1000 requests/sec, this cascades into massive latency. Why others are wrong: There is no hard timeout (but slow = bad). GC is unrelated. JIT can optimize transformed classes.')
  ],
  [
    'Java Agents hook into the JVM via premain (-javaagent) or agentmain (Attach API) entry points.',
    'ClassFileTransformer intercepts class bytes at load time — use ASM/ByteBuddy to inject instrumentation.',
    'Retransformation can modify method bodies but cannot add/remove fields or methods.',
    'The Attach API connects to running JVMs via Unix domain sockets (Linux) or named pipes (Windows).',
    'APM agents (Datadog, OpenTelemetry) use ClassFileTransformers + ByteBuddy for zero-code instrumentation.'
  ],
  'This Expert Track lab requires a local JDK 21+ installation. Use your native terminal for agent compilation and JVM attachment experiments.'
),

// ==========================================
// LESSON javax-04: GRAALVM NATIVE IMAGE & AOT COMPILATION
// ==========================================
L(
  'javax-04', 4, 'GraalVM Native Image & AOT Compilation', '⚡',
  '⚡ The JVM\'s JIT compiler is powerful but has a fundamental limitation: warmup time. Serverless functions, CLI tools, and microservices that handle a single request cannot afford 5-10 seconds of JIT warmup. GraalVM Native Image solves this with Ahead-of-Time (AOT) compilation — converting your Java application into a standalone native executable with instant startup (<50ms), minimal memory footprint, and no JVM required at runtime. This is the technology powering Quarkus, Micronaut, Spring Native, and AWS Lambda SnapStart.',
  [
    {
      title: '1. JIT vs AOT: The Compilation Spectrum',
      beginner: 'Traditional Java uses JIT (Just-In-Time) compilation: your code starts interpreted (slow), and the JIT compiler optimizes hot methods over time (fast after warmup). AOT (Ahead-of-Time) compilation does the opposite: it compiles EVERYTHING to native machine code BEFORE the program runs. Result: instant startup, but no runtime optimization.',
      advanced: 'Compilation spectrum: (1) Interpreted: bytecode executed instruction-by-instruction (slowest, zero startup cost). (2) JIT (C1/C2): profile-guided compilation at runtime. Warmup: 5-30s for complex apps. Peak performance: highest (profile-guided optimizations). (3) AOT (GraalVM Native Image): static compilation to native binary. Startup: <50ms. Peak performance: ~80-90% of JIT (no runtime profiling). (4) Graal JIT: GraalVM\'s JIT compiler (replaces C2 in JVM mode) — written in Java, extensible, used by Truffle for language implementations. Trade-off: JIT adapts to actual workload profiles. AOT must make static assumptions (closed-world analysis).'
    },
    {
      title: '2. Closed-World Analysis & Points-To',
      beginner: 'The Native Image compiler needs to know EVERYTHING your program might do at runtime — every class that could be loaded, every method that could be called. This is called "closed-world analysis." It traces your code starting from main() and follows every possible execution path to build a complete call graph.',
      advanced: 'Native Image uses static analysis: (1) Points-to analysis: determines which objects each reference can point to. (2) Call graph construction: traces all reachable methods from entry points (main, @Controller handlers, etc.). (3) Reflection configuration: dynamic features (reflection, JNI, serialization, proxies) are NOT visible to static analysis. You must declare them in reflect-config.json, jni-config.json, serialization-config.json, proxy-config.json. (4) Class initialization analysis: determines which classes can be initialized at build time vs runtime. Undeclared dynamic access → ImageBuildError at build time. Tools: native-image-agent (traces dynamic access during test execution and generates config files automatically).'
    },
    {
      title: '3. Native Image Build Process',
      beginner: 'Building a Native Image is like compiling C code. The native-image tool takes your JAR, analyzes it, compiles all reachable code to native machine code, and produces a single executable file. No JVM needed at runtime! The trade-off: builds take 3-10 minutes and use 8-16GB of RAM.',
      advanced: 'Build pipeline: (1) Classpath/module path analysis. (2) Static analysis (points-to, call graph). (3) Universe building (all reachable types/methods). (4) Compilation (Graal compiler → machine code). (5) Linking (native linker produces ELF/Mach-O/PE executable). Output: single self-contained binary (~20-100MB). Build time: 3-15 min (depends on app size). Memory: 8-16GB RAM for complex apps. Optimizations: -O2 (default), -O3 (aggressive), --gc=G1/serial/epsilon. Spring Boot 3+ integrates via Spring AOT plugin: generates reflection configs, proxy configs, and initialization hints automatically. Quarkus/Micronaut are designed for Native Image from the ground up.'
    },
    {
      title: '4. Runtime Characteristics & Limitations',
      beginner: 'Native Images start in milliseconds and use a fraction of the memory of a JVM app. But there are trade-offs: no JIT means no runtime optimization, no dynamic class loading, and reflection requires explicit configuration. You are trading flexibility for speed and efficiency.',
      advanced: 'Native Image runtime: (1) Startup: <50ms (vs 5-30s JVM). (2) Memory: ~20-50MB RSS (vs 200-500MB JVM). (3) Peak throughput: ~80-90% of JIT-optimized JVM (no profile-guided inlining, no on-stack replacement). (4) No dynamic class loading (ClassLoader.defineClass throws UnsupportedOperationException). (5) No runtime bytecode generation (ByteBuddy/ASM cannot create new classes). (6) Limited reflection (must be pre-configured). (7) GC options: Serial GC (default, low memory), G1 (higher throughput). (8) Thread model: platform threads only (virtual threads NOT supported in Native Image as of GraalVM 23). Use cases: serverless (AWS Lambda, Cloud Run), CLI tools, sidecars, IoT.'
    },
    {
      title: '5. Spring Boot 3 AOT & Cloud-Native Java',
      beginner: 'Spring Boot 3 was redesigned from the ground up for Native Image. The Spring AOT plugin analyzes your application at build time, generates reflection/proxy configurations, and produces a native executable that starts in 50ms instead of 10 seconds. This is the future of cloud-native Java.',
      advanced: 'Spring Boot 3 Native Image support: (1) Spring AOT Plugin (Maven/Gradle): runs at build time, processes @Bean definitions, generates BeanFactoryInitializationAotContribution, writes reflection-config.json, proxy-config.json, resource-config.json. (2) RuntimeHints API: @RegisterReflectionForBinding, @ImportRuntimeHints for programmatic configuration. (3) Conditional processing: @ConditionalOnProperty evaluated at build time (not runtime). (4) Proxy generation: AOT pre-generates CGLIB/JDK proxies as static classes. (5) GraalVM Reachability Metadata Repository: community-maintained configs for 1000+ libraries. Build: mvn -Pnative native:compile. Run: ./target/my-app (no java -jar needed). Deployment: Docker FROM gcr.io/distroless/base-debian12, COPY target/my-app /app. Container image: ~50MB (vs ~300MB JVM image).'
    }
  ],
  {
    title: '⚡ Lab: Native Image Build & Performance Comparison',
    intro: '⚠️ NOTE: This lab requires GraalVM 21+ (install via SDKMAN: sdk install java 21-graal). You will build a Native Image, compare startup time and memory usage against JVM mode, and inspect the build process.',
    steps: [
      'Install GraalVM: sdk install java 21.0.2-graal (or download from graalvm.org). Verify: java -version shows GraalVM.',
      'Install native-image component: gu install native-image (GraalVM CE) or verify it is bundled (GraalVM EE / newer CE).',
      'Create a simple HTTP server: HttpServer.java using com.sun.net.httpserver.HttpServer (no external dependencies). Create a /hello endpoint returning JSON.',
      'Compile normally: javac HttpServer.java. Run in JVM mode: java HttpServer. Measure startup time with time java HttpServer (expect ~500ms).',
      'Build Native Image: native-image HttpServer. This takes 2-5 minutes. Observe the build output: analysis, universe, compilation, linking stages.',
      'Run the native executable: ./httptestserver (or httptestserver.exe on Windows). Measure startup: time ./httptestserver (expect <50ms).',
      'Compare memory: Run both versions. Use ps aux | grep HttpServer to compare RSS memory. JVM: ~50-100MB. Native: ~10-20MB.',
      'Inspect the binary: file httptestserver (shows ELF 64-bit executable). ldd httptestserver (shows minimal dynamic library dependencies).',
      'BONUS: Add --gc=G1 flag to native-image build. Compare GC behavior using -XX:+PrintGC equivalent flags.'
    ],
    goal: 'You built a GraalVM Native Image, compared startup time and memory footprint against JVM mode, and understood the AOT compilation trade-offs.'
  },
  [
    q('What is the primary advantage of GraalVM Native Image over traditional JVM execution?', ['Higher peak throughput after warmup', 'Instant startup (<50ms) and minimal memory footprint, ideal for serverless and CLI tools', 'Better support for dynamic class loading', 'Automatic garbage collection tuning'], 1, 'Native Image compiles to a standalone native executable. Startup is <50ms (vs 5-30s JVM warmup). Memory is ~20-50MB (vs 200-500MB JVM). Peak throughput is actually LOWER than JIT-optimized JVM (~80-90%). Why others are wrong: JIT has higher peak throughput. Native Image CANNOT do dynamic class loading. GC tuning is manual.'),
    q('Why does Native Image require reflection configuration files (reflect-config.json)?', ['Because GraalVM does not support reflection at all', 'Because static analysis cannot see dynamic reflection calls — you must declare which classes/methods are accessed reflectively so they are included in the native image', 'Because reflection is slower in native images', 'Because the JVM encrypts reflective calls'], 1, 'Native Image uses closed-world static analysis. Reflection (Class.forName, Method.invoke) is inherently dynamic — the compiler cannot see which classes will be accessed. You must declare them in reflect-config.json (or use native-image-agent to auto-generate). Undeclared reflection → MissingReflectionRegistrationError at runtime. Why others are wrong: Reflection IS supported (with config). Speed is similar. No encryption.'),
    q('What happens if you try to use ClassLoader.defineClass() in a GraalVM Native Image?', ['It works normally', 'It throws UnsupportedOperationException — dynamic class loading is not supported in Native Image', 'It falls back to interpreted mode', 'It triggers a full JVM restart'], 1, 'Native Image is a closed-world executable. There is no ClassLoader infrastructure at runtime. defineClass() throws UnsupportedOperationException. This means: no runtime bytecode generation (ByteBuddy/ASM), no dynamic proxy creation, no scripting engines. All classes must be known at build time. Why others are wrong: It does not work. No interpreted fallback. No JVM exists to restart.'),
    q('How does Spring Boot 3 simplify Native Image builds compared to Spring Boot 2?', ['Spring Boot 3 does not support Native Image', 'Spring Boot 3 includes the Spring AOT Plugin that automatically generates reflection, proxy, and resource configurations at build time', 'Spring Boot 3 requires manual reflection configuration for every class', 'Spring Boot 3 uses a different JVM'], 1, 'Spring Boot 3 redesigned for AOT: the Spring AOT Maven/Gradle plugin processes @Bean definitions, generates BeanFactory initialization code, writes reflect-config.json/proxy-config.json automatically, and integrates with GraalVM Reachability Metadata Repository. Spring Boot 2 required Spring Native (experimental). Why others are wrong: Spring Boot 3 fully supports Native Image. Manual config is largely automated. Same JVM/GraalVM.'),
    q('What is the typical build time and memory requirement for a medium-sized Spring Boot Native Image?', ['10 seconds, 1GB RAM', '3-15 minutes, 8-16GB RAM', '1 hour, 64GB RAM', 'Instant, no extra memory needed'], 1, 'Native Image builds perform full static analysis + AOT compilation. Medium Spring Boot apps: 3-15 min build time, 8-16GB RAM. Large monoliths can take 30+ min and 32GB+. This is why CI/CD caching and incremental builds are critical. Why others are wrong: It is not instant or 10 seconds. It does not typically require 64GB or 1 hour for medium apps.')
  ],
  [
    'Native Image provides instant startup (<50ms) and minimal memory (~20-50MB) at the cost of ~10-20% peak throughput vs JIT.',
    'Closed-world analysis requires explicit configuration for reflection, JNI, serialization, and dynamic proxies.',
    'Native Image cannot do dynamic class loading, runtime bytecode generation, or virtual threads.',
    'Spring Boot 3 AOT Plugin auto-generates Native Image configurations from Spring metadata.',
    'Use Native Image for serverless, CLI tools, and microservices where startup time and memory matter.'
  ],
  'This Expert Track lab requires GraalVM 21+ installed locally. Use SDKMAN (sdk install java 21-graal) or download from graalvm.org. Native Image builds require 8-16GB RAM.'
),

// ==========================================
// LESSON javax-05: GC ALGORITHMS — G1, ZGC, SHENANDOAH
// ==========================================
L(
  'javax-05', 5, 'GC Algorithms: G1, ZGC & Shenandoah Deep Dive', '♻️',
  '♻️ Garbage Collection is the single most impactful factor in Java application latency. A poorly tuned GC can cause 200ms "Stop-The-World" pauses that destroy user experience, timeout API calls, and trigger cascading failures in microservices. Modern Java offers three production-grade low-pause collectors: G1GC (balanced), ZGC (sub-millisecond), and Shenandoah (concurrent compaction). Understanding their internal architectures, tuning parameters, and workload characteristics is the difference between an application that occasionally stutters and one that delivers consistent, predictable latency under load.',
  [
    {
      title: '1. Generational Hypothesis & Heap Layout',
      beginner: 'GC is built on a simple observation: most objects die young. A method creates a temporary list, uses it, and it becomes garbage within milliseconds. So the JVM divides the Heap into a "Young Generation" (where new objects are born and die quickly) and an "Old Generation" (where long-lived objects are promoted). Cleaning the Young Gen is fast and frequent; cleaning the Old Gen is slow and rare.',
      advanced: 'Generational hypothesis: >90% of objects die before the first GC cycle. Heap layout: Young Gen (Eden + Survivor S0/S1) — objects allocated in Eden via TLAB (Thread-Local Allocation Buffer, ~256KB per thread). Minor GC: Eden + active Survivor scanned, live objects copied to inactive Survivor (age incremented). After N survivals (-XX:MaxTenuringThreshold=15), promoted to Old Gen. Old Gen: long-lived objects, collected by Major/Full GC. G1 divides heap into ~2048 equal-sized regions (1-32MB each) instead of contiguous Young/Old. Each region can be Eden, Survivor, Old, or Humongous (objects > 50% region size). This enables incremental, predictable pauses.'
    },
    {
      title: '2. G1GC: Region-Based Incremental Collection',
      beginner: 'G1 (Garbage-First) is the default collector since Java 9. Instead of collecting the entire Young or Old generation at once, G1 divides the heap into small regions and collects the regions with the MOST garbage first. You tell G1 your pause time target (e.g., 200ms), and it picks enough regions to stay within that budget.',
      advanced: 'G1GC architecture: (1) Heap divided into ~2048 regions (1-32MB, set via -XX:G1HeapRegionSize). (2) Each region tagged: Eden, Survivor, Old, Humongous. (3) Young GC: collect ALL Eden + Survivor regions (STW, but fast — ~10-50ms). (4) Concurrent marking cycle: (a) Initial Mark (STW, piggyback on Young GC), (b) Concurrent Root Region Scan (parallel with app), (c) Concurrent Mark (parallel), (d) Remark (STW, short), (e) Cleanup (STW + concurrent). (5) Mixed GC: collect Young + selected Old regions with most garbage (Garbage-First naming). (6) Pause target: -XX:MaxGCPauseMillis=200 (default). G1 uses Remembered Sets (RSet) to track cross-region references and Collection Set (CSet) for regions to collect. Tuning: -XX:G1NewSizePercent, -XX:G1MaxNewSizePercent, -XX:InitiatingHeapOccupancyPercent (IHOP, default 45%). Full GC (single-threaded, catastrophic) indicates tuning failure.'
    },
    {
      title: '3. ZGC: Sub-Millisecond Pauses via Colored Pointers',
      beginner: 'ZGC is the holy grail of GC: pause times NEVER exceed 1 millisecond, regardless of heap size (even multi-terabyte heaps!). It achieves this by doing almost ALL work concurrently with your application, using a revolutionary technique called "colored pointers" that embed GC metadata directly into object references.',
      advanced: 'ZGC architecture (Java 15+ production, Java 21 generational): (1) Colored pointers: 4 bits of the 64-bit reference are used as GC metadata (Marked0, Marked1, Remapped, Finalizable). No separate mark bitmaps needed. (2) Load barriers: when application reads a reference, ZGC checks the color bits and performs self-healing (fixes stale pointers) without STW. (3) Concurrent phases: ALL marking, relocation, and reference processing happen concurrently with application threads. (4) STW phases: ONLY root scanning (~200μs) and initial/final mark (~100μs). Total STW < 1ms. (5) Multi-mapping: ZGC uses OS virtual memory tricks to map the same physical page to multiple virtual addresses (one per color), enabling color transitions without modifying object headers. (6) Generational ZGC (Java 21): separates Young/Old generations for improved throughput. Tuning: -XX:+UseZGC, -XX:SoftMaxHeapSize, -XX:ConcGCThreads. Overhead: ~5-15% throughput reduction vs G1. Use for: latency-critical systems, large heaps (>16GB), real-time processing.'
    },
    {
      title: '4. Shenandoah: Concurrent Compaction',
      beginner: 'Shenandoah is another low-pause collector, developed by Red Hat. Like ZGC, it keeps pauses under 10ms. Its unique feature is CONCURRENT COMPACTION — it moves objects to defragment the heap WHILE your application is running, using a clever technique called "Brooks pointers" (forwarding pointers).',
      advanced: 'Shenandoah architecture: (1) Brooks pointers: every object has an extra forwarding pointer (8 bytes) prepended to its header. All references point to the forwarding pointer, not the object body. (2) Concurrent evacuation: objects are copied to new locations while app runs. The forwarding pointer is updated atomically. App threads accessing the old location are redirected via the forwarding pointer (read/write barriers). (3) STW phases: Init Mark, Final Mark, Init Update Refs, Final Update Refs — all < 10ms. (4) Concurrent phases: Mark, Evacuate, Update References — all parallel with app. (5) Region-based heap (like G1). (6) Pacing: Shenandoah throttles allocation rate to prevent outpacing GC (back-pressure). Tuning: -XX:+UseShenandoahGC, -XX:ShenandoahGCHeuristics=compact/passive. Comparison vs ZGC: Shenandoah uses forwarding pointers (extra 8 bytes/object), ZGC uses colored pointers (no extra memory). Shenandoah available in OpenJDK builds (not Oracle JDK). Use for: OpenJDK deployments, moderate heaps (4-64GB), balanced latency/throughput.'
    },
    {
      title: '5. GC Tuning, Logging & Diagnosis',
      beginner: 'You cannot tune what you cannot measure. GC logging (-Xlog:gc*) produces detailed records of every collection: pause time, heap before/after, regions collected. Tools like GCViewer and GCEasy parse these logs into visual charts showing pause distributions, allocation rates, and promotion patterns.',
      advanced: 'GC logging (Java 9+ unified): -Xlog:gc*:file=gc.log:time,uptime,level,tags:filecount=5,filesize=10m. Key metrics: (1) Pause time distribution: p50, p99, p999. Target: p99 < 50ms for web services. (2) Allocation rate: MB/s allocated in Young Gen. High rate → frequent Young GC. (3) Promotion rate: MB/s promoted from Young to Old. High rate → premature tenuring, check -XX:MaxTenuringThreshold. (4) Heap occupancy after GC: rising trend indicates memory leak. (5) Full GC frequency: should be ZERO in tuned systems. Tools: GCEasy (online), GCViewer, Eclipse MAT (heap dumps). Heap dump analysis: jmap -dump:format=b,file=heap.hprof <pid>, jcmd <pid> GC.heap_dump. Common issues: (1) Metaspace leak: -XX:MaxMetaspaceSize + -Xlog:class+unload. (2) Humongous allocations in G1: objects > 50% region size. (3) Reference processing overhead: -XX:+ParallelRefProcEnabled.'
    }
  ],
  {
    title: '♻️ Lab: GC Benchmarking & Tuning Comparison',
    intro: '⚠️ NOTE: This lab benchmarks G1, ZGC, and Shenandoah under identical workload, measures pause time distributions, and analyzes GC logs. Requires JDK 21+ with all three collectors available.',
    steps: [
      'Create a GC benchmark: GarbageGenerator.java that allocates 1 million short-lived objects per second for 60 seconds. Include some long-lived objects (10%) to trigger Old Gen activity.',
      'Run with G1GC: java -Xms2g -Xmx2g -XX:+UseG1GC -XX:MaxGCPauseMillis=100 -Xlog:gc*:file=g1.log GarbageGenerator. Record execution time.',
      'Run with ZGC: java -Xms2g -Xmx2g -XX:+UseZGC -Xlog:gc*:file=zgc.log GarbageGenerator. Record execution time.',
      'Run with Shenandoah: java -Xms2g -Xmx2g -XX:+UseShenandoahGC -Xlog:gc*:file=shen.log GarbageGenerator. Record execution time.',
      'Parse GC logs: Use grep "Pause" g1.log | awk to extract pause times. Calculate p50, p99, max for each collector.',
      'Compare: G1 expect p99 ~20-50ms. ZGC expect p99 < 1ms. Shenandoah expect p99 < 10ms.',
      'Analyze heap behavior: jcmd <pid> GC.heap_info during execution. Compare Eden/Old occupancy across collectors.',
      'Test with larger heap (8GB): Repeat ZGC run with -Xms8g -Xmx8g. Verify pause times remain < 1ms regardless of heap size.',
      'BONUS: Use GCEasy.io to upload gc.log files and generate visual pause time charts.'
    ],
    goal: 'You benchmarked three GC algorithms under identical workload, measured pause time distributions, and understood the latency/throughput trade-offs of each collector.'
  },
  [
    q('What is the "Generational Hypothesis" that underpins all modern JVM garbage collectors?', ['Objects in the Old Generation are collected more frequently than Young Generation', 'Most objects (>90%) die shortly after creation, so separating Young and Old generations allows frequent, fast collection of short-lived objects', 'All objects must survive at least 3 GC cycles before promotion', 'The Heap must be divided into exactly two equal halves'], 1, 'The generational hypothesis states that most objects are ephemeral. By isolating Young Gen (frequent, fast Minor GC) from Old Gen (infrequent, slower Major GC), the JVM minimizes the amount of live data scanned per collection. Why others are wrong: Old Gen is collected LESS frequently. There is no 3-cycle minimum. Heap divisions are not equal halves.'),
    q('How does G1GC decide which regions to collect during a Mixed GC cycle?', ['It collects regions in sequential order from left to right', 'It prioritizes regions with the highest garbage-to-live-data ratio (Garbage-First), selecting enough regions to meet the MaxGCPauseMillis target', 'It collects all Old regions before any Young regions', 'It randomly selects regions to ensure fairness'], 1, 'G1 tracks garbage density per region. During Mixed GC, it sorts regions by reclaimable garbage and collects the highest-garbage regions first, stopping when the pause budget (MaxGCPauseMillis) is exhausted. This is the origin of the "Garbage-First" name. Why others are wrong: Not sequential, not all-Old-first, not random.'),
    q('What revolutionary technique does ZGC use to achieve sub-millisecond pause times?', ['It pauses all application threads for exactly 1ms', 'It uses colored pointers (embedding GC metadata in reference bits) and load barriers to perform ALL marking and relocation concurrently with application threads', 'It disables garbage collection entirely and relies on manual memory management', 'It moves all GC work to a separate physical machine'], 1, 'ZGC embeds 4 GC metadata bits (Marked0, Marked1, Remapped, Finalizable) into the 64-bit object reference. Load barriers check these bits on every reference read and self-heal stale pointers. This allows marking, relocation, and reference processing to run 100% concurrently. STW is limited to root scanning (~200μs). Why others are wrong: It does not pause for 1ms. It does not disable GC. It runs on the same machine.'),
    q('What is the primary difference between ZGC and Shenandoah?', ['ZGC is faster than Shenandoah in all scenarios', 'ZGC uses colored pointers (no extra object header memory); Shenandoah uses Brooks forwarding pointers (extra 8 bytes per object)', 'Shenandoah only works on Windows; ZGC only works on Linux', 'ZGC is for small heaps; Shenandoah is for large heaps'], 1, 'ZGC embeds GC metadata in reference bits (colored pointers) — zero per-object overhead. Shenandoah prepends an 8-byte forwarding pointer to each object header (Brooks pointer). Both achieve <10ms pauses. ZGC is Oracle/OpenJDK. Shenandoah is Red Hat/OpenJDK (not in Oracle JDK builds). Why others are wrong: Neither is universally faster. Both are cross-platform. Both handle large heaps.'),
    q('If your G1GC logs show frequent Full GC events with 500ms+ pauses, what is the most likely root cause?', ['The JVM is functioning normally — Full GC is expected', 'The application is allocating objects faster than G1 can collect them, or there is a memory leak causing Old Gen to fill up, triggering single-threaded Full GC as a last resort', 'The CPU is too slow for G1GC', 'The heap size is too large for G1 to manage'], 1, 'Full GC in G1 is a FAILURE MODE, not normal operation. It is single-threaded and catastrophic (500ms-5s+ pauses). Causes: (1) Allocation rate outpaces collection → increase heap or tune IHOP. (2) Memory leak → Old Gen fills, analyze heap dump. (3) Humongous allocations → increase G1HeapRegionSize. (4) Metaspace exhaustion → increase MaxMetaspaceSize. Why others are wrong: Full GC is never "normal." CPU speed is rarely the issue. Large heaps are G1\'s strength, not weakness.')
  ],
  [
    'G1GC (default) divides heap into regions and collects highest-garbage regions first to meet pause targets.',
    'ZGC achieves <1ms pauses via colored pointers and load barriers — all work is concurrent.',
    'Shenandoah provides <10ms pauses via concurrent compaction with Brooks forwarding pointers.',
    'GC logging (-Xlog:gc*) is essential for diagnosing pause distributions, allocation rates, and promotion patterns.',
    'Full GC in G1 is a failure signal — investigate allocation rate, memory leaks, or tuning misconfiguration.'
  ],
  'This Expert Track lab requires JDK 21+ with G1, ZGC, and Shenandoah collectors available. Use your native terminal for JVM benchmarking and GC log analysis.'
),

  // ═══════════════════════════════════════════
// JAVA EXPERT TRACK — PART 2: ADVANCED CONCURRENCY
// ═══════════════════════════════════════════

L(
'javax-06', 6, 'Lock-Free Data Structures & CAS Operations', '🔓',
'🔓 Locks are the blunt instrument of concurrency. Every synchronized block, every ReentrantLock acquisition, forces threads into a costly kernel-mediated queue. Lock-free data structures take a fundamentally different approach: instead of blocking competitors, they use atomic hardware instructions (Compare-And-Swap) to detect conflicts and retry. This is the foundation of the java.util.concurrent.atomic package, ConcurrentLinkedQueue, and the high-frequency trading systems that process millions of operations per second without a single lock.',
[
{
title: '1. Compare-And-Swap (CAS) Hardware Primitives',
beginner: 'Imagine updating a shared counter without a lock. CAS works like this: "I think the counter is 5. If it IS still 5, change it to 6. If someone changed it first, tell me and I\'ll try again." This single atomic operation is built into every modern CPU and is the foundation of all lock-free programming.',
advanced: 'CAS is a CPU instruction (x86: CMPXCHG, ARM: LL/SC) that atomically: (1) reads memory location, (2) compares with expected value, (3) writes new value ONLY if comparison succeeds. Java exposes this via sun.misc.Unsafe.compareAndSwapInt/Long/Object and java.util.concurrent.atomic classes. CAS is WAIT-FREE for the instruction itself but algorithms built on CAS are typically LOCK-FREE (at least one thread makes progress) or WAIT-FREE (all threads make progress in bounded steps). The ABA problem: CAS cannot detect if value changed from A→B→A. Solution: AtomicStampedReference adds a version counter.'
},
{
title: '2. Atomic Variables & Accumulators',
beginner: 'Java\'s atomic package gives you thread-safe variables without locks. AtomicInteger.incrementAndGet() safely adds 1 even when 100 threads call it simultaneously. For high-contention scenarios, LongAdder spreads the counter across multiple cells to reduce thread collisions.',
advanced: 'AtomicInteger/AtomicLong wrap a volatile int/long with CAS operations: get(), set(), compareAndSet(expect, update), incrementAndGet() (CAS loop), getAndAdd(delta). Under high contention, CAS loops suffer from "CAS spinning" — threads repeatedly fail and retry. LongAdder solves this via cell striping: maintains a base counter + Cell[] array. Threads hash to different cells, reducing contention. sum() aggregates base + all cells. LongAdder is NOT atomic for reads (sum is approximate during writes) but is 10-100x faster than AtomicLong under contention. Use LongAdder for metrics/counters; use AtomicLong when exact atomic reads are required.'
},
{
title: '3. Lock-Free Queues (ConcurrentLinkedQueue)',
beginner: 'A lock-free queue lets producers and consumers operate simultaneously without blocking each other. Michael-Scott\'s algorithm uses CAS on head and tail pointers. If two threads try to enqueue at the same time, one succeeds and the other simply retries — no one ever waits.',
advanced: 'ConcurrentLinkedQueue implements the Michael-Scott non-blocking queue algorithm. Structure: singly-linked nodes with volatile next pointers. Enqueue: CAS on tail.next to link new node, then CAS on tail to advance. Dequeue: CAS on head to advance. Key property: LOCK-FREE (at least one thread always makes progress). Memory consistency: linearizable — each operation appears to occur atomically at some point. Trade-off vs ArrayBlockingQueue: CLQ has no capacity bound (unbounded), higher per-operation overhead (~20ns vs ~10ns), but zero contention. Use CLQ for high-throughput producer-consumer; use ArrayBlockingQueue when bounded backpressure is needed.'
},
{
title: '4. AtomicReference & Lock-Free Stacks',
beginner: 'You can build an entire stack (push/pop) without locks using AtomicReference! Each push creates a new node pointing to the old head, then CAS-swaps the head pointer. If the CAS fails (someone else pushed first), you retry with the new head. Simple, elegant, and blazing fast.',
advanced: 'Treiber Stack: AtomicReference<Node> head. Push: create Node(value, head.get()), CAS head from old to new. Pop: read head, CAS head from current to current.next. This is LOCK-FREE but NOT WAIT-FREE (a thread can starve if CAS always fails). The ABA problem is critical here: if node A is popped, modified, and pushed back, CAS(head, A, B) succeeds even though the stack structure changed. Solution: AtomicStampedReference<Node> with version stamps. In practice, for most use cases, ConcurrentLinkedDeque or LinkedBlockingDeque are preferred over hand-rolled lock-free stacks due to the complexity of correct ABA handling.'
},
{
title: '5. False Sharing & @Contended Annotation',
beginner: 'Here\'s a hidden performance killer: if two threads update different variables that happen to sit on the same CPU cache line (64 bytes), the CPU must constantly invalidate and reload that cache line between cores. The threads aren\'t sharing data, but they ARE sharing a cache line. This is False Sharing, and it can make your code 100x slower!',
advanced: 'CPU caches operate on cache lines (typically 64 bytes on x86). If thread A updates long x at address 0x1000 and thread B updates long y at address 0x1008, both variables are on the SAME cache line. Every write by A invalidates B\'s L1 cache copy and vice versa (MESI protocol ping-pong). Solution: (1) Manual padding: add 7 unused longs between variables. (2) @jdk.internal.vm.annotation.Contended (Java 8+): annotates fields/classes to force cache-line padding. Requires -XX:-RestrictContended JVM flag. LongAdder uses @Contended on its Cell class. In the Expert track, we measure false sharing impact with JMH and explore how mechanical sympathy (aligning data structures with cache hierarchy) yields 10-100x throughput improvements.'
}
],
{
title: '🔓 Lab: Lock-Free Counter Benchmark & False Sharing Demo',
intro: '⚠️ NOTE: Build and benchmark three counter implementations (synchronized, AtomicLong, LongAdder) under high thread contention, then demonstrate false sharing with and without @Contended padding.',
steps: [
'Create a Maven project. Create LockFreeBenchmark.java.',
'Implement three counters: (1) synchronized long counter, (2) AtomicLong with incrementAndGet(), (3) LongAdder with increment().',
'Create a multi-threaded test: spawn 8 threads, each incrementing the counter 10,000,000 times.',
'Measure elapsed time for each implementation using System.nanoTime(). Expected: synchronized ~500ms, AtomicLong ~200ms, LongAdder ~20ms.',
'Demonstrate false sharing: Create class UnpaddedCounters { volatile long x; volatile long y; } and PaddedCounters { volatile long x; long p1,p2,p3,p4,p5,p6,p7; volatile long y; }.',
'Run 2 threads updating x and y independently for 100M iterations. Measure: unpadded ~800ms, padded ~200ms.',
'BONUS: Use -XX:-RestrictContended and @Contended annotation for automatic padding.',
'Compile and execute: javac LockFreeBenchmark.java && java -XX:-RestrictContended LockFreeBenchmark.'
],
goal: 'You benchmarked lock-free vs lock-based concurrency, understood CAS mechanics, and demonstrated the devastating performance impact of false sharing.'
},
[
q('What does the CAS (Compare-And-Swap) CPU instruction do atomically?', ['It locks a memory region for exclusive access', 'It reads a memory location, compares it to an expected value, and writes a new value ONLY if the comparison succeeds', 'It copies data from RAM to CPU cache', 'It synchronizes two threads via a mutex'], 1, 'CAS is a single atomic instruction: read → compare → conditional write. If another thread modified the value between read and write, CAS fails and returns false, allowing the caller to retry. Why others are wrong: CAS does not lock. It does not copy to cache. It does not use mutexes.'),
q('Why is LongAdder significantly faster than AtomicLong under high thread contention?', ['LongAdder uses locks instead of CAS', 'LongAdder stripes the counter across multiple Cell objects, reducing CAS contention between threads', 'LongAdder runs on a separate CPU core', 'LongAdder compresses the counter value'], 1, 'LongAdder maintains a base counter + Cell[] array. Threads hash to different cells, so concurrent increments hit different memory locations, drastically reducing CAS failures. sum() aggregates all cells. Why others are wrong: LongAdder is lock-free. It runs on the same cores. It does not compress.'),
q('What is the ABA problem in lock-free programming?', ['When a variable overflows from A to B', 'When CAS succeeds because the value is A, but the value actually changed A→B→A, meaning the underlying structure may have changed', 'When two threads both try to write A', 'When a lock is acquired twice'], 1, 'CAS only checks VALUE equality, not history. If node A is popped, modified, and re-pushed, CAS(head, A, newNode) succeeds even though the stack topology changed. Solution: AtomicStampedReference adds a version number. Why others are wrong: It is not overflow, not dual-write, not double-lock.'),
q('What is False Sharing and why does it devastate multi-threaded performance?', ['When two threads share the same variable', 'When two threads update DIFFERENT variables that reside on the same CPU cache line, causing constant cache invalidation ping-pong between cores', 'When two threads share the same lock', 'When the JVM shares heap between threads'], 1, 'CPU caches operate on 64-byte lines. Two longs 8 bytes apart share a cache line. Every write by core A invalidates core B\'s cache copy (MESI protocol), forcing expensive cache line transfers. Solution: padding or @Contended. Why others are wrong: It is not about shared variables, locks, or heap.'),
q('What is the difference between LOCK-FREE and WAIT-FREE algorithms?', ['They are identical', 'Lock-free guarantees at least ONE thread makes progress; wait-free guarantees ALL threads make progress in bounded steps', 'Lock-free uses locks; wait-free does not', 'Wait-free is slower than lock-free'], 1, 'Lock-free: system-wide progress guaranteed (at least one thread succeeds). Wait-free: every individual thread completes in bounded steps (stronger guarantee, harder to achieve). ConcurrentLinkedQueue is lock-free. Most practical Java concurrent structures are lock-free, not wait-free. Why others are wrong: They are not identical. Lock-free does NOT use locks. Wait-free is not inherently slower.')
],
[
'CAS is the hardware primitive enabling lock-free programming: atomic read-compare-write.',
'AtomicLong uses CAS loops; LongAdder uses cell striping for high-contention scenarios.',
'ConcurrentLinkedQueue implements the Michael-Scott lock-free algorithm with CAS on head/tail.',
'The ABA problem requires AtomicStampedReference with version counters to detect structural changes.',
'False sharing occurs when threads update different variables on the same cache line — use @Contended padding.'
],
'This Expert Track lab requires JDK 21+ and a multi-core machine. Use your native terminal for benchmarking. Run with -XX:-RestrictContended to enable @Contended.'
),

L(
'javax-07', 7, 'Java Memory Model: Happens-Before & Visibility', '🧠',
'🧠 The Java Memory Model (JMM) is the contract between your code and the JVM/hardware. It defines EXACTLY when one thread\'s write becomes visible to another thread. Without this contract, CPU caches, compiler reordering, and store buffers would make multi-threaded code non-deterministic. Understanding happens-before relationships, volatile semantics at the hardware level, and safe publication is the difference between code that works in testing and code that fails under production load.',
[
{
title: '1. The Visibility Problem (CPU Caches & Store Buffers)',
beginner: 'Each CPU core has its own tiny, super-fast memory (L1/L2 cache). When thread A writes x=1, that write might sit in Core 1\'s cache and never reach Core 2\'s cache where thread B is reading x. Thread B might see the OLD value forever! This is the visibility problem.',
advanced: 'Modern CPUs use a cache hierarchy: L1 (~1ns), L2 (~4ns), L3 (~12ns), RAM (~100ns). Each core has private L1/L2. Writes go to the store buffer first, then propagate to cache via the MESI protocol (Modified, Exclusive, Shared, Invalid). Without memory barriers, thread B\'s core may read a stale cache line. The JMM abstracts this: volatile writes insert a StoreLoad barrier (mfence on x86), volatile reads insert a LoadLoad+LoadStore barrier. The JIT compiler also reorders instructions for pipeline efficiency — the JMM constrains which reorderings are legal.'
},
{
title: '2. Happens-Before Relationship (The Core Contract)',
beginner: 'The JMM gives us a simple rule: if action A "happens-before" action B, then everything A did is visible to B. It\'s like a promise: "I finished writing before you started reading, so you\'ll see my changes." The JMM defines exactly which actions create this promise.',
advanced: 'Happens-before (HB) edges are created by: (1) Program order: within a single thread, each action HB the next. (2) Monitor lock: unlock HB subsequent lock on the SAME lock. (3) Volatile write HB subsequent volatile read of the SAME variable. (4) Thread.start() HB all actions in the started thread. (5) All actions in a thread HB Thread.join() return. (6) Transitivity: if A HB B and B HB C, then A HB C. Without an HB edge, the JVM is free to reorder or cache — the reading thread may see ANY value (or no value). This is why unsynchronized shared mutable state is a data race.'
},
{
title: '3. Volatile Semantics at Hardware Level',
beginner: 'The volatile keyword is like shouting your write across all CPU cores: "Everyone, update your cache!" It guarantees that when you write a volatile variable, ALL other threads see the new value immediately. It also prevents the compiler from reordering code around the volatile access.',
advanced: 'Volatile write compiles to: (1) store to memory, (2) StoreStore barrier, (3) StoreLoad barrier (mfence on x86 — the most expensive barrier). Volatile read compiles to: (1) load from memory (bypassing cache), (2) LoadLoad barrier, (3) LoadStore barrier. On x86 (TSO — Total Store Order), only StoreLoad requires mfence; other barriers are free. On ARM/POWER (weak memory model), ALL barriers require explicit instructions (dmb, dsb). Cost: volatile read ~1ns, volatile write ~10-50ns (due to mfence + cache invalidation broadcast). Use volatile for flags and single-writer scenarios; use locks or atomics for compound operations.'
},
{
title: '4. Safe Publication & final Fields',
beginner: 'When you create an object with new and share its reference with another thread, there\'s a risk the other thread sees a half-constructed object (fields still at default values). The JMM guarantees that final fields are fully visible to any thread that sees the object reference — this is called Safe Publication.',
advanced: 'JMM final field semantics (JSR-133): (1) A freeze action occurs at the end of a constructor — all final field writes are flushed. (2) If thread B reads a reference to object X via a data race, B is guaranteed to see X\'s final fields correctly initialized (but non-final fields may be stale). (3) This is why immutable objects with ALL final fields are inherently thread-safe without synchronization. (4) Unsafe publication: storing a reference to a non-final-field object via a data race can expose partially constructed state. Fix: use final fields, volatile reference, or AtomicReference for publication.'
},
{
title: '5. Data Races & Benign Races (Expert Teaser)',
beginner: 'A data race happens when two threads access the same variable, at least one writes, and there\'s no synchronization between them. The result is UNDEFINED — the JVM can do anything. But some races are "benign" by design, like double-checked locking with volatile.',
advanced: '(Expert Teaser) Data race definition (JLS §17.4.5): two accesses to the same variable by different threads, at least one is a write, no HB edge between them. Consequence: undefined behavior — the JVM may return stale values, torn reads (for long/double on 32-bit), or reordered operations. Benign race patterns: (1) Double-checked locking with volatile singleton. (2) racy lazy initialization of immutable objects (String.hashCode caching). (3) Thread-local caching with eventual consistency. The JIT compiler uses data race freedom to perform aggressive optimizations: hoisting reads out of loops, eliminating redundant loads. In the Expert track, we explore how the JMM maps to C++ memory_order semantics, how Project Valhalla value types change visibility rules, and how jcstress (Java Concurrency Stress) tool detects JMM violations via randomized thread interleaving.'
}
],
{
title: '🧠 Lab: Visibility Demonstration & Happens-Before Verification',
intro: '⚠️ NOTE: Demonstrate the visibility problem with unsynchronized shared state, fix it with volatile, and verify happens-before guarantees using thread coordination.',
steps: [
'Create VisibilityDemo.java. Define: static boolean running = true; (NOT volatile).',
'Thread 1: while (running) { /* busy loop */ }. Thread 2: Thread.sleep(100); running = false;.',
'Run WITHOUT volatile: observe Thread 1 NEVER stops (JIT hoists the read out of the loop).',
'Fix with volatile: static volatile boolean running = true;. Rerun: Thread 1 stops after ~100ms.',
'Demonstrate happens-before with synchronized: Thread A writes x=42 inside synchronized block. Thread B reads x inside synchronized block on SAME lock. Verify B always sees 42.',
'Demonstrate safe publication: Create ImmutablePoint with final fields. Share via data race. Verify final fields are always visible (even without synchronization).',
'BONUS: Use jcstress (Java Concurrency Stress) to systematically test JMM guarantees.',
'Compile and execute: javac VisibilityDemo.java && java VisibilityDemo.'
],
goal: 'You demonstrated CPU cache visibility issues, fixed them with volatile memory barriers, verified happens-before guarantees, and understood safe publication of immutable objects.'
},
[
q('What does the "happens-before" relationship guarantee in the Java Memory Model?', ['That one thread executes before another in real time', 'That all writes performed by action A are visible to action B if A happens-before B', 'That threads execute in the order they were started', 'That the garbage collector runs before the next allocation'], 1, 'Happens-before is a VISIBILITY guarantee, not a temporal ordering. If A HB B, then B sees all of A\'s writes. It does NOT mean A executed first in wall-clock time. Why others are wrong: It is not about real-time order, thread start order, or GC timing.'),
q('What hardware instruction does a volatile WRITE compile to on x86 architecture?', ['A simple MOV instruction', 'A StoreLoad barrier (mfence) after the store, ensuring all prior writes are visible before subsequent reads', 'A LOCK prefix on the instruction', 'A CPU cache flush of all cores'], 1, 'On x86 (TSO), volatile write = store + mfence (StoreLoad barrier). This is the ONLY barrier that requires an explicit instruction on x86. StoreStore, StoreLoad, LoadLoad, LoadStore are free on TSO. Why others are wrong: Simple MOV has no ordering. LOCK is for atomic RMW. Full cache flush is not used.'),
q('Why are objects with ALL final fields inherently thread-safe without synchronization?', ['Because final fields are stored in read-only memory', 'Because the JMM guarantees a freeze action at constructor end that makes final fields visible to any thread that sees the object reference', 'Because final fields cannot be read by other threads', 'Because the GC protects final fields'], 1, 'JSR-133 final field semantics: a freeze action at constructor completion ensures all final field writes are flushed. Any thread that reads the object reference (even via data race) is guaranteed to see correctly initialized final fields. Why others are wrong: They are not in read-only memory. They CAN be read. GC is irrelevant.'),
q('What is a data race according to the Java Language Specification?', ['When two threads run at the same speed', 'When two threads access the same variable, at least one access is a write, and there is no happens-before edge between them', 'When two threads use the same lock', 'When two threads are in the same thread pool'], 1, 'Data race = concurrent access + at least one write + no synchronization (no HB edge). Consequence: undefined behavior. The JVM may return stale values, torn reads, or reordered results. Why others are wrong: Speed, shared locks, and thread pools are not the definition.'),
q('Why is double-checked locking WITHOUT volatile broken in Java?', ['It causes a compilation error', 'The reading thread may see a non-null reference to a partially constructed object (fields not yet initialized)', 'It deadlocks the JVM', 'It requires two locks instead of one'], 1, 'Without volatile, the write to the singleton reference can be reordered before the constructor completes. Thread B may see a non-null reference but read default field values (0, null). Adding volatile establishes happens-before between the write and subsequent reads. Why others are wrong: It compiles fine. No deadlock. One lock is sufficient.')
],
[
'Happens-before is the JMM\'s visibility contract: if A HB B, all of A\'s writes are visible to B.',
'Volatile inserts memory barriers: volatile write = StoreLoad (mfence on x86); volatile read = LoadLoad+LoadStore.',
'Final fields enable safe publication: any thread seeing the reference sees correctly initialized final fields.',
'Data races (concurrent write + read, no HB edge) produce undefined behavior — always synchronize shared mutable state.',
'On x86 (TSO), most barriers are free except StoreLoad; on ARM/POWER, all barriers require explicit instructions.'
],
'This Expert Track lab requires JDK 21+ and a multi-core machine. Use your native terminal for visibility testing. Run with -XX:+UnlockDiagnosticVMOptions to observe JIT optimizations.'
),

L(
'javax-08', 8, 'Reactive Streams & Project Reactor', '🌊',
'🌊 Reactive Streams is the specification for asynchronous stream processing with non-blocking backpressure. Project Reactor is the reference implementation used by Spring WebFlux, Spring Cloud Gateway, and Netflix. Instead of pulling data (blocking), reactive systems PUSH data through pipelines, applying backpressure when consumers cannot keep up. This is the architecture behind systems processing millions of events per second without thread exhaustion.',
[
{
title: '1. Reactive Streams Specification (The 4 Interfaces)',
beginner: 'Reactive Streams is like a water pipeline. The Publisher produces water (data), the Subscriber consumes it, the Processor transforms it, and the Subscription controls the flow rate. If the consumer cannot keep up, it tells the producer to SLOW DOWN — this is Backpressure.',
advanced: 'The Reactive Streams specification (JEP 266, Java 9+) defines 4 interfaces: Publisher<T> (produces items via subscribe()), Subscriber<T> (consumes via onNext/onError/onComplete), Subscription (controls demand via request(n) and cancel()), Processor<T,R> (transforms between stages). The critical contract: Publishers MUST NOT emit more items than requested by Subscriber.request(n). This is the Backpressure Protocol — the consumer controls the flow rate, preventing overwhelm. Implementations: Project Reactor (Spring), RxJava (Android), Akka Streams (Scala), MongoDB Reactive Driver.'
},
{
title: '2. Mono & Flux (Reactor Core Types)',
beginner: 'Reactor gives you two core types: Mono represents ZERO or ONE item (like an Optional that arrives asynchronously). Flux represents ZERO to MANY items (like a Stream that never blocks). You chain operations on them without ever blocking a thread.',
advanced: 'Mono<T>: 0|1 element sequence. Flux<T>: 0..N element sequence. Both implement Publisher<T>. Key operators: map(), filter(), flatMap(), zip(), merge(), concat(), take(), skip(), buffer(), window(). Terminal operations: subscribe(), block() (blocking bridge), blockFirst(), blockLast(). Creation: Mono.just(v), Mono.empty(), Mono.fromCallable(), Flux.fromIterable(), Flux.range(), Flux.interval(). Hot vs Cold: Cold publishers (Flux.just) replay from start per subscriber. Hot publishers (Sinks, Processors) broadcast current state to all subscribers simultaneously.'
},
{
title: '3. Backpressure Strategies',
beginner: 'What happens when the producer is faster than the consumer? Reactive Streams has 4 strategies: BUFFER (queue everything), DROP (throw away excess), LATEST (keep only the newest), ERROR (fail immediately). Choosing the right strategy prevents memory overflow.',
advanced: 'Backpressure strategies (Flux.onBackpressureXxx): (1) BUFFER (default): unbounded queue, risks OOM. Use bufferTimeout(size, duration) for bounded. (2) DROP: discards excess items when consumer is slow. Use for telemetry/metrics where data loss is acceptable. (3) LATEST: keeps only the most recent item. Use for stock prices where stale data is useless. (4) ERROR: throws OverflowException immediately. Use when data integrity is critical. Sinks.many().multicast().onBackpressureBuffer(256) creates a bounded hot publisher with explicit backpressure policy.'
},
{
title: '4. Schedulers & Thread Hopping',
beginner: 'Reactive pipelines can switch threads mid-stream! publishOn() moves downstream operations to a different thread pool. subscribeOn() controls where the subscription happens. This lets you do CPU work on one pool and I/O on another, all without blocking.',
advanced: 'Schedulers: Schedulers.parallel() (CPU-bound, fixed size = cores), Schedulers.boundedElastic() (I/O-bound, elastic up to 10*cores), Schedulers.single() (single-threaded), Schedulers.immediate() (current thread). publishOn(scheduler) shifts DOWNSTREAM operators to the specified scheduler. subscribeOn(scheduler) shifts UPSTREAM subscription to the specified scheduler. Multiple publishOn calls create thread hops. In WebFlux: Netty event loop threads handle I/O, boundedElastic handles blocking calls via subscribeOn(boundedElastic()).'
},
{
title: '5. Spring WebFlux & Non-Blocking I/O (Expert Teaser)',
beginner: 'Spring WebFlux is the reactive version of Spring MVC. Instead of one thread per request (blocking), it uses a few event-loop threads that juggle thousands of concurrent connections. This is how Netflix, eBay, and Trello handle millions of users with tiny server fleets.',
advanced: '(Expert Teaser) Spring WebFlux runs on Netty (event-loop, non-blocking). Architecture: HttpHandler → ReactorHttpHandlerAdapter → DispatcherHandler → @Controller methods returning Mono/Flux. Thread model: Netty boss thread accepts connections → worker threads (event loop) process I/O → boundedElastic for blocking operations. Backpressure flows end-to-end: HTTP request → controller → service → database → response. In the Expert track, we explore: RSocket for bidirectional streaming, Server-Sent Events (SSE) for real-time dashboards, reactive transactions with R2DBC, and how to migrate from Spring MVC to WebFlux incrementally using WebClient and reactive repositories.'
}
],
{
title: '🌊 Lab: Reactive Pipeline with Backpressure',
intro: '⚠️ NOTE: Build a reactive data processing pipeline using Project Reactor that demonstrates backpressure, thread hopping, and error handling.',
steps: [
'Create a Maven project with Reactor dependency: <groupId>io.projectreactor</groupId> <artifactId>reactor-core</artifactId> <version>3.6.0</version>.',
'Create ReactiveDemo.java. Import reactor.core.publisher.Flux, Mono, reactor.core.scheduler.Schedulers.',
'Create a Flux: Flux<Integer> numbers = Flux.range(1, 100).',
'Apply operators: numbers.filter(n -> n % 2 == 0).map(n -> n * 10).take(10).',
'Add backpressure: .onBackpressureBuffer(5).',
'Add thread hopping: .publishOn(Schedulers.parallel()).doOnNext(n -> System.out.println(Thread.currentThread().getName() + ": " + n)).',
'Subscribe: .subscribe(n -> System.out.println("Received: " + n), err -> System.out.println("Error: " + err), () -> System.out.println("Complete!")).',
'Add error handling: Flux.range(1, 5).map(n -> { if (n == 3) throw new RuntimeException("Boom"); return n; }).onErrorResume(err -> Flux.just(-1)).subscribe(System.out::println).',
'Compile and execute: javac -cp reactor-core.jar ReactiveDemo.java && java -cp .:reactor-core.jar ReactiveDemo.'
],
goal: 'You built a reactive pipeline with backpressure buffering, thread hopping across schedulers, and error recovery using Project Reactor.'
},
[
q('What is the fundamental contract of Reactive Streams regarding flow control?', ['The Publisher emits as fast as possible', 'The Subscriber controls the flow rate via request(n) — the Publisher MUST NOT emit more items than requested', 'The Subscription automatically throttles based on CPU usage', 'The Processor decides the emission rate'], 1, 'Backpressure is subscriber-driven. Subscriber.request(n) signals demand. Publisher MUST respect this and not emit beyond n items. This prevents consumer overwhelm. Why others are wrong: Publisher cannot emit unbounded. Subscription does not auto-throttle. Processor transforms but does not control rate.'),
q('What is the difference between Mono and Flux in Project Reactor?', ['Mono is for numbers, Flux is for strings', 'Mono represents 0 or 1 element; Flux represents 0 to N elements', 'Mono is synchronous, Flux is asynchronous', 'Mono is for errors, Flux is for success'], 1, 'Mono<T> is a 0|1 element async sequence (like async Optional). Flux<T> is a 0..N element async sequence (like async Stream). Both are non-blocking Publishers. Why others are wrong: Type parameter is generic. Both are asynchronous. Both can represent errors via onError.'),
q('Which backpressure strategy should you use when stale data is useless (e.g., stock price updates)?', ['BUFFER', 'DROP', 'LATEST', 'ERROR'], 2, 'LATEST keeps only the most recent item, discarding older ones. Perfect for real-time data where stale values are meaningless (stock prices, sensor readings). Why others are wrong: BUFFER queues everything (OOM risk). DROP discards randomly. ERROR fails immediately.'),
q('What does publishOn(Schedulers.parallel()) do in a Reactor pipeline?', ['It executes the entire pipeline in parallel', 'It shifts all DOWNSTREAM operators to the parallel scheduler thread pool', 'It shifts UPSTREAM subscription to the parallel scheduler', 'It creates multiple copies of the pipeline'], 1, 'publishOn(scheduler) moves downstream processing to the specified scheduler. subscribeOn(scheduler) moves upstream subscription. Multiple publishOn calls create thread hops. Why others are wrong: It does not parallelize the entire pipeline. It does not affect upstream. It does not copy the pipeline.'),
q('How does Spring WebFlux handle 10,000 concurrent connections with only 4 threads?', ['It creates 10,000 virtual threads', 'It uses Netty event-loop threads with non-blocking I/O — threads handle I/O events, not individual requests', 'It queues all requests and processes them sequentially', 'It uses 10,000 OS processes'], 1, 'WebFlux runs on Netty event loops. A few threads (typically = CPU cores) handle I/O multiplexing via epoll/kqueue. Non-blocking I/O means threads are never waiting. Reactive pipelines process data as it arrives. Why others are wrong: It does not create virtual threads (that is Loom). It does not queue sequentially. It does not use processes.')
],
[
'Reactive Streams specification defines Publisher, Subscriber, Subscription, Processor with backpressure contract.',
'Mono = 0|1 elements; Flux = 0..N elements. Both are non-blocking Publishers.',
'Backpressure strategies: BUFFER, DROP, LATEST, ERROR — choose based on data staleness tolerance.',
'publishOn() shifts downstream; subscribeOn() shifts upstream. Use Schedulers for thread hopping.',
'Spring WebFlux uses Netty event loops for non-blocking I/O — few threads, millions of connections.'
],
'This Expert Track lab requires JDK 21+ and Maven. Use your native terminal for compilation and execution.'
),

L(
'javax-09', 9, 'Disruptor Pattern & Ultra-Low-Latency Systems', '⚡',
'⚡ When milliseconds matter — high-frequency trading, real-time gaming servers, telecom signaling — standard concurrent queues are too slow. The LMAX Disruptor is a lock-free, cache-optimized ring buffer that processes 6+ million events per second on a single thread. It achieves this through mechanical sympathy: designing data structures that align with CPU cache lines, eliminating false sharing, and avoiding locks entirely.',
[
{
title: '1. Why Standard Queues Fail at Ultra-Low Latency',
beginner: 'A normal BlockingQueue uses locks. Every time you add or remove an item, threads must fight over the lock. This causes context switches (expensive!), cache invalidation (expensive!), and memory allocation (expensive!). For trading systems processing millions of orders per second, this overhead is unacceptable.',
advanced: 'BlockingQueue bottlenecks: (1) Lock contention: synchronized/ReentrantLock causes thread parking/unparking (~1-10μs per context switch). (2) Memory allocation: LinkedBlockingQueue allocates a Node object per element — GC pressure. (3) False sharing: head/tail pointers on same cache line cause MESI ping-pong. (4) Unbounded growth: no natural backpressure. At 1M ops/sec, even 1μs lock overhead consumes 100% of one CPU core. The Disruptor eliminates ALL four bottlenecks.'
},
{
title: '2. Ring Buffer Architecture',
beginner: 'The Disruptor uses a circular array (ring buffer) of pre-allocated slots. Producers write to slots in order. Consumers read from slots in order. No allocation happens at runtime — everything is pre-allocated. The ring wraps around when full, overwriting the oldest data (or blocking, depending on configuration).',
advanced: 'Ring Buffer: fixed-size power-of-2 array (e.g., 1024, 4096, 65536 slots). Pre-allocated at startup — zero runtime allocation. Sequence numbers: monotonically increasing long. Slot index = sequence & (bufferSize - 1) (bitwise AND instead of modulo — faster). Producers claim sequences via AtomicLong.getAndAdd(). Consumers track their own sequence cursor. The ring buffer is padded to avoid false sharing with adjacent memory. LMAX achieves 6M+ events/sec single-threaded, 25M+ with batching.'
},
{
title: '3. Mechanical Sympathy & False Sharing Elimination',
beginner: 'The Disruptor is designed with "mechanical sympathy" — it understands how the CPU hardware actually works and designs data to fit. It pads every critical variable to fill an entire CPU cache line (64 bytes), so no two threads ever touch the same cache line.',
advanced: 'Mechanical sympathy principles in Disruptor: (1) Cache line padding: every sequence counter is padded to 128 bytes (2 cache lines) using long p1,p2,p3,p4,p5,p6,p7 fields or @Contended. (2) No object allocation: events are pre-allocated POJOs reused via EventFactory. (3) Array access: contiguous memory layout enables CPU prefetching. (4) Bitwise indexing: sequence & (size-1) instead of sequence % size. (5) Batching: consumers process multiple events per wakeup, amortizing notification cost. (6) Busy-spin wait strategy: for ultra-low latency, consumers spin instead of parking (trades CPU for latency).'
},
{
title: '4. Producer Sequencing & Consumer Dependency Graphs',
beginner: 'Multiple producers can write to the Disruptor simultaneously using a shared sequence counter. Multiple consumers can form dependency graphs: Consumer B waits for Consumer A to finish before processing. This enables complex event processing pipelines without any locks.',
advanced: 'Producer sequencing: Sequencer (SingleProducerSequencer or MultiProducerSequencer) manages the claim/publish cycle. Multi-producer uses CAS on a shared AtomicLong cursor. Consumer dependency: DependencyGraph via Sequence barriers. Consumer B depends on Consumer A: B\'s SequenceBarrier tracks A\'s sequence. B cannot read ahead of A. This enables diamond patterns: Producer → [A, B] → C (C waits for both A and B). Wait strategies: BlockingWaitStrategy (lock + condition), SleepingWaitStrategy (yield then sleep), BusySpinWaitStrategy (spin — lowest latency, highest CPU), YieldingWaitStrategy (yield only).'
},
{
title: '5. LMAX Architecture & Real-World Systems (Expert Teaser)',
beginner: 'The LMAX Exchange processes 6 million orders per second with a single thread handling all business logic. No locks, no queues, no thread pools for the core logic. Just one thread, one ring buffer, and mechanical sympathy. This architecture powers trading systems, gaming servers, and telecom platforms worldwide.',
advanced: '(Expert Teaser) LMAX architecture: (1) Single-threaded business logic — eliminates all concurrency bugs in the core. (2) Inbound ring buffer receives orders from network threads. (3) Outbound ring buffer sends responses. (4) Journaling ring buffer persists to disk for replay. (5) Replication ring buffer sends to backup systems. All communication via Disruptor — zero locks in the critical path. In the Expert track, we explore: Agrona (LMAX\'s open-source library) for off-heap data structures, Aeron (LMAX\'s messaging transport) for UDP-based reliable messaging, SBE (Simple Binary Encoding) for zero-allocation serialization, and how to build a complete trading engine with deterministic latency guarantees.'
}
],
{
title: '⚡ Lab: Disruptor Ring Buffer Benchmark',
intro: '⚠️ NOTE: Build a Disruptor-based event processing system and benchmark it against ArrayBlockingQueue to demonstrate the latency difference.',
steps: [
'Create a Maven project with Disruptor dependency: <groupId>com.lmax</groupId> <artifactId>disruptor</artifactId> <version>3.4.4</version>.',
'Create DisruptorDemo.java. Import com.lmax.disruptor.*.',
'Define an event: public class ValueEvent { public long value; public static final EventFactory<ValueEvent> FACTORY = ValueEvent::new; }.',
'Create the Disruptor: Disruptor<ValueEvent> disruptor = new Disruptor<>(ValueEvent.FACTORY, 1024, DaemonThreadFactory.INSTANCE);.',
'Add event handler: disruptor.handleEventsWith((event, sequence, endOfBatch) -> { /* process event */ });.',
'Start the Disruptor: RingBuffer<ValueEvent> ringBuffer = disruptor.start();.',
'Publish events: long seq = ringBuffer.next(); try { ringBuffer.get(seq).value = 42; } finally { ringBuffer.publish(seq); }.',
'Benchmark: Publish 10M events. Measure throughput (events/sec) and p99 latency.',
'Compare with ArrayBlockingQueue: same 10M events, measure throughput. Expect Disruptor to be 5-10x faster.',
'Compile and execute: javac -cp disruptor.jar DisruptorDemo.java && java -cp .:disruptor.jar DisruptorDemo.'
],
goal: 'You built a lock-free ring buffer event system, understood mechanical sympathy principles, and benchmarked Disruptor against standard queues.'
},
[
q('Why is the Disruptor faster than ArrayBlockingQueue?', ['It uses faster Java code', 'It eliminates locks, pre-allocates memory, pads cache lines to prevent false sharing, and uses bitwise indexing — all hardware-aware optimizations', 'It runs on a separate CPU', 'It uses compression'], 1, 'Disruptor eliminates: lock contention (lock-free CAS), memory allocation (pre-allocated ring), false sharing (cache line padding), and slow modulo (bitwise AND). These are hardware-level optimizations. Why others are wrong: It does not use separate CPUs or compression. The speed comes from mechanical sympathy.'),
q('What is "mechanical sympathy" in systems programming?', ['Being nice to your hardware', 'Designing software data structures and algorithms to align with CPU hardware behavior (cache lines, branch prediction, prefetching)', 'Using mechanical keyboards', 'Writing code in assembly language'], 1, 'Mechanical sympathy (coined by Martin Thompson of LMAX) means understanding how the CPU actually works and designing software to exploit hardware behavior: cache locality, branch prediction, prefetching, SIMD. Why others are wrong: It is not about kindness, keyboards, or assembly language.'),
q('Why does the Disruptor use power-of-2 buffer sizes?', ['To save memory', 'Because sequence & (size - 1) is faster than sequence % size for computing the slot index', 'Because CPUs prefer powers of 2', 'It is a random choice'], 1, 'Bitwise AND with (size-1) is equivalent to modulo for power-of-2 sizes but executes in 1 CPU cycle instead of 20-40 cycles for integer division. Why others are wrong: It does not save memory. CPUs do not prefer powers of 2 inherently. It is a deliberate performance optimization.'),
q('What is the trade-off of using BusySpinWaitStrategy in the Disruptor?', ['It uses less memory', 'It achieves the lowest possible latency but consumes 100% CPU even when idle', 'It is the safest strategy', 'It works only on single-core machines'], 1, 'BusySpinWaitStrategy spins the CPU continuously checking for new events — zero latency but 100% CPU consumption. Use only when latency is critical and CPU resources are abundant. Why others are wrong: It does not save memory, is not the safest (BlockingWait is), and works on multi-core.'),
q('How does the LMAX Exchange handle 6 million orders per second with a single thread?', ['It uses a very fast CPU', 'It eliminates ALL concurrency in the business logic — one thread processes events sequentially from a lock-free ring buffer, with I/O handled by separate network threads', 'It uses 6 million threads', 'It compresses the orders'], 1, 'LMAX\'s key insight: concurrency bugs and lock overhead are eliminated by making the core business logic single-threaded. Network I/O is handled by separate threads that feed events into the Disruptor ring buffer. Why others are wrong: CPU speed alone cannot achieve 6M/sec. It does not use millions of threads or compression.')
],
[
'Disruptor eliminates locks, allocation, false sharing, and slow modulo — all via hardware-aware design.',
'Ring buffers use pre-allocated slots and bitwise indexing for zero-allocation, O(1) access.',
'Mechanical sympathy: pad cache lines, align data with CPU prefetching, avoid branch mispredictions.',
'Consumer dependency graphs enable complex event processing pipelines without locks.',
'LMAX processes 6M orders/sec single-threaded by eliminating concurrency in the business logic.'
],
'This Expert Track lab requires JDK 21+ and Maven. Use your native terminal for benchmarking. Run with -XX:-RestrictContended to enable @Contended padding.'
),

L(
'javax-10', 10, 'ForkJoinPool Internals & Work-Stealing', '🔀',
'🔀 The ForkJoinPool is the engine behind parallel streams, CompletableFuture.supplyAsync(), and virtual thread carriers (Project Loom). Unlike standard thread pools that use a shared queue, ForkJoinPool gives EACH worker thread its own deque. Idle workers STEAL tasks from busy workers\' deques. This work-stealing algorithm minimizes contention and maximizes CPU utilization for divide-and-conquer workloads.',
[
{
title: '1. ForkJoinPool Architecture',
beginner: 'A normal thread pool has one shared queue. All workers fight over it. ForkJoinPool gives each worker its OWN double-ended queue (deque). Workers push and pop from their own deque. When a worker runs out of work, it sneaks over to another worker\'s deque and STEALS from the opposite end.',
advanced: 'ForkJoinPool architecture: (1) Worker threads: array of ForkJoinWorkerThread, each with a WorkQueue (deque). (2) Work-stealing: idle workers scan other queues and steal from the TAIL (owner pops from HEAD). (3) Submission queue: external tasks enter via a shared submission queue. (4) Common pool: ForkJoinPool.commonPool() is the default for parallel streams. (5) ManagedBlocker: allows blocking operations without starving the pool. Pool size: Runtime.availableProcessors() - 1 by default.'
},
{
title: '2. RecursiveTask & RecursiveAction',
beginner: 'To use ForkJoinPool, you write a task that says: "If the job is small enough, do it directly. If not, split it into two halves, fork both halves, and join the results." This is the divide-and-conquer pattern.',
advanced: 'RecursiveTask<V> returns a result. RecursiveAction does not. Both extend ForkJoinTask. Pattern: if (problem.size() <= THRESHOLD) { return solveDirectly(); } else { left = new SubTask(firstHalf); right = new SubTask(secondHalf); left.fork(); return right.compute() + left.join(); }. fork() pushes the subtask onto the current worker\'s deque. join() blocks until the result is available (or steals work while waiting). compute() executes synchronously. The THRESHOLD is critical: too small = overhead dominates, too large = poor parallelism.'
},
{
title: '3. Work-Stealing Algorithm',
beginner: 'When a worker finishes all its tasks, it does not just sit idle. It randomly picks another worker\'s deque and tries to steal from the TAIL (the oldest task). The owner works from the HEAD (newest tasks). This means the thief and the owner rarely collide.',
advanced: 'Work-stealing details: (1) Owner pushes/pops from HEAD (LIFO — cache-friendly, recent tasks are hot). (2) Thief steals from TAIL (FIFO — oldest tasks, likely largest, most divisible). (3) Stealing uses CAS on the deque base — lock-free. (4) Random victim selection: reduces contention between multiple thieves. (5) Steal attempts: up to 2 scans before parking. (6) Compensation threads: if all workers are blocked in join(), the pool creates a temporary compensation thread to maintain parallelism level.'
},
{
title: '4. Parallel Streams & ForkJoinPool Integration',
beginner: 'When you call .parallelStream(), Java automatically uses the common ForkJoinPool to split your data across all CPU cores. The stream is divided into chunks, each chunk is processed in parallel, and results are merged.',
advanced: 'parallelStream() uses ForkJoinPool.commonPool(). Spliterator.trySplit() divides the data source. AbstractPipeline evaluates the pipeline in parallel: (1) Spliterator splits into chunks. (2) Each chunk is wrapped in a ForkJoinTask. (3) Tasks are submitted to the common pool. (4) Results are merged via the combiner function. CRITICAL: The common pool is SHARED across the entire JVM. Blocking operations in parallel streams starve other parallel operations. Use custom ForkJoinPool for isolation: new ForkJoinPool(8).submit(() -> list.parallelStream()...).'
},
{
title: '5. Project Loom: Virtual Threads on ForkJoinPool (Expert Teaser)',
beginner: 'Project Loom (Java 21) uses ForkJoinPool as the CARRIER for virtual threads. Millions of virtual threads are multiplexed onto a small number of carrier threads (platform threads). When a virtual thread blocks, it is unmounted from the carrier, and another virtual thread is mounted.',
advanced: '(Expert Teaser) Project Loom architecture: (1) Virtual threads are scheduled onto carrier threads (ForkJoinPool workers). (2) When a virtual thread blocks (I/O, sleep, lock), it is UNMOUNTED: its stack is copied to the heap, and the carrier is freed. (3) When unblocked, the virtual thread is REMOUNTED on any available carrier. (4) Continuations: stack frames are stored as heap-allocated objects. (5) Pinning: synchronized blocks PIN the virtual thread to the carrier (cannot unmount). Use ReentrantLock instead. In the Expert track, we explore: how to tune the carrier pool size, how to detect pinning via JFR events, how structured concurrency integrates with ForkJoinPool, and how virtual threads change the calculus of thread-per-request architectures.'
}
],
{
title: '🔀 Lab: ForkJoinPool Fibonacci & Work-Stealing Visualization',
intro: '⚠️ NOTE: Build a recursive Fibonacci calculator using ForkJoinPool, visualize work-stealing behavior, and compare with sequential execution.',
steps: [
'Create ForkJoinDemo.java. Import java.util.concurrent.*.',
'Create a RecursiveTask: class FibonacciTask extends RecursiveTask<Long> { private final int n; protected Long compute() { if (n <= 1) return (long) n; FibonacciTask left = new FibonacciTask(n - 1); FibonacciTask right = new FibonacciTask(n - 2); left.fork(); return right.compute() + left.join(); } }.',
'Create the pool: ForkJoinPool pool = new ForkJoinPool(4);.',
'Submit the task: long result = pool.invoke(new FibonacciTask(40));.',
'Print the result and pool stats: System.out.println("Result: " + result); System.out.println("Steal count: " + pool.getStealCount());.',
'Compare with sequential: measure time for iterative Fibonacci vs ForkJoinPool.',
'Test with parallel stream: long sum = LongStream.rangeClosed(1, 10_000_000).parallel().sum();.',
'Print common pool info: System.out.println("Common pool parallelism: " + ForkJoinPool.commonPool().getParallelism());.',
'Compile and execute: javac ForkJoinDemo.java && java ForkJoinDemo.'
],
goal: 'You built a divide-and-conquer task using ForkJoinPool, understood work-stealing mechanics, and compared parallel vs sequential performance.'
},
[
q('How does work-stealing in ForkJoinPool reduce contention compared to a shared queue?', ['It uses locks more efficiently', 'Each worker has its own deque; idle workers steal from the TAIL of other workers\' deques, while owners pop from the HEAD — minimizing collision points', 'It uses a single global lock', 'It eliminates all synchronization'], 1, 'Work-stealing distributes contention: owner works from HEAD, thief steals from TAIL. CAS on deque base is the only synchronization. Random victim selection further reduces contention. Why others are wrong: It does not use locks more efficiently. It does not use a global lock. It does not eliminate all synchronization (CAS is still needed).'),
q('What is the purpose of the THRESHOLD in a RecursiveTask?', ['It limits the number of threads', 'It determines when to stop splitting and solve the problem directly — too small causes overhead, too large causes poor parallelism', 'It sets the maximum recursion depth', 'It controls the garbage collector'], 2, 'The THRESHOLD is the base case for divide-and-conquer. Below THRESHOLD, solve directly (sequential). Above THRESHOLD, fork subtasks. Optimal THRESHOLD balances parallelism gains against fork/join overhead. Why others are wrong: It does not limit threads, set recursion depth, or control GC.'),
q('Why does the thief steal from the TAIL while the owner pops from the HEAD?', ['To confuse the thief', 'The TAIL contains the oldest (largest, most divisible) tasks; the HEAD contains the newest (hottest in cache) tasks — this minimizes contention and maximizes cache locality', 'It is a random choice', 'To prevent deadlocks'], 1, 'Owner pops from HEAD (LIFO): recent tasks are likely in CPU cache, and small tasks complete quickly. Thief steals from TAIL (FIFO): oldest tasks are likely the largest, most divisible, giving the thief more work before needing to steal again. Why others are wrong: It is not random or for deadlock prevention.'),
q('What happens when all ForkJoinPool workers are blocked in join()?', ['The pool shuts down', 'The pool creates a temporary compensation thread to maintain the target parallelism level', 'All tasks are cancelled', 'The JVM throws an exception'], 1, 'Compensation threads: if all workers are blocked waiting in join(), the pool spawns a temporary thread to maintain parallelism. This prevents thread starvation in divide-and-conquer workloads. Why others are wrong: The pool does not shut down, cancel tasks, or throw exceptions.'),
q('How does Project Loom use ForkJoinPool for virtual threads?', ['Virtual threads replace ForkJoinPool', 'ForkJoinPool workers act as CARRIER threads — virtual threads are mounted/unmounted on carriers as they block/unblock', 'ForkJoinPool is deprecated in Loom', 'Virtual threads run on a separate pool'], 1, 'Loom uses ForkJoinPool workers as carrier threads. When a virtual thread blocks, it is unmounted (stack copied to heap), freeing the carrier. When unblocked, it is remounted on any available carrier. Why others are wrong: ForkJoinPool is not replaced or deprecated. Virtual threads do not run on a separate pool.')
],
[
'ForkJoinPool gives each worker its own deque — idle workers steal from busy workers\' TAIL.',
'RecursiveTask/RecursiveAction implement divide-and-conquer with fork/join/compute.',
'THRESHOLD balances parallelism gains against fork/join overhead.',
'parallelStream() uses the common ForkJoinPool — blocking operations starve other parallel work.',
'Project Loom uses ForkJoinPool workers as carriers for millions of virtual threads.'
],
'This Expert Track lab requires JDK 21+. Use your native terminal for compilation and benchmarking.'
),

// ═══════════════════════════════════════════
// JAVA EXPERT TRACK — PART 3: PERFORMANCE ENGINEERING
// ═══════════════════════════════════════════

L(
'javax-11', 11, 'JFR Deep Dive & Flame Graph Mastery', '🔥',
'🔥 You cannot optimize what you cannot measure. Java Flight Recorder (JFR) is the JVM\'s built-in, always-on, ultra-low-overhead profiling system. It records over 500 event types: method execution, memory allocation, GC pauses, thread locks, I/O operations, and compiler activity. Combined with flame graph visualization, JFR transforms performance debugging from guesswork into surgical precision. This is the primary tool used by performance engineers at Netflix, LinkedIn, and Amazon.',
[
{
title: '1. JFR Architecture & Event Types',
beginner: 'JFR is like a black box flight recorder for your JVM. It is always recording (with <2% overhead), capturing every method call, every memory allocation, every GC pause, and every thread lock. When a performance incident occurs, you download the recording and analyze exactly what happened.',
advanced: 'JFR architecture: (1) Event framework: 500+ event types (jdk.ExecutionSample, jdk.ObjectAllocationInNewTLAB, jdk.GarbageCollection, jdk.ThreadPark, jdk.FileRead, jdk.SocketRead). (2) Ring buffer: events stored in circular memory buffer, flushed to disk periodically. (3) Configuration profiles: default.jfc (low overhead, ~1%), profile.jfc (detailed, ~2-5%). (4) Stack depth: -XX:FlightRecorderOptions=stackdepth=128. Enable: -XX:StartFlightRecording=duration=60s,filename=rec.jfr,settings=profile. Dump running: jcmd <pid> JFR.dump filename=rec.jfr. JFR is open-source since JDK 11 (JEP 328).'
},
{
title: '2. Flame Graph Interpretation',
beginner: 'A flame graph is a visualization of where your CPU time is spent. Each horizontal bar is a method. Wider bars = more time spent. Bars stacked vertically show the call chain. The "flames" at the top are the leaf methods where time is actually consumed. Find the widest flame at the top — that is your bottleneck!',
advanced: 'Flame graph anatomy: X-axis = percentage of samples (NOT time order). Y-axis = call stack depth. Each rectangle = a stack frame. Width proportional to sample count. Color is arbitrary (warm palette). Interpretation: (1) Wide plateaus at top = CPU hotspots. (2) Wide bases with narrow tops = deep call chains (framework overhead). (3) Flat wide bars in java.* = JVM internals (GC, JIT). Generate: jfr print --events jdk.ExecutionSample rec.jfr | flamegraph.pl > cpu.svg. Or use JDK Mission Control (JMC) GUI. Allocation flame graphs: use jdk.ObjectAllocationInNewTLAB events to find memory hotspots. Lock flame graphs: use jdk.JavaMonitorEnter to find contention.'
},
{
title: '3. Allocation Profiling & GC Diagnosis',
beginner: 'If your application is slow because of garbage collection, you need to find WHERE the garbage is being created. JFR records every allocation above a threshold. The allocation flame graph shows you exactly which methods are creating the most garbage, so you can fix the source instead of just tuning the GC.',
advanced: 'JFR allocation events: jdk.ObjectAllocationInNewTLAB (allocation triggering new Thread-Local Allocation Buffer) and jdk.ObjectAllocationOutsideTLAB (large allocations). TLAB size: -XX:TLABSize (default ~256KB). Sampling: JFR records allocations that trigger TLAB refill — this is a statistical sample, not exhaustive. For exhaustive allocation tracking, use async-profiler with -e alloc. GC diagnosis: jdk.GarbageCollection event provides pause time, cause, heap before/after. Correlate with jdk.G1HeapRegionTypeChange for G1 region analysis. Common findings: (1) String concatenation in loops → use StringBuilder. (2) Boxing in streams → use IntStream. (3) Temporary collections → reuse buffers.'
},
{
title: '4. Thread Contention & Lock Analysis',
beginner: 'When multiple threads fight over the same lock, they waste time waiting. JFR records every lock acquisition, every thread park, and every monitor wait. The lock flame graph shows you exactly which locks are causing the most contention, so you can redesign your synchronization strategy.',
advanced: 'JFR contention events: jdk.JavaMonitorEnter (synchronized block contention), jdk.ThreadPark (LockSupport.park / ReentrantLock), jdk.JavaMonitorWait (Object.wait). Each event records: monitor class, lock owner thread, wait time, stack trace. Analysis: sort by total wait time to find the hottest lock. Common patterns: (1) Single global lock → use striped locks (LongAdder pattern) or ConcurrentHashMap. (2) Lock on shared collection → use concurrent collection. (3) Lock on String literal → use private final Object lock. async-profiler lock mode: -e lock generates lock contention flame graphs directly.'
},
{
title: '5. Continuous Profiling in Production (Expert Teaser)',
beginner: 'The best time to profile is when the problem happens in production, not when you try to reproduce it in your test environment. Continuous profiling keeps JFR recording 24/7 with minimal overhead, automatically uploading recordings to a central server for analysis.',
advanced: '(Expert Teaser) Continuous profiling architecture: (1) JFR with -XX:StartFlightRecording=maxsize=500m,maxage=24h,disk=true — rolling 24-hour buffer. (2) Agent-based upload: custom JFR event streaming via jdk.jfr.consumer.RecordingStream. (3) Centralized storage: recordings uploaded to S3/GCS for fleet-wide analysis. (4) Alerting: automated detection of GC pause spikes, allocation storms, or lock contention. (5) Datadog/ Dynatrace/ New Relic all use JFR under the hood for their APM agents. In the Expert track, we build a custom continuous profiling pipeline using RecordingStream + Kafka, enabling real-time flame graph generation for production incidents.'
}
],
{
title: '🔥 Lab: JFR Recording & Flame Graph Generation',
intro: '⚠️ NOTE: Run a CPU-intensive workload under JFR, generate flame graphs, and identify the top CPU hotspots and allocation sources.',
steps: [
'Create a CPU-intensive workload: Burner.java that performs 100M string concatenations, 50M ArrayList allocations, and 10M synchronized lock acquisitions.',
'Run with JFR enabled: java -XX:StartFlightRecording=duration=30s,filename=burner.jfr,settings=profile Burner.',
'Analyze with JDK Mission Control: Open burner.jfr in JMC. Navigate to Method Profiling tab. Identify top 5 hotspots.',
'Generate flame graph CLI: jfr print --events jdk.ExecutionSample --stack-depth 64 burner.jfr > samples.txt.',
'Use async-profiler for comparison: asprof -d 30 -f cpu.svg <pid>. Compare flame graphs.',
'Analyze allocations: jfr print --events jdk.ObjectAllocationInNewTLAB burner.jfr | grep -c "java.lang.String". Count String allocations.',
'Analyze lock contention: jfr print --events jdk.JavaMonitorEnter burner.jfr. Identify the most contended lock.',
'BONUS: Compare JFR overhead vs async-profiler overhead using System.nanoTime() timing.'
],
goal: 'You captured a production JFR recording, generated CPU/allocation/lock flame graphs, and identified the top performance bottlenecks in a real workload.'
},
[
q('What is the typical overhead of Java Flight Recorder (JFR) with the default configuration?', ['0% (no overhead)', '~1% CPU overhead with default.jfc profile', '~10% CPU overhead', '~50% CPU overhead'], 1, 'JFR default profile (default.jfc) adds approximately 1% CPU overhead. The profile.jfc configuration adds 2-5%. This makes JFR suitable for always-on production profiling. Why others are wrong: Zero overhead is impossible. 10% or 50% would be unacceptable for production.'),
q('In a flame graph, what does the WIDTH of a horizontal bar represent?', ['The execution time in milliseconds', 'The percentage of samples (CPU time) spent in that method and its children', 'The number of threads calling the method', 'The memory allocated by the method'], 1, 'Flame graph X-axis = sample count (proportional to CPU time). Width represents the fraction of total samples where that method appears in the call stack. It is NOT a timeline. Why others are wrong: It is not absolute time, thread count, or memory.'),
q('Which JFR event type records memory allocations that trigger a new Thread-Local Allocation Buffer?', ['jdk.ExecutionSample', 'jdk.ObjectAllocationInNewTLAB', 'jdk.GarbageCollection', 'jdk.ThreadPark'], 1, 'jdk.ObjectAllocationInNewTLAB fires when an allocation cannot fit in the current TLAB and triggers a new TLAB allocation. This is the primary allocation profiling event. jdk.ObjectAllocationOutsideTLAB covers large allocations exceeding TLAB size. Why others are wrong: ExecutionSample is CPU profiling. GarbageCollection is GC events. ThreadPark is lock contention.'),
q('What does a wide plateau at the TOP of a flame graph indicate?', ['Framework overhead', 'A CPU hotspot — the leaf method where most CPU time is actually spent', 'Garbage collection pause', 'Thread contention'], 1, 'The top of the flame graph represents leaf methods (where the CPU is actually executing). Wide bars at the top indicate methods consuming the most CPU time — these are your optimization targets. Why others are wrong: Framework overhead appears as wide bases. GC appears in java.* frames. Contention appears in lock/park events.'),
q('How do you dump a JFR recording from a RUNNING JVM without restarting it?', ['Restart the JVM with -XX:DumpOnExit', 'jcmd <pid> JFR.dump filename=recording.jfr', 'Kill the process and read the log file', 'Use System.gc() to trigger a dump'], 1, 'jcmd <pid> JFR.dump triggers an immediate dump of the in-memory JFR ring buffer to a file without stopping the JVM. This is critical for production incident diagnosis. Why others are wrong: Restart loses the recording. Kill loses data. System.gc() is unrelated.')
],
[
'JFR provides always-on, <2% overhead profiling with 500+ event types.',
'Flame graphs visualize CPU/allocation/lock hotspots — width = sample percentage, height = stack depth.',
'Use jdk.ObjectAllocationInNewTLAB events to find garbage creation sources.',
'Use jdk.JavaMonitorEnter events to identify lock contention bottlenecks.',
'jcmd <pid> JFR.dump enables live production recording dumps without restart.'
],
'This Expert Track lab requires JDK 21+ with JFR enabled (default since JDK 11). Use your native terminal for JFR recording and analysis. JDK Mission Control (JMC) is available from Oracle or Adoptium.'
),

L(
'javax-12', 12, 'JMH Scientific Benchmarking', '📊',
'📊 Microbenchmarking is deceptively difficult. Naive timing with System.nanoTime() produces garbage results due to JIT warmup, dead code elimination, loop optimizations, and OS scheduling noise. JMH (Java Microbenchmark Harness) is the gold-standard framework developed by the OpenJDK team to eliminate these pitfalls. If you are making performance decisions without JMH, you are guessing.',
[
{
title: '1. JMH Architecture & Annotation Model',
beginner: 'JMH is a framework for writing tiny, isolated performance tests. You annotate a method with @Benchmark, and JMH handles everything: warming up the JIT, running millions of iterations, forking separate JVMs, and computing statistically valid results with error bars.',
advanced: 'JMH architecture: (1) Annotation processing: @Benchmark, @BenchmarkMode, @OutputTimeUnit, @Warmup, @Measurement, @Fork, @State, @Setup, @TearDown, @Param. (2) Code generation: JMH generates benchmark harness code at compile time via annotation processor. (3) Fork isolation: each @Fork launches a SEPARATE JVM process, eliminating cross-benchmark JIT pollution. (4) Blackhole: prevents dead code elimination by consuming results. (5) Statistical output: mean, standard deviation, confidence intervals. JMH is built by the OpenJDK performance team (Aleksey Shipilëv).'
},
{
title: '2. Avoiding Benchmarking Pitfalls',
beginner: 'There are five deadly sins of benchmarking: (1) Not warming up the JIT, (2) Letting the JVM delete your benchmark code (dead code elimination), (3) Measuring cold code, (4) Running benchmarks in the same JVM (JIT pollution), (5) Not using statistical analysis. JMH protects you from all five.',
advanced: 'Pitfall solutions: (1) JIT warmup: @Warmup(iterations=5, time=1) runs 5 warmup iterations before measurement. (2) Dead code elimination: Blackhole.consume(result) or return result from @Benchmark method. (3) Cold code: warmup ensures JIT compilation before measurement. (4) JIT pollution: @Fork(2) runs each benchmark in 2 separate JVM forks. (5) Statistics: @Measurement(iterations=10) produces 10 measurement iterations for confidence intervals. Additional pitfalls: (6) Loop overhead: use @OperationsPerInvocation. (7) Constant folding: use @Param or @State to prevent compile-time evaluation.'
},
{
title: '3. Benchmark Modes & Throughput vs Latency',
beginner: 'JMH can measure different things: Mode.Throughput counts how many operations per second. Mode.AverageTime measures the average time per operation. Mode.SampleTime gives you the full latency distribution (p50, p99, p999). Choose the right mode for your optimization goal.',
advanced: 'BenchmarkMode options: (1) Mode.Throughput: ops/time — maximize for batch processing. (2) Mode.AverageTime: time/op — minimize for request handling. (3) Mode.SampleTime: samples the time per operation, producing a latency distribution (p50, p90, p99, p999, p9999, max). (4) Mode.SingleShotTime: measures a single execution (useful for cold-start benchmarks). For microservices, p99 latency (SampleTime) matters more than throughput. For data pipelines, throughput matters more. Always report BOTH throughput and p99 for complete analysis.'
},
{
title: '4. Parameterized Benchmarks & State Management',
beginner: 'You often need to benchmark the same code with different inputs (list sizes, thread counts, data types). JMH\'s @Param annotation automatically runs your benchmark with every parameter value. @State manages shared setup data across benchmark iterations.',
advanced: '@Param({"10", "100", "1000"}) generates separate benchmark runs for each value. @State(Scope.Thread) creates per-thread state (each thread gets its own instance). @State(Scope.Benchmark) creates shared state (all threads share one instance). @Setup(Level.Trial) runs once before all iterations. @Setup(Level.Iteration) runs before each measurement iteration. @Setup(Level.Invocation) runs before EVERY method call (expensive — use sparingly). State classes must be public and have a public no-arg constructor. JMH instantiates state via reflection.'
},
{
title: '5. Performance Regression Testing in CI/CD (Expert Teaser)',
beginner: 'The best benchmarks are the ones that run automatically on every code commit. If a developer accidentally makes a function 20% slower, the CI pipeline should catch it and block the merge. This is called performance regression testing.',
advanced: '(Expert Teaser) CI/CD performance testing: (1) Run JMH benchmarks in CI (GitHub Actions, Jenkins) on every PR. (2) Store results in a time-series database (InfluxDB, Prometheus). (3) Compare against baseline: fail the build if regression > 5%. (4) Use JMH JSON output format (-rf json) for automated parsing. (5) Alert on p99 latency regressions for API endpoints. Challenges: CI machine variability (use dedicated bare-metal runners), warmup consistency (fixed iteration counts), and statistical significance (use Mann-Whitney U test). In the Expert track, we build a complete performance regression pipeline with JMH + InfluxDB + Grafana dashboards + automated PR comments showing regression charts.'
}
],
{
title: '📊 Lab: JMH Benchmark Suite & Statistical Analysis',
intro: '⚠️ NOTE: Build a JMH benchmark comparing ArrayList vs LinkedList traversal, measure throughput and p99 latency, and generate statistically valid results.',
steps: [
'Create a Maven project with JMH dependency: <groupId>org.openjdk.jmh</groupId> <artifactId>jmh-core</artifactId> <version>1.37</version>.',
'Create ListBenchmark.java. Annotate class with @BenchmarkMode({Mode.Throughput, Mode.SampleTime}) and @OutputTimeUnit(TimeUnit.MILLISECONDS).',
'Add @State(Scope.Thread): Setup method creates ArrayList<Integer> and LinkedList<Integer> with 10,000 elements.',
'Write @Benchmark public int arrayListTraversal(State s): iterate ArrayList by index, sum elements. Return sum (prevents dead code elimination).',
'Write @Benchmark public int linkedListTraversal(State s): iterate LinkedList with enhanced for-each. Return sum.',
'Add @Param({"1000", "10000", "100000"}) to test different list sizes.',
'Configure: @Warmup(iterations=3, time=1), @Measurement(iterations=5, time=1), @Fork(2).',
'Run: java -jar target/benchmarks.jar -rf json -rf results.json.',
'Analyze results.json: Compare throughput and p99 latency between ArrayList and LinkedList at each size.'
],
goal: 'You built a scientifically valid JMH benchmark, measured throughput and latency distributions, and compared data structure performance with statistical confidence.'
},
[
q('Why is System.nanoTime() timing in a simple loop insufficient for accurate benchmarking?', ['It is too slow to measure nanoseconds', 'It does not account for JIT warmup, dead code elimination, loop optimizations, or OS scheduling noise', 'It only works on Windows', 'It measures wall-clock time instead of CPU time'], 1, 'Naive timing suffers from: (1) JIT not warmed up (measuring interpreter speed), (2) JIT may eliminate dead code, (3) loop overhead included, (4) OS context switches add noise, (5) no statistical analysis. JMH solves all five. Why others are wrong: nanoTime is fast enough. It works on all OS. CPU vs wall-clock is not the primary issue.'),
q('What does the @Fork annotation do in JMH?', ['It creates multiple threads for parallel execution', 'It launches separate JVM processes for each benchmark to prevent JIT compilation pollution between benchmarks', 'It forks the operating system process', 'It splits the benchmark into multiple files'], 1, '@Fork(2) runs the benchmark in 2 completely separate JVM processes. Each fork has its own JIT compiler state, preventing cross-benchmark optimization pollution. Results are aggregated across forks. Why others are wrong: It is not threads (use @Threads). It does not fork the OS. It does not split files.'),
q('What is the purpose of Blackhole in JMH benchmarks?', ['To measure memory allocation', 'To consume benchmark results and prevent the JIT compiler from eliminating dead code', 'To create a memory leak for testing', 'To simulate network latency'], 1, 'If a @Benchmark method computes a result but does not use it, the JIT compiler may eliminate the entire computation (dead code elimination). Blackhole.consume(result) or returning the result prevents this optimization, ensuring the measured code actually executes. Why others are wrong: It does not measure memory, create leaks, or simulate network.'),
q('Which JMH BenchmarkMode should you use to measure the p99 latency distribution of an operation?', ['Mode.Throughput', 'Mode.AverageTime', 'Mode.SampleTime', 'Mode.SingleShotTime'], 2, 'Mode.SampleTime samples the time per operation and produces a full latency distribution: p50, p90, p99, p999, p9999, max. This is critical for API latency SLAs. Why others are wrong: Throughput measures ops/sec. AverageTime gives only the mean. SingleShotTime measures one cold execution.'),
q('Why must @State classes in JMH be public with a public no-arg constructor?', ['For security reasons', 'Because JMH instantiates state objects via reflection at benchmark startup', 'To enable serialization', 'Because Java requires all classes to be public'], 1, 'JMH uses reflection to instantiate @State classes before benchmark execution. The class must be public (accessible to the generated harness) and have a public no-arg constructor (reflection newInstance). Why others are wrong: It is not security, serialization, or a general Java requirement.')
],
[
'JMH eliminates benchmarking pitfalls: JIT warmup, dead code elimination, fork isolation, statistical analysis.',
'Use @Fork(2+) to prevent JIT pollution between benchmarks.',
'Use Blackhole.consume() or return results to prevent dead code elimination.',
'Mode.SampleTime provides p99 latency distributions — critical for API SLAs.',
'@Param enables automated multi-value benchmarking; @State manages setup data.'
],
'This Expert Track lab requires JDK 21+ and Maven. Use your native terminal for JMH execution. JMH requires annotation processing — ensure maven-shade-plugin or jmh-generator is configured.'
),

// ═══════════════════════════════════════════
// JAVA EXPERT TRACK — PART 3 CONTINUED (javax-13, 14, 15)
// ═══════════════════════════════════════════

L(
'javax-13', 13, 'Mechanical Sympathy: CPU Cache & Branch Prediction', '🔧',
'🔧 Software runs on hardware. Ignoring hardware behavior is like writing a race car engine without understanding combustion. Mechanical sympathy — a term coined by Martin Thompson of LMAX — means designing software that aligns with CPU architecture: cache hierarchies, branch predictors, prefetchers, and instruction pipelines. This lesson reveals why seemingly identical code can differ in performance by 100x.',
[
{
title: '1. CPU Cache Hierarchy (L1, L2, L3)',
beginner: 'Your CPU has tiny, super-fast memories called caches. L1 is the fastest (~1ns) but smallest (32-64KB). L2 is a bit slower (~4ns) but bigger (256KB-1MB). L3 is shared across cores (~12ns, 8-32MB). Main RAM is ~100ns. If your data is in L1, it is 100x faster than if it is in RAM!',
advanced: 'Cache hierarchy: L1d (data, per-core, 32-64KB, ~1ns), L1i (instruction, per-core), L2 (per-core, 256KB-1MB, ~4ns), L3 (shared, 8-32MB, ~12ns), RAM (~100ns). Caches operate on cache LINES (typically 64 bytes on x86). When the CPU reads address 0x1000, it loads the entire 64-byte line (0x1000-0x103F) into cache. Spatial locality: accessing nearby addresses is nearly free. Temporal locality: re-accessing the same address hits cache. Cache misses are the #1 performance bottleneck in data-intensive applications.'
},
{
title: '2. Cache Line Padding & False Sharing',
beginner: 'If two threads update different variables that sit on the same 64-byte cache line, the CPU must constantly invalidate and reload that line between cores. The threads are not sharing data, but they ARE sharing a cache line. This is False Sharing, and it can make your code 100x slower!',
advanced: 'False sharing: two cores write to different variables on the same cache line. MESI protocol: Core A writes → invalidates Core B\'s copy → Core B must reload the line. This ping-pong occurs at ~100ns per invalidation. Solution: (1) Manual padding: add 7 unused longs between variables (7 * 8 = 56 bytes + 8 = 64 bytes = 1 cache line). (2) @jdk.internal.vm.annotation.Contended: automatic padding. Requires -XX:-RestrictContended. LongAdder uses @Contended on Cell class. JMH benchmarks: false sharing can cause 10-100x throughput degradation.'
},
{
title: '3. Branch Prediction & Pipeline Stalls',
beginner: 'Your CPU is a pipeline: it fetches, decodes, and executes instructions in an assembly line. When it hits an if-statement, it must GUESS which way the branch goes. If it guesses wrong, it must flush the pipeline and restart — costing 10-20 cycles. Sorted data is predictable; random data is not!',
advanced: 'Branch prediction: modern CPUs use 2-level adaptive predictors with pattern history tables (PHT). Prediction accuracy: >95% for sorted/patterned data, ~50% for random data. Misprediction penalty: 10-20 cycles (pipeline flush). Example: summing array elements with if (x > 128) is 6x faster on sorted data vs random data (same elements). Branchless programming: use conditional moves (CMOV), bitwise arithmetic, or predication to eliminate branches. Java: Math.max(a, b) compiles to CMOV on x86. Avoid branches in hot loops.'
},
{
title: '4. Data-Oriented Design & Cache Locality',
beginner: 'Instead of storing objects scattered across memory (like a linked list), store data in contiguous arrays. The CPU can prefetch entire cache lines, processing 8-16 elements at once. This is called Data-Oriented Design, and it is the secret behind game engines and high-performance databases.',
advanced: 'Data-oriented design: (1) Structure of Arrays (SoA) instead of Array of Structures (AoS). Instead of Player[] with x,y,z,hp fields, use float[] x, float[] y, float[] z, int[] hp. (2) Contiguous iteration enables hardware prefetching. (3) SIMD-friendly layouts. Java limitations: objects are scattered on heap. Solutions: primitive arrays, ByteBuffer with direct memory, Vector API, or off-heap memory via Unsafe/Foreign Memory API. Databases (ClickHouse, DuckDB) and game engines (Unity ECS, Unreal Mass) use data-oriented design.'
},
{
title: '5. Prefetching & Hardware Optimizations (Expert Teaser)',
beginner: 'Your CPU is smart enough to predict what data you will need next! It has a hardware prefetcher that automatically loads upcoming cache lines before you ask for them. But only if your access pattern is predictable (sequential, strided).',
advanced: '(Expert Teaser) Hardware prefetchers: (1) Streaming prefetcher: detects sequential access, prefetches next cache lines. (2) Stride prefetcher: detects fixed-stride patterns (e.g., every 64 bytes). (3) Spatial prefetcher: prefetches adjacent cache lines. Software prefetch: sun.misc.Unsafe.prefetchRead(address) hints the prefetcher. In the Expert track, we explore: how to measure cache misses via perf stat (Linux) or Intel VTune, how JIT compiler optimizations interact with hardware prefetching, how the Vector API exploits SIMD for cache-line-width operations, and how Project Panama\'s Foreign Memory API enables off-heap, cache-aligned data structures.'
}
],
{
title: '🔧 Lab: False Sharing Benchmark & Branch Prediction Demo',
intro: '⚠️ NOTE: Demonstrate false sharing with padded vs unpadded counters, and show branch prediction impact with sorted vs unsorted data.',
steps: [
'Create MechanicalSympathyDemo.java.',
'Demonstrate false sharing: class UnpaddedCounters { volatile long x; volatile long y; } class PaddedCounters { volatile long x; long p1,p2,p3,p4,p5,p6,p7; volatile long y; }.',
'Spawn 2 threads: Thread 1 increments x 100M times. Thread 2 increments y 100M times.',
'Measure: unpadded ~800ms, padded ~200ms. Print both times.',
'Demonstrate branch prediction: Create int[] data = new int[10_000_000] filled with random values 0-255.',
'Sum with branch: for (int v : data) if (v > 128) sum += v; Measure time.',
'Sort the array: Arrays.sort(data); Repeat the sum. Measure time.',
'Observe: sorted is 3-6x faster due to predictable branches!',
'Compile and execute: javac MechanicalSympathyDemo.java && java MechanicalSympathyDemo.'
],
goal: 'You demonstrated false sharing performance impact and branch prediction behavior, understanding how hardware affects software performance.'
},
[
q('What is a cache line on modern x86 CPUs?', ['A single byte of data', 'A 64-byte block of memory that is loaded into cache as a unit — accessing any byte in the line loads all 64 bytes', 'A 1KB memory page', 'A CPU register'], 1, 'Cache lines are 64 bytes on x86. When the CPU accesses address X, it loads bytes X through X+63 into cache. This enables spatial locality: nearby accesses are nearly free. Why others are wrong: It is not 1 byte, 1KB, or a register.'),
q('How do you eliminate false sharing between two threads updating different long variables?', ['Use synchronized blocks', 'Pad the variables to separate cache lines: add 7 unused longs between them, or use @Contended annotation', 'Use volatile variables', 'Use AtomicInteger'], 1, 'Padding separates variables onto different cache lines. 7 longs = 56 bytes + 8 bytes (the variable) = 64 bytes = 1 cache line. @Contended automates this. Why others are wrong: synchronized does not fix false sharing. volatile does not pad. AtomicInteger does not pad.'),
q('Why is summing an array with if (x > 128) faster on sorted data than random data?', ['Sorted data is smaller', 'The branch predictor can accurately predict the branch direction for sorted data (>95% accuracy), but mispredicts ~50% for random data, causing pipeline flushes', 'The JIT compiler optimizes sorted data', 'Sorted data uses less memory'], 1, 'Branch prediction accuracy determines pipeline efficiency. Sorted data: all values below 128 come first (predict not-taken), then all above (predict taken). Random data: unpredictable, ~50% misprediction rate, each costing 10-20 cycles. Why others are wrong: Data size is identical. JIT does not special-case sorted data. Memory usage is identical.'),
q('What is Data-Oriented Design?', ['Designing databases efficiently', 'Organizing data in contiguous arrays (Structure of Arrays) to maximize cache locality and enable hardware prefetching, instead of scattered objects (Array of Structures)', 'Designing UI layouts', 'Designing network protocols'], 1, 'Data-oriented design prioritizes memory layout for cache efficiency. SoA (float[] x, float[] y) enables sequential cache line access. AoS (Player[] with x,y fields) scatters fields across cache lines. Why others are wrong: It is not about databases, UI, or networks.'),
q('What does a hardware prefetcher do?', ['Downloads files from the internet', 'Automatically loads upcoming cache lines before the CPU requests them, based on detected access patterns (sequential, strided)', 'Compresses data in cache', 'Encrypts cache contents'], 1, 'Hardware prefetchers detect sequential/strided access patterns and load future cache lines proactively. This hides memory latency. Software can hint via Unsafe.prefetchRead(). Why others are wrong: It does not download, compress, or encrypt.')
],
[
'Cache lines are 64 bytes — spatial locality means nearby accesses are nearly free.',
'False sharing: pad variables to separate cache lines using @Contended or manual padding.',
'Branch prediction: sorted data is predictable (>95% accuracy); random data causes pipeline stalls.',
'Data-oriented design: use contiguous arrays (SoA) instead of scattered objects (AoS).',
'Hardware prefetchers load upcoming cache lines automatically for sequential/strided access patterns.'
],
'This Expert Track lab requires JDK 21+ and a multi-core machine. Use your native terminal for benchmarking.'
),

L(
'javax-14', 14, 'SIMD Vectorization via Vector API (Project Panama)', '🧮',
'🧮 Modern CPUs can process 4, 8, or 16 numbers in a SINGLE instruction using SIMD (Single Instruction, Multiple Data). Java traditionally cannot access this — the JIT vectorizes simple loops, but complex operations fall back to scalar code. The Vector API (Project Panama, incubating since Java 16) exposes SIMD directly, enabling 4-16x speedups for numerical workloads.',
[
{
title: '1. SIMD Fundamentals',
beginner: 'Imagine you need to add 8 pairs of numbers. Scalar code does 8 separate additions. SIMD does ALL 8 in ONE instruction! Your CPU has special registers (SSE: 128-bit, AVX2: 256-bit, AVX-512: 512-bit) that hold multiple numbers and operate on them simultaneously.',
advanced: 'SIMD (Single Instruction, Multiple Data): one instruction operates on a vector of elements. x86: MMX (64-bit), SSE (128-bit, 4 floats), SSE2 (128-bit, 2 doubles), AVX (256-bit, 8 floats), AVX2 (256-bit integers), AVX-512 (512-bit, 16 floats). ARM: NEON (128-bit), SVE (scalable). Java Vector API abstracts these: VectorSpecies<Float> SPECIES = FloatVector.SPECIES_256; selects the widest available species at runtime. The JIT maps Vector API operations to native SIMD instructions.'
},
{
title: '2. Java Vector API Basics',
beginner: 'The Vector API gives you vector types like FloatVector, IntVector, DoubleVector. You load 8 floats from an array, add them to another 8 floats, and store the result — all in 3 lines of code that compile to a single SIMD instruction!',
advanced: 'Vector API (jdk.incubator.vector): VectorSpecies<Float> SPECIES = FloatVector.SPECIES_PREFERRED; FloatVector a = FloatVector.fromArray(SPECIES, array, offset); FloatVector b = FloatVector.fromArray(SPECIES, array2, offset); FloatVector c = a.add(b); c.intoArray(result, offset); The JIT compiles this to VADDPS (AVX) or ADDPS (SSE). Operations: add, sub, mul, div, sqrt, fma (fused multiply-add), blend (conditional select), rearrange (shuffle). The API is shape-agnostic: SPECIES_256 uses 8 floats on AVX2, but falls back to 4 floats on SSE-only CPUs.'
},
{
title: '3. Vector Loops & Tail Handling',
beginner: 'Arrays are not always perfectly divisible by the vector width. If you have 100 elements and process 8 at a time, the last 4 elements need special handling. The Vector API provides masked operations to handle these "tails" safely.',
advanced: 'Vector loop pattern: int i = 0; for (; i < SPECIES.loopBound(array.length); i += SPECIES.length()) { /* process full vectors */ } for (; i < array.length; i++) { /* scalar tail */ }. Alternatively, use masked operations: VectorMask<Float> mask = SPECIES.indexInRange(i, array.length); FloatVector v = FloatVector.fromArray(SPECIES, array, i, mask); Masked operations process only valid lanes, preventing out-of-bounds access. The JIT can often auto-vectorize simple loops, but the Vector API gives explicit control for complex patterns.'
},
{
title: '4. JIT Auto-Vectorization vs Explicit Vector API',
beginner: 'The JIT compiler can automatically vectorize simple loops (like summing an array). But it is conservative — complex loops with branches, multiple arrays, or non-contiguous access are not vectorized. The Vector API gives you explicit control.',
advanced: 'JIT auto-vectorization: HotSpot C2 vectorizes simple counted loops with contiguous array access, no branches, no aliasing. Limitations: cannot vectorize across method boundaries, complex control flow, or non-contiguous access. Vector API advantages: (1) Explicit control over vector width and operations. (2) Works across method boundaries. (3) Supports complex patterns (gather/scatter, blend, rearrange). (4) Predictable performance. (5) Portable across CPU architectures (AVX2, AVX-512, NEON, SVE). Benchmark: Vector API typically achieves 80-95% of hand-written intrinsic performance.'
},
{
title: '5. Project Panama & Foreign Memory (Expert Teaser)',
beginner: 'Project Panama is Java\'s bridge to the native world. The Vector API is one part. The Foreign Function & Memory API lets you allocate off-heap memory, call C libraries directly, and access hardware features that Java normally hides.',
advanced: '(Expert Teaser) Project Panama components: (1) Vector API: SIMD operations. (2) Foreign Function & Memory API (JEP 442, Java 22 preview): allocate off-heap memory, call native functions, access memory-mapped files. (3) jextract: generates Java bindings from C headers. In the Expert track, we explore: how to use Foreign Memory API for cache-aligned off-heap data structures, how to call BLAS/LAPACK native libraries for linear algebra, how GraalVM Native Image handles Vector API operations, and how to build a complete numerical computing library in Java that rivals C/Python performance.'
}
],
{
title: '🧮 Lab: Vector API Array Addition Benchmark',
intro: '⚠️ NOTE: Build a SIMD-accelerated array addition using the Vector API and benchmark it against scalar code.',
steps: [
'Create VectorDemo.java. Add --add-modules jdk.incubator.vector to compile/run flags.',
'Import jdk.incubator.vector.*.',
'Define species: static final VectorSpecies<Float> SPECIES = FloatVector.SPECIES_PREFERRED;',
'Create scalar addition: static void addScalar(float[] a, float[] b, float[] c) { for (int i = 0; i < a.length; i++) c[i] = a[i] + b[i]; }.',
'Create vector addition: static void addVector(float[] a, float[] b, float[] c) { int i = 0; for (; i < SPECIES.loopBound(a.length); i += SPECIES.length()) { FloatVector va = FloatVector.fromArray(SPECIES, a, i); FloatVector vb = FloatVector.fromArray(SPECIES, b, i); va.add(vb).intoArray(c, i); } for (; i < a.length; i++) c[i] = a[i] + b[i]; }.',
'Benchmark: 100M element arrays, 10 iterations. Measure scalar vs vector time.',
'Expected: vector is 4-8x faster depending on CPU (SSE vs AVX2 vs AVX-512).',
'Compile: javac --add-modules jdk.incubator.vector VectorDemo.java.',
'Run: java --add-modules jdk.incubator.vector VectorDemo.'
],
goal: 'You built a SIMD-accelerated array operation using the Vector API and measured the speedup over scalar code.'
},
[
q('What does SIMD stand for and what does it enable?', ['Single Instruction, Multiple Data — one CPU instruction operates on multiple data elements simultaneously', 'System Integrated Memory Design — a memory architecture', 'Standard Input, Multiple Devices — I/O handling', 'Sequential Instruction, Multiple Delays — pipeline technique'], 0, 'SIMD enables one instruction to process 4, 8, or 16 elements simultaneously using wide CPU registers (128/256/512-bit). Why others are wrong: It is not memory design, I/O handling, or pipeline delays.'),
q('What is the width of an AVX2 SIMD register?', ['64 bits (2 floats)', '128 bits (4 floats)', '256 bits (8 floats)', '512 bits (16 floats)'], 2, 'AVX2 registers are 256 bits wide, holding 8 floats or 4 doubles simultaneously. AVX-512 is 512 bits (16 floats). SSE is 128 bits (4 floats). Why others are wrong: 64-bit is MMX. 128-bit is SSE. 512-bit is AVX-512.'),
q('How does the Vector API handle array lengths not divisible by the vector width?', ['It throws an exception', 'It uses masked operations (VectorMask) to process only valid lanes, or falls back to scalar for the tail', 'It pads the array with zeros automatically', 'It skips the remaining elements'], 1, 'Masked operations: VectorMask<Float> mask = SPECIES.indexInRange(i, length); processes only valid lanes. Alternatively, a scalar tail loop handles remaining elements. Why others are wrong: It does not throw, auto-pad, or skip.'),
q('When should you use the Vector API instead of relying on JIT auto-vectorization?', ['Always — JIT never vectorizes', 'When the JIT cannot auto-vectorize: complex loops, multiple arrays, branches, non-contiguous access, or when you need predictable performance', 'Never — JIT is always better', 'Only for integer operations'], 1, 'JIT auto-vectorization is conservative. Vector API gives explicit control for: complex patterns, cross-method vectorization, gather/scatter, blend, rearrange, and predictable performance. Why others are wrong: JIT does vectorize simple loops. Vector API is not limited to integers.'),
q('What is Project Panama?', ['A database project', 'Java\'s bridge to native code and hardware: Vector API (SIMD), Foreign Function & Memory API (off-heap, C interop), and jextract (C binding generator)', 'A web framework', 'A testing framework'], 1, 'Project Panama connects Java to the native world: Vector API for SIMD, Foreign Memory API for off-heap allocation and C library calls, jextract for generating Java bindings from C headers. Why others are wrong: It is not a database, web framework, or testing framework.')
],
[
'SIMD processes 4-16 elements per instruction using wide CPU registers (SSE/AVX2/AVX-512).',
'Vector API (jdk.incubator.vector) exposes SIMD in Java with species-based portability.',
'Use masked operations or scalar tails for array lengths not divisible by vector width.',
'Vector API gives explicit control where JIT auto-vectorization fails (complex loops, branches).',
'Project Panama bridges Java to native code: Vector API, Foreign Memory API, jextract.'
],
'This Expert Track lab requires JDK 21+ with incubator modules enabled. Use --add-modules jdk.incubator.vector flag.'
),

L(
'javax-15', 15, 'GraalVM Native Image vs JIT: Performance Analysis', '📊',
'📊 GraalVM Native Image eliminates JVM warmup by compiling Java to native machine code ahead-of-time. But this trade-off has deep implications: no runtime profiling, no dynamic class loading, no JIT optimizations. Understanding when Native Image wins (serverless, CLI, sidecars) and when JIT wins (long-running servers, dynamic workloads) is critical for cloud-native Java architecture.',
[
{
title: '1. JIT Warmup vs AOT Cold Start',
beginner: 'A JVM application starts slow (5-30 seconds) because the JIT compiler needs time to profile and optimize hot code. A Native Image starts instantly (<50ms) because all code is pre-compiled. But the JIT eventually produces FASTER code than AOT because it optimizes based on actual runtime behavior.',
advanced: 'JIT warmup: C1 compiles quickly (client compiler), C2 optimizes aggressively (server compiler). Warmup time: 5-30s for complex Spring Boot apps. Peak throughput: 100% (profile-guided). Native Image: AOT compilation via Graal compiler. Startup: <50ms. Peak throughput: ~80-90% of JIT (no runtime profiling, no on-stack replacement). Crossover point: for requests < 30s, Native Image wins (serverless, CLI). For long-running servers (>5 min), JIT wins (web servers, databases). AWS Lambda SnapStart uses CRIU checkpointing to achieve similar cold-start benefits with JVM.'
},
{
title: '2. Closed-World Analysis & Reachability',
beginner: 'The Native Image compiler must know EVERYTHING your program might do before it compiles. It traces your code starting from main() and follows every possible execution path. If it cannot see a code path (reflection, dynamic proxies, service loaders), you must declare it in configuration files.',
advanced: 'Closed-world analysis: points-to analysis, call graph construction, class initialization analysis. Reachability: only reachable code is included in the native image. Dynamic features require explicit configuration: reflect-config.json (reflection), jni-config.json (JNI), serialization-config.json (serialization), proxy-config.json (dynamic proxies), resource-config.json (classpath resources). native-image-agent traces dynamic access during test execution and generates configs automatically. Spring Boot 3 AOT plugin generates configs from Spring metadata. Undeclared dynamic access → ImageBuildError at build time or MissingReflectionRegistrationError at runtime.'
},
{
title: '3. Runtime Characteristics & Limitations',
beginner: 'Native Images are fast to start and use little memory. But they cannot load new classes at runtime, cannot use JIT optimizations, and virtual threads are not supported. You trade flexibility for speed and efficiency.',
advanced: 'Native Image runtime: (1) Startup: <50ms. (2) Memory: ~20-50MB RSS. (3) No ClassLoader.defineClass() — no dynamic class loading. (4) No runtime bytecode generation (ByteBuddy/ASM cannot create new classes). (5) No JIT — no profile-guided inlining, no on-stack replacement. (6) Virtual threads NOT supported (as of GraalVM 23). (7) GC: Serial GC (default), G1 (with --gc=G1). (8) Reflection: must be pre-configured. (9) Instrumentation: limited (no Java Agents). Use cases: serverless (Lambda, Cloud Run), CLI tools, sidecars, IoT, Kubernetes init containers.'
},
{
title: '4. Build Time & Resource Analysis',
beginner: 'Building a Native Image takes 3-15 minutes and uses 8-16GB of RAM. This is why CI/CD caching is critical. The build performs full static analysis, AOT compilation, and native linking.',
advanced: 'Build pipeline: (1) Classpath/module analysis. (2) Static analysis (points-to, call graph, class initialization). (3) Universe building (all reachable types/methods). (4) Compilation (Graal compiler → machine code). (5) Linking (native linker → ELF/Mach-O/PE executable). Build time: 3-15 min (medium apps), 30+ min (large monoliths). Memory: 8-16GB RAM. Output: single binary (~20-100MB). Optimizations: -O2 (default), -O3 (aggressive), --gc=G1, -march=native (CPU-specific instructions). CI/CD: cache GraalVM build outputs, use buildpacks (Cloud Native Buildpacks) for containerized builds.'
},
{
title: '5. JIT vs Native: Decision Framework (Expert Teaser)',
beginner: 'How do you choose between JVM mode and Native Image? It depends on your workload: serverless functions need instant startup (Native Image). Long-running web servers need peak throughput (JVM). CLI tools need instant startup (Native Image). Databases need dynamic optimization (JVM).',
advanced: '(Expert Teaser) Decision framework: (1) Startup time critical (<1s)? → Native Image. (2) Long-running (>5 min)? → JVM with JIT. (3) Dynamic class loading required? → JVM. (4) Reflection-heavy (Spring, Hibernate)? → JVM or Spring AOT + Native Image. (5) Memory constrained (<128MB)? → Native Image. (6) Peak throughput critical? → JVM. Hybrid approach: GraalVM JIT mode for development, Native Image for production serverless. In the Expert track, we explore: CRIU checkpointing for JVM fast-start (AWS Lambda SnapStart), GraalVM JIT vs C2 compiler benchmarks, Native Image debugging with GDB, and how to optimize Native Image builds for CI/CD with incremental compilation and build caching.'
}
],
{
title: '📊 Lab: JIT vs Native Image Benchmark',
intro: '⚠️ NOTE: Build a simple HTTP server, run it in JVM mode and Native Image mode, and compare startup time, memory usage, and throughput.',
steps: [
'Create HttpServer.java using com.sun.net.httpserver.HttpServer (no external dependencies).',
'Compile: javac HttpServer.java.',
'Run in JVM mode: time java HttpServer. Measure startup time (expect ~500ms).',
'Measure memory: ps aux | grep HttpServer. Note RSS (expect ~50-100MB).',
'Build Native Image: native-image HttpServer. Wait 3-5 minutes.',
'Run Native Image: time ./httpserver. Measure startup time (expect <50ms).',
'Measure memory: ps aux | grep httpserver. Note RSS (expect ~10-20MB).',
'Benchmark throughput: Use wrk or ab to send 10,000 requests. Compare requests/sec.',
'Expected: Native Image starts 10x faster, uses 5x less memory, but throughput is ~80-90% of JVM after warmup.'
],
goal: 'You compared JIT and Native Image performance across startup time, memory footprint, and throughput, understanding the trade-offs.'
},
[
q('When does Native Image outperform JVM mode?', ['Always — Native Image is universally faster', 'For short-lived workloads (serverless, CLI, sidecars) where startup time and memory footprint matter more than peak throughput', 'Never — JVM is always better', 'Only for database applications'], 1, 'Native Image wins for: serverless (<1s lifetime), CLI tools, sidecars, IoT, Kubernetes init containers. JVM wins for: long-running servers, dynamic workloads, reflection-heavy frameworks. Why others are wrong: Neither is universally better. It depends on workload characteristics.'),
q('What is the peak throughput of a Native Image compared to a fully warmed JIT-compiled JVM?', ['100% — identical', '~80-90% — Native Image lacks runtime profiling and JIT optimizations', '~50% — Native Image is significantly slower', '~120% — Native Image is faster'], 1, 'Native Image peak throughput is ~80-90% of JIT-optimized JVM. JIT uses runtime profiling for speculative optimizations (inlining, branch prediction, escape analysis) that AOT cannot replicate. Why others are wrong: It is not identical, not 50%, and not faster.'),
q('What happens if you try to use ClassLoader.defineClass() in a Native Image?', ['It works normally', 'It throws UnsupportedOperationException — dynamic class loading is not supported', 'It falls back to interpreted mode', 'It triggers a full rebuild'], 1, 'Native Image is a closed-world executable. There is no ClassLoader infrastructure at runtime. defineClass() throws UnsupportedOperationException. No dynamic bytecode generation (ByteBuddy/ASM). Why others are wrong: It does not work, fall back, or rebuild.'),
q('Why does Native Image require reflect-config.json?', ['To encrypt reflection calls', 'Because static analysis cannot see dynamic reflection calls — you must declare which classes/methods are accessed reflectively so they are included in the image', 'To speed up reflection', 'To replace reflection with static calls'], 1, 'Closed-world analysis cannot trace dynamic reflection (Class.forName, Method.invoke). You must declare reflective access in reflect-config.json. Undeclared → MissingReflectionRegistrationError at runtime. Why others are wrong: It does not encrypt, speed up, or replace reflection.'),
q('What is the typical build time and memory requirement for a medium Spring Boot Native Image?', ['10 seconds, 1GB RAM', '3-15 minutes, 8-16GB RAM', '1 hour, 64GB RAM', 'Instant, no extra memory'], 1, 'Native Image builds perform full static analysis + AOT compilation. Medium Spring Boot apps: 3-15 min, 8-16GB RAM. Large monoliths: 30+ min, 32GB+. CI/CD caching is critical. Why others are wrong: It is not instant or 10 seconds. It does not typically require 64GB or 1 hour.')
],
[
'Native Image: <50ms startup, ~20-50MB memory, ~80-90% peak throughput. Ideal for serverless/CLI.',
'JVM JIT: 5-30s warmup, ~200-500MB memory, 100% peak throughput. Ideal for long-running servers.',
'Closed-world analysis requires explicit configuration for reflection, JNI, serialization, proxies.',
'No dynamic class loading, no runtime bytecode generation, no virtual threads in Native Image.',
'Decision framework: startup-critical → Native Image; throughput-critical → JVM JIT.'
],
'This Expert Track lab requires GraalVM 21+ installed locally. Use SDKMAN (sdk install java 21-graal) or download from graalvm.org.'
),

// ═══════════════════════════════════════════
// JAVA EXPERT TRACK — PART 4: ENTERPRISE ARCHITECTURE
// ═══════════════════════════════════════════

L(
'javax-16', 16, 'Domain-Driven Design: Aggregates & Bounded Contexts', '🏛️',
'🏛️ Most enterprise software fails not because of bad code, but because of bad models. Domain-Driven Design (DDD) is the discipline of building software that mirrors the actual business domain. Instead of organizing code by technical layers (Controller/Service/Repository), DDD organizes by business capabilities (Order, Payment, Inventory). Aggregates protect data consistency. Bounded Contexts prevent model pollution. This is the architecture used by Amazon, Netflix, and every successful microservices organization.',
[
{
title: '1. Ubiquitous Language & Domain Models',
beginner: 'The biggest source of bugs is miscommunication between developers and business experts. DDD solves this with a Ubiquitous Language: developers and business people use the EXACT same words. If the business says "Order", the code says Order. If the business says "Shipment", the code says Shipment. No translation layer.',
advanced: 'Ubiquitous Language: a shared vocabulary between domain experts and developers, embedded directly in code, documentation, and conversations. Domain Model: an object graph representing business concepts and rules. Entities (identified by ID, mutable), Value Objects (defined by attributes, immutable), Domain Services (stateless operations), Domain Events (facts that happened). The model is NOT the database schema — it is the business logic. Anemic Domain Model anti-pattern: entities with only getters/setters and all logic in services. Rich Domain Model: entities encapsulate business rules (order.cancel() validates cancellation policy internally).'
},
{
title: '2. Aggregates & Aggregate Roots',
beginner: 'An Aggregate is a cluster of related objects treated as a single unit for data changes. The Aggregate Root is the ONLY entry point — external code can only access the root, and the root enforces all business rules for its children. Think of an Order aggregate: the Order is the root, and OrderItems are children. You never modify an OrderItem directly; you always go through the Order.',
advanced: 'Aggregate design rules: (1) Small aggregates — reference other aggregates by ID, not by object reference. (2) One transaction per aggregate — consistency boundaries align with aggregate boundaries. (3) Reference by identity: Order holds customerId (Long), not Customer object. (4) Protect invariants: the Aggregate Root validates all state changes. Example: Order.addItem() checks inventory policy, calculates totals, and emits OrderItemAdded event. External code cannot call orderItem.setQuantity() directly. This prevents invalid state and enables eventual consistency across aggregates.'
},
{
title: '3. Bounded Contexts & Context Mapping',
beginner: 'The word "Customer" means different things to Sales (contact info), Billing (payment details), and Shipping (delivery address). DDD calls each of these a Bounded Context — a boundary within which a specific model is valid. Trying to create ONE universal Customer class for all contexts leads to a bloated, contradictory mess.',
advanced: 'Bounded Context: an explicit boundary within which a particular domain model applies. Each context has its own Ubiquitous Language, its own database (in microservices), and its own team. Context Mapping patterns: (1) Shared Kernel: small shared model between contexts. (2) Customer-Supplier: upstream context serves downstream. (3) Anti-Corruption Layer (ACL): translation layer preventing foreign model pollution. (4) Open Host Service: published API for multiple consumers. (5) Published Language: shared interchange format (JSON schema, protobuf). In Java: each Bounded Context maps to a Maven module or microservice.'
},
{
title: '4. Domain Events & Event-Driven Communication',
beginner: 'When something important happens in the business (an order is placed, a payment is processed), DDD captures it as a Domain Event. Other parts of the system can listen for these events and react. This decouples components: the Order service does not need to know about the Inventory service — it just publishes "OrderPlaced" and lets Inventory react.',
advanced: 'Domain Events: immutable value objects representing facts that occurred (OrderPlaced, PaymentProcessed, ShipmentDispatched). In-process: Spring ApplicationEventPublisher + @EventListener. Cross-service: message brokers (Kafka, RabbitMQ) with event schemas. Event properties: eventId, occurredOn, aggregateId, payload. Events enable: (1) Temporal decoupling (producer does not wait for consumer). (2) Audit trails (event log = complete history). (3) Event Sourcing (store events instead of state). In Java: record OrderPlacedEvent(UUID orderId, Instant occurredOn, List<OrderItem> items) implements DomainEvent.'
},
{
title: '5. Hexagonal Architecture Integration (Expert Teaser)',
beginner: 'DDD tells you WHAT to model. Hexagonal Architecture (Ports and Adapters) tells you HOW to structure the code. The domain model sits at the center, completely isolated from databases, web frameworks, and messaging systems. Adapters translate between the outside world and the pure domain.',
advanced: '(Expert Teaser) Hexagonal Architecture (Alistair Cockburn): Domain Core (entities, value objects, domain services, domain events) at the center. Ports (interfaces) define how the domain communicates: Driving Ports (use cases, command handlers) and Driven Ports (repository interfaces, notification interfaces). Adapters implement ports: WebAdapter implements DrivingPort (REST controller), JpaAdapter implements DrivenPort (repository). Dependency rule: dependencies point INWARD. Domain has ZERO framework dependencies. In the Expert track, we explore how to implement a complete Hexagonal DDD project with Spring Boot, ArchUnit tests enforcing dependency rules, and contract testing between bounded contexts.'
}
],
{
title: '🏛️ Lab: E-Commerce Order Aggregate with Domain Events',
intro: '⚠️ NOTE: Build a rich Order aggregate with business invariants, domain events, and aggregate root protection. Demonstrate that external code cannot bypass the aggregate root.',
steps: [
'Create OrderAggregate.java. Define: public class Order (Aggregate Root) with fields: UUID orderId, List<OrderItem> items, OrderStatus status, Money totalAmount.',
'Create OrderItem (internal entity): UUID itemId, String productName, int quantity, Money price. Constructor is PACKAGE-PRIVATE (only Order can create items).',
'Create Money (Value Object): record Money(BigDecimal amount, String currency). Immutable. Arithmetic methods: add(), subtract(), multiply().',
'Create OrderPlacedEvent (Domain Event): record OrderPlacedEvent(UUID orderId, Instant occurredOn, Money total).',
'Implement business methods on Order: addItem(product, qty, price) validates qty > 0, calculates total, emits event. cancel() validates status is not SHIPPED.',
'Attempt violation: try to call orderItem.setQuantity() from outside the package — observe COMPILATION ERROR (package-private protection).',
'Demonstrate aggregate consistency: order.addItem() updates both items list AND totalAmount atomically.',
'Compile and execute: javac OrderAggregate.java && java OrderAggregate.'
],
goal: 'You built a rich domain aggregate with protected invariants, value objects, domain events, and aggregate root encapsulation.'
},
[
q('What is an Aggregate Root in Domain-Driven Design?', ['The database table that stores the aggregate', 'The ONLY entry point to an aggregate — external code must access all internal entities through the root, which enforces business invariants', 'The first entity created in the database', 'The parent class of all entities'], 1, 'The Aggregate Root is the guardian of the aggregate\'s consistency boundary. External code holds references ONLY to the root. Internal entities (like OrderItem) are accessed and modified exclusively through root methods. Why others are wrong: It is not a database table, not the first entity, not a parent class.'),
q('What is a Bounded Context?', ['A database schema boundary', 'An explicit boundary within which a particular domain model and Ubiquitous Language apply, preventing model pollution between different business capabilities', 'A security firewall', 'A microservice deployment unit'], 1, 'A Bounded Context defines where a specific model is valid. "Customer" in Sales context differs from "Customer" in Shipping context. Each context has its own language, model, and (in microservices) its own database. Why others are wrong: It is not a database schema, firewall, or deployment unit (though it often maps to one).'),
q('Why should aggregates reference other aggregates by ID instead of by object reference?', ['To save memory', 'To maintain aggregate boundaries, enable independent transactions, and support eventual consistency across distributed systems', 'Because Java does not support object references', 'To prevent circular imports'], 1, 'ID references decouple aggregates. Each aggregate can be loaded, modified, and persisted independently in its own transaction. Object references would create tight coupling and force loading entire object graphs. In microservices, the referenced aggregate may be in a different service/database. Why others are wrong: Memory is secondary. Java supports references. It is not about imports.'),
q('What is the Anemic Domain Model anti-pattern?', ['A domain model with too few entities', 'Entities with only getters/setters and NO business logic — all logic is pushed into external service classes', 'A domain model that uses too many events', 'A model without a database'], 1, 'Anemic Domain Model: entities are pure data holders (getters/setters only). Business logic lives in anemic "service" classes that operate on the data externally. This violates encapsulation and scatters business rules. Rich Domain Model: entities encapsulate their own business rules. Why others are wrong: It is not about entity count, event count, or database absence.'),
q('What is an Anti-Corruption Layer (ACL) in Context Mapping?', ['A security layer preventing SQL injection', 'A translation layer that converts a foreign bounded context\'s model into your own context\'s language, preventing external model pollution', 'A database encryption layer', 'A network firewall between microservices'], 1, 'ACL is a defensive translation layer. When your context must integrate with an external/legacy system, the ACL converts the foreign model into your context\'s Ubiquitous Language. This prevents the foreign model from corrupting your domain. Why others are wrong: It is not SQL injection protection, encryption, or a network firewall.')
],
[
'DDD organizes code by business capabilities, not technical layers.',
'Aggregates protect consistency boundaries — access internal entities ONLY through the Aggregate Root.',
'Bounded Contexts prevent model pollution — "Customer" means different things in different contexts.',
'Use Rich Domain Models: entities encapsulate business rules, not just getters/setters.',
'Domain Events enable decoupled, event-driven communication between aggregates and services.'
],
'This Expert Track lab requires JDK 21+. Use your native terminal for compilation. No external frameworks required — pure Java domain modeling.'
),

L(
'javax-17', 17, 'Hexagonal Architecture & Ports/Adapters', '🔷',
'🔷 Hexagonal Architecture (Ports and Adapters) is the structural backbone of maintainable enterprise systems. It isolates your core business logic from infrastructure concerns: databases, web frameworks, message brokers, and external APIs. The domain sits at the center, completely framework-free. Adapters translate between the outside world and the domain. This architecture enables painless technology swaps, comprehensive testing without infrastructure, and long-term codebase health.',
[
{
title: '1. The Hexagon: Domain Core Isolation',
beginner: 'Imagine your business logic is a precious gem at the center of a hexagon. The hexagon has doors (Ports) on each side. Outside the hexagon are translators (Adapters) that convert web requests, database queries, and messages into a language the gem understands. The gem never talks directly to the outside world.',
advanced: 'Hexagonal Architecture (Alistair Cockburn, 2005): Application Core (domain model + application services) at the center. Ports: interfaces defining communication contracts. Driving Ports (left side): use cases initiated by external actors (CreateOrderUseCase). Driven Ports (right side): interfaces the domain needs (OrderRepository, PaymentGateway, NotificationService). Adapters implement ports: REST controller implements Driving Port, JPA repository implements Driven Port. Dependency Rule: ALL dependencies point INWARD. Domain module has ZERO dependencies on Spring, JPA, Kafka, or any framework.'
},
{
title: '2. Driving Ports & Adapters (Inbound)',
beginner: 'Driving Ports are the "front doors" of your application. They define what the system CAN DO (use cases like "Place Order" or "Cancel Order"). Driving Adapters are the specific ways users interact: a REST controller, a CLI command, a message consumer, or a scheduled job. Multiple adapters can drive the same port.',
advanced: 'Driving Port: interface CreateOrderUseCase { OrderResult execute(CreateOrderCommand cmd); }. Driving Adapters: (1) REST: @RestController calls createOrderUseCase.execute(). (2) GraphQL: @DgsQuery calls same use case. (3) Message consumer: @KafkaListener calls same use case. (4) CLI: CommandLineRunner calls same use case. The use case interface is FRAMEWORK-FREE — no Spring annotations, no HTTP types. Command objects (CreateOrderCommand) are immutable records. This enables testing use cases without starting a web server.'
},
{
title: '3. Driven Ports & Adapters (Outbound)',
beginner: 'Driven Ports are the "back doors" — they define what the system NEEDS from the outside world: saving orders, processing payments, sending notifications. Driven Adapters are the specific implementations: a JPA repository, a Stripe payment client, an SMTP email sender. You can swap adapters without touching the domain.',
advanced: 'Driven Port: interface OrderRepository { Order findById(OrderId id); void save(Order order); }. Driven Adapters: (1) JPA: @Repository JpaOrderRepository implements OrderRepository using Spring Data JPA. (2) In-Memory: InMemoryOrderRepository for testing. (3) MongoDB: MongoOrderRepository. The domain depends on the INTERFACE, not the implementation. Dependency Injection wires the adapter at runtime. This enables: (1) Testing domain logic with InMemory adapters (no database needed). (2) Swapping JPA → MongoDB without changing domain code. (3) Running integration tests with Testcontainers.'
},
{
title: '4. Dependency Inversion & Module Structure',
beginner: 'The golden rule of Hexagonal Architecture: dependencies always point INWARD. The web layer depends on the domain, never the reverse. The database layer depends on the domain, never the reverse. In Java, you enforce this with Maven modules: domain (no dependencies), application (depends on domain), infrastructure (depends on domain + application).',
advanced: 'Maven module structure: (1) domain: entities, value objects, domain events, domain services. ZERO dependencies. (2) application: use cases (driving ports), repository interfaces (driven ports). Depends ONLY on domain. (3) infrastructure-web: REST controllers (driving adapters). Depends on application. (4) infrastructure-persistence: JPA repositories (driven adapters). Depends on application. (5) infrastructure-messaging: Kafka consumers/producers. Depends on application. ArchUnit tests enforce: noClasses().that().resideInAPackage("..domain..").should().dependOnClassesThat().resideInAPackage("..infrastructure..").'
},
{
title: '5. Testing Without Infrastructure (Expert Teaser)',
beginner: 'The biggest benefit of Hexagonal Architecture is testing speed. Because your domain has no database or web framework dependencies, you can test ALL your business logic in milliseconds using simple in-memory adapters. No Docker, no Testcontainers, no slow Spring context startup.',
advanced: '(Expert Teaser) Testing strategy: (1) Unit tests: test domain entities and value objects directly (no framework). (2) Use case tests: test application services with InMemory adapters (no database). (3) Integration tests: test driving adapters with MockMvc (no real HTTP). (4) End-to-end tests: test driven adapters with Testcontainers (real database). Ratio: 70% unit, 20% use case, 10% integration. This inverts the traditional testing pyramid. In the Expert track, we explore how Hexagonal Architecture enables architecture fitness functions via ArchUnit, how to implement contract testing between bounded contexts with Pact, and how to structure a multi-module Gradle build with strict dependency enforcement.'
}
],
{
title: '🔷 Lab: Hexagonal Order Service with Swappable Adapters',
intro: '⚠️ NOTE: Build a Hexagonal Architecture project with domain core, driving/driven ports, and two interchangeable adapters (InMemory and JPA-style) to demonstrate technology independence.',
steps: [
'Create project structure: domain/, application/, infrastructure/.',
'Domain layer: Create Order entity, OrderId value object (record), Money value object (record), OrderStatus enum. NO framework imports.',
'Application layer: Create driving port: interface PlaceOrderUseCase { OrderResult execute(PlaceOrderCommand cmd); }. Create driven port: interface OrderRepository { void save(Order o); Optional<Order> findById(OrderId id); }.',
'Application service: class PlaceOrderService implements PlaceOrderUseCase { private final OrderRepository repo; /* constructor injection */ }.',
'Infrastructure adapter 1: class InMemoryOrderRepository implements OrderRepository { private final Map<OrderId, Order> store = new HashMap<>(); }.',
'Infrastructure adapter 2: class JpaOrderRepository implements OrderRepository { /* simulated JPA code */ }.',
'Driving adapter: class OrderRestController { private final PlaceOrderUseCase useCase; /* simulated REST handling */ }.',
'In main, wire with InMemory adapter: PlaceOrderService service = new PlaceOrderService(new InMemoryOrderRepository());. Execute use case.',
'Swap adapter: PlaceOrderService service2 = new PlaceOrderService(new JpaOrderRepository());. Same domain code, different infrastructure!',
'Compile and execute: javac HexagonalDemo.java && java HexagonalDemo.'
],
goal: 'You built a Hexagonal Architecture project with isolated domain core, defined driving/driven ports, and demonstrated adapter swappability without modifying domain code.'
},
[
q('What is the primary rule of dependency direction in Hexagonal Architecture?', ['Dependencies point outward from domain to infrastructure', 'ALL dependencies point INWARD toward the domain core — infrastructure depends on domain, never the reverse', 'Dependencies are bidirectional', 'There are no dependency rules'], 1, 'The Dependency Rule: domain has zero dependencies. Application depends on domain. Infrastructure depends on application/domain. This ensures the domain is completely isolated from frameworks and technologies. Why others are wrong: Outward, bidirectional, or no rules violate the architecture.'),
q('What is a Driving Port in Hexagonal Architecture?', ['A database connection interface', 'An interface defining a use case (what the system CAN DO), implemented by inbound adapters like REST controllers or message consumers', 'A hardware driver interface', 'A network port number'], 1, 'Driving Ports (left side) define application capabilities: PlaceOrderUseCase, CancelOrderUseCase. Driving Adapters (REST, CLI, Kafka consumer) implement these ports. Why others are wrong: It is not a database interface (that is a Driven Port), not a hardware driver, not a network port.'),
q('What is a Driven Port in Hexagonal Architecture?', ['A web controller endpoint', 'An interface defining what the domain NEEDS from the outside world (repository, payment gateway, notification), implemented by outbound adapters', 'A CPU driver', 'A message queue topic'], 1, 'Driven Ports (right side) define infrastructure needs: OrderRepository, PaymentGateway, EmailNotifier. Driven Adapters (JPA, Stripe, SMTP) implement these ports. Why others are wrong: Web controllers are Driving Adapters. It is not a CPU driver or message topic.'),
q('How does Hexagonal Architecture enable testing without a database?', ['It mocks the database at the network level', 'The domain depends on repository INTERFACES (ports), so tests inject InMemory implementations instead of real databases', 'It disables the database connection', 'It uses a test database that is automatically deleted'], 1, 'Because the domain depends on the OrderRepository INTERFACE, tests can inject InMemoryOrderRepository. No database, no Docker, no Testcontainers needed for domain/use-case tests. Why others are wrong: It is not network mocking, connection disabling, or temp databases.'),
q('What tool can enforce Hexagonal Architecture dependency rules automatically in a Java project?', ['JUnit', 'ArchUnit — architecture testing library that verifies package dependency rules at test time', 'Maven', 'Docker'], 1, 'ArchUnit provides architectural assertions: noClasses().that().resideInAPackage("..domain..").should().dependOnClassesThat().resideInAPackage("..infrastructure.."). This runs as a unit test, failing the build if dependencies are violated. Why others are wrong: JUnit tests logic. Maven manages builds. Docker manages containers.')
],
[
'Hexagonal Architecture isolates domain logic from infrastructure via Ports (interfaces) and Adapters (implementations).',
'Driving Ports define use cases (inbound); Driven Ports define infrastructure needs (outbound).',
'Dependency Rule: ALL dependencies point inward — domain has ZERO framework dependencies.',
'Swap adapters (JPA → MongoDB, REST → GraphQL) without touching domain code.',
'ArchUnit enforces architecture rules automatically as failing unit tests.'
],
'This Expert Track lab requires JDK 21+. Use your native terminal for compilation. No external frameworks required — pure Java interfaces and dependency injection.'
),

L(
'javax-18', 18, 'Event Sourcing & CQRS Patterns', '📜',
'📜 Traditional CRUD applications overwrite state: UPDATE orders SET status=\'SHIPPED\'. The previous state is lost forever. Event Sourcing stores every state change as an immutable event: OrderPlaced → PaymentReceived → OrderShipped. The current state is derived by replaying events. Combined with CQRS (separate read and write models), this enables complete audit trails, temporal queries ("what was the state last Tuesday?"), and decoupled microservice communication.',
[
{
title: '1. Event Sourcing Fundamentals',
beginner: 'Instead of saving the CURRENT state of an order (status=SHIPPED), Event Sourcing saves the entire HISTORY of what happened: "OrderPlaced at 9:00", "PaymentReceived at 9:05", "OrderShipped at 14:00". To get the current state, you replay all events in order. It\'s like a bank statement: your balance is derived from all transactions, not stored as a single number.',
advanced: 'Event Store: append-only log of Domain Events per aggregate (event stream). Event: { eventId, aggregateId, aggregateType, eventType, payload, occurredOn, version }. State reconstruction: fold(events) — apply each event to a state object sequentially. Snapshotting: store a state snapshot every N events (e.g., every 100 events) to avoid replaying long histories. Concurrency: optimistic locking via event stream version. Event Store databases: EventStoreDB, Axon Server, Kafka (with compacted topics). In Java: record OrderPlacedEvent(UUID orderId, List<OrderItem> items, Instant occurredOn) implements DomainEvent.'
},
{
title: '2. CQRS: Command Query Responsibility Segregation',
beginner: 'CQRS splits your application into two separate models: a Write Model (Commands) that handles changes (Place Order, Cancel Order), and a Read Model (Queries) that handles lookups (Get Order Status, List All Orders). They can use different databases, different schemas, and different optimization strategies.',
advanced: 'CQRS separates: Command side: aggregates process commands, validate invariants, emit events. Write to Event Store. Query side: event handlers project events into denormalized read models (tables, views, search indexes). Read from query database. Benefits: (1) Independent scaling (read-heavy vs write-heavy workloads). (2) Optimized schemas (normalized writes, denormalized reads). (3) Different technologies (PostgreSQL for writes, Elasticsearch for reads). Trade-off: eventual consistency between write and read models. In Java: command handler @CommandHandler, event handler @EventHandler, query handler @QueryHandler (Axon Framework pattern).'
},
{
title: '3. Eventual Consistency & Projections',
beginner: 'In CQRS, when you place an order, the write side saves the event instantly. But the read side (the query database) might take a few milliseconds to update. This is Eventual Consistency: the system will become consistent, but not instantly. Users might see a slight delay before their order appears in the list.',
advanced: 'Eventual consistency: read models are updated asynchronously via event projections. Latency: typically 10-100ms (in-process) or 100ms-5s (cross-service via Kafka). Projections: event handlers that update read models. Example: OrderPlacedEvent → INSERT INTO order_read_model (id, customer, total, status) VALUES (...). Projection rebuild: replay all events to reconstruct read model from scratch (disaster recovery, schema migration). Handling duplicate events: idempotent handlers (check eventId before processing). In Java: @EventHandler public void on(OrderPlacedEvent e) { readModelRepo.upsert(toReadModel(e)); }.'
},
{
title: '4. Snapshots & Event Versioning',
beginner: 'If an order has 10,000 events, replaying all of them to get the current state is slow. Snapshots solve this: every 100 events, save a picture of the current state. Next time, load the snapshot and replay only the last 100 events. Event Versioning handles schema changes: old events still work with new code.',
advanced: 'Snapshotting: store aggregate state every N events (e.g., 100). Load: read latest snapshot + replay subsequent events. Snapshot: { aggregateId, version, state, takenAt }. Event Versioning (Upcasting): when event schema changes (e.g., OrderPlacedEvent v1 has no discount field), an Upcaster transforms v1 events to v2 format on read. Axon Framework: @UpcasterClass. Alternative: copy-transform (new event type, old events remain). Schema Registry (Kafka/Avro) enforces backward compatibility. In Java: record OrderPlacedEventV2(UUID orderId, List<OrderItem> items, BigDecimal discount, Instant occurredOn).'
},
{
title: '5. Event Sourcing in Distributed Systems (Expert Teaser)',
beginner: 'Event Sourcing becomes incredibly powerful in microservices. Each service owns its event stream. Other services subscribe to events and react. This creates a fully decoupled, auditable, replayable distributed system. It is the architecture behind Amazon\'s order system and Netflix\'s recommendation engine.',
advanced: '(Expert Teaser) Distributed Event Sourcing: (1) Each microservice owns its aggregate event streams. (2) Events published to Kafka topics (one topic per aggregate type). (3) Consuming services maintain their own projections (materialized views). (4) Saga pattern coordinates multi-service transactions via choreographed events. (5) Eventual consistency managed via compensating events. Challenges: (1) Event schema evolution across services. (2) Ordering guarantees (Kafka partition key = aggregateId). (3) Duplicate delivery (idempotent consumers). (4) GDPR right-to-erasure vs immutable event log (crypto-shredding). In the Expert track, we build a complete Event Sourced microservice with Axon Framework, Kafka, and CQRS projections.'
}
],
{
title: '📜 Lab: Event Sourced Bank Account with CQRS',
intro: '⚠️ NOTE: Build an event-sourced bank account that stores all transactions as events, reconstructs balance by replaying events, and projects events into a separate read model.',
steps: [
'Create Domain Events: record AccountOpened(UUID accountId, Instant at), MoneyDeposited(UUID accountId, BigDecimal amount, Instant at), MoneyWithdrawn(UUID accountId, BigDecimal amount, Instant at).',
'Create BankAccount aggregate: class BankAccount { private UUID id; private BigDecimal balance; private List<Object> pendingEvents; public void open() { pendingEvents.add(new AccountOpened(...)); } public void deposit(BigDecimal amt) { pendingEvents.add(new MoneyDeposited(...)); } public void withdraw(BigDecimal amt) { if (balance.compareTo(amt) < 0) throw new InsufficientFundsException(); pendingEvents.add(new MoneyWithdrawn(...)); } }.',
'Create event replay: public void apply(Object event) { switch(event) { case AccountOpened e -> this.balance = BigDecimal.ZERO; case MoneyDeposited e -> this.balance = balance.add(e.amount()); case MoneyWithdrawn e -> this.balance = balance.subtract(e.amount()); } }.',
'Create Event Store (InMemory): class InMemoryEventStore { Map<UUID, List<Object>> streams; void append(UUID id, List<Object> events); List<Object> load(UUID id); }.',
'Create CQRS Read Model: class AccountReadModel { Map<UUID, BigDecimal> balances; void project(Object event) { /* update balance */ } }.',
'In main: Open account, deposit 100, withdraw 30. Store events. Reconstruct account by replaying events. Verify balance = 70.',
'Demonstrate audit trail: Print all events for the account (complete history).',
'Compile and execute: javac EventSourcingDemo.java && java EventSourcingDemo.'
],
goal: 'You built an event-sourced aggregate with event replay, CQRS read model projection, and complete audit trail.'
},
[
q('What is the fundamental difference between CRUD and Event Sourcing?', ['CRUD is faster than Event Sourcing', 'CRUD overwrites current state (UPDATE); Event Sourcing appends immutable events and derives state by replaying them', 'CRUD uses SQL; Event Sourcing uses NoSQL', 'CRUD is for web apps; Event Sourcing is for mobile apps'], 1, 'CRUD: UPDATE orders SET status=\'SHIPPED\' — previous state lost. Event Sourcing: append OrderShippedEvent — complete history preserved. Current state = fold(all events). Why others are wrong: Speed depends on context. Both can use SQL/NoSQL. Both work for web/mobile.'),
q('What is CQRS (Command Query Responsibility Segregation)?', ['A database query optimization technique', 'Separating the Write Model (commands that change state) from the Read Model (queries that read state), allowing independent optimization', 'A caching strategy', 'A microservice deployment pattern'], 1, 'CQRS splits: Command side processes writes via aggregates/events. Query side serves reads from denormalized projections. Enables independent scaling, different schemas, different technologies. Trade-off: eventual consistency. Why others are wrong: It is not query optimization, caching, or deployment.'),
q('What is Eventual Consistency in a CQRS system?', ['The system is always consistent instantly', 'The read model may lag behind the write model by milliseconds to seconds, but will eventually become consistent', 'The system never becomes consistent', 'Consistency is only guaranteed during database backups'], 1, 'Eventual consistency: write side updates immediately; read side updates asynchronously via event projections. Latency: 10ms-5s depending on architecture. The system WILL become consistent, but not instantly. Why others are wrong: It is not instant, not never, not backup-related.'),
q('What is the purpose of Snapshotting in Event Sourcing?', ['To delete old events to save storage', 'To store a state checkpoint every N events, avoiding replay of long event histories and improving load performance', 'To compress events into a single file', 'To encrypt events for security'], 1, 'Snapshots store aggregate state every N events (e.g., 100). Loading: read latest snapshot + replay subsequent events. Reduces replay time from O(total_events) to O(snapshot_interval). Events are NOT deleted. Why others are wrong: Events are never deleted. It is not compression or encryption.'),
q('How do you handle event schema changes (e.g., adding a new field) in Event Sourcing?', ['Delete all old events and start over', 'Use Upcasting: transform old event versions to the new format on read, preserving backward compatibility', 'Reject all old events', 'Create a new database'], 1, 'Upcasting transforms v1 events to v2 format during deserialization. Old events remain in the store unchanged. New code reads upcasted events. Alternative: copy-transform (new event type). Schema Registry (Avro/Protobuf) enforces compatibility. Why others are wrong: Never delete events. Never reject old events. No new database needed.')
],
[
'Event Sourcing stores immutable events instead of overwriting state — complete audit trail.',
'Current state is derived by replaying (folding) the event stream.',
'CQRS separates write (commands/events) from read (projections) for independent optimization.',
'Eventual consistency: read models lag behind write models by milliseconds to seconds.',
'Snapshotting avoids replaying long event histories; Upcasting handles schema evolution.'
],
'This Expert Track lab requires JDK 21+. Use your native terminal for compilation. No external frameworks required — pure Java event sourcing implementation.'
),

L(
'javax-19', 19, 'Microservices Patterns: Saga, Circuit Breaker & API Gateway', '🌐',
'🌐 Microservices unlock team autonomy and independent scaling, but introduce distributed systems challenges that monoliths never face: network failures, partial data consistency, and cascading failures. This lesson covers the essential patterns that make microservices resilient: Saga for distributed transactions, Circuit Breaker for failure isolation, API Gateway for unified entry, and Service Discovery for dynamic routing.',
[
{
title: '1. Saga Pattern: Distributed Transactions',
beginner: 'In a monolith, you use a database transaction to ensure "all or nothing". In microservices, each service has its OWN database — you cannot use a single transaction across services. The Saga pattern solves this: a sequence of local transactions, each with a compensating action to undo if a later step fails.',
advanced: 'Saga types: (1) Choreography: services emit events, other services react. No central coordinator. Simple for 2-3 services, complex for 5+. (2) Orchestration: a central Saga Orchestrator directs the sequence. Easier to reason about, single point of coordination. Example: Order Saga: CreateOrder → ReserveInventory → ProcessPayment → ShipOrder. If Payment fails: compensate Inventory (release stock) + compensate Order (cancel). Each step is a local transaction. Compensating transactions must be idempotent. In Java: Temporal.io, Camunda, or custom saga state machines.'
},
{
title: '2. Circuit Breaker Pattern',
beginner: 'If a downstream service is failing, you don\'t want every request to wait for a timeout and fail. The Circuit Breaker pattern works like an electrical circuit breaker: after N failures, it "trips" and immediately rejects requests for a cooldown period. This prevents cascading failures and gives the failing service time to recover.',
advanced: 'Circuit Breaker states: CLOSED (normal operation, requests pass through) → OPEN (failure threshold exceeded, requests fail immediately) → HALF_OPEN (after cooldown, allow limited requests to test recovery). Configuration: failureThreshold (e.g., 5 failures in 10s), waitDurationInOpenState (e.g., 30s), permittedNumberOfCallsInHalfOpenState (e.g., 3). Libraries: Resilience4j, Hystrix (deprecated). In Spring Cloud: @CircuitBreaker(name = "inventoryService", fallbackMethod = "inventoryFallback"). Fallback methods provide degraded responses (cached data, default values).'
},
{
title: '3. API Gateway Pattern',
beginner: 'Instead of clients calling 50 different microservices directly, they call ONE entry point: the API Gateway. The gateway routes requests to the correct service, handles authentication, rate limiting, and SSL termination. It is the "front door" of your microservices architecture.',
advanced: 'API Gateway responsibilities: (1) Routing: /orders → Order Service, /users → User Service. (2) Authentication/Authorization: JWT validation, OAuth2. (3) Rate limiting: protect against abuse. (4) SSL termination: handle HTTPS, forward HTTP internally. (5) Request/response transformation. (6) Load balancing. (7) Caching. Implementations: Spring Cloud Gateway (reactive, Netty-based), Kong (Lua/OpenResty), AWS API Gateway, Envoy (Istio). Spring Cloud Gateway: @Bean RouteLocator with predicates (path, header) and filters (auth, rate-limit).'
},
{
title: '4. Service Discovery & Health Checks',
beginner: 'In a microservices world, services are constantly starting, stopping, and moving between servers. Service Discovery is like a phone book: services register themselves when they start, and other services look them up when they need to communicate. Health checks ensure you only talk to healthy services.',
advanced: 'Service Discovery: (1) Client-side: services register with a registry (Eureka, Consul). Clients query the registry and load-balance themselves. (2) Server-side: registry + load balancer (Kubernetes Service, AWS ALB). Clients call the load balancer, which routes to healthy instances. Health checks: /actuator/health endpoints. Kubernetes liveness/readiness probes. Circuit Breaker integration: unhealthy instances removed from pool. Spring Cloud: @EnableDiscoveryClient, DiscoveryClient.getInstances("order-service"). DNS-based discovery: Kubernetes headless services.'
},
{
title: '5. Observability & Distributed Tracing (Expert Teaser)',
beginner: 'When a request passes through 10 microservices, how do you find which one is slow? Distributed Tracing assigns a unique Trace ID to each request and tracks it across all services. You can see a waterfall diagram showing exactly how long each service took.',
advanced: '(Expert Teaser) Distributed Tracing: W3C TraceContext standard. Trace: end-to-end request journey. Span: individual operation (HTTP call, DB query). Trace ID propagated via HTTP headers (traceparent). Implementations: Micrometer Tracing (Spring Boot 3+), OpenTelemetry SDK, Jaeger, Zipkin. Metrics: Micrometer + Prometheus + Grafana. Logging: structured JSON logs with traceId/spanId for correlation. The three pillars of observability: Metrics (what), Logs (why), Traces (where). In the Expert track, we build a complete observability stack with Spring Boot + Micrometer + Prometheus + Grafana + Jaeger, including custom business metrics and alerting rules.'
}
],
{
title: '🌐 Lab: Saga Orchestrator & Circuit Breaker Simulation',
intro: '⚠️ NOTE: Build a Saga Orchestrator that coordinates a multi-step order process with compensating transactions, and a Circuit Breaker that prevents cascading failures.',
steps: [
'Create SagaStep interface: interface SagaStep { void execute(); void compensate(); }.',
'Create concrete steps: CreateOrderStep, ReserveInventoryStep, ProcessPaymentStep. Each has execute() and compensate() methods.',
'Create SagaOrchestrator: class SagaOrchestrator { List<SagaStep> steps; void executeSaga() { try { for (step : steps) step.execute(); } catch (Exception e) { for (int i = failedIndex; i >= 0; i--) steps.get(i).compensate(); } } }.',
'Simulate payment failure: ProcessPaymentStep.execute() throws RuntimeException("Payment declined").',
'Run saga: observe CreateOrder → ReserveInventory → Payment FAILS → Compensate Inventory → Compensate Order.',
'Create CircuitBreaker: class CircuitBreaker { enum State { CLOSED, OPEN, HALF_OPEN }; int failureCount; State state; void call(Runnable action) { if (state == OPEN) throw new CircuitOpenException(); try { action.run(); reset(); } catch (Exception e) { recordFailure(); } } }.',
'Simulate 5 failures: observe CircuitBreaker transitions from CLOSED → OPEN.',
'After cooldown: observe HALF_OPEN → test request → CLOSED on success.',
'Compile and execute: javac MicroservicesPatterns.java && java MicroservicesPatterns.'
],
goal: 'You built a Saga Orchestrator with compensating transactions and a Circuit Breaker with state transitions, demonstrating core microservices resilience patterns.'
},
[
q('Why can\'t you use a traditional database transaction across multiple microservices?', ['Microservices do not use databases', 'Each microservice owns its OWN database — a single ACID transaction cannot span multiple independent databases', 'Database transactions are too slow for microservices', 'Microservices only use NoSQL databases'], 1, 'The Database-per-Service pattern means each microservice has its own database. A distributed ACID transaction (2PC) across independent databases is blocking, fragile, and violates service autonomy. Saga pattern uses local transactions + compensations. Why others are wrong: Microservices DO use databases. Speed is not the issue. They use SQL and NoSQL.'),
q('What are the three states of a Circuit Breaker?', ['ON, OFF, STANDBY', 'CLOSED (normal), OPEN (failing, reject immediately), HALF_OPEN (testing recovery)', 'START, RUNNING, STOPPED', 'ACTIVE, PASSIVE, DISABLED'], 1, 'CLOSED: requests pass through, failures counted. OPEN: failure threshold exceeded, requests fail immediately (fail-fast). HALF_OPEN: after cooldown, allow limited test requests. Success → CLOSED. Failure → OPEN. Why others are wrong: The other options are not Circuit Breaker states.'),
q('What is the primary responsibility of an API Gateway?', ['To store all application data', 'To act as the single entry point for clients, handling routing, authentication, rate limiting, and SSL termination before forwarding to internal microservices', 'To replace all microservices with one monolith', 'To encrypt all database connections'], 1, 'API Gateway is the front door: routing, auth, rate limiting, SSL termination, load balancing, caching. Clients call ONE endpoint instead of 50 services. Why others are wrong: It does not store data, replace services, or encrypt DB connections.'),
q('What is the difference between Choreography and Orchestration in Saga patterns?', ['Choreography uses a central coordinator; Orchestration uses events', 'Choreography: services react to events (decentralized); Orchestration: a central coordinator directs the sequence', 'They are identical', 'Choreography is for databases; Orchestration is for APIs'], 1, 'Choreography: services emit events, other services react. No central coordinator. Simple for 2-3 services. Orchestration: central Saga Orchestrator directs the sequence. Easier to reason about for complex workflows. Why others are wrong: Definitions are swapped. They are not identical. Not database/API specific.'),
q('What is the purpose of a compensating transaction in a Saga?', ['To compensate the developer for overtime', 'To UNDO the effects of a previously completed step when a later step in the saga fails', 'To compensate for network latency', 'To compensate for database storage costs'], 1, 'Compensating transactions reverse the effects of prior steps. If Payment fails in an Order Saga: compensate Inventory (release stock) + compensate Order (cancel). Must be idempotent (safe to retry). Why others are wrong: It is not about developer pay, latency, or storage costs.')
],
[
'Saga pattern coordinates distributed transactions via local transactions + compensating actions.',
'Circuit Breaker prevents cascading failures: CLOSED → OPEN → HALF_OPEN state machine.',
'API Gateway is the single entry point: routing, auth, rate limiting, SSL termination.',
'Choreography (events, decentralized) vs Orchestration (central coordinator) for Saga coordination.',
'Compensating transactions must be idempotent — safe to retry multiple times.'
],
'This Expert Track lab requires JDK 21+. Use your native terminal for compilation. No external frameworks required — pure Java pattern implementations.'
),

L(
'javax-20', 20, 'Distributed Tracing: Micrometer, Zipkin & Jaeger', '🔍',
'🔍 In a monolith, you can follow a stack trace to find a bug. In microservices, a single user request may traverse 10 services, 3 databases, and 2 message queues. When latency spikes, you need to know WHICH service is slow and WHY. Distributed Tracing assigns a unique Trace ID to every request and tracks it across all services, producing a waterfall diagram that reveals exactly where time is spent.',
[
{
title: '1. Traces, Spans & Context Propagation',
beginner: 'A Trace is the complete journey of one request across all services. A Span is one operation within that journey (an HTTP call, a database query, a message send). Every span records: what happened, when it started, how long it took, and whether it succeeded. The Trace ID connects all spans together.',
advanced: 'Trace: end-to-end request journey, identified by traceId (128-bit). Span: individual operation, identified by spanId (64-bit), parentSpanId (forms a tree). Span attributes: operation name, service name, start/end timestamps, tags (http.method, db.statement), logs (error details). Context Propagation: traceId/spanId carried via HTTP headers (W3C TraceContext: traceparent: 00-{traceId}-{spanId}-{flags}). B3 format (Zipkin): X-B3-TraceId, X-B3-SpanId. Sampling: head-based (decide at trace start) vs tail-based (decide after trace completes, keep errors/slow traces).'
},
{
title: '2. Micrometer Tracing (Spring Boot 3+)',
beginner: 'Micrometer is the standard observability library for Spring Boot. It automatically instruments your web controllers, REST clients, databases, and message queues. Every request gets a Trace ID. Every operation gets a Span. You just add the dependency and configure the exporter.',
advanced: 'Micrometer Tracing (successor to Spring Cloud Sleuth): auto-instruments: Spring MVC controllers, WebClient/RestTemplate, Spring Data JPA, Kafka, RabbitMQ. Configuration: management.tracing.sampling.probability=1.0 (100% sampling for dev, 0.1 for prod). Exporters: Zipkin (HTTP), OTLP (OpenTelemetry Protocol), Brave. Annotation: @NewSpan("custom-operation") creates manual spans. Span customization: Span.current().tag("userId", "123"). Correlation: traceId/spanId automatically added to MDC for log correlation. In Spring Boot 3: micrometer-tracing-bridge-brave + zipkin-reporter-brave dependencies.'
},
{
title: '3. Zipkin & Jaeger: Trace Visualization',
beginner: 'Zipkin and Jaeger are trace visualization servers. They collect spans from all your services, stitch them together into complete traces, and show you a beautiful waterfall diagram. You can see exactly which service is slow, which database query takes 2 seconds, and which message queue is backing up.',
advanced: 'Zipkin: lightweight, HTTP-based span collection. UI shows trace waterfall, service dependency graph, latency percentiles. Query by service, operation, duration, tags. Jaeger: CNCF project, more feature-rich. Supports adaptive sampling, deep dependency analysis, and trace comparison. Storage backends: Elasticsearch, Cassandra, Kafka. OpenTelemetry Collector: vendor-neutral span pipeline — collect, process, export to Zipkin/Jaeger/Datadog/Grafana Tempo. Deployment: docker run -p 9411:9411 openzipkin/zipkin. Spring Boot sends spans via HTTP to http://localhost:9411/api/v2/spans.'
},
{
title: '4. Correlating Traces with Logs & Metrics',
beginner: 'Traces tell you WHERE the problem is. Logs tell you WHY. Metrics tell you WHAT is happening. The three pillars of observability work together. By adding the Trace ID to every log line, you can click from a slow trace directly to the exact log messages that explain the delay.',
advanced: 'Log correlation: Micrometer adds traceId/spanId to SLF4J MDC. Logback pattern: %d{ISO8601} [%thread] [%X{traceId}/%X{spanId}] %-5level %logger - %msg%n. In ELK/Loki: query logs by traceId to see all log lines for a specific request. Metrics correlation: Micrometer tags with traceId for high-cardinality metrics (use sparingly). RED metrics: Rate, Errors, Duration per service. USE metrics: Utilization, Saturation, Errors per resource. Grafana dashboards link traces → logs → metrics for complete incident investigation.'
},
{
title: '5. OpenTelemetry & Vendor Neutrality (Expert Teaser)',
beginner: 'What if you want to switch from Zipkin to Datadog without rewriting all your tracing code? OpenTelemetry is the universal standard for observability. It provides a single API and SDK that can export to ANY backend: Zipkin, Jaeger, Datadog, New Relic, Grafana Tempo.',
advanced: '(Expert Teaser) OpenTelemetry (CNCF): unified API for traces, metrics, and logs. OTel SDK: auto-instrumentation agents for Java (javaagent). OTLP (OpenTelemetry Protocol): standard gRPC/HTTP protocol for span export. OTel Collector: vendor-neutral pipeline — receive, process (batch, filter, sample), export to any backend. Java agent: -javaagent:opentelemetry-javaagent.jar -Dotel.exporter.otlp.endpoint=http://collector:4317. Supports 100+ library instrumentations. In the Expert track, we build a complete OTel pipeline: Spring Boot → OTel Collector → Jaeger + Prometheus + Loki, with custom business metrics, tail-based sampling, and automated alerting.'
}
],
{
title: '🔍 Lab: Distributed Trace Simulator',
intro: '⚠️ NOTE: Build a simulated distributed tracing system that generates Trace IDs, creates Spans, propagates context across service calls, and produces a trace report.',
steps: [
'Create Span class: record Span(String traceId, String spanId, String parentSpanId, String operation, String service, long startTime, long duration, Map<String, String> tags).',
'Create TraceContext: class TraceContext { String traceId; String spanId; TraceContext(String traceId, String spanId); TraceContext child() { return new TraceContext(traceId, UUID.randomUUID().toString()); } }.',
'Create Tracer: class Tracer { Span startSpan(TraceContext ctx, String operation, String service); void finishSpan(Span span); }.',
'Simulate 3-service request: Service A (API Gateway) → Service B (Order Service) → Service C (Database).',
'Create root span: Span root = tracer.startSpan(rootCtx, "GET /orders", "api-gateway");.',
'Create child span: TraceContext childCtx = rootCtx.child(); Span orderSpan = tracer.startSpan(childCtx, "processOrder", "order-service");.',
'Create grandchild span: Span dbSpan = tracer.startSpan(childCtx.child(), "SELECT * FROM orders", "postgres");.',
'Finish spans in reverse order: dbSpan → orderSpan → root.',
'Print trace report: display traceId, span tree with durations, and service dependency chain.',
'Compile and execute: javac TracingDemo.java && java TracingDemo.'
],
goal: 'You built a distributed tracing simulator with Trace ID propagation, Span creation, parent-child relationships, and trace report generation.'
},
[
q('What is a Trace in distributed tracing?', ['A log file', 'The complete end-to-end journey of a single request across all services, identified by a unique Trace ID', 'A database query', 'A network packet'], 1, 'A Trace represents the full lifecycle of one request as it traverses multiple services. All Spans (operations) within the request share the same Trace ID. Why others are wrong: It is not a log file, query, or packet.'),
q('What is a Span?', ['A time period', 'A single operation within a Trace (HTTP call, DB query, message send), with its own Span ID, parent Span ID, start/end times, and tags', 'A service instance', 'A database row'], 1, 'A Span represents one unit of work: an HTTP request, a database query, a message publish. Spans form a tree via parentSpanId. Each Span records: operation name, service name, timestamps, tags, logs. Why others are wrong: It is not a time period, service instance, or DB row.'),
q('How is Trace context propagated between microservices?', ['Via shared database', 'Via HTTP headers (W3C TraceContext: traceparent header) or message metadata, carrying traceId and spanId', 'Via DNS records', 'Via email notifications'], 1, 'Context propagation: traceId/spanId carried in HTTP headers (traceparent: 00-{traceId}-{spanId}-{flags}) or message headers (Kafka record headers). Each service extracts context, creates a child span, and propagates downstream. Why others are wrong: Not via database, DNS, or email.'),
q('What is the purpose of log correlation with Trace IDs?', ['To encrypt log files', 'To link log messages to specific traces, enabling you to jump from a slow trace directly to the exact log lines explaining the delay', 'To compress log files', 'To delete old logs'], 1, 'Log correlation: traceId/spanId added to MDC (Mapped Diagnostic Context). Log pattern includes %X{traceId}. In log aggregation (ELK/Loki), query by traceId to see all logs for a specific request. Why others are wrong: It does not encrypt, compress, or delete logs.'),
q('What is OpenTelemetry and why is it important?', ['A proprietary tracing tool from Google', 'A vendor-neutral, open-source standard for traces, metrics, and logs that can export to ANY backend (Zipkin, Jaeger, Datadog, Grafana)', 'A database engine', 'A programming language'], 1, 'OpenTelemetry (CNCF) provides unified APIs, SDKs, and the OTLP protocol for observability. It prevents vendor lock-in: instrument once, export anywhere. OTel Collector provides a vendor-neutral pipeline. Why others are wrong: It is not proprietary, not a database, not a language.')
],
[
'Traces track end-to-end request journeys; Spans track individual operations within traces.',
'Context propagation via HTTP headers (W3C TraceContext) carries traceId/spanId across services.',
'Micrometer Tracing auto-instruments Spring Boot; Zipkin/Jaeger visualize trace waterfalls.',
'Correlate traces with logs (MDC traceId) and metrics for complete observability.',
'OpenTelemetry provides vendor-neutral instrumentation — instrument once, export anywhere.'
],
'This Expert Track lab requires JDK 21+. Use your native terminal for compilation. No external frameworks required — pure Java tracing implementation.'
),

// ═══════════════════════════════════════════
// JAVA EXPERT TRACK — PART 5: CLOUD-NATIVE & KUBERNETES
// ═══════════════════════════════════════════

L(
'javax-21', 21, 'Kubernetes Deep Dive: Deployments, Services & Ingress', '☸️',
'☸️ Kubernetes is the operating system of the cloud. It orchestrates containers across clusters of machines, handling scaling, healing, networking, and deployment strategies automatically. For Java engineers, understanding how Spring Boot applications map to Kubernetes primitives — Pods, Deployments, Services, Ingress, and ConfigMaps — is the difference between deploying code that works and deploying code that scales to millions of users.',
[
{
title: '1. Pods & Container Lifecycle',
beginner: 'A Pod is the smallest unit in Kubernetes — it wraps one or more containers that share the same network and storage. Think of it as a single "application instance" running your Spring Boot JAR inside a Docker container. When a Pod dies, Kubernetes automatically creates a new one.',
advanced: 'Pod architecture: (1) Pause container (infra container) holds the network namespace. (2) Application containers share the network namespace (localhost communication). (3) Init containers run sequentially before app containers (database migrations, config fetching). Pod lifecycle phases: Pending → Running → Succeeded/Failed. Container states: Waiting, Running, Terminated. Liveness probe: HTTP GET /actuator/health/liveness — restarts container if failing. Readiness probe: HTTP GET /actuator/health/readiness — removes Pod from Service endpoints if not ready. Startup probe: protects slow-starting apps (Java JVM warmup) from premature liveness kills. Spring Boot 3: management.endpoint.health.probes.enabled=true exposes liveness/readiness groups.'
},
{
title: '2. Deployments & Rolling Update Strategies',
beginner: 'A Deployment manages a set of identical Pods. When you update your application, Kubernetes performs a Rolling Update — it gradually replaces old Pods with new ones, ensuring zero downtime. If something goes wrong, you can roll back instantly.',
advanced: 'Deployment spec: replicas (desired Pod count), strategy (RollingUpdate or Recreate), revisionHistoryLimit (rollback depth). RollingUpdate parameters: maxUnavailable (Pods allowed down during update, default 25%), maxSurge (extra Pods created during update, default 25%). Example: 10 replicas, maxUnavailable=1, maxSurge=1 → updates 1 Pod at a time, never below 9 running. Rollback: kubectl rollout undo deployment/my-app — reverts to previous ReplicaSet. Deployment annotations track revision history. Spring Boot + Kubernetes: readiness gates prevent traffic to Pods still warming up JIT. Graceful shutdown: server.shutdown=graceful + spring.lifecycle.timeout-per-shutdown-phase=30s ensures in-flight requests complete before Pod termination.'
},
{
title: '3. Services & Network Routing',
beginner: 'Pods are ephemeral — they get new IP addresses every restart. A Service provides a STABLE network endpoint (DNS name + ClusterIP) that load-balances traffic across all healthy Pods. It is the "phone number" that never changes, even when the "phones" (Pods) are swapped.',
advanced: 'Service types: (1) ClusterIP (default): internal-only virtual IP, accessible within cluster. (2) NodePort: exposes on every node IP at static port (30000-32767). (3) LoadBalancer: provisions cloud LB (AWS ALB, GCP LB). (4) ExternalName: DNS CNAME to external service. Service discovery: CoreDNS provides DNS records: my-service.my-namespace.svc.cluster.local. Kube-proxy implements Services via iptables (Linux) or IPVS (high-performance). Endpoint Slices track Pod IPs dynamically. Spring Cloud Kubernetes: DiscoveryClient integrates with Kubernetes Services for client-side load balancing via Spring Cloud LoadBalancer.'
},
{
title: '4. Ingress & TLS Termination',
beginner: 'An Ingress is the "front door" of your cluster. It routes external HTTP/HTTPS traffic to internal Services based on URL paths or hostnames. It handles SSL certificates so your internal services can communicate over plain HTTP.',
advanced: 'Ingress resource defines routing rules: host (api.example.com), path (/orders → order-service), backend (Service + port). Ingress Controller (NGINX, Traefik, AWS ALB Controller) implements the rules. TLS termination: spec.tls[].secretName references a Kubernetes Secret containing cert + key. Cert-Manager automates Let\'s Encrypt certificate provisioning and renewal. Path types: Exact, Prefix, ImplementationSpecific. Spring Boot behind Ingress: server.forward-headers-strategy=framework enables X-Forwarded-* header processing for correct client IP and protocol detection.'
},
{
title: '5. ConfigMaps, Secrets & Spring Cloud Kubernetes (Expert Teaser)',
beginner: 'Your application needs configuration (database URLs, API keys) that changes between environments. ConfigMaps store non-sensitive config. Secrets store sensitive data (passwords, tokens). Spring Cloud Kubernetes reads them automatically and refreshes your app when they change!',
advanced: '(Expert Teaser) ConfigMap: key-value pairs mounted as files or environment variables. Secret: base64-encoded (NOT encrypted by default — enable encryption at rest via EncryptionConfiguration). Spring Cloud Kubernetes: (1) spring.cloud.kubernetes.config.sources defines ConfigMap names. (2) spring.cloud.kubernetes.secrets.sources defines Secret names. (3) @RefreshScope + ConfigMap watch enables hot-reload without restart. (4) spring.cloud.kubernetes.discovery.all-namespaces=true for cross-namespace service discovery. In the Expert track, we explore: Helm charts for templated Kubernetes manifests, Kustomize for environment-specific overlays, Operator pattern for custom Java controllers (Java Operator SDK), and GitOps with ArgoCD for declarative cluster state management.'
}
],
{
title: '☸️ Lab: Deploy Spring Boot to Kubernetes',
intro: '⚠️ NOTE: Deploy a Spring Boot application to a local Kubernetes cluster (kind/minikube), configure health probes, perform a rolling update, and verify zero-downtime deployment.',
steps: [
'Install kind (Kubernetes in Docker): kind create cluster --name java-expert.',
'Build your Spring Boot app as a Docker image: docker build -t my-app:1.0 .',
'Load image into kind: kind load docker-image my-app:1.0 --name java-expert.',
'Create deployment.yaml: apiVersion: apps/v1, kind: Deployment, spec.replicas: 3, strategy.rollingUpdate.maxUnavailable: 1, maxSurge: 1.',
'Add container spec: image: my-app:1.0, ports: [8080], livenessProbe: httpGet /actuator/health/liveness, readinessProbe: httpGet /actuator/health/readiness, startupProbe: httpGet /actuator/health with failureThreshold: 30, periodSeconds: 2.',
'Create service.yaml: apiVersion: v1, kind: Service, spec.type: ClusterIP, ports: [8080].',
'Apply: kubectl apply -f deployment.yaml -f service.yaml.',
'Watch rollout: kubectl rollout status deployment/my-app.',
'Update to v2: docker build -t my-app:2.0 . && kubectl set image deployment/my-app my-app=my-app:2.0.',
'Observe rolling update: kubectl get pods -w. Verify zero downtime with continuous curl requests.'
],
goal: 'You deployed a Spring Boot application to Kubernetes with health probes, performed a zero-downtime rolling update, and understood Pod/Service/Deployment architecture.'
},
[
q('What is the purpose of a Kubernetes Startup Probe for Java applications?', ['To start the JVM faster', 'To protect slow-starting applications (JVM warmup, Spring context loading) from being killed by the Liveness Probe before they are ready', 'To start the database connection', 'To load environment variables'], 1, 'Java applications can take 30-60 seconds to start (Spring context, JIT warmup). Without a startup probe, the liveness probe would kill the Pod before it finishes starting. startupProbe delays liveness/readiness checks until startup succeeds. Why others are wrong: It does not speed up JVM, connect databases, or load env vars.'),
q('What happens during a Kubernetes Rolling Update with maxUnavailable=1 and maxSurge=1 on a 10-replica Deployment?', ['All 10 Pods restart simultaneously', 'One old Pod is terminated while one new Pod is created at a time, maintaining 9-11 running Pods throughout', 'The Deployment pauses until all old Pods are deleted', 'New Pods are created only after all old Pods are deleted'], 1, 'Rolling update with maxUnavailable=1, maxSurge=1: one old Pod terminates, one new Pod starts, maintaining minimum 9 and maximum 11 running Pods. This ensures zero downtime. Why others are wrong: It does not restart all at once (that is Recreate strategy). It does not pause or delete all first.'),
q('What is the difference between a Kubernetes Service and an Ingress?', ['They are identical', 'A Service provides a stable internal network endpoint (ClusterIP) for Pod load-balancing; an Ingress routes external HTTP/HTTPS traffic to Services based on host/path rules', 'A Service handles HTTPS; an Ingress handles HTTP', 'A Service is for databases; an Ingress is for web apps'], 1, 'Service: Layer 4 (TCP/UDP) load balancing with stable ClusterIP/DNS. Ingress: Layer 7 (HTTP/HTTPS) routing with host/path rules, TLS termination. Why others are wrong: They are not identical. Service does not handle HTTPS termination. Both work for any application type.'),
q('Why should you use spring.lifecycle.timeout-per-shutdown-phase=30s in Spring Boot on Kubernetes?', ['To make the app start faster', 'To ensure in-flight HTTP requests complete gracefully before the Pod is terminated during rolling updates or scaling', 'To reduce memory usage', 'To speed up database connections'], 1, 'When Kubernetes terminates a Pod (SIGTERM), Spring Boot with graceful shutdown waits up to 30s for in-flight requests to complete before closing. Without this, active requests are abruptly killed during deployments. Why others are wrong: It does not affect startup speed, memory, or DB connections.'),
q('What is the security risk of Kubernetes Secrets being base64-encoded by default?', ['Base64 is slow to decode', 'Base64 is encoding, NOT encryption — anyone with cluster access can decode Secrets in plaintext. Encryption at rest must be enabled separately', 'Base64 corrupts binary data', 'Base64 requires internet access'], 1, 'Base64 is reversible encoding, not encryption. kubectl get secret -o yaml reveals base64 values; base64 -d decodes them instantly. Production clusters MUST enable EncryptionConfiguration for at-rest encryption. Why others are wrong: Speed, corruption, and internet are irrelevant. The issue is lack of encryption.')
],
[
'Pods are the atomic deployment unit — configure liveness, readiness, and startup probes for Java apps.',
'Rolling Updates with maxUnavailable/maxSurge ensure zero-downtime deployments.',
'Services provide stable DNS/ClusterIP; Ingress handles external HTTP routing and TLS.',
'Use graceful shutdown (spring.lifecycle.timeout-per-shutdown-phase) to prevent request loss during updates.',
'Kubernetes Secrets are base64-encoded, NOT encrypted — enable encryption at rest for production.'
],
'This Expert Track lab requires Docker and kind/minikube installed locally. Use your native terminal for kubectl commands.'
),

L(
'javax-22', 22, 'GitOps & Progressive Delivery (ArgoCD, Canary)', '🚢',
'🚢 Deploying code should not be a manual, error-prone process triggered by a human clicking buttons. GitOps treats your Git repository as the single source of truth for your entire infrastructure. Every change is a Pull Request. Every deployment is a git commit. Progressive delivery (canary, blue-green) ensures new releases are validated with real traffic before full rollout. This is how Netflix, Spotify, and Intuit deploy thousands of times per day without outages.',
[
{
title: '1. GitOps Principles & ArgoCD',
beginner: 'GitOps means your entire infrastructure is described in Git. You don\'t SSH into servers or click cloud consoles. You write YAML files, push to Git, and a tool like ArgoCD automatically makes your cluster match those files. If someone manually changes something, ArgoCD detects the drift and reverts it!',
advanced: 'GitOps principles: (1) Declarative: desired state in Git. (2) Versioned: every change is a commit. (3) Pulled: agent pulls state (not pushed). (4) Continuously reconciled: controller ensures actual state matches desired. ArgoCD: Kubernetes-native GitOps controller. Watches Git repo, compares live cluster state, syncs differences. Sync strategies: automatic (auto-apply), manual (require approval). Health hooks: pre-sync (migrations), post-sync (smoke tests). Rollback: git revert + ArgoCD sync. Multi-cluster: ArgoCD manages multiple clusters from single control plane.'
},
{
title: '2. Canary Deployments',
beginner: 'Instead of releasing to 100% of users at once, a Canary deployment releases to 5% first. You monitor error rates and latency. If everything looks good, you gradually increase to 25%, 50%, 100%. If something breaks, you instantly roll back the 5% and no one notices.',
advanced: 'Canary implementation: (1) Argo Rollouts: Kubernetes CRD extending Deployments with canary/blueGreen strategies. Steps: setWeight: 5 → pause: duration: 5m → analysis (Prometheus query) → setWeight: 25 → ... → 100. (2) Istio VirtualService: traffic splitting by weight (5% to canary, 95% to stable). (3) Flagger: automated canary analysis with custom metrics (success rate, p99 latency). Analysis templates query Prometheus/Datadog: if error_rate > 1%, automatic rollback. Spring Boot: micrometer metrics expose JVM + HTTP metrics to Prometheus for canary analysis.'
},
{
title: '3. Blue-Green Deployments',
beginner: 'Blue-Green is like having two identical stages. The Blue stage is live. You deploy the new version to the Green stage. You test Green thoroughly. When ready, you flip a switch and ALL traffic instantly moves to Green. If something breaks, flip back to Blue instantly.',
advanced: 'Blue-Green: two complete environments (Blue=current, Green=new). Zero-downtime cutover via Service selector switch or Ingress backend change. Advantages: instant rollback, full pre-production testing. Disadvantages: 2x resource cost, database migration challenges (schema must be backward-compatible). Argo Rollouts blueGreen strategy: autoPromotionSeconds for automatic promotion after soak time. Spring Boot: database migrations must be additive-only (expand-contract pattern) to support Blue-Green rollbacks.'
},
{
title: '4. Feature Flags & Progressive Exposure',
beginner: 'Feature flags let you deploy code WITHOUT releasing the feature. The code is live but hidden behind a switch. You can enable it for 1% of users, then 10%, then everyone. If a bug appears, you flip the switch off instantly without redeploying.',
advanced: 'Feature flag systems: LaunchDarkly, Unleash, Flagsmith, or custom (Spring Cloud Config + @RefreshScope). Implementation: if (featureFlag.isEnabled("new-checkout", userId)) { newCheckout(); } else { legacyCheckout(); }. Targeting rules: percentage rollout, user segments, geographic regions. Kill switches: instant disable without deployment. Spring Boot: @ConfigurationProperties + Actuator /refresh endpoint for dynamic flag updates. Combine with canary: deploy code (flag OFF) → canary traffic → enable flag progressively.'
},
{
title: '5. Automated Rollback & Observability (Expert Teaser)',
beginner: 'The best deployment system is one that rolls back automatically when something goes wrong. You set rules: "If error rate exceeds 1% or p99 latency exceeds 500ms, roll back immediately." The system monitors, decides, and acts — no human needed at 3 AM.',
advanced: '(Expert Teaser) Automated rollback pipeline: (1) Deploy canary. (2) Route 5% traffic. (3) AnalysisRun queries Prometheus: histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m])) > 0.5 → FAIL. (4) Argo Rollouts aborts canary, routes 100% to stable. (5) Alert via PagerDuty/Slack. Observability stack: Prometheus (metrics), Grafana (dashboards), Loki (logs), Tempo (traces). SLOs: 99.9% availability, p99 < 200ms. Error budgets: 43 minutes downtime/month allowed. In the Expert track, we build a complete GitOps pipeline: GitHub → ArgoCD → Canary → Prometheus analysis → auto-rollback, with Slack notifications and audit trails.'
}
],
{
title: '🚢 Lab: Canary Deployment with Argo Rollouts',
intro: '⚠️ NOTE: Deploy a canary release strategy using Argo Rollouts, configure traffic splitting, and set up automated analysis with rollback on error rate threshold.',
steps: [
'Install Argo Rollouts: kubectl create namespace argo-rollouts && kubectl apply -n argo-rollouts -f https://github.com/argoproj/argo-rollouts/releases/latest/download/install.yaml.',
'Create Rollout resource: apiVersion: argoproj.io/v1alpha1, kind: Rollout, spec.strategy.canary.steps: [{setWeight: 10}, {pause: {duration: 60}}, {setWeight: 50}, {pause: {duration: 60}}, {setWeight: 100}].',
'Configure analysis: spec.strategy.canary.analysis.templates: [{templateName: success-rate}], metrics: [{name: success-rate, provider: prometheus, query: sum(rate(http_requests_total{status=~"5.*"}[5m])) / sum(rate(http_requests_total[5m])), failureCondition: result > 0.01}].',
'Deploy v1: kubectl apply -f rollout.yaml. Verify stable state: kubectl argo rollouts get rollout my-app.',
'Deploy v2: Update image tag. Watch canary: kubectl argo rollouts get rollout my-app --watch.',
'Observe traffic split: 10% → pause → 50% → pause → 100%. Verify analysis passes.',
'Test rollback: Deploy v3 with intentional error. Watch analysis fail and automatic rollback to v2.',
'Verify: kubectl argo rollouts get rollout my-app shows stable on v2.'
],
goal: 'You implemented a progressive canary deployment with automated traffic splitting, metric-based analysis, and automatic rollback on failure.'
},
[
q('What is the fundamental principle of GitOps?', ['Deploy code by SSH-ing into servers', 'Git repository is the single source of truth; a controller continuously reconciles cluster state to match Git', 'Use Jenkins to push deployments', 'Store configuration in environment variables only'], 1, 'GitOps: declarative state in Git, versioned changes via commits, pulled by agent, continuously reconciled. ArgoCD/Flux ensure actual state matches desired state. Why others are wrong: SSH is imperative (anti-GitOps). Jenkins push is CI, not GitOps. Env vars are not GitOps.'),
q('How does a Canary deployment reduce risk compared to a full rollout?', ['It deploys faster', 'It releases to a small percentage of users first (5-10%), monitors metrics, and gradually increases traffic, enabling instant rollback if errors appear', 'It uses less memory', 'It skips testing'], 1, 'Canary limits blast radius: if v2 has a bug, only 5% of users are affected. Metrics (error rate, latency) trigger automatic rollback before wider impact. Why others are wrong: Speed, memory, and testing are not the primary risk reduction mechanisms.'),
q('What is the key difference between Blue-Green and Canary deployments?', ['Blue-Green is faster', 'Blue-Green switches 100% traffic instantly between two complete environments; Canary gradually shifts traffic percentages over time', 'Canary requires two clusters', 'Blue-Green cannot roll back'], 1, 'Blue-Green: binary cutover (0% → 100%). Canary: gradual (5% → 25% → 50% → 100%). Blue-Green requires 2x resources. Canary requires traffic splitting (Istio, Argo Rollouts). Why others are wrong: Canary does not need two clusters. Blue-Green CAN roll back (flip back to Blue).'),
q('What triggers an automated rollback in Argo Rollouts canary analysis?', ['A human clicks rollback', 'AnalysisRun metrics (error rate, latency) exceed failure thresholds defined in the AnalysisTemplate', 'The deployment takes too long', 'The Pod restarts'], 1, 'Argo Rollouts executes AnalysisRun queries (Prometheus, Datadog, CloudWatch). If failureCondition is met (e.g., error_rate > 1%), the Rollout automatically aborts canary and reverts to stable. Why others are wrong: It is automated, not manual. Duration and Pod restarts do not trigger analysis rollback.'),
q('Why must database migrations be backward-compatible for Blue-Green deployments?', ['Because databases are slow', 'Because Blue (old version) and Green (new version) may both be running simultaneously during cutover, requiring the schema to support both code versions', 'Because Kubernetes requires it', 'Because Git cannot track database changes'], 1, 'During Blue-Green transition, both versions may query the database. Schema changes must be additive-only (expand-contract): add new column → deploy Green → migrate data → remove old column. Why others are wrong: It is not about speed, Kubernetes requirements, or Git tracking.')
],
[
'GitOps: Git is the source of truth; ArgoCD reconciles cluster state declaratively.',
'Canary: gradual traffic shift (5% → 100%) with metric-based analysis and auto-rollback.',
'Blue-Green: instant cutover between two complete environments (2x resource cost).',
'Feature flags decouple deployment from release — deploy dark, enable progressively.',
'Automated rollback via AnalysisTemplates querying Prometheus/Datadog for SLO violations.'
],
'This Expert Track lab requires a Kubernetes cluster with Argo Rollouts installed. Use your native terminal for kubectl and argo commands.'
),

// ═══════════════════════════════════════════
// JAVA EXPERT TRACK — PART 6: SPRING ECOSYSTEM MASTERY
// ═══════════════════════════════════════════

L(
'javax-26', 26, 'Spring Boot Internals & Auto-Configuration Magic', '🌱',
'🌱 Spring Boot feels like magic: add a dependency, and suddenly you have a web server, database connection pool, and metrics endpoint. But magic is just engineering you don\'t understand yet. Spring Boot\'s auto-configuration is a deterministic, conditional bean registration system driven by spring.factories files, @Conditional annotations, and classpath detection. Understanding this machinery transforms you from a Spring Boot user into a Spring Boot architect who can debug, extend, and override any auto-configuration.',
[
{
title: '1. The ApplicationContext & Bean Lifecycle',
beginner: 'When your Spring Boot app starts, it creates an ApplicationContext — a giant container that creates, wires, and manages all your objects (called Beans). Every @Component, @Service, @Repository, @Controller is a Bean. Spring creates them, injects their dependencies, calls their @PostConstruct methods, and keeps them alive until shutdown.',
advanced: 'Bean lifecycle: (1) Instantiation (constructor or factory method). (2) Populate properties (dependency injection). (3) BeanNameAware/BeanFactoryAware callbacks. (4) BeanPostProcessor.postProcessBeforeInitialization. (5) @PostConstruct / InitializingBean.afterPropertiesSet / init-method. (6) BeanPostProcessor.postProcessAfterInitialization (AOP proxies created here). (7) Bean ready for use. (8) @PreDestroy / DisposableBean.destroy / destroy-method on shutdown. ApplicationContext types: AnnotationConfigApplicationContext, WebApplicationContext. Spring Boot uses AnnotationConfigServletWebServerApplicationContext for web apps.'
},
{
title: '2. Auto-Configuration & @Conditional',
beginner: 'Spring Boot scans your classpath. If it finds H2 database JAR, it automatically configures an H2 DataSource. If it finds Tomcat JAR, it configures an embedded Tomcat server. This is auto-configuration — it only activates when the conditions are met.',
advanced: 'Auto-configuration mechanism: (1) @EnableAutoConfiguration triggers ImportAutoConfigurationImportSelector. (2) Reads META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports (Spring Boot 3) or spring.factories (Spring Boot 2). (3) Each auto-config class has @Conditional annotations: @ConditionalOnClass (classpath detection), @ConditionalOnMissingBean (user override), @ConditionalOnProperty (config flag), @ConditionalOnWebApplication. (4) Order matters: @AutoConfigureBefore/@AutoConfigureAfter. Override: define your own Bean of the same type — @ConditionalOnMissingBean backs off. Debug: --debug flag prints auto-configuration report.'
},
{
title: '3. Spring Boot Starters & Dependency Management',
beginner: 'Instead of adding 20 dependencies manually, you add ONE starter: spring-boot-starter-web pulls in Tomcat, Spring MVC, Jackson, and validation — all with compatible versions. The Spring Boot parent POM manages version compatibility so you never fight dependency conflicts.',
advanced: 'Starters are dependency-only POMs: spring-boot-starter-web → spring-web, spring-webmvc, spring-boot-starter-tomcat, spring-boot-starter-json, spring-boot-starter-validation. Version management: spring-boot-dependencies BOM (Bill of Materials) defines compatible versions for 200+ libraries. Inheritance: <parent>spring-boot-starter-parent</parent> or import via <dependencyManagement>. Custom starters: create a module with auto-configuration + configuration properties + spring.factories. Spring Boot 3: GraalVM native hints via RuntimeHintsRegistrar for Native Image compatibility.'
},
{
title: '4. Configuration Properties & Profiles',
beginner: 'Spring Boot reads configuration from application.yml, environment variables, and command-line arguments in a specific priority order. Profiles (dev, staging, prod) let you have different configs for different environments. @ConfigurationProperties binds YAML to type-safe Java objects.',
advanced: 'Configuration property sources (highest to lowest priority): (1) Command-line args. (2) Java System properties. (3) OS environment variables. (4) Profile-specific application-{profile}.yml. (5) application.yml. (6) @PropertySource. (7) Default properties. @ConfigurationProperties(prefix="app") + @ConstructorBinding creates immutable config objects. Validation: @Validated + JSR-380 annotations. Relaxed binding: app.max-connections = app.maxConnections = APP_MAXCONNECTIONS. Profiles: spring.profiles.active=prod activates application-prod.yml. Spring Cloud Config externalizes to Git/Vault.'
},
{
title: '5. Spring Boot Actuator & Observability (Expert Teaser)',
beginner: 'Actuator adds production monitoring endpoints to your app: /actuator/health (is it alive?), /actuator/metrics (JVM memory, HTTP latency), /actuator/env (configuration), /actuator/threaddump (what are threads doing?). These are essential for Kubernetes probes and Prometheus scraping.',
advanced: '(Expert Teaser) Actuator endpoints: /health (liveness/readiness groups), /metrics (Micrometer registry), /info, /env, /beans, /threaddump, /heapdump, /loggers (dynamic log level change), /prometheus. Custom metrics: MeterRegistry.counter("orders.created").increment(). Custom health indicators: HealthIndicator interface for database/API checks. Micrometer exports to Prometheus, Datadog, New Relic. In the Expert track, we explore: custom Actuator endpoints for business metrics, distributed tracing with Micrometer Tracing + Zipkin, and building a complete observability stack with Prometheus + Grafana + Loki for Spring Boot microservices.'
}
],
{
title: '🌱 Lab: Debugging Auto-Configuration & Custom Starter',
intro: '⚠️ NOTE: Debug Spring Boot auto-configuration, override a default Bean, and build a minimal custom starter with conditional configuration.',
steps: [
'Create a Spring Boot app with spring-boot-starter-web and spring-boot-starter-data-jpa.',
'Run with --debug flag: java -jar app.jar --debug. Read the auto-configuration report: POSITIVE matches (activated) and NEGATIVE matches (skipped with reasons).',
'Find DataSourceAutoConfiguration in the report. Note @ConditionalOnClass(DataSource.class) and @ConditionalOnMissingBean(DataSource.class).',
'Override the auto-configured DataSource: define your own @Bean DataSource in a @Configuration class. Rerun --debug. Observe DataSourceAutoConfiguration now shows NEGATIVE match: @ConditionalOnMissingBean.',
'Create a custom auto-configuration: public class MyFeatureAutoConfiguration { @Bean @ConditionalOnProperty("myfeature.enabled") public MyFeatureService myFeature() { return new MyFeatureService(); } }.',
'Register in META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports: com.example.MyFeatureAutoConfiguration.',
'Test: Set myfeature.enabled=true in application.yml. Verify Bean is created. Set false. Verify Bean is absent.',
'Expose Actuator: management.endpoints.web.exposure.include=health,metrics,env. Query /actuator/health and /actuator/metrics/jvm.memory.used.'
],
goal: 'You debugged Spring Boot auto-configuration, understood @Conditional mechanics, overrode default Beans, and built a custom starter with conditional activation.'
},
[
q('What annotation condition causes Spring Boot auto-configuration to back off when a user defines their own Bean?', ['@ConditionalOnClass', '@ConditionalOnMissingBean', '@ConditionalOnProperty', '@ConditionalOnWebApplication'], 1, '@ConditionalOnMissingBean checks if a Bean of the specified type already exists. If the user defined one, auto-configuration skips its own. This is how user overrides work. Why others are wrong: @ConditionalOnClass checks classpath. @ConditionalOnProperty checks config. @ConditionalOnWebApplication checks web context.'),
q('Where does Spring Boot 3 read the list of auto-configuration classes?', ['web.xml', 'META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports', 'application.yml', 'pom.xml'], 1, 'Spring Boot 3 uses META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports (one class per line). Spring Boot 2 used META-INF/spring.factories. Why others are wrong: web.xml is legacy Servlet. application.yml is configuration. pom.xml is Maven.'),
q('What is the highest-priority configuration property source in Spring Boot?', ['application.yml', 'application.properties', 'Command-line arguments (--server.port=9090)', 'System environment variables'], 2, 'Priority order: command-line args > Java system properties > OS env vars > profile-specific YAML > application.yml > @PropertySource > defaults. Why others are wrong: application.yml is lower priority. Env vars are below system properties. Command-line always wins.'),
q('What does @ConfigurationProperties(prefix="app") do?', ['It creates a new application context', 'It binds YAML/properties values starting with app.* to fields of the annotated class with type safety and validation', 'It reads only from environment variables', 'It creates a REST endpoint'], 1, '@ConfigurationProperties binds externalized configuration to a typed Java object: app.max-connections=100 → private int maxConnections. Supports validation (@Validated), constructor binding, relaxed binding. Why others are wrong: It does not create contexts, read only env vars, or create endpoints.'),
q('What is the purpose of Spring Boot Actuator /actuator/health endpoint in Kubernetes?', ['To display the homepage', 'To serve as the liveness/readiness probe target, telling Kubernetes whether the Pod should receive traffic or be restarted', 'To store health records', 'To monitor CPU temperature'], 1, 'Kubernetes liveness probe calls /actuator/health/liveness. If it fails, Kubernetes restarts the container. Readiness probe calls /actuator/health/readiness. If it fails, Kubernetes removes Pod from Service endpoints. Why others are wrong: It is not a homepage, health records, or hardware monitoring.')
],
[
'Auto-configuration is conditional bean registration driven by @Conditional annotations and classpath detection.',
'@ConditionalOnMissingBean enables user overrides — define your own Bean to replace auto-configured defaults.',
'Spring Boot 3 uses META-INF/spring/...AutoConfiguration.imports for auto-config discovery.',
'Configuration priority: CLI args > system props > env vars > profile YAML > application.yml.',
'Actuator endpoints (/health, /metrics) power Kubernetes probes and Prometheus observability.'
],
'This Expert Track lab requires JDK 21+ and Maven. Use your native terminal for Spring Boot execution with --debug flag.'
),

L(
'javax-27', 27, 'Spring Security Deep Dive: OAuth2, JWT & Method Security', '🔐',
'🔐 Security is not a feature — it is an architectural property. Spring Security is the most powerful authentication and authorization framework in the Java ecosystem, but its filter-chain architecture, OAuth2 flows, and JWT token mechanics are deeply misunderstood. This lesson demystifies the SecurityFilterChain, explains stateless JWT authentication, and implements method-level authorization that protects every endpoint by default.',
[
{
title: '1. SecurityFilterChain Architecture',
beginner: 'Every HTTP request to your Spring app passes through a chain of security filters BEFORE reaching your controller. These filters check authentication, validate tokens, enforce roles, and block attacks. You configure this chain once, and it protects every endpoint automatically.',
advanced: 'Spring Security architecture: DelegatingFilterProxy → FilterChainProxy → SecurityFilterChain (ordered list of SecurityFilters). Default filters: SecurityContextPersistenceFilter, UsernamePasswordAuthenticationFilter, BasicAuthenticationFilter, ExceptionTranslationFilter, FilterSecurityInterceptor. Spring Boot 3: SecurityFilterChain @Bean replaces WebSecurityConfigurerAdapter. Custom chain: http.securityMatcher("/api/**").authorizeHttpRequests(auth -> auth.requestMatchers("/public").permitAll().anyRequest().authenticated()).oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults())). Order: @Order(1) for API chain, @Order(2) for admin chain.'
},
{
title: '2. JWT Stateless Authentication',
beginner: 'Instead of storing login sessions in server memory (which breaks scaling), JWT authentication gives the user a signed token. Every request includes this token. The server verifies the signature without any database lookup. This is how you authenticate millions of users across multiple servers.',
advanced: 'JWT structure: header (alg: RS256) + payload (sub, exp, roles) + signature. Spring Security: oauth2ResourceServer().jwt() configures JwtAuthenticationProvider. JwtDecoder validates signature using public key (JWKS endpoint or configured key). JwtAuthenticationConverter extracts authorities from claims: jwt.getClaimAsStringList("roles") → GrantedAuthority. Stateless session: SessionCreationPolicy.STATELESS (no HttpSession). Token propagation: Authorization: Bearer <token> header. Refresh tokens: short-lived access token (15min) + long-lived refresh token (7d) stored securely. Spring Authorization Server implements full OAuth2 Authorization Server.'
},
{
title: '3. OAuth2 Authorization Code Flow',
beginner: 'When a user clicks "Login with Google", your app redirects them to Google. Google asks the user to approve. Google sends back an authorization code. Your server exchanges this code for tokens. The user never gives you their Google password. This is OAuth2 Authorization Code Flow.',
advanced: 'OAuth2 Authorization Code Flow: (1) Client redirects to /oauth2/authorization/{registrationId}. (2) Authorization server authenticates user, returns authorization code via redirect_uri. (3) Client exchanges code for tokens at /oauth2/token (client_id + client_secret + code). (4) Access token + refresh token returned. (5) Client uses access token for API calls. Spring Security: oauth2Login() for social login, oauth2Client() for token management. PKCE (Proof Key for Code Exchange) for public clients (SPA, mobile). Spring Authorization Server: @EnableAuthorizationServer with RegisteredClientRepository for custom OAuth2 provider.'
},
{
title: '4. Method Security (@PreAuthorize)',
beginner: 'URL-based security is coarse. Method security protects individual functions: @PreAuthorize("hasRole('ADMIN')") on a method means only admins can call it. @PreAuthorize("#userId == authentication.name") means users can only access their OWN data. This is defense-in-depth.',
advanced: 'Method security: @EnableMethodSecurity activates @PreAuthorize/@PostAuthorize/@PreFilter/@PostFilter. SpEL expressions: hasRole(), hasAuthority(), isAuthenticated(), #param references, @bean.method() calls. Example: @PreAuthorize("hasRole('ADMIN') or #orderId == authentication.principal.orderId"). Post-filter: @PostFilter("filterObject.owner == authentication.name") filters returned collections. JSR-250: @RolesAllowed("ADMIN"). AspectJ proxy intercepts method calls, evaluates SpEL, throws AccessDeniedException on failure. Performance: SpEL evaluation adds ~1μs per call — negligible for I/O-bound methods.'
},
{
title: '5. CORS, CSRF & Security Headers (Expert Teaser)',
beginner: 'CORS controls which websites can call your API. CSRF protects against forged requests from malicious sites. Security headers (X-Frame-Options, Content-Security-Policy) prevent clickjacking and XSS attacks. Misconfiguring these is the #1 cause of security breaches.',
advanced: '(Expert Teaser) CORS: @CrossOrigin or CorsConfigurationSource bean. Allowed origins, methods, headers. For APIs: Access-Control-Allow-Origin: https://trusted.com. CSRF: disabled for stateless JWT APIs (no cookies = no CSRF). Enabled for session-based apps via CsrfTokenRepository. Security headers: X-Content-Type-Options: nosniff, X-Frame-Options: DENY, Content-Security-Policy, Strict-Transport-Security (HSTS). Spring Security defaults enable most headers. In the Expert track, we explore: OAuth2 token introspection vs JWT validation trade-offs, mutual TLS (mTLS) for service-to-service auth, OpenID Connect (OIDC) identity federation, and Spring Security integration with Keycloak/Okta enterprise identity providers.'
}
],
{
title: '🔐 Lab: JWT Resource Server with Method Security',
intro: '⚠️ NOTE: Configure a Spring Boot resource server with JWT validation, stateless sessions, and method-level @PreAuthorize authorization.',
steps: [
'Create Spring Boot app with dependencies: spring-boot-starter-security, spring-boot-starter-oauth2-resource-server, spring-boot-starter-web.',
'Configure JWT decoder: spring.security.oauth2.resourceserver.jwt.issuer-uri=https://your-auth-server.com (or jwk-set-uri).',
'Define SecurityFilterChain: @Bean SecurityFilterChain filterChain(HttpSecurity http) { http.sessionManagement(s -> s.sessionCreationPolicy(STATELESS)).authorizeHttpRequests(a -> a.requestMatchers("/public").permitAll().anyRequest().authenticated()).oauth2ResourceServer(o -> o.jwt(Customizer.withDefaults())); }.',
'Create controller: @RestController with @GetMapping("/api/orders"). @PreAuthorize("hasRole('USER')") public List<Order> getOrders() { ... }.',
'Add admin endpoint: @PreAuthorize("hasRole('ADMIN')") @DeleteMapping("/api/orders/{id}") public void delete(@PathVariable Long id) { ... }.',
'Enable method security: @EnableMethodSecurity on main class.',
'Test with curl: curl -H "Authorization: Bearer <valid-jwt>" http://localhost:8080/api/orders. Verify 200.',
'Test without token: curl http://localhost:8080/api/orders. Verify 401 Unauthorized.',
'Test with USER token on ADMIN endpoint: Verify 403 Forbidden.'
],
goal: 'You configured a stateless JWT resource server with SecurityFilterChain, method-level @PreAuthorize authorization, and verified authentication/authorization enforcement.'
},
[
q('What does SessionCreationPolicy.STATELESS mean in Spring Security?', ['The server does not store any user data', 'No HTTP session is created; authentication is derived entirely from the request (JWT token) on every call, enabling horizontal scaling', 'The server forgets all data after restart', 'Sessions are stored in a database'], 1, 'STATELESS means Spring Security does not create or use HttpSession. Each request must carry authentication (JWT Bearer token). This enables stateless horizontal scaling across multiple servers without session replication. Why others are wrong: It does not delete data, forget on restart, or use DB sessions.'),
q('How does Spring Security validate a JWT token signature?', ['By calling the user database', 'By verifying the signature using the public key from the JWKS (JSON Web Key Set) endpoint or configured key, without any database lookup', 'By checking the token expiration only', 'By comparing with a stored session ID'], 1, 'JWT validation: JwtDecoder fetches public key from issuer\'s JWKS endpoint (/.well-known/jwks.json) or uses configured RSA/EC public key. Signature verification is cryptographic — no DB needed. Expiration (exp claim) is also checked. Why others are wrong: No DB call, not just expiration, no session comparison.'),
q('What does @PreAuthorize("#userId == authentication.name") enforce?', ['Any authenticated user can access', 'Only the user whose username matches the userId parameter can access — users can only access their OWN data', 'Only ADMIN role can access', 'No one can access'], 1, 'SpEL expression compares the method parameter #userId with the authenticated principal\'s name. If they don\'t match, AccessDeniedException (403). This implements horizontal authorization (users access only their own resources). Why others are wrong: It is not role-based, not open to all authenticated, not admin-only, and not a blanket denial.'),
q('Why is CSRF protection typically DISABLED for stateless JWT APIs?', ['CSRF is not a real threat', 'CSRF attacks exploit browser cookies sent automatically; stateless JWT APIs use Authorization headers (not cookies), so CSRF is not applicable', 'JWT tokens are encrypted', 'Spring Security does not support CSRF'], 1, 'CSRF exploits automatic cookie submission by browsers. JWT APIs use Authorization: Bearer header, which browsers do NOT send automatically. No cookies = no CSRF vector. Session-based apps MUST keep CSRF enabled. Why others are wrong: CSRF is real for cookie-based apps. JWT is signed, not encrypted. Spring Security fully supports CSRF.'),
q('What is the OAuth2 Authorization Code Flow with PKCE used for?', ['Server-to-server authentication', 'Public clients (SPAs, mobile apps) that cannot securely store client secrets — PKCE prevents authorization code interception attacks', 'Database encryption', 'File upload authentication'], 1, 'PKCE (Proof Key for Code Exchange) adds a code_verifier/code_challenge pair to prevent authorization code interception. Essential for SPAs and mobile apps that cannot keep client_secret confidential. Why others are wrong: Server-to-server uses client_credentials grant. Not for DB encryption or file uploads.')
],
[
'SecurityFilterChain is an ordered filter pipeline — every request passes through before reaching controllers.',
'JWT enables stateless authentication: validate signature with public key, no session storage, horizontal scaling.',
'@PreAuthorize with SpEL enables fine-grained method-level authorization (roles, ownership, custom logic).',
'Disable CSRF for stateless JWT APIs; keep it enabled for session-based apps.',
'OAuth2 Authorization Code + PKCE secures public clients (SPA, mobile) without client secrets.'
],
'This Expert Track lab requires JDK 21+, Maven, and an OAuth2 provider (Keycloak, Okta, or Spring Authorization Server). Use your native terminal for curl testing.'
),

L(
'javax-28', 28, 'Hibernate Internals: Caches, Dirty Checking & Criteria API', '🗃️',
'🗃️ Hibernate is the most widely used ORM in Java, but its internals are deeply misunderstood. The Persistence Context (first-level cache), dirty checking mechanism, N+1 query problem, and second-level cache are the difference between an application that scales and one that collapses under load. Understanding what Hibernate does BEFORE you write a single query is the mark of a senior Java engineer.',
[
{
title: '1. Persistence Context & Entity Lifecycle',
beginner: 'When you load an entity from the database, Hibernate keeps a copy in memory called the Persistence Context (or Session). Any changes you make to the entity are tracked automatically. When the transaction commits, Hibernate compares the current state to the original and generates the exact UPDATE SQL needed. This is called Dirty Checking.',
advanced: 'Persistence Context (EntityManager/Session): identity map caching entities by primary key within a transaction. Entity states: Transient (new, not persisted), Managed/Persistent (in Persistence Context, tracked), Detached (was persistent, Session closed), Removed (marked for deletion). Dirty checking: on flush(), Hibernate compares current field values to loaded snapshot (byte[] snapshot in EntityEntry). Only changed fields generate UPDATE SET clauses. Flush modes: AUTO (before queries), COMMIT (at transaction end), MANUAL (explicit). Detached entities require merge() to reattach — expensive operation.'
},
{
title: '2. N+1 Query Problem & Fetch Strategies',
beginner: 'If you load 100 Orders and then access order.getItems() for each one, Hibernate executes 1 query for orders + 100 queries for items = 101 queries! This is the N+1 problem. Fix it by telling Hibernate to load items eagerly with the orders using JOIN FETCH or @EntityGraph.',
advanced: 'N+1 root cause: LAZY loading triggers individual SELECT per parent entity when association accessed. Solutions: (1) JPQL JOIN FETCH: SELECT o FROM Order o JOIN FETCH o.items — single query with JOIN. (2) @EntityGraph(attributePaths={"items"}) on repository method. (3) @BatchSize(size=20) on association — batches lazy loads (IN clause with 20 IDs). (4) @Fetch(FetchMode.SUBSELECT) — single subselect for all children. (5) DTO projections — bypass entities entirely. Detection: Hibernate statistics (hibernate.generate_statistics=true) or datasource-proxy logging query count per request.'
},
{
title: '3. First-Level vs Second-Level Cache',
beginner: 'The First-Level Cache is automatic — it lives inside your transaction and ensures you never load the same entity twice. The Second-Level Cache is optional — it lives across transactions and can serve entities from memory without hitting the database at all.',
advanced: 'First-level cache: Persistence Context scope, mandatory, per-EntityManager. clear() evicts all. Second-level cache: SessionFactory scope, optional, requires cache provider (Ehcache, Caffeine, Infinispan). Enable: @Cacheable on entity + shared-cache-mode in persistence.xml. Cache concurrency strategies: READ_ONLY (immutable), NONSTRICT_READ_WRITE (eventual consistency), READ_WRITE (strict), TRANSACTIONAL (XA). Query cache: caches query result IDs, not entities. Hibernate cache hit ratio: SessionFactory.getStatistics().getSecondLevelCacheHitCount(). Invalidated on entity update.'
},
{
title: '4. Criteria API & Type-Safe Queries',
beginner: 'String-based queries ("SELECT u FROM User u WHERE u.name = :name") can have typos that only fail at runtime. The Criteria API lets you build queries using Java objects and method references, so the compiler catches mistakes before you run the code.',
advanced: 'Criteria API (JPA 2.0+): CriteriaBuilder cb = em.getCriteriaBuilder(); CriteriaQuery<User> cq = cb.createQuery(User.class); Root<User> root = cq.from(User.class); cq.where(cb.equal(root.get(User_.name), "Alice")). Type-safe metamodel: User_ generated by Hibernate Metamodel Generator (annotation processor). Dynamic queries: build predicates conditionally without string concatenation. Specifications (Spring Data JPA): interface specification pattern combining predicates with and()/or(). Performance: Criteria queries are parsed once, cached as PreparedStatements.'
},
{
title: '5. Optimistic Locking & @Version (Expert Teaser)',
beginner: 'What happens if two users edit the same order at the exact same time? Without protection, one user\'s changes overwrite the other\'s silently. Optimistic locking adds a version number — if the version changed between your read and your write, Hibernate throws an exception and you retry.',
advanced: '(Expert Teaser) Optimistic locking: @Version Long version field. UPDATE orders SET ..., version=version+1 WHERE id=? AND version=?. If 0 rows updated → OptimisticLockException. No database locks held — version check at commit. Pessimistic locking: @Lock(LockModeType.PESSIMISTIC_WRITE) — SELECT ... FOR UPDATE, holds DB lock until transaction end. Use for: high-contention financial operations. In the Expert track, we explore: Hibernate bytecode enhancement for lazy loading without proxies, multi-tenancy strategies (discriminator, schema, database), Envers for entity audit trails, and Hibernate 6 performance improvements with SQL AST (Abstract Syntax Tree) query generation.'
}
],
{
title: '🗃️ Lab: N+1 Diagnosis & Criteria API Queries',
intro: '⚠️ NOTE: Build a Spring Data JPA application, diagnose the N+1 query problem with statistics, fix it with JOIN FETCH, and build type-safe Criteria queries.',
steps: [
'Create Spring Boot app with spring-boot-starter-data-jpa and H2 database.',
'Define entities: @Entity Order (id, customer, @OneToMany List<OrderItem> items) and @Entity OrderItem (id, product, price, @ManyToOne Order order).',
'Enable Hibernate statistics: spring.jpa.properties.hibernate.generate_statistics=true in application.yml.',
'Seed 10 orders with 5 items each via CommandLineRunner.',
'Trigger N+1: @Query("SELECT o FROM Order o") List<Order> findAllOrders(); then access order.getItems() in a loop. Check logs: observe 11 SELECT statements.',
'Fix with JOIN FETCH: @Query("SELECT o FROM Order o JOIN FETCH o.items") List<Order> findAllWithItems();. Rerun: observe 1 SELECT with JOIN.',
'Build Criteria query: CriteriaBuilder cb = em.getCriteriaBuilder(); CriteriaQuery<Order> cq = cb.createQuery(Order.class); Root<Order> root = cq.from(Order.class); cq.where(cb.greaterThan(root.get("totalPrice"), 100.0));.',
'Add @Version Long version to Order. Test concurrent updates: two transactions read same Order, both modify, second commit throws OptimisticLockException.',
'Check cache statistics: entityManagerFactory.getCache().contains(Order.class, 1L).'
],
goal: 'You diagnosed and fixed the N+1 query problem, built type-safe Criteria queries, and implemented optimistic locking with @Version.'
},
[
q('What is the Hibernate Persistence Context (first-level cache)?', ['A database connection pool', 'An identity map within a transaction/EntityManager that caches loaded entities by primary key, ensuring the same entity is never loaded twice', 'A Redis cache', 'A browser cache'], 1, 'Persistence Context is a transaction-scoped identity map. em.find(Order.class, 1L) called twice returns the SAME object instance. Dirty checking compares current state to loaded snapshot. Why others are wrong: It is not a connection pool, Redis, or browser cache.'),
q('What causes the N+1 query problem in Hibernate?', ['Using too many entities', 'Lazy-loaded associations trigger individual SELECT queries per parent entity when accessed in a loop, resulting in 1 + N queries', 'Using H2 database', 'Having more than 100 tables'], 1, 'Default LAZY loading: accessing order.getItems() per order triggers a SELECT per order. 100 orders = 1 + 100 = 101 queries. Fix: JOIN FETCH, @EntityGraph, @BatchSize. Why others are wrong: It is not about entity count, database choice, or table count.'),
q('How does JOIN FETCH solve the N+1 problem?', ['It deletes unused entities', 'It generates a single SQL query with a JOIN that loads parent and child entities together, eliminating per-entity SELECT queries', 'It caches the results in Redis', 'It converts entities to DTOs'], 1, 'SELECT o FROM Order o JOIN FETCH o.items produces one SQL: SELECT ... FROM orders o JOIN order_items oi ON o.id=oi.order_id. All items loaded in one query. Why others are wrong: It does not delete, cache externally, or convert to DTOs.'),
q('What does @Version Long version enable in Hibernate?', ['Faster queries', 'Optimistic locking: UPDATE includes WHERE version=? check; if version changed, OptimisticLockException is thrown, preventing lost updates in concurrent modifications', 'Database encryption', 'Automatic backups'], 1, 'Optimistic locking: version column incremented on every UPDATE. Concurrent modification detected at commit (0 rows updated → exception). No DB locks held during read. Why others are wrong: It does not speed queries, encrypt, or backup.'),
q('What is the advantage of the Criteria API over JPQL string queries?', ['Criteria is faster at runtime', 'Criteria provides compile-time type safety via metamodel classes, catching query errors before execution instead of at runtime', 'Criteria does not require a database', 'Criteria automatically optimizes queries'], 1, 'Criteria API uses generated metamodel (User_.name) instead of strings ("name"). Typos caught at compile time. Dynamic query building without string concatenation. Why others are wrong: Runtime performance is similar. It still requires a database. It does not auto-optimize.')
],
[
'Persistence Context is a transaction-scoped identity map with automatic dirty checking.',
'N+1 is caused by lazy loading in loops — fix with JOIN FETCH, @EntityGraph, or @BatchSize.',
'Second-level cache (Ehcache/Caffeine) caches entities across transactions — enable with @Cacheable.',
'Criteria API provides compile-time type safety via metamodel classes (User_.name).',
'@Version enables optimistic locking — concurrent modification detected without database locks.'
],
'This Expert Track lab requires JDK 21+, Maven, and Spring Boot with JPA. Use your native terminal for application execution and log analysis.'
),

// ═══════════════════════════════════════════
// JAVA EXPERT TRACK — javax-29, javax-30 (Spring Ecosystem Complete)
// ═══════════════════════════════════════════

L(
'javax-29', 29, 'Reactive Spring WebFlux & Non-Blocking I/O', '🌊',
'🌊 Spring MVC is built on the Servlet API — one thread per request. When a request blocks on I/O (database, API call), that thread sits idle, wasting resources. WebFlux is Spring's reactive alternative: built on Netty's event-loop architecture, it handles thousands of concurrent connections with just a handful of threads. This is the architecture behind systems processing millions of requests per second — Netflix, eBay, and Trello all run on reactive stacks.',
[
{
title: '1. WebFlux Architecture & Netty Event Loop',
beginner: 'Spring MVC is like a restaurant where each customer gets their own waiter. If the kitchen is slow, the waiter just stands there waiting. WebFlux is like a sushi bar — a few chefs handle many customers by never standing still. When one dish is cooking, they move to the next order.',
advanced: 'WebFlux runs on Netty (default) or Servlet 3.1+ containers. Architecture: HttpServer (Netty) → ReactorHttpHandlerAdapter → DispatcherHandler → HandlerMapping → HandlerAdapter → @Controller returning Mono/Flux. Thread model: Netty boss thread accepts TCP connections → N worker threads (event loop, typically = CPU cores) handle I/O multiplexing via epoll/kqueue → boundedElastic scheduler for blocking operations. No thread-per-request: a single event loop thread can handle 10,000+ concurrent connections.'
},
{
title: '2. Mono & Flux in WebFlux Controllers',
beginner: 'In WebFlux, your controller methods return Mono (0 or 1 item) or Flux (0 to N items) instead of plain objects. Spring automatically subscribes to these reactive streams and streams the response back to the client.',
advanced: 'Controller signatures: @GetMapping returns Mono<User> (single) or Flux<User> (stream). Spring WebFlux subscribes to the Publisher and writes the response. For SSE (Server-Sent Events): return Flux<ServerSentEvent<T>> with MediaType.TEXT_EVENT_STREAM. For streaming JSON arrays: Flux<T> with APPLICATION_STREAM_JSON. Backpressure flows end-to-end: HTTP client → Netty → controller → service → database (R2DBC) → response. If the client is slow, backpressure propagates upstream.'
},
{
title: '3. R2DBC: Reactive Database Access',
beginner: 'Traditional JDBC blocks the thread while waiting for the database. R2DBC (Reactive Relational Database Connectivity) is the reactive equivalent — it returns Mono/Flux instead of blocking, so your event loop threads are never stuck waiting for SQL results.',
advanced: 'R2DBC is the reactive JDBC equivalent. Spring Data R2DBC provides ReactiveCrudRepository with Mono/Flux return types. ConnectionFactory replaces DataSource. Transactions: @Transactional works with ReactiveTransactionManager. Supported databases: PostgreSQL, MySQL, MariaDB, H2, SQL Server, Oracle. Critical: NEVER call blocking code (JDBC, Thread.sleep, synchronized) on an event loop thread. Use subscribeOn(Schedulers.boundedElastic()) to offload blocking operations.'
},
{
title: '4. WebClient: Reactive HTTP Client',
beginner: 'RestTemplate is blocking — it freezes your thread while waiting for the HTTP response. WebClient is its reactive replacement: it returns Mono/Flux and never blocks, making it perfect for microservice-to-microservice communication in reactive architectures.',
advanced: 'WebClient is Spring's reactive HTTP client (replaces RestTemplate). Fluent API: webClient.get().uri("/users/{id}", id).retrieve().bodyToMono(User.class). Supports: all HTTP methods, request/response interceptors (ExchangeFilterFunction), connection pooling (Reactor Netty), timeout configuration, retry with backoff (retryWhen(Retry.backoff(3, Duration.ofSeconds(1)))). For service-to-service calls in WebFlux, ALWAYS use WebClient — never RestTemplate.'
},
{
title: '5. When to Use WebFlux vs MVC (Expert Teaser)',
beginner: 'WebFlux is not always better! If your app is CPU-bound (heavy calculations), reactive adds complexity without benefit. If your app is I/O-bound (many API calls, database queries), WebFlux shines. Choose based on your workload.',
advanced: '(Expert Teaser) Decision framework: (1) High concurrency I/O-bound (API gateway, streaming, real-time) → WebFlux. (2) CPU-bound or CRUD-heavy → Spring MVC. (3) Mixed → MVC with async (@Async, CompletableFuture) or virtual threads (Java 21 + Spring Boot 3.2). (4) Existing JDBC/JPA investment → MVC (R2DBC ecosystem is smaller). Migration path: Spring MVC → add WebClient → migrate to WebFlux incrementally. In the Expert track, we explore: reactive transactions with R2DBC, Spring Security for WebFlux (ReactiveAuthenticationManager), GraphQL with Spring for GraphQL (reactive resolvers), and performance benchmarking WebFlux vs MVC vs Virtual Threads under load.'
}
],
{
title: '🌊 Lab: Reactive User Service with WebFlux',
intro: '⚠️ NOTE: Build a reactive REST API with Spring WebFlux, R2DBC for database access, and WebClient for service-to-service communication.',
steps: [
'Create Spring Boot project with dependencies: spring-boot-starter-webflux, spring-boot-starter-data-r2dbc, r2dbc-h2.',
'Define entity: @Table("users") record User(@Id Long id, String name, String email).',
'Create repository: interface UserRepository extends ReactiveCrudRepository<User, Long> { Flux<User> findByName(String name); }.',
'Create reactive controller: @RestController class UserController { @GetMapping("/users") Flux<User> getAll() { return repo.findAll(); } @GetMapping("/users/{id}") Mono<ResponseEntity<User>> getById(@PathVariable Long id) { return repo.findById(id).map(ResponseEntity::ok).defaultIfEmpty(ResponseEntity.notFound().build()); } }.',
'Create WebClient bean: @Bean WebClient webClient() { return WebClient.builder().baseUrl("http://localhost:8080").build(); }.',
'Use WebClient for service call: Mono<User> remoteUser = webClient.get().uri("/users/1").retrieve().bodyToMono(User.class);.',
'Stream SSE: @GetMapping(value="/stream", produces=MediaType.TEXT_EVENT_STREAM_VALUE) Flux<ServerSentEvent<String>> stream() { return Flux.interval(Duration.ofSeconds(1)).map(seq -> ServerSentEvent.<String>builder().data("Event " + seq).build()); }.',
'Run application: mvn spring-boot:run. Test with curl -N http://localhost:8080/stream to see real-time SSE events.'
],
goal: 'You built a fully reactive REST API with non-blocking database access (R2DBC), reactive HTTP client (WebClient), and Server-Sent Events streaming.'
},
[
q('How does WebFlux handle 10,000 concurrent connections with only 4 threads?', ['It creates 10,000 virtual threads', 'It uses Netty event-loop threads with non-blocking I/O multiplexing — threads handle I/O events, not individual requests', 'It queues requests and processes them sequentially', 'It spawns 10,000 OS processes'], 1, 'Netty event loops use epoll/kqueue I/O multiplexing. A few threads (typically = CPU cores) handle thousands of connections by never blocking. Why others are wrong: It does not create virtual threads (that is Loom). It does not queue sequentially. It does not use processes.'),
q('What is the reactive equivalent of JDBC for database access?', ['JDBC Reactive Extension', 'R2DBC (Reactive Relational Database Connectivity)', 'JDBC Async', 'ReactiveJDBC'], 1, 'R2DBC provides non-blocking database access with Mono/Flux return types. It replaces JDBC in reactive stacks. Why others are wrong: The other names do not exist as official specifications.'),
q('Why must you NEVER call blocking code (JDBC, Thread.sleep) on a WebFlux event loop thread?', ['It throws a compilation error', 'Blocking an event loop thread stalls ALL connections handled by that thread, causing cascading latency across thousands of requests', 'It triggers a JVM crash', 'It is a style violation only'], 1, 'Event loop threads handle many connections. Blocking one thread blocks ALL its connections. Use subscribeOn(Schedulers.boundedElastic()) to offload blocking work. Why others are wrong: It does not cause compilation errors or JVM crashes. It is not merely a style issue.'),
q('What does WebClient replace in reactive Spring applications?', ['WebMvcConfigurer', 'RestTemplate (blocking HTTP client)', 'HttpClient from java.net', 'OkHttp'], 1, 'WebClient is Spring's reactive replacement for RestTemplate. RestTemplate is blocking and deprecated for reactive use. Why others are wrong: It does not replace WebMvcConfigurer, java.net.HttpClient, or OkHttp directly.'),
q('When should you choose Spring MVC over WebFlux?', ['Always — MVC is universally better', 'For CPU-bound workloads, CRUD-heavy applications, or when you have existing JDBC/JPA investments', 'Never — WebFlux is always superior', 'Only for mobile backends'], 1, 'MVC is simpler for CPU-bound work, traditional CRUD, and when JDBC/JPA investment exists. WebFlux shines for high-concurrency I/O-bound systems. Why others are wrong: Neither is universally superior. WebFlux is not mobile-specific.')
],
[
'WebFlux runs on Netty event loops — few threads handle thousands of concurrent connections via non-blocking I/O.',
'Controllers return Mono/Flux; Spring subscribes and streams responses automatically.',
'R2DBC provides reactive database access; NEVER block event loop threads.',
'WebClient replaces RestTemplate for non-blocking service-to-service communication.',
'Choose WebFlux for I/O-bound high-concurrency; MVC for CPU-bound or JDBC-heavy workloads.'
],
'This Expert Track lab requires JDK 21+, Maven, and Spring Boot 3.2+. Use your native terminal for application execution and curl testing.'
),

L(
'javax-30', 30, 'Spring Cloud: Config, Gateway & Circuit Breakers', '☁️',
'☁️ Microservices introduce distributed systems challenges that monoliths never face: configuration drift across dozens of services, routing complexity, and cascading failures. Spring Cloud provides the production-grade toolkit for these challenges: centralized configuration management, intelligent API routing, and resilience patterns that prevent one failing service from taking down the entire system. This is the architecture behind Netflix, Spotify, and every major microservices platform.',
[
{
title: '1. Spring Cloud Config Server',
beginner: 'Instead of each microservice having its own application.yml, you put ALL configuration in one central Git repository. The Config Server reads from Git, and every service fetches its config from the server at startup. Change a value in Git, and all services pick it up!',
advanced: 'Spring Cloud Config: (1) Config Server reads from Git/SVN/Vault backend. (2) Services bootstrap config via spring.cloud.config.uri. (3) Profiles/environments: /{application}/{profile}/{label}. (4) Encryption: symmetric (encrypt.key) or asymmetric (RSA key pair) for secrets. (5) Refresh: @RefreshScope + /actuator/refresh for hot-reload without restart. (6) Spring Cloud Bus: broadcast config changes via message broker (RabbitMQ/Kafka) to all services simultaneously.'
},
{
title: '2. Spring Cloud Gateway',
beginner: 'The API Gateway is the front door of your microservices. Instead of clients calling 50 different services directly, they call ONE gateway. The gateway routes requests to the correct service, handles authentication, rate limiting, and SSL termination.',
advanced: 'Spring Cloud Gateway (built on WebFlux/Netty): (1) Route definitions: predicates (Path, Header, Method) + filters (StripPrefix, AddRequestHeader, Retry, CircuitBreaker). (2) Dynamic routing: load routes from database or service discovery. (3) Rate limiting: RequestRateLimiter filter with Redis backend. (4) Circuit breaker integration: Resilience4j filter for per-route resilience. (5) Global filters: authentication, logging, CORS. (6) WebSocket routing supported natively.'
},
{
title: '3. Resilience4j Circuit Breaker',
beginner: 'If a downstream service is failing, you do not want every request to timeout and pile up. The Circuit Breaker pattern works like an electrical breaker: after N failures, it "trips" and immediately rejects requests for a cooldown period, giving the failing service time to recover.',
advanced: 'Resilience4j CircuitBreaker states: CLOSED → OPEN → HALF_OPEN → CLOSED. Configuration: failureRateThreshold (50%), waitDurationInOpenState (30s), slidingWindowSize (100), permittedNumberOfCallsInHalfOpenState (10). Spring Boot integration: @CircuitBreaker(name="inventoryService", fallbackMethod="inventoryFallback"). Fallback methods provide degraded responses (cached data, defaults). Resilience4j also provides: RateLimiter, Retry, Bulkhead, TimeLimiter, Cache.'
},
{
title: '4. Service Discovery with Eureka',
beginner: 'In microservices, services start and stop dynamically. Service Discovery is like a phone book: services register themselves when they start, and other services look them up by name instead of hardcoding IP addresses.',
advanced: 'Spring Cloud Netflix Eureka: (1) Eureka Server: service registry (peer-aware, AP system per CAP theorem). (2) Eureka Client: services register via @EnableDiscoveryClient + eureka.client.serviceUrl. (3) Heartbeat: every 30s. (4) Client-side load balancing: Spring Cloud LoadBalancer replaces Ribbon. (5) Self-preservation mode: if >15% heartbeats fail, Eureka stops evicting instances (network partition protection). Alternative: Kubernetes DNS-based discovery eliminates need for Eureka entirely.'
},
{
title: '5. Distributed Tracing with Micrometer (Expert Teaser)',
beginner: 'When a request passes through 10 microservices, how do you find which one is slow? Distributed Tracing assigns a unique Trace ID to each request and tracks it across all services, producing a waterfall diagram showing exactly where time is spent.',
advanced: '(Expert Teaser) Micrometer Tracing (successor to Spring Cloud Sleuth): (1) Auto-instruments WebFlux, WebClient, R2DBC, Kafka. (2) Trace context propagated via W3C TraceContext headers (traceparent). (3) Exporters: Zipkin, OTLP (OpenTelemetry Protocol), Brave. (4) Correlation: traceId/spanId added to MDC for log correlation. (5) Custom spans: @NewSpan("operation-name"). In the Expert track, we build a complete observability stack: Micrometer Tracing → OpenTelemetry Collector → Jaeger/Tempo + Prometheus + Grafana, with tail-based sampling and automated alerting on SLO violations.'
}
],
{
title: '☁️ Lab: Spring Cloud Microservices Stack',
intro: '⚠️ NOTE: Build a microservices stack with Config Server, API Gateway, Circuit Breaker, and Service Discovery.',
steps: [
'Create Config Server: spring-cloud-config-server dependency. Configure: spring.cloud.config.server.git.uri=https://github.com/your/config-repo.',
'Create service config in Git repo: order-service.yml with server.port=8081, app.message=Hello from Git.',
'Create Order Service: spring-cloud-starter-config dependency. bootstrap.yml: spring.cloud.config.uri=http://localhost:8888.',
'Add @RefreshScope to config-consuming beans. Test hot-reload: change Git config, call POST /actuator/refresh.',
'Create API Gateway: spring-cloud-starter-gateway dependency. Define route: spring.cloud.gateway.routes[0].id=order-service, uri=lb://order-service, predicates[0]=Path=/api/orders/**.',
'Add Circuit Breaker to gateway route: filters[0].name=CircuitBreaker, filters[0].args.name=orderCB, filters[0].args.fallbackUri=forward:/fallback.',
'Create fallback controller: @RestController class FallbackController { @GetMapping("/fallback") String fallback() { return "Service temporarily unavailable"; } }.',
'Configure Resilience4j: resilience4j.circuitbreaker.instances.orderCB.failureRateThreshold=50, waitDurationInOpenState=10s.',
'Start Eureka Server: @EnableEurekaServer. Register services: eureka.client.serviceUrl.defaultZone=http://localhost:8761/eureka/.',
'Test: Stop Order Service. Hit gateway /api/orders. Observe circuit breaker trip and fallback response.'
],
goal: 'You built a complete Spring Cloud microservices stack with centralized configuration, API Gateway routing, circuit breaker resilience, and service discovery.'
},
[
q('What is the primary benefit of Spring Cloud Config Server over per-service application.yml files?', ['It makes services start faster', 'It centralizes configuration in one Git repository, enabling consistent config management, versioning, and hot-reload across all microservices', 'It encrypts all database connections', 'It replaces the need for environment variables'], 1, 'Config Server provides single source of truth for configuration. Changes are versioned in Git, auditable, and can be hot-reloaded via @RefreshScope. Why others are wrong: It does not affect startup speed, encrypt DB connections, or replace env vars.'),
q('What happens when a Resilience4j Circuit Breaker transitions to OPEN state?', ['It permanently shuts down the service', 'It immediately rejects all requests (fail-fast) for a configured waitDuration, then transitions to HALF_OPEN to test recovery', 'It retries every request 10 times', 'It switches to a backup database'], 1, 'OPEN state = fail-fast. Requests are rejected immediately without calling the downstream service. After waitDurationInOpenState, it enters HALF_OPEN and allows limited test requests. Why others are wrong: It does not permanently shut down, retry endlessly, or switch databases.'),
q('What does lb://order-service mean in a Spring Cloud Gateway route URI?', ['Load balance across all services', 'Use client-side load balancing to resolve order-service via Service Discovery (Eureka/Kubernetes)', 'Connect to localhost only', 'Use a database lookup'], 1, 'lb:// prefix triggers Spring Cloud LoadBalancer, which resolves the service name via Service Discovery and load-balances across available instances. Why others are wrong: It is not all services, not localhost-only, not database lookup.'),
q('What is Eureka\'s self-preservation mode?', ['A security feature that encrypts registrations', 'When >15% of heartbeats fail (likely network partition), Eureka stops evicting instances to prevent false removals', 'A backup mode when the database is down', 'A rate limiter for registrations'], 1, 'Self-preservation prevents mass evictions during network partitions. If Eureka cannot reach many instances, it assumes a network issue rather than instance failure and keeps them registered. Why others are wrong: It is not encryption, database backup, or rate limiting.'),
q('How does Micrometer Tracing propagate trace context across microservices?', ['Via database records', 'Via HTTP headers (W3C TraceContext: traceparent) automatically injected by the tracing library', 'Via shared memory between services', 'Via DNS records'], 1, 'Trace context (traceId, spanId) is propagated via HTTP headers. Micrometer auto-injects/extracts these headers in WebClient, RestTemplate, Kafka, and messaging. Why others are wrong: It does not use databases, shared memory, or DNS.')
],
[
'Spring Cloud Config centralizes configuration in Git with hot-reload via @RefreshScope.',
'Spring Cloud Gateway routes, filters, and protects all inbound traffic as the single entry point.',
'Resilience4j Circuit Breaker prevents cascading failures: CLOSED → OPEN → HALF_OPEN state machine.',
'Eureka provides service registration and discovery; Spring Cloud LoadBalancer handles client-side LB.',
'Micrometer Tracing propagates traceId via W3C headers for distributed request tracing.'
],
'This Expert Track lab requires JDK 21+, Maven, Spring Boot 3.2+, and Spring Cloud 2023.x. Use your native terminal for multi-service orchestration.'
),

// ═══════════════════════════════════════════
// JAVA EXPERT TRACK — PART 7: ADVANCED TESTING & QUALITY (javax-31 to javax-35)
// ═══════════════════════════════════════════

L(
'javax-31', 31, 'Testcontainers: Real Databases in Docker', '🐳',
'🐳 Unit tests with in-memory databases (H2) give false confidence — they behave differently from production PostgreSQL. Integration tests need REAL infrastructure: real databases, real message brokers, real caches. Testcontainers spins up disposable Docker containers for each test run, giving you production-fidelity testing without managing persistent infrastructure. This is how Netflix, Spotify, and every serious Java shop tests database interactions.',
[
{
title: '1. Testcontainers Architecture',
beginner: 'Testcontainers is a Java library that automatically starts Docker containers for your tests. Need PostgreSQL? It downloads the image, starts a container, gives you a connection string, runs your tests, and destroys the container when done. Every test run gets a fresh, clean database!',
advanced: 'Testcontainers lifecycle: (1) Test starts → Testcontainers checks Docker daemon availability. (2) Pulls image (if not cached). (3) Creates container with random port mapping. (4) Exposes mapped port via getMappedPort(). (5) Runs tests against container. (6) Destroys container on test completion. Ryuk container: sidecar that ensures cleanup even if JVM crashes. Reusable containers: .withReuse(true) + TESTCONTAINERS_REUSE_ENABLE=true for faster local development.'
},
{
title: '2. Database Containers (PostgreSQL, MySQL)',
beginner: 'Instead of testing with H2 (which behaves differently from PostgreSQL), Testcontainers gives you a REAL PostgreSQL instance. Your SQL queries, JSON operations, and PostgreSQL-specific features all work exactly like production!',
advanced: 'PostgreSQLContainer: new PostgreSQLContainer<>("postgres:16-alpine").withDatabaseName("test").withUsername("test").withPassword("test"). Spring Boot integration: @ServiceConnection (Spring Boot 3.1+) auto-configures DataSource from container. @Testcontainers + @Container annotations manage lifecycle. Dynamic properties: @DynamicPropertySource registers container URL. Supports: init scripts (withInitScript), Flyway/Liquibase migrations, multiple databases per test class.'
},
{
title: '3. Kafka, Redis & Generic Containers',
beginner: 'Testcontainers is not just for databases! You can spin up Kafka brokers, Redis caches, Elasticsearch clusters, or ANY Docker image. This lets you test your entire integration stack — message queues, caches, search engines — with real infrastructure.',
advanced: 'KafkaContainer: new KafkaContainer(DockerImageName.parse("confluentinc/cp-kafka:7.5.0")). Provides bootstrap servers via getBootstrapServers(). GenericContainer: for any Docker image — new GenericContainer<>("elasticsearch:8.11.0").withExposedPorts(9200). Network: containers can share a Docker network via Network.newNetwork() for multi-container integration tests. Wait strategies: Wait.forListeningPort(), Wait.forLogMessage(), Wait.forHttp("/health").'
},
{
title: '4. Spring Boot Integration & @ServiceConnection',
beginner: 'Spring Boot 3.1+ has native Testcontainers support. Add @ServiceConnection to your container bean, and Spring auto-configures the DataSource, KafkaTemplate, or RedisTemplate from the running container. No manual property configuration needed!',
advanced: '@ServiceConnection (Spring Boot 3.1+): automatically detects container type and configures the corresponding Spring Boot auto-configuration. Supported: PostgreSQL, MySQL, MongoDB, Kafka, RabbitMQ, Redis, Elasticsearch, Neo4j, Oracle, MSSQL. @Bean @ServiceConnection PostgreSQLContainer<?> postgres() { return new PostgreSQLContainer<>("postgres:16"); }. Replaces @DynamicPropertySource boilerplate. For custom containers: implement ConnectionDetailsFactory.'
},
{
title: '5. Testcontainers Cloud & CI/CD (Expert Teaser)',
beginner: 'Running Docker containers in CI/CD pipelines can be slow and resource-heavy. Testcontainers Cloud offloads container execution to a remote service, keeping your CI runners lightweight and fast.',
advanced: '(Expert Teaser) Testcontainers Cloud: containers run on remote infrastructure, connected via lightweight agent on CI runner. Benefits: no Docker-in-Docker, faster CI, no resource contention. Alternatives: GitHub Actions services, GitLab CI services, Kubernetes-based test execution. In the Expert track, we explore: parallel test execution with Testcontainers (each test class gets isolated containers), test slicing strategies (which tests need containers vs pure unit tests), and building a complete CI pipeline with Testcontainers + JaCoCo coverage + SonarQube quality gates.'
}
],
{
title: '🐳 Lab: Integration Testing with Real PostgreSQL',
intro: '⚠️ NOTE: Build integration tests using Testcontainers with a real PostgreSQL database, Flyway migrations, and Spring Boot @ServiceConnection.',
steps: [
'Add dependencies: testcontainers, postgresql, spring-boot-testcontainers, flyway-core.',
'Create test configuration: @TestConfiguration class TestConfig { @Bean @ServiceConnection PostgreSQLContainer<?> postgres() { return new PostgreSQLContainer<>("postgres:16-alpine"); } }.',
'Create Flyway migration: src/test/resources/db/migration/V1__create_users.sql with CREATE TABLE users (id SERIAL PRIMARY KEY, name VARCHAR(255), email VARCHAR(255) UNIQUE);.',
'Create repository: interface UserRepository extends JpaRepository<User, Long> { Optional<User> findByEmail(String email); }.',
'Write integration test: @SpringBootTest @Import(TestConfig.class) class UserRepoIT { @Autowired UserRepository repo; @Test void shouldSaveAndFindUser() { User u = repo.save(new User("Alice", "alice@test.com")); assertThat(repo.findByEmail("alice@test.com")).isPresent(); } }.',
'Test PostgreSQL-specific features: @Query(value="SELECT * FROM users WHERE email ILIKE :pattern", nativeQuery=true) — ILIKE is PostgreSQL-only, would fail on H2!',
'Run tests: mvn test. Observe Docker pulling postgres:16-alpine, starting container, running Flyway migrations, executing tests, destroying container.',
'BONUS: Add KafkaContainer test for event-driven integration testing.'
],
goal: 'You built production-fidelity integration tests with real PostgreSQL, Flyway migrations, and Spring Boot auto-configuration via @ServiceConnection.'
},
[
q('Why is testing with Testcontainers (real PostgreSQL) superior to testing with H2 in-memory database?', ['Testcontainers is faster', 'Real PostgreSQL behaves identically to production — H2 has different SQL dialect, missing functions, and different constraint behavior', 'H2 cannot store data', 'Testcontainers encrypts test data'], 1, 'H2 is not PostgreSQL. JSON operations, ILIKE, array types, CTEs, window functions, and constraint behaviors differ. Testcontainers eliminates the "works in H2, fails in production" gap. Why others are wrong: Testcontainers is slower, not faster. H2 stores data fine. No encryption involved.'),
q('What does @ServiceConnection do in Spring Boot 3.1+ with Testcontainers?', ['Connects to a cloud service', 'Automatically configures Spring Boot auto-configuration (DataSource, KafkaTemplate, etc.) from the running Testcontainer', 'Creates a network service', 'Connects to a monitoring dashboard'], 1, '@ServiceConnection detects the container type and auto-configures the corresponding Spring Boot properties. Eliminates @DynamicPropertySource boilerplate. Why others are wrong: It does not connect to cloud services, create network services, or connect to dashboards.'),
q('What is the purpose of the Ryuk container in Testcontainers?', ['It runs the actual tests', 'It is a sidecar container that ensures cleanup of test containers even if the JVM crashes or tests are interrupted', 'It provides network connectivity', 'It caches Docker images'], 1, 'Ryuk monitors the Testcontainers session. If the JVM dies unexpectedly, Ryuk destroys all orphaned test containers, preventing resource leaks. Why others are wrong: It does not run tests, provide networking, or cache images.'),
q('How do you share a Docker network between multiple Testcontainers (e.g., app + database + Kafka)?', ['They automatically share the default network', 'Create a shared Network via Network.newNetwork() and attach all containers with .withNetwork(network)', 'Use docker-compose.yml', 'Network sharing is not supported'], 1, 'Network.newNetwork() creates a shared Docker network. Containers attached via .withNetwork(network) can communicate by container name. Why others are wrong: They do not automatically share. docker-compose is separate. It IS supported.'),
q('What is the primary benefit of Testcontainers Cloud for CI/CD pipelines?', ['It makes tests run without Docker', 'Containers run on remote infrastructure, keeping CI runners lightweight and eliminating Docker-in-Docker complexity', 'It replaces the need for test frameworks', 'It automatically fixes failing tests'], 1, 'Testcontainers Cloud offloads container execution to remote infrastructure. CI runners only need a lightweight agent. No Docker-in-Docker, no resource contention. Why others are wrong: Docker is still used (remotely). It does not replace test frameworks or fix tests.')
],
[
'Testcontainers provides production-fidelity testing with real databases, brokers, and caches.',
'@ServiceConnection (Spring Boot 3.1+) auto-configures Spring from running containers.',
'Flyway/Liquibase migrations run against real containers, catching dialect-specific issues.',
'Ryuk ensures cleanup even on JVM crash; reusable containers speed up local development.',
'Testcontainers Cloud offloads container execution for lightweight CI/CD pipelines.'
],
'This Expert Track lab requires JDK 21+, Maven, Docker Desktop (or compatible runtime), and Spring Boot 3.1+.'
),

L(
'javax-32', 32, 'Mutation Testing with PIT', '🧬',
'🧬 Code coverage tells you which lines were EXECUTED by tests. But it does not tell you if your tests actually CATCH BUGS. A test can execute a line without asserting anything meaningful. Mutation testing solves this: PIT (Pitest) injects small bugs (mutations) into your code and checks if your tests detect them. If a mutation survives, your test suite has a blind spot. This is the gold standard for test quality verification.',
[
{
title: '1. Mutation Testing Fundamentals',
beginner: 'Imagine a teacher who secretly changes one word in your essay to see if the grader notices. If the grader passes the modified essay, the grader is not paying attention! PIT does this to your code: it introduces tiny bugs and checks if your tests catch them.',
advanced: 'Mutation testing: (1) PIT parses bytecode and applies mutation operators (negate conditionals, replace return values, remove method calls, change math operators). (2) Each mutated class is a "mutant". (3) Tests are run against each mutant. (4) If tests FAIL → mutant KILLED (good). (5) If tests PASS → mutant SURVIVED (bad — tests missed the bug). (6) Mutation score = killed / total mutants. Target: >80% mutation score for critical business logic.'
},
{
title: '2. PIT Mutation Operators',
beginner: 'PIT has many ways to break your code: it can flip if conditions (true becomes false), replace + with -, remove method calls, change return values, and more. Each type of mutation tests a different aspect of your test suite.',
advanced: 'Key mutation operators: (1) CONDITIONALS_BOUNDARY: changes < to <=, > to >=. (2) NEGATE_CONDITIONALS: flips if(x) to if(!x). (3) MATH_MUTATOR: replaces + with -, * with /. (4) RETURN_VALS: changes return values (true→false, 0→1). (5) VOID_METHOD_CALLS: removes void method calls. (6) INCREMENTS: changes i++ to i--. (7) EXPERIMENTAL_NAKED Receiver: removes method call receivers. PIT runs in parallel (thread count configurable) for speed.'
},
{
title: '3. Interpreting Mutation Reports',
beginner: 'PIT generates an HTML report showing every mutation: which line was changed, what the change was, and whether your tests killed or survived the mutant. Survived mutants are your testing blind spots — they show where bugs could hide undetected.',
advanced: 'PIT HTML report: (1) Mutation Coverage: percentage of mutants killed. (2) Line Coverage: traditional coverage for comparison. (3) Per-class breakdown: identify weakly-tested classes. (4) Survived mutants: exact line, operator, and description. Common survivors: (a) boundary conditions (< vs <=), (b) removed logging/monitoring calls, (c) changed default values. Action: write targeted tests for each survived mutant. PIT integrates with Maven (pitest-maven) and Gradle (pitest-junit5-plugin).'
},
{
title: '4. PIT Configuration & Performance',
beginner: 'PIT can be slow on large projects because it creates many mutants. You can speed it up by targeting only critical packages, using incremental analysis (only test changed code), and running with multiple threads.',
advanced: 'PIT performance optimization: (1) targetClasses/targetTests: limit scope to critical packages. (2) threads: parallel mutant execution (default = CPU cores). (3) incrementalAnalysis: cache results, only re-test changed code. (4) avoidCalls: exclude logging/framework calls. (5) excludedMethods: skip getters/setters. (6) mutationThreshold: fail build if mutation score < threshold (e.g., 80). Maven: mvn org.pitest:pitest-maven:mutationCoverage. Gradle: ./gradlew pitest. CI integration: fail PR if mutation score drops.'
},
{
title: '5. Mutation Testing vs Coverage (Expert Teaser)',
beginner: 'Code coverage says "this line was executed." Mutation testing says "this line was TESTED." A line can be executed by a test that never asserts anything — coverage is 100%, but the test catches zero bugs. Mutation testing reveals the truth.',
advanced: '(Expert Teaser) Coverage vs Mutation: 100% line coverage ≠ effective tests. Example: void process(int x) { if (x > 10) { sendAlert(); } } — test process(5) achieves 100% line coverage but NEVER tests the alert path. PIT NEGATE_CONDITIONALS mutant (x <= 10) survives → reveals the blind spot. In the Expert track, we explore: mutation testing for integration tests (Testcontainers + PIT), custom mutation operators for domain-specific logic, mutation testing in CI/CD with quality gates, and combining PIT with ArchUnit for architecture-aware test quality metrics.'
}
],
{
title: '🧬 Lab: Mutation Testing on Business Logic',
intro: '⚠️ NOTE: Apply PIT mutation testing to a business logic class, analyze survived mutants, and write targeted tests to kill them.',
steps: [
'Add PIT dependency: pitest-maven plugin in pom.xml with pitest-junit5-plugin.',
'Create business logic: public class DiscountCalculator { public double calculate(double price, boolean isMember) { if (isMember && price > 100) { return price * 0.9; } return price; } }.',
'Write initial test: @Test void testMemberDiscount() { assertEquals(90.0, calc.calculate(100.0, true)); }.',
'Run PIT: mvn org.pitest:pitest-maven:mutationCoverage.',
'Open target/pit-reports/index.html. Identify survived mutants: (a) NEGATE_CONDITIONALS on isMember, (b) CONDITIONALS_BOUNDARY on price > 100.',
'Write targeted tests to kill survivors: @Test void testBoundary() { assertEquals(100.0, calc.calculate(100.0, true)); } // kills boundary mutant.',
'Add non-member test: @Test void testNonMember() { assertEquals(100.0, calc.calculate(200.0, false)); } // kills negation mutant.',
'Re-run PIT. Verify mutation score increases to 100%.',
'Configure quality gate: <mutationThreshold>80</mutationThreshold> in pom.xml to fail build below 80% mutation score.'
],
goal: 'You applied mutation testing to verify test effectiveness, identified testing blind spots via survived mutants, and achieved 100% mutation score.'
},
[
q('What does a SURVIVED mutant in PIT indicate?', ['The code has a bug', 'The test suite failed to detect the injected mutation — revealing a testing blind spot', 'PIT made an error', 'The code is perfectly tested'], 1, 'A survived mutant means PIT introduced a bug and your tests did NOT catch it. This reveals where your test suite is weak. Why others are wrong: The code may not have a bug (PIT injected one). PIT did not error. The code is NOT perfectly tested.'),
q('What is the difference between code coverage and mutation score?', ['They measure the same thing', 'Coverage measures which lines were EXECUTED; mutation score measures which lines were effectively TESTED (mutations killed)', 'Coverage is more accurate', 'Mutation score only works for integration tests'], 1, 'Coverage = lines executed. Mutation score = mutations detected. A test can execute a line without asserting anything (high coverage, low mutation score). Why others are wrong: They are fundamentally different metrics. Neither is universally "more accurate." PIT works for unit and integration tests.'),
q('Which PIT mutation operator flips if(x > 10) to if(x >= 10)?', ['NEGATE_CONDITIONALS', 'CONDITIONALS_BOUNDARY', 'MATH_MUTATOR', 'RETURN_VALS'], 1, 'CONDITIONALS_BOUNDARY changes boundary operators: < to <=, > to >=, <= to <, >= to >. This tests whether your tests cover exact boundary values. Why others are wrong: NEGATE_CONDITIONALS flips to !x. MATH_MUTATOR changes arithmetic. RETURN_VALS changes return values.'),
q('How do you speed up PIT on a large codebase?', ['Run it on a faster computer', 'Use targetClasses to limit scope, enable incrementalAnalysis, and increase thread count for parallel execution', 'Skip mutation testing entirely', 'Use a smaller JVM heap'], 1, 'PIT performance: limit scope (targetClasses), cache results (incrementalAnalysis), parallelize (threads), exclude non-critical code (avoidCalls, excludedMethods). Why others are wrong: Hardware helps but configuration is key. Skipping defeats the purpose. Heap size is irrelevant.'),
q('What mutation score should you target for critical business logic?', ['50%', '60%', '80%+', '100% is always required'], 2, '80%+ mutation score is a strong target for critical business logic. 100% is ideal but may include untestable mutants (framework code, logging). Focus on business-critical paths. Why others are wrong: 50-60% is too low. 100% is not always practical.'),
],
[
'Mutation testing verifies test EFFECTIVENESS, not just coverage.',
'Survived mutants reveal testing blind spots where bugs could hide undetected.',
'CONDITIONALS_BOUNDARY tests exact boundary values; NEGATE_CONDITIONALS tests boolean logic.',
'Configure PIT with targetClasses, incrementalAnalysis, and threads for large codebases.',
'Set mutationThreshold quality gates in CI/CD to prevent test quality degradation.'
],
'This Expert Track lab requires JDK 21+, Maven with pitest-maven plugin, and JUnit 5. Use your native terminal for Maven execution.'
),

L(
'javax-33', 33, 'Architecture Testing with ArchUnit', '🏗️',
'🏗️ Architecture erosion is silent. A developer adds a direct database call in a controller. Another imports an infrastructure class in the domain layer. Over time, your clean Hexagonal Architecture becomes a tangled mess. ArchUnit makes architecture rules EXECUTABLE — they run as unit tests and FAIL the build when violated. This is how you enforce architectural discipline across teams of 50+ developers without code review bottlenecks.',
[
{
title: '1. ArchUnit Fundamentals',
beginner: 'ArchUnit is a testing library that lets you write assertions about your code structure. Instead of testing "does this method return 42?", you test "does my controller layer depend on the database layer?" If someone violates the rule, the test fails and the build breaks!',
advanced: 'ArchUnit analyzes compiled bytecode (.class files) via ASM. Rules are written as fluent Java DSL: classes().that().resideInAPackage("..domain..").should().onlyDependOnClassesThat().resideInAnyPackage("..domain..", "java.."). Rules execute as JUnit tests via @AnalyzeClasses annotation. ArchUnit checks: dependencies, inheritance, annotations, naming conventions, cycle detection, layer access.'
},
{
title: '2. Layer Dependency Rules',
beginner: 'In a layered architecture, dependencies should flow inward: Controller → Service → Repository. The domain layer should NEVER depend on infrastructure. ArchUnit enforces this with a single rule that catches every violation automatically.',
advanced: 'Layer rules: layeredArchitecture().consideringAllDependencies().layer("Domain").definedBy("..domain..").layer("Application").definedBy("..application..").layer("Infrastructure").definedBy("..infrastructure..").whereLayer("Domain").mayNotBeAccessedByAnyLayer().whereLayer("Application").mayOnlyBeAccessedByLayers("Infrastructure").whereLayer("Infrastructure").mayOnlyBeAccessedByLayers("Application"). This enforces Hexagonal Architecture dependency direction.'
},
{
title: '3. Naming Conventions & Annotation Rules',
beginner: 'ArchUnit can enforce naming conventions: all REST controllers must end with "Controller", all repositories must be annotated with @Repository, all services must be in the service package. No more arguing about naming in code reviews!',
advanced: 'Naming rules: classes().that().resideInAPackage("..controller..").should().haveSimpleNameEndingWith("Controller"). Annotation rules: classes().that().areAnnotatedWith(RestController.class).should().resideInAPackage("..controller.."). Custom predicates: implement ArchCondition<T> for complex rules. Method rules: methods().that().areDeclaredInClassesThat().resideInAPackage("..domain..").should().notBeAnnotatedWith(Transactional.class) — domain should not know about transactions.'
},
{
title: '4. Cycle Detection & Slices',
beginner: 'Circular dependencies (A depends on B, B depends on A) are architecture cancer. ArchUnit can detect cycles in your package structure and fail the build, forcing developers to refactor before the tangle grows.',
advanced: 'Cycle detection: slices().matching("com.myapp.(*)..").should().beFreeOfCycles(). Detects circular dependencies between packages/modules. Slice rules: slices().matching("com.myapp.(*)..").namingSlices("$1").should().onlyDependOnSlices("domain", "application"). Freeze violations: FreezingArchRule wraps a rule and stores known violations — new violations fail, existing ones are grandfathered. Essential for brownfield projects adopting ArchUnit incrementally.'
},
{
title: '5. ArchUnit in CI/CD & Fitness Functions (Expert Teaser)',
beginner: 'Architecture rules should run on every commit, not just in code reviews. ArchUnit tests run in seconds and catch violations before they reach production. Combined with fitness functions, they form an automated architecture governance system.',
advanced: '(Expert Teaser) Architecture fitness functions (from Building Evolutionary Architectures): automated checks that verify architectural characteristics. ArchUnit is the Java implementation. CI/CD integration: ArchUnit tests run in mvn test alongside unit tests. Fail fast: architecture violations block PR merges. Custom rules: implement ArchCondition for domain-specific constraints (e.g., "all REST endpoints must validate input with @Valid"). In the Expert track, we explore: ArchUnit rules for microservice boundaries (no cross-service imports), PlantUML diagram verification (compare actual vs intended architecture), and combining ArchUnit with SonarQube for architecture debt tracking.'
}
],
{
title: '🏗️ Lab: Enforcing Hexagonal Architecture Rules',
intro: '⚠️ NOTE: Write ArchUnit tests that enforce Hexagonal Architecture dependency rules, naming conventions, and cycle detection.',
steps: [
'Add ArchUnit dependency: com.tngtech.archunit:archunit-junit5:1.2.1.',
'Create test class: @AnalyzeClasses(packages = "com.myapp") class ArchitectureTest { }.',
'Add layer dependency rule: @ArchTest static final ArchRule domain_should_not_depend_on_infrastructure = noClasses().that().resideInAPackage("..domain..").should().dependOnClassesThat().resideInAPackage("..infrastructure..");.',
'Add naming rule: @ArchTest static final ArchRule controllers_should_be_suffixed = classes().that().resideInAPackage("..controller..").should().haveSimpleNameEndingWith("Controller");.',
'Add annotation rule: @ArchTest static final ArchRule rest_controllers_in_controller_package = classes().that().areAnnotatedWith(RestController.class).should().resideInAPackage("..controller..");.',
'Add cycle detection: @ArchTest static final ArchRule no_cycles = slices().matching("com.myapp.(*)..").should().beFreeOfCycles();.',
'Intentionally violate a rule: import an infrastructure class in a domain class. Run tests: mvn test. Watch the ArchUnit test FAIL with a clear violation message.',
'Fix the violation and verify the test passes.',
'BONUS: Add FreezingArchRule for brownfield migration: FreezingArchRule.freeze(rule).'
],
goal: 'You enforced Hexagonal Architecture dependency rules, naming conventions, and cycle detection as automated unit tests.'
},
[
q('What does ArchUnit analyze to verify architecture rules?', ['Source code (.java files)', 'Compiled bytecode (.class files) via ASM', 'Database schemas', 'Network traffic'], 1, 'ArchUnit analyzes compiled bytecode using ASM. This means rules run against the actual compiled output, not source text. Why others are wrong: It does not parse source, inspect databases, or monitor network traffic.'),
q('How do you enforce that the domain layer must not depend on infrastructure in ArchUnit?', ['By writing a code review checklist', 'noClasses().that().resideInAPackage("..domain..").should().dependOnClassesThat().resideInAPackage("..infrastructure..")', 'By configuring Maven exclusions', 'By using @Deprecated annotations'], 1, 'ArchUnit fluent DSL expresses dependency rules as executable JUnit tests. Violations fail the build. Why others are wrong: Checklists are manual. Maven exclusions do not enforce runtime dependencies. @Deprecated does not prevent imports.'),
q('What is the purpose of FreezingArchRule in ArchUnit?', ['To make tests run faster', 'To store known violations and only fail on NEW violations — enabling incremental adoption on brownfield projects', 'To freeze the JVM during testing', 'To cache test results'], 1, 'FreezingArchRule wraps a rule and stores existing violations. New violations fail; existing ones are grandfathered. Essential for adopting ArchUnit on legacy codebases. Why others are wrong: It does not affect speed, freeze JVM, or cache results.'),
q('How does ArchUnit detect circular dependencies between packages?', ['By analyzing import statements in source files', 'slices().matching("com.myapp.(*)..").should().beFreeOfCycles() — analyzes bytecode dependency graph for cycles', 'By running the application and monitoring memory', 'By checking Maven dependency tree'], 1, 'ArchUnit builds a dependency graph from bytecode and detects cycles in the graph. slices() groups classes by package pattern. Why others are wrong: It uses bytecode, not source. It does not run the application or check Maven.'),
q('Why should ArchUnit tests run in CI/CD pipelines?', ['To generate architecture documentation', 'To catch architecture violations before they reach production, enforcing discipline across large teams without code review bottlenecks', 'To replace code reviews entirely', 'To speed up compilation'], 1, 'ArchUnit in CI/CD provides automated architecture governance. Violations block PR merges, preventing erosion. Why others are wrong: It does not generate docs (though PlantUML integration exists). It supplements, not replaces, code reviews. It does not affect compilation speed.')
],
[
'ArchUnit makes architecture rules executable — they run as JUnit tests and fail the build on violations.',
'Enforce layer dependencies: domain must not depend on infrastructure.',
'Naming conventions and annotation rules eliminate style debates in code reviews.',
'slices().beFreeOfCycles() detects circular package dependencies.',
'FreezingArchRule enables incremental adoption on brownfield projects.'
],
'This Expert Track lab requires JDK 21+, Maven with archunit-junit5 dependency, and JUnit 5. Use your native terminal for Maven execution.'
),

L(
'javax-34', 34, 'Contract Testing with Pact', '🤝',
'🤝 Integration tests between microservices are slow, brittle, and require all services to be running. Contract testing solves this: instead of testing the full integration, you test the CONTRACT between consumer and provider. The consumer defines what it expects. The provider verifies it delivers. No running services needed. This is how teams of 100+ developers ship microservices without integration hell.',
[
{
title: '1. Consumer-Driven Contracts',
beginner: 'Imagine ordering food delivery. You (consumer) expect the restaurant (provider) to deliver a pizza with specific toppings. Instead of calling the restaurant every time to check, you write a contract: "I expect pizza with pepperoni." The restaurant verifies it can make that pizza. No phone calls needed!',
advanced: 'Consumer-Driven Contract (CDC): (1) Consumer defines expectations (request → response). (2) Expectations are captured as a Pact file (JSON). (3) Pact file is published to Pact Broker. (4) Provider retrieves Pact and verifies it can produce the expected response. (5) Verification results are published back. This decouples consumer and provider testing — they never need to run simultaneously.'
},
{
title: '2. Pact Consumer Tests',
beginner: 'The consumer writes a test that says: "When I send GET /users/1, I expect a 200 response with JSON containing id and name." Pact records this expectation as a contract file that the provider will later verify.',
advanced: 'Pact consumer test: @Pact(consumer="order-service") RequestResponsePact createPact(PactDslWithProvider builder) { return builder.given("user exists").uponReceiving("get user").path("/users/1").method("GET").willRespondWith().status(200).body(new PactDslJsonBody().integerType("id").stringType("name")).toPact(); }. @PactTestFor @Test void testGetUser() { /* call client, assert response */ }. Output: target/pacts/order-service-user-service.json.'
},
{
title: '3. Pact Provider Verification',
beginner: 'The provider runs a test that reads the consumer\'s contract and verifies: "Can I actually produce the response the consumer expects?" If the provider changes its API in a breaking way, the test fails BEFORE deployment!',
advanced: 'Pact provider test: @Provider("user-service") @PactBroker(host="pact-broker.example.com") class UserProviderTest { @TestTemplate @ExtendWith(PactVerificationInvocationContextProvider.class) void pactVerificationTest(PactVerificationContext ctx) { ctx.verifyInteraction(); } @State("user exists") void setupUser() { /* seed test data */ } }. Provider verification: replays consumer requests against real provider, compares responses. Fails if response structure/content deviates from contract.'
},
{
title: '4. Pact Broker & Contract Versioning',
beginner: 'The Pact Broker is a central server that stores all contracts between services. It tracks versions, shows which consumers depend on which providers, and can block deployments if a provider breaks a consumer\'s contract.',
advanced: 'Pact Broker: (1) Stores Pact files with versioning. (2) can-i-deploy: checks if a version is compatible with all consumers/providers before deployment. (3) WIP (Work In Progress) pacts: test new contracts without blocking. (4) Matrix view: visual dependency graph. CI/CD integration: mvn pact:publish (consumer) → mvn pact:verify (provider) → pact-broker can-i-deploy --pacticipant=order-service --version=$GIT_COMMIT. Deployment blocked if verification fails.'
},
{
title: '5. Pact vs Integration Tests vs OpenAPI (Expert Teaser)',
beginner: 'Contract testing is not a replacement for integration tests or API specs — it complements them. Use contract tests for fast, isolated verification. Use integration tests for end-to-end validation. Use OpenAPI for API documentation.',
advanced: '(Expert Teaser) Comparison: (1) Pact: consumer-driven, tests actual usage, catches breaking changes early. (2) Integration tests: full stack, slow, brittle, require all services running. (3) OpenAPI/Swagger: provider-driven spec, does not verify consumer usage. (4) Spring Cloud Contract: provider-driven, generates stubs. Best practice: Pact for microservice contracts + Testcontainers for database integration + OpenAPI for external API docs. In the Expert track, we explore: Pact with message queues (Kafka contract testing), Pact Flow (SaaS Pact Broker), and combining Pact with ArchUnit for architecture-aware contract boundaries.'
}
],
{
title: '🤝 Lab: Consumer-Driven Contract Testing',
intro: '⚠️ NOTE: Build a consumer-driven contract test between an Order Service (consumer) and User Service (provider) using Pact.',
steps: [
'Add Pact dependencies: au.com.dius.pact.consumer:junit5 (consumer), au.com.dius.pact.provider:junit5 (provider).',
'Write consumer Pact test: @Pact(consumer="order-service", provider="user-service") RequestResponsePact userPact(PactDslWithProvider builder) { return builder.given("user 1 exists").uponReceiving("get user 1").path("/users/1").method("GET").willRespondWith().status(200).body(new PactDslJsonBody().integerType("id", 1).stringType("name", "Alice")).toPact(); }.',
'Run consumer test: mvn test -pl consumer. Verify target/pacts/order-service-user-service.json is generated.',
'Write provider verification test: @Provider("user-service") @PactFolder("pacts") class UserProviderPactTest { @State("user 1 exists") void seedUser() { /* insert test user */ } @TestTemplate @ExtendWith(PactVerificationInvocationContextProvider.class) void verify(PactVerificationContext ctx) { ctx.verifyInteraction(); } }.',
'Run provider test: mvn test -pl provider. Verify contract is satisfied.',
'BREAK the contract: Change provider to return "username" instead of "name". Run provider test again. Watch it FAIL with clear mismatch message.',
'Fix the provider and verify the test passes.',
'BONUS: Set up Pact Broker (Docker: pactfoundation/pact-broker) and publish/verify contracts via broker.'
],
goal: 'You built consumer-driven contract tests, verified provider compliance, detected breaking changes before deployment, and understood Pact Broker workflow.'
},
[
q('What is the primary advantage of contract testing over full integration tests between microservices?', ['Contract tests are more thorough', 'Contract tests run in isolation without requiring all services to be running, making them fast, reliable, and suitable for CI/CD', 'Contract tests replace unit tests', 'Contract tests do not require any test framework'], 1, 'Contract tests verify the interface contract without running the full system. Fast, isolated, deterministic. Integration tests require all services running. Why others are wrong: Contract tests are not more thorough (they test contracts, not full behavior). They do not replace unit tests. They require JUnit.'),
q('Who defines the contract in Consumer-Driven Contract testing?', ['The provider (API owner)', 'The consumer (the service that calls the API)', 'A separate architecture team', 'The Pact Broker automatically'], 1, 'The CONSUMER defines what it expects from the provider. This ensures the API evolves based on actual usage, not assumptions. Why others are wrong: Provider-driven contracts (OpenAPI) do not verify consumer usage. Architecture teams do not define per-service contracts. Pact Broker stores, not defines.'),
q('What does the can-i-deploy command in Pact Broker do?', ['Deploys the application to production', 'Checks if a specific version of a service is compatible with all its consumers and providers before allowing deployment', 'Runs the application tests', 'Generates API documentation'], 1, 'can-i-deploy queries the Pact Broker verification matrix. If any consumer contract is not verified by the provider version, deployment is blocked. Why others are wrong: It does not deploy, run tests, or generate docs.'),
q('What happens when a provider changes its API in a way that breaks a consumer contract?', ['Nothing — contracts are advisory', 'The provider\'s Pact verification test FAILS, blocking deployment until the breaking change is resolved or the consumer updates its contract', 'The consumer automatically adapts', 'The Pact Broker deletes the contract'], 1, 'Provider verification replays consumer expectations against the real provider. Breaking changes cause test failure, preventing deployment. Why others are wrong: Contracts are enforced, not advisory. Consumers do not auto-adapt. Broker does not delete contracts.'),
q('How does Pact differ from OpenAPI/Swagger specifications?', ['They are identical', 'Pact is consumer-driven and tests actual usage; OpenAPI is provider-driven documentation that does not verify consumer expectations', 'Pact is for REST only; OpenAPI is for GraphQL', 'OpenAPI is faster than Pact'], 1, 'Pact: consumer defines expectations, provider verifies. OpenAPI: provider defines spec, consumers read docs. Pact catches breaking changes; OpenAPI does not verify actual consumer usage. Why others are wrong: They are fundamentally different. Both support REST. Speed is not the differentiator.')
],
[
'Consumer-driven contracts ensure APIs evolve based on actual consumer usage.',
'Pact consumer tests define expectations; provider tests verify compliance.',
'Pact Broker stores contracts, tracks versions, and gates deployments via can-i-deploy.',
'Breaking changes are caught at test time, not in production.',
'Pact complements integration tests and OpenAPI — use all three for complete API governance.'
],
'This Expert Track lab requires JDK 21+, Maven with Pact dependencies, and JUnit 5. Use your native terminal for Maven execution.'
),

L(
'javax-35', 35, 'Performance Regression Testing in CI/CD', '📈',
'📈 A developer optimizes a method. Another developer unknowingly reverts the optimization. A third adds a library that doubles startup time. Without automated performance testing, these regressions accumulate silently until production grinds to a halt. Performance regression testing in CI/CD catches slowdowns BEFORE they merge, using JMH benchmarks, baseline comparisons, and automated quality gates.',
[
{
title: '1. JMH in CI/CD Pipelines',
beginner: 'You already know JMH for benchmarking. Now imagine running those benchmarks on EVERY pull request. If the new code is 5% slower than the baseline, the CI pipeline flags it and blocks the merge. Performance becomes a first-class quality metric, just like test coverage.',
advanced: 'CI/CD JMH pipeline: (1) Run benchmarks on PR branch. (2) Compare against baseline (main branch). (3) Calculate regression percentage. (4) Fail PR if regression > threshold (e.g., 5%). Implementation: mvn clean verify -Pbenchmark → parse JMH JSON output (-rf json) → compare with baseline → post PR comment. Tools: jmh-compare, custom scripts, or benchmark-action GitHub Action. Hardware: dedicated bare-metal runners for consistent results (avoid cloud VM noise).'
},
{
title: '2. Baseline Management & Storage',
beginner: 'To detect regressions, you need a baseline — the "known good" performance numbers. Store baselines in a time-series database or artifact repository. Each merge to main updates the baseline. Each PR compares against it.',
advanced: 'Baseline storage options: (1) Git LFS: store baseline JSON in repository. (2) InfluxDB/Prometheus: time-series storage with historical trend analysis. (3) Artifact repository (Nexus/Artifactory): versioned baseline artifacts. (4) GitHub Actions cache: ephemeral but simple. Baseline update strategy: update on merge to main (not on PRs). Alert on sustained degradation: if baseline degrades >10% over 5 merges, trigger investigation.'
},
{
title: '3. Startup Time & Memory Regression',
beginner: 'Performance is not just throughput. Startup time matters for serverless (AWS Lambda charges per millisecond). Memory footprint matters for container costs. Track both in CI: measure time-to-first-request and peak RSS memory on every build.',
advanced: 'Startup regression: measure System.currentTimeMillis() from main() to first HTTP response. Spring Boot: SpringApplication.run() + ApplicationReadyEvent listener. Native Image: ./app --spring.main.web-application-type=none + time command. Memory regression: Runtime.getRuntime().totalMemory() - freeMemory() at steady state. Or: ps -o rss= -p $PID. Container image size: docker images --format "{{.Size}}". Set thresholds in CI: fail if startup > 500ms (JVM) or > 100ms (Native Image).'
},
{
title: '4. Load Testing with Gatling/k6',
beginner: 'Benchmarks test individual methods. Load tests test the ENTIRE system under realistic traffic. Gatling and k6 simulate thousands of concurrent users hitting your API, measuring response times, error rates, and resource usage.',
advanced: 'Gatling (Scala/Java DSL): scenario("Get Users").exec(http("GET /users").get("/api/users")).setUp(rampUsers(1000).during(60.seconds)). Assertions: responseTime.percentile(99).lt(500). k6 (JavaScript): export default function() { http.get("http://localhost:8080/api/users"); }. CI integration: run load tests against Testcontainers-deployed app. Thresholds: p99 < 500ms, error rate < 0.1%, throughput > 1000 rps. Fail PR if thresholds violated.'
},
{
title: '5. Continuous Profiling in Production (Expert Teaser)',
beginner: 'The best time to detect performance issues is in production, not in a lab. Continuous profiling tools like async-profiler or Pyroscope run 24/7 with <2% overhead, recording flame graphs and allocation profiles for every production incident.',
advanced: '(Expert Teaser) Continuous profiling: (1) async-profiler with -e cpu -d 3600 -f profile.jfr runs 24/7. (2) Profiles uploaded to centralized storage (Grafana Pyroscope, Datadog, Parca). (3) Diff flame graphs: compare profiles before/after deployment to identify regressions. (4) Alerting: automated detection of CPU hotspot shifts, allocation storms, or lock contention increases. In the Expert track, we build a complete performance CI/CD pipeline: JMH benchmarks → baseline comparison → Gatling load tests → continuous production profiling → automated regression alerts via Slack/PagerDuty.'
}
],
{
title: '📈 Lab: Performance Regression Pipeline',
intro: '⚠️ NOTE: Build a performance regression pipeline with JMH benchmarks, baseline comparison, and startup time tracking.',
steps: [
'Create JMH benchmark: @Benchmark public int hashMapLookup() { return map.get("key"); }.',
'Run benchmark with JSON output: java -jar benchmarks.jar -rf json -rff results.json.',
'Create baseline: Copy results.json to baseline.json (representing main branch performance).',
'Simulate regression: Modify the code (e.g., add unnecessary synchronization). Re-run benchmark.',
'Write comparison script: parse results.json and baseline.json, calculate percentage change per benchmark.',
'Set threshold: if regression > 5%, exit with non-zero code (fail CI).',
'Measure startup time: long start = System.currentTimeMillis(); SpringApplication.run(App.class); long startup = System.currentTimeMillis() - start; Assert startup < 500ms.',
'Measure memory: Runtime rt = Runtime.getRuntime(); long used = rt.totalMemory() - rt.freeMemory(); Assert used < 256MB.',
'Integrate into CI: run all checks on every PR. Post results as PR comment.'
],
goal: 'You built a performance regression pipeline with JMH benchmarks, baseline comparison, startup time tracking, and memory footprint verification.'
},
[
q('Why should JMH benchmarks run in CI/CD pipelines?', ['To generate documentation', 'To catch performance regressions before they merge, making performance a first-class quality metric', 'To replace unit tests', 'To speed up the build'], 1, 'Performance regression testing in CI/CD prevents silent degradation. Regressions are caught at PR time, not in production. Why others are wrong: It does not generate docs, replace unit tests, or speed up builds.'),
q('How should you store performance baselines for regression comparison?', ['In a text file on the developer\'s laptop', 'In version-controlled storage (Git LFS, time-series DB, or artifact repository) updated on merge to main', 'In the JVM heap', 'Baselines are not needed'], 1, 'Baselines must be shared, versioned, and updated on merge to main. Git LFS, InfluxDB, or artifact repositories work. Why others are wrong: Local files are not shared. JVM heap is ephemeral. Baselines are essential.'),
q('What tool is best suited for simulating thousands of concurrent users hitting an API?', ['JMH', 'Gatling or k6 (load testing tools)', 'JUnit', 'ArchUnit'], 1, 'Gatling and k6 are load testing tools designed for concurrent user simulation. JMH is for microbenchmarks. JUnit is for unit tests. ArchUnit is for architecture tests. Why others are wrong: JMH tests methods, not systems. JUnit and ArchUnit are not load testers.'),
q('Why is startup time a critical metric for serverless Java applications?', ['It affects code readability', 'Cloud providers charge per millisecond of execution — slow startup directly increases cost and user-perceived latency', 'It affects database schema design', 'It is only relevant for desktop apps'], 1, 'AWS Lambda, Google Cloud Run charge per execution time. Startup time is billed. Slow startup = higher cost + cold start latency. Native Image (<50ms) vs JVM (>500ms) matters enormously. Why others are wrong: It does not affect readability, schema design, or desktop apps specifically.'),
q('What is continuous profiling and why is it valuable?', ['Profiling during development only', 'Running profilers (async-profiler, JFR) 24/7 in production with <2% overhead, enabling incident diagnosis and regression detection', 'Profiling the CI/CD pipeline itself', 'Profiling the database only'], 1, 'Continuous profiling captures production behavior in real-time. When an incident occurs, you have the exact flame graph. Diff profiles before/after deployment to detect regressions. Why others are wrong: It is not dev-only, not CI profiling, not database-only.')
],
[
'Run JMH benchmarks in CI/CD and compare against baselines to catch regressions.',
'Store baselines in version-controlled storage; update on merge to main.',
'Track startup time and memory footprint as CI quality gates.',
'Use Gatling/k6 for system-level load testing with p99 latency thresholds.',
'Continuous profiling (async-profiler, JFR) enables production incident diagnosis and regression detection.'
],
'This Expert Track lab requires JDK 21+, Maven with JMH, and a CI environment (GitHub Actions, Jenkins). Use your native terminal for benchmark execution.'
),

// ═══════════════════════════════════════════
// JAVA EXPERT TRACK — PART 8: MODERN JAVA FRONTIER (javax-36 to javax-40)
// ═══════════════════════════════════════════

L(
'javax-36', 36, 'Project Valhalla: Value Types & Memory Optimization', '💎',
'💎 Java objects carry a 12-16 byte header overhead (mark word + class pointer). For millions of small objects (coordinates, pixels, financial ticks), this overhead dominates memory and destroys cache locality. Project Valhalla introduces Value Types — objects without identity that are stored inline, eliminating headers and enabling flat memory layouts. This is the most significant change to Java's object model since its inception.',
[
{
title: '1. The Object Header Problem',
beginner: 'Every Java object has a hidden "name tag" (header) that takes 12-16 bytes. If you create a Point(x, y) object with two 4-byte ints, the actual data is 8 bytes but the header adds 12+ bytes. The object is mostly overhead! Multiply by millions of objects and you waste gigabytes of RAM.',
advanced: 'Object header: 8-byte mark word (hashcode, GC age, lock state) + 4-byte compressed class pointer (with UseCompressedOops) + padding to 8-byte alignment. Minimum object size: 16 bytes. For Point(int x, int y): 8 bytes data + 16 bytes header = 24 bytes total (67% overhead). Array of 1M Points: 24MB actual data + 16MB headers + reference indirection. Value types eliminate headers entirely.'
},
{
title: '2. Value Types & Primitive Classes',
beginner: 'A Value Type is a class that behaves like a primitive: no identity (no == reference comparison), no header, stored inline. Think of it as a "super primitive" — you can define your own int-like types with methods, but they are stored as flat bytes without any object overhead.',
advanced: 'Value types (JEP 401 preview): declared with value class Point(int x, int y). Properties: (1) No object header — stored inline in arrays and fields. (2) No identity — == compares values, not references. (3) Cannot be synchronized (no monitor). (4) Cannot be used with synchronized blocks. (5) Arrays of value types are flat (contiguous memory, cache-friendly). int[]-like layout for custom types. This enables SIMD-friendly data structures and eliminates boxing overhead.'
},
{
title: '3. Specialization of Generics',
beginner: 'Today, List<int> is impossible — generics only work with objects, so you must use List<Integer> which boxes every int into an Integer object. Valhalla enables List<int> — true primitive generics with zero boxing overhead!',
advanced: 'Universal Generics (JEP 401): List<T> where T can be a primitive (int, double) or value type. List<int> stores raw ints in a flat array — no boxing, no Integer objects, no GC pressure. This eliminates the primitive/wrapper duality. Specialized bytecode: List<int> compiles to a specialized class with int[] backing, while List<String> uses Object[]. The JIT generates optimized code for each specialization.'
},
{
title: '4. Flat Arrays & Cache Locality',
beginner: 'An array of value types is stored as a flat, contiguous block of memory — just like a C struct array. The CPU can prefetch entire cache lines, processing 8-16 elements at once. This is the data-oriented design that game engines and databases have been waiting for in Java.',
advanced: 'Value type arrays: Point[] points = new Point[1_000_000] allocates a single contiguous block of 8MB (1M * 8 bytes). No per-element headers, no reference indirection. CPU prefetcher loads entire cache lines (64 bytes = 8 Points per line). SIMD-friendly: Vector API can process Point arrays directly. Compared to current Java: Point[] is an array of REFERENCES to scattered Point objects — cache misses on every access. Valhalla transforms Java into a data-oriented language.'
},
{
title: '5. Migration Path & Compatibility (Expert Teaser)',
beginner: 'Valhalla is designed for backward compatibility. Existing code continues to work. Value types are opt-in — you choose which classes become value types. The JVM handles the transition transparently.',
advanced: '(Expert Teaser) Migration: (1) Existing reference types remain unchanged. (2) value modifier is opt-in. (3) Migrate data-heavy classes (coordinates, vectors, financial amounts) to value types for memory savings. (4) Avoid identity-dependent patterns (synchronized, IdentityHashMap, WeakReference) on value types. (5) Serialization: value types serialize by value, not reference. Timeline: Valhalla has been in development since 2014, with previews in JDK 24+. In the Expert track, we explore: Valhalla's impact on collections (ArrayList<int>), interaction with virtual threads (Loom), and benchmarks comparing value types vs records vs classes for numerical workloads.'
}
],
{
title: '💎 Lab: Value Type Memory Analysis',
intro: '⚠️ NOTE: Analyze the memory overhead of current Java objects and simulate the memory savings Valhalla value types would provide.',
steps: [
'Create a Point record: record Point(int x, int y) {}.',
'Measure object size: Use JOL (Java Object Layout): System.out.println(ClassLayout.parseClass(Point.class).toPrintable()); Observe the 16-byte header.',
'Create 1M Point objects: Point[] points = new Point[1_000_000]; for (int i = 0; i < points.length; i++) points[i] = new Point(i, i);.',
'Measure total memory: Runtime rt = Runtime.getRuntime(); System.gc(); long used = rt.totalMemory() - rt.freeMemory(); Expect ~32MB (24 bytes/object * 1M).',
'Calculate Valhalla savings: 1M * 8 bytes (flat) = 8MB vs 32MB (current). 75% memory reduction.',
'Benchmark array traversal: Time iterating Point[] (scattered objects) vs int[] (flat). Observe cache miss difference.',
'Preview Valhalla syntax (JDK 24+ with --enable-preview): value class FlatPoint(int x, int y). Compile with javac --enable-preview.',
'Document findings: header overhead, memory savings, cache locality improvement.'
],
goal: 'You quantified the object header overhead, understood value type memory savings, and previewed Valhalla's flat array layout.'
},
[
q('How much overhead does a standard Java object header add to every object?', ['0 bytes — objects have no overhead', '12-16 bytes (mark word + compressed class pointer + padding)', '64 bytes', '1 byte'], 1, 'Object header: 8-byte mark word + 4-byte compressed class pointer + alignment padding = 12-16 bytes minimum. Why others are wrong: Objects DO have overhead. 64 bytes is a cache line, not header. 1 byte is incorrect.'),
q('What is the key property of Valhalla value types that distinguishes them from regular classes?', ['They are faster to compile', 'They have no identity (no reference comparison) and no object header, enabling flat inline storage', 'They can only hold strings', 'They are deprecated in Java 21'], 1, 'Value types have no identity (== compares values), no header, and are stored inline. This enables flat arrays and eliminates boxing. Why others are wrong: Compilation speed is not the key property. They hold any data. They are not deprecated.'),
q('How does Valhalla enable List<int> without boxing?', ['By converting ints to Integers automatically', 'Universal Generics specialize the generic class for primitive types, generating int[]-backed implementations with zero boxing', 'By using reflection', 'List<int> is not possible even with Valhalla'], 1, 'Universal Generics generate specialized bytecode for each primitive type. List<int> uses int[] backing, List<double> uses double[]. No Integer/Double boxing. Why others are wrong: It does not auto-convert. No reflection. It IS possible with Valhalla.'),
q('Why are value type arrays more cache-friendly than reference type arrays?', ['They use less CPU', 'Value type arrays are contiguous flat memory (cache-line prefetching); reference arrays scatter objects across the heap (cache misses)', 'They use GPU memory', 'They compress the data'], 1, 'Value type Point[] is a flat block: 1M * 8 bytes contiguous. Reference Point[] is an array of pointers to scattered objects. CPU prefetches flat arrays efficiently. Why others are wrong: It is not about CPU usage, GPU, or compression.'),
q('What Java patterns are INCOMPATIBLE with value types?', ['Method calls', 'synchronized blocks, IdentityHashMap, WeakReference (anything relying on object identity)', 'Loops', 'String concatenation'], 1, 'Value types have no identity. synchronized requires a monitor (identity). IdentityHashMap uses reference equality. WeakReference tracks object identity. None work with value types. Why others are wrong: Method calls, loops, and string concatenation work fine.')
],
[
'Object headers add 12-16 bytes overhead per object — 67% waste for small data carriers.',
'Value types eliminate headers, enabling flat inline storage and 75%+ memory savings.',
'Universal Generics enable List<int> with zero boxing via specialized bytecode.',
'Value type arrays are contiguous and cache-friendly — enabling SIMD and data-oriented design.',
'Valhalla is opt-in and backward compatible — migrate data-heavy classes incrementally.'
],
'This Expert Track lab requires JDK 21+ for memory analysis. Valhalla preview features require JDK 24+ with --enable-preview flag.'
),

L(
'javax-37', 37, 'Project Loom Advanced: Structured Concurrency & Scoped Values', '🧵',
'🧵 Virtual threads (Lesson 32 preview) solved the thread-per-request scaling problem. But writing correct concurrent code remains hard: orphaned threads, swallowed exceptions, and ThreadLocal memory leaks. Project Loom adds Structured Concurrency (treat concurrent tasks as a single unit) and Scoped Values (replace ThreadLocal with immutable, inherited, scoped data). Together, they make concurrent code as structured and debuggable as sequential code.',
[
{
title: '1. Structured Concurrency Fundamentals',
beginner: 'When you launch multiple threads, they become "orphaned" — floating around with no parent. If one fails, the others keep running. Structured Concurrency fixes this: you group concurrent tasks into a structured scope. If one fails, all siblings are cancelled. The parent waits for all children to complete.',
advanced: 'Structured Concurrency (JEP 453 preview): StructuredTaskScope.ShutdownOnFailure: submit multiple tasks, join() waits for ALL, throwIfFailed() propagates the first exception and cancels remaining tasks. StructuredTaskScope.ShutdownOnSuccess: returns the first successful result, cancels remaining. Fork/join semantics: tasks are forked (submitted) and joined (awaited) within a structured scope. Thread dumps show parent-child relationships, making concurrent debugging tractable.'
},
{
title: '2. StructuredTaskScope API',
beginner: 'StructuredTaskScope is the core API. You create a scope, submit tasks, join them, and handle results. It is like a try-with-resources for concurrency: the scope ensures all tasks complete or are cancelled before you proceed.',
advanced: 'try (var scope = new StructuredTaskScope.ShutdownOnFailure()) { Subtask<String> user = scope.fork(() -> fetchUser(id)); Subtask<String> order = scope.fork(() -> fetchOrder(id)); scope.join(); // waits for both scope.throwIfFailed(); // propagates first exception return new Response(user.get(), order.get()); }. If fetchUser throws, fetchOrder is cancelled. No orphaned threads. Scope must be closed (try-with-resources). Cannot be reused after close.'
},
{
title: '3. Scoped Values (Replacing ThreadLocal)',
beginner: 'ThreadLocal lets each thread have its own data, but it is mutable, slow, and leaks memory with virtual threads. ScopedValue is the modern replacement: immutable data shared across a scope, automatically inherited by child threads, and cleaned up when the scope exits.',
advanced: 'ScopedValue (JEP 446 preview): ScopedValue.where(USER, user).run(() -> { // USER is available here processRequest(); });. Properties: (1) Immutable — cannot be changed after binding. (2) Inherited — child threads/tasks see the value. (3) Scoped — automatically cleaned up when scope exits. (4) Efficient — shared across virtual threads without per-thread copies. ThreadLocal: mutable, per-thread copy, requires manual cleanup (remove()), leaks with virtual threads. ScopedValue is the virtual-thread-friendly replacement.'
},
{
title: '4. Virtual Thread Pinning & Detection',
beginner: 'Virtual threads can be "pinned" to their carrier thread when they enter synchronized blocks or call native methods. Pinned threads cannot be unmounted, defeating the purpose of virtual threads. You must detect and fix pinning to get the full benefit.',
advanced: 'Pinning causes: (1) synchronized blocks — virtual thread cannot unmount while holding a monitor. (2) Native method calls (JNI). Detection: -Djdk.tracePinnedThreads=short prints stack traces when pinning occurs. JFR event: jdk.VirtualThreadPinned. Fix: replace synchronized with ReentrantLock (virtual threads CAN unmount from ReentrantLock). Monitor: jcmd <pid> Thread.dump_to_file -format=json to inspect virtual thread state. In libraries: check for synchronized usage in JDBC drivers, connection pools, legacy frameworks.'
},
{
title: '5. Loom + Valhalla + Panama Synergy (Expert Teaser)',
beginner: 'Project Loom (virtual threads), Valhalla (value types), and Panama (foreign memory) are designed to work together. Virtual threads handle concurrency. Value types optimize data layout. Panama bridges to native code. Together, they transform Java into a systems programming language.',
advanced: '(Expert Teaser) Synergy: (1) Loom + Valhalla: virtual thread stacks stored as value type arrays (flat, compact). (2) Loom + Panama: virtual threads calling native code via Foreign Function API without blocking carrier threads. (3) Valhalla + Panama: off-heap memory segments as value types (flat, cache-friendly). (4) All three + Vector API: concurrent SIMD processing of flat value type arrays. In the Expert track, we explore: building a high-throughput network server with virtual threads + off-heap buffers (Panama) + value type message objects (Valhalla), benchmarking against Netty, and analyzing JFR profiles for pinning and allocation patterns.'
}
],
{
title: '🧵 Lab: Structured Concurrency & Scoped Values',
intro: '⚠️ NOTE: Build a concurrent data fetcher using Structured Concurrency, Scoped Values, and virtual threads. Detect and fix virtual thread pinning.',
steps: [
'Enable preview features: compile with javac --enable-preview --release 21. Run with java --enable-preview.',
'Create ScopedValue: static final ScopedValue<String> USER = ScopedValue.newInstance();.',
'Bind and use: ScopedValue.where(USER, "Alice").run(() -> { System.out.println(USER.get()); });.',
'Create StructuredTaskScope: try (var scope = new StructuredTaskScope.ShutdownOnFailure()) { var userTask = scope.fork(() -> fetchUser()); var orderTask = scope.fork(() -> fetchOrder()); scope.join(); scope.throwIfFailed(); return combine(userTask.get(), orderTask.get()); }.',
'Simulate failure: make fetchOrder() throw. Observe fetchUser() is cancelled and exception propagates.',
'Create virtual threads: Thread.startVirtualThread(() -> { synchronized(lock) { Thread.sleep(1000); } });.',
'Detect pinning: run with -Djdk.tracePinnedThreads=short. Observe pinning stack trace.',
'Fix pinning: replace synchronized with ReentrantLock. Re-run. Observe no pinning.',
'Monitor: jcmd <pid> Thread.dump_to_file -format=json threads.json. Inspect virtual thread states.'
],
goal: 'You built structured concurrent code with automatic cancellation, used Scoped Values for immutable context sharing, and detected/fixed virtual thread pinning.'
},
[
q('What happens when one task in a StructuredTaskScope.ShutdownOnFailure throws an exception?', ['The other tasks continue running independently', 'scope.throwIfFailed() propagates the exception and remaining tasks are automatically cancelled', 'The JVM crashes', 'The exception is silently swallowed'], 1, 'ShutdownOnFailure cancels all remaining tasks on first failure. throwIfFailed() rethrows the exception. No orphaned threads. Why others are wrong: Tasks do not continue. JVM does not crash. Exceptions are not swallowed.'),
q('Why is ScopedValue preferred over ThreadLocal for virtual threads?', ['ScopedValue is faster to type', 'ScopedValue is immutable, inherited by child threads, scoped (auto-cleanup), and shared without per-thread copies — ThreadLocal is mutable, requires manual cleanup, and leaks with virtual threads', 'ThreadLocal is deprecated', 'ScopedValue only works with platform threads'], 1, 'ThreadLocal creates per-thread copies and requires remove() to prevent leaks. With millions of virtual threads, this is catastrophic. ScopedValue is shared, immutable, and scoped. Why others are wrong: ThreadLocal is not deprecated. ScopedValue works with virtual threads.'),
q('What causes virtual thread pinning?', ['Using ReentrantLock', 'synchronized blocks and native method calls — the virtual thread cannot unmount from the carrier thread', 'Using Thread.sleep()', 'Using CompletableFuture'], 1, 'synchronized holds a monitor, preventing unmounting. Native calls (JNI) also pin. ReentrantLock does NOT pin (virtual threads can unmount). Why others are wrong: ReentrantLock, sleep, and CompletableFuture do not pin.'),
q('How do you detect virtual thread pinning in a running application?', ['It is undetectable', 'Run with -Djdk.tracePinnedThreads=short or monitor JFR event jdk.VirtualThreadPinned', 'Check the garbage collector logs', 'Pin the application to a wall'], 1, '-Djdk.tracePinnedThreads prints stack traces when pinning occurs. JFR records jdk.VirtualThreadPinned events. Why others are wrong: It IS detectable. GC logs are unrelated. The last option is a joke.'),
q('What is the relationship between Structured Concurrency and thread dumps?', ['There is no relationship', 'Structured Concurrency shows parent-child task relationships in thread dumps, making concurrent debugging tractable', 'Thread dumps are disabled with structured concurrency', 'Thread dumps only show platform threads'], 1, 'Structured scopes create visible parent-child relationships in thread dumps. You can see which tasks belong to which scope, their states, and exceptions. Why others are wrong: Thread dumps are enhanced, not disabled. They show virtual threads too.')
],
[
'Structured Concurrency groups concurrent tasks with automatic cancellation on failure.',
'ScopedValue replaces ThreadLocal: immutable, inherited, scoped, virtual-thread-friendly.',
'Virtual thread pinning occurs with synchronized and native calls — use ReentrantLock instead.',
'Detect pinning with -Djdk.tracePinnedThreads=short and JFR events.',
'Loom + Valhalla + Panama transform Java into a high-performance systems language.'
],
'This Expert Track lab requires JDK 21+ with --enable-preview for Structured Concurrency and Scoped Values. Use your native terminal for compilation and execution.'
),

L(
'javax-38', 38, 'Sealed Classes + Pattern Matching: Algebraic Data Types', '🔒',
'🔒 Sealed classes (Java 17) and pattern matching for switch (Java 21) together enable Algebraic Data Types (ADTs) in Java — the functional programming pattern that makes invalid states unrepresentable and forces exhaustive handling at compile time. This eliminates entire categories of bugs: missing cases, invalid state combinations, and runtime ClassCastExceptions. This is the most significant type system enhancement since generics.',
[
{
title: '1. Sealed Classes & The permits Clause',
beginner: 'A sealed class says: "Only THESE specific classes can extend me." You list them with permits. No one else can create a subclass. This gives the compiler complete knowledge of all possible subtypes, enabling exhaustive checks.',
advanced: 'sealed interface Shape permits Circle, Rectangle, Triangle. Subclasses must be: final (no further extension), sealed (with their own permits), or non-sealed (open). The compiler stores permitted subclasses in the PermittedSubclasses attribute. Violating permits causes compilation error. Sealed types enable: exhaustive switch, type-safe hierarchies, and domain modeling with closed sets.'
},
{
title: '2. Pattern Matching for switch (Java 21)',
beginner: 'Java 21 switch can match on TYPES, not just values. case Circle c -> c.radius() matches the type AND extracts the variable. No more instanceof + cast chains. Combined with sealed classes, the compiler verifies you handled EVERY case.',
advanced: 'Pattern matching for switch (JEP 441): switch (shape) { case Circle c -> Math.PI * c.radius() * c.radius(); case Rectangle r -> r.width() * r.height(); case Triangle t -> 0.5 * t.base() * t.height(); }. No default needed — compiler proves exhaustiveness via sealed permits. Add a new permitted subclass → every switch over Shape becomes a compilation error until handled. Record patterns: case Point(int x, int y) -> x + y deconstructs records inline.'
},
{
title: '3. Algebraic Data Types (Sum + Product Types)',
beginner: 'A record is a "product type" (AND: a Point has x AND y). A sealed interface is a "sum type" (OR: a Shape is Circle OR Rectangle OR Triangle). Combining them gives Algebraic Data Types — the foundation of type-safe domain modeling in functional languages like Haskell and Rust.',
advanced: 'ADT in Java: sealed interface Expr permits Num, Add, Mul. record Num(double value) implements Expr {}. record Add(Expr left, Expr right) implements Expr {}. record Mul(Expr left, Expr right) implements Expr {}. Evaluation: double eval(Expr e) { return switch(e) { case Num(double v) -> v; case Add(var l, var r) -> eval(l) + eval(r); case Mul(var l, var r) -> eval(l) * eval(r); }; }. Exhaustive, type-safe, no visitor pattern needed.'
},
{
title: '4. Guard Patterns (when clause)',
beginner: 'You can add conditions to pattern cases with when: case Integer i when i > 0 -> "positive". This is called a guard pattern. It combines type matching with boolean conditions.',
advanced: 'Guard patterns (JEP 441): case Integer i when i > 0 -> "positive"; case Integer i when i < 0 -> "negative"; case Integer i -> "zero";. Guards are evaluated after type match. Order matters: first matching case wins. Guards can reference variables from the pattern. Use for: range checks, validation, business rules. Without guards, you would need nested if statements inside each case.'
},
{
title: '5. Replacing Visitor Pattern & State Machines (Expert Teaser)',
beginner: 'Before sealed classes + pattern matching, Java used the Visitor pattern to handle type hierarchies. It was verbose, error-prone, and required modifying every visitor when adding a new type. Sealed classes + switch eliminate the Visitor pattern entirely.',
advanced: '(Expert Teaser) Visitor pattern elimination: sealed types + exhaustive switch replace double dispatch. Adding a new type → compiler forces handling everywhere. State machines: sealed interface State permits Idle, Loading, Loaded, Error. switch(state) handles transitions. Compiler verifies all states handled. Domain events: sealed interface Event permits OrderPlaced, PaymentReceived, ShipmentDispatched. In the Expert track, we explore: modeling complex business workflows with ADTs, combining ADTs with event sourcing (event types as sealed hierarchy), and using ArchUnit to enforce ADT boundaries across modules.'
}
],
{
title: '🔒 Lab: Expression Evaluator with ADTs',
intro: '⚠️ NOTE: Build a type-safe expression evaluator using sealed interfaces, records, and pattern matching for switch.',
steps: [
'Define sealed hierarchy: sealed interface Expr permits Num, Add, Mul, Neg {}.',
'Define record types: record Num(double value) implements Expr {} record Add(Expr left, Expr right) implements Expr {} record Mul(Expr left, Expr right) implements Expr {} record Neg(Expr expr) implements Expr {}.',
'Write evaluator: double eval(Expr expr) { return switch (expr) { case Num(double v) -> v; case Add(var l, var r) -> eval(l) + eval(r); case Mul(var l, var r) -> eval(l) * eval(r); case Neg(var e) -> -eval(e); }; }.',
'Build expression: Expr expr = new Add(new Mul(new Num(2), new Num(3)), new Neg(new Num(1))); // 2*3 + (-1) = 5.',
'Evaluate: System.out.println(eval(expr)); // 5.0.',
'Add new type: record Div(Expr left, Expr right) implements Expr {}. Add to permits. Observe COMPILATION ERROR in eval() — exhaustive switch forces you to handle Div!',
'Add Div case: case Div(var l, var r) -> { double d = eval(r); if (d == 0) throw new ArithmeticException("Div by zero"); yield eval(l) / d; }.',
'Add guard pattern: case Num(double v) when v < 0 -> throw new IllegalArgumentException("Negative literal"); case Num(double v) -> v;.',
'Compile and execute: javac ExprEval.java && java ExprEval.'
],
goal: 'You built a type-safe expression evaluator using sealed interfaces, records, exhaustive pattern matching, and guard patterns.'
},
[
q('What does the permits clause in a sealed class do?', ['It grants runtime permissions', 'It restricts which classes can extend/implement the sealed type, giving the compiler complete knowledge of all subtypes', 'It allows all classes to extend', 'It encrypts the class'], 1, 'permits lists the exact allowed subtypes. Any other extension attempt causes compilation error. The compiler uses this for exhaustive switch checking. Why others are wrong: It does not grant runtime permissions, allow all extensions, or encrypt.'),
q('Why is default not needed in a switch over a sealed type?', ['It is still required', 'The compiler proves exhaustiveness from the permits clause — all possible subtypes are covered', 'default is deprecated', 'sealed types cannot be used in switch'], 1, 'Sealed permits give the compiler complete subtype knowledge. If all permitted types are handled, no default is needed. Adding a new permitted type causes compilation errors in all switches. Why others are wrong: default is not required, not deprecated, and sealed types work in switch.'),
q('What is an Algebraic Data Type (ADT)?', ['A database schema', 'A combination of sum types (sealed interfaces: OR) and product types (records: AND) enabling type-safe domain modeling', 'A sorting algorithm', 'A network protocol'], 1, 'ADT = sum types (Shape = Circle | Rectangle | Triangle) + product types (Point = x AND y). Enables exhaustive, type-safe handling. Why others are wrong: It is not a database, algorithm, or protocol.'),
q('How do sealed classes + pattern matching replace the Visitor pattern?', ['They do not — Visitor is still required', 'Exhaustive switch over sealed types provides type-safe dispatch without double dispatch, and adding a new type forces compile-time handling everywhere', 'Visitor is faster', 'Sealed classes are slower than Visitor'], 1, 'Visitor requires modifying every visitor for new types. Sealed switch: compiler forces handling. No double dispatch, no accept() methods. Why others are wrong: Visitor IS replaced. Speed is comparable. Sealed classes are not slower.'),
q('What does the when clause in a pattern case do?', ['It creates a loop', 'It adds a boolean guard condition that must be true for the case to match', 'It imports a module', 'It declares a variable'], 1, 'when adds a guard: case Integer i when i > 0. The case matches only if the type matches AND the guard is true. Why others are wrong: It does not create loops, import modules, or declare variables.')
],
[
'Sealed classes restrict inheritance via permits, enabling compiler-verified exhaustiveness.',
'Pattern matching for switch eliminates instanceof + cast chains.',
'ADTs = sealed interfaces (sum) + records (product) for type-safe domain modeling.',
'Guard patterns (when) combine type matching with boolean conditions.',
'Sealed classes + pattern matching replace the Visitor pattern entirely.'
],
'This Expert Track lab requires JDK 21+ for pattern matching for switch. Use your native terminal for compilation and execution.'
),

L(
'javax-39', 39, 'Foreign Function & Memory API (Project Panama)', '🌉',
'🌉 Java has always been isolated from the native world. JNI (Java Native Interface) was the only bridge — complex, error-prone, and dangerous. Project Panama replaces JNI with the Foreign Function & Memory API: safe, fast, and pure Java. Allocate off-heap memory, call C libraries directly, and access hardware features without writing a single line of C code. This is Java's gateway to systems programming.',
[
{
title: '1. The JNI Problem & Panama Solution',
beginner: 'JNI requires writing C header files, compiling native libraries, managing memory manually, and risking JVM crashes from pointer errors. Panama replaces all of this with pure Java APIs: Arena for memory management, Linker for function calls, and MethodHandle for invocation. No C code needed!',
advanced: 'JNI pain points: (1) javah header generation. (2) C boilerplate for every function. (3) Manual memory management (malloc/free). (4) JVM crashes from invalid pointers. (5) No stack traces for native crashes. Panama: (1) Arena.ofConfined()/ofShared() for scoped memory. (2) Linker.nativeLinker() for function binding. (3) MemorySegment for safe memory access. (4) Automatic bounds checking. (5) Java stack traces for all errors.'
},
{
title: '2. Arena & MemorySegment',
beginner: 'Arena is a memory management scope. When you allocate memory in an Arena, it is automatically freed when the Arena closes. MemorySegment is a safe view of memory — you can read and write with bounds checking, so you never access invalid addresses.',
advanced: 'Arena types: (1) Arena.ofConfined(): single-thread access, freed on close. (2) Arena.ofShared(): multi-thread access. (3) Arena.ofAuto(): GC-managed (like heap). (4) Arena.global(): never freed (for constants). MemorySegment: MemorySegment.ofAddress(addr), segment.get(ValueLayout.JAVA_INT, offset), segment.set(ValueLayout.JAVA_DOUBLE, offset, value). Bounds checking: every access verified against segment size. Off-heap allocation: arena.allocate(1024) allocates 1KB outside JVM heap — invisible to GC.'
},
{
title: '3. Calling Native Functions (Linker)',
beginner: 'Panama can call any C library function directly. You describe the function signature (name, parameters, return type), and Panama generates the call. No JNI, no C code, no compilation. Just pure Java calling native code.',
advanced: 'Linker linker = Linker.nativeLinker(); SymbolLookup lookup = SymbolLookup.libraryLookup("libm.so", arena); // or loaderLookup() for standard library. MethodHandle cos = linker.downcallHandle(lookup.find("cos").get(), FunctionDescriptor.of(ValueLayout.JAVA_DOUBLE, ValueLayout.JAVA_DOUBLE)); double result = (double) cos.invoke(Math.PI); // calls C cos() function. Downcall: Java → native. Upcall: native → Java (callbacks). jextract tool generates Java bindings from C headers automatically.'
},
{
title: '4. jextract: Automatic Binding Generation',
beginner: 'Instead of manually describing every C function, jextract reads C header files and generates Java binding code automatically. Point jextract at a .h file, and it produces ready-to-use Java classes for all functions, types, and constants.',
advanced: 'jextract workflow: (1) jextract --source --output src --header stdio.h -- -I /usr/include. (2) Generates Java source with all function bindings, struct layouts, and constants. (3) Import generated package and call functions directly. Supports: function pointers, structs, unions, enums, typedefs, variadic functions. For large libraries (OpenSSL, libcurl, SQLite): jextract generates thousands of bindings in seconds. This eliminates the manual JNI boilerplate entirely.'
},
{
title: '5. Panama + Loom + Valhalla Integration (Expert Teaser)',
beginner: 'Panama is not just for calling C. Combined with virtual threads (Loom), you can make non-blocking native calls. Combined with value types (Valhalla), you can create flat native-compatible data structures. Together, they make Java a true systems programming language.',
advanced: '(Expert Teaser) Integration patterns: (1) Loom + Panama: virtual threads calling native I/O (epoll, io_uring) without blocking carrier threads. (2) Valhalla + Panama: value types as native-compatible structs (flat layout, no headers). (3) Vector API + Panama: SIMD operations on off-heap memory segments. (4) All three: high-performance network server with virtual threads + off-heap buffers + value type messages. In the Expert track, we explore: calling io_uring from Java for async I/O, building a zero-copy message broker with off-heap MemorySegments, and integrating BLAS/LAPACK for linear algebra via jextract.'
}
],
{
title: '🌉 Lab: Calling C Math Library from Java',
intro: '⚠️ NOTE: Use the Foreign Function & Memory API to call C standard library functions (cos, strlen) and allocate off-heap memory, all from pure Java.',
steps: [
'Enable preview features: compile with javac --enable-preview --release 21. Run with java --enable-preview --enable-native-access=ALL-UNNAMED.',
'Import: import java.lang.foreign.*; import java.lang.invoke.MethodHandle;',
'Call C cos() function: Linker linker = Linker.nativeLinker(); SymbolLookup lookup = linker.defaultLookup(); MethodHandle cos = linker.downcallHandle(lookup.find("cos").get(), FunctionDescriptor.of(ValueLayout.JAVA_DOUBLE, ValueLayout.JAVA_DOUBLE)); double result = (double) cos.invoke(Math.PI); System.out.println("cos(π) = " + result);.',
'Allocate off-heap memory: try (Arena arena = Arena.ofConfined()) { MemorySegment segment = arena.allocate(100); segment.set(ValueLayout.JAVA_INT, 0, 42); System.out.println(segment.get(ValueLayout.JAVA_INT, 0)); }.',
'Call C strlen(): MethodHandle strlen = linker.downcallHandle(lookup.find("strlen").get(), FunctionDescriptor.of(ValueLayout.JAVA_LONG, ValueLayout.ADDRESS)); try (Arena arena = Arena.ofConfined()) { MemorySegment str = arena.allocateFrom("Hello Panama"); long len = (long) strlen.invoke(str); System.out.println("strlen = " + len); }.',
'Use jextract for a header: jextract --source --output generated --header math.h.',
'Compile generated bindings and call functions directly from generated classes.',
'Compare with JNI: note the absence of C code, header files, and manual memory management.'
],
goal: 'You called C library functions from pure Java, allocated off-heap memory with Arena, and used jextract for automatic binding generation.'
},
[
q('What problem does Project Panama solve that JNI could not?', ['JNI was too fast', 'Panama eliminates JNI boilerplate (C headers, manual memory, JVM crashes) with safe, pure Java APIs for native interop', 'JNI only works on Windows', 'Panama replaces the JVM'], 1, 'Panama provides Arena (scoped memory), Linker (function calls), MemorySegment (safe access) — all pure Java. No C code, no header generation, no manual free(). Why others are wrong: JNI was not too fast. It works on all platforms. Panama does not replace the JVM.'),
q('What is an Arena in the Foreign Memory API?', ['A gaming framework', 'A scoped memory management context that automatically frees allocated off-heap memory when closed', 'A thread pool', 'A database connection pool'], 1, 'Arena manages off-heap memory lifecycle. try-with-resources ensures memory is freed. Types: confined (single-thread), shared (multi-thread), auto (GC). Why others are wrong: It is not gaming, threading, or database related.'),
q('How does Linker.nativeLinker() enable calling C functions?', ['By compiling C code at runtime', 'It creates downcall MethodHandles that bridge Java method calls to native function addresses', 'By generating C source code', 'By using JNI internally'], 1, 'Linker creates MethodHandles bound to native function addresses. downcallHandle wraps a native function pointer. invoke() calls the native function. Why others are wrong: It does not compile C, generate source, or use JNI.'),
q('What does jextract do?', ['Extracts data from databases', 'Reads C header files and generates Java binding code for all functions, types, and constants automatically', 'Extracts memory from the JVM', 'Compresses Java classes'], 1, 'jextract parses .h files and generates Java source with function bindings, struct layouts, and constants. Eliminates manual JNI boilerplate. Why others are wrong: It does not extract database data, JVM memory, or compress classes.'),
q('Why is off-heap memory allocation (Arena.allocate) useful for high-performance applications?', ['It is slower than heap allocation', 'Off-heap memory is invisible to GC (no pause impact), can be shared with native code, and enables zero-copy I/O', 'It uses less CPU', 'It is required for all Java programs'], 1, 'Off-heap memory bypasses GC, avoiding pause impact. Native code can access it directly. Enables zero-copy network I/O (sendfile, io_uring). Why others are wrong: It is not slower, not CPU-specific, and not required for all programs.')
],
[
'Panama replaces JNI with safe, pure Java APIs: Arena, Linker, MemorySegment.',
'Arena provides scoped off-heap memory management with automatic cleanup.',
'Linker.nativeLinker() creates downcall handles to C functions without C code.',
'jextract generates Java bindings from C headers automatically.',
'Off-heap memory is GC-invisible, enabling zero-copy I/O and native interop.'
],
'This Expert Track lab requires JDK 21+ with --enable-preview and --enable-native-access flags. Use your native terminal for compilation and execution.'
),

L(
'javax-40', 40, 'Java Expert Capstone: FAANG-Grade System Design', '🏆',
'🏆 Congratulations on reaching the final lesson of the Java Expert Track. You have traversed JVM internals, bytecode manipulation, advanced concurrency, performance engineering, enterprise architecture, cloud-native patterns, and the modern Java frontier. This capstone synthesizes everything into a FAANG-grade system design exercise: designing, implementing, and defending a distributed system that handles millions of requests per second with sub-millisecond latency.',
[
{
title: '1. System Design Interview Framework',
beginner: 'FAANG system design interviews follow a structured framework: (1) Clarify requirements, (2) Define API contracts, (3) Design data model, (4) High-level architecture, (5) Deep dive into critical components, (6) Identify bottlenecks and trade-offs. Mastering this framework is as important as the technical knowledge.',
advanced: 'Framework execution: (1) Requirements: functional (features) + non-functional (latency, throughput, availability, consistency). (2) API design: REST/gRPC contracts, request/response schemas. (3) Data model: entity relationships, storage choice (SQL vs NoSQL). (4) Architecture: load balancers, services, caches, queues, databases. (5) Deep dive: pick 1-2 critical components and design in detail. (6) Trade-offs: CAP theorem, consistency vs latency, cost vs performance.'
},
{
title: '2. Designing a URL Shortener (Classic)',
beginner: 'Design a URL shortener like bit.ly: given a long URL, return a short code. Given a short code, redirect to the long URL. Seems simple, but at FAANG scale (100M URLs, 10K reads/sec), it requires careful design of ID generation, caching, and database sharding.',
advanced: 'URL Shortener design: (1) ID generation: Base62 encoding of auto-increment ID or distributed ID generator (Snowflake). (2) Storage: key-value store (Cassandra, DynamoDB) for O(1) lookups. (3) Cache: Redis for hot URLs (80/20 rule). (4) Read path: cache → database → 404. (5) Write path: generate ID → store → return. (6) Scale: 10K reads/sec → 10 cache nodes. 1K writes/sec → 3 DB shards. (7) Trade-offs: consistency (eventual for analytics) vs latency (< 10ms reads).'
},
{
title: '3. Designing a Rate Limiter (Java Focus)',
beginner: 'Design a rate limiter that restricts API calls to N requests per second per user. This is a core infrastructure component at every FAANG company. The Java implementation uses atomic counters, sliding windows, and distributed coordination.',
advanced: 'Rate limiter design: (1) Algorithm: token bucket (burst-friendly) or sliding window log (precise). (2) Java implementation: LongAdder for per-user counters, Caffeine cache for user buckets. (3) Distributed: Redis + Lua script for atomic decrement across instances. (4) Headers: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset. (5) Response: 429 Too Many Requests with Retry-After. (6) Java specifics: virtual threads for high-concurrency request handling, Arena for off-heap rate limit state.'
},
{
title: '4. Designing a Distributed Task Scheduler',
beginner: 'Design a system that schedules and executes millions of delayed tasks (like "send email in 5 minutes"). This requires a priority queue, distributed coordination, fault tolerance, and exactly-once execution guarantees.',
advanced: 'Task scheduler design: (1) Storage: time-ordered queue (Redis Sorted Set, Cassandra time-series). (2) Polling: workers poll for due tasks via leader election (ZooKeeper/etcd). (3) Execution: virtual thread pool for concurrent task execution. (4) Exactly-once: idempotency keys + transactional outbox. (5) Fault tolerance: task acknowledgment + retry with exponential backoff. (6) Scale: partition by task ID hash, multiple scheduler instances. (7) Java specifics: ForkJoinPool for task execution, CompletableFuture for async workflows.'
},
{
title: '5. Defending Your Design (Expert Teaser)',
beginner: 'The hardest part of a system design interview is defending your choices. Why did you choose Cassandra over PostgreSQL? Why Redis over Memcached? Why eventual consistency? You must articulate trade-offs clearly and respond to follow-up questions under pressure.',
advanced: '(Expert Teaser) Defense framework: (1) Every choice has a trade-off — state it explicitly. (2) Quantify: "This handles 10K reads/sec with p99 < 10ms." (3) Acknowledge limitations: "This design sacrifices consistency for availability." (4) Offer alternatives: "If we needed strong consistency, we would use PostgreSQL with read replicas." (5) Scale analysis: "At 10x load, we would add X, Y, Z." In the Expert track, we run mock system design interviews covering: chat systems, news feeds, notification systems, payment processing, and real-time analytics — all with Java-specific implementation deep dives.'
}
],
{
title: '🏆 Capstone: Design & Implement a Distributed Rate Limiter',
intro: '⚠️ NOTE: Design and implement a production-grade distributed rate limiter combining every concept from the Expert Track: virtual threads, lock-free counters, off-heap caching, and comprehensive testing.',
steps: [
'Design the API: POST /api/check-rate-limit with userId, returns allowed (boolean), remaining (int), resetAt (timestamp).',
'Implement token bucket algorithm: class TokenBucket { private final long capacity; private final AtomicLong tokens; private final AtomicLong lastRefill; boolean tryConsume() { refill(); return tokens.getAndDecrement() > 0; } }.',
'Use LongAdder for high-contention metrics: LongAdder totalRequests = new LongAdder(); LongAdder rejectedRequests = new LongAdder();.',
'Implement sliding window with Caffeine cache: Cache<String, Deque<Long>> windows = Caffeine.newBuilder().expireAfterWrite(1, TimeUnit.MINUTES).build();.',
'Add virtual thread handling: Thread.startVirtualThread(() -> handleRequest(userId));.',
'Write JMH benchmark: @Benchmark public boolean rateLimitCheck() { return limiter.tryConsume("user-123"); }.',
'Write ArchUnit rule: noClasses().that().resideInAPackage("..ratelimiter..").should().dependOnClassesThat().resideInAPackage("..spring..") — framework-independent core.',
'Write PIT mutation tests: verify rate limiting logic survives mutations.',
'Write Testcontainers integration test: Redis-based distributed rate limiter with real Redis container.',
'Document trade-offs: consistency model, memory usage, failure modes, scaling strategy.'
],
goal: 'You designed and implemented a FAANG-grade distributed rate limiter, combining virtual threads, lock-free data structures, comprehensive testing, and architecture enforcement. Congratulations on completing the Java Expert Track!'
},
[
q('In a system design interview, what should you do FIRST before drawing any architecture?', ['Start coding immediately', 'Clarify functional and non-functional requirements: features, latency targets, throughput, availability, consistency requirements', 'Choose a database', 'Draw the load balancer'], 1, 'Requirements clarification prevents designing the wrong system. Ask: expected users, QPS, latency SLA, consistency needs, data volume. Why others are wrong: Coding, database selection, and architecture come AFTER requirements.'),
q('For a URL shortener handling 10K reads/sec, what is the optimal read path?', ['Database directly', 'Cache (Redis) → Database → 404, leveraging the 80/20 rule for hot URLs', 'File system', 'In-memory HashMap on a single server'], 1, 'Cache-first reads: 80% of reads hit cache (hot URLs), remaining 20% go to database. This reduces DB load by 80%. Why others are wrong: Direct DB cannot handle 10K/sec. File system is too slow. Single-server HashMap does not scale.'),
q('Why is a token bucket algorithm preferred over a fixed window counter for rate limiting?', ['Token bucket is simpler to implement', 'Token bucket allows controlled bursts while maintaining average rate; fixed window has boundary burst problems', 'Fixed window uses less memory', 'Token bucket is required by HTTP standards'], 1, 'Fixed window: 100 requests at end of window + 100 at start of next = 200 in 1 second (2x burst). Token bucket: tokens refill continuously, allowing bursts up to bucket capacity while maintaining average rate. Why others are wrong: Token bucket is more complex. Memory is comparable. No HTTP standard mandates it.'),
q('What is the CAP theorem and how does it apply to distributed rate limiter design?', ['A database optimization technique', 'You can have at most 2 of: Consistency, Availability, Partition tolerance. For rate limiters, choose AP (available during partitions) with eventual consistency', 'A Java language specification', 'A caching algorithm'], 1, 'Rate limiters prioritize availability (never block requests due to coordination failure). Consistency is eventual (slight over/under-limiting during partitions). Why others are wrong: CAP is a theorem, not optimization or caching. It applies to distributed systems, not Java specs.'),
q('How do you defend the choice of Cassandra over PostgreSQL for a URL shortener?', ['Cassandra is always better', 'Cassandra provides O(1) key-value lookups, horizontal scaling via consistent hashing, and tunable consistency — ideal for read-heavy URL lookups at scale', 'PostgreSQL is deprecated', 'Cassandra is free and PostgreSQL is not'], 1, 'URL shortener is a key-value workload (short_code → long_url). Cassandra excels at this with O(1) reads, linear scaling, and AP consistency. PostgreSQL is better for relational queries, transactions, complex joins. Why others are wrong: Neither is universally better. PostgreSQL is not deprecated. Both are free.')
],
[
'System design interviews require structured frameworks: requirements → API → data model → architecture → deep dive → trade-offs.',
'Every design choice has a trade-off — articulate it explicitly and quantify the impact.',
'Rate limiters, URL shorteners, and task schedulers are classic FAANG design problems.',
'Java-specific implementations leverage virtual threads, lock-free structures, and off-heap memory.',
'Congratulations on completing the Java Expert Track! You now possess FAANG-grade Java engineering skills.'
],
'This Expert Track capstone requires all previous lab dependencies: JDK 21+, Maven, Docker (Testcontainers), JMH, PIT, ArchUnit. Use your native terminal for the full implementation.'
 )
];

export const getJavaExpertLessonById = (id: string): JavaExpertLesson | undefined =>
  JAVA_EXPERT_LESSONS.find(l => l.id === id);

export const isJavaExpertLessonUnlocked = (id: string, completedLessons: string[]): boolean => {
  const idx = JAVA_EXPERT_LESSONS.findIndex(l => l.id === id);
  if (idx <= 0) return true;
  return completedLessons.includes(JAVA_EXPERT_LESSONS[idx - 1].id);
};
