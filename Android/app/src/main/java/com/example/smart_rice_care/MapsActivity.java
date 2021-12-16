package com.example.smart_rice_care;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.FragmentActivity;

import android.Manifest;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.location.Criteria;
import android.location.Location;
import android.location.LocationManager;
import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;

import com.google.android.gms.maps.CameraUpdate;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.GoogleMap.OnMyLocationButtonClickListener;
import com.google.android.gms.maps.GoogleMap.OnMyLocationClickListener;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.UiSettings;
import com.google.android.gms.maps.model.LatLng;
import com.example.smart_rice_care.databinding.ActivityMapsBinding;
import com.google.android.gms.maps.model.LatLngBounds;
import com.google.android.gms.maps.model.Marker;
import com.google.android.gms.maps.model.MarkerOptions;
import com.google.android.gms.maps.model.TileOverlay;
import com.google.android.gms.maps.model.TileOverlayOptions;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.firestore.EventListener;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.FirebaseFirestoreException;
import com.google.firebase.firestore.QueryDocumentSnapshot;
import com.google.firebase.firestore.QuerySnapshot;
import com.google.maps.android.heatmaps.Gradient;
import com.google.maps.android.heatmaps.HeatmapTileProvider;
import com.google.maps.android.heatmaps.WeightedLatLng;

import org.jetbrains.annotations.NotNull;

import java.util.ArrayList;
import java.util.List;

