/**
 * The Base Action class
 *
 * @constructor
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.2.0
 *
 * @param    {Document.ScenarioAction}   document   The (not necesarily saved) document
 */
const Action = Function.inherits('Alchemy.Base', 'Alchemy.Scenario.Action', function Action(document) {

	if (!document) {
		throw new Error('Actions must be provided with a document');
	}

	// Store the document
	this.document = document;

	// Get the payload
	let payload = this.document.payload;

	// If no payload exists, create it now
	if (!payload) {
		payload = this.schema.process();
		this.document.payload = payload;
	}

	this.payload = payload;
});

/**
 * Make this an abstract class
 */
Action.makeAbstractClass();

/**
 * This class starts a new group
 */
Action.startNewGroup('scenario_action');

/**
 * Return the class-wide schema
 *
 * @type   {Schema}
 */
Action.setProperty(function schema() {
	return this.constructor.schema;
});

/**
 * Set the action schema
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.2.0
 */
Action.constitute(function setSchema() {

	// Create a new schema
	let schema = new Classes.Alchemy.Schema(this);
	this.schema = schema;

	// Every action has a start and end property
	schema.addField('start', 'Datetime', {'default': Date.create});
	schema.addField('end', 'Datetime', {'default': null});
});
