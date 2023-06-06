import { Instance, SnapshotOut, types, applySnapshot, getSnapshot } from "mobx-state-tree"
import { AuthenticationStoreModel } from "./AuthenticationStore"
import { FlightStoreModel } from "./FlightStore"
import { OperatorStoreModel } from "./OperatorStore"
import { AircraftStoreModel } from "./AircraftStore"

/**
 * A RootStore model.
 */
export const RootStoreModel = types
  .model("RootStore")
  .props({
    authenticationStore: types.optional(AuthenticationStoreModel, {}),
    flightStore: types.optional(FlightStoreModel, {}),
    operatorStore: types.optional(OperatorStoreModel, {}),
    aircraftStore: types.optional(AircraftStoreModel, {}),
  })
  .actions((store) => {
    let initialState = {}
    return {
      afterCreate: () => {
        initialState = getSnapshot(store)
      },
      reset: () => {
        applySnapshot(store, initialState)
      },
    }
  })

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
