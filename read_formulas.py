import openpyxl
import os

excel_path = r"C:\Users\romme\iCloudDrive\Documents\Spain\Maryorith - Nómina\nomina empleada hogar 2026 completa.xlsx"

try:
    wb = openpyxl.load_workbook(excel_path, data_only=False)
    sheet = wb["Enero"]
    
    print("--- Formulas in Enero ---")
    for r in range(1, 40):
        for c in range(1, 6):
            cell = sheet.cell(row=r, column=c)
            if cell.data_type == 'f':  # Formula
                print(f"Cell {cell.coordinate}: {cell.value}")
            elif cell.value and isinstance(cell.value, (int, float, str)):
                pass # print(f"Cell {cell.coordinate}: {cell.value}")
except Exception as e:
    print(f"Error: {e}")
