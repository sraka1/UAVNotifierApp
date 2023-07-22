import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin"
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
    async logout() {
      // store.authToken = undefined
      // store.user = undefined
      if (hasParent(store)) {
        getParent<RootStore>(store).reset()
        // The above clears all stores - they are all reset to their initial state
      }
      try {
        // Revokes access to the Google account on logout (people will rarely log out, so this is not a big deal)
        // https://developer.apple.com/support/offering-account-deletion-in-your-app/
        // Uses same paradign as described in the link above for Apple Sign-In
        await GoogleSignin.revokeAccess();
      } catch (error) {
        // Something went wrong with the revoke request, but we'll still log the user out
        console.error(error);
      }
    },
  }))

export interface AuthenticationStore extends Instance<typeof AuthenticationStoreModel> {}
export interface AuthenticationStoreSnapshot extends SnapshotOut<typeof AuthenticationStoreModel> {}
