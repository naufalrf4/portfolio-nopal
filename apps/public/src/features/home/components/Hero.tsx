import type { AboutData } from './types';
import { HeroClient } from './HeroClient';

interface HeroProps {
  about: AboutData;
}

export function Hero({ about }: HeroProps) {
  return <HeroClient about={about} />;
}
