// Matrix Generator — Randomisasi kasus fallback supaya selalu berbeda

const NAMES = [
  'Andi Pratama', 'Sari Dewi', 'Budi Santoso', 'Rina Wati', 'Dedi Kurniawan',
  'Maya Sari', 'Rizky Aditya', 'Putri Lestari', 'Hendra Wijaya', 'Dian Purnama',
  'Agus Setiawan', 'Lina Marlina', 'Fajar Nugroho', 'Wati Susilawati', 'Yoga Prasetyo',
  'Rudi Hermawan', 'Siti Nurhaliza', 'Eko Prasetyo', 'Dewi Kartika', 'Hadi Sucipto',
]

const COMPANIES = [
  'PT Maju Sejahtera', 'PT Nusantara Digital', 'CV Berkah Teknologi', 'PT Sentosa Corp',
  'PT Garuda Indah', 'PT Mitra Solusi', 'PT Cahaya Baru', 'PT Global Prima',
  'PT Samudera Tech', 'PT Bintang Utama', 'PT Nusa Data', 'PT Prima Jaya',
  'PT Tekno Nusantara', 'CV Digital Solusi', 'PT Aneka Data', 'PT Jaya Mandiri',
]

const DOMAINS = [
  'secure-verify.com', 'account-update.net', 'support-help.org', 'login-confirm.com',
  'bank-secure.co', 'verify-now.net', 'help-desk.org', 'update-account.com',
  'secure-login.co', 'confirm-identity.net', 'check-security.com', 'safe-access.net',
]

const BANK_NAMES = [
  'Bank Sentral Indonesia', 'Bank Nusantara Sejahtera', 'Bank Digital Nusantara',
  'Bank Garuda Indonesia', 'Bank Mitra Rakyat', 'Bank Cahaya Indonesia',
  'Bank Permata Hijau', 'Bank Samudera Indonesia', 'Bank Pertiwi',
]

const BANK_DOMAINS = [
  'bank-sentral.co.id', 'bank-nusantara.co.id', 'bank-digital.co.id',
  'bank-garuda.co.id', 'bank-mitra.co.id', 'bank-cahaya.co.id',
  'bank-permata.co.id', 'bank-samudera.co.id', 'bank-pertiwi.co.id',
]

const CHAT_NAMES = [
  'Manager (HR)', 'Direktur Keuangan', 'Supervisor IT', 'Kepala Divisi',
  'Admin Sistem', 'Asisten Direktur', 'Koordinator Proyek', 'VP Operations',
]

const SUBJECTS_EMAIL = [
  'URGENT: Password Reset Required',
  'Akun Anda Terkunci — Verifikasi Segera',
  'Pemberitahuan Keamanan: Aktivitas Mencurigakan',
  'Update Sistem: Konfirmasi Identitas Diperlukan',
  'Peringatan: Login dari Perangkat Baru',
  'Notifikasi: Pembayaran Tertunda',
  'Invoice #INV-2024 — Mohon Diverifikasi',
  'Undangan Rapat Mendesak — Klik untuk Detail',
]

const WEBSITE_TITLES = [
  'Internet Banking Login', 'Portal Keamanan Akun', 'Verifikasi Identitas',
  'Login Aman', 'Update Profil Anda', 'Konfirmasi Akun',
]

const URGENCY_TEXTS = [
  'Tindakan ini harus dilakukan dalam 24 jam atau akun Anda akan diblokir permanen.',
  'Sistem kami mendeteksi aktivitas mencurigakan. Segera verifikasi untuk mengamankan akun Anda.',
  'Akun Anda akan dinonaktifkan jika tidak diverifikasi dalam 48 jam.',
  'Ada update keamanan penting yang memerlukan konfirmasi segera.',
  'Kami mendeteksi login dari lokasi tidak dikenal. Verifikasi sekarang.',
]

const BODY_EMAILS = [
  (name, company, urgency) => `Kepada Yth. ${name},\n\n${urgency}\n\nKlik tombol di bawah untuk mengamankan akun Anda. Link ini hanya berlaku 24 jam.\n\nJika Anda tidak melakukan permintaan ini, abaikan email ini.\n\nSalam,\nTim Keamanan ${company}`,
  (name, company, urgency) => `Halo ${name},\n\n${company} memerlukan verifikasi ulang data akun Anda sebagai bagian dari prosedur keamanan rutin.\n\n${urgency}\n\nSilakan klik tombol di bawah untuk melanjutkan.`,
  (name, company, urgency) => `Dear ${name},\n\nSistem keamanan kami telah mendeteksi anomali pada akun ${company} Anda. Untuk melindungi data Anda, kami memerlukan konfirmasi identitas segera.\n\n${urgency}\n\nKlik tombol di bawah untuk verifikasi.`,
]

const HERO_BODIES = [
  'Akses rekening Anda dengan aman. Masukkan kredensial untuk melanjutkan.',
  'Silakan masuk untuk mengakses layanan perbankan digital kami.',
  'Verifikasi identitas Anda untuk melanjutkan proses keamanan.',
  'Masuk ke akun Anda untuk mengelola transaksi dan pembayaran.',
]

const CHAT_SCENARIOS = [
  {
    opener: (name) => `Halo, saya ${name}. Ada urgent task dari direksi.`,
    response: 'Baik Pak, ada yang bisa saya bantu?',
    request: (company) => `Ini rahasia ya. Direksi minta segera transfer 50jt ke rekening vendor baru. Ini nomor rekeningnya: ${randomAccount()} a/n ${company}.`,
    ack: 'Baik Pak, saya proses sekarang.',
  },
  {
    opener: (name) => `${name} disini. CEO minta kamu bantu proses pembayaran vendor baru sekarang.`,
    response: 'Siap Pak, vendor apa?',
    request: () => `Transfer 75jt ke rekening ${randomAccount()} a/n PT Sejahtera. Ini prioritas, jangan kasih tahu siapa-siapa.`,
    ack: 'Oke Pak, saya urus sekarang.',
  },
  {
    opener: (name) => `Tolong bantu saya, ${name}. Ada pembayaran mendesak dari kantor pusat.`,
    response: 'Apa yang perlu saya bantu?',
    request: (company) => `Segera kirim 30jt ke ${randomAccount()} a/n ${company}. Hari ini harus selesai, bos sudah approve.`,
    ack: 'Baik, saya proses sekarang.',
  },
]

const SECURITY_TIPS = [
  'Selalu verifikasi domain pengirim email. Periksa ejaan dengan teliti.',
  'Jangan pernah klik link dari email yang meminta reset password tanpa verifikasi.',
  'Selalu ketik URL bank langsung di browser, jangan ikuti link dari email.',
  'Gunakan 2FA di semua akun penting untuk lapisan keamanan tambahan.',
  'Verifikasi permintaan transfer melalui jalur resmi, bukan hanya chat.',
  'Periksa sertifikat SSL website sebelum memasukkan data sensitif.',
  'Jangan pernah bagikan OTP atau kode verifikasi kepada siapapun.',
  'Laporkan email mencurigakan ke tim IT sebelum mengambil tindakan.',
  'Jangan buka attachment dari pengirim yang tidak dikenal.',
  'Selalu scan file dengan antivirus sebelum membuka.',
  'Jangan download software dari sumber tidak resmi.',
  'Periksa ekstensi file — .exe, .scr, .bat adalah file berbahaya.',
  'Bank tidak pernah meminta PIN atau OTP via SMS.',
  'Jangan klik link pendek dari SMS yang tidak dikenal.',
]

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomAccount() {
  return Array.from({ length: 10 }, () => Math.floor(Math.random() * 10)).join('')
}

function randomCaseId() {
  return `CASE-${Math.floor(Math.random() * 900 + 100)}`
}

function randomCodename() {
  const ops = ['Phantom', 'Shadow', 'Ghost', 'Storm', 'Silent', 'Dark', 'Iron', 'Cyber', 'Eagle', 'Viper', 'Hawk', 'Wolf', 'Blade', 'Frost', 'Ember', 'Nova']
  const targets = ['Mail', 'Login', 'Link', 'Call', 'Wire', 'Key', 'Gate', 'Net', 'Web', 'Data', 'Code', 'Trap', 'Bug', 'Worm', 'Vault', 'Shield']
  return `Operation ${randomFrom(ops)} ${randomFrom(targets)}`
}

