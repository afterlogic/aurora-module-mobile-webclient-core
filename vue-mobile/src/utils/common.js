export const pickHighestOrder = (objects, order) => {
  // Initialize a variable to store the lowest index and the corresponding object
  let lowestIndex = 0
  let mostPrefferedRoute = null

  // Loop through the people array
  for (let item of objects) {
    // Get the index of the person's name in the modulesOrder array
    let index = order.indexOf(item.name)

    // If the index is lower than the current lowest index, update the lowest index and the highest order object
    if (index < lowestIndex) {
      lowestIndex = index
      mostPrefferedRoute = item
    }
  }

  return mostPrefferedRoute
}
