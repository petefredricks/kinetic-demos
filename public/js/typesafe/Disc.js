(function() {
	/*
	 Copyright (C) 2011-2012 Typesafe, Inc <http://typesafe.com>
	 */
	var Disc;
	var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
		for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
		function ctor() { this.constructor = child; }
		ctor.prototype = parent.prototype;
		child.prototype = new ctor;
		child.__super__ = parent.prototype;
		return child;
	};
	Disc = (function() {
		__extends(Disc, ChartComponent);
		function Disc(settings) {
			this.settings = $.extend({
				radius: 10,
				color: 'rgb(30,30,30)',
				shadow: null,
				shrinkFrom: 0
			}, settings);
		}
		Disc.prototype.transform = function(c) {
			var center, pad;
			pad = this.constraints.getGraphPad();
			center = Math.floor(Math.min(c.canvas.width, c.canvas.height) / 2);
			return c.translate(pad.left + center, pad.top + center);
		};
		Disc.prototype.draw = function(c, p) {
			var rad, shadow;
			c.fillStyle = this.settings.color;
			if (this.settings.shadow) {
				shadow = this.settings.shadow;
				c.shadowColor = shadow.color || 'white';
				c.shadowBlur = shadow.blur || 1;
				c.shadowOffsetX = shadow.x || 0;
				c.shadowOffsetY = shadow.y || 0;
			}
			c.beginPath();
			rad = this.settings.shrinkFrom > 0 ? this.settings.shrinkFrom * (1 - p) + 1 : 1;
			c.arc(0, 0, this.settings.radius * rad, 0, Math.PI * 2, false);
			return c.fill();
		};
		return Disc;
	})();
	window.Disc = Disc;
}).call(this);