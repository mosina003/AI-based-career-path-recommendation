import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score
import joblib

# Load the techquiz CSV file
df = pd.read_csv('synthetic_quiz_data.csv')

# Drop rows with missing values (if any)
df = df.dropna()

# Separate features and target
X = df.drop('Career', axis=1)
y = df['Career']

# Encode target labels
le = LabelEncoder()
y_encoded = le.fit_transform(y)

# Split data for training and testing
X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, test_size=0.2, random_state=42)

# Train Random Forest model
model = RandomForestClassifier(random_state=42)
model.fit(X_train, y_train)

# Evaluate model
y_pred = model.predict(X_test)
print("Accuracy:", accuracy_score(y_test, y_pred))
print(df.head())
print(df['Career'].value_counts())

# Save model and label encoder for later use
joblib.dump(model, 'techquiz_model.pkl')
joblib.dump(le, 'techquiz_label_encoder.pkl')
print("TechQuiz model and label encoder saved.")