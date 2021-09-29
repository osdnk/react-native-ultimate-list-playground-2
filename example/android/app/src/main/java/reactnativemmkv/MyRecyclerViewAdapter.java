package reactnativemmkv;


import android.content.Context;
import android.graphics.Color;
import android.provider.CalendarContract;
import android.util.AttributeSet;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewParent;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.recyclerview.widget.RecyclerView;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.views.view.ReactViewGroup;
import com.swmansion.gesturehandler.react.RNGestureHandlerButtonViewManager;

import java.util.HashMap;
import java.util.Map;


class CusFrameLayout extends FrameLayout {
    public CusFrameLayout(Context context) {
        super(context);
    }

    public CusFrameLayout(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    public CusFrameLayout(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
    }

    private final Runnable measureAndLayout = () -> {
        measure(
                MeasureSpec.makeMeasureSpec(getWidth(), MeasureSpec.EXACTLY),
                MeasureSpec.makeMeasureSpec(getHeight(), MeasureSpec.EXACTLY));
        layout(getLeft(), getTop(), getRight(), getBottom());
    };

    @Override
    public boolean onInterceptHoverEvent(MotionEvent event) {
        return super.onInterceptHoverEvent(event);
    }

//    @Override
//    public boolean onInterceptTouchEvent(MotionEvent ev) {
//        return true;
//    }

    @Override
    public boolean onTouchEvent(MotionEvent event) {
        return super.onTouchEvent(event);
    }


    @Override
    public void requestLayout() {
        super.requestLayout();
        post(measureAndLayout);
        getViewTreeObserver().dispatchOnGlobalLayout();
    }
}

class JSValueGetter {
  private int mPosition;
  private int mId;
  private UltimateNativeModule mModule;
  public String getJSValue(String name) {
    String v = mModule.stringValueAtIndexByKey(mPosition, name, mId);
//    if (v.equals("XXXX")) {
//      return getJSValue(name);
//    }
    return v;
  }

  public JSValueGetter(int position, UltimateNativeModule module, int id) {
    mModule = module;
    mPosition = position;
    mId = id;
  }
}

class DDCallback implements DragDropHelper.Callback {

    @Override
    public void onDragStarted(@NonNull RecyclerView.ViewHolder holder, boolean create) {
        Log.d("XXXX", "onDragStarted");

    }

    @Override
    public void onDragMoved(@NonNull RecyclerView.ViewHolder holder, int x, int y) {

    }

    @Override
    public int onDragTo(@NonNull RecyclerView.ViewHolder holder, int to) {
        return 0;
    }

    @Override
    public void onDragStopped(@NonNull RecyclerView.ViewHolder holder, boolean destroy) {

    }
}

public class MyRecyclerViewAdapter extends RecyclerView.Adapter<MyRecyclerViewAdapter.ViewHolder> implements StickyHeaders {

    private DragDropHelper dragDropHelper = new DragDropHelper();
    private DDCallback dragDropHelperCallback = new DDCallback();


    private LayoutInflater mInflater;
    int cellWidth = 0;
    int cellHeight = 0;
    boolean isCellMeasured = false;
    private ItemClickListener mClickListener;
    private ThemedReactContext mContext;
    private RecyclerListView mRecyclerViewList;
    private UltimateNativeModule mModule;
    public View mView;
    // data is passed into the constructor


  public static void setTimeout(Runnable runnable, int delay){
    new Thread(() -> {
      try {
        Thread.sleep(delay);
        runnable.run();
      }
      catch (Exception e){
        System.err.println(e);
      }
    }).start();
  }
    MyRecyclerViewAdapter(ThemedReactContext context, View view, RecyclerListView list) {
        mView = view;
        mRecyclerViewList = list;
        this.mInflater = LayoutInflater.from(context);
        mContext = context;
        mModule = context.getNativeModule(UltimateNativeModule.class);
    }

    private CellStorage findStorageByType(ViewGroup parent, String type) {
      int childrenCount = parent.getChildCount();
      for (int i = 0 ; i < childrenCount; i++) {
          CellStorage child = (CellStorage) parent.getChildAt(i);
          if (child.mType.equals(type)) {
              return child;
          }
      }
      return null;
    }

    // inflates the row layout from xml when needed

