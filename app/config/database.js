var dbSettings = {
  host: '172.22.0.3',
  port: 27017,
  database: 'octopass',
  user: null,
  password: null
}

const createUrl = () => {
  if (!dbSettings.host) {
    throw new Error("No database host given")
  }
  if (!dbSettings.port) {
    dbsettings.port = 27017
  }
  if (!dbSettings.database) {
    throw new Error("No database name given")
  }

  let url = "mongodb://"
  if (dbSettings.user) {
    url += dbSettings.user + ":" + dbSettings.password + "@"
  }
  url += dbSettings.host + ":" + dbSettings.port + "/" + dbSettings.database

  return url
}

module.exports = createUrl()
