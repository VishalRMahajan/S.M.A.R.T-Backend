module.exports = {
  extends: ["@commitlint/cli", "@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "docs",
        "style",
        "refactor",
        "perf",
        "chore",
        "test",
        "build",
        "revert",
      ],
    ],
    "subject-case": [2, "always", "sentence-case"],
  },
};
