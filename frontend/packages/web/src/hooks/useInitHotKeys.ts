import { useHotKey } from "@lcp/hooks";
import { message } from "antd";
import { HotkeysEvent, KeyHandler } from "hotkeys-js";

import { useAppDispatch, useAppSelector } from "../store";
import {
  setCopiedComponent,
  pasteCopiedComponent,
  deleteComponent,
} from "../routes/editor/editor.reducer";

type MoveDirection = "up" | "down" | "left" | "right";

const wrap = (callback: KeyHandler) => {
  return (e: KeyboardEvent, event: HotkeysEvent) => {
    e.preventDefault();
    callback(e, event);
  };
};

export default function useInitHotKeys() {
  const { currentComponent, copiedComponent } = useAppSelector(
    (state) => state.editor
  );
  const dispatch = useAppDispatch();
  const move = (direction: MoveDirection) => {
    return () => {
      switch (direction) {
        case "up":
          console.log("asdf");
          break;
        case "down":
          break;
        case "left":
          break;
        case "right":
          break;
        default:
          break;
      }
    };
  };

  useHotKey(
    "ctrl+c, command+c",
    () => {
      if (currentComponent) {
        message.success("已拷贝当前图层", 1);
        dispatch(setCopiedComponent(currentComponent));
      }
    },
    [currentComponent]
  );

  useHotKey(
    "ctrl+v, command+v",
    () => {
      if (copiedComponent) {
        dispatch(pasteCopiedComponent(copiedComponent));
        message.success("已粘贴图层", 1);
      }
    },
    [copiedComponent]
  );

  useHotKey(
    "delete",
    () => {
      if (currentComponent) {
        dispatch(deleteComponent(currentComponent.id));
      }
    },
    [currentComponent]
  );

  useHotKey(
    "up",
    wrap(() => {
      move("up");
    }),
    [currentComponent]
  );

  useHotKey(
    "down",
    wrap(() => {
      move("down");
    }),
    [currentComponent]
  );

  useHotKey(
    "left",
    wrap(() => {
      move("left");
    }),
    [currentComponent]
  );

  useHotKey(
    "right",
    wrap(() => {
      move("right");
    }),
    [currentComponent]
  );
}
