/**
 * LLM Router - Intelligente Auswahl und Kostenoptimierung verschiedener AI-Modelle
 * 
 * Dieser Router wählt automatisch das optimale KI-Modell basierend auf:
 * - Aufgabenkomplexität
 * - Budgetbeschränkungen
 * - Anforderungen an Antwortqualität und -geschwindigkeit
 * - Historische Leistungsmetriken
 */

import { supabase } from '../integrations/supabase';
import { AppError, ErrorTypes } from '../middleware/error-handler';

// Definition der verfügbaren AI-Modellgruppen
const AI_PROVIDERS = {
  OPENAI: 'openai',
  ANTHROPIC: 'anthropic',
  GOOGLE: 'google',
  OPENROUTER: 'openrouter',
  MISTRAL: 'mistral',
  OLLAMA: 'ollama' // Für lokales Deployment von Modellen
};

// Modellmapping mit Bewertungen für verschiedene Anwendungsfälle
const AI_MODELS = {
  // OpenAI Modelle
  'gpt-4o': {
    provider: AI_PROVIDERS.OPENAI,
    capabilities: {
      creativeWriting: 0.95,
      technicalContent: 0.92,
      communication: 0.94,
      reasoning: 0.93,
      dataAnalysis: 0.88
    },
    costPer1kTokens: { input: 0.01, output: 0.03 },
    tokenLimit: 128000,
    responseTime: 'medium', // relative Geschwindigkeit
    priority: 3 // höhere Zahl = höhere Priorität (wenn Budget verfügbar)
  },
  'gpt-3.5-turbo': {
    provider: AI_PROVIDERS.OPENAI,
    capabilities: {
      creativeWriting: 0.82,
      technicalContent: 0.75,
      communication: 0.85,
      reasoning: 0.70,
      dataAnalysis: 0.65
    },
    costPer1kTokens: { input: 0.0005, output: 0.0015 },
    tokenLimit: 16000,
    responseTime: 'fast',
    priority: 1
  },
  // Google Modelle
  'gemini-1.5-pro': {
    provider: AI_PROVIDERS.GOOGLE,
    capabilities: {
      creativeWriting: 0.88,
      technicalContent: 0.89,
      communication: 0.86,
      reasoning: 0.90,
      dataAnalysis: 0.85
    },
    costPer1kTokens: { input: 0.0025, output: 0.0075 },
    tokenLimit: 1000000,
    responseTime: 'medium',
    priority: 2
  },
  'gemini-1.5-flash': {
    provider: AI_PROVIDERS.GOOGLE,
    capabilities: {
      creativeWriting: 0.82,
      technicalContent: 0.78,
      communication: 0.80,
      reasoning: 0.75,
      dataAnalysis: 0.70
    },
    costPer1kTokens: { input: 0.0005, output: 0.0015 },
    tokenLimit: 1000000,
    responseTime: 'fast',
    priority: 1
  },
  // Anthropic Modelle
  'claude-3-opus': {
    provider: AI_PROVIDERS.ANTHROPIC,
    capabilities: {
      creativeWriting: 0.91,
      technicalContent: 0.93,
      communication: 0.94,
      reasoning: 0.95,
      dataAnalysis: 0.88
    },
    costPer1kTokens: { input: 0.015, output: 0.075 },
    tokenLimit: 200000,
    responseTime: 'slow',
    priority: 3
  },
  'claude-3-sonnet': {
    provider: AI_PROVIDERS.ANTHROPIC,
    capabilities: {
      creativeWriting: 0.90,
      technicalContent: 0.88,
      communication: 0.92,
      reasoning: 0.89,
      dataAnalysis: 0.83
    },
    costPer1kTokens: { input: 0.003, output: 0.015 },
    tokenLimit: 200000,
    responseTime: 'medium',
    priority: 2
  },
  'claude-3-haiku': {
    provider: AI_PROVIDERS.ANTHROPIC,
    capabilities: {
      creativeWriting: 0.85,
      technicalContent: 0.80,
      communication: 0.87,
      reasoning: 0.78,
      dataAnalysis: 0.72
    },
    costPer1kTokens: { input: 0.00025, output: 0.00125 },
    tokenLimit: 200000,
    responseTime: 'fast',
    priority: 1
  },
  // Mistral Modelle
  'mistral-large': {
    provider: AI_PROVIDERS.MISTRAL,
    capabilities: {
      creativeWriting: 0.87,
      technicalContent: 0.89,
      communication: 0.86,
      reasoning: 0.88,
      dataAnalysis: 0.82
    },
    costPer1kTokens: { input: 0.002, output: 0.006 },
    tokenLimit: 32000,
    responseTime: 'medium',
    priority: 2
  },
  'mistral-small': {
    provider: AI_PROVIDERS.MISTRAL,
    capabilities: {
      creativeWriting: 0.75,
      technicalContent: 0.78,
      communication: 0.76,
      reasoning: 0.74,
      dataAnalysis: 0.68
    },
    costPer1kTokens: { input: 0.0002, output: 0.0006 },
    tokenLimit: 32000,
    responseTime: 'fast',
    priority: 1
  },
  // Lokale Modelle (für extrem kostensensitive Aufgaben)
  'local-llama3': {
    provider: AI_PROVIDERS.OLLAMA,
    capabilities: {
      creativeWriting: 0.65,
      technicalContent: 0.70,
      communication: 0.60,
      reasoning: 0.62,
      dataAnalysis: 0.55
    },
    costPer1kTokens: { input: 0.0, output: 0.0 },
    tokenLimit: 8000,
    responseTime: 'slow',
    priority: 0
  }
};

