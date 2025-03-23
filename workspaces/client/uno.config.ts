import { defineConfig, presetWind3 } from 'unocss'

export default defineConfig({
  presets: [
    presetWind3(),
  ],
  preflights: [
    {
      getCSS: () => /* css */ `
@view-transition {
  navigation: auto;
}
body {
  width: 100%;
  height: 100%;
  background-color: #000000;
  color: #ffffff;
}
html,
:host {
  font-family: 'Noto Sans JP', sans-serif !important;
}
video {
  max-height: 100%;
  max-width: 100%;
}
  @keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
`,
    },
  ],
})
