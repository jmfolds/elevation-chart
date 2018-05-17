import React from 'react';
import ReactDOM from 'react-dom';
import ElevationChart from './ElevationChart';

export default class Elevation {
    constructor({
        map,
        onMouseout,
        polyline,
        container,
        onClick,
        onHover,
        clickedDataIndexes,
    }) {
        ReactDOM.render(
            <ElevationChart
                ref={(el) => { this.ref = el; }}
                map={map}
                polyline={polyline}
                clickedDataIndexes={clickedDataIndexes}
                onClick={onClick}
                onHover={onHover}
                onMouseout={onMouseout}
                onBlur={onMouseout}
            />,
            container,
        );
        this.api = {
            getLength: this.ref.getLength.bind(this.ref),
        };
    }
}

window.ElevationChart = Elevation;
