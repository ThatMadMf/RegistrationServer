function toJson (user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email
  }
}

module.exports = { toJson }
