/**
 * The Start Component class
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
const Start = Function.inherits('Alchemy.Scenario.Component', 'Start');

/**
 * Set the description
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.4.0
 * @version  0.4.0
 */
Start.setDescription('An entrypoint');

/**
 * Add the simple start output
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
Start.setOutput({
	name : 'start',
	title: 'Start',
	type : 'boolean'
});

/**
 * Start!
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
Start.setMethod(function start() {

	let signal = this.createSignal('boolean', true);

	return this.outputSignal('start', signal);
});