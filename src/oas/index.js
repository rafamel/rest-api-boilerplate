import tags from './tags';
import paths from './paths';
import components from './components';
import pkg from '~/../package.json';

// Graph: http://openapi-map.apihandyman.io/
// Docs: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#schema-object
// Example: https://github.com/OAI/OpenAPI-Specification/blob/master/examples/v3.0/petstore.yaml
// OpenAPI JSON Shema: https://philsturgeon.uk/api/2018/03/30/openapi-and-json-schema-divergence/
export default {
  openapi: '3.0.0',
  servers: [{ url: 'http://localhost:3000' }],
  info: {
    version: pkg.version,
    title: pkg.description,
    description: `${pkg.description} OAS 3 specification.`,
    // contact: { email: 'email@email.com' },
    // termsOfService: 'url',
    license: { name: pkg.license }
  },
  tags,
  paths,
  components,
  security: []
  // externalDocs
};
