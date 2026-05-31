import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'

const THREATS = [
  {
    id: 'phishing',
    name: 'Phishing',
    icon: '🎣',
    color: '#00b4d8',
    summary: 'Email atau website palsu yang meniru layanan resmi untuk mencuri data pribadi.',
    how: 'Penipu mengirim email atau membuat website yang terlihat seperti bank, e-commerce, atau layanan resmi. Mereka meminta Anda memasukkan username, password, atau data kartu kredit.',
    redFlags: ['Domain pengirim aneh (bukan domain resmi)', 'Ada kesalahan ejaan atau grammar', 'Meminta data sensitif via link', 'Tekanan waktu atau ancaman'],
    example: 'Email dari "Bank BCA" yang meminta reset password, padahal domainnya bank-bca-secure.com',
  },
  {
    id: 'malware',
    name: 'Malware',
    icon: '🦠',
    color: '#ff3d3d',
    summary: 'Program berbahaya yang menginfeksi komputer melalui file atau download.',
    how: 'Malware tersebar melalui email attachment, download software bajakan, atau website yang sudah diinfeksi. Begitu dijalankan, ia bisa mencuri data, mengenkripsi file, atau mengambil alih komputer.',
    redFlags: ['File .exe, .scr, .bat di dalam archive (.zip, .rar)', 'Download software dari sumber tidak resmi', 'Meminta izin Administrator saat install', 'Ukuran file tidak wajar'],
    example: 'Email lampiran "Slip_Gaji_Nov2024.zip" yang berisi file .exe di dalamnya',
  },
  {
    id: 'social',
    name: 'Social Engineering',
    icon: '🎭',
    color: '#f4a522',
    summary: 'Manipulasi psikologis untuk menipu korban melakukan tindakan tertentu.',
    how: 'Penipu menyamar sebagai atasan, teman, atau instansi resmi. Mereka menggunakan tekanan waktu, urgensi, atau ancaman untuk membuat korban bertindak tanpa berpikir.',
    redFlags: ['Permintaan mendesak dan rahasia', 'Tidak bisa diverifikasi identitasnya', 'Meminta transfer atau data pribadi', 'Ancaman jika tidak segera bertindak'],
    example: 'Chat dari "Manager HR" yang minta transfer 50jt ke rekening baru, hari ini harus selesai',
  },
  {
    id: 'ransomware',
    name: 'Ransomware',
    icon: '🔒',
    color: '#ff3d3d',
    summary: 'Program yang mengenkripsi semua file Anda dan meminta tebusan untuk membukanya.',
    how: 'Ransomware masuk melalui download software bajakan, email attachment, atau website yang sudah diinfeksi. Setelah aktif, semua file dikunci dan penipu meminta pembayaran dalam cryptocurrency.',
    redFlags: ['Download software gratis/crack', 'Website yang menawarkan "too good to be true"', 'File langsung terenkripsi setelah download', 'Pesan tebusan muncul di layar'],
    example: 'Download Photoshop gratis dari website crack, ternyata semua file di komputer terkunci',
  },
  {
    id: 'smishing',
    name: 'Smishing (SMS Phishing)',
    icon: '📱',
    color: '#00b4d8',
    summary: 'Penipuan melalui SMS yang mengaku dari layanan resmi.',
    how: 'Penipu mengirim SMS yang mengaku dari bank, e-commerce, atau layanan populer. SMS berisi link pendek yang mengarah ke website palsu untuk mencuri data.',
    redFlags: ['Link pendek (bit.ly, t.co, dll)', 'Ancaman pemblokiran akun', 'Undian yang tidak pernah diikuti', 'Pesan dari nomor tidak dikenal'],
    example: 'SMS dari "BANK" yang bilang akun akan diblokir, disuruh klik link bit.ly',
  },
  {
    id: 'vishing',
    name: 'Vishing (Voice Phishing)',
    icon: '📞',
    color: '#f4a522',
    summary: 'Penipuan melalui telepon yang mengaku dari instansi resmi.',
    how: 'Penipu menelepon sambil menyamar sebagai bank, polisi, atau layanan lain. Mereka menciptakan situasi panik dan meminta data pribadi atau transfer uang.',
    redFlags: ['Tidak bisa diverifikasi identitasnya', 'Menciptakan situasi panik', 'Meminta data pribadi via telepon', 'Meminta transfer ke rekening pribadi'],
    example: 'Telepon dari "Bank" yang bilang ada transaksi mencurigakan, minta PIN untuk blokir',
  },
  {
    id: 'credential',
    name: 'Credential Stuffing',
    icon: '🔑',
    color: '#00b4d8',
    summary: 'Website palsu yang meniru platform populer untuk mencuri login.',
    how: 'Penipu membuat website yang persis mirip Tokopedia, Shopee, Instagram, dll. Ketika korban login, username dan password dicoba di ratusan website lain.',
    redFlags: ['URL bukan domain resmi', 'Tidak ada opsi login sosial media', 'Footer tidak lengkap', 'Tidak ada 2FA atau captcha'],
    example: 'Website tokopedia-login.com yang terlihat persis seperti aslinya, tapi URL-nya beda',
  },
  {
    id: 'cryptojacking',
    name: 'Cryptojacking',
    icon: '⛏️',
    color: '#f4a522',
    summary: 'Website yang menggunakan komputer Anda untuk menambang cryptocurrency.',
    how: 'Website streaming gratis, game online, atau converter file menyembunyikan script mining. CPU Anda bekerja keras menambang crypto untuk penipu, tanpa Anda sadari.',
    redFlags: ['Website "gratis" yang terlalu bagus', 'CPU usage tinggi saat buka website', 'Kipas komputer berisik', 'Komputer jadi lambat'],
    example: 'Buka website nonton film gratis, tiba-tiba komputer jadi lambat dan kipas berisik',
  },
  {
    id: 'quishing',
    name: 'Quishing (QR Phishing)',
    icon: '📲',
    color: '#00b4d8',
    summary: 'Email dengan QR code yang mengarah ke website phishing.',
    how: 'Penipu mengirim email dengan QR code untuk registrasi, verifikasi, atau event. QR code sulit diverifikasi karena URL-nya tidak terlihat sebelum di-scan.',
    redFlags: ['QR code dari email tidak dikenal', 'Tekanan deadline untuk scan', 'QR mengarah ke website yang meminta data', 'Tidak bisa preview URL sebelum scan'],
    example: 'Email dari "HR" yang minta scan QR untuk registrasi ulang karyawan',
  },
  {
    id: 'invoice',
    name: 'Invoice Fraud',
    icon: '📄',
    color: '#f4a522',
    summary: 'Invoice palsu yang meminta pembayaran ke rekening penipu.',
    how: 'Penipu mengirim invoice yang terlihat resmi dari vendor, cloud provider, atau layanan lain. Mereka meminta transfer ke rekening baru yang berbeda dari biasanya.',
    redFlags: ['Email vendor yang tidak dikenal', 'Meminta transfer ke rekening baru', 'Tekanan waktu dan ancaman penangguhan', 'Invoice tidak sesuai dengan transaksi sebenarnya'],
    example: 'Invoice dari "Cloud Provider" yang minta bayar ke rekening baru, padahal biasanya autodebet',
  },
  {
    id: 'ceo',
    name: 'CEO Fraud',
    icon: '👔',
    color: '#ff3d3d',
    summary: 'Penipu menyamar sebagai CEO atau direktur untuk minta transfer besar.',
    how: 'Penipu menyamar sebagai CEO, direktur, atau atasan melalui chat/email. Mereka meminta transfer rahasia untuk "akuisisi" atau "pembayaran vendor" dengan nominal besar.',
    redFlags: ['Tidak ada verifikasi identitas', 'Permintaan transfer sangat besar', 'Tekanan kerahasiaan tinggi', 'Tidak bisa dihubungi langsung'],
    example: 'Chat dari "CEO" yang minta transfer 200jt untuk akuisisi, jangan kasih tahu siapapun',
  },
]

