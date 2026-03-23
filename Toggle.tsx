import Animated, { interpolateColor, useAnimatedProps, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { MobileButtonProps } from "./MobileButton";
import { useEffect, useMemo } from "react";
import { colors } from "../../colors/colors";
import { StyleSheet, ViewStyle } from "react-native";
import { HoverButtonProps } from "./DesktopButton";
import { useSettingsStore } from "../../store/SettingsStore";
import { Icon } from "phosphor-react-native";
import ReusablePressable from "./ResusablePressable";
import { PressableEvent } from "react-native-gesture-handler/lib/typescript/components/Pressable/PressableProps";

type ToggleProps = (HoverButtonProps | MobileButtonProps) & {
    iconSize?: number,
    disabledTextColor?: string,
    inActive?: boolean,
    isActive: boolean,
    inActiveColor?: string,
    activeColor?: string,
    inActiveTextColor?: string,
    activeTextColor?: string,
    Icon?: Icon | null,
    onPress: (event: PressableEvent) => void,
    style?: ViewStyle
}

export default function Toggle({ iconSize = 20, Icon, disabledTextColor = colors.grey7, inActive, onPress, style = { ...styles.container, paddingHorizontal: 19 }, isActive, children, inActiveColor = colors.grey9, activeColor: givenActiveColor, inActiveTextColor = colors.grey5, activeTextColor = colors.grey10, ...props }: ToggleProps) {
    const colorValue = useSharedValue(0)
    const isDarkMode = useSettingsStore(s => s.isDarkMode)

    const activeColor = givenActiveColor || isDarkMode ? colors.yellowMain : colors.yellowMainDark

    useEffect(() => {
        if (isActive && !inActive) colorValue.value = withTiming(100)
        else if (inActive) colorValue.value = withTiming(-40)
        else colorValue.value = withTiming(0)
    }, [isActive, inActive])

    const ButtonStyle = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(colorValue.value, [0, 100], [inActiveColor, activeColor])
    }), [activeColor, inActiveColor])

    const AnimatedTextStyle = children && useAnimatedStyle(() => ({
        color: interpolateColor(colorValue.value, [-40, 0, 100], [disabledTextColor, inActiveTextColor, activeTextColor])
    }), [disabledTextColor, inActiveTextColor, activeTextColor])

    const AnimatedIcon = useMemo(() => Icon && Animated.createAnimatedComponent(Icon), [])

    const AnimatedIconProps = Icon && useAnimatedProps(() => ({
        color: interpolateColor(colorValue.value, [-40, 0, 100], [disabledTextColor, inActiveTextColor, activeTextColor])
    }), [disabledTextColor, inActiveTextColor, activeTextColor])

    return (
        <ReusablePressable {...(props as any)} vibration hoverScale={1.05} pressScale={0.95} onPress={!inActive ? onPress : () => { }} style={[style, ButtonStyle]}>
            {AnimatedIcon && <AnimatedIcon animatedProps={AnimatedIconProps} size={iconSize} weight='bold' />}
            {children && <Animated.Text style={[styles.toggleText, AnimatedTextStyle, { fontSize: 15, includeFontPadding: false }]}>{children}</Animated.Text>}
        </ReusablePressable>
    )
}

const styles = StyleSheet.create(({
    container: {
        // width: '100',
        // alignItems: 'center',
        justifyContent: 'center',
        flex: 0,
        borderRadius: 50,
        paddingHorizontal: 19,
        paddingVertical: 5,
        overflow: 'visible'
    },
    toggleText: {
        includeFontPadding: false,
        fontFamily: 'Poppins_Medium',
        fontSize: 15
    }
}))