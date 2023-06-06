import { observer } from "mobx-react-lite"
import React, { FC } from "react"
import {
  Dimensions,
  ImageStyle,
  TextStyle,
  View,
  ViewStyle,
} from "react-native"
import { AutoImage, Button, Card, EmptyState, Screen, Text, Toggle } from "../components"
import { isRTL, translate } from "../i18n"
import { useStores } from "../models"
import { Flight } from "../models/Flight"
import { MainTabScreenProps } from "../navigators/MainNavigator"
import { colors, spacing } from "../theme"
import { FlashList } from "@shopify/flash-list";
import { format } from "date-fns"
import { User } from "app/models/AuthenticationStore"
import Share from "react-native-share"

export const MainFlightListScreen: FC<MainTabScreenProps<"MainFlightList">> = observer(
  function MainFlightListScreen(props) {
    const { navigation } = props
    const {
      flightStore: { flights, flightsForList, pastOnly, setProp },
      authenticationStore: { user },
    } = useStores()

    return (
      <Screen
        preset="fixed"
        safeAreaEdges={["top"]}
        contentContainerStyle={$screenContentContainer}
      >
        <FlashList
          data={flightsForList}
          extraData={flights.length}
          contentContainerStyle={$flatListContentContainer}
          estimatedItemSize={180}
          ListEmptyComponent={
            <EmptyState
              preset="generic"
              style={$emptyState}
              headingTx={
                pastOnly
                  ? "mainFlightsScreen.noPastFlightsEmptyState.heading"
                  : undefined
              }
              contentTx={
                pastOnly
                  ? "mainFlightsScreen.noPastFlightsEmptyState.content"
                  : undefined
              }
              imageStyle={$emptyStateImage}
              ImageProps={{ resizeMode: "contain" }}
              buttonOnPress={() => navigation.navigate("MainFlight")}
            />
          }
          ListHeaderComponent={
            <View style={$heading}>
              <Text preset="heading" tx="mainFlightsScreen.title" />
              {(pastOnly || flightsForList.length > 0) && (
                <View style={$toggle}>
                  <Toggle
                    value={pastOnly}
                    onValueChange={() =>
                      setProp("pastOnly", !pastOnly)
                    }
                    variant="switch"
                    labelTx="mainFlightsScreen.onlyPast"
                    labelPosition="left"
                    labelStyle={$labelStyle}
                    accessibilityLabel={translate("mainFlightsScreen.accessibility.switch")}
                  />
                </View>
              )}
            </View>
          }
          renderItem={({ item }) => (
            <FlightCard
              key={item.id}
              flight={item as Flight}
              user={user}
            />
          )}
        />
      </Screen>
    )
  },
)

const FlightCard = observer(function FlightCard({
  flight,
  user,
}: {
  flight: Flight,
  user: User
}) {
  const handlePressPDF = async () => {
    // onPressFavorite()
    const options = {
      type: 'application/pdf',
      url: flight.pdfPath // (Platform.OS === 'android' ? 'file://' + filePath)
    };
    try {
      Share.open(options);
    } catch (error) {
      console.log('error', error)
    }
  }

  const handlePressKML = async () => {
    console.log('flight.kmlPath', flight.kmlPath)
    const options = {
      type: 'application/vnd.google-earth.kml+xml',
      url: flight.kmlPath // (Platform.OS === 'android' ? 'file://' + filePath)
    };
    try {
      Share.open(options);
    } catch (error) {
      console.log('error', error)
    }
  }

  return (
    <Card
      style={$item}
      verticalAlignment="force-footer-bottom"
      onPress={handlePressPDF}
      onLongPress={handlePressPDF}
      HeadingComponent={
        <>
          <Text
            style={$metadataText}
            size="xs"
            weight="semiBold"
            accessibilityLabel={format(flight.startTime, 'dd.MM.yyyy HH:mm')}
          >
            {format(flight.startTime, 'dd.MM.yyyy')}
          </Text>
          <Text
            style={$metadataText}
            size="xs"
            weight="semiBold"
            accessibilityLabel={format(flight.startTime, 'dd.MM.yyyy HH:mm')}
          >
            {`${format(flight.startTime, 'HH:mm')} - ${format(flight.endTime, 'HH:mm')}`}
          </Text>
        </>
      }
      ContentComponent={
        <View style={$content}>
          <Text
            size="xl"
            weight="semiBold"
            accessibilityLabel={flight.location}
            style={$contentText}
          >
            {flight.location} - {flight.purpose}
          </Text>
          <AutoImage
            source={{ uri: flight.snapshotPath }}
            // This is ugly, but it works
            maxWidth={Dimensions.get("window").width - (spacing.extraLarge * 2 + spacing.medium)}
          />
        </View>
      }
      content={`${flight.location} - ${flight.purpose}`}
      contentStyle={$content}
      RightComponent={<AutoImage source={{uri: user.photo}} style={$itemThumbnail} />}
      FooterComponent={
        <View
          style={$footer}
        >
          <Button
            onPress={handlePressPDF}
            onLongPress={handlePressPDF}
            style={$favoriteButton}
          >
            <Text
              size="xxs"
              weight="medium"
              tx="mainFlightsScreen.downloadPDF"
            />
          </Button>
          <Button
            onPress={handlePressKML}
            onLongPress={handlePressKML}
            style={[$favoriteButton, { marginLeft: spacing.small }]}
          >
            <Text
              size="xxs"
              weight="medium"
              tx="mainFlightsScreen.downloadKML"
            />
          </Button>
        </View>
      }
    />
  )
})

const $footer: ViewStyle = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  alignItems: "center",
}

const $screenContentContainer: ViewStyle = {
  flex: 1,
}

const $content: ViewStyle = {
  flex: 1,
}

const $contentText: TextStyle = {
  marginBottom: spacing.small,
}

const $flatListContentContainer: ViewStyle = {
  paddingHorizontal: spacing.large,
  paddingTop: spacing.large + spacing.extraLarge,
  paddingBottom: spacing.large,
}

const $heading: ViewStyle = {
  marginBottom: spacing.medium,
}

const $item: ViewStyle = {
  padding: spacing.medium,
  marginTop: spacing.medium,
  minHeight: 120,
}

const $itemThumbnail: ImageStyle = {
  marginTop: spacing.small,
  borderRadius: 50,
  alignSelf: "flex-start",
  width: 50,
  height: 50,
}

const $toggle: ViewStyle = {
  marginTop: spacing.medium,
}

const $labelStyle: TextStyle = {
  textAlign: "left",
}

const $metadataText: TextStyle = {
  color: colors.textDim,
  marginEnd: spacing.medium,
  marginBottom: 0,
}

const $favoriteButton: ViewStyle = {
  borderRadius: 17,
  marginTop: spacing.medium,
  backgroundColor: colors.palette.neutral300,
  borderColor: colors.palette.neutral300,
  paddingHorizontal: spacing.medium,
  paddingTop: spacing.micro,
  paddingBottom: 0,
  minHeight: 32,
}

const $emptyState: ViewStyle = {
  marginTop: spacing.huge,
}

const $emptyStateImage: ImageStyle = {
  transform: [{ scaleX: isRTL ? -1 : 1 }],
}
