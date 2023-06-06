import React, { FC, Ref, useEffect, useRef, useState } from "react"
import { Alert, Dimensions, TextStyle, View, ViewStyle, Image, ImageStyle } from "react-native"
import MapView, { Callout, LatLng, Marker, Polygon } from "react-native-maps"
import RNFS from "react-native-fs"
import { isUndefined, map } from "lodash"
import Geolocation, { GeolocationResponse } from "@react-native-community/geolocation"
import { Button, Screen, Text, TextField } from "../components"
import { MainTabScreenProps } from "../navigators/MainNavigator"
import { spacing } from "../theme"
import { TextDropdown } from "app/components/TextDropdown"
import { DateTimePicker } from "app/components/DateTimePicker"
import { distanceToSegment } from "app/utils/coordinateDistance"
import { generatePdfNotice } from "app/utils/generatePdfNotice"
import { useStores } from "app/models"
import { generateKml } from "app/utils/kml"
import { AddAircraftModal } from "./modals/AddAircraftModal"
import { AddOperatorModal } from "./modals/AddOperatorModal"
import { captureRef } from "react-native-view-shot"
import { sendEmail } from "app/services/gmail/gmail"
import { observer } from "mobx-react-lite"
import { translate } from "app/i18n"
import { LoadingModal } from "./modals/LoadingModal"

const mapDot = require("../../assets/images/dot.png")
const mapOwnLocationDot = require("../../assets/images/location_dot.png")
const mapTakeOffLandingDot = require("../../assets/images/takeoff_landing_dot.png")

