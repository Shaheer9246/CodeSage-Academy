// src/lib/aiMath.ts
export const SageMath = {
  // Dot product of two vectors
  dot: (a: number[], b: number[]): number => {
    if (a.length !== b.length) throw new Error("Vector lengths must match for dot product.");
    return a.reduce((sum, val, i) => sum + val * b[i], 0);
  },

  // Sigmoid activation function
  sigmoid: (x: number): number => 1 / (1 + Math.exp(-x)),

  // ReLU activation function
  relu: (x: number): number => Math.max(0, x),

  // Generate an array of random weights between min and max
  randomWeights: (size: number, min = -1, max = 1): number[] => 
    Array.from({ length: size }, () => Math.random() * (max - min) + min),
    
  // Mean Squared Error
  mse: (predicted: number[], actual: number[]): number => {
    if (predicted.length !== actual.length) throw new Error("Lengths must match for MSE.");
    const errors = predicted.map((p, i) => Math.pow(p - actual[i], 2));
    return errors.reduce((sum, e) => sum + e, 0) / errors.length;
  }
};
// Add this to the bottom of src/lib/aiMath.ts

export const SAGE_MATH_INJECTION = `
const SageMath = {
  dot: (a, b) => {
    if (a.length !== b.length) throw new Error("Vector lengths must match.");
    return a.reduce((sum, val, i) => sum + val * b[i], 0);
  },
  sigmoid: (x) => 1 / (1 + Math.exp(-x)),
  relu: (x) => Math.max(0, x),
  randomWeights: (size, min = -1, max = 1) => 
    Array.from({ length: size }, () => Math.random() * (max - min) + min),
  mse: (predicted, actual) => {
    if (predicted.length !== actual.length) throw new Error("Lengths must match.");
    const errors = predicted.map((p, i) => Math.pow(p - actual[i], 2));
    return errors.reduce((sum, e) => sum + e, 0) / errors.length;
  }
};
`;
