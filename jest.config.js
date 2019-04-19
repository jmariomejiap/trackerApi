module.exports = {
  globals: {
    "ts-jest": {
      tsConfig: "tsconfig.json"
    }
  },
  roots: ["<rootDir>/"],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  testMatch: ["<rootDir>/__tests__/**/*.test.ts"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/__tests__/setup.ts"]
};
