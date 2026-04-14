# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api\login.spec.ts >> Admin login @smoke @regression
- Location: tests\api\login.spec.ts:6:5

# Error details

```
Error: Expected 200, got 400
```

# Test source

```ts
  55  |             SchemaManager.save(schemaName, schemaType, generatedSchema);
  56  | 
  57  |             Logger.info(`Schema regenerated for ${schemaName} [${schemaType}]`);
  58  |             return;
  59  |         }
  60  | 
  61  |         if (schemaMode === 'true') {
  62  |             const schemaExists = SchemaManager.exists(schemaName, schemaType);
  63  | 
  64  |             if (!schemaExists) {
  65  |                 const generatedSchema = SchemaManager.generate(responseBody);
  66  |                 SchemaManager.save(schemaName, schemaType, generatedSchema);
  67  | 
  68  |                 Logger.info(`Schema created for ${schemaName} [${schemaType}]`);
  69  |                 return;
  70  |             }
  71  | 
  72  |             const existingSchema = SchemaManager.load(schemaName, schemaType);
  73  |             const validationResult = SchemaManager.validate(existingSchema, responseBody);
  74  | 
  75  |             if (!validationResult.isValid) {
  76  |                 const formattedErrors = this.formatSchemaErrors(validationResult.errors);
  77  | 
  78  |                 Logger.error(`Schema validation failed for ${schemaName} [${schemaType}]`, {
  79  |                     errors: formattedErrors,
  80  |                     responseBody,
  81  |                     expectedSchema: existingSchema,
  82  |                 });
  83  | 
  84  |                 await AllureHelper.attachJson('Schema Validation Errors', formattedErrors);
  85  |                 await AllureHelper.attachJson('Schema Validation Response Body', responseBody);
  86  |                 await AllureHelper.attachJson('Expected Schema', existingSchema);
  87  | 
  88  |                 throw new Error(`Schema validation failed for ${schemaName} [${schemaType}]`);
  89  |             }
  90  | 
  91  |             Logger.info(`Schema validation passed for ${schemaName} [${schemaType}]`);
  92  |         }
  93  |     }
  94  | 
  95  |     private formatSchemaErrors(errors: any[]) {
  96  |         return errors.map((error) => ({
  97  |             path: error.instancePath || '/',
  98  |             message: error.message,
  99  |             keyword: error.keyword,
  100 |             params: error.params,
  101 |         }));
  102 |     }
  103 | 
  104 |     private async sendRequest(
  105 |         method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  106 |         expectedStatus?: number
  107 |     ) {
  108 | 
  109 |         const requestLog = {
  110 |             endpoint: `${method} ${this.url}`,
  111 |             headers: this.headers,
  112 |             ...(method !== 'GET' && method !== 'DELETE' ? { body: this.payload } : {}),
  113 |         };
  114 | 
  115 |         const requestOptions: any = {
  116 |             headers: this.headers,
  117 |         };
  118 | 
  119 |         if (method !== 'GET' && method !== 'DELETE') {
  120 |             requestOptions.data = this.payload;
  121 |         }
  122 |         try {
  123 |             await AllureHelper.attachJson('Request', {
  124 |                 method,
  125 |                 url: this.url,
  126 |                 headers: this.headers,
  127 |                 ...(method !== 'GET' && method !== 'DELETE' ? { body: this.payload } : {}),
  128 |             });
  129 | 
  130 |             const response = await this.context.fetch(this.url, {
  131 |                 method,
  132 |                 ...requestOptions,
  133 |             });
  134 | 
  135 |             const responseBody = await response.json().catch(() => null);
  136 | 
  137 |             await AllureHelper.attachJson('Response', {
  138 |                 status: response.status(),
  139 |                 body: responseBody,
  140 |             });
  141 | 
  142 |             const responseLog = {
  143 |                 status: response.status(),
  144 |                 body: responseBody,
  145 |             };
  146 | 
  147 |             await this.handleSchema(method, response.status(), responseBody);
  148 | 
  149 |             if (expectedStatus && response.status() !== expectedStatus) {
  150 |                 Logger.error(`Request failed: ${method} ${this.url}`, {
  151 |                     request: requestLog,
  152 |                     response: responseLog,
  153 |                 });
  154 | 
> 155 |                 throw new Error(`Expected ${expectedStatus}, got ${response.status()}`);
      |                       ^ Error: Expected 200, got 400
  156 |             }
  157 | 
  158 |             Logger.debug(`Request passed: ${method} ${this.url} -> ${response.status()}`);
  159 | 
  160 |             return { response, body: responseBody };
  161 |         } catch (error) {
  162 |             Logger.error(`Request execution failed: ${method} ${this.url}`, {
  163 |                 request: requestLog,
  164 |                 error: error instanceof Error ? error.message : String(error),
  165 |             });
  166 | 
  167 |             throw error;
  168 |         } finally {
  169 |             this.reset();
  170 |         }
  171 |     }
  172 | 
  173 |     async postRequest(expectedStatus?: number) {
  174 |         return this.sendRequest('POST', expectedStatus);
  175 |     }
  176 | 
  177 |     async getRequest(expectedStatus?: number) {
  178 |         return this.sendRequest('GET', expectedStatus);
  179 |     }
  180 | 
  181 |     async putRequest(expectedStatus?: number) {
  182 |         return this.sendRequest('PUT', expectedStatus);
  183 |     }
  184 | 
  185 |     async patchRequest(expectedStatus?: number) {
  186 |         return this.sendRequest('PATCH', expectedStatus);
  187 |     }
  188 | 
  189 |     async deleteRequest(expectedStatus?: number) {
  190 |         return this.sendRequest('DELETE', expectedStatus);
  191 |     }
  192 | }
```