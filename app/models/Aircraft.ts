import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import uuid from "react-native-uuid"
import { withSetPropAction } from "./helpers/withSetPropAction"

/**
 * This represents an aircraft
 */
export const AircraftModel = types
  .model("Aircraft")
  .props({
    // TODO: Figure out how to make this required while creating it in the store action and not in the initial model
    // https://github.com/eugenehp/react-native-uuid/issues/16
    id: types.optional(types.identifier, () => uuid.v4() as string),
    type: types.string,
    serialNumber: types.string,
    internalName: types.string,
  })
  .actions(withSetPropAction)

export interface Aircraft extends Instance<typeof AircraftModel> {}
export interface AircraftSnapshotOut extends SnapshotOut<typeof AircraftModel> {}
export interface AircraftSnapshotIn extends SnapshotIn<typeof AircraftModel> {}
