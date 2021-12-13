package com.example.smart_rice_care;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;

public class ExamineFieldActivity extends AppCompatActivity {

    String requestId, fieldId, farmerId;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_examine_field);

        Intent getIntent = getIntent();
        requestId = getIntent.getStringExtra("requestId");
        fieldId = getIntent.getStringExtra("fieldId");
        farmerId = getIntent.getStringExtra("farmerId");

        Intent intent = new Intent(ExamineFieldActivity.this, ImageCaptureActivity.class);
        intent.putExtra("requestId", requestId);
        intent.putExtra("fieldId", fieldId);
        intent.putExtra("farmerId", farmerId);
        startActivity(intent);
    }
}