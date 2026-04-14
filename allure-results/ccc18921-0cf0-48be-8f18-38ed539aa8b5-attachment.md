# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api\user.spec.ts >> Admin login
- Location: tests\api\user.spec.ts:5:5

# Error details

```
Error: Expected 201, got 200
```

# Test source

```ts
  49  | 
  50  |         const schemaName = SchemaManager.sanitizeName(method, this.url);
  51  |         const schemaType = responseStatus >= 200 && responseStatus < 300 ? 'success' : 'error';
  52  | 
  53  |         if (schemaMode === 'fix') {
  54  |             const generatedSchema = SchemaManager.generate(responseBody);
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
  108 |         Logger.info(`${method} ${this.url}`, {
  109 |             headers: this.headers,
  110 |             ...(method !== 'GET' && method !== 'DELETE' ? { body: this.payload } : {}),
  111 |         });
  112 | 
  113 |         const requestOptions: any = {
  114 |             headers: this.headers,
  115 |         };
  116 | 
  117 |         if (method !== 'GET' && method !== 'DELETE') {
  118 |             requestOptions.data = this.payload;
  119 |         }
  120 | 
  121 |         await AllureHelper.attachJson('Request', {
  122 |             method,
  123 |             url: this.url,
  124 |             headers: this.headers,
  125 |             ...(method !== 'GET' && method !== 'DELETE' ? { body: this.payload } : {}),
  126 |         });
  127 | 
  128 |         const response = await this.context.fetch(this.url, {
  129 |             method,
  130 |             ...requestOptions,
  131 |         });
  132 | 
  133 |         const responseBody = await response.json().catch(() => null);
  134 | 
  135 |         await AllureHelper.attachJson('Response', {
  136 |             status: response.status(),
  137 |             body: responseBody,
  138 |         });
  139 | 
  140 |         Logger.info(`Response ${this.url}`, {
  141 |             status: response.status(),
  142 |             body: responseBody,
  143 |         });
  144 | 
  145 |         await this.handleSchema(method, response.status(), responseBody);
  146 | 
  147 |         if (expectedStatus && response.status() !== expectedStatus) {
  148 |             this.reset();
> 149 |             throw new Error(`Expected ${expectedStatus}, got ${response.status()}`);
      |                   ^ Error: Expected 201, got 200
  150 |         }
  151 | 
  152 |         this.reset();
  153 |         return { response, body: responseBody };
  154 |     }
  155 | 
  156 |     async postRequest(expectedStatus?: number) {
  157 |         return this.sendRequest('POST', expectedStatus);
  158 |     }
  159 | 
  160 |     async getRequest(expectedStatus?: number) {
  161 |         return this.sendRequest('GET', expectedStatus);
  162 |     }
  163 | 
  164 |     async putRequest(expectedStatus?: number) {
  165 |         return this.sendRequest('PUT', expectedStatus);
  166 |     }
  167 | 
  168 |     async patchRequest(expectedStatus?: number) {
  169 |         return this.sendRequest('PATCH', expectedStatus);
  170 |     }
  171 | 
  172 |     async deleteRequest(expectedStatus?: number) {
  173 |         return this.sendRequest('DELETE', expectedStatus);
  174 |     }
  175 | }
```