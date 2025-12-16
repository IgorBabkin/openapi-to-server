import { isYAML, loadYAML } from '../../lib/utils/yaml';
import * as path from 'path';
import { OpenAPIV3 } from 'openapi-types';

describe('YAML utils', () => {
  describe('isYAML', () => {
    it('should return true for .yaml files', () => {
      expect(isYAML('swagger.yaml')).toBe(true);
    });

    it('should return false for .yml files (not supported)', () => {
      // Current implementation only supports .yaml extension
      expect(isYAML('openapi.yml')).toBe(false);
    });

    it('should return false for .json files', () => {
      expect(isYAML('swagger.json')).toBe(false);
    });

    it('should return false for other extensions', () => {
      expect(isYAML('readme.txt')).toBe(false);
    });
  });

  describe('loadYAML', () => {
    const testFile = path.resolve(__dirname, '../server/swagger.yaml');

    it('should load and parse YAML file', () => {
      const result = loadYAML(testFile);

      expect(result).toBeDefined();
      expect(result).toHaveProperty('openapi');
      expect(result).toHaveProperty('info');
      expect(result).toHaveProperty('paths');
    });

    it('should return OpenAPIV3 Document structure', () => {
      const result = loadYAML(testFile) as OpenAPIV3.Document;

      expect(result.openapi).toBe('3.0.0');
      expect(result.info).toHaveProperty('title');
      expect(result.paths).toBeDefined();
    });

    it('should handle YAML imports', () => {
      const result = loadYAML(testFile) as OpenAPIV3.Document;

      // Check if paths were imported
      expect(Object.keys(result.paths || {}).length).toBeGreaterThan(0);
    });
  });
});
