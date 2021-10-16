const webpack = require("webpack");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin")

const ipfsCliCommands = path.resolve("./node_modules/ipfs-cli/cjs/src/commands");

module.exports =   {
  entry: {
    app: "./index.js",
    joi: {
      import: "joi/lib/index.js",
      filename: "node_modules/joi/index.js",
      library: {
        type: 'commonjs2'
      }
    },
    "prom-client": {
      import: "./polyfills/prom-client",
      filename: "node_modules/prom-client/index.js",
      library: {
        type: 'commonjs2'
      }
    },
    "ipfs-grpc-server": {
      import: "./polyfills/grpc",
      filename: "node_modules/ipfs-grpc-server/index.js",
      library: {
        type: 'commonjs2'
      }
    },
    "update-notifier": {
      import: "./polyfills/update-notifier",
      filename: "node_modules/update-notifier/index.js",
      library: {
        type: 'commonjs2'
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.m?js(x?)$/,
        use: {
          loader: "babel-loader",
          options: {
            "presets": [
              [
                "@babel/preset-env",
                {
                  "include": [
                    "babel-plugin-proposal-class-properties",
                    "babel-plugin-proposal-private-methods"
                  ],
                  "exclude": [
                    "babel-plugin-proposal-async-generator-functions",
                    // "babel-plugin-proposal-class-properties",
                    "babel-plugin-proposal-class-static-block",
                    "babel-plugin-proposal-dynamic-import",
                    "babel-plugin-proposal-export-namespace-from",
                    "babel-plugin-proposal-json-strings",
                    "babel-plugin-proposal-logical-assignment-operators",
                    "babel-plugin-proposal-nullish-coalescing-operator",
                    "babel-plugin-proposal-numeric-separator",
                    "babel-plugin-proposal-object-rest-spread",
                    "babel-plugin-proposal-optional-catch-binding",
                    "babel-plugin-proposal-optional-chaining",
                    // "babel-plugin-proposal-private-methods",
                    "babel-plugin-proposal-private-property-in-object",
                    "babel-plugin-proposal-unicode-property-regex",
                    "babel-plugin-transform-arrow-functions",
                    "babel-plugin-transform-async-to-generator",
                    "babel-plugin-transform-block-scoped-functions",
                    "babel-plugin-transform-block-scoping",
                    "babel-plugin-transform-classes",
                    "babel-plugin-transform-computed-properties",
                    "babel-plugin-transform-destructuring",
                    "babel-plugin-transform-dotall-regex",
                    "babel-plugin-transform-duplicate-keys",
                    "babel-plugin-transform-exponentiation-operator",
                    "babel-plugin-transform-for-of",
                    "babel-plugin-transform-function-name",
                    "babel-plugin-transform-literals",
                    "babel-plugin-transform-member-expression-literals",
                    "babel-plugin-transform-modules-amd",
                    "babel-plugin-transform-modules-commonjs",
                    "babel-plugin-transform-modules-systemjs",
                    "babel-plugin-transform-modules-umd",
                    "babel-plugin-transform-named-capturing-groups-regex",
                    "babel-plugin-transform-new-target",
                    "babel-plugin-transform-object-super",
                    "babel-plugin-transform-parameters",
                    "babel-plugin-transform-property-literals",
                    "babel-plugin-transform-regenerator",
                    "babel-plugin-transform-reserved-words",
                    "babel-plugin-transform-shorthand-properties",
                    "babel-plugin-transform-spread",
                    "babel-plugin-transform-sticky-regex",
                    "babel-plugin-transform-template-literals",
                    "babel-plugin-transform-typeof-symbol",
                    "babel-plugin-transform-unicode-escapes",
                    "babel-plugin-transform-unicode-regex",
                  ]
                }
              ]
            ]
          }
        },
      },
    ]
  },
  output: {
    path: path.resolve("./dist"),
    filename: "index.js",
    library: {
      type: "commonjs2"
    }
  },
  mode: "development",
  target: "web",
  optimization: {
    nodeEnv: false,
  },
  externals: {
    //This feels good being able to separate the two scripts dependencies, God bless.
    fs: "fs",
    path: "path",
    net: "net",
    http: "http",
    https: "https",
    tls: "tls",
    crypto: "crypto",
    util: "util",
    stream: "stream",
    buffer: "buffer",
    os: "os",
    assert: "assert",
    url: "url",
    zlib: "zlib",
    querystring: "querystring",
    tty: "tty",
    child_process: "child_process",
    dns: "dns",
    constants: "constants",
    readline: "readline",
    console: "console",
    process: "process",

    "graceful-fs": "graceful-fs",

    joi: "joi",
    "prom-client": "prom-client",
    "ipfs-grpc-server": "ipfs-grpc-server",
    "update-notifier": "update-notifier",
  },
  resolve: {
    alias: {
      "ipfs-core-config/config": require.resolve("./src/config.js"),
      "ipfs-core-config/repo": require.resolve("./src/repo.js"),
      "ipfs-repo/locks/memory": require.resolve("./src/fs-lock.js"),
      "ipfs-repo/locks/fs": require.resolve("./src/fs-lock.js"),
      'ipfs-core-utils/agent$': require.resolve("./polyfills/agent.mjs"),
      "ipfs-utils/src/http$": path.resolve(__dirname, "./node_modules/ipfs-utils/src/http.js"),
      "ipfs-utils/src/fetch$": path.resolve(__dirname, "./node_modules/ipfs-utils/src/fetch.js"),
      "mkdirp": require.resolve("./polyfills/mkdirp")
    },
  },
  plugins: [
    new webpack.NormalModuleReplacementPlugin(
      /\.\/init/,
      (resource) => {
        if (path.normalize(resource.context) === ipfsCliCommands) {
          resource.request = require.resolve("./src/init.js");
        }
      }
    ),
    new webpack.NormalModuleReplacementPlugin(
      /\/locks\/(memory|fs)/,
      (resource) => {
        if (/ipfs-repo/.test(resource.context)) { 
          resource.request = require.resolve("./src/fs-lock.js")
        }
      }
    ),
  ]
}
