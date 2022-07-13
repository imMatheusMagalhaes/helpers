const { default: fetch } = require("node-fetch");
const { PDFDocument } = require("pdf-lib");

const pdf = async () => {
  const pdfUrl = "https://www.caceres.mt.gov.br/fotos_institucional_downloads/2.pdf";
  const pdfBytes = await fetch(pdfUrl).then((res) => res.arrayBuffer());

  // Load the PDF document without updating its existing metadata
  const pdfDoc = await PDFDocument.load(pdfBytes, {
    updateMetadata: false,
  });

  // Read all available metadata fields
  const title = pdfDoc.getTitle();
  const author = pdfDoc.getAuthor();
  const subject = pdfDoc.getSubject();
  const creator = pdfDoc.getCreator();
  const keywords = pdfDoc.getKeywords();
  const producer = pdfDoc.getProducer();
  const creationDate = pdfDoc.getCreationDate();
  const modificationDate = pdfDoc.getModificationDate();

  console.log(creator);
};

pdf()
