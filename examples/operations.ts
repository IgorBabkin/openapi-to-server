import { HttpRoute, HttpResponse, HttpStatus, constructor } from '@ibabkin/openapi-to-server';

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

// Http routes
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
export interface GetHealthHttpRoute extends HttpRoute<GetHealthPayload, GetHealthResponse> {}

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
export interface GetHealthDbHttpRoute extends HttpRoute<GetHealthDbPayload, GetHealthDbResponse> {}

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
export interface CreateTodoHttpRoute extends HttpRoute<CreateTodoPayload, CreateTodoResponse> {}

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
export interface GetTodosHttpRoute extends HttpRoute<GetTodosPayload, GetTodosResponse> {}

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
export interface UpdateTodoHttpRoute extends HttpRoute<UpdateTodoPayload, UpdateTodoResponse> {}

export type DeleteTodoPayload = {};

export interface DeleteTodoResponse extends HttpResponse {
  status: HttpStatus.NoContent;

  headers: {};
}

/**
 * Delete a todo
 * @tags Todos
 */
export interface DeleteTodoHttpRoute extends HttpRoute<DeleteTodoPayload, DeleteTodoResponse> {}

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
export interface GetTodoHttpRoute extends HttpRoute<GetTodoPayload, GetTodoResponse> {}

// Operations
export type Operations = {
  getHealth: GetHealthHttpRoute;
  getHealthDb: GetHealthDbHttpRoute;
  createTodo: CreateTodoHttpRoute;
  getTodos: GetTodosHttpRoute;
  updateTodo: UpdateTodoHttpRoute;
  deleteTodo: DeleteTodoHttpRoute;
  getTodo: GetTodoHttpRoute;
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
  getHealth: constructor<GetHealthHttpRoute>;
  getHealthDb: constructor<GetHealthDbHttpRoute>;
  createTodo: constructor<CreateTodoHttpRoute>;
  getTodos: constructor<GetTodosHttpRoute>;
  updateTodo: constructor<UpdateTodoHttpRoute>;
  deleteTodo: constructor<DeleteTodoHttpRoute>;
  getTodo: constructor<GetTodoHttpRoute>;
}
