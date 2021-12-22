package com.example.smart_rice_care;

import androidx.appcompat.app.AppCompatActivity;

import android.content.SharedPreferences;
import android.graphics.Color;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.media.MediaPlayer;
import android.os.Bundle;
import android.os.Handler;
import android.preference.PreferenceManager;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

public class CalibrateSensorActivity extends AppCompatActivity implements SensorEventListener {

    EditText etFlyingTime, etDelayTime;
    Button btStart, btStop, btReset;

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

    Integer flyingTime, delayTime;
    Boolean calibrationState = false;

    MediaPlayer mp;

    TextView tvThresholdValue,tvHitValue, tvCalibrationState;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_calibrate_sensor);

        tvThresholdValue = findViewById(R.id.tvThresholdValue);
        tvHitValue = findViewById(R.id.tvHitValue);
        tvCalibrationState = findViewById(R.id.tvCalibrationState);

        SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(this);
        String threshold = preferences.getString("SENSORTHRESHOLD", "");
        if(!threshold.equalsIgnoreCase(""))
        {
            THRESHOLD = Double.parseDouble(threshold);
        }
        tvThresholdValue.setText(String.valueOf(THRESHOLD));
        tvCalibrationState.setText("Calibration Not Yet Started");
        tvCalibrationState.setTextColor(getResources().getColor(R.color.orange_900));

        mp = MediaPlayer.create(CalibrateSensorActivity.this, R.raw.beep);
        etDelayTime = findViewById(R.id.etDelayTime);
        etFlyingTime = findViewById(R.id.etFlyingTime);
        btStart = findViewById(R.id.btStart);
        btStop = findViewById(R.id.btStop);
        btReset = findViewById(R.id.btReset);

        sensorMan = (SensorManager) this.getSystemService(CalibrateSensorActivity.this.SENSOR_SERVICE);
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
                if(TextUtils.isEmpty(etDelayTime.getText().toString())){
                    Toast.makeText(CalibrateSensorActivity.this, "Please enter a delay time", Toast.LENGTH_SHORT).show();
                }
                else if(TextUtils.isEmpty(etFlyingTime.getText().toString())){
                    Toast.makeText(CalibrateSensorActivity.this, "Please enter a flying time", Toast.LENGTH_SHORT).show();
                }
                else{
                    flyingTime = Integer.parseInt(etFlyingTime.getText().toString());
                    delayTime = Integer.parseInt(etDelayTime.getText().toString());
                    Handler handler = new Handler();
                    if(delayTime<3){
                        Toast.makeText(CalibrateSensorActivity.this, "Delay time should be at least 3 seconds", Toast.LENGTH_SHORT).show();
                    }
                    else if(flyingTime<10){
                        Toast.makeText(CalibrateSensorActivity.this, "Flying time should be at least 10 seconds", Toast.LENGTH_SHORT).show();
                    }
                    else{
                        tvCalibrationState.setText("Flying delay countdown");
                        tvCalibrationState.setTextColor(getResources().getColor(R.color.black));
                        handler.postDelayed(new Runnable() {
                            public void run() {
                                calibrationState = true;
                                mp.start();
                                tvCalibrationState.setText("Calibrating");
                                tvCalibrationState.setTextColor(getResources().getColor(R.color.black));

                                handler.postDelayed(new Runnable() {
                                    public void run() {
                                        calibrationState = false;
                                        mp.stop();
                                        tvCalibrationState.setText("Calibration Success");
                                        tvCalibrationState.setTextColor(getResources().getColor(R.color.green_500));
                                    }
                                }, flyingTime*1000);
                            }
                        }, delayTime*1000);
                    }
                }
            }
        });

        btStop.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                calibrationState = false;
                mp.pause();

                SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(CalibrateSensorActivity.this);
                SharedPreferences.Editor editor = preferences.edit();
                editor.putString("SENSORTHRESHOLD",String.valueOf(THRESHOLD));
                editor.apply();

                Toast.makeText(CalibrateSensorActivity.this, "Sensor Calibration Success", Toast.LENGTH_SHORT).show();

                finish();
            }
        });

        btReset.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(calibrationState){
                    Toast.makeText(CalibrateSensorActivity.this, "Please stop the calibration process first", Toast.LENGTH_SHORT).show();
                }
                else{
                    THRESHOLD = 0;
                    tvThresholdValue.setText(String.valueOf(THRESHOLD));
                    SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(CalibrateSensorActivity.this);
                    SharedPreferences.Editor editor = preferences.edit();
                    editor.putString("SENSORTHRESHOLD",String.valueOf(THRESHOLD));
                    editor.apply();
                    Toast.makeText(CalibrateSensorActivity.this, "Reset Success", Toast.LENGTH_SHORT).show();
                }
            }
        });

    }

    @Override
    protected void onPause() {
        super.onPause();
        mp.stop();
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
                tvHitValue.setText(String.valueOf(hitResult));
                if(hitResult>=THRESHOLD && calibrationState){
                    THRESHOLD = hitResult;
                    tvThresholdValue.setText(String.valueOf(THRESHOLD));
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