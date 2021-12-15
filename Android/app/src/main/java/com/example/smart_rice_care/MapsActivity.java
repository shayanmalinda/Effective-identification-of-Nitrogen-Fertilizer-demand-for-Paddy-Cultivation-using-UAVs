package com.example.smart_rice_care;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.annotation.RawRes;
import androidx.fragment.app.FragmentActivity;

import android.content.res.Resources;
import android.graphics.Color;
import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;

import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.MapStyleOptions;
import com.google.android.gms.maps.model.MarkerOptions;
import com.example.smart_rice_care.databinding.ActivityMapsBinding;
import com.google.android.gms.maps.model.TileOverlay;
import com.google.android.gms.maps.model.TileOverlayOptions;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.firestore.CollectionReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.EventListener;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.FirebaseFirestoreException;
import com.google.firebase.firestore.QueryDocumentSnapshot;
import com.google.firebase.firestore.QuerySnapshot;
import com.google.maps.android.heatmaps.Gradient;
import com.google.maps.android.heatmaps.HeatmapTileProvider;
import com.google.maps.android.heatmaps.WeightedLatLng;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class MapsActivity extends FragmentActivity implements OnMapReadyCallback {

    private GoogleMap mMap;
    private ActivityMapsBinding binding;
    FirebaseAuth mAuth;
    FirebaseFirestore db;
    String uId;
    List<FieldData> fieldData = new ArrayList<>();

    List<WeightedLatLng> level2List = new ArrayList<>();
    List<WeightedLatLng> level3List = new ArrayList<>();
    List<WeightedLatLng> level4List = new ArrayList<>();

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
        mMap.setMapType(mMap.MAP_TYPE_SATELLITE);

        mMap.setMinZoomPreference(20.0f);
        mMap.setMaxZoomPreference(50.0f);

        LatLng marker = new LatLng(6.0718297, 80.23611111111111);
        mMap.moveCamera(CameraUpdateFactory.newLatLng(marker));

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
                        }

                        addHeatMap(level4List, level4Colors);
                    }
                });


    }

    private void addHeatMap(List<WeightedLatLng> weightedList,int[] colors) {


        float[] startPoints = {
                0.6f, 1f
        };

        Gradient gradient = new Gradient(colors, startPoints);

        // Create a heat map tile provider, passing it the latlngs of the police stations.
        HeatmapTileProvider provider = new HeatmapTileProvider.Builder()
                .weightedData(weightedList)
                .gradient(gradient)
                .radius(40)
                .opacity(1)
                .build();

        // Add a tile overlay to the map, using the heat map tile provider.
        TileOverlay overlay = mMap.addTileOverlay(new TileOverlayOptions().tileProvider(provider));
    }
}