from fastapi import FastAPI, UploadFile, File, Form
import pandas as pd
import numpy as np
import json
from typing import Dict, List
import re
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

origins = [
    "http://localhost:3000",  # Replace with your React app's URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Function to identify sensitive columns in a DataFrame
def identify_sensitive_columns(df: pd.DataFrame) -> Dict:
    sensitive_data_columns = set()
    bias_data_columns = set()
    behavioral_analysis_columns = set()
    potential_cyber_attack_columns = set()
    recommendations = {}

    # Function to check for patterns indicative of sensitive data
    def check_for_sensitive_patterns(text, column_name):
        patterns = {
            "Email": r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}\b",
            "Phone": r"\b\d{3}-\d{3}-\d{4}\b",
            "DOB": r"\b\d{4}-\d{2}-\d{2}\b",
            "CreditCard": r"\b\d{4}-\d{4}-\d{4}-\d{4}\b",
            "SSN": r"\b\d{3}-\d{2}-\d{4}\b",
        }
        for pattern_name, pattern in patterns.items():
            if re.search(pattern, text):
                sensitive_data_columns.add(column_name)
                recommendations[
                    column_name
                ] = f"Apply data anonymization, encryption, and access controls for {pattern_name} data."

    # Function to check for columns that may indicate bias
    def check_for_bias_columns(column_name):
        # Check if column_name matches known bias indicators
        bias_indicators = ["Gender", "Race", "Religion"]
        if column_name in bias_indicators:
            bias_data_columns.add(column_name)
            recommendations[
                column_name
            ] = "Monitor for bias and ensure fair treatment in decision-making processes."

    # Function to check for columns suitable for behavioral analysis
    def check_for_behavioral_analysis_columns(column_name):
        # Check if column_name contains behavior-related keywords
        behavior_keywords = ["Behavior", "Activity"]
        for keyword in behavior_keywords:
            if keyword in column_name:
                behavioral_analysis_columns.add(column_name)
                recommendations[
                    column_name
                ] = "Perform behavioral analysis to gain insights for decision support."

    # Function to check for columns that may pose potential cybersecurity risks
    def check_for_cyber_attack_columns(column_name):
        # Check if column_name contains indicators of potential cyber attack vectors
        cyber_attack_indicators = ["IPAddresses", "FileLinks"]
        if column_name in cyber_attack_indicators:
            potential_cyber_attack_columns.add(column_name)
            recommendations[
                column_name
            ] = "Implement cybersecurity measures to protect against potential threats."

    # Analyze the data for patterns and potential issues
    for column in df.columns:
        for value in df[column]:
            if isinstance(value, str):
                check_for_sensitive_patterns(value, column)
            check_for_bias_columns(column)
            check_for_behavioral_analysis_columns(column)
            check_for_cyber_attack_columns(column)

    result = {
        "Private Sensitive Data": list(sensitive_data_columns),
        "Bias Data": list(bias_data_columns),
        "Behavioral Analysis Data": list(behavioral_analysis_columns),
        "Potential Cyber Security Attack Data": list(potential_cyber_attack_columns),
        "Recommendations": recommendations,
    }

    return result


# Define the calculate_fairness_metrics function (unchanged from your previous code)
from typing import Dict
import pandas as pd


# Define a function to calculate fairness metrics
# Define the calculate_fairness_metrics function
def calculate_fairness_metrics(
    data: pd.DataFrame,
    algorithm_column: str,
    dataset_column: str,
    predicted_column: str,
    actual_column: str,
) -> Dict:
    fairness_metrics = {}  # Initialize an empty dictionary for the metrics

    # Group data by unique algorithm-dataset pairs
    unique_pairs = data.groupby([algorithm_column, dataset_column])

    for (algorithm, dataset), group_data in unique_pairs:
        # Calculate fairness metrics for each unique pair
        true_positive = sum(
            (group_data[predicted_column] == 1) & (group_data[actual_column] == 1)
        )
        false_positive = sum(
            (group_data[predicted_column] == 1) & (group_data[actual_column] == 0)
        )
        true_negative = sum(
            (group_data[predicted_column] == 0) & (group_data[actual_column] == 0)
        )
        false_negative = sum(
            (group_data[predicted_column] == 0) & (group_data[actual_column] == 1)
        )

        # Calculate fairness metrics (e.g., True Positive Rate and False Positive Rate)
        tpr = (
            true_positive / (true_positive + false_negative)
            if (true_positive + false_negative) > 0
            else 0
        )
        fpr = (
            false_positive / (false_positive + true_negative)
            if (false_positive + true_negative) > 0
            else 0
        )

        # Store the calculated metrics in the fairness_metrics dictionary
        fairness_metrics[f"Fairness Metrics for {algorithm} on {dataset}"] = {
            "True Positive Rate ": tpr,
            "False Positive Rate ": fpr,
            # Add more fairness metrics as needed
        }

    return fairness_metrics


