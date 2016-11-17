'use strict';

const path = require('path');
const fse = require('fs-extra');

class Plugin {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;

    this.copyFileSync = fse.copySync;
    this.removeFileSync = fse.unlinkSync;

    this.hooks = {
      'offline:start:init': this.writeEnvironmentFile.bind(this),
      'before:deploy:function:deploy': this.writeEnvironmentFile.bind(this),
      'after:deploy:function:deploy': this.deleteEnvironmentFile.bind(this),
      'before:deploy:createDeploymentArtifacts': this.writeEnvironmentFile.bind(this),
      'after:deploy:createDeploymentArtifacts': this.deleteEnvironmentFile.bind(this),
    };
  }

  getPackagedEnvFilePath() {
    return this.getEnvFilePath('.env');
  }

  getEnvFilePath(envFile) {
    return path.join(this.serverless.config.servicePath, envFile);
  }

  getConfig() {
    return this.serverless.service.custom.packageEnv;
  }

  writeEnvironmentFile() {
    const config = this.getConfig();

    if (config && config.fileName) {
      const envFilePath = this.getEnvFilePath(config.fileName);
      const packagedEnvPath = this.getPackagedEnvFilePath();
      this.copyFileSync(envFilePath, packagedEnvPath);

      this.serverless.cli.log(`Wrote ${config.fileName} file to .env`);
    } else {
      this.serverless.cli.log(`No env file was configured`);
    }
  }

  deleteEnvironmentFile() {
    const envPath = this.getPackagedEnvFilePath();
    try {
      this.removeFileSync(envPath);
    } catch (err) { // eslint-disable-line no-empty
    }
  }
}

module.exports = Plugin;
