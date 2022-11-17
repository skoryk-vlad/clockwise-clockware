module.exports = {
    "moduleNameMapper": {
        "\\.(css|less|scss|sass)$": "identity-obj-proxy"
    },
    "testEnvironment": "jsdom",
    "setupFilesAfterEnv": [
        "<rootDir>/tests/setupTests.js"
    ],
    verbose: true,
}