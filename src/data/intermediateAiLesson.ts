export interface AIConcept {
  title: string;
  beginner: string;
  advanced: string;
}

export interface AIQuiz {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface AIPractical {
  title: string;
  intro: string;
  steps: string[];
  goal: string;
  starterCode: string;
  solutionCode: string;
}

export interface AILesson {
  id: string;
  order: number;
  module: string;
  icon: string;
  title: string;
  philosophy: string;
  concepts: AIConcept[];
  practical: AIPractical;
  quiz: AIQuiz[];
  milestones: string[];
}

export const INTERMEDIATE_AI_LESSONS: AILesson[] = [
  // MODULE 1: Fine-Tuning & Adaptation
  {
    id: 'aiin-01',
    order: 1,
    module: 'Fine-Tuning & Adaptation',
    icon: '⚙️',
    title: 'PEFT, LoRA & QLoRA',
    philosophy: 'Training a modern LLM from scratch requires millions of dollars and thousands of GPUs. Even fine-tuning all parameters of a 7-billion parameter model is out of reach for most developers. Parameter-Efficient Fine-Tuning (PEFT), and specifically LoRA (Low-Rank Adaptation), solves this. Instead of modifying all billions of weights, LoRA freezes the original model and injects tiny, lightweight adapter matrices. QLoRA takes this a step further by compressing the base model to 4-bit precision, letting you fine-tune massive models on a single consumer GPU.',
    concepts: [
      {
        title: '1. The Full Fine-Tuning Bottleneck',
        beginner: 'Imagine trying to rewrite an entire encyclopedia just to add one new chapter. That is full fine-tuning. You have to update billions of parameters, which takes massive computer memory and time.',
        advanced: 'Full fine-tuning requires updating and storing gradients, optimizer states, and weights for every parameter in the network. For a 70B model, this demands hundreds of gigabytes of VRAM, making it computationally expensive and prone to catastrophic forgetting.'
      },
      {
        title: '2. Low-Rank Adaptation (LoRA)',
        beginner: 'Instead of rewriting the book, LoRA lets you clip sticky notes onto specific pages. The main book stays frozen, and you only write small notes (adapters). When reading, the model checks the book and your notes together.',
        advanced: 'LoRA freezes the pre-trained model weights and decomposes the weight update matrix into two smaller low-rank matrices (A and B). Since rank r is much smaller than model dimension d, the trainable parameter count drops by over 99% while maintaining performance.'
      },
      {
        title: '3. QLoRA (Quantized LoRA)',
        beginner: 'QLoRA combines two tricks: it compresses the heavy frozen book into smaller print (4-bit quantization) and adds sticky notes (LoRA). Now you can train high-quality models on a single personal laptop GPU.',
        advanced: 'QLoRA quantizes the base model to 4-bit NormalFloat (NF4) while keeping the LoRA adapter parameters in 16-bit precision. Double Quantization and Paged Optimizers prevent memory spikes, enabling fine-tuning of 65B+ parameter models on a single 48GB GPU.'
      }
    ],
    practical: {
      title: 'LoRA Parameter Count Reduction Calculator',
      intro: 'Let\'s build a memory estimator function that calculates how many parameters need to be updated during LoRA fine-tuning. Calculate trainable parameters by multiplying hidden dimension d by rank r and then by 2 (for matrices A and B).',
      steps: [
        'Multiply the hidden dimension `d` by the rank `r`.',
        'Multiply that result by `2` to account for both LoRA matrices (A and B).',
        'Assign that calculation to a variable named `trainableParams`.',
        'Return `trainableParams`.'
      ],
      goal: 'Calculate the exact number of trainable parameters for a single LoRA layer.',
      starterCode: 'function computeLoraParams(d, r) {\n  // Write your code below this line\n  \n}',
      solutionCode: 'function computeLoraParams(d, r) {\n  const trainableParams = d * r * 2;\n  return trainableParams;\n}'
    },
    quiz: [
      {
        question: 'What is the key mechanism of Low-Rank Adaptation (LoRA)?',
        options: [
          'It retrains all model parameters using smaller batch sizes.',
          'It freezes base model weights and trains low-rank matrix pairs added to existing layers.',
          'It deletes unnecessary vocabulary tokens from the tokenizer.',
          'It converts standard text prompts directly into SQL database queries.'
        ],
        correctIndex: 1,
        explanation: 'LoRA keeps the original base model frozen and only updates small low-rank adapter matrices, drastically reducing trainable parameter count.'
      },
      {
        question: 'How does QLoRA achieve fine-tuning on consumer-grade hardware?',
        options: [
          'By deleting non-English words from training datasets.',
          'By quantizing the base model to 4-bit precision while keeping LoRA adapters trainable.',
          'By running training strictly inside standard web browsers.',
          'By converting all input strings to ASCII numbers.'
        ],
        correctIndex: 1,
        explanation: 'QLoRA uses 4-bit NormalFloat (NF4) quantization for frozen base weights combined with 16-bit trainable LoRA adapters.'
      }
    ],
    milestones: [
      'Analyze why full parameter fine-tuning is computationally prohibitive for large models.',
      'Deconstruct low-rank matrix decomposition mechanics (A × B) in LoRA.',
      'Understand 4-bit NormalFloat quantization strategies used in QLoRA.',
      'Implement a parameter calculator script for adapter memory estimation.'
    ]
  },
  {
    id: 'aiin-02',
    order: 2,
    module: 'Fine-Tuning & Adaptation',
    icon: '🎯',
    title: 'Alignment & Preference (SFT vs. DPO)',
    philosophy: 'Raw base language models are just next-token guessers. If you ask a raw model "How do I make a cake?", it might respond with another question like "Where can I buy flour?" because it was trained on uncurated internet text. Alignment is the process of shaping raw models into helpful, honest, and harmless assistants. Supervised Fine-Tuning (SFT) teaches basic prompt-following, while preference optimization algorithms like DPO (Direct Preference Optimization) teach the model which responses humans actually prefer.',
    concepts: [
      {
        title: '1. Supervised Fine-Tuning (SFT)',
        beginner: 'SFT is like teaching a child by showing examples. You give the AI a question paired with the exact ideal answer, repeated thousands of times, so it learns the format of being a helpful assistant.',
        advanced: 'SFT trains a base model on high-quality instruction-response pairs using standard cross-entropy loss. It converts a raw document completion engine into an instruction-following model by adjusting probabilities toward curated target responses.'
      },
      {
        title: '2. RLHF (Reinforcement Learning from Human Feedback)',
        beginner: 'RLHF is like giving a dog a treat when it behaves. A separate "Reward Model" rates the AI\'s answers, and a reinforcement algorithm turns up the dials for answers that earned high treats.',
        advanced: 'RLHF involves training a separate reward model on human pairwise preferences (Chosen vs. Rejected responses), then using Proximal Policy Optimization (PPO) to adjust the LLM\'s policy. While effective, RLHF is complex and computationally unstable.'
      },
      {
        title: '3. Direct Preference Optimization (DPO)',
        beginner: 'DPO simplifies RLHF. Instead of building a complex separate treat model, DPO directly compares good answers (Chosen) against bad answers (Rejected) using a simple mathematical trick.',
        advanced: 'DPO eliminates the separate reward model and reinforcement learning loop entirely. By mathematically re-parameterizing the reward function in terms of the policy itself, DPO optimizes directly on pairwise preference data using a simple classification loss.'
      }
    ],
    practical: {
      title: 'Preference Data Pair Validator',
      intro: 'Let\'s write a dataset validation function for preference tuning. For DPO or RLHF training, each record must contain a prompt, a chosen response, and a rejected response. Write a function that checks if all three fields exist and are non-empty.',
      steps: [
        'Check if `item.prompt`, `item.chosen`, and `item.rejected` are defined and not empty strings.',
        'If all three exist and are non-empty strings, return `"Valid Pair"`.',
        'Otherwise, return `"Invalid Pair"`.'
      ],
      goal: 'Validate preference dataset records before feeding them into alignment training pipelines.',
      starterCode: 'function validatePreferencePair(item) {\n  // Write your code below this line\n  \n}',
      solutionCode: 'function validatePreferencePair(item) {\n  if (item && item.prompt && item.chosen && item.rejected) {\n    return "Valid Pair";\n  }\n  return "Invalid Pair";\n}'
    },
    quiz: [
      {
        question: 'What is the primary role of Supervised Fine-Tuning (SFT)?',
        options: [
          'To reduce model size using 4-bit compression.',
          'To transition a raw base model into an instruction-following assistant format using Q&A pairs.',
          'To connect the model to live internet web search tools.',
          'To convert database tables into text embeddings.'
        ],
        correctIndex: 1,
        explanation: 'SFT uses curated instruction-response datasets to align raw text predictors into structured, conversational assistants.'
      },
      {
        question: 'Why is Direct Preference Optimization (DPO) preferred over traditional RLHF in many modern pipelines?',
        options: [
          'DPO eliminates the need for any human data.',
          'DPO bypasses the complex separate reward model and PPO reinforcement loop by directly optimizing policy preference math.',
          'DPO only works on smaller 1B models.',
          'DPO encrypts model weights during training.'
        ],
        correctIndex: 1,
        explanation: 'DPO simplifies alignment by directly optimizing policy probabilities using chosen vs. rejected pairs without requiring a separate reward model or RL setup.'
      }
    ],
    milestones: [
      'Differentiate raw text completion models from aligned instruction-following models.',
      'Analyze the structural steps of Supervised Fine-Tuning (SFT).',
      'Compare traditional RLHF reward pipelines with Direct Preference Optimization (DPO).',
      'Build a preference dataset record validator function in code.'
    ]
  },

  // MODULE 2: Advanced RAG Architecture
  {
    id: 'aiin-03',
    order: 3,
    module: 'Advanced RAG Architecture',
    icon: '🔍',
    title: 'Hybrid Search & Re-Ranking',
    philosophy: 'Basic RAG relies exclusively on vector embeddings to find relevant documents. However, vector search has a weakness: it can struggle with exact keyword matches, serial numbers, specialized acronyms, or specific names. Hybrid Search fixes this by combining vector search (semantic meaning) with traditional keyword search (BM25). A Re-Ranker model then scores and rearranges the top results so the absolute best context enters the LLM prompt.',
    concepts: [
      {
        title: '1. The Vector-Only Retrieval Blind Spot',
        beginner: 'If a user searches for part number "ERR-404-X", a vector search might return general error documents because it looks for overall meaning. It misses the exact match. Vector search excels at concepts, but fails at exact terms.',
        advanced: 'Dense vector embeddings represent semantic concepts in continuous space. However, they lack exact lexical precision, making them vulnerable to missing specific terms, rare entities, technical codes, or exact keyword matches.'
      },
      {
        title: '2. Hybrid Search (BM25 + Dense Vectors)',
        beginner: 'Hybrid search combines two search engines: a keyword search engine (like a librarian matching exact words) and a vector search engine (like a librarian understanding the topic). Combining their scores gives you the best of both worlds.',
        advanced: 'Hybrid search merges sparse lexical retrieval (BM25 algorithm) with dense semantic retrieval (Vector Embeddings). Using Reciprocal Rank Fusion (RRF) or normalized score weighting, it produces a single composite ranking that captures both exact keywords and semantic context.'
      },
      {
        title: '3. Cross-Encoder Re-Ranking',
        beginner: 'Search engines quickly pick the top 20 candidates. Then, a smaller, highly accurate AI model (a Re-Ranker) examines the question and candidates together to sort them in exact order of relevance before passing the top 3 to the main LLM.',
        advanced: 'While Bi-Encoders produce static vectors for fast retrieval, Cross-Encoders pass the query and document together through a neural network to calculate an explicit relevance score. Applying a Re-Ranker step on initial search hits significantly improves context precision.'
      }
    ],
    practical: {
      title: 'Reciprocal Rank Fusion (RRF) Score Merger',
      intro: 'Let\'s write an RRF algorithm to combine keyword rank and vector rank into a single hybrid score. The formula for RRF score for a document is `1 / (60 + vectorRank) + 1 / (60 + keywordRank)`.',
      steps: [
        'Calculate the vector rank component: `1 / (60 + vectorRank)`.',
        'Calculate the keyword rank component: `1 / (60 + keywordRank)`.',
        'Sum both components and assign to a variable named `rrfScore`.',
        'Return `rrfScore`.'
      ],
      goal: 'Implement the standard Reciprocal Rank Fusion formula to merge multi-retrieval rankings.',
      starterCode: 'function computeRRF(vectorRank, keywordRank) {\n  // Write your code below this line\n  \n}',
      solutionCode: 'function computeRRF(vectorRank, keywordRank) {\n  const rrfScore = (1 / (60 + vectorRank)) + (1 / (60 + keywordRank));\n  return rrfScore;\n}'
    },
    quiz: [
      {
        question: 'Why is dense vector search alone sometimes insufficient for enterprise search?',
        options: [
          'Vector databases cannot store more than 100 documents.',
          'Vector embeddings can struggle with exact term matching such as serial numbers or specific codes.',
          'Vector search only works with numerical values, not text.',
          'Vector embeddings require continuous internet access during query execution.'
        ],
        correctIndex: 1,
        explanation: 'Dense embeddings map general semantic concepts well but frequently miss exact string matches, codes, or specific terminology.'
      },
      {
        question: 'What distinguishes a Cross-Encoder Re-Ranker from a Bi-Encoder vector embedding model?',
        options: [
          'Bi-encoders compare text strings directly using Regex rules.',
          'Cross-encoders process query and candidate document together, computing deeper contextual relevance scores.',
          'Cross-encoders only run on mobile device hardware.',
          'Bi-encoders generate output text directly like an LLM.'
        ],
        correctIndex: 1,
        explanation: 'Cross-Encoders analyze query and document text simultaneously in a single forward pass, providing high scoring accuracy for re-ranking.'
      }
    ],
    milestones: [
      'Identify semantic and lexical retrieval trade-offs in search architectures.',
      'Combine BM25 sparse retrieval with dense vector similarity search.',
      'Understand Reciprocal Rank Fusion (RRF) scoring mechanisms.',
      'Implement a Cross-Encoder candidate re-ranking calculator.'
    ]
  },
  {
    id: 'aiin-04',
    order: 4,
    module: 'Advanced RAG Architecture',
    icon: '🧩',
    title: 'Context Management & Hierarchical Chunking',
    philosophy: 'How you slice documents determines whether your RAG app succeeds or fails. Slicing text into chunks that are too small loses surrounding context; slicing text into chunks that are too large dilutes specific details and overflows the prompt window. Advanced RAG uses Hierarchical Chunking (Parent-Child indexing) and Context Compression to retrieve small, exact text matches while passing rich, complete parent sections to the model.',
    concepts: [
      {
        title: '1. The Chunking Trade-off Paradox',
        beginner: 'Think of cutting a textbook into snippets. Small snippets fit nicely into search, but miss the big picture. Huge chapters keep the big picture, but waste space and introduce noise into the AI prompt.',
        advanced: 'Chunk size creates an architectural dilemma. Small chunks yield precise vector embeddings but lose surrounding thematic context. Large chunks retain contextual integrity but introduce irrelevant noise and dilute specific semantic signals during vector lookup.'
      },
      {
        title: '2. Parent-Child Hierarchical Chunking',
        beginner: 'Parent-Child chunking solves this: search against small "child" snippets for high search accuracy, but when a match is found, send the larger "parent" section to the AI so it has full context.',
        advanced: 'Parent-Child indexing splits documents into small child chunks (e.g., 100 tokens) for high-precision vector retrieval, mapped to larger parent chunks (e.g., 1000 tokens). Upon retrieving a child match, the retriever passes the parent text into the LLM context window.'
      },
      {
        title: '3. Context Compression & Pruning',
        beginner: 'Context compression is like taking a highlighter to a long document. Instead of sending full pages, a compression step strips out irrelevant sentences before handing text to the model, saving space and cost.',
        advanced: 'Context compression analyzes retrieved chunks against the original query to filter out irrelevant sentences or summarize redundant text. This optimizes context window utilization, improves model attention focus, and reduces API latency.'
      }
    ],
    practical: {
      title: 'Parent-Child Map Retriever',
      intro: 'Let\'s write a function that takes a child chunk ID and looks up its corresponding parent document chunk from a reference map object. If the parent exists, return it; otherwise, return the child text as fallback.',
      steps: [
        'Look up `parentMap[childId]`.',
        'If found, return `parentMap[childId]`.',
        'Otherwise, return the `fallbackChildText` parameter.'
      ],
      goal: 'Build a parent context retriever mechanism to replace small vector hits with rich parent sections.',
      starterCode: 'function getParentContext(childId, fallbackChildText, parentMap) {\n  // Write your code below this line\n  \n}',
      solutionCode: 'function getParentContext(childId, fallbackChildText, parentMap) {\n  if (parentMap && parentMap[childId]) {\n    return parentMap[childId];\n  }\n  return fallbackChildText;\n}'
    },
    quiz: [
      {
        question: 'What primary problem does Parent-Child chunking solve in RAG pipelines?',
        options: [
          'It compresses database files into ZIP archives automatically.',
          'It allows high-precision search using small child chunks while providing rich parent context to the LLM.',
          'It removes the need for tokenizers in text processing.',
          'It encrypts text chunks inside client memory storage.'
        ],
        correctIndex: 1,
        explanation: 'Parent-Child chunking separates the search index (small child chunks) from the generation context (larger parent blocks).'
      },
      {
        question: 'What is the goal of context compression before LLM generation?',
        options: [
          'To convert text inputs into binary numbers.',
          'To prune irrelevant sentences from retrieved context, preserving prompt space and reducing noise.',
          'To automatically generate image captions for documents.',
          'To force models to output answers in uppercase letters.'
        ],
        correctIndex: 1,
        explanation: 'Context compression filters out unnecessary text from retrieved passages, keeping only sentences relevant to the user query.'
      }
    ],
    milestones: [
      'Evaluate small vs. large chunk size impacts on vector precision and context quality.',
      'Design Parent-Child (Hierarchical) document indexing structures.',
      'Apply context compression techniques to prune unneeded text.',
      'Build a contextual parent look-up function in JavaScript.'
    ]
  },

  // MODULE 3: Production Agents & Workflow Orchestration
  {
    id: 'aiin-05',
    order: 5,
    module: 'Production Agents & Workflow Orchestration',
    icon: '🌿',
    title: 'Multi-Agent State Graphs',
    philosophy: 'Single agents struggle when assigned huge, multi-step tasks. Asking one agent to research, code, test, and write documentation leads to confusion and errors. Modern production systems use Multi-Agent State Graphs. By breaking complex jobs down into specialized agents (e.g., Researcher, Coder, Reviewer) and connecting them through a central State graph with explicit conditional rules, tasks are handled cleanly with higher reliability.',
    concepts: [
      {
        title: '1. The Single-Agent Generalist Failure',
        beginner: 'Imagine one person trying to be the chef, waiter, accountant, and manager of a busy restaurant. Mistakes happen fast. Single AI agents get overwhelmed when given too many tools and instructions at once.',
        advanced: 'Single agents suffer performance degradation as prompt length and tool definitions expand. Attempting to force one agent to handle planning, execution, verification, and formatting increases hallucination rates and tool invocation errors.'
      },
      {
        title: '2. State Graphs & Node Routing',
        beginner: 'A state graph is like a digital assembly line. Each station (node) has one clear job. Data (the state) passes down the line, and control rules decide which station gets the work next.',
        advanced: 'State graphs structure agent coordination as a directed graph where nodes represent specific agent actions or function executions, and edges define state transitions. A shared central state object persists data across nodes.'
      },
      {
        title: '3. Supervisor & Specialized Agent Pattern',
        beginner: 'In a supervisor setup, a "Manager Agent" inspects work and hands off tasks to "Specialist Agents" (like a Research Agent or Code Writer). When a specialist finishes, control returns to the manager.',
        advanced: 'The supervisor pattern uses an orchestration agent to route control dynamically based on current graph state. The supervisor evaluates outputs from specialist nodes and decides whether to transition to another specialist or terminate execution.'
      }
    ],
    practical: {
      title: 'Multi-Agent Router Node',
      intro: 'Let\'s build a router function for a multi-agent system. Given a current state object with `nextStep` and `isComplete` fields, route to `"FINISH"` if complete, or return the target agent node name.',
      steps: [
        'Check if `state.isComplete` is `true`. If so, return `"FINISH"`.',
        'Otherwise, return `state.nextStep`.'
      ],
      goal: 'Create a deterministic routing edge for state graph execution.',
      starterCode: 'function routeState(state) {\n  // Write your code below this line\n  \n}',
      solutionCode: 'function routeState(state) {\n  if (state && state.isComplete) {\n    return "FINISH";\n  }\n  return state.nextStep;\n}'
    },
    quiz: [
      {
        question: 'Why are specialized multi-agent systems often preferred over single generalist agents for complex workflows?',
        options: [
          'Single agents consume zero tokens.',
          'Specialized agents keep prompts focused, reducing context confusion and tool invocation errors.',
          'Multi-agent networks run without needing any API keys.',
          'Single agents cannot parse JSON format files.'
        ],
        correctIndex: 1,
        explanation: 'Partitioning tasks into specialized agents keeps individual contexts small and focused, improving execution quality.'
      },
      {
        question: 'In a state graph framework, what role does the shared "State" object perform?',
        options: [
          'It stores stylesheet CSS rules for the UI component.',
          'It persists output data, conversation history, and execution flags as execution passes between nodes.',
          'It deletes previous tool calls to save storage.',
          'It encrypts local user browsing history.'
        ],
        correctIndex: 1,
        explanation: 'The shared State object acts as the central memory store updated and passed through graph nodes during the workflow.'
      }
    ],
    milestones: [
      'Analyze performance limits of single generalist agent architectures.',
      'Map state graph components: Nodes, Edges, and Shared State.',
      'Design Supervisor-Specialist multi-agent orchestration patterns.',
      'Implement a conditional router function for state graph edges.'
    ]
  },
  {
    id: 'aiin-06',
    order: 6,
    module: 'Production Agents & Workflow Orchestration',
    icon: '💾',
    title: 'Agent Memory Systems',
    philosophy: 'By default, LLMs are completely stateless—they forget everything the moment a conversation ends. Building useful long-term agents requires engineering dedicated Memory Systems. These range from Short-Term Memory (sliding message windows) to Long-Term Semantic Memory (storing user preferences and facts in vector databases) and Episodic Memory (remembering past task executions to avoid repeating past mistakes).',
    concepts: [
      {
        title: '1. Short-Term Memory & Context Truncation',
        beginner: 'Short-term memory is like a whiteboard. As new chat messages arrive, old messages get erased from the top so the whiteboard never overflows.',
        advanced: 'Short-term memory manages active conversation state using sliding message windows, token trimming, or sliding summaries. It maintains immediate context while preventing execution crashes caused by context window limits.'
      },
      {
        title: '2. Semantic Memory (User Facts & Preferences)',
        beginner: 'Semantic memory is like an agent\'s personal notebook about you. If you mention "I live in Chicago and prefer Python", it saves those facts to remember in future conversations months later.',
        advanced: 'Semantic memory extracts key facts, user preferences, and domain knowledge from conversations and saves them as vector embeddings or graph triplets. At query time, relevant facts are retrieved into the system context.'
      },
      {
        title: '3. Episodic Memory (Past Execution Traces)',
        beginner: 'Episodic memory is like learning from past experience. If an agent tried a tool command yesterday and it failed, it checks its past memories so it doesn\'t make the same mistake twice.',
        advanced: 'Episodic memory logs past agent action-observation sequences and outcomes. When facing new tasks, the agent queries past execution episodes to replicate successful strategies and bypass previously encountered errors.'
      }
    ],
    practical: {
      title: 'Sliding Window Memory Truncator',
      intro: 'Let\'s write a short-term memory trimmer. Given an array of message objects and a maximum limit `maxMessages`, return only the most recent `maxMessages` items from the array.',
      steps: [
        'If `messages.length` is less than or equal to `maxMessages`, return `messages`.',
        'Otherwise, slice and return the last `maxMessages` elements using `.slice(-maxMessages)`.',
        'Return the sliced array.'
      ],
      goal: 'Implement a sliding-window buffer for short-term conversation context management.',
      starterCode: 'function truncateMemory(messages, maxMessages) {\n  // Write your code below this line\n  \n}',
      solutionCode: 'function truncateMemory(messages, maxMessages) {\n  if (messages.length <= maxMessages) {\n    return messages;\n  }\n  return messages.slice(-maxMessages);\n}'
    },
    quiz: [
      {
        question: 'What is the function of Semantic Memory in an AI agent?',
        options: [
          'To measure system memory utilization on the backend server.',
          'To extract, store, and retrieve long-term user facts and preferences across sessions.',
          'To clear browser cookies when logging out.',
          'To speed up tokenization runtimes on local machines.'
        ],
        correctIndex: 1,
        explanation: 'Semantic memory persists long-term knowledge, facts, and user attributes across isolated sessions.'
      },
      {
        question: 'How does Episodic Memory assist autonomous agents with multi-step tasks?',
        options: [
          'By translating code into different languages.',
          'By storing logs of past tool actions and outcomes, allowing the agent to reuse successful strategies.',
          'By converting user audio clips into text strings.',
          'By automatically restarting crashed application servers.'
        ],
        correctIndex: 1,
        explanation: 'Episodic memory allows agents to recall past execution traces and learn from prior successes or failures.'
      }
    ],
    milestones: [
      'Distinguish between Short-Term, Semantic, and Episodic memory types.',
      'Implement sliding window context management strategies.',
      'Structure long-term factual extraction pipelines into vector persistence stores.',
      'Build a memory truncation utility in JavaScript.'
    ]
  },

  // MODULE 4: Systems Efficiency & Observability
  {
    id: 'aiin-07',
    order: 7,
    module: 'Systems Efficiency & Observability',
    icon: '⚡',
    title: 'Inference Acceleration & KV Caching',
    philosophy: 'Generating text with LLMs is computationally expensive because models generate tokens one at a time. During each step, recalculating key and value vectors for all previous tokens wastes huge amounts of processing power. KV Caching (Key-Value Caching) saves previously calculated vector states in memory so the GPU doesn\'t re-calculate them. Advanced techniques like PagedAttention and Speculative Decoding further double or triple inference speed.',
    concepts: [
      {
        title: '1. The Autoregressive Bottleneck & KV Caching',
        beginner: 'When writing word by word, an unoptimized AI recalculates the entire sentence from start to finish for every single new word. KV Caching acts like a memory scratchpad: it saves previous work so only the new word gets calculated.',
        advanced: 'Autoregressive generation generates tokens sequentially. Without caching, self-attention recalculates Key (K) and Value (V) tensors for all prior tokens at every generation step. KV Caching stores these tensors in memory, reducing compute complexity from O(N²) to O(N).'
      },
      {
        title: '2. Memory Fragmentation & PagedAttention',
        beginner: 'KV Caches consume a lot of GPU memory. Standard memory storage wastes space because of gaps. PagedAttention acts like a smartphone operating system, chopping memory into small virtual blocks to fit data tightly with zero waste.',
        advanced: 'KV Caches grow dynamically, leading to VRAM fragmentation and memory waste in standard allocations. PagedAttention (pioneered by vLLM) partitions KV caches into non-contiguous virtual memory blocks, maximizing memory utilization and enabling higher batch sizes.'
      },
      {
        title: '3. Speculative Decoding',
        beginner: 'Speculative Decoding uses a fast, small draft model to write ahead 5 words quickly, and then a large model checks them all in a single fast glance. If correct, all 5 words are accepted at once!',
        advanced: 'Speculative Decoding pairs a small draft model with a large target model. The draft model generates candidate tokens speculatively, and the large model evaluates all candidates simultaneously in a single parallel forward pass, boosting inference speed by 2x-3x without losing accuracy.'
      }
    ],
    practical: {
      title: 'KV Cache Memory Size Calculator',
      intro: 'Let\'s write an estimation utility to calculate KV cache memory footprint in MB. Formula: `(2 * seqLen * numLayers * hiddenDim * 2) / (1024 * 1024)`. (Multiplying by 2 for K and V, and by 2 for 16-bit float bytes).',
      steps: [
        'Multiply `2 * seqLen * numLayers * hiddenDim * 2`.',
        'Divide the result by `(1024 * 1024)` to convert bytes to Megabytes (MB).',
        'Assign the result to a variable named `cacheMB`.',
        'Return `cacheMB`.'
      ],
      goal: 'Calculate the VRAM footprint required by KV caching for a given sequence length.',
      starterCode: 'function calculateKVCacheMB(seqLen, numLayers, hiddenDim) {\n  // Write your code below this line\n  \n}',
      solutionCode: 'function calculateKVCacheMB(seqLen, numLayers, hiddenDim) {\n  const bytes = 2 * seqLen * numLayers * hiddenDim * 2;\n  const cacheMB = bytes / (1024 * 1024);\n  return cacheMB;\n}'
    },
    quiz: [
      {
        question: 'What is the main computational advantage of KV Caching during LLM generation?',
        options: [
          'It reduces the model weight file size on disk.',
          'It avoids recalculating Key and Value vectors for previous tokens during autoregressive generation steps.',
          'It automatically formats response text into HTML tags.',
          'It eliminates the need for GPUs entirely.'
        ],
        correctIndex: 1,
        explanation: 'KV Caching stores attention Key and Value matrices of processed tokens, preventing redundant matrix multiplications at each step.'
      },
      {
        question: 'How does Speculative Decoding increase LLM generation speed?',
        options: [
          'By skipping tokenization steps entirely.',
          'By using a small fast draft model to generate candidates and verifying them in parallel with the main model.',
          'By compressing input text before sending it to the API.',
          'By running inference on local browser CPU workers.'
        ],
        correctIndex: 1,
        explanation: 'A fast draft model proposes candidate tokens, which the large target model verifies in parallel in a single forward pass.'
      }
    ],
    milestones: [
      'Analyze the computational bottlenecks of autoregressive generation.',
      'Understand how KV Caching optimizes self-attention complexity.',
      'Explore virtual memory management techniques like PagedAttention.',
      'Implement a KV cache VRAM overhead estimator in JavaScript.'
    ]
  },
  {
    id: 'aiin-08',
    order: 8,
    module: 'Systems Efficiency & Observability',
    icon: '📊',
    title: 'LLM-as-a-Judge & Observability',
    philosophy: 'Traditional software testing relies on simple equality checks like `assert(x == y)`. But because LLM outputs are probabilistic natural language, traditional unit tests fail. Observability and automated evaluation solve this. We use "LLM-as-a-Judge"—using a powerful model to score generated answers against structured rubrics—and OpenTelemetry tracing to track latency, token costs, and prompt steps in production.',
    concepts: [
      {
        title: '1. The Non-Deterministic Evaluation Challenge',
        beginner: 'If you ask an AI to summarize an article, there are 1,000 different valid ways to write the summary. You cannot use exact string matching to grade it. You need dynamic evaluation tools.',
        advanced: 'Language model outputs are generative and non-deterministic. Standard code assertion tests fail because valid answers vary in phrasing and structure. Continuous quality evaluation requires automated probabilistic evaluation methods.'
      },
      {
        title: '2. LLM-as-a-Judge & Structured Rubrics',
        beginner: 'LLM-as-a-Judge uses an advanced model (like GPT-4) as a referee. You give the referee a strict score rubric (e.g. 1 to 5 for accuracy and clarity), and it outputs a score with an explanation.',
        advanced: 'LLM-as-a-Judge prompts a high-capacity model with explicit scoring rubrics, reference ground truths, and evaluation metrics (e.g., faithfulness, answer relevance, safety). Structuring outputs as JSON yields consistent quantitative quality metrics.'
      },
      {
        title: '3. Distributed Tracing & Metric Monitoring',
        beginner: 'Tracing is like having a black-box flight recorder for your AI app. It records every step: how long vector search took, how many tokens were used, and exact cost per user query.',
        advanced: 'AI observability frameworks capture distributed traces across chains, tool calls, and LLM API calls. Key monitored metrics include Time-To-First-Token (TTFT), tokens per second (TPS), latency per step, total token cost, and fallback events.'
      }
    ],
    practical: {
      title: 'Evaluation Score Metric Aggregator',
      intro: 'Let\'s write an evaluation metric parser. Given an array of LLM-as-a-Judge numerical score objects (e.g. `[{ score: 4 }, { score: 5 }]`), calculate and return the average evaluation score.',
      steps: [
        'If `scoresArray` is empty or length is `0`, return `0`.',
        'Sum all `score` values in `scoresArray`.',
        'Divide total sum by `scoresArray.length`.',
        'Return the average score number.'
      ],
      goal: 'Build an evaluation aggregator function to compute continuous quality scores.',
      starterCode: 'function computeAverageScore(scoresArray) {\n  // Write your code below this line\n  \n}',
      solutionCode: 'function computeAverageScore(scoresArray) {\n  if (!scoresArray || scoresArray.length === 0) {\n    return 0;\n  }\n  let sum = 0;\n  for (let i = 0; i < scoresArray.length; i++) {\n    sum += scoresArray[i].score;\n  }\n  return sum / scoresArray.length;\n}'
    },
    quiz: [
      {
        question: 'Why is traditional string-assertion unit testing inadequate for evaluating LLM outputs?',
        options: [
          'LLMs only output binary numbers.',
          'Generative responses vary in phrasing, rendering exact text match checks ineffective for measuring quality.',
          'LLM responses take too long to run inside standard test suites.',
          'Traditional tests cannot execute inside cloud environments.'
        ],
        correctIndex: 1,
        explanation: 'Generative outputs express correct information in diverse ways, requiring semantic or rubric-based evaluation rather than string equality checks.'
      },
      {
        question: 'What primary advantage does the LLM-as-a-Judge technique offer for production monitoring?',
        options: [
          'It reduces backend server power consumption by 50%.',
          'It uses structured rubrics and strong models to evaluate output faithfulness and accuracy at scale automatically.',
          'It replaces vector search databases entirely.',
          'It locks down user password databases.'
        ],
        correctIndex: 1,
        explanation: 'LLM-as-a-Judge automates quality evaluation by scoring generated text against predefined criteria using an objective evaluator model.'
      }
    ],
    milestones: [
      'Understand non-deterministic output testing challenges.',
      'Formulate evaluation rubrics for LLM-as-a-Judge scoring pipelines.',
      'Track observability metrics: TTFT, token costs, latency, and step traces.',
      'Implement an automated evaluation score aggregator in code.'
    ]
  }
];

export const getIntermediateAiLessonById = (id: string): AILesson | undefined => {
  return INTERMEDIATE_AI_LESSONS.find(l => l.id === id);
};

export const isIntermediateAiLessonUnlocked = (id: string, completedLessons: string[]): boolean => {
  const lesson = getIntermediateAiLessonById(id);
  if (!lesson) return false;
  if (lesson.order === 1) return true;

  const prevLesson = INTERMEDIATE_AI_LESSONS.find(l => l.order === lesson.order - 1);
  return prevLesson ? completedLessons.includes(prevLesson.id) : false;
};
