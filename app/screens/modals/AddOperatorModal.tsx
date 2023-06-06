import React, { FC, useEffect, useState } from "react"
import { Modal, TextStyle, ViewStyle } from "react-native"
import { Button, Screen, Text, TextField, Toggle } from "../../components"
import { useStores } from "../../models"
import { colors, spacing } from "../../theme"

interface AddOperatorModalProps {
  modalVisible
  setModalVisible
}

export const AddOperatorModal: FC<AddOperatorModalProps> = function AddOperatorModal(props) {
  const { modalVisible, setModalVisible } = props

  const {
    operatorStore: { addOperator, operators },
  } = useStores()

  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [registrationNumber, setRegistrationNumber] = useState("")
  const [isDefault, setIsDefault] = useState(operators?.length < 1)

  const clearForm = () => {
    setName("")
    setPhone("")
    setRegistrationNumber("")
  }

  useEffect(() => {
    if (operators?.length < 1) {
      setIsDefault(true)
    }
  }, [modalVisible])

  const saveHandler = () => {
    addOperator({ name, phone, registrationNumber })
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
          tx="addOperatorScreen.cancel"
          onPress={() => setModalVisible(!modalVisible)}
        />
        <Text preset="heading" tx="addOperatorScreen.title" style={$title} />
        <TextField
          labelTx="addOperatorScreen.nameFieldLabel"
          label="Naziv operatorja"
          value={name}
          onChangeText={setName}
          placeholder="Janez Novak"
          placeholderTx="addOperatorScreen.nameFieldPlaceholder"
          containerStyle={$fieldContainer}
        />
        <TextField
          labelTx="addOperatorScreen.phoneFieldLabel"
          value={phone}
          onChangeText={setPhone}
          placeholderTx="addOperatorScreen.phoneFieldPlaceholder"
          containerStyle={$fieldContainer}
        />
        <TextField
          labelTx="addOperatorScreen.registrationNumberFieldLabel"
          value={registrationNumber}
          onChangeText={setRegistrationNumber}
          helperTx="addOperatorScreen.registrationNumberHelper"
          placeholderTx="addOperatorScreen.registrationNumberPlaceholder"
          containerStyle={$fieldContainer}
        />
        <Toggle
          labelTx="addOperatorScreen.isDefaultToggleLabel"
          value={isDefault}
          onValueChange={() => {
            setIsDefault(!isDefault)
          }}
          disabled={operators?.length < 1}
          containerStyle={$fieldContainer}
        />
        <Button
          preset="reversed"
          onPress={() => {
            saveHandler()
            setModalVisible(!modalVisible)
          }}
          tx="addOperatorScreen.save"
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
