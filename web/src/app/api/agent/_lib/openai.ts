type LLMOptions = {
  system: string;
  user: string;
};

export async function callLLM(options: LLMOptions): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;

  // Fallback if API key not configured
  if (!apiKey) {
    console.warn('[OpenAI] API key not configured, using deterministic fallback');
    return generateFallbackResponse(options);
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: options.system },
          { role: 'user', content: options.user },
        ],
        temperature: 0.3,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'No response generated';
  } catch (error) {
    console.error('[OpenAI] Call failed:', error);
    return generateFallbackResponse(options);
  }
}

function generateFallbackResponse(options: LLMOptions): string {
  // Deterministic fallback based on input patterns
  const userText = options.user.toLowerCase();

  if (userText.includes('pr') && userText.includes('check')) {
    return 'RECOMMENDATION: Review required. Checklist items should be verified. CI checks status should be confirmed before merge.';
  }

  if (userText.includes('changelog')) {
    return 'CHANGELOG: Changes detected. Review commit history for detailed modifications. Verify all changes align with PR objectives.';
  }

  return 'Analysis complete. Manual review recommended. Verify all changes meet project standards and pass required checks.';
}
