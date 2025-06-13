import psycopg2
import csv
from dotenv import load_dotenv
import os
load_dotenv()

conn = psycopg2.connect(
    dbname=os.getenv("POSTGRES_DBNAME"),
    user=os.getenv("POSTGRES_USER"),
    password=os.getenv("POSTGRES_PASSWORD"),
    host=os.getenv("POSTGRES_HOST"),
    port=os.getenv("POSTGRES_PORT")
)

def create_aml_table():
    """Create the AML detection table with specified columns"""
    cursor = conn.cursor()
    
    # Drop table if exists and create new one
    drop_table_query = "DROP TABLE IF EXISTS aml_transactions;"
    
    create_table_query = """
    CREATE TABLE aml_transactions (
        id SERIAL PRIMARY KEY,
        time VARCHAR(50),
        date VARCHAR(50),
        sender_account VARCHAR(100),
        receiver_account VARCHAR(100),
        amount DECIMAL(15, 2),
        payment_currency VARCHAR(25),
        received_currency VARCHAR(25),
        sender_bank_location VARCHAR(100),
        receiver_bank_location VARCHAR(100),
        payment_type VARCHAR(50),
        is_laundering INTEGER,
        laundering_type VARCHAR(100)
    );
    """
    
    try:
        cursor.execute(drop_table_query)
        cursor.execute(create_table_query)
        conn.commit()
        print("Table 'aml_transactions' created successfully!")
    except Exception as e:
        print(f"Error creating table: {e}")
        conn.rollback()
    finally:
        cursor.close()

def copy_csv_to_db(csv_file_path):
    """Copy CSV data into the database table"""
    cursor = conn.cursor()
    
    try:
        with open(csv_file_path, 'r', encoding='utf-8') as file:
            # Skip header row
            next(file)
            
            # Use COPY command for efficient bulk insert
            copy_query = """
            COPY aml_transactions (time, date, sender_account, receiver_account, amount,
                                 payment_currency, received_currency, sender_bank_location,
                                 receiver_bank_location, payment_type, is_laundering,
                                 laundering_type)
            FROM STDIN WITH CSV DELIMITER ','
            """
            
            cursor.copy_expert(copy_query, file)
            conn.commit()
            print(f"CSV data from {csv_file_path} copied successfully!")
            
    except Exception as e:
        print(f"Error copying CSV data: {e}")
        conn.rollback()
    finally:
        cursor.close()

if __name__ == "__main__":
    # Create the table
    create_aml_table()
    
    # Copy CSV data (replace with your actual CSV file path)
    csv_file_path = "../data/aml-1month.csv"
    if not os.path.exists(csv_file_path):
        print(f"CSV file {csv_file_path} does not exist.")
    else:
        # print("csv found")
        copy_csv_to_db(csv_file_path)

    
    # Close connection
    conn.close()

