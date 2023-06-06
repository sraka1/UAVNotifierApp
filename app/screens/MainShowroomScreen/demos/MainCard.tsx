/* eslint-disable react/jsx-key, react-native/no-inline-styles */
import React from "react"
import { AutoImage, Button, Card, Icon } from "../../../components"
import { colors, spacing } from "../../../theme"
import { Main } from "../MainShowroomScreen"
import { MainDivider } from "../MainDivider"
import { MainUseCase } from "../MainUseCase"

export const MainCard: Main = {
  name: "Card",
  description:
    "Cards are useful for displaying related information in a contained way. If a ListItem displays content horizontally, a Card can be used to display content vertically.",
  data: [
    <MainUseCase name="Presets" description="There are a few presets that are preconfigured.">
      <Card
        heading="Default Preset (default)"
        content="Incididunt magna ut aliquip consectetur mollit dolor."
        footer="Consectetur nulla non aliquip velit."
      />
      <MainDivider />
      <Card
        heading="Reversed Preset"
        content="Reprehenderit occaecat proident amet id laboris."
        footer="Consectetur tempor ea non labore anim ."
        preset="reversed"
      />
    </MainUseCase>,

    <MainUseCase
      name="Vertical Alignment"
      description="Depending on what's required, the card comes preconfigured with different alignment strategies."
    >
      <Card
        heading="Top (default)"
        content="All content is automatically aligned to the top."
        footer="Even the footer"
        style={{ minHeight: 160 }}
      />
      <MainDivider />
      <Card
        heading="Center"
        verticalAlignment="center"
        preset="reversed"
        content="Content is centered relative to the card's height."
        footer="Me too!"
        style={{ minHeight: 160 }}
      />
      <MainDivider />
      <Card
        heading="Space Between"
        verticalAlignment="space-between"
        content="All content is spaced out evenly."
        footer="I am where I want to be."
        style={{ minHeight: 160 }}
      />
      <MainDivider />
      <Card
        preset="reversed"
        heading="Force Footer Bottom"
        verticalAlignment="force-footer-bottom"
        content="This pushes the footer where it belongs."
        footer="I'm so lonely down here."
        style={{ minHeight: 160 }}
      />
    </MainUseCase>,

    <MainUseCase
      name="Passing Content"
      description="There are a few different ways to pass content."
    >
      <Card heading="Via `heading` Prop" content="Via `content` Prop" footer="Via `footer` Prop" />
      <MainDivider />
      <Card
        preset="reversed"
        headingTx="mainShowroomScreen.demoViaSpecifiedTxProp"
        headingTxOptions={{ prop: "heading" }}
        contentTx="mainShowroomScreen.demoViaSpecifiedTxProp"
        contentTxOptions={{ prop: "content" }}
        footerTx="mainShowroomScreen.demoViaSpecifiedTxProp"
        footerTxOptions={{ prop: "footer" }}
      />
    </MainUseCase>,

    <MainUseCase
      name="Custom Components"
      description="Any of the preconfigured components can be replaced with your own. You can also add additional ones."
    >
      <Card
        HeadingComponent={
          <Button
            preset="reversed"
            text="HeadingComponent"
            LeftAccessory={(props) => <Icon style={props.style} icon="ladybug" />}
          />
        }
        ContentComponent={
          <Button
            style={{ marginVertical: spacing.small }}
            text="ContentComponent"
            LeftAccessory={(props) => <Icon style={props.style} icon="ladybug" />}
          />
        }
        FooterComponent={
          <Button
            preset="reversed"
            text="FooterComponent"
            LeftAccessory={(props) => <Icon style={props.style} icon="ladybug" />}
          />
        }
      />
      <MainDivider />
      <Card
        heading="RightComponent"
        verticalAlignment="center"
        RightComponent={
          <AutoImage
            maxWidth={80}
            maxHeight={60}
            style={{ alignSelf: "center" }}
            source={{
              uri: "https://user-images.githubusercontent.com/1775841/184508739-f90d0ce5-7219-42fd-a91f-3382d016eae0.png",
            }}
          />
        }
      />
      <MainDivider />
      <Card
        preset="reversed"
        heading="LeftComponent"
        verticalAlignment="center"
        LeftComponent={
          <AutoImage
            maxWidth={80}
            maxHeight={60}
            style={{ alignSelf: "center" }}
            source={{
              uri: "https://user-images.githubusercontent.com/1775841/184508739-f90d0ce5-7219-42fd-a91f-3382d016eae0.png",
            }}
          />
        }
      />
    </MainUseCase>,

    <MainUseCase name="Styling" description="The component can be styled easily.">
      <Card
        heading="Style the Heading"
        headingStyle={{ color: colors.error }}
        content="Style the Content"
        contentStyle={{ backgroundColor: colors.error, color: colors.palette.neutral100 }}
        footer="Style the Footer"
        footerStyle={{
          textDecorationLine: "underline line-through",
          textDecorationStyle: "dashed",
          color: colors.error,
          textDecorationColor: colors.error,
        }}
        style={{
          shadowRadius: 5,
          shadowColor: colors.error,
          shadowOpacity: 0.5,
        }}
      />
    </MainUseCase>,
  ],
}
