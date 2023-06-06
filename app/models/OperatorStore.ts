import { Instance, SnapshotOut, types } from "mobx-state-tree"
import uuid from "react-native-uuid"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { OperatorModel, Operator } from "./Operator"

export const OperatorStoreModel = types
  .model("OperatorStore")
  .props({
    operators: types.array(OperatorModel),
    default: types.maybe(types.reference(OperatorModel)),
  })
  .actions(withSetPropAction)
  .actions((store) => ({
    addOperator(operator) {
      // https://github.com/eugenehp/react-native-uuid/issues/16
      if (!operator.id) operator.id = uuid.v4() as string
      store.operators.push(operator)
      // TODO: Figure out how to fix this ugliness
      // @ts-ignore
      if (!store.default) store.default = store.operators[store.operators.length - 1].id
    },
    removeOperator(operator: Operator) {
      if (store.operators.length === 1) {
        store.default = undefined
      }
      store.operators.remove(operator)
    },
    setDefault(operator: Operator) {
      store.default = operator
    },
  }))
  .views((store) => ({
    get getDefault() {
      return store.default
    },
  }))

export interface OperatorStore extends Instance<typeof OperatorStoreModel> {}
export interface OperatorStoreSnapshotOut extends SnapshotOut<typeof OperatorStoreModel> {}
