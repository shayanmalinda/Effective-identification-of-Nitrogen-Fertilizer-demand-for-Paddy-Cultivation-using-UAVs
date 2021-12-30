package com.example.smart_rice_care;

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
import android.text.TextWatcher;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

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