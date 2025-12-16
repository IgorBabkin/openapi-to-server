import { openapiToClient } from '../../lib';
import fs from 'fs';
import * as path from 'path';

const inputFile = path.resolve(__dirname, './swagger.yaml');
const outputFile = path.resolve(__dirname, '../../.generated/client.ts');

describe('openapiToClient', () => {
  it('should generate client code from OpenAPI spec', () => {
    openapiToClient({
      inputFile,
      outputFile,
    });

    expect(fs.existsSync(outputFile)).toBe(true);
    expect(fs.readFileSync(outputFile, 'utf-8')).toMatchSnapshot();
  });

  it('should generate API client class', () => {
    openapiToClient({
      inputFile,
      outputFile,
    });

    const content = fs.readFileSync(outputFile, 'utf-8');

    // Should contain axios imports
    expect(content).toContain('axios');

    // Should contain API client class
    expect(content).toContain('export class ApiClient');
  });

  it('should generate methods for each operation', () => {
    openapiToClient({
      inputFile,
      outputFile,
    });

    const content = fs.readFileSync(outputFile, 'utf-8');

    // Should contain operation methods
    expect(content).toContain('searchInventory');
    expect(content).toContain('addInventory');
  });

  it('should include type definitions in client', () => {
    openapiToClient({
      inputFile,
      outputFile,
    });

    const content = fs.readFileSync(outputFile, 'utf-8');

    // Should contain type exports
    expect(content).toContain('export type InventoryItem');
    expect(content).toContain('export type Manufacturer');
  });
});
