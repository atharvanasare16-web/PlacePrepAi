// ── PlacePrep AI — Claude API Service Layer ─────────────────────────────────
// Central AI client. Every AI feature in the app calls through this module.
// API key is read from localStorage on every request.

import { topicById } from '../data/topics';

// ── Constants ───────────────────────────────────────────────────────────────
const STORAGE_KEY = 'placeprep_api_key';
const API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-20250514';

// ═══════════════════════════════════════════════════════════════════════════════
// KEY MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════════

/** @returns {string|null} The stored Anthropic API key. */
export function getApiKey() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

/** @param {string} key - Anthropic API key to persist. */
export function setApiKey(key) {
  try {
    if (key && key.trim()) {
      localStorage.setItem(STORAGE_KEY, key.trim());
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // localStorage unavailable
  }
}

/** Remove the stored API key. */
export function clearApiKey() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // localStorage unavailable
  }
}

/** @returns {boolean} Whether a non-empty API key is stored. */
export function hasApiKey() {
  const key = getApiKey();
  return Boolean(key && key.length > 0);
}

// ═══════════════════════════════════════════════════════════════════════════════
// ERROR HANDLING
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Convert a thrown error into a user-friendly message.
 * @param {Error} err
 * @returns {string}
 */
export function friendlyError(err) {
  if (!err) return 'An unknown error occurred.';
  switch (err.message) {
    case 'NO_API_KEY':
      return '🔑 No API key found. Paste your Anthropic API key in the sidebar (🔑 API Key section).';
    case 'INVALID_KEY':
      return '🔐 Invalid API key. Please check your Anthropic API key and try again.';
    case 'RATE_LIMIT':
      return '⏳ Rate limit exceeded. Please wait a moment and try again.';
    default:
      return `❌ ${err.message || 'An unexpected error occurred. Please try again.'}`;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// CORE API CALLER
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Call the Anthropic Claude API.
 *
 * @param {Array<{role: string, content: string}>} messages
 * @param {string} systemPrompt
 * @param {number} [maxTokens=1200]
 * @returns {Promise<string>} The assistant's text response.
 * @throws {Error} Named errors: NO_API_KEY, INVALID_KEY, RATE_LIMIT, or generic message.
 */
export async function callClaude(messages, systemPrompt, maxTokens = 1200) {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('NO_API_KEY');
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages,
    }),
  });

  if (!response.ok) {
    if (response.status === 401) throw new Error('INVALID_KEY');
    if (response.status === 429) throw new Error('RATE_LIMIT');
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData?.error?.message || `API request failed (${response.status})`,
    );
  }

  const data = await response.json();
  const textBlock = data?.content?.find((block) => block.type === 'text');
  if (!textBlock?.text) {
    throw new Error('No response received from AI.');
  }
  return textBlock.text;
}

/** Alias — existing components may import callAI instead of callClaude. */
export const callAI = callClaude;

// ═══════════════════════════════════════════════════════════════════════════════
// SPECIALIZED CALLERS — one per app section
// ═══════════════════════════════════════════════════════════════════════════════

// ── 1. Mock Interview ───────────────────────────────────────────────────────

/**
 * Continue or start a mock interview conversation.
 *
 * @param {object}   role      – role profile object
 * @param {string}   company   – target company name
 * @param {string}   round     – interview round label
 * @param {Array<{role:string, content:string}>} messages – conversation so far
 * @returns {Promise<string>}
 */
export async function callMockInterview(role, company, round, messages) {
  const topicLabels = role.topicIds
    .map((id) => topicById(id)?.label)
    .filter(Boolean)
    .join(', ');

  const systemPrompt = `You are a senior interviewer at ${company} conducting a "${round}" interview round for a ${role.label} position.

ROLE CONTEXT:
- Focus areas: ${topicLabels}
- Must-know concepts to probe: ${role.mustKnow.join('; ')}

INTERVIEWER RULES:
1. Ask ONE focused, specific question at a time.
2. After each candidate answer, give exactly 1 line of feedback:
   ✓ (correct & complete) | ⚠ (partially correct — specify what's missing) | ✗ (incorrect — state why)
3. Then immediately ask the NEXT question — ramp difficulty progressively.
4. Cover breadth across the role's focus areas, don't stay on one topic too long.
5. After 5-6 exchanges, if the candidate asks or says "feedback", provide a comprehensive performance summary:
   - Overall Score: X/10
   - Strongest areas
   - Critical gaps
   - Top 3 specific things to study
6. Be rigorous but encouraging. Use real-world scenarios when possible.
7. Never reveal the answer before the candidate attempts — only after their response.`;

  return callClaude(messages, systemPrompt);
}

