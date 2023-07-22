import { observer } from "mobx-react-lite"
import React, { FC, useState } from "react"
import { Image, ImageStyle, TextStyle, View, ViewStyle } from "react-native"
import Geolocation from "@react-native-community/geolocation"
import { Button, Header, Screen, Text } from "../components"
import { translate } from "../i18n"
import { useStores } from "../models"
import { AppStackScreenProps } from "../navigators"
import { colors, spacing } from "../theme"
import { useSafeAreaInsetsStyle } from "../utils/useSafeAreaInsetsStyle"
import { openLinkInBrowser } from "app/utils/openLinkInBrowser"
import { AddAircraftModal } from "./modals/AddAircraftModal"
import { AddOperatorModal } from "./modals/AddOperatorModal"

const welcomeLogo = require("../../assets/images/logo.png")

interface WelcomeScreenProps extends AppStackScreenProps<"Welcome"> {}

export const WelcomeScreen: FC<WelcomeScreenProps> = observer(function WelcomeScreen(props) {
  const { navigation } = props
  const {
    authenticationStore: { user, logout },
    aircraftStore: { aircraft },
    operatorStore: { operators },
  } = useStores()
  const [aircraftModalVisible, setAircraftModalVisible] = useState(false)
  const [operatorModalVisible, setOperatorModalVisible] = useState(false)
  const [locationStatusKnownGood, setLocationStatusKnownGood] = useState(false)

  function goNext() {
    navigation.navigate("Main", { screen: "MainFlight" })
  }

  function checkLocation() {
    Geolocation.getCurrentPosition(
      (_position) => {
        setLocationStatusKnownGood(true)
      },
      (_error) => {
        setLocationStatusKnownGood(false)
      },
    )
  }

  const $bottomContainerInsets = useSafeAreaInsetsStyle(["bottom"])

  return (
    <Screen
      preset="scroll"
      contentContainerStyle={$container}
      safeAreaEdges={["top"]}
    >
      <Header rightTx="common.logOut" onRightPress={logout} />
      <Image style={$welcomeLogo} source={welcomeLogo} />
      <View style={$container}>
        <View style={$topContainer}>
          <Text
            testID="welcome-heading"
            style={$welcomeHeading}
            tx="welcomeScreen.readyForLaunch"
            txOptions={{ name: user?.givenName }}
            preset="heading"
          />
          <Text tx="welcomeScreen.exciting" preset="subheading" style={$welcomeSubheading} />
          <Text
            preset="formLabel"
            tx="welcomeScreen.operatorLabel"
            style={$labelStyle}
          />
          <Button
            testID="next-screen-button"
            preset="reversed"
            // tx="welcomeScreen.letsGo"
            disabled={operators.length > 0}
            text={aircraft.length > 0 ? translate("welcomeScreen.addOperatorButtonDone") : translate("welcomeScreen.addOperatorButton")}
            onPress={operators.length > 0 ? undefined : () => setOperatorModalVisible(true)}
          />
          <Text
            tx="welcomeScreen.registrationInfo"
            size="xs"
            style={$postscript}
            onPress={() => openLinkInBrowser("https://uas.caa.si/")}
          />
          <Text
            preset="formLabel"
            tx="welcomeScreen.aircraftLabel"
            style={$labelStyle}
          />
          <Button
            testID="next-screen-button"
            preset="reversed"
            disabled={aircraft.length > 0}
            text={aircraft.length > 0 ? translate("welcomeScreen.addAircraftButtonDone") : translate("welcomeScreen.addAircraftButton")}
            onPress={aircraft.length > 0 ? undefined : () => setAircraftModalVisible(true)}
          />
          <Text text="Naprava ne sme presegati teže 500g." size="xs" style={$postscript} />
          <Text
            preset="formLabel"
            tx="welcomeScreen.locationLabel"
            style={$labelStyle}
          />
          <Button
            testID="next-screen-button"
            preset="reversed"
            disabled={locationStatusKnownGood}
            tx="welcomeScreen.allowLocationButton"
            onPress={checkLocation}
          />
          <Text tx="welcomeScreen.postscript" size="xs" style={$postscript} />
        </View>

        <View style={[$bottomContainer, $bottomContainerInsets]}>
          <Button
            testID="next-screen-button"
            preset="reversed"
            tx={aircraft && operators ? "welcomeScreen.letsGo" : "welcomeScreen.skip"}
            onPress={goNext}
          />
        </View>
      </View>
      <AddOperatorModal
        modalVisible={operatorModalVisible}
        setModalVisible={setOperatorModalVisible}
      />
      <AddAircraftModal
        modalVisible={aircraftModalVisible}
        setModalVisible={setAircraftModalVisible}
      />
    </Screen>
  )
})

const $container: ViewStyle = {
  // flex: 1,
  backgroundColor: colors.background,
  paddingBottom: spacing.large,
  // paddingHorizontal: spacing.large,
}

const $topContainer: ViewStyle = {
  // flexShrink: 1,
  // flexGrow: 1,
  // flexBasis: "57%",
  justifyContent: "flex-start",
  paddingHorizontal: spacing.large,
}

const $bottomContainer: ViewStyle = {
  // flexShrink: 1,
  // flexGrow: 0,
  backgroundColor: colors.palette.neutral100,
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
  paddingHorizontal: spacing.large,
  justifyContent: "space-around",
}
const $welcomeLogo: ImageStyle = {
  height: 44,
  width: 44,
  position: "absolute",
  top: spacing.large + 2,
  left: spacing.large,
  zIndex: 1000,
}

const $welcomeHeading: TextStyle = {
  marginBottom: 0,
}

const $welcomeSubheading: TextStyle = {
  marginBottom: spacing.medium,
}

const $labelStyle: TextStyle = {
  marginBottom: spacing.micro,
}

const $postscript: TextStyle = {
  marginTop: spacing.tiny,
  marginBottom: spacing.small,
}
