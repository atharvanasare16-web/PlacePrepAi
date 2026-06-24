const STORAGE_KEY = 'placeprep_api_key';

/**
 * Get the stored Anthropic API key from localStorage.
 * @returns {string|null}
 */
export function getApiKey() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

/**
 * Save an Anthropic API key to localStorage.
 * @param {string} key
 */
export function setApiKey(key) {
  try {
    if (key) {
      localStorage.setItem(STORAGE_KEY, key.trim());
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // localStorage may be unavailable in some contexts
  }
}

/**
 * Check whether an API key is configured.
 * @returns {boolean}
 */
export function hasApiKey() {
  const key = getApiKey();
  return Boolean(key && key.length > 0);
}

/**
 * Call the Anthropic Claude API with the given messages and system prompt.
 *
 * @param {Array<{role: string, content: string}>} messages - Conversation messages
 * @param {string} systemPrompt - System-level instruction
 * @param {number} [maxTokens=1200] - Maximum tokens in the response
 * @returns {Promise<string>} The assistant's text response
 */
export async function callAI(messages, systemPrompt, maxTokens = 1200) {
  const apiKey = getApiKey();

  if (!apiKey) {
    throw new Error('API key not configured');
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: maxTokens,
        system: systemPrompt,
        messages,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData?.error?.message || `API request failed with status ${response.status}`;
      return `Error: ${errorMessage}`;
    }

    const data = await response.json();

    // Extract text from the first text content block
    const textBlock = data?.content?.find((block) => block.type === 'text');
    return textBlock?.text ?? 'No response received from AI.';
  } catch (error) {
    return `Error: ${error.message || 'An unexpected error occurred while contacting the AI.'}`;
  }
}