# Define the /calculate_fairness_metrics/ endpoint
@app.post("/calculate_fairness_metrics/")
async def calculate_metrics(file: UploadFile):
    try:
        # Read the uploaded CSV file into a DataFrame
        df = pd.read_csv(file.file)
    except Exception as e:
        return {"error": f"Error reading the CSV file: {str(e)}"}

    # Define the column names
    algorithm_column = "Algorithm"
    dataset_column = "Dataset"
    predicted_column = "Predicted"
    actual_column = "Actual"

    # Check if any of the required columns are missing
    if not all(
        column in df.columns
        for column in [
            algorithm_column,
            dataset_column,
            predicted_column,
            actual_column,
        ]
    ):
        return {
            "error": "One or more required columns are missing in the uploaded CSV."
        }

    try:
        # Call the calculate_fairness_metrics function
        fairness_metrics = calculate_fairness_metrics(
            df, algorithm_column, dataset_column, predicted_column, actual_column
        )
        return fairness_metrics
    except Exception as e:
        return {"error": f"Error calculating fairness metrics: {str(e)}"}


# Define the analyze_bias function
def analyze_bias(df: pd.DataFrame) -> List[Dict]:
    # Initialize an empty list to store the results
    results = []

    # Group the DataFrame by 'Algorithm Name' and 'Dataset' columns
    grouped = df.groupby(["Algorithm Name", "Dataset"])

    for (algorithm_name, dataset), dataset_group in grouped:
        result_dict = {
            "Algorithm Name": algorithm_name,
            "Dataset": dataset,
            "Results": [],
        }

        # Iterate through the columns starting from the 3rd column (index 2)
        for variable, values in dataset_group.iloc[:, 2:].items():
            # Calculate the accuracy and reliability metrics
            num_ones = values.sum()
            total_observations = len(values)
            accuracy = num_ones / total_observations
            reliability = num_ones / values.count()

            # Append the results for this variable
            result_dict["Results"].append(
                {"Variable": variable, "Accuracy": accuracy, "Reliability": reliability}
            )

        # Append the results for this algorithm-dataset pair to the overall results list
        results.append(result_dict)

    return results


# Define the /analyze_accuracy/ endpoint
@app.post("/analyze_accuracy/")
async def analyze_csv(file: UploadFile):
    try:
        # Read the uploaded CSV file into a DataFrame
        df = pd.read_csv(file.file)
    except Exception as e:
        return {"error": f"Error reading the CSV file: {str(e)}"}

    # Perform bias analysis on the DataFrame
    results = analyze_bias(df)

    # Return the results as JSON
    return {"results": results}


# Define a function to analyze columns (all columns are assumed to be discrete)
def analyze_columns(data):
    return data.columns.tolist(), []


# Define a function to calculate percentage scores for a column
def calculate_percentage_scores(column):
    if column.dtype == "object":
        value_counts = column.value_counts(normalize=True) * 100
        return value_counts
    else:
        return None


# Define a function to calculate fairness score
def calculate_fairness_score(scores):
    sorted_scores = scores.sort_values(ascending=False)
    if len(sorted_scores) >= 2:
        return sorted_scores.iloc[0] - sorted_scores.iloc[1]
    return 0


# Define a function to calculate explicit fairness formula
def calculate_explicit_fairness_formula(scores):
    if len(scores) >= 2:
        max_score = scores.iloc[0]
        second_max_score = scores.iloc[1]
        return f"{second_max_score:.2f}% / {max_score:.2f}%"
    return "N/A"


