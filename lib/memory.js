/**
 * The Scenario Memory class
 *
 * @constructor
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
const Memory = Function.inherits('Alchemy.Base', 'Alchemy.Scenario', function Memory() {
	this.values = new Map();
	this.sub_memories = new Map();
});

/**
 * Set a value
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.2.0
 * @version  0.2.0
 *
 * @param    {String}   name
 * @param    {*}        value
 */
Memory.setMethod(function getEntry(name) {

	if (typeof name != 'string') {
		name = String(name);
	}

	return this.values.get(name);
});

/**
 * Set a value
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.2.0
 * @version  0.2.0
 *
 * @param    {String}   name
 * @param    {*}        value
 */
Memory.setMethod(function set(name, value) {

	if (typeof name != 'string') {
		name = String(name);
	}

	let entry = this.getEntry(name);

	if (!entry) {
		entry = {
			created : Date.now(),
			updated : Date.now(),
			value   : value
		};

		this.values.set(name, entry);
	} else {
		entry.value = value;
		entry.updated = Date.now();
	}

	return entry;
});

/**
 * Get a value
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.2.0
 * @version  0.2.0
 *
 * @param    {String}   name
 */
Memory.setMethod(function get(name) {

	let entry = this.getEntry(name);

	if (entry) {
		return entry.value;
	}
});

/**
 * Get/create sub memory
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.2.0
 * @version  0.2.0
 *
 * @param    {String}   uid
 */
Memory.setMethod(function getSubMemory(uid) {

	if (typeof uid != 'string') {
		uid = String(uid);
	}

	let memory = this.sub_memories.get(uid);

	if (!memory) {
		memory = new Memory();
		this.sub_memories.set(uid, memory);
	}

	return memory;
});