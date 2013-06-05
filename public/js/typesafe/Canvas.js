(function() {
	/*
	 Copyright (C) 2011-2012 Typesafe, Inc <http://typesafe.com>
	 */
	var Canvas;
	var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
	Canvas = (function() {
		function Canvas(settings) {
			if (!settings.container) {
				throw "settings.container required!";
			}
			this.settings = $.extend({
				animationDuration: 1500,
				id: "canvas_" + uuid(),
				width: $(settings.container).width(),
				height: $(settings.container).height(),
				updateOnResize: !(settings.width || settings.height),
				bindResizeObject: window,
				absolute: false
			}, settings);
			this.node = $("<canvas />").attr({
				id: this.settings.id,
				width: this.settings.width,
				height: this.settings.height
			});
			if (this.settings.absolute) {
				this.node.css({
					"position": "absolute",
					"bottom": 0,
					"left": 0,
					"overflow": "hidden"
				});
			}
			$(this.settings.bindResizeObject).resize(__bind(function() {
				return this.resize();
			}, this));
			setTimeout((__bind(function() {
				return this.resize();
			}, this)), 500);
			this.node.appendTo(this.settings.container);
			this.ctx = this.node[0].getContext("2d");
			this.draws = this.settings.draws || [];
		}
		Canvas.prototype.resize = function() {
			var h, w;
			if (this.settings.updateOnResize) {
				w = $(this.settings.container).width();
				h = $(this.settings.container).height();
				if (w !== this.ctx.canvas.width || h !== this.ctx.canvas.height) {
					this.ctx.canvas.width = w;
					this.ctx.canvas.height = h;
					return this.needRefresh = true;
				}
			}
		};
		Canvas.prototype.start = function() {
			if (this.running) {
				return;
			}
			this.startTime = +new Date();
			this.running = true;
			this.needRefresh = true;
			return this._loop();
		};
		Canvas.prototype.stop = function() {
			return this.running = false;
		};
		Canvas.prototype._loop = function() {
			var c, d, oneComponentNeedRefresh, progress, _i, _j, _len, _len2, _ref, _ref2;
			if (!this.running) {
				return;
			}
			requestAnimFrame((__bind(function() {
				return this._loop();
			}, this)), this.node[0]);
			oneComponentNeedRefresh = false;
			_ref = this.draws;
			for (_i = 0, _len = _ref.length; _i < _len; _i++) {
				d = _ref[_i];
				if (d.needRefresh && d.needRefresh()) {
					oneComponentNeedRefresh = true;
				}
			}
			if (oneComponentNeedRefresh) {
				this.needRefresh = true;
			}
			if (!this.needRefresh) {
				return;
			}
			progress = Math.min(1, (+new Date() - this.startTime) / this.settings.animationDuration);
			c = this.ctx;
			c.clearRect(0, 0, c.canvas.width, c.canvas.height);
			_ref2 = this.draws;
			for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
				d = _ref2[_j];
				c.save();
				d.transform && d.transform(c);
				d.draw(c, progress);
				c.restore();
			}
			if (!oneComponentNeedRefresh && progress === 1) {
				return this.needRefresh = false;
			}
		};
		return Canvas;
	})();
	window.Canvas = Canvas;
}).call(this);