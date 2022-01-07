# Set base image (host OS)
FROM python:3.7-alpine

# By default, listen on port 5000
EXPOSE 5000/tcp

# Set the working directory in the container
WORKDIR /server

# Copy the dependencies file to the working directory
COPY requirements.txt .

# Install any dependencies
RUN apk add --update --no-cache py3-numpy
ENV PYTHONPATH=/usr/lib/python3.7/site-packages
RUN pip install --no-cache-dir numpy==1.16.1 pandas==0.24.1 cv
RUN pip install -r requirements.txt

# Copy the content of the local src directory to the working directory
COPY server.py .

# Specify the command to run on container start
CMD [ "python", "./server.py" ]