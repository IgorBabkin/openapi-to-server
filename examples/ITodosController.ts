import type {
  GetTodosPayload,
  GetTodosResponse,
  CreateTodoPayload,
  CreateTodoResponse,
  GetTodoPayload,
  GetTodoResponse,
  UpdateTodoPayload,
  UpdateTodoResponse,
  DeleteTodoPayload,
  DeleteTodoResponse,
} from '../.generated/operations.js';

/**
 * Controller interface for Todos operations
 * Each method corresponds to an OpenAPI operation defined in swagger.yaml
 */
export interface ITodosController {
  /**
   * List all todos
   * @param payload - Request payload including path params, query params, and body
   * @returns Promise with the operation response
   */
  getTodos(payload: GetTodosPayload): Promise<GetTodosResponse>;

  /**
   * Create a new todo
   * @param payload - Request payload including path params, query params, and body
   * @returns Promise with the operation response
   */
  createTodo(payload: CreateTodoPayload): Promise<CreateTodoResponse>;

  /**
   * Get a todo by ID
   * @param payload - Request payload including path params, query params, and body
   * @returns Promise with the operation response
   */
  getTodo(payload: GetTodoPayload): Promise<GetTodoResponse>;

  /**
   * Update a todo
   * @param payload - Request payload including path params, query params, and body
   * @returns Promise with the operation response
   */
  updateTodo(payload: UpdateTodoPayload): Promise<UpdateTodoResponse>;

  /**
   * Delete a todo
   * @param payload - Request payload including path params, query params, and body
   * @returns Promise with the operation response
   */
  deleteTodo(payload: DeleteTodoPayload): Promise<DeleteTodoResponse>;
}
