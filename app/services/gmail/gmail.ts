import { GoogleSignin } from "@react-native-google-signin/google-signin"
import { format } from "date-fns"
import { create } from "apisauce"
import { Flight } from "app/models/Flight"
// Force-import the browser version of MimeText
import { createMimeMessage } from "mimetext/dist/browser/cjs"
import { isNull } from "lodash"
import Config from "../../config"

const GmailAPI = create({
  baseURL: "https://gmail.googleapis.com/",
  headers: { Accept: "application/json" },
})

export async function sendEmail(flight: Flight, pdfBytes, kmlBytes, setUser, setAuthToken) {
  const msg = createMimeMessage()

  let userObject = await GoogleSignin.getCurrentUser()
  const loggedIn = await GoogleSignin.isSignedIn()
  if (!loggedIn || isNull(userObject)) {
    userObject = await GoogleSignin.signInSilently()
  }
  let accessToken
  try {
    ({ accessToken } = await GoogleSignin.getTokens())
  } catch (error) {
    if (error?.message && error?.message?.includes("getTokens requires a user to be signed in")) {
      userObject = await GoogleSignin.signInSilently()
    }
    ({ accessToken } = await GoogleSignin.getTokens())
  }

  setUser(userObject.user)
  setAuthToken(accessToken)

  // Note: We don't use i18n here because the email prescribed by the CAA is in Slovenian
  msg.setSender({ name: userObject.user.name, addr: userObject.user.email })
  msg.setRecipients(Config.UAV_NOTIFICATION_EMAIL)
  msg.setSubject(
    `Najava leta UAV / ${flight.operator.name} / ODPRTA / ${format(
      flight.startTime,
      "dd.MM.yyyy",
    )} / ${format(flight.startTime, "HH:mm")} / ${format(flight.endTime, "HH:mm")} / ${
      flight.location
    }`,
  )
  msg.addMessage({
    contentType: "text/plain",
    // I hate this, but it's the simplest way to get the line breaks to work nicely
    data: `Najava leta UAV
Naziv operatorja: ${flight.operator.name}
Telefonska številka: ${flight.operator.phone}
Tip naprave: ${flight.aircraft.type}
Kategorija dejavnosti: ODPRTA
Namen leta: ${flight.purpose}
Datum leta: ${format(flight.startTime, "dd.MM.yyyy")}
Čas leta: ${format(flight.startTime, "HH:mm")} - ${format(flight.endTime, "HH:mm")}
Lokacija: ${flight.location}
Področje letenja: N/A
Datoteka .kml: obmocje_letenja_${flight.id}.kml
Načrtovana višina letenja: ${flight.plannedHeight}
Največja načrtovana oddaljenost: ${flight.plannedDistance}
Shranite prilogo za vaš arhiv.
Save the mail attachment for your own records.
`,
  })
  msg.addAttachment({
    filename: `najava_leta_${flight.id}.pdf`,
    contentType: "application/pdf",
    data: pdfBytes,
  })
  // console.log('kmlBytes', kmlBytes)
  msg.addAttachment({
    filename: `obmocje_letenja_${flight.id}.kml`,
    contentType: "application/vnd.google-earth.kml+xml",
    data: kmlBytes,
  })

  try {
    const gmailResponse = await GmailAPI.post(
      "/gmail/v1/users/me/messages/send",
      { raw: msg.asEncoded() },
      { headers: { Authorization: `Bearer ${accessToken}` } },
    )
    /*
      console.log('gmailResponse', gmailResponse);
      console.log('gmailResponse.data', gmailResponse.data)
      console.log('gmailResponse.status', gmailResponse.status)
      console.log('gmailResponse.headers', gmailResponse.headers)
      console.log('gmailResponse.config', gmailResponse.config)
      console.log('gmailResponse.originalError', gmailResponse.originalError)
    */
    return gmailResponse
  } catch (e) {
    // console.log('e', e);
    return e
  }
}
