/**
 * The Scenario Session class
 *
 * @constructor
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 *
 * @param    {Alchemy.Scenario.Scenario}   scenario      The actual scenario
 */
const Session = Function.inherits('Alchemy.Base', 'Alchemy.Scenario', function Session(scenario) {

	// When this session started
	this.started = Date.now();

	// The actual scenario
	this.scenario = scenario;

	// All the components in this scenario
	this.components = null;

	// The session-specific memory
	this.session_memory = new Classes.Alchemy.Scenario.Memory();

	// The persistant memory
	this.persistent_memory = null;
});
