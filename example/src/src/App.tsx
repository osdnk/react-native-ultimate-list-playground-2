import * as React from 'react';

import { StyleSheet, View, TextInput, Alert, Button, Text } from 'react-native';
import { MMKV } from 'react-native-mmkv';
import { c } from './Benchmarks';
import RecyclerView from './List';
import AnimatedStyleUpdateExample from './ChatHeads';
import Animated, { runOnJS } from 'react-native-reanimated';
import { data } from './data';
import { useImmediateEffect } from './useImmediateEffect';
import { useState } from 'react';

//const storage = new MMKV();

export const spawnThread = global.spawnThread as <T>(run: () => T) => Promise<T>;

// TODO: Find a way to automatically bind console once I can spawn multiple threads. Possibly through a member function: Thread.polyfillConsole()
const capturableConsole = console;
spawnThread && spawnThread(() => {
  'worklet';
  const console = {
    debug: runOnJS(capturableConsole.debug),
    log: runOnJS(capturableConsole.log),
    warn: runOnJS(capturableConsole.warn),
    error: runOnJS(capturableConsole.error),
    info: runOnJS(capturableConsole.info),
  };
  _setGlobalConsole(console);
});

let array = ['gupia', 'klucha', 'do', 'kwadratu', 'i', 'ziemiak', 'zlosliwy', 'servin', 'maijna', 'tie'];
//let array = [1,7,234,6,3,7,8,3,8,2,78,2];
for (let i = 0; i < 10; i++) {
  array = array.concat(array);
}

// storage.setArray(array);

const renderWrapper = (_, key) => (
  <View style={{ height: 30, width: 100, backgroundColor: 'blue' }} key={`sdfs-${key}`}>
    <View style={{ height: 20, width: 80, backgroundColor: 'green' }}>
      <Text > KLUCHA</Text>
    </View>
  </View>
)
//global.setData(data)
// storage.setArray([
//   1, 2, 3, 4, 5, 6, 7, 4, 1, 2, 1, 2, 3, 4, 5, 6, 7, 4, 1, 2, 1, 2, 3, 4, 5, 6,
//   7, 4, 1, 2, 1, 2, 3, 4, 5, 6, 7, 4, 1, 2, 1, 2, 3, 4, 5, 6, 7, 4, 1, 2, 1, 2,
//   3, 4, 5, 6, 7, 4, 1, 2, 1, 2, 3, 4, 5, 6, 7, 4, 1, 2, 1, 2, 3, 4, 5, 6, 7, 4,
//   1, 2, 1, 2, 3, 4, 5, 6, 7, 4, 1, 2, 1, 2, 3, 4, 5, 6, 7, 4, 1, 2, 1, 2, 3, 4,
//   5, 6, 7, 4, 1, 2, 1, 2, 3, 4, 5, 6, 7, 4, 1, 2,
// ].map(s => s.toString()));
//const setData = (() => (global.setData(data)))


const fibonacci = (num: number): number => {
  'worklet'
  console.log("XXXXX", fibonacci);
  if (num <= 1) return 1
  return fibonacci(num - 1) + fibonacci(num - 2)
}

const input = 1
const result = () => global.spawnThread(() => {
  'worklet'
  console.log(`calculating fibonacci for input: ${input} in JS-Runtime: ...`)
  //console.log(data)
  const fib = fibonacci(input)
  console.log("finished calculating fibonacci!")
  return fib
})
//console.log(`Fibonacci Result: ${result}`)

export default function App() {
  let time = Date.now();
  // useImmediateEffect(() => {
  //   if (data.length > 100) {
  //     global.setData(data.slice(0, 100)) // 2 ms move smwr else
  //     setTimeout(() => {
  //       global.setData(data)
  //     }, 100)
  //   } else {
     //  global.setData(data)
  //   }
  // }, [data])
  // global.___data = data;
  console.log("setting 2")
  //global.setData(data)
  //setData()
  // global.setData(() => {
  //   "worklet";
  //   return data
  // })


  // useState(() => {
  //
  //   //result()
  //
  // })
  //console.warn(Date.now() - time)
  const [visible, setVisible] = useState<boolean>(true);
  if (!visible) {
    return null;
  }

  return (
    <View style={styles.container}>

      <RecyclerView/>
      <Button title={"reset"} onPress={() => {
        setVisible(false);
        setTimeout(() => setVisible(true), 1000)
      }} />
      <AnimatedStyleUpdateExample/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  keys: {
    fontSize: 14,
    color: 'grey',
  },
  title: {
    fontSize: 16,
    color: 'black',
    marginRight: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    marginVertical: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'black',
    borderRadius: 5,
    padding: 10,
  },
});
