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

if (alchemy.plugins.chimera) {
	// Add the dashboard to the menu deck
	alchemy.plugins.chimera.menu.set('scenarios', {
		title: 'Scenarios',
		route: 'chimera@ActionLink',
		parameters: {
			controller: 'scenario',
			action: 'index'
		},
		icon: {
			fa: 'fas fa-puzzle-piece'
		}
	});
}