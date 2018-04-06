 /**
 * Summary.
 *  Function to compute a color based on an input string.
 * 
 * Description.
 *  We employ this method to return a constant color based
 *  on an input string. 
 *
 *
 * @param {string} str Input string
 * 
 * @return {string} Hex color (0x format)
 *
 */
export function getColorFromString(str) {

    if (str !== undefined && str !== null) {
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        var colour = '0x';
        for (var j = 0; j < 3; j++) {
            var value = (hash >> (j * 8)) & 0xFF;
            colour += ('00' + value.toString(16)).substr(-2);
        }

        return colour;
    }      
}


 /**
 * Summary.
 *  Function to format a number to a shorter form based on an input string.
 * 
 * Description.
 *  We employ this method to reduce the length of long numbers on the app
 *
 *
 * @param {string} str Input string
 * 
 * @return {string} Number formatted with the K, M, or G if necessary
 *
 */
export function formatNumber(num) {
    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G';
    }
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num;
}