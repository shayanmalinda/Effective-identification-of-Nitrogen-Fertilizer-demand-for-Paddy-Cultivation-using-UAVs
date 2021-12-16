package com.example.smart_rice_care;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;

import com.google.firebase.auth.FirebaseAuth;

public class FarmerHomeActivity extends AppCompatActivity {

    Button btSendRequest, btSignout, btViewResults;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_farmer_home);

        btSendRequest = findViewById(R.id.btSendRequest);
        btSignout = findViewById(R.id.btSignout);
        btViewResults = findViewById(R.id.btViewResults);

        btSendRequest.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(FarmerHomeActivity.this, SendRequestActivity.class);
                startActivity(intent);
            }
        });

        btViewResults.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(FarmerHomeActivity.this, FarmerViewResultsActivity.class);
                startActivity(intent);
            }
        });

        btSignout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                FirebaseAuth.getInstance().signOut();
                Intent intent = new Intent(FarmerHomeActivity.this, SignInActivity.class);
                Toast.makeText(FarmerHomeActivity.this, "Signout Success", Toast.LENGTH_SHORT).show();
                startActivity(intent);
            }
        });
    }
}