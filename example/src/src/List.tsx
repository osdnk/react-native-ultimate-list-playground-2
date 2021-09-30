import React, {
  useCallback,
  useRef,
  useState,
  createContext,
  Children,
  useContext, useMemo,
} from 'react';
import { View, Text, StyleSheet, ViewStyle, NativeModules } from 'react-native';
import {
  CellStorage,
  RecyclerListView,
  RecyclerRow as RawRecyclerRow, RecyclerRowWrapper as RawRecyclerRowWrapper,
  UltraFastTextWrapper,
} from './ultimate';
import { data, DataCell } from './data';
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
import { useImmediateEffect } from './useImmediateEffect';
import { GestureHandlerRootView, NativeViewGestureHandler } from 'react-native-gesture-handler';


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

const PRERENDERED_CELLS = 4;

type WrappedView = { view: JSX.Element, maxRendered?: number }

type Descriptor = WrappedView | JSX.Element


function RecyclableViews({ viewTypes }: { viewTypes: { [_ :string]: Descriptor } }) {

  return Object.entries(viewTypes).map(([type, child]) => (
    <RecyclableViewsByType key={`rlvv-${type}`} type={type} maxRendered={(child as WrappedView).maxRendered}>
      {child.hasOwnProperty("view") ? (child as WrappedView).view : child as JSX.Element}
    </RecyclableViewsByType>
  ));
}

