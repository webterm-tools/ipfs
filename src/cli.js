const createParser = require('./parser.js');
const commandAlias = require('../node_modules/ipfs-cli/cjs/src/command-alias');
const errCode = require('err-code');

export function cli(command, ctxMiddleware) {
  command = commandAlias(command);
  return new Promise((resolve, reject) => {
    try {
      const parser = createParser()
      
      parser.middleware(ctxMiddleware).onFinishCommand(data => {
        resolve(data);
      }).fail((msg, err, yargs) => {
        if (msg) {
          if (msg.includes('Unknown argument') || msg.includes('Please specify a command')) {
            yargs = parser;
          }
          return reject(errCode(new Error(msg), 'ERR_YARGS', { yargs }));
        }
        reject(err);
      }).parse(command);
    } catch (err) {
      return reject(err);
    }
  });
}