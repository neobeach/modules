/**
 * Import modules
 */
const {Logger} = require('@neobeach/core');
const Gelf = require('gelf');

/**
 * Set variables
 */
const config = {};
let gelf = {};
const packageInformation = require(__dirname + '/../package.json');


/**
 * @access public
 * @since 0.0.1
 * @author Glenn de Haan
 * @copyright MIT
 *
 * Util to truncate a string
 *
 * @param {String} str
 * @param {Number} num
 * @return {string|*}
 */
function truncateString(str, num = 50) {
    if (str.length <= num) {
        return str;
    }

    return `${str.slice(0, num)}...`;
}

module.exports = {
    /**
     * @access public
     * @since 0.0.1
     * @author Roel Voordendag
     * @copyright MIT
     *
     * Initialize the Connection with graylog.
     *
     * @see https://www.npmjs.com/package/gelf
     *
     * @param {String} graylogHostname - Hostname of dpdk gray log.
     * @param {Number} graylogPort - Port of dpdk's gray log space.
     * @param {String} projectName - Name of current project working in.
     * @param {("local", "test", "staging", "production")} projectEnv - From what environment is this message sent from.
     *
     * @example
     * const {Runtime, Server} = require('@neobeach/core');
     * const graylog = require('@neobeach/modules-graylog');
     *
     * Runtime(() => {
     *    graylog.init('log.dpdk.com', '12201', 'example-project-name', 'local');
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
     * @access public
     * @since 0.0.1
     * @author Roel Voordendag
     * @copyright MIT
     *
     * Function to send message to graylog.
     *
     * @see https://www.npmjs.com/package/gelf
     *
     * @param {String} message - Message that will be displayed with the error in graylog.
     * @param {("trace", "debug", "info", "warn", "error", "fatal")} severity - Show how big the severity is of the sending message.
     * @param {String} shortMessage - Short message that can be used as message. When not filled truncate original message. (50 characters max)
     * @param {Object} payload - Extra payload that can be used to sent extra data.
     *
     * @example
     * const graylog = require('@neobeach/modules-graylog');
     *
     * graylog.send({
     *      message:'There was an error that happened.',
     *      shortMessage: 'This is the error',
     *      severity: 'error',
     *      payload: {test: 123}
     *  });
     */
    send: ({message, severity = 'info', shortMessage = message, payload = {}}) => {
        /**
         * Check if message is correct
         */
        if(typeof message === "undefined" || typeof message !== "string" || message === "") {
            Logger.error("[GRAYLOG] message is not correct.");
            process.exit(1);
            return;
        }

        // Get stack but remove the first 2 entries containing the reference to this file
        const stack = new Error().stack.split('\n');
        stack.splice(0, 2);

        // Get the filename from the stack
        const file = typeof stack[0] !== "undefined" ? stack[0].match(/^.* \((.*):[0-9]+:[0-9]+\)$/) !== null ? stack[0].match(/^.* \((.*):[0-9]+:[0-9]+\)$/)[1] : null : null;

        gelf.emit('gelf.log', {
            short_message: truncateString(shortMessage),
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