// ==================== PHISHING EMAIL ====================
function generateEmailCase() {
  const name = randomFrom(NAMES)
  const company = randomFrom(COMPANIES)
  const domain = randomFrom(DOMAINS)
  const subject = randomFrom(SUBJECTS_EMAIL)
  const urgency = randomFrom(URGENCY_TEXTS)
  const bodyFn = randomFrom(BODY_EMAILS)
  const tip = randomFrom(SECURITY_TIPS)

  const fromName = randomFrom(['IT Support', 'Tim Keamanan', 'Security Team', 'Admin Sistem', 'Help Desk'])
  const ctaText = randomFrom(['Reset Password', 'Verifikasi Sekarang', 'Amankan Akun', 'Konfirmasi Identitas'])
  const companySlug = company.toLowerCase().replace(/\s+/g, '-').replace(/pt\s*/g, '').replace(/cv\s*/g, '')
  const fromEmail = `support@${companySlug}-${domain.split('-')[0]}.com`
  const ctaUrl = `https://${companySlug}-verify.com/action?id=${Math.random().toString(36).slice(2, 8)}`

  return {
    case_id: randomCaseId(),
    codename: randomCodename(),
    threat_level: 'ROUTINE',
    brief: `${name} dari ${company} melaporkan email mencurigakan yang meminta verifikasi akun.`,
    evidence: {
      type: 'email',
      from_name: fromName,
      from_email: fromEmail,
      subject: subject,
      body: bodyFn(name, company, urgency),
      cta_text: ctaText,
      cta_url: ctaUrl,
      timestamp: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')} ${String(Math.floor(Math.random() * 12) + 8).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
    },
    clues: [
      { id: 'clue_1', element: 'from_email', description: 'Domain bukan domain resmi perusahaan' },
      { id: 'clue_2', element: 'cta_url', description: 'URL mengarah ke domain mencurigakan' },
      { id: 'clue_3', element: 'body', description: 'Tekanan urgensi dan ancaman akun' },
    ],
    answer: 'Phishing Attack',
    choices: ['Phishing Attack', 'Malware Distribution', 'Social Engineering', 'Legitimate Email'],
    debrief: {
      verdict: 'Phishing Attack Confirmed',
      summary: `Email ini menggunakan domain palsu yang mirip domain asli ${company}. URL mengarah ke halaman login palsu untuk mencuri kredensial.`,
      key_findings: ['Domain spoofing', 'Fake urgency pressure', 'Credential harvesting URL'],
      tip: tip,
    },
    xp_reward: 100,
  }
}

// ==================== FAKE WEBSITE ====================
function generateWebsiteCase() {
  const bank = randomFrom(BANK_NAMES)
  const domain = randomFrom(BANK_DOMAINS)
  const fakeDomain = domain.replace('.co.id', '-secure.co.id')
  const heroBody = randomFrom(HERO_BODIES)
  const tip = randomFrom(SECURITY_TIPS)

  const titles = [`${bank} - Internet Banking`, `${bank} - Login Aman`, `${bank} - Portal Nasabah`]
  const navItems = [
    ['Beranda', 'Transfer', 'Pembayaran', 'Bantuan'],
    ['Home', 'Rekening', 'Pembayaran', 'Kontak'],
    ['Layanan', 'Transfer', 'Tagihan', 'Dukungan'],
  ]
  const submitTexts = ['Masuk Sekarang', 'Login', 'Verifikasi', 'Lanjutkan']

  return {
    case_id: randomCaseId(),
    codename: randomCodename(),
    threat_level: 'ELEVATED',
    brief: `Ditemukan halaman login bank yang menyalin tampilan situs resmi ${bank} dengan URL berbeda.`,
    evidence: {
      type: 'website',
      url: `https://${fakeDomain}/secure-login`,
      title: randomFrom(titles),
      navbar_items: randomFrom(navItems),
      hero_title: `Login ke Internet Banking ${bank}`,
      hero_body: heroBody,
      form_fields: ['Email', 'Password'],
      submit_text: randomFrom(submitTexts),
      footer: `© 2024 ${bank}. Semua hak dilindungi. | Syarat & Ketentuan | Kebijakan Privasi`,
    },
    clues: [
      { id: 'clue_1', element: 'url', description: 'URL bukan domain resmi bank' },
      { id: 'clue_2', element: 'footer', description: 'Tidak ada link ke OJK atau LPS' },
      { id: 'clue_3', element: 'form_fields', description: 'Form sederhana tanpa 2FA' },
    ],
    answer: 'Phishing Attack',
    choices: ['Phishing Attack', 'Malware Distribution', 'Social Engineering', 'Legitimate Website'],
    debrief: {
      verdict: 'Fake Banking Website Detected',
      summary: `Situs ini menyalin tampilan ${bank} tetapi menggunakan domain berbeda. Tujuannya mencuri kredensial login nasabah.`,
      key_findings: ['Typosquatting domain', 'No 2FA prompt', 'Missing regulatory links'],
      tip: tip,
    },
    xp_reward: 150,
  }
}

