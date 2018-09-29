import "es6-symbol/implement";
import * as React from "react";
import {
  TouchableOpacity,
  StyleSheet,
  TextStyle,
  ViewStyle
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { createBottomTabNavigator } from "react-navigation-tabs";
import {
  createStackNavigator,
  NavigationContainer,
  NavigationRouteConfig,
  NavigationState,
  NavigationStateRoute,
  NavigationRoute,
  NavigationRouteConfigMap,
  StackNavigatorConfig,
  createSwitchNavigator,
  NavigationScreenProps
} from "react-navigation";
import { connect, MapStateToProps } from "react-redux";

import { analytics } from "../../firebaseInit";
import { Give as GiveScreen } from "../pages/Give";
import { Feed } from "../pages/Feed";
import { Wallet } from "../pages/Wallet";
import { LogIn } from "../pages/LogIn";
import { PendingInvites } from "../pages/PendingInvites";
import { Profile as ProfileScreen } from "../pages/Profile";
import { getMemberById } from "../../store/selectors/members";
import { RahaState } from "../../store";
import { MemberList as MemberListScreen } from "../pages/MemberList";
import { ActivityList as ActivityListScreen } from "../pages/ActivityList";
import { Onboarding } from "../pages/Onboarding/Onboarding";
import { ReferralBonus } from "../pages/ReferralBonus";
import { getLoggedInFirebaseUserId } from "../../store/selectors/authentication";
import { Text } from "./elements";
import { Discover } from "../pages/Discover";
import { LeaderBoard } from "../pages/LeaderBoard";
import { Invite } from "../pages/Invite/Invite";
import { colors, palette } from "../../helpers/colors";
import { fonts, fontSizes } from "../../helpers/fonts";
import { InitializationRouter } from "../pages/InitializationRouter";
import { Member } from "../../store/reducers/members";
import { Verify } from "../pages/Verify";
import { processDeeplink, routeToPath } from "./Deeplinking";
import branch from "react-native-branch";
import { AccountSettingsPage } from "../pages/AccountSettings/AccountSettings";
import { IdentitySettingsPage } from "../pages/AccountSettings/IdentitySettings";
import { GovernancePage } from "../pages/AccountSettings/Governance";
import { AccountRecoveryPage } from "../pages/AccountSettings/AccountRecovery";
import { CurrencySettingsPage } from "../pages/AccountSettings/CurrencySettings";
import { SignOutPage } from "../pages/AccountSettings/SignOut";

/**
 * Gets the current screen from navigation state.
 * Adapted from: https://reactnavigation.org/docs/en/screen-tracking.html
 */
function getActiveRouteName(navigationState: NavigationState): string | null {
  if (!navigationState) {
    return null;
  }

  let memoizedNavigationRoute: NavigationStateRoute<any> | NavigationRoute =
    navigationState.routes[navigationState.index];

  // dive into nested navigators
  //@ts-ignore kind of crappy way of figuring out route type
  while (memoizedNavigationRoute.routes) {
    memoizedNavigationRoute =
      //@ts-ignore kind of crappy way of figuring out route type
      memoizedNavigationRoute.routes[memoizedNavigationRoute.index];
  }

  return memoizedNavigationRoute.routeName;
}

/**
 * To track firebase analytics information in real time in a debug
 * environment, run: `adb shell setprop debug.firebase.analytics.app`.
 */
function trackPageChanges(
  prevState: NavigationState,
  currentState: NavigationState
) {
  const currentScreen = getActiveRouteName(currentState);
  const prevScreen = getActiveRouteName(prevState);

  if (currentScreen && prevScreen !== currentScreen) {
    analytics.setCurrentScreen(currentScreen);
  }
}

export enum RouteName {
  InitializationRouter = "InitializationRouter",
  AccountPage = "Account",
  GivePage = "Give",
  FeedPage = "Feed Page",
  FeedTab = "Feed",
  InvitePage = "Invite",
  LogInPage = "LogIn",
  MemberListPage = "Member List",
  ActivityListPage = "Activity List",
  OnboardingPage = "Onboarding",
  ProfilePage = "Profile Page",
  ProfileTab = "Profile",
  DiscoverPage = "DiscoverPage",
  DiscoverTab = "Discover",
  LeaderboardPage = "Leaderboard",
  WalletPage = "WalletPage",
  WalletTab = "Wallet",
  ReferralBonusPage = "Referral Bonus",
  PendingInvitesPage = "Pending Invites",
  Verify = "Verify",
  Governance = "Governance",
  AccountRecovery = "Account Recovery",
  SignOut = "Sign Out",
  CurrencySettings = "Currency Settings"
}

// TODO: Move this to Deeplinking. Need to also move RouteName out to avoid
// circular dependency loading.
export const DEEPLINK_ROUTES = {
  invite: RouteName.OnboardingPage
};

const subHeaderStyle: TextStyle = {
  fontSize: 18
};

const headerStyle: ViewStyle = {
  paddingHorizontal: 12,
  backgroundColor: colors.darkAccent
};

const headerTextStyle: TextStyle = {
  ...fontSizes.large,
  ...fonts.Lato.Bold
};

const navIconStyle: TextStyle = {
  fontSize: 25
};

const navIconFocusedStyle: TextStyle = {
  color: palette.mint
};

const labelStyle: TextStyle = {
  ...fonts.Lato.Bold,
  ...fontSizes.small
};

const giveButtonStyle: TextStyle = {
  ...fonts.Lato.Bold,
  ...fontSizes.large
};

const styles = StyleSheet.create({
  header: headerStyle,
  headerText: headerTextStyle,
  subHeader: subHeaderStyle,
  navIcon: navIconStyle,
  navIconFocused: navIconFocusedStyle,
  label: labelStyle,
  giveButton: giveButtonStyle
});

const HeaderTitle: React.StatelessComponent<HeaderProps> = props => {
  return (
    <Text style={[styles.headerText, props.style]}>
      {props.title}
      {props.subtitle && (
        <Text style={styles.subHeader}> - {props.subtitle}</Text>
      )}
    </Text>
  );
};

const MemberList = {
  screen: MemberListScreen,
  navigationOptions: ({ navigation }: any) => {
    return {
      headerTitle: (
        <HeaderTitle title={navigation.getParam("title", "Member List")} />
      ),
      headerStyle: styles.header
    };
  }
};

const ActivityList = {
  screen: ActivityListScreen,
  navigationOptions: ({ navigation }: any) => {
    return {
      headerTitle: (
        <HeaderTitle title={navigation.getParam("title", "Activity List")} />
      ),
      headerStyle: styles.header
    };
  }
};

const OWN_PROFILE = Symbol("OWN_PROFILE");
const Profile: NavigationRouteConfig = {
  screen: ProfileScreen,
  navigationOptions: ({ navigation }: any) => {
    const member = navigation.getParam("member", OWN_PROFILE) as
      | Member
      | typeof OWN_PROFILE;

    const title =
      member !== OWN_PROFILE ? member.get("fullName") : "Your Profile";
    const headerRight =
      member === OWN_PROFILE ? settingsButton(navigation) : <React.Fragment />;

    return {
      headerTitle: <HeaderTitle title={title} />,
      headerRight,
      headerStyle: styles.header
    };
  }
};

const Give = {
  screen: GiveScreen,
  navigationOptions: {
    headerTitle: <HeaderTitle title="Give Raha" />,
    headerStyle: styles.header
  }
};

type HeaderProps = {
  title: string;
  subtitle?: string;
  style?: TextStyle;
};

function giveButton(navigation: any) {
  return (
    <Text
      onPress={() => {
        navigation.navigate(RouteName.GivePage);
      }}
      style={styles.giveButton}
    >
      Give
    </Text>
  );
}

function settingsButton(navigation: any) {
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate(RouteName.AccountPage);
      }}
    >
      <Icon name="ellipsis-h" size={20} />
    </TouchableOpacity>
  );
}

