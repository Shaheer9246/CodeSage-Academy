# CodeSage Track Architecture: AI Engineer vs. Machine Learning (ML) Engineer

*Document created: November 2026*  
*Status: Approved Architecture Plan*  
*Reference File: `Ailessonseparation.md`*

---

## 1. Executive Summary & Strategy

In modern software engineering, **AI Engineering** and **Machine Learning Engineering** are two distinct disciplines with different mental models, day-to-day toolchains, and career paths:

| Feature | 🤖 Track 1: AI Engineer (Applied GenAI) | 🔬 Track 2: Machine Learning Engineer (Math & Models) |
| :--- | :--- | :--- |
| **Primary Goal** | Build intelligent, reliable software products using foundation models | Train, optimize, evaluate, and deploy mathematical models from data |
| **Mindset** | Systems integration, prompt design, tool execution, low-latency streaming | Linear algebra, loss landscapes, backpropagation, training dynamics |
| **Core Stack** | Python, TypeScript, Vector DBs, LangChain/LlamaIndex, MCP, FastAPI | Python, NumPy, Pandas, Scikit-Learn, PyTorch, CUDA, MLOps |
| **Audience** | Full-stack & backend devs building SaaS, agents, and automation tools | CS & Data Science students targeting model training & algorithmic roles |
| **CodeSage Status** | **~85% complete** (Existing `ai-fundamentals`, `intermediate-ai`, `advanced-ai`) | **New Planned Track** (Classical ML → Deep Learning from scratch → PyTorch) |

---

## 2. Track 1: 🤖 AI Engineer (Applied GenAI & Autonomous Systems)

> **Route Prefix:** `/ai-fundamentals`, `/intermediate-ai`, `/advanced-ai`  
> **Credential:** `CS-AIENG` | **Focus:** Software systems powered by LLMs

### Module 1: Foundations of Applied GenAI & LLMs (`ai-fundamentals`)
- **AI-01:** How LLMs Work: Next-token prediction, context windows, and sampling temperatures.
- **AI-02:** Prompt Engineering Patterns: System prompts, few-shot conditioning, chain-of-thought.
- **AI-03:** Structured Outputs: Enforcing JSON schemas, Zod validation, and error self-correction.
- **AI-04:** Streaming & Latency: Server-Sent Events (SSE), token streaming, and UX optimization.
- **AI-05:** Function Calling & Tool Binding: Giving LLMs access to APIs and external calculations.

### Module 2: RAG Architecture & Vector Retrieval (`intermediate-ai`)
- **RAG-01:** Vector Embeddings & Similarity: High-dimensional space, cosine vs. Euclidean distance.
- **RAG-02:** Chunking Strategies: Fixed-size, recursive character, and semantic chunking.
- **RAG-03:** Vector Databases in Practice: Working with pgvector, ChromaDB, and Pinecone.
- **RAG-04:** Advanced Retrieval: Hybrid search (BM25 + Dense Vectors) and cross-encoder re-ranking.
- **RAG-05:** Grounding & Hallucination Mitigation: Citations, source verification, and prompt guardrails.

### Module 3: Autonomous Agents & Tool Use (`advanced-ai`)
- **AGT-01:** The ReAct Pattern: Reasoning, Acting, and Observation loops.
- **AGT-02:** Model Context Protocol (MCP): Standardized client-server tool connections.
- **AGT-03:** Multi-Agent Orchestration: Supervisor-worker patterns and task delegation.
- **AGT-04:** Agent Memory Systems: Short-term context vs. persistent episodic memory.

### Module 4: Fine-Tuning & LLMOps
- **OPS-01:** PEFT & LoRA/QLoRA: Adapting open-weight weights (Llama/Mistral) on low VRAM.
- **OPS-02:** LLM-as-a-Judge Evaluation: Ragas framework, synthetic test sets, precision/recall of RAG.
- **OPS-03:** Production Observability: Tracing prompts, token cost budgets, and rate limiting.

---

## 3. Track 2: 🔬 Machine Learning Engineer (Algorithms, Math & Training)