    private Map<String, Integer> typeNamesToInt = new HashMap<>();
    private Map<Integer, String> IntToTypeName = new HashMap<>();

    @Override
    public void onAttachedToRecyclerView(@NonNull RecyclerView recyclerView) {
        dragDropHelper.attach(recyclerView, dragDropHelperCallback);
    }

    @Override
    public int getItemViewType(int position) {


        String type = mModule.typeAtIndex(position, mRecyclerViewList.mId);
        if (typeNamesToInt.containsKey(type)) {
            return typeNamesToInt.get(type);
        }
        int newId = typeNamesToInt.size();
        typeNamesToInt.put(type, newId);
        IntToTypeName.put(newId, type);
        // Just as an example, return 0 or 2 depending on position
        // Note that unlike in ListView adapters, types don't have to be contiguous
        return newId;
    }

    @Override
    public ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        String type = IntToTypeName.get(viewType);
        ViewGroup vg = ((ViewGroup) mView.getParent().getParent().getParent().getParent());
        CellStorage storage = findStorageByType(vg, type);
        ViewGroup row = (ViewGroup) storage.getFirstNonEmptyChild();
      //  if (row == null) {
        FrameLayout view = new CusFrameLayout(mContext);
//          view.setMinimumHeight(storage.mMinHeight);
//          view.setMinimumWidth(storage.mMinWidth);
          ViewGroup.LayoutParams params = new FrameLayout.LayoutParams(storage.mMinWidth, storage.mMinHeight);
          Log.d("Storage size", " szie" + storage.mMinWidth +  " " + storage.mMinHeight);

          view.setLayoutParams(params);
          storage.increaseNumberOfCells();
          Log.d("DDDD", "We need more cells");
          return new ViewHolder(view);
//        } else {
//          RecyclerRow viewToReparent = (RecyclerRow) row.getChildAt(0);
//          ViewGroup.LayoutParams params = new ViewGroup.LayoutParams(viewToReparent.getWidth(), viewToReparent.getHeight());
//          row.removeView(viewToReparent);
//          LinearLayout view = new LinearLayout(mContext);
//          view.setLayoutParams(params);
//          view.addView(viewToReparent);
//          return new ViewHolder(view);
//        }
    }




