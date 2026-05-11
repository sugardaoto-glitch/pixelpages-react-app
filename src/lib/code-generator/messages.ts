export const MESSAGES = {
  pageTitle: "Generator Kode AI",
  pageSubtitle:
    "Jelaskan halaman atau komponen React yang Anda inginkan dan biarkan AI menulis kodenya untuk Anda.",
  backToHome: "← Kembali ke PixelPages",

  promptLabel: "Deskripsi proyek",
  promptPlaceholder:
    "Contoh: Buatkan halaman kalkulator gaya Apple dengan mode gelap.",
  promptHelp:
    "Tuliskan ide Anda sedetail mungkin. Sebutkan warna, layout, dan fitur yang diinginkan.",

  updatePromptLabel: "Apa yang ingin diubah?",
  updatePromptPlaceholder:
    "Contoh: Tambahkan tombol simpan riwayat perhitungan di pojok kanan atas.",

  generateButton: "Hasilkan Kode",
  updateButton: "Perbarui Kode",
  generatingButton: "Sedang menghasilkan...",
  updatingButton: "Sedang memperbarui...",
  optimizePromptButton: "Optimalkan Prompt",
  optimizingPromptButton: "Mengoptimalkan...",
  clearButton: "Bersihkan",
  copyButton: "Salin Kode",
  copySuccess: "Kode berhasil disalin",
  copyFailed: "Gagal menyalin kode",

  shadcnLabel: "Gunakan komponen shadcn/ui",
  shadcnHint:
    "Aktifkan agar AI memakai pustaka komponen shadcn (Button, Input, dsb.).",

  resultEmpty:
    "Belum ada kode yang dihasilkan. Isi deskripsi di atas lalu klik \"Hasilkan Kode\".",
  resultEmptyAfterReset:
    "Pratinjau dibersihkan. Hasilkan kode baru untuk melihat pratinjau di sini.",
  resultErrorTitle: "Terjadi kesalahan",
  resultUpdating: "Sedang memperbarui kode...",
  resultGenerating: "Sedang menulis kode...",

  tabCode: "Kode",
  tabPreview: "Pratinjau",

  emptyPromptError: "Deskripsi tidak boleh kosong.",
  generationFailed: "Gagal menghasilkan kode.",
  generationSuccess: "Kode berhasil dihasilkan.",
  updateSuccess: "Kode berhasil diperbarui.",
  optimizeSuccess: "Prompt berhasil dioptimalkan.",
  optimizeFailed: "Gagal mengoptimalkan prompt.",

  examplePrompts: "Contoh prompt",
  examples: [
    "Buat halaman landing untuk aplikasi pengiriman makanan dengan tombol pesan sekarang dan daftar menu.",
    "Buat formulir pendaftaran dengan validasi email, password, dan konfirmasi password.",
    "Buat dashboard penjualan sederhana dengan kartu statistik dan grafik garis.",
    "Buat halaman profil pengguna dengan foto, bio, dan daftar postingan.",
  ],
} as const;
