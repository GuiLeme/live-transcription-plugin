import { APIRequestContext } from '@playwright/test';
import { secret, server } from '../parameters';

const PLUGIN_NAME = 'live-transcription-plugin';

export async function resolvePluginUrl(request: APIRequestContext): Promise<string> {
  if (!secret) throw new Error('BBB_SECRET is not set');
  if (!server) throw new Error('BBB_URL is not set');

  const configuredUrl = process.env.LIVE_TRANSCRIPTION_PLUGIN_URL;
  const pluginUrl = configuredUrl
    || `${new URL(server).origin}/plugins/${PLUGIN_NAME}/dist/manifest.json`;
  const response = await request.get(pluginUrl);
  if (!response.ok()) {
    throw new Error(`Plugin manifest returned HTTP ${response.status()}: ${pluginUrl}`);
  }
  await response.json();
  return pluginUrl;
}
