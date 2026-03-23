import { Pressable, PressableProps } from "react-native-gesture-handler";
import Animated, { AnimatedProps, FadeOut, runOnJS, useAnimatedReaction, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { Text, View, type ViewProps } from "react-native";
import { colors } from "../../colors/colors";
import { useSettingsStore } from "../../store/SettingsStore";
import { useShallow } from "zustand/shallow";
import { CaretDown, CaretUp } from "phosphor-react-native";

const AnimationConfig = {
    duration: 200
}

const AnimPressable = Animated.createAnimatedComponent(Pressable)

export type TooltipProps = {
    title: string,
    position?: 'bottom' | 'top',
    space?: number,
    hSpace?: number,
    backgroundColor?: string,
    textColor?: string
}

export type HoverButtonProps =
    PressableProps &
    AnimatedProps<ViewProps> &
    {
        hoverScale?: number,
        tooltip?: TooltipProps | string | null
    }
    ;

export default function DesktopButton({ onPress = () => { }, tooltip, style = {}, hoverScale = 1.1, children, ...props }: HoverButtonProps) {
    const scaleValue = useSharedValue(1)
    const tooltipOpacity = useSharedValue(0)
    const tooltipPos = useSharedValue({ x: 0, y: 0 })
    const tooltipWidth = useSharedValue(0)

    const isHovering = useSharedValue(false)

    const isDarkMode = useSettingsStore(useShallow(s => s.isDarkMode))

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scaleValue.value }]
    }), [])

    const tooltipAnimStl = useAnimatedStyle(() => ({
        opacity: tooltipOpacity.value,
        top: tooltipPos.value.y,
        left: tooltipPos.value.x - tooltipWidth.value / 2,
    }), [tooltip])

    function onHover(state: boolean) {
        let timeOut;

        if (state) timeOut = setTimeout(() => {
            if (isHovering.value) tooltipOpacity.value = withTiming(1, AnimationConfig)
        }, 500)
        else {
            timeOut?.close?.()
            tooltipOpacity.value = withTiming(0, AnimationConfig)
        }
    }

    useAnimatedReaction(() => isHovering.value, state => {
        runOnJS(onHover)(state)
    })

    return (
        <>
            {tooltip &&
                <Animated.View
                    onLayout={({ nativeEvent: { layout: { width } } }) => tooltipWidth.value = width}
                    pointerEvents={'none'} style={[{
                        position: 'absolute',
                        zIndex: 10,
                        paddingVertical: 11,
                        paddingHorizontal: 20, borderRadius: 25,
                        // boxShadow: [{
                        //     offsetX: 0,
                        //     offsetY: 2,
                        //     blurRadius: 10,
                        //     spreadDistance: 0,
                        //     color: '#00000022',
                        //     inset: false,
                        // }], 
                        backgroundColor: tooltip?.backgroundColor || (isDarkMode ? colors.grey9 : colors.grey1)
                    }, tooltipAnimStl]}>
                    <View style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        transform: [{translateX: -(tooltip.hSpace || 0)}],
                        [tooltip?.position === "top" ? 'bottom' : 'top']: -15,
                        zIndex: 10,
                        alignItems: 'center'
                    }}>
                        {tooltip?.position === "top" ?
                            <CaretDown size={30} color={tooltip?.backgroundColor || (isDarkMode ? colors.grey9 : colors.grey1)} weight="fill" />
                            :
                            <CaretUp size={30} color={tooltip?.backgroundColor || (isDarkMode ? colors.grey9 : colors.grey1)} weight="fill" />
                        }
                    </View>

                    <Text style={{ fontFamily: 'Poppins_Medium', fontSize: 17, includeFontPadding: false, color: tooltip?.textColor || (isDarkMode ? colors.grey0 : colors.grey9) }}>{tooltip?.title || tooltip}</Text>
                </Animated.View>}

            <AnimPressable
                onPress={arg => {
                    onPress(arg)
                    if (tooltip) isHovering.value = false
                }}

                onLayout={({ nativeEvent: { layout: { width, height, x, y } } }) => {
                    tooltipPos.value = { x: x + width / 2 + (tooltip?.hSpace || 0), y: y + (tooltip?.position === 'top' ? -height : height) + (tooltip?.space || 0) }
                }}
                {...props}
                onHoverIn={() => {
                    if (tooltip) isHovering.value = true
                    scaleValue.value = withTiming(hoverScale, AnimationConfig)
                }}
                onHoverOut={() => {
                    if (tooltip) isHovering.value = false
                    scaleValue.value = withTiming(1, AnimationConfig)
                }}
                style={[style, animatedStyle]}
            >
                {children}
            </AnimPressable>
        </>
    )
}