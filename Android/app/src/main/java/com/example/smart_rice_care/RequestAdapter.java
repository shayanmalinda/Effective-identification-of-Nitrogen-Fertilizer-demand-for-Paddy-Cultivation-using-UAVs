package com.example.smart_rice_care;

import android.content.Context;
import android.content.Intent;
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

public class RequestAdapter extends RecyclerView.Adapter<RequestAdapter.ViewHolder> {

    // Store a member variable for the contacts
    private List<Request> mRequests;

    // Provide a direct reference to each of the views within a data item
    // Used to cache the views within the item layout for fast access
    public class ViewHolder extends RecyclerView.ViewHolder {
        // Your holder should contain a member variable
        // for any view that will be set as you render a row
        private TextView tvDate, tvFarmerName, tvPhone, tvRequestNote, tvAddress, tvStatus, tvPlantAge;
        private Button btViewLocation, btStartExamine;

        // We also create a constructor that accepts the entire item row
        // and does the view lookups to find each subview
        public ViewHolder(View itemView) {
            // Stores the itemView in a public final member variable that can be used
            // to access the context from any ViewHolder instance.
            super(itemView);

            tvDate = (TextView) itemView.findViewById(R.id.tvDate);
            tvFarmerName = (TextView) itemView.findViewById(R.id.tvFarmerName);
            tvPhone = (TextView) itemView.findViewById(R.id.tvPhone);
            tvAddress = (TextView) itemView.findViewById(R.id.tvAddress);
            tvStatus = (TextView) itemView.findViewById(R.id.tvStatus);
            tvPlantAge = (TextView) itemView.findViewById(R.id.tvPlantAge);
            tvRequestNote = (TextView) itemView.findViewById(R.id.tvRequestNote);
            btViewLocation = (Button) itemView.findViewById(R.id.btViewLocation);
            btStartExamine = (Button) itemView.findViewById(R.id.btStartExamine);

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
        TextView tvDate = holder.tvDate;
        tvDate.setText(request.getDate());
        TextView tvFarmerName = holder.tvFarmerName;
        tvFarmerName.setText(request.getFarmerFirstName() + " " + request.getFarmerLastName());
        TextView tvPhone = holder.tvPhone;
        tvPhone.setText(request.getPhone());
        TextView tvAddress = holder.tvAddress;
        tvAddress.setText(request.getAddress());
        TextView tvRequestNote = holder.tvRequestNote;
        tvRequestNote.setText(request.getRequestNote());
        TextView tvStatus = holder.tvStatus;
        tvStatus.setText(request.getStatus());
        TextView tvPlantAge = holder.tvPlantAge;
        tvPlantAge.setText(String.valueOf(request.getPlantAge()));

        Button btViewLocation = holder.btViewLocation;
        btViewLocation.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // Create a Uri from an intent string. Use the result to create an Intent.
                Uri gmmIntentUri = Uri.parse("geo:"+request.getLatitude()+","+request.getLongitude()+"?q="+request.getLatitude()+","+request.getLongitude());

                // Create an Intent from gmmIntentUri. Set the action to ACTION_VIEW
                Intent mapIntent = new Intent(Intent.ACTION_VIEW, gmmIntentUri);
                // Make the Intent explicit by setting the Google Maps package
                mapIntent.setPackage("com.google.android.apps.maps");

                // Attempt to start an activity that can handle the Intent
                v.getContext().startActivity(mapIntent);
            }
        });

        Button btStartExamine = holder.btStartExamine;
        btStartExamine.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(v.getContext(), ExamineFieldActivity.class);
                intent.putExtra("requestId", request.getRequestId());
                intent.putExtra("plantAge", request.getPlantAge());
                intent.putExtra("fieldId", request.getFieldId());
                intent.putExtra("farmerId", request.getFarmerId());
                v.getContext().startActivity(intent);
            }
        });
    }

    @Override
    public int getItemCount() {
        return mRequests.size();
    }
}