# Define the /analyze/ endpoint
@app.post("/analyze/")
async def analyze_csv(file: UploadFile):
    try:
        # Read the uploaded CSV file into a DataFrame
        df = pd.read_csv(file.file)
    except Exception as e:
        return {"error": f"Error reading the CSV file: {str(e)}"}

    discrete_columns, _ = analyze_columns(df)
    output_data = {}

    for column in discrete_columns:
        if column == "Name":
            continue

        value_counts = calculate_percentage_scores(df[column])
        if value_counts is not None:
            max_percentage = value_counts.max()
            max_value = value_counts.idxmax()

            fairness_score = calculate_fairness_score(value_counts)
            explicit_fairness_formula = calculate_explicit_fairness_formula(
                value_counts
            )

            bias = "No Bias"
            if (
                max_percentage > 50
                and (max_percentage - value_counts.drop(max_value).max()) >= 20
            ):
                bias = "Potential Bias"

            output_data[column] = {
                "Bias Analysis": bias,
                "Max Percentage": f"{max_percentage:.2f}%",
                "Max Value": max_value,
                "Fairness Score": fairness_score,
                "Explicit Fairness Formula": explicit_fairness_formula,
            }

    return output_data


@app.post("/identify_sensitive_columns/")
async def identify_columns(file: UploadFile):
    try:
        # Read the uploaded CSV file into a DataFrame
        df = pd.read_csv(file.file)
    except Exception as e:
        return {"error": f"Error reading the CSV file: {str(e)}"}

    # Identify sensitive columns and provide recommendations
    result = identify_sensitive_columns(df)
    return result


# Sample data
data = [
    ("European Union", "GDPR", 0.04, 20000000000, "Total Revenue", "EUR", 0.92),
    (
        "United States",
        "State-specific regulations (e.g., CCPA)",
        "Varied",
        8000,
        "Per violation",
        "USD",
        1,
    ),
    ("Canada", "PIPEDA", 0, 100000, "Total Revenue", "CAD", 1.25),
    (
        "China",
        "Cybersecurity Law, Personal Information Security Specification",
        0.05,
        561183700,
        "Total Revenue",
        "CNY",
        6.45,
    ),
    (
        "India",
        "Personal Data Protection Bill (proposed)",
        0.04,
        150000000,
        "total worldwide turnover",
        "INR",
        73,
    ),
    (
        "Australia",
        "Privacy Act, NDB scheme",
        0.04,
        50000000,
        "Annual global turnover",
        "AUD",
        1.35,
    ),
    ("Brazil", "LGPD", 0.02, 500000000, "total revenue in Brazil", "BRL", 5.35),
    ("Japan", "APPI", 0.02, 100000000, "", "JPY", 110),
    (
        "South Korea",
        "PIPA, Credit Information Act",
        0.03,
        500000000,
        "sales relating to an act that violates the Information and Communications Network Act",
        "KRW",
        1160.00,
    ),
    ("Russia", "Federal Law No. 152-FZ", 0.06, 18000000, "Total Revenue", "RUB", 75),
    ("Singapore", "PDPA", 0.04, 298000000, "Total annual turnover", "SGD", 1.33),
    (
        "Mexico",
        "Federal Law on Data Protection",
        0.02,
        6000000,
        "Total Revenue",
        "MXN",
        20,
    ),
    (
        "South Africa",
        "Protection of Personal Information Act",
        0.10,
        10000000,
        "annual global turnover",
        "ZAR",
        14.5,
    ),
    ("New Zealand", "Privacy Act", 0.04, 10000, "Total Revenue", "NZD", 1.45),
    (
        "Malaysia",
        "Personal Data Protection Act",
        0.04,
        500000000,
        "annual revenue",
        "MYR",
        4.15,
    ),
    (
        "Nigeria",
        "Nigeria Data Protection Regulation",
        0.02,
        10000000,
        "annual gross revenue",
        "NGN",
        412,
    ),
    (
        "UAE",
        "UAE Data Protection Regulation",
        0.05,
        1990000000,
        "total worldwide annual turnover",
        "AED",
        3.67,
    ),
    (
        "United Kingdom",
        "UK GDPR",
        0.04,
        170020000,
        "Company's global revenue",
        "GBP",
        0.78,
    ),
    (
        "Germany",
        "GDPR (EU regulation applies)",
        0.04,
        20000000,
        "total worldwide annual turnover",
        "EUR",
        0.92,
    ),
    (
        "France",
        "GDPR (EU regulation applies)",
        0.04,
        20000000,
        "annual global turnover",
        "EUR",
        0.92,
    ),
    (
        "Italy",
        "GDPR (EU regulation applies)",
        0.04,
        20000000,
        "worldwide turnover",
        "EUR",
        0.92,
    ),
    (
        "Spain",
        "GDPR (EU regulation applies)",
        0.04,
        20000000,
        "annual turnover",
        "EUR",
        0.92,
    ),
    (
        "Netherlands",
        "GDPR (EU regulation applies)",
        0.04,
        20000000,
        "annual global turnover",
        "EUR",
        0.92,
    ),
    (
        "Sweden",
        "GDPR (EU regulation applies)",
        0.04,
        2373380000,
        "annual global turnover",
        "SEK",
        10.91,
    ),
    (
        "Switzerland",
        "Swiss Data Protection Act",
        0.04,
        1905600000,
        "business annual global revenue",
        "CHF",
        0.9,
    ),
    (
        "Norway",
        "GDPR (EU regulation applies)",
        0.04,
        2306120000,
        "annual global turnover",
        "NOK",
        10.25,
    ),
    (
        "Denmark",
        "GDPR (EU regulation applies)",
        0.04,
        1490240000,
        "Annual global turnover",
        "DKK",
        6,
    ),
    (
        "Belgium",
        "GDPR (EU regulation applies)",
        0.04,
        20000000,
        "annual worldwide turnover",
        "EUR",
        0.92,
    ),
    (
        "Austria",
        "GDPR (EU regulation applies)",
        0.04,
        20000000,
        "the total worldwide annual turnover",
        "EUR",
        0.92,
    ),
    # Add more countries' data here
]


