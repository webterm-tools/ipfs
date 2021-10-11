const webpack = require("webpack");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin")

//TODO God willing: move all dependencies to their own bundles and God willing, move shared chunks
const main_node_modules = Object.keys(require("./node_modules/ipfs/package.json").dependencies).reduce((entries, currentDep) => {
  if (currentDep === "ipfs-cli") return entries

  entries["ipfs_" + currentDep] = {
    import: currentDep,
    filename: "node_modules/" + currentDep + ".js"
  }

  return entries
}, {});

//TODO God willing: move all dependencies to their own bundles and God willing, move shared chunks
const ipfs_cli_node_modules = Object.keys(require("./node_modules/ipfs-cli/package.json").dependencies).reduce((entries, currentDep) => {

  const pkgJson = require(path.resolve("./node_modules/", currentDep, "package.json"));

  //Export all as separate files, God willing.
  if (currentDep !== "yargs" && pkgJson.exports && Object.keys(pkgJson.exports).findIndex(key => key[0] !== ".") === -1) {
    
    Object.keys(pkgJson.exports).forEach(key => {     
      let importName = path.join(currentDep, key);

      if (!importName.endsWith(".js")) importName + ".js"

      const entryName = "ipfs-cli_" + currentDep + "/" + importName;

      entries[entryName] = {
        import: importName,
        filename: path.normalize("node_modules/ipfs-cli/node_modules/" + importName + ".js")
      }
    })

  } else {

    entries["ipfs-cli_" + currentDep] = {
      import: currentDep,
      filename: "node_modules/ipfs-cli/node_modules/" + currentDep + ".js"
    }
  }

  return entries
}, {});

console.log(ipfs_cli_node_modules)

module.exports =   {
  entry: {
    //Only necessary if building as single bundle and can use local require to fetch
    // joi: {
    //   import: "joi/lib/index.js",
    //   filename: "node_modules/joi/index.js",
    //   library: {
    //     type: 'commonjs2'
    //   }
    // },
    // "prom-client": {
    //   import: "./polyfills/prom-client",
    //   filename: "node_modules/prom-client/index.js",
    //   library: {
    //     type: 'commonjs2'
    //   }
    // },
    // "ipfs-grpc-server": {
    //   import: "./polyfills/grpc",
    //   filename: "node_modules/ipfs-grpc-server/index.js",
    //   library: {
    //     type: 'commonjs2'
    //   }
    // },
    // "update-notifier": {
    //   import: "./polyfills/update-notifier",
    //   filename: "node_modules/update-notifier/index.js",
    //   library: {
    //     type: 'commonjs2'
    //   }
    // },
    ...main_node_modules,
    ...ipfs_cli_node_modules
  },
  output: {
    path: path.resolve("./dist"),
    library: {
      type: "commonjs-module"
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

    //Only necessary if building as single bundle and can use local require to fetch
    // joi: "joi",
    // "prom-client": "prom-client",
    // "ipfs-grpc-server": "ipfs-grpc-server",
    // "update-notifier": "update-notifier",
  },
  resolve: {
    alias: {
      'ipfs-core-utils/agent$': require.resolve("./polyfills/agent.mjs"),
      "ipfs-utils/src/http$": path.resolve(__dirname, "./node_modules/ipfs-utils/src/http.js"),
      "ipfs-utils/src/fetch$": path.resolve(__dirname, "./node_modules/ipfs-utils/src/fetch.js"),

      joi: require.resolve("joi/lib/index.js"),
      "prom-client": require.resolve("./polyfills/prom-client"),
      "ipfs-grpc-server": require.resolve("./polyfills/grpc"),
      "update-notifier": require.resolve("./polyfills/update-notifier"),
      "ipfs-core-types": false
    },
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        //TODO God willing: copy main ipfs package as our source, God willing. (cli.js is our entry, God willing)
        { from: path.resolve("./node_modules/ipfs/src/"), to: "src/" },
        { from: path.resolve("./index.js"), to: "index.js" },

        //TODO God willing: also copy ipfs-cli as suckless, God willing.
        { from: path.resolve("./node_modules/ipfs-cli/index.js"), to: "node_modules/ipfs-cli/index.js" },
        { from: path.resolve("./node_modules/ipfs-cli/cjs"), to: "node_modules/ipfs-cli/cjs" },
      ],
    }),
  ]
}