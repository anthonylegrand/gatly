import {
  getTrackingPermissionsAsync,
  requestTrackingPermissionsAsync,
} from "expo-tracking-transparency";
import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import mobileAds, {
  AdEventType,
  BannerAd,
  BannerAdSize,
  MaxAdContentRating,
  RewardedAdEventType,
  RewardedInterstitialAd,
  TestIds,
} from "react-native-google-mobile-ads";

// ─── Ad Unit IDs ────────────────────────────────────────────────────────────

const IS_DEV = __DEV__;

export const AD_UNITS = {
  banner: IS_DEV
    ? TestIds.ADAPTIVE_BANNER
    : "ca-app-pub-2586509557098502/2556443398",
  rewardedInterstitial: IS_DEV
    ? TestIds.REWARDED_INTERSTITIAL
    : "ca-app-pub-2586509557098502/1746013891",
} as const;

// ─── Initialization ──────────────────────────────────────────────────────────

export async function initAdmob(): Promise<void> {
  if (Platform.OS === "ios") {
    const { status } = await getTrackingPermissionsAsync();
    if (status === "undetermined") {
      await requestTrackingPermissionsAsync();
    }
  }

  await mobileAds().setRequestConfiguration({
    maxAdContentRating: MaxAdContentRating.PG,
    tagForChildDirectedTreatment: false,
    tagForUnderAgeOfConsent: false,
  });
  await mobileAds().initialize();
}

// ─── Banner ──────────────────────────────────────────────────────────────────

type AdBannerProps = {
  unitId?: string;
  size?: BannerAdSize;
};

export function AdBanner({
  unitId = AD_UNITS.banner,
  size = BannerAdSize.LARGE_ANCHORED_ADAPTIVE_BANNER,
}: AdBannerProps) {
  return (
    <BannerAd
      unitId={unitId}
      size={size}
      requestOptions={{ requestNonPersonalizedAdsOnly: true }}
    />
  );
}

// ─── Rewarded Interstitial hook ───────────────────────────────────────────────

type UseRewardedInterstitialOptions = {
  unitId?: string;
  onRewarded?: (type: string, amount: number) => void;
  onClosed?: () => void;
};

type UseRewardedInterstitialReturn = {
  loaded: boolean;
  show: () => void;
};

export function useRewardedInterstitial({
  unitId = AD_UNITS.rewardedInterstitial,
  onRewarded,
  onClosed,
}: UseRewardedInterstitialOptions = {}): UseRewardedInterstitialReturn {
  const adRef = useRef<RewardedInterstitialAd | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const ad = RewardedInterstitialAd.createForAdRequest(unitId, {
      requestNonPersonalizedAdsOnly: true,
    });
    adRef.current = ad;

    const unsubLoaded = ad.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        setLoaded(true);
      },
    );

    const unsubRewarded = ad.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      (reward) => {
        onRewarded?.(reward.type, reward.amount);
      },
    );

    const unsubClosed = ad.addAdEventListener(AdEventType.CLOSED, () => {
      setLoaded(false);
      onClosed?.();
      ad.load();
    });

    const unsubError = ad.addAdEventListener(AdEventType.ERROR, () => {
      setLoaded(false);
    });

    ad.load();

    return () => {
      unsubLoaded();
      unsubRewarded();
      unsubClosed();
      unsubError();
    };
  }, [unitId]);

  const show = () => {
    if (loaded && adRef.current) {
      adRef.current.show();
    }
  };

  return { loaded, show };
}
