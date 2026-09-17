// src/data/exams/ai.ts

import { ExamTrack } from './python';

export const aiTrack: ExamTrack = {
  id: 'ai',
  title: 'AI & Machine Learning',
  description: 'Master neural networks, Transformer architectures, loss optimization, model evaluation, LLM fine-tuning, and production AI mechanics.',
  totalAvailable: 24,
  questions: [
    // --- EASY ---
    {
      topic: 'Concepts',
      difficulty: 'Easy',
      q: 'What does LLM stand for in the context of Artificial Intelligence?',
      options: ['Large Logic Model', 'Large Language Model', 'Linear Learning Machine', 'Logical Language Machine'],
      answer: 1
    },
    {
      topic: 'Learning Types',
      difficulty: 'Easy',
      q: 'Which type of machine learning uses labeled datasets to train algorithms to classify data or predict outcomes?',
      options: ['Unsupervised Learning', 'Reinforcement Learning', 'Supervised Learning', 'Generative Learning'],
      answer: 2
    },
    {
      topic: 'Neural Networks',
      difficulty: 'Easy',
      q: 'What is the basic computational building block of an artificial neural network?',
      options: ['A Node or Perceptron', 'A Transformer', 'A Tensor Matrix', 'A Tokenizer'],
      answer: 0
    },
    {
      topic: 'Evaluation',
      difficulty: 'Easy',
      q: 'In binary classification, how is Accuracy defined?',
      options: [
        'The speed at which the model completes an epoch',
        'The ratio of correct predictions (True Positives + True Negatives) to the total number of predictions',
        'The ratio of True Positives to False Positives',
        'The percentage of memory utilized by the model weights'
      ],
      answer: 1
    },
    {
      topic: 'Natural Language Processing',
      difficulty: 'Easy',
      q: 'In Natural Language Processing (NLP), what is "Tokenization"?',
      options: [
        'Generating a secure access key for API rate-limiting',
        'Breaking raw text into smaller tokens such as words, subwords, or characters for model consumption',
        'Translating text into vector embeddings directly without parsing',
        'Removing duplicate records from a text corpus'
      ],
      answer: 1
    },
    {
      topic: 'Supervised Learning',
      difficulty: 'Easy',
      q: 'What is the fundamental objective of a Regression algorithm in Machine Learning?',
      options: [
        'To predict continuous numerical values',
        'To group data points into unlabeled clusters',
        'To classify input images into discrete categories',
        'To generate synthetic textual responses'
      ],
      answer: 0
    },
    {
      topic: 'Computer Vision',
      difficulty: 'Easy',
      q: 'In a Convolutional Neural Network (CNN), what is the primary role of a Max-Pooling layer?',
      options: [
        'To increase the number of channels in feature maps',
        'To downsample spatial dimensions (width/height), reducing computation and parameter counts',
        'To convert grayscale images to RGB format',
        'To calculate the loss during backpropagation'
      ],
      answer: 1
    },
    {
      topic: 'Unsupervised Learning',
      difficulty: 'Easy',
      q: 'Which of the following is a classic Unsupervised Machine Learning task?',
      options: ['Linear Regression', 'Logistic Regression', 'K-Means Clustering', 'Binary Sentiment Classification'],
      answer: 2
    },

    // --- INTERMEDIATE ---
    {
      topic: 'Model Training Mechanics',
      difficulty: 'Intermediate',
      q: 'What is "Overfitting" in Machine Learning, and how is it detected?',
      options: [
        'When a model performs well on training data but generalizes poorly to unseen validation data',
        'When a model exhibits high bias and fails to learn patterns in both training and validation sets',
        'When training loss fluctuates wildly due to a learning rate that is set too low',
        'When the dataset exceeds GPU VRAM limits during forward pass'
      ],
      answer: 0
    },
    {
      topic: 'Optimization',
      difficulty: 'Intermediate',
      q: 'How does Stochastic Gradient Descent (SGD) differ from Batch Gradient Descent?',
      options: [
        'SGD updates parameters using a single random sample (or mini-batch) per iteration rather than computing gradients across the entire dataset',
        'SGD guarantees convergence to the global minimum on non-convex surfaces, whereas Batch Gradient Descent does not',
        'SGD does not compute loss gradients during backpropagation',
        'Batch Gradient Descent is designed exclusively for reinforcement learning environments'
      ],
      answer: 0
    },
    {
      topic: 'Data Preprocessing',
      difficulty: 'Intermediate',
      q: 'Why is Feature Scaling (e.g., Standardization or Min-Max Scaling) critical before training gradient-based algorithms?',
      options: [
        'It encrypts sensitive numerical features to meet compliance standards',
        'It prevents features with larger numerical magnitudes from dominating gradient updates and optimizes convergence speed',
        'It automatically handles missing null values in tabular data',
        'It converts non-linear relationships into strictly linear constraints'
      ],
      answer: 1
    },
    {
      topic: 'Activation Functions',
      difficulty: 'Intermediate',
      q: 'What advantage does the ReLU (Rectified Linear Unit) activation function offer over Sigmoid in deep neural networks?',
      options: [
        'It clamps outputs between 0 and 1 for strict probability estimation',
        'It mitigates the vanishing gradient problem for positive inputs ($x > 0$) and is computationally efficient to calculate',
        'It eliminates dead neurons completely across all negative inputs',
        'It is bounded both above and below, preventing exploding gradients'
      ],
      answer: 1
    },
    {
      topic: 'Evaluation Metrics',
      difficulty: 'Intermediate',
      q: 'When evaluating a medical diagnosis model where missing a positive case (False Negative) is critical, which metric should be maximized?',
      options: ['Precision', 'Recall (Sensitivity)', 'Accuracy', 'Specificity'],
      answer: 1
    },
    {
      topic: 'Dimensionality Reduction',
      difficulty: 'Intermediate',
      q: 'How does Principal Component Analysis (PCA) reduce data dimensionality while retaining variance?',
      options: [
        'By dropping features with high mutual correlation',
        'By projecting data onto orthogonal axes (principal components) that maximize variance',
        'By training an autoencoder with a Softmax bottleneck',
        'By clustering nearby data points using Euclidean distance'
      ],
      answer: 1
    },
    {
      topic: 'Loss Functions',
      difficulty: 'Intermediate',
      q: 'Which loss function is standard for training multi-class classification models with mutually exclusive labels?',
      options: ['Mean Squared Error (MSE)', 'Categorical Cross-Entropy', 'Binary Cross-Entropy', 'Huber Loss'],
      answer: 1
    },
    {
      topic: 'Large Language Models',
      difficulty: 'Intermediate',
      q: 'What is Retrieval-Augmented Generation (RAG) in modern AI applications?',
      options: [
        'Fine-tuning all weights of an LLM on dynamic user data',
        'Combining an external vector database retrieval pipeline with an LLM prompt to ground outputs in up-to-date domain context',
        'Compressing 16-bit float model weights into 4-bit integer values for edge deployment',
        'Training language models using Monte Carlo Tree Search'
      ],
      answer: 1
    },

    // --- HARD ---
    {
      topic: 'Transformer Architecture',
      difficulty: 'Hard',
      q: 'In the Scaled Dot-Product Attention mechanism $\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V$, why is the dot product scaled by $\\sqrt{d_k}$?',
      options: [
        'To prevent the dot products from growing large in high dimensions, which would push the Softmax function into regions with extremely small gradients',
        'To convert non-symmetric similarity matrices into Hermitian matrices',
        'To enforce positional invariance across sequence length $T$',
        'To ensure the output vectors sum to 1 prior to linear projection'
      ],
      answer: 0
    },
    {
      topic: 'Deep Learning Optimization',
      difficulty: 'Hard',
      q: 'What causes the Vanishing Gradient Problem during backpropagation in deep Recurrent Neural Networks (RNNs)?',
      options: [
        'Repeated multiplication of weight matrices with eigenvalues smaller than 1 across many time steps, causing gradients to decay exponentially',
        'Over-saturation of the ReLU activation function across early layers',
        'Setting the learning rate too high during gradient updates',
        'Accumulation of rounding errors in 32-bit floating-point calculations'
      ],
      answer: 0
    },
    {
      topic: 'Efficient Fine-Tuning',
      difficulty: 'Hard',
      q: 'How does Low-Rank Adaptation (LoRA) enable resource-efficient parameter fine-tuning of Large Language Models?',
      options: [
        'By freezing pre-trained weights and inserting trainable rank decomposition matrices into Transformer layers',
        'By pruning 90% of inactive attention heads prior to training',
        'By converting FP32 floating-point values into INT4 representations during backpropagation',
        'By replacing self-attention layers with linear recurrent state-space layers'
      ],
      answer: 0
    },
    {
      topic: 'Generative AI & Alignment',
      difficulty: 'Hard',
      q: 'What is the primary function of Reinforcement Learning from Human Feedback (RLHF) in LLM development?',
      options: [
        'To pre-train base models on web-scale token corpora',
        'To align model outputs with human preferences regarding helpfulness, accuracy, and safety using a trained Reward Model',
        'To automatically generate synthetic training code for compiler optimization',
        'To reduce token decoding latency during autoregressive inference'
      ],
      answer: 1
    },
    {
      topic: 'Optimization Algorithms',
      difficulty: 'Hard',
      q: 'How does the Adam optimizer combine the principles of Momentum and RMSProp?',
      options: [
        'It maintains exponentially decaying averages of both past gradients (first moment) and past squared gradients (second moment)',
        'It computes second-order Hessian matrix derivatives alongside gradient directions',
        'It dynamically alters the batch size based on loss curvature',
        'It applies L1 regularization on weights while utilizing stochastic sub-gradients'
      ],
      answer: 0
    },
    {
      topic: 'Model Quantization',
      difficulty: 'Hard',
      q: 'What is the key trade-off when applying Post-Training Quantization (e.g., INT8/INT4) to an LLM?',
      options: [
        'Decreased GPU memory utilization and faster inference speed, at the potential cost of slight degradation in model precision/perplexity',
        'Higher parameter capacity on disk, but slower execution speed due to unpacking overhead',
        'Increased context window capacity, but total loss of zero-shot reasoning capabilities',
        'Complete removal of embedding layers in exchange for reduced latency'
      ],
      answer: 0
    },
    {
      topic: 'Transformer Mechanics',
      difficulty: 'Hard',
      q: 'In autoregressive LLM inference, what is the core purpose of maintaining a KV (Key-Value) Cache?',
      options: [
        'To store previously calculated Key and Value vectors for past tokens, avoiding redundant re-computations during step-by-step token generation',
        'To cache prompt embeddings on disk for multi-tenant server requests',
        'To store the gradients during distributed pipeline parallel inference',
        'To compress output logit probabilities before applying Top-P sampling'
      ],
      answer: 0
    },
    {
      topic: 'Evaluation Metrics',
      difficulty: 'Hard',
      q: 'In classification tasks with high class imbalance, why is ROC-AUC sometimes misleading compared to the Precision-Recall AUC (PR-AUC)?',
      options: [
        'ROC-AUC includes True Negatives in the False Positive Rate denominator, which can produce an overly optimistic score when the negative class dominates',
        'ROC-AUC cannot be calculated for continuous probability thresholds',
        'PR-AUC ignores True Positives and focuses exclusively on False Positives',
        'ROC-AUC requires mutually exclusive labels, whereas PR-AUC works on multi-label datasets'
      ],
      answer: 0
    }
  ]
};
