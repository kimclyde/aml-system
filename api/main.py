from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sys
import os
import uvicorn

sys.path.append(os.path.join(os.path.dirname(__file__), 'utils'))

from utils.load_model import load_trained_model
from utils.preprocess_features import preprocess_features

app = FastAPI(
    title="AML Detection API",
    description="Advanced Money Laundering Detection & Risk Assessment System",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Load your trained model
model = load_trained_model()

# Define request schema
class TransactionInput(BaseModel):
    day_name: str
    hour: int
    amount: float
    pay_curr: str
    recieved_curr: str
    send_loc: str
    recieve_loc: str
    payment_type: str

@app.post("/predict")
def predict(input_data: TransactionInput):
    # Preprocess input
    features = preprocess_features(
        input_data.day_name,
        input_data.hour,
        input_data.amount,
        input_data.pay_curr,
        input_data.recieved_curr,
        input_data.send_loc,
        input_data.recieve_loc,
        input_data.payment_type
    )

    # Make prediction
    prediction = model.predict(features)[0]
    probab = model.predict_proba(features)[0].tolist()

    return {
        "prediction": int(prediction),
        "probability": probab
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )