package com.example.smart_rice_care;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.QueryDocumentSnapshot;
import com.google.firebase.firestore.QuerySnapshot;

import org.jetbrains.annotations.NotNull;

import java.sql.Timestamp;
import java.text.DateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

public class SendRequestActivity extends AppCompatActivity {

    Button btAddLocation, btSendRequest;
    TextView tvLatitude, tvLongitude;
    EditText etNotes, etPlantAge;
    LatLng currentMarker = null;
    Double latitude, longitude;
    ProgressBar progressBar;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_send_request);

        tvLatitude = findViewById(R.id.tvLatitude);
        tvLongitude = findViewById(R.id.tvLongitude);
        etNotes = findViewById(R.id.etNotes);
        etPlantAge = findViewById(R.id.etPlantAge);
        progressBar = findViewById(R.id.progressBar);
        progressBar.setVisibility(View.GONE);

        btAddLocation = findViewById(R.id.btAddLocation);
        btSendRequest = findViewById(R.id.btSendRequest);

        Bundle extras = getIntent().getExtras();
        if(extras!=null){
            latitude = extras.getDouble("latitude");
            longitude = extras.getDouble("longitude");
            currentMarker = new LatLng(latitude, longitude);
            tvLatitude.setText(latitude.toString());
            tvLongitude.setText(longitude.toString());
        }


        btAddLocation.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(SendRequestActivity.this, SendRequestMapActivity.class);
                startActivity(intent);
            }
        });

        btSendRequest.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String notes = etNotes.getText().toString();
                String plantAgeString= etPlantAge.getText().toString();
                int plantAge=Integer.parseInt(plantAgeString);
                if(latitude==null || longitude==null){
                    Toast.makeText(SendRequestActivity.this, "Please add the location of your field", Toast.LENGTH_SHORT).show();
                }
                else{

                    progressBar.setVisibility(View.VISIBLE);

                    FirebaseAuth mAuth = FirebaseAuth.getInstance();
                    String uId = mAuth.getInstance().getUid();

                    FirebaseFirestore db = FirebaseFirestore.getInstance();
                    db.collection("FieldDetails")
                            .whereEqualTo("farmerId", uId)
                            .get()
                            .addOnCompleteListener(new OnCompleteListener<QuerySnapshot>() {
                                @Override
                                public void onComplete(@NonNull @NotNull Task<QuerySnapshot> task) {
                                    if(task.isSuccessful()){
                                        for(QueryDocumentSnapshot document: task.getResult()){
                                            String fieldId = document.getId();
                                            String division = document.getData().get("division").toString();

                                            String date = DateFormat.getDateTimeInstance().format(new Date());
                                            Long timestamp = System.currentTimeMillis();

                                            Map<String, Object> fieldRequestData = new HashMap<>();
                                            fieldRequestData.put("fieldId",fieldId);
                                            fieldRequestData.put("division",division);
                                            fieldRequestData.put("requestNote",notes);
                                            fieldRequestData.put("latitude",latitude);
                                            fieldRequestData.put("longitude",longitude);
                                            fieldRequestData.put("plantAge",plantAge);
                                            fieldRequestData.put("status","pending");
                                            fieldRequestData.put("createdDate", date);
                                            fieldRequestData.put("createdTimestamp", timestamp);
                                            fieldRequestData.put("modifiedDate", date);
                                            fieldRequestData.put("modifiedTimestamp", timestamp);

                                            db.collection("FieldRequests")
                                                .add(fieldRequestData)
                                                .addOnSuccessListener(new OnSuccessListener<DocumentReference>() {
                                                    @Override
                                                    public void onSuccess(DocumentReference documentReference) {
                                                        progressBar.setVisibility(View.GONE);
                                                        Toast.makeText(SendRequestActivity.this, "Request Sent", Toast.LENGTH_SHORT).show();
                                                        finish();
                                                    }
                                                })
                                                .addOnFailureListener(new OnFailureListener() {
                                                    @Override
                                                    public void onFailure(@NonNull @NotNull Exception e) {
                                                        Toast.makeText(SendRequestActivity.this, ""+e.getMessage(), Toast.LENGTH_SHORT).show();
                                                        Log.w("Data insertion Error", e);
                                                    }
                                                });
                                        }
                                    }
                                }
                            });

                }
            }
        });
    }
}