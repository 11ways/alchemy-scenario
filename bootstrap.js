alchemy.usePlugin('@11ways/flowview');

Router.add({
	name       : 'Scenario#components',
	methods    : 'get',
	paths      : '/api/scenario/components',
});

Router.add({
	name       : 'Scenario#configureComponent',
	methods    : 'get',
	paths      : '/scenario/components/configure',
});

let chimera_section = Router.subSections['chimera'];

if (!chimera_section) {
	return;
}

// Editor index action
chimera_section.add({
	name       : 'Chimera.Scenario#index',
	methods    : 'get',
	paths      : '/scenario/index',
	breadcrumb : 'chimera.scenario.index'
});
