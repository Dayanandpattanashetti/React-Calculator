import "./styles.css";
import DigitButton from "./DigitButton";
import react, { useReducer } from "react";
import OperationButton from "./OperationButton";
import { Container, Row, Col, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

export const Actions = {
  ADD_DIGIT: "add_digit",
  DELETE_DIGIT: "delete_digit",
  CHOOSE_OPERATION: "choose_operation",
  CLEAR: "clear",
  EVALUATE: "evaluate",
};

function reducer(state, { type, payload }) {
  switch (type) {
    case Actions.ADD_DIGIT:
      if (payload.digit === "0" && state.currentOperand === "0") return state;
      if (state.currentOperand != null) {
        if (payload.digit === "." && state.currentOperand.includes("."))
          return state;
      }

      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        };
      }
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      };

    case Actions.CLEAR:
      return {};

    case Actions.EVALUATE:
      if (
        state.currentOperand == null ||
        state.previousOperand == null ||
        state.operation == null
      ) {
        return state;
      }
      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state),
      };
    case Actions.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: null,
          overwrite: false,
        };
      }
      if (state.currentOperand == null) return state;
      if (state.currentOperand.length === 1) {
        return {
          ...state,
          currentOperand: null,
        };
      }
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };

    case Actions.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null)
        return state;
      if (state.previousOperand == null) {
        return {
          ...state,
          previousOperand: state.currentOperand,
          operation: payload.operation,
          currentOperand: null,
        };
      }
      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null,
      };
  }
}

function evaluate({ currentOperand, previousOperand, operation }) {
  const prev = parseFloat(previousOperand);
  const curr = parseFloat(currentOperand);
  if (isNaN(prev) || isNaN(curr)) return "";

  let computation = "";
  switch (operation) {
    case "+":
      computation = prev + curr;
      break;
    case "-":
      computation = prev - curr;
      break;
    case "*":
      computation = prev * curr;
      break;
    case "/":
      computation = prev / curr;
      break;
  }

  return computation.toString();
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});
function formatOperand(operand) {
  if (operand == null) return;
  const [integer, decimal] = operand.split(".");
  if (decimal == null) return INTEGER_FORMATTER.format(integer);
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
}

function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  );

  return (
    <container className="mx-3">
      <div className="calculator-grid">
        <div className="output">
          <div className="previous-operand">
            {formatOperand(previousOperand)} {operation}
          </div>
          <div className="current-operand">{formatOperand(currentOperand)}</div>
        </div>
        <button
          className="span-two"
          onClick={() => dispatch({ type: Actions.CLEAR })}
        >
          AC
        </button>
        <button onClick={() => dispatch({ type: Actions.DELETE_DIGIT })}>
          DEL
        </button>
        <OperationButton operation="/" dispatch={dispatch} />
        <DigitButton digit="1" dispatch={dispatch} />
        <DigitButton digit="2" dispatch={dispatch} />
        <DigitButton digit="3" dispatch={dispatch} />
        <OperationButton operation="*" dispatch={dispatch} />
        <DigitButton digit="4" dispatch={dispatch} />
        <DigitButton digit="5" dispatch={dispatch} />
        <DigitButton digit="6" dispatch={dispatch} />
        <OperationButton operation="+" dispatch={dispatch} />
        <DigitButton digit="7" dispatch={dispatch} />
        <DigitButton digit="8" dispatch={dispatch} />
        <DigitButton digit="9" dispatch={dispatch} />
        <OperationButton operation="-" dispatch={dispatch} />
        <DigitButton digit="." dispatch={dispatch} />
        <DigitButton digit="0" dispatch={dispatch} />
        <button
          className="span-two"
          onClick={() => dispatch({ type: Actions.EVALUATE })}
        >
          =
        </button>
      </div>
    </container>
  );
}

export default App;
