import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import {
 Menu,
 MenuProvider,
 MenuOptions,
 MenuOption,
 MenuTrigger,
} from "react-native-popup-menu";
import { icons } from "../constants";

const SimpleMenu = () => {
 return (
   <MenuProvider >
     <Menu>
       <MenuTrigger
         customStyles={{
           triggerWrapper: {
             top: -20,
           },
         }}
       >
        <View className="pt-5">
        <Image source={icons.menu} className="w-5 h-5" resizeMode="contain" />
        </View>
       </MenuTrigger>
       <MenuOptions>
         <MenuOption onSelect={() => alert(`Save`)} text="Save" />
         <MenuOption onSelect={() => alert(`Delete`)} text="Delete" />
       </MenuOptions>
     </Menu>
   </MenuProvider>
 );
};

export default SimpleMenu;