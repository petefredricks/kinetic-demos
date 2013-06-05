(function() {
	/*
	 Copyright (C) 2011-2012 Typesafe, Inc <http://typesafe.com>
	 */
	var Spoke;
	var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
		for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
		function ctor() { this.constructor = child; }
		ctor.prototype = parent.prototype;
		child.prototype = new ctor;
		child.__super__ = parent.prototype;
		return child;
	};
	Spoke = (function() {
		__extends(Spoke, ChartComponent);
		function Spoke() {
			Spoke.__super__.constructor.apply(this, arguments);
		}
		Spoke = (function() {
			__extends(Spoke, ChartComponent);
			Spoke.prototype.lengthOffset = [];
			Spoke.prototype.angleOffset = [];
			Spoke.prototype.startOffset = 0;
			function Spoke(settings) {
				this.value = 0;
				this.settings = $.extend({
					radius: 10,
					color: 'rgb(30,30,30)',
					max: 100,
					pointColor: 'rgb(40,40,40)',
					activeColor: 'rgb(80, 130, 155)',
					pointSize: 2,
					innerRadius: 0
				}, settings);
			}
			Spoke.prototype.setValue = function(value, active) {
				var i;
				this.active = active;
				this.old = this.value;
				this.valueDate = +new Date();
				this.value = Math.min(this.settings.max, Math.max(0, value));
				if (this.value !== this.old) {
					for (i = 1; 1 <= value ? i <= value : i >= value; 1 <= value ? i++ : i--) {
						this.lengthOffset.push(~~(Math.random() * 10) - 5);
						this.angleOffset.push((~~(Math.random() * 6) + 3) * (Math.PI / 180));
						this.startOffset = ~~(Math.random() * 360) * (Math.PI / 180);
					}
				}
				return this.chart.refresh();
			};
			Spoke.prototype.transform = function(c) {
				var center, pad;
				pad = this.constraints.getGraphPad();
				center = Math.floor(Math.min(c.canvas.width, c.canvas.height) / 2);
				return c.translate(pad.left + center, pad.top + center);
			};
			Spoke.prototype.draw = function(c, p) {
				var angOff, cosY, cur, drawValue, indx, lenOff, radius, rads, segs, sinX, x, y, _results;
				radius = this.settings.radius;
				c.strokeStyle = this.settings.activeColor;
				c.fillStyle = this.settings.pointColor;
				drawValue = this.value > 200 ? 200 : this.value;
				segs = 360 / drawValue;
				rads = segs * Math.PI / 180;
				cur = this.startOffset;
				indx = 0;
				p = EasingFunctions.easeOutQuad(p);
				_results = [];
				while (indx < drawValue) {
					if (indx >= this.active) {
						c.strokeStyle = this.settings.color;
					}
					cur += rads;
					lenOff = this.lengthOffset[indx] * p;
					angOff = (this.angleOffset[indx] * p) - Math.PI;
					c.lineWidth = 1;
					c.beginPath();
					sinX = Math.sin(cur - Math.PI - angOff);
					cosY = Math.cos(cur - Math.PI - angOff);
					c.moveTo(sinX * this.settings.innerRadius, cosY * this.settings.innerRadius);
					x = sinX * ((radius + lenOff) * p);
					y = cosY * ((radius + lenOff) * p);
					c.lineTo(x, y);
					c.stroke();
					c.lineWidth = 2;
					c.beginPath();
					c.arc(x, y, this.settings.pointSize, 0, Math.PI * 2, false);
					c.fill();
					c.stroke();
					_results.push(indx++);
				}
				return _results;
			};
			window.Spoke = Spoke;
			return Spoke;
		})();
		return Spoke;
	})();
}).call(this);