/**
 * The Base Scenario Component class
 *
 * @constructor
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 *
 * @param    {Alchemy.Scenario.Session}   session    The session this component is in
 * @param    {Object}                     data       Scenario-specific block data
 */
const Component = Function.inherits('Alchemy.Base', 'Alchemy.Scenario.Component', function Component(session, data) {

	if (!session) {
		throw new Error('Scenario components require a session document');
	}

	// Store the session
	this.session = session;

	// And the component data
	this.data = data || {};

	// And the configuration
	this.settings = this.data.settings || {};

	// Store the id
	this.uid = this.id = this.data.uid;
});

/**
 * Make this an abstract class
 */
Component.makeAbstractClass();

/**
 * This class starts a new group
 */
Component.startNewGroup('scenario_component');

/**
 * Reference to the scenario in the session property
 *
 * @type   {Document.Scenario}
 */
Component.setProperty(function scenario() {
	return this.session.scenario;
});

/**
 * Return the class-wide schema
 *
 * @type   {Schema}
 */
Component.setProperty(function schema() {
	return this.constructor.schema;
});

/**
 * Prepare the inputs & outputs
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
Component.constitute(function prepareIo() {

	// Create the IO decks
	this.inputs = new Deck();
	this.outputs = new Deck();

	// Create the schema
	let schema = new Classes.Alchemy.Schema(this);
	this.schema = schema;
});

/**
 * Set an input handler
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
Component.setStatic(function setInput(name, fnc, options) {
	this.constitute(function constituteInput() {
		if (typeof name == 'function') {
			options = fnc;
			fnc = name;
			name = fnc.name;
		}

		if (!options) {
			options = {};
		} else if (options.name) {
			name = options.name;
		} else {
			options.name = name;
		}

		options.fnc = fnc;

		this.inputs.set(name, options);
	});
});

/**
 * Set an output config
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
Component.setStatic(function setOutput(name, options) {

	if (typeof name == 'object') {
		options = name;
		name = options.name;
	}

	if (!name) {
		throw new Error('Each component output requires a valid name');
	}

	this.constitute(function constituteOutput() {
		this.outputs.set(name, options);
	});
});

/**
 * Get all components
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.1
 */
Component.setStatic(function getAll() {

	let component,
	    outputs,
	    inputs,
	    result = [],
	    group = alchemy.getClassGroup('scenario_component'),
	    key;

	for (key in group) {
		component = group[key];
		outputs = [];
		inputs = [];

		for (let input of component.inputs) {
			inputs.push({
				name  : input.name,
				title : input.title,
				type  : input.type
			});
		}

		for (let output of component.outputs) {
			outputs.push({
				name  : output.name,
				title : output.title,
				type  : output.type
			});
		}

		let buttons = [];

		if (component.schema.field_count) {
			buttons.push({
				name  : 'config',
				title : 'Config',
				call  : 'Blast.Classes.Alchemy.Scenario.FlowHelper.configureNode',
				//href  : Router.getUrl('Scenario#configureComponent') + '',
			});
		}

		result.push({
			name        : key,
			title       : component.title,
			description : component.title + ' component',
			outputs     : outputs,
			inputs      : inputs,
			field_count : component.schema.field_count,
			schema      : component.schema,
			buttons     : buttons,
		});
	}

	console.log('Component RESULT:', result);

	return result;
}, false);

/**
 * Create a signal
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
Component.setMethod(function createSignal(type, value) {
	let signal = new Classes.Alchemy.Scenario.Signal(type, value);

	signal.source = this;

	return signal;
});

/**
 * Get the input config
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 *
 * @param    {String}   name     The input anchor name
 */
Component.setMethod(function getInput(name) {
	return this.constructor.inputs.get(name);
});

/**
 * Output a signal
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 *
 * @param    {String}   name     The output anchor name
 * @param    {Signal}   signal
 */
Component.setMethod(function outputSignal(name, signal) {

	let target_component,
	    connection;

	// Iterate over all the connections
	for (connection of this.data.connections.out) {

		// Make sure it's the correct output anchor
		if (connection.source.anchor_name != name) {
			continue;
		}

		target_component = this.scenario.getComponent(connection.target.node_uid);

		let cloned_signal = signal.clone();

		cloned_signal.source = this;
		cloned_signal.source_anchor = name;

		target_component.inputSignal(connection.target.anchor_name, cloned_signal);
	}
});

/**
 * Process an input signal
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 *
 * @param    {String}   name     The input anchor name
 * @param    {Signal}   signal
 */
Component.setMethod(function inputSignal(name, signal) {

	let input = this.getInput(name);

	if (!input) {
		return;
	}

	console.log('Got input', name, input);

	input.fnc.call(this, signal);

});

/**
 * Get a memory instance for this component
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 *
 * @return   {Alchemy.Scenario.Memory}
 */
Component.setMethod(function getMemory() {

	if (this.session.persistent_memory) {
		return this.session.persistent_memory.getSubMemory(this.uid);
	}

	return this.getSessionMemory();
});

/**
 * Specifically get the session memory for this component
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 *
 * @return   {Alchemy.Scenario.Memory}
 */
Component.setMethod(function getSessionMemory() {
	return this.session.session_memory.getSubMemory(this.uid);
});

/**
 * Get all the input connections
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 *
 * @return   {Array}
 */
Component.setMethod(function getInputConnections() {
	return this.data.connections.in;
});

/**
 * Get all the output connections
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 *
 * @return   {Array}
 */
Component.setMethod(function getOutputConnections() {
	return this.data.connections.out;
});