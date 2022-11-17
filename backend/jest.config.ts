module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
        '^.+\\.ts?$': 'ts-jest',
    },
    transformIgnorePatterns: ['<rootDir>/node_modules/'],
    verbose: true,
    testTimeout: 10000,
    setupFiles: ["<rootDir>/.env.test"]
};