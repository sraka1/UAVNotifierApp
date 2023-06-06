import { Instance, SnapshotOut, types, getParent, hasParent } from "mobx-state-tree"
import { RootStore } from "./RootStore"

export const UserModel = types.model("User").props({
  email: types.maybe(types.string),
  familyName: types.maybe(types.string),
  givenName: types.maybe(types.string),
  id: types.maybe(types.string),
  name: types.maybe(types.string),
  photo: types.maybe(types.string),
})

export interface User extends Instance<typeof UserModel> {}
export interface UserSnapshot extends SnapshotOut<typeof UserModel> {}

export const AuthenticationStoreModel = types
  .model("AuthenticationStore")
  .props({
    authToken: types.maybe(types.string),
    user: types.maybe(UserModel),
  })
  .views((store) => ({
    get isAuthenticated() {
      return !!store.authToken
    },
  }))
  .actions((store) => ({
    setAuthToken(value?: string) {
      store.authToken = value
    },
    setUser(user) {
      store.user = user
    },
    logout() {
      // store.authToken = undefined
      // store.user = undefined
      if (hasParent(store)) {
        getParent<RootStore>(store).reset()
      }
    },
  }))

export interface AuthenticationStore extends Instance<typeof AuthenticationStoreModel> {}
export interface AuthenticationStoreSnapshot extends SnapshotOut<typeof AuthenticationStoreModel> {}
