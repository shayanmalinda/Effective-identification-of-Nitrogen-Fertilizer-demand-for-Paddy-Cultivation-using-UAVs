package com.example.smart_rice_care;

import android.content.Intent;
import android.os.Bundle;
import android.os.Environment;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.QueryDocumentSnapshot;
import com.google.firebase.firestore.QuerySnapshot;

import org.jetbrains.annotations.NotNull;

import java.io.File;

public class ExamineFieldOfflineActivity extends AppCompatActivity {

    EditText etDelayTime, etFolderName;
    Button btStart, btClearData;
    ProgressBar progressBar;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_examine_field_offline);

        etDelayTime = findViewById(R.id.etDelayTime);
        etFolderName = findViewById(R.id.etFolderName);
        btStart = findViewById(R.id.btStart);
        btClearData = findViewById(R.id.btClearData);
        btClearData.setVisibility(View.GONE);
        progressBar = findViewById(R.id.progressBar);
        progressBar.setVisibility(View.GONE);

        btStart.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Integer delayTime = 0;
                if(TextUtils.isEmpty(etDelayTime.getText().toString())){
                    Toast.makeText(ExamineFieldOfflineActivity.this, "Please enter a delay time", Toast.LENGTH_SHORT).show();
                }
                else if(TextUtils.isEmpty(etFolderName.getText().toString())){
                    Toast.makeText(ExamineFieldOfflineActivity.this, "Please enter a folder name", Toast.LENGTH_SHORT).show();
                }
                else{
                    delayTime = Integer.parseInt(String.valueOf(etDelayTime.getText()));
                    if(delayTime<5){
                        Toast.makeText(ExamineFieldOfflineActivity.this, "Delay Time should be at least 5 seconds", Toast.LENGTH_SHORT).show();
                    }
                    else{
                        File dir = new File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DCIM).getAbsolutePath() + "/" + etFolderName.getText().toString());
                        try {
                            if(dir.exists()){
                                Toast.makeText(ExamineFieldOfflineActivity.this, "Already Exists", Toast.LENGTH_SHORT).show();
                            }
                            else{
                                if (dir.mkdir()) {
                                    Log.d("Directory creation", "Directory created");
                                    Intent intent = new Intent(ExamineFieldOfflineActivity.this, ImageCaptureOfflineActivity.class);
                                    intent.putExtra("delayTime", delayTime);
                                    intent.putExtra("folderName", etFolderName.getText().toString());
                                    startActivity(intent);
                                } else {
                                    Toast.makeText(ExamineFieldOfflineActivity.this, "Directory Creation Failed", Toast.LENGTH_SHORT).show();
                                    Log.d("Directory creation", "Directory creation failed");
                                }
                            }
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }
                }
            }
        });




    }
}