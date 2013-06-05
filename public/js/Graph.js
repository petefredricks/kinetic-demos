(function() {
	/*
	 Copyright (C) 2011-2012 Typesafe, Inc <http://typesafe.com>
	 */
	var Graph;
	var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
		for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
		function ctor() { this.constructor = child; }
		ctor.prototype = parent.prototype;
		child.prototype = new ctor;
		child.__super__ = parent.prototype;
		return child;
	};
	Graph = (function() {
		__extends(Graph, ChartComponent);
		function Graph(settings) {
			this.settings = $.extend({
				fill: null,
				lineWidth: 1,
				lineColor: 'rgb(116,174,225)',
				shadowColor: 'rgb(116,174,225)',
				shadowBlur: 3,
				pushConstraints: true,
				animated: true,
				withHover: false,
				smooth: 3
			}, settings);
		}
		Graph.prototype.points = [];
		Graph.prototype.setPoints = function(points) {
			this.points = points;
			return this.chart.refresh();
		};
		Graph.prototype.setHover = function(hoverPosition, e) {
			var boundY, noHover, pad, t, time, v, x;
			this.hoverPosition = hoverPosition;
			noHover = false;
			if (this.hoverPosition) {
				pad = this.constraints.getGraphPad();
				boundY = this.constraints.getBoundY();
				x = this.hoverPosition.x - pad.left;
				this.hoverPoint = this.getDataPointForX(1 - x / this.w);
				if (this.hoverPoint && this.hoverPoint[1] !== void 0) {
					v = this.hoverPoint[1];
					t = new Date(this.hoverPoint[0]);
					time = format.formatDate(t) + ' ' + format.formatTime(t);
					if (boundY.unit === (String.fromCharCode(0xB5) + "s") && v > 1000) {
						v = (v / 1000).toFixed(1);
						boundY.unit = "ms";
					}
					if (boundY.unit === "ms" && v > 1000) {
						v = (v / 1000).toFixed(2);
						boundY.unit = "s";
					}
					if ((this.hoverPoint[1] + "").indexOf('.') > 0) {
						v = format.shorten('' + this.hoverPoint[1]);
					}
					hoverPopup.text(v + (!boundY.unit ? '' : ' ' + boundY.unit) + ' - ' + time).position(e.clientX, e.clientY).show();
				} else {
					noHover = true;
				}
			} else {
				noHover = true;
			}
			if (noHover && this.hoverPoint !== null) {
				this.hoverPoint = null;
				return hoverPopup.hide();
			}
		};
		Graph.prototype.getDataPointForX = function(x) {
			var i;
			if (!this.data) {
				return;
			}
			i = 0;
			x = x * this.constraints.getTimeWindow();
			x = this.data[this.data.length - 1][0] - x;
			while (i < this.data.length && this.data[i][0] < x) {
				++i;
			}
			if (i === this.data.length) {
				return;
			} else {
				return this.data[i];
			}
		};
		Graph.prototype.setData = function(data) {
			var d, lastTimestamp, maxY, minY, stepY, t, _i, _len;
			if (data.length === 0) {
				return;
			}
			this.data = data;
			lastTimestamp = this.data[this.data.length - 1][0];
			this.startAtTimestamp = lastTimestamp - this.constraints.getTimeWindow();
			this.endAtTimestamp = lastTimestamp;
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
			for (_i = 0, _len = data.length; _i < _len; _i++) {
				d = data[_i];
				t.push([this.getX(d[0]), this.getY(d[1])]);
			}
			return this.setPoints(t);
		};
		Graph.prototype.getX = function(value) {
			return (value - this.startAtTimestamp) / this.constraints.getTimeWindow();
		};
		Graph.prototype.getY = function(value) {
			var yBound;
			yBound = this.constraints.getBoundY();
			return 1 - (value / yBound.max);
		};
		Graph.prototype.getMaxY = function() {
			var data, niceMax, vector, _i, _len, _ref;
			data = [];
			_ref = this.data;
			for (_i = 0, _len = _ref.length; _i < _len; _i++) {
				vector = _ref[_i];
				data.push(vector[1]);
			}
			niceMax = findNiceYMax(data, this.settings.smooth);
			if (niceMax === 0) {
				return 10;
			} else {
				return niceMax;
			}
		};
		Graph.prototype.transform = function(c) {
			var pad;
			pad = this.constraints.getGraphPad();
			c.translate(pad.left, pad.top);
			this.w = c.canvas.width - pad.left - pad.right;
			this.h = c.canvas.height - pad.bottom - pad.top;
			c.beginPath();
			c.rect(0, 0, this.w, this.h);
			return c.clip();
		};
		Graph.prototype.needRefresh = function() {
			return this.hoverPoint !== this.lastHoverPointDraw;
		};
		Graph.prototype.draw = function(c, p) {
			var hoverPoint, lastHeight, lastWidth, r, vector, w, x, y, _i, _len, _ref;
			if (this.points.length === 0) {
				return;
			}
			hoverPoint = this.lastHoverPointDraw = this.hoverPoint;
			lastWidth = p * this.w;
			lastHeight = this.h;
			c.lineWidth = this.settings.lineWidth;
			c.strokeStyle = this.settings.lineColor;
			if (this.settings.shadowBlur) {
				c.shadowColor = this.settings.shadowColor || this.settings.lineColor;
				c.shadowBlur = this.settings.shadowBlur;
			}
			if (lastWidth > this.w * this.points[0][0]) {
				c.beginPath();
				c.moveTo(this.w * this.points[0][0], this.h * this.points[0][1]);
				_ref = this.points;
				for (_i = 0, _len = _ref.length; _i < _len; _i++) {
					vector = _ref[_i];
					w = this.w * vector[0];
					lastHeight = this.h * vector[1];
					if (this.settings.animated && w > lastWidth) {
						break;
					}
					c.lineTo(w, lastHeight);
				}
				c.lineTo(lastWidth + c.lineWidth, lastHeight);
				c.stroke();
				c.shadowBlur = 0;
				if (this.settings.fill) {
					c.lineTo(lastWidth + c.lineWidth, lastHeight);
					c.lineTo(lastWidth + c.lineWidth, this.h);
					c.lineTo(this.w * this.points[0][0], this.h);
					c.fillStyle = this.settings.fill;
					c.fill();
				}
			}
			if (this.settings.animated && p < 1) {
				c.fillStyle = this.settings.lineColor;
				c.globalCompositionOperation = 'lighter';
				c.shadowColor = this.settings.lineColor;
				c.shadowBlur = 4;
				r = 2;
				x = lastWidth;
				y = lastHeight;
				c.beginPath();
				c.arc(x, y, r, 0, Math.PI * 2, false);
				return c.fill();
			} else if (hoverPoint) {
				c.fillStyle = this.settings.lineColor;
				c.globalCompositionOperation = 'lighter';
				c.shadowColor = this.settings.lineColor;
				c.shadowBlur = 4;
				r = 3;
				x = this.w * this.getX(hoverPoint[0]);
				y = this.h * this.getY(hoverPoint[1]);
				c.beginPath();
				c.arc(x, y, r, 0, Math.PI * 2, false);
				c.fill();
				c.shadowBlur = 0;
				c.globalAlpha = 0.2;
				return c.fillRect(x, 0, 1, this.h);
			}
		};
		return Graph;
	})();
	window.Graph = Graph;
}).call(this);