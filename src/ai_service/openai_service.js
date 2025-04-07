/**
 * OpenAI Service
 * Implementiert die Integration mit der OpenAI API für AutoMonet
 */

import { AppError, ErrorTypes } from '../middleware/error-handler';

// OpenAI API Konfiguration
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const BASE_URL = 'https://api.openai.com/v1';

/**
 * Zentrale OpenAI Service Klasse
 */
class OpenAIService {
  constructor() {
    if (!OPENAI_API_KEY) {
      console.warn('OpenAI API Schlüssel nicht konfiguriert. Die OpenAI Funktionalität ist deaktiviert.');
    }
  }

  /**
   * Hauptmethode zur Anfrage an ein OpenAI-Modell
   */
  async generateCompletion(params) {
    this._validateApiKey();
    
    const {
      model = 'gpt-3.5-turbo',
      messages,
      maxTokens = 1000,
      temperature = 0.7,
      topP = 1,
      frequencyPenalty = 0,
      presencePenalty = 0,
      stop = null,
      tools = null,
      toolChoice = null,
      systemMessage = null
    } = params;
    
    // Bereite die Nachrichtenliste vor
    let promptMessages = [];
    
    // System-Nachricht hinzufügen, falls vorhanden
    if (systemMessage)
