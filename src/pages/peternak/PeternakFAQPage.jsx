import React, { useState, useEffect, useCallback } from 'react';
import { HelpCircle, User, Calendar } from 'lucide-react';
import SearchableDropdown from '../../components/common/SearchableDropdown';
import PeternakSidebar from '../../components/peternak/PeternakSidebar';
import PeternakNavbar from '../../components/peternak/PeternakNavbar';
import Notification from '../../components/common/Notification';
import Footer from '../../components/common/Footer';
import { getAllPeternak } from '../../services/peternakService';
import { getAllLaporan } from '../../services/laporanService';
import useNotification from '../../hooks/useNotification';

const PeternakFAQPage = () => {
    const [faqData, setFaqData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFaqFilter, setSelectedFaqFilter] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { notification, showError, hideNotification } = useNotification();

    const loadFaqData = useCallback(async () => {
        try {
            setLoading(true);

            // Load data peternak dan laporan dari Firebase
            const [peternakResponse, laporanResponse] = await Promise.all([
                getAllPeternak(),
                getAllLaporan()
            ]);

            // Filter laporan yang memiliki kendala, solusi, atau catatan
            const laporanWithFaq = laporanResponse.filter(laporan =>
                laporan.kendala || laporan.solusi || laporan.catatan
            );

            // Gabungkan data laporan dengan data peternak
            const faqWithPeternakData = laporanWithFaq.map(laporan => {
                const peternak = peternakResponse.find(p => p.id === laporan.idPeternak);
                return {
                    id: laporan.id,
                    namaPeternak: peternak?.namaLengkap || 'Tidak Diketahui',
                    tanggalLaporan: laporan.tanggalLaporan,
                    periode: laporan.displayPeriod || `Laporan ke-${laporan.reportNumber}`,
                    kendala: laporan.kendala || '',
                    solusi: laporan.solusi || '',
                    keterangan: laporan.catatan || '', // Menggunakan field "catatan"
                    reportNumber: laporan.reportNumber || 0
                };
            });

            // Sort berdasarkan tanggal laporan terbaru
            faqWithPeternakData.sort((a, b) => {
                const dateA = new Date(a.tanggalLaporan);
                const dateB = new Date(b.tanggalLaporan);
                return dateB - dateA;
            });

            setFaqData(faqWithPeternakData);

        } catch (error) {
            console.error('Error loading FAQ data:', error);
            showError('Gagal memuat data FAQ', error.message);
        } finally {
            setLoading(false);
        }
    }, [showError]);

    useEffect(() => {
        loadFaqData();
    }, [loadFaqData]);

    // Function untuk format tanggal yang aman
    const formatTanggal = (tanggal) => {
        try {
            const date = new Date(tanggal);
            if (isNaN(date.getTime())) {
                return 'Tanggal tidak valid';
            }
            return date.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        } catch (error) {
            return 'Tanggal tidak valid';
        }
    };

    // Filter data berdasarkan searchable dropdown
    const filteredFaq = selectedFaqFilter
        ? faqData.filter(faq => faq.id === selectedFaqFilter)
        : faqData;

    // Prepare options for SearchableDropdown
    const faqOptions = faqData.map(faq => ({
        value: faq.id,
        label: faq.kendala || 'Tidak ada kendala tercatat',
        subtitle: `${faq.namaPeternak} • ${faq.periode} • ${formatTanggal(faq.tanggalLaporan)}`,
    }));

    const defaultFaqOption = {
        value: '',
        label: 'Tampilkan Semua Informasi',
        subtitle: `${faqData.length} informasi tersedia`
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <PeternakSidebar
                    activeItem="faq"
                    isMobileMenuOpen={isMobileMenuOpen}
                    setIsMobileMenuOpen={setIsMobileMenuOpen}
                />
                <div className="min-h-screen">
                    <PeternakNavbar
                        onToggleSidebar={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    />
                    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
                        <div className="flex flex-col items-center space-y-4">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-200 border-t-green-600"></div>
                            <span className="text-sm sm:text-base text-gray-600 font-medium">Memuat data FAQ...</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <PeternakSidebar
                activeItem="faq"
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
            />
            <div className="min-h-screen">
                <PeternakNavbar
                    onToggleSidebar={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                />

                {/* Main Content */}
                <main className="bg-gray-50 p-3 sm:p-6">
                    <div className="max-w-7xl mx-auto">
                        {/* Page Header */}
                        <div className="bg-white rounded-lg shadow-sm mb-6">
                            <div className="p-4 sm:p-6 border-b border-gray-200">
                                <div className="md:flex md:items-center md:justify-between">
                                    <div className="flex-1 min-w-0">
                                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                            FAQ Peternak
                                        </h1>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Kumpulan Informasi Kendala & Solusi
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Search Section dalam header */}
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
                                                    <span className="font-medium">{faq.periode}</span>
                                                    <span className="mx-2">•</span>
                                                    <span>{formatTanggal(faq.tanggalLaporan)}</span>
                                                </div>
                                            </div>

                                            {/* Kendala - hanya tampilkan jika ada */}
                                            {faq.kendala && (
                                                <div className="mb-4">
                                                    <h3 className="text-sm font-medium text-red-600 mb-2">
                                                        Kendala:
                                                    </h3>
                                                    <p className="text-gray-900 leading-relaxed">
                                                        {faq.kendala}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Solusi - hanya tampilkan jika ada */}
                                            {faq.solusi && (
                                                <div className="mb-4">
                                                    <h3 className="text-sm font-medium text-green-600 mb-2">
                                                        Solusi:
                                                    </h3>
                                                    <p className="text-gray-900 leading-relaxed">
                                                        {faq.solusi}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Keterangan/Catatan - hanya tampilkan jika ada */}
                                            {faq.keterangan && (
                                                <div className="bg-blue-50 rounded-lg p-3">
                                                    <h3 className="text-sm font-medium text-blue-600 mb-1">
                                                        Catatan Tambahan:
                                                    </h3>
                                                    <p className="text-blue-900 text-sm leading-relaxed">
                                                        {faq.keterangan}
                                                    </p>
                                                </div>
                                            )}
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
                    </div>
                </main>
            </div>

            {/* Footer */}
            <Footer />

            {/* Notification */}
            {notification.isVisible && (
                <Notification
                    type={notification.type}
                    title={notification.title}
                    message={notification.message}
                    onClose={hideNotification}
                    autoClose={notification.autoClose}
                    duration={notification.duration}
                />
            )}
        </div>
    );
};

export default PeternakFAQPage;
