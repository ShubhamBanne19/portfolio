import { SocialLink } from 'src/app/data';

export const trackBySocial = (_: number, s: SocialLink): string => s.url ?? s.label;
