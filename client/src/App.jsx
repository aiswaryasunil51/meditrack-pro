import React, { useState, useEffect } from 'react';
import { AlertCircle, Package, TruckIcon, Hospital, Users, BarChart3, LogOut, Plus, Edit2, Trash2, Search, Filter, Calendar, AlertTriangle, CheckCircle, XCircle, Eye, Download } from 'lucide-react';

// Mock API calls (replace with actual backend calls)
const api = {
  login: async (username, password) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (username && password) {
          resolve({ 
            success: true, 
            token: 'mock-jwt-token',
            user: { id: 1, username, role: 'admin' }
          });
        } else {
          resolve({ success: false, message: 'Invalid credentials' });
        }
      }, 500);
    });
  },
  register: async (username, email, password, role) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
        if (existingUsers.find(u => u.username === username)) {
          resolve({ success: false, message: 'Username already exists' });
        } else {
          existingUsers.push({ username, email, role });
          localStorage.setItem('users', JSON.stringify(existingUsers));
          resolve({ success: true, message: 'Registration successful' });
        }
      }, 500);
    });
  },
  getDrugs: async () => {
    return [
      { id: 1, name: 'Paracetamol', category: 'Analgesic', manufacturer: 'PharmaCorp', stock: 450, threshold: 200, expiry: '2026-10-15', status: 'good' },
      { id: 2, name: 'Amoxicillin', category: 'Antibiotic', manufacturer: 'MediLife', stock: 180, threshold: 200, expiry: '2025-12-20', status: 'low' },
      { id: 3, name: 'Ibuprofen', category: 'Analgesic', manufacturer: 'HealthGen', stock: 95, threshold: 150, expiry: '2025-11-30', status: 'critical' },
      { id: 4, name: 'Metformin', category: 'Antidiabetic', manufacturer: 'DiabeCare', stock: 320, threshold: 100, expiry: '2026-06-10', status: 'good' },
      { id: 5, name: 'Lisinopril', category: 'Antihypertensive', manufacturer: 'CardioMed', stock: 210, threshold: 150, expiry: '2026-03-25', status: 'good' }
    ];
  },
  getSuppliers: async () => {
    return [
      { id: 1, name: 'MediLife Pvt Ltd', rating: 4.5, onTimeDelivery: 92, qualityScore: 96, pendingOrders: 3 },
      { id: 2, name: 'PharmaCorp Suppliers', rating: 4.2, onTimeDelivery: 88, qualityScore: 94, pendingOrders: 5 },
      { id: 3, name: 'HealthGen Industries', rating: 4.8, onTimeDelivery: 95, qualityScore: 98, pendingOrders: 1 },
      { id: 4, name: 'DiabeCare Pharma', rating: 4.0, onTimeDelivery: 85, qualityScore: 90, pendingOrders: 4 }
    ];
  },
  getHospitals: async () => {
    return [
      { id: 1, name: 'Apollo Hospital', location: 'Delhi', consumption: 1250, orders: 28 },
      { id: 2, name: 'Max Healthcare', location: 'Mumbai', consumption: 980, orders: 22 },
      { id: 3, name: 'Fortis Hospital', location: 'Bangalore', consumption: 1100, orders: 25 },
      { id: 4, name: 'AIIMS', location: 'Delhi', consumption: 1450, orders: 32 }
    ];
  },
  getShipments: async () => {
    return [
      { id: 1, orderId: 'ORD-001', drug: 'Paracetamol', supplier: 'MediLife', quantity: 500, status: 'delivered', date: '2025-11-01' },
      { id: 2, orderId: 'ORD-002', drug: 'Amoxicillin', supplier: 'PharmaCorp', quantity: 300, status: 'in-transit', date: '2025-11-05' },
      { id: 3, orderId: 'ORD-003', drug: 'Metformin', supplier: 'DiabeCare', quantity: 400, status: 'pending', date: '2025-11-07' }
    ];
  }
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  
  // Data states
  const [drugs, setDrugs] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [shipments, setShipments] = useState([]);
  
  // Form states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsLoggedIn(true);
      setUser(JSON.parse(localStorage.getItem('user')));
      loadData();
    }
  }, []);

  const loadData = async () => {
    const [drugsData, suppliersData, hospitalsData, shipmentsData] = await Promise.all([
      api.getDrugs(),
      api.getSuppliers(),
      api.getHospitals(),
      api.getShipments()
    ]);
    setDrugs(drugsData);
    setSuppliers(suppliersData);
    setHospitals(hospitalsData);
    setShipments(shipmentsData);
  };

  const handleAuth = async (formData) => {
    if (authMode === 'login') {
      const result = await api.login(formData.username, formData.password);
      if (result.success) {
        localStorage.setItem('authToken', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        setIsLoggedIn(true);
        setUser(result.user);
        setShowAuthModal(false);
        loadData();
      } else {
        alert(result.message);
      }
    } else {
      const result = await api.register(formData.username, formData.email, formData.password, formData.role);
      if (result.success) {
        alert('Registration successful! Please login.');
        setAuthMode('login');
      } else {
        alert(result.message);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    setCurrentView('dashboard');
  };

  if (!isLoggedIn) {
    return <LandingPage onGetStarted={() => setShowAuthModal(true)} />;
  }

  const filteredDrugs = drugs.filter(drug => {
    const matchesSearch = drug.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || drug.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  MediTrack Pro
                </h1>
                <p className="text-xs text-gray-500">Supply Chain Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, <span className="font-semibold">{user?.username}</span></span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white/80 backdrop-blur-lg border-r border-gray-200 min-h-[calc(100vh-4rem)] sticky top-16">
          <nav className="p-4 space-y-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'inventory', label: 'Drug Inventory', icon: Package },
              { id: 'suppliers', label: 'Suppliers', icon: TruckIcon },
              { id: 'hospitals', label: 'Hospitals', icon: Hospital },
              { id: 'shipments', label: 'Shipments', icon: TruckIcon },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  currentView === item.id
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {currentView === 'dashboard' && <Dashboard drugs={drugs} suppliers={suppliers} hospitals={hospitals} />}
          {currentView === 'inventory' && (
            <InventoryView 
              drugs={filteredDrugs} 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filterCategory={filterCategory}
              setFilterCategory={setFilterCategory}
            />
          )}
          {currentView === 'suppliers' && <SuppliersView suppliers={suppliers} />}
          {currentView === 'hospitals' && <HospitalsView hospitals={hospitals} />}
          {currentView === 'shipments' && <ShipmentsView shipments={shipments} />}
        </main>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          mode={authMode}
          setMode={setAuthMode}
          onSubmit={handleAuth}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </div>
  );
};

const LandingPage = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center mx-auto">
              <Package className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-6xl font-bold text-white mb-6">
            MediTrack Pro
          </h1>
          <p className="text-2xl text-blue-100 mb-4">
            Intelligent Drug Inventory & Supply Chain Management
          </p>
          <p className="text-lg text-blue-200 max-w-2xl mx-auto">
            Optimize pharmaceutical inventory with real-time tracking, FIFO-E enforcement, 
            and comprehensive compliance management
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: AlertTriangle,
              title: 'FIFO-E Enforcement',
              description: 'Automatically prioritizes near-expiry stock to minimize wastage'
            },
            {
              icon: BarChart3,
              title: 'Real-Time Analytics',
              description: 'Dynamic dashboards with consumption trends and performance metrics'
            },
            {
              icon: CheckCircle,
              title: 'Audit Trail',
              description: 'Complete traceability from manufacturer to patient consumption'
            }
          ].map((feature, idx) => (
            <div key={idx} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all">
              <feature.icon className="w-12 h-12 text-white mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-blue-100">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {[
            { label: 'Reduction in Wastage', value: '20%' },
            { label: 'Compliance Rate', value: '99.9%' },
            { label: 'Cost Savings', value: '₹1000Cr' },
            { label: 'Real-time Updates', value: '24/7' }
          ].map((stat, idx) => (
            <div key={idx} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center border border-white/20">
              <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-blue-100">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <button
            onClick={onGetStarted}
            className="inline-flex items-center space-x-3 px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all transform hover:scale-105 shadow-2xl"
          >
            <span>Get Started</span>
            <Package className="w-6 h-6" />
          </button>
          <p className="text-blue-100 mt-4">Start managing your pharmaceutical inventory today</p>
        </div>
      </div>
    </div>
  );
};

const AuthModal = ({ mode, setMode, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <input
              type="text"
              required
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter username"
            />
          </div>

          {mode === 'register' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="warehouse">Warehouse Manager</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all"
          >
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            {mode === 'login' ? "Don't have an account? Register" : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

const Dashboard = ({ drugs, suppliers, hospitals }) => {
  const expiringDrugs = drugs.filter(d => {
    const daysToExpiry = Math.floor((new Date(d.expiry) - new Date()) / (1000 * 60 * 60 * 24));
    return daysToExpiry <= 30;
  });

  const lowStockDrugs = drugs.filter(d => d.status === 'low' || d.status === 'critical');
  const totalStock = drugs.reduce((sum, d) => sum + d.stock, 0);
  const avgSupplierRating = (suppliers.reduce((sum, s) => sum + s.rating, 0) / suppliers.length).toFixed(1);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6">
        {[
          { label: 'Total Drugs', value: drugs.length, icon: Package, color: 'blue' },
          { label: 'Total Stock Units', value: totalStock, icon: Package, color: 'green' },
          { label: 'Active Suppliers', value: suppliers.length, icon: TruckIcon, color: 'purple' },
          { label: 'Avg Supplier Rating', value: avgSupplierRating, icon: BarChart3, color: 'orange' }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <stat.icon className={`w-8 h-8 text-${stat.color}-600`} />
              <span className={`text-3xl font-bold text-${stat.color}-600`}>{stat.value}</span>
            </div>
            <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Alerts */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Expiring Soon */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-orange-600" />
            <h3 className="text-xl font-bold text-gray-900">Expiring Soon (30 days)</h3>
          </div>
          <div className="space-y-3">
            {expiringDrugs.slice(0, 3).map(drug => (
              <div key={drug.id} className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{drug.name}</p>
                  <p className="text-sm text-gray-600">Expires: {drug.expiry}</p>
                </div>
                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                  {drug.stock} units
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <h3 className="text-xl font-bold text-gray-900">Low Stock Alerts</h3>
          </div>
          <div className="space-y-3">
            {lowStockDrugs.slice(0, 3).map(drug => (
              <div key={drug.id} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{drug.name}</p>
                  <p className="text-sm text-gray-600">Threshold: {drug.threshold}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  drug.status === 'critical' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {drug.stock} units
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Top Hospitals */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Top Consuming Hospitals</h3>
          <div className="space-y-3">
            {hospitals.sort((a, b) => b.consumption - a.consumption).slice(0, 4).map(hospital => (
              <div key={hospital.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Hospital className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">{hospital.name}</p>
                    <p className="text-sm text-gray-600">{hospital.location}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-600">{hospital.consumption}</p>
                  <p className="text-xs text-gray-500">{hospital.orders} orders</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Suppliers */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Top Rated Suppliers</h3>
          <div className="space-y-3">
            {suppliers.sort((a, b) => b.rating - a.rating).slice(0, 4).map(supplier => (
              <div key={supplier.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <TruckIcon className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-gray-900">{supplier.name}</p>
                    <p className="text-sm text-gray-600">{supplier.onTimeDelivery}% on-time</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">⭐</span>
                  <span className="font-bold text-purple-600">{supplier.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const InventoryView = ({ drugs, searchTerm, setSearchTerm, filterCategory, setFilterCategory }) => {
  const categories = ['all', ...new Set(drugs.map(d => d.category))];

  const getStatusColor = (status) => {
    switch(status) {
      case 'good': return 'bg-green-100 text-green-700';
      case 'low': return 'bg-yellow-100 text-yellow-700';
      case 'critical': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Drug Inventory</h2>
        <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all">
          <Plus className="w-5 h-5" />
          <span>Add Drug</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search drugs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Drug Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drugs.map(drug => (
          <div key={drug.id} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{drug.name}</h3>
                <p className="text-sm text-gray-600">{drug.category}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(drug.status)}`}>
                {drug.status}
              </span>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Stock:</span>
                <span className="font-semibold text-gray-900">{drug.stock} units</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Threshold:</span>
                <span className="font-semibold text-gray-900">{drug.threshold} units</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Expiry:</span>
                <span className="font-semibold text-gray-900">{drug.expiry}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Manufacturer:</span>
                <span className="font-semibold text-gray-900">{drug.manufacturer}</span>
              </div>
            </div>

            <div className="flex space-x-2">
              <button className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                <Edit2 className="w-4 h-4" />
                <span className="text-sm font-medium">Edit</span>
              </button>
              <button className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                <Trash2 className="w-4 h-4" />
                <span className="text-sm font-medium">Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SuppliersView = ({ suppliers }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Supplier Management</h2>
        <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all">
          <Plus className="w-5 h-5" />
          <span>Add Supplier</span>
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {suppliers.map(supplier => (
          <div key={supplier.id} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{supplier.name}</h3>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-2xl">⭐</span>
                  <span className="text-2xl font-bold text-purple-600">{supplier.rating}</span>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Eye className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-sm text-gray-600 mb-1">On-Time Delivery</p>
                <p className="text-2xl font-bold text-blue-600">{supplier.onTimeDelivery}%</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-sm text-gray-600 mb-1">Quality Score</p>
                <p className="text-2xl font-bold text-green-600">{supplier.qualityScore}%</p>
              </div>
            </div>

            <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Pending Orders</span>
              <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-bold">
                {supplier.pendingOrders}
              </span>
            </div>

            <div className="flex space-x-2 mt-4">
              <button className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                <Edit2 className="w-4 h-4" />
                <span className="text-sm font-medium">Edit</span>
              </button>
              <button className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors">
                <Package className="w-4 h-4" />
                <span className="text-sm font-medium">View Orders</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const HospitalsView = ({ hospitals }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Hospital Network</h2>
        <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all">
          <Plus className="w-5 h-5" />
          <span>Add Hospital</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-bold">Hospital Name</th>
              <th className="px-6 py-4 text-left text-sm font-bold">Location</th>
              <th className="px-6 py-4 text-left text-sm font-bold">Monthly Consumption</th>
              <th className="px-6 py-4 text-left text-sm font-bold">Total Orders</th>
              <th className="px-6 py-4 text-left text-sm font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {hospitals.map((hospital, idx) => (
              <tr key={hospital.id} className={`${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50 transition-colors`}>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <Hospital className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-gray-900">{hospital.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-700">{hospital.location}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                    {hospital.consumption} units
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
                    {hospital.orders}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ShipmentsView = ({ shipments }) => {
  const getStatusColor = (status) => {
    switch(status) {
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'in-transit': return 'bg-blue-100 text-blue-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Shipment Tracking</h2>
        <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all">
          <Plus className="w-5 h-5" />
          <span>New Shipment</span>
        </button>
      </div>

      <div className="space-y-4">
        {shipments.map(shipment => (
          <div key={shipment.id} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <TruckIcon className="w-6 h-6 text-blue-600" />
                  <h3 className="text-lg font-bold text-gray-900">{shipment.orderId}</h3>
                </div>
                <p className="text-sm text-gray-600">{shipment.drug}</p>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(shipment.status)}`}>
                {shipment.status}
              </span>
            </div>

            <div className="grid md:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Supplier</p>
                <p className="font-semibold text-gray-900">{shipment.supplier}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Quantity</p>
                <p className="font-semibold text-gray-900">{shipment.quantity} units</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Date</p>
                <p className="font-semibold text-gray-900">{shipment.date}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Status</p>
                <p className="font-semibold text-gray-900 capitalize">{shipment.status}</p>
              </div>
            </div>

            <div className="flex space-x-2">
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                <Eye className="w-4 h-4" />
                <span className="text-sm font-medium">Track</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors">
                <Download className="w-4 h-4" />
                <span className="text-sm font-medium">Download</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;