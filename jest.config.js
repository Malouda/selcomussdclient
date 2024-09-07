module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.ts'],  // Specify which files to collect coverage from
    coverageDirectory: 'coverage',  // Directory where coverage report is generated
    coverageReporters: ['text', 'lcov'],  // Report formats
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],  // Directories to ignore
};