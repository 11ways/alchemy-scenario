const Scenario = Hawkejs.Model.getClass('Scenario');

/**
 * Get component data
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 *
 * @return   {Object}
 */
Scenario.setDocumentMethod(function getComponent(node_uid) {

	if (!this.components || !this.components.length) {
		return;
	}

	let component;

	for (component of this.components) {
		if (component.uid == node_uid) {
			return component;
		}
	}
});
