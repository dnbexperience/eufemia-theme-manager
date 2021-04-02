const fs = require('fs')
const dotenv = require('dotenv')
dotenv.config()

const browser = process.env.RUNTIME_BROWSER || 'chrome'

function updateVersion() {
  const pkg = JSON.parse(
    fs.readFileSync(require.resolve('../package.json'), 'utf-8')
  )

  const manifestFile = require.resolve(`../dist-${browser}/manifest.json`)
  const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf-8'))
  manifest.version = pkg.version

  fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2))
}
updateVersion()
