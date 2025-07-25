import React, { useState, useEffect } from 'react';
import { ArrowLeft, HelpCircle, Menu, User, Calendar } from 'lucide-react';
import logoDomba from '../../assets/icon/logo_domba.png';
import SearchableDropdown from '../../components/common/SearchableDropdown';

const PeternakFAQPage = () => {
    const [faqData, setFaqData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFaqFilter, setSelectedFaqFilter] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        // Sample FAQ data berdasarkan keterangan, kendala, dan solusi dari laporan
        setTimeout(() => {
            setFaqData([
                {
                    id: 1,
                    namaPeternak: 'Ahmad Subarjo',
                    tanggalLaporan: '31 Maret 2024',
                    triwulan: 'Triwulan I 2024',
                    kendala: 'Domba sering batuk dan terlihat lemas',
                    solusi: 'Berikan obat batuk khusus ternak, pisahkan dari domba lain, dan konsultasi dengan petugas kesehatan hewan terdekat',
                    keterangan: 'Masalah ini sering terjadi saat pergantian musim. Perlu penanganan cepat untuk mencegah penyebaran.'
                },
                {
                    id: 2,
                    namaPeternak: 'Siti Aminah',
                    tanggalLaporan: '31 Maret 2024',
                    triwulan: 'Triwulan I 2024',
                    kendala: 'Sulit mendapatkan rumput segar saat musim kemarau',
                    solusi: 'Gunakan jerami padi yang difermentasi, atau campurkan dengan konsentrat. Bisa juga membuat silase untuk cadangan pakan',
                    keterangan: 'Alternatif pakan saat musim kering sangat penting untuk menjaga kondisi ternak tetap sehat.'
                },
                {
                    id: 3,
                    namaPeternak: 'Bambang Wijaya',
                    tanggalLaporan: '31 Maret 2024',
                    triwulan: 'Triwulan I 2024',
                    kendala: 'Kandang bocor saat hujan, domba basah kuyup',
                    solusi: 'Perbaiki atap kandang dengan seng atau genting, pastikan ada saluran air yang baik di sekitar kandang',
                    keterangan: 'Kandang yang kering dan bersih sangat penting untuk kesehatan ternak, terutama saat musim hujan.'
                },
                {
                    id: 4,
                    namaPeternak: 'Budi Santoso',
                    tanggalLaporan: '30 Juni 2024',
                    triwulan: 'Triwulan II 2024',
                    kendala: 'Domba betina tidak mau kawin atau sering gagal bunting',
                    solusi: 'Periksa kondisi nutrisi domba, pastikan mendapat vitamin yang cukup. Konsultasi dengan petugas untuk program kawin suntik',
                    keterangan: 'Masalah reproduksi bisa disebabkan kekurangan gizi atau stres. Perlu penanganan khusus dari ahli.'
                },
                {
                    id: 5,
                    namaPeternak: 'Ahmad Subarjo',
                    tanggalLaporan: '30 Juni 2024',
                    triwulan: 'Triwulan II 2024',
                    kendala: 'Harga jual domba rendah, sulit mencari pembeli',
                    solusi: 'Bergabung dengan kelompok peternak untuk penjualan kolektif, manfaatkan media sosial untuk promosi, atau jual langsung ke pasar tradisional',
                    keterangan: 'Strategi pemasaran yang tepat bisa meningkatkan keuntungan peternak secara signifikan.'
                },
                {
                    id: 6,
                    namaPeternak: 'Siti Aminah',
                    tanggalLaporan: '30 September 2024',
                    triwulan: 'Triwulan III 2024',
                    kendala: 'Bingung mengisi laporan bulanan ke pengelola program',
                    solusi: 'Hubungi pendamping lapangan untuk panduan, gunakan format yang sudah disediakan, catat semua kegiatan harian',
                    keterangan: 'Laporan yang lengkap dan tepat waktu membantu pengelola memberikan bantuan yang lebih baik.'
                },
                {
                    id: 7,
                    namaPeternak: 'Bambang Wijaya',
                    tanggalLaporan: '30 September 2024',
                    triwulan: 'Triwulan III 2024',
                    kendala: 'Anak domba sering mati dalam minggu pertama',
                    solusi: 'Pastikan induk mendapat nutrisi yang baik saat bunting, jaga kebersihan kandang, berikan colostrum yang cukup',
                    keterangan: 'Kematian anak domba bisa dicegah dengan perawatan intensif pada minggu-minggu pertama kehidupan.'
                },
                {
                    id: 8,
                    namaPeternak: 'Budi Santoso',
                    tanggalLaporan: '31 Desember 2024',
                    triwulan: 'Triwulan IV 2024',
                    kendala: 'Domba tidak mau makan konsentrat yang diberikan',
                    solusi: 'Campurkan konsentrat dengan pakan favorit seperti rumput segar, berikan secara bertahap, pastikan konsentrat tidak basi',
                    keterangan: 'Adaptasi pakan baru memerlukan waktu. Perlu kesabaran dan cara yang tepat agar ternak mau menerima.'
                }
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    // Handle mobile menu clicks outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (mobileMenuOpen && !event.target.closest('.mobile-menu')) {
                setMobileMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [mobileMenuOpen]);

    // Filter data berdasarkan searchable dropdown
    const filteredFaq = selectedFaqFilter
        ? faqData.filter(faq => faq.id === selectedFaqFilter)
        : faqData;

    // Prepare options for SearchableDropdown
    const faqOptions = faqData.map(faq => ({
        value: faq.id,
        label: faq.kendala,
        subtitle: `${faq.namaPeternak} • ${faq.triwulan} • ${faq.tanggalLaporan}`,
    }));

    const defaultFaqOption = {
        value: '',
        label: 'Tampilkan Semua Informasi',
        subtitle: `${faqData.length} informasi tersedia`
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                    <span className="text-gray-600">Memuat data FAQ...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        {/* Logo */}
                        <div className="flex items-center">
                            <img src={logoDomba} alt="Logo" className="h-8 w-8 mr-3" />
                            <div>
                                <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                                    FAQ Peternak
                                </h1>
                                <p className="text-xs sm:text-sm text-gray-600">
                                    Kumpulan Informasi Kendala & Solusi
                                </p>
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-4">
                            <button
                                onClick={() => window.location.href = '/peternak/transparency'}
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Kembali ke Transparansi
                            </button>
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-green-600 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
                            >
                                <Menu className="h-6 w-6" />
                            </button>
                        </div>
                    </div>

                    {/* Mobile Navigation Menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden border-t border-gray-200 bg-white shadow-lg mobile-menu">
                            <div className="px-2 pt-2 pb-3 space-y-1">
                                <button
                                    onClick={() => {
                                        window.location.href = '/peternak/transparency';
                                        setMobileMenuOpen(false);
                                    }}
                                    className="flex items-center w-full px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    <ArrowLeft className="h-5 w-5 mr-3" />
                                    Kembali ke Transparansi
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                {/* Search Section */}
                <div className="bg-white rounded-lg shadow-sm mb-6">
                    <div className="p-4 sm:p-6">
                        <div className="w-full">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Cari Informasi Kendala & Solusi
                            </label>
                            <SearchableDropdown
                                options={faqOptions}
                                value={selectedFaqFilter}
                                onChange={setSelectedFaqFilter}
                                placeholder="Cari berdasarkan kendala atau kata kunci..."
                                defaultOption={defaultFaqOption}
                                searchPlaceholder="Ketik untuk mencari..."
                                displayKey="label"
                                valueKey="value"
                                searchKeys={['label', 'subtitle']}
                                noResultsText="Tidak ada informasi ditemukan"
                            />
                        </div>

                        {/* Results Info */}
                        <div className="mt-4 text-sm text-gray-600">
                            Menampilkan {filteredFaq.length} dari {faqData.length} informasi
                            {selectedFaqFilter && (
                                <span> yang dipilih</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* FAQ List */}
                <div className="space-y-4">
                    {filteredFaq.length > 0 ? (
                        filteredFaq.map((faq) => (
                            <div key={faq.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                <div className="p-4 sm:p-6">
                                    {/* Header dengan Peternak dan Waktu */}
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                                        {/* Peternak Badge */}
                                        <div className="flex items-center">
                                            <User className="h-4 w-4 text-blue-500" />
                                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {faq.namaPeternak}
                                            </span>
                                        </div>

                                        {/* Waktu Laporan */}
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                                            <span className="font-medium">{faq.triwulan}</span>
                                            <span className="mx-2">•</span>
                                            <span>{faq.tanggalLaporan}</span>
                                        </div>
                                    </div>

                                    {/* Kendala */}
                                    <div className="mb-4">
                                        <h3 className="text-sm font-medium text-red-600 mb-2">
                                            Kendala:
                                        </h3>
                                        <p className="text-gray-900 leading-relaxed">
                                            {faq.kendala}
                                        </p>
                                    </div>

                                    {/* Solusi */}
                                    <div className="mb-4">
                                        <h3 className="text-sm font-medium text-green-600 mb-2">
                                            Solusi:
                                        </h3>
                                        <p className="text-gray-900 leading-relaxed">
                                            {faq.solusi}
                                        </p>
                                    </div>

                                    {/* Keterangan */}
                                    <div className="bg-blue-50 rounded-lg p-3">
                                        <h3 className="text-sm font-medium text-blue-600 mb-1">
                                            Keterangan Tambahan:
                                        </h3>
                                        <p className="text-blue-900 text-sm leading-relaxed">
                                            {faq.keterangan}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                            <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Tidak ada informasi ditemukan
                            </h3>
                            <p className="text-gray-600">
                                Silakan gunakan pencarian untuk menemukan informasi yang lebih spesifik.
                            </p>
                        </div>
                    )}
                </div>

                {/* Back to Top */}
                {filteredFaq.length > 5 && (
                    <div className="mt-8 text-center">
                        <button
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-green-600 bg-green-50 hover:bg-green-100 rounded-md transition-colors"
                        >
                            Kembali ke Atas
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default PeternakFAQPage;
