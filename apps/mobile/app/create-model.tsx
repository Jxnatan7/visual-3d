import React, { useState } from "react";
import { StyleSheet, Alert, ActionSheetIOS, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Container } from "@/components/theme/Container";
import { Image } from "@/components/theme/Image";
import { Box } from "@/components/restyle";
import Button from "@/components/theme/Button";
import { useRouter } from "expo-router";

export default function CreateModel() {
  const { push } = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const pickImageFromGallery = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        "Permissão necessária",
        "Precisamos de acesso à sua galeria.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permissão necessária", "Precisamos de acesso à sua câmera.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const showImageOptions = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Tirar Foto", "Escolher da Galeria", "Cancelar"],
          cancelButtonIndex: 2,
        },
        (buttonIndex: number) => {
          if (buttonIndex === 0) {
            takePhoto();
          } else if (buttonIndex === 1) {
            pickImageFromGallery();
          }
        },
      );
    } else {
      Alert.alert("Adicionar imagem", "Escolha uma opção:", [
        { text: "Tirar Foto", onPress: takePhoto },
        { text: "Escolher da Galeria", onPress: pickImageFromGallery },
        { text: "Cancelar", style: "cancel" },
      ]);
    }
  };

  return (
    <Container
      variant="screen"
      containerHeaderProps={{
        title: "Criar Modelo",
        titleProps: {},
      }}
      style={styles.contentContainer}
    >
      <Box style={styles.imageContainer}>
        {selectedImage ? (
          <Image
            source={{ uri: selectedImage }}
            width={300}
            height={300}
            contentFit="cover"
            style={{ borderRadius: 10 }}
          />
        ) : (
          <Box style={styles.placeholder} />
        )}
      </Box>

      <Box style={styles.buttonContainer}>
        {selectedImage && (
          <Button
            text="Gerar Modelo 3D"
            variant="success"
            onPress={pickImageFromGallery}
            textProps={{ fontWeight: "bold" }}
          />
        )}

        <Button text="Adicionar Imagem" onPress={showImageOptions} />
      </Box>
    </Container>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  imageContainer: {
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    overflow: "hidden",
  },
  placeholder: {
    width: 300,
    height: 300,
    backgroundColor: "#f0f0f0",
  },
  buttonContainer: {
    width: "100%",
    maxWidth: 300,
    alignItems: "center",
    gap: 10,
  },
});
