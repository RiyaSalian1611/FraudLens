import pandas as pd
import matplotlib.pyplot as plt

# Load CSV file into a pandas DataFrame
df = pd.read_csv("../data/bs140513_032310.csv")

# Create separate DataFrames for legitimate and fraudulent transactions
legit_df = df[df['fraud'] == 0]
fraud_df = df[df['fraud'] == 1]

# Plot the two DataFrames as scatter plots
plt.scatter(legit_df['amount'], legit_df['merchant'], label='Legitimate', alpha=0.5)
plt.scatter(fraud_df['amount'], fraud_df['merchant'], label='Fraudulent', alpha=0.5)

# Add axis labels and a title
plt.xlabel('Amount')
plt.ylabel('Merchant')
plt.title('Bank Transactions')

# Add a legend and display the plot
plt.legend()
plt.show()

# Plot the two DataFrames as scatter plots
plt.scatter(legit_df['amount'], legit_df['category'], label='Legitimate', alpha=0.5)
plt.scatter(fraud_df['amount'], fraud_df['category'], label='Fraudulent', alpha=0.5)

# Add axis labels and a title
plt.xlabel('Amount')
plt.ylabel('Category')
plt.title('Bank Transactions')

# Add a legend and display the plot
plt.legend()
plt.show()
