import { useState, useEffect } from "react";
import * as Font from "expo-font";
import { Asset } from "expo-asset";
import * as SplashScreen from "expo-splash-screen";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { localFonts, localImages, localModels } from "@/assets";
import { useGLTF } from "@react-three/drei/core";

export default function useAssets() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        await SplashScreen.preventAutoHideAsync();

        const fontPromise = Font.loadAsync({
          ...localFonts,
          ...FontAwesome.font,
        });

        const assetsToCache = [...localImages, ...localModels];

        const cacheAssets = assetsToCache.map((asset) => {
          return Asset.fromModule(asset).downloadAsync();
        });

        const preloadModels = localModels.map((model) => {
          return useGLTF.preload(model);
        });

        await Promise.all([fontPromise, ...cacheAssets, ...preloadModels]);
      } catch (e) {
        console.warn("Erro ao carregar assets:", e);
      } finally {
        setIsReady(true);
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return isReady;
}
