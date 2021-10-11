#! /usr/bin/env node

debugger;

/* eslint-disable no-console */

/**
 * Handle any uncaught errors
 *
 * @param {any} err
 * @param {string} [origin]
 */
 const debug = require('debug')
 const { print, getIpfs, getRepoPath } = require('ipfs-cli/utils')
 const { cli } = require('./src/cli')
  
 /**
  * @param {any} err
  * @param {string} origin
  */
 const onUncaughtException = (err, origin) => {
   if (!origin || origin === 'uncaughtException') {
     console.error(err)
     process.exit(1)
   }
 }
 
 /**
  * Handle any uncaught errors
  *
  * @param {any} err
  */
 const onUnhandledRejection = (err) => {
   console.error(err)
   process.exit(1)
 }
 
 process.once('uncaughtException', onUncaughtException)
 process.once('unhandledRejection', onUnhandledRejection)
 
 const log = debug('ipfs:cli')
 
 process.title = "ipfs"
 
 /**
  * @param {string[]} argv
  */
 async function main (argv) {
   let exitCode = 0
   let ctx = {
     print,
     getStdin: () => process.stdin,
     repoPath: getRepoPath(),
     cleanup: () => {
      
     },
     isDaemon: false,
     /** @type {import('ipfs-core-types').IPFS | undefined} */
     ipfs: undefined
   }
 
   const command = argv.slice(2)
 
   try {
     const data = await cli(command, async (argv) => {
       if (!['daemon', 'init'].includes(command[0])) {
         // @ts-ignore argv as no properties in common
         const { ipfs, isDaemon, cleanup } = await getIpfs(argv)
 
         ctx = {
           ...ctx,
           ipfs,
           isDaemon,
           cleanup
         }
       }
 
       argv.ctx = ctx
 
       return argv
     })
 
     if (data) {
       print(data)
     }

   } catch (/** @type {any} */ err) {
     // TODO: export errors from ipfs-repo to use .code constants
     if (err.code === 'ERR_INVALID_REPO_VERSION') {
       err.message = 'Incompatible repo version. Migration needed. Pass --migrate for automatic migration'
     }
 
     if (err.code === 'ERR_NOT_ENABLED') {
       err.message = `no IPFS repo found in ${ctx.repoPath}.\nplease run: 'ipfs init'`
     }
 
     // Handle yargs errors
     if (err.code === 'ERR_YARGS') {
       err.yargs.showHelp()
       ctx.print.error('\n')
       ctx.print.error(`Error: ${err.message}`)
     } else if (log.enabled) {
       // Handle commands handler errors
       log(err)
     } else {
       ctx.print.error(err.message)
     }
 
     exitCode = 1
   } finally {
     await ctx.cleanup()
     setTimeout(() => self.postMessage({ action: "IPFS_COMMAND_COMPLETED" }), 500)
   }

   if (command[0] === 'init') {
     // auto shutdown since not usable
    //process.nextTick(() => process.exit(0))
   }

   if (command[0] === 'daemon') {
     // don't shut down the daemon process
     return
   }
}

self.addEventListener("message", function(e) {
  //TODO God willing: listen to /bin/bash for commands
  //TODO God willing: mount ipfs without hardcoding in /bin/bash (could ask  for process id or something here, God willing)
  const { argv, env } = e.data || {};

  if (env) {
    process.env = env
  }

  if (argv) {
    main(["node", "ipfs", ...argv]);
  }
});

main(process.argv)