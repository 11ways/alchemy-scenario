/**
 * The Flow helper class
 *
 * @constructor
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.2.1
 * @version  0.2.1
 */
const FlowHelper = Function.inherits('Alchemy.Base', 'Alchemy.Scenario', 'FlowHelper');

/**
 * Load the configuration GUI of a node
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.2.1
 * @version  0.4.0
 *
 * @param    {FV-Node}   fv_node
 */
FlowHelper.setStatic(async function configureNode(fv_node) {

	let schema = fv_node.assigned_data.config.schema,
	    alchemy_flow = fv_node.queryParents('al-flow');

	let component_data = alchemy_flow.getComponent(fv_node.uid),
	    settings = null;

	if (component_data) {
		settings = component_data.settings;
	}

	if (!settings) {
		settings = {};
	}

	let variables = {
		schema              : schema,
		component_settings  : settings,
	};

	await hawkejs.scene.render('scenario/component_config', variables);

	let dialog = document.querySelector('he-dialog.component-config-dialog');

	dialog.afterRender(function appeared() {

		let wrapper = dialog.querySelector('.component-config-wrapper');
		let form = wrapper.querySelector('.main-form');
		let apply = wrapper.querySelector('.btn-apply');

		apply.addEventListener('click', function onClick(e) {

			let value = form.value;

			alchemy_flow.setComponentSettings(fv_node.uid, value);

			dialog.close();
		});
	});
});