// ── 2. Generate Question ────────────────────────────────────────────────────

/**
 * Generate a single practice question.
 *
 * @param {object} role       – role profile
 * @param {object} topic      – topic object (from TOPICS)
 * @param {string} difficulty – 'Easy' | 'Medium' | 'Hard'
 * @param {string} qtype      – 'Conceptual' | 'Mathematical' | 'Code-based' | 'Scenario'
 * @returns {Promise<string>}
 */
export async function callGenerateQuestion(role, topic, difficulty, qtype) {
  const systemPrompt = `You are a placement interview question designer for ${role.label} roles.
Generate precise, realistic interview questions that are actually asked at companies like ${role.companies.slice(0, 3).join(', ')}.
Always produce ORIGINAL questions — never repeat generic textbook problems.`;

  const typeInstructions = {
    Conceptual: 'Ask a conceptual question that tests deep understanding, not just memorization. Require the candidate to explain "why" or compare/contrast.',
    Mathematical: 'Create a concrete numerical problem with specific values to compute. Show all given data clearly. The candidate must derive or calculate a specific answer.',
    'Code-based': 'Include a Python code snippet (10-20 lines) with TODO comments marking what the candidate must complete. Include type hints and a docstring.',
    Scenario: 'Present a realistic business or engineering scenario that the candidate might face on the job. Ask them to diagnose, design, or decide.',
  };

  const content = `Generate a single ${difficulty} difficulty ${qtype} question on "${topic.label}" (subtopics: ${topic.sub}).
This is for a ${role.label} placement interview.

${typeInstructions[qtype] || typeInstructions.Conceptual}

FORMAT YOUR RESPONSE EXACTLY AS:

QUESTION:
[Your question here]

${qtype === 'Code-based' ? 'CODE:\n```python\n[Starter code with TODOs]\n```\n' : ''}HINT: [One subtle hint — 12 words maximum]`;

  return callClaude(
    [{ role: 'user', content }],
    systemPrompt,
  );
}

// ── 3. Evaluate Answer ──────────────────────────────────────────────────────

/**
 * Evaluate a candidate's answer to a practice question.
 *
 * @param {object} role     – role profile
 * @param {object} topic    – topic object
 * @param {string} question – the question text
 * @param {string} answer   – candidate's answer
 * @returns {Promise<string>}
 */
export async function callEvaluateAnswer(role, topic, question, answer) {
  const systemPrompt = `You are an expert technical evaluator for ${role.label} placement interviews.
Be precise, technical, and constructive. Always show the correct approach before critiquing.`;

  const content = `Topic: ${topic.label}
Role: ${role.label}

QUESTION:
${question}

CANDIDATE'S ANSWER:
${answer}

Evaluate thoroughly using this EXACT structure:

MODEL ANSWER:
[The complete, correct answer with explanation]

SCORE: X/10

STRENGTHS:
- [What the candidate got right — be specific]

GAPS:
- [What was wrong, incomplete, or could be improved — be specific]

FOLLOW-UP QUESTION:
[One harder follow-up question to probe deeper understanding]`;

  return callClaude(
    [{ role: 'user', content }],
    systemPrompt,
  );
}

// ── 4. Code Challenge ───────────────────────────────────────────────────────

/**
 * Generate a coding challenge.
 *
 * @param {object} role    – role profile
 * @param {string} library – library/framework label (e.g. "PyTorch", "LangChain")
 * @returns {Promise<string>}
 */
export async function callCodeChallenge(role, library) {
  const systemPrompt = `You are a coding challenge designer for ${role.label} placement interviews.
Create practical, real-world problems that test actual job skills — not LeetCode puzzles.
All code must be Python.`;

  const content = `Create a practical ${library} coding challenge for a ${role.label} interview.

FORMAT YOUR RESPONSE EXACTLY AS:

## PROBLEM
[3-5 line problem statement describing what to build/implement]

## STARTER CODE
\`\`\`python
# ${library} Challenge — ${role.label}
# Complete the TODOs below

[15-30 line Python skeleton with:
 - Type hints on all function signatures
 - Docstring explaining inputs/outputs
 - TODO comments marking exactly what to implement
 - Any necessary imports
 - A simple main/test block at the bottom]
\`\`\`

## EXAMPLE
Input: [specific example input]
Expected Output: [specific expected output]

## CONSTRAINTS
- [2-3 constraints or requirements]
- Time complexity target (if applicable)`;

  return callClaude(
    [{ role: 'user', content }],
    systemPrompt,
  );
}

// ── 5. Review Code ──────────────────────────────────────────────────────────

/**
 * Review candidate's code solution.
 *
 * @param {object} role      – role profile
 * @param {string} challenge – the challenge description
 * @param {string} code      – candidate's Python code
 * @returns {Promise<string>}
 */
export async function callReviewCode(role, challenge, code) {
  const systemPrompt = `You are an expert ${role.label} code reviewer at a top tech company.
Review code like you would in a real interview debrief — be precise and technical.`;

  const content = `CHALLENGE:
${challenge}

CANDIDATE'S CODE:
\`\`\`python
${code}
\`\`\`

Review using this EXACT structure:

CORRECTNESS:
[Does it solve the problem? Any logical errors?]

CODE QUALITY:
[Pythonic style, naming, structure, type hints, docstrings]

EFFICIENCY:
[Time/space complexity, unnecessary operations, optimization opportunities]

BUGS & EDGE CASES:
[Specific bugs found, edge cases not handled, potential runtime errors]

SCORE: X/10

IMPROVED VERSION:
\`\`\`python
[Your improved version of their code — complete and runnable]
\`\`\``;

  return callClaude(
    [{ role: 'user', content }],
    systemPrompt,
    1600,
  );
}

// ── 6. Explain Concept ──────────────────────────────────────────────────────

/**
 * Explain a concept at the requested depth, with optional follow-up context.
 *
 * @param {object}   role                – role profile
 * @param {string}   concept             – concept to explain
 * @param {string}   depth               – '5-year-old' | 'Interview-ready' | 'Research-level'
 * @param {Array<{role:string, content:string}>} [conversationHistory=[]]
 * @returns {Promise<string>}
 */
export async function callExplainConcept(role, concept, depth, conversationHistory = []) {
  const depthInstructions = {
    '5-year-old': `Explain like I'm 5 years old. Use simple everyday analogies. No math, no code. 
Make it memorable and fun. Use emojis to illustrate concepts.`,
    'Interview-ready': `Explain at interview depth for a ${role.label} role. Include:
- Mathematical formulas where relevant (use clear notation)
- A Python code snippet demonstrating the concept
- Common interview questions about this topic
- What interviewers are actually testing when they ask about this`,
    'Research-level': `Explain at research/graduate depth. Include:
- Formal mathematical definitions and derivations
- Proofs or proof sketches where applicable
- Connections to related concepts and recent papers
- Python implementation showing internals (not just API calls)
- Open problems or active research directions`,
  };

  const systemPrompt = `You are an expert educator preparing candidates for ${role.label} interviews.
Your explanations bridge intuition with technical rigor.
Always structure your responses clearly with the section headers provided.`;

  const messages = conversationHistory.length > 0
    ? [...conversationHistory]
    : [
        {
          role: 'user',
          content: `Explain "${concept}" for a ${role.label} candidate.

Depth level: ${depth}
${depthInstructions[depth] || depthInstructions['Interview-ready']}

Structure your response with these sections:

🎯 INTUITION
[Core idea in 2-3 sentences with an analogy]

📐 TECHNICAL
[Detailed technical explanation at the requested depth]

💻 CODE
[Python code snippet — skip for 5-year-old depth]

🎤 INTERVIEW ANGLE
[How this topic appears in ${role.label} interviews — common questions, traps, follow-ups]

🌍 REAL-WORLD USE
[Practical application in a ${role.label}'s daily work]`,
        },
      ];

  return callClaude(messages, systemPrompt);
}

