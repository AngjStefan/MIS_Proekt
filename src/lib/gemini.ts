import { Post } from '@/types/post';

export interface DuplicateCheckResult {
  isDuplicate: boolean;
  duplicateId: string | null;
}

export async function checkDuplicateReport(
  newReport: { title: string; description: string },
  nearbyReports: Post[]
): Promise<DuplicateCheckResult> {
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_GEMINI_API_KEY;
  
  if (!apiKey) {
    console.warn('No Google Gemini API key found, skipping duplicate check.');
    return { isDuplicate: false, duplicateId: null };
  }

  if (nearbyReports.length === 0) {
    return { isDuplicate: false, duplicateId: null };
  }

  const prompt = `You are a duplicate detection system. 
You will receive a new issue report and a list of existing nearby reports. 
Return ONLY a valid JSON object in the format: { "isDuplicate": boolean, "duplicateId": "string" | null }
Set 'isDuplicate' to true if the new report describes the same real-world issue as one of the existing ones.
If true, set 'duplicateId' to the ID of the matched existing report.
If false, set 'duplicateId' to null.

New Report:
Title: "${newReport.title}"
Description: "${newReport.description}"

Existing Nearby Reports:
${nearbyReports.map(r => `- ID: ${r.id} | Title: "${r.title}" | Description: "${r.description}"`).join('\n')}
`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          responseMimeType: "application/json",
        }
      })
    });

    if (!response.ok) {
      console.warn('Gemini API error during duplicate check:', response.statusText);
      return { isDuplicate: false, duplicateId: null };
    }

    const data = await response.json();
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!textResponse) {
      return { isDuplicate: false, duplicateId: null };
    }

    const parsed = JSON.parse(textResponse);
    return {
      isDuplicate: !!parsed.isDuplicate,
      duplicateId: parsed.duplicateId || null
    };

  } catch (error) {
    console.warn('Failed to check for duplicate report:', error);
    return { isDuplicate: false, duplicateId: null };
  }
}
