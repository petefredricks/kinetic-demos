(function() {
	/*
	 Copyright (C) 2011-2012 Typesafe, Inc <http://typesafe.com>
	 */
	var Line;
	var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
		for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
		function ctor() { this.constructor = child; }
		ctor.prototype = parent.prototype;
		child.prototype = new ctor;
		child.__super__ = parent.prototype;
		return child;
	};
	Line = (function() {
		__extends(Line, Graph);
		function Line(settings) {
			Line.__super__.constructor.call(this, $.extend({
				lineColor: "rgba(234,50,24,0.8)",
				shadowColor: null,
				shadowBlur: 0,
				animated: false
			}, settings, {
				fill: null
			}));
		}
		Line.prototype.setY = function(y) {
			y = this.getY(y);
			return this.setPoints([[0, y], [1, y]]);
		};
		return Line;
	})();
	window.Line = Line;
}).call(this);