// ==================== SOCIAL ENGINEERING CHAT ====================
function generateChatCase() {
  const scenario = randomFrom(CHAT_SCENARIOS)
  const chatName = randomFrom(CHAT_NAMES)
  const company = randomFrom(COMPANIES)
  const tip = randomFrom(SECURITY_TIPS)

  return {
    case_id: randomCaseId(),
    codename: randomCodename(),
    threat_level: 'CRITICAL',
    brief: `Percakapan chat antara '${chatName}' dan karyawan baru yang meminta transfer dana darurat.`,
    evidence: {
      type: 'chat',
      messages: [
        { sender: chatName, text: scenario.opener(chatName), time: `${String(Math.floor(Math.random() * 6) + 9).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}` },
        { sender: 'Karyawan Baru', text: scenario.response, time: `${String(Math.floor(Math.random() * 6) + 9).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}` },
        { sender: chatName, text: scenario.request(company), time: `${String(Math.floor(Math.random() * 6) + 9).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}` },
        { sender: 'Karyawan Baru', text: scenario.ack, time: `${String(Math.floor(Math.random() * 6) + 9).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}` },
      ],
    },
    clues: [
      { id: 'clue_1', element: 'msg_0', description: 'Tidak ada verifikasi identitas' },
      { id: 'clue_2', element: 'msg_2', description: 'Tekanan urgensi dan kerahasiaan' },
      { id: 'clue_3', element: 'msg_2', description: 'Permintaan transfer tidak biasa' },
    ],
    answer: 'Social Engineering',
    choices: ['Phishing Attack', 'Malware Distribution', 'Social Engineering', 'Legitimate Request'],
    debrief: {
      verdict: 'Business Email Compromise (BEC)',
      summary: `Penyamaran sebagai ${chatName} melalui chat untuk memanipulasi karyawan baru melakukan transfer dana ke rekening penipu.`,
      key_findings: ['Authority impersonation', 'Urgency and secrecy pressure', 'Unusual transfer request'],
      tip: tip,
    },
    xp_reward: 200,
  }
}

