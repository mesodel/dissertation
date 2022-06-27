FROM python:3.8-slim-buster

LABEL title="nn-app" \
  description="NN application"

RUN mkdir -p /usr/app
WORKDIR /usr/app
ADD models              models
ADD src                 src

RUN pip3 install scikit-learn
RUN pip3 install pandas
RUN pip3 install tensorflow-aarch64
RUN pip3 install flask

EXPOSE 5000

WORKDIR /usr/app/src
ENTRYPOINT ["python3", "-m", "flask", "run", "--host=0.0.0.0"]
