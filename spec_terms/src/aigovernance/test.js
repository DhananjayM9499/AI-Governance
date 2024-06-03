import React from "react";

const DataTable = () => {
  // Parse the JSON data
  const data = [
    '{"file_name":"/opt/ai-legislation/home/AI/BIAS/INPUT/2024_05_30/05_41_50//Data Bias API.py","line_no":40,"bias_type":"Hard Coded","potential_bias":"String/Array Literal","algorithm_package_term":"                \\"Fairness Score\\": fairness_score,"}',
    '{"file_name":"/opt/ai-legislation/home/AI/BIAS/INPUT/2024_05_30/05_41_50//Data Bias API.py","line_no":44,"bias_type":"Hard Coded","potential_bias":"String/Array Literal","algorithm_package_term":"                \\"Explicit Fairness Formula\\": explicit_fairness_formula"}',
    '{"file_name":"/opt/ai-legislation/home/AI/BIAS/INPUT/2024_05_30/05_41_50//Data Bias API.py","line_no":13,"bias_type":"HUMAN BIAS","potential_bias":"Age Bias","algorithm_package_term":"Age > def calculate_percentage_scores(column):"}',
    '{"file_name":"/opt/ai-legislation/home/AI/BIAS/INPUT/2024_05_30/05_41_50//Data Bias API.py","line_no":29,"bias_type":"Hard Coded","potential_bias":"String/Array Literal","algorithm_package_term":"    return \\"N/A\\""}',
    '{"file_name":"/opt/ai-legislation/home/AI/BIAS/INPUT/2024_05_30/05_41_50//Data Bias API.py","line_no":48,"bias_type":"Hard Coded","potential_bias":"Numeric Value","algorithm_package_term":"        second_max_score = scores.iloc[1]"}',
    '{"file_name":"/opt/ai-legislation/home/AI/BIAS/INPUT/2024_05_30/05_41_50//Data Bias API.py","line_no":20,"bias_type":"Hard Coded","potential_bias":"String/Array Literal","algorithm_package_term":"        return {\\"error\\": f\\"Error reading the CSV file: {str(e)}\\"}"}',
    '{"file_name":"/opt/ai-legislation/home/AI/BIAS/INPUT/2024_05_30/05_41_50//Data Bias API.py","line_no":65,"bias_type":"HUMAN BIAS","potential_bias":"Age Bias","algorithm_package_term":"Age >                 \\"Max Percentage\\": f\\"{max_percentage:.2f}%\\","}',
    '{"file_name":"/opt/ai-legislation/home/AI/BIAS/INPUT/2024_05_30/05_41_50//Data Bias API.py","line_no":53,"bias_type":"HUMAN BIAS","potential_bias":"Age Bias","algorithm_package_term":"Age >             max_percentage = value_counts.max()"}',
    '{"file_name":"/opt/ai-legislation/home/AI/BIAS/INPUT/2024_05_30/05_41_50//Data Bias API.py","line_no":63,"bias_type":"Hard Coded","potential_bias":"String/Array Literal","algorithm_package_term":"                bias = \\"Potential Bias\\""}',
    '{"file_name":"/opt/ai-legislation/home/AI/BIAS/INPUT/2024_05_30/05_41_50//Data Bias API.py","line_no":13,"bias_type":"Hard Coded","potential_bias":"Numeric Value","algorithm_package_term":"    if len(sorted_scores) >= 2:"}',
    '{"file_name":"/opt/ai-legislation/home/AI/BIAS/INPUT/2024_05_30/05_41_50//Data Bias API.py","line_no":60,"bias_type":"HUMAN BIAS","potential_bias":"Age Bias","algorithm_package_term":"Age >             if max_percentage > 50 and (max_percentage - value_counts.drop(max_value).max()) >= 20:"}',
    '{"file_name":"/opt/ai-legislation/home/AI/BIAS/INPUT/2024_05_30/05_41_50//Data Bias API.py","line_no":14,"bias_type":"Hard Coded","potential_bias":"Numeric Value","algorithm_package_term":"        return sorted_scores.iloc[0] - sorted_scores.iloc[1]"}',
    '{"file_name":"/opt/ai-legislation/home/AI/BIAS/INPUT/2024_05_30/05_41_50//Data Bias API.py","line_no":44,"bias_type":"Hard Coded","potential_bias":"Numeric Value","algorithm_package_term":"    if len(scores) >= 2:"}',
    '{"file_name":"/opt/ai-legislation/home/AI/BIAS/INPUT/2024_05_30/05_41_50//Data Bias API.py","line_no":53,"bias_type":"Hard Coded","potential_bias":"String/Array Literal","algorithm_package_term":"            bias = \\"No Bias\\""}',
    '{"file_name":"/opt/ai-legislation/home/AI/BIAS/INPUT/2024_05_30/05_41_50//Data Bias API.py","line_no":12,"bias_type":"HUMAN BIAS","potential_bias":"Age Bias","algorithm_package_term":"Age > # Define a function to calculate percentage scores for a column"}',
    '{"file_name":"/opt/ai-legislation/home/AI/BIAS/INPUT/2024_05_30/05_41_50//Data Bias API.py","line_no":3,"bias_type":"Hard Coded","potential_bias":"String/Array Literal","algorithm_package_term":"        if column == \\"Name\\":"}',
    '{"file_name":"/opt/ai-legislation/home/AI/BIAS/INPUT/2024_05_30/05_41_50//Data Bias API.py","line_no":51,"bias_type":"HUMAN BIAS","potential_bias":"Age Bias","algorithm_package_term":"Age >         value_counts = calculate_percentage_scores(df[column])"}',
    '{"file_name":"/opt/ai-legislation/home/AI/BIAS/INPUT/2024_05_30/05_41_50//Data Bias API.py","line_no":33,"bias_type":"Hard Coded","potential_bias":"String/Array Literal","algorithm_package_term":"                \\"Bias Analysis\\": bias,"}',
    '{"file_name":"/opt/ai-legislation/home/AI/BIAS/INPUT/2024_05_30/05_41_50//Data Bias API.py","line_no":38,"bias_type":"Hard Coded","potential_bias":"String/Array Literal","algorithm_package_term":"                \\"Max Value\\": max_value,"}',
    '{"file_name":"/opt/ai-legislation/home/AI/BIAS/INPUT/2024_05_30/05_41_50//Data Bias API.py","line_no":47,"bias_type":"Hard Coded","potential_bias":"Numeric Value","algorithm_package_term":"            if max_percentage > 50 and (max_percentage - value_counts.drop(max_value).max()) >= 20:"}',
    '{"file_name":"/opt/ai-legislation/home/AI/BIAS/INPUT/2024_05_30/05_41_50//Data Bias API.py","line_no":36,"bias_type":"Hard Coded","potential_bias":"String/Array Literal","algorithm_package_term":"                \\"Max Percentage\\": f\\"{max_percentage:.2f}%\\","}',
    '{"file_name":"/opt/ai-legislation/home/AI/BIAS/INPUT/2024_05_30/05_41_50//Data Bias API.py","line_no":46,"bias_type":"Hard Coded","potential_bias":"Numeric Value","algorithm_package_term":"        max_score = scores.iloc[0]"}',
    '{"file_name":"/opt/ai-legislation/home/AI/BIAS/INPUT/2024_05_30/05_41_50//Data Bias API.py","line_no":26,"bias_type":"Hard Coded","potential_bias":"String/Array Literal","algorithm_package_term":"        return f\\"{second_max_score:.2f}% / {max_score:.2f}%\\""}',
    '{"file_name":"/opt/ai-legislation/home/AI/BIAS/INPUT/2024_05_30/05_41_50//Data Bias API.py","line_no":63,"bias_type":"Hard Coded","potential_bias":"Numeric Value","algorithm_package_term":"        value_counts = column.value_counts(normalize=True) * 100"}',
    '{"file_name":"/opt/ai-legislation/home/AI/BIAS/INPUT/2024_05_30/05_41_50//Data Bias API.py","line_no":17,"bias_type":"Hard Coded","potential_bias":"Numeric Value","algorithm_package_term":"    return 0"}',
    '{"file_name":"/opt/ai-legislation/home/AI/BIAS/INPUT/2024_05_30/05_41_50//Data Bias API.py","line_no":32,"bias_type":"Hard Coded","potential_bias":"String/Array Literal","algorithm_package_term":"@app.post(\\"/analyze/\\")"}',
  ];
  console.log(data);
  const dataArray = data.map((item) => JSON.parse(item));

  return (
    <div>
      <h2>Data Table</h2>
      <table>
        <thead>
          <tr>
            <th>File Name</th>
            <th>Line No</th>
            <th>Bias Type</th>
            <th>Potential Bias</th>
            <th>Algorithm Package Term</th>
          </tr>
        </thead>
        <tbody>
          {dataArray.map((item, index) => (
            <tr key={index}>
              <td>{item.file_name}</td>
              <td>{item.line_no}</td>
              <td>{item.bias_type}</td>
              <td>{item.potential_bias}</td>
              <td>{item.algorithm_package_term}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