// ==================== MALWARE EMAIL ====================
function generateMalwareCase() {
  const name = randomFrom(NAMES)
  const company = randomFrom(COMPANIES)
  const tip = randomFrom(SECURITY_TIPS)

  const malwareScenarios = [
    {
      from_name: randomFrom(['HR Department', 'Divisi Keuangan', 'Accounting Team']),
      subject: randomFrom([
        'Gaji Bulanan November — Lihat Lampiran',
        'Laporan Keuangan Q4 — Mohon Review',
        'Slip Gaji Terlampir — Cek Sekarang',
        'Invoice Pembayaran Vendor — Action Required',
      ]),
      body: (n, c) => `Halo ${n},\n\nTerlampir adalah dokumen yang kamu minta. Silakan buka dan review sebelum akhir hari ini.\n\nFile sudah di-compress untuk mempercepat download. Ekstrak dan buka file .exe di dalamnya.\n\nTerima kasih.\nTim ${c}`,
      attachment: randomFrom(['Slip_Gaji_Nov2024.zip', 'Laporan_Keuangan_Q4.rar', 'Invoice_Vendor_2024.7z', 'Data_Karyawan_Nov.zip']),
      cta_text: 'Download Lampiran',
    },
    {
      from_name: randomFrom(['IT Support', 'System Administrator', 'Tim Teknis']),
      subject: randomFrom([
        'URGENT: Security Patch — Install Now',
        'Update Antivirus Wajib — Download di Sini',
        'System Update Required — Critical',
        'Windows Security Fix — Immediate Action',
      ]),
      body: (n, c) => `Dear ${n},\n\nTerdapat patch keamanan kritis yang harus diinstall segera. Download file updater di bawah ini dan jalankan sebagai Administrator.\n\nGagal menginstall dalam 24 jam akan mengakibatkan akun Anda dikunci dari jaringan ${c}.\n\nIT Security Team`,
      attachment: randomFrom(['SecurityPatch_2024.exe', 'AntivirusUpdate.scr', 'WindowsFix.bat', 'SystemUpdater.msi']),
      cta_text: 'Download Patch',
    },
    {
      from_name: randomFrom(['Client Services', 'Partner Management', 'Vendor Relations']),
      subject: randomFrom([
        'Kontrak Kerjasama — Review & Sign',
        'Dokumen Tender — Mohon Dikaji',
        'Proposal Proyek Terlampir',
        'Perjanjian Vendor — Tanda Tangan Digital',
      ]),
      body: (n, c) => `Kepada ${n},\n\nTerlampir dokumen kerjasama yang sudah disetujui manajemen ${c}. Silakan review dan berikan feedback.\n\nDokumen dalam format compressed. Ekstrak dan buka file presentation di dalamnya.\n\nHormat kami,\nPartner Team`,
      attachment: randomFrom(['Kontrak_Kerjasama_2024.zip', 'Dokumen_Tender_Final.rar', 'Proposal_Proyek.7z', 'Perjanjian_Vendor.zip']),
      cta_text: 'Download Dokumen',
    },
  ]

  const scenario = randomFrom(malwareScenarios)

  return {
    case_id: randomCaseId(),
    codename: randomCodename(),
    threat_level: 'ELEVATED',
    brief: `${name} menerima email dengan lampiran mencurigakan yang meminta download dan install file.`,
    evidence: {
      type: 'email',
      from_name: scenario.from_name,
      from_email: `${scenario.from_name.toLowerCase().replace(/\s+/g, '.')}@${company.toLowerCase().replace(/pt\s*/g, '').replace(/cv\s*/g, '').replace(/\s+/g, '-')}.com`,
      subject: scenario.subject,
      body: scenario.body(name, company),
      cta_text: scenario.cta_text,
      cta_url: `https://files-server.com/download/${Math.random().toString(36).slice(2, 10)}`,
      timestamp: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')} ${String(Math.floor(Math.random() * 12) + 8).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      attachment: scenario.attachment,
    },
    clues: [
      { id: 'clue_1', element: 'body', description: 'Meminta download dan jalankan file' },
      { id: 'clue_2', element: 'cta_url', description: 'Link download dari domain asing' },
      { id: 'clue_3', element: 'subject', description: 'Tekanan urgensi untuk install segera' },
    ],
    answer: 'Malware Distribution',
    choices: ['Phishing Attack', 'Malware Distribution', 'Social Engineering', 'Legitimate Email'],
    debrief: {
      verdict: 'Malware Distribution Detected',
      summary: `Email ini mengandung lampiran berbahaya (${scenario.attachment}) yang akan menginfeksi komputer saat dibuka. File executable tersembunyi di dalam archive.`,
      key_findings: ['Suspicious attachment format', 'Executable file in archive', 'Urgency to install'],
      tip: tip,
    },
    xp_reward: 150,
  }
}

