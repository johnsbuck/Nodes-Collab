/* quoteFixer
 * Adds a second, single quote to a message to avoid PostgeSQL injection.
 */
function quoteFixer(msg) {
	if(typeof msg === 'string') {
		return msg.replace('\'', '\'\'');
	}else if(typeof msg === 'object') {
		for(var key in msg) {
			msg[key] = quoteFixer(msg[key]);
		}
		return msg;
	} else {
		return msg;
	}
}

module.exports = quoteFixer;
