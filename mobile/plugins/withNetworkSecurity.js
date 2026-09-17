const { withAndroidManifest, withDangerousMod } = require('@expo/config-plugins')
const fs = require('fs')
const path = require('path')

function withNetworkSecurity(config) {
  config = withAndroidManifest(config, (modConfig) => {
    const application = modConfig.modResults.manifest.application[0]
    application.$['android:usesCleartextTraffic'] = 'true'
    application.$['android:networkSecurityConfig'] = '@xml/network_security_config'
    return modConfig
  })

  return withDangerousMod(config, ['android', async (modConfig) => {
    const resourcesDirectory = path.join(
      modConfig.modRequest.platformProjectRoot,
      'app',
      'src',
      'main',
      'res',
      'xml'
    )
    fs.mkdirSync(resourcesDirectory, { recursive: true })
    fs.copyFileSync(
      path.join(modConfig.modRequest.projectRoot, 'network_security_config.xml'),
      path.join(resourcesDirectory, 'network_security_config.xml')
    )
    return modConfig
  }])
}

module.exports = withNetworkSecurity