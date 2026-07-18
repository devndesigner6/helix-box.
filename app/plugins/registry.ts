import { PluginDefinition, PluginAPI, PluginType } from './types';

// Plugin registry - stores all registered plugins
class PluginRegistry {
  private plugins: Map<string, PluginDefinition> = new Map();

  // Register a new plugin
  register<T extends PluginAPI>(plugin: PluginDefinition<T>): void {
    this.plugins.set(plugin.id, plugin as PluginDefinition);
  }

  // Unregister a plugin
  unregister(pluginId: string): boolean {
    return this.plugins.delete(pluginId);
  }

  // Get a plugin by ID
  get(pluginId: string): PluginDefinition | undefined {
    return this.plugins.get(pluginId);
  }

  // Check if a plugin exists
  has(pluginId: string): boolean {
    return this.plugins.has(pluginId);
  }

  // Get all plugins
  getAll(): PluginDefinition[] {
    return Array.from(this.plugins.values());
  }

  // Get plugins by type
  getByType(type: PluginType): PluginDefinition[] {
    return this.getAll().filter(p => p.type === type);
  }

  // Get all core plugins
  getCorePlugins(): PluginDefinition[] {
    return this.getByType('core');
  }

  // Get all extra plugins
  getExtraPlugins(): PluginDefinition[] {
    return this.getByType('extra');
  }

  // Get plugin IDs
  getPluginIds(): string[] {
    return Array.from(this.plugins.keys());
  }

  // Clear all plugins (useful for testing)
  clear(): void {
    this.plugins.clear();
  }
}

// Singleton instance
export const pluginRegistry = new PluginRegistry();

// Helper function to register a plugin
export function registerPlugin<T extends PluginAPI>(plugin: PluginDefinition<T>): void {
  pluginRegistry.register(plugin);
}
