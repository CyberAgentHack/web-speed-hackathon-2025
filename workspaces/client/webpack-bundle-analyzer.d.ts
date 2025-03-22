declare module 'webpack-bundle-analyzer' {
  import type { Compiler } from 'webpack';

  export interface BundleAnalyzerPluginOptions {
    analyzerMode?: 'server' | 'static' | 'json' | 'disabled';
    analyzerHost?: string;
    analyzerPort?: number;
    reportFilename?: string;
    reportTitle?: string;
    defaultSizes?: 'stat' | 'parsed' | 'gzip';
    openAnalyzer?: boolean;
    generateStatsFile?: boolean;
    statsFilename?: string;
    statsOptions?: any;
    excludeAssets?: RegExp | RegExp[] | ((asset: string) => boolean);
    logLevel?: 'info' | 'warn' | 'error' | 'silent';
  }

  export class BundleAnalyzerPlugin {
    constructor(options?: BundleAnalyzerPluginOptions);
    apply(compiler: Compiler): void;
  }
} 