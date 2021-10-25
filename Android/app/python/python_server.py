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

app = Flask(__name__)
cors = CORS(app)

IMG_WIDTH=300
IMG_HEIGHT=400

@app.route("/image", methods=['POST','GET'])
def image():
    img = request.form.get("imagebytes", "Something went wrong!")#request.form["imagebytes"]
    print("######",img)
    decoded = json.loads(img)
    img2 = decoded.get("imagebytes")
    print("!!!!!!",img2)
    image111 = cv2.imread(img2)
    print("%%%%%%",image111)
    return img;

@app.route("/preprocess", methods=['GET'])
def preprocess():
    image=cv2.imread("IMG_20210721_100346.jpg")
    cv2.imshow('img',image)
    rgbImage = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    hsvImage = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    low_green = np.array([30, 50, 76])
    high_green = np.array([80, 255, 255])
    mask = cv2.inRange(hsvImage, low_green, high_green)
    res = cv2.bitwise_and(rgbImage,rgbImage, mask= mask)

    image1=cv2.resize(res, (IMG_HEIGHT, IMG_WIDTH),interpolation = cv2.INTER_AREA)
    image1=np.array(image1)
    img_data=image1
    return str(img_data)




#if __name__ == '__main__':
app.run(host="0.0.0.0", port=5000, debug=True)