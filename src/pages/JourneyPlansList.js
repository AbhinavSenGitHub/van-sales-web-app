
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, User, ChevronRight, Search, Filter, X, Building2, Store, Clock, Briefcase } from 'lucide-react';
import '../App.css';

const JourneyPlansList = () => {
    const navigate = useNavigate();
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/journey-plans`)
            .then(res => {
                if (!res.ok) return res.json().then(err => { throw new Error(err.message || 'Failed to fetch plans') });
                return res.json();
            })
            .then(data => {
                if (Array.isArray(data)) {
                    setPlans(data);
                } else if (data && data.status === 'success' && Array.isArray(data.data)) {
                    setPlans(data.data);
                } else {
                    console.error('Data received is not an array:', data);
                    setPlans([]);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching plans:', err);
                setPlans([]);
                setLoading(false);
            });
    }, []);

    const handleCardClick = (planId) => {
        setDetailLoading(true);
        setSelectedPlan(null); // Clear previous
        fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/journey-plans/${planId}`)
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch details');
                return res.json();
            })
            .then(data => {
                setSelectedPlan(data);
                setDetailLoading(false);
            })
            .catch(err => {
                console.error('Error fetching plan details:', err);
                setDetailLoading(false);
                alert('Could not load plan details. Please ensure the backend is running with the latest changes.');
            });
    };

    const filteredPlans = Array.isArray(plans) ? plans.filter(plan =>
        (plan.routeName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (plan.routeCode || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (plan.primaryEmployee || '').toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    return (
        <div className="container pb-10">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">Journey Plans</h1>
                    <p className="text-text-secondary text-sm">View and manage all your created routes</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => navigate('/')}
                >
                    Create New Plan
                </button>
            </div>

            <div className="card mb-6" style={{ padding: '16px' }}>
                <div className="flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                        <input
                            type="text"
                            placeholder="Search by route name, code or employee..."
                            className="form-input"
                            style={{ paddingLeft: '40px' }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="btn border border-[#EEE] bg-white flex items-center gap-2">
                        <Filter size={18} />
                        Filter
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                    <p className="mt-4 text-text-secondary">Loading journey plans...</p>
                </div>
            ) : filteredPlans.length > 0 ? (
                <div className="grid gap-4">
                    {filteredPlans.map((plan) => (
                        <div
                            key={plan._id}
                            onClick={() => handleCardClick(plan._id)}
                            className="card hover:shadow-lg transition-shadow cursor-pointer overflow-hidden border-l-4 border-l-primary"
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="font-bold text-lg">{plan.routeName}</h3>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${plan.status === 'Active' ? 'text-primary bg-[#E3FBE3]' : 'text-error bg-[#FFF2F1]'}`}>
                                            {plan.status?.toUpperCase() || 'ACTIVE'}
                                        </span>
                                        <span className="text-[12px] text-text-secondary bg-bg-main px-2 py-0.5 rounded font-mono">
                                            {plan.routeCode}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                        <div className="flex items-center gap-2 text-sm text-text-secondary">
                                            <Calendar size={16} className="text-primary" />
                                            <div>
                                                <div className="text-[11px] uppercase tracking-wider text-[#919EAB]">Validity</div>
                                                <div className="font-medium text-text-primary">
                                                    {new Date(plan.validFrom).toLocaleDateString()} - {new Date(plan.validTo).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-text-secondary">
                                            <User size={16} className="text-primary" />
                                            <div>
                                                <div className="text-[11px] uppercase tracking-wider text-[#919EAB]">Assigned Employee</div>
                                                <div className="font-medium text-text-primary">{plan.primaryEmployee}</div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-text-secondary">
                                            <MapPin size={16} className="text-primary" />
                                            <div>
                                                <div className="text-[11px] uppercase tracking-wider text-[#919EAB]">Customers</div>
                                                <div className="font-medium text-text-primary">{plan.customerIds?.length || 0} Registered Shops</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-[#F4F6F8] flex gap-6">
                                        <div className="text-sm">
                                            <span className="text-text-secondary">Company:</span> <span className="font-semibold">{plan.company?.name || 'N/A'}</span>
                                        </div>
                                        <div className="text-sm">
                                            <span className="text-text-secondary">Warehouse:</span> <span className="font-semibold">{plan.warehouse || 'N/A'}</span>
                                        </div>
                                        <div className="text-sm">
                                            <span className="text-text-secondary">Vehicle:</span> <span className="font-semibold">{plan.vehicle || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="self-center pl-4">
                                    <ChevronRight size={24} className="text-text-secondary" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="card text-center py-20 bg-[#F9FAFB] border-dashed">
                    <Calendar size={48} className="mx-auto text-[#919EAB] mb-4" />
                    <h3 className="text-lg font-bold text-text-primary">No Journey Plans Found</h3>
                    <p className="text-text-secondary mb-6">You haven't created any journey plans yet or no matches for your search.</p>
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate('/')}
                    >
                        Create Your First Plan
                    </button>
                </div>
            )}

            {/* Details Modal */}
            {(selectedPlan || detailLoading) && (
                <div className="modal-overlay" onClick={() => setSelectedPlan(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        {detailLoading ? (
                            <div className="modal-body flex flex-col items-center justify-center py-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                                <p className="mt-4 text-text-secondary">Fetching route details...</p>
                            </div>
                        ) : selectedPlan && (
                            <>
                                <div className="modal-header">
                                    <div>
                                        <h2 className="text-xl font-bold">{selectedPlan.routeName}</h2>
                                        <p className="text-sm text-text-secondary mt-1">Route Details & Scheduled Customers</p>
                                    </div>
                                    <button className="p-2 hover:bg-bg-main rounded-full" onClick={() => setSelectedPlan(null)}>
                                        <X size={24} />
                                    </button>
                                </div>

                                <div className="modal-body">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                        <div className="detail-card">
                                            <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-4 flex items-center gap-2">
                                                <Briefcase size={16} /> Basic Information
                                            </h3>
                                            <div className="space-y-3">
                                                <div className="flex justify-between">
                                                    <span className="text-text-secondary">Route Code</span>
                                                    <span className="font-semibold">{selectedPlan.routeCode}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-text-secondary">Status</span>
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${selectedPlan.status === 'Active' ? 'text-primary bg-[#E3FBE3]' : 'text-error bg-[#FFF2F1]'}`}>
                                                        {selectedPlan.status?.toUpperCase() || 'ACTIVE'}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-text-secondary">Company</span>
                                                    <span className="font-semibold">{selectedPlan.company?.name || 'N/A'}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-text-secondary">Warehouse</span>
                                                    <span className="font-semibold">{selectedPlan.warehouse || 'N/A'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="detail-card">
                                            <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-4 flex items-center gap-2">
                                                <Clock size={16} /> Schedule & Assignment
                                            </h3>
                                            <div className="space-y-3">
                                                <div className="flex justify-between">
                                                    <span className="text-text-secondary">Assigned Employee</span>
                                                    <span className="font-semibold">{selectedPlan.primaryEmployee}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-text-secondary">Role</span>
                                                    <span className="font-semibold">{selectedPlan.role}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-text-secondary">Frequency</span>
                                                    <span className="font-bold text-primary">{selectedPlan.schedule?.frequency}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-text-secondary">Visit Days</span>
                                                    <div className="flex gap-1 justify-end flex-wrap max-w-[150px]">
                                                        {selectedPlan.schedule?.days?.map(d => (
                                                            <span key={d} className="bg-primary text-white px-1.5 py-0.5 rounded text-[10px] font-bold">{d}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8">
                                        <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-4 flex items-center gap-2">
                                            <Store size={18} /> Customers ({selectedPlan.customers?.length || 0})
                                        </h3>
                                        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                            {selectedPlan.customers && selectedPlan.customers.length > 0 ? (
                                                selectedPlan.customers.map(customer => (
                                                    <div key={customer.id} className="p-4 bg-[#F9FAFB] rounded-xl border border-[#EEE] flex justify-between items-center hover:bg-white hover:border-primary transition-all group">
                                                        <div>
                                                            <div className="font-bold text-[15px] group-hover:text-primary transition-colors">{customer.name}</div>
                                                            <div className="text-[13px] text-text-secondary mt-1 flex items-center gap-1.5">
                                                                <MapPin size={12} /> {customer.address}
                                                            </div>
                                                            <div className="flex gap-2 mt-2">
                                                                <span className="text-[10px] bg-white border border-[#DDD] px-1.5 py-0.5 rounded text-text-secondary font-semibold uppercase">{customer.type}</span>
                                                                <span className="text-[10px] bg-white border border-[#DDD] px-1.5 py-0.5 rounded text-text-secondary font-semibold uppercase">ID: {customer.id}</span>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-[11px] text-text-secondary uppercase tracking-tighter">Avg Order</div>
                                                            <div className="font-bold text-text-primary">{customer.avgOrder || 'N/A'}</div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-center py-10 text-text-secondary italic">No customers found for this route.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="modal-footer">
                                    <button className="btn w-full bg-[#919EAB] text-white hover:opacity-90" onClick={() => setSelectedPlan(null)}>Close Details</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default JourneyPlansList;
