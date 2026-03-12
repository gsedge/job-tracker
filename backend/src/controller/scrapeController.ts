import { Request, Response } from 'express'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function scrapeJobFromUrl(req: Request, res: Response) {
  const { url } = req.body

  if (!url) return res.status(400).json({ error: 'URL is required' })

  // Validate URL
  try {
    new URL(url)
  } catch {
    return res.status(400).json({ error: 'Invalid URL' })
  }

  // Fetch the page
  let pageText = ''
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    })
    const html = await response.text()

    // Strip HTML tags to get plain text
    pageText = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 8000) // limit to avoid token limits
  } catch {
    return res.status(400).json({ error: 'Could not fetch that URL. The site may block automated requests.' })
  }

  // Ask Claude to extract the fields
  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: `Extract job details from the following job listing text. 
          Only extract fields that are explicitly mentioned — do not guess or infer.
          Return ONLY a JSON object with these fields (omit any field that isn't clearly stated):
          - company (string)
          - position_name (string)
          - location (string)
          - salary (number, annual, in GBP — omit if not stated or not in GBP)

          Job listing text:
          ${pageText}
          
          Return only the JSON object, no explanation.`
        }
      ]
    })

    const raw = message.content[0].type === 'text' ? message.content[0].text : '{}'
    const clean = raw.replace(/```json|```/g, '').trim()
    const extracted = JSON.parse(clean)

    res.json(extracted)
  } catch (err){
    console.error('Error extracting job details:', err)
    res.status(500).json({ error: 'Failed to extract job details from the page.' })
  }
}