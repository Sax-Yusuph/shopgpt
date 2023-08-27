import { proxy } from "valtio";

export const chatState = proxy({ loading: false });
export type ChatState = { loading: boolean };

export const updateState = (state: boolean) => {
  chatState.loading = state;
};
