declare module '*.png' {
  const value: string;
  export = value;
}

declare module '*.svg' {
  const value: string;
  export = value;
}

declare module '*.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*?raw' {
  const value: string;
  export = value;
}

declare module '*?arraybuffer' {
  const value: ArrayBuffer;
  export = value;
}
