export const fillErrors = (yupError) => {
  return yupError.inner
    .map((entry) => {
      return { path: entry.path, message: entry.message }
    })
    .reduce((previousValue, currentValue) => {
      const ret = { ...previousValue }
      const previousPathMessages = previousValue[currentValue.path]
      let translatedTxt = currentValue.message;
      if (previousPathMessages) {
        ret[currentValue.path] = previousPathMessages.concat([
          translatedTxt,
        ])
      } else {
        ret[currentValue.path] = [translatedTxt]
      }
      return ret
    }, {})
}