import { openai, openaiConfig } from '../config/openai.config'
import { CvAnalysisRequest, CvAnalysisResponse } from '../types/ai.types'
import pdfService from './pdf.service'
import { InvalidInputException } from '../../../shared/errors/http-exception'

/**
 * The system prompt that guides the AI on how to analyze and improve CVs
 */
const CV_ANALYSIS_SYSTEM_PROMPT = `
You are a professional CV/resume reviewer and advisor specialized in improving resumes. 
Your task is to analyze the provided CV and suggest improvements to make it more effective and professional.

You should:
1. Identify weak points, unclear sections, or unprofessional language
2. Suggest specific improvements and rewrites
3. Provide an overall assessment of the CV
4. Format your suggestions in a clear, actionable manner

For each suggested change, explain WHY it improves the CV.
Focus on:
- More impactful language and action verbs
- Better highlighting of achievements and skills
- Professional tone and formatting
- Removing unnecessary information
- Adding any missing critical elements
- Improved structure and organization

Output Format:
- Provide the improved content as a complete text
- List each suggested change with the original text, the suggested replacement, and explanation
- Include an overall assessment at the end
`;

/**
 * Analyzes a CV text and provides improvement suggestions
 * @param request - The CV analysis request containing the CV content
 * @returns CV analysis response with improvements and suggestions
 */
const analyzeCv = async (request: CvAnalysisRequest): Promise<CvAnalysisResponse> => {
  if (!request.cvContent || request.cvContent.trim().length === 0) {
    throw new InvalidInputException('CV content cannot be empty');
  }

  const response = await openai.chat.completions.create({
    model: openaiConfig.model,
    messages: [
      {
        role: 'system',
        content: CV_ANALYSIS_SYSTEM_PROMPT
      },
      {
        role: 'user',
        content: `Please analyze and improve this CV:\n\n${request.cvContent}`
      }
    ],
    max_tokens: openaiConfig.maxTokens,
    temperature: openaiConfig.temperature,
    response_format: { type: "json_object" }
  });

  if (!response.choices[0]?.message?.content) {
    throw new InvalidInputException('No response received from OpenAI');
  }

  let responseData;

  // Parse the content - JSON parsing errors are caught and handled explicitly here
  try {
    responseData = JSON.parse(response.choices[0].message.content);
  } catch (error) {
    // Create a basic fallback response with the original content
    return {
      improvedContent: request.cvContent,
      suggestedChanges: [],
      overallAssessment: 'Could not analyze CV due to API response parsing error.',
      timestamp: new Date()
    };
  }

  // Validate that the required fields are present in the response
  if (!responseData.improvedContent || !Array.isArray(responseData.suggestedChanges) || !responseData.overallAssessment) {
    // Create a response with available data and fallbacks for missing fields
    return {
      improvedContent: responseData.improvedContent || request.cvContent,
      suggestedChanges: Array.isArray(responseData.suggestedChanges) ? responseData.suggestedChanges : [],
      overallAssessment: responseData.overallAssessment || 'Analysis incomplete due to missing data in API response.',
      timestamp: new Date()
    };
  }

  return {
    improvedContent: responseData.improvedContent,
    suggestedChanges: responseData.suggestedChanges,
    overallAssessment: responseData.overallAssessment,
    timestamp: new Date()
  };
};

/**
 * Analyzes a CV from a PDF file and provides improvement suggestions
 * @param pdfBuffer - The PDF file as a buffer
 * @param filename - Optional filename of the PDF
 * @returns CV analysis response with improvements and suggestions
 */
const analyzePdfCv = async (pdfBuffer: Buffer, filename?: string): Promise<CvAnalysisResponse> => {
  // Extract text from the PDF
  const cvContent = await pdfService.convertPdfToText({
    pdfData: pdfBuffer,
    isPath: false
  });

  if (!cvContent || cvContent.trim().length === 0) {
    throw new InvalidInputException('Could not extract text from PDF or PDF is empty');
  }

  // Analyze the extracted text
  return await analyzeCv({
    cvContent,
    filename
  });
};

export default {
  analyzeCv,
  analyzePdfCv
} 