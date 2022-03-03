alchemy.usePlugin('flowview');

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

let chimera_section = Router.section('chimera', '/' + alchemy.plugins.chimera.base_path);

// Editor index action
chimera_section.add({
	name       : 'Chimera.Scenario#index',
	methods    : 'get',
	paths      : '/scenario/index',
	breadcrumb : 'chimera.scenario.index'
});
