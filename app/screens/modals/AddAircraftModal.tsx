import React, { FC, useEffect, useState } from "react"
import { Modal, TextStyle, ViewStyle } from "react-native"
import { Button, Screen, Text, TextField, Toggle } from "../../components"
import { colors, spacing } from "../../theme"
import { useStores } from "../../models"

interface AddAircraftModalProps {
  modalVisible
  setModalVisible
}

export const AddAircraftModal: FC<AddAircraftModalProps> = function AddAircraftModal(props) {
  const { modalVisible, setModalVisible } = props

  const {
    aircraftStore: { addAircraft, aircraft },
  } = useStores()

  const [type, setType] = useState("")
  const [serialNumber, setSerialNumber] = useState("")
  const [internalName, setInternalName] = useState("")
  const [isDefault, setIsDefault] = useState(aircraft?.length < 1)

  const clearForm = () => {
    setType("")
    setSerialNumber("")
    setInternalName("")
  }

  useEffect(() => {
    if (aircraft?.length < 1) {
      setIsDefault(true)
    }
  }, [modalVisible])

  const saveHandler = () => {
    addAircraft({ type, serialNumber, internalName })
    clearForm()
  }

  return (
    <Modal
      animationType="slide"
      presentationStyle="pageSheet"
      // transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible)
      }}
    >
      <Screen preset="scroll" contentContainerStyle={$modalContainer}>
        <Text
          style={$cancelModal}
          size="md"
          tx="addAircraftScreen.cancel"
          onPress={() => setModalVisible(!modalVisible)}
        />
        <Text preset="heading" tx="addAircraftScreen.title" style={$title} />
        <TextField
          labelTx="addAircraftScreen.typeFieldLabel"
          value={type}
          onChangeText={setType}
          placeholderTx="addAircraftScreen.typeFieldPlaceholder"
          containerStyle={$fieldContainer}
        />
        <TextField
          labelTx="addAircraftScreen.serialNumberFieldLabel"
          value={serialNumber}
          onChangeText={setSerialNumber}
          placeholderTx="addAircraftScreen.serialNumberFieldPlaceholder"
          containerStyle={$fieldContainer}
        />
        <TextField
          labelTx="addAircraftScreen.internalNameFieldLabel"
          value={internalName}
          onChangeText={setInternalName}
          helperTx="addAircraftScreen.internalNameFieldHelper"
          placeholderTx="addAircraftScreen.internalNameFieldPlaceholder"
          containerStyle={$fieldContainer}
        />
        <Toggle
          labelTx="addAircraftScreen.isDefaultToggleLabel"
          value={isDefault}
          onValueChange={() => {
            setIsDefault(!isDefault)
          }}
          disabled={aircraft?.length < 1}
          containerStyle={$fieldContainer}
        />
        <Button
          preset="reversed"
          onPress={() => {
            saveHandler()
            setModalVisible(!modalVisible)
          }}
          tx="addAircraftScreen.save"
        />
      </Screen>
    </Modal>
  )
}

const $fieldContainer: ViewStyle = {
  marginBottom: spacing.small,
}

const $modalContainer: ViewStyle = {
  paddingTop: spacing.medium,
  paddingHorizontal: spacing.large,
}

const $title: TextStyle = {
  marginBottom: spacing.huge,
}

const $cancelModal: TextStyle = {
  color: colors.tint,
  marginBottom: spacing.medium,
  alignSelf: "flex-end",
}
