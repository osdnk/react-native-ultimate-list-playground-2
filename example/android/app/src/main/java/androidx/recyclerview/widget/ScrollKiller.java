package androidx.recyclerview.widget;;

public class ScrollKiller {
    public static void dontDoThisConsumePendingUpdateOperations(RecyclerView view) {
        view.consumePendingUpdateOperations();
    }
}
