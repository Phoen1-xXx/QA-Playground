import fs from 'fs';
import path from 'path';
import Ajv from 'ajv';

const Genson = require('genson-js');

const ajv = new Ajv({ allErrors: true, strict: false });

const BASE_DIR = path.resolve(__dirname, '../../../schemas/generated');

export class SchemaManager {

    static getSchemaPath(name: string, type: 'success' | 'error') {
        return path.join(BASE_DIR, name, `${type}.schema.json`);
    }

    static ensureDir(name: string) {
        const dir = path.join(BASE_DIR, name);
        fs.mkdirSync(dir, { recursive: true });
    }

    static exists(name: string, type: 'success' | 'error') {
        return fs.existsSync(this.getSchemaPath(name, type));
    }

    static load(name: string, type: 'success' | 'error') {
        return JSON.parse(
            fs.readFileSync(this.getSchemaPath(name, type), 'utf-8')
        );
    }

    static save(name: string, type: 'success' | 'error', schema: object) {
        this.ensureDir(name);
        fs.writeFileSync(
            this.getSchemaPath(name, type),
            JSON.stringify(schema, null, 2)
        );
    }

    static generate(data: any) {
        return Genson.createSchema(data);
    }

    static validate(schema: object, data: any) {
        const validate = ajv.compile(schema);
        const isValid = validate(data);

        return {
            isValid,
            errors: validate.errors || [],
        };
    }

    static sanitizeName(method: string, url: string) {
        return `${method}_${url}`
            .replace(/[\/:]/g, '_')
            .replace(/__+/g, '_');
    }
}

