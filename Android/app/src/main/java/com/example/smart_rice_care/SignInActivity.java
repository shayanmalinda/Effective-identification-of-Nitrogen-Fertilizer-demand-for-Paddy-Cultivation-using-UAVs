package com.example.smart_rice_care;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.Toast;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.AuthResult;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;

import org.jetbrains.annotations.NotNull;

import java.util.Map;

public class SignInActivity extends AppCompatActivity {

    Button btRegister, btSignIn;
    EditText etEmail, etPassword;
    String email, password;
    ProgressBar progressBar;

    FirebaseAuth mAuth;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_sign_in);

        progressBar = findViewById(R.id.progressBar);
        progressBar.setVisibility(View.GONE);

        mAuth = FirebaseAuth.getInstance();

        // Checking if user already logged in
        FirebaseUser user = mAuth.getInstance().getCurrentUser();
        if(user!=null){
            progressBar.setVisibility(View.VISIBLE);
            navigateUserRole(user.getUid());
        }

        etEmail = findViewById(R.id.etEmail);
        etPassword = findViewById(R.id.etPassword);

        btRegister = findViewById(R.id.btRegister);
        btSignIn = findViewById(R.id.btSignIn);


        btRegister.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(SignInActivity.this, RegisterUserDetailsActivity.class);
                startActivity(intent);
            }
        });

        btSignIn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                email = etEmail.getText().toString();
                password = etPassword.getText().toString();
                if(email.equals("") || password.equals("")){
                    Toast.makeText(SignInActivity.this, "Please enter email and password", Toast.LENGTH_SHORT).show();
                }
                else{
                    loginUser(email, password);
                }
            }
        });
    }

    public void loginUser(String email, String password) {
        progressBar.setVisibility(View.VISIBLE);
        mAuth.signInWithEmailAndPassword(email, password).addOnCompleteListener(new OnCompleteListener<AuthResult>() {
            @Override
            public void onComplete(@NonNull @NotNull Task<AuthResult> task) {
                if(task.isSuccessful()){
                    String userId = task.getResult().getUser().getUid();
                    navigateUserRole(userId);
                }
                else{
                    progressBar.setVisibility(View.GONE);
                    Toast.makeText(getApplicationContext(), "Signin Failed: " + task.getException().getMessage(), Toast.LENGTH_LONG).show();
                }
            }

        });
    }

    public void navigateUserRole(String userId) {

        FirebaseFirestore db = FirebaseFirestore.getInstance();
        DocumentReference docRef = db.collection("Users").document(userId);
        docRef.get()
                .addOnCompleteListener(new OnCompleteListener<DocumentSnapshot>() {
                    @Override
                    public void onComplete(@NonNull @NotNull Task<DocumentSnapshot> task) {
                        if(task.isSuccessful()){
                            DocumentSnapshot document = task.getResult();
                            if(document.exists()){
                                Map<String, Object> user = document.getData();
                                String userRole = (String) user.get("userRole");
                                switch (userRole) {
                                    case "farmer":
                                        progressBar.setVisibility(View.GONE);
                                        Toast.makeText(getApplicationContext(), "Signin Success", Toast.LENGTH_LONG).show();
                                        Intent farmerIntent = new Intent(SignInActivity.this, FarmerHomeActivity.class);
                                        startActivity(farmerIntent);
                                        break;
                                    case "agricultural officer":
                                        progressBar.setVisibility(View.GONE);
                                        Toast.makeText(getApplicationContext(), "Signin Success", Toast.LENGTH_LONG).show();
                                        Intent agriculturalOfficerIntent = new Intent(SignInActivity.this, AgriculturalOfficerHomeActivity.class);
                                        startActivity(agriculturalOfficerIntent);
                                        break;
                                    default:
                                        progressBar.setVisibility(View.GONE);
                                        Toast.makeText(getApplicationContext(), "User role Error", Toast.LENGTH_LONG).show();
                                }
                            }
                            else{
                                progressBar.setVisibility(View.GONE);
                                Toast.makeText(getApplicationContext(), "No user found", Toast.LENGTH_LONG).show();
                            }
                        }
                        else{
                            progressBar.setVisibility(View.GONE);
                            Toast.makeText(getApplicationContext(), "Signin Failed: " + task.getException().getMessage(), Toast.LENGTH_LONG).show();
                        }
                    }
                });
    }
}