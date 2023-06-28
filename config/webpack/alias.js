const path = require("path");

module.exports = {
  resolve: {
    alias: {
      apis: "src/apis",
      common: "src/common",
      components: "src/components",
      neetoui: "@bigbinary/neetoui",
      neetoicons: "@bigbinary/neeto-icons",
      lib: "src/lib",
      hooks: "src/hooks",
      stores: "src/stores",
      images: path.resolve(__dirname, "../", "../", "app/assets/images"),
      channels: "src/channels",
    },
  },
};
