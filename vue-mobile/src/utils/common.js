export const pickHighestOrder = (objects, order) => {
  for (const name of order) {
    const item = objects.find((obj) => (obj.pageName ?? obj.name) === name)
    if (item) {
      return item
    }
  }

  return objects[0] ?? null
}
