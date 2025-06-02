// src/components/WeatherIndicator.tsx

import rain from '../assets/icons/rain.png';
import clouds from '../assets/icons/clouds.png';
import sunClouds from '../assets/icons/sun_clouds.png';
import sun from '../assets/icons/sun.png';

import { useEffect, useState } from 'react';

interface ZoneDistribution {
  zone: string;
  count: number;
}

export function WeatherIndicator() {
  const [icon, setIcon] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:8080/trades/monitor')
      .then((res) => res.json())
      .then((data) => {
        const groups = {
          group1: 0, // Z1 + Z2
          group2: 0, // Z3 + Z4
          group3: 0, // Z5 + Z6
          group4: 0, // Z7 + Z8
        };

        (data.zone_distribution as ZoneDistribution[]).forEach(({ zone, count }) => {
          if (zone === 'Z1' || zone === 'Z2') groups.group1 += count;
          else if (zone === 'Z3' || zone === 'Z4') groups.group2 += count;
          else if (zone === 'Z5' || zone === 'Z6') groups.group3 += count;
          else if (zone === 'Z7' || zone === 'Z8') groups.group4 += count;
        });

        const maxGroup = Object.entries(groups).reduce((a, b) => (a[1] > b[1] ? a : b))[0];

        const iconMap = {
          group1: rain,
          group2: clouds,
          group3: sunClouds,
          group4: sun,
        };

        setIcon(iconMap[maxGroup]);
      });
  }, []);

  if (!icon) return null;

  return (
    <div className="absolute top-4 left-4 z-50">
      <img src={icon} alt="Weather Icon" className="w-12 h-12" />
    </div>
  );
}
