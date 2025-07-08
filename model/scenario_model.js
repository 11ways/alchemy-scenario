let all_components = alchemy.getClassGroup('scenario_component'),
    all_events = alchemy.getClassGroup('scenario_event'),
    persisted  = {};

/**
 * The Scenario Model
 *
 * @constructor
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
const Scenario = Function.inherits('Alchemy.Model', 'Scenario');

/**
 * Constitute the class wide schema
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.2.0
 */
Scenario.constitute(function addFields() {

	let components = new Classes.Alchemy.Schema(this);

	// Each scenario belongs to a user
	this.belongsTo('User');

	// The name of the scenario
	this.addField('name', 'String');

	components.addField('uid', 'ObjectId', {default: alchemy.ObjectId});
	components.addField('type', 'Enum', {values: all_components});

	let connections = new Classes.Alchemy.Schema();
	let connection = new Classes.Alchemy.Schema();
	let anchor = new Classes.Alchemy.Schema();
	anchor.addField('node_uid', 'ObjectId');
	anchor.addField('anchor_name', 'String');

	connection.addField('source', JSON.clone(anchor));
	connection.addField('target', JSON.clone(anchor));

	connections.addField('in', JSON.clone(connection), {array: true});
	connections.addField('out', JSON.clone(connection), {array: true});

	components.addField('connections', connections);

	let pos = new Classes.Alchemy.Schema();
	pos.addField('x', 'Number');
	pos.addField('y', 'Number');

	components.addField('pos', pos);

	// Component-specific settings (depends on the "type" property)
	components.addField('settings', 'Schema', {schema: 'type'});

	// All the blocks of this scenario
	this.addField('components', components, {array: true});

	// The events that trigger this scenario
	//this.addField('triggers', 'Enum', {array: true, values: {all_events}});

	// Is this scenario enabled?
	this.addField('enabled', 'Boolean', {default: false});
});

/**
 * Configure chimera for this model
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Scenario.constitute(function chimeraConfig() {

	var list,
	    edit;

	if (!this.chimera) {
		return;
	}

	// Get the list group
	list = this.chimera.getActionFields('list');

	list.addField('name');
	list.addField('user_id');
	list.addField('enabled');

	// Get the edit group
	edit = this.chimera.getActionFields('edit');

	edit.addField('name');
	edit.addField('user_id');
	edit.addField('enabled');
	edit.addField('components');
});

/**
 * Set default scenario scope name
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Scenario.setDocumentProperty('scope_name', 'default');

/**
 * Get a component by its id
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.2.0
 *
 * @param    {String|ObjectID}   uid
 *
 * @return   {Alchemy.Scenario.Component.Component}
 */
Scenario.setDocumentMethod(function getComponent(uid) {

	if (!uid || !this.components || !this.components.length) {
		return false;
	}

	let components = this.getComponents();

	return components.by_id[uid] || false;
});

/**
 * Initiate the components for this session
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.2.0
 *
 * @return   {Object}
 */
Scenario.setDocumentMethod(function getComponents(session) {

	let result = {
		list  : [],
		by_id : {}
	};

	if (!session) {
		session = new Classes.Alchemy.Scenario.Session(this);
	}

	if (!this.components || !this.components.length) {
		return result;
	}

	let constructor,
	    component,
	    entry;

	for (entry of this.components) {
		constructor = all_components[entry.type];

		if (!constructor) {
			throw new Error('Unable to find component type "' + entry.type + '"');
		}

		component = new constructor(session, entry);

		result.list.push(component);
		result.by_id[entry.uid] = component;
	}

	session.components = result;

	return result;
});

/**
 * Do a simple start
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 *
 * @return   {Object}
 */
Scenario.setDocumentMethod(async function start() {

	let components = this.getComponents(),
	    component,
	    tasks = [];

	for (component of components.list) {
		if (component.constructor.type_name == 'start') {
			tasks.push(component.start());
		}
	}

	await Pledge.all(tasks);
});

/**
 * Old code
 */

