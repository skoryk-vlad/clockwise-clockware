module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
        '^.+\\.ts?$': 'ts-jest',
    },
    transformIgnorePatterns: ['<rootDir>/node_modules/'],
    verbose: true,
    testTimeout: 100000,
    setupFiles: [`<rootDir>/tests/index.ts`]
};