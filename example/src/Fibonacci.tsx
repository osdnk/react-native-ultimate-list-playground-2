import * as React from 'react';

import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ActivityIndicator,
  Alert,
  NativeModules,
  Button
} from 'react-native';
import { spawnThread } from 'react-native-multithreading';
import 'react-native-reanimated';
import { default as Wrapp } from './src/App';


// calculates the fibonacci number - that can be optimized really good so it's really really fast.
const fibonacci = (num: number): number => {
  'worklet';
  // Uses array to store every single fibonacci number
  var i;
  let fib: number[] = [];

  fib[0] = 0;
  fib[1] = 1;
  for (i = 2; i <= num; i++) {
    fib[i] = fib[i - 2] + fib[i - 1];
  }
  return fib[fib.length - 1];
};


// spawnThread(()=>{}, {
//   0: 1,
//   1: 2,
//   2: 33,
//   3: 33,
//   4: 13,
//   5: 366,
//   6: 0,
//   7: 223,
//   8: 7,
//   9: 9,
// });

//setTimeout(() => NativeModules.UltimateNative.setUIThreadPointer(global._WORKLET_RUNTIME.toString()), 1000)


export default function App() {
  const [isRunning, setIsRunning] = React.useState(false);
  const [input, setInput] = React.useState('5');
  const [result, setResult] = React.useState<number | undefined>();

  // const runFibonacci = React.useCallback(async (parsedInput: number) => {
  //   setIsRunning(true);
  //   try {
  //     const fib = await spawnThread(() => {
  //       'worklet';
  //       console.log(
  //         `${global._LABEL}: Calculating fibonacci for input ${parsedInput}...`
  //       );
  //       const value = fibonacci(parsedInput);
  //       console.log(
  //         `${global._LABEL}: Fibonacci number for ${parsedInput} is ${value}!`
  //       );
  //       return value;
  //     });
  //     setResult(fib);
  //   } catch (e) {
  //     const msg = e instanceof Error ? e.message : JSON.stringify(e);
  //     Alert.alert('Error', msg);
  //   } finally {
  //     setIsRunning(false);
  //   }
  // }, []);
  //
  // React.useEffect(() => {
  //   const parsedInput = Number.parseInt(input, 10);
  //   runFibonacci(parsedInput);
  // }, [runFibonacci, input]);

  return <Wrapp/>
  // return (
  //   <View style={styles.container}>
  //     <Text style={styles.description}>
  //       In this example you can enter a number in the TextInput while the custom
  //       thread will calculate the fibonacci sequence for the given number
  //       completely async and in parallel, while the React-JS Thread stays fully
  //       responsive.
  //     </Text>
  //     <Text>Input:</Text>
  //     <TextInput
  //       style={styles.input}
  //       value={input}
  //       onChangeText={setInput}
  //       placeholder="0"
  //     />
  //     {isRunning ? (
  //       <ActivityIndicator />
  //     ) : (
  //       <Text>Fibonacci Number: {result}</Text>
  //     )}
  //     <Button title={"Set pointer to animated thread"}/>
  //     <Button title={"Set value with manager on animated thread"}/>
  //     <Button title={"Read animated value"} onPress={() => NativeModules.UltimateNative.setUIThreadPointer(global._WORKLET_RUNTIME.toString())}/>
  //   </View>
  // );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 70,
  },
  description: {
    maxWidth: '80%',
    fontSize: 15,
    color: '#242424',
    marginBottom: 80,
  },
  input: {
    width: '50%',
    paddingVertical: 5,
    marginVertical: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 5,
    borderColor: 'black',
    textAlign: 'center',
    fontSize: 14,
  },
});
