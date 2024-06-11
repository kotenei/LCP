import { CSSProperties } from "react";

export const commonStyle: CSSProperties = {
  // size
  height: 36,
  width: 130,
  paddingLeft: 0,
  paddingRight: 0,
  paddingTop: 0,
  paddingBottom: 0,
  marginLeft: 0,
  marginRight: 0,
  marginTop: 0,
  marginBottom: 0,
  // border type
  borderStyle: "none",
  borderColor: "#000",
  borderWidth: 0,
  borderRadius: 0,
  // shadow and opacity
  opacity: 1,
  boxShadow: "0 0 0 #000000",
  // position and x,y
  position: "absolute",
  left: 100,
  top: 100,
};

export const textStyle: CSSProperties = {
  fontSize: "14px",
  fontFamily: "",
  fontWeight: "normal",
  fontStyle: "normal",
  textDecoration: "none",
  lineHeight: "1",
  textAlign: "center",
  color: "#000000",
  backgroundColor: "",
  ...commonStyle,
};
