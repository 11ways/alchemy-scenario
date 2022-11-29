/**
 * The client-side component class
 *
 * @constructor
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.3.0
 * @version  0.3.0
 *
 * @param    {FvNode}   node    The node element
 * @param    {Object}   config  The config of this node
 */
const Component = Function.inherits('Alchemy.Client.Base', 'Alchemy.Client.Scenario.Component', function Component(node, config) {

	this.node = node;
	this.config = config;
	this.settings = this.config.settings || {};

	// Keep track of custom anchors
	this.custom_inputs = {};
	this.custom_outputs = {};

	this.initNode();
});

/**
 * Create client component class for specific component type
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.3.0
 * @version  0.3.0
 *
 * @param    {String}   component_name
 */
Component.setStatic(function getClass(component_name) {

	let class_path = 'Alchemy.Client.Scenario.Component.' + component_name;

	let ComponentClass = Object.path(Blast.Classes, class_path);

	if (!ComponentClass) {

		let constructor = Function.create(component_name, function ComponentConstructor(node, config) {
			ComponentConstructor.wrapper.super.apply(this, arguments);
		});

		let parent_path = 'Alchemy.Client.Scenario.Component';

		ComponentClass = Function.inherits(parent_path, constructor);
	}

	return ComponentClass;
});

/**
 * Get all the constructors that match the given categories
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.3.0
 * @version  0.3.0
 *
 * @param    {String|String[]}   categories
 */
Component.setStatic(function getConstructorsOfCategory(categories) {

	if (categories && !Array.isArray(categories)) {
		categories = categories.split(',');
	}

	let result,
	    all = Classes.Alchemy.Client.Scenario.Component.Component.getAllChildren();
	
	if (!categories || !categories.length) {
		result = all.slice(0);	
	} else {
		result = [];

		for (let constructor of all) {

			if (!constructor.categories || !constructor.categories.length) {
				continue;
			}

			if (constructor.categories.shared(categories).length) {
				result.push(constructor);
			}
		}
	}

	return result;
});

/**
 * Get component config data for the fv-list element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.3.0
 * @version  0.3.0
 *
 * @param    {String|String[]}   categories
 *
 * @return   {Object[]}
 */
Component.setStatic(function getFvListData(categories) {

	let constructors = this.getConstructorsOfCategory(categories),
	    result = [];
	
	for (let constructor of constructors) {

		result.push({
			name       : constructor.name,
			type       : constructor.type_name,
			categories : constructor.categories,
			class      : constructor.getClassPath(),
		});
	}

	return result;
});

/**
 * We will handle fv-node loading ourselves
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.3.0
 * @version  0.3.0
 *
 * @type     {Boolean}
 */
Component.setProperty('handles_node_loading', true);

/**
 * Custom inputs
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.3.0
 * @version  0.3.0
 *
 * @type     {Object}
 */
Component.setProperty('custom_inputs', null);

/**
 * Custom outputs
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.3.0
 * @version  0.3.0
 *
 * @type     {Object}
 */
Component.setProperty('custom_outputs', null);

/**
 * Get the component title
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.3.0
 * @version  0.3.0
 */
Component.setProperty(function title() {

	let result;

	if (this.settings.node_title) {
		result = this.settings.node_title;
	} else {
		result = this.constructor.name;
	}

	return result;
});

/**
 * Refresh this component
 * (Fetch data, add custom anchors, set title, ...)
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.3.0
 * @version  0.3.0
 */
Component.setMethod(async function refresh() {

	// If we need to fetch any data, do so now
	if (typeof this.loadData == 'function') {
		await this.loadData();
	}

	// (Re-)load the custom IO
	this.loadCustomIO();

	// And refresh the title
	this.refreshInterface();
});

/**
 * Update the component's visuals
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.3.0
 * @version  0.3.0
 */
Component.setMethod(function refreshInterface() {

	this.node.title_element.textContent = this.title;

});

/**
 * Initialize the fv-node
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.3.0
 * @version  0.3.0
 */
Component.setMethod(async function initNode() {

	// Add static inputs
	if (this.constructor.inputs) {
		for (let input of this.constructor.inputs) {
			this.node.addInput(input);
		}
	}

	// Add static outputs
	if (this.constructor.outputs) {
		for (let output of this.constructor.outputs) {
			this.node.addOutput(output);
		}
	}

	// Refresh data
	await this.refresh();

	// Load the existing connections
	if (this.config.connections) {
		this.node.loadIncomingConnections(this.config.connections.in);
		this.node.loadOutgoingConnections(this.config.connections.out);
	}

	let loaded_button_content = false;

	if (typeof this.loadCustomButtonContent == 'function') {
		loaded_button_content = await this.loadCustomButtonContent();
	}

	// Add the config button if there are fields in the component's config schema
	if (this.constructor.schema.field_count && loaded_button_content === false) {
		this.addSchemaConfigButton();
	}
});

/**
 * Load the custom IO
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.3.0
 * @version  0.3.1
 */
