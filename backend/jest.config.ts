module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
        '^.+\\.ts?$': 'ts-jest',
    },
    transformIgnorePatterns: ['<rootDir>/node_modules/'],
    verbose: true,
    testTimeout: 100000,
    // setupFiles: [`<rootDir>/.env.${process.env.NODE_ENV?.trim()}`]
    setupFiles: [`<rootDir>/tests/setupFile.js`]
};