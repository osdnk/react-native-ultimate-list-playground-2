import React, {
  useCallback,
  useRef,
  useState,
  createContext,
  useContext, useMemo,
} from 'react';
import { View, Text, StyleSheet, ViewStyle, NativeModules } from 'react-native';
import {
  CellStorage,
  RecyclerListView,
  RecyclerRow as RawRecyclerRow,
  UltraFastTextWrapper,
} from './ultimate';
import { data, DataCell, data2 } from './data';
import Animated, {
  useSharedValue,
  useDerivedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { useAnimatedRecycleHandler } from './useAnimatedRecycleEvent';
import { ReText } from 'react-native-redash';
import { runOnUI } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated/src/reanimated2/commonTypes';
import { cloneDeep } from "lodash"

const someWorklet = (greeting) => {
  console.log(greeting, 'From the UI thread');
};

// const onPress = () => {
//   runOnUI(someWorklet)('Howdy');
// };



// NativeModules.UltimateNative.setUIThreadPointer(global._WORKLET_RUNTIME.toString());

//import { useDerivedValue } from './useImmediateDerivedValue';

const DataContext = createContext<SharedValue<any[]> | null>(null);
const PositionContext = createContext<Animated.SharedValue<number> | null>(
  null
);

const AnimatedRecyclableRow = Animated.createAnimatedComponent(RawRecyclerRow);

function usePosition() {
  return useContext(PositionContext);
}

function useData() {
  return useContext(DataContext);
}

function useSharedDataAtIndex() {
  const data = useData();
  const position = usePosition();
  // matbo copy the data and not access them on every recycle
  return useDerivedValue(() => data?.value?.[position?.value ?? -1], []);
}

function RecyclerRow(props) {
  const position = useSharedValue<number>(-1);
  const onRecycleHandler = useAnimatedRecycleHandler((e) => {
    'worklet';
    position.value = e.position;
  });

  return (
    <PositionContext.Provider value={position}>
      <AnimatedRecyclableRow {...props} onRecycle={onRecycleHandler}   />
    </PositionContext.Provider>
  );
}

const namingHandler = {
  get(
    { binding }: { binding: string },
    property: string
  ): { binding: string } | string {
    if (property === '___binding') {
      return binding;
    }
    return new Proxy(
      { binding: binding === '' ? property : `${binding}.${property}` },
      namingHandler
    );
  },
};

function useUltraFastData<TCellData extends object>() {
  return new Proxy({ binding: '' }, namingHandler) as any as TCellData;
}

function UltraFastText({ binding }: { binding: string }) {
  return (
    // @ts-ignore
    <UltraFastTextWrapper binding={binding.___binding}>
      <Text style={{ width: 100 }} />
    </UltraFastTextWrapper>
  );
}


function RecyclableViews({ children }: { children: React.ReactChild }) {
  const [cells, setCells] = useState<number>(1)
  console.log("rendering " + cells + "cells")
  // use reanimated event here and animated reaction
  return (
    <CellStorage removeClippedSubviews={false} style={{ opacity: 0.1 }} onMoreRowsNeeded={e => setCells(e.nativeEvent.cells)}>
      {/* TODO make better render counting  */}
      {[...Array(cells)].map((_, key) => (
        <View removeClippedSubviews={false}
              key={`rl-${key}`}

        >
          <RecyclerRow
            removeClippedSubviews={false}
          >
            {children}
          </RecyclerRow>
        </View>
      ))}
    </CellStorage>
  );
}

function RecyclerView<TData>({
                               style,
                               children,
                             }: {
  style: ViewStyle;
  children: any;
  data: TData[];
}) {
  // @ts-ignore
  const T = {};
  const copiedData = useMemo(() => cloneDeep(data), [data]);
  const datas = useSharedValue(data2);
  return (
    <DataContext.Provider value={datas}>
      <View style={style} removeClippedSubviews={false}>
        <RecyclableViews>{children}</RecyclableViews>
        <RecyclerListView
          count={data.length}
          style={StyleSheet.absoluteFillObject}
        />
      </View>
    </DataContext.Provider>
  );
}


// const List = createList<Data>();
// const { WrapperList, useUltraFastSomething, useSharedDataAtIndex, useData } = List;

// HERE starts example
function ContactCell() {
  const data = useSharedDataAtIndex();
  const text = useDerivedValue(() => data.value?.name ?? '');
  const color = useDerivedValue(() => {
    const name = data.value?.name ?? '';
    const colors = ['red', 'green', 'blue', 'white', 'yellow'];
    let hash = 0,
      i,
      chr;
    if (name.length === 0) return hash;
    for (i = 0; i < name.length - 2; i++) {
      chr = name.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0;
    }
    return colors[Math.abs(hash) % 5];
  });
  const circleStyle = useAnimatedStyle(() => ({
    backgroundColor: color.value,
  }));

  const {
    nested: { prof },
  } = useUltraFastData<DataCell>(); // const prof = "nested.prof"

  return (
    <View
      style={{
        borderWidth: 2,
        backgroundColor: 'grey',
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
      }}
    >
      <Animated.View
        style={[
          circleStyle,
          {
            width: 60,
            height: 60,
            borderRadius: 30,
            marginRight: 20,
          },
        ]}
      />
      <UltraFastText binding={prof} />
      {/*<UltraFastSwtich binding={"type"} >*/}
      {/*  <UltraFastCase type="loading"/>*/}
      {/*</UltraFastSwtich>*/}

      {/*<UltraFastText binding={name} />*/}
      <ReText text={text} />

      {/*<RecyclableText style={{ width: '70%' }}>Beata Kozidrak</RecyclableText>*/}
    </View>
  );
}


// console.log(global.setData)
// if (global.setData) {
//   global.setData(data)
// }
// setInterval(() => console.log(global.setData), 100)


export default function Example() {
  useState(() => {
  })

  return (
    <RecyclerView<DataCell>
      //  layoutProvider={layoutProvider}
      //layoutTypeExtractor={layoutTypeExtractor} // all called before rendering
      data={data}
      style={{ width: '100%', height: 300 }}
      //layoutProvider={layoutProvider}
    >
      <ContactCell />
    </RecyclerView>
  );
}
