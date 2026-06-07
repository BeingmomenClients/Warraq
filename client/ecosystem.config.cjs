module.exports = {
  apps: [
    {
      name: "book",
      port: "1909",
      exec_mode: "cluster",
      instances: 1,
      script: "./.output/server/index.mjs",
    },
  ],
};
