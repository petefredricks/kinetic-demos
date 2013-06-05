(function() {
	/*
	 Copyright (C) 2011-2012 Typesafe, Inc <http://typesafe.com>
	 */
	var Scatter;
	var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
		for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
		function ctor() { this.constructor = child; }
		ctor.prototype = parent.prototype;
		child.prototype = new ctor;
		child.__super__ = parent.prototype;
		return child;
	};
	Scatter = (function() {
		__extends(Scatter, ChartComponent);
		Scatter.prototype.sampledColors = ["#33EA1A", "#34EA1A", "#36EA1A", "#37EA1A", "#38EA19", "#39EB19", "#3BEB19", "#3CEB19", "#3DEB19", "#3EEB19", "#40EB19", "#41EB19", "#42EB18", "#43EB18", "#45EB18", "#46EC18", "#47EC18", "#49EC18", "#4AEC18", "#4BEC18", "#4CEC17", "#4EEC17", "#4FEC17", "#50EC17", "#51ED17", "#53ED17", "#54ED17", "#55ED16", "#56ED16", "#58ED16", "#59ED16", "#5AED16", "#5CED16", "#5DED16", "#5EEE16", "#5FEE15", "#61EE15", "#62EE15", "#63EE15", "#64EE15", "#66EE15", "#67EE15", "#68EE15", "#69EF14", "#6BEF14", "#6CEF14", "#6DEF14", "#6FEF14", "#70EF14", "000000", "#72EF13", "#74EF13", "#75EF13", "#76F013", "#77F013", "#79F013", "#7AF013", "000000", "#7CF012", "#7EF012", "#7FF012", "#80F012", "#82F112", "#83F112", "#84F112", "#85F112", "#87F111", "#88F111", "#89F111", "#8AF111", "#8CF111", "#8DF111", "#8EF211", "#8FF210", "#91F210", "#92F210", "#93F210", "#95F210", "#96F210", "#97F210", "#98F210", "#9AF30F", "#9BF30F", "#9CF30F", "#9DF30F", "#9FF30F", "#A0F30F", "#A1F30F", "#A3F30F", "#A4F30E", "#A5F40E", "#A6F40E", "#A8F40E", "#A9F40E", "#AAF40E", "#ABF40E", "#ADF40D", "#AEF40D", "#AFF40D", "#B0F40D", "#B2F50D", "#B3F50D", "#B4F50D", "#B6F50D", "#B7F50C", "#B8F50C", "#B9F50C", "#BBF50C", "#BCF50C", "#BDF60C", "#BEF60C", "#C0F60C", "#C1F60B", "#C2F60B", "#C3F60B", "#C5F60B", "#C6F60B", "#C7F60B", "#C9F60B", "#CAF70A", "#CBF70A", "#CCF70A", "#CEF70A", "#CFF70A", "#D0F70A", "#D1F70A", "#D3F70A", "#D4F709", "#D5F809", "#D6F809", "#D8F809", "#D9F809", "#DAF809", "#DCF809", "#DDF809", "#DEF808", "#DFF808", "#E1F808", "#E2F908", "#E3F908", "#E4F908", "#E6F908", "#E7F907", "#E8F907", "#E9F907", "#EBF907", "#ECF907", "#EDFA07", "#EFFA07", "#F0FA07", "#F1FA06", "#F2FA06", "#F4FA06", "#F5FA06", "#F6FA06", "#F7FA06", "#F9FA06", "#FAFB06", "#FBFB05", "#FCFB05", "#FEFB05", "#FFFB05"];
		function Scatter(settings) {
			this.settings = $.extend({
				dotColor: 'rgb(116,174,225)',
				pushConstraints: true,
				font: '400 10px "Ubuntu Mono", monospace',
				animated: true,
				withHover: false,
				smooth: 3,
				maxSampled: 1000
			}, settings);
		}
		Scatter.prototype.points = [];
		Scatter.prototype.setPoints = function(points) {
			this.points = points;
			return this.chart.refresh();
		};
		Scatter.prototype.setHover = function(hoverPosition, e) {
			var boundY, noHover, pad, t, time, x;
			this.hoverPosition = hoverPosition;
			noHover = false;
			if (this.hoverPosition) {
				pad = this.constraints.getGraphPad();
				boundY = this.constraints.getBoundY();
				x = this.hoverPosition.x - pad.left;
				this.hoverPoint = this.getDataPointForX(1 - x / this.w);
				if (this.hoverPoint && this.hoverPoint[1] !== void 0) {
					t = new Date(this.hoverPoint[0]);
					time = format.formatDate(t) + ' ' + format.formatTime(t);
					hoverPopup.text(time).position(e.clientX, e.clientY).show();
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
		Scatter.prototype.getDataPointForX = function(x) {
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
		Scatter.prototype.setData = function(data) {
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
				t.push([this.getX(d[0]), this.getY(d[1]), d[2]]);
			}
			return this.setPoints(t);
		};
		Scatter.prototype.getX = function(value) {
			return (value - this.startAtTimestamp) / this.constraints.getTimeWindow();
		};
		Scatter.prototype.getY = function(value) {
			var yBound;
			yBound = this.constraints.getBoundY();
			return 1 - (value / yBound.max);
		};
		Scatter.prototype.getMaxY = function() {
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
		Scatter.prototype.transform = function(c) {
			var pad;
			pad = this.constraints.getGraphPad();
			c.translate(pad.left, pad.top);
			this.w = c.canvas.width - pad.left - pad.right;
			this.h = c.canvas.height - pad.bottom - pad.top;
			c.beginPath();
			c.rect(0, 0, this.w, this.h);
			return c.clip();
		};
		Scatter.prototype.needRefresh = function() {
			return this.hoverPoint !== this.lastHoverPointDraw;
		};
		Scatter.prototype.draw = function(c, p) {
			var foundSampled, foundSampledColor, hoverPoint, lastHeight, lastWidth, maxSampled, r, sampled, sampledColor, sampledColorsIndex, vector, w, x, y, _i, _len, _ref;
			if (this.points.length === 0) {
				return;
			}
			hoverPoint = this.lastHoverPointDraw = this.hoverPoint;
			lastWidth = p * this.w;
			lastHeight = this.h;
			if (lastWidth > this.w * this.points[0][0]) {
				c.shadowBlur = 0;
				maxSampled = this.settings.maxSampled;
				foundSampled = 0;
				_ref = this.points;
				for (_i = 0, _len = _ref.length; _i < _len; _i++) {
					vector = _ref[_i];
					w = this.w * vector[0];
					lastHeight = this.h * vector[1];
					if (this.settings.animated && w > lastWidth) {
						break;
					}
					if (vector[2] != null) {
						sampled = Math.min(vector[2], maxSampled);
						sampledColorsIndex = Math.floor((this.sampledColors.length - 1) * sampled / maxSampled);
						sampledColor = this.sampledColors[sampledColorsIndex];
						c.fillStyle = sampledColor;
						if (sampled > foundSampled) {
							foundSampled = sampled;
							foundSampledColor = sampledColor;
						}
					} else {
						c.fillStyle = this.settings.dotColor;
					}
					c.fillRect(w, lastHeight, 1, 1);
				}
				if (foundSampled > 0) {
					c.font = this.settings.font;
					c.fillStyle = foundSampledColor;
					c.fillText("sampled: " + foundSampled, 20, 10);
				}
				c.stroke();
			}
			if (this.settings.animated && p < 1) {
				c.fillStyle = this.settings.dotColor;
				c.globalCompositionOperation = 'lighter';
				c.shadowColor = this.settings.dotColor;
				c.shadowBlur = 4;
				r = 2;
				x = lastWidth;
				y = lastHeight;
				c.beginPath();
				c.arc(x, y, r, 0, Math.PI * 2, false);
				return c.fill();
			} else if (hoverPoint) {
				c.fillStyle = this.settings.dotColor;
				c.globalCompositionOperation = 'lighter';
				x = this.w * this.getX(hoverPoint[0]);
				c.beginPath();
				c.shadowBlur = 0;
				c.globalAlpha = 0.2;
				return c.fillRect(x, 0, 1, this.h);
			}
		};
		return Scatter;
	})();
	window.Scatter = Scatter;
}).call(this);