package reactnativemmkv;

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

  public RecyclerListView(ThemedReactContext context) {
    super(context);
    this.context = context;
    inflate(context, R.layout.activity_main, this);
    RecyclerView recyclerView = findViewById(R.id.rvAnimals);
    recyclerView.setLayoutManager(new LinearLayoutManager(context));
    adapter = new MyRecyclerViewAdapter(context, recyclerView, this);
    recyclerView.setAdapter(adapter);
  }
}
