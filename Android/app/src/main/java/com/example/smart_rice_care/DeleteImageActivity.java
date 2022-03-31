package com.example.smart_rice_care;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.os.Environment;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.QueryDocumentSnapshot;
import com.google.firebase.firestore.QuerySnapshot;

import org.jetbrains.annotations.NotNull;

import java.io.File;
import java.sql.Timestamp;
import java.util.ArrayList;

public class DeleteImageActivity extends AppCompatActivity {

    ArrayList<Long> fileNames = new ArrayList<>();
    TextView tvImageCount;
    Integer currentIndex;
    ImageView ivImage, ivNext, ivBack;
    Button btDelete, btFinish;
    String folderName, approach;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_delete_image);

        Intent getIntent = getIntent();
        fileNames =  (ArrayList<Long>)  getIntent.getSerializableExtra("fileNames");
        folderName =  getIntent.getStringExtra("folderName");
        approach = getIntent.getStringExtra("approach");
        ivImage = findViewById(R.id.ivImage);
        ivNext = findViewById(R.id.ivNext);
        ivBack = findViewById(R.id.ivBack);
        btDelete = findViewById(R.id.btDelete);
        btFinish = findViewById(R.id.btFinish);
        tvImageCount = findViewById(R.id.tvImageCount);
        currentIndex = fileNames.size()-1;

        showImage();

        ivBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(currentIndex>0){
                    currentIndex--;
                    showImage();
                }
            }
        });

        ivNext.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(currentIndex<fileNames.size()){
                    currentIndex++;
                    showImage();
                }
            }
        });

        btDelete.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                if(approach.equals("online")){
                    if(fileNames.size()>1){
                        // Remove responses from the DB in online approach
                        FirebaseFirestore db = FirebaseFirestore.getInstance();
                        db.collection("FieldData")
                            .whereEqualTo("timestamp", fileNames.get(currentIndex))
                            .get()
                            .addOnCompleteListener(new OnCompleteListener<QuerySnapshot>() {
                                @Override
                                public void onComplete(@NonNull @NotNull Task<QuerySnapshot> task) {
                                    if (task.isSuccessful()) {
                                        for (QueryDocumentSnapshot document : task.getResult()) {
                                            String docId = document.getId();
                                            db.collection("FieldData").document(docId)
                                                    .delete()
                                                    .addOnSuccessListener(new OnSuccessListener<Void>() {
                                                        @Override
                                                        public void onSuccess(Void unused) {
                                                            Log.d("Deleting :", "DocumentSnapshot successfully deleted!");
                                                        }
                                                    })
                                                    .addOnFailureListener(new OnFailureListener() {
                                                        @Override
                                                        public void onFailure(@NonNull @NotNull Exception e) {
                                                            Log.w("Deleting :", "Error deleting document", e);
                                                        }
                                                    });
                                        }
                                    } else {
                                        Log.d("Fetching :", "Error getting documents: ", task.getException());
                                    }
                                }
                            });
                    }
                    else{
                        Toast.makeText(DeleteImageActivity.this, "You can not delete all the images", Toast.LENGTH_SHORT).show();
                    }

                }

                if(fileNames.size()>1){
                    File imgFile = new  File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DCIM).getAbsolutePath() +
                            "/" + folderName + "/" + fileNames.get(currentIndex)+".jpg");
                    if (imgFile.exists()) {
                        if (imgFile.delete()) {
                            System.out.println("testing==="+fileNames.size());
                            fileNames.remove(fileNames.get(currentIndex));
                            if(currentIndex>0){
                                currentIndex--;
                            }
                            Toast.makeText(DeleteImageActivity.this, "Deleted", Toast.LENGTH_SHORT).show();
                            System.out.println("testing==="+fileNames.size());
                            showImage();
                        } else {
                            Toast.makeText(DeleteImageActivity.this, "Unable to delete the file", Toast.LENGTH_SHORT).show();
                        }
                    }
                }
                else{
                    Toast.makeText(DeleteImageActivity.this, "You can not delete all the images", Toast.LENGTH_SHORT).show();
                }
            }
        });

        btFinish.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(approach.equals("online")){
                    Intent intent = getIntent();
                    String requestId = intent.getStringExtra("requestId");
                    FirebaseFirestore db = FirebaseFirestore.getInstance();
                    DocumentReference docRef = db.collection("FieldRequests").document(requestId);
                    docRef.update("status", "completed")
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
                }
                finish();
            }
        });


    }

    private void showImage() {

        Integer labelIndex = currentIndex+1;

        tvImageCount.setText("Image "+ labelIndex +" of " + fileNames.size());

        ivNext.setVisibility(View.VISIBLE);
        ivBack.setVisibility(View.VISIBLE);

        if(currentIndex==0){
            ivBack.setVisibility(View.GONE);
        }

        if(currentIndex==fileNames.size()-1){
            ivNext.setVisibility(View.GONE);
        }

        if (fileNames.size()>0 && fileNames.size()>currentIndex){

            File imgFile = new  File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DCIM).getAbsolutePath() +
                    "/" + folderName + "/" + fileNames.get(currentIndex) +".jpg");
            if(imgFile.exists()){
                Bitmap myBitmap = BitmapFactory.decodeFile(imgFile.getAbsolutePath());
                ivImage.setImageBitmap(myBitmap);
                ivImage.setRotation(90);
            };
        }

    }
}