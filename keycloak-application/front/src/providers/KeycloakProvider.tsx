import { FC, ReactNode, useEffect, createContext, useContext } from "react";
import { keycloak } from '../keycloakConfig'
import { useReducer } from 'react'

type Props = {
  children: ReactNode
}

enum ReducerOptions {
  SET_LOADING,
  SET_AUTHENTICATED,
  SET_TOKEN,
  SET_USER_DETAILS
}

type ReducerAction = {
  payload: any,
  type: ReducerOptions
}

const initialState = {
  isLoading: false,
  token: '',
  userDetails: null,
  isAuthenticated: false
}

export const KeycloakContext = createContext(initialState)

export const useKeycloack = () => useContext(KeycloakContext)

export const KeycloakProvider: FC<Props> = ({ children }) => {
  const reducer = (state: any, action: ReducerAction) => {
    switch (action.type) {
      case ReducerOptions.SET_LOADING:
        return { ...state, isLoading: action.payload }

      case ReducerOptions.SET_AUTHENTICATED:
        return { ...state, isAuthenticated: action.payload }

      case ReducerOptions.SET_TOKEN:
        return { ...state, token: action.payload }

      case ReducerOptions.SET_USER_DETAILS:
        return { ...state, userDetails: action.payload }
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    const initKeycloak = async () => {
      const updateToken = (refresh = false) => {
        if (refresh) {
          keycloak.updateToken(70).then(refreshed => {
            if (refreshed) {
              dispatch({ type: ReducerOptions.SET_TOKEN, payload: keycloak.token })
            }
          })
        }
      }

      keycloak.onTokenExpired = () => {
        updateToken(true)
      }

      try {
        dispatch({ type: ReducerOptions.SET_LOADING, payload: true })

        const authenticated = await keycloak.init({
          onLoad: 'login-required'
        })

        dispatch({ type: ReducerOptions.SET_LOADING, payload: false })

        if (authenticated) {
          console.log('user authenticated')

          dispatch({ type: ReducerOptions.SET_TOKEN, payload: keycloak.token })
          dispatch({ type: ReducerOptions.SET_AUTHENTICATED, payload: true })

          const userInfo = await keycloak.loadUserInfo()
          dispatch({ type: ReducerOptions.SET_USER_DETAILS, payload: userInfo })
        } else {
          console.log('user not authenticated')
          dispatch({ type: ReducerOptions.SET_AUTHENTICATED, payload: false })
        }
      } catch (error) {
        dispatch({ type: ReducerOptions.SET_LOADING, payload: false })
        console.error('ERROR: ', error)
      }
    }

    initKeycloak()
  }, [dispatch])

  return (
    <KeycloakContext.Provider value={{ ...state }}>
      {children}
    </KeycloakContext.Provider>
  )
}
