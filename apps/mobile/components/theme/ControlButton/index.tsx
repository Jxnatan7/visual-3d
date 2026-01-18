import { Box, RestyleTouchableOpacity, Text } from "@/components/restyle";
import React from "react";
import { ViewerController } from "../useViewerController";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";

export type ControlButtonProps = {
  label: string;
  onPress: () => void;
  variant?: "default" | "danger";
};

export const ControlButton = React.memo(
  ({ label, onPress, variant = "default" }: ControlButtonProps) => (
    <RestyleTouchableOpacity
      style={[styles.button, variant === "danger" && styles.resetButton]}
      onPress={onPress}
      activeOpacity={0.7}
      hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
    >
      <Text style={styles.buttonText}>{label}</Text>
    </RestyleTouchableOpacity>
  ),
);

export type DirectionalPadProps = {
  controller: ViewerController;
  style?: StyleProp<ViewStyle>;
};

export const DirectionalPad = ({ controller, style }: DirectionalPadProps) => {
  const { setDirection, resetRotation } = controller;
  const speed = 0.01;

  return (
    <Box style={[styles.controlsContainer, style]}>
      <Box style={styles.buttonRow}>
        <ControlButton label="↖" onPress={() => setDirection(-speed, -speed)} />
        <ControlButton label="↑" onPress={() => setDirection(-speed, 0)} />
        <ControlButton label="↗" onPress={() => setDirection(-speed, speed)} />
      </Box>

      <Box style={styles.buttonRow}>
        <ControlButton label="←" onPress={() => setDirection(0, -speed)} />
        <ControlButton label="R" onPress={resetRotation} variant="danger" />
        <ControlButton label="→" onPress={() => setDirection(0, speed)} />
      </Box>

      <Box style={styles.buttonRow}>
        <ControlButton label="↙" onPress={() => setDirection(speed, -speed)} />
        <ControlButton label="↓" onPress={() => setDirection(speed, 0)} />
        <ControlButton label="↘" onPress={() => setDirection(speed, speed)} />
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  controlsContainer: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    zIndex: 10,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  button: {
    width: 50,
    height: 50,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  resetButton: {
    backgroundColor: "rgba(255, 100, 100, 0.3)",
    borderColor: "rgba(255, 100, 100, 0.5)",
    borderWidth: 1,
  },
  buttonText: { color: "white", fontSize: 18, fontWeight: "bold" },
});
