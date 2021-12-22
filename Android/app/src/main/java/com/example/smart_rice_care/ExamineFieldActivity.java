package com.example.smart_rice_care;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.media.MediaPlayer;
import android.os.Bundle;
import android.os.Handler;
import android.text.Editable;
import android.text.TextWatcher;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

public class ExamineFieldActivity extends AppCompatActivity implements SensorEventListener {

    String requestId, fieldId, farmerId;
    TextView textView1, textView2;
    EditText etFlyingTime;
    Button btStart, btStop;

    private SensorManager sensorMan;
    private Sensor accelerometer;
    private boolean sensorRegistered;

    private float[] mGravity;
    private double mAccel;
    private double mAccelCurrent;
    private double mAccelLast;

    private int hitCount = 0;
    private double hitSum = 0;
    private double hitResult = 0;

    private final int SAMPLE_SIZE = 1; // change this sample size as you want, higher is more precise but slow measure.
    private double THRESHOLD = 0; // change this threshold as you want, higher is more spike movement

    Integer flyingTime;
    Boolean calibrationState = false;

    MediaPlayer mp;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_examine_field);

        Intent getIntent = getIntent();
        requestId = getIntent.getStringExtra("requestId");
        fieldId = getIntent.getStringExtra("fieldId");
        farmerId = getIntent.getStringExtra("farmerId");

        mp = MediaPlayer.create(ExamineFieldActivity.this, R.raw.beep);
        textView1 = findViewById(R.id.textView1);
        textView2 = findViewById(R.id.textView2);
        etFlyingTime = findViewById(R.id.etFlyingTime);
        btStart = findViewById(R.id.btStart);
        btStop = findViewById(R.id.btStop);

        sensorMan = (SensorManager) this.getSystemService(ExamineFieldActivity.this.SENSOR_SERVICE);
        accelerometer = sensorMan.getDefaultSensor(Sensor.TYPE_ACCELEROMETER);
        mAccel = 0.00f;
        mAccelCurrent = SensorManager.GRAVITY_EARTH;
        mAccelLast = SensorManager.GRAVITY_EARTH;
        sensorMan.registerListener(this, accelerometer,
                SensorManager.SENSOR_DELAY_NORMAL);
        sensorRegistered = true;

        btStart.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                flyingTime = Integer.parseInt(findViewById(R.id.etFlyingTime).toString());
                Handler handler = new Handler();
                handler.postDelayed(new Runnable() {
                    public void run() {
                        calibrationState = true;
                        mp.start();

                    }
                }, flyingTime*1000);
            }
        });

//        Intent intent = new Intent(ExamineFieldActivity.this, ImageCaptureActivity.class);
//        intent.putExtra("requestId", requestId);
//        intent.putExtra("fieldId", fieldId);
//        intent.putExtra("farmerId", farmerId);
//        startActivity(intent);
    }

    @Override
    public void onSensorChanged(SensorEvent event) {

        if (event.sensor.getType() == Sensor.TYPE_ACCELEROMETER) {
            mGravity = event.values.clone();
            // Shake detection
            double x = mGravity[0];
            double y = mGravity[1];
            double z = mGravity[2];
            mAccelLast = mAccelCurrent;
            mAccelCurrent = Math.sqrt(x * x + y * y + z * z);
            double delta = mAccelCurrent - mAccelLast;
            mAccel = mAccel * 0.9f + delta;

            if (hitCount <= SAMPLE_SIZE) {
                hitCount++;
                hitSum += Math.abs(mAccel);
            } else {
                hitResult = hitSum / SAMPLE_SIZE;

                Log.d("hiii=", String.valueOf(hitResult));
                textView1.setText(String.valueOf(hitResult));
                if (hitResult > THRESHOLD) {
                    textView2.setText("Moving");
                } else {
                    textView2.setText("Still");
                }

                hitCount = 0;
                hitSum = 0;
                hitResult = 0;
            }
        }
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {

    }
}