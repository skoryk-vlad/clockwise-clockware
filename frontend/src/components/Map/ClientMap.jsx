import React, { useEffect } from "react";
import { useState } from "react";
import MapGL, { NavigationControl, Marker, GeolocateControl, FullscreenControl } from "react-map-gl";
import { MapMarker } from "./MapMarker/MapMarker";
import { GeocoderControl } from "./MapSearch";
import classes from './Map.module.css';
import { MapService } from "../../API/Server";
import { useTranslation } from "react-i18next";

const TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

const defaultViewState = {
    zoom: 11,
    bearing: 0,
    pitch: 0,
    width: "100%"
};
const defaultMarkerPosition = {
    lat: null,
    lng: null
};
const defaultAddress = {
    address: '',
    isPointAvailable: true
};

export const ClientMap = ({ className, onChange, cityId, center }) => {
    const { t } = useTranslation();

    const [map, setMap] = useState(null);
    const [address, setAddress] = useState(defaultAddress);
    const [markerPosition, setMarkerPosition] = useState(defaultMarkerPosition);
    const [viewState, setViewState] = useState({
        ...center,
        ...defaultViewState
    });

    useEffect(() => {
        if (map) {
            map.flyTo({
                center: [center.longitude, center.latitude],
                duration: 3000
            });
        }
        setMarkerPosition(defaultMarkerPosition);
        setAddress(defaultAddress);
    }, [center]);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(pos => {
            setViewState({
                ...viewState,
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude
            });
            setMarkerPosition({
                lat: pos.coords.latitude,
                lng: pos.coords.longitude
            });
        });
    }, []);

    const handleChange = async (point) => {
        const lngLat = point.lngLat;
        setMarkerPosition(lngLat);
        const isPointAvailable = await MapService.checkPointInArea({ ...lngLat, cityId });

        let address = point.address;
        if (!address && lngLat) {
            const data = await MapService.getPlaceByLngLat(lngLat);
            address = data.features[0].place_name;
        }

        setAddress({ address, isPointAvailable });
        onChange({ address, lngLat, isPointAvailable });
    }

    return (
        <div className={`${classes.clientMap} ${className ? className : ''}`}>
            <MapGL
                initialViewState={viewState}
                onMove={viewport => setViewState(viewport.viewState)}
                onClick={async (viewport) => {
                    handleChange({ address: '', lngLat: viewport.lngLat });
                }}
                onRender={map => map.target.resize()}
                onLoad={map => setMap(map.target)}
                mapStyle="mapbox://styles/mapbox/streets-v11"
                mapboxAccessToken={TOKEN}
            >
                <Marker
                    longitude={markerPosition.lng}
                    latitude={markerPosition.lat}
                    draggable
                    onDragEnd={async (viewport) => {
                        handleChange({ address: '', lngLat: viewport.lngLat });
                    }}
                >
                    <MapMarker />
                </Marker>
                <NavigationControl position="top-right" />
                <FullscreenControl position="bottom-right" />
                <GeolocateControl position="top-right" />
                <GeocoderControl
                    mapboxAccessToken={TOKEN}
                    position="top-left"
                    onResult={point => {
                        handleChange({ address: point.result.place_name, lngLat: { lng: point.result.center[0], lat: point.result.center[1] } });
                    }}
                />
                {address.address && <div className={`${classes.address} ${address.isPointAvailable ? '' : classes.notAvailable}`}>
                    {address.isPointAvailable ? '' : <span className={classes.notAvailableSymbol}>&#9888; </span>}
                    {address.address}
                    {address.isPointAvailable ? '' : <span className={classes.notAvailableMark}> ({t("orderForm.placeNotAvailable")}!)</span>}</div>}
            </MapGL>
        </div>
    )
}
