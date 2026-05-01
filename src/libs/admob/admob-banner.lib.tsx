import { View, useWindowDimensions } from "react-native";
import mobileAds, {
  BannerAd,
  BannerAdSize,
  MaxAdContentRating,
  TestIds,
} from "react-native-google-mobile-ads";

const IS_DEV = __DEV__;

export const BANNER_AD_UNIT = IS_DEV
  ? TestIds.ADAPTIVE_BANNER
  : "ca-app-pub-2586509557098502/2556443398";

export async function initAdmob(): Promise<void> {
  await mobileAds().setRequestConfiguration({
    maxAdContentRating: MaxAdContentRating.PG,
    tagForChildDirectedTreatment: false,
    tagForUnderAgeOfConsent: false,
  });
  await mobileAds().initialize();
}

type AdBannerProps = {
  unitId?: string;
  size?: BannerAdSize;
};

export function AdBanner({
  unitId = BANNER_AD_UNIT,
  size = BannerAdSize.LARGE_ANCHORED_ADAPTIVE_BANNER,
}: AdBannerProps) {
  const { height } = useWindowDimensions();
  if (height < 800) size = BannerAdSize.BANNER;

  return (
    <View style={{ alignItems: "center" }}>
      <BannerAd
        unitId={unitId}
        size={size}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
      />
    </View>
  );
}
