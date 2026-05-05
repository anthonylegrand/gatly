import { useEffect, useRef, useState } from "react";
import {
  AdEventType,
  RewardedAdEventType,
  RewardedInterstitialAd,
  TestIds,
} from "react-native-google-mobile-ads";

const IS_DEV = __DEV__;

const REWARDED_INTERSTITIAL_AD_UNIT = IS_DEV
  ? TestIds.REWARDED_INTERSTITIAL
  : "ca-app-pub-2586509557098502/1746013891";

type Options = {
  unitId?: string;
  onRewarded?: (type: string, amount: number) => void;
  onClosed?: () => void;
};

type Return = {
  loaded: boolean;
  load: () => void;
  show: () => void;
};

export function useRewardedInterstitial({
  unitId = REWARDED_INTERSTITIAL_AD_UNIT,
  onRewarded,
  onClosed,
}: Options = {}): Return {
  const adRef = useRef<RewardedInterstitialAd | null>(null);
  const [loaded, setLoaded] = useState(false);
  const pendingShow = useRef(false);
  const onRewardedRef = useRef(onRewarded);
  const onClosedRef = useRef(onClosed);
  onRewardedRef.current = onRewarded;
  onClosedRef.current = onClosed;

  useEffect(() => {
    const ad = RewardedInterstitialAd.createForAdRequest(unitId, {
      requestNonPersonalizedAdsOnly: true,
    });
    adRef.current = ad;

    const unsubLoaded = ad.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        setLoaded(true);
        if (pendingShow.current) {
          pendingShow.current = false;
          ad.show();
        }
      },
    );

    const unsubRewarded = ad.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      (reward) => {
        onRewardedRef.current?.(reward.type, reward.amount);
      },
    );

    const unsubClosed = ad.addAdEventListener(AdEventType.CLOSED, () => {
      setLoaded(false);
      onClosedRef.current?.();
      ad.load();
    });

    const unsubError = ad.addAdEventListener(AdEventType.ERROR, () => {
      setLoaded(false);
      pendingShow.current = false;
    });

    ad.load();

    return () => {
      unsubLoaded();
      unsubRewarded();
      unsubClosed();
      unsubError();
    };
  }, [unitId]);

  // No-op si déjà chargé
  const load = () => {
    if (!loaded && adRef.current) adRef.current.load();
  };

  // Auto-charge et affiche dès que prêt si pas encore chargé
  const show = () => {
    if (!adRef.current) return;
    if (loaded) {
      adRef.current.show();
    } else {
      pendingShow.current = true;
      adRef.current.load();
    }
  };

  return { loaded, load, show };
}
