import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
import nodePolyfills from "rollup-plugin-node-polyfills";

export const config: Config = {
  namespace: 'graphene-ui',
  globalStyle: 'src/global/graphene-ui.scss',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: "docs",
      dir: "docs",
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    }
  ], 
  plugins: [
    sass(),
    nodePolyfills()
  ]
};
  