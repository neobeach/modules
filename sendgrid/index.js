/**
 * @access public
 * @since 0.0.1
 * @author Roel Voordendag
 * @copyright MIT
 */

 const config = {};

 module.exports = {
     /**
      * Initialize the Sendgrid module module
      *
      * @param {String} apiKey - Api key from sendgrid to send mail
      *
      * @example
      * const {Runtime, Server} = require('@neobeach/core');
      * const sendgrid = require('@neobeach/modules-sendgrid')
      *
      * const server = new Server();
      *
      * Runtime(() => {
      *    sendgrid.init(sendgridApiKey);
      *    server.run();
      * });
      *
      */
     init: (apiKey) => {
         config.apiKey = apiKey;
     },
     /**
      * Send a mail with Sendgrid
      */
     send: () => {
         console.log(config.apiKey);
     }
 }
 