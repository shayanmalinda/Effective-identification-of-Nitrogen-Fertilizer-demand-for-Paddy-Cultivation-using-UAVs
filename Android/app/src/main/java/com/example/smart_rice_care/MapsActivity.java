package com.example.smart_rice_care;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.FragmentActivity;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.res.Resources;
import android.graphics.Color;
import android.location.Criteria;
import android.location.Location;
import android.location.LocationManager;
import android.os.Bundle;
import android.util.Log;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.widget.CheckBox;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.PopupWindow;
import android.widget.SeekBar;
import android.widget.TextView;
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
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.DocumentSnapshot;
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
import java.util.HashMap;
import java.util.List;

public class MapsActivity extends FragmentActivity implements
        OnMyLocationButtonClickListener,
        OnMyLocationClickListener,
        OnMapReadyCallback,
        ActivityCompat.OnRequestPermissionsResultCallback {

    private String requestId;
    private Integer plantAge;
    private Long fertilizer2, fertilizer3, fertilizer4;
    private GoogleMap mMap;
    private ActivityMapsBinding binding;
    private UiSettings mUiSettings;
    private ImageView ivFocus, ivSettings, ivClose, ivInfo;
    private CheckBox cbLevel2, cbLevel3, cbLevel4, cbLevel5;
    private TextView tvPercentage2, tvFertilizer2, tvPercentage3, tvFertilizer3, tvPercentage4, tvFertilizer4, tvPercentage5, tvFertilizer5;
    private View settingsPopupView, infoPopupView;
    private Boolean filterLevel2 = true, filterLevel3 = true, filterLevel4 = true, filterLevel5 = true;
    private static final int LOCATION_PERMISSION_REQUEST_CODE = 1;
    FirebaseAuth mAuth;
    FirebaseFirestore db;
    String uId;
    List<FieldData> fieldData = new ArrayList<>();
    Float[] fertilizerAmount = new Float[4];
    private Integer fetchCount=0;

    List<WeightedLatLng> level2List = new ArrayList<>();
    List<WeightedLatLng> level3List = new ArrayList<>();
    List<WeightedLatLng> level4List = new ArrayList<>();
    List<WeightedLatLng> level5List = new ArrayList<>();
    List<Marker> markers = new ArrayList<>();
    List<Marker> currentMarkers = new ArrayList<>();
    Integer radius = 40;
    Double opacity = 0.8;

    int[] level2Colors = {
            Color.rgb(255, 0, 0),
            Color.rgb(255, 0, 0)
    };
    int[] level3Colors = {
            Color.rgb(255, 200, 0),
            Color.rgb(255, 200, 0)
    };
    int[] level4Colors = {
            Color.rgb(68, 204, 0),
            Color.rgb(68, 204, 0)
    };
    int[] level5Colors = {
            Color.rgb(0, 221, 255),
            Color.rgb(0, 221, 255)
    };


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Intent intent = getIntent();
        requestId = intent.getStringExtra("requestId");
        plantAge = intent.getIntExtra("plantAge",0);

        db = FirebaseFirestore.getInstance();
        mAuth = FirebaseAuth.getInstance();
        uId = mAuth.getInstance().getUid();

        binding = ActivityMapsBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        // Obtain the SupportMapFragment and get notified when the map is ready to be used.
        SupportMapFragment mapFragment = (SupportMapFragment) getSupportFragmentManager()
                .findFragmentById(R.id.map);
        mapFragment.getMapAsync(this);


        ivFocus = findViewById(R.id.ivFocus);
        ivSettings = findViewById(R.id.ivSettings);
        ivInfo = findViewById(R.id.ivInfo);

        ivFocus.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                moveCameraToCenter();
            }
        });

        ivSettings.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                // inflate the layout of the popup window
                LayoutInflater inflater = (LayoutInflater)
                        getSystemService(LAYOUT_INFLATER_SERVICE);
                settingsPopupView = inflater.inflate(R.layout.map_settings_popup, null);

                // create the popup window
                int width = LinearLayout.LayoutParams.WRAP_CONTENT;
                int height = LinearLayout.LayoutParams.WRAP_CONTENT;
                boolean focusable = true; // lets taps outside the popup also dismiss it
                final PopupWindow popupWindow = new PopupWindow(settingsPopupView, width, height, focusable);

                // show the popup window
                // which view you pass in doesn't matter, it is only used for the window tolken
                popupWindow.showAtLocation(settingsPopupView, Gravity.CENTER, 0, 0);

                settingsPopupView.setOnTouchListener(new View.OnTouchListener() {
                    @Override
                    public boolean onTouch(View v, MotionEvent event) {
//                        popupWindow.dismiss();
                        return true;
                    }
                });

                ivClose = settingsPopupView.findViewById(R.id.ivClose);
                ivClose.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        popupWindow.dismiss();
                    }
                });

                cbLevel2 = settingsPopupView.findViewById(R.id.cbLevel2);
                cbLevel3 = settingsPopupView.findViewById(R.id.cbLevel3);
                cbLevel4 = settingsPopupView.findViewById(R.id.cbLevel4);
                cbLevel5 = settingsPopupView.findViewById(R.id.cbLevel5);

                cbLevel2.setChecked(filterLevel2);
                cbLevel3.setChecked(filterLevel3);
                cbLevel4.setChecked(filterLevel4);
                cbLevel5.setChecked(filterLevel5);

                cbLevel2.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        filterLevel2 = !filterLevel2;
                        filterHeatMap();
                    }
                });

                cbLevel3.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        filterLevel3 = !filterLevel3;
                        filterHeatMap();
                    }
                });

                cbLevel4.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        filterLevel4 = !filterLevel4;
                        filterHeatMap();
                    }
                });

                cbLevel5.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        filterLevel5 = !filterLevel5;
                        filterHeatMap();
                    }
                });


                SeekBar seekBar = settingsPopupView.findViewById(R.id.sbRadius);
                seekBar.setProgress(radius);
                seekBar.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {
                    @Override
                    public void onProgressChanged(SeekBar seekBar, int progress, boolean fromUser) {
                        radius = progress;
                        filterHeatMap();
                        seekBar.setProgress(radius);
                    }

                    @Override
                    public void onStartTrackingTouch(SeekBar seekBar) {

                    }

                    @Override
                    public void onStopTrackingTouch(SeekBar seekBar) {
                        filterHeatMap();
                    }
                });

            }
        });

        ivInfo.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                // inflate the layout of the popup window
                LayoutInflater inflater = (LayoutInflater)
                        getSystemService(LAYOUT_INFLATER_SERVICE);
                infoPopupView = inflater.inflate(R.layout.map_info_popup, null);

                // create the popup window
                int width = 1000;
                int height = 660;
                boolean focusable = true; // lets taps outside the popup also dismiss it
                final PopupWindow popupWindow = new PopupWindow(infoPopupView, width, height, focusable);

                tvPercentage2 = infoPopupView.findViewById(R.id.tvPercentage2);
                tvPercentage3 = infoPopupView.findViewById(R.id.tvPercentage3);
                tvPercentage4 = infoPopupView.findViewById(R.id.tvPercentage4);
                tvPercentage5 = infoPopupView.findViewById(R.id.tvPercentage5);

                tvFertilizer2 = infoPopupView.findViewById(R.id.tvFertilizer2);
                tvFertilizer3 = infoPopupView.findViewById(R.id.tvFertilizer3);
                tvFertilizer4 = infoPopupView.findViewById(R.id.tvFertilizer4);
                tvFertilizer5 = infoPopupView.findViewById(R.id.tvFertilizer5);

                Integer totalSize = level2List.size()+ level3List.size() + level4List.size() + level5List.size();

                tvPercentage2.setText((Math.round(((level2List.size()*100)/(float) totalSize) * 100.0) / 100.0)+" %");
                tvPercentage3.setText((Math.round(((level3List.size()*100)/(float) totalSize) * 100.0) / 100.0)+" %");
                tvPercentage4.setText((Math.round(((level4List.size()*100)/(float) totalSize) * 100.0) / 100.0)+" %");
                tvPercentage5.setText((Math.round(((level5List.size()*100)/(float) totalSize) * 100.0) / 100.0)+" %");

                tvFertilizer2.setText(fertilizer2+" kg/ha");
                tvFertilizer3.setText(fertilizer3+" kg/ha");
                tvFertilizer4.setText(fertilizer4+" kg/ha");
                tvFertilizer5.setText("-");

                // show the popup window
                // which view you pass in doesn't matter, it is only used for the window tolken
                popupWindow.showAtLocation(infoPopupView, Gravity.CENTER, 0, 0);

                infoPopupView.setOnTouchListener(new View.OnTouchListener() {
                    @Override
                    public boolean onTouch(View v, MotionEvent event) {
                        return true;
                    }
                });


                ivClose = infoPopupView.findViewById(R.id.ivClose);
                ivClose.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        popupWindow.dismiss();
                    }
                });

            }
        });

        getLCCTable();

    }

    private void getLCCTable() {
        FirebaseFirestore db = FirebaseFirestore.getInstance();

        DocumentReference docRef = db.collection("FieldRequests").document(requestId);
        docRef.get().addOnCompleteListener(new OnCompleteListener<DocumentSnapshot>() {
            @Override
            public void onComplete(@NonNull @NotNull Task<DocumentSnapshot> task) {

                if (task.isSuccessful()) {
                    DocumentSnapshot document = task.getResult();
                    if (document.exists()) {
                        String division = document.get("division").toString();
                        db.collection("LCCDetails")
                                .whereEqualTo("division", division)
                                .get()
                                .addOnCompleteListener(new OnCompleteListener<QuerySnapshot>() {
                                    @Override
                                    public void onComplete(@NonNull @NotNull Task<QuerySnapshot> task2) {
                                        if(task2.isSuccessful()){
                                            System.out.println("testing==="+task2.getResult());
                                            System.out.println("testing==="+task2.getResult().size());
                                            if(task2.getResult().size()==0){
                                                // Get general LCC details, if specific data not available
                                                db.collection("LCCDetails")
                                                        .whereEqualTo("division", "ALL")
                                                        .get()
                                                        .addOnCompleteListener(new OnCompleteListener<QuerySnapshot>() {
                                                            @Override
                                                            public void onComplete(@NonNull @NotNull Task<QuerySnapshot> task3) {
                                                                if(task3.isSuccessful()){

                                                                    for (QueryDocumentSnapshot document : task3.getResult()) {
                                                                        ArrayList<HashMap> data = (ArrayList<HashMap>) document.get("weekDetails");
                                                                        HashMap<String, Long> weekData = data.get(plantAge-1);
                                                                        fertilizer2 = weekData.get("levelOne");
                                                                        fertilizer3 = weekData.get("levelTwo");
                                                                        fertilizer4 = weekData.get("levelThree");
                                                                    }
                                                                }
                                                                else{
                                                                    Log.d("LCCDetails error:", task3.getException().toString());
                                                                    Toast.makeText(MapsActivity.this, ""+task3.getException(), Toast.LENGTH_SHORT).show();
                                                                }
                                                            }
                                                        });
                                            }
                                            else{
                                                // Get specific LCC details
                                                for (QueryDocumentSnapshot document : task2.getResult()) {
                                                    ArrayList<HashMap> data = (ArrayList<HashMap>) document.get("weekDetails");
                                                    HashMap<String, Long> weekData = data.get(plantAge-1);
                                                    fertilizer2 = weekData.get("levelOne");
                                                    fertilizer3 = weekData.get("levelTwo");
                                                    fertilizer4 = weekData.get("levelThree");
                                                }
                                            }
                                        }
                                        else{
                                            Log.d("LCCDetails error:", task.getException().toString());
                                            Toast.makeText(MapsActivity.this, ""+task.getException(), Toast.LENGTH_SHORT).show();
                                        }
                                    }
                                });
                    } else {
                        Log.d("FieldRequests fetch: ", "No such document");
                    }
                } else {
                    Log.d("FieldRequests fetch: ", "get failed with ", task.getException());
                }
            }
        });
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
                .whereEqualTo("requestId", requestId)
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

                        addHeatMap(level2List, level2Colors, false);

                    }
                });


        db.collection("FieldData")
                .whereEqualTo("level",3)
                .whereEqualTo("requestId", requestId)
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

                        addHeatMap(level3List, level3Colors, false);
                    }
                });



        db.collection("FieldData")
                .whereEqualTo("level",4)
                .whereEqualTo("requestId", requestId)
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

                        addHeatMap(level4List, level4Colors, false);
                    }
                });



        db.collection("FieldData")
                .whereEqualTo("level",5)
                .whereEqualTo("requestId", requestId)
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
                            level5List.add(weightedLatLngObj);

                            Marker marker = mMap.addMarker(new MarkerOptions().position(latLng).draggable(true).visible(false));
                            markers.add(marker);
                        }

                        addHeatMap(level5List, level5Colors, false);
                    }
                });


    }

    public void moveCameraToCenter() {
        currentMarkers.clear();
        if(filterLevel2){
            for (FieldData data:fieldData){
                if(data.getLevel()==2){
                    LatLng latLng = new LatLng(data.getLatitude(), data.getLongitude());
                    Marker marker = mMap.addMarker(new MarkerOptions().position(latLng).draggable(true).visible(false));
                    currentMarkers.add(marker);
                }
            }
        }
        if(filterLevel3){
            for (FieldData data:fieldData){
                if(data.getLevel()==3){
                    LatLng latLng = new LatLng(data.getLatitude(), data.getLongitude());
                    Marker marker = mMap.addMarker(new MarkerOptions().position(latLng).draggable(true).visible(false));
                    currentMarkers.add(marker);
                }
            }
        }
        if(filterLevel4){
            for (FieldData data:fieldData){
                if(data.getLevel()==4){
                    LatLng latLng = new LatLng(data.getLatitude(), data.getLongitude());
                    Marker marker = mMap.addMarker(new MarkerOptions().position(latLng).draggable(true).visible(false));
                    currentMarkers.add(marker);
                }
            }
        }
        if(filterLevel5){
            for (FieldData data:fieldData){
                if(data.getLevel()==5){
                    LatLng latLng = new LatLng(data.getLatitude(), data.getLongitude());
                    Marker marker = mMap.addMarker(new MarkerOptions().position(latLng).draggable(true).visible(false));
                    currentMarkers.add(marker);
                }
            }
        }

        LatLngBounds.Builder builder = new LatLngBounds.Builder();
        for (Marker marker : currentMarkers) {
            builder.include(marker.getPosition());
        }
        LatLngBounds bounds = builder.build();

        int padding = 100; // offset from edges of the map in pixels
        CameraUpdate cu = CameraUpdateFactory.newLatLngBounds(bounds, padding);
        mMap.animateCamera(cu);

    }

    private void filterHeatMap() {
        fetchCount = 0;
        mMap.clear();
        if(filterLevel2)
            addHeatMap(level2List, level2Colors, true);
        if(filterLevel3)
            addHeatMap(level3List, level3Colors,  true);
        if(filterLevel4)
            addHeatMap(level4List, level4Colors,  true);
        if(filterLevel5)
            addHeatMap(level5List, level5Colors,  true);
    }

    private void addHeatMap(List<WeightedLatLng> weightedList,int[] colors, Boolean checkData) {

        float[] startPoints = {
                0.7f, 1f
        };

        Gradient gradient = new Gradient(colors, startPoints);

        if(!weightedList.isEmpty()){
            HeatmapTileProvider provider = new HeatmapTileProvider.Builder()
                    .weightedData(weightedList)
                    .gradient(gradient)
                    .radius(radius)
                    .opacity(opacity)
                    .build();

            // Add a tile overlay to the map, using the heat map tile provider.
            TileOverlay overlay = mMap.addTileOverlay(new TileOverlayOptions().tileProvider(provider));
            moveCameraToCenter();
        }
        else{
            fetchCount++;
        }
        if(fetchCount>=4 && checkData){
            Toast.makeText(this, "No any results to show", Toast.LENGTH_SHORT).show();
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