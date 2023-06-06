import { BottomTabScreenProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { CompositeScreenProps } from "@react-navigation/native"
import React from "react"
import { TextStyle, ViewStyle, StyleSheet } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Icon } from "../components"
import { translate } from "../i18n"
import { MainFlightScreen, MainSettingsScreen } from "../screens"
import { MainFlightListScreen } from "../screens/MainFlightListScreen"
import { colors, spacing, typography } from "../theme"
import { AppStackParamList, AppStackScreenProps } from "./AppNavigator"

export type MainTabParamList = {
  MainFlight: undefined
  MainShowroom: { queryIndex?: string; itemIndex?: string }
  MainAbout: undefined
  MainFlightList: undefined
}

/**
 * Helper for automatically generating navigation prop types for each route.
 *
 * More info: https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type MainTabScreenProps<T extends keyof MainTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, T>,
  AppStackScreenProps<keyof AppStackParamList>
>

const Tab = createBottomTabNavigator<MainTabParamList>()

export function MainNavigator() {
  const { bottom } = useSafeAreaInsets()

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: [
          $tabBar,
          {
            height: bottom + 70,
            borderTopWidth: StyleSheet.hairlineWidth,
            borderTopColor: colors.border,
          },
        ],
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.text,
        tabBarLabelStyle: $tabBarLabel,
        tabBarItemStyle: $tabBarItem,
      }}
    >
      {/*
          <Tab.Screen
            name="MainShowroom"
            component={MainShowroomScreen}
            options={{
              tabBarLabel: translate("mainNavigator.componentsTab"),
              tabBarIcon: ({ focused }) => (
                <Icon icon="components" color={focused && colors.tint} size={30} />
              ),
            }}
          />
        */}

      <Tab.Screen
        name="MainFlight"
        component={MainFlightScreen}
        options={{
          tabBarLabel: translate("mainNavigator.flightTab"),
          tabBarIcon: ({ focused }) => (
            <Icon icon="add" color={focused && colors.tint} size={30} />
          ),
        }}
      />

      <Tab.Screen
        name="MainFlightList"
        component={MainFlightListScreen}
        options={{
          tabBarAccessibilityLabel: translate("mainNavigator.flightListTab"),
          tabBarLabel: translate("mainNavigator.flightListTab"),
          tabBarIcon: ({ focused }) => (
            <Icon icon="list" color={focused && colors.tint} size={30} />
          ),
        }}
      />

      <Tab.Screen
        name="MainAbout"
        component={MainSettingsScreen}
        options={{
          tabBarLabel: translate("mainNavigator.settingsTab"),
          tabBarIcon: ({ focused }) => (
            <Icon icon="settings" color={focused && colors.tint} size={30} />
          ),
        }}
      />
    </Tab.Navigator>
  )
}

const $tabBar: ViewStyle = {
  backgroundColor: colors.background,
  borderTopColor: colors.transparent,
}

const $tabBarItem: ViewStyle = {
  paddingTop: spacing.medium,
}

const $tabBarLabel: TextStyle = {
  fontSize: 12,
  fontFamily: typography.primary.medium,
  lineHeight: 16,
  flex: 1,
}
