import { ElevenLabsClient, play } from '@elevenlabs/elevenlabs-js';

const Api_key="sk_6556d6883773ac157127ca78673e95ac34262a3756fdccba"

const elevenlabs = new ElevenLabsClient(Api_key);
const audio = await elevenlabs.textToSpeech.convert('JBFqnCBsd6RMkjVDRZzb', {
  text: 'The first move is what sets everything in motion.',
  modelId: 'eleven_multilingual_v2',
  outputFormat: 'mp3_44100_128',
});

await play(audio);

