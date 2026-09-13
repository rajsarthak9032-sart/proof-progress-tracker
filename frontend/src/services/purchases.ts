import { Platform } from 'react-native';
import Purchases, {
  PurchasesOffering,
  PurchasesPackage,
  CustomerInfo,
  LOG_LEVEL,
} from 'react-native-purchases';

export const REVENUECAT_ENTITLEMENT_ID = 'proof_pro';
export const REVENUECAT_PRODUCT_MONTHLY = 'proof_monthly';
export const REVENUECAT_PRODUCT_ANNUAL = 'proof_annual';

const API_KEY_IOS = process.env.EXPO_PUBLIC_REVENUECAT_APPLE_KEY || '';
const API_KEY_ANDROID = process.env.EXPO_PUBLIC_REVENUECAT_GOOGLE_KEY || '';

export const isRevenueCatConfigured = Boolean(
  Platform.OS === 'ios' ? API_KEY_IOS : API_KEY_ANDROID
);

class PurchasesService {
  private isInitialized = false;

  async init(appUserId?: string): Promise<boolean> {
    if (this.isInitialized) return true;

    // RevenueCat Native SDK is available on iOS and Android
    if (Platform.OS !== 'ios' && Platform.OS !== 'android') {
      console.log('[RevenueCat] Native purchases SDK is not supported on web. Running in web/preview mode.');
      return false;
    }

    const apiKey = Platform.OS === 'ios' ? API_KEY_IOS : API_KEY_ANDROID;
    if (!apiKey) {
      console.warn('[RevenueCat] No RevenueCat API key configured for platform:', Platform.OS);
      return false;
    }

    try {
      if (__DEV__) {
        Purchases.setLogLevel(LOG_LEVEL.DEBUG);
      }

      await Purchases.configure({
        apiKey,
        appUserID: appUserId || null,
      });

      this.isInitialized = true;
      console.log('[RevenueCat] Successfully configured for user:', appUserId || 'anonymous');
      return true;
    } catch (err) {
      console.error('[RevenueCat] Error during configure:', err);
      return false;
    }
  }

  async getOfferings(): Promise<PurchasesOffering | null> {
    if (!this.isInitialized) return null;

    try {
      const offerings = await Purchases.getOfferings();
      if (offerings.current !== null) {
        return offerings.current;
      }
      return null;
    } catch (err) {
      console.error('[RevenueCat] Error fetching offerings:', err);
      return null;
    }
  }

  async purchasePackage(pkg: PurchasesPackage): Promise<{ customerInfo: CustomerInfo | null; error?: string }> {
    if (!this.isInitialized) {
      return { customerInfo: null, error: 'RevenueCat is not initialized or running in unsupported environment.' };
    }

    try {
      const { customerInfo } = await Purchases.purchasePackage(pkg);
      return { customerInfo };
    } catch (err: any) {
      if (err.userCancelled) {
        return { customerInfo: null, error: 'Purchase cancelled by user.' };
      }
      return { customerInfo: null, error: err.message || 'Purchase failed.' };
    }
  }

  async restorePurchases(): Promise<{ customerInfo: CustomerInfo | null; error?: string }> {
    if (!this.isInitialized) {
      return { customerInfo: null, error: 'RevenueCat is not initialized.' };
    }

    try {
      const customerInfo = await Purchases.restorePurchases();
      return { customerInfo };
    } catch (err: any) {
      return { customerInfo: null, error: err.message || 'Failed to restore purchases.' };
    }
  }

  async getCustomerInfo(): Promise<CustomerInfo | null> {
    if (!this.isInitialized) return null;

    try {
      return await Purchases.getCustomerInfo();
    } catch (err) {
      console.error('[RevenueCat] Error fetching customer info:', err);
      return null;
    }
  }

  checkProEntitlement(customerInfo: CustomerInfo | null): boolean {
    if (!customerInfo) return false;
    return typeof customerInfo.entitlements.active[REVENUECAT_ENTITLEMENT_ID] !== 'undefined';
  }

  addCustomerInfoUpdateListener(listener: (customerInfo: CustomerInfo) => void) {
    if (this.isInitialized) {
      Purchases.addCustomerInfoUpdateListener(listener);
    }
  }
}

export const purchasesService = new PurchasesService();
