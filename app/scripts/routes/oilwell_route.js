Seng515PetroleumExplorer.OilwellRoute = Ember.Route.extend({
	model: function (params) {
		return this.get("store").find("oilwell", params.oilwell_id);
	}
});

