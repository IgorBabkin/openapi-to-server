import { UseCase, HttpResponse, HttpStatus, constructor } from '@ibabkin/openapi-to-server';

// Components
export type HealthResponse = {
  status: string;
};
export type DbHealthResponse = {
  status: string;
  timestamp?: Date;
  message?: string;
};
export type TodoStatus = string;
export type Todo = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  status: TodoStatus;
  createdAt: Date;
  updatedAt: Date;
};
export type CreateTodoPayload = {
  title: string;
  description?: string;
  tags?: string[];
};
export type UpdateTodoPayload = {
  title?: string;
  description?: string;
  tags?: string[];
  status?: TodoStatus;
};
export type ErrorResponse = {
  error: string;
  message?: string;
};

// Use cases
export type GetHealthPayload = {};

export interface GetHealthResponse extends HttpResponse {
  status: HttpStatus.OK;

  headers: {};

  body: HealthResponse;
}

/**
 * Health check
 * @tags Health
 */
export interface GetHealthUseCase extends UseCase<GetHealthPayload, GetHealthResponse> {}

export type GetHealthDbPayload = {};

export interface GetHealthDbResponse extends HttpResponse {
  status: HttpStatus.OK;

  headers: {};

  body: DbHealthResponse;
}

/**
 * Database health check
 * @tags Health
 */
export interface GetHealthDbUseCase extends UseCase<GetHealthDbPayload, GetHealthDbResponse> {}

export type CreateTodoPayload = {
  body: CreateTodoPayload;
};

export interface CreateTodoResponse extends HttpResponse {
  status: HttpStatus.Created;

  headers: {};

  body: Todo;
}

/**
 * Create a new todo
 * @tags Todos
 */
export interface CreateTodoUseCase extends UseCase<CreateTodoPayload, CreateTodoResponse> {}

export type GetTodosPayload = {
  query: {
    status?: TodoStatus;
    tags?: string[];
    search?: string;
  };
};

export interface GetTodosResponse extends HttpResponse {
  status: HttpStatus.OK;

  headers: {};

  body: Todo[];
}

/**
 * List all todos
 * @tags Todos
 */
export interface GetTodosUseCase extends UseCase<GetTodosPayload, GetTodosResponse> {}

export type UpdateTodoPayload = {
  body: UpdateTodoPayload;
};

export interface UpdateTodoResponse extends HttpResponse {
  status: HttpStatus.OK;

  headers: {};

  body: Todo;
}

/**
 * Update a todo
 * @tags Todos
 */
export interface UpdateTodoUseCase extends UseCase<UpdateTodoPayload, UpdateTodoResponse> {}

export type DeleteTodoPayload = {};

export interface DeleteTodoResponse extends HttpResponse {
  status: HttpStatus.NoContent;

  headers: {};
}

/**
 * Delete a todo
 * @tags Todos
 */
export interface DeleteTodoUseCase extends UseCase<DeleteTodoPayload, DeleteTodoResponse> {}

export type GetTodoPayload = {};

export interface GetTodoResponse extends HttpResponse {
  status: HttpStatus.OK;

  headers: {};

  body: Todo;
}

/**
 * Get a todo by ID
 * @tags Todos
 */
export interface GetTodoUseCase extends UseCase<GetTodoPayload, GetTodoResponse> {}

// Operations
export type Operations = {
  getHealth: GetHealthUseCase;
  getHealthDb: GetHealthDbUseCase;
  createTodo: CreateTodoUseCase;
  getTodos: GetTodosUseCase;
  updateTodo: UpdateTodoUseCase;
  deleteTodo: DeleteTodoUseCase;
  getTodo: GetTodoUseCase;
};

export type RoutesPayloads = {
  getHealth: GetHealthPayload;
  getHealthDb: GetHealthDbPayload;
  createTodo: CreateTodoPayload;
  getTodos: GetTodosPayload;
  updateTodo: UpdateTodoPayload;
  deleteTodo: DeleteTodoPayload;
  getTodo: GetTodoPayload;
};

// Context
export interface RequestContext {
  getUrl<Key extends keyof RoutesPayloads>(key: Key, payload: RoutesPayloads[Key]): string;
}
// Server Interface
export interface IServer {
  getHealth: constructor<GetHealthUseCase>;
  getHealthDb: constructor<GetHealthDbUseCase>;
  createTodo: constructor<CreateTodoUseCase>;
  getTodos: constructor<GetTodosUseCase>;
  updateTodo: constructor<UpdateTodoUseCase>;
  deleteTodo: constructor<DeleteTodoUseCase>;
  getTodo: constructor<GetTodoUseCase>;
}
