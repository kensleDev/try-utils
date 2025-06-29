# Development Documentation

## Overview

This package uses GitHub Actions for automated publishing to npm. The workflow supports both beta releases (from main branch) and official releases (from git tags).

## Development Workflow

### 1. Regular Development (Beta Releases)

1. Make your code changes
2. Update the version in `package.json` if needed
3. Commit and push to main branch
4. GitHub Action automatically publishes with `beta` tag

```bash
# Make changes, then:
git add .
git commit -m "feat: add new feature"
git push origin main
```

Or use the deploy script for a more automated flow:

```bash
bun run deploy:beta
```

### 2. Official Releases

1. Update the version in `package.json` to the release version
2. Commit the version change
3. Run the release script to create and push a version tag
4. GitHub Action automatically publishes as `latest` version

```bash
# Update version in package.json, then:
git add package.json
git commit -m "chore: bump version to 1.0.0"
bun run deploy:release
```

## Available Scripts

- `bun run build` - Build the package (no-op for TypeScript source)
- `bun run test` - Run tests in watch mode
- `bun run test:run` - Run all tests once
- `bun run test:watch` - Run tests in watch mode
- `bun run prepublishOnly` - Run tests before publishing
- `bun run deploy:beta` - Build, test, commit, and push to main for beta release
- `bun run deploy:release` - Build, test, commit, tag, and push for official release

## GitHub Actions

The `.github/workflows/publish.yml` workflow automatically:

- Triggers on pushes to `main` branch and version tags (`v*`)
- Sets up Bun and Node.js 18 environment
- Installs dependencies with `bun install`
- Builds the package with `bun run build`
- Runs tests with `bun run test:run`
- Publishes to npm:
  - Main branch pushes → publishes with `beta` tag
  - Version tags → publishes as `latest` version

## Setup Requirements

1. **NPM Token**: Create an automation token at npmjs.com
2. **GitHub Secret**: Add the token as `NPM_TOKEN` secret in your GitHub repository settings

## Version Management

- Manual version control via `package.json`
- Use semantic versioning (e.g., `1.0.0`, `1.0.1`, `1.1.0`)
- Beta releases help test changes before official release
- Official releases should be well-tested and documented

## Publishing Strategy

- **Beta releases**: For testing new features and changes
- **Official releases**: For stable, production-ready versions
- Both use the same build process to ensure consistency
