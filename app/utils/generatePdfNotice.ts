import { PDFDocument } from "pdf-lib"
import { format } from "date-fns"
import fontkit from "@pdf-lib/fontkit"
import PDFTemplate from "./../../assets/pdf/najava_leta.json"
import FreeSansFont from "./../../assets/pdf/FreeSansBold.json"
import { Buffer } from "buffer"
import RNFS from "react-native-fs"
import { Flight } from "app/models/Flight"

export async function generatePdfNotice(flight: Flight) {
  // This should be a Uint8Array or ArrayBuffer
  // This data can be obtained in a number of different ways
  // If you're running in a Node environment, you could use fs.readFile()
  // In the browser, you could make a fetch() call and use res.arrayBuffer()
  const existingPdfBytes = Buffer.from(PDFTemplate.FileBytes, "base64").buffer

  // Load a PDFDocument from the existing PDF bytes
  const pdfDoc = await PDFDocument.load(existingPdfBytes)
  pdfDoc.registerFontkit(fontkit)

  const fontBytesArray = Buffer.from(FreeSansFont.FileBytes, "base64").buffer

  // Embed the Helvetica font
  const _freeSansFont = await pdfDoc.embedFont(fontBytesArray, { subset: true })

  const form = pdfDoc.getForm()

  // console.log("flight", flight)

  // Get all fields in the PDF by their names
  form.getTextField("Naziv operatorja").setText(flight.operator.name)
  form.getTextField("Telefonska številka").setText(flight.operator.phone)
  form.getTextField("Tip naprave").setText(flight.aircraft.type)
  form.getTextField("Serijska številka naprave").setText(flight.aircraft.serialNumber)
  form
    .getTextField("Registracijska številka operatorja")
    .setText(flight.operator.registrationNumber)
  form.getTextField("Namen leta 1").setText(flight.purpose)
  form.getTextField("FormDateField").setText(format(flight.startTime, "dd.MM.yyyy"))
  form.getTextField("Čas Od").setText(format(flight.startTime, "HH:mm"))
  form.getTextField("Čas Do").setText(format(flight.endTime, "HH:mm"))
  form.getTextField("Lokacija").setText(flight.location)
  for (let i = 0; i < Math.min(6, flight.selectedLocations.length); i++) {
    const location = flight.selectedLocations[i]
    form.getTextField(`N_${i + 1}`).setText(`${location.latitude}°`)
    form.getTextField(`E_${i + 1}`).setText(`${location.longitude}°`)
  }
  if (flight.selectedLocations.length > 6) {
    form.getTextField("DodatnoPojasniloPrevecTock").setFontSize(5)
    form
      .getTextField("DodatnoPojasniloPrevecTock")
      .setText("Opomba: Poligon vsebuje več kot 6 točk, vse nadaljnje so razvidne v .kml datoteki.")
  }
  form.getTextField("lst1").setText(`${flight.id}.kml`)
  form.getTextField("Višina letenja").setText(flight.plannedHeight)
  form.getTextField("Največja oddaljenost").setText(flight.plannedDistance)

  form.updateFieldAppearances(_freeSansFont)

  form.flatten()

  // Serialize the PDFDocument to bytes (a Uint8Array)
  const pdfBytes = await pdfDoc.saveAsBase64()

  const path = RNFS.DocumentDirectoryPath + `/najava_leta_${flight.id}.pdf`

  // write the file
  await RNFS.writeFile(path, pdfBytes, "base64")

  return [path, pdfBytes]
}
