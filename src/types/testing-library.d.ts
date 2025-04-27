import '@testing-library/jest-dom';

declare global {
  namespace Vi {
    interface AsymmetricMatchersContaining extends jest.AsymmetricMatchers {}
    interface Assertion<T = any> extends jest.Matchers<void, T> {}
    interface AsymmetricMatchersContaining extends jest.AsymmetricMatchers {}
    interface ExpectStatic extends jest.ExpectStatic {}
  }
}

declare module '@testing-library/react' {
  export const render: any;
  export const screen: any;
  export const fireEvent: any;
  export const within: any;
  export const waitFor: any;
  export const cleanup: any;
  export const act: any;
  export const createEvent: any;
  export * from '@testing-library/dom';
} 