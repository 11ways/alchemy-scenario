/**
 * The Console Action class
 *
 * @constructor
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.2.0
 *
 * @param    {Document.Action}   document   The (not necesarily saved) document
 */
let Console = Function.inherits('Alchemy.Scenario.Action', 'Console');

/**
 * Set the event schema
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Console.constitute(function setSchema() {

	// The arguments
	this.schema.addField('arguments', 'String', {array: true});
});

/**
 * Set event specific data,
 * should only be called for new events
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    1.0.0
 * @version  1.0.0
 */
Console.setMethod(function execute(callback) {
	console.log('Console log:', this);
	callback(null, true);
});