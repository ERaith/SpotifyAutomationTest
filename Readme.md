# Selenium-Cucumber-JS Test

This is a sample automation project to create playlists in Spotify.
We are using Selenium Webdriver with Gherkin style Cucumber feature testing files.
We setup a POM structure and utilize babl to transpile typescript into JS before running the suite.

## Installation

```bash
yarn install

./run_tests.sh environment tag

IE: @dev, @smoke

e.g. ./run_tests.sh dev
```

## Automated Test Structure

```
    .
    ├── cucumber.js                 # Import from dist from babel ts->js transpile
    ├── src                         # Test files
    │   ├── features                # Feature files
    │   ├── pages                   # Page Object Model Files
    │   └── reporter                # Cucmber html reporter configuration
    │   └── step_definitions        # *step.ts files
    │       └── setup               # Hooks and world creation
    │   └── support                 # Options Helper for setting up our test globals from env
    └── ...
```

## Reports

By default we configured the cucumber-report to open the status after steps complete.

```
After running the initial tests all reports are exported to:

./reports/cucumber-html-report.html

if any steps failed then you can find additional screenshots:

./reports/screenshots/step-definition.png


By default we configured the cucumber-report to open the status after steps complete.
```