// ==================== SMISHING (SMS PHISHING) ====================
function generateSmishingCase() {
  const name = randomFrom(NAMES)
  const tip = randomFrom(SECURITY_TIPS)

  const smishingScenarios = [
    {
      messages: [
        { sender: 'BANK', text: `[BANK ALERT] Akun Anda akan diblokir. Verifikasi sekarang: https://bit.ly/bank-verify-${Math.random().toString(36).slice(2, 6)}`, time: '08:15' },
        { sender: name.split(' ')[0], text: 'Pak, ini benar dari bank? Saya dapat SMS ini.', time: '08:16' },
        { sender: 'Teman', text: 'Jangan diklik! Itu phishing. Bank tidak pernah kirim link via SMS.', time: '08:17' },
        { sender: name.split(' ')[0], text: 'Tapi nomornya mirip nomor bank resmi...', time: '08:18' },
      ],
      brief: `${name} menerima SMS yang mengaku dari bank dan meminta verifikasi melalui link pendek.`,
      clues: [
        { id: 'clue_1', element: 'msg_0', description: 'Link pendek (bit.ly) mencurigakan' },
        { id: 'clue_2', element: 'msg_0', description: 'Ancaman pemblokiran akun' },
        { id: 'clue_3', element: 'msg_2', description: 'Teman sudah mengingatkan phishing' },
      ],
      answer: 'Social Engineering',
    },
    {
      messages: [
        { sender: '+62812XXXX', text: 'Selamat! Anda menang undian Rp 50 juta. Klaim hadiah di: https://undian-resmi.com/klaim', time: '10:30' },
        { sender: name.split(' ')[0], text: 'Wah, saya menang! Mau klaim ah.', time: '10:31' },
        { sender: 'Keluarga', text: 'Hati-hati, itu penipuan. Jangan pernah klaim hadiah dari SMS.', time: '10:32' },
        { sender: name.split(' ')[0], text: 'Tapi tulisannya resmi banget...', time: '10:33' },
      ],
      brief: `${name} menerima SMS pemenang undian yang meminta klaim hadiah melalui link.`,
      clues: [
        { id: 'clue_1', element: 'msg_0', description: 'Undian yang tidak pernah diikuti' },
        { id: 'clue_2', element: 'msg_0', description: 'Link ke domain tidak dikenal' },
        { id: 'clue_3', element: 'msg_2', description: 'Keluarga mengingatkan penipuan' },
      ],
      answer: 'Social Engineering',
    },
    {
      messages: [
        { sender: 'GOJEK', text: 'Paket Anda gagal dikirim. Update alamat di: https://gojek-delivery.com/update', time: '14:20' },
        { sender: name.split(' ')[0], text: 'Saya tidak pesan apa-apa... tapi penasaran.', time: '14:21' },
        { sender: 'Teman', text: 'Itu smishing! Jangan diklik. Cek langsung di aplikasi resmi.', time: '14:22' },
        { sender: name.split(' ')[0], text: 'Oh iya ya, saya memang tidak pesan.', time: '14:23' },
      ],
      brief: `${name} menerima SMS palsu dari 'GOJEK' yang mengaku ada paket gagal dikirim.`,
      clues: [
        { id: 'clue_1', element: 'msg_0', description: 'Tidak pernah pesan barang' },
        { id: 'clue_2', element: 'msg_0', description: 'URL bukan domain resmi Gojek' },
        { id: 'clue_3', element: 'msg_2', description: 'Teman sarankan cek di aplikasi' },
      ],
      answer: 'Social Engineering',
    },
  ]

  const scenario = randomFrom(smishingScenarios)

  return {
    case_id: randomCaseId(),
    codename: randomCodename(),
    threat_level: 'CRITICAL',
    brief: scenario.brief,
    evidence: {
      type: 'chat',
      messages: scenario.messages,
    },
    clues: scenario.clues,
    answer: scenario.answer,
    choices: ['Phishing Attack', 'Malware Distribution', 'Social Engineering', 'Legitimate SMS'],
    debrief: {
      verdict: 'SMS Phishing (Smishing) Detected',
      summary: 'SMS ini menggunakan link pendek dan ancaman untuk menipu korban. Pengirim palsu menggunakan nama layanan populer untuk menambah legitimasi.',
      key_findings: ['Shortened URL', 'Threat/urgency tactics', 'Impersonation of known brand'],
      tip: tip,
    },
    xp_reward: 200,
  }
}

