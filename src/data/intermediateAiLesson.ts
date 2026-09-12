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
{
  id: 'aiin-01',
  order: 1,
  module: 'Fine-Tuning & Adaptation',
  icon: '⚙️',
  title: 'PEFT, LoRA & QLoRA',
  philosophy: "Training a modern LLM from scratch requires millions of dollars and thousands of GPUs. Even fine-tuning all parameters of a 7-billion parameter model is out of reach for most developers. Parameter-Efficient Fine-Tuning (PEFT), and specifically LoRA (Low-Rank Adaptation), solves this. Instead of modifying all billions of weights, LoRA freezes the original model and injects tiny, lightweight adapter matrices. QLoRA takes this a step further by compressing the base model to 4-bit precision, letting you fine-tune massive models on a single consumer GPU.",
  concepts: [
    {
      title: '1. The Full Fine-Tuning Bottleneck',
      beginner: "Imagine trying to rewrite an entire encyclopedia just to add one new chapter. That is full fine-tuning. You have to update billions of parameters, which takes massive computer memory and time. Most developers simply cannot afford this.",
      advanced: "Full fine-tuning requires updating and storing gradients, optimizer states, and weights for every parameter in the network. For a 70B model at FP16 precision, this demands approximately 140GB of VRAM just for weights, plus 280GB for Adam optimizer states, plus gradient buffers. This makes it computationally prohibitive and prone to catastrophic forgetting of pre-trained knowledge."
    },
    {
      title: '2. Low-Rank Adaptation (LoRA) Mechanics',
      beginner: "Instead of rewriting the book, LoRA lets you clip sticky notes onto specific pages. The main book stays frozen, and you only write small notes (adapters). When reading, the model checks the book and your notes together. This means you only train a tiny fraction of parameters.",
      advanced: "LoRA freezes the pre-trained model weights and decomposes the weight update matrix ΔW into two smaller low-rank matrices A (d×r) and B (r×d), where rank r is typically 4-64. The forward pass becomes h = Wx + BAx. Since r << d, the trainable parameter count drops by over 99% while maintaining performance comparable to full fine-tuning."
    },
    {
      title: '3. Rank Selection and Target Modules',
      beginner: "The 'rank' is like the thickness of your sticky notes. A thin note (rank 4) saves memory but holds less information. A thick note (rank 64) holds more but costs more. You also choose which pages to stick notes on—usually the attention layers.",
      advanced: "Rank selection trades off expressiveness against parameter count. Higher ranks capture more complex adaptations but risk overfitting on small datasets. Target modules (q_proj, v_proj, k_proj, o_proj, gate_proj, up_proj, down_proj) determine which weight matrices receive adapters. Empirical research suggests targeting all linear layers with rank 16-32 yields optimal performance for most instruction-tuning tasks."
    },
    {
      title: '4. QLoRA: Quantized Base + Trainable Adapters',
      beginner: "QLoRA combines two tricks: it compresses the heavy frozen book into smaller print (4-bit quantization) and adds sticky notes (LoRA). Now you can train high-quality models on a single personal laptop GPU with only 24GB of memory.",
      advanced: "QLoRA quantizes the base model to 4-bit NormalFloat (NF4) while keeping LoRA adapter parameters in 16-bit precision. Double Quantization compresses the quantization constants themselves, and Paged Optimizers offload optimizer states to CPU RAM during memory spikes. This enables fine-tuning of 65B+ parameter models on a single 48GB GPU."
    },
    {
      title: '5. Adapter Merging and Serving',
      beginner: "After training, you can either keep the sticky notes separate (adapter serving) or glue them permanently into the book (merging). Merging makes the model faster at runtime because there are no extra notes to check.",
      advanced: "Post-training, LoRA adapters can be merged into base weights via W' = W + BA, eliminating inference overhead. Alternatively, adapters can be served separately using frameworks like vLLM or TGI, enabling hot-swapping multiple fine-tunes on a single base model without reloading weights. This is critical for multi-tenant serving architectures."
    },
    {
      title: '6. The PEFT Ecosystem: Beyond LoRA',
      beginner: "LoRA is the most popular trick, but there are others. Some methods freeze everything and only train a tiny new layer at the top. Others train special prompt tokens. Each method has its own sweet spot.",
      advanced: "The PEFT ecosystem includes Prefix Tuning (learning continuous prompt vectors), P-Tuning v2 (learnable soft prompts at every layer), Adapters (bottleneck layers inserted between transformer blocks), and IA3 (learned rescaling vectors). LoRA dominates due to its zero inference latency when merged and superior performance-to-parameter ratio."
    }
  ],
  practical: {
    title: 'LoRA Parameter Count & Memory Estimator',
    intro: "Let's build a comprehensive memory estimator function that calculates trainable parameters during LoRA fine-tuning and estimates total VRAM requirements. You will compute the adapter parameter count using the low-rank formula and estimate the memory footprint.",
    steps: [
      "Multiply the hidden dimension `d` by the rank `r` to get one matrix size.",
      "Multiply that result by `2` to account for both LoRA matrices (A and B).",
      "Multiply by `numTargetModules` to get total trainable parameters across all targeted layers.",
      "Assign that calculation to a variable named `trainableParams`.",
      "To estimate VRAM in GB, divide `trainableParams * 4` (for 32-bit gradients) by `1024 * 1024 * 1024` and assign to `vramGB`.",
      "Return an object with both `trainableParams` and `vramGB`."
    ],
    goal: "Calculate the exact number of trainable parameters and estimated VRAM for a LoRA fine-tuning configuration.",
    starterCode: `function estimateLoraMemory(d, r, numTargetModules) {
  // Write your code below this line
  
}`,
    solutionCode: `function estimateLoraMemory(d, r, numTargetModules) {
  const trainableParams = d * r * 2 * numTargetModules;
  const vramGB = (trainableParams * 4) / (1024 * 1024 * 1024);
  return { trainableParams, vramGB };
}`
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
      explanation: "LoRA keeps the original base model frozen and only updates small low-rank adapter matrices (A and B), drastically reducing trainable parameter count from billions to millions. Why others are wrong: It does not retrain all parameters, modify the tokenizer, or convert prompts to SQL."
    },
    {
      question: 'How does QLoRA achieve fine-tuning on consumer-grade hardware?',
      options: [
        'By deleting non-English words from training datasets.',
        'By quantizing the base model to 4-bit precision while keeping LoRA adapters trainable in 16-bit.',
        'By running training strictly inside standard web browsers.',
        'By converting all input strings to ASCII numbers.'
      ],
      correctIndex: 1,
      explanation: "QLoRA uses 4-bit NormalFloat (NF4) quantization for frozen base weights combined with 16-bit trainable LoRA adapters, reducing VRAM from 140GB+ to under 24GB. Why others are wrong: It does not modify datasets, run in browsers, or convert to ASCII."
    },
    {
      question: 'What happens to inference speed when LoRA adapters are merged into base weights?',
      options: [
        'Inference becomes significantly slower due to extra computation.',
        'Inference speed remains identical to the base model with zero overhead.',
        'Inference requires a separate adapter loading step every request.',
        'Inference quality drops by approximately 50%.'
      ],
      correctIndex: 1,
      explanation: "When merged via W' = W + BA, the adapter weights become part of the base model, eliminating any additional computation during inference. Why others are wrong: Merged adapters add zero overhead, require no separate loading, and maintain quality equivalent to full fine-tuning."
    },
    {
      question: 'What does the rank (r) parameter control in LoRA?',
      options: [
        'The learning rate of the optimizer.',
        'The expressiveness of the adaptation: higher rank captures more complex changes but uses more parameters.',
        'The number of training epochs.',
        'The maximum sequence length of the model.'
      ],
      correctIndex: 1,
      explanation: "Rank determines the dimensionality of the low-rank matrices. Higher rank allows more complex adaptations but increases parameter count and overfitting risk. Typical values range from 4 to 64. Why others are wrong: Rank does not control learning rate, epochs, or sequence length."
    },
    {
      question: 'Why is PEFT preferred over full fine-tuning for most production use cases?',
      options: [
        'PEFT models are always more accurate than fully fine-tuned models.',
        'PEFT reduces trainable parameters by 99%+, prevents catastrophic forgetting, and enables adapter hot-swapping.',
        'PEFT eliminates the need for training data entirely.',
        'PEFT only works with models smaller than 1 billion parameters.'
      ],
      correctIndex: 1,
      explanation: "PEFT dramatically reduces compute requirements, preserves base model knowledge, and allows multiple adapters on one base model. Why others are wrong: PEFT does not guarantee higher accuracy, still requires training data, and works with models of any size."
    }
  ],
  milestones: [
    'Analyze why full parameter fine-tuning is computationally prohibitive for large models.',
    'Deconstruct low-rank matrix decomposition mechanics (A × B) in LoRA.',
    'Understand rank selection trade-offs and target module strategies.',
    'Explain 4-bit NormalFloat quantization and Paged Optimizers in QLoRA.',
    'Differentiate adapter merging vs. separate adapter serving architectures.',
    'Implement a parameter calculator and memory estimator for LoRA configurations.'
  ]
},
{
  id: 'aiin-02',
  order: 2,
  module: 'Fine-Tuning & Adaptation',
  icon: '🎯',
  title: 'Alignment & Preference (SFT vs. DPO)',
  philosophy: "Raw base language models are just next-token guessers. If you ask a raw model 'How do I make a cake?', it might respond with another question like 'Where can I buy flour?' because it was trained on uncurated internet text. Alignment is the process of shaping raw models into helpful, honest, and harmless assistants. Supervised Fine-Tuning (SFT) teaches basic prompt-following, while preference optimization algorithms like DPO (Direct Preference Optimization) teach the model which responses humans actually prefer.",
  concepts: [
    {
      title: '1. The Raw Model Problem',
      beginner: "A raw language model has never been taught to be helpful. It just continues whatever text you give it. If you type a question, it might type another question. If you type a story beginning, it writes the next sentence. It needs training to become an assistant.",
      advanced: "Base models are trained on next-token prediction over uncurated corpora. They lack instruction-following capability, conversational structure, safety boundaries, and helpfulness optimization. Without alignment, base models exhibit completion behavior rather than assistant behavior."
    },
    {
      title: '2. Supervised Fine-Tuning (SFT)',
      beginner: "SFT is like teaching a child by showing examples. You give the AI a question paired with the exact ideal answer, repeated thousands of times, so it learns the format of being a helpful assistant.",
      advanced: "SFT trains a base model on high-quality instruction-response pairs using standard cross-entropy loss. It converts a raw document completion engine into an instruction-following model by adjusting probabilities toward curated target responses. Quality of SFT data matters more than quantity—10,000 high-quality examples often outperform 100,000 noisy ones."
    },
    {
      title: '3. RLHF: The Reward Model Pipeline',
      beginner: "RLHF is like giving a dog a treat when it behaves. A separate 'Reward Model' rates the AI's answers, and a reinforcement algorithm turns up the dials for answers that earned high treats. It works but is very complex to set up.",
      advanced: "RLHF involves training a separate reward model on human pairwise preferences (Chosen vs. Rejected responses), then using Proximal Policy Optimization (PPO) to adjust the LLM's policy. The reward model scores responses, and PPO optimizes the policy to maximize expected reward while staying close to the SFT model via KL divergence penalties."
    },
    {
      title: '4. Direct Preference Optimization (DPO)',
      beginner: "DPO simplifies RLHF. Instead of building a complex separate treat model, DPO directly compares good answers (Chosen) against bad answers (Rejected) using a simple mathematical trick. No separate reward model needed.",
      advanced: "DPO eliminates the separate reward model and reinforcement learning loop entirely. By mathematically re-parameterizing the reward function in terms of the policy itself, DPO optimizes directly on pairwise preference data using a simple classification loss. This makes training stable, reproducible, and computationally cheaper than PPO-based RLHF."
    },
    {
      title: '5. Preference Data Engineering',
      beginner: "The quality of alignment depends entirely on the quality of your comparison data. You need pairs where one answer is clearly better than the other. If both answers are similar, the model gets confused and learns nothing useful.",
      advanced: "Preference dataset quality is the primary bottleneck in alignment. Effective pairs require clear quality differentials across dimensions like accuracy, helpfulness, safety, and format compliance. Common sources include human annotation, AI-generated pairs with human filtering, and synthetic preference generation using stronger models as judges."
    },
    {
      title: '6. The Alignment Pipeline Sequence',
      beginner: "The full pipeline is a staircase: first SFT teaches the format, then DPO or RLHF teaches quality preferences, and finally safety training adds guardrails. Each step builds on the previous one.",
      advanced: "Production alignment pipelines follow: Pre-training → SFT (instruction format) → Preference Optimization (DPO/RLHF for quality) → Safety Fine-Tuning (refusal training, constitutional AI) → Red-teaming iteration. Each stage uses progressively smaller, higher-quality datasets with stricter curation."
    }
  ],
  practical: {
    title: 'Preference Data Pair Validator & Quality Scorer',
    intro: "Let's write a dataset validation function for preference tuning. For DPO or RLHF training, each record must contain a prompt, a chosen response, and a rejected response. Write a function that validates structure AND checks that chosen and rejected are different (not duplicates).",
    steps: [
      "Check if `item.prompt`, `item.chosen`, and `item.rejected` are defined and non-empty strings.",
      "If any field is missing or empty, return `'Invalid Pair'`.",
      "Check if `item.chosen` is exactly equal to `item.rejected`. If they are identical, return `'Duplicate Pair'`.",
      "If all checks pass, return `'Valid Pair'`."
    ],
    goal: "Validate preference dataset records before feeding them into alignment training pipelines.",
    starterCode: `function validatePreferencePair(item) {
  // Write your code below this line
  
}`,
    solutionCode: `function validatePreferencePair(item) {
  if (!item || !item.prompt || !item.chosen || !item.rejected) {
    return "Invalid Pair";
  }
  if (item.chosen === item.rejected) {
    return "Duplicate Pair";
  }
  return "Valid Pair";
}`
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
      explanation: "SFT uses curated instruction-response datasets to align raw text predictors into structured, conversational assistants. Why others are wrong: SFT does not compress models, connect to the internet, or convert databases. It teaches format and instruction-following behavior."
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
      explanation: "DPO simplifies alignment by directly optimizing policy probabilities using chosen vs. rejected pairs without requiring a separate reward model or RL setup. Why others are wrong: DPO still requires preference data, works on models of any size, and does not encrypt weights."
    },
    {
      question: 'What is the KL divergence penalty used for in RLHF?',
      options: [
        'To increase the creativity of model outputs.',
        'To prevent the policy from drifting too far from the SFT model, maintaining coherence while optimizing reward.',
        'To compress the reward model into fewer parameters.',
        'To automatically generate training data.'
      ],
      correctIndex: 1,
      explanation: "The KL penalty constrains the RL-optimized policy to stay close to the SFT reference model, preventing reward hacking and maintaining language quality. Why others are wrong: It does not increase creativity, compress models, or generate data."
    },
    {
      question: 'What makes a high-quality preference pair for DPO training?',
      options: [
        'Both chosen and rejected responses should be nearly identical.',
        'A clear quality differential between chosen and rejected across accuracy, helpfulness, and safety dimensions.',
        'The chosen response should always be longer than the rejected response.',
        'The prompt should be empty to test general behavior.'
      ],
      correctIndex: 1,
      explanation: "Effective preference pairs require clear, meaningful quality differences. If both responses are similar, the model cannot learn a useful preference signal. Why others are wrong: Identical pairs teach nothing, length is not a quality proxy, and empty prompts provide no instruction context."
    },
    {
      question: 'What is the correct sequence of a production alignment pipeline?',
      options: [
        'RLHF → SFT → Pre-training → Safety',
        'Pre-training → SFT → Preference Optimization → Safety Fine-Tuning',
        'Safety → Pre-training → SFT → RLHF',
        'SFT → Pre-training → Safety → DPO'
      ],
      correctIndex: 1,
      explanation: "The standard pipeline progresses from base capability (pre-training) to format (SFT) to quality (DPO/RLHF) to safety (refusal training). Why others are wrong: You cannot align before pre-training, and safety training comes after preference optimization, not before."
    }
  ],
  milestones: [
    'Differentiate raw text completion models from aligned instruction-following models.',
    'Analyze the structural steps and data requirements of Supervised Fine-Tuning (SFT).',
    'Compare traditional RLHF reward pipelines with Direct Preference Optimization (DPO).',
    'Understand preference data engineering and quality differential requirements.',
    'Map the full production alignment pipeline sequence.',
    'Build a preference dataset record validator function in code.'
  ]
},
{
  id: 'aiin-03',
  order: 3,
  module: 'Advanced RAG Architecture',
  icon: '🔍',
  title: 'Hybrid Search & Re-Ranking',
  philosophy: "Basic RAG relies exclusively on vector embeddings to find relevant documents. However, vector search has a weakness: it can struggle with exact keyword matches, serial numbers, specialized acronyms, or specific names. Hybrid Search fixes this by combining vector search (semantic meaning) with traditional keyword search (BM25). A Re-Ranker model then scores and rearranges the top results so the absolute best context enters the LLM prompt.",
  concepts: [
    {
      title: '1. The Vector-Only Retrieval Blind Spot',
      beginner: "If a user searches for part number 'ERR-404-X', a vector search might return general error documents because it looks for overall meaning. It misses the exact match. Vector search excels at concepts, but fails at exact terms.",
      advanced: "Dense vector embeddings represent semantic concepts in continuous space. However, they lack exact lexical precision, making them vulnerable to missing specific terms, rare entities, technical codes, or exact keyword matches. This is particularly problematic in enterprise search, legal discovery, and technical documentation retrieval."
    },
    {
      title: '2. BM25: The Keyword Scoring Algorithm',
      beginner: "BM25 is like a super-powered Ctrl+F. It looks for exact word matches and scores documents based on how many times your search terms appear, adjusted for how rare those words are across all documents.",
      advanced: "BM25 (Best Matching 25) is a probabilistic ranking function that scores documents based on term frequency (TF), inverse document frequency (IDF), and document length normalization. It excels at exact keyword matching, proper nouns, and technical terminology where semantic similarity is insufficient."
    },
    {
      title: '3. Hybrid Search: Combining Sparse and Dense Retrieval',
      beginner: "Hybrid search combines two search engines: a keyword search engine (like a librarian matching exact words) and a vector search engine (like a librarian understanding the topic). Combining their scores gives you the best of both worlds.",
      advanced: "Hybrid search merges sparse lexical retrieval (BM25 algorithm) with dense semantic retrieval (Vector Embeddings). Using Reciprocal Rank Fusion (RRF) or normalized score weighting, it produces a single composite ranking that captures both exact keywords and semantic context. This eliminates the blind spots of either approach alone."
    },
    {
      title: '4. Reciprocal Rank Fusion (RRF)',
      beginner: "RRF is a fair voting system. Instead of comparing raw scores (which use different scales), it looks at what position each document ranked in each search engine. Documents that rank highly in BOTH engines get the highest combined score.",
      advanced: "RRF computes a fusion score as Σ 1/(k + rank_i) across all retrieval systems, where k is a smoothing constant (typically 60). This rank-based approach is robust to score distribution differences between BM25 and vector similarity, requiring no score normalization or calibration."
    },
    {
      title: '5. Cross-Encoder Re-Ranking',
      beginner: "Search engines quickly pick the top 20 candidates. Then, a smaller, highly accurate AI model (a Re-Ranker) examines the question and candidates together to sort them in exact order of relevance before passing the top 3 to the main LLM.",
      advanced: "While Bi-Encoders produce static vectors for fast retrieval, Cross-Encoders pass the query and document together through a neural network to calculate an explicit relevance score. Applying a Re-Ranker step on initial search hits significantly improves context precision. Models like Cohere Rerank or bge-ranker achieve state-of-the-art relevance scoring."
    },
    {
      title: '6. The Retrieval Pipeline Architecture',
      beginner: "The full pipeline is a funnel: first, cast a wide net with hybrid search to get 50 candidates. Then, use a re-ranker to sort them precisely. Finally, take only the top 3-5 results and put them in the AI's prompt.",
      advanced: "Production retrieval pipelines follow: Query → Hybrid Retrieval (BM25 + Dense, top-50) → Cross-Encoder Re-Ranking (top-50 → top-5) → Context Assembly → LLM Generation. Each stage trades recall for precision, progressively narrowing candidates while increasing relevance quality."
    }
  ],
  practical: {
    title: 'Reciprocal Rank Fusion (RRF) Score Merger',
    intro: "Let's write an RRF algorithm to combine keyword rank and vector rank into a single hybrid score. The formula for RRF score for a document is: 1/(60 + vectorRank) + 1/(60 + keywordRank). Lower ranks (closer to 1) should produce higher scores.",
    steps: [
      "Calculate the vector rank component: `1 / (60 + vectorRank)`.",
      "Calculate the keyword rank component: `1 / (60 + keywordRank)`.",
      "Sum both components and assign to a variable named `rrfScore`.",
      "Return `rrfScore`.",
      "Verify: a document ranked #1 in both should score higher than one ranked #10 in both."
    ],
    goal: "Implement the standard Reciprocal Rank Fusion formula to merge multi-retrieval rankings.",
    starterCode: `function computeRRF(vectorRank, keywordRank) {
  // Write your code below this line
  
}`,
    solutionCode: `function computeRRF(vectorRank, keywordRank) {
  const rrfScore = (1 / (60 + vectorRank)) + (1 / (60 + keywordRank));
  return rrfScore;
}`
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
      explanation: "Dense embeddings map general semantic concepts well but frequently miss exact string matches, codes, or specific terminology. Why others are wrong: Vector DBs store millions of documents, work with text via embeddings, and operate offline."
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
      explanation: "Cross-Encoders analyze query and document text simultaneously in a single forward pass, providing high scoring accuracy for re-ranking. Why others are wrong: Bi-encoders use embeddings not regex, cross-encoders run on any hardware, and bi-encoders produce vectors not text."
    },
    {
      question: 'What problem does Reciprocal Rank Fusion (RRF) solve in hybrid search?',
      options: [
        'It encrypts search results for security.',
        'It merges rankings from different retrieval systems without requiring score normalization, using rank positions instead.',
        'It compresses documents to save storage space.',
        'It translates search queries into multiple languages.'
      ],
      correctIndex: 1,
      explanation: "RRF uses rank positions rather than raw scores, making it robust to the different score distributions of BM25 and vector similarity. Why others are wrong: It does not encrypt, compress, or translate."
    },
    {
      question: 'In a production retrieval pipeline, what is the correct order of operations?',
      options: [
        'Re-Ranking → Hybrid Retrieval → Context Assembly',
        'Hybrid Retrieval (top-50) → Cross-Encoder Re-Ranking (top-5) → Context Assembly → LLM Generation',
        'Context Assembly → Hybrid Retrieval → Re-Ranking',
        'LLM Generation → Retrieval → Re-Ranking'
      ],
      correctIndex: 1,
      explanation: "The pipeline progressively narrows candidates: broad retrieval first, then precise re-ranking, then context assembly for generation. Why others are wrong: Re-ranking requires candidates to rank, context assembly needs ranked results, and generation comes last."
    },
    {
      question: 'What is the primary advantage of BM25 over vector search for technical documentation?',
      options: [
        'BM25 understands semantic meaning better than vectors.',
        'BM25 excels at exact keyword matching for technical terms, error codes, and proper nouns.',
        'BM25 requires GPU acceleration for fast search.',
        'BM25 automatically translates documents into embeddings.'
      ],
      correctIndex: 1,
      explanation: "BM25's probabilistic term-frequency scoring is ideal for exact matches on technical terminology, part numbers, and specific identifiers. Why others are wrong: BM25 is lexical not semantic, runs on CPU, and does not produce embeddings."
    }
  ],
  milestones: [
    'Identify semantic and lexical retrieval trade-offs in search architectures.',
    'Understand BM25 probabilistic scoring mechanics.',
    'Combine BM25 sparse retrieval with dense vector similarity search.',
    'Implement Reciprocal Rank Fusion (RRF) scoring mechanisms.',
    'Design Cross-Encoder re-ranking pipelines for precision optimization.',
    'Build a complete retrieval funnel from broad recall to precise context assembly.'
  ]
},
{
  id: 'aiin-04',
  order: 4,
  module: 'Advanced RAG Architecture',
  icon: '🧩',
  title: 'Context Management & Hierarchical Chunking',
  philosophy: "How you slice documents determines whether your RAG app succeeds or fails. Slicing text into chunks that are too small loses surrounding context; slicing text into chunks that are too large dilutes specific details and overflows the prompt window. Advanced RAG uses Hierarchical Chunking (Parent-Child indexing) and Context Compression to retrieve small, exact text matches while passing rich, complete parent sections to the model.",
  concepts: [
    {
      title: '1. The Chunking Trade-off Paradox',
      beginner: "Think of cutting a textbook into snippets. Small snippets fit nicely into search, but miss the big picture. Huge chapters keep the big picture, but waste space and introduce noise into the AI prompt.",
      advanced: "Chunk size creates an architectural dilemma. Small chunks (50-100 tokens) yield precise vector embeddings but lose surrounding thematic context. Large chunks (1000+ tokens) retain contextual integrity but introduce irrelevant noise, dilute specific semantic signals during vector lookup, and consume excessive context window space."
    },
    {
      title: '2. Parent-Child Hierarchical Chunking',
      beginner: "Parent-Child chunking solves this: search against small 'child' snippets for high search accuracy, but when a match is found, send the larger 'parent' section to the AI so it has full context.",
      advanced: "Parent-Child indexing splits documents into small child chunks (e.g., 100 tokens) for high-precision vector retrieval, mapped to larger parent chunks (e.g., 1000 tokens). Upon retrieving a child match, the retriever passes the parent text into the LLM context window. This separates search granularity from generation context."
    },
    {
      title: '3. Semantic Chunking Strategies',
      beginner: "Instead of cutting text at fixed word counts (which can split sentences in half), smart chunking cuts at natural boundaries like paragraph breaks, section headers, or topic shifts. This keeps ideas whole.",
      advanced: "Semantic chunking uses techniques like sliding window overlap (50-100 token overlap between chunks), recursive character splitting (respecting paragraph → sentence → word boundaries), and embedding-based topic segmentation (splitting where cosine similarity between adjacent sentences drops below a threshold)."
    },
    {
      title: '4. Context Compression & Pruning',
      beginner: "Context compression is like taking a highlighter to a long document. Instead of sending full pages, a compression step strips out irrelevant sentences before handing text to the model, saving space and cost.",
      advanced: "Context compression analyzes retrieved chunks against the original query to filter out irrelevant sentences or summarize redundant text. Techniques include LLM-based extraction (prompting a small model to extract only relevant sentences), LongLLMLingua (perplexity-based pruning), and query-aware sentence filtering."
    },
    {
      title: '5. Metadata Enrichment & Filtering',
      beginner: "Every chunk should carry an ID card with information about where it came from: which document, which chapter, what date it was written. This lets you filter search results by source, date, or category before they reach the AI.",
      advanced: "Metadata enrichment attaches structured attributes (source document, section, page, author, date, category tags) to each chunk. At retrieval time, metadata filters enable scoped search (e.g., 'only search 2024 financial reports'), dramatically improving precision and enabling multi-tenant document isolation."
    },
    {
      title: '6. Multi-Granularity Retrieval',
      beginner: "Sometimes the answer is in one sentence. Sometimes you need a whole section. Multi-granularity retrieval searches at multiple levels simultaneously—sentence level, paragraph level, and section level—and combines the best matches from each.",
      advanced: "Multi-granularity retrieval indexes documents at multiple chunk sizes simultaneously (e.g., 64, 256, 1024 tokens). At query time, all granularities are searched in parallel, and results are fused using RRF or learned scoring. This ensures both precise sentence-level facts and broad contextual sections are available for generation."
    }
  ],
  practical: {
    title: 'Parent-Child Map Retriever with Fallback',
    intro: "Let's write a function that takes a child chunk ID and looks up its corresponding parent document chunk from a reference map object. If the parent exists, return it; otherwise, return the child text as fallback. Also validate that the parent text is non-empty.",
    steps: [
      "Look up `parentMap[childId]`.",
      "If found AND the value is a non-empty string, return `parentMap[childId]`.",
      "Otherwise, return the `fallbackChildText` parameter.",
      "Ensure the function handles cases where `parentMap` is null or undefined."
    ],
    goal: "Build a parent context retriever mechanism to replace small vector hits with rich parent sections.",
    starterCode: `function getParentContext(childId, fallbackChildText, parentMap) {
  // Write your code below this line
  
}`,
    solutionCode: `function getParentContext(childId, fallbackChildText, parentMap) {
  if (parentMap && parentMap[childId] && parentMap[childId].length > 0) {
    return parentMap[childId];
  }
  return fallbackChildText;
}`
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
      explanation: "Parent-Child chunking separates the search index (small child chunks for precision) from the generation context (larger parent blocks for completeness). Why others are wrong: It does not compress files, remove tokenizers, or encrypt data."
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
      explanation: "Context compression filters out unnecessary text from retrieved passages, keeping only sentences relevant to the user query. Why others are wrong: It does not convert to binary, generate captions, or change output casing."
    },
    {
      question: 'Why is fixed-size chunking (e.g., exactly 500 characters) problematic?',
      options: [
        'It uses too much database storage.',
        'It can split sentences, paragraphs, or ideas in half, creating semantically broken chunks.',
        'It requires GPU acceleration for processing.',
        'It only works with English text.'
      ],
      correctIndex: 1,
      explanation: "Fixed-size chunking ignores natural language boundaries, potentially splitting sentences or separating related ideas across chunks. Why others are wrong: Storage impact is minimal, no GPU is needed, and it works with any language."
    },
    {
      question: 'What benefit does metadata enrichment provide to a RAG system?',
      options: [
        'It increases the embedding dimension size.',
        'It enables scoped filtering by source, date, or category, improving retrieval precision.',
        'It automatically translates documents into multiple languages.',
        'It reduces the model parameter count.'
      ],
      correctIndex: 1,
      explanation: "Metadata filters allow retrieval to be scoped to specific document sources, time ranges, or categories, dramatically reducing irrelevant results. Why others are wrong: It does not affect embedding dimensions, translate text, or modify model parameters."
    },
    {
      question: 'In multi-granularity retrieval, why search at multiple chunk sizes simultaneously?',
      options: [
        'To reduce database storage requirements.',
        'To capture both precise sentence-level facts and broad contextual sections in a single query.',
        'To eliminate the need for vector embeddings.',
        'To speed up the tokenization process.'
      ],
      correctIndex: 1,
      explanation: "Different queries require different granularities—some need exact sentences, others need full sections. Multi-granularity ensures both are available. Why others are wrong: It increases storage, still uses embeddings, and does not affect tokenization speed."
    }
  ],
  milestones: [
    'Evaluate small vs. large chunk size impacts on vector precision and context quality.',
    'Design Parent-Child (Hierarchical) document indexing structures.',
    'Implement semantic chunking strategies respecting natural language boundaries.',
    'Apply context compression techniques to prune unneeded text.',
    'Engineer metadata enrichment for scoped retrieval filtering.',
    'Build a contextual parent look-up function with fallback handling.'
  ]
},
{
  id: 'aiin-05',
  order: 5,
  module: 'Production Agents & Workflow Orchestration',
  icon: '🌿',
  title: 'Multi-Agent State Graphs',
  philosophy: "Single agents struggle when assigned huge, multi-step tasks. Asking one agent to research, code, test, and write documentation leads to confusion and errors. Modern production systems use Multi-Agent State Graphs. By breaking complex jobs down into specialized agents (e.g., Researcher, Coder, Reviewer) and connecting them through a central State graph with explicit conditional rules, tasks are handled cleanly with higher reliability.",
  concepts: [
    {
      title: '1. The Single-Agent Generalist Failure',
      beginner: "Imagine one person trying to be the chef, waiter, accountant, and manager of a busy restaurant. Mistakes happen fast. Single AI agents get overwhelmed when given too many tools and instructions at once.",
      advanced: "Single agents suffer performance degradation as prompt length and tool definitions expand. Attempting to force one agent to handle planning, execution, verification, and formatting increases hallucination rates, tool invocation errors, and context window overflow. Cognitive load theory applies to LLMs: focused prompts outperform overloaded ones."
    },
    {
      title: '2. State Graphs: Nodes, Edges, and Shared State',
      beginner: "A state graph is like a digital assembly line. Each station (node) has one clear job. Data (the state) passes down the line, and control rules (edges) decide which station gets the work next.",
      advanced: "State graphs structure agent coordination as a directed graph where nodes represent specific agent actions or function executions, and edges define state transitions with conditional routing logic. A shared central state object persists data across nodes, enabling information flow without redundant re-computation."
    },
    {
      title: '3. Supervisor & Specialized Agent Pattern',
      beginner: "In a supervisor setup, a 'Manager Agent' inspects work and hands off tasks to 'Specialist Agents' (like a Research Agent or Code Writer). When a specialist finishes, control returns to the manager for the next decision.",
      advanced: "The supervisor pattern uses an orchestration agent to route control dynamically based on current graph state. The supervisor evaluates outputs from specialist nodes and decides whether to transition to another specialist, loop back for refinement, or terminate execution with a final answer."
    },
    {
      title: '4. Conditional Routing & Dynamic Edges',
      beginner: "Not every task follows the same path. If the code passes tests, go to documentation. If it fails, go back to the coder. Conditional edges are like railroad switches that direct the train based on what just happened.",
      advanced: "Dynamic edges evaluate state conditions at runtime to determine the next node. Common patterns include: success/failure branching, retry loops with attempt counters, parallel fan-out for independent subtasks, and convergence nodes that aggregate results from parallel branches."
    },
    {
      title: '5. Human-in-the-Loop Breakpoints',
      beginner: "Sometimes the AI needs permission before doing something risky, like sending an email or deleting a file. A breakpoint pauses the workflow and asks a human to approve or reject before continuing.",
      advanced: "Human-in-the-loop breakpoints are graph nodes that suspend execution and present the current state to a human operator for approval. Upon approval, execution resumes; upon rejection, the graph routes to an alternative path or terminates. This is essential for high-stakes operations requiring human oversight."
    },
    {
      title: '6. Error Recovery & Fallback Paths',
      beginner: "What happens when a tool crashes or an API times out? Good state graphs have backup plans. If the primary path fails, the graph automatically routes to a fallback node that tries a different approach or gracefully reports the error.",
      advanced: "Production state graphs implement error recovery via try/catch wrappers around node executions, with fallback edges routing to alternative tools, degraded responses, or graceful error messages. Retry policies with exponential backoff handle transient failures, while circuit breakers prevent cascading failures across the graph."
    }
  ],
  practical: {
    title: 'Multi-Agent Router Node with Validation',
    intro: "Let's build a router function for a multi-agent system. Given a current state object with `nextStep`, `isComplete`, and `error` fields, route to 'FINISH' if complete, to 'ERROR_HANDLER' if an error exists, or return the target agent node name.",
    steps: [
      "Check if `state.isComplete` is `true`. If so, return `'FINISH'`.",
      "Check if `state.error` is defined and non-empty. If so, return `'ERROR_HANDLER'`.",
      "Otherwise, return `state.nextStep`.",
      "Handle the case where `state` is null or undefined by returning `'ERROR_HANDLER'`."
    ],
    goal: "Create a deterministic routing edge for state graph execution with error handling.",
    starterCode: `function routeState(state) {
  // Write your code below this line
  
}`,
    solutionCode: `function routeState(state) {
  if (!state) {
    return "ERROR_HANDLER";
  }
  if (state.isComplete) {
    return "FINISH";
  }
  if (state.error) {
    return "ERROR_HANDLER";
  }
  return state.nextStep;
}`
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
      explanation: "Partitioning tasks into specialized agents keeps individual contexts small and focused, improving execution quality and reducing hallucination. Why others are wrong: Single agents do consume tokens, multi-agent still needs APIs, and single agents can parse JSON."
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
      explanation: "The shared State object acts as the central memory store updated and passed through graph nodes during the workflow. Why others are wrong: It does not store CSS, delete data, or encrypt browsing history."
    },
    {
      question: 'What is the purpose of conditional edges in a state graph?',
      options: [
        'To encrypt data between nodes.',
        'To dynamically route execution to different nodes based on runtime state conditions.',
        'To compress the state object for faster transfer.',
        'To limit the number of nodes in the graph.'
      ],
      correctIndex: 1,
      explanation: "Conditional edges evaluate state at runtime and route to appropriate next nodes, enabling branching logic, retry loops, and error handling. Why others are wrong: They do not encrypt, compress, or limit nodes."
    },
    {
      question: 'When should a Human-in-the-Loop breakpoint be inserted into an agent workflow?',
      options: [
        'Before every single node execution, regardless of risk.',
        'Before high-stakes operations like sending emails, making payments, or deleting data.',
        'Only at the very end of the workflow.',
        'Never, because humans slow down the system.'
      ],
      correctIndex: 1,
      explanation: "Human breakpoints are reserved for high-risk operations where errors have significant consequences. Why others are wrong: Adding breakpoints everywhere defeats automation, end-only misses mid-workflow risks, and never using them is unsafe for critical operations."
    },
    {
      question: 'What happens when a node execution fails in a well-designed state graph?',
      options: [
        'The entire graph terminates immediately with no recovery.',
        'The error is caught and execution routes to a fallback path or retry mechanism.',
        'The graph restarts from the very beginning.',
        'The error is ignored and execution continues to the next node.'
      ],
      correctIndex: 1,
      explanation: "Production state graphs implement error recovery with fallback edges, retry policies, and graceful degradation. Why others are wrong: Immediate termination is brittle, full restart wastes computation, and ignoring errors produces incorrect results."
    }
  ],
  milestones: [
    'Analyze performance limits of single generalist agent architectures.',
    'Map state graph components: Nodes, Edges, and Shared State.',
    'Design Supervisor-Specialist multi-agent orchestration patterns.',
    'Implement conditional routing with error handling and fallback paths.',
    'Insert Human-in-the-Loop breakpoints for high-stakes operations.',
    'Build a conditional router function for state graph edges.'
  ]
},
{
  id: 'aiin-06',
  order: 6,
  module: 'Production Agents & Workflow Orchestration',
  icon: '💾',
  title: 'Agent Memory Systems',
  philosophy: "By default, LLMs are completely stateless—they forget everything the moment a conversation ends. Building useful long-term agents requires engineering dedicated Memory Systems. These range from Short-Term Memory (sliding message windows) to Long-Term Semantic Memory (storing user preferences and facts in vector databases) and Episodic Memory (remembering past task executions to avoid repeating past mistakes).",
  concepts: [
    {
      title: '1. Short-Term Memory & Context Truncation',
      beginner: "Short-term memory is like a whiteboard. As new chat messages arrive, old messages get erased from the top so the whiteboard never overflows. The AI only remembers the most recent conversation.",
      advanced: "Short-term memory manages active conversation state using sliding message windows, token trimming, or sliding summaries. It maintains immediate context while preventing execution crashes caused by context window limits. Strategies include fixed-window truncation, token-budget trimming, and recursive summarization of older messages."
    },
    {
      title: '2. Semantic Memory: User Facts & Preferences',
      beginner: "Semantic memory is like an agent's personal notebook about you. If you mention 'I live in Chicago and prefer Python', it saves those facts to remember in future conversations months later.",
      advanced: "Semantic memory extracts key facts, user preferences, and domain knowledge from conversations and saves them as vector embeddings or graph triplets. At query time, relevant facts are retrieved into the system context. This enables personalization across sessions without re-prompting."
    },
    {
      title: '3. Episodic Memory: Past Execution Traces',
      beginner: "Episodic memory is like learning from past experience. If an agent tried a tool command yesterday and it failed, it checks its past memories so it doesn't make the same mistake twice.",
      advanced: "Episodic memory logs past agent action-observation sequences and outcomes. When facing new tasks, the agent queries past execution episodes to replicate successful strategies and bypass previously encountered errors. This is analogous to human experiential learning."
    },
    {
      title: '4. Memory Extraction Pipelines',
      beginner: "How does the AI decide what to remember? After each conversation, a small extraction model scans the chat and pulls out important facts, decisions, and preferences. Only these key points get saved to long-term storage.",
      advanced: "Memory extraction uses dedicated LLM calls with structured extraction prompts to identify and categorize memorable information (facts, preferences, decisions, action items). Extracted items are embedded and stored in vector databases with metadata tags for future retrieval."
    },
    {
      title: '5. Memory Retrieval & Injection Strategies',
      beginner: "When a new conversation starts, the agent searches its memory bank for anything relevant to the current topic. It then injects those memories into the system prompt so it can reference them naturally.",
      advanced: "Memory retrieval uses semantic similarity search against the stored memory vectors, filtered by recency, relevance score thresholds, and category tags. Retrieved memories are injected into the system prompt or a dedicated memory section, ranked by relevance to the current query."
    },
    {
      title: '6. Memory Decay & Consolidation',
      beginner: "Just like human memory, AI memory should fade over time for unimportant details. Old, rarely-accessed memories get compressed or deleted, while frequently-used memories get strengthened. This keeps the memory bank clean and relevant.",
      advanced: "Memory decay implements time-based or access-based forgetting curves, reducing storage bloat and retrieval noise. Consolidation merges related memories into summaries, similar to how human memory consolidates during sleep. This prevents memory databases from growing unboundedly in long-running agents."
    }
  ],
  practical: {
    title: 'Sliding Window Memory Truncator with Token Budget',
    intro: "Let's write a short-term memory trimmer. Given an array of message objects (each with a `content` string) and a maximum message limit, return only the most recent messages that fit within the limit. If the array is shorter than the limit, return it unchanged.",
    steps: [
      "If `messages.length` is less than or equal to `maxMessages`, return `messages` unchanged.",
      "Otherwise, slice and return the last `maxMessages` elements using `.slice(-maxMessages)`.",
      "Return the sliced array.",
      "Verify: passing 10 messages with maxMessages=3 should return only the last 3."
    ],
    goal: "Implement a sliding-window buffer for short-term conversation context management.",
    starterCode: `function truncateMemory(messages, maxMessages) {
  // Write your code below this line
  
}`,
    solutionCode: `function truncateMemory(messages, maxMessages) {
  if (messages.length <= maxMessages) {
    return messages;
  }
  return messages.slice(-maxMessages);
}`
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
      explanation: "Semantic memory persists long-term knowledge, facts, and user attributes across isolated sessions, enabling personalization. Why others are wrong: It does not measure server memory, clear cookies, or affect tokenization speed."
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
      explanation: "Episodic memory allows agents to recall past execution traces and learn from prior successes or failures. Why others are wrong: It does not translate code, convert audio, or restart servers."
    },
    {
      question: 'What triggers memory extraction in a typical agent memory pipeline?',
      options: [
        'The user manually clicking a "save memory" button.',
        'A dedicated extraction model scans conversations after each interaction to identify memorable facts.',
        'The database automatically saves every single message verbatim.',
        'Memory extraction only happens once per year.'
      ],
      correctIndex: 1,
      explanation: "Memory extraction is typically automated via LLM calls that identify and categorize important information from conversations. Why others are wrong: It is not manual, does not save everything verbatim, and happens frequently, not annually."
    },
    {
      question: 'Why is memory decay (forgetting) important in long-running agent systems?',
      options: [
        'It makes the AI more creative by removing constraints.',
        'It prevents unbounded memory growth, reduces retrieval noise, and keeps the memory bank relevant.',
        'It encrypts old memories for security.',
        'It speeds up the model inference process.'
      ],
      correctIndex: 1,
      explanation: "Without decay, memory databases grow infinitely, retrieval quality degrades, and storage costs escalate. Decay maintains a focused, relevant memory bank. Why others are wrong: It does not increase creativity, encrypt data, or affect inference speed."
    },
    {
      question: 'What is the primary difference between Short-Term and Long-Term memory in agent architectures?',
      options: [
        'Short-term uses GPUs, long-term uses CPUs.',
        'Short-term is volatile conversation context; long-term is persistent storage in databases that survives across sessions.',
        'Short-term stores images, long-term stores text.',
        'There is no architectural difference.'
      ],
      correctIndex: 1,
      explanation: "Short-term memory is the active context window (volatile, session-scoped). Long-term memory persists in external databases (vector stores, knowledge graphs) and survives across sessions. Why others are wrong: The distinction is architectural, not hardware-based or format-based."
    }
  ],
  milestones: [
    'Distinguish between Short-Term, Semantic, and Episodic memory types.',
    'Implement sliding window context management strategies.',
    'Design memory extraction pipelines for fact and preference capture.',
    'Structure long-term factual retrieval and injection into agent prompts.',
    'Apply memory decay and consolidation for long-running systems.',
    'Build a memory truncation utility in JavaScript.'
  ]
},

  {
  id: 'aiin-07',
  order: 7,
  module: 'Systems Efficiency & Observability',
  icon: '⚡',
  title: 'Inference Acceleration & KV Caching',
  philosophy: "Generating text with LLMs is computationally expensive because models generate tokens one at a time. During each step, recalculating key and value vectors for all previous tokens wastes huge amounts of processing power. KV Caching (Key-Value Caching) saves previously calculated vector states in memory so the GPU doesn't re-calculate them. Advanced techniques like PagedAttention and Speculative Decoding further double or triple inference speed, turning sluggish APIs into real-time applications.",
  concepts: [
    {
      title: '1. The Autoregressive Bottleneck & KV Caching',
      beginner: "When writing word by word, an unoptimized AI recalculates the entire sentence from start to finish for every single new word. KV Caching acts like a memory scratchpad: it saves previous work so only the new word gets calculated.",
      advanced: "Autoregressive generation generates tokens sequentially. Without caching, self-attention recalculates Key (K) and Value (V) tensors for all prior tokens at every generation step. KV Caching stores these tensors in memory, reducing compute complexity from O(N²) to O(N) per step."
    },
    {
      title: '2. Memory Fragmentation & PagedAttention',
      beginner: "KV Caches consume a lot of GPU memory. Standard memory storage wastes space because of gaps. PagedAttention acts like a smartphone operating system, chopping memory into small virtual blocks to fit data tightly with zero waste.",
      advanced: "KV Caches grow dynamically, leading to VRAM fragmentation and memory waste in standard allocations. PagedAttention (pioneered by vLLM) partitions KV caches into non-contiguous virtual memory blocks, maximizing memory utilization and enabling much higher batch sizes."
    },
    {
      title: '3. Speculative Decoding',
      beginner: "Speculative Decoding uses a fast, small draft model to write ahead 5 words quickly, and then a large model checks them all in a single fast glance. If correct, all 5 words are accepted at once!",
      advanced: "Speculative Decoding pairs a small draft model with a large target model. The draft model generates candidate tokens speculatively, and the large model evaluates all candidates simultaneously in a single parallel forward pass, boosting inference speed by 2x-3x without losing accuracy."
    },
    {
      title: '4. Continuous Batching (In-Flight Batching)',
      beginner: "Old systems wait for a whole group of users to finish their sentences before starting the next group. Continuous batching lets the system swap out finished users and swap in new users instantly, keeping the AI's brain 100% busy at all times.",
      advanced: "Static batching pads sequences to the maximum length in the batch, wasting compute on padding tokens. Continuous batching (or iteration-level scheduling) allows requests to be added or removed from the batch at every single decoding step, maximizing GPU throughput and minimizing queue latency."
    },
    {
      title: '5. Quantized KV Caches',
      beginner: "Just like we compress the main AI model to save space, we can also compress the scratchpad (KV Cache). By shrinking the numbers in the cache, we can fit twice as many user conversations into the same graphics card.",
      advanced: "Storing KV caches in FP16 consumes massive VRAM for long contexts. Quantizing the KV cache to INT8 or FP8 drastically reduces the memory footprint. While this introduces slight precision loss, modern quantization algorithms maintain high perplexity scores while enabling 100k+ context windows on consumer hardware."
    }
  ],
  practical: {
    title: 'KV Cache Memory Size Calculator',
    intro: "Let's write an estimation utility to calculate KV cache memory footprint in MB. Formula: `(2 * seqLen * numLayers * hiddenDim * 2) / (1024 * 1024)`. (Multiplying by 2 for K and V, and by 2 for 16-bit float bytes).",
    steps: [
      "Multiply `2 * seqLen * numLayers * hiddenDim * 2`.",
      "Divide the result by `(1024 * 1024)` to convert bytes to Megabytes (MB).",
      "Assign the result to a variable named `cacheMB`.",
      "Return `cacheMB`."
    ],
    goal: "Calculate the VRAM footprint required by KV caching for a given sequence length.",
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
      explanation: "KV Caching stores attention Key and Value matrices of processed tokens, preventing redundant matrix multiplications at each step. Why others are wrong: It does not reduce disk size, format HTML, or eliminate GPUs."
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
      explanation: "A fast draft model proposes candidate tokens, which the large target model verifies in parallel in a single forward pass. Why others are wrong: It does not skip tokenization, compress input, or use browser CPUs."
    },
    {
      question: 'What problem does PagedAttention solve in LLM serving?',
      options: [
        'It prevents the model from hallucinating facts.',
        'It eliminates VRAM fragmentation by allocating KV caches in non-contiguous virtual memory blocks.',
        'It translates prompts into multiple languages automatically.',
        'It encrypts the user data in transit.'
      ],
      correctIndex: 1,
      explanation: "PagedAttention partitions KV caches into blocks like an OS virtual memory manager, eliminating internal fragmentation and wasted VRAM. Why others are wrong: It does not affect hallucinations, translation, or network encryption."
    },
    {
      question: 'Why is Continuous Batching preferred over Static Batching in production APIs?',
      options: [
        'It allows requests to be added or removed at every decoding step, maximizing GPU utilization without waiting for the slowest request.',
        'It forces all users to share the exact same system prompt.',
        'It reduces the physical size of the server rack.',
        'It converts text outputs into audio waves.'
      ],
      correctIndex: 0,
      explanation: "Continuous batching avoids padding and idle GPU time by swapping finished sequences out and new sequences in at the token level. Why others are wrong: It does not force shared prompts, shrink hardware, or generate audio."
    },
    {
      question: 'What is the primary trade-off of quantizing the KV Cache to INT8?',
      options: [
        'It increases the generation speed but requires more VRAM.',
        'It drastically reduces VRAM usage at the cost of a slight precision loss in attention scores.',
        'It deletes the system prompt to save space.',
        'It forces the model to only output numbers.'
      ],
      correctIndex: 1,
      explanation: "Quantizing the KV cache halves or quarters the memory footprint, enabling longer contexts, but introduces minor quantization noise to the attention weights. Why others are wrong: It reduces VRAM (not increases), does not delete prompts, and does not restrict output types."
    }
  ],
  milestones: [
    'Analyze the computational bottlenecks of autoregressive generation.',
    'Understand how KV Caching optimizes self-attention complexity.',
    'Explore virtual memory management techniques like PagedAttention.',
    'Differentiate between Static and Continuous batching strategies.',
    'Implement a KV cache VRAM overhead estimator in code.'
  ]
},
{
  id: 'aiin-08',
  order: 8,
  module: 'Systems Efficiency & Observability',
  icon: '📊',
  title: 'LLM-as-a-Judge & Observability',
  philosophy: "Traditional software testing relies on simple equality checks like `assert(x == y)`. But because LLM outputs are probabilistic natural language, traditional unit tests fail. Observability and automated evaluation solve this. We use 'LLM-as-a-Judge'—using a powerful model to score generated answers against structured rubrics—and OpenTelemetry tracing to track latency, token costs, and prompt steps in production.",
  concepts: [
    {
      title: '1. The Non-Deterministic Evaluation Challenge',
      beginner: "If you ask an AI to summarize an article, there are 1,000 different valid ways to write the summary. You cannot use exact string matching to grade it. You need dynamic evaluation tools.",
      advanced: "Language model outputs are generative and non-deterministic. Standard code assertion tests fail because valid answers vary in phrasing and structure. Continuous quality evaluation requires automated probabilistic evaluation methods."
    },
    {
      title: '2. LLM-as-a-Judge & Structured Rubrics',
      beginner: "LLM-as-a-Judge uses an advanced model (like GPT-4) as a referee. You give the referee a strict score rubric (e.g. 1 to 5 for accuracy and clarity), and it outputs a score with an explanation.",
      advanced: "LLM-as-a-Judge prompts a high-capacity model with explicit scoring rubrics, reference ground truths, and evaluation metrics (e.g., faithfulness, answer relevance, safety). Structuring outputs as JSON yields consistent quantitative quality metrics."
    },
    {
      title: '3. RAGAS & RAG Evaluation Metrics',
      beginner: "How do you know if your RAG system is working? RAGAS is a framework that checks three things: Did it find the right documents? Did it use them? Did it answer the question correctly?",
      advanced: "The RAGAS framework decomposes RAG evaluation into Context Precision (relevance of retrieved docs), Context Recall (coverage of ground truth), Faithfulness (absence of hallucination), and Answer Relevance. This isolates failure domains between the vector DB and the LLM."
    },
    {
      title: '4. Distributed Tracing & OpenTelemetry',
      beginner: "Tracing is like having a black-box flight recorder for your AI app. It records every step: how long vector search took, how many tokens were used, and exact cost per user query.",
      advanced: "AI observability frameworks capture distributed traces across chains, tool calls, and LLM API calls using OpenTelemetry. Key monitored metrics include Time-To-First-Token (TTFT), tokens per second (TPS), latency per step, and total token cost."
    },
    {
      title: '5. Human-in-the-Loop Fallbacks',
      beginner: "AI judges are great, but they aren't perfect. For high-stakes decisions (like medical or legal advice), the system should flag low-confidence answers and route them to a human expert for final review.",
      advanced: "Production pipelines implement confidence thresholds. If the LLM-as-a-Judge score falls below a critical boundary, or if the model's internal logprobs indicate high uncertainty, the trace is routed to a human-in-the-loop (HITL) queue for manual annotation and correction."
    }
  ],
  practical: {
    title: 'Evaluation Score Metric Aggregator',
    intro: "Let's write an evaluation metric parser. Given an array of LLM-as-a-Judge numerical score objects (e.g. `[{ score: 4 }, { score: 5 }]`), calculate and return the average evaluation score.",
    steps: [
      "If `scoresArray` is empty or length is `0`, return `0`.",
      "Sum all `score` values in `scoresArray`.",
      "Divide total sum by `scoresArray.length`.",
      "Return the average score number."
    ],
    goal: "Build an evaluation aggregator function to compute continuous quality scores.",
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
      explanation: "Generative outputs express correct information in diverse ways, requiring semantic or rubric-based evaluation rather than string equality checks. Why others are wrong: LLMs output text, latency is managed by async tests, and cloud execution is fully supported."
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
      explanation: "LLM-as-a-Judge automates quality evaluation by scoring generated text against predefined criteria using an objective evaluator model. Why others are wrong: It does not reduce power consumption, replace vector DBs, or manage passwords."
    },
    {
      question: 'In the RAGAS framework, what does "Faithfulness" measure?',
      options: [
        'How fast the vector database retrieves documents.',
        'Whether the generated answer is strictly derived from the retrieved context without hallucinating external facts.',
        'The total cost of the API tokens used.',
        'The number of spelling errors in the output.'
      ],
      correctIndex: 1,
      explanation: "Faithfulness verifies that every claim in the generated answer can be traced back to the provided context chunks, ensuring zero hallucination. Why others are wrong: It does not measure retrieval speed, cost, or spelling."
    },
    {
      question: 'What does TTFT stand for in LLM observability metrics?',
      options: [
        'Total Tokens For Training.',
        'Time-To-First-Token, measuring the latency before the model begins streaming its response.',
        'Text Translation Format Type.',
        'Temporary Thread Fault Tolerance.'
      ],
      correctIndex: 1,
      explanation: "TTFT (Time-To-First-Token) is a critical user-experience metric that measures the prefill latency and system responsiveness. Why others are wrong: It is not related to training, translation formats, or thread faults."
    },
    {
      question: 'When should a system route an AI trace to a Human-in-the-Loop (HITL) queue?',
      options: [
        'Only when the server crashes.',
        'When the LLM-as-a-Judge confidence score falls below a critical safety or accuracy threshold.',
        'Every single time a user asks a question.',
        'When the user types in all capital letters.'
      ],
      correctIndex: 1,
      explanation: "HITL is used as a fallback for high-stakes or low-confidence outputs where automated evaluation cannot guarantee safety or correctness. Why others are wrong: It is not for server crashes, every query (too expensive), or capital letters."
    }
  ],
  milestones: [
    'Understand non-deterministic output testing challenges.',
    'Formulate evaluation rubrics for LLM-as-a-Judge scoring pipelines.',
    'Deconstruct RAG evaluation metrics (Faithfulness, Context Precision).',
    'Track observability metrics: TTFT, token costs, latency, and step traces.',
    'Implement an automated evaluation score aggregator in code.'
  ]
},
{
  id: 'aiin-09',
  order: 9,
  module: 'Fine-Tuning & Adaptation',
  icon: '🧬',
  title: 'Dataset Engineering for Fine-Tuning',
  philosophy: "A fine-tuned model is only as good as the data it learns from. Garbage in, garbage out. Dataset engineering is the meticulous process of curating, cleaning, and formatting instruction pairs. It involves deduplication, preventing data contamination, and using synthetic data generation to create high-quality, diverse training sets that teach the model exactly how to behave without overfitting to narrow patterns.",
  concepts: [
    {
      title: '1. Data Quality vs. Quantity',
      beginner: "You don't need a million examples to teach an AI. A few thousand perfectly written, highly diverse examples will create a much smarter model than a million messy, repetitive ones.",
      advanced: "Modern SFT (Supervised Fine-Tuning) relies on high-quality, low-quantity datasets (e.g., LIMA hypothesis). Curated datasets with high semantic diversity and strict formatting prevent mode collapse and overfitting, yielding better generalization than massive, noisy web-scraped corpora."
    },
    {
      title: '2. Instruction Formatting (Alpaca & ShareGPT)',
      beginner: "AI models need data in a specific layout to understand who is talking. Formats like Alpaca use strict 'Instruction, Input, Output' blocks, while ShareGPT formats look like a multi-turn chat history.",
      advanced: "Standardized formatting templates (like ChatML, Alpaca, or ShareGPT) structure the training data into distinct role boundaries (System/User/Assistant). This teaches the model conversational turn-taking and ensures the loss function only calculates gradients on the Assistant's response tokens."
    },
    {
      title: '3. Data Contamination & Leakage',
      beginner: "If your test questions accidentally end up in your training data, the AI will just memorize the answers and look smarter than it really is. You must strictly separate training data from evaluation data.",
      advanced: "Data contamination occurs when evaluation benchmarks (like MMLU or HumanEval) leak into the pre-training or fine-tuning corpora. This invalidates benchmark scores. Engineers use n-gram overlap detection and strict dataset versioning to ensure zero leakage between train and test splits."
    },
    {
      title: '4. Synthetic Data & Evol-Instruct',
      beginner: "Sometimes humans are too slow to write training data. We can use a super-smart AI to write thousands of complex, tricky questions, and then use another AI to write the perfect answers. This is called synthetic data.",
      advanced: "Techniques like Evol-Instruct use a strong LLM to iteratively rewrite seed prompts into more complex, multi-step, or constrained variations. This synthetic data generation dramatically increases the reasoning depth and instruction-following capabilities of the fine-tuning dataset without manual human annotation."
    },
    {
      title: '5. Deduplication & Curation',
      beginner: "If your dataset has the exact same question asked 50 times, the AI will obsess over it and forget other topics. You must scan your data and delete duplicates to keep the AI's learning balanced.",
      advanced: "Semantic deduplication uses embedding cosine similarity to identify and remove near-duplicate training examples. This prevents the model from over-indexing on specific phrasing or topics, ensuring a uniform distribution of knowledge across the target domain."
    }
  ],
  practical: {
    title: 'JSONL Record Validator & Sanitizer',
    intro: "Fine-tuning datasets are usually stored in JSONL (JSON Lines) format. Let's write a function that validates a single record to ensure it has the required `instruction` and `output` fields, and that neither is empty.",
    steps: [
      "Check if `record.instruction` exists and is a string with length > 0.",
      "Check if `record.output` exists and is a string with length > 0.",
      "If both conditions are true, return `true`.",
      "Otherwise, return `false`."
    ],
    goal: "Build a validation gate to filter out malformed records before fine-tuning.",
    starterCode: 'function validateSFTRecord(record) {\n  // Write your code below this line\n  \n}',
    solutionCode: 'function validateSFTRecord(record) {\n  if (record && typeof record.instruction === "string" && record.instruction.length > 0 && typeof record.output === "string" && record.output.length > 0) {\n    return true;\n  }\n  return false;\n}'
  },
  quiz: [
    {
      question: 'Why is a small, highly curated dataset often preferred over a massive, noisy dataset for SFT?',
      options: [
        'Small datasets download faster from the internet.',
        'High-quality diverse data prevents mode collapse and overfitting, teaching robust instruction-following without memorizing noise.',
        'Massive datasets cause the GPU to overheat.',
        'Small datasets automatically encrypt the model weights.'
      ],
      correctIndex: 1,
      explanation: "The LIMA hypothesis demonstrates that high-quality, diverse data yields better generalization and alignment than massive noisy corpora. Why others are wrong: It is not about download speed, GPU heat, or encryption."
    },
    {
      question: 'What is "Data Contamination" in the context of LLM evaluation?',
      options: [
        'When the server gets a virus.',
        'When evaluation benchmark questions accidentally leak into the training data, artificially inflating test scores.',
        'When the model outputs toxic or biased language.',
        'When the JSON file is corrupted on the hard drive.'
      ],
      correctIndex: 1,
      explanation: "Contamination invalidates benchmarks because the model memorizes the test answers rather than generalizing. Why others are wrong: It is not a virus, toxic output (that is safety), or file corruption."
    },
    {
      question: 'What is the purpose of "Evol-Instruct" in dataset engineering?',
      options: [
        'To delete old model checkpoints.',
        'To use a strong LLM to iteratively rewrite seed prompts into more complex, multi-step synthetic training examples.',
        'To translate the dataset into French.',
        'To compress the dataset into a ZIP file.'
      ],
      correctIndex: 1,
      explanation: "Evol-Instruct generates synthetic data with higher reasoning complexity, improving the model's ability to handle difficult, constrained prompts. Why others are wrong: It does not delete checkpoints, translate, or compress files."
    },
    {
      question: 'During SFT training, which tokens should the loss function calculate gradients for?',
      options: [
        'All tokens in the prompt and the response.',
        'Only the tokens in the Assistant\'s response (masking the User/System prompt tokens).',
        'Only the punctuation marks.',
        'Only the first 10 tokens of the sequence.'
      ],
      correctIndex: 1,
      explanation: "Prompt masking ensures the model is only penalized/rewarded for the text it generates (the Assistant's response), not for repeating the user's question. Why others are wrong: Calculating loss on the prompt wastes compute and teaches the model to predict the user."
    },
    {
      question: 'Why is semantic deduplication critical before fine-tuning?',
      options: [
        'It prevents the model from over-indexing on specific phrasing and ensures a uniform distribution of knowledge.',
        'It makes the text print in bold fonts.',
        'It converts all numbers into words.',
        'It automatically fixes spelling mistakes.'
      ],
      correctIndex: 0,
      explanation: "Removing near-duplicates prevents the model from memorizing repetitive patterns and neglecting rare concepts. Why others are wrong: It does not affect font styling, number conversion, or spell-checking."
    }
  ],
  milestones: [
    'Understand the LIMA hypothesis: Quality and diversity over sheer quantity.',
    'Structure training data using standardized templates (ChatML, Alpaca).',
    'Identify and prevent data contamination and benchmark leakage.',
    'Leverage synthetic data generation (Evol-Instruct) to scale reasoning depth.',
    'Implement validation gates to filter malformed JSONL records.'
  ]
},
{
  id: 'aiin-10',
  order: 10,
  module: 'Advanced RAG Architecture',
  icon: '🔄',
  title: 'Query Transformation & Decomposition',
  philosophy: "Users are terrible at writing good search queries. They ask vague, multi-part, or conceptually misaligned questions. Naive RAG simply embeds the user's raw text and searches. Advanced RAG intercepts the query and transforms it—rewriting it for better keyword matching, generating hypothetical answers, or breaking complex questions into smaller sub-questions before hitting the vector database.",
  concepts: [
    {
      title: '1. The Query-Retrieval Mismatch',
      beginner: "If a user asks 'How do I fix the slow thing?', a vector search won't find the manual for 'Database Index Optimization'. The user's intent and the document's vocabulary don't match. We must translate the query first.",
      advanced: "Semantic asymmetry occurs when the user's query formulation differs lexically and structurally from the target document chunks. Query transformation bridges this gap by aligning the query embedding space with the document embedding space before retrieval."
    },
    {
      title: '2. HyDE (Hypothetical Document Embeddings)',
      beginner: "HyDE is a trick where the AI first writes a 'fake' perfect answer to the user's question. Then, we search the database using the fake answer instead of the short question. The fake answer matches the real documents much better!",
      advanced: "HyDE prompts the LLM to generate a hypothetical, potentially hallucinated answer to the query. This generated document is then embedded and used for vector similarity search. Because the hypothetical document shares structural and lexical properties with the actual corpus, retrieval recall improves significantly."
    },
    {
      title: '3. Step-Back Prompting',
      beginner: "Sometimes a question is too specific. Step-back prompting asks the AI to first generate a broader, high-level question about the underlying concepts, searches for that, and then uses the broad context to answer the specific question.",
      advanced: "Step-Back Prompting mitigates retrieval failures on highly specific or niche queries by prompting the LLM to abstract the query into a broader, more generalizable concept. Retrieving high-level principles often provides the necessary foundational context to reason about the specific edge case."
    },
    {
      title: '4. Sub-Question Decomposition (Multi-Hop)',
      beginner: "If a user asks 'Who was the director of the movie that won Best Picture in 2020?', the database might not have that exact sentence. The AI splits it: 1. What movie won Best Picture in 2020? 2. Who directed that movie?",
      advanced: "Query Decomposition breaks complex, multi-hop queries into independent, atomic sub-questions. Each sub-question is retrieved separately, and the aggregated context is passed to the LLM for final synthesis. This is essential for Knowledge Graph traversal and complex relational reasoning."
    },
    {
      title: '5. Query Rewriting & Expansion',
      beginner: "The AI can act as a translator, taking the user's short query and adding synonyms, acronyms, and related terms to make sure the search engine catches every possible matching document.",
      advanced: "Query Expansion uses the LLM to generate multiple diverse rephrasings of the original query, or to append domain-specific synonyms and acronyms. These multiple query vectors are executed in parallel, and their results are fused using Reciprocal Rank Fusion (RRF) to maximize recall."
    }
  ],
  practical: {
    title: 'Sub-Question Array Splitter',
    intro: "Let's build a basic query decomposition router. Given a string containing multiple questions separated by a pipe character `|` (e.g., `"What is RAG? | How does it work?"`), split them into a clean array and trim whitespace.",
    steps: [
      "Use the `.split('|')` method on the `rawQuery` string.",
      "Use the `.map()` function to iterate over the resulting array.",
      "Inside the map, use `.trim()` to remove leading and trailing whitespace from each sub-question.",
      "Return the final cleaned array."
    ],
    goal: "Parse a multi-hop query string into an array of atomic sub-questions for parallel retrieval.",
    starterCode: 'function decomposeQuery(rawQuery) {\n  // Write your code below this line\n  \n}',
    solutionCode: 'function decomposeQuery(rawQuery) {\n  const subQuestions = rawQuery.split("|").map(q => q.trim());\n  return subQuestions;\n}'
  },
  quiz: [
    {
      question: 'What problem does HyDE (Hypothetical Document Embeddings) solve in RAG?',
      options: [
        'It reduces the cost of API tokens.',
        'It bridges the semantic asymmetry between short user queries and long, detailed document chunks by embedding a generated hypothetical answer.',
        'It encrypts the database for security.',
        'It automatically deletes irrelevant documents.'
      ],
      correctIndex: 1,
      explanation: "HyDE generates a document that structurally resembles the target corpus, making vector similarity search much more accurate than searching with a short, abstract query. Why others are wrong: It does not reduce costs, encrypt data, or delete documents."
    },
    {
      question: 'When is Sub-Question Decomposition most useful?',
      options: [
        'When the user asks a simple greeting like "Hello".',
        'When dealing with complex, multi-hop queries that require gathering facts from multiple distinct documents to synthesize an answer.',
        'When the database is completely empty.',
        'When the model needs to generate an image.'
      ],
      correctIndex: 1,
      explanation: "Decomposition breaks down compound questions into atomic facts that can be retrieved independently, enabling multi-hop reasoning. Why others are wrong: It is unnecessary for greetings, useless on empty DBs, and unrelated to image generation."
    },
    {
      question: 'What is the core mechanism of Step-Back Prompting?',
      options: [
        'Asking the model to output the text backwards.',
        'Abstracting a highly specific query into a broader, high-level concept to retrieve foundational principles before answering the specific edge case.',
        'Deleting the last word of the user\'s prompt.',
        'Routing the query to a smaller, faster model.'
      ],
      correctIndex: 1,
      explanation: "Step-back prompting retrieves general rules and concepts, which often contain the necessary context to deduce the answer to a highly specific, niche question. Why others are wrong: It does not reverse text, delete words, or route to smaller models."
    },
    {
      question: 'How does Query Expansion improve retrieval recall?',
      options: [
        'By generating multiple diverse rephrasings and synonyms of the query, executing them in parallel, and fusing the results.',
        'By forcing the user to type at least 500 words.',
        'By converting the query into an audio file.',
        'By ignoring the user\'s query entirely and guessing.'
      ],
      correctIndex: 0,
      explanation: "Expansion covers lexical and semantic blind spots by searching for the query from multiple angles, catching documents that might not match the exact original phrasing. Why others are wrong: It does not force user input length, use audio, or ignore the query."
    },
    {
      question: 'Why might a naive RAG system fail on the query "How do I fix the slow thing?"',
      options: [
        'Because the system is turned off.',
        'Because of semantic asymmetry: the query lacks the specific technical vocabulary (e.g., "Database Index Optimization") present in the target documents.',
        'Because the query is in French.',
        'Because the vector database only stores images.'
      ],
      correctIndex: 1,
      explanation: "Naive RAG relies on exact semantic alignment. Vague queries fail to match specific technical documentation without query transformation or rewriting. Why others are wrong: It is not a power issue, language issue, or modality issue."
    }
  ],
  milestones: [
    'Identify semantic asymmetry and the query-retrieval mismatch.',
    'Implement HyDE to align query embeddings with document corpus structure.',
    'Apply Step-Back prompting for abstract conceptual retrieval.',
    'Decompose multi-hop queries into atomic sub-questions.',
    'Build a query parsing and splitting utility for parallel execution.'
  ]
},
{
  id: 'aiin-11',
  order: 11,
  module: 'Advanced RAG Architecture',
  icon: '🕸️',
  title: 'Agentic RAG & Graph RAG',
  philosophy: "Standard RAG is a one-shot process: search, read, answer. But what if the search fails? What if the answer requires connecting dots across different departments? Agentic RAG gives the system a brain to evaluate its own search results and decide to search again. Graph RAG replaces flat vector databases with Knowledge Graphs, mapping explicit relationships between entities to solve complex, multi-hop reasoning tasks that flat text chunks simply cannot handle.",
  concepts: [
    {
      title: '1. The Limits of Naive RAG',
      beginner: "Standard RAG searches once and hopes for the best. If the top 3 documents don't have the answer, the AI just hallucinates. It doesn't know how to say 'I need to look deeper' or 'I need to search a different database'.",
      advanced: "Naive RAG pipelines are static and feed-forward. They lack self-reflection, query adaptation, and multi-step routing. If the initial retrieval misses the semantic mark, the generation phase is forced to hallucinate or refuse, resulting in brittle production systems."
    },
    {
      title: '2. Self-Reflective RAG (Agentic Routing)',
      beginner: "Agentic RAG adds a 'Grader' AI. After searching, the Grader reads the documents and asks: 'Are these actually relevant?' If the answer is no, the Agent rewrites the search query and tries again automatically.",
      advanced: "Self-Reflective RAG (e.g., CRAG, Self-RAG) introduces an evaluation node that scores retrieved documents for relevance and correctness. If the score falls below a threshold, the agent dynamically triggers a fallback route: rewriting the query, querying an external web search API, or escalating to a human."
    },
    {
      title: '3. Knowledge Graphs (Nodes & Edges)',
      beginner: "A vector database is like a pile of loose notes. A Knowledge Graph is like a mind-map. It stores 'Entities' (like Steve Jobs, Apple, iPhone) and explicitly draws lines ('Edges') between them, like 'Steve Jobs -> founded -> Apple'.",
      advanced: "Knowledge Graphs (KGs) structure data as triplets (Subject, Predicate, Object). Unlike vector embeddings which capture implicit semantic proximity, KGs capture explicit, deterministic relational logic. This enables precise multi-hop traversal and complex analytical queries that vector similarity cannot resolve."
    },
    {
      title: '4. GraphRAG & Community Summaries',
      beginner: "GraphRAG takes a massive text library, automatically extracts a mind-map of all the people, places, and concepts, and groups them into 'communities'. When you ask a broad question, it summarizes the community instead of searching for random text chunks.",
      advanced: "Microsoft's GraphRAG pipeline uses LLMs to extract entity graphs from raw text, applies the Leiden algorithm to detect hierarchical community clusters, and generates summaries for each cluster. This allows the system to answer global, dataset-wide thematic questions that local vector retrieval completely misses."
    },
    {
      title: '5. Multi-Modal RAG (Tables & Images)',
      beginner: "Real documents aren't just text. They have charts, tables, and pictures. Advanced RAG uses special tools to read PDF tables into spreadsheets, and uses Vision AI to describe images, adding all of this to the search index.",
      advanced: "Multi-Modal RAG extends the ingestion pipeline to parse structured data (tables via Camelot/Unstructured) and visual data (images via Vision-Language Models). Tables are often converted to Markdown or HTML for LLM comprehension, while images are embedded using multi-modal embedding models (like CLIP) for cross-modal retrieval."
    }
  ],
  practical: {
    title: 'Graph Edge Traversal Router',
    intro: "Let's simulate a basic Knowledge Graph traversal. Given a `graph` object mapping nodes to their connections, and a `startNode`, return an array of all directly connected neighbor nodes. If the node doesn't exist, return an empty array.",
    steps: [
      "Check if `graph[startNode]` exists.",
      "If it does, return the array stored at `graph[startNode]`.",
      "If it does not exist, return an empty array `[]`."
    ],
    goal: "Implement a basic 1-hop neighbor traversal function for a graph data structure.",
    starterCode: 'function getNeighbors(graph, startNode) {\n  // Write your code below this line\n  \n}',
    solutionCode: 'function getNeighbors(graph, startNode) {\n  if (graph[startNode]) {\n    return graph[startNode];\n  }\n  return [];\n}'
  },
  quiz: [
    {
      question: 'What is the primary advantage of Self-Reflective RAG over Naive RAG?',
      options: [
        'It uses less electricity.',
        'It evaluates the relevance of retrieved documents and can dynamically rewrite queries or trigger fallback searches if the context is poor.',
        'It automatically translates the output into Spanish.',
        'It deletes the vector database after every query.'
      ],
      correctIndex: 1,
      explanation: "Self-Reflective RAG introduces a grading loop that prevents the LLM from generating answers based on irrelevant or hallucinated context. Why others are wrong: It does not affect power, translation, or delete the DB."
    },
    {
      question: 'How does a Knowledge Graph differ fundamentally from a Vector Database?',
      options: [
        'Knowledge Graphs only store images.',
        'Knowledge Graphs capture explicit, deterministic relational logic (Subject-Predicate-Object), while Vector DBs capture implicit semantic proximity.',
        'Vector Databases are physically larger on the hard drive.',
        'Knowledge Graphs cannot be searched.'
      ],
      correctIndex: 1,
      explanation: "KGs map exact relationships (edges) between entities (nodes), enabling precise multi-hop reasoning, whereas Vector DBs rely on mathematical distance between text embeddings. Why others are wrong: KGs store text/entities, physical size is irrelevant, and KGs are highly searchable."
    },
    {
      question: 'What problem does Microsoft\'s GraphRAG solve that standard chunking cannot?',
      options: [
        'It answers global, dataset-wide thematic questions by summarizing hierarchical community clusters of entities.',
        'It makes the text print faster on the screen.',
        'It prevents the user from typing numbers.',
        'It automatically formats the output as a PDF.'
      ],
      correctIndex: 0,
      explanation: "Standard RAG fails at global summarization because it only retrieves local chunks. GraphRAG builds community summaries, allowing it to answer broad questions like 'What are the main themes in this 10,000-page corpus?'. Why others are wrong: It does not affect print speed, restrict numbers, or format PDFs."
    },
    {
      question: 'In Multi-Modal RAG, how are complex PDF tables typically handled for LLM consumption?',
      options: [
        'They are deleted to save space.',
        'They are parsed into structured formats like Markdown or HTML, which LLMs can read and reason over.',
        'They are converted into audio files.',
        'They are encrypted with a password.'
      ],
      correctIndex: 1,
      explanation: "LLMs understand structured text representations of tables (like Markdown grids or HTML tags) much better than raw pixel data or flattened text. Why others are wrong: They are not deleted, converted to audio, or encrypted."
    },
    {
      question: 'What triggers an Agentic RAG system to perform a "Query Rewrite"?',
      beginner: 'When the user types too fast.',
      advanced: 'When the internal Grader node determines that the initially retrieved documents have a low relevance score for the original query.',
      options: [
        'When the user types too fast.',
        'When the internal Grader node determines that the initially retrieved documents have a low relevance score.',
        'When the server runs out of RAM.',
        'When the API key expires.'
      ],
      correctIndex: 1,
      explanation: "The Grader acts as a quality gate. If retrieval fails to find relevant context, the agent rewrites the query to improve semantic alignment on the next pass. Why others are wrong: It is not triggered by typing speed, RAM limits, or API keys."
    }
  ],
  milestones: [
    'Identify the failure modes of static, feed-forward Naive RAG.',
    'Architect Self-Reflective RAG pipelines with grading and fallback routing.',
    'Understand Knowledge Graph structures (Nodes, Edges, Triplets).',
    'Leverage GraphRAG community summaries for global dataset reasoning.',
    'Implement basic graph traversal logic for multi-hop entity resolution.'
  ]
},
{
  id: 'aiin-12',
  order: 12,
  module: 'Production Agents & Workflow Orchestration',
  icon: '🛠️',
  title: 'Tool Design & Error Recovery',
  philosophy: "Giving an AI tools is dangerous. If a tool is poorly described, the AI will use it wrong. If an API fails, the AI might crash or loop infinitely. Professional agent engineering requires strict JSON Schema design for tools, graceful degradation when APIs timeout, exponential backoff for retries, and human-in-the-loop breakpoints for destructive actions. You must build cages for your agents.",
  concepts: [
    {
      title: '1. Schema Engineering (Tool Descriptions)',
      beginner: "An AI doesn't know what your tools do unless you write a perfect instruction manual for each one. You must describe exactly what the tool does, what inputs it needs, and what errors it might throw.",
      advanced: "Tool calling relies on strict JSON Schema definitions injected into the system prompt. High-quality schemas include explicit parameter descriptions, enum constraints, required fields, and edge-case warnings. Poor schema engineering is the #1 cause of agent tool-invocation hallucinations."
    },
    {
      title: '2. Graceful Degradation & Fallbacks',
      beginner: "If the AI tries to use a weather tool and the weather server is down, the AI shouldn't just crash. It should catch the error, tell the user 'The weather service is offline', and try to answer using its general knowledge instead.",
      advanced: "Production agents must implement try/catch wrappers around tool executions. If a tool throws a 500 error or timeout, the agent catches the exception, injects the error message back into the context, and allows the LLM to dynamically route to a fallback tool or generate a degraded, apologetic response."
    },
    {
      title: '3. Retry Mechanisms & Exponential Backoff',
      beginner: "Sometimes an API fails just because the internet hiccuped. Instead of giving up immediately, the agent should wait 1 second and try again. If it fails, wait 2 seconds, then 4 seconds. This is called exponential backoff.",
      advanced: "Transient network failures and rate limits (HTTP 429) require automated retry policies. Exponential backoff with jitter prevents thundering herd problems when multiple agent instances retry simultaneously against a throttled third-party API."
    },
    {
      title: '4. Human-in-the-Loop Breakpoints',
      beginner: "If an AI agent is about to delete a database or send an email to 10,000 customers, it should pause. A breakpoint stops the code and sends a notification to a human, who must click 'Approve' before the action happens.",
      advanced: "High-stakes tool executions require interrupt-driven state persistence. The agent graph halts at a designated breakpoint node, serializes the state to a database, and awaits an external webhook or human approval signal before resuming the execution thread."
    },
    {
      title: '5. Tool Abuse & Security Sandboxing',
      beginner: "If you give an AI a tool to 'run Python code', a hacker might trick it into running code that deletes your files. Tools must be locked in sandboxes—safe, isolated rooms where the AI can't touch the real computer.",
      advanced: "Code execution and file-system tools must run in ephemeral, sandboxed environments (like Docker containers or gVisor) with strict network egress rules and zero access to host environment variables. This neutralizes arbitrary code execution (ACE) vulnerabilities triggered by adversarial prompt injection."
    }
  ],
  practical: {
    title: 'Exponential Backoff Delay Calculator',
    intro: "Let's write a utility function for retry logic. Given an `attemptNumber` (starting at 1) and a `baseDelay` in milliseconds, calculate the exponential backoff delay. Formula: `baseDelay * (2 ^ (attemptNumber - 1))`.",
    steps: [
      "Calculate the exponent: `attemptNumber - 1`.",
      "Raise 2 to the power of that exponent using `Math.pow(2, exponent)`.",
      "Multiply the result by `baseDelay`.",
      "Return the final delay number."
    ],
    goal: "Implement the mathematical foundation for exponential backoff retry policies.",
    starterCode: 'function calculateBackoff(attemptNumber, baseDelay) {\n  // Write your code below this line\n  \n}',
    solutionCode: 'function calculateBackoff(attemptNumber, baseDelay) {\n  const exponent = attemptNumber - 1;\n  const multiplier = Math.pow(2, exponent);\n  return baseDelay * multiplier;\n}'
  },
  quiz: [
    {
      question: 'Why is Schema Engineering critical for LLM tool calling?',
      options: [
        'It makes the UI look better.',
        'It provides the LLM with explicit JSON constraints, parameter descriptions, and edge-case warnings, preventing invocation hallucinations.',
        'It encrypts the API keys.',
        'It speeds up the internet connection.'
      ],
      correctIndex: 1,
      explanation: "The LLM relies entirely on the schema description to understand when and how to use a tool. Vague schemas lead to malformed arguments and infinite loops. Why others are wrong: It does not affect UI, encryption, or network speed."
    },
    {
      question: 'What is the purpose of Exponential Backoff with Jitter in agent retries?',
      options: [
        'To make the AI write poetry.',
        'To prevent thundering herd problems by spacing out retry attempts progressively and randomly when facing rate limits or transient errors.',
        'To delete the database.',
        'To compress the log files.'
      ],
      correctIndex: 1,
      explanation: "Exponential backoff prevents overwhelming a failing server, while jitter ensures multiple agents don't retry at the exact same millisecond. Why others are wrong: It is not for poetry, deletion, or compression."
    },
    {
      question: 'How should an agent handle a 500 Internal Server Error from a third-party tool?',
      options: [
        'Crash the entire application immediately.',
        'Catch the exception, inject the error message into the context, and allow the LLM to route to a fallback tool or generate a degraded response.',
        'Ignore the error and pretend the tool worked.',
        'Restart the user\'s computer.'
      ],
      correctIndex: 1,
      explanation: "Graceful degradation ensures the agent remains functional and transparent about failures, rather than crashing or hallucinating success. Why others are wrong: Crashing is brittle, ignoring is dangerous, and restarting hardware is impossible."
    },
    {
      question: 'When is a Human-in-the-Loop (HITL) breakpoint strictly required?',
      options: [
        'Before every single text generation.',
        'Before high-stakes, irreversible actions like deleting records, sending mass emails, or executing financial transactions.',
        'Only when the user asks for a joke.',
        'When the model is generating a list of numbers.'
      ],
      correctIndex: 1,
      explanation: "HITL breakpoints are reserved for destructive or high-risk operations where an AI hallucination could cause severe real-world damage. Why others are wrong: It is not needed for standard text, jokes, or safe math."
    },
    {
      question: 'Why must code-execution tools run in ephemeral sandboxes (like Docker)?',
      options: [
        'To make the code run faster.',
        'To neutralize Arbitrary Code Execution (ACE) vulnerabilities and prevent adversarial prompts from accessing host files or environment variables.',
        'To change the color of the terminal.',
        'To automatically translate the code into Java.'
      ],
      correctIndex: 1,
      explanation: "Sandboxing isolates the execution environment, ensuring that if an attacker tricks the AI into running malicious code, it cannot escape the container to harm the host system. Why others are wrong: It does not increase speed, change colors, or transpile languages."
    }
  ],
  milestones: [
    'Design strict JSON Schemas for reliable LLM tool invocation.',
    'Implement graceful degradation and fallback routing for API failures.',
    'Calculate exponential backoff delays to handle rate limits safely.',
    'Architect Human-in-the-Loop breakpoints for destructive actions.',
    'Enforce security sandboxing for code-execution and file-system tools.'
  ]
},
{
  id: 'aiin-13',
  order: 13,
  module: 'Systems Efficiency & Observability',
  icon: '💰',
  title: 'Caching, Batching & Cost Optimization',
  philosophy: "In production, AI APIs are incredibly expensive and latency-sensitive. If 1,000 users ask the exact same question, you shouldn't pay the API 1,000 times. By implementing Semantic Caching, Prefix Caching, and intelligent Model Routing, engineers can slash API bills by 80% and cut response times in half, turning a bleeding startup into a profitable enterprise.",
  concepts: [
    {
      title: '1. Semantic Caching',
      beginner: "If User A asks 'How do I reset my password?' and User B asks 'How can I change my login code?', the meaning is identical. Semantic caching saves the first answer in a vector database. When User B asks, the system sees the meanings match and instantly returns the saved answer for free.",
      advanced: "Semantic caching embeds incoming user prompts and performs a fast vector similarity search against a cache database (like Redis with vector modules). If the cosine similarity exceeds a strict threshold (e.g., 0.95), the system bypasses the LLM entirely and returns the cached generation, slashing latency and cost."
    },
    {
      title: '2. Prompt Caching (Prefix Caching)',
      beginner: "If every user gets the same giant 2,000-word system instruction manual at the start of their chat, the AI has to read it every single time. Prompt caching tells the server: 'Keep this manual in your short-term memory so you don't have to re-read it for every user.'",
      advanced: "Prefix Caching (offered by providers like Anthropic and OpenAI) identifies shared token prefixes across multiple requests. The provider caches the KV states of the system prompt, eliminating the prefill compute cost for subsequent requests and drastically reducing Time-To-First-Token (TTFT)."
    },
    {
      title: '3. Semantic Routing (Small vs Large Models)',
      beginner: "You don't need a $1000 supercomputer to answer 'What is 2+2?'. Smart systems use a tiny, cheap AI to read the question first. If it's easy, it routes it to a cheap, fast model. If it's hard, it routes it to the expensive super-model.",
      advanced: "Semantic Routing uses a lightweight classifier or a small LLM (like Llama-3-8B) to analyze query complexity and intent. It dynamically routes simple queries to cheap, low-latency models (like Haiku or GPT-4o-mini) and complex reasoning tasks to heavy models (like Opus or o1), optimizing the cost-to-quality ratio."
    },
    {
      title: '4. Streaming & TTFT Optimization',
      beginner: "Users hate staring at a blank screen waiting for a long answer. Streaming sends the answer back one word at a time as it's generated. The user starts reading immediately, making the app feel incredibly fast even if the AI is thinking hard.",
      advanced: "Server-Sent Events (SSE) enable token streaming. By optimizing the prefill phase (via Prompt Caching or chunked prefill), engineers minimize Time-To-First-Token (TTFT). This perceived latency reduction is critical for user retention in conversational interfaces."
    },
    {
      title: '5. Output Length Constraints',
      beginner: "Sometimes an AI rambles and writes 5 pages when you only asked for a summary. Since you pay by the word, this wastes money. Setting strict 'Max Tokens' limits forces the AI to be concise and protects your wallet.",
      advanced: "Enforcing strict `max_tokens` parameters and utilizing stop sequences prevents runaway generation loops and unbounded billing costs. In agentic workflows, output constraints also ensure that tool-calling JSON payloads remain compact and parseable."
    }
  ],
  practical: {
    title: 'Semantic Cache Threshold Checker',
    intro: "Let's write a cache-routing gate. Given a `similarityScore` (between 0 and 1) and a `cacheThreshold` (e.g., 0.95), return `"HIT"` if the score meets or exceeds the threshold, otherwise return `"MISS"`.",
    steps: [
      "Check if `similarityScore` is greater than or equal to `cacheThreshold`.",
      "If true, return the string `\"HIT\"`.",
      "Otherwise, return the string `\"MISS\"`."
    ],
    goal: "Implement the routing logic for a semantic vector cache.",
    starterCode: 'function checkCache(similarityScore, cacheThreshold) {\n  // Write your code below this line\n  \n}',
    solutionCode: 'function checkCache(similarityScore, cacheThreshold) {\n  if (similarityScore >= cacheThreshold) {\n    return "HIT";\n  }\n  return "MISS";\n}'
  },
  quiz: [
    {
      question: 'How does Semantic Caching reduce LLM API costs?',
      options: [
        'By compressing the model weights.',
        'By embedding incoming prompts and returning cached responses if vector similarity exceeds a high threshold, bypassing the LLM entirely.',
        'By deleting the user\'s question.',
        'By forcing the user to watch an advertisement.'
      ],
      correctIndex: 1,
      explanation: "Semantic caching intercepts semantically identical queries before they reach the expensive LLM, serving instant, zero-cost responses from a vector DB. Why others are wrong: It does not compress weights, delete queries, or show ads."
    },
    {
      question: 'What is the primary benefit of Prefix Caching (Prompt Caching)?',
      options: [
        'It translates the system prompt into binary.',
        'It eliminates the prefill compute cost for shared system prompts, drastically reducing Time-To-First-Token (TTFT) and input token costs.',
        'It automatically fixes spelling errors in the prompt.',
        'It prevents the model from generating images.'
      ],
      correctIndex: 1,
      explanation: "Prefix caching reuses the KV states of long, static system prompts across multiple user turns, saving massive amounts of compute and money. Why others are wrong: It does not translate to binary, fix spelling, or block images."
    },
    {
      question: 'Why use Semantic Routing in a production architecture?',
      options: [
        'To dynamically route simple queries to cheap, fast models and complex reasoning tasks to expensive, heavy models, optimizing the cost-to-quality ratio.',
        'To route the internet traffic to a different country.',
        'To change the font size of the output.',
        'To automatically log the user out.'
      ],
      correctIndex: 0,
      explanation: "Routing ensures you only pay for heavy compute when absolutely necessary, using cheap models for trivial tasks. Why others are wrong: It is not for network routing, UI styling, or authentication."
    },
    {
      question: 'What does TTFT stand for, and why is it important?',
      options: [
        'Total Time For Training; it measures how long the model takes to learn.',
        'Time-To-First-Token; it measures perceived latency and system responsiveness in streaming applications.',
        'Text Translation Format Type; it defines the language output.',
        'Temporary Thread Fault Tolerance; it measures server crashes.'
      ],
      correctIndex: 1,
      explanation: "TTFT is the time between the user hitting 'Enter' and the first word appearing on screen. Low TTFT is critical for a snappy user experience. Why others are wrong: It is not related to training, translation, or thread faults."
    },
    {
      question: 'Why is enforcing `max_tokens` critical in agentic workflows?',
      options: [
        'It prevents runaway generation loops, unbounded billing costs, and ensures tool-calling JSON payloads remain compact.',
        'It makes the AI speak louder.',
        'It encrypts the output.',
        'It forces the AI to use emojis.'
      ],
      correctIndex: 0,
      explanation: "Without max_tokens, an agent stuck in a loop could generate millions of tokens, bankrupting the company and crashing the parser. Why others are wrong: It does not affect volume, encryption, or emojis."
    }
  ],
  milestones: [
    'Implement Semantic Caching to bypass LLM calls for repeated intents.',
    'Leverage Prefix Caching to optimize TTFT and reduce input token costs.',
    'Architect Semantic Routing to balance cost and quality across model tiers.',
    'Optimize perceived latency via Server-Sent Events (SSE) streaming.',
    'Enforce strict output constraints to prevent runaway billing and parsing errors.'
  ]
},
{
  id: 'aiin-14',
  order: 14,
  module: 'AI Security & Responsible AI',
  icon: '🛡️',
  title: 'Red Teaming & Guardrail Architecture',
  philosophy: "Deploying an AI without guardrails is like launching a bank without a vault. Adversaries will use jailbreaks, prompt injection, and data exfiltration to compromise your system. Responsible AI engineering requires proactive Red Teaming (hiring hackers to break your model), deploying specialized guardrail models (like Llama Guard), and implementing strict PII scrubbing to ensure your AI remains safe, compliant, and trustworthy in the wild.",
  concepts: [
    {
      title: '1. The Adversarial Mindset (Red Teaming)',
      beginner: "Red Teaming is when you hire ethical hackers to attack your own AI before the bad guys do. They try every trick in the book to make the AI say something illegal, leak data, or break the rules, so you can fix the holes.",
      advanced: "Red Teaming is the systematic, adversarial evaluation of AI systems to uncover vulnerabilities, biases, and safety failures. It involves automated fuzzing, manual jailbreak attempts, and multi-turn social engineering to map the model's failure boundaries before production deployment."
    },
    {
      title: '2. Taxonomy of Jailbreaks (DAN & Crescendo)',
      beginner: "Hackers use tricks like 'DAN' (Do Anything Now) to tell the AI to ignore its rules. Newer tricks like 'Crescendo' slowly build a fake scenario over 10 innocent questions, tricking the AI into crossing the safety line without realizing it.",
      advanced: "Jailbreaks exploit the model's instruction-following priors. Direct attacks (like DAN) use persona adoption and rule negation. Multi-turn attacks (like Crescendo or Crescendo-Chain) use gradual contextual escalation to bypass single-turn safety classifiers, requiring stateful guardrails to detect."
    },
    {
      title: '3. Llama Guard & NeMo Guardrails',
      beginner: "Instead of asking the main AI to police itself, we use a second, specialized 'Bouncer AI' (like Llama Guard). The Bouncer reads the user's prompt and the AI's answer, and instantly blocks anything toxic, illegal, or dangerous.",
      advanced: "Guardrail frameworks (like Llama Guard, NeMo Guardrails, or Azure AI Content Safety) act as deterministic or classification-based firewalls. They evaluate input/output streams against strict taxonomies (e.g., hate speech, self-harm, PII) and intercept violations before they reach the core LLM or the user."
    },
    {
      title: '4. PII Scrubbing & Output Sanitization',
      beginner: "Sometimes an AI accidentally reads a database and spits out a user's real phone number or email. PII scrubbing uses regex and special tools to scan the AI's final answer and blur out any personal info before showing it to the screen.",
      advanced: "Personally Identifiable Information (PII) leakage is a severe compliance violation (GDPR/CCPA). Production pipelines use Named Entity Recognition (NER) models or regex-based sanitizers to detect and redact emails, phone numbers, and SSNs from the LLM's output stream in real-time."
    },
    {
      title: '5. Audit Trails & Compliance',
      beginner: "If an AI makes a mistake that costs a company money, the lawyers will ask: 'Why did it do that?' Audit trails save every single prompt, tool call, and answer in a secure log so engineers can replay the exact moment things went wrong.",
      advanced: "Enterprise AI requires immutable audit logging for compliance, debugging, and RLHF data collection. Every trace (input, retrieved context, tool executions, and final output) must be persisted to a data lake with strict access controls to enable forensic analysis of safety incidents."
    }
  ],
  practical: {
    title: 'Basic PII Regex Scrubber',
    intro: "Let's write a basic output sanitizer that removes email addresses from an AI's generated text. Use a simple Regex pattern to find and replace any email with the string `[REDACTED]`.",
    steps: [
      "Define a regex pattern to match basic emails: `/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}/g`.",
      "Use the `.replace()` method on the `rawText` string.",
      "Replace any matches with the string `\"[REDACTED]\"`.",
      "Return the sanitized string."
    ],
    goal: "Implement a deterministic regex filter to scrub PII from model outputs.",
    starterCode: 'function scrubEmails(rawText) {\n  // Write your code below this line\n  \n}',
    solutionCode: 'function scrubEmails(rawText) {\n  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}/g;\n  return rawText.replace(emailRegex, "[REDACTED]");\n}'
  },
  quiz: [
    {
      question: 'What is the primary goal of AI Red Teaming?',
      options: [
        'To make the AI run faster.',
        'To systematically attack the model using adversarial prompts and jailbreaks to uncover safety vulnerabilities before production deployment.',
        'To translate the model into different languages.',
        'To compress the model weights.'
      ],
      correctIndex: 1,
      explanation: "Red Teaming proactively identifies failure modes, biases, and security holes that automated benchmarks miss. Why others are wrong: It does not affect speed, translation, or compression."
    },
    {
      question: 'How does a multi-turn jailbreak like "Crescendo" bypass standard safety filters?',
      options: [
        'By using a foreign language.',
        'By gradually escalating the context over multiple innocent-looking turns, eventually pushing the model across the safety boundary without triggering single-turn classifiers.',
        'By sending a massive image file.',
        'By turning off the server.'
      ],
      correctIndex: 1,
      explanation: "Crescendo exploits the model's conversational momentum, building a hypothetical or historical scenario that normalizes the harmful request over time. Why others are wrong: It does not rely on foreign languages, images, or server shutdowns."
    },
    {
      question: 'Why use a dedicated Guardrail model (like Llama Guard) instead of prompting the main LLM to "be safe"?',
      options: [
        'Because the main LLM is too slow.',
        'Because dedicated guardrails are optimized specifically for classification, are harder to jailbreak, and operate independently of the main model\'s context window.',
        'Because the main LLM cannot read English.',
        'Because guardrails are cheaper to run than a simple text prompt.'
      ],
      correctIndex: 1,
      explanation: "Prompting the main LLM to police itself is vulnerable to the same jailbreaks used to attack it. Independent guardrail models provide a robust, isolated security layer. Why others are wrong: It is not about speed, language capability, or cost."
    },
    {
      question: 'What is the compliance risk of failing to scrub PII from LLM outputs?',
      options: [
        'The model will forget its system prompt.',
        'It violates privacy regulations (like GDPR/CCPA) and exposes the company to massive legal liability and user harm.',
        'The text will print in the wrong color.',
        'The API will automatically refund the tokens.'
      ],
      correctIndex: 1,
      explanation: "Leaking PII (emails, SSNs, phone numbers) is a severe data breach that triggers regulatory fines and destroys user trust. Why others are wrong: It does not affect prompts, UI colors, or billing refunds."
    },
    {
      question: 'Why are immutable audit trails critical in enterprise AI deployments?',
      options: [
        'To enable forensic analysis of safety incidents, debug agentic failures, and collect high-quality data for future RLHF alignment.',
        'To make the database file smaller.',
        'To automatically generate user passwords.',
        'To change the font of the chat interface.'
      ],
      correctIndex: 0,
      explanation: "Audit trails provide the exact state, context, and tool calls that led to a specific output, which is mandatory for debugging and compliance. Why others are wrong: They do not compress files, generate passwords, or alter UI fonts."
    }
  ],
  milestones: [
    'Adopt an adversarial Red Teaming mindset to map model failure boundaries.',
    'Understand multi-turn jailbreak mechanics (Crescendo, Persona Adoption).',
    'Deploy independent Guardrail models to intercept toxic inputs and outputs.',
    'Implement deterministic PII scrubbing to ensure GDPR/CCPA compliance.',
    'Architect immutable audit trails for forensic debugging and RLHF data collection.'
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
