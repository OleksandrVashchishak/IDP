import { useEffect } from 'react';
import ReactGA from 'react-ga';

export default function useGoogleAnalytics(title: string): void {
  useEffect(() => {
    ReactGA.set({ page: title });
    ReactGA.send({ pageview: window.location.pathname + window.location.search });
  }, []);
}
