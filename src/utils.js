export const getUniqueClasses = (classes) => {
  let obj = {}
  classes
    .filter((cls) => cls.id && cls.id !== '')
    .filter((cls) => cls.name && cls.name.trim() !== '')
    .forEach((cls) => {
      obj[cls.id] = cls
    })
  return Object.keys(obj)
    .map((id) => {
      return obj[id]
    })
    .sort((a, b) => a.id.localeCompare(b.id))
}
