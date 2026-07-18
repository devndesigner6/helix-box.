// Core plugins - these are always loaded and cannot be removed
// Import them to register with the plugin system

import './editor';
import './terminal';
import './ai';
import './browser';

export { EditorPanel } from './editor';
export { TerminalPanel } from './terminal';
export { AIPanel } from './ai';
export { BrowserPanel } from './browser';
