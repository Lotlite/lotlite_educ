import axios from 'axios';
import { WebhookPayload } from '../types';

const WEBHOOK_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;

/**
 * Sends candidate resume details and job configuration to the n8n webhook.
 */
export async function sendResumeToWebhook(
  payload: WebhookPayload
): Promise<any> {
  const response = await axios.post(WEBHOOK_URL, payload, {
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 60000,
  });
  return response.data;
}

