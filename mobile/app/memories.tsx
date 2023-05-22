import { useEffect, useState } from "react";

import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { format } from "date-fns";

import { Feather } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import NLWLogo from "../src/assets/logo-nlw-spacetime.svg";
import { api } from "../src/lib/api";
import { ptBR } from "date-fns/locale";

type Memory = {
  id: string;
  excerpt: string;
  coverUrl: string;
  createdAt: string;
};

export default function Memories() {
  const [memories, setMemories] = useState<Memory[]>([]);

  const { bottom, top } = useSafeAreaInsets();
  const router = useRouter();

  async function signOut() {
    await SecureStore.deleteItemAsync("token");

    router.push("/");
  }

  async function fetchMemories() {
    const token = await SecureStore.getItemAsync("token");

    const response = await api.get("/memories", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(response.data);
    setMemories(response.data);
  }

  useEffect(() => {
    fetchMemories();
  }, []);

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingBottom: bottom, paddingTop: top }}
    >
      <View className="mt-4 flex-row items-center justify-between px-8">
        <NLWLogo />
        <View className="flex-row gap-2">
          <TouchableOpacity
            className="w-10 h-10 items-center justify-center rounded-full bg-red-500"
            onPress={signOut}
          >
            <Feather name="log-out" size={16} color="#000" />
          </TouchableOpacity>
          <Link href="/new" asChild>
            <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full bg-green-500">
              <Feather name="plus" size={16} color="#000" />
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      <View className="mt-6 space-y-10">
        {memories.map((memory) => (
          <View className="space-y-4" key={memory.id}>
            <View className="flex-row items-center gap-2">
              <View className="w-5 h-px bg-gray-50" />
              <Text className="font-body text-xs text-gray-100">
                {format(new Date(memory.createdAt), "dd 'de' MMMM',' yyyy", {
                  locale: ptBR,
                })}
              </Text>
            </View>
            <View className="space-y-4 px-8">
              <Image
                source={{
                  uri: memory.coverUrl,
                }}
                className="aspect-video w-full rounded-lg"
                alt=""
              />
              <Text className="font-body text-base leading-relaxed text-gray-100">
                {memory.excerpt}
              </Text>
              <Link href="/memories/id" asChild>
                <TouchableOpacity className="flex-row items-center gap-2">
                  <Text className="font-body text-sm text-gray-200">
                    Ler mais
                  </Text>
                  <Feather name="arrow-right" size={16} color="#9e9ea0" />
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
