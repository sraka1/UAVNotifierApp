import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import uuid from "react-native-uuid"
import { LatLng } from "react-native-maps"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { OperatorModel } from "./Operator"
import { AircraftModel } from "./Aircraft"

/**
 * This represents an flight of React Native Radio.
 */
export const FlightModel = types
  .model("Flight")
  .props({
    // TODO: Figure out how to make this required while creating it in the store action and not in the initial model
    // https://github.com/eugenehp/react-native-uuid/issues/16
    id: types.optional(types.identifier, () => uuid.v4() as string),
    startTime: types.Date,
    endTime: types.Date,
    operator: types.reference(OperatorModel),
    aircraft: types.reference(AircraftModel),
    location: types.string,
    plannedHeight: types.string,
    plannedDistance: types.string,
    purpose: types.string,
    kmlPath: types.maybe(types.string),
    pdfPath: types.maybe(types.string),
    selectedLocations: types.array(types.frozen<LatLng>()),
    takeOffLandingLocation: types.frozen<LatLng>(),
    snapshotPath: types.maybe(types.string),
  })
  .actions(withSetPropAction)

export interface Flight extends Instance<typeof FlightModel> {}
export interface FlightSnapshotOut extends SnapshotOut<typeof FlightModel> {}
export interface FlightSnapshotIn extends SnapshotIn<typeof FlightModel> {}
