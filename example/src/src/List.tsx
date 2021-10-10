import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View, ViewProps, ViewStyle, TextInput, Platform } from 'react-native';
import {
  CellStorage,
  RecyclerListView,
  RecyclerRow as RawRecyclerRow,
  RecyclerRowWrapper as RawRecyclerRowWrapper,
  UltraFastTextWrapper,
} from './ultimate';
import Animated, { runOnJS, useDerivedValue, useSharedValue } from 'react-native-reanimated';
import { useAnimatedRecycleHandler } from './useAnimatedRecycleEvent';
import type { SharedValue } from 'react-native-reanimated/src/reanimated2/commonTypes';
// @ts-ignore TODO osdnk
import { useImmediateEffect } from './useImmediateEffect';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { getDiffArray } from './diffArray';

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





export function useSharedDataAtIndex() {
  const data = useData();
  const position = usePosition();
  const initialPosition = useInitialPosition();
  const rawData = useRawData()!;
  return useDerivedValue(() => {
    const v = data?.value?.[position!.value];
    // Some reanimated 2.2 weirdness. fixme while updating to reanimated 2.3.x
    // @ts-ignore
    const isMainJS = !!global.__reanimatedModuleProxy;
    const initialData = data?.value[initialPosition];
    return v ? v : isMainJS ? { ...initialData } : initialData;
  }, [rawData]);
}


export function useReactiveDataAtIndex() {
  const initialPosition = useInitialPosition()
  const [currentPosition, setPosition] = useState<number>(initialPosition);
  const sharedPosition = usePosition()

  useDerivedValue(() => {
    sharedPosition?.value !== -1 && runOnJS(setPosition)(sharedPosition!.value);
  })
  const rawDara = useRawData();
  return rawDara![currentPosition];
}

function RecyclerRowWrapper(props) {
  const position = useSharedValue<number>(-1);
  return (
    <PositionContext.Provider value={position}>
      <RawRecyclerRowWrapper {...props} />
    </PositionContext.Provider>

    )
}

export function RecyclerRow(props: ViewProps) {


  const position = useContext(PositionContext);
  const initialPosition = useContext(InitialPositionContext);
  //useState(() => (position.value = props.initialPosition))
  const onRecycleHandler = useAnimatedRecycleHandler({ onRecycle: (e) => {
    'worklet';
    console.log(e)
    position!.value = e.position;
  }});


  // TODO osdnk sometimes broken

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

export function useUltraFastData<TCellData extends object>() {
  return new Proxy({ binding: '' }, namingHandler) as any as TCellData;
}

export function UltraFastText({ binding }: { binding: string }) {
  const Component = Platform.OS === "ios" ? TextInput : Text;
  return (
    // @ts-ignore
    <UltraFastTextWrapper binding={binding.___binding}>
      <Component style={{ width: 100 }} />
    </UltraFastTextWrapper>
  );
}

const AnimatedCellStorage = Animated.createAnimatedComponent(CellStorage)

const PRERENDERED_CELLS = 15; // todo osdnk

type WrappedView = { view: JSX.Element, maxRendered?: number }

type Descriptor = WrappedView | JSX.Element


function RecyclableViews({ viewTypes }: { viewTypes: { [_ :string]: Descriptor } }) {

  return (<>{Object.entries(viewTypes).map(([type, child]) => (
    <RecyclableViewsByType key={`rlvv-${type}`} type={type} maxRendered={(child as WrappedView).maxRendered}>
      {child.hasOwnProperty("view") ? (child as WrappedView).view : child as JSX.Element}
    </RecyclableViewsByType>
  ))}</>)
}

function RecyclableViewsByType({ children, type, maxRendered }: { children: React.ReactChild, type: string, maxRendered: number | undefined }) {
  const [cells, setCells] = useState<number>(1  )
  const onMoreRowsNeededHandler = useAnimatedRecycleHandler({
    onMoreRowsNeeded: e => {
      "worklet"
      runOnJS(setCells)(e.cells)
    }
  }, [setCells])
  console.log(maxRendered);
  // use reanimated event here and animated reaction
  return (
    <AnimatedCellStorage  style={{ opacity: 0.1 }} type={type} typeable={type} onMoreRowsNeeded={onMoreRowsNeededHandler} onMoreRowsNeededBackup={e => {
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





type TraversedData<T> = {
  data: T;
  type: string;
  sticky: boolean,
  hash: string;
}

export function useRowTypesLayout(descriptors: () =>  ({ [key :string]: Descriptor }), deps: any[] = []) {

  return useMemo(descriptors, [deps])
}


export function RecyclerView<TData>({
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
    // @ts-ignore
    global._list___setData(traversedData, currId, prevData.current ? getDiffArray(prevData.current, traversedData) : undefined)
  }, [traversedData])

  // @ts-ignore
  useEffect(() => () => global._list___removeData(currId), [])

  prevData.current = traversedData;

  const datas = useDerivedValue(() => data, []);
  return (
    <GestureHandlerRootView>
      <RawDataContext.Provider value={data}>
      <DataContext.Provider value={datas}>
        <View style={style} removeClippedSubviews={false}>
          <RecyclableViews viewTypes={layoutProvider}/>
          {/*<NativeViewGestureHandler*/}
          {/*  shouldActivateOnStart*/}
          {/*>*/}
          <RecyclerListView
            id={currId}
            identifier={currId}
            count={data.length}
            style={[StyleSheet.absoluteFill, { backgroundColor: 'red' }]}
          />
          {/*</NativeViewGestureHandler>*/}
        </View>
      </DataContext.Provider>
      </RawDataContext.Provider>
    </GestureHandlerRootView>
  );
}

