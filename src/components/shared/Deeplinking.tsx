import { NavigationActions, NavigationParams } from "react-navigation";
import url from "url";

import { DEEPLINK_ROUTES } from "./Navigation";

export function processDeeplink(link: string, navigation: any) {
  const deeplinkUrl = url.parse(link, true, true);
  if (!deeplinkUrl.pathname) {
    return;
  }
  const pathname = deeplinkUrl.pathname.replace("/", "");
  routeToPath(pathname, navigation, deeplinkUrl.query);
}

export function routeToPath(
  pathname: string,
  navigation: any,
  params?: NavigationParams
) {
  const newRoute = DEEPLINK_ROUTES[pathname as keyof typeof DEEPLINK_ROUTES];
  if (newRoute) {
    navigation.navigate(
      "App",
      {},
      NavigationActions.navigate({
        routeName: newRoute,
        params: params
      })
    );
  }
}
