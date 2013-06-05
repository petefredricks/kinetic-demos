(function() {
	/*
	 Copyright (C) 2011-2012 Typesafe, Inc <http://typesafe.com>
	 */
	var Ring;
	var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
		for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
		function ctor() { this.constructor = child; }
		ctor.prototype = parent.prototype;
		child.prototype = new ctor;
		child.__super__ = parent.prototype;
		return child;
	};
	Ring = (function() {
		__extends(Ring, ChartComponent);
		function Ring(settings) {
			this.settings = $.extend({
				radius: 20,
				width: 10,
				max: 1,
				serrated: 0,
				animationDuration: 1000,
				padding: 0,
				color: 'rgba(50, 140, 220, 1)',
				bgColor: 'rgba(50, 50, 50, 1)',
				paddingColor: 'rgba(160, 224, 255, 1)',
				highlightLighter: 'rgba(255,255,255,0.3)',
				highlightDarker: 'rgba(0,0,0,0.1)'
			}, settings);
		}
		Ring.prototype.setValue = function(value) {
			this.old = this.value;
			this.valueDate = +new Date();
			this.value = Math.min(this.settings.max, Math.max(0, value));
			return this.chart.refresh();
		};
		Ring.prototype.valueDate = +new Date();
		Ring.prototype.value = 1;
		Ring.prototype.old = 1;
		Ring.prototype.isAnimating = function() {
			return +new Date() <= this.valueDate + this.settings.animationDuration;
		};
		Ring.prototype.getAnimationProgress = function() {
			return Math.min(1, (+new Date() - this.valueDate) / this.settings.animationDuration);
		};
		Ring.prototype.needRefresh = function() {
			if (this.highlighted_hasChanged) {
				this.highlighted_hasChanged = false;
				return true;
			}
			return this.isAnimating();
		};
		Ring.prototype.setHighlighted = function(highlighted) {
			this.highlighted = highlighted;
			return this.highlighted_hasChanged = true;
		};
		Ring.prototype.isHover = function(x, y) {
			var hyp2, max2, min2, pad;
			pad = this.constraints.getGraphPad();
			x -= pad.left + this.center;
			y -= pad.top + this.center;
			hyp2 = x * x + y * y;
			max2 = this.settings.radius;
			max2 *= max2;
			min2 = this.settings.radius - this.settings.width;
			min2 *= min2;
			return min2 < hyp2 && hyp2 < max2;
		};
		Ring.prototype.transform = function(c) {
			var pad;
			pad = this.constraints.getGraphPad();
			this.center = Math.floor(Math.min(c.canvas.width, c.canvas.height) / 2);
			return c.translate(pad.left + this.center, pad.top + this.center);
		};
		Ring.prototype.draw = function(c, startProgress) {
			var fromAngle, p, r, ringWidth, toAngle, value, valueAngle;
			p = this.getAnimationProgress();
			p = EasingFunctions.easeOutQuad(p);
			value = this.value * p + (1 - p) * this.old;
			valueAngle = (value / this.settings.max) * 2 * Math.PI;
			fromAngle = 0 - Math.PI / 2;
			toAngle = valueAngle - Math.PI / 2;
			ringWidth = this.settings.width;
			r = this.settings.radius - ringWidth / 2;
			c.lineWidth = ringWidth;
			c.strokeStyle = this.settings.bgColor;
			c.beginPath();
			c.arc(0, 0, r, 0, 2 * Math.PI, false);
			c.stroke();
			if (this.settings.padding) {
				c.lineWidth = ringWidth;
				c.strokeStyle = this.settings.paddingColor;
				c.beginPath();
				c.arc(0, 0, r, fromAngle, toAngle, false);
				c.stroke();
				ringWidth -= 2 * this.settings.padding;
			}
			c.lineWidth = ringWidth;
			c.strokeStyle = this.settings.color;
			c.beginPath();
			c.arc(0, 0, r, fromAngle, toAngle, false);
			c.stroke();
			if (this.highlighted) {
				if (this.settings.padding) {
					ringWidth += 2 * this.settings.padding;
				}
				c.lineWidth = ringWidth;
				c.strokeStyle = this.settings.highlightDarker;
				c.globalCompositeOperation = 'darker';
				c.beginPath();
				c.arc(0, 0, r, 0, 2 * Math.PI, false);
				c.stroke();
				c.strokeStyle = this.settings.highlightLighter;
				c.globalCompositeOperation = 'lighter';
				c.beginPath();
				c.arc(0, 0, r, fromAngle, toAngle, false);
				return c.stroke();
			}
		};
		return Ring;
	})();
	window.Ring = Ring;
}).call(this);