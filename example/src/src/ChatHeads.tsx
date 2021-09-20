import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
} from 'react-native-reanimated';
import { View, Button, Text } from 'react-native';
import React from 'react';

function AnimatedStyleUpdateExample(): React.ReactElement {
  const randomWidth = useSharedValue(10);

  const config = {
    duration: 500,
    easing: Easing.bezier(0.5, 0.01, 0, 1),
  };

  const style = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: randomWidth.value / 50 }],
      width: withTiming(randomWidth.value, config, () => randomWidth.value = Math.random() * 350),
    };
  });

  return (
    <View
      style={{
        height: 200,
        flexDirection: 'column',
      }}>
      <Animated.View
        style={[
          { width: 100, height: 80, backgroundColor: 'black', margin: 30 },
          style,
        ]}
      >
        <Text style={{ color: "white" }}>{!!global.HermesInternal ? "HERMES" : "JSC"}</Text>

      </Animated.View>
    </View>
  );
}

export default AnimatedStyleUpdateExample;
