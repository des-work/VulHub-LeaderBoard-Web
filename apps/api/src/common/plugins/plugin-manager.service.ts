import { Injectable, Logger } from '@nestjs/common';

export interface Plugin {
  name: string;
  version: string;
  description: string;
  dependencies?: string[];
  
  initialize(): Promise<void>;
  destroy(): Promise<void>;
  
  // Lifecycle hooks
  onInstall?(): Promise<void>;
  onUninstall?(): Promise<void>;
  onEnable?(): Promise<void>;
  onDisable?(): Promise<void>;
}

export interface PluginHook {
  name: string;
  execute<T>(data: T, context?: any): Promise<T>;
}

export interface PluginManager {
  registerPlugin(plugin: Plugin): Promise<void>;
  unregisterPlugin(name: string): Promise<void>;
  getPlugin(name: string): Plugin | undefined;
  getAllPlugins(): Plugin[];
  
  registerHook(hookName: string, plugin: Plugin, hook: PluginHook): void;
  executeHook<T>(hookName: string, data: T, context?: any): Promise<T>;
}

@Injectable()
export class PluginManagerService implements PluginManager {
  private readonly logger = new Logger(PluginManagerService.name);
  private plugins = new Map<string, Plugin>();
  private hooks = new Map<string, Map<string, PluginHook>>();

  /**
   * Register a plugin
   */
  async registerPlugin(plugin: Plugin): Promise<void> {
    try {
      // Check dependencies
      if (plugin.dependencies) {
        for (const dep of plugin.dependencies) {
          if (!this.plugins.has(dep)) {
            throw new Error(`Plugin '${plugin.name}' requires dependency '${dep}' which is not installed`);
          }
        }
      }

      // Initialize plugin
      await plugin.initialize();
      
      // Run install hook
      if (plugin.onInstall) {
        await plugin.onInstall();
      }

      this.plugins.set(plugin.name, plugin);
      this.logger.log(`Plugin '${plugin.name}' registered successfully`);
    } catch (error) {
      this.logger.error(`Failed to register plugin '${plugin.name}':`, error);
      throw error;
    }
  }

  /**
   * Unregister a plugin
   */
  async unregisterPlugin(name: string): Promise<void> {
    const plugin = this.plugins.get(name);
    if (!plugin) {
      throw new Error(`Plugin '${name}' not found`);
    }

    try {
      // Run uninstall hook
      if (plugin.onUninstall) {
        await plugin.onUninstall();
      }

      // Destroy plugin
      await plugin.destroy();

      // Remove hooks
      for (const [hookName, hookMap] of this.hooks.entries()) {
        hookMap.delete(name);
        if (hookMap.size === 0) {
          this.hooks.delete(hookName);
        }
      }

      this.plugins.delete(name);
      this.logger.log(`Plugin '${name}' unregistered successfully`);
    } catch (error) {
      this.logger.error(`Failed to unregister plugin '${name}':`, error);
      throw error;
    }
  }

  /**
   * Get plugin by name
   */
  getPlugin(name: string): Plugin | undefined {
    return this.plugins.get(name);
  }

  /**
   * Get all plugins
   */
  getAllPlugins(): Plugin[] {
    return Array.from(this.plugins.values());
  }

  /**
   * Register a hook
   */
  registerHook(hookName: string, plugin: Plugin, hook: PluginHook): void {
    if (!this.hooks.has(hookName)) {
      this.hooks.set(hookName, new Map());
    }
    
    this.hooks.get(hookName)!.set(plugin.name, hook);
    this.logger.log(`Hook '${hookName}' registered for plugin '${plugin.name}'`);
  }

  /**
   * Execute a hook
   */
  async executeHook<T>(hookName: string, data: T, context?: any): Promise<T> {
    const hookMap = this.hooks.get(hookName);
    if (!hookMap || hookMap.size === 0) {
      return data;
    }

    let result = data;
    
    for (const [pluginName, hook] of hookMap) {
      try {
        result = await hook.execute(result, context);
        this.logger.debug(`Hook '${hookName}' executed by plugin '${pluginName}'`);
      } catch (error) {
        this.logger.error(`Hook '${hookName}' failed in plugin '${pluginName}':`, error);
        // Continue with other hooks
      }
    }

    return result;
  }

  /**
   * Enable a plugin
   */
  async enablePlugin(name: string): Promise<void> {
    const plugin = this.plugins.get(name);
    if (!plugin) {
      throw new Error(`Plugin '${name}' not found`);
    }

    if (plugin.onEnable) {
      await plugin.onEnable();
    }
    
    this.logger.log(`Plugin '${name}' enabled`);
  }

  /**
   * Disable a plugin
   */
  async disablePlugin(name: string): Promise<void> {
    const plugin = this.plugins.get(name);
    if (!plugin) {
      throw new Error(`Plugin '${name}' not found`);
    }

    if (plugin.onDisable) {
      await plugin.onDisable();
    }
    
    this.logger.log(`Plugin '${name}' disabled`);
  }

  /**
   * Get plugin status
   */
  getPluginStatus(name: string): { exists: boolean; enabled: boolean } {
    const plugin = this.plugins.get(name);
    return {
      exists: !!plugin,
      enabled: !!plugin,
    };
  }

  /**
   * Get all hooks for a plugin
   */
  getPluginHooks(pluginName: string): string[] {
    const hooks: string[] = [];
    for (const [hookName, hookMap] of this.hooks.entries()) {
      if (hookMap.has(pluginName)) {
        hooks.push(hookName);
      }
    }
    return hooks;
  }

  /**
   * Get all available hooks
   */
  getAllHooks(): string[] {
    return Array.from(this.hooks.keys());
  }
}
