let all_actions = alchemy.getClassGroup('scenario_action');

/**
 * The Action Component class
 *
 * @constructor
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.2.0
 *
 * @param    {Alchemy.Scenario.Session}   session    The scenario session this block is in
 * @param    {Object}                     data       Scenario-specific block data
 */
const Action = Function.inherits('Alchemy.Scenario.Component', function Action(session, data) {
	Action.super.call(this, session, data);
});

/**
 * Set the component schema
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Action.constitute(function setSchema() {

	// Add the action_type setter
	this.schema.addField('action_type', 'Enum', {values: all_actions});

	// Add the settings subschema
	this.schema.addField('action_settings', 'Schema', {schema: 'action_type'});
});

/**
 * Done output: the action has ended
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
Action.setOutput({
	name : 'done',
	title: 'Done',
	type : 'boolean'
});