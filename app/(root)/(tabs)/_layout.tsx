import { icons } from '@/constants';
import { Tabs } from 'expo-router';
import { Image, ImageSourcePropType, View } from 'react-native';
import 'react-native-reanimated';

const TabIcon = ({
  source,
  focused,
}: { source: ImageSourcePropType; focused: boolean }) => (
  <View
    className={`flex flex-row justify-center items-center rounded-full mt-10 ${
      focused ? 'bg-general-300' : ''
    }`}
  >
    <View
      className={`rounded-full w-12 h-12 items-center justify-center ${
        focused ? 'bg-[#5380b6]' : ''
      } `}
    >
      <Image
        source={source}
        resizeMode="contain"
        className="w-7 h-7"
        style={{ tintColor: 'white' }} // ✅ CORREÇÃO
      />
    </View>
  </View>
);

const Layout = () => (
  <Tabs
    screenOptions={{
      tabBarActiveTintColor: 'white',
      tabBarInactiveTintColor: 'white',
      tabBarShowLabel: false,

      tabBarStyle: {
        backgroundColor: '#333333',
        borderRadius: 50,
        paddingBottom: 0,
        overflow: 'hidden',
        marginHorizontal: 20,
        marginBottom: 20,
        height: 78,
        display: 'flex',
        justifyContent: 'space-btween',
        alignItems: 'center',
        flexDirection: '',
        position: 'absolute',
      },
    }}
  >
    <Tabs.Screen
      name="home"
      options={{
        title: 'Home',
        headerShown: false,
        tabBarIcon: ({ focused }: { focused: boolean }) => (
          <TabIcon focused={focused} source={icons.home} />
        ),
      }}
    />


    <Tabs.Screen
      name="chat"
      options={{
        title: 'Chat',
        headerShown: false,
        tabBarIcon: ({ focused }: { focused: boolean }) => (
          <TabIcon focused={focused} source={icons.chat} />
        ),
      }}
    />
      <Tabs.Screen
        name="config"
        options={{
          title: 'Config',
          headerShown: false,
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <TabIcon focused={focused} source={icons.lock} />
          ),
        }}
      />

    <Tabs.Screen
      name="profile"
      options={{
        title: 'Perfil',
        headerShown: false,
        tabBarIcon: ({ focused }: { focused: boolean }) => (
          <TabIcon focused={focused} source={icons.profile} />
        ),
      }}
    />
  </Tabs>
);

export default Layout;
