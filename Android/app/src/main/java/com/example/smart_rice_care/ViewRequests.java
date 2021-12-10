package com.example.smart_rice_care;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.os.Bundle;
import android.util.Log;
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
    ArrayList<Request> requests = new ArrayList<>();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_view_requests);

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
                division = documentSnapshot.getString("Division");
                db.collection("FieldRequests")
                    .whereEqualTo("division",division)
                    .get()
                    .addOnCompleteListener(new OnCompleteListener<QuerySnapshot>() {
                        @Override
                        public void onComplete(@NonNull @NotNull Task<QuerySnapshot> task) {
                            if(task.isSuccessful()){
                                Log.d("fetching data",task.getResult().toString());
                                for(QueryDocumentSnapshot document: task.getResult()){
                                    Toast.makeText(ViewRequests.this, "====", Toast.LENGTH_SHORT).show();
                                    String date = document.getString("date");
                                    String division = document.getString("division");
                                    String fieldId = document.getString("fieldId");
                                    Double latitude = document.getDouble("latitude");
                                    Double longitude = document.getDouble("longitude");
                                    String requestNote = document.getString("requestNote");
                                    String status = document.getString("status");

                                    Log.d("fetching data",date);

                                    requests.add(new Request("", "", "", date, "", "", division,  "", "", "",longitude, latitude, requestNote));
                                    RecyclerView rvRequests = (RecyclerView) findViewById(R.id.rvRequests);
                                    RequestAdapter adapter = new RequestAdapter(requests);
                                    rvRequests.setAdapter(adapter);
                                    rvRequests.setLayoutManager(new LinearLayoutManager(ViewRequests.this));
                                }

                            }
                            else{
                                Toast.makeText(ViewRequests.this, "Requests fetching failed", Toast.LENGTH_SHORT).show();
                            }
                        }
                    });
            }
        });
    }

}