import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

type Props = {
  size?: number;
  color?: string;
};

export default function BlinkedEye({ size = 35, color = "#FFFFFF" }: Props) {
  const scaleY = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const blink = () => {
      Animated.sequence([
        Animated.timing(scaleY, {
          toValue: 0.05,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.timing(scaleY, {
          toValue: 1,
          duration: 130,
          useNativeDriver: true,
        }),
      ]).start(() => {
        timeoutId = setTimeout(blink, 2000 + Math.random() * 2000);
      });
    };

    timeoutId = setTimeout(blink, 1000);
    return () => clearTimeout(timeoutId);
  }, []);

  const w = size * 1.35;
  const h = size;
  const r = h / 2;
  const pupilSize = h * 0.55;
  const highlightSize = pupilSize * 0.3;

  return (
    <View
      style={{
        width: w,
        height: h,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Animated.View
        style={{
          width: w,
          height: h,
          borderRadius: r,
          backgroundColor: color,
          justifyContent: "center",
          alignItems: "center",
          transform: [{ scaleY }],
        }}
      >
        <View
          style={{
            width: pupilSize,
            height: pupilSize,
            borderRadius: pupilSize / 2,
            backgroundColor: "#1A1040",
            justifyContent: "flex-start",
            alignItems: "flex-end",
            padding: 3,
          }}
        >
          <View
            style={{
              width: highlightSize,
              height: highlightSize,
              borderRadius: highlightSize / 2,
              backgroundColor: color,
              opacity: 0.7,
            }}
          />
        </View>
      </Animated.View>
    </View>
  );
}
