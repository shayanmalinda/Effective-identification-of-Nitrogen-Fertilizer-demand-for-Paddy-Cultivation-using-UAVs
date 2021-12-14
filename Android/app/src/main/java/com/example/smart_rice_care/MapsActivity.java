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
import com.google.firebase.firestore.CollectionReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.EventListener;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.FirebaseFirestoreException;
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

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

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
        LatLng marker = new LatLng(6.0718297, 80.23611111111111);
        mMap.moveCamera(CameraUpdateFactory.newLatLng(marker));

        mMap.setMinZoomPreference(20.0f);
        mMap.setMaxZoomPreference(50.0f);
        addHeatMap();

        fetchFieldData();
    }

    private void fetchFieldData() {
        // Access a Cloud Firestore instance from your Activity
        FirebaseFirestore db = FirebaseFirestore.getInstance();

        db.collection("field_data").addSnapshotListener(new EventListener<QuerySnapshot>() {
            @Override
            public void onEvent(@Nullable @org.jetbrains.annotations.Nullable QuerySnapshot value, @Nullable @org.jetbrains.annotations.Nullable FirebaseFirestoreException error) {
                if(error!=null){
                    Log.e("Fetching Field Data",error.getMessage());
                }
                else{
                    for(DocumentSnapshot doc : value){
                        Log.d("Fetching Field Data", doc.getString("request_id"));
                    }
                }
            }
        });

    }

    private void addHeatMap() {
        List<WeightedLatLng> data = null;

        // Get the data: latitude/longitude positions of police stations.
        try {
            data = readItems(R.raw.test);
            Log.i("Data length", String.valueOf(data.size()));
        } catch (JSONException e) {
            Log.e("Err","Problem reading list of locations.");
            Toast.makeText(this, "Problem reading list of locations.", Toast.LENGTH_LONG).show();
        }


        int[] colors = {
                Color.rgb(0, 255, 0),
                Color.rgb(0, 255, 0)
        };

        float[] startPoints = {
                0.6f, 1f
        };

        Gradient gradient = new Gradient(colors, startPoints);

        // Create a heat map tile provider, passing it the latlngs of the police stations.
        HeatmapTileProvider provider = new HeatmapTileProvider.Builder()
                .weightedData(data)
                .gradient(gradient)
                .radius(50)
                .opacity(1)
                .build();

        // Add a tile overlay to the map, using the heat map tile provider.
        TileOverlay overlay = mMap.addTileOverlay(new TileOverlayOptions().tileProvider(provider));
    }

    private List<WeightedLatLng> readItems(@RawRes int resource) throws JSONException {
        List<WeightedLatLng> result = new ArrayList<>();
        InputStream inputStream = this.getResources().openRawResource(resource);
        String json = new Scanner(inputStream).useDelimiter("\\A").next();
        JSONArray array = new JSONArray(json);
        for (int i = 0; i < array.length(); i++) {
            JSONObject object = array.getJSONObject(i);
            double lat = object.getDouble("lat");
            Log.i("Lat=>",lat+"");
            double lng = object.getDouble("lon");
            double density = object.getDouble("density");
            result.add(new WeightedLatLng(new LatLng(lat,lng), density));
        }
        return result;
    }

//    private void addHeatMap() {
//        List<LatLng> latLngs = null;
//
//        // Get the data: latitude/longitude positions of police stations.
//        try {
//            latLngs = readItems(R.raw.police_stations);
//        } catch (JSONException e) {
//            Toast.makeText(this, "Problem reading list of locations.", Toast.LENGTH_LONG).show();
//        }
//
//        // Create a heat map tile provider, passing it the latlngs of the police stations.
//        HeatmapTileProvider provider = new HeatmapTileProvider.Builder()
//                .data(latLngs)
//                .build();
//
//        // Add a tile overlay to the map, using the heat map tile provider.
//        TileOverlay overlay = mMap.addTileOverlay(new TileOverlayOptions().tileProvider(provider));
//    }

//    private List<LatLng> readItems(@RawRes int resource) throws JSONException {
//        List<LatLng> result = new ArrayList<>();
//        InputStream inputStream = this.getResources().openRawResource(resource);
//        String json = new Scanner(inputStream).useDelimiter("\\A").next();
//        JSONArray array = new JSONArray(json);
//        for (int i = 0; i < array.length(); i++) {
//            JSONObject object = array.getJSONObject(i);
//            double lat = object.getDouble("lat");
//            double lng = object.getDouble("lng");
//            result.add(new LatLng(lat, lng));
//        }
//        return result;
//    }
}