/**
 * The Counter Component class
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
const Counter = Function.inherits('Alchemy.Scenario.Component', function Counter(session, data) {
	Counter.super.call(this, session, data);
});

/**
 * Increment input: increment the counter by 1
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 *
 * @param    {Alchemy.Scenario.Signal}   signal
 */
Counter.setInput(function onIncrement(signal) {

	if (!this.value) {
		this.value = 0;
	}

	this.value++;

	let output_signal = this.createSignal('number', this.value);

	this.outputSignal('value', output_signal);

}, {
	name : 'increment',
	title: 'Increment',
	type : '*'
});

/**
 * Decrement input: decrement the counter by 1
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
Counter.setInput(function onDecrement() {

}, {
	name : 'decrement',
	title: 'Decrement',
	type : '*'
});

/**
 * Set input: Set the counter to the input value
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
Counter.setInput(function onSet() {

}, {
	name : 'set',
	title: 'Set',
	type : 'number'
});

/**
 * Add input: Add the input value to the counter
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
Counter.setInput(function onAdd() {

}, {
	name : 'add',
	title: 'Add',
	type : 'number'
});

/**
 * Subtract input: Subtract the input value to the counter
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
Counter.setInput(function onSubtract() {

}, {
	name : 'subtract',
	title: 'Subtract',
	type : 'number'
});

/**
 * Reset input: Reset the counter to 0
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
Counter.setInput(function onReset() {

}, {
	name : 'reset',
	title: 'Reset',
	type : '*'
});

/**
 * Value output: outputs the current value of the counter after any input
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
Counter.setOutput({
	name : 'value',
	title: 'Value',
	type : 'number'
});