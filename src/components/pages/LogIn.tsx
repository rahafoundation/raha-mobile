import * as React from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { connect, MapDispatchToProps, MapStateToProps } from "react-redux";
import { NavigationScreenProp } from "react-navigation";
import { GoogleSigninButton } from "react-native-google-signin";

import {
  googleLogIn,
  facebookLogIn,
  AuthMethod
} from "../../store/actions/authentication";
import { RahaState, RahaThunkDispatch } from "../../store";
import { RouteName } from "../shared/Navigation";
import { getLoggedInFirebaseUserId } from "../../store/selectors/authentication";
import { getMembersByIds } from "../../store/selectors/members";

type OwnProps = {
  navigation: NavigationScreenProp<{}>;
};

type StateProps = {
  isLoggedIn: boolean;
  hasAccount: boolean;
  existingAuthMethod?: AuthMethod;
};

type DispatchProps = {
  googleLogIn: () => void;
  facebookLogIn: () => void;
};

type LogInProps = OwnProps & StateProps & DispatchProps;

class LogInView extends React.Component<LogInProps> {
  componentDidUpdate() {
    if (!this.props.isLoggedIn) {
      return;
    }
    if (this.props.hasAccount) {
      this.props.navigation.navigate(RouteName.Home);
      return;
    }
    this.props.navigation.navigate(RouteName.OnboardingSplash);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>This is the login page.</Text>
        <Button
          title="Cancel"
          onPress={() => this.props.navigation.navigate(RouteName.Home)}
        />
        {this.props.existingAuthMethod && (
          <Text>
            It appears you have created an account with that email address
            before; please log in using a different method than{" "}
            {this.props.existingAuthMethod}.
          </Text>
        )}
        <GoogleSigninButton
          style={{ width: 230, height: 48 }}
          color={GoogleSigninButton.Color.Dark}
          size={GoogleSigninButton.Size.Standard}
          onPress={this.props.googleLogIn}
        />
        {/* <Button
          title="Log in with Facebook"
          onPress={this.props.facebookLogIn}
        /> */}
        <Button
          title="Sign Up"
          onPress={() =>
            this.props.navigation.navigate(RouteName.OnboardingSplash)
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});

const mapStateToProps: MapStateToProps<
  StateProps,
  OwnProps,
  RahaState
> = state => {
  const isLoggedIn =
    state.authentication.isLoaded && state.authentication.isLoggedIn;
  const loggedInMemberId = getLoggedInFirebaseUserId(state);
  const hasAccount =
    isLoggedIn &&
    !!loggedInMemberId &&
    getMembersByIds(state, [loggedInMemberId])[0] !== undefined;
  return {
    isLoggedIn,
    hasAccount,
    existingAuthMethod: state.authentication.isLoaded
      ? undefined
      : state.authentication.existingAuthMethod
  };
};

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = (
  dispatch: RahaThunkDispatch
) => ({
  googleLogIn: () => dispatch(googleLogIn()),
  facebookLogIn: () => dispatch(facebookLogIn())
});

export const LogIn = connect(
  mapStateToProps,
  mapDispatchToProps
)(LogInView);
