(function() {
	/*
	 Copyright (C) 2011-2012 Typesafe, Inc <http://typesafe.com>
	 */
	var ChartConstraints;
	ChartConstraints = (function() {
		function ChartConstraints(settings) {
			this.extendSettings(settings);
		}
		ChartConstraints.prototype.extendSettings = function(settings) {
			return this.settings = $.extend({
				xMin: 0,
				xMax: 15,
				xStep: 5,
				xUnit: '',
				xUnitScaleThreshold: 0,
				yMin: 0,
				yMax: 5,
				yStep: 1,
				yUnit: '',
				graphPad: {
					top: 0,
					right: 0,
					bottom: 0,
					left: 0
				}
			}, window.GRID_PARAMS, this.settings, settings);
		};
		ChartConstraints.prototype.getBoundX = function() {
			var xBounds;
			xBounds = {
				min: this.settings.xMin,
				max: this.settings.xMax,
				step: this.settings.xStep,
				unit: this.settings.xUnit,
				scale: 1
			};
			if (this.settings.xUnitScaleThreshold > 0) {
				xBounds.scale = 1;
				if (xBounds.max / 1440 >= this.settings.xUnitScaleThreshold) {
					xBounds.scale = 1 / 1440;
					xBounds.unit = 'd';
				} else if (xBounds.max / 60 >= this.settings.xUnitScaleThreshold) {
					xBounds.scale = 1 / 60;
					xBounds.unit = 'h';
				}
				if (xBounds.scale !== 1) {
					xBounds.min = xBounds.min * xBounds.scale;
					xBounds.max = xBounds.max * xBounds.scale;
					xBounds.step = Math.max(Math.floor(xBounds.step * xBounds.scale), 1);
				}
			}
			return xBounds;
		};
		ChartConstraints.prototype.getBoundY = function() {
			return {
				min: this.settings.yMin,
				max: this.settings.yMax,
				step: this.settings.yStep,
				unit: this.settings.yUnit
			};
		};
		ChartConstraints.prototype.getGraphPad = function() {
			return this.settings.graphPad;
		};
		ChartConstraints.prototype.getTimeWindow = function() {
			return this.settings.xMax * 60 * 1000;
		};
		return ChartConstraints;
	})();
	window.ChartConstraints = ChartConstraints;
}).call(this);