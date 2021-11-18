package com.example.smart_rice_care;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.Spinner;
import android.widget.Toast;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.AuthResult;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.FirebaseFirestore;

import org.jetbrains.annotations.NotNull;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

public class RegisterFieldDetailsActivity extends AppCompatActivity {

    Spinner spProvince,spDistrict,spDivision;
    EditText etRegistrationNumber, etAddress;
    Button btRegister;
    ProgressBar progressBar;
    ArrayAdapter<String> provinceAdapter, districtAdapter, divisionAdapter;
    JSONObject divisionalSecretariats;

    ArrayList<String> provinces = new ArrayList<String>();
    ArrayList<String> districts = new ArrayList<String>();
    ArrayList<String> divisions = new ArrayList<String>();

    String firstName, lastName, email, phone, nic, password;
    String registrationNumber, address, selectedProvince, selectedDistrict, selectedDivision;

    FirebaseAuth mAuth;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_register_field_details);

        progressBar = findViewById(R.id.progressBar);
        progressBar.setVisibility(View.GONE);

        firstName = getIntent().getStringExtra("firstName");
        lastName = getIntent().getStringExtra("lastName");
        email = getIntent().getStringExtra("email");
        phone = getIntent().getStringExtra("phone");
        nic = getIntent().getStringExtra("nic");
        password = getIntent().getStringExtra("password");

        etRegistrationNumber = findViewById(R.id.etRegistrationNumber);
        etAddress = findViewById(R.id.etAddress);

        spProvince = findViewById(R.id.spProvince);
        spDistrict = findViewById(R.id.spDistrict);
        spDivision = findViewById(R.id.spDivision);

        btRegister = findViewById(R.id.btRegister);

        mAuth = FirebaseAuth.getInstance();

        InputStream is = getResources().openRawResource(R.raw.divisional_secretariats);
        try {
            divisionalSecretariats = new JSONObject(readJSON(is));
            for(int i=0;i<divisionalSecretariats.getJSONArray("provinces").length();i++){
                provinces.add(String.valueOf(divisionalSecretariats.getJSONArray("provinces").get(i)));
            }
            Collections.sort(provinces);
            selectedProvince = provinces.get(0);
            for(int i=0;i<divisionalSecretariats.getJSONArray(selectedProvince).length();i++){
                districts.add(String.valueOf(divisionalSecretariats.getJSONArray(selectedProvince).get(i)));
            }
            Collections.sort(districts);
            selectedDistrict = districts.get(0);

            for(int i=0;i<divisionalSecretariats.getJSONArray(selectedDistrict).length();i++){
                divisions.add(String.valueOf(divisionalSecretariats.getJSONArray(selectedDistrict).get(i)));
            }
            Collections.sort(divisions);
            selectedDivision = divisions.get(0);

            is.close();
        } catch (JSONException | IOException e) {
            e.printStackTrace();
        }

        provinceAdapter = new ArrayAdapter<>(this, android.R.layout.simple_spinner_dropdown_item, provinces);
        spProvince.setAdapter(provinceAdapter);

        districtAdapter = new ArrayAdapter<>(this, android.R.layout.simple_spinner_dropdown_item, districts);
        spDistrict.setAdapter(districtAdapter);

        divisionAdapter = new ArrayAdapter<>(this, android.R.layout.simple_spinner_dropdown_item, divisions);
        spDivision.setAdapter(districtAdapter);


        spProvince.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                selectedProvince = provinces.get(position);
                try {
                    handleDistrictSelection();
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {

            }
        });

        spDistrict.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                selectedDistrict = districts.get(position);
                try {
                    handleDivisionSelection();
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {

            }
        });

        spDivision.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                selectedDivision = divisions.get(position);
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {

            }
        });

        btRegister.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                progressBar.setVisibility(View.VISIBLE);
                registrationNumber = etRegistrationNumber.getText().toString();
                address = etAddress.getText().toString();

                mAuth.createUserWithEmailAndPassword(email, password).addOnCompleteListener(new OnCompleteListener<AuthResult>() {
                    @Override
                    public void onComplete(@NonNull @NotNull Task<AuthResult> task) {
                        if(task.isSuccessful()){
                            String userId = task.getResult().getUser().getUid();
                            Map<String, Object> user = new HashMap<>();
                            user.put("userRole", "farmer");
                            user.put("firstname", firstName);
                            user.put("lastName", lastName);
                            user.put("lastName", lastName);
                            user.put("email", email);
                            user.put("phone", phone);
                            user.put("nic", nic);

                            FirebaseFirestore db = FirebaseFirestore.getInstance();

                            db.collection("Users").document(userId)
                                    .set(user)
                                    .addOnSuccessListener(new OnSuccessListener<Void>() {
                                        @Override
                                        public void onSuccess(Void unused) {
                                            Map<String, Object> field = new HashMap<>();
                                            field.put("farmerId", userId);
                                            field.put("address", address);
                                            field.put("registrationNumber", registrationNumber);
                                            field.put("province", selectedProvince);
                                            field.put("district", selectedDistrict);
                                            field.put("division", selectedDivision);

                                            db.collection("FieldDetails")
                                                    .add(field)
                                                    .addOnSuccessListener(new OnSuccessListener<DocumentReference>() {
                                                        @Override
                                                        public void onSuccess(DocumentReference documentReference) {
                                                            progressBar.setVisibility(View.GONE);
                                                            Toast.makeText(getApplicationContext(), "User registration success", Toast.LENGTH_LONG).show();
                                                            Intent intent = new Intent(RegisterFieldDetailsActivity.this, SignInActivity.class);
                                                            startActivity(intent);
                                                        }
                                                    })
                                                    .addOnFailureListener(new OnFailureListener() {
                                                        @Override
                                                        public void onFailure(@NonNull @NotNull Exception e) {
                                                            progressBar.setVisibility(View.GONE);
                                                            Toast.makeText(getApplicationContext(), "Registration Error: " + e.getMessage() , Toast.LENGTH_LONG).show();
                                                        }
                                                    });
                                        }
                                    })
                                    .addOnFailureListener(new OnFailureListener() {
                                        @Override
                                        public void onFailure(@NonNull @NotNull Exception e) {
                                            progressBar.setVisibility(View.GONE);
                                            Toast.makeText(getApplicationContext(), "Registration Error: " + e.getMessage() , Toast.LENGTH_LONG).show();
                                        }
                                    });

                        }
                        else{
                            progressBar.setVisibility(View.GONE);
                            Toast.makeText(getApplicationContext(), "Registration Error: " +task.getException().getMessage() , Toast.LENGTH_LONG).show();
                        }

                    }
                });


            }
        });


    }

    public String readJSON(InputStream inputStream) {
        String json = null;
        try {
            int size = inputStream.available();
            byte[] buffer = new byte[size];
            // read values in the byte array
            inputStream.read(buffer);
            inputStream.close();
            // convert byte to string
            json = new String(buffer, "UTF-8");
        } catch (IOException e) {
            e.printStackTrace();
            return json;
        }
        return json;
    }

    public void handleDistrictSelection() throws JSONException {
        districts.clear();
        for(int i=0;i<divisionalSecretariats.getJSONArray(selectedProvince).length();i++){
            districts.add(String.valueOf(divisionalSecretariats.getJSONArray(selectedProvince).get(i)));
        }
        Collections.sort(districts);
        selectedDistrict = districts.get(0);
        spDistrict.setAdapter(districtAdapter);
        handleDivisionSelection();
    }

    public void handleDivisionSelection() throws JSONException {

        divisions.clear();
        for(int i=0;i<divisionalSecretariats.getJSONArray(selectedDistrict).length();i++){
            divisions.add(String.valueOf(divisionalSecretariats.getJSONArray(selectedDistrict).get(i)));
        }
        Collections.sort(divisions);
        selectedDivision = divisions.get(0);
        spDivision.setAdapter(divisionAdapter);
    }

}