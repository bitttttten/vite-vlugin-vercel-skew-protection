const invariant = require("invariant");

const deploymentId = process.env.VERCEL_DEPLOYMENT_ID;
const queryKey = "dpl";

const addQueryParam = (name) => `${name}?${queryKey}=${deploymentId}`;
const hasQueryParam = (name) => name.includes(`?${queryKey}=${deploymentId}`);
const removeQueryParam = (name) =>
  name.replace(new RegExp(`\\?${queryKey}=${deploymentId}$`), "");

function SkewProtectionPlugin() {
  invariant(
    process.env.VERCEL_SKEW_PROTECTION_ENABLED === "1",
    'VERCEL_SKEW_PROTECTION_ENABLED must be set to "1" for vite-plugin-vercel-skew-protection. Are you running this plugin in development? You can only run this plugin on Vercel. See the docs on how to correctly load this plugin.'
  );

  invariant(
    deploymentId,
    "VERCEL_DEPLOYMENT_ID must be set for vite-plugin-vercel-skew-protection. Are you sure this plugin is being run on Vercel?"
  );

  return {
    name: "vite:vite-plugin-vercel-skew-protection",
    configResolved(config) {
      const rollupOptions = config.build.rollupOptions || {};
      const output = rollupOptions.output || {};

      rollupOptions.output = {
        ...output,
        entryFileNames: addQueryParam(
          output.entryFileNames || "assets/[name].[hash].js"
        ),
        chunkFileNames: addQueryParam(
          output.chunkFileNames || "assets/[name].[hash].js"
        ),
        assetFileNames: addQueryParam(
          output.assetFileNames || "assets/[name].[hash].[ext]"
        ),
      };

      config.build.rollupOptions = rollupOptions;
    },
    generateBundle(_options, bundle) {
      for (const [fileName, fileInfo] of Object.entries(bundle)) {
        if (!hasQueryParam(fileName)) {
          continue;
        }
        const newFileName = removeQueryParam(fileName);
        bundle[newFileName] = { ...fileInfo, fileName: newFileName };
        delete bundle[fileName];
      }
    },
    transformIndexHtml(html) {
      return html.replace(
        /(<script|<link).+?(src|href)="(.+?)"/g,
        (match, _tag, _attr, value) => {
          if (value.startsWith("/assets/") && !hasQueryParam(value)) {
            return match.replace(value, addQueryParam(value));
          }
          return match;
        }
      );
    },
  };
}

module.exports = SkewProtectionPlugin;
