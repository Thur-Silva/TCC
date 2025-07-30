const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

config.resolver.unstable_conditionNames = ['require', 'react-native', 'default'];
config.resolver.platforms = ['native', 'ios', 'android'];

config.resolver.blockList = [
  /@stripe\/stripe-react-native\/lib\/commonjs\/specs\/NativeCardField.js/,
  /@stripe\/stripe-react-native\/lib\/commonjs\/specs\/NativeCardForm.js/,
];

const nativeWindConfig = withNativeWind(config, { input: './global.css' });

module.exports = nativeWindConfig;
