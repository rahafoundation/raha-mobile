/**
 * Renders the onboarding camera preview screen which allows a user to record their
 * identity verification video.
 */

import * as React from "react";
import { StyleSheet, View } from "react-native";
import { Camera } from "../../shared/Camera";
import { Text, PageContainer } from "../../shared/elements";
import { fontSizes } from "../../../helpers/fonts";

type OwnProps = {
  verifiedFullName: string;
  onVideoRecorded: (videoUri: string) => void;
};
type OnboardingCameraProps = OwnProps;

export class OnboardingCamera extends React.Component<OnboardingCameraProps> {
  render() {
    return (
      <PageContainer style={styles.container}>
        <Text style={styles.headerText}>
          Please record a video of yourself stating your identity.
        </Text>
        <Camera
          onVideoRecorded={uri => {
            this.props.onVideoRecorded(uri);
          }}
        />
        <View style={styles.promptContainer}>
          <Text style={styles.promptHeader}>Example of what to say:</Text>
          <Text style={styles.promptText}>
            "My name is {this.props.verifiedFullName} and I'm joining Raha
            because I believe every life has value."
          </Text>
        </View>
      </PageContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  headerText: {
    marginBottom: 20,
    textAlign: "center",
    ...fontSizes.medium
  },
  promptHeader: {
    marginTop: 20,
    ...fontSizes.large,
    marginBottom: 12,
    textAlign: "center"
  },
  promptText: {
    ...fontSizes.medium,
    textAlign: "center"
  },
  promptContainer: {
    padding: 8
  }
});