export function createNavigatorForTab(
  routeConfigMap: NavigationRouteConfigMap,
  stackConfig?: StackNavigatorConfig
): NavigationContainer {
  return createStackNavigator(
    {
      ...routeConfigMap,
      [RouteName.ProfilePage]: Profile,
      [RouteName.MemberListPage]: MemberList,
      [RouteName.ActivityListPage]: ActivityList,
      [RouteName.GivePage]: Give,
      [RouteName.Verify]: {
        screen: Verify,
        navigationOptions: {
          header: null
        }
      }
    },
    {
      ...stackConfig
    }
  );
}

function createHeaderNavigationOptions(
  title: string,
  excludeGiveButton?: boolean
) {
  return ({ navigation }: any) => ({
    headerTitle: <HeaderTitle title={title} />,
    headerStyle: styles.header,
    // only show give button if not on give page
    ...(navigation.state.routeName === RouteName.GivePage || excludeGiveButton
      ? {}
      : {
          headerRight: giveButton(navigation)
        })
  });
}

const FeedTab = createNavigatorForTab(
  {
    [RouteName.FeedPage]: {
      screen: Feed,
      navigationOptions: createHeaderNavigationOptions("Raha")
    }
  },
  {
    initialRouteName: RouteName.FeedPage
  }
);

