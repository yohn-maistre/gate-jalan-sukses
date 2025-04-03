
# Jalan Sukses (Path to Success)

## Project Info

Jalan Sukses adalah aplikasi mentorship yang menggunakan AI untuk membantu pemuda Indonesia membuat **peta jalan** berdasarkan obyektif yang ditentukan. Didasari Google Gemini Pro 2.5.

### Fitur Utama
- Pembuatan peta jalan personal berdasarkan tujuan pengguna
- Pertanyaan lanjutan yang dinamis untuk menggali tujuan lebih dalam
- Sumber daya yang disesuaikan untuk setiap langkah
- Pelacakan kemajuan dan pesan motivasi
- Chat dengan mentor AI untuk mendapatkan bantuan

### Teknologi
- Vite + React + TypeScript
- Tailwind CSS + shadcn/ui
- Google Gemini Pro 2.5
- React Router
- React Query

## Development

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## Implementasi LLM

Project menggunakan Google Gemini Pro 2.5 untuk:
1. Generasi peta jalan berdasarkan input pengguna
2. Chat interaktif dengan konteks peta jalan
3. Pesan motivasi dinamis

Implementasi dibuat dengan struktur modular:
- ModelConfigContext - Konfigurasi model
- GeminiService - Komunikasi API
- RoadmapGenerator - Pembuatan peta jalan
- llm.ts - Interface utama

Lihat file PROJECT_CONTEXT.md untuk dokumentasi lengkap tentang implementasi LLM.
