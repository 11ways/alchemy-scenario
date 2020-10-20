/**
 * The alchemy-scenario element
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
var Scenario = Function.inherits('Alchemy.Element', function AlchemyScenario() {
	AlchemyScenario.super.call(this);
});

/**
 * The template to use for the content of this element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
Scenario.setTemplateFile('elements/alchemy_scenario');

/**
 * The stylesheet to load for this element
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Scenario.setStylesheetFile('element/scenario');

/**
 * Component data
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Scenario.setAssignedProperty('components', null, function setComponents(value) {
	return value;
});

/**
 * Buttons wrapper
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
Scenario.addElementGetter('buttons_element', '.scenariobuttons');

/**
 * Fv-Grid element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
Scenario.addElementGetter('grid_element', 'fv-grid');

/**
 * The record id
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
Scenario.setAttribute('scenario-id');

/**
 * Get/set the value
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
Scenario.setProperty(function value() {
	return this.grid_element.value;
}, function setValue(value) {

	if (this.grid_element) {
		this.grid_element.value = value;
	}

	this.assigned_data.value = value;
});

/**
 * Load the configuration GUI of a node
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 *
 * @param    {FV-Node}   fv_node
 */
Scenario.setStatic(async function configureNode(fv_node) {

	let schema = fv_node.assigned_data.config.schema,
	    scenario = fv_node.queryParents('alchemy-scenario');

	let component_data = scenario.assigned_data.value.getComponent(fv_node.uid),
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

			component_data.settings = value;
		});
	});
});

/**
 * Set the buttons
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.2.0
 */
Scenario.setMethod(function setButtons() {

	var that = this,
	    save,
	    key;

	// Empty out the scenariobuttons
	Hawkejs.removeChildren(this.buttons_element);

	// Create a save button
	save = this.createElement('button');
	save.innerText = 'Save';
	save.classList.add('btn');
	save.classList.add('btn-success');

	// Listen for the save click
	save.addEventListener('click', function onClick(e) {
		e.preventDefault();
		that.save();
	});

	let start = this.createElement('button');
	start.innerText = 'Start';
	start.classList.add('btn');
	start.classList.add('btn-primary');

	// Listen for the start click
	start.addEventListener('click', function onClick(e) {
		e.preventDefault();
		that.start();
	});

	// Add the save button
	this.buttons_element.appendChild(save);
	this.buttons_element.appendChild(start);
});

/**
 * Save this scenario
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Function}   callback
 */
Scenario.setMethod(function save(callback) {

	var config,
	    data,
	    url;

	config = {
		controller: 'Scenario',
		action: 'save',
		id: this.scenario_id
	};

	// Construct the url to save to
	url = hawkejs.scene.helpers.Router.routeUrl('chimera@IdActionLink', config);

	let components = this.grid_element.value,
	    component,
	    entry;

	for (component of components) {

		for (entry of this.assigned_data.value.components) {
			if (entry.uid == component.uid) {
				component.settings = entry.settings;
				break;
			}
		}
	}

	// Get the data
	data = {
		components: components,
	};

	hawkejs.scene.fetch(url, {post: {scenario: data}}, function gotResponse(err, res) {
		if (err) {
			return console.error('Failed to save:', err);
		}
	});
});

/**
 * Start this scenario
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.2.0
 * @version  0.2.0
 */
Scenario.setMethod(function start() {

	var config,
	    data,
	    url;

	config = {
		controller: 'Scenario',
		action: 'start',
		id: this.scenario_id
	};

	// Construct the url to save to
	url = hawkejs.scene.helpers.Router.routeUrl('chimera@IdActionLink', config);

	// Get the data
	data = {};

	hawkejs.scene.fetch(url, {post: {scenario: data}}, function gotResponse(err, res) {
		if (err) {
			return console.error('Failed to start:', err);
		}
	});
});

/**
 * Get all child blocks
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @return   {Array}
 */
Scenario.setMethod(function getBlocks() {
	return this.getElementsByNodeName('alchemy-scenario-block');
});

/**
 * Get child block by id
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Scenario.setMethod(function getBlock(id) {
	return document.getElementById(id);
});

/**
 * Set the scenario record
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Scenario.setMethod(function setRecord(record) {

	var that = this,
	    blocks,
	    block,
	    i;

	// Store the scenario data
	this.data = record.Scenario;

	// Set the id
	this.id = this.data._id;

	// Store the blocks
	this.blocks = this.data.blocks || [];

	// Add all the blocks
	for (i = 0; i < this.blocks.length; i++) {
		this.addBlock(this.blocks[i]);
	}

	// Get all the added blocks
	blocks = this.getElementsByNodeName('alchemy-scenario-block');

	// Initialize the connections (only after all the blocks have been added)
	for (i = 0; i < blocks.length; i++) {
		block = blocks[i];
		block.initializeConnections();
	}

	// Listen for new connections
	this.jsPlumb.bind('connection', function onConnection(connInfo, originalEvent) {
		that.attachConnection(connInfo);
	});

	// Listen for deletec connections
	this.jsPlumb.bind('connectionDetached', function onDetach(connInfo, originalEvent) { 
		that.detachConnection(connInfo);
	});
});

/**
 * Added to the DOM for the first time
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
Scenario.setMethod(function introduced() {
	this.setButtons();

	if (this.assigned_data.value) {
		if (this.assigned_data.value._id) {
			this.grid_element.grid_id = this.assigned_data.value._id;
		}
	}

	if (this.assigned_data.components) {
		this.grid_element.components = this.assigned_data.components;
	}

	if (this.assigned_data.value) {
		this.grid_element.value = this.assigned_data.value.components;
	}
});