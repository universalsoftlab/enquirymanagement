import { Tabs } from "expo-router";
import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesome from "react-native-vector-icons/FontAwesome";
const TabsRoute = () => {
  return (
    <Tabs>
      <Tabs.Screen
        name="Home"
        options={{
          headerShown: false,
          tabBarIcon: () => <AntDesign name="home" size={30} color="#900" />,
        }}
      />
      <Tabs.Screen
        name="Add"
        options={{
          headerShown: false,
          tabBarIcon: () => <FontAwesome name="plus" size={30} color="#900" />,
        }}
      />
      <Tabs.Screen
        name="Leades"
        options={{
          headerShown: false,
          tabBarIcon: () => <FontAwesome name="paypal" size={30} color="#900" />,
        }}
      />
    </Tabs>
  );
};
export default TabsRoute;