  // binds the data to the TextView in each row
    @Override
    public void onBindViewHolder(ViewHolder holder, int position) {
        int viewType = holder.getItemViewType();
        holder.mLayout.setBackgroundColor(position  % 2 == 0 ? Color.MAGENTA : Color.RED);

        String type = IntToTypeName.get(viewType);
//      holder.
        //String animal = String.valueOf(mModule.valueAtIndex(position));
       // ((ReactTextView)((ViewGroup) holder.mLayout.getChildAt(0)).getChildAt(1)).setText(animal);
        ViewGroup recyclerRow = (ViewGroup) holder.mLayout.getChildAt(0);
        Log.d("XXX", "number of children " + holder.mLayout.getChildCount());
        JSValueGetter valueGetter = new JSValueGetter(position, mModule, mRecyclerViewList.mId);

        //holder.mLayout.getLayoutParams().height = position % 6 == 2 ? 400 : 200;
        //holder.mLayout.setLayoutParams(new LinearLayout.LayoutParams(holder.mLayout.getWidth(), holder.mLayout.getHeight()));

        if (recyclerRow instanceof RecyclerRow) {
          ((RecyclerRow)recyclerRow).recycle(position, valueGetter);
         // ((RecyclerRow) recyclerRow).tryResizing();
         // ((RecyclerRow) recyclerRow).post(((RecyclerRow) recyclerRow)::tryResizing);

         // holder.mLayout.setLayoutParams(new LinearLayout.LayoutParams(recyclerRow.getWidth(), recyclerRow.getHeight()));

         // recyclerRow.setLayoutParams(new LinearLayout.LayoutParams(position%2 == 1 ? 200 : 100, recyclerRow.getHeight()));
          Log.d("XXX", "having a child, recycling " + recyclerRow.getHeight());
      } else {
          ViewGroup vg = ((ViewGroup) mView.getParent().getParent().getParent().getParent());
          CellStorage vgv = findStorageByType(vg, type);
          ViewGroup rowWrapper = (ViewGroup) vgv.getFirstNonEmptyChild();
          if (rowWrapper != null) {
              Log.d("XXX", "Reparenting, v new size " + rowWrapper.getHeight());
              RecyclerRow row = (RecyclerRow) rowWrapper.getChildAt(0);
                ((RecyclerRow)row).recycle(position, valueGetter);
              row.mIgnoreResizing = 5;
              rowWrapper.removeView(row);
              holder.mLayout.removeView(recyclerRow);
              holder.mLayout.addView(row);
//              holder.mLayout.getLayoutParams().height = row.getHeight();
//              holder.mLayout.requestLayout();
//              row.mScheduleForResizing = true;
//              row.post(row::tryResizing);
           //   holder.mLayout.setLayoutParams(new RecyclerView.LayoutParams(RecyclerView.LayoutParams.WRAP_CONTENT, RecyclerView.LayoutParams.WRAP_CONTENT));
          //    holder.mLayout.setLayoutParams(new LinearLayout.LayoutParams(row.getWidth(), row.getHeight()));

            //  rowWrapper.addView(recyclerRow);
            //  recyclerRow.setLayoutParams(new LinearLayout.LayoutParams(row.getWidth(), row.getHeight()));

          } else {
              if (!holder.mRegisteredForInflating) {
                  vgv.registerViewNeedingInflating(holder.mLayout, position, mRecyclerViewList.mId);
                  holder.mRegisteredForInflating = true;
              }
              Log.d("XXX", "waiting for new rows, expected " + vgv.mNumberOfCells + "having: " + vgv.getChildCount());
          }
//          holder.mLayout.removeView(holder.mLayout.getChildAt(0));
//          holder.mLayout.addView(row);
          //holder.mLayout.
      }

        //holder.myTextView.setText(animal);
//        if (holder.mLayout.getChildCount() == 0) {
//          ViewGroup vg = ((ViewGroup) mView.getParent().getParent().getParent());
//          ViewGroup vgv = (ViewGroup) vg.getChildAt(0);
//          if (vgv.getChildCount() != 0) {
//            View viewToReparent = vgv.getChildAt(0);
//            vgv.removeView(viewToReparent);
//            holder.mLayout.addView(viewToReparent);
//          }
////          ((ViewGroup) mView.getParent().getParent().getParent()).removeView(vg);
////          holder.mLayout.addView(vg);
//        }

//        if (holder.mLayout.getChildCount() != 0) {
//          Log.d("GG", "GG");
        //((ReactTextView) ((ViewGroup) ((ViewGroup) holder.mLayout.getChildAt(0)).getChildAt(0)).getChildAt(1)).setText(animal);
//        }


    }

    // total number of rows
    @Override
    public int getItemCount() {
        return mModule.length(mRecyclerViewList.mId);
    }

    @Override
    public boolean isStickyHeader(int position) {
        return mModule.isHeaderAtIndex(position, mRecyclerViewList.mId);
    }


    // stores and recycles views as they are scrolled off screen
    public class ViewHolder extends RecyclerView.ViewHolder implements View.OnLongClickListener {
        TextView myTextView;
        ReactViewGroup mRVG;
        public boolean mRegisteredForInflating = false;
        FrameLayout mLayout;

        private final Runnable measureAndLayout = () -> {
            mLayout.measure(
                    View.MeasureSpec.makeMeasureSpec(mLayout.getWidth(), View.MeasureSpec.EXACTLY),
                    View.MeasureSpec.makeMeasureSpec(mLayout.getHeight(), View.MeasureSpec.EXACTLY));
            mLayout.layout(mLayout.getLeft(), mLayout.getTop(), mLayout.getRight(), mLayout.getBottom());
        };

        ViewHolder(FrameLayout itemView) {
            super(itemView);
            mLayout = itemView;
            itemView.setOnLongClickListener(this);
        }



        @Override
        public boolean onLongClick(View v) {
            Log.d("DDD", "DDD");
            mRecyclerViewList.adapter.dragDropHelper.start(getBindingAdapterPosition());
            return false;
        }
    }

    // allows clicks events to be caught
    void setClickListener(ItemClickListener itemClickListener) {
        this.mClickListener = itemClickListener;
    }

    // parent activity will implement this method to respond to click events
    public interface ItemClickListener {
        void onItemClick(View view, int position);
    }
}
