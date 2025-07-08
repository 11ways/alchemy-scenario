/**
 * The Wait Component class
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
const Wait = Function.inherits('Alchemy.Scenario.Component', 'Wait');

/**
 * Incoming signal
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 *
 * @param    {Alchemy.Scenario.Signal}   signal
 */
Wait.setInput(async function onInput(signal) {

	// Get this component's session memory (this should never be persisted)
	let storage = await this.getSessionMemory();

	let source_component = signal.source;

	storage.set(source_component.uid, true);

	console.log('Wait inputed:', signal, this)

	let input_connections = this.getInputConnections(),
	    connection;

	console.log('inputs:', input_connections)

	// If one of the nodes did not send any signal, nothing should be done
	for (connection of input_connections) {
		if (!storage.get(connection.source.node_uid)) {
			return;
		}
	}

	let output_signal = this.createSignal('boolean', true);
	this.outputSignal('done', output_signal);

}, {
	name : 'main_input',
	title: 'Input',
	type : '*'
});

/**
 * Done output: all blocks have sent an input
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
Wait.setOutput({
	name : 'done',
	title: 'Done',
	type : 'boolean'
});