export const getUniqueClasses = (classes) => {
  let obj = {}
  classes
    .filter((cls) => cls.id && cls.id !== '')
    .filter((cls) => cls.name && cls.name.trim() !== '')
    .forEach((cls) => {
      obj[cls.id] = cls
    })
  return Object.keys(obj)
    .map((id) => obj[id])
    .sort((a, b) => a.id.localeCompare(b.id))
}

export const NEO4J_URI = process.env.REACT_APP_NEO4J_URI || 'localhost:7687'
export const NEO4J_USER = process.env.REACT_APP_NEO4J_USER || 'neo4j'
export const NEO4J_PASSWORD = process.env.REACT_APP_NEO4J_PASSWORD || 'neo4j'
