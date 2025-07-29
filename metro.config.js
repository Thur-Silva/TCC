// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ajuste aqui para tentar priorizar 'react-native'
config.resolver.unstable_conditionNames = ['require', 'react-native', 'browser', 'default'];

config.resolver.blockList = [
  /@stripe\/stripe-react-native\/lib\/commonjs\/specs\/NativeCardField.js/,
  /@stripe\/stripe-react-native\/lib\/commonjs\/specs\/NativeCardForm.js/,
];

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web' && moduleName.includes('@stripe/stripe-react-native')) {
    console.warn(`[Metro Config] Blocking Stripe module for web: ${moduleName}`);
    return {
      type: 'empty',
      module: {
        path: require.resolve('./emptyModule.js'),
      },
    };
  }
  return context.getDefaultResolveRequest(context, moduleName, platform);
};

module.exports = config;