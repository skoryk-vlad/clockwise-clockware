import React, { useEffect } from "react";
import { useState } from "react";
import MapGL, { NavigationControl, FullscreenControl } from "react-map-gl";
import { MapService } from "../../API/Server";
import { useFetching } from "../../hooks/useFetching";
import { AdminButton } from "../AdminButton/AdminButton";
import { notify, NOTIFY_TYPES } from "../Notifications";
import { DrawControl } from "./DrawControl";
import classes from './Map.module.css';

const TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

const defaultViewState = {
    longitude: 31.84008665577167,
    latitude: 48.65254072365843,
    zoom: 5,
    bearing: 0,
    pitch: 0,
    width: "100%"
};

export const AdminMap = ({ onChange, cityId }) => {
    const [areas, setAreas] = useState([]);
    const [viewState, setViewState] = useState(defaultViewState);

    const [fetchArea, isAreaLoading] = useFetching(async () => {
        const mapAreas = await MapService.getAreas(cityId);
        setAreas(mapAreas.map(area => area.area));
    });

    useEffect(() => {
        fetchArea();
    }, []);

    const sendAreas = async () => {
        try {
            MapService.setAreas({ areas, cityId });
            notify(NOTIFY_TYPES.SUCCESS, 'Область успешно изменена!');
            onChange();
        } catch (error) {
            notify(NOTIFY_TYPES.ERROR);
        }
    }

    return (
        <div>
            <div className={`${classes.adminMap}`}>
                <MapGL
                    initialViewState={viewState}
                    onMove={viewport => setViewState(viewport.viewState)}
                    onRender={map => { map.target.resize(); }}
                    mapStyle="mapbox://styles/mapbox/streets-v11"
                    mapboxAccessToken={TOKEN}
                >
                    <NavigationControl position="top-right" />
                    <FullscreenControl position="bottom-right" />
                    {!isAreaLoading && <DrawControl
                        position="top-left"
                        displayControlsDefault={false}
                        controls={{
                            polygon: true,
                            trash: true
                        }}
                        onChange={areas => setAreas(areas)}
                        areas={areas}
                    />}
                </MapGL>
            </div>
            <div className={classes.adminMapButtons}>
                <AdminButton type="button" onClick={sendAreas}>Сохранить</AdminButton>
            </div>
        </div>
    )
}
