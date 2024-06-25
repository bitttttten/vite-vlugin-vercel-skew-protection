# vite-plugin-vercel-skew-protection

This package provides a plugin for Vite to integrate Vercel skew protection into your project. It's designed to help manage and mitigate potential skew issues when deploying applications on Vercel.

See the [Vercel docs](https://vercel.com/docs/deployments/skew-protection), and [this Github discussion](https://github.com/orgs/vercel/discussions/6496) for more information.

## Installation

```sh
npm i vite-plugin-vercel-skew-protection
```

## Usage

After installation, you need to import and add the plugin to your Vite configuration. Here's how you can do it:

1. Open your Vite configuration file (usually `vite.config.js` or `vite.config.ts`).
2. Import the `vite-plugin-vercel-skew-protection` package.
3. Add `vercelSkewProtection()` to the `plugins` array in your Vite configuration.

### Example Configuration

```js
import vercelSkewProtection from 'vite-plugin-vercel-skew-protection';

export default {
  plugins: [process.env.VERCEL_SKEW_PROTECTION_ENABLED === '1' && vercelSkewProtection()].filter(Boolean),
};
```

## Troubleshooting

This documentation presumes the default Vite configuration settings, or that you haven't tweaked your config too much. It assumes that your static files are being built into the `assets` folder, and that you are using `index.html` as the entry point.

Should your Vite setup deviate from these defaults through customization, the plugin might not function as expected. In such cases, please reach out to see if we can make it work.

## Note

The author of this plugin is not actively using it anymore. However, it has been previously used in many production environments. It's recommended to test the plugin thoroughly in your development environment before deploying it to production.

## Support

For issues, suggestions, or contributions, please refer to the project's GitHub repository.
