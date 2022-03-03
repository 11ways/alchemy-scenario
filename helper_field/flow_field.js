let all_components = alchemy.getClassGroup('scenario_component'),
    all_events = alchemy.getClassGroup('scenario_event'),
    persisted  = {};

/**
 * Schema fields are nested schema's
 *
 * @constructor
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.1
 * @version  0.2.1
 */
const FlowField = Function.inherits('Alchemy.Field.Schema', function Flow(schema, name, options) {

	if (!options) {
		options = {};
	}

	// Always clone using `toHawkejs` methods because otherwise schemas go missing
	options.schema = JSON.clone(FlowField.schema, 'toHawkejs');

	console.log('CLONED:', options.schema)


	Flow.super.call(this, schema, name, options);
});

/**
 * Constitute the class wide schema
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.2.1
 * @version  0.2.1
 */
FlowField.constitute(function createSchema() {

	console.log('Doing FlowField createSchema');

	let components = alchemy.createSchema();

	components.addField('uid', 'ObjectId', {default: alchemy.ObjectId});
	components.addField('type', 'Enum', {values: all_components});

	let connections = alchemy.createSchema();
	let connection = alchemy.createSchema();
	let anchor = alchemy.createSchema();
	anchor.addField('node_uid', 'ObjectId');
	anchor.addField('anchor_name', 'String');

	connection.addField('source', JSON.clone(anchor));
	connection.addField('target', JSON.clone(anchor));

	connections.addField('in', JSON.clone(connection), {array: true});
	connections.addField('out', JSON.clone(connection), {array: true});

	components.addField('connections', connections);

	let pos = alchemy.createSchema();
	pos.addField('x', 'Number');
	pos.addField('y', 'Number');

	components.addField('pos', pos);

	// Component-specific settings (depends on the "type" property)
	components.addField('settings', 'Schema', {schema: 'type'});

	let flow_schema = alchemy.createSchema();
	flow_schema.addField('components', components, {array: true});

	this.schema = flow_schema;
});