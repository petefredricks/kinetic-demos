(function() {
	/*
	 Copyright (C) 2011-2012 Typesafe, Inc <http://typesafe.com>
	 */
	var Histogram;
	var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
		for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
		function ctor() { this.constructor = child; }
		ctor.prototype = parent.prototype;
		child.prototype = new ctor;
		child.__super__ = parent.prototype;
		return child;
	};
	Histogram = (function() {
		__extends(Histogram, ChartComponent);
		function Histogram(settings) {
			this.settings = $.extend({
				number: 10,
				bgColor: 'rgba(64, 159, 221, 0.04)',
				color: 'rgba(50,234,24,0.5)',
				boundaries: [],
				pushConstraints: true
			}, settings);
		}
		Histogram.prototype.setValues = function(values) {
			this.values = values;
			return this.chart.refresh();
		};
		Histogram.prototype.setHover = function(hoverPosition, e) {
			var boundY, i, interval, noHover, pad, x;
			this.hoverPosition = hoverPosition;
			noHover = false;
			if (this.hoverPosition) {
				pad = this.constraints.getGraphPad();
				boundY = this.constraints.getBoundY();
				x = this.hoverPosition.x - pad.left;
				i = Math.round(this.settings.number * x / this.w);
				if (this.data && this.data.length + 1 > this.settings.number) {
					i += this.data.length - this.settings.number - 1;
				}
				this.hoverIndex = i;
				if (this.data !== void 0 && this.data[i] !== void 0) {
					if (i === 0) {
						interval = '0 - ' + this.settings.boundaries[0];
					} else if (i === this.settings.boundaries.length) {
						interval = ' > ' + this.settings.boundaries[i - 1];
					} else {
						interval = '' + this.settings.boundaries[i - 1] + ' - ' + this.settings.boundaries[i];
					}
					hoverPopup.text('' + this.data[i] + ' [' + interval + '] ' + String.fromCharCode(0xB5) + 's').position(e.clientX, e.clientY).show();
				} else {
					noHover = true;
				}
			} else {
				noHover = true;
			}
			if (noHover && this.hoverIndex !== void 0) {
				this.hoverIndex = void 0;
				return hoverPopup.hide();
			}
		};
		Histogram.prototype.setData = function(data) {
			var d, maxY, minY, stepY, t, _i, _len, _ref;
			this.data = data;
			if (this.settings.pushConstraints) {
				minY = 0;
				maxY = this.getMaxY();
				stepY = findNiceRoundScale(minY, maxY, 4);
				this.constraints.extendSettings({
					yMax: maxY,
					yMin: minY,
					yStep: stepY
				});
			}
			t = [];
			_ref = this.data;
			for (_i = 0, _len = _ref.length; _i < _len; _i++) {
				d = _ref[_i];
				t.push(d === void 0 ? void 0 : this.getY(d));
			}
			return this.setValues(t);
		};
		Histogram.prototype.getY = function(value) {
			var yBound;
			yBound = this.constraints.getBoundY();
			return 1 - (value / yBound.max);
		};
		Histogram.prototype.xToRealX = function(x, w, xBound) {
			return w * ((xBound.max - x) / (xBound.max - xBound.min));
		};
		Histogram.prototype.getMaxY = function() {
			return findNiceYMax(this.data, 1, 1.3);
		};
		Histogram.prototype.transform = function(c) {
			var pad;
			pad = this.constraints.getGraphPad();
			c.translate(pad.left, pad.top);
			this.w = c.canvas.width - pad.left - pad.right;
			return this.h = c.canvas.height - pad.bottom - pad.top;
		};
		Histogram.prototype.needRefresh = function() {
			return this.hoverIndex !== this.lastHoverPointDraw;
		};
		Histogram.prototype.draw = function(c, p) {
			var barW, dx, dxReal, hoverIndex, i, progress, realX, realY, tab, x, xBound, _ref, _ref2, _results;
			if (!this.values) {
				return;
			}
			hoverIndex = this.lastHoverPointDraw = this.hoverIndex;
			xBound = this.constraints.getBoundX();
			tab = this.values;
			dx = (xBound.max - xBound.min) / this.settings.number;
			dxReal = Math.abs(this.xToRealX(1, this.w, xBound) - this.xToRealX(1 + dx, this.w, xBound));
			barW = Math.floor(dxReal);
			p = EasingFunctions.easeOutQuad(p);
			x = 0;
			_results = [];
			for (i = _ref = tab.length, _ref2 = tab.length - this.settings.number; _ref <= _ref2 ? i <= _ref2 : i >= _ref2; _ref <= _ref2 ? i++ : i--) {
				if (tab[i] !== void 0) {
					realX = Math.floor(this.xToRealX(x, this.w, xBound) - barW);
					progress = Math.max(0, Math.min(2 * p - (i + 1) / this.settings.number, 1));
					realY = tab[i] * this.h + (1 - progress) * (1 - tab[i]) * this.h;
					if (this.settings.bgColor) {
						c.fillStyle = this.settings.bgColor;
						c.fillRect(realX, 0, barW, realY - 4);
					}
					c.fillStyle = this.settings.color;
					c.fillRect(realX, realY, barW, this.h - realY);
					if (i === hoverIndex) {
						c.save();
						c.fillStyle = 'rgba(255,255,255,0.5)';
						c.globalCompositionOperation = 'ligher';
						c.fillRect(realX, realY, barW, this.h - realY);
						c.restore();
					}
					_results.push(x += dx);
				}
			}
			return _results;
		};
		return Histogram;
	})();
	window.Histogram = Histogram;
}).call(this);