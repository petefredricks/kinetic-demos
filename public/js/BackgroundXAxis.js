(function() {
	/*
	 Copyright (C) 2011-2012 Typesafe, Inc <http://typesafe.com>
	 */
	var BackgroundXAxis;
	var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
		for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
		function ctor() { this.constructor = child; }
		ctor.prototype = parent.prototype;
		child.prototype = new ctor;
		child.__super__ = parent.prototype;
		return child;
	};
	BackgroundXAxis = (function() {
		__extends(BackgroundXAxis, ChartComponent);
		function BackgroundXAxis(settings) {
			this.settings = $.extend({
				graphPad: {
					top: 0,
					bottom: 0,
					left: 0,
					right: 0
				},
				bgColor: 'rgb(40,40,40)',
				axisBgColor: 'rgb(47,47,47)'
			}, settings);
		}
		BackgroundXAxis.prototype.draw = function(c) {
			var graphPad, w, yBottomGraph;
			graphPad = this.constraints.getGraphPad();
			yBottomGraph = c.canvas.height - graphPad.bottom;
			w = c.canvas.width;
			c.fillStyle = this.settings.bgColor;
			c.fillRect(0, 0, w, yBottomGraph);
			c.fillStyle = this.settings.axisBgColor;
			return c.fillRect(0, yBottomGraph, w, graphPad.bottom);
		};
		return BackgroundXAxis;
	})();
	window.BackgroundXAxis = BackgroundXAxis;
}).call(this);