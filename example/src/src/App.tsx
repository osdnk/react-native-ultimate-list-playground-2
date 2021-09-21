import * as React from 'react';

import { StyleSheet, View, TextInput, Alert, Button, Text } from 'react-native';
import { MMKV } from 'react-native-mmkv';
import { c } from './Benchmarks';
import RecyclerView from './List';
import AnimatedStyleUpdateExample from './ChatHeads';
import Animated from "react-native-reanimated";
import { data } from '../data';

//const storage = new MMKV();

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
export default function App() {
  let time = Date.now();
  global.setData(data) // 2 ms
  // global.___data = data;
  console.warn(Date.now() - time)
  return (
    <View style={styles.container}>
      <View removeClippedSubviews={false} style={{ opacity: 0, position: 'absolute' }}>
        {[...Array(10)].map(renderWrapper)}
      </View>


      <RecyclerView/>
      <Button title={"setData"} onPress={() => global.setData(data)}/>
      <AnimatedStyleUpdateExample/>
      <Text style={{ color: "red" }}>{!!global.HermesInternal ? "HERMES" : "JSC"}</Text>

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
