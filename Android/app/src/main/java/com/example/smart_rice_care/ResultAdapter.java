package com.example.smart_rice_care;

import android.content.Context;
import android.content.Intent;
import android.content.res.Resources;
import android.net.Uri;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import org.jetbrains.annotations.NotNull;

import java.util.List;

public class ResultAdapter extends RecyclerView.Adapter<ResultAdapter.ViewHolder> {

    // Store a member variable for the contacts
    private List<Result> mResults;

    // Provide a direct reference to each of the views within a data item
    // Used to cache the views within the item layout for fast access
    public class ViewHolder extends RecyclerView.ViewHolder {
        // Your holder should contain a member variable
        // for any view that will be set as you render a row
        private TextView tvDate, tvRequestNote, tvStatus, tvPlantAge;
        private Button btViewResults;

        // We also create a constructor that accepts the entire item row
        // and does the view lookups to find each subview
        public ViewHolder(View itemView) {
            // Stores the itemView in a public final member variable that can be used
            // to access the context from any ViewHolder instance.
            super(itemView);

            tvDate = (TextView) itemView.findViewById(R.id.tvDate);
            tvRequestNote = (TextView) itemView.findViewById(R.id.tvRequestNote);
            tvStatus = (TextView) itemView.findViewById(R.id.tvStatus);
            tvPlantAge = (TextView) itemView.findViewById(R.id.tvPlantAge);

            btViewResults = (Button) itemView.findViewById(R.id.btViewResults);

        }

    }

    // Pass in the contact array into the constructor
    public ResultAdapter(List<Result> results) {
        mResults = results;
    }

    @NonNull
    @NotNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull @NotNull ViewGroup parent, int viewType) {
        Context context = parent.getContext();
        LayoutInflater inflater = LayoutInflater.from(context);

        // Inflate the custom layout
        View resultView = inflater.inflate(R.layout.item_result, parent, false);

        // Return a new holder instance
        ViewHolder viewHolder = new ViewHolder(resultView);
        return viewHolder;
    }

    @Override
    public void onBindViewHolder(@NonNull @NotNull ResultAdapter.ViewHolder holder, int position) {

        Result result = mResults.get(position);

        // Set item views based on your views and data model
        TextView tvDate = holder.tvDate;
        tvDate.setText(result.date);
        TextView tvRequestNote = holder.tvRequestNote;
        tvRequestNote.setText(result.requestNote);
        TextView tvStatus = holder.tvStatus;
        tvStatus.setText(result.status);
        TextView tvPlantAge = holder.tvPlantAge;
        tvPlantAge.setText(result.plantAge.toString());

        Button btViewLocation = holder.btViewResults;
        btViewLocation.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(v.getContext(), MapsActivity.class);
                intent.putExtra("requestId", result.requestId);
                intent.putExtra("plantAge", result.plantAge);
                v.getContext().startActivity(intent);
            }
        });


    }

    @Override
    public int getItemCount() {
        return mResults.size();
    }
}
