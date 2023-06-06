import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin"
import { observer } from "mobx-react-lite"
import React, { FC, useState } from "react"
import { Alert, Image, ImageStyle, TextStyle, View, ViewStyle } from "react-native"
import { Button, Screen, Text } from "../components"
import { useStores } from "../models"
import { AppStackScreenProps } from "../navigators"
import { colors, spacing } from "../theme"
import { translate } from "../i18n"

const welcomeLogo = require("../../assets/images/logo.png")

interface LoginScreenProps extends AppStackScreenProps<"Login"> {}

export const LoginScreen: FC<LoginScreenProps> = observer(function LoginScreen(_props) {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [attemptsCount, setAttemptsCount] = useState(0)
  const {
    authenticationStore: { setUser, setAuthToken },
  } = useStores()

  const login = async () => {
    setIsSubmitted(true)
    setAttemptsCount(attemptsCount + 1)

    try {
      await GoogleSignin.hasPlayServices()
      const userInfo = await GoogleSignin.signIn()

      setAuthToken(userInfo.idToken)
      setUser(userInfo.user)
      setIsSubmitted(false)
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  }

  return (
    <Screen
      preset="auto"
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={["top", "bottom"]}
    >
      <View style={$logoContainer}>
        <Image style={$welcomeLogo} source={welcomeLogo} resizeMode="contain" />
        <Text testID="login-heading" tx="common.appName" preset="heading" style={$signIn} />
      </View>
      <Text testID="login-heading" tx="loginScreen.signIn" preset="heading" style={$signIn} />
      <Text tx="loginScreen.enterDetails" preset="subheading" style={$enterDetails} />
      <Text
        size="md"
        style={$whyGoogleSignIn}
        tx="loginScreen.whyGoogleSignIn"
        onPress={
          () => {
            Alert.alert(
              translate("loginScreen.whyGoogleSignIn"),
              translate("loginScreen.whyGoogleSignInContent"),
            )
          }
        }
      />
      <Button
        testID="login-button"
        tx="loginScreen.tapToSignIn"
        style={$tapButton}
        // preset="reversed"
        onPress={login}
        disabled={isSubmitted}
      />
    </Screen>
  )
})

const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.huge,
  paddingHorizontal: spacing.large,
}

const $logoContainer: ViewStyle = {
  alignItems: "center",
  marginBottom: spacing.huge,
}

const $signIn: TextStyle = {
  marginBottom: spacing.small,
}

const $enterDetails: TextStyle = {
  marginBottom: spacing.small,
}

const $tapButton: ViewStyle = {
  marginTop: spacing.extraSmall,
}

const $whyGoogleSignIn: TextStyle = {
  color: colors.tint,
  marginBottom: spacing.small,
  marginTop: 0,
  alignSelf: "flex-start",
}

const $welcomeLogo: ImageStyle = {
  height: 88,
  width: "100%",
  marginBottom: spacing.medium,
}
