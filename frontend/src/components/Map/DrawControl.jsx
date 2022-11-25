import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { useControl } from 'react-map-gl';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

export const DrawControl = ({ areas, onChange, position, ...props }) => {
    let draw;
    
    useControl(
        () => {
            draw = new MapboxDraw(props);
            return draw;
        },
        ({ map }) => {
            let localAreas = [];

            map.on('draw.create', (ev) => {
                localAreas.push({ id: ev.features[0].id, area: ev.features[0].geometry.coordinates });
                onChange(localAreas.map(localArea => localArea.area));
            });
            map.on('draw.delete', (ev) => {
                localAreas = localAreas.filter(localArea => localArea.id !== ev.features[0].id);
                onChange(localAreas.map(localArea => localArea.area));
            });
            map.on('draw.update', (ev) => {
                localAreas = localAreas.map(localArea => localArea.id === ev.features[0].id ? { id: ev.features[0].id, area: ev.features[0].geometry.coordinates } : localArea);
                onChange(localAreas.map(localArea => localArea.area));
            });

            if (areas?.length > 0) {
                let minLng = 180;
                let maxLng = -180;
                let minLat = 90;
                let maxLat = -90;
                const startAreas = areas.map(area => {
                    const areaId = draw.add({
                        coordinates: area,
                        type: "Polygon",
                        id: 'asd'
                    });

                    const lngs = area[0].map(ar => ar[0]);
                    const lats = area[0].map(ar => ar[1]);
                    minLng = Math.min(...lngs, minLng);
                    maxLng = Math.max(...lngs, maxLng);
                    minLat = Math.min(...lats, minLat);
                    maxLat = Math.max(...lats, maxLat);

                    return { id: areaId[0], area };
                });
                map.fitBounds([
                    [minLng - 0.005, minLat - 0.005],
                    [maxLng + 0.005, maxLat + 0.005]
                ]);
                
                localAreas = startAreas;
            }
        },
        () => {
        },
        {
            position
        }
    );

    return null;
}
