const yargs = require("yargs")
const {
  ipfsPathHelp,
  disablePrinting
} = require('ipfs-cli/utils');
const { commandList } = require('../node_modules/ipfs-cli/cjs/src/commands/index.js');

module.exports = function createParser() {
  yargs.reset();

  return yargs().option('silent', {
    desc: 'Write no output',
    type: 'boolean',
    default: false,
    coerce: silent => {
      if (silent)
        disablePrinting();
      return silent;
    }
  }).option('pass', {
    desc: 'Pass phrase for the keys',
    type: 'string',
    default: ''
  }).option('migrate', {
    desc: 'Enable/disable automatic repo migrations',
    type: 'boolean',
    default: false
  }).options('api', {
    desc: 'Remote API multiaddr to use',
    type: 'string'
  }).epilog(ipfsPathHelp).demandCommand(1, 'Please specify a command').showHelpOnFail(false).command(commandList).help().strict().completion();
}
