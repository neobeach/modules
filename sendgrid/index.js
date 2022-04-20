/**
 * @access public
 * @since 0.0.1
 * @author Roel Voordendag
 * @copyright MIT
 */

/**
 * Import modules
 */
 const sendGrid = require('@sendgrid/mail');

 const config = {};
 
 module.exports = {
     /**
      * Initialize the Sendgrid module module
      *
      * @param {String} apiKey - Api key from sendgrid to send mail
      * @param {String} from - Fallback from email address
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
     init: (apiKey, from) => {
         config.from = from;
         sendGrid.setApiKey(apiKey);
     },
     /**
      * Send a mail with Sendgrid
      *
      * @param {Array<string>|String} to - String with email to send to or an array filled with email addresses the email will be sent to.
      * @param {String} subject - Subject of the email
      * @param {String} text - String text of the body of the mail
      * @param {HTMLElement} - Body of email in html
      * @param {String} from - Address the email will be sent off from standard will be from init() function.
      * @param {Array<string>|String} cc - String with email to send to or an array filled with email addresses the email will be sent to.
      * @param {Array<string>|String} bcc - String with email to send to or an array filled with email addresses the email will be sent to.
      * @param {Array} attachments - Array filled with needed attachments.
      *
      * @return {Promise}
      */
     send: ({to, subject, text, html, from = config.from, cc = '', bcc = '', attachments = []}) => {
         sendGrid.send({
             to: to,
             from: from,
             subject: subject,
             text: text,
             html: html,
             cc: cc,
             bcc: bcc,
             attachments: attachments
         }).then(response => console.log(response));
     }
 }
 