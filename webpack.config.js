const webpack = require("webpack");
const path = require("path");

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
      'ipfs-core-utils/agent$': require.resolve("./polyfills/agent.mjs"),
      "ipfs-utils/src/http$": path.resolve(__dirname, "./node_modules/ipfs-utils/src/http.js"),
      "ipfs-utils/src/fetch$": path.resolve(__dirname, "./node_modules/ipfs-utils/src/fetch.js"),
    },
  },
}