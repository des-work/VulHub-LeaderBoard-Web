import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DiscoveryService, MetadataScanner } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';

export interface Plugin {
  name: string;
  initialize(): void;
  executeHook?(hookName: string, data: any): Promise<any>;
}

@Injectable()
export class PluginManagerService implements OnModuleInit {
  private readonly logger = new Logger(PluginManagerService.name);
  private plugins = new Map<string, Plugin>();

  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
  ) {}

  onModuleInit() {
    this.discoverAndRegisterPlugins();
  }

  private discoverAndRegisterPlugins() {
    const providers = this.discoveryService.getProviders();
    providers.forEach((wrapper: InstanceWrapper) => {
      const { instance } = wrapper;
      if (instance && typeof instance.initialize === 'function' && typeof instance.name === 'string') {
        this.registerPlugin(instance as Plugin);
      }
    });
    this.logger.log(`Discovered and registered ${this.plugins.size} plugins.`);
  }

  registerPlugin(plugin: Plugin): void {
    if (this.plugins.has(plugin.name)) {
      this.logger.warn(`Plugin ${plugin.name} is already registered`);
      return;
    }

    this.plugins.set(plugin.name, plugin);
    plugin.initialize();
    this.logger.log(`Plugin ${plugin.name} registered successfully`);
  }

  unregisterPlugin(pluginName: string): void {
    if (this.plugins.has(pluginName)) {
      this.plugins.delete(pluginName);
      this.logger.log(`Plugin ${pluginName} unregistered`);
    }
  }

  getPlugin(pluginName: string): Plugin | undefined {
    return this.plugins.get(pluginName);
  }

  getAllPlugins(): Plugin[] {
    return Array.from(this.plugins.values());
  }

  executeHook(hookName: string, data: any): Promise<any[]> {
    const results: any[] = [];
    const promises = this.getAllPlugins().map(async (plugin) => {
      if (plugin.executeHook) {
        try {
          const result = await plugin.executeHook(hookName, data);
          results.push(result);
        } catch (error) {
          this.logger.error(`Error executing hook ${hookName} on plugin ${plugin.name}:`, error);
        }
      }
    });

    return Promise.all(promises).then(() => results);
  }
}