Component.setMethod(function loadCustomIO() {

	if (typeof this.addCustomIO != 'function') {
		return;
	}

	let old_inputs = this.custom_inputs,
	    old_outputs = this.custom_outputs;
	
	// `_addCustomAnchor` needs to know the original anchor config,
	// in case it still exists
	this.old_inputs = old_inputs;
	this.old_outputs = old_outputs;

	this.custom_inputs = {};
	this.custom_outputs = {};

	this.addCustomIO();

	let key;

	for (key in old_inputs) {
		if (!this.custom_inputs[key]) {
			this.node.removeInput(key);
		}
	}

	for (key in old_outputs) {
		if (!this.custom_outputs[key]) {
			this.node.removeOutput(key);
		}
	}

	this.old_inputs = null;
	this.old_outputs = null;
});

/**
 * Add a custom IO anchor
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.3.0
 * @version  0.3.1
 */
Component.setMethod(function _addCustomAnchor(type, config) {

	if (!config || !config.name) {
		return;
	}

	const name = config.name;

	let existing_anchor,
	    old_anchors,
	    new_anchors;
	
	if (type == 'input') {
		old_anchors = this.old_inputs;
		new_anchors = this.custom_inputs;
		existing_anchor = this.node.getInput(name);
	} else if (type == 'output') {
		old_anchors = this.old_outputs;
		new_anchors = this.custom_outputs;
		existing_anchor = this.node.getOutput(name);
	} else {
		// Unknown anchor type
		return;
	}

	// If the anchor already exists, see if we can keep it
	if (existing_anchor) {

		let old_config = old_anchors[name];

		if (Object.alike(old_config, config)) {
			if (type == 'input') {
				this.custom_inputs[name] = this.old_inputs[name];
			} else if (type == 'output') {
				this.custom_outputs[name] = this.old_outputs[name];
			}

			return;
		} else {
			if (type == 'input') {
				this.node.removeInput(name);
			} else {
				this.node.removeOutput(name);
			}
		}
	}

	if (!config.type) {
		config.type = 'boolean';
	}

	if (type == 'input') {
		this.node.addInput(config);
		this.custom_inputs[name] = config;
	} else if (type == 'output') {
		this.node.addOutput(config);
		this.custom_outputs[name] = config;
	}
});

/**
 * Add a custom IO input
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.3.0
 * @version  0.3.0
 */
Component.setMethod(function addCustomInput(config) {
	this._addCustomAnchor('input', config);
});

/**
 * Add a custom IO output
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.3.0
 * @version  0.3.0
 */
Component.setMethod(function addCustomOutput(config) {
	this._addCustomAnchor('output', config);
});

/**
 * Get the input config
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 *
 * @param    {String}   name     The input anchor name
 */
Component.setMethod(function getInput(name) {

	if (this.custom_inputs && this.custom_inputs[name]) {
		return this.custom_inputs[name];
	}

	return this.constructor.inputs.get(name);
});

/**
 * Add the schema config button
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.3.0
 * @version  0.3.0
 */
Component.setMethod(function addSchemaConfigButton() {

	let button = this.node.createElement('button');
	button.classList.add('btn');
	button.classList.add('btn-primary');
	button.textContent = 'Config';

	button.addEventListener('click', e => {
		e.preventDefault();

		console.log('Clicked on', this);
		this.openConfigGui();
	});

	this.node.buttons_element.append(button);
});

/**
 * Load the configuration GUI
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.2.1
 * @version  0.4.0
 */
Component.setMethod(async function openConfigGui() {

	const fv_node = this.node,
	      that = this;

	let schema = this.constructor.schema,
	    alchemy_flow = fv_node.queryParents('al-flow');

	let settings = alchemy_flow.getComponentSettings(fv_node.uid);

	if (!settings) {
		settings = this.config.settings;
	}

	// Create a shallow clone of the settings
	settings = Object.assign({}, settings);

	let alchemy_field = fv_node.queryParents('al-field[field-type="flow"]');

	if (alchemy_field && alchemy_field.alchemy_form) {
		// Add the root document to the settings object.
		// We can do this because it's a shallow clone.
		settings.root_document = alchemy_field.alchemy_form.document;

		if (settings.root_document) {
			settings.root_id = settings.root_document.$pk;
		}
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

			// This only sets the config inside the raw data of this component
			alchemy_flow.setComponentSettings(fv_node.uid, value);

			// So we have to set this component's instance settings too
			that.settings = value;

			dialog.close();

			that.refresh();
		});
	});
});

if (Blast.isBrowser) {
	Blast.once('hawkejs_init', function gotScene(hawkejs, variables, settings, view) {

		const component_info = hawkejs.scene.exposed.flow_component_info;

		for (let name in component_info) {
			let info = component_info[name];
			let ComponentClass = Component.getClass(name);
			ComponentClass.schema = info.schema;
			ComponentClass.categories = info.categories;
			ComponentClass.type_name = info.type_name;
			ComponentClass.inputs = info.inputs;
			ComponentClass.outputs = info.outputs;
		}
	});
}