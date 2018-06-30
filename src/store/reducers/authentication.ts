import { Reducer } from "redux";

import {
  FirebaseAuthActionType,
  AuthenticationAction,
  PhoneLogInActionType
} from "../actions/authentication";

export enum PhoneLogInStatus {
  SENDING_PHONE_NUMBER = "SENDING_PHONE_NUMBER",
  WAITING_FOR_CONFIRMATION_INPUT = "WAITING_FOR_CONFIRMATION_INPUT",
  SENDING_CONFIRMATION = "SENDING_CONFIRMATION",
  SENDING_PHONE_NUMBER_FAILED = "SENDING_PHONE_NUMBER_FAILED",
  SENDING_CONFIRMATION_FAILED = "SENDING_CONFIRMATION_FAILED"
}

export interface AuthenticationState {
  isLoaded: boolean;
  isLoggedIn: boolean;
  phoneLogInStatus?:
    | {
        status:
          | PhoneLogInStatus.SENDING_PHONE_NUMBER
          | PhoneLogInStatus.WAITING_FOR_CONFIRMATION_INPUT
          | PhoneLogInStatus.SENDING_CONFIRMATION;
      }
    | {
        status:
          | PhoneLogInStatus.SENDING_PHONE_NUMBER_FAILED
          | PhoneLogInStatus.SENDING_CONFIRMATION_FAILED;
        errorMessage: string;
      };
}

const initialState: AuthenticationState = {
  isLoaded: false,
  isLoggedIn: false
};

export const reducer: Reducer<AuthenticationState> = (
  state = initialState,
  untypedAction
) => {
  const action = untypedAction as AuthenticationAction;
  switch (action.type) {
    case FirebaseAuthActionType.LOG_IN: {
      // clear phone login status since we will transition out of the phone
      // login flow now
      const { phoneLogInStatus, ...rest } = state;
      return {
        ...rest,
        isLoaded: true,
        isLoggedIn: true
      };
    }
    case FirebaseAuthActionType.SIGN_OUT:
    case FirebaseAuthActionType.SIGNED_OUT:
      // clear phone login status just in case.
      const { phoneLogInStatus, ...rest } = state;
      return {
        ...rest,
        isLoaded: true,
        isLoggedIn: false
      };
    case PhoneLogInActionType.PHONE_LOGIN_CANCELED: {
      // clear phone login status
      const { phoneLogInStatus, ...rest } = state;
      return rest;
    }
    case PhoneLogInActionType.PHONE_LOGIN_SENDING_PHONE_NUMBER:
      return {
        ...state,
        phoneLogInStatus: { status: PhoneLogInStatus.SENDING_PHONE_NUMBER }
      };
    case PhoneLogInActionType.PHONE_LOGIN_SENDING_PHONE_NUMBER_FAILED:
      return {
        ...state,
        phoneLogInStatus: {
          status: PhoneLogInStatus.SENDING_PHONE_NUMBER_FAILED,
          errorMessage: action.errorMessage
        }
      };
    case PhoneLogInActionType.PHONE_LOGIN_WAITING_FOR_CONFIRMATION_INPUT:
      return {
        ...state,
        phoneLogInStatus: {
          status: PhoneLogInStatus.WAITING_FOR_CONFIRMATION_INPUT
        }
      };
    case PhoneLogInActionType.PHONE_LOGIN_SENDING_CONFIRMATION:
      return {
        ...state,
        phoneLogInStatus: {
          status: PhoneLogInStatus.SENDING_CONFIRMATION
        }
      };
    case PhoneLogInActionType.PHONE_LOGIN_SENDING_CONFIRMATION_FAILED:
      return {
        ...state,
        phoneLogInStatus: {
          status: PhoneLogInStatus.SENDING_CONFIRMATION_FAILED,
          errorMessage: action.errorMessage
        }
      };
    default:
      return state;
  }
};
