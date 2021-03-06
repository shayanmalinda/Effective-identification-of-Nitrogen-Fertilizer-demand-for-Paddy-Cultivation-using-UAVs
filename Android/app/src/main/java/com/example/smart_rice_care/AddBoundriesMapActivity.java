package com.example.smart_rice_care;


import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.location.Criteria;
import android.location.Location;
import android.location.LocationManager;
import android.os.Bundle;
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
import com.google.android.gms.maps.model.Marker;
import com.google.android.gms.maps.model.MarkerOptions;
import com.google.android.gms.maps.model.Polygon;
import com.google.android.gms.maps.model.PolygonOptions;
import com.google.maps.android.PolyUtil;

import org.jetbrains.annotations.NotNull;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;


public class AddBoundriesMapActivity extends FragmentActivity
        implements
        OnMyLocationButtonClickListener,
        OnMyLocationClickListener,
        OnMapReadyCallback,
        ActivityCompat.OnRequestPermissionsResultCallback {

    private GoogleMap mMap;
    private UiSettings mUiSettings;
    private static final int LOCATION_PERMISSION_REQUEST_CODE = 1;
    private Button btClear, btDone;
    LatLng currentMarker;
    List<LatLng> polygonList = new ArrayList<>();
    Polygon polygon;
    String approach;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_add_boundries_map);

        btClear = findViewById(R.id.btClear);
        btDone = findViewById(R.id.btDone);

        Intent intent = getIntent();
        approach = intent.getStringExtra("approach");

        // Obtain the SupportMapFragment and get notified when the map is ready to be used.
        SupportMapFragment mapFragment = (SupportMapFragment) getSupportFragmentManager()
                .findFragmentById(R.id.sendRequestMap);
        mapFragment.getMapAsync(this);

        btClear.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                mMap.clear();
                polygonList.clear();
            }
        });

        btDone.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(polygonList.size()>2){
                    if(approach.equals("offline")){
                        Intent intent = new Intent(AddBoundriesMapActivity.this, ExamineFieldOfflineActivity.class);
                        Bundle args = new Bundle();
                        args.putSerializable("polygonList",(Serializable) polygonList);
                        intent.putExtra("BUNDLE",args);
                        finish();
                        startActivity(intent);
                    }
                    else{

                        Intent getIntent = getIntent();
                        String requestId = getIntent.getStringExtra("requestId");
                        String fieldId = getIntent.getStringExtra("fieldId");
                        String farmerId = getIntent.getStringExtra("farmerId");
                        Intent intent = new Intent(AddBoundriesMapActivity.this, ExamineFieldActivity.class);
                        Bundle args = new Bundle();
                        args.putSerializable("polygonList",(Serializable) polygonList);
                        intent.putExtra("BUNDLE",args);
                        intent.putExtra("requestId", requestId);
                        intent.putExtra("fieldId", fieldId);
                        intent.putExtra("farmerId", farmerId);
                        finish();
                        startActivity(intent);
                    }
                }
                else{
                    Toast.makeText(AddBoundriesMapActivity.this, "Minimum 3 points should be added", Toast.LENGTH_SHORT).show();
                }
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
                btClear.setVisibility(View.VISIBLE);
                btDone.setVisibility(View.VISIBLE);

                polygonList.add(new LatLng(currentMarker.latitude, currentMarker.longitude));
                Marker marker = mMap.addMarker(new MarkerOptions().position(latLng).title("Point " + polygonList.size()));
                marker.showInfoWindow();
                LatLng[] array = polygonList.toArray(new LatLng[0]);
                if(polygon!=null){
                    polygon.remove();
                }
                polygon = mMap.addPolygon(new PolygonOptions()
                        .add(array)
                        .strokeColor(getResources().getColor(R.color.green_500))
                        .fillColor(Color.argb(50, 255, 255, 255)));
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
            PermissionUtils.requestPermission(AddBoundriesMapActivity.this, LOCATION_PERMISSION_REQUEST_CODE,
                    Manifest.permission.ACCESS_FINE_LOCATION, true);
        }
    }

    @Override
    public boolean onMyLocationButtonClick() {
        return false;
    }


    @Override
    public void onMyLocationClick(@NonNull @NotNull Location location) {

    }

    @Override
    public void onPointerCaptureChanged(boolean hasCapture) {

    }
}