const DiscoverTab = createNavigatorForTab(
  {
    [RouteName.DiscoverPage]: {
      screen: Discover,
      navigationOptions: createHeaderNavigationOptions("Discover")
    },
    LeaderBoard
  },
  {
    initialRouteName: RouteName.DiscoverPage
  }
);

const WalletTab = createNavigatorForTab(
  {
    [RouteName.InvitePage]: {
      screen: Invite,
      navigationOptions: {
        header: null
      }
    },
    [RouteName.WalletPage]: {
      screen: Wallet,
      navigationOptions: createHeaderNavigationOptions("Raha Wallet")
    },
    [RouteName.ReferralBonusPage]: {
      screen: ReferralBonus,
      navigationOptions: createHeaderNavigationOptions("Bonus Mint")
    }
  },
  {
    initialRouteName: RouteName.WalletPage,
    navigationOptions: createHeaderNavigationOptions("Discover")
  }
);

const ProfileTab = createNavigatorForTab(
  {
    [RouteName.ProfileTab]: Profile,
    [RouteName.AccountPage]: {
      screen: AccountSettingsPage,
      navigationOptions: createHeaderNavigationOptions("Account", true)
    },
    [RouteName.Governance]: {
      screen: GovernancePage,
      navigationOptions: createHeaderNavigationOptions(
        "Governance settings",
        true
      )
    },
    [RouteName.AccountRecovery]: {
      screen: AccountRecoveryPage,
      navigationOptions: createHeaderNavigationOptions("Account recovery", true)
    },
    [RouteName.CurrencySettings]: {
      screen: CurrencySettingsPage,
      navigationOptions: createHeaderNavigationOptions("Currency", true)
    },
    [RouteName.SignOut]: {
      screen: SignOutPage,
      navigationOptions: createHeaderNavigationOptions("Sign out", true)
    },
    [RouteName.PendingInvitesPage]: PendingInvites
  },
  {
    initialRouteName: RouteName.ProfileTab
  }
);

const tabRoutes = {
  [RouteName.FeedTab]: FeedTab,
  [RouteName.DiscoverTab]: DiscoverTab,
  [RouteName.WalletTab]: WalletTab,
  [RouteName.ProfileTab]: ProfileTab
};
const tabIcons: { [k in keyof typeof tabRoutes]: string } = {
  [RouteName.ProfileTab]: "user",
  [RouteName.FeedTab]: "list-alt",
  [RouteName.DiscoverTab]: "search",
  [RouteName.WalletTab]: "coins"
};

const SignedInNavigator = createSwitchNavigator(
  {
    [RouteName.InitializationRouter]: {
      screen: (props: NavigationScreenProps) => (
        <InitializationRouter {...props} defaultRoute={RouteName.FeedTab} />
      ),
      navigationOptions: { header: null }
    },
    App: createBottomTabNavigator(tabRoutes, {
      initialRouteName: RouteName.DiscoverTab,
      labeled: true,
      navigationOptions: ({ navigation }: any) => ({
        tabBarIcon: ({ focused }: any) => {
          const routeName = navigation.state
            .routeName as keyof typeof tabRoutes;
          const iconName = tabIcons[routeName];
          return (
            <Icon
              name={iconName}
              solid
              style={[
                styles.navIcon,
                ...(focused ? [styles.navIconFocused] : [])
              ]}
            />
          );
        },
        headerStyle: [
          styles.header,
          {
            backgroundColor: colors.pageBackground
          }
        ],
        tabBarOptions: {
          activeTintColor: palette.mint,
          labelStyle: styles.label
        },
        tabBarColor: palette.lightGray
      })
    })
  },
  {
    initialRouteName: RouteName.InitializationRouter
  }
);

