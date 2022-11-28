import React from 'react';
import classes from './MapMarker.module.css'

export const MapMarker = () => {
    return (
        <div className={classes.mapMarker}>
            <img className={classes.mapMarker__image} src="/images/location-pin.png" alt="Маркер" />
            <div className={classes.mapMarker__shadow}></div>
            <div className={classes.mapMarker__shadow_anim}></div>
        </div>
    )
}
