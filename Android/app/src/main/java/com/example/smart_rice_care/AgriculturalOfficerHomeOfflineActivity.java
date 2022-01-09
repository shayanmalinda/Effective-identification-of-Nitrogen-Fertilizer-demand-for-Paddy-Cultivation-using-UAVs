package com.example.smart_rice_care;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.cardview.widget.CardView;

import com.google.firebase.auth.FirebaseAuth;

public class AgriculturalOfficerHomeOfflineActivity extends AppCompatActivity {

    CardView btExamineField, btCalibrateSensor;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_agricultural_officer_home_offline);

        btExamineField = findViewById(R.id.btExamineField);
        btCalibrateSensor = findViewById(R.id.btCalibrateSensor);

        btExamineField.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(AgriculturalOfficerHomeOfflineActivity.this, ExamineFieldOfflineActivity.class);
                startActivity(intent);
            }
        });


        btCalibrateSensor.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(AgriculturalOfficerHomeOfflineActivity.this, CalibrateSensorActivity.class);
                startActivity(intent);
            }
        });
    }
}