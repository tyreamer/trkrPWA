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