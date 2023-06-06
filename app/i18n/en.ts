const en = {
  common: {
    ok: "OK!",
    cancel: "Cancel",
    back: "Back",
    logOut: "Log out",
    appName: "UAS Najava",
  },
  welcomeScreen: {
    postscript: "Location access is used to help with route planning. Consent is not mandatory, and your location is not stored anywhere.",
    readyForLaunch: "Hey, we're ready for takeoff!",
    exciting: "(just one more thing!)",
    operatorLabel: "1. Add operator",
    addOperatorButton: "Add operator",
    addOperatorButtonDone: "Operator added!",
    registrationInfo: "To obtain an operator registration number, you must register at https://uas.caa.si/ and pay the appropriate fee.",
    aircraftLabel: "2. Add device",
    addAircraftButton: "Add device",
    addAircraftButtonDone: "Device added!",
    locationLabel: "3. Allow access to location (optional)",
    allowLocationButton: "Allow access to location",
    letsGo: "Let's go",
    skip: "Skip",
  },
  errorScreen: {
    title: "Something went wrong!",
    friendlySubtitle: "Something went really wrong. Try again or restart the app. If the error persists, please report it on the app's GitHub page.",
    reset: "RESET APP",
    traceTitle: "Error from %{name} stack",
  },
  emptyStateComponent: {
    generic: {
      heading: "So empty... so sad",
      content: "You haven't added any flights yet.",
      button: "Add a new flight",
    },
  },
  loginScreen: {
    signIn: "Sign in",
    enterDetails: "Sign in with your Google account to continue.",
    tapToSignIn: "Sign in with Google",
    whyGoogleSignIn: "Why only Google Sign-In?",
    whyGoogleSignInContent: "The Civil Aviation Authority (CAA) of Slovenia requires UAS flight notifications in the form of an email with a specified format. This application actually functions as a custom Gmail client for sending specially crafted email messages that precisely meet the CAA's exact specifications.",
  },
  mainNavigator: {
    // componentsTab: "Components",
    settingsTab: "Settings",
    flightTab: "New flight",
    flightListTab: "Flights",
  },
  mainFlightScreen: {
    title: "New flight",
    tagLine:
      "Notified flights are allowed within the open category in a populated area for unmanned aircraft systems weighing up to 500 g, up to a height of 50 m above ground level (AGL), exclusively during daylight hours and with the consent of the landowner.",
    flightDate: "Flight date",
    timeFrom: "Time from",
    timeTo: "Time to",
    aircraft: "Device",
    addDevice: "Add device",
    mustSelectAircraft: "You must select a device",
    operator: "Operator",
    mustSelectOperator: "You must select an operator",
    addOperator: "Add operator",
    purpose: "Flight purpose",
    purposePlaceholder: "Other",
    location: "Location",
    locationPlaceholder: "E.g. Radenci",
    locationHelper: "The default value is determined based on your current location (if you have allowed access).",
    plannedHeight: "Planned flying height",
    plannedHeightHelper: "The maximum allowed flying height is 50m.",
    plannedDistance: "Maximum planned distance",
    plannedDistanceHelper: "Maximum 120 meters from the nearest point on the ground, except when crossing an obstacle.",
    flightArea: "Flight area",
    flightAreaHelper: "Tap on the map to add a point. Points can be moved by dragging and deleted by pressing. Long press to add a takeoff-landing point.",
    resetMap: "Reset map",
    deletePoint: "Delete",
    submit: "Submit",
    error: "Error",
    errorMissingFields: "Please fill in all fields and add at least 3 points to the flight area.",
    savingFlight: "Saving flight...",
    generatingPdf: "Generating PDF...",
    generatingKml: "Generating KML...",
    sendingEmail: "Sending email...",
    completing: "Completing...",
    mapLegend: "Map key",
    yourLocation: "Your location",
    flightAreaPoint: "Vertex",
    takeOffLandingPoint: "Takeoff-landing point",
  },
  loadingModal: {
    success: "Success!",
    loading: "Loading...",
    completed: "Completed!",
    goToFlights: "Go to flights",
  },
  addOperatorScreen: {
    title: "Add operator",
    cancel: "Cancel",
    tagLine: "Add an operator who will perform the flight.",
    nameFieldLabel: "Operator name",
    nameFieldPlaceholder: "John Doe",
    registrationNumberFieldLabel: "Operator registration number",
    registrationNumberHelper: "The registration number of the operator that you received during registration. It starts with SVN.",
    registrationNumberPlaceholder: "SVN123456789",
    phoneFieldLabel: "Operator phone number",
    phoneFieldPlaceholder: "+386 40 123 456",
    isDefaultToggleLabel: "Default operator",
    tapToAdd: "Add operator",
    save: "Save",
  },
  addAircraftScreen: {
    title: "Add aircraft",
    cancel: "Cancel",
    typeFieldLabel: "Aircraft type",
    typeFieldPlaceholder: "e.g. DJI Mini 3 Pro",
    serialNumberFieldLabel: "Aircraft serial number",
    serialNumberFieldPlaceholder: "Serial number",
    internalNameFieldLabel: "Internal device name (optional)",
    internalNameFieldHelper: "Device name for easier identification in the application. Not sent to CAA.",
    internalNameFieldPlaceholder: "My super drone",
    isDefaultToggleLabel: "Default device",
    save: "Save",
  },
  mainShowroomScreen: {
    jumpStart: "Components to jump start your project!",
    lorem2Sentences:
      "Nulla cupidatat deserunt amet quis aliquip nostrud do adipisicing. Adipisicing excepteur elit laborum Lorem adipisicing do duis.",
    demoHeaderTxExample: "Yay",
    demoViaTxProp: "Via `tx` Prop",
    demoViaSpecifiedTxProp: "Via `{{prop}}Tx` Prop",
  },
  mainSettingsScreen: {
    title: "Settings",
    operators: "Operators",
    devices: "Devices",
    remove: "Remove",
    loggedInAs: "Logged in as",
    author: "Author",
    releasedUnderLicense: "Released under the MIT license.",
    madeWithLoveBy: "Made with ❤️❤️❤️ in Radenci.",
    version: "Version",
    build: "Build",
    reactotron: "Send to Reactotron",
    reportBugs: "Report a bug",
  },
  mainFlightsScreen: {
    title: "Flights",
    onlyPast: "Show only past flights",
    downloadPDF: "Download PDF",
    downloadKML: "Download KML",
    accessibility: {
      switch: "Switch to past flights",
    },
    noPastFlightsEmptyState: {
      heading: "This looks a bit empty",
      content: "You don't have any past flights yet.",
    },
  },
}

export default en
export type Translations = typeof en
