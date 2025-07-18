/**
 * The Start Scenario Block class
 *
 * @constructor
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {ScenarioDocument}   scenario    The scenario this block is in
 * @param    {Object}             data        Scenario-specific block data
 */
const Start = Function.inherits('Alchemy.Scenario.Block.Block', 'Start');

/**
 * This is a start block
 *
 * @type {Boolean}
 */
Start.setProperty('entrance_point', true);

/**
 * Start blocks don't have an entrace,
 * they basically ARE entrances
 *
 * @type {Boolean}
 */
Start.setProperty('has_entrance', false);

/**
 * Start blocks have only 1 exit
 *
 * @type {Array}
 */
Start.setProperty('exit_names', ['throughput']);

/**
 * The start block has no settings
 *
 * @type {Boolean}
 */
Start.setProperty('has_settings', false);

/**
 * Evaluate the block with the given data
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    1.0.0
 * @version  1.0.0
 *
 * @param    {ScenarioBlock}   from_block   The referring block
 * @param    {Function}        callback
 */
Start.setMethod(function evaluate(from_block, callback) {
	// Start should always evaluate truthy
	callback(null, true);
});
