package com.example.smart_rice_care;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.media.MediaPlayer;
import android.os.Bundle;
import android.os.Handler;
import android.text.Editable;
import android.text.TextUtils;
import android.text.TextWatcher;
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
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.QueryDocumentSnapshot;
import com.google.firebase.firestore.QuerySnapshot;

import org.jetbrains.annotations.NotNull;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class ExamineFieldActivity extends AppCompatActivity {

    String requestId, fieldId, farmerId;
    EditText etDelayTime;
    Button btStart, btClearData, btAddBoundaries, btInsertData;
    ProgressBar progressBar;
    Boolean isStateBusy = false;
    TextView tvBoundaryCount;


    List<LatLng> polygonList = new ArrayList<>();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_examine_field);

        etDelayTime = findViewById(R.id.etDelayTime);
        btStart = findViewById(R.id.btStart);
        btClearData = findViewById(R.id.btClearData);
        progressBar = findViewById(R.id.progressBar);
        progressBar.setVisibility(View.GONE);
        btAddBoundaries = findViewById(R.id.btAddBoundries);
        tvBoundaryCount = findViewById(R.id.tvBoundaryCount);
        btInsertData = findViewById(R.id.btInsertData);


        Intent getIntent = getIntent();
        requestId = getIntent.getStringExtra("requestId");
        fieldId = getIntent.getStringExtra("fieldId");
        farmerId = getIntent.getStringExtra("farmerId");

        try {
            Bundle args = getIntent.getBundleExtra("BUNDLE");
            polygonList = (List<LatLng>) args.getSerializable("polygonList");
        }
        catch (Exception e){

        }
        tvBoundaryCount.setText("No. of Boundary Points : "+ polygonList.size());

        btInsertData.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(ExamineFieldActivity.this, InsertData.class);
                intent.putExtra("requestId", requestId);
                intent.putExtra("fieldId", farmerId);
                intent.putExtra("farmerId", farmerId);
                startActivity(intent);
            }
        });


        if(!isStateBusy){


            btAddBoundaries.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    finish();
                    Intent intent = new Intent(ExamineFieldActivity.this, AddBoundriesMapActivity.class);
                    intent.putExtra("approach", "online");
                    intent.putExtra("requestId", requestId);
                    intent.putExtra("fieldId", fieldId);
                    intent.putExtra("farmerId", farmerId);
                    startActivity(intent);
                }
            });


            btStart.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Integer delayTime = 0;
                    if(TextUtils.isEmpty(etDelayTime.getText().toString())){
                        Toast.makeText(ExamineFieldActivity.this, "Please enter a delay time", Toast.LENGTH_SHORT).show();
                    }
                    else{
                        delayTime = Integer.parseInt(String.valueOf(etDelayTime.getText()));
                        if(delayTime<5){
                            Toast.makeText(ExamineFieldActivity.this, "Delay Time should be at least 5 seconds", Toast.LENGTH_SHORT).show();
                        }
                        else{

                            FirebaseFirestore db = FirebaseFirestore.getInstance();
                            System.out.println("test==="+requestId);
                            DocumentReference docRef = db.collection("FieldRequests").document(requestId);
                            docRef.update("status", "processing")
                                    .addOnSuccessListener(new OnSuccessListener<Void>() {
                                        @Override
                                        public void onSuccess(Void unused) {
                                            Log.d("Status Update: ", "DocumentSnapshot successfully updated!");
                                        }
                                    })
                                    .addOnFailureListener(new OnFailureListener() {
                                        @Override
                                        public void onFailure(@NonNull @NotNull Exception e) {
                                            Log.w("Status Update: ", "Error updating document", e);
                                        }
                                    });

                            Intent intent = new Intent(ExamineFieldActivity.this, ImageCaptureActivity.class);
                            Bundle args = new Bundle();
                            args.putSerializable("polygonList",(Serializable) polygonList);
                            intent.putExtra("BUNDLE",args);
                            intent.putExtra("requestId", requestId);
                            intent.putExtra("fieldId", fieldId);
                            intent.putExtra("farmerId", farmerId);
                            intent.putExtra("delayTime", delayTime);
                            startActivity(intent);
                        }
                    }
                }
            });

            btClearData.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    FirebaseFirestore db = FirebaseFirestore.getInstance();
                    System.out.print("testing==="+requestId);
                    Log.d("testing===", requestId);
                    db.collection("FieldData")
                        .whereEqualTo("requestId",requestId)
                        .get()
                        .addOnCompleteListener(new OnCompleteListener<QuerySnapshot>() {
                            @Override
                            public void onComplete(@NonNull @NotNull Task<QuerySnapshot> task) {
                                if(task.isSuccessful()){
                                    Log.d("testing===", task.getResult().size()+"");
                                    final Boolean[] deleteStatus = {true};
                                    final Integer[] deleteCount = {0};
                                    if(task.getResult().size()>0){
                                        progressBar.setVisibility(View.VISIBLE);
                                        isStateBusy = true;
                                        progressBar.setMax(task.getResult().size());
                                        Toast.makeText(ExamineFieldActivity.this, "Please Wait", Toast.LENGTH_SHORT).show();
                                    }
                                    else{
                                        FirebaseFirestore db = FirebaseFirestore.getInstance();
                                        System.out.println("test==="+requestId);
                                        DocumentReference docRef = db.collection("FieldRequests").document(requestId);
                                        docRef.update("status", "pending")
                                                .addOnSuccessListener(new OnSuccessListener<Void>() {
                                                    @Override
                                                    public void onSuccess(Void unused) {
                                                        Toast.makeText(ExamineFieldActivity.this, "Data Clear Success", Toast.LENGTH_SHORT).show();
                                                        Log.d("Status Update: ", "DocumentSnapshot successfully updated!");
                                                    }
                                                })
                                                .addOnFailureListener(new OnFailureListener() {
                                                    @Override
                                                    public void onFailure(@NonNull @NotNull Exception e) {
                                                        Log.w("Status Update: ", "Error updating document", e);
                                                    }
                                                });
                                    }
                                    for (QueryDocumentSnapshot document : task.getResult()) {
                                        String documentId = document.getId();
                                        db.collection("FieldData").document(documentId)
                                            .delete()
                                            .addOnSuccessListener(new OnSuccessListener<Void>() {
                                                @Override
                                                public void onSuccess(Void aVoid) {
                                                    deleteCount[0]++;
                                                    progressBar.setProgress(deleteCount[0]);
                                                    Log.d("testing===", deleteCount[0]+"");

                                                    Log.d("Clear Data", "DocumentSnapshot successfully deleted!");
                                                    if(deleteCount[0]>=task.getResult().size()){
                                                        isStateBusy = false;
                                                        progressBar.setVisibility(View.GONE);
                                                        System.out.print("testing==="+"Success");
                                                        FirebaseFirestore db = FirebaseFirestore.getInstance();
                                                        System.out.println("test==="+requestId);
                                                        DocumentReference docRef = db.collection("FieldRequests").document(requestId);
                                                        docRef.update("status", "pending")
                                                                .addOnSuccessListener(new OnSuccessListener<Void>() {
                                                                    @Override
                                                                    public void onSuccess(Void unused) {
                                                                        Toast.makeText(ExamineFieldActivity.this, "Data Clear Success", Toast.LENGTH_SHORT).show();
                                                                        Log.d("Status Update: ", "DocumentSnapshot successfully updated!");
                                                                    }
                                                                })
                                                                .addOnFailureListener(new OnFailureListener() {
                                                                    @Override
                                                                    public void onFailure(@NonNull @NotNull Exception e) {
                                                                        Log.w("Status Update: ", "Error updating document", e);
                                                                    }
                                                                });
                                                    }
                                                }
                                            })
                                            .addOnFailureListener(new OnFailureListener() {
                                                @Override
                                                public void onFailure(@NonNull @NotNull Exception e) {
                                                    deleteStatus[0] = false;
                                                    Log.d("Clear Data: ", e.getMessage());
                                                    Toast.makeText(ExamineFieldActivity.this, e.getMessage().toString(), Toast.LENGTH_SHORT).show();
                                                }
                                            });
                                    }
                                    if(!deleteStatus[0]){
                                        isStateBusy = false;
                                        Toast.makeText(ExamineFieldActivity.this, "Deleting Data failed", Toast.LENGTH_SHORT).show();
                                    }
                                }
                            }
                        });
                }
            });
        }


    }
}