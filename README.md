# Serverless Package Env Plugin
[![Build Status](https://travis-ci.org/ACloudGuru/serverless-plugin-package-dotenv-file.svg?branch=master)](https://travis-ci.org/ACloudGuru/serverless-plugin-package-dotenv-file)

A Serverless plugin to copy a .env file into the serverless package


## Installation
`npm i serverless-plugin-package-dotenv-file`

## Usage

```
service: your-service
...
custom:
  packageEnv:
    fileName: .env-${env:ENVIRONMENT}

plugins:
  - serverless-plugin-package-dotenv-file
```