const SignedOutNavigator = createSwitchNavigator(
  {
    [RouteName.InitializationRouter]: {
      screen: (props: NavigationScreenProps) => (
        <InitializationRouter {...props} defaultRoute={RouteName.LogInPage} />
      ),
      navigationOptions: { header: null }
    },
    App: createStackNavigator(
      {
        [RouteName.OnboardingPage]: {
          screen: Onboarding,
          navigationOptions: { header: null }
        },
        [RouteName.LogInPage]: LogIn,
        [RouteName.ProfilePage]: Profile
      },
      {
        initialRouteName: RouteName.LogInPage,
        headerMode: "screen",
        navigationOptions: {
          headerTitle: <HeaderTitle title="Raha" subtitle="Identity Network" />,
          headerStyle: styles.header
        }
      }
    )
  },
  {
    initialRouteName: RouteName.InitializationRouter
  }
);

type OwnProps = {};

type StateProps = {
  isLoaded: boolean;
  isLoggedIn: boolean;
  hasAccount: boolean;
};

type Props = OwnProps & StateProps;

type BranchParams = {
  error?: string;
  params?: any;
};

class NavigationView extends React.Component<Props> {
  navigation: any;
  _unsubscribeFromBranch: any;

  componentWillUnmount() {
    this._unsubscribeFromBranch();
    this._unsubscribeFromBranch = null;
  }

  _processBranchDeeplink = (branchParams: BranchParams) => {
    const { error, params } = branchParams;
    // ({ error, params }) => {
    if (error) {
      console.error("Error from Branch: " + error);
      return;
    }

    if (!params) {
      // params will never be null if error is null, but satisfy Typescript
      return;
    }

    if (params["+non_branch_link"]) {
      const nonBranchUrl = params["+non_branch_link"];
      // Route non-Branch URL if appropriate.
      processDeeplink(nonBranchUrl, this.navigation);
      return;
    }

    if (!params["+clicked_branch_link"]) {
      // Indicates initialization success and some other conditions.
      // No link was opened.
      return;
    }

    if (!params["path"]) {
      console.error("No path was found in Branch deeplink.");
      return;
    }

    // A Branch link was opened.
    // Route link based on data in params.
    routeToPath(params["path"], this.navigation, params);
  };

  componentDidMount() {
    this._unsubscribeFromBranch = branch.subscribe(this._processBranchDeeplink);
  }

  _setNavigationRef = (ref: any) => {
    // Check ref exists -- on Android, if Activity is popping off via backspace,
    // ref still gets called with an undefined ref.
    if (ref) {
      this.navigation = ref._navigation;
    }
  };

  render() {
    const { hasAccount } = this.props;

    if (hasAccount) {
      return (
        <SignedInNavigator
          ref={this._setNavigationRef}
          onNavigationStateChange={trackPageChanges}
        />
      );
    } else {
      return (
        <SignedOutNavigator
          ref={this._setNavigationRef}
          onNavigationStateChange={trackPageChanges}
        />
      );
    }
  }
}

const mapStateToProps: MapStateToProps<
  StateProps,
  OwnProps,
  RahaState
> = state => {
  const isLoaded = state.authentication.isLoaded;
  const loggedInMemberId = getLoggedInFirebaseUserId(state);
  const isLoggedIn =
    state.authentication.isLoaded && state.authentication.isLoggedIn;
  const hasAccount =
    isLoggedIn &&
    !!loggedInMemberId &&
    getMemberById(state, loggedInMemberId) !== undefined;
  return {
    isLoaded,
    isLoggedIn,
    hasAccount
  };
};

export const Navigation = connect(
  mapStateToProps,
  {}
)(NavigationView);
