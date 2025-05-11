// import { Drawer } from "expo-router/drawer";
// import Icon from "react-native-vector-icons/MaterialIcons";
// export default function DrawerLayout() {
//   return (
//     <Drawer>
//       <Drawer.Screen
//         name="(Tab)"
//         options={{
//           title: "Dashboard",
//           drawerIcon: ({ color, size }) => (
//             <Icon name="dashboard" size={size} color={color} />
//           ),
//         }}
//       />
//       <Drawer.Screen
//         name="Contectmaster"
//         options={{
//           title: "Contectmaster",
//           drawerIcon: ({ color, size }) => (
//             <Icon name="contacts" size={size} color={color} />
//           ),
//         }}
//       />

//       <Drawer.Screen
//         name="Refmaster"
//         options={{
//           title: " Refrencemaster",
//           drawerIcon: ({ color, size }) => (
//             <Icon name="bookmark" size={size} color={color} />
//           ),
//         }}
//       />

//       <Drawer.Screen name="Action" options={{ title: "Actionsmaster",drawerIcon: ({ color, size }) => (
//             <Icon name="check-circle" size={size} color={color} />
//           ), }} />

//       <Drawer.Screen name="Product" options={{ title: " Productmaster",drawerIcon: ({ color, size }) => (
//             <Icon name="category" size={size} color={color} />
//           ), }} />

//       <Drawer.Screen name="Citymster" options={{ title: " Citymaster",drawerIcon: ({ color, size }) => (
//             <Icon name="location-city" size={size} color={color} />
//           ), }} />

//       <Drawer.Screen name="Addlocation" options={{title:"Addlocationmaster",drawerIcon: ({ color, size }) => (
//             <Icon name="location-on" size={size} color={color} />
//           ),}}/>

//       <Drawer.Screen name="Statemaster" options={{title:" statemaster",drawerIcon: ({ color, size }) => (
//             <Icon name="map" size={size} color={color} />
//           ),}}/>
//     </Drawer>
//   );
// }
import { Drawer } from "expo-router/drawer";
import Icon from "react-native-vector-icons/MaterialIcons";
import CustomDrawerContent from "../../components/CostemDrawer"; // Adjust path as needed

export default function DrawerLayout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerActiveTintColor: "#e74c3c",
        drawerInactiveTintColor: "#333",
        headerStyle: { backgroundColor: "#3498db" },
        headerTintColor: "#fff",
        drawerLabelStyle: { fontWeight: "bold" },
      }}
    >
      <Drawer.Screen
        name="(Tab)"
        options={{
          title: "Dashboard",
          drawerIcon: ({ color, size }) => (
            <Icon name="dashboard" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Contectmaster"
        options={{
          title: "Contact Master",
          drawerIcon: ({ color, size }) => (
            <Icon name="contacts" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Refmaster"
        options={{
          title: "Reference Master",
          drawerIcon: ({ color, size }) => (
            <Icon name="bookmark" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Action"
        options={{
          title: "Action Master",
          drawerIcon: ({ color, size }) => (
            <Icon name="check-circle" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Product"
        options={{
          title: "Product Master",
          drawerIcon: ({ color, size }) => (
            <Icon name="category" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Citymster"
        options={{
          title: "City Master",
          drawerIcon: ({ color, size }) => (
            <Icon name="location-city" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Addlocation"
        options={{
          title: "Add Location",
          drawerIcon: ({ color, size }) => (
            <Icon name="location-on" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Statemaster"
        options={{
          title: "State Master",
          drawerIcon: ({ color, size }) => (
            <Icon name="map" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="inqueryes"
        options={{
          drawerItemStyle: { display: "none" }, // 👈 hides from drawer
          title: "inqueryes", // Optional: for internal routing
        }}
      />

      <Drawer.Screen
        name="EnqueryEditform"
        options={{
          drawerItemStyle: { display: "none" }, // 👈 hides from drawer
          title: "EnqueryEditform", // Optional: for internal routing
        }}
      />

      <Drawer.Screen
        name="Followup"
        options={{
          drawerItemStyle: { display: "none" }, // 👈 hides from drawer
          title: "Followup", // Optional: for internal routing
        }}
      />
      <Drawer.Screen
        name="EnqyueryDetails"
        options={{
          drawerItemStyle: { display: "none" }, // 👈 hides from drawer
          title: "EnqyueryDetails", // Optional: for internal routing
        }}
      />
    </Drawer>
  );
}
