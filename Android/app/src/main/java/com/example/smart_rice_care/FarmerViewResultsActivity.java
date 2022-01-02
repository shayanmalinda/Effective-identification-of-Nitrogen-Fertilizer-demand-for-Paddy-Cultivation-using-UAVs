package com.example.smart_rice_care;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.ProgressBar;
import android.widget.Toast;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FieldPath;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.Query;
import com.google.firebase.firestore.QueryDocumentSnapshot;
import com.google.firebase.firestore.QuerySnapshot;

import org.jetbrains.annotations.NotNull;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;

public class FarmerViewResultsActivity extends AppCompatActivity {

    ProgressBar progressBar;
    ArrayList<Result> results = new ArrayList<>();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_farmer_view_results);
        progressBar = findViewById(R.id.progressBar);
        progressBar.setVisibility(View.VISIBLE);
        getRequests();

    }

    public void getRequests() {

        FirebaseAuth mAuth = FirebaseAuth.getInstance();
        String uId = mAuth.getInstance().getUid();
        FirebaseFirestore db = FirebaseFirestore.getInstance();
        db.collection("FieldDetails")
                .whereEqualTo("farmerId",uId)
                .get()
                .addOnCompleteListener(new OnCompleteListener<QuerySnapshot>() {
                    @Override
                    public void onComplete(@NonNull @NotNull Task<QuerySnapshot> task) {
                        if(task.isSuccessful()){
                            String fieldId = "";
                            for(QueryDocumentSnapshot document: task.getResult()){
                                fieldId = document.getId();
                            }
                            String finalFieldId = fieldId;
                            db.collection("FieldRequests")
                                    .whereEqualTo("fieldId",fieldId)
                                    .get()
                                    .addOnCompleteListener(new OnCompleteListener<QuerySnapshot>() {
                                        @Override
                                        public void onComplete(@NonNull @NotNull Task<QuerySnapshot> task) {
                                            if(task.isSuccessful()){
                                                for(QueryDocumentSnapshot document: task.getResult()){
                                                    String requestId = document.getId();
                                                    String date = document.getString("date");
                                                    Double latitude = document.getDouble("latitude");
                                                    Double longitude = document.getDouble("longitude");
                                                    String requestNote = document.getString("requestNote");
                                                    int plantAge = document.getDouble("plantAge").intValue();
                                                    Long timestamp = document.getLong("timestamp");
                                                    String status = document.getString("status");

                                                    Result result = new Result();
                                                    result.date = date;
                                                    result.requestId = requestId;
                                                    result.longitude = longitude;
                                                    result.latitude = latitude;
                                                    result.requestNote = requestNote;
                                                    result.status = status;
                                                    result.fieldId = finalFieldId;
                                                    result.plantAge = plantAge;
                                                    result.timestamp = timestamp;

                                                    results.add(result);
                                                    Collections.sort(results,new Comparator<Result>(){
                                                        public int compare(Result r1, Result r2){
                                                            if(r1.timestamp == r2.timestamp)
                                                                return 0;
                                                            return r1.timestamp > r2.timestamp ? -1 : 1;
                                                        }
                                                    });
                                                    RecyclerView rvRequests = (RecyclerView) findViewById(R.id.rvResults);
                                                    ResultAdapter adapter = new ResultAdapter(results);
                                                    rvRequests.setAdapter(adapter);
                                                    rvRequests.setLayoutManager(new LinearLayoutManager(FarmerViewResultsActivity.this));
                                                }
                                                progressBar.setVisibility(View.GONE);
                                            }
                                            else{
                                                progressBar.setVisibility(View.GONE);
                                                Toast.makeText(FarmerViewResultsActivity.this, "Requests fetching failed", Toast.LENGTH_SHORT).show();
                                            }
                                        }
                                    });
                        }
                    }
                });

    }
}