import { TextStyle, Platform } from 'react-native';

/**
 * Luminous Alabaster Typographic System
 * Fonts: Plus Jakarta Sans (Headlines), Inter (Body), JetBrains Mono (Metrics)
 * System font fallbacks configured for cross-platform robustness.
 */

const getFontFamily = (type: 'headline' | 'body' | 'mono', weight: 'regular' | 'medium' | 'semibold' | 'bold') => {
  if (Platform.OS === 'web') {
    if (type === 'headline') return "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    if (type === 'mono') return "'JetBrains Mono', SFMono-Regular, Menlo, Monaco, Consolas, monospace";
    return "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  }
  // Native fallbacks
  if (type === 'mono') return Platform.OS === 'ios' ? 'Menlo' : 'monospace';
  return Platform.OS === 'ios' ? 'System' : 'sans-serif';
};

export const typography: Record<string, TextStyle> = {
  displayHero: {
    fontFamily: getFontFamily('headline', 'bold'),
    fontSize: 36,
    lineHeight: 42,
    fontWeight: '700',
    letterSpacing: -0.8,
  },
  displayHeroMobile: {
    fontFamily: getFontFamily('headline', 'bold'),
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '700',
    letterSpacing: -0.6,
  },
  headlineLg: {
    fontFamily: getFontFamily('headline', 'semibold'),
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '600',
    letterSpacing: -0.5,
  },
  headlineMd: {
    fontFamily: getFontFamily('headline', 'semibold'),
    fontSize: 19,
    lineHeight: 25,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  headlineSm: {
    fontFamily: getFontFamily('headline', 'semibold'),
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  bodyLg: {
    fontFamily: getFontFamily('body', 'regular'),
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
    letterSpacing: -0.1,
  },
  bodyMd: {
    fontFamily: getFontFamily('body', 'regular'),
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    letterSpacing: 0,
  },
  bodySm: {
    fontFamily: getFontFamily('body', 'regular'),
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400',
    letterSpacing: 0.1,
  },
  labelCaps: {
    fontFamily: getFontFamily('body', 'semibold'),
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  monoMetric: {
    fontFamily: getFontFamily('mono', 'medium'),
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    letterSpacing: -0.1,
  },
};
