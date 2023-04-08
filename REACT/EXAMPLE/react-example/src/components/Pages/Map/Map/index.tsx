import { ReactNode, useCallback, useState } from 'react';
import ReactMapGL, { LngLatBounds, MapboxEvent, ViewState, ViewStateChangeEvent } from 'react-map-gl';

export const mapboxCenter: [number, number] = process.env.REACT_APP_ENV === 'local' ? [32.05, 49.45] : [-100, 39];

interface Map {
  children?: ReactNode | JSX.Element;
}

export default function Map({ children }: Map): JSX.Element {
  // const { data, setRect } = useContextDelivery();

  const [mapViewport, setMapViewport] = useState<ViewState>({
    longitude: 32.05,
    latitude: 49.45,
    zoom: process.env.REACT_APP_ENV === 'local' ? 10 : 5,
    bearing: 0,
    pitch: 0,
    padding: { top: 0, bottom: 0, left: 0, right: 0 },
  });

  const onRectChange = useCallback((bounds: LngLatBounds, zoom: number) => {
    console.info('onRectChange', { bounds, zoom });
    // setRect({
    //   east: bounds.getEast(),
    //   north: bounds.getNorth(),
    //   west: bounds.getWest(),
    //   south: bounds.getSouth(),
    //   eps: Math.min(10, 23 / (zoom ** 2)),
    // });
  }, [
    // setRect
  ]);

  const onLoad = useCallback((e: MapboxEvent) => {
    onRectChange(e.target.getBounds(), e.target.getZoom());
  }, [onRectChange]);

  const onMove = useCallback((e: ViewStateChangeEvent) => {
    setMapViewport(e.viewState);
    onRectChange(e.target.getBounds(), e.target.getZoom());
  }, [onRectChange]);

  return (
    <div style={{ position: 'relative' }}>
      <ReactMapGL
        {...mapViewport}
        onMove={onMove}
        onLoad={onLoad}
        mapStyle="mapbox://styles/mapbox/dark-v10"
        mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        style={{ height: '500px', overflow: 'hidden' }}
      >
        {children}
      </ReactMapGL>
    </div>
  );
}

Map.defaultProps = {
  children: undefined,
};
