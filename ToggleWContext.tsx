import Animated, { interpolateColor, useAnimatedProps, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { Icon } from "phosphor-react-native";
import { useEffect, useMemo } from "react";
import { colors } from "../../colors/colors";
import { Falsy, Pressable, PressableProps, RegisteredStyle, StyleProp, StyleSheet, ViewStyle } from "react-native";
import { useSettingsStore } from "../../store/SettingsStore";
import ContextMenu, { ContextMenuAction } from "react-native-context-menu-view";
import ReusablePressable from "./ResusablePressable";
import AnimatedPressable, { MobileButtonProps } from "./MobileButton";
import { HoverButtonProps } from "./DesktopButton";

type ToggleProps = (HoverButtonProps | MobileButtonProps) & {
    iconSize?: number,
    disabledTextColor?: string,
    isDesktop?: boolean,
    inActive?: boolean,
    isActive: boolean,
    inActiveColor?: string,
    activeColor?: string,
    inActiveTextColor?: string,
    activeTextColor?: string,
    Icon?: Icon | null,
    actions: Array<ContextMenuAction>,
    onSelectAction: Function,
    containerStyle: RegisteredStyle<ViewStyle> | Falsy,
    style: RegisteredStyle<ViewStyle> | Falsy,
}

export default function ToggleWContext({ containerStyle, onSelectAction, actions, iconSize = 20, Icon, disabledTextColor = colors.grey7, isDesktop, inActive, onPress, style = { ...styles.container, paddingHorizontal: 19 }, isActive, children, inActiveColor = colors.grey9, activeColor: givenActiveColor, inActiveTextColor = colors.grey5, activeTextColor = colors.grey10, ...props }: ToggleProps) {
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

    const AnimatedTextStyle = useAnimatedStyle(() => ({
        color: interpolateColor(colorValue.value, [-40, 0, 100], [disabledTextColor, inActiveTextColor, activeTextColor])
    }), [disabledTextColor, inActiveTextColor, activeTextColor])

    const AnimatedIcon = useMemo(() => Icon ? Animated.createAnimatedComponent(Icon) : null, [])

    const AnimatedIconProps = Icon ? useAnimatedProps(() => ({
        color: interpolateColor(colorValue.value, [-40, 0, 100], [disabledTextColor, inActiveTextColor, activeTextColor])
    }), [disabledTextColor, inActiveTextColor, activeTextColor]) : null

    return (
        <ContextMenu
            actions={actions}
            onPress={({ nativeEvent: { name } }) => onSelectAction(name)}
        // style={[containerStyle]}
        >
            <ReusablePressable {...props} vibration hoverScale={1.05} pressScale={0.95} onPress={!inActive ? onPress : () => { }} style={[style, ButtonStyle]}>
                {AnimatedIcon ?
                    <AnimatedIcon animatedProps={AnimatedIconProps} size={iconSize} weight='bold' />
                    :
                    <Animated.Text style={[styles.toggleText, AnimatedTextStyle, { fontSize: 15, includeFontPadding: false }]}>{children}</Animated.Text>}
            </ReusablePressable>
        </ContextMenu>
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
        overflow: 'visible',
        height: '100%'
    },
    toggleText: {
        includeFontPadding: false,
        fontFamily: 'Poppins_Medium',
        fontSize: 15
    }
}))