import '@testing-library/jest-dom';

declare global {
  namespace Vi {
    interface AsymmetricMatchersContaining extends jest.AsymmetricMatchers {}
    interface Assertion<T = any> extends jest.Matchers<void, T> {}
    interface AsymmetricMatchersContaining extends jest.AsymmetricMatchers {}
    interface ExpectStatic extends jest.ExpectStatic {}
  }
} 