import { Wrench } from 'lucide-react-native';
import * as Crypto from 'expo-crypto';
import { registerPlugin } from '../../registry';
import { ToolsAPI } from '../../gpi';
import ToolsPanel from './Panel';

// Tools plugin API implementation - these can run on device for basic ops
const toolsApi = (): ToolsAPI => ({
  formatJson: async (input: string, indent = 2) => {
    try {
      return JSON.stringify(JSON.parse(input), null, indent);
    } catch {
      throw new Error('Invalid JSON');
    }
  },
  formatXml: async (input: string) => {
    // Basic XML formatting
    let formatted = '';
    let indent = 0;
    const lines = input.replace(/>\s*</g, '>\n<').split('\n');
    for (const line of lines) {
      if (line.match(/^<\/\w/)) indent--;
      formatted += '  '.repeat(indent) + line.trim() + '\n';
      if (line.match(/^<\w[^>]*[^\/]>.*$/)) indent++;
    }
    return formatted.trim();
  },
  validateJson: async (input: string) => {
    try {
      JSON.parse(input);
      return { valid: true };
    } catch (e: any) {
      return { valid: false, error: e.message };
    }
  },
  validateXml: async (input: string) => {
    // Basic XML validation
    const tagStack: string[] = [];
    const tagRegex = /<\/?([a-zA-Z][a-zA-Z0-9]*)[^>]*>/g;
    let match;
    while ((match = tagRegex.exec(input)) !== null) {
      const [fullMatch, tagName] = match;
      if (fullMatch.startsWith('</')) {
        if (tagStack.pop() !== tagName) {
          return { valid: false, error: `Mismatched tag: ${tagName}` };
        }
      } else if (!fullMatch.endsWith('/>')) {
        tagStack.push(tagName);
      }
    }
    if (tagStack.length > 0) {
      return { valid: false, error: `Unclosed tag: ${tagStack[tagStack.length - 1]}` };
    }
    return { valid: true };
  },
  base64Encode: async (input: string) => {
    return btoa(input);
  },
  base64Decode: async (input: string) => {
    return atob(input);
  },
  urlEncode: async (input: string) => {
    return encodeURIComponent(input);
  },
  urlDecode: async (input: string) => {
    return decodeURIComponent(input);
  },
  hash: async (input: string, algorithm: 'md5' | 'sha1' | 'sha256' | 'sha512') => {
    const algoMap = {
      md5: Crypto.CryptoDigestAlgorithm.MD5,
      sha1: Crypto.CryptoDigestAlgorithm.SHA1,
      sha256: Crypto.CryptoDigestAlgorithm.SHA256,
      sha512: Crypto.CryptoDigestAlgorithm.SHA512,
    };
    return Crypto.digestStringAsync(algoMap[algorithm], input);
  },
  stringOps: async (input: string, operation: string) => {
    switch (operation) {
      case 'lowercase': return input.toLowerCase();
      case 'uppercase': return input.toUpperCase();
      case 'capitalize': return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
      case 'reverse': return input.split('').reverse().join('');
      case 'trim': return input.trim();
      case 'slug': return input.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      default: return input;
    }
  },
  unixToDate: async (timestamp: number) => {
    return new Date(timestamp * 1000).toISOString();
  },
  dateToUnix: async (date: string) => {
    return Math.floor(new Date(date).getTime() / 1000);
  },
});

// Register the tools plugin
registerPlugin({
  id: 'tools',
  name: 'Tools',
  type: 'extra',
  icon: Wrench,
  component: ToolsPanel,
  defaultTitle: 'Tools',
  allowMultipleInstances: true,
  api: toolsApi,
});

export { ToolsPanel };
