(function() {
	/*
	 Copyright (C) 2011-2012 Typesafe, Inc <http://typesafe.com>
	 */
	var ChartComponent;
	ChartComponent = (function() {
		function ChartComponent() {}
		ChartComponent.prototype.withConstraints = function(constraints) {
			this.constraints = constraints;
			return this;
		};
		return ChartComponent;
	})();
	window.ChartComponent = ChartComponent;
}).call(this);