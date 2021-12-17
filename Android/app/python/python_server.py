from flask import Flask, Response, request, jsonify
from io import BytesIO
import base64
from flask_cors import CORS, cross_origin
import os
import sys
from urllib.request import urlopen
import json
import cv2
import  numpy as np
import pandas as pd
import piexif
import joblib
import sklearn
from PIL import Image
from flask import request
import io
import requests

app = Flask(__name__)
cors = CORS(app)

IMG_WIDTH=300
IMG_HEIGHT=400

@app.route("/image", methods=['POST','GET'])
def image():
    img = request.files["image"]
    #img.raw.decode_content = True
    image_bytes = Image.open(io.BytesIO(img.read()))
    b = BytesIO()
    image_bytes.save(b,"jpeg")
    image_bytes.save("image.jpg",quality=95,subsampling=0)

    print("######",str(img),type(img))
    return str(image_bytes);

@app.route("/image", methods=['POST','GET'])
def process():
    image_name="./image.jpg";
    preprocessed_image=preprocess(image_name);
    arr_rgb=rgb_mean(preprocessed_image);
    df=extract_metadata(image_name);
    df['rvalue']=arr_rgb[0];
    df['gvalue']=arr_rgb[1];
    df['bvalue']=arr_rgb[2];
    result=predict(df);
    #print(str(arr_rgb))
    return str(result);

def predict(df):
    print("predict")
    # Load the model from the file
    model = joblib.load('./model.pkl')

    # Use the loaded model to make predictions
    prd=model.predict(df)
    return prd;

def preprocess(image_name):
    image=cv2.imread(image_name)
    #cv2.imshow('img',image)
    rgbImage = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    hsvImage = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    low_green = np.array([30, 50, 76])
    high_green = np.array([80, 255, 255])
    mask = cv2.inRange(hsvImage, low_green, high_green)
    res = cv2.bitwise_and(rgbImage,rgbImage, mask= mask)

    image1=cv2.resize(res, (IMG_HEIGHT, IMG_WIDTH),interpolation = cv2.INTER_AREA)
    image1=np.array(image1)
    return image1;

def rgb_mean(image):
    print("rgb_mean" ,str(image.shape))
    rowcnt=image.shape[0]
    colcnt=image.shape[1]

    rgbarr1=np.zeros((3))

    r=0
    b=0
    g=0
    nonzerocnt=0;
    for k in range(rowcnt):
        for l in range(colcnt):
            #print(str(image[k][l]))
            if not(image[k][l][0]==0 and image[k][l][1]==0 and image[k][l][2]==0):
                #print(images[i][j][k][l])
                nonzerocnt+=1
                r+=image[k][l][0];
                g+=image[k][l][1];
                b+=image[k][l][2];#we dont remove images..just removing pixels..so rgbarr size no need to change
    if(nonzerocnt>0):
        rgbarr1[0]=r/nonzerocnt;
        rgbarr1[1]=g/nonzerocnt;
        rgbarr1[2]=b/nonzerocnt;

    return  rgbarr1;

def extract_metadata(image_name):
    #pre-process

    exif_dict = piexif.load(image_name)
    #df = pd.DataFrame(columns=['image', 'brightness','shutter_speed','exposure_time'])
    df = pd.DataFrame(columns=['brightness','shutter_speed','exposure_time'])
    img_mdata=np.zeros(3)

    # Iterate through all the other ifd names and print them
    #print(exif_dict.get('Exif'));

    for tag in exif_dict['Exif']:
        tag_name = piexif.TAGS['Exif'][tag]["name"]
        tag_value = exif_dict['Exif'][tag]
        # Avoid print a large value, just to be pretty
        if isinstance(tag_value, bytes):
            tag_value = tag_value[:10]
        #print(f'\t{tag_name:25}: {tag_value}')
        if(tag_name=='BrightnessValue'): #string brightness value not found
            img_mdata[0]=tag_value[0]/tag_value[1]
            #print("@@@@@@@",img_mdata[0])

        if(tag_name=='ShutterSpeedValue'):
            img_mdata[1]=tag_value[0]/tag_value[1]

        if(tag_name=='ExposureTime'):
            img_mdata[2]=tag_value[0]/tag_value[1]

    df.loc[0] =[img_mdata[0]] + [img_mdata[1]] + [img_mdata[2]]
    #df.loc[0] = [image_name] + [img_mdata[0]] + [img_mdata[1]] + [img_mdata[2]]

    return df



#if __name__ == '__main__':
app.run(host="0.0.0.0", port=5000, debug=True)