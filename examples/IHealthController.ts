import type {
  GetHealthPayload,
  GetHealthResponse,
  GetHealthDbPayload,
  GetHealthDbResponse,
} from '../.generated/operations.js';

/**
 * Controller interface for Health operations
 * Each method corresponds to an OpenAPI operation defined in swagger.yaml
 */
export interface IHealthController {
  /**
   * Health check
   * @param payload - Request payload including path params, query params, and body
   * @returns Promise with the operation response
   */
  getHealth(payload: GetHealthPayload): Promise<GetHealthResponse>;

  /**
   * Database health check
   * @param payload - Request payload including path params, query params, and body
   * @returns Promise with the operation response
   */
  getHealthDb(payload: GetHealthDbPayload): Promise<GetHealthDbResponse>;
}
