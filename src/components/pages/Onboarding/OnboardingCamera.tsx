/**
 * Renders the onboarding camera preview screen which allows a user to record their
 * identity verification video.
 */

import * as React from "react";
import { Text, StyleSheet } from "react-native";
import { Camera } from "../../shared/Camera";
import { RouteName } from "../../shared/Navigation";
import { Member } from "../../../store/reducers/members";
import { NavigationScreenProps } from "react-navigation";

interface NavParams {
  invitingMember?: Member;
  verifiedName?: string;
}
type OnboardingCameraProps = NavigationScreenProps<NavParams>;

export class OnboardingCamera extends React.Component<OnboardingCameraProps> {
  render() {
    let invitingMember = this.props.navigation.getParam("invitingMember");
    let verifiedName = this.props.navigation.getParam("verifiedName");

    if (!invitingMember || !verifiedName) {
      // TODO: Redirect, don't error if any of these params are undefined
      throw new Error("invitingMember or verifiedName not present.");
    }

    return (
      <React.Fragment>
        <Text style={styles.text}>
          Please record a video with {invitingMember.fullName} to verify your
          identity.
        </Text>
        <Camera
          onVideoRecorded={uri => {
            this.props.navigation.navigate(RouteName.VideoPreview, {
              videoUri: uri
            });
          }}
        />
        <Text style={styles.text}>Example of what to say:</Text>
        <Text style={styles.text}>
          {invitingMember.fullName}: "Hi, my name is {invitingMember.fullName},
          and I'm inviting {verifiedName} to Raha."
        </Text>
        <Text style={styles.text}>
          You: "My name is {verifiedName} and I'm joining Raha because I believe
          every life has value."
        </Text>
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    fontSize: 12,
    textAlign: "center"
  }
});