// ==================== RANSOMWARE WEBSITE ====================
function generateRansomwareCase() {
  const tip = randomFrom(SECURITY_TIPS)

  const ransomwareScenarios = [
    {
      url: 'https://free-antivirus-download.com/premium',
      title: 'AntiVirus Premium — Download Gratis',
      navbar_items: ['Home', 'Download', 'Reviews', 'Contact'],
      hero_title: 'AntiVirus Premium 2024 — GRATIS!',
      hero_body: 'Download antivirus terbaik 2024. Lindungi PC Anda dari malware, ransomware, dan virus. Proses download otomatis setelah klik tombol.',
      form_fields: [],
      submit_text: 'Download Sekarang (2.5 MB)',
      footer: '© 2024 AntiVirus Solutions. All rights reserved.',
      brief: 'Ditemukan website yang menawarkan download antivirus gratis, tetapi sebenarnya mengandung ransomware.',
    },
    {
      url: 'https://crack-software.net/photoshop-2024',
      title: 'Adobe Photoshop 2024 — Full Version Free',
      navbar_items: ['Home', 'Software', 'Tutorials', 'FAQ'],
      hero_title: 'Photoshop 2024 Full Version — TANPA BAYAR!',
      hero_body: 'Download Adobe Photoshop 2024 full version dengan crack. Tidak perlu langganan. Install dan langsung pakai.',
      form_fields: [],
      submit_text: 'Download + Crack',
      footer: '© 2024 Crack Software Hub. All rights reserved.',
      brief: 'Website menawarkan software bajakan yang sudah dimodifikasi dengan ransomware.',
    },
    {
      url: 'https://windows-optimizer-pro.com/download',
      title: 'Windows Optimizer Pro — Speed Up Your PC',
      navbar_items: ['Home', 'Features', 'Download', 'Support'],
      hero_title: 'PC Lambat? Optimizer Pro Solusinya!',
      hero_body: 'Percepat PC Anda hingga 300%. Bersihkan registry, hapus junk file, dan optimalkan performa. Download gratis sekarang.',
      form_fields: [],
      submit_text: 'Download Optimizer',
      footer: '© 2024 Optimizer Pro. All rights reserved.',
      brief: 'Website optimizer palsu yang mendistribusikan ransomware melalui download.',
    },
  ]

  const scenario = randomFrom(ransomwareScenarios)

  return {
    case_id: randomCaseId(),
    codename: randomCodename(),
    threat_level: 'CLASSIFIED',
    brief: scenario.brief,
    evidence: {
      type: 'website',
      url: scenario.url,
      title: scenario.title,
      navbar_items: scenario.navbar_items,
      hero_title: scenario.hero_title,
      hero_body: scenario.hero_body,
      form_fields: scenario.form_fields,
      submit_text: scenario.submit_text,
      footer: scenario.footer,
    },
    clues: [
      { id: 'clue_1', element: 'url', description: 'Domain bukan situs resmi software' },
      { id: 'clue_2', element: 'hero_body', description: 'Download otomatis tanpa verifikasi' },
      { id: 'clue_3', element: 'submit_text', description: 'File size tidak wajar untuk software' },
    ],
    answer: 'Malware Distribution',
    choices: ['Phishing Attack', 'Malware Distribution', 'Social Engineering', 'Legitimate Website'],
    debrief: {
      verdict: 'Ransomware Distribution Site',
      summary: 'Website ini mendistribusikan ransomware melalui download software gratis/crack. File yang diunduh akan mengenkripsi semua data di komputer korban.',
      key_findings: ['Fake software site', 'Auto-download behavior', 'Too good to be true offer'],
      tip: tip,
    },
    xp_reward: 300,
  }
}

// ==================== MAIN EXPORT ====================
export function generateRandomCases() {
  const allGenerators = [
    generateEmailCase,
    generateWebsiteCase,
    generateChatCase,
    generateMalwareCase,
    generateSmishingCase,
    generateRansomwareCase,
  ]

  // Shuffle and pick 5 random cases
  const shuffled = allGenerators.sort(() => Math.random() - 0.5)
  return shuffled.slice(0, 5).map((gen) => gen())
}
