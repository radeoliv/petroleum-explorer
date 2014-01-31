Seng515PetroleumExplorer.OilwellEditController = Ember.ObjectController.extend({
	needs:   "oilwell",
	actions: {
		save: function () {
			self = this
			this.get("buffer").forEach(function (attr) {
				self.get("controllers.oilwell.model").set(attr.key, attr.value);
			});
			this.transitionToRoute("oilwell", this.get("model"));
		}
	}
});

