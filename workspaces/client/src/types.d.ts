declare module '*.png' {
  const value: string;
  export = value;
}

declare module '*.css';

declare module '*?raw' {
  const value: string;
  export = value;
}

declare module '*?arraybuffer' {
  const value: ArrayBuffer;
  export = value;
}

declare module 'process' {
	global {
		namespace NodeJS {
			interface ProcessEnv {
				readonly NODE_ENV?: 'development' | 'production';
			}
		}
	}
}