export default function ThreatBriefing() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => setVisible(true), 100)
  }, [])

  function handleContinue() {
    gsap.to('.briefing-container', {
      opacity: 0,
      y: -20,
      duration: 0.4,
      ease: 'power2.in',
      onComplete: () => navigate('/cases'),
    })
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div
        className="briefing-container max-w-5xl mx-auto"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
        }}
      >
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-[#f4a522]/10 border border-[#f4a522]/30 rounded px-3 py-1 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f4a522] animate-pulse" />
            <span className="font-mono text-[10px] text-[#f4a522] tracking-widest">THREAT DATABASE</span>
          </div>
          <h1 className="font-mono text-2xl md:text-3xl text-[#e2e8f0] font-semibold mb-2">
            // JENIS SERANGAN SIBER
          </h1>
          <p className="text-sm text-[#4a5568] font-mono">
            Pelajari musuhmu sebelum bertemu di lapangan. Klik kartu untuk detail.
          </p>
        </div>

        {/* Threat Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {THREATS.map((threat, i) => {
            const isSelected = selected?.id === threat.id
            return (
              <div
                key={threat.id}
                onClick={() => setSelected(isSelected ? null : threat)}
                className="cursor-pointer rounded-lg border transition-all"
                style={{
                  borderColor: isSelected ? threat.color : '#1e2d3d',
                  background: isSelected ? `${threat.color}10` : '#0d1117',
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(20px)',
                  transition: `opacity 0.4s ease-out ${i * 0.05}s, transform 0.4s ease-out ${i * 0.05}s, border-color 0.2s, background 0.2s`,
                }}
              >
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{threat.icon}</span>
                    <div>
                      <div className="font-mono text-sm font-semibold" style={{ color: isSelected ? threat.color : '#e2e8f0' }}>
                        {threat.name}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-[#8892a4] leading-relaxed">{threat.summary}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Detail Panel */}
        {selected && (
          <div
            className="bg-[#0d1117] border rounded-lg p-6 mb-8"
            style={{ borderColor: selected.color }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{selected.icon}</span>
              <div>
                <h2 className="font-mono text-xl font-semibold" style={{ color: selected.color }}>
                  {selected.name}
                </h2>
                <p className="text-xs text-[#4a5568] font-mono">// Cara kerja & tanda bahaya</p>
              </div>
            </div>

            {/* How it works */}
            <div className="mb-4">
              <div className="font-mono text-xs tracking-widest mb-2" style={{ color: selected.color }}>
                CARA KERJA
              </div>
              <p className="text-sm text-[#8892a4] leading-relaxed">{selected.how}</p>
            </div>

            {/* Red Flags */}
            <div className="mb-4">
              <div className="font-mono text-xs tracking-widest mb-2" style={{ color: selected.color }}>
                TANDA BAHAYA (RED FLAGS)
              </div>
              <div className="space-y-1.5">
                {selected.redFlags.map((flag, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-xs mt-0.5" style={{ color: selected.color }}>▸</span>
                    <span className="text-xs text-[#8892a4]">{flag}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Example */}
            <div className="bg-[#111820] rounded-lg px-4 py-3 border border-[#1e2d3d]">
              <div className="font-mono text-[10px] text-[#4a5568] tracking-widest mb-1">CONTOH KASUS</div>
              <p className="text-xs text-[#8892a4] leading-relaxed italic">"{selected.example}"</p>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="text-center">
          <button
            onClick={handleContinue}
            className="font-mono text-sm tracking-widest bg-[#00b4d8] text-[#080b0f] px-10 py-4 rounded hover:bg-[#00c8f0] active:scale-[0.98] transition-all cursor-pointer font-semibold glow-cyan-strong"
          >
            MULAI INVESTIGASI →
          </button>
          <p className="text-xs text-[#4a5568] font-mono mt-3">
            Klik kartu di atas untuk mempelajari setiap jenis serangan
          </p>
        </div>
      </div>
    </div>
  )
}
