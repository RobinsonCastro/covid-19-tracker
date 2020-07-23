import React from 'react';
import { Map as LeafMap, TileLayer } from 'react-leaflet';
import "./Map.css";
import { showDataOnMap } from "./util";

const Map = (props) => {
	return (
		<div className="map">
			
			<LeafMap center={props.center} zoom={props.zoom}>
				<TileLayer
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					attribution='&copy; <a href="https://osm.org/copyright">
					OpenStreetMap</a> contributors'
				/>
				{showDataOnMap(props.countries, props.casesType)}
			</LeafMap>
		</div>
	);
};

export default Map;
