import pandas as pd
import numpy as np
from sklearn.preprocessing import RobustScaler
import joblib
import os

def preprocess_features(day_name, hour, amount, pay_curr, recieved_curr, send_loc, recieve_loc, payment_type):
    """
    Preprocess features for AML detection.
    
    Args:
        day_name (str): Day name (e.g., 'Monday', 'Tuesday', etc.).
        hour (int): Hour of the day (0-23).
        amount (float): Transaction amount.
        pay_curr (str): Payment currency.
        recieved_curr (str): Received currency.
        send_loc (str): Sender's bank location.
        recieve_loc (str): Receiver's bank location.
        payment_type (str): Type of payment.
    
    Returns:
        np.array: Preprocessed feature array ready for model prediction.
    """
    
    # Convert day name to number (1=Sunday, 2=Monday, ..., 7=Saturday)
    day_mapping = {
        'sunday': 1,
        'monday': 2,
        'tuesday': 3,
        'wednesday': 4,
        'thursday': 5,
        'friday': 6,
        'saturday': 7
    }
    
    dayofweek = day_mapping.get(day_name.lower(), 1)
    # scale amount
    scaler = RobustScaler()
    amount_scaled = scaler.fit_transform([[amount]])[0][0]
    
    # Currency feature: 1 if different currency (change_currency), 0 if same
    change_currency = 0 if pay_curr.lower() == recieved_curr.lower() else 1
    
    # Location feature: 1 if different location (change_location), 0 if same
    change_location = 0 if send_loc.lower() == recieve_loc.lower() else 1
    
    # One-hot encode payment type - using actual payment types from your data
    payment_types = ['Cash Deposit', 'Cross-border', 'Cheque', 'ACH', 'Credit card', 'Debit card', 'Cash Withdrawal']
    payment_features = []
    for pt in payment_types:
        payment_features.append(1 if payment_type == pt else 0)
    
    features = [dayofweek, hour, amount_scaled, change_currency, change_location] + payment_features
    
    return np.array(features).reshape(1, -1)


# Test the function
if __name__ == "__main__":
    # Test with some sample data
    features = preprocess_features(
        day_name="Monday",
        hour=14,
        amount=1000.50,
        pay_curr="USD",
        recieved_curr="EUR",
        send_loc="USA",
        recieve_loc="France",
        payment_type="Credit card"
    )
    print(f"\nFeature array shape: {features.shape}")
    print(f"Feature array: {features}")