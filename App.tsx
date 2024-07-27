import React, { useEffect, useState } from 'react';
import { Image } from 'react-native';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/screens/LoginScreen/LoginScreen';
import { LoginOTP } from './src/screens/OtpScreen/OtpScreen';
import styles from './src/assets/theme/Mainstyles';
import HomeScreen from './src/screens/HomeScreen/HomeScreen';
import WarrantyRegistrationForm from './src/screens/RegistrationScreen/RegistrationScreen';
import MPinLoginScreen from './src/screens/MPinLoginScreen/MPinLoginScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen/ForgotPasswordScreen';
import Dashboard from './src/screens/DashboardScreen/DashScreen';
import Outbox from './src/screens/OutboxScreen/OutboxScreen';
import AddImage from './src/screens/AddImageScreen/AddImageScreen';
import HelpAndSupport from './src/screens/HelpAndSupportScreen/HelpAndSupportScreen';
import { createDrawerNavigator } from "@react-navigation/drawer";
import MPinCreationScreen from './src/screens/MPinCreationScreen/MPinCreationScreen';
import ResetPasswordScreen from './src/screens/ResetPasswordScreen/ResetPasswordScreen';
import MasterSync from './src/screens/MasterSyncScreen/MasterSyncScreen';
import FeedbackScreen from './src/screens/FeedbackScreen/FeedbackScreen';
import DefaultSettingScreen from './src/screens/DefaultSettingScreen/DefaultSettingScreen';
import ProfileScreen from './src/screens/Profile/ProfileScreen';
import ViewPDF from './src/screens/ViewPDF/ViewPDF';
import { setupLoginDatabase, getAllLoginItems, insertLoginItems } from "./src/db/Login/Login"
import SplashScreen from './src/screens/SplashScreen/SplashScreen';
import Logout from './src/screens/Logout/Logout';
import UploadMissingImage from './src/screens/UploadMissingImage/UploadMissingImage';
import LoginWithOTP from './src/screens/LoginWihtOTP/LoginWithOTP';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function LogoTitle() {
  return (
    <Image
      style={styles.yokohamaLogo}
      source={require('./src/assets/images/logo/logo4.png')}
    />
  );
}

const DrawerNavigator = () => (
  <Drawer.Navigator initialRouteName="Home"
    screenOptions={{
      headerShown: true,
      drawerStyle: { backgroundColor: 'black', width: 200, },
      drawerLabelStyle: { color: 'white' },
      drawerActiveTintColor: 'red',
    }}
  >

    <Drawer.Screen name="Home" component={HomeScreen}
      options={{
        headerTintColor: 'white',
        headerTitleAlign: 'center',
        headerTitle: () => <LogoTitle />,
        headerStyle: {
          backgroundColor: 'black',
        },
      }}
    />

    <Drawer.Screen name="Profile" component={ProfileScreen}
      options={{
        headerTintColor: 'white',
        headerTitleAlign: 'center',
        headerTitle: () => <LogoTitle />,
        headerStyle: {
          backgroundColor: 'black',
        },
      }}

    />

    {/* <Drawer.Screen name='Registration' component={WarrantyRegistrationForm} 
     options={{
      headerTintColor:'white',
      headerTitleAlign:'center',
      headerTitle: () => <LogoTitle />,
      headerStyle:{
        backgroundColor : 'black',
      }
    }}
    /> */}

    {/* <Drawer.Screen name='Dashboard' component={Dashboard}
        options={{
          headerTintColor:'white',
          headerTitleAlign:'center',
          headerTitle: () => <LogoTitle />,
          headerStyle:{
            backgroundColor : 'black',
          }
        }}
        /> */}

    <Drawer.Screen name='Masters' component={MasterSync}
      options={{
        title: 'Masters',
        headerTintColor: 'white',
        headerTitleAlign: 'center',
        headerTitle: () => <LogoTitle />,
        headerStyle: {
          backgroundColor: 'black',
        }
      }}
    />

    {/* <Drawer.Screen name='Outbox' component={Outbox}
        options={{
          title : 'Draft',
          headerTintColor:'white',
          headerTitleAlign:'center',
          headerTitle: () => <LogoTitle />,
          headerStyle:{
            backgroundColor : 'black',
          }
        }}
        /> */}

    {/* <Drawer.Screen name='AddImage' component={AddImage}
          options={{
            headerTintColor:'white',
            headerTitleAlign:'center',
            headerTitle: () => <LogoTitle />,
            headerStyle:{
              backgroundColor : 'black',
            }
          }}
          /> */}



    {/* <Drawer.Screen name='ChangePassword' component={ResetPasswordScreen}
      options={{
        title: 'Change Password',
        headerTintColor: 'white',
        headerTitleAlign: 'center',
        headerTitle: () => <LogoTitle />,
        headerStyle: {
          backgroundColor: 'black',
        }
      }}
    /> */}

    <Drawer.Screen name='HelpAndSupport' component={HelpAndSupport}
      options={{
        title: 'Help & Support',
        headerTintColor: 'white',
        headerTitleAlign: 'center',
        headerTitle: () => <LogoTitle />,
        headerStyle: {
          backgroundColor: 'black',
        }
      }}
    />

    <Drawer.Screen name='Default Setting' component={DefaultSettingScreen}
      options={{
        title: 'Settings',
        headerTintColor: 'white',
        headerTitleAlign: 'center',
        headerTitle: () => <LogoTitle />,
        headerStyle: {
          backgroundColor: 'black',
        }
      }}
    />

    {/* <Drawer.Screen name='Feedback' component={FeedbackScreen}
          options={{
            title:'Feedback',
            headerTintColor:'white',
            headerTitleAlign:'center',
            headerTitle: () => <LogoTitle />,
            headerStyle:{
              backgroundColor : 'black',
            }
          }}
          /> */}

    <Drawer.Screen name='Logout' component={Logout}
      options={{
        headerTintColor: 'white',
        headerTitleAlign: 'center',
        headerTitle: () => <LogoTitle />,
        headerStyle: {
          backgroundColor: 'black',
        }
      }}
    />
  </Drawer.Navigator>
);

const App = () => {
  return (

    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: true }} initialRouteName='SplashScreen'>

        <Stack.Screen name='SplashScreen' component={SplashScreen}
          options={{
            // headerTitle: () => <LogoTitle />,
            headerStyle: {
              backgroundColor: 'black',
            }
          }} />
        <Stack.Screen name='Login' component={Login}
          options={{
            headerTitle: () => <LogoTitle />,
            headerStyle: {
              backgroundColor: 'black',
            }
          }} />
        <Stack.Screen name='MPIN_Login' component={MPinLoginScreen}
          options={{
            headerTitleAlign: 'center',
            headerLeft: () => <></>,
            headerTitle: () => <LogoTitle />,
            headerStyle: {
              backgroundColor: 'black',
            }
          }}
        />
        {/* <Stack.Screen name='LoginOTP' component={LoginOTP}
          options={{
            headerTitleAlign: 'center',
            headerLeft: () => <></>,
            headerTitle: () => <LogoTitle />,
            headerStyle: {
              backgroundColor: 'black',
            }
          }}
        /> */}


        {/* <Stack.Screen name='Forgot_password' component={ForgotPasswordScreen}
          options={{
            headerTintColor: 'white',
            headerTitleAlign: 'center',
            headerLeft: () => <></>,
            headerTitle: () => <LogoTitle />,
            headerStyle: {
              backgroundColor: 'black',
            }
          }}
        /> */}
        <Stack.Screen name='CreateMPIN' component={MPinCreationScreen}
          options={{
            title: 'Create MPIN',
            headerTintColor: 'white',
            headerTitleAlign: 'center',
            headerTitle: () => <LogoTitle />,
            headerStyle: {
              backgroundColor: 'black',
            }
          }}
        />
        <Stack.Screen name='ViewPDF' component={ViewPDF}
          options={{
            headerTintColor: 'white',
            headerTitleAlign: 'center',
            headerLeft: () => <></>,
            headerTitle: () => <LogoTitle />,
            headerStyle: {
              backgroundColor: 'black',
            }
          }}
        />
        <Stack.Screen name='Home' component={HomeScreen}
          options={{
            headerTintColor: 'white',
            headerTitleAlign: 'center',
            headerLeft: () => <></>,
            headerTitle: () => <LogoTitle />,
            headerStyle: {
              backgroundColor: 'black',
            }
          }}
        />

        <Stack.Screen name='Registration' component={WarrantyRegistrationForm}
          options={{
            headerTintColor: 'white',
            headerTitleAlign: 'center',
            headerTitle: () => <LogoTitle />,
            headerStyle: {
              backgroundColor: 'black',
            }
          }}
        />

        <Stack.Screen name='AddImage' component={AddImage}
          options={{
            headerTintColor: 'white',
            headerTitleAlign: 'center',
            headerTitle: () => <LogoTitle />,
            headerStyle: {
              backgroundColor: 'black',
            }
          }}
        />
        <Stack.Screen name='Outbox' component={Outbox}
          options={{
            title: 'Draft',
            headerTintColor: 'white',
            headerTitleAlign: 'center',
            headerTitle: () => <LogoTitle />,
            headerStyle: {
              backgroundColor: 'black',
            }
          }}
        />

        <Stack.Screen name='Dashboard' component={Dashboard}
          options={{
            headerTintColor: 'white',
            headerTitleAlign: 'center',
            headerTitle: () => <LogoTitle />,
            headerStyle: {
              backgroundColor: 'black',
            }
          }}
        />
        <Stack.Screen name='LoginWithOTP' component={LoginWithOTP}
          options={{
            headerTintColor: 'white',
            headerTitleAlign: 'center',
            headerTitle: () => <LogoTitle />,
            headerStyle: {
              backgroundColor: 'black',
            }
          }}
        />
        <Stack.Screen name='UploadMissingImage' component={UploadMissingImage}
          options={{
            headerTintColor: 'white',
            headerTitleAlign: 'center',
            headerTitle: () => <LogoTitle />,
            headerStyle: {
              backgroundColor: 'black',
            }
          }}
        />
        <Stack.Screen name="HomeDrawer" component={DrawerNavigator}
          options={{
            headerTintColor: 'white',
            headerTitleAlign: 'center',
            // headerLeft: () => <></>,
            //headerTitle: () => <LogoTitle />,
            headerShown: false,
            headerStyle: {
              backgroundColor: 'black',
            }
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>

  );
}



export default App;