// Aufgabentypen mit gewichteten Anforderungen
const TASK_PROFILES = {
  JOB_FILTERING: {
    name: 'Initiale Job-Filterung',
    description: 'Schnelles Scannen und Filtern von Job-Ausschreibungen',
    requirements: {
      creativeWriting: 0.1,
      technicalContent: 0.6,
      communication: 0.2,
      reasoning: 0.7,
      dataAnalysis: 0.5
    },
    minAcceptableScore: 0.6,
    prioritizeCost: true,
    prioritizeSpeed: true,
    qualityThreshold: 0.65 // Akzeptierbare Qualität
  },
  PROPOSAL_GENERATION: {
    name: 'Erstellen von Angeboten',
    description: 'Personalisierte, überzeugende Angebote generieren',
    requirements: {
      creativeWriting: 0.9,
      technicalContent: 0.7,
      communication: 0.9,
      reasoning: 0.7,
      dataAnalysis: 0.3
    },
    minAcceptableScore: 0.8,
    prioritizeCost: false,
    prioritizeSpeed: false,
    qualityThreshold: 0.85 // Hohe Qualität erforderlich
  },
  CLIENT_COMMUNICATION: {
    name: 'Kunden-Kommunikation',
    description: 'Professionelle E-Mails und Nachrichten verfassen',
    requirements: {
      creativeWriting: 0.6,
      technicalContent: 0.4,
      communication: 0.9,
      reasoning: 0.7,
      dataAnalysis: 0.2
    },
    minAcceptableScore: 0.75,
    prioritizeCost: false,
    prioritizeSpeed: true,
    qualityThreshold: 0.8
  },
  PROJECT_PLANNING: {
    name: 'Projektplanung',
    description: 'Zeitpläne, Meilensteine und Ressourcenplanung',
    requirements: {
      creativeWriting: 0.3,
      technicalContent: 0.7,
      communication: 0.6,
      reasoning: 0.9,
      dataAnalysis: 0.8
    },
    minAcceptableScore: 0.75,
    prioritizeCost: false,
    prioritizeSpeed: false,
    qualityThreshold: 0.75
  },
  COST_OPTIMIZATION: {
    name: 'Kostenoptimierung',
    description: 'Analysen und Vorschläge zur Budgetoptimierung',
    requirements: {
      creativeWriting: 0.2,
      technicalContent: 0.6,
      communication: 0.5,
      reasoning: 0.8,
      dataAnalysis: 0.9
    },
    minAcceptableScore: 0.7,
    prioritizeCost: true,
    prioritizeSpeed: false,
    qualityThreshold: 0.7
  }
};

/**
 * LLM Router Klasse - Wählt das optimale Modell für eine bestimmte Aufgabe
 */
class LLMRouter {
  constructor() {
    this.models = AI_MODELS;
    this.taskProfiles = TASK_PROFILES;
    this.usageStats = {}; // Speichert Nutzungsstatistiken
    this.budgetTracking = {
      monthly: {
        limit: 300.00, // Standard-Monatslimit in USD
        used: 0.00,
        lastReset: new Date().toISOString()
      },
      daily: {
        limit: 20.00, // Standard-Tageslimit in USD
        used: 0.00,
        lastReset: new Date().toISOString()
      }
    };
    this.performanceTracking = {}; // Für A/B Tests und Modellevaluierung
    
    // Initialisieren bei der Erstellung
    this.init();
  }
  
