import React, { ComponentType, forwardRef, Ref, useImperativeHandle, useRef } from "react"
import { StyleProp, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { colors, spacing } from "../theme"
import { Text, TextProps } from "./Text"
import RNDateTimePicker, {
  IOSNativeProps,
  AndroidNativeProps,
} from "@react-native-community/datetimepicker"

export interface DateTimePickerAccessoryProps {
  style: StyleProp<any>
  status: DateTimePickerProps["status"]
  multiline: boolean
  editable: boolean
}

export interface DateTimePickerProps extends Omit<IOSNativeProps & AndroidNativeProps, "ref"> {
  /**
   * A style modifier for different input states.
   */
  status?: "error" | "disabled"
  /**
   * The label text to display if not using `labelTx`.
   */
  label?: TextProps["text"]
  /**
   * Label text which is looked up via i18n.
   */
  labelTx?: TextProps["tx"]
  /**
   * Optional label options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  labelTxOptions?: TextProps["txOptions"]
  /**
   * Pass any additional props directly to the label Text component.
   */
  LabelTextProps?: TextProps
  /**
   * The helper text to display if not using `helperTx`.
   */
  helper?: TextProps["text"]
  /**
   * Helper text which is looked up via i18n.
   */
  helperTx?: TextProps["tx"]
  /**
   * Optional helper options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  helperTxOptions?: TextProps["txOptions"]
  /**
   * Pass any additional props directly to the helper Text component.
   */
  HelperTextProps?: TextProps
  /**
   * The placeholder text to display if not using `placeholderTx`.
   */
  placeholder?: TextProps["text"]
  /**
   * Placeholder text which is looked up via i18n.
   */
  placeholderTx?: TextProps["tx"]
  /**
   * Optional placeholder options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  placeholderTxOptions?: TextProps["txOptions"]
  /**
   * Optional input style override.
   */
  style?: StyleProp<TextStyle>
  /**
   * Style overrides for the container
   */
  containerStyle?: StyleProp<ViewStyle>
  /**
   * Style overrides for the input wrapper
   */
  inputWrapperStyle?: StyleProp<ViewStyle>
  /**
   * An optional component to render on the right side of the input.
   * Example: `RightAccessory={(props) => <Icon icon="ladybug" containerStyle={props.style} color={props.editable ? colors.textDim : colors.text} />}`
   * Note: It is a good idea to memoize this.
   */
  RightAccessory?: ComponentType<DateTimePickerAccessoryProps>
  /**
   * An optional component to render on the left side of the input.
   * Example: `LeftAccessory={(props) => <Icon icon="ladybug" containerStyle={props.style} color={props.editable ? colors.textDim : colors.text} />}`
   * Note: It is a good idea to memoize this.
   */
  LeftAccessory?: ComponentType<DateTimePickerAccessoryProps>
}

export const DateTimePicker = forwardRef(function TextDropdown(
  props: DateTimePickerProps,
  ref: Ref<typeof RNDateTimePicker>,
) {
  const {
    labelTx,
    label,
    labelTxOptions,
    helper,
    helperTx,
    helperTxOptions,
    status,
    RightAccessory,
    LeftAccessory,
    HelperTextProps,
    LabelTextProps,
    containerStyle: $containerStyleOverride,
    inputWrapperStyle: $inputWrapperStyleOverride,
    ...DateTimePickerProps
  } = props
  const input = useRef<typeof RNDateTimePicker>()

  const disabled = status === "disabled"

  const $containerStyles = [$containerStyleOverride]

  const $labelStyles = [$labelStyle, LabelTextProps?.style]

  const $inputWrapperStyles = [
    $inputWrapperStyle,
    status === "error" && { borderColor: colors.error },
    LeftAccessory && { paddingStart: 0 },
    RightAccessory && { paddingEnd: 0 },
    $inputWrapperStyleOverride,
  ]

  const $helperStyles = [
    $helperStyle,
    status === "error" && { color: colors.error },
    HelperTextProps?.style,
  ]

  function focusInput() {
    if (disabled) return

    // @ts-ignore
    input.current?.focus()
  }

  useImperativeHandle(ref, () => input.current)

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={$containerStyles}
      onPress={focusInput}
      accessibilityState={{ disabled }}
    >
      {!!(label || labelTx) && (
        <Text
          preset="formLabel"
          text={label}
          tx={labelTx}
          txOptions={labelTxOptions}
          {...LabelTextProps}
          style={$labelStyles}
        />
      )}

      <View style={$inputWrapperStyles}>
        {!!LeftAccessory && (
          <LeftAccessory
            style={$leftAccessoryStyle}
            status={status}
            editable={!disabled}
            multiline={false}
          />
        )}

        <View style={$innerContainerStyle}>
          <RNDateTimePicker
            {...DateTimePickerProps}
            style={$datePickerStyle}
            minimumDate={new Date()}
          />
        </View>

        {!!RightAccessory && (
          <RightAccessory
            style={$rightAccessoryStyle}
            status={status}
            editable={!disabled}
            multiline={false}
          />
        )}
      </View>

      {!!(helper || helperTx) && (
        <Text
          preset="formHelper"
          text={helper}
          tx={helperTx}
          txOptions={helperTxOptions}
          {...HelperTextProps}
          style={$helperStyles}
        />
      )}
    </TouchableOpacity>
  )
})

const $innerContainerStyle: ViewStyle = {
  flex: 1,
}

const $datePickerStyle: ViewStyle = {
  // See: https://github.com/react-native-datetimepicker/datetimepicker/issues/703
  width: "100%",
  alignSelf: "flex-start",
}

const $labelStyle: TextStyle = {
  marginBottom: spacing.extraSmall,
}

const $inputWrapperStyle: ViewStyle = {
  backgroundColor: colors.palette.neutral200,
  // borderColor: colors.palette.neutral400,
  overflow: "hidden",
  // borderWidth: 1,
  // borderColor: 'red',
}

const $helperStyle: TextStyle = {
  marginTop: spacing.extraSmall,
}

const $rightAccessoryStyle: ViewStyle = {
  marginEnd: spacing.extraSmall,
  height: 40,
  justifyContent: "center",
  alignItems: "center",
}
const $leftAccessoryStyle: ViewStyle = {
  marginStart: spacing.extraSmall,
  height: 40,
  justifyContent: "center",
  alignItems: "center",
}
