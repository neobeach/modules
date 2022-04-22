/**
 * Import modules
 * @ignore
 */
const {Logger} = require('@neobeach/core');
const Gelf = require('gelf');

/**
 * Import util
 * @ignore
 */
const util = require('./utils');

/**
 * Set variables
 * @ignore
 */
const config = {};
let gelf = {};
const packageInformation = require(__dirname + '/../package.json');

/**
 * A module to simplify the connection to graylog
 *
 * @module @neobeach/modules-graylog
 * @type {{init: (function(String, Number, String, ("local"|"test"|"staging"|"production")): undefined), send: (function(String, ("trace"|"debug"|"info"|"warn"|"error")=, String=, Object=): undefined)}}
 */
module.exports = {
    /**
     * Initialize the Connection with graylog.
     *
     * @access public
     * @since 1.0.0
     * @author Roel Voordendag
     * @copyright MIT
     *
     * @see https://www.npmjs.com/package/gelf
     * @see https://docs.graylog.org/docs
     *
     * @param {String} graylogHostname - Hostname of graylog server.
     * @param {Number} graylogPort - Port of graylog server.
     * @param {String} projectName - Name of current project working in.
     * @param {('local'|'test'|'staging'|'production')} projectEnv - From what environment is this message sent from.
     *
     * @example
     * const {Runtime, Server} = require('@neobeach/core');
     * const graylog = require('@neobeach/modules-graylog');
     *
     * Runtime(() => {
     *    graylog.init('log.example.com', '12201', 'example-project-name', 'local');
     * });
     */
    init: (graylogHostname, graylogPort, projectName, projectEnv) => {
        /**
         * Check if graylogHostname is correct
         */
        if(typeof graylogHostname === "undefined" || typeof graylogHostname !== "string" || graylogHostname === "") {
            Logger.error('[GRAYLOG] graylogHostname is not correct');
            process.exit(1);
            return
        }
        /**
         * Check if graylogPort is correct
         */
        if(typeof graylogPort === "undefined" || typeof graylogPort !== "number"){
            Logger.error('[GRAYLOG] graylogPort is not correct');
            process.exit(1);
            return;
        }
        /**
         * Check if projectName is correct
         */
        if(typeof projectName === "undefined" || typeof projectName !== "string" || projectName === ""){
            Logger.error('[GRAYLOG] projectName is not correct');
            process.exit(1);
            return;
        }
        /**
         * Check if projectEnv is correct
         */
        if(typeof projectEnv === "undefined" || typeof projectEnv !== "string" || projectEnv === "") {
            Logger.error('[GRAYLOG] projectEnv is not correct');
            process.exit(1);
            return;
        }

        config.projectName = projectName;
        config.projectEnv = projectEnv;

        gelf = new Gelf({
            graylogPort: graylogPort,
            graylogHostname: graylogHostname,
            connection: 'wan'
        });

        Logger.info('[GRAYLOG] Connection Initialized');

        gelf.on('error', (error) => {
            Logger.error(`[GRAYLOG] Error: ${error}`);
        });
    },

    /**
     * Function to send message to graylog.
     *
     * @access public
     * @since 1.0.0
     * @author Roel Voordendag
     * @copyright MIT
     *
     * @see https://www.npmjs.com/package/gelf
     * @see https://docs.graylog.org/docs
     *
     * @param {String} message - Message that will be displayed with the error in graylog.
     * @param {('trace'|'debug'|'info'|'warn'|'error')} severity - Show how big the severity is of the sending message.
     * @param {String} [shortMessage] - Short message that can be used as message. When not filled truncate original message. (50 characters max)
     * @param {Object} [payload] - Extra payload that can be used to sent extra data.
     *
     * @example
     * const graylog = require('@neobeach/modules-graylog');
     *
     * graylog.send('There was an error that happened.', 'This is the error', 'error', {test: 123});
     */
    send: (message, severity = 'info', shortMessage = message, payload = {}) => {
        /**
         * Check if message is correct
         */
        if(typeof message === "undefined" || typeof message !== "string" || message === "") {
            Logger.error("[GRAYLOG] message is not correct.");
            process.exit(1);
            return;
        }

        /**
         * Check severity type
         */
        if(!["trace", "debug", "info", "warn", "error"].includes(severity)){
            Logger.error("[GRAYLOG] severity is not correct");
            process.exit(1);
            return;
        }

        // Get stack but remove the first 2 entries containing the reference to this file
        const stack = new Error().stack.split('\n');
        stack.splice(0, 2);

        // Get the filename from the stack
        const file = typeof stack[0] !== "undefined" ? stack[0].match(/^.* \((.*):[0-9]+:[0-9]+\)$/) !== null ? stack[0].match(/^.* \((.*):[0-9]+:[0-9]+\)$/)[1] : null : null;

        gelf.emit('gelf.log', {
            short_message: util.truncateString(message),
            full_message: message,
            level: severity,
            project_name: config.projectName,
            project_env: config.projectEnv,
            stack_trace: stack.join('\n'),
            file: file,
            version_node: process.versions['node'],
            version_core: packageInformation.dependencies['@neobeach/core'], // Get core version used in package
            payload: payload,
        });
    }
}