  /**
   * Initialisiert den Router und lädt die Konfiguration
   */
  async init() {
    try {
      // Lade Budgetkonfiguration und Modellstatistiken aus der Datenbank
      const { data: configData, error: configError } = await supabase
        .from('ai_configuration')
        .select('*')
        .eq('type', 'budget_config')
        .single();
      
      if (!configError && configData) {
        this.budgetTracking = {
          ...this.budgetTracking,
          monthly: {
            ...this.budgetTracking.monthly,
            limit: configData.settings.monthly_limit || this.budgetTracking.monthly.limit,
            used: configData.settings.monthly_used || 0.00,
            lastReset: configData.settings.monthly_last_reset || new Date().toISOString()
          },
          daily: {
            ...this.budgetTracking.daily,
            limit: configData.settings.daily_limit || this.budgetTracking.daily.limit,
            used: configData.settings.daily_used || 0.00,
            lastReset: configData.settings.daily_last_reset || new Date().toISOString()
          }
        };
      }
      
      // Lade Modellleistungsmetriken
      const { data: modelStats, error: statsError } = await supabase
        .from('ai_model_stats')
        .select('*');
        
      if (!statsError && modelStats) {
        // Aktualisiere Modellbewertungen basierend auf gemessener Leistung
        modelStats.forEach(stat => {
          if (this.models[stat.model_id]) {
            // Dynamische Anpassung der Modellbewertungen basierend auf tatsächlicher Leistung
            this.updateModelStats(stat.model_id, stat.performance_metrics);
          }
        });
      }
      
      // Tägliches Budget-Reset überprüfen
      this.checkAndResetBudgets();
      
      console.log('LLM Router erfolgreich initialisiert');
    } catch (error) {
      console.error('Fehler bei LLM Router Initialisierung:', error);
    }
  }
  
  /**
   * Überprüft und setzt Budgets zurück, wenn nötig
   */
  checkAndResetBudgets() {
    const now = new Date();
    
    // Überprüfe tägliches Reset
    const lastDailyReset = new Date(this.budgetTracking.daily.lastReset);
    if (now.getDate() !== lastDailyReset.getDate() || 
        now.getMonth() !== lastDailyReset.getMonth() || 
        now.getFullYear() !== lastDailyReset.getFullYear()) {
      this.budgetTracking.daily.used = 0.00;
      this.budgetTracking.daily.lastReset = now.toISOString();
      this.saveBudgetConfig();
    }
    
    // Überprüfe monatliches Reset
    const lastMonthlyReset = new Date(this.budgetTracking.monthly.lastReset);
    if (now.getMonth() !== lastMonthlyReset.getMonth() || 
        now.getFullYear() !== lastMonthlyReset.getFullYear()) {
      this.budgetTracking.monthly.used = 0.00;
      this.budgetTracking.monthly.lastReset = now.toISOString();
      this.saveBudgetConfig();
    }
  }
  
  /**
   * Speichert Budgetkonfiguration in der Datenbank
   */
  async saveBudgetConfig() {
    try {
      const { error } = await supabase
        .from('ai_configuration')
        .upsert({
          type: 'budget_config',
          settings: {
            monthly_limit: this.budgetTracking.monthly.limit,
            monthly_used: this.budgetTracking.monthly.used,
            monthly_last_reset: this.budgetTracking.monthly.lastReset,
            daily_limit: this.budgetTracking.daily.limit,
            daily_used: this.budgetTracking.daily.used,
            daily_last_reset: this.budgetTracking.daily.lastReset
          },
          updated_at: new Date().toISOString()
        });
        
      if (error) throw error;
    } catch (error) {
      console.error('Fehler beim Speichern der Budgetkonfiguration:', error);
    }
  }
  
  /**
   * Aktualisiert die Statistiken eines Modells basierend auf gemessenen Daten
   */
  updateModelStats(modelId, metrics) {
    if (!this.models[modelId]) return;
    
    // Fließende Anpassung der Modellfähigkeiten basierend auf gemessener Leistung
    if (metrics.success_rate && metrics.total_requests > 10) {
      const adaptationRate = 0.05; // 5% Anpassung pro Update
      
      // Für jede Fähigkeit anpassen
      Object.keys(this.models[modelId].capabilities).forEach(capability => {
        if (metrics[capability]) {
          const currentValue = this.models[modelId].capabilities[capability];
          const measuredValue = metrics[capability];
          
          // Gewichtete Anpassung
          this.models[modelId].capabilities[capability] = 
            currentValue * (1 - adaptationRate) + measuredValue * adaptationRate;
        }
      });
    }
  }
  
