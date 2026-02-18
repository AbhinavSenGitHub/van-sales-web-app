
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Copy, Check, Info, Store, Building2 } from 'lucide-react';
import Stepper from '../components/Stepper';

const Review = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { basicInfo, selectedCustomers, selectedCustomerDetails, schedule } = location.state || {};
    const [copiedId, setCopiedId] = React.useState(null);

    const handleCopy = (text, type) => {
        navigator.clipboard.writeText(text);
        setCopiedId(type);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleSubmit = () => {
        const payload = {
            ...basicInfo,
            customerIds: selectedCustomers,
            schedule,
            status: basicInfo.isActive ? 'Active' : 'Inactive'
        };

        fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/journey-plans`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(data => {
                alert('Journey Plan Created Successfully!');
                navigate('/');
            })
            .catch(err => alert('Error creating plan'));
    };

    if (!basicInfo) return <div className="container">No data to review. Start over.</div>;

    return (
        <div className="container pb-10">
            <Stepper currentStep={4} />

            <div className="card">
                <div className="section-title">
                    <div className="flex items-center gap-2">
                        <Info size={20} className="text-primary" />
                        <span>Route Information</span>
                    </div>
                </div>

                <div className="form-grid">
                    <div className="form-group">
                        <label className="form-label">Route Name</label>
                        <div className="font-semibold">{basicInfo.routeName}</div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Route Code</label>
                        <div className="font-semibold text-text-secondary">{basicInfo.routeCode}</div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Status</label>
                        <span className={`px-2 py-0.5 rounded text-[12px] font-bold ${basicInfo.isActive ? 'text-primary bg-[#E3FBE3]' : 'text-error bg-[#FFF2F1]'}`}>
                            {basicInfo.isActive ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Company</label>
                        <div className="flex items-center gap-2">
                            <div className="font-bold">{basicInfo.companyName}</div>
                            <div className="text-[12px] text-[#919EAB] bg-bg-main px-1.5 py-0.5 rounded flex items-center gap-1">
                                ID: {basicInfo.company}
                                <button
                                    onClick={() => handleCopy(basicInfo.company, 'company')}
                                    className="border-none bg-transparent cursor-pointer p-0.5 text-text-secondary"
                                    title="Copy ID"
                                >
                                    {copiedId === 'company' ? <Check size={12} className="text-primary" /> : <Copy size={12} />}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Assigned To</label>
                        <div className="flex items-center gap-1.5">
                            <Building2 size={16} className="text-text-secondary" />
                            <span>{basicInfo.primaryEmployee}</span>
                            <span className="text-[13px] text-[#919EAB]"> • {basicInfo.role}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="section-title">
                    <div className="flex items-center gap-2">
                        <Store size={20} className="text-primary" />
                        <span>Selected Customers ({selectedCustomerDetails?.length || 0})</span>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    {selectedCustomerDetails && selectedCustomerDetails.map((customer, index) => (
                        <div key={customer.id} className="p-3 bg-[#F9FAFB] rounded-lg border border-bg-main flex justify-between items-center">
                            <div>
                                <div className="font-bold text-[15px]">{customer.name}</div>
                                <div className="text-[13px] text-text-secondary mt-1">
                                    {customer.address} • <span className="text-primary">{customer.type}</span>
                                </div>
                            </div>
                            <div className="text-[11px] text-[#919EAB] bg-white px-2 py-1 rounded border border-[#EEE] flex items-center gap-1.5">
                                ID: {customer.id}
                                <button
                                    onClick={() => handleCopy(customer.id.toString(), `cust-${customer.id}`)}
                                    className="border-none bg-transparent cursor-pointer p-0 text-[#919EAB]"
                                >
                                    {copiedId === `cust-${customer.id}` ? <Check size={12} className="text-primary" /> : <Copy size={12} />}
                                </button>
                            </div>
                        </div>
                    ))}
                    {!selectedCustomerDetails && (
                        <p className="text-[#919EAB]">IDs: {selectedCustomers?.join(', ')}</p>
                    )}
                </div>
            </div>

            <div className="card">
                <div className="section-title">Schedule & Timing</div>
                <div className="form-grid">
                    <div className="form-group">
                        <label className="form-label">Frequency</label>
                        <div className="font-semibold text-primary-dark">{schedule?.frequency}</div>
                    </div>
                    {schedule?.days?.length > 0 && (
                        <div className="form-group">
                            <label className="form-label">Assigned Days</label>
                            <div className="flex gap-1.5 flex-wrap">
                                {schedule.days.map(d => (
                                    <span key={d} className="bg-primary text-white px-2.5 py-0.5 rounded-full text-[12px] font-semibold">
                                        {d}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-8 flex justify-end gap-4">
                <button className="btn min-w-[120px]" onClick={() => navigate(-1)}>
                    Back to Schedule
                </button>
                <button className="btn btn-primary min-w-[160px]" onClick={handleSubmit}>
                    Complete & Submit
                </button>
            </div>
        </div>
    );
};

export default Review;
