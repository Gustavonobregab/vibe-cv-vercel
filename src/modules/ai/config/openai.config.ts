import { OpenAI } from 'openai'
import dotenv from 'dotenv'
import { InvalidInputException } from '../../../shared/errors/http-exception'

dotenv.config()

// Using direct throw for configuration is appropriate since this happens at module load time
if (!process.env.OPENAI_API_KEY) {
  throw new InvalidInputException('OPENAI_API_KEY environment variable is not set')
}

/**
 * OpenAI configuration for the AI module
 */
export const openaiConfig = {
  apiKey: process.env.OPENAI_API_KEY,
  model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview', // Default to GPT-4 Turbo
  maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || '2000', 10),
  temperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.7'),
}

/**
 * Create and export an OpenAI client instance
 */
export const openai = new OpenAI({
  apiKey: openaiConfig.apiKey,
}) 