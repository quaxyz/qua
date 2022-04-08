// lint-staged.config.js
module.exports = {
  // Lint then format TypeScript and JavaScript files
  "**/*.(ts|tsx|js)": (filenames) => [
    `prettier --write ${filenames.join(" ")}`,
    `eslint --fix ${filenames.join(" ")}`,
    `git add ${filenames.join(" ")}`,
  ],
};
