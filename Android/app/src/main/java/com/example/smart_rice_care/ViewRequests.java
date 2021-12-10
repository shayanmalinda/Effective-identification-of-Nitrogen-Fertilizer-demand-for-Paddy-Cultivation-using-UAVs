package com.example.smart_rice_care;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

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
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.QueryDocumentSnapshot;
import com.google.firebase.firestore.QuerySnapshot;

import org.jetbrains.annotations.NotNull;

import java.util.ArrayList;

public class ViewRequests extends AppCompatActivity {

    String division;
    ProgressBar progressBar;
    ArrayList<Request> requests = new ArrayList<>();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_view_requests);
        progressBar = findViewById(R.id.progressBar);
        progressBar.setVisibility(View.VISIBLE);
        getRequests();

    }

    public void getRequests() {

        FirebaseAuth mAuth = FirebaseAuth.getInstance();
        String uId = mAuth.getInstance().getUid();
        FirebaseFirestore db = FirebaseFirestore.getInstance();
        DocumentReference docRef = db.collection("Users").document(uId);
        docRef.get().addOnSuccessListener(new OnSuccessListener<DocumentSnapshot>() {
            @Override
            public void onSuccess(DocumentSnapshot documentSnapshot) {
                division = documentSnapshot.getString("division");
                db.collection("FieldRequests")
                    .whereEqualTo("division",division)
                    .get()
                    .addOnCompleteListener(new OnCompleteListener<QuerySnapshot>() {
                        @Override
                        public void onComplete(@NonNull @NotNull Task<QuerySnapshot> task) {
                            if(task.isSuccessful()){
                                for(QueryDocumentSnapshot document: task.getResult()){
                                    String requestId = document.getId();
                                    String date = document.getString("date");
                                    Log.d("printing date", date.toString());
                                    String division = document.getString("division");
                                    String fieldId = document.getString("fieldId");
                                    Double latitude = document.getDouble("latitude");
                                    Double longitude = document.getDouble("longitude");
                                    String requestNote = document.getString("requestNote");
                                    String status = document.getString("status");
                                    if(status.equals("pending")) {
                                        DocumentReference docRef = db.collection("FieldDetails").document(fieldId);
                                        docRef.get().addOnCompleteListener(new OnCompleteListener<DocumentSnapshot>() {
                                            @Override
                                            public void onComplete(@NonNull @NotNull Task<DocumentSnapshot> task) {
                                                if(task.isSuccessful()){
                                                    DocumentSnapshot document = task.getResult();
                                                    if(document.exists()){
                                                        String address = document.getString("address");
                                                        String farmerId = document.getString("farmerId");
                                                        String registrationNumber = document.getString("registrationNumber");

                                                        DocumentReference docRef = db.collection("Users").document(farmerId);
                                                        docRef.get().addOnCompleteListener(new OnCompleteListener<DocumentSnapshot>() {
                                                            @Override
                                                            public void onComplete(@NonNull @NotNull Task<DocumentSnapshot> task) {
                                                                if(task.isSuccessful()){
                                                                    DocumentSnapshot document = task.getResult();
                                                                    if(document.exists()){
                                                                        String email = document.getString("email");
                                                                        String firstName = document.getString("firstName");
                                                                        String lastName = document.getString("lastName");
                                                                        String nic = document.getString("nic");
                                                                        String phone = document.getString("phone");

                                                                        requests.add(new Request(farmerId, fieldId, requestId, date, address, registrationNumber, firstName, lastName, division,  email, nic, phone,longitude, latitude, requestNote));
                                                                        RecyclerView rvRequests = (RecyclerView) findViewById(R.id.rvRequests);
                                                                        RequestAdapter adapter = new RequestAdapter(requests);
                                                                        rvRequests.setAdapter(adapter);
                                                                        rvRequests.setLayoutManager(new LinearLayoutManager(ViewRequests.this));
                                                                    }
                                                                }
                                                                else{
                                                                    Toast.makeText(ViewRequests.this, "Farmer details fetching failed", Toast.LENGTH_SHORT).show();
                                                                }
                                                            }
                                                        });

                                                    }
                                                }
                                                else{
                                                    Toast.makeText(ViewRequests.this, "Field details fetching failed", Toast.LENGTH_SHORT).show();
                                                }
                                            }
                                        });

                                    }
                                }
                                progressBar.setVisibility(View.GONE);
                            }
                            else{
                                progressBar.setVisibility(View.GONE);
                                Toast.makeText(ViewRequests.this, "Requests fetching failed", Toast.LENGTH_SHORT).show();
                            }
                        }
                    });

            }
        });
    }

}