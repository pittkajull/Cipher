#!/bin/bash
# CIPHER - Google Cloud Run Deployment Script

# ===== KONFIGURASI =====
PROJECT_ID="your-gcp-project-id"  # Ganti dengan Project ID GCP kamu
SERVICE_NAME="cipher"
REGION="asia-southeast1"  # Jakarta
GEMINI_API_KEY="your-gemini-api-key"  # Ganti dengan API key

# ===== STEP 1: Login & Set Project =====
echo "🔐 Login ke Google Cloud..."
gcloud auth login
gcloud config set project $PROJECT_ID

# ===== STEP 2: Enable APIs =====
echo "🔌 Enable required APIs..."
gcloud services enable run.googleapis.com
gcloud services enable artifactregistry.googleapis.com

# ===== STEP 3: Build & Push Docker Image =====echo "🐳 Building Docker image..."
gcloud builds submit --tag gcr.io/$PROJECT_ID/$SERVICE_NAME

# ===== STEP 4: Deploy to Cloud Run =====
echo "🚀 Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --image gcr.io/$PROJECT_ID/$SERVICE_NAME \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --set-env-vars "GEMINI_API_KEY=$GEMINI_API_KEY" \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10

echo "✅ Deploy selesai!"
echo "🌐 URL: https://$SERVICE_NAME-$(echo $REGION | tr '-' '').a.run.app"
