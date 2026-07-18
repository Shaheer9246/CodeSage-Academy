// src/data/exams/ai.ts

import { ExamTrack } from './python';

export const aiTrack: ExamTrack = {
  id: 'ai',
  title: 'AI & Machine Learning',
  description: 'Core concepts in neural networks, LLMs, data preprocessing, and model evaluation.',
  totalAvailable: 12,
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
      q: 'Which type of machine learning uses labeled datasets to train algorithms?',
      options: ['Unsupervised Learning', 'Reinforcement Learning', 'Supervised Learning', 'Generative Learning'],
      answer: 2
    },
    {
      topic: 'Neural Networks',
      difficulty: 'Easy',
      q: 'What is the basic computational unit of an artificial neural network?',
      options: ['A Node or Neuron', 'A Transformer', 'A Matrix', 'A Token'],
      answer: 0
    },
    {
      topic: 'Evaluation',
      difficulty: 'Easy',
      q: 'In machine learning, what does "accuracy" measure?',
      options: [
        'The speed at which the model trains',
        'The ratio of correctly predicted observations to the total observations',
        'The number of layers in the network',
        'The size of the dataset'
      ],
      answer: 1
    },

    // --- INTERMEDIATE ---
    {
      topic: 'Model Training',
      difficulty: 'Intermediate',
      q: 'What is "overfitting" in machine learning?',
      options: [
        'When a model learns the training data too well, including its noise, making it perform poorly on new data',
        'When a model fails to learn the underlying patterns of the training data',
        'When a dataset is too large to fit into RAM',
        'When an algorithm trains faster than expected'
      ],
      answer: 0
    },
    {
      topic: 'Optimization',
      difficulty: 'Intermediate',
      q: 'Which algorithm is commonly used to minimize the loss function during neural network training?',
      options: ['Random Forest', 'Gradient Descent', 'K-Means Clustering', 'Principal Component Analysis (PCA)'],
      answer: 1
    },
    {
      topic: 'Data Preprocessing',
      difficulty: 'Intermediate',
      q: 'Why is data normalization or scaling often necessary before training a neural network?',
      options: [
        'It encrypts the data for security',
        'It compresses the data to save storage space',
        'It ensures all features have a similar scale, speeding up convergence and preventing one feature from dominating',
        'It automatically labels unlabeled data'
      ],
      answer: 2
    },
    {
      topic: 'Neural Networks',
      difficulty: 'Intermediate',
      q: 'What is the purpose of an activation function in a neural network?',
      options: [
        'To connect the database to the model',
        'To introduce non-linearity into the output of a neuron',
        'To calculate the loss of the model',
        'To automatically tune hyperparameters'
      ],
      answer: 1
    },

    // --- HARD ---
    {
      topic: 'Advanced Architecture',
      difficulty: 'Hard',
      q: 'Which breakthrough architecture, introduced in the paper "Attention Is All You Need", relies entirely on self-attention mechanisms?',
      options: ['Convolutional Neural Networks (CNNs)', 'Recurrent Neural Networks (RNNs)', 'Generative Adversarial Networks (GANs)', 'Transformers'],
      answer: 3
    },
    {
      topic: 'Deep Learning Challenges',
      difficulty: 'Hard',
      q: 'What is the "vanishing gradient problem"?',
      options: [
        'When gradients become too large, causing the model to diverge',
        'When gradients become extremely small, preventing weights in early layers from updating effectively during backpropagation',
        'When the dataset disappears from memory due to a hardware fault',
        'When a model perfectly memorizes the test set'
      ],
      answer: 1
    },
    {
      topic: 'Computer Vision',
      difficulty: 'Hard',
      q: 'In a Convolutional Neural Network (CNN), what is the primary purpose of a Pooling Layer (e.g., MaxPooling)?',
      options: [
        'To add color to grayscale images',
        'To increase the spatial dimensions of the input volume',
        'To reduce the spatial dimensions (width and height) of the input volume, decreasing computational load',
        'To output the final class probabilities'
      ],
      answer: 2
    },
    {
      topic: 'Natural Language Processing',
      difficulty: 'Hard',
      q: 'In NLP, what is "Tokenization"?',
      options: [
        'The process of generating a secure API key for the model',
        'Breaking down text into smaller pieces like words, subwords, or characters for the model to process',
        'Translating text from one language to another',
        'Removing stop words from a dataset'
      ],
      answer: 1
    }
  ]
};
