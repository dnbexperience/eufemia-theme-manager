export function waitForPromise(promise) {
  let status = 'pending'
  let response

  const suspender = promise.then(
    (res) => {
      status = 'success'
      response = res
    },
    (err) => {
      status = 'error'
      response = err
    }
  )

  return () => {
    switch (status) {
      case 'pending':
        throw suspender
      case 'error':
        throw response
      default:
        return response
    }
  }
}

export function applyFilter(filter, list) {
  if (filter) {
    if (filter?.value?.length > 0) {
      const endsWithWhiteSpace = /\s$/.test(filter.value)
      const listOfSearchValues = filter.value.split(/\s+/g)
      list = list.filter(({ key }) => {
        if (listOfSearchValues.length > 0) {
          return listOfSearchValues.some((item) => {
            return key.includes(item)
          })
        } else {
          if (endsWithWhiteSpace) {
            return new RegExp(`.*${filter.value.trim()}$`).test(key)
          }
          return key.includes(filter.value.trim())
        }
      })
    }

    if (filter?.active) {
      list = list.filter(({ change }) => {
        return change
      })
    }
  }

  return list
}
