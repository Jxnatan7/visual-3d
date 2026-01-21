import React, { useState } from "react";
import { Dimensions } from "react-native";
import { RestyleContainer } from "@/components/restyle/Container";
import { Box, RestyleFlatList, Text } from "@/components/restyle";
import { RestyleCard } from "@/components/restyle/Card";
import { IconButton } from "@/components/theme/IconButton";
import { MaterialIcons } from "@expo/vector-icons";
import { ModelImage } from "@/components/theme/ModelImage";
import { useRouter } from "expo-router";
import { useAuthActions, useUser } from "@/contexts/AuthProvider";
import { ActionModal } from "@/components/theme/ActionModal";

const MOCK_DATA = [
  {
    id: "1",
    title: "Man Avatar 3D",
    date: "2 hours ago",
    image:
      "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Man%20Raising%20Hand.png",
    hasNotification: false,
  },
  {
    id: "2",
    title: "Chrome Head (Robot)",
    date: "5 days ago",
    image:
      "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Robot.png",
    hasNotification: true,
  },
  {
    id: "3",
    title: "Running Shoe",
    image:
      "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Running%20Shoe.png",
    hasNotification: false,
  },
  {
    id: "4",
    title: "Crystal Ball",
    image:
      "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Crystal%20Ball.png",
    hasNotification: false,
  },
  {
    id: "5",
    title: "Rocket 3D",
    image:
      "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Rocket.png",
    hasNotification: false,
  },
  {
    id: "6",
    title: "Shield Icon",
    image:
      "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Shield.png",
    hasNotification: false,
  },
  {
    id: "7",
    title: "Crystal Ball",
    image:
      "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Crystal%20Ball.png",
    hasNotification: false,
  },
  {
    id: "8",
    title: "Rocket 3D",
    image:
      "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Rocket.png",
    hasNotification: false,
  },
  {
    id: "9",
    title: "Shield Icon",
    image:
      "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Shield.png",
    hasNotification: false,
  },
];

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function DashboardScreen() {
  const user = useUser();
  const { logout } = useAuthActions();
  const { push } = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const CARD_WIDTH = (SCREEN_WIDTH - 56) / 2;

  return (
    <RestyleContainer
      variant="screen"
      flex={1}
      backgroundColor="mainBackground"
    >
      <RestyleCard
        variant="header"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        marginTop="m"
        paddingHorizontal="m"
      >
        <Box alignItems="flex-start">
          <Text
            variant="header"
            fontSize={22}
            fontWeight="bold"
            color="mainText"
          >
            Aura3D
          </Text>
          <Text variant="body" fontSize={12} color="gray100">
            Create 3D Models
          </Text>
        </Box>
        <IconButton
          onPress={() => (user ? setOpenModal(true) : push("/login"))}
          icon={
            <Box
              width={32}
              height={32}
              borderRadius={10}
              backgroundColor="backgroundDark"
              alignItems="center"
              justifyContent="center"
              marginLeft="s"
            >
              <MaterialIcons name="person" size={20} color="#fff" />
            </Box>
          }
        />
      </RestyleCard>

      <Box flexDirection="row" justifyContent="flex-start" width="100%" mt="l">
        <Text variant="subHeader" fontWeight="bold" color="gray100">
          6{" "}
        </Text>
        <Text variant="body" color="gray100">
          Models
        </Text>
      </Box>
      <Text
        variant="subHeader"
        fontSize={18}
        fontWeight="bold"
        color="mainText"
        alignSelf="center"
      >
        Recent Creations
      </Text>

      <RestyleFlatList
        variant="models"
        showsVerticalScrollIndicator={false}
        data={MOCK_DATA}
        keyExtractor={(item: any) => item.id.toString()}
        renderItem={({ item, index }: any) => (
          <RestyleCard
            key={item.id.toString()}
            variant="model"
            width={CARD_WIDTH}
            height={CARD_WIDTH}
            marginTop={index % 2 === 0 ? "l" : "none"}
            marginBottom="minus"
          >
            <ModelImage
              motiProps={{
                onPress: () => {
                  push({
                    pathname: "/model-view",
                    params: {
                      id: item.id,
                    },
                  });
                },
              }}
              uri={item.image}
            />
          </RestyleCard>
        )}
        horizontal={false}
        numColumns={2}
        contentContainerStyle={{
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 16,
          paddingBottom: 40,
        }}
      />
      <ActionModal
        visible={openModal}
        onClose={() => setOpenModal(false)}
        title="Aura3D"
        description="Deseja realmente encerrar a sessão?"
        onConfirm={() => {
          logout();
          setOpenModal(false);
          push("/login");
        }}
        confirmText="Sair da conta"
      />
    </RestyleContainer>
  );
}
