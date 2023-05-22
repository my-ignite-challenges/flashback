import { useEffect, useState } from "react";

import { ImageBackground } from "react-native";
import { styled } from "nativewind";

import blurBackgroundImage from "../src/assets/bg-blur.png";
import Stripes from "../src/assets/stripes.svg";
import {
  Roboto_400Regular,
  Roboto_700Bold,
  useFonts,
} from "@expo-google-fonts/roboto";
import { BaiJamjuree_700Bold } from "@expo-google-fonts/bai-jamjuree";
import { SplashScreen, Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";

const StyledStripes = styled(Stripes);

export default function Layout() {
  const [isUserAuthenticated, setIsUserAuthenticated] = useState<
    undefined | boolean
  >();

  useEffect(() => {
    SecureStore.getItemAsync("token").then((token) => {
      setIsUserAuthenticated(!!token);
    });
  }, []);

  const [fontsHaveBeenLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
    BaiJamjuree_700Bold,
  });

  if (!fontsHaveBeenLoaded) {
    return <SplashScreen />;
  }

  return (
    <ImageBackground
      source={blurBackgroundImage}
      className="relative flex-1 bg-gray-900"
      imageStyle={{ position: "absolute", left: "-100%" }}
    >
      <StatusBar style="light" translucent />

      <StyledStripes className="absolute left-2" />

      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "transparent" },
          animation: "fade",
        }}
      >
        <Stack.Screen name="index" redirect={isUserAuthenticated} />
        <Stack.Screen name="memories" />
        <Stack.Screen name="new" />
      </Stack>
    </ImageBackground>
  );
}
