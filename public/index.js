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

const types = ['燃烧室压力','燃烧室温度','弹体壁面温度','排气管温度','喷油器温度'];
const title = ['压力/bar','温度/°C','温度/°C','温度/°C','温度/°C'];
const eleName = ''
var charts = [];
types.forEach((v,index)=>{
	charts.push(createChart('container'+index,v,title[index]));
})

socket.on('data',(data)=>{
	charts.forEach((chart,type) => {
		document.getElementsByClassName('data')[type].innerText = data[type];
		console.log(data);
		var x = (new Date()).getTime(),
			y = data[type];
		chart.series[0].addPoint([x, y], true, true);
		activeLastPointToolip(chart);
	});
	
})

function createChart(eleId,title,yName)
{ return Highcharts.chart(eleId, {
	chart: {
		type: 'spline',
		marginRight: 10,
		events: {
			load: function () {
				var series = this.series[0],
					chart = this;
				console.log(this);
				activeLastPointToolip(chart);
				
			}
		}
	},
	title: {
		text: title
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
			text: yName,
		}
	},
	
	
	series: [{
		showInLegend: false,
		data: (function () {
			// 初始化
			var data = [],
				time = (new Date()).getTime(),
				i;
			for (i = -19; i <= 0; i += 1) {
				data.push({
					x: time + i * 200,
					y: 0
				});
			}
			return data;
		}()),
		marker: {
			enabled: false
		},
	}]
});
}