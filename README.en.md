# Lottie Lens

[中文](./README.md)

A local-first Lottie file validator, animation preview, and asset inspection tool. Open the web app, drop in a Lottie project folder, and validate Lottie JSON, image asset mapping, and demo video playback in one place.

[Try Lottie Lens online](https://twoer.github.io/lottie-lens/)

![Lottie Lens interface preview](./demo.png)

## What It Solves

A Lottie delivery is often more than one JSON file. It may also include image assets, demo videos, and folder-relative paths. Lottie Lens helps you quickly check:

- Whether the animation JSON can play correctly.
- Whether image assets can be detected and mapped.
- Whether the demo video can play in the current browser.
- Whether the animation and demo video are easy to compare side by side.

All files are read locally in your browser. Nothing is uploaded to a server.

## Use Cases

- Validate Lottie files before delivery and check that JSON, image assets, and demo videos are complete.
- Preview and review Lottie animations with designers, motion designers, and frontend engineers.
- Debug Lottie assets references, image paths, filename casing, and browser video compatibility.
- Inspect client or project animation files locally without uploading private assets.

## Quick Start

1. Open the [live demo](https://twoer.github.io/lottie-lens/).
2. Click `选择文件夹` or drag a complete Lottie project folder into the page.
3. Use playback, speed, progress, and background controls to inspect animation details.

If the video shows a format compatibility warning, convert it to MP4 or open it in a browser that supports the format.

## Recommended Folder Structure

```text
my-lottie-project/
├── animation.json
├── images/
│   ├── img_0.png
│   ├── img_1.png
│   └── ...
└── demo.mp4
```

## Features

- Lottie preview: play, pause, reset, speed, progress, and background controls.
- Folder detection: automatically detects JSON, image assets, and demo videos.
- Image asset mapping: maps local image files to Lottie asset references.
- Video state check: supports MP4, WebM, and other browser-playable formats, with compatibility hints for formats such as MOV.
- PWA support: installable after HTTPS deployment.
- Static deployment: works on GitHub Pages, Vercel, Netlify, or any static host.

## Privacy

Lottie Lens does not upload your files.

Selected JSON, images, and videos are read directly by the browser. Blob URLs are created locally for preview and cleaned up when the project is replaced or the page is closed.

## Local Development

### Requirements

- Node.js 22 is recommended.
- npm

### Install

```bash
npm install
```

### Run

```bash
npm run dev
```

The app runs at:

```text
http://localhost:5173/
```

### Check And Test

```bash
npm run type-check
npm run lint:check
npm run stylelint:check
npm run format:check
npm test
```

### Build

```bash
npm run build
```

Build output is written to `dist/`.

## Tech Stack

- Vue 3
- TypeScript
- Vite
- Vue Router
- Tailwind CSS
- Lottie Web
- Local shadcn-style Vue components
- Lucide Vue icons
- Vitest
- Vue Test Utils
- Playwright

## Browser Notes

- MP4 has the broadest browser support.
- MOV is usually better supported in Safari than in Chromium-based browsers.
- User-selected local files are not cached by the PWA and must be selected again after reopening.

## Contributing

Issues and pull requests are welcome. Before opening a pull request, run:

```bash
npm run type-check
npm run lint:check
npm run stylelint:check
npm run format:check
npm test
npm run build
```

## License

MIT
