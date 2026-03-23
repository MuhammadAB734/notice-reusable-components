import { Pressable, StyleProp, StyleSheet, TextStyle, View, ViewStyle } from "react-native";
import { colors } from "../../colors/colors";
import Animated, { Easing, FadeIn, interpolateColor, useAnimatedProps, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useEffect, useMemo } from "react";
import { LightHaptic } from "../../util/Haptics";
import { useSettingsStore } from "../../store/SettingsStore";
import { Icon } from "phosphor-react-native";

type ButtonProp = {
    icon?: Icon,
    text?: string,
    onPress: Function,
    active: boolean
}

type SlideToggleProps = {
    hoverScale?: number,
    inActiveTextColor?: string,
    activeTextColor?: string,
    buttons: ButtonProp[],
    textStyle?: StyleProp<TextStyle>,
    sliderStyle?: StyleProp<ViewStyle>,
    containerStyle?: StyleProp<ViewStyle>,
    buttonStyle?: StyleProp<ViewStyle>,
}

export default function SlideToggle({ hoverScale = 1.05, activeTextColor = colors.grey9, inActiveTextColor = colors.grey5, buttons: allButtons = [{ text: 'button', onPress: () => { }, active: true }], textStyle = styles.buttonText, sliderStyle = styles.slider, containerStyle = styles.container, buttonStyle = styles.buttonContainer }: SlideToggleProps) {
    const buttons = allButtons.filter((button) => (!!button.text || !!button.icon) && !!button.onPress)
    const xPosValue = useSharedValue((() => {
        let index = 0;
        buttons.find(({ active }, i) => {
            if (active) {
                index = i
                return true
            }
        })
        return index
    })())
    const scaleValue = useSharedValue(1)

    const isDarkMode = useSettingsStore(s => s.isDarkMode)

    const AnimtedSliderStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: `${xPosValue.value * 100}%` }, { scale: scaleValue.value }],
    }))

    return (
        <Animated.View entering={FadeIn} style={containerStyle}>
            <Animated.View style={[{ backgroundColor: isDarkMode ? colors.yellowMain : colors.yellowMainDark }, sliderStyle, { width: `${100 / buttons.length}%` }, AnimtedSliderStyle]} />
            {buttons.map(({ icon, text, onPress, active }, index) => {
                const AnimatedIcon = useMemo(() => icon ? Animated.createAnimatedComponent(icon) : null, [])

                useEffect(() => {
                    if (active) xPosValue.value = withTiming(index, { duration: 300, easing: Easing.inOut(Easing.quad) })
                }, [active])

                const AnimtedBTextStyle = useAnimatedStyle(() => ({
                    color: interpolateColor(xPosValue.value, [...Array.from({ length: index }, (_, i) => i), index, ...Array.from({ length: buttons.length - index }, (_, i) => i + index + 1)], [...Array(index).fill(inActiveTextColor), activeTextColor, ...Array(buttons.length - index).fill(inActiveTextColor)])
                }))

                const animatedIconProps = useAnimatedProps(() => ({
                    color: interpolateColor(xPosValue.value, [...Array.from({ length: index }, (_, i) => i), index, ...Array.from({ length: buttons.length - index }, (_, i) => i + index + 1)], [...Array(index).fill(inActiveTextColor), activeTextColor, ...Array(buttons.length - index).fill(inActiveTextColor)])
                }))

                return (
                    <Pressable key={index} onPress={() => {
                        LightHaptic()
                        onPress()
                    }} style={[buttonStyle]}
                        onHoverIn={() => scaleValue.value = withTiming(hoverScale)} onHoverOut={() => scaleValue.value = withTiming(1)}
                    >
                        {AnimatedIcon && <AnimatedIcon weight='bold' animatedProps={animatedIconProps} size={20} />}
                        {text && <Animated.Text numberOfLines={1} style={[{ includeFontPadding: false }, textStyle, AnimtedBTextStyle]}>{text}</Animated.Text>}
                    </Pressable>
                )
            })}
        </Animated.View>
    )
}

const styles = StyleSheet.create(({
    container: {
        flexDirection: 'row',
        width: '100%',
        height: '100%',
        borderRadius: 50,
    },
    slider: {
        borderRadius: 50,
        position: 'absolute',
        left: 0,
        top: 0,
        height: '100%',
    },
    buttonContainer: {
        flex: 1,
        gap: 7,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        maxWidth: '60%',
        includeFontPadding: false,
        fontFamily: 'Poppins_Medium',
        fontSize: 15
    }
}))