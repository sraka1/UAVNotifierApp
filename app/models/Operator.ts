import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import uuid from "react-native-uuid"
import { withSetPropAction } from "./helpers/withSetPropAction"

/**
 * This represents an operator
 */
export const OperatorModel = types
  .model("Operator")
  .props({
    // TODO: Figure out how to make this required while creating it in the store action and not in the initial model
    // https://github.com/eugenehp/react-native-uuid/issues/16
    id: types.optional(types.identifier, () => uuid.v4() as string),
    name: types.string,
    phone: types.string,
    registrationNumber: types.string,
  })
  .actions(withSetPropAction)

export interface Operator extends Instance<typeof OperatorModel> {}
export interface OperatorSnapshotOut extends SnapshotOut<typeof OperatorModel> {}
export interface OperatorSnapshotIn extends SnapshotIn<typeof OperatorModel> {}
