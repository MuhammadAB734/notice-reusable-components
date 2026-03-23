import { PressableProps, StyleSheet, Text, TextStyle, View, ViewProps, ViewStyle } from "react-native"
import ReusablePressable from "./ResusablePressable"
import { colors } from "../../colors/colors"
import { useSettingsStore } from "../../store/SettingsStore"
import { RefObject } from "react"
import { HoverButtonProps } from "./DesktopButton"
import { MobileButtonProps } from "./MobileButton"

type ButtonOption = {
    text: string,
    onPress: () => void,
    ref?: RefObject<View>
}

type MultiOptButtonProps = ViewProps & {
    style?: ViewStyle,
    options: ButtonOption[],
    buttonStyle?: ViewStyle,
    textStyle?: TextStyle,
    buttonProps?: HoverButtonProps | MobileButtonProps
}

export default function MultiOptButton({ buttonProps = {}, textStyle, options, style, buttonStyle, ...props }: MultiOptButtonProps) {
    const { isDarkMode, isDesktop } = useSettingsStore()

    return (
        <View style={[styles.container, style]}>
            {options.map(({ text, ...props }, index) => (
                <ReusablePressable hoverScale={1.03} pressScale={0.96} {...buttonProps} {...props} style={
                    [
                        styles.buttonContainer,
                        {
                            borderTopLeftRadius: !index ? 25 :2, borderBottomLeftRadius: !index ? 25 : 2,
                            borderTopRightRadius: index === options.length - 1 ? 25 : 2, borderBottomRightRadius: index === options.length - 1 ? 25 : 2,
                            backgroundColor: isDarkMode ? colors.grey85 : colors.grey1,
                            paddingRight: index===options.length-1 ? 15 : 10,
                            paddingLeft: !index ? 15 : 10
                        },
                        buttonStyle
                    ]}>
                    <Text style={[styles.buttonText, { fontSize: 13, color: isDarkMode ? colors.grey0 : colors.grey9 }, textStyle]}>
                        {text}
                    </Text>
                </ReusablePressable>
            ))
            }
        </View>
    )
}

const styles = StyleSheet.create(({
    container: {
        gap: 1.5,
        flexDirection: 'row',
    },
    buttonText: {
        fontFamily: 'Poppins_Medium',
        fontSize: 15,
        color: colors.grey9,
        includeFontPadding: false,
    },
    buttonContainer: {
        backgroundColor: colors.grey85,
        flexWrap: 'nowrap',
        flexDirection: 'row',
        paddingHorizontal: 10,
        gap: 7,
        alignItems: 'center',
        justifyContent: 'center'
    },
}))