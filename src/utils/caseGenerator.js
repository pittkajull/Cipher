// Matrix Generator — Randomisasi kasus fallback supaya selalu berbeda

const NAMES = [
  'Andi Pratama', 'Sari Dewi', 'Budi Santoso', 'Rina Wati', 'Dedi Kurniawan',
  'Maya Sari', 'Rizky Aditya', 'Putri Lestari', 'Hendra Wijaya', 'Dian Purnama',
  'Agus Setiawan', 'Lina Marlina', 'Fajar Nugroho', 'Wati Susilawati', 'Yoga Prasetyo',
]

const COMPANIES = [
  'PT Maju Sejahtera', 'PT Nusantara Digital', 'CV Berkah Teknologi', 'PT Sentosa Corp',
  'PT Garuda Indah', 'PT Mitra Solusi', 'PT Cahaya Baru', 'PT Global Prima',
  'PT Samudera Tech', 'PT Bintang Utama', 'PT Nusa Data', 'PT Prima Jaya',
]

const DOMAINS = [
  'secure-verify.com', 'account-update.net', 'support-help.org', 'login-confirm.com',
  'bank-secure.co', 'verify-now.net', 'help-desk.org', 'update-account.com',
  'secure-login.co', 'confirm-identity.net',
]

const BANK_NAMES = [
  'Bank Sentral Indonesia', 'Bank Nusantara Sejahtera', 'Bank Digital Nusantara',
  'Bank Garuda Indonesia', 'Bank Mitra Rakyat', 'Bank Cahaya Indonesia',
]

const BANK_DOMAINS = [
  'bank-sentral.co.id', 'bank-nusantara.co.id', 'bank-digital.co.id',
  'bank-garuda.co.id', 'bank-mitra.co.id', 'bank-cahaya.co.id',
]

const CHAT_NAMES = [
  'Manager (HR)', 'Direktur Keuangan', 'Supervisor IT', 'Kepala Divisi',
  'Admin Sistem', 'Asisten Direktur', 'Koordinator Proyek',
]

const SUBJECTS_EMAIL = [
  'URGENT: Password Reset Required',
  'Akun Anda Terkunci — Verifikasi Segera',
  'Pemberitahuan Keamanan: Aktivitas Mencurigakan',
  'Update Sistem: Konfirmasi Identitas Diperlukan',
  'Peringatan: Login dari Perangkat Baru',
  'Notifikasi: Pembayaran Tertunda',
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
  const ops = ['Phantom', 'Shadow', 'Ghost', 'Storm', 'Silent', 'Dark', 'Iron', 'Cyber', 'Eagle', 'Viper', 'Hawk', 'Wolf']
  const targets = ['Mail', 'Login', 'Link', 'Call', 'Wire', 'Key', 'Gate', 'Net', 'Web', 'Data', 'Code', 'Trap']
  return `Operation ${randomFrom(ops)} ${randomFrom(targets)}`
}

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

export function generateRandomCases() {
  return [
    generateEmailCase(),
    generateWebsiteCase(),
    generateChatCase(),
  ]
}