export const MainFlightScreen: FC<MainTabScreenProps<"MainFlight">> = observer(
  function MainFlightScreen(props) {
    const { navigation } = props
    const [location, setLocation] = useState<GeolocationResponse>(undefined)
    const [selectedLocations, setSelectedLocations] = useState([])
    const [takeOffLandingLocation, setTakeOffLandingLocation] = useState<LatLng>(undefined)
    const [calloutOpen, setCalloutOpen] = useState(false)
    const [aircraftModalVisible, setAircraftModalVisible] = useState(false)
    const [operatorModalVisible, setOperatorModalVisible] = useState(false)
    const [loading, setLoading] = useState(false)
    const [loadingText, setLoadingText] = useState("")
    const [isComplete, setIsComplete] = useState(false)

    // states for form
    const [operator, setOperator] = useState(undefined)
    const [aircraft, setAircraft] = useState(undefined)
    const [date, setDate] = useState(new Date())
    const [startTime, setStartTime] = useState(new Date())
    const [endTime, setEndTime] = useState(new Date())
    const [purpose, setPurpose] = useState(translate("mainFlightScreen.purposePlaceholder"))
    const [flightLocation, setFlightLocation] = useState(undefined)
    const [plannedHeight, setPlannedHeight] = useState("<=50m")
    const [plannedDistance, setPlannedDistance] = useState("<=120m")

    const {
      authenticationStore: { setUser, setAuthToken },
      operatorStore: { operators, getDefault: defaultOperator },
      aircraftStore: { aircraft: aircraftList, getDefault: defaultAircraft },
      flightStore: { addFlight },
    } = useStores()

    const mapRef: Ref<MapView> = useRef()

    const updateAddress = (region) => {
      if (!mapRef.current) return
      mapRef.current
        .addressForCoordinate({
          latitude: region.latitude,
          longitude: region.longitude,
        })
        .then((address) => {
          if (address?.locality) {
            setFlightLocation(address.locality)
          }
        })
        .catch((error) => {
          // TODO: Handle error
          // Geocoding does not work on Android (it is a paid service)
          console.log("Reverse geocoding error: ", error)
        })
    }

    const clearForm = () => {
      setDate(new Date())
      setStartTime(new Date())
      setEndTime(new Date())
      setPurpose(translate("mainFlightScreen.purposePlaceholder"))
      setPlannedHeight("<=50m")
      setPlannedDistance("<=120m")
      // TODO: Don't duplicate this code
      Geolocation.getCurrentPosition(
        async (info) => {
          console.log("info", info)
          setLocation(info)
          updateAddress(info.coords)
        },
        (error) => console.log(error),
      )
      // Clear map
      setSelectedLocations([])
      setTakeOffLandingLocation(undefined)
    }

    useEffect(() => {
      Geolocation.getCurrentPosition(
        async (info) => {
          console.log("info", info)
          setLocation(info)
          updateAddress(info.coords)
        },
        (error) => console.log(error),
      )
      // console.log("location", location)
    }, [])

    return (
      <Screen preset="scroll" contentContainerStyle={$container} safeAreaEdges={["top"]}>
        <Text preset="heading" tx="mainFlightScreen.title" style={$title} />
        <Text tx="mainFlightScreen.tagLine" style={$tagline} />
        <DateTimePicker
          label="Datum leta"
          labelTx="mainFlightScreen.flightDate"
          mode="date"
          value={date}
          onChange={(_event, selectedDate) => {
            // Ugly hack, but it works
            // TODO: Fix this and make it more elegant and move it to a separate function
            const adjustedDate = selectedDate || new Date()
            setDate(adjustedDate)
            const adjustedStartTime = new Date(adjustedDate)
            adjustedStartTime.setHours(startTime.getHours())
            adjustedStartTime.setMinutes(startTime.getMinutes())
            setStartTime(adjustedStartTime)
            const adjustedEndTime = new Date(adjustedDate)
            adjustedEndTime.setHours(endTime.getHours())
            adjustedEndTime.setMinutes(endTime.getMinutes())
            setEndTime(adjustedEndTime)
          }}
          containerStyle={$item}
        />
        <View style={$dateContainer}>
          <DateTimePicker
            containerStyle={$dateItem}
            label="Čas od"
            labelTx="mainFlightScreen.timeFrom"
            mode="time"
            value={startTime}
            onChange={(_event, selectedDate) => {
              const adjustedDate = selectedDate || new Date()
              setStartTime(adjustedDate)
            }}
          />
          <DateTimePicker
            containerStyle={$dateItem}
            label="Čas do"
            labelTx="mainFlightScreen.timeTo"
            mode="time"
            value={endTime}
            onChange={(_event, selectedDate) => {
              const adjustedDate = selectedDate || new Date()
              setEndTime(adjustedDate)
            }}
          />
        </View>
        <TextDropdown
          label="Operator"
          labelTx="mainFlightScreen.operator"
          data={map(operators, (operator) => ({ key: operator.id, value: operator.name }))}
          defaultOption={
            defaultOperator ? { key: defaultOperator.id, value: defaultOperator.name } : undefined
          }
          placeholder="Morate izbrati operatorja"
          placeholderTx="mainFlightScreen.mustSelectOperator"
          setSelected={(operator) => {
            if (isUndefined(operator)) {
              // Open modal for adding new operator
              setOperatorModalVisible(true)
            } else {
              setOperator(operator)
            }
          }}
          search={false}
          notFoundText={translate("mainFlightScreen.addOperator")}
          containerStyle={$item}
        />
        <TextDropdown
          labelTx="mainFlightScreen.aircraft"
          data={map(aircraftList, (aircraft) => ({
            key: aircraft.id,
            value: aircraft.internalName
              ? `${aircraft.internalName} - ${aircraft.type} (${aircraft.serialNumber})`
              : `${aircraft.type} (${aircraft.serialNumber})`,
          }))}
          defaultOption={
            defaultAircraft
              ? {
                  key: defaultAircraft.id,
                  value: defaultAircraft.internalName
                    ? `${defaultAircraft.internalName} - ${defaultAircraft.type} (${defaultAircraft.serialNumber})`
                    : `${defaultAircraft.type} (${defaultAircraft.serialNumber})`,
                }
              : undefined
          }
          placeholderTx="mainFlightScreen.mustSelectAircraft"
          setSelected={(aircraft) => {
            if (isUndefined(aircraft)) {
              // Open modal for adding new operator
              setAircraftModalVisible(true)
            } else {
              setAircraft(aircraft)
            }
          }}
          onSelect={() => {
            console.log("onSelect")
          }}
          search={false}
          notFoundText={translate("mainFlightScreen.addDevice")}
          containerStyle={$item}
        />
        <AddOperatorModal
          modalVisible={operatorModalVisible}
          setModalVisible={setOperatorModalVisible}
        />
        <AddAircraftModal
          modalVisible={aircraftModalVisible}
          setModalVisible={setAircraftModalVisible}
        />
        <TextField
          labelTx="mainFlightScreen.purpose"
          value={purpose}
          onChangeText={(text) => setPurpose(text)}
          placeholderTx="mainFlightScreen.purposePlaceholder"
          containerStyle={$item}
        />
        <TextField
          labelTx="mainFlightScreen.location"
          onChangeText={(text) => setFlightLocation(text)}
          value={flightLocation}
          helperTx="mainFlightScreen.locationHelper"
          placeholderTx="mainFlightScreen.locationPlaceholder"
          containerStyle={$item}
        />
        <TextField
          labelTx="mainFlightScreen.plannedHeight"
          onChangeText={(text) => setPlannedHeight(text)}
          value={plannedHeight}
          helperTx="mainFlightScreen.plannedHeightHelper"
          placeholder="<=50m"
          containerStyle={$item}
        />
        <TextField
          labelTx="mainFlightScreen.plannedDistance"
          onChangeText={(text) => setPlannedDistance(text)}
          value={plannedDistance}
          helperTx="mainFlightScreen.plannedDistanceHelper"
          placeholder="<=120m"
          containerStyle={$item}
        />
        <Text
          preset="formLabel"
          tx="mainFlightScreen.flightArea"
          style={$mapLabelStyle}
        />
        <Text
          preset="formHelper"
          tx="mainFlightScreen.flightAreaHelper"
          style={$mapHelperStyle}
        />
        <Button
          onPress={() => {
            setSelectedLocations([])
            setTakeOffLandingLocation(undefined)
          }}
          style={$mapResetButton}
          tx="mainFlightScreen.resetMap"
        />
        <MapView
          ref={mapRef}
          style={$mapStyle}
          region={{
            latitude: location?.coords?.latitude ? location?.coords?.latitude : 46.05627019321002, // TODO: Move to constants
            longitude: location?.coords?.longitude
              ? location?.coords?.longitude
              : 14.512248352507163, // TODO: Move to constants
            latitudeDelta: 0.000922, // TODO: Move to constants
            longitudeDelta: 0.000421, // TODO: Move to constants
          }}
          mapType="hybrid"
          onPress={(e) => {
            if (calloutOpen) {
              setCalloutOpen(false)
              return
            }
            // TODO: Prove with user feedback that this is the correct approach (always adding point to nearest edge)
            // Perhaps it would be better to just add the point to the end of the array (this can have weird shapes though - including holes)
            if (selectedLocations.length >= 3) {
              // If there is already a shape, add the new point to the nearest edge
              let replacementIndex = selectedLocations.length
              let nearestDistance = distanceToSegment(
                e.nativeEvent.coordinate,
                selectedLocations[selectedLocations.length - 1],
                selectedLocations[0],
              )
              for (let i = 1; i < selectedLocations.length; i++) {
                const distance = distanceToSegment(
                  e.nativeEvent.coordinate,
                  selectedLocations[i - 1],
                  selectedLocations[i],
                )
                if (distance < nearestDistance) {
                  replacementIndex = i
                  nearestDistance = distance
                }
              }

              setSelectedLocations([
                ...selectedLocations.slice(0, replacementIndex),
                e.nativeEvent.coordinate,
                ...selectedLocations.slice(replacementIndex),
              ])
            } else {
              setSelectedLocations([...selectedLocations, e.nativeEvent.coordinate])
            }
          }}
          onLongPress={(e) => {
            // console.log("onLongPress")
            // console.log(e.nativeEvent.coordinate)
            setTakeOffLandingLocation(e.nativeEvent.coordinate)
          }}
          onMarkerDrag={(e) => {
            setSelectedLocations([
              ...selectedLocations.slice(0, parseInt(e.nativeEvent.id, 10)),
              e.nativeEvent.coordinate,
              ...selectedLocations.slice(parseInt(e.nativeEvent.id, 10) + 1),
            ])
          }}
          onMarkerDragEnd={(_e) => {
            // Do nothing for now
          }}
          onMarkerPress={(_e) => {
            setCalloutOpen(true)
          }}
        >
          {location && (
            <Marker
              coordinate={{
                latitude: location?.coords?.latitude
                  ? location?.coords?.latitude
                  : 46.05627019321002,
                longitude: location?.coords?.longitude
                  ? location?.coords?.longitude
                  : 14.512248352507163,
              }}
              image={mapOwnLocationDot}
            />
          )}
          {takeOffLandingLocation && (
            <Marker
              coordinate={{
                latitude: takeOffLandingLocation.latitude,
                longitude: takeOffLandingLocation.longitude,
              }}
              image={mapTakeOffLandingDot}
              draggable={false}
            />
          )}
          {map(selectedLocations, (location, key) => (
            <Marker
              key={key}
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              image={mapDot}
              draggable={true}
              identifier={`${key}`}
              stopPropagation={true}
            >
              <Callout>
                <Button
                  preset="default"
                  onPress={() => {
                    setSelectedLocations([
                      ...selectedLocations.slice(0, key),
                      ...selectedLocations.slice(key + 1),
                    ])
                  }}
                  style={$deletePointButton}
                  tx="mainFlightScreen.deletePoint"
                />
              </Callout>
            </Marker>
          ))}
          <Polygon
            coordinates={selectedLocations}
            strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
            // @ts-ignore
            strokeColors={[
              "#7F0000",
              "#00000000", // no color, creates a "long" gradient between the previous and next coordinate
              "#B24112",
              "#E5845C",
              "#238C23",
              "#7F0000",
            ]}
            strokeWidth={3}
            fillColor="#ff000030"
          />
        </MapView>
        <View style={$legendContainer}>
          <View style={$legendItem}>
            <Text
              preset="formLabel"
              tx="mainFlightScreen.mapLegend"
            />
          </View>
          <View style={$legendItemRight}>
            <View style={$legendItemRow}>
              <Image source={mapOwnLocationDot} style={$legendImage} />
              <Text preset="formHelper" tx="mainFlightScreen.yourLocation" style={$legendText} />
              <Image source={mapDot} style={$legendImageRight} />
              <Text preset="formHelper" tx="mainFlightScreen.flightAreaPoint" style={$legendText} />
            </View>
            <View style={$legendItemRow}>
              <Image source={mapTakeOffLandingDot} style={$legendImage} />
              <Text preset="formHelper" tx="mainFlightScreen.takeOffLandingPoint" style={$legendText} />
            </View>
          </View>
        </View>
        <Button
          preset="filled"
          onPress={async () => {
            if (
              !startTime ||
              !endTime ||
              !operator ||
              !aircraft ||
              !plannedHeight ||
              !plannedDistance ||
              !purpose ||
              !takeOffLandingLocation ||
              selectedLocations.length < 3
            ) {
              Alert.alert(
                translate("mainFlightScreen.error"),
                translate("mainFlightScreen.errorMissingFields"),
              )
              return
            }
            setLoading(true)
            // Create the flight
            setLoadingText(translate("mainFlightScreen.savingFlight"))
            const flight = addFlight({
              startTime,
              endTime,
              operator,
              aircraft,
              location: flightLocation,
              plannedHeight,
              plannedDistance,
              purpose,
              takeOffLandingLocation,
              selectedLocations,
            })
            // Screenshot the map
            const snapshotTmpPath = await captureRef(mapRef, {
              format: "png",
              quality: 1,
            })
            const snapshotPath = `${RNFS.DocumentDirectoryPath}/map-snapshot-${flight.id}.png`
            await RNFS.moveFile(snapshotTmpPath, snapshotPath)
            // PDF form
            setLoadingText(translate("mainFlightScreen.generatingPdf"))
            const [pdfPath, pdfBytes] = await generatePdfNotice(flight)
            // KML
            setLoadingText(translate("mainFlightScreen.generatingKml"))
            const [kmlPath, kmlBytes] = await generateKml(flight)
            // Send email
            setLoadingText(translate("mainFlightScreen.sendingEmail"))
            flight.setProp("snapshotPath", snapshotPath)
            flight.setProp("pdfPath", pdfPath)
            flight.setProp("kmlPath", kmlPath)
            await sendEmail(flight, pdfBytes, kmlBytes, setUser, setAuthToken)
            setLoadingText(translate("mainFlightScreen.completing"))
            setIsComplete(true)
          }}
          style={$submitButton}
          tx="mainFlightScreen.submit"
        />
        <LoadingModal
          modalVisible={loading}
          loadingText={loadingText}
          onComplete={() => {
            setLoading(false)
            setIsComplete(false)
            clearForm()
            navigation.navigate("MainFlightList")
          }}
          isComplete={isComplete}
        />
      </Screen>
    )
  },
)