public class MapsActivity extends FragmentActivity implements
        OnMyLocationButtonClickListener,
        OnMyLocationClickListener,
        OnMapReadyCallback,
        ActivityCompat.OnRequestPermissionsResultCallback {

    private GoogleMap mMap;
    private ActivityMapsBinding binding;
    private UiSettings mUiSettings;
    private static final int LOCATION_PERMISSION_REQUEST_CODE = 1;
    FirebaseAuth mAuth;
    FirebaseFirestore db;
    String uId;
    List<FieldData> fieldData = new ArrayList<>();

    List<WeightedLatLng> level2List = new ArrayList<>();
    List<WeightedLatLng> level3List = new ArrayList<>();
    List<WeightedLatLng> level4List = new ArrayList<>();
    List<Marker> markers = new ArrayList<>();

    int[] level2Colors = {
            Color.rgb(255, 0, 0),
            Color.rgb(255, 0, 0)
    };
    int[] level3Colors = {
            Color.rgb(255, 255, 26),
            Color.rgb(255, 255, 26)
    };
    int[] level4Colors = {
            Color.rgb(68, 204, 0),
            Color.rgb(68, 204, 0)
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        db = FirebaseFirestore.getInstance();
        mAuth = FirebaseAuth.getInstance();
        uId = mAuth.getInstance().getUid();

        binding = ActivityMapsBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        // Obtain the SupportMapFragment and get notified when the map is ready to be used.
        SupportMapFragment mapFragment = (SupportMapFragment) getSupportFragmentManager()
                .findFragmentById(R.id.map);
        mapFragment.getMapAsync(this);
    }

    @Override
    public void onMapReady(GoogleMap googleMap) {
        mMap = googleMap;
        mUiSettings = mMap.getUiSettings();
        mMap.setMapType(mMap.MAP_TYPE_SATELLITE);
        mUiSettings.setZoomControlsEnabled(true);
        mUiSettings.setCompassEnabled(true);
        mUiSettings.setMyLocationButtonEnabled(true);
        enableMyLocation();

        fetchFieldData();
    }

    private void fetchFieldData() {
        // Access a Cloud Firestore instance from your Activity
        FirebaseFirestore db = FirebaseFirestore.getInstance();

        db.collection("FieldData")
                .whereEqualTo("level",2)
                .addSnapshotListener(new EventListener<QuerySnapshot>() {
                    @Override
                    public void onEvent(@Nullable @org.jetbrains.annotations.Nullable QuerySnapshot value, @Nullable @org.jetbrains.annotations.Nullable FirebaseFirestoreException error) {
                        if (error != null) {
                            Log.w("Fetching Error", "Listen failed.", error);
                            Toast.makeText(MapsActivity.this, ""+error.getMessage(), Toast.LENGTH_SHORT).show();
                            return;
                        }
                        for (QueryDocumentSnapshot doc : value) {
                            Double latitude = doc.getDouble("latitude");
                            Double longitude = doc.getDouble("longitude");;
                            Integer level = doc.getLong("level").intValue();
                            String officerId = doc.getString("officerId");
                            String requestId = doc.getString("requestId");
                            FieldData obj = new FieldData(latitude, longitude, level, officerId, requestId, level);
                            fieldData.add(obj);

                            LatLng latLng = new LatLng(latitude, longitude);
                            WeightedLatLng weightedLatLngObj = new WeightedLatLng(latLng, 1);
                            level2List.add(weightedLatLngObj);

                            Marker marker = mMap.addMarker(new MarkerOptions().position(latLng).draggable(true).visible(false));
                            markers.add(marker);

                        }

                        addHeatMap(level2List, level2Colors);

                    }
                });


        db.collection("FieldData")
                .whereEqualTo("level",3)
                .addSnapshotListener(new EventListener<QuerySnapshot>() {
                    @Override
                    public void onEvent(@Nullable @org.jetbrains.annotations.Nullable QuerySnapshot value, @Nullable @org.jetbrains.annotations.Nullable FirebaseFirestoreException error) {
                        if (error != null) {
                            Log.w("Fetching Error", "Listen failed.", error);
                            Toast.makeText(MapsActivity.this, ""+error.getMessage(), Toast.LENGTH_SHORT).show();
                            return;
                        }
                        for (QueryDocumentSnapshot doc : value) {
                            Double latitude = doc.getDouble("latitude");
                            Double longitude = doc.getDouble("longitude");;
                            Integer level = doc.getLong("level").intValue();
                            String officerId = doc.getString("officerId");
                            String requestId = doc.getString("requestId");
                            FieldData obj = new FieldData(latitude, longitude, level, officerId, requestId, level);
                            fieldData.add(obj);

                            LatLng latLng = new LatLng(latitude, longitude);
                            WeightedLatLng weightedLatLngObj = new WeightedLatLng(latLng, 1);
                            level3List.add(weightedLatLngObj);

                            Marker marker = mMap.addMarker(new MarkerOptions().position(latLng).draggable(true).visible(false));
                            markers.add(marker);
                        }

                        addHeatMap(level3List, level3Colors);
                    }
                });



        db.collection("FieldData")
                .whereEqualTo("level",4)
                .addSnapshotListener(new EventListener<QuerySnapshot>() {
                    @Override
                    public void onEvent(@Nullable @org.jetbrains.annotations.Nullable QuerySnapshot value, @Nullable @org.jetbrains.annotations.Nullable FirebaseFirestoreException error) {
                        if (error != null) {
                            Log.w("Fetching Error", "Listen failed.", error);
                            Toast.makeText(MapsActivity.this, ""+error.getMessage(), Toast.LENGTH_SHORT).show();
                            return;
                        }
                        for (QueryDocumentSnapshot doc : value) {
                            Double latitude = doc.getDouble("latitude");
                            Double longitude = doc.getDouble("longitude");;
                            Integer level = doc.getLong("level").intValue();
                            String officerId = doc.getString("officerId");
                            String requestId = doc.getString("requestId");
                            FieldData obj = new FieldData(latitude, longitude, level, officerId, requestId, level);
                            fieldData.add(obj);

                            LatLng latLng = new LatLng(latitude, longitude);
                            WeightedLatLng weightedLatLngObj = new WeightedLatLng(latLng, 1);
                            level4List.add(weightedLatLngObj);

                            Marker marker = mMap.addMarker(new MarkerOptions().position(latLng).draggable(true).visible(false));
                            markers.add(marker);
                        }

                        addHeatMap(level4List, level4Colors);
                    }
                });


    }

    public void moveCameraToCenter() {
        LatLngBounds.Builder builder = new LatLngBounds.Builder();
        for (Marker marker : markers) {
            builder.include(marker.getPosition());
        }
        LatLngBounds bounds = builder.build();

        int padding = 100; // offset from edges of the map in pixels
        CameraUpdate cu = CameraUpdateFactory.newLatLngBounds(bounds, padding);
        mMap.moveCamera(cu);

    }

    private void addHeatMap(List<WeightedLatLng> weightedList,int[] colors) {

        float[] startPoints = {
                0.6f, 1f
        };

        Gradient gradient = new Gradient(colors, startPoints);

        // Create a heat map tile provider, passing it the latlngs of the police stations.
        if(!weightedList.isEmpty()){
            HeatmapTileProvider provider = new HeatmapTileProvider.Builder()
                    .weightedData(weightedList)
                    .gradient(gradient)
                    .radius(40)
                    .opacity(1)
                    .build();

            // Add a tile overlay to the map, using the heat map tile provider.
            TileOverlay overlay = mMap.addTileOverlay(new TileOverlayOptions().tileProvider(provider));
            moveCameraToCenter();
        }
        else{
            Toast.makeText(this, "No data found yet", Toast.LENGTH_SHORT).show();
        }
    }

    private void enableMyLocation() {
        if (ContextCompat.checkSelfPermission(this, android.Manifest.permission.ACCESS_FINE_LOCATION)
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
                    Toast.makeText(this, ""+e.getMessage(), Toast.LENGTH_SHORT).show();
                    Log.e("Location Error",e.getMessage());
                }
            }
        } else {
            // Permission to access the location is missing. Show rationale and request permission
            PermissionUtils.requestPermission(MapsActivity.this, LOCATION_PERMISSION_REQUEST_CODE,
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