import { useMemo, useRef } from "react";
import { PanResponder, PanResponderInstance } from "react-native";

export type Vec2 = { x: number; y: number };

export type ViewerController = {
  rotationRef: React.MutableRefObject<Vec2>;
  buttonDirection: React.MutableRefObject<Vec2>;
  isInteracting: React.MutableRefObject<boolean>;
  panResponder: PanResponderInstance;
  setDirection: (x: number, y: number) => void;
  resetRotation: () => void;
  config: {
    autoRotate: boolean;
    rotationSensitivity: number;
  };
};

export type UseViewerControllerProps = {
  initialRotation?: [number, number];
  rotationSensitivity?: number;
  autoRotate?: boolean;
};

export const useViewerController = ({
  initialRotation = [0, 0],
  rotationSensitivity = 0.005,
  autoRotate = true,
}: UseViewerControllerProps): ViewerController => {
  const rotationRef = useRef<Vec2>({
    x: initialRotation[0],
    y: initialRotation[1],
  });
  const buttonDirection = useRef<Vec2>({ x: 0, y: 0 });
  const isInteracting = useRef(false);

  const lastGesturePos = useRef<Vec2>({ x: 0, y: 0 });

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (_, state) => {
          isInteracting.current = true;
          buttonDirection.current = { x: 0, y: 0 };
          lastGesturePos.current = { x: state.x0, y: state.y0 };
        },
        onPanResponderMove: (_, state) => {
          const sensitivity = rotationSensitivity * 2;

          const deltaX = state.moveX - lastGesturePos.current.x;
          const deltaY = state.moveY - lastGesturePos.current.y;

          rotationRef.current.y += deltaX * sensitivity;
          rotationRef.current.x += deltaY * sensitivity;

          lastGesturePos.current = { x: state.moveX, y: state.moveY };
        },
        onPanResponderRelease: () => {
          isInteracting.current = false;
        },
        onPanResponderTerminate: () => {
          isInteracting.current = false;
        },
      }),
    [rotationSensitivity],
  );

  const setDirection = (x: number, y: number) => {
    buttonDirection.current = { x, y };
  };

  const resetRotation = () => {
    buttonDirection.current = { x: 0, y: 0 };
    rotationRef.current = { x: initialRotation[0], y: initialRotation[1] };
  };

  return {
    rotationRef,
    buttonDirection,
    isInteracting,
    panResponder,
    setDirection,
    resetRotation,
    config: { autoRotate, rotationSensitivity },
  };
};
