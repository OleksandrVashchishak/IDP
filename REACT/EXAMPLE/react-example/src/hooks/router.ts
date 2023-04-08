import { useLocation } from 'react-router-dom';

export default function useCurrentLocation(): string {
  return useLocation().pathname.replace(/(.*)\/+$/, '$1');
}
