import { requireNativeComponent, ViewProps } from 'react-native';

export const RecyclerListView = requireNativeComponent<
  ViewProps & { count: number }
>('RecyclerListView');
export const RecyclerRow = requireNativeComponent('RecyclerRow');
export const CellStorage = requireNativeComponent('CellStorage');
export const UltraFastTextWrapper = requireNativeComponent(
  'UltraFastTextWrapper'
);
