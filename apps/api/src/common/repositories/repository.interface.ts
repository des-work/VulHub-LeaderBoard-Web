import { Entity } from '../domain/entity.base';

export interface Repository<T extends Entity<any>> {
  findById(id: string, tenantId: string): Promise<T | null>;
  findByIds(ids: string[], tenantId: string): Promise<T[]>;
  findAll(tenantId: string, limit?: number, offset?: number): Promise<T[]>;
  save(entity: T): Promise<T>;
  saveMany(entities: T[]): Promise<T[]>;
  delete(id: string, tenantId: string): Promise<void>;
  deleteMany(ids: string[], tenantId: string): Promise<void>;
  exists(id: string, tenantId: string): Promise<boolean>;
  count(tenantId: string): Promise<number>;
}

export interface ReadOnlyRepository<T extends Entity<any>> {
  findById(id: string, tenantId: string): Promise<T | null>;
  findByIds(ids: string[], tenantId: string): Promise<T[]>;
  findAll(tenantId: string, limit?: number, offset?: number): Promise<T[]>;
  exists(id: string, tenantId: string): Promise<boolean>;
  count(tenantId: string): Promise<number>;
}

export interface UnitOfWork {
  begin(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
  isActive(): boolean;
}

export interface RepositoryFactory {
  createUserRepository(): Repository<any>;
  createProjectRepository(): Repository<any>;
  createSubmissionRepository(): Repository<any>;
  createBadgeRepository(): Repository<any>;
  createLeaderboardRepository(): Repository<any>;
}
