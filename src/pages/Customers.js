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
        fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/journey-plans/customers`)
            .then(res => res.json())
            .then(data => setCustomers(data))
            .catch(err => console.log('Error fetching customers:', err));
    }, []);

    const handleSelect = (id) => {
        setSelectedCustomers(prev =>
            prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
        );
    };

    const handleNext = () => {
        navigate('/schedule', { state: { ...location.state, selectedCustomers } });
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
                        className="form-input"
                        placeholder="Search customers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: '300px' }}
                    />
                </div>

                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid #E0E0E0' }}>
                                <th style={{ padding: '12px' }}>Select</th>
                                <th style={{ padding: '12px' }}>Name</th>
                                <th style={{ padding: '12px' }}>Address</th>
                                <th style={{ padding: '12px' }}>Type</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCustomers.map(customer => (
                                <tr key={customer.id} style={{ borderBottom: '1px solid #f4f6f8' }}>
                                    <td style={{ padding: '12px' }}>
                                        <input
                                            type="checkbox"
                                            checked={selectedCustomers.includes(customer.id)}
                                            onChange={() => handleSelect(customer.id)}
                                            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                        />
                                    </td>
                                    <td style={{ padding: '12px' }}>{customer.name}</td>
                                    <td style={{ padding: '12px' }}>{customer.address}</td>
                                    <td style={{ padding: '12px' }}>
                                        <span
                                            style={{
                                                padding: '4px 8px',
                                                background: '#e8f5e9',
                                                color: '#2e7d32',
                                                borderRadius: '4px',
                                                fontSize: '12px',
                                                fontWeight: 600
                                            }}
                                        >
                                            {customer.type}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {filteredCustomers.length === 0 && (
                                <tr>
                                    <td colSpan="4" style={{ padding: '24px', textAlign: 'center', color: '#637381' }}>
                                        No customers found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div style={{ textAlign: 'right', marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
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
