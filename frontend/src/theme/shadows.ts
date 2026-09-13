import { ViewStyle, Platform } from 'react-native';

/**
 * Luminous Alabaster Elevation & Glass Shadows
 * Double-drop ambient diffusion
 */

export const shadows = {
  level1: Platform.select<ViewStyle>({
    web: {
      boxShadow: '0 1px 2px rgba(22, 22, 22, 0.02), 0 8px 24px -4px rgba(22, 22, 22, 0.04)',
    } as any,
    default: {
      shadowColor: '#161616',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.04,
      shadowRadius: 12,
      elevation: 2,
    },
  }),
  level2: Platform.select<ViewStyle>({
    web: {
      boxShadow: '0 16px 32px -8px rgba(22, 22, 22, 0.08)',
    } as any,
    default: {
      shadowColor: '#161616',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.08,
      shadowRadius: 20,
      elevation: 4,
    },
  }),
  level3: Platform.select<ViewStyle>({
    web: {
      boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.28)',
    } as any,
    default: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.28,
      shadowRadius: 28,
      elevation: 8,
    },
  }),
  auroraGlow: Platform.select<ViewStyle>({
    web: {
      boxShadow: '0 8px 20px -4px rgba(244, 63, 94, 0.35)',
    } as any,
    default: {
      shadowColor: '#FF6B4A',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.35,
      shadowRadius: 14,
      elevation: 6,
    },
  }),
};
