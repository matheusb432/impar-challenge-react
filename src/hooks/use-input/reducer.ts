enum InputActions {
  InputBlur = 'INPUT_BLUR',
  InputChange = 'INPUT_CHANGE',
  InputReset = 'INPUT_RESET',
  InputTouch = 'INPUT_TOUCH',
}

interface InputAction {
  type: InputActions;
  payload?: string | boolean;
}

interface InputState {
  value: string;
  touched: boolean;
}

const initialState: InputState = {
  value: '',
  touched: false,
};

const inputReducer = (state: InputState, action: InputAction) => {
  const { type, payload } = action;

  switch (type) {
    case InputActions.InputBlur:
      return { ...state, touched: true };

    case InputActions.InputChange:
      if (typeof payload !== 'string') return { ...state };

      return { ...state, value: payload };

    case InputActions.InputReset:
      return structuredClone(initialState);

    case InputActions.InputTouch:
      if (typeof payload !== 'boolean') return { ...state };

      return { ...state, touched: payload };

    default:
      return { ...state };
  }
};

export { inputReducer, initialState, InputActions };
export type { InputState, InputAction };
