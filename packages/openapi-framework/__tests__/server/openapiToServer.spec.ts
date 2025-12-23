import { openapiToServer } from '../../lib';
import fs from 'fs';
import * as path from 'path';

const inputFile = path.resolve(__dirname, './swagger.yaml');
const outputFile = path.resolve(__dirname, '../../.generated/server.ts');

describe('openapiToServer', () => {
  it('should generate server types from OpenAPI spec', () => {
    openapiToServer({
      inputFile,
      outputFile,
      emitJSON: false,
    });

    expect(fs.existsSync(outputFile)).toBe(true);
    expect(fs.readFileSync(outputFile, 'utf-8')).toMatchSnapshot();
  });

  it('should emit JSON when emitJSON is true', () => {
    const jsonOutputFile = path.resolve(__dirname, '../../.generated/swagger.json');

    openapiToServer({
      inputFile,
      outputFile,
      emitJSON: true,
    });

    expect(fs.existsSync(jsonOutputFile)).toBe(true);
    const json = JSON.parse(fs.readFileSync(jsonOutputFile, 'utf-8'));
    expect(json).toHaveProperty('openapi');
    expect(json).toHaveProperty('paths');
    expect(json).toHaveProperty('components');
  });

  it('should generate Components section with schemas', () => {
    openapiToServer({
      inputFile,
      outputFile,
      emitJSON: false,
    });

    const content = fs.readFileSync(outputFile, 'utf-8');

    // Should contain component type definitions
    expect(content).toContain('export type InventoryItem');
    expect(content).toContain('export type Manufacturer');
  });

  it('should generate Controller interfaces grouped by tags', () => {
    openapiToServer({
      inputFile,
      outputFile,
      emitJSON: false,
    });

    const content = fs.readFileSync(outputFile, 'utf-8');

    // Should contain controller interfaces
    expect(content).toContain('export interface IAdminsController');
    expect(content).toContain('export interface IDevelopersController');
  });

  it('should generate IServer interface with all controllers', () => {
    openapiToServer({
      inputFile,
      outputFile,
      emitJSON: false,
    });

    const content = fs.readFileSync(outputFile, 'utf-8');

    // Should contain main server interface
    expect(content).toContain('export interface IServer');
    expect(content).toContain('admins: constructor<IAdminsController>');
    expect(content).toContain('developers: constructor<IDevelopersController>');
  });

  it('should generate payload and response types for each operation', () => {
    openapiToServer({
      inputFile,
      outputFile,
      emitJSON: false,
    });

    const content = fs.readFileSync(outputFile, 'utf-8');

    // Should contain operation types
    expect(content).toContain('export type SearchInventoryPayload');
    expect(content).toContain('export interface SearchInventoryResponse');
    expect(content).toContain('export interface SearchInventoryRoute');
  });
});
