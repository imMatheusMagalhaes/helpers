const { default: axios } = require("axios");
const { default: fetch } = require("node-fetch");
const { PDFDocument } = require("pdf-lib");
const fs = require("fs");
const pdf = async () => {
  // const pdfUrl =
  //   "https://www.caceres.mt.gov.br/fotos_institucional_downloads/2.pdf";
  // const { data } = await axios
  //   .get(pdfUrl, {
  //     responseType: 'arraybuffer',
  //     headers: {}
    // })
  try {
    var file = fs.readFileSync(__dirname + "/invlid.pdf")
    const pdfDoc = await PDFDocument.load(file, { updateMetadata: false })
    return { pdfCreator: pdfDoc.getCreator(), pdfAuthor: pdfDoc.getAuthor() }
  } catch (error) {
    if (error.message.includes("No PDF header found")) return {}
  }
}
pdf().then(res => {
  const { pdfCreator, pdfAuthor } = res
  console.log(pdfCreator, pdfAuthor)
})


// const title = pdfDoc.getTitle();
// const author = pdfDoc.getAuthor();
// const subject = pdfDoc.getSubject();
// const creator = pdfDoc.getCreator();
// const keywords = pdfDoc.getKeywords();
// const producer = pdfDoc.getProducer();
// const creationDate = pdfDoc.getCreationDate();
// const modificationDate = pdfDoc.getModificationDate();