// ── 7. Resume Review ────────────────────────────────────────────────────────

/**
 * Analyze a resume for the target role.
 *
 * @param {object} role   – role profile
 * @param {string} resume – resume text (pasted by user)
 * @returns {Promise<string>}
 */
export async function callResumeReview(role, resume) {
  const systemPrompt = `You are an expert technical recruiter and hiring manager specializing in ${role.label} roles at top tech companies (${role.companies.join(', ')}).
Give precise, actionable resume feedback — not generic advice. Reference specific lines from the resume.`;

  const content = `TARGET ROLE: ${role.label}
MUST-HAVE SKILLS: ${role.mustKnow.slice(0, 5).join('; ')}
TYPICAL INTERVIEW ROUNDS: ${role.rounds.join(' → ')}

RESUME:
---
${resume}
---

Analyze using this EXACT structure:

OVERALL SCORE: X/10
[One-sentence summary of the resume's competitiveness for ${role.label} roles]

TOP 3 STRENGTHS:
1. [Specific strength with reference to resume content]
2. [Specific strength]
3. [Specific strength]

TOP 3 CRITICAL GAPS:
1. [Specific gap relative to ${role.label} requirements]
2. [Specific gap]
3. [Specific gap]

MISSING KEYWORDS (add these to pass ATS):
1. [keyword] — 2. [keyword] — 3. [keyword] — 4. [keyword] — 5. [keyword]
6. [keyword] — 7. [keyword] — 8. [keyword] — 9. [keyword] — 10. [keyword]

BEST PROJECT TO LEAD WITH:
[Which project to highlight and a rewritten description that would impress a ${role.label} interviewer]

WEAKEST BULLET — REWRITE:
Original: "[exact bullet from resume]"
Improved: "[rewritten version with metrics, impact, and role-relevant keywords]"`;

  return callClaude(
    [{ role: 'user', content }],
    systemPrompt,
    1600,
  );
}

// ── 8. Study Roadmap ────────────────────────────────────────────────────────

/**
 * Generate a 10-week study roadmap.
 *
 * @param {object} role  – role profile
 * @param {string} level – 'Beginner (CS background)' | 'Intermediate (some experience)' |
 *                         'Advanced (1+ years)' | 'Career Switcher'
 * @returns {Promise<string>}
 */
export async function callStudyRoadmap(role, level) {
  const topicLabels = role.topicIds
    .map((id) => topicById(id)?.label)
    .filter(Boolean)
    .join(', ');

  const systemPrompt = `You are a career coach specializing in placement preparation for ${role.label} roles at companies like ${role.companies.join(', ')}.
Create detailed, week-by-week study plans that are realistic and actionable.`;

  const content = `Create a 10-week placement preparation roadmap.

STUDENT LEVEL: ${level}
TARGET ROLE: ${role.label}
CORE TOPICS: ${topicLabels}
MUST-KNOW CONCEPTS: ${role.mustKnow.join('; ')}
INTERVIEW ROUNDS: ${role.rounds.join(' → ')}
TOOLS/LIBRARIES TO LEARN: ${role.codeLibs.join(', ')}

For EACH week, use this format:

📅 WEEK N — [Theme]
📚 Topics: [4-5 specific topics to study]
🛠 Tools: [Libraries, frameworks, or platforms to practice with]
💡 Practice: [2-3 concrete exercises, projects, or resources]
🎤 Interview Prep: [Specific question type to practice this week]

---

After Week 10, add these final sections:

⏱ DAILY SCHEDULE
[Hour-by-hour breakdown for a typical study day]

🚀 TOP 5 PORTFOLIO PROJECTS
[5 project ideas specific to ${role.label} — with tech stack and what it demonstrates]

💎 5 NON-OBVIOUS TIPS
[Lesser-known interview tips specific to ${role.label} roles that most candidates miss]`;

  return callClaude(
    [{ role: 'user', content }],
    systemPrompt,
    2000,
  );
}
