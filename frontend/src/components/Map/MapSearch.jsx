import { useControl } from 'react-map-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

export const GeocoderControl = ({ mapboxAccessToken, position, onResult = () => {} }) => {
    useControl(
        () => {
            const control = new MapboxGeocoder({
                countries: 'UA',
                types: 'address',
                marker: false,
                accessToken: mapboxAccessToken
            });
            control.on('result', onResult);
            return control;
        },
        {
            position
        }
    );
    return null;
}
