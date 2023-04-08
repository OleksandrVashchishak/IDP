import { Marker } from 'react-map-gl';
import { CaretDownFilled } from '@ant-design/icons';
import Map from '../Map';

export default function MapPins(): JSX.Element {
  const pins = [[32.05, 49.45], [31, 48]];

  return (
    <Map>
      {pins.map((pin) => (
        <Marker longitude={pin[0]} latitude={pin[1]} key={`point-${pin[0]}-${pin[1]}`}>
          <CaretDownFilled style={{ color: 'red', width: 42, height: 42 }} />
        </Marker>
      ))}
    </Map>
  );
}
