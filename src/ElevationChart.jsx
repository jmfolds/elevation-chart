import React, { Component } from 'react';
import PropTypes from 'prop-types';
import turfLength from '@turf/length';
import Chart from 'chart.js';
import './ElevationChart.scss';
import './ChartPlugins';

class ElevationChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        this.createChart();
    }

    shouldComponentUpdate(newProps) {
        const { polyline } = this.props;
        if (newProps.polyline === polyline) {
            if (newProps.clickedDataIndexes) {
                const activeElements = [];
                newProps.clickedDataIndexes.forEach((idx) => {
                    const requestedElem = this.chart.getDatasetMeta(0).data[idx];
                    if (requestedElem) {
                        activeElements.push(requestedElem);
                    }
                });
                this.setActiveElements(activeElements);
            }
            return false;
        }
        return true;
    }

    componentDidUpdate() {
        const { selectedDataIndex } = this.props;
        if (selectedDataIndex) {
            const activeElements = [];
            const requestedElem = this.chart.getDatasetMeta(0).data[selectedDataIndex];
            activeElements.push(requestedElem);
            this.setActiveElements(activeElements);
        }
    }

    getLength() {
        const { polyline } = this.props;
        const points = polyline.geometry.coordinates.map(coord => (
            coord
        ));
        // this.props.polyline.geometry.coordinates
        //     .forEach((coord) => {
        //         points.push(coord);
        //     });
        const measureLayer = {
            type: 'Feature',
            geometry: {
                type: 'LineString',
                coordinates: points,
            },
        };
        const length = turfLength(measureLayer, 'miles');
        return length;
    }

    getLengthData() {
        const lengths = [];
        const points = [];
        const { polyline } = this.props;
        polyline.geometry.coordinates
            .forEach((coord) => {
                points.push(coord);
                if (!lengths.length) {
                    lengths.push(0);
                } else {
                    const geojson = {
                        type: 'Feature',
                        geometry: {
                            type: 'LineString',
                            coordinates: points,
                        },
                    };
                    const length = turfLength(geojson, 'miles');
                    lengths.push(length.toFixed(2));
                }
            });
        return lengths;
    }

    getElevationData() {
        const mVals = [];
        const { polyline } = this.props;
        polyline.geometry.coordinates
            .forEach((coord) => {
                if (coord[2]) {
                    mVals.push(Math.round(coord[2] * 3.28084));
                }
            });
        return mVals;
    }

    setActiveElements(activeElements) {
        this.chart.tooltip._active = activeElements; // eslint-disable-line
        this.chart.tooltip.update(true);
        this.chart.draw();
    }

    handleClick(e) {
        const { onClick } = this.props;
        if (onClick) {
            e.activeElements = this.chart.getElementsAtXAxis(e);
            onClick(e);
        }
    }

    createChart() {
        console.log(this.getLength());
        const data = this.getElevationData();
        const test = this.getLengthData();
        if (!data.length) {
            return;
        }
        const ctx = document.getElementById('my-chart');
        const config = {
            type: 'line',
            data: {
                labels: test,
                datasets: [{
                    radius: 0,
                    borderWidth: 1,
                    label: '',
                    backgroundColor: '#0a8719',
                    borderColor: '#333',
                    data,
                    fill: 'start',
                }],
            },
            options: {
                onClick: this.handleClick,
                onHover: (e) => {
                    const { onMouseout } = this.props;
                    if (e.type === 'mouseout') {
                        if (onMouseout) {
                            onMouseout();
                        }
                    }
                },
                legend: {
                    display: false,
                },
                responsive: true,
                title: {
                    fontColor: '#fff',
                    display: false,
                    text: 'Elevation Chart',
                },
                tooltips: {
                    mode: 'index',
                    intersect: false,
                    displayColors: false,
                    callbacks: {
                        title: (e) => {
                            const { onHover } = this.props;
                            if (onHover) {
                                onHover(e);
                            }
                        },
                    },
                },
                scales: {
                    xAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Miles',
                            fontColor: '#fff',
                        },
                        ticks: {
                            fontColor: '#fff',
                        },
                    }],
                    yAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Elevation',
                            fontColor: '#fff',
                        },
                        ticks: {
                            fontColor: '#fff',
                        },
                    }],
                },
            },
        };
        this.chart = new Chart(ctx, config);
    }

    render() {
        const data = this.getElevationData();
        const { height, width } = this.props;
        if (!data.length) {
            return null;
        }
        return (
            <canvas id="my-chart" style={{ height, width }} />
        );
    }
}
ElevationChart.defaultProps = {
    selectedDataIndex: null,
    width: '100%',
    height: '100px',
    onClick: null,
    onHover: null,
    onMouseout: null,
};

ElevationChart.propTypes = {
    selectedDataIndex: PropTypes.number,
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onClick: PropTypes.func,
    onHover: PropTypes.func,
    onMouseout: PropTypes.func,
    polyline: PropTypes.shape({
        geometry: PropTypes.shape({
            coordinates: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
        }),
    }).isRequired,
};

export default ElevationChart;
