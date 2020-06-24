import React from 'react';

interface State {
    isLoggedIn: Boolean
    isLoadingAuth: Boolean
}

const initialState: State = {
    isLoggedIn: false,
    isLoadingAuth: true,
};

const SET_USER_LOGGED_IN = 'SET_USER_LOGGED_IN'

export let setUserLoggedIn = (value: boolean) => {
    return {type: SET_USER_LOGGED_IN, value}
}

// @ts-ignore
const Reducer = (state, action: any) => {
    switch (action.type) {
        case 'SET_USER_LOGGED_IN':
            return {
                ...state,
                isLoggedIn: action.value,
                isLoadingAuth: false,
            };
        default:
            return state;
    }
};

// @ts-ignore
const Store = ({children}) => {
    const [state, dispatch] = React.useReducer(Reducer, initialState);
    const value = [state, dispatch];
    return (
        <Context.Provider value={value as any}>
            {children}
        </Context.Provider>
    )
}

// hook to access store and reducer actions
export function useStore() {
    return React.useContext(Context) as any;
}

// HOC to pass the entire store as props to component
export const withStore = (Component: any) => {
    return function (props: any) {
        return <Context.Consumer>
            {(context: any) =>
                <Component
                    {...context[0]}
                    {...props}
                />}
        </Context.Consumer>;
    }
};

export const Context = React.createContext(initialState);
export default Store;