import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Stepper from '../components/Stepper';
import '../App.css';

const Customers = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [customers, setCustomers] = useState([]);
    const [selectedCustomers, setSelectedCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const companyId = location.state?.basicInfo?.company;
        const url = companyId
            ? `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/journey-plans/customers?companyId=${companyId}`
            : `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/journey-plans/customers`;

        fetch(url)
            .then(res => res.json())
            .then(data => setCustomers(data))
            .catch(err => console.log('Error fetching customers:', err));
    }, [location.state]);

    const handleSelect = (id) => {
        setSelectedCustomers(prev =>
            prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
        );
    };

    const handleNext = () => {
        const selectedCustomerObjects = customers.filter(c => selectedCustomers.includes(c.id));
        navigate('/schedule', {
            state: {
                ...location.state,
                selectedCustomers: selectedCustomers, // Keep IDs for backend
                selectedCustomerDetails: selectedCustomerObjects // Extra details for review
            }
        });
    };

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container">
            <Stepper currentStep={2} />

            <div className="card">
                <div className="section-title">
                    <span>Select Customers ({selectedCustomers.length})</span>
                    <input
                        type="text"
                        className="form-input w-[300px]"
                        placeholder="Search customers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="max-h-[400px] overflow-y-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="text-left border-b border-[#E0E0E0]">
                                <th className="p-3">Select</th>
                                <th className="p-3">Name</th>
                                <th className="p-3">Address</th>
                                <th className="p-3">Type</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCustomers.map(customer => (
                                <tr key={customer.id} className="border-b border-bg-main">
                                    <td className="p-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedCustomers.includes(customer.id)}
                                            onChange={() => handleSelect(customer.id)}
                                            className="w-[18px] h-[18px] cursor-pointer"
                                        />
                                    </td>
                                    <td className="p-3">{customer.name}</td>
                                    <td className="p-3">{customer.address}</td>
                                    <td className="p-3">
                                        <span
                                            className="px-2 py-1 bg-[#e8f5e9] text-[#2e7d32] rounded text-[12px] font-semibold"
                                        >
                                            {customer.type}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {filteredCustomers.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="p-6 text-center text-text-secondary">
                                        No customers found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="text-right mt-6 flex justify-end gap-3">
                <button className="btn" onClick={() => navigate(-1)}>
                    Previous
                </button>
                <button className="btn btn-primary" onClick={handleNext} disabled={selectedCustomers.length === 0}>
                    Next Step
                </button>
            </div>
        </div>
    );
};

export default Customers;
