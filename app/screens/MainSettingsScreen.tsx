import React, { FC, useState } from "react"
import * as Application from "expo-application"
import { Linking, TextStyle, View, ViewStyle } from "react-native"
import { Button, ListItem, Screen, Text } from "../components"
import { MainTabScreenProps } from "../navigators/MainNavigator"
import { colors, spacing } from "../theme"
import { isRTL } from "../i18n"
import { useStores } from "../models"
import { AddAircraftModal } from "./modals/AddAircraftModal"
import { AddOperatorModal } from "./modals/AddOperatorModal"
import Config from "../config"
import { observer } from "mobx-react-lite"

function openLinkInBrowser(url: string) {
  Linking.canOpenURL(url).then((canOpen) => canOpen && Linking.openURL(url))
}

export const MainSettingsScreen: FC<MainTabScreenProps<"MainAbout">> = observer(
  function MainSettingsScreen(_props) {
    const {
      authenticationStore: { logout, user },
      operatorStore: { operators, removeOperator },
      aircraftStore: { aircraft, removeAircraft },
    } = useStores()
    const [modalVisible, setModalVisible] = useState(false)
    const [deviceModalVisible, setDeviceModalVisible] = useState(false)

    return (
      <Screen preset="scroll" safeAreaEdges={["top"]} contentContainerStyle={$container}>
        <Text
          style={$reportBugsLink}
          tx="mainSettingsScreen.reportBugs"
          onPress={() => openLinkInBrowser("https://github.com/sraka1/UAVNotifierApp/issues")}
        />
        <Text style={$title} preset="heading" tx="mainSettingsScreen.title" />
        <Text preset="subheading" tx="mainSettingsScreen.operators" />
        <View style={$operatorListContainer}>
          {operators.map((operator, index) => (
            <ListItem
              key={operator.id}
              topSeparator={index > 0}
              RightComponent={
                <Button
                  preset="default"
                  onPress={() => {
                    removeOperator(operator)
                  }}
                  style={$deleteButton}
                  tx="mainSettingsScreen.remove"
                />
              }
            >
              <Text>{operator.name} ({operator.registrationNumber})</Text>
            </ListItem>
          ))}
          <ListItem
            TextProps={{ style: { color: colors.tint } }}
            topSeparator={operators.length > 0}
            onPress={() => setModalVisible(true)}
          >
            Dodaj operatorja
          </ListItem>
        </View>
        <Text preset="subheading" tx="mainSettingsScreen.devices" />
        <View style={$operatorListContainer}>
          {aircraft.map((aircraft, index) => (
            <ListItem
              key={aircraft.id}
              topSeparator={index > 0}
              RightComponent={
                <Button
                  preset="default"
                  onPress={() => {
                    removeAircraft(aircraft)
                  }}
                  style={$deleteButton}
                  tx="mainSettingsScreen.remove"
                />
              }
            >
              <Text>
                {aircraft.internalName
                  ? `${aircraft.internalName} - ${aircraft.type} (${aircraft.serialNumber})`
                  : `${aircraft.type} (${aircraft.serialNumber})`}
              </Text>
            </ListItem>
          ))}
          <ListItem
            TextProps={{ style: { color: colors.tint } }}
            topSeparator={aircraft.length > 0}
            onPress={() => setDeviceModalVisible(true)}
          >
            Dodaj napravo
          </ListItem>
        </View>
        <AddOperatorModal modalVisible={modalVisible} setModalVisible={setModalVisible} />
        <AddAircraftModal
          modalVisible={deviceModalVisible}
          setModalVisible={setDeviceModalVisible}
        />
        <ListItem
          LeftComponent={
            <View style={$item}>
              <Text preset="bold" tx="mainSettingsScreen.loggedInAs"/>
              <Text>{`${user.name} (${user.email})`}</Text>
            </View>
          }
        />
        <View style={$buttonContainer}>
          <Button style={$button} tx="common.logOut" onPress={logout} />
        </View>
        <ListItem
          LeftComponent={
            <View style={$item}>
              <Text preset="bold" tx="mainSettingsScreen.author" />
              <Text>{Config.author}</Text>
              <Text tx="mainSettingsScreen.releasedUnderLicense" />
              <Text tx="mainSettingsScreen.madeWithLoveBy" />
            </View>
          }
        />
        <View style={$itemsContainer}>
          <ListItem
            LeftComponent={
              <View style={$item}>
                <Text preset="bold">App Id</Text>
                <Text>{Application.applicationId}</Text>
              </View>
            }
          />
          <ListItem
            onPress={() => setDeviceModalVisible(true)}
            LeftComponent={
              <View style={$item}>
                <Text preset="bold">Verzija</Text>
                <Text>{Application.nativeApplicationVersion}</Text>
              </View>
            }
          />
          <ListItem
            LeftComponent={
              <View style={$item}>
                <Text preset="bold">Build</Text>
                <Text>{Application.nativeBuildVersion}</Text>
              </View>
            }
          />
        </View>
      </Screen>
    )
  },
)

const $container: ViewStyle = {
  paddingTop: spacing.extraLarge,
  paddingBottom: spacing.huge,
  paddingHorizontal: spacing.large,
}

const $title: TextStyle = {
  marginBottom: spacing.huge,
}

const $reportBugsLink: TextStyle = {
  color: colors.tint,
  marginBottom: 0,
  alignSelf: isRTL ? "flex-start" : "flex-end",
}

const $item: ViewStyle = {
  marginBottom: spacing.medium,
}

const $itemsContainer: ViewStyle = {
  marginBottom: spacing.medium,
  flexDirection: "row",
  justifyContent: "space-between",
}

const $button: ViewStyle = {
  marginBottom: spacing.extraSmall,
}

const $buttonContainer: ViewStyle = {
  marginBottom: spacing.medium,
}

const $operatorListContainer: ViewStyle = {
  backgroundColor: colors.palette.neutral100,
  borderRadius: 8,
  paddingLeft: spacing.medium,
  marginVertical: spacing.medium,
}

const $deleteButton: ViewStyle = {
  minHeight: 0,
  alignSelf: "center",
  paddingVertical: spacing.extraSmall,
  marginRight: spacing.small,
}
