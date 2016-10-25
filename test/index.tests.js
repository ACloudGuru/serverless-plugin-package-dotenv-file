'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');

const path = require('path');

const Plugin = require('../src');

describe('#index', function() {
  const testServicePath = path.join(__dirname, '.tmp');
  const testEnvFile = '.env-prod';
  const expectedPackageEnvPath = path.join(testServicePath, '.env');
  const expectedTestEnvPath = path.join(testServicePath, testEnvFile);

  let plugin = null;
  let serverless = null;
  let copyFileSyncStub = null;
  let removeFileSyncStub = null;

  beforeEach(() => {
    serverless = {
      cli: { log: console.log },
      config: {
        servicePath: testServicePath
      },
      service: {
        custom: {
          packageEnv: {
            fileName: testEnvFile
          }
        }
      }
    };

    plugin = new Plugin(serverless, {});

    copyFileSyncStub = sinon.stub(plugin, 'copyFileSync');
    removeFileSyncStub = sinon.stub(plugin, 'removeFileSync');
  });

  it('should get packaged env path', () => {
    const packagedEnvPath = plugin.getPackagedEnvFilePath();
    expect(packagedEnvPath).to.equal(expectedPackageEnvPath);
  });

  it('should get env path', () => {
    const envFile = '.env-prod';
    const envPath = plugin.getEnvFilePath(envFile);
    expect(envPath).to.equal(expectedTestEnvPath);
  });

  it('should get config', () => {
    const config = plugin.getConfig();
    expect(config).to.equal(serverless.service.custom.packageEnv);
  });

  it('should write env file', () => {
    plugin.writeEnvironmentFile();

    expect(copyFileSyncStub.calledOnce).to.equal(true);
    expect(copyFileSyncStub.args[0][0]).to.equal(expectedTestEnvPath);
    expect(copyFileSyncStub.args[0][1]).to.equal(expectedPackageEnvPath);
  });

  it('should remove env file', () => {
    plugin.deleteEnvironmentFile();

    expect(removeFileSyncStub.calledOnce).to.equal(true);
    expect(removeFileSyncStub.args[0][0]).to.equal(expectedPackageEnvPath);
  });
});
