
import { Template } from '@/types/template';
import { fashionTemplates } from './fashionTemplates';
import { electronicsTemplates } from './electronicsTemplates';
import { beautyTemplates } from './beautyTemplates';
import { foodTemplates } from './foodTemplates';
import { sportsTemplates } from './sportsTemplates';
import { homeTemplates } from './homeTemplates';
import { artTemplates } from './artTemplates';

export const preBuiltTemplates: Template[] = [
  ...fashionTemplates,
  ...electronicsTemplates,
  ...beautyTemplates,
  ...foodTemplates,
  ...sportsTemplates,
  ...homeTemplates,
  ...artTemplates
];
