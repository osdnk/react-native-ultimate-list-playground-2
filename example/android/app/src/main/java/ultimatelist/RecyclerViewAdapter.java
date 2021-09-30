package ultimatelist;

import com.facebook.react.uimanager.ThemedReactContext;

class RecyclerViewAdapter extends RecyclerRow {
  private RecyclerRow mRow;

  public RecyclerViewAdapter(ThemedReactContext context, RecyclerRow view) {
    super(context);
    mRow = view;
  }
}
