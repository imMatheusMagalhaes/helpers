const { default: fetch } = require("node-fetch");
const { PDFDocument } = require("pdf-lib");

const pdf = async () => {
  const pdfUrl =
    "https://storage.googleapis.com/rocketchat-cc-uploads/iv6QaCKuyicWbBSwH%2Fuploads%2FfppszbKzDPYdkpBDA%2FiKKnXwqiKZeEwsrnY%2FbZmYncYgeivegj8dz?GoogleAccessId=rocketchat-mvp%40black-nucleus-236512.iam.gserviceaccount.com&Expires=1658926273&Signature=e8VmKXQ2FxDdCyEctyU5WM5GiMOwkXYfCrJdxEpS%2FWD2fXwvYp2MsBtUQ%2B77E3168nyuJclMIGDOZyUBDA8uq81Cj%2BbXuB2eVlnM%2FzalYGvaABkbsEVDImOEUGWRpAC6LSuzl0jKwnGTs%2FYj8NJTuoQ94xKG9yb4vTv7KDsdylyN9v%2BpV1Of5mJlM55knWQLGQyxDS2KyX7j4wYxinQpgQQSSGUN75%2F8h2CL%2FfzN5N4xGh%2F6HjTUgMS6ZBowUWBGvAMluBxWRgKSjOmNfW7GNcekDTFa7goyeGgDh9UajnmBTTKpeJFqci%2BSy7jCYJKup7gL2YAUAeENSfY6FFsBig%3D%3D&response-content-disposition=inline";
  const pdfBytes = await fetch(pdfUrl).then((res) => res.arrayBuffer());
  try {
    const pdfDoc = await PDFDocument.load(pdfBytes, { updateMetadata: false })
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