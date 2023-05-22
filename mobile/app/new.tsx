import { useState } from "react";

import {
  Image,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Link, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import colors from "tailwindcss/colors";

import { api } from "../src/lib/api";

import NLWLogo from "../src/assets/logo-nlw-spacetime.svg";

export default function NewMemory() {
  const [isPublic, setIsPublic] = useState(false);
  const [content, setContent] = useState("");
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);

  const { bottom, top } = useSafeAreaInsets();
  const router = useRouter();

  async function handleMediaSelection() {
    try {
      const imageSelectionResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (imageSelectionResult.canceled) {
        return;
      }

      setSelectedImageUri(imageSelectionResult.assets[0].uri);
    } catch (error) {
      throw error;
    }
  }

  async function handleMemoryCreation() {
    try {
      const token = await SecureStore.getItemAsync("token");

      let coverUrl = "";

      if (selectedImageUri) {
        const uploadFormData = new FormData();

        uploadFormData.append("file", {
          uri: selectedImageUri,
          name: "image.jpg",
          type: "image/jpeg",
        } as any);

        const uploadResponse = await api.post("/upload", uploadFormData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        coverUrl = uploadResponse.data.fileUrl;

        await api.post(
          "/memories",
          {
            content,
            isPublic,
            coverUrl,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        router.push("/memories");
      }
    } catch (error) {
      throw error;
    }
  }

  return (
    <ScrollView
      className="flex-1 px-8"
      contentContainerStyle={{ paddingBottom: bottom, paddingTop: top }}
    >
      <View className="mt-4 flex-row items-center justify-between">
        <NLWLogo />
        <Link href="/memories" asChild>
          <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full bg-purple-500">
            <Feather name="arrow-left" size={16} color="#fff" />
          </TouchableOpacity>
        </Link>
      </View>

      <View className="mt-6 space-y-6">
        <View className="flex-row items-center gap-2">
          <Switch
            value={isPublic}
            onValueChange={setIsPublic}
            trackColor={{ false: "#767577", true: "#372560" }}
            thumbColor={isPublic ? "#9b79ea" : colors.gray[700]}
          />
          <Text className="font-body text-base text-gray-200">
            Tornar memória pública
          </Text>
        </View>

        <TouchableOpacity
          className="h-32 items-center justify-center rounded-lg border border-dashed border-gray-500 bg-black/20"
          activeOpacity={0.7}
          onPress={handleMediaSelection}
        >
          {selectedImageUri ? (
            <Image
              source={{ uri: selectedImageUri }}
              className="h-full w-full rounded-lg object-cover"
            />
          ) : (
            <View className="flex-row items-center gap-2">
              <Feather name="image" color="#fff" />
              <Text className="font-body text-sm text-gray-200">
                Adicionar foto ou vídeo de capa
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <TextInput
          multiline
          className="p-0 font-body text-lg text-gray-50"
          textAlignVertical="top"
          placeholderTextColor="#56565a"
          placeholder="Sinta-se à vontade para adicionar fotos, vídeos e relatos sobre essa experiência que você quer lembrar para sempre"
          value={content}
          onChangeText={setContent}
        />

        <TouchableOpacity
          activeOpacity={0.7}
          className="items-center self-end rounded-full bg-green-500 px-5 py-2"
          onPress={handleMemoryCreation}
        >
          <Text className="font-alt text-sm uppercase text-black">Salvar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