columns = [
    "Country",
    "Data Privacy Regulation",
    "Privacy Penalties (%)",
    "Privacy Penalties Amount",
    "Unit",
    "Currency",
    "Conversion from US$ to Country Currency",
]

df = pd.DataFrame(data, columns=columns)


def calculate_penalty(row, annual_usd, num_violations):
    penalty_percent = row["Privacy Penalties (%)"]
    penalty_amount = row["Privacy Penalties Amount"]
    currency = row["Currency"]
    conversion_rate = row["Conversion from US$ to Country Currency"]

    if penalty_percent == "Varied":
        penalty = penalty_amount * num_violations
    else:
        penalty_percentage = penalty_percent
        penalty_based_on_percentage = penalty_percentage * annual_usd * conversion_rate
        penalty = max(penalty_based_on_percentage, penalty_amount)

    return penalty


@app.post("/calculate_penalty/")
async def calculate_penalties(
    annual_usd: float = Form(...), num_violations: int = Form(...)
):
    # Calculate penalties and cumulative penalty
    df["Penalty"] = df.apply(
        calculate_penalty, args=(annual_usd, num_violations), axis=1
    )
    df["Converted Penalty"] = (
        df["Penalty"] * df["Conversion from US$ to Country Currency"]
    )
    cumulative_penalty = df["Converted Penalty"].sum()

    # Check if "Sr No" column exists before inserting it
    if "Sr No" not in df:
        df.insert(0, "Sr No", range(1, 1 + len(df)))

    # Create a dictionary to store results for all countries
    results = {
        "Cumulative Fine Amount (USD)": f"${cumulative_penalty:.2f}",
        "Countries": [],
    }

    # Loop through each country and add its results to the dictionary
    for _, row in df.iterrows():
        country_result = {
            "Country": row["Country"],
            "Data Privacy Regulation": row["Data Privacy Regulation"],
            "Penalty": row["Penalty"],
            "Currency": row["Currency"],
        }
        results["Countries"].append(country_result)

    return results


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="localhost", port=8000)
