import pandas as pd
import sys

excel_path = r"C:\Users\romme\iCloudDrive\Documents\Spain\Maryorith - Nómina\nomina empleada hogar 2026 completa.xlsx"

try:
    xl = pd.ExcelFile(excel_path)
    print("Sheets available:", xl.sheet_names)
    for sheet in xl.sheet_names:
        df = xl.parse(sheet)
        print(f"\n--- Sheet: {sheet} ---")
        print(df.head(20).to_string())
except Exception as e:
    print(f"Error reading Excel: {e}")
    sys.exit(1)
