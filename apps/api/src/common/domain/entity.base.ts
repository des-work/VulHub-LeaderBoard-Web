import { ValueObject } from './value-object.base';

export abstract class Entity<T> {
  protected readonly _id: string;
  protected readonly _tenantId: string;
  protected _createdAt: Date;
  protected _updatedAt: Date;

  constructor(
    id: string,
    tenantId: string,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date()
  ) {
    this._id = id;
    this._tenantId = tenantId;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  /**
   * Get the entity ID
   */
  get id(): string {
    return this._id;
  }

  /**
   * Get the tenant ID
   */
  get tenantId(): string {
    return this._tenantId;
  }

  /**
   * Get the creation date
   */
  get createdAt(): Date {
    return this._createdAt;
  }

  /**
   * Get the last update date
   */
  get updatedAt(): Date {
    return this._updatedAt;
  }

  /**
   * Update the last modified date
   */
  protected touch(): void {
    this._updatedAt = new Date();
  }

  /**
   * Check if two entities are equal
   */
  equals(other: Entity<T>): boolean {
    if (other === null || other === undefined) {
      return false;
    }

    if (this.constructor !== other.constructor) {
      return false;
    }

    return this._id === other._id && this._tenantId === other._tenantId;
  }

  /**
   * Get entity hash code
   */
  hashCode(): string {
    return `${this.constructor.name}:${this._id}:${this._tenantId}`;
  }

  /**
   * Convert entity to plain object
   */
  abstract toJSON(): Record<string, any>;

  /**
   * Create entity from plain object
   */
  static fromJSON<T>(json: Record<string, any>): T {
    throw new Error('fromJSON method must be implemented by concrete entity');
  }
}

// Common Entity Base Classes
export abstract class AuditableEntity<T> extends Entity<T> {
  protected _createdBy?: string;
  protected _updatedBy?: string;

  constructor(
    id: string,
    tenantId: string,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
    createdBy?: string,
    updatedBy?: string
  ) {
    super(id, tenantId, createdAt, updatedAt);
    this._createdBy = createdBy;
    this._updatedBy = updatedBy;
  }

  /**
   * Get the creator ID
   */
  get createdBy(): string | undefined {
    return this._createdBy;
  }

  /**
   * Get the last updater ID
   */
  get updatedBy(): string | undefined {
    return this._updatedBy;
  }

  /**
   * Update the last modified date and user
   */
  protected touch(updatedBy?: string): void {
    super.touch();
    this._updatedBy = updatedBy;
  }
}

export abstract class SoftDeletableEntity<T> extends Entity<T> {
  protected _deletedAt?: Date;
  protected _deletedBy?: string;

  constructor(
    id: string,
    tenantId: string,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
    deletedAt?: Date,
    deletedBy?: string
  ) {
    super(id, tenantId, createdAt, updatedAt);
    this._deletedAt = deletedAt;
    this._deletedBy = deletedBy;
  }

  /**
   * Get the deletion date
   */
  get deletedAt(): Date | undefined {
    return this._deletedAt;
  }

  /**
   * Get the deleter ID
   */
  get deletedBy(): string | undefined {
    return this._deletedBy;
  }

  /**
   * Check if entity is deleted
   */
  get isDeleted(): boolean {
    return this._deletedAt !== undefined;
  }

  /**
   * Soft delete the entity
   */
  delete(deletedBy?: string): void {
    this._deletedAt = new Date();
    this._deletedBy = deletedBy;
    this.touch();
  }

  /**
   * Restore the entity
   */
  restore(): void {
    this._deletedAt = undefined;
    this._deletedBy = undefined;
    this.touch();
  }
}

export abstract class VersionedEntity<T> extends Entity<T> {
  protected _version: number;

  constructor(
    id: string,
    tenantId: string,
    version: number = 1,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date()
  ) {
    super(id, tenantId, createdAt, updatedAt);
    this._version = version;
  }

  /**
   * Get the entity version
   */
  get version(): number {
    return this._version;
  }

  /**
   * Increment the version
   */
  protected incrementVersion(): void {
    this._version++;
    this.touch();
  }
}
