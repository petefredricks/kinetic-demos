(function() {
	/*
	 Copyright (C) 2011-2012 Typesafe, Inc <http://typesafe.com>
	 */
	var Grid;
	var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
		for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
		function ctor() { this.constructor = child; }
		ctor.prototype = parent.prototype;
		child.prototype = new ctor;
		child.__super__ = parent.prototype;
		return child;
	};
	Grid = (function() {
		__extends(Grid, ChartComponent);
		function Grid(settings) {
			this.settings = $.extend({
				xUnit: null,
				yUnit: null,
				textPad: {
					x: 1,
					y: 2
				},
				largeTextPad: {
					x: 2,
					y: -2
				},
				gridColor: 'rgb(50,50,50)',
				axisLineColor: 'rgb(50,50,50)',
				xAxisNumberColor: 'rgb(140,140,140)',
				yAxisNumberColor: 'rgb(140,140,140)',
				yAxisRight: false,
				yAxisRightPadding: 25,
				font: '400 10px "Droid Sans Mono", monospace',
				largeFont: '400 14px "Droid Sans Mono", monospace',
				largePadding: 30,
				drawX: true,
				histogram: void 0,
				drawY: true,
				drawGrid: true,
				drawTexts: true,
				useMinus: true,
				timestamp: false
			}, settings);
			this.isLarge = false;
		}
		Grid.prototype.xToRealX = function(x, w) {
			var dx, graphPad, xBound;
			graphPad = this.constraints.getGraphPad();
			if (this.settings.isLarge) {
				graphPad.left = this.settings.largePadding;
			}
			xBound = this.constraints.getBoundX();
			dx = xBound.max - xBound.min;
			x = (dx - x) / dx;
			x = graphPad.left + x * (w - graphPad.left - graphPad.right);
			return Math.floor(x);
		};
		Grid.prototype.yToRealY = function(y, h) {
			var dy, graphPad, yBound;
			graphPad = this.constraints.getGraphPad();
			if (this.settings.isLarge) {
				graphPad.left = this.settings.largePadding;
			}
			yBound = this.constraints.getBoundY();
			dy = yBound.max - yBound.min;
			y = (dy - y) / dy;
			y = y * (h - graphPad.bottom);
			return Math.floor(y);
		};
		Grid.prototype.draw = function(c) {
			var binaryLetter, binaryLetters, binaryPow, exp, graphPad, h, i, padding, pow10, textPad, textX, unit, w, x, xBound, xReal, xSteps, y, yBottomGraph, yBound, yReal, ySteps, _i, _j, _k, _len, _len2, _len3;
			graphPad = this.constraints.getGraphPad();
			xBound = this.constraints.getBoundX();
			yBound = this.constraints.getBoundY();
			yBottomGraph = c.canvas.height - graphPad.bottom;
			w = c.canvas.width;
			h = c.canvas.height;
			if (this.settings.isLarge) {
				textPad = this.settings.largeTextPad;
			} else {
				textPad = this.settings.textPad;
			}
			ySteps = [];
			i = 0;
			y = yBound.min;
			while (y <= yBound.max && i < 10) {
				ySteps.push(y);
				y = Math.round(10 * (y + yBound.step)) / 10;
				++i;
			}
			xSteps = [];
			i = 0;
			x = xBound.min;
			while (x <= xBound.max && i < 10) {
				xSteps.push(x);
				x += xBound.step;
				++i;
			}
			if (this.settings.drawX) {
				c.fillStyle = this.settings.xAxisLineColor;
				c.fillRect(0, yBottomGraph, w, 1);
			}
			if (this.settings.drawX) {
				for (_i = 0, _len = xSteps.length; _i < _len; _i++) {
					x = xSteps[_i];
					xReal = this.xToRealX(x, w);
					if (xReal < w - 5) {
						if (this.settings.drawGrid) {
							c.fillStyle = this.settings.gridColor;
							c.fillRect(xReal, 0, 1, yBottomGraph);
						}
						c.fillStyle = this.settings.axisLineColor;
						c.fillRect(xReal, yBottomGraph, 1, 5);
					}
				}
			}
			if (this.settings.drawY) {
				if (this.settings.drawGrid) {
					c.fillStyle = this.settings.gridColor;
					for (_j = 0, _len2 = ySteps.length; _j < _len2; _j++) {
						y = ySteps[_j];
						yReal = this.yToRealY(y, h);
						if (yReal < yBottomGraph) {
							c.fillRect(graphPad.left, yReal, w - graphPad.left, 1);
						}
					}
				}
			}
			if (this.settings.drawTexts) {
				if (this.settings.histogram != null) {
					this.drawHistogramXAxisText(c, textPad, w);
				} else if (this.settings.drawX) {
					this.drawXAxisText(c, textPad, xSteps, w, xBound);
				}
				if (this.settings.drawY) {
					c.fillStyle = this.settings.yAxisNumberColor;
					if (this.settings.yAxisRight) {
						padding = this.settings.yAxisRightPadding;
						c.textAlign = "left";
						x = w + textPad.x - padding;
						textX = w - textPad.x - padding;
					} else {
						c.textAlign = "right";
						x = graphPad.left - textPad.x;
						textX = graphPad.left + textPad.x;
					}
					c.textBaseline = "middle";
					binaryLetters = ["", "k", "M", "G", "T", "P", "E"];
					binaryLetter = "";
					binaryPow = 0;
					if (yBound.step > 100) {
						exp = yBound.step.toExponential(10).split("e");
						pow10 = parseInt(exp[1]);
						binaryPow = Math.max(0, Math.min(binaryLetters.length - 1, Math.floor((pow10 + 1) / 3)));
						binaryLetter = binaryLetters[binaryPow];
					}
					for (_k = 0, _len3 = ySteps.length; _k < _len3; _k++) {
						y = ySteps[_k];
						yReal = this.yToRealY(y, h);
						if (5 < yReal && yReal <= yBottomGraph - 5) {
							if (binaryPow > 0) {
								y = y / Math.pow(10, binaryPow * 3);
							}
							c.fillText(y, x, yReal);
						}
					}
					c.textAlign = this.settings.yAxisRight ? "right" : "left";
					c.textBaseline = "top";
					unit = yBound.unit;
					if (binaryPow > 0) {
						switch (unit) {
							case String.fromCharCode(0xB5) + "s":
								if (binaryPow === 1) {
									binaryPow = 0;
									unit = "ms";
								} else {
									binaryPow -= 2;
									unit = "s";
								}
								break;
							case "ms":
								binaryPower -= 2;
								unit = "s";
						}
						binaryLetter = binaryLetters[binaryPow];
					}
					unit = binaryLetter !== "" ? binaryLetter + " " + unit : unit;
					return c.fillText(unit, textX, textPad.y);
				}
			}
		};
		Grid.prototype.drawHistogramXAxisText = function(c, textPad, w) {
			var bottom, boundaries, boundary, cnt, stepper, useSmartStepping, xReal, _i, _len, _results;
			if (this.settings.isLarge) {
				c.font = this.settings.largeFont;
			} else {
				c.font = this.settings.font;
			}
			c.fillStyle = this.settings.xAxisNumberColor;
			c.textAlign = "center";
			c.textBaseline = "bottom";
			bottom = c.canvas.height - textPad.y;
			stepper = 2;
			useSmartStepping = true;
			boundaries = this.settings.histogram.settings.boundaries;
			cnt = boundaries.length;
			if (boundaries.length > 10) {
				c.fillText("0", this.xToRealX(cnt + 1, w), bottom);
				if ($(window).width() < 1600) {
					stepper = 4;
				}
			} else {
				c.fillText("0", this.xToRealX(cnt + 1, w), bottom);
				if ($(window).width() < 1350) {
					stepper = 2;
				} else {
					useSmartStepping = false;
				}
			}
			_results = [];
			for (_i = 0, _len = boundaries.length; _i < _len; _i++) {
				boundary = boundaries[_i];
				if (!useSmartStepping || (useSmartStepping && cnt % stepper === 0)) {
					xReal = this.xToRealX(cnt, w);
					c.fillText(boundary, xReal, bottom);
				}
				_results.push(cnt--);
			}
			return _results;
		};
		Grid.prototype.drawXAxisText = function(c, textPad, xSteps, w, xBound) {
			var bottom, cnt, lbl, minus, x, xReal, _i, _len;
			c.font = this.settings.font;
			if (this.settings.isLarge) {
				c.font = this.settings.largeFont;
			}
			c.fillStyle = this.settings.xAxisNumberColor;
			c.textAlign = "center";
			c.textBaseline = "bottom";
			bottom = c.canvas.height - textPad.y;
			cnt = 0;
			for (_i = 0, _len = xSteps.length; _i < _len; _i++) {
				x = xSteps[_i];
				cnt++;
				xReal = this.xToRealX(x, w);
				if (xReal < w - 15) {
					lbl = this.settings.timestamp && cnt === xSteps.length ? xBound.unit : "";
					minus = this.settings.useMinus ? "-" : "";
					c.fillText(minus + x + lbl, xReal, bottom);
				}
				c.textAlign = "right";
			}
			if (this.settings.timestamp) {
				return c.fillText(this.settings.timestamp, w - textPad.x, bottom);
			} else {
				return c.fillText(xBound.unit, w - textPad.x, bottom);
			}
		};
		return Grid;
	})();
	window.Grid = Grid;
}).call(this);