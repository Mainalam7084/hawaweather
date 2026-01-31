import {
    Sun,
    CloudSun,
    Cloud,
    CloudFog,
    CloudDrizzle,
    CloudRain,
    CloudSnow,
    CloudLightning,
    HelpCircle,
} from 'lucide-react';
import { getWeatherIconName } from '../../i18n/weatherCodes';

const iconMap = {
    Sun,
    CloudSun,
    Cloud,
    CloudFog,
    CloudDrizzle,
    CloudRain,
    CloudSnow,
    CloudLightning,
    HelpCircle,
};

export function WeatherIcon({ code, className = '', size = 24 }) {
    const iconName = getWeatherIconName(code);
    const IconComponent = iconMap[iconName] || HelpCircle;

    return <IconComponent className={className} size={size} />;
}
