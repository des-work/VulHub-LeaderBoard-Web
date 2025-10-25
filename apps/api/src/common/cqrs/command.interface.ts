export interface Command {
  readonly commandId: string;
  readonly tenantId: string;
  readonly timestamp: Date;
}

export interface CommandHandler<T extends Command> {
  handle(command: T): Promise<any>;
}

export interface CommandBus {
  execute<T extends Command>(command: T): Promise<any>;
  register<T extends Command>(commandType: string, handler: CommandHandler<T>): void;
}

export interface Query {
  readonly queryId: string;
  readonly tenantId: string;
  readonly timestamp: Date;
}

export interface QueryHandler<T extends Query> {
  handle(query: T): Promise<any>;
}

export interface QueryBus {
  execute<T extends Query>(query: T): Promise<any>;
  register<T extends Query>(queryType: string, handler: QueryHandler<T>): void;
}
