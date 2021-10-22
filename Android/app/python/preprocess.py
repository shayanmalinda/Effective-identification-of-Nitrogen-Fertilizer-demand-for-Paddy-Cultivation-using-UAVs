import numpy as np
import cv2


path="/content/drive/My Drive/Final Year Research/Dataset/Oneplus 5T/Level 04/IMG_20210721_100324.jpg"

IMG_WIDTH=300
IMG_HEIGHT=400

def preprocess_image(file):

    image=cv2.imread(file)
    rgbImage = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    hsvImage = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    low_green = np.array([30, 50, 76])
    high_green = np.array([80, 255, 255])
    mask = cv2.inRange(hsvImage, low_green, high_green)
    res = cv2.bitwise_and(rgbImage,rgbImage, mask= mask)

    image1=cv2.resize(res, (IMG_HEIGHT, IMG_WIDTH),interpolation = cv2.INTER_AREA)
    image1=np.array(image1)
    #image1 = image1.astype('float32')
    #image1 /= 255
    img_data=image1
    #if(i==200):break
    return img_data

# extract the image array and class name
img_data =preprocess_image(path)
