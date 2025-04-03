import { OpenAI } from 'openai'
import dotenv from 'dotenv'
import { InvalidInputException } from '../../../shared/errors/http-exception'

dotenv.config()

// Using direct throw for configuration is appropriate since this happens at module load time
if (!process.env.OPENAI_API_KEY) {
  throw new InvalidInputException('OPENAI_API_KEY environment variable is not set')
}

// Helper function to parse environment variables with validation
const parseEnvVar = <T>(name: string, defaultValue: T, parser: (value: string) => T): T => {
  const value = process.env[name]
  if (!value) {
    return defaultValue
  }
  try {
    return parser(value)
  } catch (error) {
    console.warn(`Invalid ${name} value, using default: ${defaultValue}`)
    return defaultValue
  }
}

/**
 * OpenAI configuration for the AI module
 */
export const openaiConfig = {
  apiKey: process.env.OPENAI_API_KEY,
  model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview', // Default to GPT-4 Turbo
  maxTokens: parseEnvVar('OPENAI_MAX_TOKENS', 2000, (val) => {
    const parsed = parseInt(val, 10)
    if (isNaN(parsed) || parsed <= 0) throw new Error('Invalid max tokens')
    return parsed
  }),
  temperature: parseEnvVar('OPENAI_TEMPERATURE', 0.7, (val) => {
    const parsed = parseFloat(val)
    if (isNaN(parsed) || parsed < 0 || parsed > 2) throw new Error('Invalid temperature')
    return parsed
  }),
}

/**
 * Create and export an OpenAI client instance
 */
export const openai = new OpenAI({
  apiKey: openaiConfig.apiKey,
}) 