  /**
   * Berechnet den Eignungswert eines Modells für eine bestimmte Aufgabe
   */
  calculateModelFitness(model, taskProfile) {
    // Gewichtete Summe der Fähigkeiten basierend auf Aufgabenanforderungen
    let capabilityScore = 0;
    let totalWeight = 0;
    
    Object.keys(taskProfile.requirements).forEach(req => {
      const requirement = taskProfile.requirements[req];
      const capability = model.capabilities[req] || 0;
      
      capabilityScore += capability * requirement;
      totalWeight += requirement;
    });
    
    const normalizedCapabilityScore = totalWeight > 0 ? capabilityScore / totalWeight : 0;
    
    // Kosten- und Geschwindigkeitsfaktoren
    const costFactor = taskProfile.prioritizeCost ? 
      Math.max(0.5, 1 - ((model.costPer1kTokens.output * 3) / 0.1)) : 1.0;
      
    const speedFactor = taskProfile.prioritizeSpeed ?
      (model.responseTime === 'fast' ? 1.2 : 
       model.responseTime === 'medium' ? 1.0 : 0.8) : 1.0;
      
    // Gewichteter Gesamtwert
    return normalizedCapabilityScore * costFactor * speedFactor;
  }
  
  /**
   * Wählt das beste Modell für eine gegebene Aufgabe unter Berücksichtigung 
   * von Budget, Qualitätsanforderungen und anderen Constraints
   */
  selectBestModel(taskType, tokenEstimate = { input: 500, output: 1500 }, forceHighQuality = false) {
    const taskProfile = this.taskProfiles[taskType];
    
    if (!taskProfile) {
      throw new AppError(
        `Unbekannter Aufgabentyp: ${taskType}`,
        ErrorTypes.VALIDATION_ERROR
      );
    }
    
    // Budget-Check
    const remainingDailyBudget = this.budgetTracking.daily.limit - this.budgetTracking.daily.used;
    const remainingMonthlyBudget = this.budgetTracking.monthly.limit - this.budgetTracking.monthly.used;
    const availableBudget = Math.min(remainingDailyBudget, remainingMonthlyBudget);
    
    // Berechne geschätzte Kosten für die Aufgabe
    const estimatedCostByModel = {};
    Object.keys(this.models).forEach(modelId => {
      const model = this.models[modelId];
      estimatedCostByModel[modelId] = 
        (tokenEstimate.input * model.costPer1kTokens.input / 1000) +
        (tokenEstimate.output * model.costPer1kTokens.output / 1000);
    });
    
    // Qualitätsschwelle basierend auf Anforderungen
    const qualityThreshold = forceHighQuality ? 
      0.9 : taskProfile.qualityThreshold;
    
    // Bewerte alle Modelle
    let candidateModels = [];
    
    Object.keys(this.models).forEach(modelId => {
      const model = this.models[modelId];
      const fitness = this.calculateModelFitness(model, taskProfile);
      
      // Überprüfe Budget und Qualitätsschwelle
      if (fitness >= qualityThreshold && estimatedCostByModel[modelId] <= availableBudget) {
        candidateModels.push({
          id: modelId,
          fitness,
          estimatedCost: estimatedCostByModel[modelId],
          model
        });
      }
    });
    
    // Sortiere nach Fitness-Wert
    candidateModels.sort((a, b) => b.fitness - a.fitness);
    
    // Wenn keine Modelle verfügbar sind, versuche mit reduzierter Qualitätsschwelle
    if (candidateModels.length === 0 && !forceHighQuality) {
      return this.selectBestModel(taskType, tokenEstimate, false, taskProfile.minAcceptableScore);
    }
    
    // Wenn Budget sehr knapp ist, wähle das günstigste Modell über der Mindestschwelle
    if (availableBudget < 1.0 && candidateModels.length > 0) {
      candidateModels.sort((a, b) => a.estimatedCost - b.estimatedCost);
      
      // Stelle sicher, dass das Modell die Mindestanforderungen erfüllt
      const cheapestViableModel = candidateModels.find(
        candidate => this.calculateModelFitness(candidate.model, taskProfile) >= taskProfile.minAcceptableScore
      );
      
      if (cheapestViableModel) {
        return {
          modelId: cheapestViableModel.id,
          provider: cheapestViableModel.model.provider,
          estimatedCost: cheapestViableModel.estimatedCost,
          fitness: cheapestViableModel.fitness,
          tokenLimit: cheapestViableModel.model.tokenLimit
        };
      }
    }
    
    // Normalerweise das beste Modell zurückgeben
    if (candidateModels.length > 0) {
      const bestModel = candidateModels[0];
      return {
        modelId: bestModel.id,
        provider: bestModel.model.provider,
        estimatedCost: bestModel.estimatedCost,
        fitness: bestModel.fitness,
        tokenLimit: bestModel.model.tokenLimit
      };
    }
    
    // Fallback auf lokales Modell, wenn verfügbar und Budget wirklich knapp ist
    if ('local-llama3' in this.models) {
      return {
        modelId: 'local-llama3',
        provider: AI_PROVIDERS.OLLAMA,
        estimatedCost: 0,
        fitness: this.calculateModelFitness(this.models['local-llama3'], taskProfile),
        tokenLimit: this.models['local-llama3'].tokenLimit
      };
    }
    
    // Wenn alles fehlschlägt, wirf einen Fehler
    throw new AppError(
      'Kein passendes Modell für diese Aufgabe gefunden. Budgetlimit überschritten oder Qualitätsanforderungen zu hoch.',
      ErrorTypes.VALIDATION_ERROR
    );
  }
  
