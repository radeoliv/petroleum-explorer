Seng515PetroleumExplorer.OilwellsRoute = Ember.Route.extend({
	model: function () {
		return this.get("store").find("oilwell");
	}
});

