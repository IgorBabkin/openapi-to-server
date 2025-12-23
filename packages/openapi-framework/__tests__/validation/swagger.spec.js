"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../lib/validation/index");
const path = require("path");
const fs_1 = require("fs");
describe('swagger', function () {
    const inputFile = path.resolve(__dirname, 'swagger.yaml');
    const outputFile = path.resolve(__dirname, '../../.generated/validators.ts');
    it('openapiToZod', function () {
        (0, index_1.openapiToZod)({
            inputFile: inputFile,
            outputFile: outputFile,
        });
        expect(fs_1.default.readFileSync(outputFile, 'utf-8')).toMatchSnapshot();
    });
});