const $container: ViewStyle = {
  paddingTop: spacing.large + spacing.extraLarge,
  paddingHorizontal: spacing.large,
}

const $dateContainer: ViewStyle = {
  display: "flex",
  flex: 1,
  flexDirection: "row",
  justifyContent: "flex-start",
  marginBottom: 10,
}

const $mapStyle: ViewStyle = {
  width: Dimensions.get("window").width,
  height: 300,
  marginLeft: -spacing.large,
}

const $title: TextStyle = {
  marginBottom: spacing.small,
}

const $tagline: TextStyle = {
  marginBottom: spacing.small,
}

const $item: ViewStyle = {
  marginBottom: spacing.small,
}

const $dateItem: ViewStyle = {
  display: "flex",
  flex: 1,
}

const $mapResetButton: ViewStyle = {
  minHeight: 0,
  maxHeight: 40,
  paddingVertical: spacing.tiny,
  marginBottom: spacing.small,
  marginTop: spacing.tiny,
}

const $deletePointButton: ViewStyle = {
  minHeight: 0,
  paddingVertical: spacing.tiny,
  marginBottom: 0,
  marginTop: 0,
  paddingHorizontal: spacing.tiny,
}

const $mapLabelStyle: TextStyle = {
  marginBottom: 0,
}

const $mapHelperStyle: TextStyle = {
  marginTop: 0,
  flex: 1,
}

const $submitButton: ViewStyle = {
  marginBottom: spacing.large,
  marginTop: spacing.micro,
}

const $legendContainer: ViewStyle = {
  display: 'flex',
  flexDirection: "row",
  alignItems: "flex-start",
  marginTop: spacing.tiny,
  marginBottom: spacing.medium,
}

const $legendItem: ViewStyle = {
  flex: 1,
}

const $legendItemRight: ViewStyle = {
  flex: 3,
}

const $legendItemRow: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  marginTop: 0,
}

const $legendImage: ImageStyle = {
  width: 20,
  height: 20,
}

const $legendImageRight: ImageStyle = {
  width: 20,
  height: 20,
  marginLeft: spacing.small,
}

const $legendText: TextStyle = {
  marginLeft: spacing.small,
}
