/**
 * Import modules
 * @ignore
 */
const {Logger} = require('@neobeach/core');
const sendGrid = require('@sendgrid/mail');

/**
 * Setting variables
 * @ignore
 */
const config = {};

/**
 * A module to simplify the connection to sendgrid for sending mail
 *
 * @module @neobeach/modules-sendgrid
 * @type {{init: (function(String, String): undefined), send: (function((Array<string>|String), String, String, String, String=, (Array<string>|String)=, (Array<string>|String)=, Array=): *)}}
 */
module.exports = {
    /**
     * Initialize the Sendgrid module
     *
     * @access public
     * @since 1.0.0
     * @author Roel Voordendag
     * @copyright MIT
     *
     * @see https://www.npmjs.com/package/@sendgrid/mail
     * @see https://docs.sendgrid.com/api-reference/mail-send/mail-send
     *
     * @param {String} apiKey - Api key from sendgrid.
     * @param {String} from - Standard from email address that will be used also as standard replyTo.
     *
     * @example
     * const {Runtime, Server} = require('@neobeach/core');
     * const sendgrid = require('@neobeach/modules-sendgrid')
     *
     * const server = new Server();
     *
     * Runtime(() => {
     *    sendgrid.init(sendgridApiKey, 'noreply@dpdk.com');
     *    server.run();
     * });
     *
     */
    init: (apiKey, from) => {
        /**
         * Checking if apiKey is correct
         */
        if(typeof apiKey === "undefined" || typeof apiKey !== "string" || apiKey === ""){
            Logger.error("[SENDGRID] apiKey is not correct");
            process.exit(1);
            return;
        }

        /**
         * Checking if from is correct
         */
        if(typeof from === "undefined" || typeof from !== "string" || from === "") {
            Logger.error("[SENDGRID] from is not correct")
            process.exit(1);
            return;
        }

        config.apiKey = apiKey;
        config.from = from;
        sendGrid.setApiKey(config.apiKey);

        Logger.info('[SENDGRID] Initialized');
    },

    /**
     * Helper function to send email with Sendgrid.
     *
     * @access public
     * @since 1.0.0
     * @author Roel Voordendag
     * @copyright MIT
     *
     * @see https://www.npmjs.com/package/@sendgrid/mail
     * @see https://docs.sendgrid.com/api-reference/mail-send/mail-send
     *
     * @param {Array<string>|String} to - String with email to send to or an array filled with email addresses the email will be sent to.
     * @param {String} subject - Subject of the email.
     * @param {String} text - Text of the body of the mail.
     * @param {String} html - Body of email in html.
     * @param {String} replyTo - Email address where replies to send email will be sent to (default from email).
     * @param {Array<string>|String} cc - String with email to send to or an array filled with email addresses the email will be sent to.
     * @param {Array<string>|String} bcc - String with email to send to or an array filled with email addresses the email hidden will be sent to.
     * @param {Array} attachments - Array filled with needed object attachments information.
     *
     * @return {Promise}
     *
     * @example
     * const sendGrid = require('@neobeach/modules-sendgrid');
     *
     * const response = await sendGrid.send({
     *    to: 'user@example.com',
     *    subject: 'Testing mail',
     *    text: 'This is a testing mail',
     *    html: '<p>This is a testing mail</p>',
     *    replyTo: 'replyToUser@example.com',
     *    cc: 'anotheruser@example.com',
     *    bcc: 'hiddenuser@example.com,
     *    attachments: []
     *  }}
     */
    send: (to, subject, text, html, replyTo = config.from, cc = '', bcc = '', attachments = []) => {
        /**
         * Check if to is correct
         */
        if(typeof to === "undefined" || (typeof to !== "string" && !Array.isArray(to))){
            Logger.error('[SENDGRID] to is not correct!');
            process.exit(1);
            return;
        }

        /**
         * Check if subject is correct
         */
        if(typeof subject === "undefined" || typeof subject !== "string" || subject === ""){
            Logger.error('[SENDGRID] subject is not correct');
            process.exit(1);
            return;
        }

        /**
         * Check if html is correct
         */
        if(typeof html === "undefined" || typeof html !== "string" || html === "") {
            Logger.error('[SENDGRID] html is not correct');
            process.exit(1);
            return;
        }

        /**
         * Check if text is correct
         */
        if(typeof text === "undefined" || typeof text !== "string" || text === "") {
            Logger.error('[SENDGRID] text is not correct');
            process.exit(1);
            return;
        }

        return sendGrid.send({
            to: to,
            from: config.from,
            replyTo: replyTo,
            subject: subject,
            text: text,
            html: html,
            cc: cc,
            bcc: bcc,
            attachments: attachments
        })
    }
}
