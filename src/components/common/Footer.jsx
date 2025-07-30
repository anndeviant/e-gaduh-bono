import React from 'react';
import { Mail, Phone, MapPin, Users } from 'lucide-react';
import logoKambing from '../../assets/icon/logo_kambing.png';

const Footer = () => {

    return (
        <footer className="bg-gray-900 text-white">
            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                    {/* Logo & Description */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center mb-4">
                            <img
                                src={logoKambing}
                                alt="Logo Desa Bono"
                                className="h-12 w-12 mr-3"
                            />
                            <div>
                                <h3 className="text-xl font-bold">Desa Bono</h3>
                                <p className="text-gray-300 text-sm">Program Gaduh Ternak</p>
                            </div>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed mb-4">
                            Sistem digital untuk monitoring dan transparansi program gaduh ternak
                            yang bertujuan meningkatkan kesejahteraan masyarakat Desa Bono melalui
                            pengembangan peternakan berkelanjutan.
                        </p>
                    </div>

                    {/* Contact Information */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Kontak</h4>
                        <div className="space-y-3">
                            <div className="flex items-start">
                                <Phone className="h-4 w-4 mr-3 mt-1 text-blue-400 flex-shrink-0" />
                                <div>
                                    <p className="text-sm text-gray-300">Telepon</p>
                                    <p className="text-sm font-medium">+62 858-0072-3000</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <Mail className="h-4 w-4 mr-3 mt-1 text-green-400 flex-shrink-0" />
                                <div>
                                    <p className="text-sm text-gray-300">Email</p>
                                    <p className="text-sm font-medium">peternakandesabono@gmail.com</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <MapPin className="h-4 w-4 mr-3 mt-1 text-red-400 flex-shrink-0" />
                                <div>
                                    <p className="text-sm text-gray-300">Alamat</p>
                                    <p className="text-sm font-medium">Desa Bono, Kecamatan Tulung</p>
                                    <p className="text-sm text-gray-300">Kabupaten Klaten, Prov. Jawa Tengah, 57482.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Developer Information */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Developer</h4>
                        <div className="space-y-3">
                            <div className="bg-gray-800 rounded-lg p-3">
                                <div className="flex items-center mb-2">
                                    <Users className="h-4 w-4 mr-2 text-yellow-400" />
                                    <span className="text-sm font-semibold text-yellow-400">Lead Developer</span>
                                </div>
                                <p className="text-sm font-medium">KKN AD.83.255</p>
                                <p className="text-xs text-gray-400">Universitas Pembangunan Nasional "Veteran" Yogyakarta</p>
                            </div>

                            <div className="bg-gray-800 rounded-lg p-3">
                                <div className="flex items-center mb-2">
                                    <Users className="h-4 w-4 mr-2 text-blue-400" />
                                    <span className="text-sm font-semibold text-blue-400">Contributors</span>
                                </div>
                                <p className="text-sm">KKN AD.83.253</p>
                                <p className="text-sm">KKN AD.83.254</p>
                                <p className="text-xs text-gray-400 mt-1">Universitas Pembangunan Nasional "Veteran" Yogyakarta</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Footer */}
            <div className="border-t border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="text-sm text-gray-400 mb-4 md:mb-0">
                            <p>&copy; 2025 Desa Bono. Semua hak cipta dilindungi.</p>
                        </div>

                        <div className="flex items-center space-x-6 text-sm text-gray-400">
                            <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-medium">
                                Digital Village
                            </span>
                            <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                                KKN UPNVYK 2025
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
