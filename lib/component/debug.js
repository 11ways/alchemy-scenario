/**
 * The Debug Component class
 *
 * @constructor
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 *
 * @param    {Alchemy.Scenario.Session}   session    The scenario cycle this block is in
 * @param    {Object}                     data       Scenario-specific block data
 */
const Debug = Function.inherits('Alchemy.Scenario.Component', 'Debug');

/**
 * Add the simple input
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
Debug.setInput('any', function onAnySignal(signal) {

	console.log('»»»', 'DEBUG SIGNAL:', signal, '«««');

}, {
	name : 'any',
	title: 'Any',
	type : '*'
});