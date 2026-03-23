import { Pressable, PressableProps, ViewProps, ViewStyle } from "react-native"
import Animated, { AnimatedProps, AnimatedStyle, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"
import { LightHaptic } from "../../util/Haptics"

const AnimatedConfig = {
    duration: 100
}

const AnimatedButton = Animated.createAnimatedComponent(Pressable)

export type MobileButtonProps =
    PressableProps &
    AnimatedProps<ViewProps> &
    {
        pressScale?: number,
        vibration?: boolean,
        style?: AnimatedStyle<ViewStyle>[],
    } & {
        [key: string]: any
    }
    ;


export default function AnimatedPressable({ vibration = false, onPress = () => { }, pressScale = 0.8, style = [], children, ...props }: MobileButtonProps) {
    const scaleValue = useSharedValue(1)

    const AnimtedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scaleValue.value }]
    }))

    return (
        <AnimatedButton onTouchStart={() => scaleValue.value = withTiming(pressScale, AnimatedConfig)} onTouchEnd={() => scaleValue.value = withTiming(1, AnimatedConfig)} onTouchCancel={() => scaleValue.value = withTiming(1, AnimatedConfig)} onPress={args => {
            if (vibration) LightHaptic()
            onPress(args)
        }} style={typeof style === 'object' ? [AnimtedStyle, style] : [AnimtedStyle, ...style]} {...props}>
            {children}
        </AnimatedButton>
    )
}