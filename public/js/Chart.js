(function() {
	/*
	 Copyright (C) 2011-2012 Typesafe, Inc <http://typesafe.com>
	 */
	var Chart;
	var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
	Chart = (function() {
		function Chart(canvas, constraints) {
			var c, _ref;
			this.canvas = canvas;
			this.constraints = constraints;
			this.args = [];
			this.datasComp = [];
			if (arguments.length - 1 > 1) {
				for (c = 2, _ref = arguments.length - 1; 2 <= _ref ? c <= _ref : c >= _ref; 2 <= _ref ? c++ : c--) {
					this.add(arguments[c]);
				}
			}
			if (this.canvas) {
				$(this.canvas.ctx.canvas).data("obj", this);
			}
		}
		Chart.prototype.add = function(comp) {
			if (!comp.constraints) {
				comp.withConstraints(this.constraints);
			}
			comp.chart = this;
			if (comp.setPoints) {
				this.datasComp.push(comp);
			}
			this.args.push(comp);
			if (this.canvas && comp.draw) {
				this.canvas.draws.push(comp);
			}
			return this;
		};
		Chart.prototype.remove = function(comp) {
			if (this.canvas && (this.canvas.draws != null)) {
				return this.canvas.draws = this.canvas.draws.filter(function(c) {
					return comp !== c;
				});
			}
		};
		Chart.prototype.setConstraints = function(constraints) {
			this.constraints = constraints;
			return this;
		};
		Chart.prototype.removeAll = function() {
			var c, _i, _len, _ref;
			_ref = this.args;
			for (_i = 0, _len = _ref.length; _i < _len; _i++) {
				c = _ref[_i];
				this.remove(c);
			}
			this.args = [];
			return this.datasComp = [];
		};
		Chart.prototype.replace = function(otherChart) {
			var c, _i, _len, _ref;
			this.removeAll();
			this.setConstraints(otherChart.constraints);
			_ref = otherChart.args;
			for (_i = 0, _len = _ref.length; _i < _len; _i++) {
				c = _ref[_i];
				this.add(c);
			}
			if (otherChart.mouseMoveComp) {
				this.bindMouseMove(otherChart.mouseMoveComp);
			}
			return this.refresh();
		};
		Chart.prototype.start = function() {
			if (this.canvas) {
				this.canvas.start();
				return this;
			}
		};
		Chart.prototype.stop = function() {
			if (this.canvas) {
				this.canvas.stop();
				return this;
			}
		};
		Chart.prototype.refresh = function() {
			if (this.canvas) {
				return this.canvas.needRefresh = true;
			}
		};
		Chart.prototype.bindMouseMove = function(comp) {
			this.mouseMoveComp = comp;
			if (this.canvas) {
				$(document).on('mousemove', __bind(function(e) {
					var offset;
					if (this.canvas.node[0] === e.target) {
						offset = this.canvas.node.offset();
						return comp.setHover({
							x: e.clientX - offset.left,
							y: e.clientY - offset.top
						}, e);
					} else {
						return comp.setHover(null);
					}
				}, this));
			}
			return this;
		};
		Chart.prototype.bindShowLarge = function(comp) {
			var chart, container;
			if (!this.canvas) {
				return this;
			}
			chart = this;
			container = $(this.canvas.ctx.canvas).parent().parent();
			$(container).on('mouseover', __bind(function(e) {
				e.stopPropagation();
				return controller.showToolButtons(chart);
			}, this)).on('mouseout', __bind(function(e) {
				e.stopPropagation();
				return controller.hideToolButtons();
			}, this));
			return this;
		};
		return Chart;
	})();
	window.Chart = Chart;
}).call(this);