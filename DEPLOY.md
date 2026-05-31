# Deploy CIPHER ke Google Cloud Run

## Prerequisites
1. Install [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)
2. Punya akun Google Cloud (bikin gratis, ada free tier $300)
3. Sudah install Docker (opsional, bisa pakai Cloud Build)

## Step-by-Step

### 1. Login ke Google Cloud
```bash
gcloud auth login
```

### 2. Buat Project (kalau belum punya)
```bash
gcloud projects create cipher-app --name="CIPHER"
gcloud config set project cipher-app
```

### 3. Billing
- Buka https://console.cloud.google.com/billing
- Hubungkan billing account ke project
- Free tier: $300 credit untuk akun baru

### 4. Edit deploy.sh
Buka file `deploy.sh`, ganti:
- `PROJECT_ID` → Project ID GCP kamu
- `GEMINI_API_KEY` → API key Gemini kamu (opsional, ARIA sudah offline)

### 5. Deploy!
```bash
chmod +x deploy.sh
./deploy.sh
```

Atau manual:
```bash
# Build Docker image
gcloud builds submit --tag gcr.io/PROJECT_ID/cipher

# Deploy ke Cloud Run
gcloud run deploy cipher \
  --image gcr.io/PROJECT_ID/cipher \
  --platform managed \
  --region asia-southeast1 \
  --allow-unauthenticated \
  --set-env-vars "GEMINI_API_KEY=your-key"
```

### 6. Selesai!
URL app kamu: `https://cipher-xxxx.a.run.app`

## Biaya
- Cloud Run free tier: 2 juta request/bulan, 180.000 vCPU detik/bulan
- Untuk project ini, kemungkinan besar GRATIS di free tier

## Troubleshooting
- Kalau build gagal, cek `Dockerfile` dan `.dockerignore`
- Kalau app error, cek logs: `gcloud logs read --service=cipher`
- Kalau Gemini API error, cek environment variable di Cloud Run console
