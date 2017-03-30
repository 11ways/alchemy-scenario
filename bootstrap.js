// Add the dashboard to the menu deck
alchemy.plugins.chimera.menu.set('scenarios', {
	title: 'Scenarios',
	route: 'chimera@ActionLink',
	parameters: {
		controller: 'scenario',
		action: 'index'
	},
	icon: {svg: 'connection'}
});