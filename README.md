<p align="center">
  <a href="https://www.medusajs.com">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/59018053/229103275-b5e482bb-4601-46e6-8142-244f531cebdb.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://user-images.githubusercontent.com/59018053/229103726-e5b529a3-9b3f-4970-8a1f-c6af37f087bf.svg">
    <img alt="Medusa logo" src="https://user-images.githubusercontent.com/59018053/229103726-e5b529a3-9b3f-4970-8a1f-c6af37f087bf.svg">
    </picture>
  </a>
</p>
<h1 align="center">
  Medusa Feature Displays
</h1>

<p align="center">A plugin for creating Rich Feature Sections in your Storefront.</p>

https://github.com/v0eak/medusa-product-feature-display/assets/51446230/cb366ae3-f999-41c0-85dc-de5d20abb206

## Compatibility
This plugin is compatible with versions >1.17.4 of `@medusajs/medusa`

## Requirements
This plugin requires you have installed a File Service Plugin.
I recommend installing [@medusajs/file-local](https://medusajs.com/plugins/@medusajsfile-local/)

## Getting Started

Installation
```bash
  yarn add medusa-product-feature-display
  OR
  npm install medusa-product-feature-display
```

Add to medusa-config.js
```bash
  ///...other plugins
  {
    resolve: 'medusa-product-feature-display',
    options: {
      enableUI: true,
    },
  },
```

Run Database Migrations
```bash
  npx medusa migrations run
```

## Roadmap
It is possible that I will implement functionality for reordering images in the future.

## Examples
The File demonstrated in the video, is available under `/examples` directory.

## Screenshots
![App Screenshot](https://github.com/v0eak/medusa-product-feature-display/assets/51446230/bcf127c0-068d-4bad-a977-3af8f9e58d92)