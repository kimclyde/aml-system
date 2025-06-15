# AML Detection System

Advanced Money Laundering Detection & Risk Assessment System using machine learning to identify suspicious financial transactions.

## Project Overview

This project implements a machine learning-based system for detecting potential Anti-Money Laundering (AML) violations in financial transactions. The system uses a Random Forest model trained on transaction data to predict the likelihood of suspicious activity.

## Features

- **Machine Learning Model**: Random Forest classifier for AML detection
- **REST API**: FastAPI-based web service for real-time predictions
- **Web Interface**: Simple HTML/CSS/JavaScript frontend for testing
- **Data Processing**: Automated feature preprocessing and data cleaning
- **Model Persistence**: Trained model saved using joblib for quick loading


## Prerequisites

- Python 3.8 or higher
- pip package manager

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/kimclyde/aml-system
   cd aml_detection
   ```

2. **Create Virtual Environment**:
    ```bash
    python -m venv venv # Window
    python3 -m venv venv # Linux and Mac
    ```

3. **Activate Virtual Environment**:
    ```bash
    venv\Scripts\activate # Window
    source venv\bin\active # Linux and Mac
    ```

4. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

## Running the Application

### 1. Start the API Server

Navigate to the API directory and run the FastAPI server:

```bash
cd api
python main.py
```

The API will be available at:
- **API Base URL**: `http://localhost:8000`
- **Interactive API Docs**: `http://localhost:8000/docs`
- **Alternative Docs**: `http://localhost:8000/redoc`

### 2. Access the Web Interface

Open the web interface by opening `web/index.html` in your browser, or serve it using a simple HTTP server:

```bash
cd web
python -m http.server 3000
```

Then visit `http://localhost:3000` in your browser.

## API Usage

### Prediction Endpoint

**POST** `/predict`

Send a JSON payload with transaction details:

```json
{
  "day_name": "Monday",
  "hour": 14,
  "amount": 1500.50,
  "pay_curr": "USD",
  "recieved_curr": "EUR",
  "send_loc": "US",
  "recieve_loc": "DE",
  "payment_type": "Wire Transfer"
}
```

**Response:**
```json
{
  "prediction": 0,
  "probability": [0.85, 0.15]
}
```

- `prediction`: 0 = Normal transaction, 1 = Suspicious transaction
- `probability`: Array of probabilities [normal, suspicious]


## Model Information

The system uses a Random Forest classifier trained on financial transaction data. The model considers the following features:

- **Temporal**: Day of week, hour of transaction
- **Financial**: Transaction amount, currencies involved
- **Geographic**: Sending and receiving locations
- **Method**: Payment type/method

## Development

### Training New Models

To retrain the model with new data:

1. Place your training data in `api/data/`
2. Open and run the Jupyter notebooks in `api/notebooks/`:
   - `cleaning.ipynb` for data preprocessing
   - `model_training.ipynb` for model training
3. The trained model will be saved to `api/models/`

### Adding New Features

1. Update the [`TransactionInput`](api/main.py) model in `api/main.py`
2. Modify the [`preprocess_features`](api/utils/preprocess_features.py) function in `api/utils/preprocess_features.py`
3. Retrain the model with the new features

## Dependencies

Key dependencies include:
- **FastAPI**: Web framework for the API
- **scikit-learn**: Machine learning library
- **joblib**: Model serialization
- **pandas**: Data manipulation
- **uvicorn**: ASGI server

See [`requirements.txt`](requirements.txt) for the complete list.