/**
 * Get a block's description
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Scenario.setDocumentMethod(function getBlockDescription(id, callback) {

	var block = this.getBlock(id);

	if (!block) {
		return callback(new Error('Block "' + id + '" not found'));
	}

	block.getDescription(callback);
});

/**
 * Apply event to this scenario
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Scenario.setDocumentMethod(function applyEvent(event, callback) {

	var that = this,
	    blocks = this.getSortedBlocks(),
	    duration,
	    started,
	    errors,
	    block,
	    key,
	    end = false;

	if (!callback) {
		callback = Function.thrower;
	}

	if (!blocks.start.length) {
		return callback(new Error('No starting block was found'));
	}

	if (this._has_already_started) {
		return callback(new Error("Can't start the same scenario document twice!"));
	}

	this._has_already_started = true;

	// This is the variables object that blocks can use
	if (!this.variables) {
		this.variables = {};
	}

	// Set the event
	this.event = event;

	// Prepare the errors array
	errors = [];

	// Start the timer
	started = Date.now();

	// Get a clone of the current persisted values
	this.previous_result_clone = JSON.clone(this.getPersistedValues());

	// Start the boot for all the blocks
	for (key in blocks.all) {
		block = blocks.all[key];

		// Start booting the block
		block.startBoot();
	}

	// Evaluate all the blocks, starting with the start block
	this.doBlocks(blocks.start, event, null, function doneAllBlocks(err) {

		duration = Date.now() - started;

		//console.log('Scenario', that, 'took', duration, 'ms');

		if (err) {
			// @todo: do something more with errors
			return callback(err);
		}

		callback(null);
	});
});

/**
 * Get the persisted entries for this scenario
 * as they are now
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @return   {Object}
 */
Scenario.setDocumentMethod(function getPersistedValues() {

	// Ensure the entry for this scenario exists
	if (!persisted[this._id]) {
		persisted[this._id] = {};
	}

	return persisted[this._id];
});

/**
 * Get the persisted scope values as they are now
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @return   {Object}
 */
Scenario.setDocumentMethod(function getScopeValues(scope_name) {

	var values = this.getPersistedValues();

	if (!scope_name) {
		scope_name = this.scope_name;
	}

	if (!values[scope_name]) {
		values[scope_name] = {};
	}

	return values[scope_name];
});

/**
 * Touch the block entry in the persisted value and return it
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Block}      block
 */
Scenario.setDocumentMethod(function touchPersistedBlockValue(block, scope_name, new_object) {

	var scope_values,
	    block_value,
	    donew;

	if (!block) {
		return false;
	}

	// If no scope name is given,
	// see if the second argument is actually the new_object
	if (scope_name && typeof scope_name == 'object') {
		new_object = scope_name;
		scope_name = null;
	}

	scope_values = this.getScopeValues(scope_name);

	if (new_object) {
		scope_values[block.id] = new_object;

		// Add the updated time
		new_object.updated = Date.now();
	} else if (!scope_values[block.id]) {
		scope_values[block.id] = {};
	}

	block_value = scope_values[block.id];

	return block_value;
});

/**
 * Persist the value of the given block
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Block}      block
 */
Scenario.setDocumentMethod(function persistBlockValue(block) {

	var block_value,
	    new_value,
	    donew;

	if (!block) {
		return false;
	}

	new_value = block.result_value;

	// Get the block value object
	block_value = this.touchPersistedBlockValue(block);

	if (block_value.count == null) {
		donew = true;
	} else if (!Object.alike(block_value.value, new_value)) {
		donew = true;
	}

	if (donew) {
		block_value = {
			value: new_value,
			count: 1
		};
	} else {
		// Increase the counter
		block_value.count++;
	}

	// Overwrite the block value
	this.touchPersistedBlockValue(block, block_value);

	return true;
});

/**
 * Do the given blocks (and the blocks they forward to)
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Array}      blocks
 * @param    {Function}   callback
 */
Scenario.setDocumentMethod(function doBlocks(blocks, event, from_block, callback) {

	var that = this,
	    tasks = [],
	    i;

	if (typeof event == 'function') {
		callback = event;
		from_block = null;
		event = null;
	}

	if (typeof from_block == 'function') {
		callback = from_block;
		from_block = null;
	}

	blocks = Array.cast(blocks);

	// Prepare a task for every given block
	blocks.forEach(function eachBlock(block, index) {
		tasks.push(function doBlockTask(next) {

			var ignored;

			// Make sure next gets called only once
			next = Function.regulate(next, 1);

			// Set the event
			block.event = event;

			// Start evaluating this block
			block.startEvaluation(from_block, function evaluated(err, value) {

				var next_blocks;

				// If this block has already emitted an ignored event,
				// don't do anything
				if (ignored) {
					return;
				}

				if (err) {
					return next(err);
				}

				// Get the next blocks to do
				next_blocks = block.getNextBlocks(value);

				if (next_blocks && next_blocks.length) {
					that.doBlocks(next_blocks, event, block, next);
				} else {
					next();
				}
			}, function special(command) {

				// Default to the 'ignore' command
				if (command == null) {
					command = 'ignore';
				}

				// When the 'ignore' command is received,
				// don't call any next blocks, just call next
				if (command == 'ignore') {
					ignored = true;
					next();
				}
			});
		});
	});

	// Do the tasks
	Function.parallel(tasks, callback);
});