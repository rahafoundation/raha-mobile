import RNFirebase from "react-native-firebase";
import firebase from "firebase";

import { config } from "./data/config";
import { Platform } from "react-native";

if (Platform.OS !== "android" && Platform.OS !== "ios") {
  throw new Error("Only supports android and ios");
}

export const app = RNFirebase.initializeApp(
  config.firebase[Platform.OS],
  "raha"
);
export const auth = app.auth();
export const storage = app.storage();

export const webFirebase = firebase.initializeApp(config.firebase[Platform.OS]);
export const webAuth = webFirebase.auth();
export const webStorage = webFirebase.storage();
