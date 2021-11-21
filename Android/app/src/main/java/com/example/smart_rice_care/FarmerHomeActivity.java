package com.example.smart_rice_care;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;

public class FarmerHomeActivity extends AppCompatActivity {

    Button btSendRequest;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_farmer_home);

        btSendRequest = findViewById(R.id.btSendRequest);

        btSendRequest.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(FarmerHomeActivity.this, SendRequestActivity.class);
                startActivity(intent);
            }
        });
    }
}