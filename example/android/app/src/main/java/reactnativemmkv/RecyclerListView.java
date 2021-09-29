package reactnativemmkv;

import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.LinearLayout;

import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.reactnativemultithreading.R;
import com.facebook.react.uimanager.ThemedReactContext;

class RecyclerListView extends LinearLayout {
  private ThemedReactContext context;
  MyRecyclerViewAdapter adapter;
  int mCount = -1;
  int mId = -1;
  int mRlv = -1;

  public void notifyNewData() {
    RecyclerView view = (RecyclerView) adapter.mView;
    int childrenCount = view.getChildCount();
    for (int i = 0 ; i < childrenCount; i++) {
      View child = view.getChildAt(i);
      if (child instanceof FrameLayout) {
        View row = ((FrameLayout) child).getChildAt(0);
        if (row instanceof RecyclerRow) {
          ((RecyclerRow) row).renotifyUltraFastEvents();
        }

      }
    }
  }

  public RecyclerListView(ThemedReactContext context) {
    super(context);
    this.context = context;
    inflate(context, R.layout.activity_main, this);
    RecyclerView recyclerView = findViewById(R.id.rvAnimals);
    recyclerView.setLayoutManager(new StickyHeadersLinearLayoutManager(context));
    adapter = new MyRecyclerViewAdapter(context, recyclerView, this);
    recyclerView.setAdapter(adapter);
  }
}
