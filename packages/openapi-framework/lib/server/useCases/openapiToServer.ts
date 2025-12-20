import { OpenAPIV3 } from 'openapi-types';
import { isYAML, loadYAML } from '../../utils/yaml';
import { loadJSON, saveJSON } from '../../utils/json';
import { getFilenameWithoutPath, getPathToFileWithoutFileName } from '../../utils/file';
import path from 'path';
import fs from 'fs';
import { renderServer, renderComponents, renderControllers } from '../templates';

type Props = {
  inputFile: string;
  outputFile: string;
  emitJSON?: boolean;
};

export function openapiToServer({ inputFile, outputFile, emitJSON }: Props) {
  const content: OpenAPIV3.Document = isYAML(inputFile) ? loadYAML(inputFile) : loadJSON(inputFile);
  if (emitJSON && isYAML(inputFile)) {
    const inputFilename: string = getFilenameWithoutPath(inputFile);
    const outputPath: string = getPathToFileWithoutFileName(outputFile);
    saveJSON(path.resolve(outputPath, inputFilename.replace(/\.yaml$/, '.json')), content);
  }
  fs.writeFileSync(outputFile, renderComponents(content), { encoding: 'utf8', flag: 'w' });
  fs.writeFileSync(outputFile, renderControllers(content), { encoding: 'utf8', flag: 'a' });
  fs.writeFileSync(outputFile, renderServer(content), { encoding: 'utf8', flag: 'a' });
}
