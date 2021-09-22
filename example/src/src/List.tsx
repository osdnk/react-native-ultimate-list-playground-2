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
  RecyclerRow as RawRecyclerRow, RecyclerRowWrapper,
  UltraFastTextWrapper,
} from './ultimate';
import { data, DataCell, data2 } from './data';
import Animated, {
  useSharedValue,
  useDerivedValue,
  useAnimatedStyle, runOnJS,
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
const RawDataContext = createContext<any[] | null>(null);
const PositionContext = createContext<Animated.SharedValue<number> | null>(
  null
);
const InitialPositionContext = createContext<number>(
  -1
);

const AnimatedRecyclableRow = Animated.createAnimatedComponent(RawRecyclerRow);

function usePosition() {
  return useContext(PositionContext);
}

function useInitialPosition() {
  return useContext(InitialPositionContext);
}

function useData() {
  return useContext(DataContext);
}

function useRawData() {
  return useContext(RawDataContext);
}




function useInitialDataAtIndex() {
  const data = useData();
  const position = useInitialPosition();

  return data?.[position];
  //const initialPosition = useContext(PositionContext);
  // matbo copy the data and not access them on every recycle
  // @ts-ignore

}

function useSharedDataAtIndex() {
  const data = useData();
  const position = usePosition();
  const initialPosition = useInitialPosition();
  const rawData = useRawData()!;
  const rawDataAtIndex = useRawData()![1];
  const initialSharedData = useDerivedValue(() => rawDataAtIndex)

  //const initialPosition = useContext(PositionContext);
  // matbo copy the data and not access them on every recycle
  return useDerivedValue(() => {
    const v = rawData[position?.value];
    // Some reanimated 2.2 weirdness. fixme while updating to reanimated 2.3.x
     const isMainJS = !!global.__reanimatedModuleProxy;
    return v ? v : isMainJS ? { ...initialSharedData } : initialSharedData;
  }, [rawData]);
}

function RecyclerRow(props: { initialPosition: number }) {

  const position = useSharedValue<number>(-1);
  //useState(() => (position.value = props.initialPosition))
  const onRecycleHandler = useAnimatedRecycleHandler({ onRecycle: (e) => {
    'worklet';
    //console.log(e)
    position.value = e.position;
  }});

  return (
    <InitialPositionContext.Provider value={props.initialPosition}>
      <PositionContext.Provider value={position}>
        <AnimatedRecyclableRow {...props} onRecycle={onRecycleHandler} initialPosition={props.initialPosition}   />
      </PositionContext.Provider>
    </InitialPositionContext.Provider>
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

const AnimatedCellStorage = Animated.createAnimatedComponent(CellStorage)

const PRERENDERED_CELLS = 10;

function RecyclableViews({ children }: { children: React.ReactChild }) {
  const [cells, setCells] = useState<number>(0  )
  const onMoreRowsNeededHandler = useAnimatedRecycleHandler({
    onMoreRowsNeeded: e => {
      'worklet';
      runOnJS(setCells)(e.cells)
    //  console.log(e)
    }
  }, [setCells])
  //console.log("rendering " + cells + "cells")
  // use reanimated event here and animated reaction
  return (
    <AnimatedCellStorage  style={{ opacity: 0.1 }} onMoreRowsNeeded={onMoreRowsNeededHandler} >
      {/* TODO make better render counting  */}
      {[...Array(Math.max(PRERENDERED_CELLS, cells))].map((_, index) => (
        <RecyclerRowWrapper
              key={`rl-${index}`}

        >
          <RecyclerRow
            initialPosition={index}
            removeClippedSubviews={false}
          >
            {children}
          </RecyclerRow>
        </RecyclerRowWrapper>
      ))}
    </AnimatedCellStorage>
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
  const datas = useDerivedValue(() => data, [data]);
  return (
    <RawDataContext.Provider value={data}>
    <DataContext.Provider value={datas}>
      <View style={style} removeClippedSubviews={false}>
        <RecyclableViews>{children}</RecyclableViews>
        <RecyclerListView
          count={data.length}
          style={StyleSheet.absoluteFillObject}
        />
      </View>
    </DataContext.Provider>
    </RawDataContext.Provider>
  );
}


// const List = createList<Data>();
// const { WrapperList, useUltraFastSomething, useSharedDataAtIndex, useData } = List;

// HERE starts example
function ContactCell() {
  const data = useSharedDataAtIndex();
  const text = useDerivedValue(() => data.value?.name ?? data?.name ??'NONE');
  const color = useDerivedValue(() => {
    const name = data.value?.name ?? '';
    !data && console.log("rerived", data)
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
    name,
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
          {
            backgroundColor: "blue",
            width: 60,
            height: 60,
            borderRadius: 30,
            marginRight: 20,
          },
        ]}
      />
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
      <UltraFastText binding={name} />
      {/*<UltraFastSwtich binding={"type"} >*/}
      {/*  <UltraFastCase type="loading"/>*/}
      {/*</UltraFastSwtich>*/}

      {/*<UltraFastText binding={name} />*/}
      {/*<ReText text={text} />*/}

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
