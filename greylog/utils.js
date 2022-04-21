module.exports = {
    /**
     * Util to truncate a string
     *
     * @access private
     * @since 1.0.0
     * @author Glenn de Haan
     * @copyright MIT
     *
     * @param {String} str
     * @param {Number} num
     * @return {string|*}
     */
    truncateString:(str, num = 50) => {
        if (str.length <= num) {
            return str;
        }

        return `${str.slice(0, num)}...`;
    }
}
