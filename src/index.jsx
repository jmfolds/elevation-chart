import React from 'react';
import ReactDOM from 'react-dom';
// import L from 'leaflet';
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
    }
}

L.Elevation = Elevation; //eslint-disable-line