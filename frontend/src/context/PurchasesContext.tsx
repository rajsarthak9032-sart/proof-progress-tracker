import React, { createContext, useContext, useState, useEffect } from 'react';
import { CustomerInfo, PurchasesOffering, PurchasesPackage } from 'react-native-purchases';
import { purchasesService, isRevenueCatConfigured, REVENUECAT_ENTITLEMENT_ID } from '../services/purchases';
import { useAuth } from './AuthContext';

interface PurchasesContextType {
  isPro: boolean;
  customerInfo: CustomerInfo | null;
  offering: PurchasesOffering | null;
  loading: boolean;
  isConfigured: boolean;
  purchasePackage: (pkg: PurchasesPackage) => Promise<{ success: boolean; error?: string }>;
  restorePurchases: () => Promise<{ success: boolean; error?: string }>;
}

const PurchasesContext = createContext<PurchasesContextType>({} as PurchasesContextType);

export const PurchasesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [offering, setOffering] = useState<PurchasesOffering | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isConfigured, setIsConfigured] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    async function initPurchases() {
      if (!isRevenueCatConfigured) {
        if (isMounted) setLoading(false);
        return;
      }

      const configured = await purchasesService.init(user?.id);
      if (isMounted) setIsConfigured(configured);

      if (configured) {
        const info = await purchasesService.getCustomerInfo();
        if (isMounted) setCustomerInfo(info);

        const currentOffering = await purchasesService.getOfferings();
        if (isMounted) setOffering(currentOffering);

        purchasesService.addCustomerInfoUpdateListener((updatedInfo) => {
          if (isMounted) setCustomerInfo(updatedInfo);
        });
      }

      if (isMounted) setLoading(false);
    }

    initPurchases();

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  // Derived strictly from the official RevenueCat entitlement
  const isPro = Boolean(customerInfo?.entitlements.active[REVENUECAT_ENTITLEMENT_ID]);

  const purchasePackage = async (pkg: PurchasesPackage) => {
    setLoading(true);
    const result = await purchasesService.purchasePackage(pkg);
    setLoading(false);
    if (result.customerInfo) {
      setCustomerInfo(result.customerInfo);
      return { success: true };
    }
    return { success: false, error: result.error };
  };

  const restorePurchases = async () => {
    setLoading(true);
    const result = await purchasesService.restorePurchases();
    setLoading(false);
    if (result.customerInfo) {
      setCustomerInfo(result.customerInfo);
      return { success: true };
    }
    return { success: false, error: result.error };
  };

  return (
    <PurchasesContext.Provider
      value={{
        isPro,
        customerInfo,
        offering,
        loading,
        isConfigured,
        purchasePackage,
        restorePurchases,
      }}
    >
      {children}
    </PurchasesContext.Provider>
  );
};

export const usePurchases = () => useContext(PurchasesContext);
