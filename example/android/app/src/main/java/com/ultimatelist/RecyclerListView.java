package com.ultimatelist;

import android.content.Context;
import android.os.Handler;
import android.os.Looper;
import android.util.AttributeSet;
import android.widget.LinearLayout;

import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.recyclerview.widget.ScrollKiller;
import com.example.reactnativemultithreading.R;
import com.facebook.react.uimanager.ThemedReactContext;

class RecyclerListView extends LinearLayout {
  private ThemedReactContext context;
  MyRecyclerViewAdapter adapter;
  int mCount = -1;
  int mId = -1;

  public void notifyNewData() {
    RecyclerView view = (RecyclerView) adapter.mView;
    MyRecyclerViewAdapter adapter = (MyRecyclerViewAdapter) view.getAdapter();
    view.post(() -> {
      UltimateNativeModule.moveFromPreSet(mId);
      if (adapter != null) {

        int [] removed = UltimateNativeModule.getRemoved(mId);
        int [] added = UltimateNativeModule.getAdded(mId);
        int rrange = 1;
        for (int i = 0; i< removed.length; i++) {
          int r = removed[i];
          int r2 = i + 1 == removed.length ? 0 : removed[i+1];
          if (r2 - r == 1) {
            rrange++;
          } else {
            if (rrange == 1) {
              adapter.notifyItemRemoved(r);
            } else {
              adapter.notifyItemRangeRemoved(r - rrange + 1, rrange);
            }
          }
        }

        int arange = 1;
        for (int i = 0; i< added.length; i++) {
          int r = added[i];
          int r2 = i + 1 == added.length ? 0 : added[i+1];
          if (r2 - r == 1) {
            arange++;
          } else {
            if (arange == 1) {
              adapter.notifyItemInserted(r);
            } else {
              adapter.notifyItemRangeInserted(r - arange + 1, arange);
            }
          }
        }
        ScrollKiller.dontDoThisConsumePendingUpdateOperations(view);
      }
    });
  }

  public RecyclerListView(ThemedReactContext context) {
    super(context);
    this.context = context;
    inflate(context, R.layout.activity_main, this);
    RecyclerView recyclerView = findViewById(R.id.rvAnimals);
    recyclerView.setLayoutManager(new StickyHeadersLinearLayoutManager(context));
    adapter = new MyRecyclerViewAdapter(context, recyclerView, this);
    // TODO osdnk
    // adapter.setHasStableIds(true);
    recyclerView.setAdapter(adapter);
  }
}