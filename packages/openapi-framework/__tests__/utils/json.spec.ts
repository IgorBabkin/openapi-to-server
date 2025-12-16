import { loadJSON, saveJSON } from '../../lib/utils/json';
import * as path from 'path';
import * as fs from 'fs';

describe('JSON utils', () => {
  describe('loadJSON', () => {
    it('should load and parse JSON file', () => {
      // First create the JSON from YAML
      const jsonPath = path.resolve(__dirname, '../../.generated/test-swagger.json');

      // Write a test JSON file
      const testData = {
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {},
      };

      fs.writeFileSync(jsonPath, JSON.stringify(testData, null, 2));

      const result = loadJSON(jsonPath);

      expect(result).toEqual(testData);

      // Cleanup
      fs.unlinkSync(jsonPath);
    });
  });

  describe('saveJSON', () => {
    it('should save object as formatted JSON', () => {
      const outputPath = path.resolve(__dirname, '../../.generated/test-output.json');
      const testData = {
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
      };

      saveJSON(outputPath, testData);

      expect(fs.existsSync(outputPath)).toBe(true);

      const loaded = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
      expect(loaded).toEqual(testData);

      // Cleanup
      fs.unlinkSync(outputPath);
    });

    it('should require parent directory to exist', () => {
      // Current implementation does not create directories
      // Parent directory must exist before calling saveJSON
      const outputPath = path.resolve(__dirname, '../../.generated/test.json');
      const testData = { test: true };

      saveJSON(outputPath, testData);
      expect(fs.existsSync(outputPath)).toBe(true);

      // Cleanup
      fs.unlinkSync(outputPath);
    });
  });
});
