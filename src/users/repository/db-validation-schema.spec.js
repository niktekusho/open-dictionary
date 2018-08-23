const validationSchema = require('./validation-schema');

describe('User repository -> \'Validation schema\' test suite', () => {
    describe('Evaluating exported module', () => {
        it('exported object should be an object', () => {
            expect(validationSchema).toEqual(expect.any(Object));
        });
    });

    describe('Evaluating module functionality', () => {
        it('should contain the \'$jsonSchema\' property', async() => {
            expect(validationSchema).toHaveProperty('$jsonSchema');
        });
    });
});
