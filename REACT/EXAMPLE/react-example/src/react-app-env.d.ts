/// <reference types="react-scripts" />

declare module '*.less' {
  const css: { [key: string]: string; };
  export default css;
}
