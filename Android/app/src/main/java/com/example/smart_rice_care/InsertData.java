package com.example.smart_rice_care;


import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.location.Criteria;
import android.location.Location;
import android.location.LocationManager;
import android.os.Bundle;
import android.os.Handler;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.FragmentActivity;

import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.GoogleMap.OnMyLocationButtonClickListener;
import com.google.android.gms.maps.GoogleMap.OnMyLocationClickListener;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.UiSettings;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.MarkerOptions;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.FirebaseFirestore;

import org.jetbrains.annotations.NotNull;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class InsertData extends FragmentActivity
        implements
        OnMyLocationButtonClickListener,
        OnMyLocationClickListener,
        OnMapReadyCallback,
        ActivityCompat.OnRequestPermissionsResultCallback {

    private GoogleMap mMap;
    private UiSettings mUiSettings;
    private static final int LOCATION_PERMISSION_REQUEST_CODE = 1;
    private Button btLevel2, btLevel3, btLevel4, btLevel5;
    String requestId, fieldId, farmerId;
    LatLng currentMarker;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_insert_data_map);

        btLevel2 = findViewById(R.id.btLevel2);
        btLevel3 = findViewById(R.id.btLevel3);
        btLevel4 = findViewById(R.id.btLevel4);
        btLevel5 = findViewById(R.id.btLevel5);

        Intent getIntent = getIntent();
        requestId = getIntent.getStringExtra("requestId");
        fieldId = getIntent.getStringExtra("fieldId");
        farmerId = getIntent.getStringExtra("farmerId");

        btLevel2.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                insertData(2);
            }
        });

        btLevel3.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                insertData(3);
            }
        });

        btLevel4.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                insertData(4);
            }
        });

        btLevel5.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                insertData(5);
            }
        });

        // Obtain the SupportMapFragment and get notified when the map is ready to be used.
        SupportMapFragment mapFragment = (SupportMapFragment) getSupportFragmentManager()
                .findFragmentById(R.id.sendRequestMap);
        mapFragment.getMapAsync(this);

    }

    public void insertData (Integer level){



        FirebaseAuth mAuth = FirebaseAuth.getInstance();
        FirebaseFirestore db = FirebaseFirestore.getInstance();
        String uId = mAuth.getInstance().getUid();

        Map<String, Object> data = new HashMap<>();
        data.put("requestId", requestId);
        data.put("latitude", currentMarker.latitude);
        data.put("longitude", currentMarker.longitude);
        data.put("officerId", uId);
        data.put("level", level);
        data.put("timestamp", System.currentTimeMillis());

        db.collection("FieldData")
                .add(data)
                .addOnSuccessListener(new OnSuccessListener<DocumentReference>() {
                    @Override
                    public void onSuccess(DocumentReference documentReference) {
                        Toast.makeText(InsertData.this, "Success", Toast.LENGTH_SHORT).show();
                    }
                })
                .addOnFailureListener(new OnFailureListener() {
                    @Override
                    public void onFailure(@NonNull @NotNull Exception e) {
                        Toast.makeText(InsertData.this, e.getMessage(), Toast.LENGTH_SHORT).show();
                    }
                });
    }

    @Override
    public void onMapReady(GoogleMap googleMap) {
        mMap = googleMap;
        mUiSettings = mMap.getUiSettings();
        mMap = googleMap;
        mMap.setMapType(mMap.MAP_TYPE_SATELLITE);
        mUiSettings.setZoomControlsEnabled(true);
        mUiSettings.setCompassEnabled(true);
        mUiSettings.setMyLocationButtonEnabled(true);
        enableMyLocation();

        mMap.setOnMapClickListener(new GoogleMap.OnMapClickListener() {
            @Override
            public void onMapClick(@NonNull @NotNull LatLng latLng) {

                currentMarker = latLng;

                mMap.clear();
                mMap.addMarker(new MarkerOptions().position(latLng));
            }
        });

    }

    private void enableMyLocation() {
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION)
                == PackageManager.PERMISSION_GRANTED) {
            if (mMap != null) {
                mMap.setMyLocationEnabled(true);
                LocationManager locationManager = (LocationManager) getSystemService(this.LOCATION_SERVICE);
                Criteria criteria= new Criteria();

                Location location = locationManager.getLastKnownLocation(locationManager
                        .getBestProvider(criteria, false));
                try {
                    double latitude = location.getLatitude();
                    double longitude = location.getLongitude();
                    LatLng marker = new LatLng(latitude , longitude);
                    mMap.moveCamera(CameraUpdateFactory.newLatLngZoom(marker,19.0F));
                }
                catch (Exception e){
//                    Toast.makeText(this, ""+e.getMessage(), Toast.LENGTH_SHORT).show();
                    Log.e("Location Error",e.getMessage());
                }
            }
        } else {
            // Permission to access the location is missing. Show rationale and request permission
            PermissionUtils.requestPermission(InsertData.this, LOCATION_PERMISSION_REQUEST_CODE,
                    Manifest.permission.ACCESS_FINE_LOCATION, true);
        }
    }

    @Override
    public boolean onMyLocationButtonClick() {
//        Toast.makeText(this, "MyLocation button clicked", Toast.LENGTH_SHORT).show();
        // Return false so that we don't consume the event and the default behavior still occurs
        // (the camera animates to the user's current position).
        return false;
    }


    @Override
    public void onMyLocationClick(@NonNull @NotNull Location location) {

    }

    @Override
    public void onPointerCaptureChanged(boolean hasCapture) {

    }
}