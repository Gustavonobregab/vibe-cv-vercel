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
  let dataBuffer: Buffer;

  if (request.isPath && typeof request.pdfData === 'string') {
    dataBuffer = fs.readFileSync(request.pdfData);
    return await processBuffer(dataBuffer);
  }

  if (request.pdfData instanceof Buffer) {
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

  return data.text;
}

export default {
  convertPdfToText
} 