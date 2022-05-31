/**
 * The alchemy-flow input element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.1
 * @version  0.2.1
 */
const AlchemyFlow = Function.inherits('Alchemy.Element.Form.Base', 'Flow');

/**
 * The template to use for the content of this element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.1
 * @version  0.2.1
 */
AlchemyFlow.setTemplateFile('form/elements/alchemy_flow_input');

/**
 * The stylesheet to load for this element
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.2.1
 * @version  0.2.1
 */
AlchemyFlow.setStylesheetFile('element/alchemy_flow');

/**
 * Getter for the actual fv-grid element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.1
 * @version  0.2.1
 */
AlchemyFlow.addElementGetter('grid_element', 'fv-grid');

/**
 * The optional categories to limit the components to
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.3.0
 * @version  0.3.0
 */
AlchemyFlow.setAttribute('component-category');

/**
 * The component_data
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.3.0
 * @version  0.3.0
 */
AlchemyFlow.setProperty(function component_data() {

	let result = Classes.Alchemy.Client.Scenario.Component.Component.getFvListData(this.component_category);

	return result;
});

/**
 * The value property
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.2.1
 * @version  0.2.1
 */
AlchemyFlow.setProperty(function value() {

	let result = {};

	if (this.grid_element) {
		result.components = this.grid_element.value;
	} else if (this.assigned_data.value) {
		Object.assign(result, this.assigned_data.value);
	}

	if (result.components) {
		for (let component of result.components) {
			component.settings = this.getComponentSettings(component.uid);
		}
	}

	return result;
}, function setValue(value) {

	if (this.grid_element) {
		if (value.components) {
			this.grid_element.value = value.components;
		} else {
			this.grid_element.value = null;
		}
	}

	// This doesn't work: value doesn't get to the browser. No idea why
	this.assigned_data.value = value;
});

/**
 * Added to the DOM for the first time
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.1
 * @version  0.2.1
 */
AlchemyFlow.setMethod(function introduced() {

	let parent = this.queryUp('alchemy-field');

	if (parent && parent.original_value) {
		// @TODO: should happen after the components are laoded!
		this.value = parent.original_value;
	}

});

/**
 * Get component settings
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.1
 * @version  0.2.1
 */
AlchemyFlow.setMethod(function getComponentSettings(uid) {

	if (this.component_settings && this.component_settings[uid]) {
		return this.component_settings[uid];
	}

	if (this.assigned_data && this.assigned_data.value && this.assigned_data.value.components) {
		for (let component of this.assigned_data.value.components) {
			if (component.uid === uid) {
				return component.settings;
			}
		}
	}
});

/**
 * Set component settings
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.1
 * @version  0.3.0
 */
AlchemyFlow.setMethod(function setComponentSettings(uid, settings) {

	if (!this.component_settings) {
		this.component_settings = {};
	}

	// Set the new setting values in our internal memory
	this.component_settings[uid] = settings;

	// And now update the component's data settings too
	this.getComponent(uid);

	// And update the fv-node too if it exists
	let fv_node = this.querySelector('fv-node[uid="' + uid + '"]');

	if (fv_node && fv_node.config) {
		fv_node.config.settings = settings;
	}
});

/**
 * Get component data
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.1
 * @version  0.2.1
 *
 * @return   {Object}
 */
AlchemyFlow.setMethod(function getComponent(uid) {

	let result = null,
	    components = this.value.components;

	if (components) {
		result = this.value.components.findByPath('uid', uid);
	}

	if (result) {
		result.settings = this.getComponentSettings(uid);
	}

	return result;
});