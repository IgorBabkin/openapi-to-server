/**
 * Example output: IServer interface
 * Generated from swagger.yaml using Server.hbs template
 */

// Server Interface
export interface IServer {
  Health: IHealthController;
  Todos: ITodosController;
}

// This interface provides a centralized type for all controllers
// Each property corresponds to a tag in the OpenAPI specification
// and references the corresponding controller interface
