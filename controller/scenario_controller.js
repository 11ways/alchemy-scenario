/**
 * The Scenario Controller class
 *
 * @extends  Alchemy.Controller
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 *
 * @param    {Conduit}   conduit
 * @param    {Object}    options
 */
var Scenario = Function.inherits('Alchemy.Controller', function Scenario(conduit, options) {
	Scenario.super.call(this, conduit, options);
});

/**
 * Return info on all components
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Conduit}   conduit
 */
Scenario.setAction(function components(conduit) {

	let components = Classes.Alchemy.Scenario.Component.Component.getAll();

	conduit.end({
		components
	});
});

/**
 * Configure a component
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Conduit}   conduit
 */
Scenario.setAction(function configureComponent(conduit) {

	let scenario_id = conduit.param('grid_id'),
	    node_uid    = conduit.param('node_uid'),
	    type        = conduit.param('type');

	if (!type) {
		return conduit.error(new Error('Unable to configure component without a type'));
	}

	let component = Classes.Alchemy.Scenario.Component.Component.getMember(type);

	if (!component) {
		return conduit.error(new Error('Failed to find Component type "' + type + '"'));
	}

	if (scenario_id) {
		
	}

	console.log('Configure component:', conduit, scenario_id, node_uid);
	console.log('»»', component);

	let node_settings = {};

	this.set('node_settings', node_settings);
	this.set('schema', component.schema);

	this.render('scenario/component_config');

	//conduit.end();
});
