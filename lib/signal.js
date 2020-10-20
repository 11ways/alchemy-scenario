/**
 * The Scenario Signal class
 *
 * @constructor
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 *
 * @param    {String}   type    The value type
 * @param    {*}        value   The actual value
 */
const Signal = Function.inherits('Alchemy.Base', 'Alchemy.Scenario', function Signal(type, value) {
	this.type = type;
	this.value = value;
	this.source = null;
	this.source_anchor = null;
});

/**
 * Clone this signal
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 *
 * @return   {Signal}
 */
Signal.setMethod(function clone() {

	let signal = new Signal(this.type, JSON.clone(this.value));

	if (this.source) {
		signal.source = this.source;
	}

	if (this.source_anchor) {
		signal.source_anchor = this.source_anchor;
	}

	return signal;
});
