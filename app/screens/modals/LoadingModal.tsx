import React, { FC, useEffect, useState } from "react"
import { Modal, TextStyle, ViewStyle, View, ImageStyle } from "react-native"
import LoaderKit from 'react-native-loader-kit'
import { Button, Text } from "../../components"
import { CrossfadeImage } from 'react-native-crossfade-image';
import { colors, spacing } from "../../theme"
import { translate } from "app/i18n";

interface LoadingModalProps {
  modalVisible: boolean;
  onComplete: () => void;
  isComplete: boolean;
  // TODO: Handle errors and make this required
  success?: boolean;
  error?: boolean;
  loadingText: string;
}

const welcomeLogo = require("../../../assets/images/logo.png")
const checkmark = require("../../../assets/images/checkmark.png")

// TODO: Handle errors with success and error states
export const LoadingModal: FC<LoadingModalProps> = function AddAircraftModal(props) {
  const { modalVisible, onComplete, loadingText, isComplete } = props

  const [propOneShown, setPropOneShown] = useState(true)
  const [propTwoShown, setPropTwoShown] = useState(false)
  const [propThreeShown, setPropThreeShown] = useState(false)
  const [propFourShown, setPropFourShown] = useState(false)
  const [checkmarkShown, setCheckmarkShown] = useState(false)
  const [checkmarkAnimationBlocked, setCheckmarkAnimationBlocked] = useState(true)
  const [propAnimationBlocked, setPropAnimationBlocked] = useState(true)

  useEffect(() => {
    if (modalVisible) {
      setCheckmarkAnimationBlocked(true)
      setPropAnimationBlocked(true)
      setCheckmarkShown(false)
      setTimeout(() => {
        setPropTwoShown(true)
      }, 200)
      setTimeout(() => {
        setPropThreeShown(true)
      }, 600)
      setTimeout(() => {
        setPropFourShown(true)
      }, 400)
      setTimeout(() => {
        setCheckmarkAnimationBlocked(false)
      }, 3000)
      // Let the user enjoy the animation for a bit :)
      setTimeout(() => {
        setPropAnimationBlocked(false)
      }, 3250)
    }
  }, [modalVisible])

  useEffect(() => {
    if (isComplete) {
      setCheckmarkShown(true)
      setTimeout(() => {
        setPropOneShown(false)
        setPropTwoShown(false)
        setPropThreeShown(false)
        setPropFourShown(false)
      }, 250)
    }
  }, [isComplete])

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
    >
      <View style={$modalContainer}>
        <View style={$container}>
          <CrossfadeImage duration={500} style={$welcomeLogo} source={checkmarkShown && !checkmarkAnimationBlocked ? checkmark : welcomeLogo} resizeMode="cover" />
          {
            (propOneShown || propAnimationBlocked) && <LoaderKit
              style={$propOneStyle}
              name={'BallScaleRippleMultiple'} // Optional: see list of animations below
              size={50} // Required on iOS
              color={'#00000020'}
            />
          }
          {
            (propTwoShown || propAnimationBlocked) && <LoaderKit
              style={$propTwoStyle}
              name={'BallScaleRippleMultiple'} // Optional: see list of animations below
              size={50} // Required on iOS
              color={'#00000020'}
            />
          }
          {
            (propThreeShown || propAnimationBlocked) && <LoaderKit
              style={$propThreeStyle}
              name={'BallScaleRippleMultiple'} // Optional: see list of animations below
              size={50} // Required on iOS
              color={'#00000020'}
            />
          }
          {
            (propFourShown || propAnimationBlocked) && <LoaderKit
              style={$propFourStyle}
              name={'BallScaleRippleMultiple'} // Optional: see list of animations below
              size={50} // Required on iOS
              color={'#00000020'}
            />
          }
          <Text size="md" weight="semiBold" text={checkmarkShown && !checkmarkAnimationBlocked ? translate("loadingModal.success") : translate("loadingModal.loading")} style={$title} />
          <Text size="xs" text={checkmarkShown && !checkmarkAnimationBlocked ? translate("loadingModal.completed") : loadingText} style={$description} />
          <Button
            preset="reversed"
            onPress={() => {
              onComplete()
              setCheckmarkShown(false)
              setCheckmarkAnimationBlocked(true)
              setPropAnimationBlocked(true)
            }}
            disabled={!checkmarkShown || propAnimationBlocked}
            tx="loadingModal.goToFlights"
          />
        </View>
      </View>
    </Modal>
  )
}

const $modalContainer: ViewStyle = {
  backgroundColor: '#00000050',
  justifyContent: "center",
  alignItems: "center",
  flex: 1,
}

const $title: TextStyle = {
  marginTop: spacing.small,
}

const $container: ViewStyle = {
  padding: 20,
  backgroundColor: colors.background,
  borderRadius: 8,
  justifyContent: 'center',
  alignItems: 'center'
}

const $propOneStyle: ViewStyle = {
  position: 'absolute',
  top: 23,
  left: 28,
  width: 50,
  height: 50
}

const $propTwoStyle: ViewStyle = {
  position: 'absolute',
  top: 23,
  left: 83,
  width: 50,
  height: 50
}

const $propThreeStyle: ViewStyle = {
  position: 'absolute',
  top: 79,
  left: 28,
  width: 50,
  height: 50
}

const $propFourStyle: ViewStyle = {
  position: 'absolute',
  top: 79,
  left: 83,
  width: 50,
  height: 50
}

const $description: TextStyle = {
  marginTop: spacing.tiny,
  marginBottom: spacing.medium,
}

const $welcomeLogo: ImageStyle = {
  marginTop: spacing.small,
  height: 88,
  width: 88,
  marginBottom: spacing.tiny,
}
