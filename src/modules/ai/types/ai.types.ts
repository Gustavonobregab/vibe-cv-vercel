/**
 * Interface for the CV analysis request
 */
export interface CvAnalysisRequest {
  /**
   * Content of the CV in text format
   */
  cvContent: string;

  /**
   * Original filename of the CV (optional)
   */
  filename?: string;
}

/**
 * Interface for suggested changes in the CV
 */
export interface CvSuggestedChange {
  /**
   * The original text that should be changed
   */
  original: string;

  /**
   * The suggested replacement text
   */
  suggestion: string;

  /**
   * Explanation for why this change is suggested
   */
  explanation: string;

  /**
   * Section of the CV where the change is suggested (e.g., "Experience", "Education", "Skills")
   */
  section?: string;
}

/**
 * Interface for the CV analysis response
 */
export interface CvAnalysisResponse {
  /**
   * Improved version of the CV content
   */
  improvedContent: string;

  /**
   * List of suggested changes
   */
  suggestedChanges: CvSuggestedChange[];

  /**
   * Overall assessment of the CV
   */
  overallAssessment: string;

  /**
   * Generated timestamp
   */
  timestamp: Date;
}

/**
 * Interface for converting PDF to text
 */
export interface PdfToTextRequest {
  /**
   * The PDF file buffer or path
   */
  pdfData: Buffer | string;

  /**
   * Whether the pdfData is a file path or a buffer
   */
  isPath?: boolean;
} 