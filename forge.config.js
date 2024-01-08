export const packagerConfig = {
  name: "webDeskTop",
  icon: "src/assets/icon/favicon",
  platform: "all",
};
export const rebuildConfig = {};
export const makers = [
  {
    name: "@electron-forge/maker-squirrel",
    config: {
      authors: "GGMGG",
    },
  },
  {
    name: "@electron-forge/maker-zip",
    platforms: ["darwin"],
  },
  {
    name: "@electron-forge/maker-deb",
    config: {
      authors: "GGMGG",
    },
  },
  {
    name: "@electron-forge/maker-rpm",
    config: {
      authors: "GGMGG",
    },
  },
];
