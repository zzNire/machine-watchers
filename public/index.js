var socket = io();

Highcharts.setOptions({
	global: {
		useUTC: false
	}
});
function activeLastPointToolip(chart) {
	var points = chart.series[0].points;
	chart.tooltip.refresh(points[points.length -1]);
}
var chart = Highcharts.chart('container', {
	chart: {
		type: 'spline',
		marginRight: 10,
		events: {
			load: function () {
				var series = this.series[0],
					chart = this;
				console.log(this);
				activeLastPointToolip(chart);
				socket.on('data',(data)=>{
					var x = (new Date()).getTime(),
						y = data;
					series.addPoint([x, y], true, true);
					activeLastPointToolip(chart);
				})
			}
		}
	},
	title: {
		text: '燃烧室温度'
	},
	xAxis: {
		type: 'datetime',
		tickPixelInterval: 150,
		title: {
			text: '时间'
		}
	},
	yAxis: {
		title: {
			text: '温度'
		}
	},
	tooltip: {
		formatter: function () {
			return '<b>' + this.series.name + '</b><br/>' +
				Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
				Highcharts.numberFormat(this.y, 4);
		}
	},
	legend: {
		enabled: false
	},
	series: [{
		name: '温度',
		data: (function () {
			// 初始化
			var data = [],
				time = (new Date()).getTime(),
				i;
			for (i = -19; i <= 0; i += 1) {
				data.push({
					x: time + i * 1000,
					y: 0
				});
			}
			return data;
		}())
	}]
});