import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { AircraftModel, Aircraft } from "./Aircraft"

export const AircraftStoreModel = types
  .model("AircraftStore")
  .props({
    aircraft: types.array(AircraftModel),
    default: types.maybe(types.reference(AircraftModel)),
  })
  .actions(withSetPropAction)
  .actions((store) => ({
    addAircraft(aircraft) {
      store.aircraft.push(aircraft)
      // TODO: Figure out how to fix this ugliness
      // @ts-ignore
      if (!store.default) store.default = store.aircraft[store.aircraft.length - 1].id
    },
    removeAircraft(aircraft: Aircraft) {
      if (store.aircraft.length === 1) {
        store.default = undefined
      } else if (store.default === aircraft) {
        store.default = store.aircraft[0]
      }
      store.aircraft.remove(aircraft)
    },
    setDefault(aircraft: Aircraft) {
      store.default = aircraft
    },
  }))
  .views((store) => ({
    get getDefault() {
      return store.default
    },
  }))

export interface AircraftStore extends Instance<typeof AircraftStoreModel> {}
export interface AircraftStoreSnapshotOut extends SnapshotOut<typeof AircraftStoreModel> {}
