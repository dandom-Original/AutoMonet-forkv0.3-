import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiChevronUp, FiCheck, FiX } from 'react-icons/fi';

const AIRecommendations = ({ recommendations = [] }) => {
  const [expandedId, setExpandedId] = useState(null);

  const toggle = (id) => setExpandedId(expandedId === id ? null : id);

  const display = recommendations.length > 0 ? recommendations : [
    {
      id: 1,
      title: 'Skill fokussieren: React Native',
      description: 'Markttrend zeigt steigende Nachfrage. Passt zu Ihrem Profil, könnte Einkommen um 15-20% steigern.',
      confidence: 92,
      impact: 'hoch',
      source: 'Marktanalyse & Profil',
      steps: [
        'React Native Kurs absolvieren',
        'Demo-App erstellen',
        'Profil aktualisieren'
      ]
    },
    {
      id: 2,
      title: 'Angebotsformat optimieren',
      description: 'Mehr Kundenorientierung, ROI-Berechnungen & Case Studies nutzen.',
      confidence: 87,
      impact: 'mittel',
      source: 'Erfolgsanalyse',
      steps: [
        'ROI-Template erstellen',
        'Fallstudien sammeln',
        'Nächste 5 Angebote anpassen'
      ]
    }
  ];

  return (
    <div className="glass-card p-4 space-y-4">
      <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
        KI-Empfehlungen
        <span className="text-xs bg-blue-500/20 text-blue-400 py-1 px-2 rounded-full">Automatisiert</span>
      </h2>

      {display.map(rec => (
        <motion.div key={rec.id} layout className="glass-card p-4 cursor-pointer" onClick={() => toggle(rec.id)}>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{rec.title}</h3>
              <p className="text-gray-400 text-sm mt-1">{rec.description}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${rec.confidence >= 90 ? 'text-glow-green' : rec.confidence >= 75 ? 'text-yellow-400' : 'text-glow-red'}`}>
                {rec.confidence}% sicher
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${rec.impact === 'hoch' ? 'text-glow-green' : rec.impact === 'mittel' ? 'text-yellow-400' : 'text-glow-red'}`}>
                Impact: {rec.impact}
              </span>
              <div className="mt-2">
                {expandedId === rec.id ? <FiChevronUp /> : <FiChevronDown />}
              </div>
            </div>
          </div>

          <AnimatePresence>
            {expandedId === rec.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 border-t border-slate-700 pt-4 space-y-3 overflow-hidden"
              >
                <div>
                  <p className="text-xs text-gray-400 mb-1">Quelle: <span className="text-gray-300">{rec.source}</span></p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Empfohlene Schritte:</p>
                  <ul className="space-y-2">
                    {rec.steps.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-900/30 text-blue-400 flex items-center justify-center">{idx + 1}</span>
                        <span className="text-gray-300">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex gap-2 mt-3">
                  <button className="btn-glass flex-1 flex items-center justify-center gap-1"><FiCheck /> Umsetzen</button>
                  <button className="btn-glass flex-1 flex items-center justify-center gap-1"><FiX /> Ablehnen</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
};

export default AIRecommendations;
