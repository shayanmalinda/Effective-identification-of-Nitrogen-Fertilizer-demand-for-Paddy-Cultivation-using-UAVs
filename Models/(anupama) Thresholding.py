import cv2 as cv
import numpy as np
from matplotlib import pyplot as plt

img = cv.imread('img.jpg',0)
img = cv.medianBlur(img,5)

# dst = cv.calcHist(img, [0], None, [256], [0,256])

#global thresholding 
ret,th1 = cv.threshold(img,127,255,cv.THRESH_BINARY)
#adaptive Mean thresholding
th2 = cv.adaptiveThreshold(img,255,cv.ADAPTIVE_THRESH_MEAN_C,\
            cv.THRESH_BINARY,11,2)
#adaptive Gaussian thresholding
th3 = cv.adaptiveThreshold(img,255,cv.ADAPTIVE_THRESH_GAUSSIAN_C,\
            cv.THRESH_BINARY,11,2)
# Otsu's thresholding
ret2,th4 = cv.threshold(img,0,255,cv.THRESH_BINARY+cv.THRESH_OTSU)
titles = ['Original Image', 'Global Thresholding (v = 127)',
            'Adaptive Mean Thresholding', 'Adaptive Gaussian Thresholding', "Otsu's Thresholding"]
images = [img, th1, th2, th3, th4]
for i in range(5):
    plt.subplot(2,3,i+1),plt.imshow(images[i],'gray')
    plt.title(titles[i])
    plt.xticks([]),plt.yticks([])
plt.show()

#global thresholding with 112
ret,th1 = cv.threshold(img,125,255,cv.THRESH_BINARY)
#adaptive Mean thresholding
th2 = cv.adaptiveThreshold(img,255,cv.ADAPTIVE_THRESH_MEAN_C,\
            cv.THRESH_BINARY,11,2)
#adaptive Gaussian thresholding
th3 = cv.adaptiveThreshold(img,255,cv.ADAPTIVE_THRESH_GAUSSIAN_C,\
            cv.THRESH_BINARY,11,2)
# Otsu's thresholding
ret2,th4 = cv.threshold(img,0,255,cv.THRESH_BINARY+cv.THRESH_OTSU)

# Otsu's thresholding after Gaussian filtering
blur = cv.GaussianBlur(img,(5,5),0)
ret3,th5 = cv.threshold(blur,0,255,cv.THRESH_BINARY+cv.THRESH_OTSU)

titles = ['Original Noice Image', 'Global Thresholding (v = 125)']
images = [img, th1]
for i in range(2):
    plt.subplot(2,1,i+1),plt.imshow(images[i],'gray')
    plt.title(titles[i])
    plt.xticks([]),plt.yticks([])
plt.show()