> **Route Prefix:** `/ml-engineer`  
> **Credential:** `CS-MLENG` | **Focus:** Math intuition, algorithm implementation, PyTorch

### Didactic Strategy: NumPy First → PyTorch Second
*Never jump directly into `torch.nn`.* Students first implement gradient descent and forward/backward passes using plain NumPy arrays. Once the mathematical intuition clicks, they transition to PyTorch tensors and autograd.

### Module 1: The Mathematical Intuition & NumPy Foundations
- **ML-01: Vectors & Matrices in Code**
  - Dot products, matrix multiplication, broadcasting rules in NumPy.
  - Interactive challenge: Implement matrix multiplication from scratch vs. vectorized `np.dot`.
- **ML-02: Loss Functions & Cost Landscapes**
  - Mean Squared Error (MSE), Binary Cross-Entropy (BCE).
  - Visualizing the 2D/3D error bowl.
- **ML-03: Gradient Descent by Hand**
  - Partial derivatives, learning rates, weight updates (`w = w - lr * dw`).
  - Interactive challenge: Train a 1-parameter line fitter without libraries.
- **ML-04: Feature Engineering & Preprocessing**
  - Normalization, standardization, handling missing values, one-hot encoding with Pandas.

### Module 2: Classical Machine Learning with Scikit-Learn
- **ML-05: Linear & Logistic Regression**
  - Closed-form normal equations vs. iterative SGD classification.
- **ML-06: Decision Trees & Tree Mechanics**
  - Information Gain, Gini impurity, splitting criteria.
- **ML-07: Ensemble Methods**
  - Bagging (Random Forests) vs. Boosting (Gradient Boosting & XGBoost).
- **ML-08: Unsupervised Learning**
  - K-Means clustering and Principal Component Analysis (PCA) dimensionality reduction.
- **ML-09: Model Evaluation Metrics**
  - Precision, Recall, F1-Score, Confusion Matrix, and ROC-AUC curves.

### Module 3: Neural Networks from Scratch to PyTorch
- **ML-10: The Perceptron & Activation Functions**
  - Step function, Sigmoid, Tanh, ReLU, Leaky ReLU, Softmax.
- **ML-11: Multi-Layer Perceptron (MLP) in Pure NumPy**
  - Forward propagation, manual backpropagation with the chain rule.
  - Interactive challenge: Solve XOR problem using a 2-layer NumPy neural network.
- **ML-12: Intro to PyTorch & Autograd**
  - Tensors, computation graphs, `requires_grad=True`, and `loss.backward()`.
- **ML-13: Building the Standard PyTorch Training Loop**
  - `torch.nn.Module`, `DataLoader`, optimizer (`torch.optim.Adam`), epoch step execution.

### Module 4: Deep Architectures & MLOps
- **ML-14: Convolutional Neural Networks (CNNs)**
  - Kernels, filters, pooling layers, image feature extraction.
- **ML-15: Sequence Models & The Transformer Breakdown**
  - RNN/LSTM limitations; Scaled Dot-Product Attention & Multi-Head Self-Attention.
- **ML-16: Model Quantization & Export**
  - Exporting models to ONNX runtime for ultra-fast CPU/GPU inference.
- **ML-17: Serving Models with FastAPI**
  - Building a microservice endpoint for sub-20ms model inference predictions.

---

## 4. CodeSage System Integration Blueprint

When adding this new track to CodeSage, update these core configuration points:

### 1. `src/lib/goalHelper.ts`
```typescript
export const GOAL_MAP: Record<string, GoalConfig> = {
  // Existing goals...
  ai: {
    id: 'ai',
    category: 'ai',
    primaryTrackId: 'ai-fundamentals',
    primaryPath: '/ai-fundamentals',
    label: 'AI Engineer (Applied GenAI)',
  },
  ml: {
    id: 'ml',
    category: 'ai',
    primaryTrackId: 'ml-engineer', // new track ID
    primaryPath: '/ml-engineer',
    label: 'Machine Learning Engineer',
  },
};
