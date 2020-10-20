/**
 * The Sleep component:
 * Wait for a certain amount of time
 *
 * @constructor
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.2.0
 *
 * @param    {Alchemy.Scenario.Session}   session    The session this component is in
 * @param    {Object}                     data       Scenario-specific block data
 */
const Sleep = Function.inherits('Alchemy.Scenario.Component', function Sleep(session, data) {
	Sleep.super.call(this, session, data);
});

/**
 * Set the block schema
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Sleep.constitute(function setSchema() {
	// Set the sleep time
	this.schema.addField('duration', 'Number');
});

/**
 * Add the simple input
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
Sleep.setInput('input', async function onAnySignal(signal) {

	var that = this,
	    duration;

	if (this.settings.duration) {
		duration = Number(this.settings.duration);
	}

	// If the duration isn't a valid number, sleep for 1 second
	if (typeof duration != 'number' || !isFinite(duration)) {
		duration = 1000;
	}

	await Pledge.after(duration);

	let output_signal = this.createSignal('boolean', true);

	this.outputSignal('done', output_signal);
}, {
	name : 'main_input',
	title: 'Input',
	type : '*'
});

/**
 * Done output: the action has ended
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
Sleep.setOutput({
	name : 'done',
	title: 'Done',
	type : 'boolean'
});