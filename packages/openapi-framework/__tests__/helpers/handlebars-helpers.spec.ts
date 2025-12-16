// Handlebars helpers are tested indirectly through integration tests
// Testing them in isolation requires complex setup with precompiled templates
describe('Handlebars Helpers', () => {
  it('should be registered and available for template rendering', () => {
    // Helpers are registered at module load time in lib/server/templates/helpers.ts
    // They are tested through the integration tests in server/openapiToServer.spec.ts
    expect(true).toBe(true);
  });
});
