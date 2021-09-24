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
  RecyclerRow as RawRecyclerRow, RecyclerRowWrapper as RawRecyclerRowWrapper,
  UltraFastTextWrapper,
} from './ultimate';
import { data, DataCell, data2 } from './data';
import Animated, {
  useSharedValue,
  useDerivedValue,
  useAnimatedStyle, runOnJS, useAnimatedReaction,
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
  const rawDataAtIndex = useRawData()![initialPosition];
  const initialSharedData = useDerivedValue(() => rawDataAtIndex)

  //const initialPosition = useContext(PositionContext);
  // matbo copy the data and not access them on every recycle
  return useDerivedValue(() => {
    const v = data?.value?.[position?.value];
    // Some reanimated 2.2 weirdness. fixme while updating to reanimated 2.3.x
    const isMainJS = !!global.__reanimatedModuleProxy;
    const initialData = data?.value[initialPosition];
    return v ? v : isMainJS ? { ...initialData } : initialData;
  }, [rawData]);
}


function useReactiveDataAtIndex() {
  const initialPosition = useInitialPosition()
  const [currentPosition, setPosition] = useState<number>(initialPosition);
  const sharedPosition = usePosition()

  useDerivedValue(() => {
    sharedPosition?.value !== -1 && runOnJS(setPosition)(sharedPosition!.value);
  })
  const rawDara = useRawData();
  return rawDara[currentPosition];
}

function RecyclerRowWrapper(props) {
  const { initialPosition } = props;
  const position = useSharedValue<number>(-1);
  return (
    <PositionContext.Provider value={position}>
      <RawRecyclerRowWrapper {...props} />
    </PositionContext.Provider>

    )
}

function RecyclerRow(props) {


  const position = useContext(PositionContext);
  const initialPosition = useContext(InitialPositionContext);
  //useState(() => (position.value = props.initialPosition))
  const onRecycleHandler = useAnimatedRecycleHandler({ onRecycle: (e) => {
    'worklet';
    position.value = e.position;
  }});

  return (
      <AnimatedRecyclableRow {...props} onRecycle={onRecycleHandler} initialPosition={initialPosition}   />
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

const PRERENDERED_CELLS = 1;

function RecyclableViews({ children }: { children: React.ReactChild }) {
  const [cells, setCells] = useState<number>(1  )
  const onMoreRowsNeededHandler = useAnimatedRecycleHandler({
    onMoreRowsNeeded: e => {
      'worklet';
      console.log("Ok, now we neeed " + e.cells)
      runOnJS(setCells)(e.cells)
    //  console.log(e)
    }
  }, [setCells])
    console.log("rendering " + cells + "cells")
  // use reanimated event here and animated reaction
  return (
    <AnimatedCellStorage  style={{ opacity: 0.1 }} onMoreRowsNeeded={onMoreRowsNeededHandler} onMoreRowsNeededBackup={e => {
      const cellsn = e.nativeEvent.cells;
      if (cellsn > cells) {
        setCells(cellsn);
      }
    }} >
      {/* TODO make better render counting  */}
      {[...Array(Math.max(PRERENDERED_CELLS, cells))].map((_, index) => (
        <RecyclerRowWrapper
              initialPosition={index}
              key={`rl-${index}`}
              //initialPosition={index}
        >
          <InitialPositionContext.Provider value={index}>

              {children}
          </InitialPositionContext.Provider>
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
  //global.setData(data)
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
  const reactiveData = useReactiveDataAtIndex();
  console.log(reactiveData)
  const text = useDerivedValue(() => data.value?.name ?? data?.name ??'NONE');
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
    backgroundColor: data.value.color,
  }));

  const wrapperStyle = useAnimatedStyle(() => ({
    height: data.value.color === "green" ? 200 : 100,
  }));

  const {
    name,
    nested: { prof },
  } = useUltraFastData<DataCell>(); // const prof = "nested.prof"

  return (
    <RecyclerRow
      style={{
        height: reactiveData?.color === "green" ? 200 : 100,

      }}
    >
    <View
      style={[{
        height: reactiveData?.color === "green" ? 200 : 100,
        borderWidth: 2,
        backgroundColor: 'grey',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
      }]}
    >
      <Animated.View
        style={[
          {
            backgroundColor: reactiveData?.color,
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
      {/*<UltraFastText binding={name} />*/}
      {/*<UltraFastSwtich binding={"type"} >*/}
      {/*  <UltraFastCase type="loading"/>*/}
      {/*</UltraFastSwtich>*/}

      {/*<UltraFastText binding={name} />*/}
      <ReText text={text} />

      {/*<RecyclableText style={{ width: '70%' }}>Beata Kozidrak</RecyclableText>*/}
    </View>
    </RecyclerRow>
  );
}


// console.log(global.setData)
// if (global.setData) {
//   global.setData(data)
// }
// setInterval(() => console.log(global.setData), 100)
console.log("setting 1")



export default function Example() {
 // global.setDataS([])
  //global.setData(data)
  // global.setData(() => {
  //   "worklet";
  //   return data
  // })
  console.log("setting 3")
  global.setDataS(data)



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
