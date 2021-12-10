package com.example.smart_rice_care;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import org.jetbrains.annotations.NotNull;

import java.util.List;

public class RequestAdapter extends RecyclerView.Adapter<RequestAdapter.ViewHolder> {

    // Store a member variable for the contacts
    private List<Request> mRequests;

    // Provide a direct reference to each of the views within a data item
    // Used to cache the views within the item layout for fast access
    public class ViewHolder extends RecyclerView.ViewHolder {
        // Your holder should contain a member variable
        // for any view that will be set as you render a row
        public TextView division;
        public TextView longitude;
        public TextView latitude;

        // We also create a constructor that accepts the entire item row
        // and does the view lookups to find each subview
        public ViewHolder(View itemView) {
            // Stores the itemView in a public final member variable that can be used
            // to access the context from any ViewHolder instance.
            super(itemView);

            division = (TextView) itemView.findViewById(R.id.division);
            longitude = (TextView) itemView.findViewById(R.id.longitude);
            latitude = (TextView) itemView.findViewById(R.id.latitude);
        }

    }

    // Pass in the contact array into the constructor
    public RequestAdapter(List<Request> requests) {
        mRequests = requests;
    }

    @NonNull
    @NotNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull @NotNull ViewGroup parent, int viewType) {
        Context context = parent.getContext();
        LayoutInflater inflater = LayoutInflater.from(context);

        // Inflate the custom layout
        View requestView = inflater.inflate(R.layout.item_request, parent, false);

        // Return a new holder instance
        ViewHolder viewHolder = new ViewHolder(requestView);
        return viewHolder;
    }

    @Override
    public void onBindViewHolder(@NonNull @NotNull RequestAdapter.ViewHolder holder, int position) {

        Request request = mRequests.get(position);

        // Set item views based on your views and data model
        TextView tvDivision = holder.division;
        tvDivision.setText(request.getDivision());
        TextView tvLongitude = holder.longitude;
        tvLongitude.setText(request.getLongitude().toString());
        TextView tvLatitude = holder.latitude;
        tvLatitude.setText(request.getLatitude().toString());
    }

    @Override
    public int getItemCount() {
        return mRequests.size();
    }
}
