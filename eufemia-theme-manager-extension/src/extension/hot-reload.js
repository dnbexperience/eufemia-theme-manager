import browser from '../shared/Browser'

const filesInDirectory = (dir) =>
  new Promise((resolve) =>
    dir.createReader().readEntries((entries) =>
      Promise.all(
        entries
          .filter((e) => e.name[0] !== '.')
          .map((e) =>
            e.isDirectory
              ? filesInDirectory(e)
              : new Promise((resolve) => e.file(resolve))
          )
      )
        .then((files) => [].concat(...files))
        .then(resolve)
    )
  )

const timestampForFilesInDirectory = (dir) =>
  filesInDirectory(dir).then((files) =>
    files.map((f) => f.name + f.lastModifiedDate).join()
  )

const watchChanges = (dir, lastTimestamp) => {
  timestampForFilesInDirectory(dir).then((timestamp) => {
    if (!lastTimestamp || lastTimestamp === timestamp) {
      setTimeout(() => watchChanges(dir, timestamp), 1000) // retry after 1s
    } else {
      browser?.runtime.reload()
    }
  })
}

if (process.env.RUNTIME_EXTENSION_DEV_WATCH) {
  browser?.management?.getSelf((self) => {
    if (self.installType === 'development') {
      if (typeof browser?.runtime?.getPackageDirectoryEntry === 'function') {
        browser.runtime.getPackageDirectoryEntry((dir) => watchChanges(dir))
      }
      browser?.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
        if (tabs[0]) {
          browser?.tabs.reload(tabs[0].id)
        }
      })
    }
  })
}
