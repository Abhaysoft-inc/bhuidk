import { useControl } from 'react-map-gl/maplibre';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import type { ControlPosition } from 'react-map-gl/maplibre';

type DrawControlProps = ConstructorParameters<typeof MapboxDraw>[0] & {
  position?: ControlPosition;
  onCreate?: (evt: { features: object[] }) => void;
  onUpdate?: (evt: { features: object[]; action: string }) => void;
  onDelete?: (evt: { features: object[] }) => void;
  onModeChange?: (evt: { mode: string }) => void;
};

export default function DrawControl(props: DrawControlProps) {
  useControl<import('maplibre-gl').IControl>(
    () => new MapboxDraw(props) as unknown as import('maplibre-gl').IControl,
    ({ map }: { map: any }) => {
      map.on('draw.create', props.onCreate);
      map.on('draw.update', props.onUpdate);
      map.on('draw.delete', props.onDelete);
      if (props.onModeChange) map.on('draw.modechange', props.onModeChange);
    },
    ({ map }: { map: any }) => {
      map.off('draw.create', props.onCreate);
      map.off('draw.update', props.onUpdate);
      map.off('draw.delete', props.onDelete);
      if (props.onModeChange) map.off('draw.modechange', props.onModeChange);
    },
    {
      position: props.position || 'top-left'
    }
  );

  return null;
}
