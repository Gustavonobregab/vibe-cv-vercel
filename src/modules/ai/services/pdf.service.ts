import fs from 'fs'
import pdfParse from 'pdf-parse'
import { PdfToTextRequest } from '../types/ai.types'
import { InvalidInputException } from '../../../shared/errors/http-exception'

/**
 * Convert PDF to text
 * @param request The PDF to text conversion request
 * @returns Extracted text from the PDF
 */
const convertPdfToText = async (request: PdfToTextRequest): Promise<string> => {
  // Input validation
  if (!request.pdfData) {
    throw new InvalidInputException('No PDF data provided');
  }

  let dataBuffer: Buffer;

  if (request.isPath && typeof request.pdfData === 'string') {
    if (!fs.existsSync(request.pdfData)) {
      throw new InvalidInputException(`PDF file not found: ${request.pdfData}`);
    }
    dataBuffer = fs.readFileSync(request.pdfData);
    return await processBuffer(dataBuffer);
  }

  if (request.pdfData instanceof Buffer) {
    if (request.pdfData.length === 0) {
      throw new InvalidInputException('Empty PDF buffer provided');
    }
    dataBuffer = request.pdfData;
    return await processBuffer(dataBuffer);
  }

  throw new InvalidInputException('Invalid PDF data format');
}

/**
 * Helper function to process buffer and extract text
 */
const processBuffer = async (buffer: Buffer): Promise<string> => {
  const data = await pdfParse(buffer);

  if (!data || !data.text) {
    throw new InvalidInputException('Failed to extract text from PDF');
  }

  const text = data.text.trim();

  if (text.length === 0) {
    throw new InvalidInputException('PDF contains no text content');
  }

  return text;
}

export default {
  convertPdfToText
} 