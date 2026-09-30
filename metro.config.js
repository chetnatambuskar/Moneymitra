const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 */
const config = {
  resolver: {
    // Don't watch/bundle the Node.js backend or its node_modules
    blockList: [/[\\/]backend[\\/].*/],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);