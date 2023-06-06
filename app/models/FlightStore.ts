import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { FlightModel } from "./Flight"
import { withSetPropAction } from "./helpers/withSetPropAction"

export const FlightStoreModel = types
  .model("FlightStore")
  .props({
    flights: types.array(FlightModel),
    pastOnly: false,
  })
  .actions(withSetPropAction)
  .actions((store) => ({
    addFlight(flight) {
      store.flights.push(flight)
      return store.flights[store.flights.length - 1]
    },
    removeFlight(flight) {
      store.flights.remove(flight)
    },
    updateFlight(flight) {
      const index = store.flights.findIndex((f) => f.id === flight.id)
      store.flights[index] = flight
    },
  }))
  .views((store) => ({
    get flightsForList() {
      const sortedFlights = store.flights
        .slice()
        .sort((a, b) => Number(b.startTime) - Number(a.startTime))
      const currentDate = new Date()
      return store.pastOnly
        ? sortedFlights.filter((flight) => Number(flight.endTime) < Number(currentDate))
        : sortedFlights
    },
    flightById(id: string) {
      return store.flights.find((flight) => flight.id === id)
    },
  }))

export interface FlightStore extends Instance<typeof FlightStoreModel> {}
export interface FlightStoreSnapshot extends SnapshotOut<typeof FlightStoreModel> {}
