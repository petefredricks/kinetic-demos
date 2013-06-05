(function() {
	var GraphComponent;
	var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
		for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
		function ctor() { this.constructor = child; }
		ctor.prototype = parent.prototype;
		child.prototype = new ctor;
		child.__super__ = parent.prototype;
		return child;
	};
	GraphComponent = (function() {
		__extends(GraphComponent, Atom);
		function GraphComponent(theDom, area1, area2, area3, data, label1, label2, label3) {
			this.transformThroughputData = __bind(this.transformThroughputData, this);
			this.updateValues = __bind(this.updateValues, this);
			this.updateDispatcherTimeSeries = __bind(this.updateDispatcherTimeSeries, this);
			this.updateRates = __bind(this.updateRates, this);
			this.updateMailboxWaitTime = __bind(this.updateMailboxWaitTime, this);
			this.updateMailboxSize = __bind(this.updateMailboxSize, this);
			this.updateMaxMailboxSize = __bind(this.updateMaxMailboxSize, this);
			this.updateMeanMailboxSize = __bind(this.updateMeanMailboxSize, this);
			this.updateTimeInMailbox = __bind(this.updateTimeInMailbox, this);
			this.updateLatencyHistogram = __bind(this.updateLatencyHistogram, this);
			this.updateLatencyScatter = __bind(this.updateLatencyScatter, this);
			this.updateLatency = __bind(this.updateLatency, this);      this.initializeMode = true;
			this.initialData = data;
			this.dom = theDom;
			this.inner1 = area1;
			this.inner2 = area2;
			this.inner3 = area3;
			this.graphLabel1 = label1;
			this.graphLabel2 = label2;
			this.graphLabel3 = label3;
			this.init();
			this.changeGraph(label1, 1);
			this.changeGraph(label2, 2);
			this.changeGraph(label3, 3);
			this.initializeMode = false;
			this.encoder = new URLEncoder;
		}
		GraphComponent.prototype.init = function() {
			var barGraphPad, graphPad, histogram, latencyHistogramBoundariesLength;
			graphPad = {
				top: 0,
				right: 0,
				left: 25,
				bottom: 16
			};
			barGraphPad = {
				left: 25,
				bottom: 16,
				top: 0,
				right: 15
			};
			this.throughputChart = new Chart();

			this.heapChart = new Chart(void 0, new ChartConstraints({
				xUnit: 'min',
				yUnit: '%',
				xMax: this.initialData.minutes,
				xStep: this.calcTimeSteps(this.initialData.minutes),
				graphPad: $.extend({}, graphPad)
			}), new BackgroundXAxis(), new Grid(), this.heap_graph = new Graph()).bindMouseMove(this.heap_graph);

			this.gcTimeChart = new Chart(void 0, new ChartConstraints({
				xUnit: 'min',
				yUnit: '%',
				xMax: this.initialData.minutes,
				xStep: this.calcTimeSteps(this.initialData.minutes),
				graphPad: $.extend({}, graphPad)
			}), new BackgroundXAxis(), new Grid(), this.gcTime_graph = new Graph({})).bindMouseMove(this.gcTime_graph);

			this.gcCountChart = new Chart(void 0, new ChartConstraints({
				xUnit: 'min',
				yUnit: '#/min',
				xMax: this.initialData.minutes,
				xStep: this.calcTimeSteps(this.initialData.minutes),
				graphPad: $.extend({}, graphPad)
			}), new BackgroundXAxis(), new Grid(), this.gcCount_graph = new Graph()).bindMouseMove(this.gcCount_graph);

			this.cpuUserChart = new Chart(void 0, new ChartConstraints({
				xUnit: 'min',
				yUnit: '%',
				xMax: this.initialData.minutes,
				xStep: this.calcTimeSteps(this.initialData.minutes),
				graphPad: $.extend({}, graphPad)
			}), new BackgroundXAxis(), new Grid(), this.cpuUser_graph = new Graph()).bindMouseMove(this.cpuUser_graph);

			this.cpuSysChart = new Chart(void 0, new ChartConstraints({
				xUnit: 'min',
				yUnit: '%',
				xMax: this.initialData.minutes,
				xStep: this.calcTimeSteps(this.initialData.minutes),
				graphPad: $.extend({}, graphPad)
			}), new BackgroundXAxis(), new Grid(), this.cpuSys_graph = new Graph()).bindMouseMove(this.cpuSys_graph);
			this.cpuCombinedChart = new Chart(void 0, new ChartConstraints({
				xUnit: 'min',
				yUnit: '%',
				xMax: this.initialData.minutes,
				xStep: this.calcTimeSteps(this.initialData.minutes),
				graphPad: $.extend({}, graphPad)
			}), new BackgroundXAxis(), new Grid(), this.cpuCombined_graph = new Graph({
				fill: "rgba(116, 174, 225, 0.2)"
			}), this.cpuCombinedSys_graph = new Graph({
				lineColor: 'rgba(255, 68, 5, 0.5)',
				fill: "rgba(209, 52, 0, 0.2)",
				pushConstraints: false
			})).bindMouseMove(this.cpuCombined_graph);
			this.loadAverageChart = new Chart(void 0, new ChartConstraints({
				xUnit: 'min',
				yUnit: '',
				xMax: this.initialData.minutes,
				xStep: this.calcTimeSteps(this.initialData.minutes),
				graphPad: $.extend({}, graphPad)
			}), new BackgroundXAxis(), new Grid(), this.loadAverage1min_graph = new Graph(), this.loadAverage5min_graph = new Graph({
				lineColor: 'rgba(50,234,24,0.5)',
				pushConstraints: false
			}), this.loadAverage15min_graph = new Graph({
				lineColor: 'rgba(255,204,51,0.5)',
				pushConstraints: false
			})).bindMouseMove(this.loadAverage1min_graph);
			this.threadsChart = new Chart(void 0, new ChartConstraints({
				xUnit: 'min',
				yUnit: '',
				xMax: this.initialData.minutes,
				xStep: this.calcTimeSteps(this.initialData.minutes),
				graphPad: $.extend({}, graphPad)
			}), new BackgroundXAxis(), new Grid(), this.threads_graph = new Graph(), this.graphThreads_daemon = new Graph({
				lineColor: 'rgba(50,234,24,0.5)',
				pushConstraints: false
			})).bindMouseMove(this.threads_graph);
			this.dispatcherThreadsChart = new Chart(void 0, new ChartConstraints({
				yUnit: '',
				xUnit: 'min',
				xMax: this.initialData.minutes,
				xStep: this.calcTimeSteps(this.initialData.minutes),
				graphPad: $.extend({}, graphPad)
			}), new BackgroundXAxis(), new Grid(), this.dispatcherThreads_graph = new Graph({
				fill: "rgba(116, 174, 225, 0.2)",
				smooth: 1
			})).bindMouseMove(this.graphDispatcherThreads_graph);
			this.ctxswChart = new Chart(void 0, new ChartConstraints({
				xUnit: 'min',
				yUnit: 'ctx/s',
				xMax: this.initialData.minutes,
				xStep: this.calcTimeSteps(this.initialData.minutes),
				graphPad: $.extend({}, graphPad)
			}), new BackgroundXAxis(), new Grid(), this.ctxsw_graph = new Graph()).bindMouseMove(this.ctxsw_graph);
			this.totalMessageRateChart = new Chart(void 0, new ChartConstraints({
				xUnit: 'min',
				yUnit: 'msg/s',
				xMax: this.initialData.minutes,
				xStep: this.calcTimeSteps(this.initialData.minutes),
				graphPad: $.extend({}, graphPad)
			}), new BackgroundXAxis(), new Grid(), this.totalMessageRate_graph = new Graph()).bindMouseMove(this.totalMessageRate_graph);
			this.receiveRateChart = new Chart(void 0, new ChartConstraints({
				xUnit: 'min',
				yUnit: 'msg/s',
				xMax: this.initialData.minutes,
				xStep: this.calcTimeSteps(this.initialData.minutes),
				graphPad: $.extend({}, graphPad)
			}), new BackgroundXAxis(), new Grid(), this.receiveRate_graph = new Graph()).bindMouseMove(this.receiveRate_graph);
			this.tellRateChart = new Chart(void 0, new ChartConstraints({
				xUnit: 'min',
				yUnit: 'msg/s',
				xMax: this.initialData.minutes,
				xStep: this.calcTimeSteps(this.initialData.minutes),
				graphPad: $.extend({}, graphPad)
			}), new BackgroundXAxis(), new Grid(), this.tellRate_graph = new Graph()).bindMouseMove(this.tellRate_graph);
			this.askRateChart = new Chart(void 0, new ChartConstraints({
				xUnit: 'min',
				yUnit: 'msg/s',
				xMax: this.initialData.minutes,
				xStep: this.calcTimeSteps(this.initialData.minutes),
				graphPad: $.extend({}, graphPad)
			}), new BackgroundXAxis(), new Grid(), this.askRate_graph = new Graph()).bindMouseMove(this.askRate_graph);
			this.remoteSendRateChart = new Chart(void 0, new ChartConstraints({
				xUnit: 'min',
				yUnit: 'msg/s',
				xMax: this.initialData.minutes,
				xStep: this.calcTimeSteps(this.initialData.minutes),
				graphPad: $.extend({}, graphPad)
			}), new BackgroundXAxis(), new Grid(), this.remoteSendRate_graph = new Graph()).bindMouseMove(this.remoteSendRate_graph);
			this.remoteReceiveRateChart = new Chart(void 0, new ChartConstraints({
				xUnit: 'min',
				yUnit: 'msg/s',
				xMax: this.initialData.minutes,
				xStep: this.calcTimeSteps(this.initialData.minutes),
				graphPad: $.extend({}, graphPad)
			}), new BackgroundXAxis(), new Grid(), this.remoteReceiveRate_graph = new Graph()).bindMouseMove(this.remoteReceiveRate_graph);
			this.bytesWrittenRateChart = new Chart(void 0, new ChartConstraints({
				xUnit: 'min',
				yUnit: 'bytes/s',
				xMax: this.initialData.minutes,
				xStep: this.calcTimeSteps(this.initialData.minutes),
				graphPad: $.extend({}, graphPad)
			}), new BackgroundXAxis(), new Grid(), this.bytesWrittenRate_graph = new Graph()).bindMouseMove(this.bytesWrittenRate_graph);
			this.bytesReadRateChart = new Chart(void 0, new ChartConstraints({
				xUnit: 'min',
				yUnit: 'bytes/s',
				xMax: this.initialData.minutes,
				xStep: this.calcTimeSteps(this.initialData.minutes),
				graphPad: $.extend({}, graphPad)
			}), new BackgroundXAxis(), new Grid(), this.bytesReadRate_graph = new Graph()).bindMouseMove(this.bytesReadRate_graph);
			this.barLatencyChart = new Chart(void 0, new ChartConstraints({
				yUnit: String.fromCharCode(0xB5) + 's',
				xMax: this.initialData.latencyMinutes,
				xStep: this.calcTimeSteps(this.initialData.latencyMinutes),
				graphPad: $.extend({}, barGraphPad)
			}), new BackgroundXAxis(), new Grid(),

			this.barLatency_barMean = new Bar({
				number: this.initialData.latencyNumberOfBars
			}),
			this.barLatency_barMin = new Bar({
				number: this.initialData.latencyNumberOfBars,
				color: 'rgba(0,0,0,0.4)',
				bgColor: null,
				pushConstraints: false
			})).bindMouseMove(this.barLatency_barMean);
			this.barTimeInMailboxChart = new Chart(void 0, new ChartConstraints({
				yUnit: String.fromCharCode(0xB5) + 's',
				xMax: this.initialData.actorStatsBarsMinutes,
				xStep: this.calcTimeSteps(this.initialData.actorStatsBarsMinutes),
				graphPad: $.extend({}, barGraphPad)
			}), new BackgroundXAxis(), new Grid(), this.barTimeInMailbox_bar = new Bar({
				widthRatio: 0.6,
				number: this.initialData.actorStatsBars
			})).bindMouseMove(this.barTimeInMailbox_bar);
			this.barMeanMailboxSizeChart = new Chart(void 0, new ChartConstraints({
				yUnit: '',
				xMax: this.initialData.actorStatsBarsMinutes,
				xStep: this.calcTimeSteps(this.initialData.actorStatsBarsMinutes),
				graphPad: $.extend({}, barGraphPad)
			}), new BackgroundXAxis(), new Grid(), this.barMeanMailboxSize_bar = new Bar({
				widthRatio: 0.6,
				number: this.initialData.actorStatsBars
			})).bindMouseMove(this.barMeanMailboxSize_bar);
			this.barMaxMailboxSizeChart = new Chart(void 0, new ChartConstraints({
				yUnit: '',
				xMax: this.initialData.actorStatsBarsMinutes,
				xStep: this.calcTimeSteps(this.initialData.actorStatsBarsMinutes),
				graphPad: $.extend({}, barGraphPad)
			}), new BackgroundXAxis(), new Grid(), this.barMaxMailboxSize_bar = new Bar({
				widthRatio: 0.6,
				number: this.initialData.actorStatsBars
			})).bindMouseMove(this.barMaxMailboxSize_bar);
			this.graphQueueSizeChart = new Chart(void 0, new ChartConstraints({
				yUnit: '',
				xUnit: 'min',
				xMax: this.initialData.minutes,
				xStep: this.calcTimeSteps(this.initialData.minutes),
				graphPad: $.extend({}, graphPad)
			}), new BackgroundXAxis(), new Grid(), this.queueSize_graph = new Graph({
				fill: "rgba(116, 174, 225, 0.2)",
				smooth: 1
			})).bindMouseMove(this.graphQueueSize_graph);
			this.latencyScatterChart = new Chart(void 0, new ChartConstraints({
				xUnit: 'min',
				yUnit: String.fromCharCode(0xB5) + 's',
				xMax: this.initialData.minutes,
				xStep: this.calcTimeSteps(this.initialData.minutes),
				graphPad: $.extend({}, graphPad)
			}), new BackgroundXAxis(), new Grid(), this.latencyScatter_graph = new Scatter()).bindMouseMove(this.latencyScatter_graph);
			latencyHistogramBoundariesLength = this.initialData.latencyHistogramBoundaries.length + 1;
			histogram = new Histogram({
				number: latencyHistogramBoundariesLength,
				boundaries: this.initialData.latencyHistogramBoundaries
			});
			this.latencyHistogramChart = new Chart(void 0, new ChartConstraints({
				xUnit: '',
				yUnit: '#',
				xMax: latencyHistogramBoundariesLength,
				xStep: latencyHistogramBoundariesLength,
				graphPad: $.extend({}, graphPad)
			}), new BackgroundXAxis(), new Grid({
				histogram: histogram
			}), this.latencyHistogram_graph = histogram).bindMouseMove(this.latencyHistogram_graph);
			this.mailboxWaitTimeChart = new Chart(void 0, new ChartConstraints({
				xUnit: 'min',
				yUnit: String.fromCharCode(0xB5) + 's',
				xMax: this.initialData.minutes,
				xStep: this.calcTimeSteps(this.initialData.minutes),
				graphPad: $.extend({}, graphPad)
			}), new BackgroundXAxis(), new Grid(), this.mailboxWaitTime_graph = new Graph({
				smooth: 1
			})).bindMouseMove(this.mailboxWaitTime_graph);
			return this.mailboxSizeChart = new Chart(void 0, new ChartConstraints({
				xUnit: 'min',
				yUnit: '',
				xMax: this.initialData.minutes,
				xStep: this.calcTimeSteps(this.initialData.minutes),
				graphPad: $.extend({}, graphPad)
			}), new BackgroundXAxis(), new Grid(), this.mailboxSize_graph = new Graph({
				smooth: 1
			})).bindMouseMove(this.mailboxSize_graph);
		};
		GraphComponent.prototype.changeGraph = function(text, pos, panelPos) {
			if (pos == null) {
				pos = 1;
			}
			if (panelPos == null) {
				panelPos = "left";
			}
			if (!this.initializeMode) {
				this.encoder.encodeURL("graph", panelPos, pos, text);
			}
			if (this.initializeMode || (text !== this.graphLabel1 && text !== this.graphLabel2 && text !== this.graphLabel3)) {
				this.swapGraphLabel(text, pos);
				return this.swapGraph(text, pos);
			}
		};
		GraphComponent.prototype.swapGraphLabel = function(text, pos) {
			if (pos === 1) {
				this.graphLabel1 = text;
				return this.dom.find(".graphTitle1").text(text);
			} else if (pos === 2) {
				this.graphLabel2 = text;
				return this.dom.find(".graphTitle2").text(text);
			} else {
				this.graphLabel3 = text;
				return this.dom.find(".graphTitle3").text(text);
			}
		};
		GraphComponent.prototype.swapGraph = function(text, pos) {
			if (text === '') {
				return;
			}
			switch (text) {
				case "Ask Rate":
					return this.setGraph(pos, this.askRateChart);
				case "Bytes Read":
					return this.setGraph(pos, this.bytesReadRateChart);
				case "Bytes Written":
					return this.setGraph(pos, this.bytesWrittenRateChart);
				case "Context Switches":
					return this.setGraph(pos, this.ctxswChart);
				case "CPU":
					return this.setGraph(pos, this.cpuCombinedChart);
				case "CPU (system)":
					return this.setGraph(pos, this.cpuSysChart);
				case "CPU (user)":
					return this.setGraph(pos, this.cpuUserChart);
				case "Dispatcher Threads":
					return this.setGraph(pos, this.dispatcherThreadsChart);
				case "GC Activity":
					return this.setGraph(pos, this.gcTimeChart);
				case "GC Count":
					return this.setGraph(pos, this.gcCountChart);
				case "Heap":
					return this.setGraph(pos, this.heapChart);
				case "Latency":
					return this.setGraph(pos, this.barLatencyChart);
				case "Latency Histogram":
					return this.setGraph(pos, this.latencyHistogramChart);
				case "Latency Scatter":
					return this.setGraph(pos, this.latencyScatterChart);
				case "Load Average":
					return this.setGraph(pos, this.loadAverageChart);
				case "Mailbox Size":
					return this.setGraph(pos, this.mailboxSizeChart);
				case "Mailbox Wait Time":
					return this.setGraph(pos, this.mailboxWaitTimeChart);
				case "Max Mailbox Size":
					return this.setGraph(pos, this.barMaxMailboxSizeChart);
				case "Mean Mailbox Size":
					return this.setGraph(pos, this.barMeanMailboxSizeChart);
				case "Queue Size":
					return this.setGraph(pos, this.graphQueueSizeChart);
				case "Receive Rate":
					return this.setGraph(pos, this.receiveRateChart);
				case "Remote Receive Rate":
					return this.setGraph(pos, this.remoteReceiveRateChart);
				case "Remote Send Rate":
					return this.setGraph(pos, this.remoteSendRateChart);
				case "Tell Rate":
					return this.setGraph(pos, this.tellRateChart);
				case "Threads":
					return this.setGraph(pos, this.threadsChart);
				case "Throughput":
					return this.setGraph(pos, this.throughputChart);
				case "Time in Mailbox":
					return this.setGraph(pos, this.barTimeInMailboxChart);
				case "Total Message Rate":
					return this.setGraph(pos, this.totalMessageRateChart);
				default:
					return console.log("Unknown graph: " + text);
			}
		};
		GraphComponent.prototype.setGraph = function(pos, chart) {
			switch (pos) {
				case 1:
					return this.inner1.replace(chart);
				case 2:
					return this.inner2.replace(chart);
				default:
					return this.inner3.replace(chart);
			}
		};
		GraphComponent.prototype.updateLatency = function(data) {
			var latencyMeanDuration, latencyMinDuration;
			if (data.spanSummaryBars) {
				latencyMeanDuration = data.spanSummaryBars.bars.reduce((function(ac, el) {
					ac.push(el.meanDuration);
					return ac;
				}), []);
				latencyMinDuration = data.spanSummaryBars.bars.reduce((function(ac, el) {
					ac.push(el.minDuration);
					return ac;
				}), []);
				this.barLatency_barMean.setData(latencyMeanDuration);
				return this.barLatency_barMin.setData(latencyMinDuration);
			}
		};
		GraphComponent.prototype.updateLatencyScatter = function(data) {
			if (data.spanTimeseries) {
				return this.latencyScatter_graph.setData(data.spanTimeseries.points);
			}
		};
		GraphComponent.prototype.updateLatencyHistogram = function(data) {
			if (data.spanHistogram) {
				return this.latencyHistogram_graph.setData(data.spanHistogram.buckets);
			}
		};
		GraphComponent.prototype.updateTimeInMailbox = function(data) {
			var timeInMailboxData;
			if (data.actorStatsBars) {
				timeInMailboxData = data.actorStatsBars.bars.reduce((function(ac, el) {
					ac.push(el.meanTimeInMailbox / 1000);
					return ac;
				}), []);
				return this.barTimeInMailbox_bar.setData(timeInMailboxData);
			}
		};
		GraphComponent.prototype.updateMeanMailboxSize = function(data) {
			var meanMailboxSizeData;
			if (data.actorStatsBars) {
				meanMailboxSizeData = data.actorStatsBars.bars.reduce((function(ac, el) {
					ac.push(el.meanMailboxSize);
					return ac;
				}), []);
				return this.barMeanMailboxSize_bar.setData(meanMailboxSizeData);
			}
		};
		GraphComponent.prototype.updateMaxMailboxSize = function(data) {
			var maxMailboxSizeData;
			if (data.actorStatsBars) {
				maxMailboxSizeData = data.actorStatsBars.bars.reduce((function(ac, el) {
					ac.push(el.maxMailboxSize);
					return ac;
				}), []);
				return this.barMaxMailboxSize_bar.setData(maxMailboxSizeData);
			}
		};
		GraphComponent.prototype.updateMailboxSize = function(data) {
			var mailboxTimeseries, points;
			mailboxTimeseries = data.mailboxTimeseries;
			if (mailboxTimeseries) {
				points = mailboxTimeseries.points;
				if (points) {
					return this.mailboxSize_graph.setData(points.map(function(o) {
						return [o.timestamp, o.size];
					}));
				}
			}
		};
		GraphComponent.prototype.updateMailboxWaitTime = function(data) {
			var mailboxTimeseries, points;
			mailboxTimeseries = data.mailboxTimeseries;
			if (mailboxTimeseries) {
				points = mailboxTimeseries.points;
				if (points) {
					return this.mailboxWaitTime_graph.setData(points.map(function(o) {
						return [o.timestamp, o.waitTime];
					}));
				}
			}
		};
		GraphComponent.prototype.updateRates = function(data) {
			var through;
			through = data.throughput;
			if (through) {
				this.totalMessageRate_graph.setData(through.totalMessageRate);
				this.receiveRate_graph.setData(through.receiveRate);
				this.tellRate_graph.setData(through.tellRate);
				this.askRate_graph.setData(through.askRate);
				this.remoteSendRate_graph.setData(through.remoteSendRate);
				this.remoteReceiveRate_graph.setData(through.remoteReceiveRate);
				this.bytesWrittenRate_graph.setData(through.bytesWrittenRate);
				return this.bytesReadRate_graph.setData(through.bytesReadRate);
			}
		};
		GraphComponent.prototype.updateDispatcherTimeSeries = function(data) {
			var dispatcherTimeseries, points;
			dispatcherTimeseries = data.dispatcherTimeseries;
			if (dispatcherTimeseries) {
				points = dispatcherTimeseries.points;
				if (points) {
					this.dispatcherThreads_graph.setData(points.map(function(o) {
						return [o.timestamp, o.activeThreadCount];
					}));
					return this.queueSize_graph.setData(points.map(function(o) {
						return [o.timestamp, o.queueSize];
					}));
				}
			}
		};
		GraphComponent.prototype.updateValues = function(data) {
			this.updateRates(data);
			this.updateLatency(data);
			this.updateLatencyScatter(data);
			this.updateLatencyHistogram(data);
			this.updateMailboxSize(data);
			this.updateMailboxWaitTime(data);
			this.updateMeanMailboxSize(data);
			this.updateMaxMailboxSize(data);
			this.updateTimeInMailbox(data);
			return this.updateDispatcherTimeSeries(data);
		};
		GraphComponent.prototype.transformThroughputData = function(data) {
			var i, through, time, _results;
			through = data.throughput;
			if (through) {
				i = through.timestamp.length - 1;
				_results = [];
				while (i >= 0) {
					time = through.timestamp[i];
					through.totalMessageRate[i] = [time, through.totalMessageRate[i]];
					through.receiveRate[i] = [time, through.receiveRate[i]];
					through.tellRate[i] = [time, through.tellRate[i]];
					through.askRate[i] = [time, through.askRate[i]];
					through.remoteSendRate[i] = [time, through.remoteSendRate[i]];
					through.remoteReceiveRate[i] = [time, through.remoteReceiveRate[i]];
					through.bytesWrittenRate[i] = [time, through.bytesWrittenRate[i]];
					through.bytesReadRate[i] = [time, through.bytesReadRate[i]];
					_results.push(i--);
				}
				return _results;
			}
		};
		window.GraphComponent = GraphComponent;
		return GraphComponent;
	})();
}).call(this);