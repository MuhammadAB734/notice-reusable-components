import { useShallow } from "zustand/shallow";
import { useSettingsStore } from "../../store/SettingsStore";
import DesktopButton, { HoverButtonProps } from "./DesktopButton";
import AnimatedPressable, { MobileButtonProps } from "./MobileButton";


export default function ReusablePressable(props: HoverButtonProps | MobileButtonProps) {
    const isDesktop = useSettingsStore(useShallow(s => s.isDesktop))

    return isDesktop ? <DesktopButton {...(props as HoverButtonProps)} /> : <AnimatedPressable {...(props as MobileButtonProps)} />
}