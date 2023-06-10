interface State {
  name: string;
  final: boolean;
}

interface Transition {
  from: State;
  to: State;
  input: string;
}

class NumericParser {
  private states: State[];
  private transitions: Transition[];
  private current: State;

  constructor(states: State[], transitions: Transition[], initialState: State) {
    this.states = states;
    this.transitions = transitions;
    this.current = initialState;
  }

  parse(input: string): boolean {
    for (const char of input) {
      const transition = this.findTransition(this.current, char);
      if (transition) {
        this.current = transition.to;
      } else {
        return false; // 遷移が見つからない場合は解析失敗
      }
    }

    return this.current.final; // 最終状態かどうかを返す
  }

  private findTransition(state: State, input: string): Transition | undefined {
    return this.transitions.find((t) => t.from === state && t.input === input);
  }
}

const integerStates: State[] = [
  { name: "S", final: false },
  { name: "A", final: true },
];

const integerTransitions: Transition[] = [
  { from: integerStates[0], to: integerStates[1], input: "0" },
  { from: integerStates[0], to: integerStates[1], input: "1" },
  { from: integerStates[1], to: integerStates[1], input: "0" },
  { from: integerStates[1], to: integerStates[1], input: "1" },
];

const integerParser = new NumericParser(
  integerStates,
  integerTransitions,
  integerStates[0]
);
console.log(integerParser.parse("0")); // true
console.log(integerParser.parse("1")); // true
console.log(integerParser.parse("10")); // true
console.log(integerParser.parse("11")); // true
console.log(integerParser.parse("101")); // true
console.log(integerParser.parse("123")); // false
