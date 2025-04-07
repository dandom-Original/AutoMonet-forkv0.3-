// Mock function to fetch AI recommendations
export const fetchAIRecommendations = async () => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1200));

  // Return mock AI-curated job recommendations
  return [
    {
      id: 'ai-job1',
      title: 'Urgent: React Native Developer for Cross-Platform App',
      description: 'Need an expert React Native dev to fix critical bugs and add features to an existing app. Tight deadline.',
      budget: '$4000-6000',
      source: 'Upwork Priority',
      postedAt: '2024-07-26T08:00:00Z',
      skills: ['React Native', 'JavaScript', 'iOS', 'Android', 'Debugging'],
      matchScore: 96,
      score: 96, // Renamed from matchScore for consistency with component
      reasons: [
        'High budget aligns with your rate.',
        'Strong match for your core React skills.',
        'Urgency often leads to quicker hiring.',
      ],
    },
    {
      id: 'ai-job2',
      title: 'Develop AI-Powered Chatbot using Python & Rasa',
      description: 'Build a customer service chatbot with NLP capabilities. Experience with Rasa or similar frameworks required.',
      budget: '$5000-7500',
      source: 'AI Jobs Board',
      postedAt: '2024-07-25T18:00:00Z',
      skills: ['Python', 'AI', 'Chatbot', 'NLP', 'Rasa'],
      matchScore: 91,
      score: 91,
      reasons: [
        'Leverages your Python and AI expertise.',
        'Growing field with good long-term potential.',
        'Competitive budget.',
      ],
    },
  ];
};

// Mock function to analyze a job
export const analyzeJob = async (job) => {
  // Simulate AI analysis delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Return mock analysis results based on the job
  const score = job.matchScore || Math.floor(Math.random() * 30 + 70); // Use job score or random high score
  const effortHours = Math.floor(Math.random() * 60 + 20); // Random effort between 20-80 hours
  const budgetValue = parseInt(job.budget.split('-')[0].replace(/[^0-9]/g, '')) || 3000;
  const roi = parseFloat((budgetValue / (effortHours * 75) * 2).toFixed(1)); // Simple ROI calc based on $75/hr

  return {
    score: score,
    effort_estimate: `${effortHours}-${effortHours + 20} hours`,
    roi: roi,
    risks: [
      'Scope creep potential if requirements are not well-defined.',
      'Client communication style unknown.',
      score < 80 ? 'Slight skill gap in minor areas.' : 'Competition might be high.',
    ],
    opportunities: [
      'Potential for follow-on work if successful.',
      'Opportunity to showcase expertise in ' + job.skills[0] + '.',
      'Build relationship with a new client (' + job.source + ').',
    ],
    budget_analysis: `Budget (${job.budget}) seems ${budgetValue > 5000 ? 'reasonable' : 'a bit low'} for the estimated effort. Negotiation might be possible.`,
    recommendation: score > 85 ? 'accept' : score > 70 ? 'consider' : 'reject',
  };
};

// Mock function to generate a proposal
export const generateProposal = async (job, userProfile) => {
  // Simulate AI proposal generation delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Return a mock generated proposal
  return `
Subject: Proposal for ${job.title} - Experienced ${userProfile.specialties[0]} Developer

Dear Hiring Manager,

I am writing to express my strong interest in the ${job.title} position posted on ${job.source}. With my extensive experience in ${job.skills.slice(0, 2).join(' and ')}, particularly in ${userProfile.specialties.join(', ')}, I am confident I possess the skills and expertise necessary to successfully deliver this project.

My background includes:
- Developing complex applications using ${job.skills[0]}.
- Proven ability in ${job.skills[1]}.
- Experience relevant to your project description, specifically [mention a specific point from job.description if possible, otherwise use a generic skill].

I have reviewed the project requirements (${job.description.substring(0, 50)}...) and I am particularly excited about [mention something specific or the project goal]. I am available to start immediately and can dedicate sufficient hours to meet your timeline.

My proposed approach involves [briefly mention approach, e.g., agile methodology, clear communication, phased delivery]. I estimate the project can be completed within the specified budget range of ${job.budget}.

Thank you for considering my application. I have attached my portfolio for your review and look forward to discussing how my skills can benefit your project.

Sincerely,
${userProfile.name}
`;
};