function RecyclableViewsByType({ children, type, maxRendered }: { children: React.ReactChild, type: string, maxRendered: number | undefined }) {
  const [cells, setCells] = useState<number>(1  )
  const onMoreRowsNeededHandler = useAnimatedRecycleHandler({
    onMoreRowsNeeded: e => {
      'worklet';
      console.log("Ok, now we neeed " + e.cells)
      runOnJS(setCells)(e.cells)
      //  console.log(e)
    }
  }, [setCells])
  console.log(maxRendered);
  // use reanimated event here and animated reaction
  return (
    <AnimatedCellStorage  style={{ opacity: 0.1 }} type={type} onMoreRowsNeeded={onMoreRowsNeededHandler} onMoreRowsNeededBackup={e => {
      const cellsn = e.nativeEvent.cells;
      if (cellsn > cells) {
        setCells(cellsn);
      }
    }} >
      {/* TODO make better render counting  */}
      {[...Array(maxRendered || Math.max(PRERENDERED_CELLS, cells + 2))].map((_, index) => (
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

let id = 0;

type HashedData = { hash: string }


type TraversedData<T> = {
  data: T;
  type: string;
  sticky: boolean,
  hash: string;
}


function RecyclerView<TData>({
                               style,
                               data,
                               layoutProvider,
                               getViewType = () => "type",
                               getIsSticky = () => false,
                               getHash
                             }: {
  style: ViewStyle;
  data: TData[];
  layoutProvider: { [_ :string]: Descriptor },
  getViewType: (data: TData, i : number) => string
  getIsSticky: (data: TData, type: string, i : number) => boolean
  getHash: (data: TData, i : number) => string
}) {
  // @ts-ignore
  //global.setData(data)

  const [currId] = useState<number>(() => id++)
  const traversedData: TraversedData<TData>[] = useMemo(() => data.map(((row, index) => {
    const type = getViewType(row, index);
    const sticky = getIsSticky(row, type, index)
    const hash = getHash(row, index)
    return ({
      data: row, type, sticky, hash
    })
  })), [data, getIsSticky, getIsSticky, getHash])
  const prevData = useRef<TraversedData<TData>[]>()

  useImmediateEffect(() => {
    prevData.current && console.log(getDiffArray(prevData.current, traversedData))
    global.setDataS(traversedData, currId, prevData.current ? getDiffArray(prevData.current, traversedData) : undefined)
    return () => global.removeDataS(currId)
  }, [traversedData])

  prevData.current = traversedData;

  const datas = useDerivedValue(() => data, []);
  return (
    <GestureHandlerRootView>
      <RawDataContext.Provider value={data}>
      <DataContext.Provider value={datas}>
        <View style={style} removeClippedSubviews={false}>
          <RecyclableViews viewTypes={layoutProvider}>{}</RecyclableViews>
          {/*<NativeViewGestureHandler*/}
          {/*  shouldActivateOnStart*/}
          {/*>*/}
            <RecyclerListView
              id={currId}
              count={data.length}
              style={StyleSheet.absoluteFillObject}
            />
          {/*</NativeViewGestureHandler>*/}
        </View>
      </DataContext.Provider>
      </RawDataContext.Provider>
    </GestureHandlerRootView>
  );
}


// const List = createList<Data>();
// const { WrapperList, useUltraFastSomething, useSharedDataAtIndex, useData } = List;

// HERE starts example
function ContactCell() {
  const data = useSharedDataAtIndex();
  //const reactiveData = useReactiveDataAtIndex();
  //console.log(reactiveData)
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
      type="type1"
      style={{
        //height: reactiveData?.color === "green" ? 200 : 100,

      }}
    >
      <View
        style={[{
          // height: reactiveData?.color === "green" ? 200 : 100,
          height: 100,
          borderWidth: 2,
          backgroundColor: 'grey',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
        }]}
      >
        {/*<Animated.View*/}
        {/*  style={[*/}
        {/*    {*/}
        {/*      backgroundColor: reactiveData?.color,*/}
        {/*      width: 60,*/}
        {/*      height: 60,*/}
        {/*      borderRadius: 30,*/}
        {/*      marginRight: 20,*/}
        {/*    },*/}
        {/*  ]}*/}
        {/*/>*/}
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
        <ReText text={text} style={{ width: 150 }} />

        {/*<RecyclableText style={{ width: '70%' }}>Beata Kozidrak</RecyclableText>*/}
      </View>
    </RecyclerRow>
  );
}


function ContactCell2() {

  const {
    name,
  } = useUltraFastData<DataCell>(); // const prof = "nested.prof"

  return (
    <RecyclerRow
      type="type2"
      style={{
        height: 80,
        //height: reactiveData?.color === "green" ? 200 : 100,

      }}
    >
      <UltraFastText binding={name} />
    </RecyclerRow>
  );
}


function HeaderCell() {

  return (
    <RecyclerRow
      type="type2"
      style={{
        height: 70,
        backgroundColor: "blue"
        //height: reactiveData?.color === "green" ? 200 : 100,

      }}
    >
      <Text>
        Header
      </Text>
    </RecyclerRow>
  );
}


// console.log(global.setData)
// if (global.setData) {
//   global.setData(data)
// }
// setInterval(() => console.log(global.setData), 100)
console.log("setting 1")

//global.setDataS(data)

function useRowTypesLayout(descriptors: () =>  ({ [key :string]: Descriptor }), deps: any[] = []) {

  return useMemo(descriptors, [deps])
}

type HashToIndex = { [hash: string]: number }

function getDiffArray(prev: HashedData[], curr: HashedData[]) {
  const newIndices: number[] = [];
  const moves: {from: number, to: number}[] = [];
  const prevHashesToIndices: HashToIndex = prev.reduce((acc, val, i) => {
    acc[val.hash] = i;
    return acc;
  }, {} as HashToIndex)

  for (let i = 0; i < curr.length; i++) {
    const currData = curr[i];
    if (prevHashesToIndices[currData.hash] === undefined) {
      newIndices.push(i)
    } else if (prevHashesToIndices[currData.hash] !== i) {
      moves.push({ from: prevHashesToIndices[currData.hash], to: i })
    }
  }

  const removedIndices: number[] = [];
  const newHashesToIndices: HashToIndex = curr.reduce((acc, val, i) => {
    acc[val.hash] = i;
    return acc;
  }, {} as HashToIndex)

  for (let i = 0; i < prev.length; i++) {
    const prevData = prev[i];
    if (newHashesToIndices[prevData.hash] === undefined) {
      removedIndices.push(i)
    }
  }

  return ({
    newIndices, removedIndices
  })
  console.log(newIndices, removedIndices, moves)




}

export default function Example({ data } : { data: DataCell[] }) {
 // global.setDataS([])
  //global.setData(data)
  // global.setData(() => {
  //   "worklet";
  //   return data
  // })
  console.log("setting 3")

  const layoutProvider = useRowTypesLayout(() => ({
    header: {
      view: <HeaderCell/>,
      maxRendered: 2
    },
    type1: <ContactCell/>,
    type2: <ContactCell2/>
  }))

  const getViewType = useCallback((d) => d.index === 0 ? "header" : d.index %2 === 0 ? "type1" : "type2", [])
  const isSticky = useCallback((_, __, i) => i === 0, [])
  const getHash = useCallback((d) => d.name, [])

  return (
    <>
    <RecyclerView<DataCell>
      getViewType={getViewType}
      data={data}
      getIsSticky={isSticky}
      getHash={getHash}
      layoutProvider={layoutProvider}
      style={{ width: '100%', height: 600 }}
    />
      </>

  );
}