  /**
   * Verfolge die tatsächliche Verwendung von Token und aktualisiere Budgets
   */
  async trackUsage(modelId, tokensUsed, actualCost) {
    try {
      // Budgettracking aktualisieren
      this.budgetTracking.daily.used += actualCost;
      this.budgetTracking.monthly.used += actualCost;
      
      // Nutzungsstatistiken aktualisieren
      if (!this.usageStats[modelId]) {
        this.usageStats[modelId] = {
          totalCalls: 0,
          totalTokens: 0,
          totalCost: 0
        };
      }
      
      this.usageStats[modelId].totalCalls += 1;
      this.usageStats[modelId].totalTokens += tokensUsed.input + tokensUsed.output;
      this.usageStats[modelId].totalCost += actualCost;
      
      // Speichere aktualisierte Daten in der Datenbank
      await Promise.all([
        // Budget speichern
        this.saveBudgetConfig(),
        
        // Nutzungsdaten speichern
        supabase.from('ai_usage_logs').insert({
          model_id: modelId,
          tokens_input: tokensUsed.input,
          tokens_output: tokensUsed.output,
          cost: actualCost,
          timestamp: new Date().toISOString()
        })
      ]);
      
      return true;
    } catch (error) {
      console.error('Fehler beim Tracking der KI-Nutzung:', error);
      return false;
    }
  }
  
  /**
   * Aktuelle Budgetstatus abrufen
   */
  getBudgetStatus() {
    this.checkAndResetBudgets(); // Stelle sicher, dass Budgets aktuell sind
    
    return {
      daily: {
        limit: this.budgetTracking.daily.limit,
        used: this.budgetTracking.daily.used,
        remaining: this.budgetTracking.daily.limit - this.budgetTracking.daily.used,
        percentUsed: (this.budgetTracking.daily.used / this.budgetTracking.daily.limit) * 100
      },
      monthly: {
        limit: this.budgetTracking.monthly.limit,
        used: this.budgetTracking.monthly.used,
        remaining: this.budgetTracking.monthly.limit - this.budgetTracking.monthly.used,
        percentUsed: (this.budgetTracking.monthly.used / this.budgetTracking.monthly.limit) * 100
      },
      lastUpdate: new Date().toISOString()
    };
  }
  
  /**
   * Gibt Nutzungsstatistiken für alle Modelle zurück
   */
  getUsageStatistics() {
    return this.usageStats;
  }
  
  /**
   * Aktualisiert Budgetlimits
   */
  async updateBudgetLimits(dailyLimit, monthlyLimit) {
    try {
      this.budgetTracking.daily.limit = dailyLimit;
      this.budgetTracking.monthly.limit = monthlyLimit;
      await this.saveBudgetConfig();
      return true;
    } catch (error) {
      console.error('Fehler beim Aktualisieren der Budgetlimits:', error);
      return false;
    }
  }
}

// Singleton-Instanz
let routerInstance = null;

/**
 * Gibt die Singleton-Instanz des LLM Routers zurück
 */
export const getLLMRouter = () => {
  if (!routerInstance) {
    routerInstance = new LLMRouter();
  }
  return routerInstance;
};

/**
 * Exportiere auch die Konstanten für Verwendung in anderen Dateien
 */
export { AI_PROVIDERS, TASK_PROFILES };
