/* eslint-disable no-underscore-dangle */
import Chart from 'chart.js';

// draw vertical line on elevation chart hover plugin
Chart.plugins.register({
    afterDatasetsDraw: (chart) => {
        if (chart.tooltip._active && chart.tooltip._active.length) {
            const activePoints = chart.tooltip._active;
            const { ctx } = chart;
            activePoints.forEach((activePoint) => {
                const yAxis = chart.scales['y-axis-0'];
                const { x } = activePoint.tooltipPosition();
                const topY = yAxis.top;
                const bottomY = yAxis.bottom;
                // draw line
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(x, topY);
                ctx.lineTo(x, bottomY);
                ctx.lineWidth = 2;
                ctx.strokeStyle = '#fefefe';
                ctx.stroke();
                ctx.restore();
            });
        }
    },
});
// show multiple active tooltips
Chart.plugins.register({
    beforeRender(chart) {
        // create an array of tooltips
        // we can't use the chart tooltip because there is only one tooltip per chart
        chart.pluginTooltips = [];
        chart.config.data.datasets.forEach((dataset, i) => {
            chart.getDatasetMeta(i).data.forEach((sector) => {
                chart.pluginTooltips.push(new Chart.Tooltip({
                    _chart: chart.chart,
                    _chartInstance: chart,
                    _data: chart.data,
                    _options: chart.options.tooltips,
                    _active: [sector],
                }, chart));
            });
        });

        // turn off normal tooltips
        chart.options.tooltips.enabled = false;
    },
    afterDraw(chart, easing) {
        // we don't want the permanent tooltips to animate,
        // so don't do anything till the animation runs atleast once
        if (!chart.allTooltipsOnce) {
            if (easing !== 1) { return; }
            chart.allTooltipsOnce = true;
        }

        // turn on tooltips
        chart.options.tooltips.enabled = true;
        Chart.helpers.each(chart.pluginTooltips, (tooltip, idx) => {
            if (!chart.tooltip._active
                    || !chart.tooltip._active.length) { return; }
            chart.tooltip._active.forEach((a) => {
                if (idx === a._index) {
                    tooltip.initialize();
                    tooltip.update();
                    // we don't actually need this since we are not animating tooltips
                    tooltip.pivot();
                    tooltip.transition(easing).draw();
                }
            });
        });
        chart.options.tooltips.enabled = false;
    },
});
