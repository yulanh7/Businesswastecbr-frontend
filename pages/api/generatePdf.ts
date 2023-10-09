import { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer";

const generatePdfFromUrl = async (url: string) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.goto(url, {
    waitUntil: "networkidle0",
  });

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
  });

  await browser.close();

  return pdfBuffer;
};

const handleRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  const url = req.body.url || "http://localhost:3000";
  try {
    const pdfBuffer = await generatePdfFromUrl(url);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=document.pdf");
    res.end(pdfBuffer);
  } catch (error) {
    console.error(error);

    res.status(500).json({ error: error });
  }
};

export default handleRequest;
