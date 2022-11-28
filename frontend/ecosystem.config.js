module.exports = {
    apps: [
      {
        name: "TruckersHubFrontend",
        exec_mode: "cluster",
        instances: "max",
        script: "./.output/server/index.mjs"
      }
    ]
  }