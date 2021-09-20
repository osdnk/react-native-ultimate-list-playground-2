package reactnativemmkv;


import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.recyclerview.widget.RecyclerView;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.views.view.ReactViewGroup;

class JSValueGetter {
  private int mPosition;
  private UltimateNativeModule mModule;
  public String getJSValue(String name) {
    String v = mModule.stringValueAtIndexByKey(mPosition, name);
//    if (v.equals("XXXX")) {
//      return getJSValue(name);
//    }
    return v;
  }

  public JSValueGetter(int position, UltimateNativeModule module) {
    mModule = module;
    mPosition = position;
  }
}

public class MyRecyclerViewAdapter extends RecyclerView.Adapter<MyRecyclerViewAdapter.ViewHolder> {

    private LayoutInflater mInflater;
    int cellWidth = 0;
    int cellHeight = 0;
    boolean isCellMeasured = false;
    private ItemClickListener mClickListener;
    private ThemedReactContext mContext;
    private RecyclerListView mRecyclerViewList;
    private UltimateNativeModule mModule;
    private View mView;
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

    // inflates the row layout from xml when needed
    @Override
    public ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        ViewGroup vg = ((ViewGroup) mView.getParent().getParent().getParent());
        ViewGroup vgv = (ViewGroup) vg.getChildAt(0);
        RecyclerRow viewToReparent = (RecyclerRow) vgv.getChildAt(0);
        if (viewToReparent == null) {
          LinearLayout view = new LinearLayout(mContext);
          ViewGroup.LayoutParams params = new ViewGroup.LayoutParams(cellWidth, cellHeight);
          view.setLayoutParams(params);
          return new ViewHolder(view);
        } else {

          cellWidth = viewToReparent.getWidth();
          cellHeight = viewToReparent.getHeight();
          isCellMeasured = true;
          ViewGroup.LayoutParams params = new ViewGroup.LayoutParams(viewToReparent.getWidth(), viewToReparent.getHeight());
          vgv.removeView(viewToReparent);
          LinearLayout view = new LinearLayout(mContext);
          view.setLayoutParams(params);
          view.addView(viewToReparent);
          return new ViewHolder(view);
        }
    }




  // binds the data to the TextView in each row
    @Override
    public void onBindViewHolder(ViewHolder holder, int position) {
        //String animal = String.valueOf(mModule.valueAtIndex(position));
       // ((ReactTextView)((ViewGroup) holder.mLayout.getChildAt(0)).getChildAt(1)).setText(animal);
      RecyclerRow recyclerRow = (RecyclerRow) holder.mLayout.getChildAt(0);
      JSValueGetter valueGetter = new JSValueGetter(position, mModule);
      recyclerRow.recycle(position, valueGetter);
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
        return mRecyclerViewList.mCount;
    }


    // stores and recycles views as they are scrolled off screen
    public class ViewHolder extends RecyclerView.ViewHolder implements View.OnClickListener {
        TextView myTextView;
        ReactViewGroup mRVG;
        LinearLayout mLayout;

        ViewHolder(LinearLayout itemView) {
            super(itemView);
            mLayout = itemView;
           // myTextView = itemView.findViewById(R.id.tvAnimalName);
            itemView.setOnClickListener(this);
//            mRVG = itemView.findViewById(R.id.tvAnimalName2);
        }

        @Override
        public void onClick(View view) {
            if (mClickListener != null) mClickListener.onItemClick(view, getAdapterPosition());
        }
    }

    // convenience method for getting data at click position
//    String getItem(int id) {
//        return mData.get(id);
//    }

    // allows clicks events to be caught
    void setClickListener(ItemClickListener itemClickListener) {
        this.mClickListener = itemClickListener;
    }

    // parent activity will implement this method to respond to click events
    public interface ItemClickListener {
        void onItemClick(View view, int position);
    }
}
